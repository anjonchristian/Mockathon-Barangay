import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  listRequests,
  updateRequest,
  extractErrorMessage,
  type BarangayIDRequest,
} from "@/lib/api";
import type { KanbanCard } from "@/types";
import { timeAgo, getDocTypeColor } from "@/types";
import { POLL_INTERVAL } from "@/lib/constants";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Map a backend API request to a frontend KanbanCard.
 *   pending_review → pending  (shows Approve/Reject buttons)
 *   approved       → processing (read-only, shown in Pending column)
 *   rejected       → filtered out (not shown in board)
 */
function dtoToCard(dto: BarangayIDRequest): KanbanCard {
  return {
    id: dto._id,
    fullName: dto.fullName,
    docType: "Barangay ID", // All MVP requests are Barangay ID
    dotColor: getDocTypeColor("Barangay ID"),
    timeAgo: timeAgo(dto.createdAt),
    status: dto.status === "pending_review" ? "pending" : "processing",
    photoBase64: dto.idPhotoBase64,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRequests() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch pending + approved (processing) requests
  const fetchAll = useCallback(async () => {
    try {
      // Fetch both statuses in parallel
      const [pendingRes, approvedRes] = await Promise.all([
        listRequests({ status: "pending_review", limit: 50 }),
        listRequests({ status: "approved", limit: 50 }),
      ]);

      const allCards = [
        ...pendingRes.data.map(dtoToCard),
        ...approvedRes.data.map((d) => ({ ...dtoToCard(d), status: "processing" as const })),
      ];
      // Sort: newest first
      allCards.sort((a, b) => b.timeAgo.localeCompare(a.timeAgo));

      setCards(allCards);
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

  /** Approve a request (moves to processing) */
  const approve = useCallback(async (id: string) => {
    // Optimistic update
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "processing" as const } : c))
    );
    try {
      await updateRequest(id, { status: "approved" });
      toast.success("Request approved");
    } catch (err) {
      // Rollback
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "pending" as const } : c))
      );
      toast.error(extractErrorMessage(err));
    }
  }, []);

  /** Reject a request (removes from board) */
  const reject = useCallback(async (id: string) => {
    // Optimistic removal
    const previous = cards;
    setCards((prev) => prev.filter((c) => c.id !== id));
    try {
      await updateRequest(id, { status: "rejected" });
      toast.error("Request rejected");
    } catch (err) {
      // Rollback to previous state
      setCards(previous);
      toast.error(extractErrorMessage(err));
    }
  }, [cards]);

  /** Mark a document as claimed (removes from board) */
  const markClaimed = useCallback(async (id: string) => {
    // Optimistic removal
    setCards((prev) => prev.filter((c) => c.id !== id));
    try {
      await updateRequest(id, { status: "rejected" }); // placeholder
      toast.success("Document marked as claimed");
    } catch (err) {
      toast.error(extractErrorMessage(err));
    }
  }, []);

  return {
    cards,
    loading,
    error,
    approve,
    reject,
    markClaimed,
    refetch: fetchAll,
  };
}
