import { useState, useEffect } from "react";
import { fetchMissedCalls, MissedCallEntry } from "../lib/api";
import { Loader2, PhoneMissed } from "lucide-react";

export function MissedCallsPanel() {
  const [missedCalls, setMissedCalls] = useState<MissedCallEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchMissedCalls();
        setMissedCalls(data);
      } catch {
        // Silently fail - this is non-critical
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (missedCalls.length === 0) {
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
        Missed Calls ({missedCalls.length})
      </h3>
      <ul className="space-y-1">
        {missedCalls.map((call) => (
          <li key={call._id} className="text-sm text-gray-600">
            {new Date(call.requestedAt).toLocaleString()} — UID: {call.firebaseUid.slice(0, 8)}...
          </li>
        ))}
      </ul>
    </div>
  );
}
