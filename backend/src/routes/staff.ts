import { Router, Request, Response } from "express";
import { Staff, type StaffRole } from "../models/Staff.js";

const router = Router();

const VALID_ROLES: StaffRole[] = ["staff", "admin", "captain"];

/**
 * GET /api/staff
 * List all staff members. Optional ?isActive=true filter.
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const filter: Record<string, unknown> = {};

    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }

    const staff = await Staff.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: staff });
  } catch (error) {
    console.error("List staff error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch staff" });
  }
});

/**
 * GET /api/staff/:id
 * Get a single staff member by MongoDB ObjectId.
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findById(req.params.id).lean();

    if (!staff) {
      res.status(404).json({ success: false, error: "Staff member not found" });
      return;
    }

    res.json({ success: true, data: staff });
  } catch (error) {
    console.error("Get staff error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch staff member" });
  }
});

/**
 * POST /api/staff
 * Create a new staff member.
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      firebaseUid,
      email,
      fullName,
      role,
      position,
      barangayCode,
      barangayName,
      cityMunicipalityCode,
      cityMunicipalityName,
      isActive,
      phoneNumber,
    } = req.body;

    if (!email || !fullName) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: email, fullName",
      });
      return;
    }

    if (role && !VALID_ROLES.includes(role)) {
      res.status(400).json({ success: false, error: "Invalid role value" });
      return;
    }

    // Prevent duplicate emails
    const existing = await Staff.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      res.status(409).json({ success: false, error: "Email already in use" });
      return;
    }

    const staff = await Staff.create({
      firebaseUid: firebaseUid || undefined,
      email,
      fullName,
      role: role || "staff",
      position: position || "",
      barangayCode,
      barangayName,
      cityMunicipalityCode,
      cityMunicipalityName,
      isActive: isActive !== undefined ? isActive : true,
      phoneNumber: phoneNumber || "",
    });

    res.status(201).json({ success: true, data: staff });
  } catch (error) {
    console.error("Create staff error:", error);
    res.status(500).json({ success: false, error: "Failed to create staff member" });
  }
});

/**
 * PATCH /api/staff/:id
 * Update a staff member (role, position, isActive, fullName, email, etc.).
 */
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const {
      firebaseUid,
      email,
      fullName,
      role,
      position,
      barangayCode,
      barangayName,
      cityMunicipalityCode,
      cityMunicipalityName,
      isActive,
      phoneNumber,
    } = req.body;

    if (role && !VALID_ROLES.includes(role)) {
      res.status(400).json({ success: false, error: "Invalid role value" });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (firebaseUid !== undefined) updateData.firebaseUid = firebaseUid;
    if (email !== undefined) updateData.email = email;
    if (fullName !== undefined) updateData.fullName = fullName;
    if (role !== undefined) updateData.role = role;
    if (position !== undefined) updateData.position = position;
    if (barangayCode !== undefined) updateData.barangayCode = barangayCode;
    if (barangayName !== undefined) updateData.barangayName = barangayName;
    if (cityMunicipalityCode !== undefined)
      updateData.cityMunicipalityCode = cityMunicipalityCode;
    if (cityMunicipalityName !== undefined)
      updateData.cityMunicipalityName = cityMunicipalityName;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!staff) {
      res.status(404).json({ success: false, error: "Staff member not found" });
      return;
    }

    res.json({ success: true, data: staff });
  } catch (error) {
    console.error("Update staff error:", error);
    res.status(500).json({ success: false, error: "Failed to update staff member" });
  }
});

/**
 * DELETE /api/staff/:id
 * Delete a staff member permanently.
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      res.status(404).json({ success: false, error: "Staff member not found" });
      return;
    }

    res.json({ success: true, data: null });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({ success: false, error: "Failed to delete staff member" });
  }
});

/**
 * POST /api/staff/:id/login
 * Update the lastLoginAt timestamp for a staff member.
 */
router.post("/:id/login", async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      { $set: { lastLoginAt: new Date() } },
      { new: true }
    );

    if (!staff) {
      res.status(404).json({ success: false, error: "Staff member not found" });
      return;
    }

    res.json({ success: true, data: staff });
  } catch (error) {
    console.error("Staff login error:", error);
    res.status(500).json({ success: false, error: "Failed to update login timestamp" });
  }
});

export default router;
