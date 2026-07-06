import { useState, useEffect, useCallback } from "react";
import { KanbanColumn } from "./components/KanbanColumn";
import { MissedCallsPanel } from "./components/MissedCallsPanel";
import { fetchRequests, type BarangayIDRequest, updateRequestStatus } from "./lib/api";
import { Loader2, AlertCircle } from "lucide-react";

function App() {
  const [requests, setRequests] = useState<BarangayIDRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMissedCalls, setShowMissedCalls] = useState(false);

  const loadRequests = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchRequests();
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
    // Poll every 5 seconds
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, [loadRequests]);

  const handleStatusChange = async (id: string, status: "approved" | "rejected", notes?: string) => {
    try {
      await updateRequestStatus(id, status, notes);
      await loadRequests(); // Immediate refresh
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending_review");
  const approvedRequests = requests.filter((r) => r.status === "approved");
  const rejectedRequests = requests.filter((r) => r.status === "rejected");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">e-Kap Admin</h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {pendingRequests.length} pending
          </span>
        </div>
        <button
          onClick={() => setShowMissedCalls(!showMissedCalls)}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          {showMissedCalls ? "Hide" : "Show"} Missed Calls
        </button>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto font-medium hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Missed calls panel */}
      {showMissedCalls && (
        <div className="border-b border-gray-200">
          <MissedCallsPanel />
        </div>
      )}

      {/* Main content */}
      <main className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <KanbanColumn
              title="Pending Review"
              status="pending_review"
              requests={pendingRequests}
              onStatusChange={handleStatusChange}
            />
            <KanbanColumn
              title="Approved"
              status="approved"
              requests={approvedRequests}
              onStatusChange={handleStatusChange}
            />
            <KanbanColumn
              title="Rejected"
              status="rejected"
              requests={rejectedRequests}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
