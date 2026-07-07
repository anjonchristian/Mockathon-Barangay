import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, UserCheck, Check, X, Eye, Inbox } from "lucide-react";
import { useRegistrations } from "@/hooks/useRegistrations";
import { RegistrationDetailDialog } from "@/components/RegistrationDetailDialog";
import { Button } from "@/app/components/ui/button";
import { listRegistrations } from "@/lib/api";
import type { Registration, VerificationStatus } from "@/types";
import { timeAgo } from "@/types";

// ─── Filter tabs ──────────────────────────────────────────────────────────────

type FilterTab = "all" | VerificationStatus;

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: VerificationStatus }) {
  const config: Record<
    VerificationStatus,
    { label: string; bg: string; text: string }
  > = {
    pending: { label: "Pending", bg: "#fffbeb", text: "#b45309" },
    approved: { label: "Approved", bg: "#f0fdf4", text: "#15803d" },
    rejected: { label: "Rejected", bg: "#fef2f2", text: "#b91c1c" },
  };
  const c = config[status];
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  );
}

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

// ─── Registration card ────────────────────────────────────────────────────────

function RegistrationCard({
  registration,
  onView,
  onApprove,
  onReject,
}: {
  registration: Registration;
  onView: (r: Registration) => void;
  onApprove: (uid: string) => void;
  onReject: (uid: string) => void;
}) {
  const isPending = registration.verificationStatus === "pending";
  const location = [
    registration.barangayName,
    registration.cityMunicipalityName,
    registration.provinceName,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className="bg-white rounded-md flex flex-col gap-3 p-4 w-full"
      style={{ border: "1px solid #e2e8f0" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 w-full">
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className="font-semibold text-[18px] text-[#0b1c30] leading-tight truncate">
            {registration.fullName}
          </p>
          <p className="text-[13px] text-[#444653] truncate">{location}</p>
          <p className="text-[13px] text-[#747685]">
            {registration.idType}
            {registration.idNumber ? ` - ${registration.idNumber}` : ""}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <StatusBadge status={registration.verificationStatus} />
          <span className="text-[12px] text-[#747685] whitespace-nowrap">
            {timeAgo(registration.createdAt)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 w-full">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onView(registration)}
          className="flex-1 h-9"
        >
          <Eye className="size-4" />
          View Details
        </Button>
        {isPending && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(registration.firebaseUid)}
              className="h-9 text-[#dc2626] border-[#dc2626] hover:bg-[#fef2f2] hover:text-[#dc2626]"
            >
              <X className="size-4" />
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => onApprove(registration.firebaseUid)}
              className="h-9 bg-[#16a34a] text-white hover:bg-[#15803d]"
            >
              <Check className="size-4" />
              Approve
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="bg-white rounded-md flex flex-col gap-3 p-4 w-full animate-pulse"
      style={{ border: "1px solid #e2e8f0" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-5 w-2/3 rounded bg-[#e2e8f0]" />
          <div className="h-4 w-full rounded bg-[#eef2f7]" />
          <div className="h-4 w-1/2 rounded bg-[#eef2f7]" />
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="h-5 w-16 rounded bg-[#eef2f7]" />
          <div className="h-3 w-12 rounded bg-[#eef2f7]" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-9 flex-1 rounded bg-[#eef2f7]" />
        <div className="h-9 w-20 rounded bg-[#eef2f7]" />
        <div className="h-9 w-20 rounded bg-[#eef2f7]" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegistrationVerificationPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Registration | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Stats counts for all three statuses
  const [counts, setCounts] = useState<{
    pending: number;
    approved: number;
    rejected: number;
  }>({ pending: 0, approved: 0, rejected: 0 });

  // Hook fetches the list for the active tab
  const statusParam = activeTab === "all" ? undefined : activeTab;
  const {
    registrations,
    loading,
    error,
    approve,
    reject,
    refresh,
  } = useRegistrations(statusParam);

  // Fetch counts for the stats row (poll alongside)
  const fetchCounts = useCallback(async () => {
    try {
      const [p, a, r] = await Promise.all([
        listRegistrations({ status: "pending", limit: 1 }),
        listRegistrations({ status: "approved", limit: 1 }),
        listRegistrations({ status: "rejected", limit: 1 }),
      ]);
      setCounts({
        pending: p.total,
        approved: a.total,
        rejected: r.total,
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

  // Search filter (name or location)
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return registrations;
    const q = searchQuery.toLowerCase();
    return registrations.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.barangayName?.toLowerCase().includes(q) ||
        r.cityMunicipalityName?.toLowerCase().includes(q) ||
        r.provinceName?.toLowerCase().includes(q) ||
        r.regionName?.toLowerCase().includes(q)
    );
  }, [registrations, searchQuery]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleView = useCallback((r: Registration) => {
    setSelected(r);
    setDialogOpen(true);
  }, []);

  const handleApprove = useCallback(
    async (uid: string) => {
      await approve(uid);
      fetchCounts();
    },
    [approve, fetchCounts]
  );

  const handleReject = useCallback(
    async (uid: string) => {
      // Quick reject from card — no notes. Detail dialog is the path for notes.
      await reject(uid);
      fetchCounts();
    },
    [reject, fetchCounts]
  );

  const handleVerified = useCallback(() => {
    refresh();
    fetchCounts();
  }, [refresh, fetchCounts]);

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-5 w-full items-start">
      {/* Page header */}
      <div className="flex flex-col gap-1 w-full shrink-0">
        <div className="flex items-center gap-2">
          <UserCheck className="size-6 text-[#002576]" />
          <h1 className="font-semibold text-[24px] leading-[31.2px] text-[#0b1c30]">
            Citizen Verification
          </h1>
        </div>
        <p className="text-[14px] text-[#747685]">
          Review pending citizen registrations and approve or reject them.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex gap-3 w-full shrink-0">
        <StatCard
          label="Pending"
          count={counts.pending}
          color="#b45309"
        />
        <StatCard
          label="Approved"
          count={counts.approved}
          color="#15803d"
        />
        <StatCard
          label="Rejected"
          count={counts.rejected}
          color="#b91c1c"
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
                ? counts.pending + counts.approved + counts.rejected
                : counts[tab.key];
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
                    active ? "bg-white/20 text-white" : "bg-black/5 text-[#747685]"
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
            placeholder="Search name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              Failed to load registrations
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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
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
            {searchQuery
              ? "No matching registrations"
              : activeTab === "pending"
                ? "No pending registrations"
                : `No ${activeTab} registrations`}
          </p>
          <p className="text-[#747685] text-[14px]">
            {searchQuery
              ? "Try a different search term."
              : activeTab === "pending"
                ? "All citizen registrations have been reviewed."
                : "Registrations will appear here once available."}
          </p>
        </div>
      )}

      {/* Registration grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
          {filtered.map((r) => (
            <RegistrationCard
              key={r.firebaseUid}
              registration={r}
              onView={handleView}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))}
        </div>
      )}

      {/* Detail dialog */}
      <RegistrationDetailDialog
        registration={selected}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onVerified={handleVerified}
      />
    </div>
  );
}
