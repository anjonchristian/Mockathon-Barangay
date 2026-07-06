import { useState } from "react";
import { toast } from "sonner";
import { timeAgo } from "@/types";

type BroadcastSeverity = "info" | "warning" | "critical";

interface BroadcastLog {
  id: string;
  title: string;
  message: string;
  severity: BroadcastSeverity;
  targetArea: string;
  sentAt: string;
  recipientCount: number;
}

const SEVERITY_CONFIG: Record<BroadcastSeverity, { label: string; color: string; bg: string }> = {
  info: { label: "Information", color: "#1e40af", bg: "#dbeafe" },
  warning: { label: "Warning", color: "#92400e", bg: "#fef3c7" },
  critical: { label: "Critical", color: "#991b1b", bg: "#fee2e2" },
};

const MOCK_BROADCAST_HISTORY: BroadcastLog[] = [
  {
    id: "bc1",
    title: "Typhoon Warning",
    message: "Typhoon signal #2 raised. Residents near waterways are advised to evacuate to the barangay hall immediately.",
    severity: "critical",
    targetArea: "All Barangay Zones",
    sentAt: new Date(Date.now() - 7200000).toISOString(),
    recipientCount: 1250,
  },
  {
    id: "bc2",
    title: "Water Supply Interruption",
    message: "Water supply will be interrupted on July 8, 2026 from 8 AM to 5 PM due to maintenance.",
    severity: "warning",
    targetArea: "Zone 1-3",
    sentAt: new Date(Date.now() - 86400000).toISOString(),
    recipientCount: 450,
  },
  {
    id: "bc3",
    title: "Community Meeting",
    message: "General Assembly meeting on July 12, 2026 at 2 PM in the Barangay Hall. All residents are encouraged to attend.",
    severity: "info",
    targetArea: "All Barangay Zones",
    sentAt: new Date(Date.now() - 259200000).toISOString(),
    recipientCount: 1250,
  },
];

const TARGET_AREAS = [
  "All Barangay Zones",
  "Zone 1",
  "Zone 2",
  "Zone 3",
  "Zone 4",
  "Zone 5",
  "Near Waterways",
  "Commercial Area",
];

