import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  listStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  extractErrorMessage,
  type CreateStaffPayload,
  type UpdateStaffPayload,
} from "@/lib/api";
import type { Staff } from "@/types";
import { POLL_INTERVAL } from "@/lib/constants";

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useStaff
 *
 * Fetches the staff list and exposes create/update/delete mutations with
 * optimistic updates and toast notifications. Polls every POLL_INTERVAL ms.
 */
export function useStaff() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const data = await listStaff();
      // Sort: newest first by createdAt
      const sorted = [...data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setStaff(sorted);
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  // Start polling on mount
  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchAll]);

  // ── Mutations ─────────────────────────────────────────────────────────────

  /** Create a new staff member */
  const addStaff = useCallback(
    async (payload: CreateStaffPayload) => {
      try {
        const created = await createStaff(payload);
        setStaff((prev) => [created, ...prev]);
        toast.success("Staff member added");
      } catch (err) {
        toast.error(extractErrorMessage(err));
        throw err;
      }
    },
    []
  );

  /** Update an existing staff member */
  const editStaff = useCallback(
    async (id: string, payload: UpdateStaffPayload) => {
      const previous = staff;
      // Optimistic update
      setStaff((prev) =>
        prev.map((s) => (s._id === id ? { ...s, ...payload } : s))
      );
      try {
        const updated = await updateStaff(id, payload);
        setStaff((prev) => prev.map((s) => (s._id === id ? updated : s)));
        toast.success("Staff member updated");
      } catch (err) {
        setStaff(previous);
        toast.error(extractErrorMessage(err));
        throw err;
      }
    },
    [staff]
  );

  /** Delete a staff member */
  const removeStaff = useCallback(
    async (id: string) => {
      const previous = staff;
      // Optimistic removal
      setStaff((prev) => prev.filter((s) => s._id !== id));
      try {
        await deleteStaff(id);
        toast.success("Staff member removed");
      } catch (err) {
        setStaff(previous);
        toast.error(extractErrorMessage(err));
        throw err;
      }
    },
    [staff]
  );

  /** Toggle a staff member's active status */
  const toggleActive = useCallback(
    async (id: string) => {
      const target = staff.find((s) => s._id === id);
      if (!target) return;
      const next = !target.isActive;
      const previous = staff;
      setStaff((prev) =>
        prev.map((s) => (s._id === id ? { ...s, isActive: next } : s))
      );
      try {
        await updateStaff(id, { isActive: next });
        toast.success(next ? "Staff marked available" : "Staff marked offline");
      } catch (err) {
        setStaff(previous);
        toast.error(extractErrorMessage(err));
      }
    },
    [staff]
  );

  return {
    staff,
    loading,
    error,
    addStaff,
    editStaff,
    removeStaff,
    toggleActive,
    refetch: fetchAll,
  };
}
