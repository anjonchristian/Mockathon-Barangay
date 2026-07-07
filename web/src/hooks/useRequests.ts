import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  listRequests,
  updateRequest,
  extractErrorMessage,
  type BarangayIDRequest,
  type RequestStatus,
} from "@/lib/api";
import type { KanbanCard, KanbanStatus } from "@/types";
import { timeAgo, getDocTypeColor } from "@/types";
import { POLL_INTERVAL } from "@/lib/constants";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Map a backend API request status to a frontend Kanban column status.
 *   pending_review → pending      (Pending Review column)
 *   processing     → processing   (Processing column)
 *   approved       → pickup       (Ready for Pickup column)
 *   completed      → completed    (Completed column)
 *   rejected       → filtered out (not shown on the board)
 */
function statusToKanban(status: RequestStatus): KanbanStatus | null {
  switch (status) {
    case "pending_review":
      return "pending";
    case "processing":
      return "processing";
    case "approved":
      return "pickup";
    case "completed":
      return "completed";
    default:
      return null;
  }
}

/**
 * Map a backend API request to a frontend KanbanCard.
 */
function dtoToCard(dto: BarangayIDRequest): KanbanCard | null {
  const kanbanStatus = statusToKanban(dto.status);
  if (!kanbanStatus) return null;
  return {
    id: dto._id,
    fullName: dto.fullName,
    docType: "Barangay ID", // All MVP requests are Barangay ID
    dotColor: getDocTypeColor("Barangay ID"),
    timeAgo: timeAgo(dto.createdAt),
    status: kanbanStatus,
    photoBase64: dto.idPhotoBase64,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useRequests() {
  const [cards, setCards] = useState<KanbanCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch all four board statuses in parallel
  const fetchAll = useCallback(async () => {
    try {
      const [pendingRes, processingRes, approvedRes, completedRes] =
        await Promise.all([
          listRequests({ status: "pending_review", limit: 50 }),
          listRequests({ status: "processing", limit: 50 }),
          listRequests({ status: "approved", limit: 50 }),
          listRequests({ status: "completed", limit: 50 }),
        ]);

      const allCards: KanbanCard[] = [
        ...pendingRes.data.map(dtoToCard),
        ...processingRes.data.map(dtoToCard),
        ...approvedRes.data.map(dtoToCard),
        ...completedRes.data.map(dtoToCard),
      ].filter((c): c is KanbanCard => c !== null);

      // Sort: newest first (largest timeAgo bucket first is unreliable, so
      // we re-sort by createdAt-derived ordering — but dtoToCard drops the
      // raw date. The backend already returns each group sorted newest-first,
      // and the groups themselves are ordered pending → completed, which is
      // acceptable for display. We keep a stable order here.)
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

  /**
   * Approve a request: pending_review → processing.
   * Moves the card from the Pending Review column to the Processing column.
   */
  const approve = useCallback(async (id: string) => {
    const previous = cards;
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "processing" as const } : c
      )
    );
    try {
      await updateRequest(id, { status: "processing" });
      toast.success("Request approved — now processing");
    } catch (err) {
      setCards(previous);
      toast.error(extractErrorMessage(err));
    }
  }, [cards]);

  /** Reject a request (removes from board) */
  const reject = useCallback(async (id: string) => {
    const previous = cards;
    setCards((prev) => prev.filter((c) => c.id !== id));
    try {
      await updateRequest(id, { status: "rejected" });
      toast.error("Request rejected");
    } catch (err) {
      setCards(previous);
      toast.error(extractErrorMessage(err));
    }
  }, [cards]);

  /**
   * Mark a request ready for pickup: processing → approved.
   * Moves the card from the Processing column to the Ready for Pickup column.
   */
  const markReadyForPickup = useCallback(async (id: string) => {
    const previous = cards;
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "pickup" as const } : c))
    );
    try {
      await updateRequest(id, { status: "approved" });
      toast.success("Marked ready for pickup");
    } catch (err) {
      setCards(previous);
      toast.error(extractErrorMessage(err));
    }
  }, [cards]);

  /**
   * Mark a document as completed/claimed: approved → completed.
   * Moves the card from the Ready for Pickup column to the Completed column.
   */
  const markCompleted = useCallback(async (id: string) => {
    const previous = cards;
    setCards((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "completed" as const } : c
      )
    );
    try {
      await updateRequest(id, { status: "completed" });
      toast.success("Document marked as completed");
    } catch (err) {
      setCards(previous);
      toast.error(extractErrorMessage(err));
    }
  }, [cards]);

  return {
    cards,
    loading,
    error,
    approve,
    reject,
    markReadyForPickup,
    markCompleted,
    refetch: fetchAll,
  };
}
