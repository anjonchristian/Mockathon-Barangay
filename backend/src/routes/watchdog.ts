import { Router, Request, Response } from "express";
import { MissedCallLog } from "../models/MissedCallLog.js";

const router = Router();

// POST /api/watchdog/missed-call — Log a missed call
router.post("/missed-call", async (req: Request, res: Response) => {
  try {
    const { firebaseUid, requestedAt } = req.body;

    if (!firebaseUid || !requestedAt) {
      res.status(400).json({ success: false, error: "Missing required fields: firebaseUid, requestedAt" });
      return;
    }

    const log = await MissedCallLog.create({
      firebaseUid,
      requestedAt: new Date(requestedAt),
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    console.error("Missed call log error:", error);
    res.status(500).json({ success: false, error: "Failed to log missed call" });
  }
});

// GET /api/watchdog/missed-calls — List missed calls
router.get("/missed-calls", async (_req: Request, res: Response) => {
  try {
    const logs = await MissedCallLog.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({ success: true, data: logs });
  } catch (error) {
    console.error("List missed calls error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch missed calls" });
  }
});

export default router;
