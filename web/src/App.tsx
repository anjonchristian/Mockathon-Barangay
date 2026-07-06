import { useState, useEffect, useCallback } from "react";
import { KanbanColumn } from "./components/KanbanColumn";
import { MissedCallsPanel } from "./components/MissedCallsPanel";
import { Toaster } from "./components/ui/sonner";
import { Skeleton } from "./components/ui/skeleton";
import { fetchRequests, type BarangayIDRequest, updateRequestStatus } from "./lib/api";
import { Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

function LoadingSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {[1, 2, 3].map((col) => (
        <div key={col} className="flex-1 min-w-0 space-y-3">
          <Skeleton className="h-8 w-32" />
          {[1, 2, 3].map((card) => (
            <div key={card} className="rounded-lg border p-4 space-y-3">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

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
      const msg = err instanceof Error ? err.message : "Failed to load requests";
      setError(msg);
      if (!loading) {
        toast.error("Connection error", { description: msg });
      }
    } finally {
      setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, [loadRequests]);

  const handleStatusChange = async (id: string, status: "approved" | "rejected", notes?: string) => {
    try {
      await updateRequestStatus(id, status, notes);
      toast.success(status === "approved" ? "Request approved" : "Request rejected");
      await loadRequests();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      setError(msg);
      toast.error("Update failed", { description: msg });
    }
  };

  const pendingRequests = requests.filter((r) => r.status === "pending_review");
  const approvedRequests = requests.filter((r) => r.status === "approved");
  const rejectedRequests = requests.filter((r) => r.status === "rejected");

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      {/* Top navbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-900">e-Kap Admin</h1>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {loading ? "..." : `${pendingRequests.length} pending`}
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
          <AlertCircle className="w-4 h-4 shrink-0" />
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
          <LoadingSkeleton />
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
