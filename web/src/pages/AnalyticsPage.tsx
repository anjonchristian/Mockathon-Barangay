import { useState, useEffect, useRef } from "react";
import {
  getAnalyticsOverview,
  extractErrorMessage,
  type AnalyticsOverview,
} from "@/lib/api";

/** Auto-refresh interval for analytics data (30 seconds) */
const ANALYTICS_REFRESH_INTERVAL = 30_000;

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

function StatCard({ title, value, subtitle, color = "#002576" }: StatCardProps) {
  return (
    <div className="bg-white rounded-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
      <p className="text-[14px] font-medium text-[#747685] mb-2">{title}</p>
      <p className="text-[32px] font-bold leading-tight" style={{ color }}>
        {value}
      </p>
      {subtitle && <p className="text-[13px] text-[#747685] mt-1">{subtitle}</p>}
    </div>
  );
}

function BarChart({
  data,
  title,
}: {
  data: { label: string; value: number; color: string }[];
  title: string;
}) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="bg-white rounded-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
      <h3 className="font-medium text-[16px] text-[#0b1c30] mb-4">{title}</h3>
      <div className="flex items-end gap-4 h-40">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[12px] font-medium text-[#0b1c30]">
              {item.value}
            </span>
            <div
              className="w-full rounded-t-sm transition-all"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color,
                minHeight: 4,
              }}
            />
            <span className="text-[11px] text-[#747685] text-center">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Skeleton placeholder shown while data is loading */
function SkeletonCard() {
  return (
    <div
      className="bg-white rounded-sm p-5 animate-pulse"
      style={{ border: "1px solid #e2e8f0" }}
    >
      <div className="h-4 w-24 bg-[#e2e8f0] rounded-sm mb-3" />
      <div className="h-8 w-16 bg-[#e2e8f0] rounded-sm" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div
      className="bg-white rounded-sm p-5 animate-pulse"
      style={{ border: "1px solid #e2e8f0" }}
    >
      <div className="h-5 w-40 bg-[#e2e8f0] rounded-sm mb-4" />
      <div className="flex items-end gap-4 h-40">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="h-4 w-6 bg-[#e2e8f0] rounded-sm" />
            <div
              className="w-full bg-[#e2e8f0] rounded-t-sm"
              style={{ height: `${30 + ((i * 13) % 60)}%` }}
            />
            <div className="h-3 w-8 bg-[#e2e8f0] rounded-sm" />
          </div>
        ))}
      </div>
    </div>
  );
}

function formatAvgProcessing(hours: number | null): string {
  if (hours === null) return "—";
  if (hours < 1) {
    const mins = Math.round(hours * 60);
    return `${mins} min`;
  }
  if (hours < 24) {
    return `${hours.toFixed(1)} hrs`;
  }
  const days = hours / 24;
  return `${days.toFixed(1)} days`;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalyticsOverview();
      setAnalytics(data);
      setError(null);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    intervalRef.current = setInterval(fetchAnalytics, ANALYTICS_REFRESH_INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived data ──────────────────────────────────────────────────────────
  const reg = analytics?.registrations ?? {};
  const req = analytics?.requests ?? {};
  const blot = analytics?.blotters ?? {};

  const totalRegistrations =
    (reg.pending ?? 0) + (reg.approved ?? 0) + (reg.rejected ?? 0);
  const totalRequests =
    (req.pending_review ?? 0) +
    (req.processing ?? 0) +
    (req.approved ?? 0) +
    (req.completed ?? 0) +
    (req.rejected ?? 0);
  const totalBlotters =
    (blot.under_review ?? 0) +
    (blot.scheduled_mediation ?? 0) +
    (blot.resolved ?? 0) +
    (blot.escalated_pnp ?? 0);
  const resolvedBlotters = blot.resolved ?? 0;
  const blotterResolutionRate =
    totalBlotters > 0
      ? Math.round((resolvedBlotters / totalBlotters) * 100)
      : 0;

  const requestsByStatusData = [
    { label: "Pending", value: req.pending_review ?? 0, color: "#f59e0b" },
    { label: "Processing", value: req.processing ?? 0, color: "#3b82f6" },
    { label: "Ready", value: req.approved ?? 0, color: "#002576" },
    { label: "Completed", value: req.completed ?? 0, color: "#16a34a" },
    { label: "Rejected", value: req.rejected ?? 0, color: "#dc2626" },
  ];

  const blottersByStatusData = [
    { label: "Under Review", value: blot.under_review ?? 0, color: "#f59e0b" },
    {
      label: "Scheduled",
      value: blot.scheduled_mediation ?? 0,
      color: "#3b82f6",
    },
    { label: "Resolved", value: blot.resolved ?? 0, color: "#16a34a" },
    { label: "Escalated", value: blot.escalated_pnp ?? 0, color: "#dc2626" },
  ];

  // Daily totals for the last 7 days (sum of all three categories)
  const dailyData =
    analytics?.daily.map((d) => ({
      label: new Date(d.date).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      value: d.registrations + d.requests + d.blotters,
      color: "#002576",
    })) ?? [];

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-[24px] text-[#0b1c30]">
            Analytics Dashboard
          </h1>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-6">
          <SkeletonChart />
          <SkeletonChart />
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="bg-red-100 rounded-full size-12 flex items-center justify-center">
            <span className="text-red-600 text-xl font-bold">!</span>
          </div>
          <p className="text-[#0b1c30] font-semibold text-[16px]">
            Failed to load analytics
          </p>
          <p className="text-[#747685] text-[14px]">{error ?? "Unknown error"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-[24px] text-[#0b1c30]">
          Analytics Dashboard
        </h1>
        <span className="text-[12px] text-[#747685]">
          Auto-refreshes every 30s
        </span>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Document Requests"
          value={totalRequests}
          subtitle={`${req.pending_review ?? 0} pending review`}
        />
        <StatCard
          title="Avg. Processing Time"
          value={formatAvgProcessing(analytics.avgProcessingTimeHours)}
          subtitle="approved + completed"
          color="#16a34a"
        />
        <StatCard
          title="Blotter Resolution Rate"
          value={`${blotterResolutionRate}%`}
          subtitle={`${resolvedBlotters} of ${totalBlotters} resolved`}
          color="#1e40af"
        />
        <StatCard
          title="Missed Calls"
          value={analytics.totalMissedCalls}
          subtitle="awaiting callback"
          color="#7c3aed"
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Registered Residents"
          value={totalRegistrations.toLocaleString()}
          subtitle={`${reg.approved ?? 0} approved · ${reg.pending ?? 0} pending`}
        />
        <StatCard
          title="Completed Requests"
          value={req.completed ?? 0}
          subtitle={`${req.approved ?? 0} ready for pickup`}
          color="#16a34a"
        />
        <StatCard
          title="Total Blotter Reports"
          value={totalBlotters}
          subtitle={`${blot.escalated_pnp ?? 0} escalated to PNP`}
          color="#dc2626"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <BarChart data={requestsByStatusData} title="Document Requests by Status" />
        <BarChart data={blottersByStatusData} title="Blotter Reports by Status" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <BarChart data={dailyData} title="Daily Activity (Last 7 Days)" />
      </div>
    </div>
  );
}
