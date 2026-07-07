import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Inbox, FileText } from "lucide-react";
import { useBlotters } from "@/hooks/useBlotters";
import { BlotterDetailDialog } from "@/components/BlotterDetailDialog";
import { Button } from "@/app/components/ui/button";
import { listBlotters } from "@/lib/api";
import type { Blotter, BlotterStatus, IncidentType } from "@/types";
import { timeAgo } from "@/types";

// ─── Filter tabs ──────────────────────────────────────────────────────────────

type FilterTab = "all" | BlotterStatus;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "under_review", label: "Under Review" },
  { key: "scheduled_mediation", label: "Scheduled" },
  { key: "resolved", label: "Resolved" },
  { key: "escalated_pnp", label: "Escalated" },
];

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  BlotterStatus,
  { label: string; color: string; bg: string }
> = {
  under_review: { label: "Under Review", color: "#92400e", bg: "#fef3c7" },
  scheduled_mediation: {
    label: "Mediation Scheduled",
    color: "#1e40af",
    bg: "#dbeafe",
  },
  resolved: { label: "Resolved", color: "#166534", bg: "#dcfce7" },
  escalated_pnp: { label: "Escalated to PNP", color: "#991b1b", bg: "#fee2e2" },
};

const INCIDENT_LABELS: Record<IncidentType, string> = {
  noise_complaint: "Noise Complaint",
  property_dispute: "Property Dispute",
  theft: "Theft",
  vandalism: "Vandalism",
  harassment: "Harassment",
  other: "Other",
};

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <div
      className="bg-white rounded-md flex flex-col gap-1 px-4 py-3 flex-1 min-w-[120px]"
      style={{ border: "1px solid #e2e8f0" }}
    >
      <span className="text-xs font-medium text-[#747685] uppercase tracking-wide">
        {label}
      </span>
      <span className="text-[24px] font-semibold leading-tight" style={{ color }}>
        {count}
      </span>
    </div>
  );
}

// ─── Blotter card ─────────────────────────────────────────────────────────────

