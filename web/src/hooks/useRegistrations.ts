import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  listRegistrations,
  verifyRegistration,
  extractErrorMessage,
} from "@/lib/api";
import type { Registration, VerificationStatus } from "@/types";
import { POLL_INTERVAL } from "@/lib/constants";

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useRegistrations
 *
 * Fetches citizen registrations and exposes approve/reject mutations with
 * optimistic updates. Polls every POLL_INTERVAL ms (5s) like useRequests.
 *
 * By default it fetches pending registrations on mount. Pass an explicit
 * `status` to track a different tab.
 */
export function useRegistrations(status?: VerificationStatus) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch registrations for the current status filter
  const fetchAll = useCallback(async () => {
    try {
      const res = await listRegistrations({ status, limit: 100 });
      // Sort: newest first by createdAt
      const sorted = [...res.data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setRegistrations(sorted);
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

  /** Approve a registration (optimistically removes from pending list) */
  const approve = useCallback(async (firebaseUid: string) => {
    const previous = registrations;
    // Optimistic removal — approved items leave the pending view
    setRegistrations((prev) => prev.filter((r) => r.firebaseUid !== firebaseUid));
    try {
      await verifyRegistration(firebaseUid, { status: "approved" });
      toast.success("Citizen verified and approved");
    } catch (err) {
      // Rollback
      setRegistrations(previous);
      toast.error(extractErrorMessage(err));
    }
  }, [registrations]);

  /** Reject a registration (optimistically removes from pending list) */
  const reject = useCallback(async (firebaseUid: string, notes?: string) => {
    const previous = registrations;
    // Optimistic removal
    setRegistrations((prev) => prev.filter((r) => r.firebaseUid !== firebaseUid));
    try {
      await verifyRegistration(firebaseUid, { status: "rejected", notes });
      toast.success("Registration rejected");
    } catch (err) {
      // Rollback
      setRegistrations(previous);
      toast.error(extractErrorMessage(err));
    }
  }, [registrations]);

  return {
    registrations,
    loading,
    error,
    approve,
    reject,
    refresh: fetchAll,
  };
}
