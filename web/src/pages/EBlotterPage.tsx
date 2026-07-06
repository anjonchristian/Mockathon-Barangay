import { useState } from "react";
import { timeAgo } from "@/types";

type BlotterStatus = "under_review" | "scheduled_mediation" | "resolved" | "escalated";

interface BlotterReport {
  id: string;
  complainant: string;
  respondent: string;
  incidentType: string;
  description: string;
  location: string;
  status: BlotterStatus;
  severity: "low" | "medium" | "high";
  filedAt: string;
  mediationDate?: string;
}

const STATUS_CONFIG: Record<BlotterStatus, { label: string; color: string; bg: string }> = {
  under_review: { label: "Under Review", color: "#92400e", bg: "#fef3c7" },
  scheduled_mediation: { label: "Mediation Scheduled", color: "#1e40af", bg: "#dbeafe" },
  resolved: { label: "Resolved", color: "#166534", bg: "#dcfce7" },
  escalated: { label: "Escalated", color: "#991b1b", bg: "#fee2e2" },
};

const SEVERITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "#16a34a" },
  medium: { label: "Medium", color: "#f59e0b" },
  high: { label: "High", color: "#dc2626" },
};

const MOCK_BLOTTERS: BlotterReport[] = [
  {
    id: "b1",
    complainant: "Maria Santos",
    respondent: "Juan Cruz",
    incidentType: "Noise Complaint",
    description: "Loud karaoke music past 10 PM every night, disturbing neighbors and children",
    location: "Block 5, Lot 12, Phase 3",
    status: "under_review",
    severity: "medium",
    filedAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "b2",
    complainant: "Roberto Garcia",
    respondent: "Ana Reyes",
    incidentType: "Property Dispute",
    description: "Boundary fence was moved 2 meters into complainant's property without consent",
    location: "Block 8, Lot 3",
    status: "scheduled_mediation",
    severity: "high",
    filedAt: new Date(Date.now() - 86400000).toISOString(),
    mediationDate: new Date(Date.now() + 259200000).toISOString(),
  },
  {
    id: "b3",
    complainant: "Elena Villanueva",
    respondent: "Unknown",
    incidentType: "Theft",
    description: "Potted plants and garden tools stolen from front yard overnight",
    location: "Block 2, Lot 7",
    status: "resolved",
    severity: "low",
    filedAt: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: "b4",
    complainant: "Pedro Aquino",
    respondent: "Group of Youth",
    incidentType: "Public Disturbance",
    description: "Group of youth blocking the street and making excessive noise every evening",
    location: "Corner of Main St and Rizal Ave",
    status: "escalated",
    severity: "high",
    filedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export default function EBlotterPage() {
  const [blotters, setBlotters] = useState<BlotterReport[]>(MOCK_BLOTTERS);
  const [selectedBlotter, setSelectedBlotter] = useState<BlotterReport | null>(null);
  const [filterStatus, setFilterStatus] = useState<BlotterStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filteredBlotters = blotters.filter((b) => {
    if (filterStatus !== "all" && b.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.complainant.toLowerCase().includes(q) ||
        b.respondent.toLowerCase().includes(q) ||
        b.incidentType.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (id: string, newStatus: BlotterStatus) => {
    setBlotters((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    if (selectedBlotter?.id === id) {
      setSelectedBlotter((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-[24px] text-[#0b1c30]">e-Blotter Management</h1>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search reports..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-64 rounded-sm px-3 text-[14px] text-[#0b1c30] bg-white"
            style={{ border: "1px solid #c4c5d5" }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as BlotterStatus | "all")}
            className="h-10 rounded-sm px-3 text-[14px] text-[#444653] bg-white cursor-pointer"
            style={{ border: "1px solid #c4c5d5" }}
          >
            <option value="all">All Status</option>
            <option value="under_review">Under Review</option>
            <option value="scheduled_mediation">Mediation Scheduled</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Blotter List */}
        <div className="col-span-2 flex flex-col gap-3">
          {filteredBlotters.length === 0 ? (
            <div className="bg-white rounded-sm p-8 text-center text-[#747685] text-[14px]" style={{ border: "1px solid #e2e8f0" }}>
              No reports found
            </div>
          ) : (
            filteredBlotters.map((blotter) => (
              <button
                key={blotter.id}
                onClick={() => setSelectedBlotter(blotter)}
                className={`bg-white rounded-sm p-4 text-left w-full hover:bg-[#f8f9ff] transition-colors ${
                  selectedBlotter?.id === blotter.id ? "ring-2 ring-[#002576]" : ""
                }`}
                style={{ border: "1px solid #e2e8f0" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[16px] text-[#0b1c30]">
                      {blotter.incidentType}
                    </span>
                    <span
                      className="text-[12px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        color: SEVERITY_CONFIG[blotter.severity].color,
                        backgroundColor: SEVERITY_CONFIG[blotter.severity].color + "20",
                      }}
                    >
                      {SEVERITY_CONFIG[blotter.severity].label}
                    </span>
                  </div>
                  <span
                    className="text-[12px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{
                      color: STATUS_CONFIG[blotter.status].color,
                      backgroundColor: STATUS_CONFIG[blotter.status].bg,
                    }}
                  >
                    {STATUS_CONFIG[blotter.status].label}
                  </span>
                </div>
                <p className="text-[14px] text-[#444653] mb-1">
                  <span className="font-medium">Complainant:</span> {blotter.complainant}
                  {" vs "}<span className="font-medium">Respondent:</span> {blotter.respondent}
                </p>
                <p className="text-[13px] text-[#747685] line-clamp-1">{blotter.description}</p>
                <p className="text-[12px] text-[#747685] mt-1">{timeAgo(blotter.filedAt)}</p>
              </button>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="col-span-1">
          {selectedBlotter ? (
            <div className="bg-white rounded-sm p-5 sticky top-4" style={{ border: "1px solid #e2e8f0" }}>
              <h2 className="font-semibold text-[18px] text-[#0b1c30] mb-4">
                {selectedBlotter.incidentType}
              </h2>

              <div className="flex flex-col gap-3 text-[14px]">
                <div>
                  <span className="font-medium text-[#444653]">Complainant</span>
                  <p className="text-[#0b1c30]">{selectedBlotter.complainant}</p>
                </div>
                <div>
                  <span className="font-medium text-[#444653]">Respondent</span>
                  <p className="text-[#0b1c30]">{selectedBlotter.respondent}</p>
                </div>
                <div>
                  <span className="font-medium text-[#444653]">Location</span>
                  <p className="text-[#0b1c30]">{selectedBlotter.location}</p>
                </div>
                <div>
                  <span className="font-medium text-[#444653]">Description</span>
                  <p className="text-[#0b1c30]">{selectedBlotter.description}</p>
                </div>
                <div>
                  <span className="font-medium text-[#444653]">Severity</span>
                  <span
                    className="ml-2 text-[13px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      color: SEVERITY_CONFIG[selectedBlotter.severity].color,
                      backgroundColor: SEVERITY_CONFIG[selectedBlotter.severity].color + "20",
                    }}
                  >
                    {SEVERITY_CONFIG[selectedBlotter.severity].label}
                  </span>
                </div>
                {selectedBlotter.mediationDate && (
                  <div>
                    <span className="font-medium text-[#444653]">Mediation Date</span>
                    <p className="text-[#0b1c30]">
                      {new Date(selectedBlotter.mediationDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-[#444653]">Filed</span>
                  <p className="text-[#0b1c30]">{timeAgo(selectedBlotter.filedAt)}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <span className="font-medium text-[14px] text-[#444653]">Update Status</span>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(STATUS_CONFIG) as BlotterStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedBlotter.id, status)}
                      disabled={selectedBlotter.status === status}
                      className={`text-[12px] font-medium px-3 py-2 rounded-sm transition-colors ${
                        selectedBlotter.status === status
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:opacity-80 cursor-pointer"
                      }`}
                      style={{
                        color: STATUS_CONFIG[status].color,
                        backgroundColor: STATUS_CONFIG[status].bg,
                        border: `1px solid ${STATUS_CONFIG[status].color}30`,
                      }}
                    >
                      {STATUS_CONFIG[status].label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-sm p-8 text-center text-[#747685] text-[14px]" style={{ border: "1px solid #e2e8f0" }}>
              Select a report to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
