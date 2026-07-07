import { Router, Request, Response } from "express";
import { User } from "../models/User.js";
import { BarangayIDRequest } from "../models/BarangayIDRequest.js";
import { Blotter } from "../models/Blotter.js";
import { MissedCallLog } from "../models/MissedCallLog.js";
import { Staff } from "../models/Staff.js";

const router = Router();

/**
 * Helper: build a date `days` ago at the start of that day.
 */
function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * GET /api/analytics/overview
 *
 * Aggregates real counts across the major collections:
 *   - Registrations by verification status (pending/approved/rejected)
 *   - Document requests by status
 *     (pending_review/processing/approved/completed/rejected)
 *   - Blotter reports by status
 *     (under_review/scheduled_mediation/resolved/escalated_pnp)
 *   - Missed calls (total count)
 *   - Average processing time for completed/approved requests
 *   - Daily counts for the last 7 days (registrations, requests, blotters)
 */
router.get("/overview", async (_req: Request, res: Response) => {
  try {
    // ── Registrations by verification status ──────────────────────────────
    const registrationsByStatus = await User.aggregate<{
      _id: string | null;
      count: number;
    }>([{ $group: { _id: "$verificationStatus", count: { $sum: 1 } } }]);

    const registrationCounts: Record<string, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };
    for (const r of registrationsByStatus) {
      if (r._id && registrationCounts[r._id] !== undefined) {
        registrationCounts[r._id] = r.count;
      }
    }

    // ── Document requests by status ───────────────────────────────────────
    const requestsByStatus = await BarangayIDRequest.aggregate<{
      _id: string | null;
      count: number;
    }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

    const requestCounts: Record<string, number> = {
      pending_review: 0,
      processing: 0,
      approved: 0,
      completed: 0,
      rejected: 0,
    };
    for (const r of requestsByStatus) {
      if (r._id && requestCounts[r._id] !== undefined) {
        requestCounts[r._id] = r.count;
      }
    }

    // ── Blotter reports by status ─────────────────────────────────────────
    const blottersByStatus = await Blotter.aggregate<{
      _id: string | null;
      count: number;
    }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

    const blotterCounts: Record<string, number> = {
      under_review: 0,
      scheduled_mediation: 0,
      resolved: 0,
      escalated_pnp: 0,
    };
    for (const b of blottersByStatus) {
      if (b._id && blotterCounts[b._id] !== undefined) {
        blotterCounts[b._id] = b.count;
      }
    }

    // ── Missed calls total ────────────────────────────────────────────────
    const totalMissedCalls = await MissedCallLog.countDocuments();

    // ── Average processing time ───────────────────────────────────────────
    // For requests that reached "approved" or "completed", measure the time
    // between createdAt and updatedAt (a rough proxy for processing time).
    const processingAgg = await BarangayIDRequest.aggregate<{
      avgMs: number | null;
    }>([
      {
        $match: { status: { $in: ["approved", "completed"] } },
      },
      {
        $group: {
          _id: null,
          avgMs: {
            $avg: { $subtract: ["$updatedAt", "$createdAt"] },
          },
        },
      },
    ]);
    const avgProcessingMs = processingAgg[0]?.avgMs ?? null;
    const avgProcessingTimeHours =
      avgProcessingMs !== null ? avgProcessingMs / (1000 * 60 * 60) : null;

    // ── Daily counts for the last 7 days ──────────────────────────────────
    const sevenDaysAgo = daysAgo(7);
    const dailyRegistrations = await User.aggregate<{
      _id: string;
      count: number;
    }>([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);
    const dailyRequests = await BarangayIDRequest.aggregate<{
      _id: string;
      count: number;
    }>([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);
    const dailyBlotters = await Blotter.aggregate<{
      _id: string;
      count: number;
    }>([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
    ]);

    // Build a 7-day array (oldest → newest) with zero defaults.
    const daily: Array<{
      date: string;
      registrations: number;
      requests: number;
      blotters: number;
    }> = [];
    const regMap = new Map(dailyRegistrations.map((d) => [d._id, d.count]));
    const reqMap = new Map(dailyRequests.map((d) => [d._id, d.count]));
    const blotMap = new Map(dailyBlotters.map((d) => [d._id, d.count]));
    for (let i = 6; i >= 0; i--) {
      const d = daysAgo(i);
      const key = d.toISOString().slice(0, 10);
      daily.push({
        date: key,
        registrations: regMap.get(key) ?? 0,
        requests: reqMap.get(key) ?? 0,
        blotters: blotMap.get(key) ?? 0,
      });
    }

    res.json({
      success: true,
      data: {
        registrations: registrationCounts,
        requests: requestCounts,
        blotters: blotterCounts,
        totalMissedCalls,
        avgProcessingTimeHours,
        daily,
      },
    });
  } catch (error) {
    console.error("Analytics overview error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch analytics overview" });
  }
});

/**
 * GET /api/analytics/staff-performance
 *
 * Returns per-staff metrics (optional / best-effort). Currently returns the
 * list of active staff with their lastLoginAt so the dashboard can display
 * availability. A fuller implementation would join staff IDs to the requests
 * they processed — left as a future enhancement.
 */
router.get("/staff-performance", async (_req: Request, res: Response) => {
  try {
    const staff = await Staff.find().lean();
    res.json({ success: true, data: staff });
  } catch (error) {
    console.error("Staff performance error:", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to fetch staff performance" });
  }
});

export default router;
