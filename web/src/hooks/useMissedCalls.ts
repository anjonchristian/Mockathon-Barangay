import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  listMissedCalls,
  extractErrorMessage,
} from "@/lib/api";
import type { MissedCallDisplay } from "@/types";
import { timeAgo } from "@/types";
import { MISSED_CALLS_POLL_INTERVAL } from "@/lib/constants";

export function useMissedCalls() {
  const [calls, setCalls] = useState<MissedCallDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      const logs = await listMissedCalls();
      const display: MissedCallDisplay[] = logs.map((log) => ({
        id: log._id,
        name: log.firebaseUid, // Fallback — real name comes from request association
        timeAgo: timeAgo(log.createdAt),
        callbackDone: false,
      }));
      setCalls(display);
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, MISSED_CALLS_POLL_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchAll]);

  /** Mark a missed call as having been called back */
  const handleCallBack = useCallback((id: string) => {
    setCalls((prev) =>
      prev.map((c) => (c.id === id ? { ...c, callbackDone: true } : c))
    );
    const call = calls.find((c) => c.id === id);
    toast.success(`Calling back ${call?.name ?? "resident"}…`, {
      description: "Starting video call",
    });
  }, [calls]);

  return {
    calls,
    loading,
    error,
    handleCallBack,
    refetch: fetchAll,
  };
}
