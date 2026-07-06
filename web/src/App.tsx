import { useState, useEffect, useCallback } from "react";
import { KanbanColumn } from "./components/KanbanColumn";
import { MissedCallsPanel } from "./components/MissedCallsPanel";
import { Toaster } from "./components/ui/sonner";
import { Skeleton } from "./components/ui/skeleton";
import { Button } from "./components/ui/button";
import { fetchRequests, type BarangayIDRequest, updateRequestStatus } from "./lib/api";
import { Loader2, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";

function LoadingSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {[1, 2, 3].map((col) => (
        <div key={col} className="flex-1 min-w-0 flex flex-col gap-3">
          <Skeleton className="h-8 w-32" />
          {[1, 2, 3].map((card) => (
            <div key={card} className="rounded-lg border p-4 flex flex-col gap-3">
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
    <div className="min-h-screen bg-background">
      <Toaster />
      {/* Top navbar */}
      <header className="bg-card border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-foreground">e-Kap Admin</h1>
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {loading ? "..." : `${pendingRequests.length} pending`}
          </span>
        </div>
        <Button
          variant="link"
          onClick={() => setShowMissedCalls(!showMissedCalls)}
        >
          {showMissedCalls ? "Hide" : "Show"} Missed Calls
        </Button>
      </header>

      {/* Error banner */}
      {error && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-3 flex items-center gap-2 text-destructive text-sm">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setError(null)}
            className="ml-auto h-auto py-0.5"
          >
            <X className="size-3.5" />
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
      )}

      {/* Missed calls panel */}
      {showMissedCalls && (
        <div className="border-b border-border">
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
