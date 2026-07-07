import { Router, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import { Blotter } from "../models/Blotter.js";

const router = Router();

const VALID_INCIDENT_TYPES = [
  "noise_complaint",
  "property_dispute",
  "theft",
  "vandalism",
  "harassment",
  "other",
];

const VALID_STATUSES = [
  "under_review",
  "scheduled_mediation",
  "resolved",
  "escalated_pnp",
];

// Rate limiter for blotter creation: 5 requests / minute / IP (prevent spam)
const blotterCreateRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.setHeader("Retry-After", "60");
    res.status(429).json({
      success: false,
      error:
        "Too many blotter submissions. Please wait a minute before submitting another report.",
    });
  },
  skip: () => false,
});

// POST /api/blotter - Create new blotter report (from mobile app)
router.post("/", blotterCreateRateLimiter, async (req: Request, res: Response) => {
  try {
    const {
      firebaseUid,
      incidentType,
      title,
      description,
      location,
      personsInvolved,
      evidencePhotos,
      barangayCode,
      barangayName,
      cityMunicipalityCode,
      cityMunicipalityName,
    } = req.body;

    // Validate required fields
    if (
      !firebaseUid ||
      !incidentType ||
      !title ||
      !description ||
      !barangayCode ||
      !barangayName ||
      !cityMunicipalityCode ||
      !cityMunicipalityName
    ) {
      res.status(400).json({ success: false, error: "Missing required fields" });
      return;
    }

    if (!VALID_INCIDENT_TYPES.includes(incidentType)) {
      res
        .status(400)
        .json({ success: false, error: "Invalid incidentType value" });
      return;
    }

    if (typeof title !== "string" || title.trim().length === 0) {
      res.status(400).json({ success: false, error: "Title is required" });
      return;
    }

    if (typeof description !== "string" || description.trim().length === 0) {
      res
        .status(400)
        .json({ success: false, error: "Description is required" });
      return;
    }

    // Validate optional evidencePhotos if provided
    let photos: string[] = [];
    if (evidencePhotos !== undefined) {
      if (!Array.isArray(evidencePhotos)) {
        res
          .status(400)
          .json({ success: false, error: "evidencePhotos must be an array" });
        return;
      }
      photos = evidencePhotos.filter((p: unknown) => typeof p === "string");
    }

    const blotter = await Blotter.create({
      firebaseUid,
      incidentType,
      title,
      description,
      location: location || "",
      personsInvolved: personsInvolved || "",
      evidencePhotos: photos,
      status: "under_review",
      barangayCode,
      barangayName,
      cityMunicipalityCode,
      cityMunicipalityName,
    });

    res.status(201).json({ success: true, data: blotter });
  } catch (error) {
    console.error("Create blotter error:", error);
    res.status(500).json({ success: false, error: "Failed to create blotter report" });
  }
});

// GET /api/blotter - List blotter reports (for web dashboard)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, page = "1", limit = "20", firebaseUid } = req.query;
    const filter: Record<string, unknown> = {};

    if (status && VALID_STATUSES.includes(status as string)) {
      filter.status = status;
    }

    if (firebaseUid && typeof firebaseUid === "string") {
      filter.firebaseUid = firebaseUid;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      Blotter.find(filter)
        .select("-evidencePhotos") // Exclude large base64 from list response
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Blotter.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error("List blotter error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch blotter reports" });
  }
});

// GET /api/blotter/user/:firebaseUid - Get blotter reports for a specific user (mobile app)
router.get("/user/:firebaseUid", async (req: Request, res: Response) => {
  try {
    const { firebaseUid } = req.params;

    const blotters = await Blotter.find({ firebaseUid })
      .select("-evidencePhotos")
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: blotters });
  } catch (error) {
    console.error("Get user blotters error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch user blotter reports" });
  }
});

// GET /api/blotter/:id - Get single blotter report by _id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const blotter = await Blotter.findById(req.params.id).lean();

    if (!blotter) {
      res.status(404).json({ success: false, error: "Blotter report not found" });
      return;
    }

    res.json({ success: true, data: blotter });
  } catch (error) {
    console.error("Get blotter error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch blotter report" });
  }
});

// PATCH /api/blotter/:id - Update blotter status (from web dashboard)
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { status, mediationDate, mediationNotes, staffNotes, resolutionNotes } =
      req.body;

    if (status && !VALID_STATUSES.includes(status)) {
      res.status(400).json({ success: false, error: "Invalid status value" });
      return;
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) updateData.status = status;
    if (mediationDate !== undefined) updateData.mediationDate = mediationDate;
    if (mediationNotes !== undefined) updateData.mediationNotes = mediationNotes;
    if (staffNotes !== undefined) updateData.staffNotes = staffNotes;
    if (resolutionNotes !== undefined) updateData.resolutionNotes = resolutionNotes;

    const blotter = await Blotter.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!blotter) {
      res.status(404).json({ success: false, error: "Blotter report not found" });
      return;
    }

    res.json({ success: true, data: blotter });
  } catch (error) {
    console.error("Update blotter error:", error);
    res.status(500).json({ success: false, error: "Failed to update blotter report" });
  }
});

// DELETE /api/blotter/:id - Delete blotter report (admin only)
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const blotter = await Blotter.findByIdAndDelete(req.params.id);

    if (!blotter) {
      res.status(404).json({ success: false, error: "Blotter report not found" });
      return;
    }

    res.json({
      success: true,
      message: "Blotter report deleted successfully",
      data: { reportId: blotter.reportId },
    });
  } catch (error) {
    console.error("Delete blotter error:", error);
    res.status(500).json({ success: false, error: "Failed to delete blotter report" });
  }
});

export default router;
