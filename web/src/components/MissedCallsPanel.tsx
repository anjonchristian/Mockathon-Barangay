import { useState, useEffect } from "react";
import { fetchMissedCalls, type MissedCallEntry } from "../lib/api";
import { Loader2, PhoneMissed, X } from "lucide-react";
import { Button } from "./ui/button";

export function MissedCallsPanel() {
  const [missedCalls, setMissedCalls] = useState<MissedCallEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMissedCalls();
        setMissedCalls(data);
      } catch {
        // Silently fail - non-critical
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const visibleCalls = missedCalls.filter((c) => !dismissed.has(c._id));

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (visibleCalls.length === 0) {
    return (
      <div className="px-6 py-4 text-sm text-gray-500 flex items-center gap-2">
        <PhoneMissed className="w-4 h-4" />
        No missed calls
      </div>
    );
  }

  return (
    <div className="px-6 py-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <PhoneMissed className="w-4 h-4" />
        Missed Calls ({visibleCalls.length})
      </h3>
      <ul className="space-y-2">
        {visibleCalls.map((call) => (
          <li
            key={call._id}
            className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 rounded px-3 py-2"
          >
            <span>
              {new Date(call.requestedAt).toLocaleString()} — UID:{" "}
              {call.firebaseUid.slice(0, 8)}...
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDismissed((prev) => new Set(prev).add(call._id))}
              className="h-6 w-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
