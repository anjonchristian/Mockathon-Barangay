import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  listBlotters,
  updateBlotter,
  deleteBlotter,
  extractErrorMessage,
  type UpdateBlotterPayload,
} from "@/lib/api";
import type { Blotter, BlotterStatus } from "@/types";
import { POLL_INTERVAL } from "@/lib/constants";

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useBlotters
 *
 * Fetches blotter reports and exposes status/mediation/delete mutations
 * with optimistic updates. Polls every POLL_INTERVAL ms (5s) like
 * useRequests and useRegistrations.
 *
 * By default it fetches all blotters on mount. Pass an explicit `status`
 * to filter to a single status.
 */
export function useBlotters(status?: BlotterStatus) {
  const [blotters, setBlotters] = useState<Blotter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch blotters for the current status filter
  const fetchAll = useCallback(async () => {
    try {
      const res = await listBlotters({ status, limit: 100 });
      // Sort: newest first by createdAt
      const sorted = [...res.data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setBlotters(sorted);
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [status]);

  // Start polling on mount / when status changes
  useEffect(() => {
    setLoading(true);
    fetchAll();
    intervalRef.current = setInterval(fetchAll, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchAll]);

  // ── Mutations ─────────────────────────────────────────────────────────────

  /**
   * Update a blotter's status (with optional extra fields like notes).
   * Performs an optimistic update on the local list.
   */
  const updateStatus = useCallback(
    async (id: string, newStatus: BlotterStatus, extra?: UpdateBlotterPayload) => {
      const previous = blotters;
      // Optimistic update
      setBlotters((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, status: newStatus, ...extra } : b
        )
      );
      try {
        await updateBlotter(id, { status: newStatus, ...extra });
        toast.success("Blotter status updated");
      } catch (err) {
        // Rollback
        setBlotters(previous);
        toast.error(extractErrorMessage(err));
      }
    },
    [blotters]
  );

  /**
   * Schedule a mediation session for a blotter. Sets status to
   * scheduled_mediation with the given date and optional notes.
   */
  const scheduleMediation = useCallback(
    async (id: string, date: string, notes?: string) => {
      const previous = blotters;
      const payload: UpdateBlotterPayload = {
        status: "scheduled_mediation",
        mediationDate: date,
        mediationNotes: notes,
      };
      // Optimistic update
      setBlotters((prev) =>
        prev.map((b) => (b._id === id ? { ...b, ...payload } : b))
      );
      try {
        await updateBlotter(id, payload);
        toast.success("Mediation scheduled");
      } catch (err) {
        // Rollback
        setBlotters(previous);
        toast.error(extractErrorMessage(err));
      }
    },
    [blotters]
  );

  /**
   * Delete a blotter report permanently. Optimistically removes it
   * from the local list.
   */
  const deleteReport = useCallback(
    async (id: string) => {
      const previous = blotters;
      // Optimistic removal
      setBlotters((prev) => prev.filter((b) => b._id !== id));
      try {
        await deleteBlotter(id);
        toast.success("Blotter report deleted");
      } catch (err) {
        // Rollback
        setBlotters(previous);
        toast.error(extractErrorMessage(err));
      }
    },
    [blotters]
  );

  return {
    blotters,
    loading,
    error,
    updateStatus,
    scheduleMediation,
    deleteReport,
    refresh: fetchAll,
  };
}
