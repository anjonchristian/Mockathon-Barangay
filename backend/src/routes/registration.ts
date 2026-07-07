import express from "express";
import { User } from "../models/User.js";

const router = express.Router();

export interface RegistrationPayload {
  firebaseUid: string;
  email?: string;
  phoneNumber?: string;
  fullName: string;
  regionCode: string;
  regionName: string;
  provinceCode: string;
  provinceName: string;
  cityMunicipalityCode: string;
  cityMunicipalityName: string;
  cityMunicipalityType: "city" | "municipality";
  barangayCode: string;
  barangayName: string;
  idPhotoBase64: string;
  idType: "national_id" | "barangay_id" | "other";
  idNumber?: string;
  address?: string;
  birthDate?: string;
  gender?: "Male" | "Female" | "Other";
  nationality?: string;
}

/**
 * POST /api/registration
 * Register a new user with location and ID verification
 */
router.post("/", async (req, res) => {
  try {
    const payload: RegistrationPayload = req.body;

    // Validate required fields
    if (
      !payload.firebaseUid ||
      !payload.fullName ||
      !payload.regionCode ||
      !payload.regionName ||
      !payload.provinceCode ||
      !payload.provinceName ||
      !payload.cityMunicipalityCode ||
      !payload.cityMunicipalityName ||
      !payload.cityMunicipalityType ||
      !payload.barangayCode ||
      !payload.barangayName ||
      !payload.idPhotoBase64 ||
      !payload.idType
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Normalize cityMunicipalityType to lowercase (case-insensitive)
    const normalizedType = (payload.cityMunicipalityType || "").toLowerCase();
    if (!["city", "municipality"].includes(normalizedType)) {
      return res.status(400).json({
        success: false,
        error: "Invalid cityMunicipalityType",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ firebaseUid: payload.firebaseUid });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "User already registered",
      });
    }

    // Create new user
    const newUser = new User({
      firebaseUid: payload.firebaseUid,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      fullName: payload.fullName,
      regionCode: payload.regionCode,
      regionName: payload.regionName,
      provinceCode: payload.provinceCode,
      provinceName: payload.provinceName,
      cityMunicipalityCode: payload.cityMunicipalityCode,
      cityMunicipalityName: payload.cityMunicipalityName,
      cityMunicipalityType: normalizedType,
      barangayCode: payload.barangayCode,
      barangayName: payload.barangayName,
      idPhotoBase64: payload.idPhotoBase64,
      idType: payload.idType,
      idNumber: payload.idNumber,
      address: payload.address,
      birthDate: payload.birthDate,
      gender: payload.gender,
      nationality: payload.nationality || "Filipino",
      isVerified: false,
      verificationStatus: "pending",
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      data: {
        userId: newUser._id,
        firebaseUid: newUser.firebaseUid,
        fullName: newUser.fullName,
        location: {
          region: newUser.regionName,
          province: newUser.provinceName,
          cityMunicipality: newUser.cityMunicipalityName,
          barangay: newUser.barangayName,
        },
        verificationStatus: newUser.verificationStatus,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to register user",
    });
  }
});

/**
 * GET /api/registration
 * List all registrations with optional status filter and pagination
 */
router.get("/", async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter: any = {};
    if (status && ["pending", "approved", "rejected"].includes(status as string)) {
      filter.verificationStatus = status;
    }
    const skip = (Number(page) - 1) * Number(limit);
    const users = await User.find(filter)
      .select("-idPhotoBase64") // Exclude large base64 from list
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({
      success: true,
      data: users,
      total,
      page: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    console.error("List registrations error:", error);
    res.status(500).json({ success: false, error: "Failed to list registrations" });
  }
});

/**
 * GET /api/registration/:firebaseUid/photo
 * Fetch just the ID photo for a user
 */
router.get("/:firebaseUid/photo", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.params.firebaseUid }).select("idPhotoBase64");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });
    res.json({ success: true, data: { idPhotoBase64: user.idPhotoBase64 } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch photo" });
  }
});

/**
 * GET /api/registration/:firebaseUid
 * Get user registration status
 */
router.get("/:firebaseUid", async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        userId: user._id,
        firebaseUid: user.firebaseUid,
        fullName: user.fullName,
        location: {
          region: user.regionName,
          province: user.provinceName,
          cityMunicipality: user.cityMunicipalityName,
          barangay: user.barangayName,
        },
        verificationStatus: user.verificationStatus,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Get registration error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch registration status",
    });
  }
});

/**
 * PUT /api/registration/:firebaseUid/verify
 * Update user verification status (for admin use)
 */
router.put("/:firebaseUid/verify", async (req, res) => {
  try {
    const { firebaseUid } = req.params;
    const { status, notes } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    user.verificationStatus = status;
    user.isVerified = status === "approved";
    user.verificationNotes = notes;

    await user.save();

    res.json({
      success: true,
      data: {
        userId: user._id,
        verificationStatus: user.verificationStatus,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Verification update error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update verification status",
    });
  }
});

export default router;
