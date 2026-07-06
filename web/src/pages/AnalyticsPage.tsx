import { useState, useEffect } from "react";
import { listRequests, extractErrorMessage } from "@/lib/api";

interface AnalyticsData {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  avgProcessingTime: string;
  blotterResolutionRate: number;
  activeStaff: number;
  totalResidents: number;
  broadcastsSent: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: string;
}

function StatCard({ title, value, subtitle, trend, trendValue, color = "#002576" }: StatCardProps) {
  return (
    <div className="bg-white rounded-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
      <p className="text-[14px] font-medium text-[#747685] mb-2">{title}</p>
      <p className="text-[32px] font-bold leading-tight" style={{ color }}>{value}</p>
      {subtitle && <p className="text-[13px] text-[#747685] mt-1">{subtitle}</p>}
      {trendValue && (
        <div className="flex items-center gap-1 mt-2">
          <span
            className={`text-[13px] font-medium ${
              trend === "up" ? "text-[#16a34a]" : trend === "down" ? "text-[#dc2626]" : "text-[#747685]"
            }`}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
          <span className="text-[12px] text-[#747685]">vs last month</span>
        </div>
      )}
    </div>
  );
}

function BarChart({ data, title }: { data: { label: string; value: number; color: string }[]; title: string }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="bg-white rounded-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
      <h3 className="font-medium text-[16px] text-[#0b1c30] mb-4">{title}</h3>
      <div className="flex items-end gap-4 h-40">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <span className="text-[12px] font-medium text-[#0b1c30]">{item.value}</span>
            <div
              className="w-full rounded-t-sm transition-all"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color,
                minHeight: 4,
              }}
            />
            <span className="text-[11px] text-[#747685] text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    avgProcessingTime: "2.3 hrs",
    blotterResolutionRate: 78,
    activeStaff: 3,
    totalResidents: 1250,
    broadcastsSent: 12,
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
          listRequests({ status: "pending_review", limit: 1 }),
          listRequests({ status: "approved", limit: 1 }),
          listRequests({ status: "rejected", limit: 1 }),
        ]);

        setAnalytics((prev) => ({
          ...prev,
          totalRequests: pendingRes.total + approvedRes.total + rejectedRes.total,
          pendingRequests: pendingRes.total,
          approvedRequests: approvedRes.total,
          rejectedRequests: rejectedRes.total,
        }));
      } catch (err) {
        console.error("Failed to fetch analytics:", extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [dateRange]);

  const requestsByStatusData = [
    { label: "Pending", value: analytics.pendingRequests, color: "#f59e0b" },
    { label: "Approved", value: analytics.approvedRequests, color: "#16a34a" },
    { label: "Rejected", value: analytics.rejectedRequests, color: "#dc2626" },
  ];

  const weeklyData = [
    { label: "Mon", value: 12, color: "#002576" },
    { label: "Tue", value: 8, color: "#002576" },
    { label: "Wed", value: 15, color: "#002576" },
    { label: "Thu", value: 10, color: "#002576" },
    { label: "Fri", value: 18, color: "#002576" },
    { label: "Sat", value: 5, color: "#99aacc" },
    { label: "Sun", value: 3, color: "#99aacc" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full size-8 border-2 border-[#002576] border-t-transparent" />
          <p className="text-[#747685] text-[14px]">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-[24px] text-[#0b1c30]">Analytics Dashboard</h1>
        <div className="flex gap-1 bg-[#f1f5f9] rounded-sm p-1" style={{ border: "1px solid #e2e8f0" }}>
          {(["7d", "30d", "90d", "all"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 rounded-sm text-[13px] font-medium cursor-pointer transition-colors ${
                dateRange === range
                  ? "bg-white text-[#002576] shadow-sm"
                  : "text-[#747685] hover:text-[#0b1c30]"
              }`}
            >
              {range === "7d" ? "7 Days" : range === "30d" ? "30 Days" : range === "90d" ? "90 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Requests"
          value={analytics.totalRequests}
          trend="up"
          trendValue="12%"
        />
        <StatCard
          title="Avg. Processing Time"
          value={analytics.avgProcessingTime}
          trend="down"
          trendValue="0.5 hrs"
          color="#16a34a"
        />
        <StatCard
          title="Blotter Resolution Rate"
          value={`${analytics.blotterResolutionRate}%`}
          trend="up"
          trendValue="5%"
          color="#1e40af"
        />
        <StatCard
          title="Active Staff"
          value={analytics.activeStaff}
          subtitle={`of ${analytics.activeStaff + 1} total staff`}
          color="#7c3aed"
        />
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Registered Residents"
          value={analytics.totalResidents.toLocaleString()}
          trend="up"
          trendValue="45"
        />
        <StatCard
          title="Pending Requests"
          value={analytics.pendingRequests}
          color="#f59e0b"
        />
        <StatCard
          title="Broadcasts Sent"
          value={analytics.broadcastsSent}
          subtitle="This month"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <BarChart data={requestsByStatusData} title="Requests by Status" />
        <BarChart data={weeklyData} title="Requests This Week" />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
        <h3 className="font-medium text-[16px] text-[#0b1c30] mb-4">Recent Activity</h3>
        <div className="flex flex-col gap-3">
          {[
            { action: "Request approved", user: "Maria Santos", time: "5 min ago", color: "#16a34a" },
            { action: "New blotter filed", user: "Roberto Garcia", time: "15 min ago", color: "#f59e0b" },
            { action: "Staff went online", user: "Pedro Cruz", time: "30 min ago", color: "#1e40af" },
            { action: "Broadcast sent", user: "Admin", time: "1 hr ago", color: "#7c3aed" },
            { action: "Request rejected", user: "Ana Reyes", time: "2 hrs ago", color: "#dc2626" },
          ].map((activity, i) => (
            <div key={i} className="flex items-center gap-3 text-[14px]">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: activity.color }}
              />
              <span className="text-[#0b1c30]">
                <span className="font-medium">{activity.action}</span>
                {" by "}
                <span className="font-medium">{activity.user}</span>
              </span>
              <span className="text-[#747685] ml-auto text-[13px]">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
