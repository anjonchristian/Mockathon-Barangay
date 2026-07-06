import { Router, Request, Response } from "express";
import { BarangayIDRequest } from "../models/BarangayIDRequest.js";

const router = Router();

// POST /api/requests — Create a new request
router.post("/", async (req: Request, res: Response) => {
  try {
    const { firebaseUid, fullName, address, birthDate, gender, nationality, idType, idNumber, idPhotoBase64 } = req.body;

    // Validate required fields
    if (!firebaseUid || !fullName || !address || !birthDate || !gender || !idType || !idNumber || !idPhotoBase64) {
      res.status(400).json({ success: false, error: "Missing required fields" });
      return;
    }

    if (!["Male", "Female", "Other"].includes(gender)) {
      res.status(400).json({ success: false, error: "Invalid gender value" });
      return;
    }

    if (!["national_id", "barangay_id"].includes(idType)) {
      res.status(400).json({ success: false, error: "Invalid idType value" });
      return;
    }

    const request = await BarangayIDRequest.create({
      firebaseUid,
      fullName,
      address,
      birthDate,
      gender,
      nationality: nationality || "Filipino",
      idType,
      idNumber,
      idPhotoBase64,
      status: "pending_review",
    });

    res.status(201).json({ success: true, data: request });
  } catch (error) {
    console.error("Create request error:", error);
    res.status(500).json({ success: false, error: "Failed to create request" });
  }
});

// GET /api/requests — List requests with optional status filter and pagination
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, page = "1", limit = "20" } = req.query;
    const filter: Record<string, unknown> = {};

    if (status && ["pending_review", "approved", "rejected"].includes(status as string)) {
      filter.status = status;
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit as string, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [data, total] = await Promise.all([
      BarangayIDRequest.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      BarangayIDRequest.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data,
      total,
      page: pageNum,
      limit: limitNum,
    });
  } catch (error) {
    console.error("List requests error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch requests" });
  }
});

// GET /api/requests/:id — Get single request
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const request = await BarangayIDRequest.findById(req.params.id).lean();

    if (!request) {
      res.status(404).json({ success: false, error: "Request not found" });
      return;
    }

    res.json({ success: true, data: request });
  } catch (error) {
    console.error("Get request error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch request" });
  }
});

// PATCH /api/requests/:id — Update request status (approve/reject)
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { status, staffNotes } = req.body;

    if (!status || !["approved", "rejected"].includes(status)) {
      res.status(400).json({ success: false, error: "Invalid status. Must be 'approved' or 'rejected'" });
      return;
    }

    const updateData: Record<string, unknown> = { status };
    if (staffNotes !== undefined) {
      updateData.staffNotes = staffNotes;
    }

    const request = await BarangayIDRequest.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!request) {
      res.status(404).json({ success: false, error: "Request not found" });
      return;
    }

    res.json({ success: true, data: request });
  } catch (error) {
    console.error("Update request error:", error);
    res.status(500).json({ success: false, error: "Failed to update request" });
  }
});

export default router;