export default function EmergencyBroadcastPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<BroadcastSeverity>("info");
  const [targetArea, setTargetArea] = useState("All Barangay Zones");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<BroadcastLog[]>(MOCK_BROADCAST_HISTORY);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSendBroadcast = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setShowConfirm(true);
  };

  const confirmSend = async () => {
    setSending(true);
    setShowConfirm(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newBroadcast: BroadcastLog = {
        id: `bc-${Date.now()}`,
        title,
        message,
        severity,
        targetArea,
        sentAt: new Date().toISOString(),
        recipientCount: targetArea === "All Barangay Zones" ? 1250 : 250,
      };

      setHistory((prev) => [newBroadcast, ...prev]);
      setTitle("");
      setMessage("");
      setSeverity("info");

      toast.success(`Broadcast sent to ${newBroadcast.recipientCount} residents`);
    } catch {
      toast.error("Failed to send broadcast");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-semibold text-[24px] text-[#0b1c30]">Emergency Broadcast</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Broadcast Form */}
        <div className="col-span-2">
          <div className="bg-white rounded-sm p-6" style={{ border: "1px solid #e2e8f0" }}>
            <h2 className="font-medium text-[18px] text-[#0b1c30] mb-4">Send Broadcast</h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="font-medium text-[14px] text-[#444653] block mb-1">
                  Severity Level
                </label>
                <div className="flex gap-2">
                  {(Object.keys(SEVERITY_CONFIG) as BroadcastSeverity[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSeverity(s)}
                      className={`text-[14px] font-medium px-4 py-2 rounded-sm transition-all cursor-pointer ${
                        severity === s ? "ring-2 ring-offset-1" : "opacity-60 hover:opacity-100"
                      }`}
                      style={{
                        color: SEVERITY_CONFIG[s].color,
                        backgroundColor: SEVERITY_CONFIG[s].bg,
                        ...(severity === s ? { ringColor: SEVERITY_CONFIG[s].color } : {}),
                      }}
                    >
                      {SEVERITY_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-medium text-[14px] text-[#444653] block mb-1">
                  Target Area
                </label>
                <select
                  value={targetArea}
                  onChange={(e) => setTargetArea(e.target.value)}
                  className="h-10 w-full rounded-sm px-3 text-[14px] text-[#0b1c30] bg-white cursor-pointer"
                  style={{ border: "1px solid #c4c5d5" }}
                >
                  {TARGET_AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-[14px] text-[#444653] block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Broadcast title..."
                  className="h-10 w-full rounded-sm px-3 text-[14px] text-[#0b1c30]"
                  style={{ border: "1px solid #c4c5d5" }}
                />
              </div>

              <div>
                <label className="font-medium text-[14px] text-[#444653] block mb-1">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your broadcast message..."
                  rows={4}
                  className="w-full rounded-sm px-3 py-2 text-[14px] text-[#0b1c30] resize-none"
                  style={{ border: "1px solid #c4c5d5" }}
                />
              </div>

              <button
                onClick={handleSendBroadcast}
                disabled={sending || !title.trim() || !message.trim()}
                className={`h-12 rounded-sm font-medium text-[16px] text-white transition-opacity cursor-pointer ${
                  severity === "critical"
                    ? "bg-[#dc2626]"
                    : severity === "warning"
                    ? "bg-[#f59e0b]"
                    : "bg-[#002576]"
                } ${sending || !title.trim() || !message.trim() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
              >
                {sending ? "Sending..." : "Send Broadcast"}
              </button>
            </div>
          </div>

          {/* Evacuation Map Placeholder */}
          <div className="bg-white rounded-sm p-6 mt-6" style={{ border: "1px solid #e2e8f0" }}>
            <h2 className="font-medium text-[18px] text-[#0b1c30] mb-4">Evacuation Map</h2>
            <div
              className="h-64 rounded-sm flex items-center justify-center bg-[#f1f5f9]"
              style={{ border: "1px solid #e2e8f0" }}
            >
              <div className="text-center text-[#747685]">
                <p className="text-[32px] mb-2">🗺️</p>
                <p className="text-[14px]">Interactive evacuation map</p>
                <p className="text-[12px]">Configure zones and evacuation routes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Broadcast History */}
        <div className="col-span-1">
          <div className="bg-white rounded-sm p-5 sticky top-4" style={{ border: "1px solid #e2e8f0" }}>
            <h2 className="font-medium text-[18px] text-[#0b1c30] mb-4">Broadcast History</h2>

            <div className="flex flex-col gap-3">
              {history.map((broadcast) => (
                <div
                  key={broadcast.id}
                  className="p-3 rounded-sm"
                  style={{
                    border: "1px solid #e2e8f0",
                    borderLeft: `4px solid ${SEVERITY_CONFIG[broadcast.severity].color}`,
                  }}
                >
                  <div className="flex items-start justify-between mb-1">
                    <span className="font-medium text-[14px] text-[#0b1c30]">
                      {broadcast.title}
                    </span>
                    <span
                      className="text-[11px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap ml-2"
                      style={{
                        color: SEVERITY_CONFIG[broadcast.severity].color,
                        backgroundColor: SEVERITY_CONFIG[broadcast.severity].bg,
                      }}
                    >
                      {SEVERITY_CONFIG[broadcast.severity].label}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#444653] line-clamp-2 mb-1">
                    {broadcast.message}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#747685]">
                    <span>{broadcast.targetArea}</span>
                    <span>{timeAgo(broadcast.sentAt)}</span>
                  </div>
                  <p className="text-[11px] text-[#747685] mt-0.5">
                    Sent to {broadcast.recipientCount} residents
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-sm p-6 max-w-md w-full mx-4" style={{ border: "1px solid #e2e8f0" }}>
            <h3 className="font-semibold text-[18px] text-[#0b1c30] mb-2">Confirm Broadcast</h3>
            <p className="text-[14px] text-[#444653] mb-1">
              You are about to send a <span className="font-medium" style={{ color: SEVERITY_CONFIG[severity].color }}>{SEVERITY_CONFIG[severity].label.toLowerCase()}</span> broadcast to:
            </p>
            <p className="font-medium text-[14px] text-[#0b1c30] mb-4">{targetArea}</p>
            <div
              className="p-3 rounded-sm mb-4 text-[14px] text-[#0b1c30]"
              style={{
                backgroundColor: SEVERITY_CONFIG[severity].bg,
                border: `1px solid ${SEVERITY_CONFIG[severity].color}30`,
              }}
            >
              <p className="font-medium">{title}</p>
              <p className="text-[13px] mt-1">{message}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 h-10 rounded-sm text-[14px] font-medium text-[#444653] bg-white hover:bg-[#f1f5f9] cursor-pointer transition-colors"
                style={{ border: "1px solid #c4c5d5" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmSend}
                className="flex-1 h-10 rounded-sm text-[14px] font-medium text-white bg-[#002576] hover:opacity-90 cursor-pointer transition-opacity"
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