function BlotterCard({
  blotter,
  selected,
  onView,
}: {
  blotter: Blotter;
  selected: boolean;
  onView: (b: Blotter) => void;
}) {
  const statusCfg = STATUS_CONFIG[blotter.status];
  return (
    <button
      onClick={() => onView(blotter)}
      className={`bg-white rounded-sm p-4 text-left w-full hover:bg-[#f8f9ff] transition-colors ${
        selected ? "ring-2 ring-[#002576]" : ""
      }`}
      style={{ border: "1px solid #e2e8f0" }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-[16px] text-[#0b1c30] truncate">
            {blotter.title}
          </span>
        </div>
        <span
          className="text-[12px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap shrink-0"
          style={{ color: statusCfg.color, backgroundColor: statusCfg.bg }}
        >
          {statusCfg.label}
        </span>
      </div>
      <p className="text-[13px] text-[#444653] mb-1">
        <span className="font-medium">Incident:</span>{" "}
        {INCIDENT_LABELS[blotter.incidentType] ?? blotter.incidentType}
      </p>
      {blotter.location && (
        <p className="text-[13px] text-[#444653] mb-1">
          <span className="font-medium">Location:</span> {blotter.location}
        </p>
      )}
      <p className="text-[13px] text-[#747685] line-clamp-1">
        {blotter.description}
      </p>
      <p className="text-[12px] text-[#747685] mt-1">
        {timeAgo(blotter.createdAt)}
      </p>
    </button>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="bg-white rounded-sm p-4 w-full animate-pulse"
      style={{ border: "1px solid #e2e8f0" }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="h-5 w-2/3 rounded bg-[#e2e8f0]" />
        <div className="h-5 w-20 rounded bg-[#eef2f7]" />
      </div>
      <div className="h-4 w-full rounded bg-[#eef2f7] mb-2" />
      <div className="h-4 w-1/2 rounded bg-[#eef2f7] mb-2" />
      <div className="h-3 w-1/3 rounded bg-[#eef2f7]" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EBlotterPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Blotter | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Stats counts for all statuses
  const [counts, setCounts] = useState<{
    under_review: number;
    scheduled_mediation: number;
    resolved: number;
    escalated_pnp: number;
  }>({
    under_review: 0,
    scheduled_mediation: 0,
    resolved: 0,
    escalated_pnp: 0,
  });

  // Hook fetches the list for the active tab
  const statusParam = activeTab === "all" ? undefined : activeTab;
  const {
    blotters,
    loading,
    error,
    updateStatus,
    scheduleMediation,
    deleteReport,
    refresh,
  } = useBlotters(statusParam);

  // Fetch counts for the stats row (poll alongside)
  const fetchCounts = useCallback(async () => {
    try {
      const [ur, sm, rs, ep] = await Promise.all([
        listBlotters({ status: "under_review", limit: 1 }),
        listBlotters({ status: "scheduled_mediation", limit: 1 }),
        listBlotters({ status: "resolved", limit: 1 }),
        listBlotters({ status: "escalated_pnp", limit: 1 }),
      ]);
      setCounts({
        under_review: ur.total,
        scheduled_mediation: sm.total,
        resolved: rs.total,
        escalated_pnp: ep.total,
      });
    } catch {
      // Silent — counts are non-critical
    }
  }, []);

  useEffect(() => {
    fetchCounts();
    const id = setInterval(fetchCounts, 10_000);
    return () => clearInterval(id);
  }, [fetchCounts]);

  // Search filter (title, incident type, description, location, persons)
  const filtered = useMemo(() => {
    if (!search.trim()) return blotters;
    const q = search.toLowerCase();
    return blotters.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.incidentType.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.location?.toLowerCase().includes(q) ||
        b.personsInvolved?.toLowerCase().includes(q) ||
        b.reportId.toLowerCase().includes(q)
    );
  }, [blotters, search]);

  // Keep the selected blotter in sync with the latest polled data
  useEffect(() => {
    if (!selected) return;
    const updated = blotters.find((b) => b._id === selected._id);
    if (updated && updated !== selected) {
      setSelected(updated);
    } else if (!updated) {
      // Blotter may have been deleted or filtered out by tab change
      setSelected(null);
    }
  }, [blotters, selected]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleView = useCallback((b: Blotter) => {
    setSelected(b);
    setDialogOpen(true);
  }, []);

  const handleUpdated = useCallback(() => {
    refresh();
    fetchCounts();
  }, [refresh, fetchCounts]);

  const handleDeleted = useCallback(() => {
    setSelected(null);
    refresh();
    fetchCounts();
  }, [refresh, fetchCounts]);

  const totalCount =
    counts.under_review +
    counts.scheduled_mediation +
    counts.resolved +
    counts.escalated_pnp;

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6 w-full items-start">
      {/* Page header */}
      <div className="flex flex-col gap-1 w-full shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="size-6 text-[#002576]" />
          <h1 className="font-semibold text-[24px] text-[#0b1c30]">
            e-Blotter Management
          </h1>
        </div>
        <p className="text-[14px] text-[#747685]">
          Manage blotter reports, schedule mediations, and track resolutions.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 w-full shrink-0 flex-wrap">
        <StatCard
          label="Under Review"
          count={counts.under_review}
          color="#92400e"
        />
        <StatCard
          label="Scheduled"
          count={counts.scheduled_mediation}
          color="#1e40af"
        />
        <StatCard label="Resolved" count={counts.resolved} color="#166534" />
        <StatCard
          label="Escalated"
          count={counts.escalated_pnp}
          color="#991b1b"
        />
      </div>

      {/* Filter tabs + search */}
      <div className="flex items-center justify-between gap-3 w-full shrink-0 flex-wrap">
        <div
          className="flex items-center gap-1 rounded-md p-1 bg-[#eff4ff]"
          style={{ border: "1px solid #c4c5d5" }}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            const tabCount =
              tab.key === "all"
                ? totalCount
                : counts[tab.key as keyof typeof counts];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 h-8 px-3 rounded-sm text-[14px] font-medium transition-colors ${
                  active
                    ? "bg-[#002576] text-white"
                    : "text-[#444653] hover:bg-black/5"
                }`}
              >
                {tab.label}
                <span
                  className={`text-[12px] px-1.5 rounded-sm ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-black/5 text-[#747685]"
                  }`}
                >
                  {tabCount}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#747685]" />
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-64 rounded-sm pl-9 pr-3 text-[14px] text-[#0b1c30] bg-white"
            style={{ border: "1px solid #c4c5d5" }}
          />
        </div>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-center justify-center w-full py-16">
          <div className="flex flex-col items-center gap-3 max-w-md text-center">
            <div className="bg-red-100 rounded-full size-12 flex items-center justify-center">
              <span className="text-red-600 text-xl font-bold">!</span>
            </div>
            <p className="text-[#0b1c30] font-semibold text-[16px]">
              Failed to load blotter reports
            </p>
            <p className="text-[#747685] text-[14px]">{error}</p>
            <Button variant="outline" onClick={refresh}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full py-20 gap-3">
          <div className="bg-[#eff4ff] rounded-full size-14 flex items-center justify-center">
            <Inbox className="size-7 text-[#002576]" />
          </div>
          <p className="text-[#0b1c30] font-semibold text-[16px]">
            {search
              ? "No matching blotter reports"
              : activeTab === "all"
                ? "No blotter reports yet"
                : `No ${STATUS_CONFIG[activeTab as BlotterStatus]?.label ?? ""} reports`}
          </p>
          <p className="text-[#747685] text-[14px]">
            {search
              ? "Try a different search term."
              : "Blotter reports filed by residents will appear here."}
          </p>
        </div>
      )}

      {/* Blotter list */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
          {filtered.map((blotter) => (
            <BlotterCard
              key={blotter._id}
              blotter={blotter}
              selected={selected?._id === blotter._id}
              onView={handleView}
            />
          ))}
        </div>
      )}

      {/* Detail dialog */}
      <BlotterDetailDialog
        blotter={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onUpdateStatus={async (id, status, extra) => {
          await updateStatus(id, status, extra);
          handleUpdated();
        }}
        onScheduleMediation={async (id, date, notes) => {
          await scheduleMediation(id, date, notes);
          handleUpdated();
        }}
        onDelete={async (id) => {
          await deleteReport(id);
          handleDeleted();
        }}
      />
    </div>
  );
}
