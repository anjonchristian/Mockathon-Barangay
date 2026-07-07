import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { CalendarClock, Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import type { Blotter, BlotterStatus, IncidentType } from "@/types";
import { timeAgo } from "@/types";

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  BlotterStatus,
  { label: string; bg: string; text: string }
> = {
  under_review: { label: "Under Review", bg: "#fef3c7", text: "#92400e" },
  scheduled_mediation: {
    label: "Mediation Scheduled",
    bg: "#dbeafe",
    text: "#1e40af",
  },
  resolved: { label: "Resolved", bg: "#dcfce7", text: "#166534" },
  escalated_pnp: { label: "Escalated to PNP", bg: "#fee2e2", text: "#991b1b" },
};

const INCIDENT_LABELS: Record<IncidentType, string> = {
  noise_complaint: "Noise Complaint",
  property_dispute: "Property Dispute",
  theft: "Theft",
  vandalism: "Vandalism",
  harassment: "Harassment",
  other: "Other",
};

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: BlotterStatus }) {
  const c = STATUS_CONFIG[status];
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-[#747685] uppercase tracking-wide">
        {label}
      </span>
      <span className="text-sm text-[#0b1c30] break-words">
        {value && value.trim() ? value : "—"}
      </span>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-semibold text-[14px] text-[#0b1c30] uppercase tracking-wide">
      {children}
    </p>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface BlotterDetailDialogProps {
  blotter: Blotter | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Update status (and optional extra fields) via the hook */
  onUpdateStatus: (
    id: string,
    status: BlotterStatus,
    extra?: { mediationNotes?: string; staffNotes?: string; resolutionNotes?: string }
  ) => Promise<void>;
  /** Schedule mediation via the hook */
  onScheduleMediation: (id: string, date: string, notes?: string) => Promise<void>;
  /** Delete the blotter via the hook */
  onDelete: (id: string) => Promise<void>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BlotterDetailDialog({
  blotter,
  open,
  onOpenChange,
  onUpdateStatus,
  onScheduleMediation,
  onDelete,
}: BlotterDetailDialogProps) {
  const [statusValue, setStatusValue] = useState<BlotterStatus>("under_review");
  const [staffNotes, setStaffNotes] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Mediation scheduling form
  const [showMediation, setShowMediation] = useState(false);
  const [mediationDate, setMediationDate] = useState("");
  const [mediationNotes, setMediationNotes] = useState("");

  const id = blotter?._id;

  // Sync local form state when the dialog opens or blotter changes
  useEffect(() => {
    if (open && blotter) {
      setStatusValue(blotter.status);
      setStaffNotes(blotter.staffNotes ?? "");
      setResolutionNotes(blotter.resolutionNotes ?? "");
      setShowMediation(false);
      setMediationDate(
        blotter.mediationDate
          ? new Date(blotter.mediationDate).toISOString().slice(0, 10)
          : ""
      );
      setMediationNotes(blotter.mediationNotes ?? "");
    }
    if (!open) {
      setShowMediation(false);
    }
  }, [open, blotter]);

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleStatusChange = useCallback(async () => {
    if (!id || !blotter) return;
    if (statusValue === blotter.status && !staffNotes.trim() && !resolutionNotes.trim()) {
      return;
    }
    setSubmitting(true);
    try {
      const extra: { mediationNotes?: string; staffNotes?: string; resolutionNotes?: string } = {};
      if (staffNotes.trim()) extra.staffNotes = staffNotes.trim();
      if (resolutionNotes.trim()) extra.resolutionNotes = resolutionNotes.trim();
      await onUpdateStatus(id, statusValue, extra);
    } finally {
      setSubmitting(false);
    }
  }, [id, blotter, statusValue, staffNotes, resolutionNotes, onUpdateStatus]);

  const handleSchedule = useCallback(async () => {
    if (!id) return;
    if (!mediationDate) {
      toast.error("Please select a mediation date");
      return;
    }
    setSubmitting(true);
    try {
      // Convert date to ISO string with a default time of 09:00
      const isoDate = new Date(`${mediationDate}T09:00:00`).toISOString();
      await onScheduleMediation(
        id,
        isoDate,
        mediationNotes.trim() || undefined
      );
      setShowMediation(false);
    } finally {
      setSubmitting(false);
    }
  }, [id, mediationDate, mediationNotes, onScheduleMediation]);

  const handleDelete = useCallback(async () => {
    if (!id) return;
    if (!window.confirm("Delete this blotter report permanently? This cannot be undone.")) {
      return;
    }
    setSubmitting(true);
    try {
      await onDelete(id);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }, [id, onDelete, onOpenChange]);

  if (!blotter) return null;

  const location = [blotter.barangayName, blotter.cityMunicipalityName]
    .filter(Boolean)
    .join(", ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle className="text-[20px] font-semibold text-[#0b1c30]">
            Blotter Report
          </DialogTitle>
          <DialogDescription className="text-[14px] text-[#747685]">
            Review the report details and manage status or mediation.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-220px)]">
          <div className="px-6 pb-4 flex flex-col gap-6">
            {/* Header: title + status */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0">
                <p className="font-semibold text-[20px] text-[#0b1c30] leading-tight break-words">
                  {blotter.title}
                </p>
                <p className="text-[14px] text-[#444653]">
                  {INCIDENT_LABELS[blotter.incidentType] ?? blotter.incidentType}
                </p>
                <p className="text-[12px] text-[#747685]">
                  Report ID: {blotter.reportId} - {timeAgo(blotter.createdAt)}
                </p>
              </div>
              <StatusBadge status={blotter.status} />
            </div>

            {/* Evidence photos */}
            {blotter.evidencePhotos && blotter.evidencePhotos.length > 0 && (
              <div className="flex flex-col gap-2">
                <SectionLabel>Evidence Photos</SectionLabel>
                <div className="grid grid-cols-3 gap-2">
                  {blotter.evidencePhotos.map((photo, i) => (
                    <div
                      key={i}
                      className="relative rounded-md overflow-hidden bg-[#f1f5f9]"
                      style={{ border: "1px solid #e2e8f0" }}
                    >
                      <img
                        src={
                          photo.startsWith("data:")
                            ? photo
                            : `data:image/jpeg;base64,${photo}`
                        }
                        alt={`Evidence ${i + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Report details */}
            <div className="flex flex-col gap-3">
              <SectionLabel>Report Details</SectionLabel>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <InfoRow label="Incident Type" value={INCIDENT_LABELS[blotter.incidentType] ?? blotter.incidentType} />
                <InfoRow label="Location" value={blotter.location} />
                <div className="col-span-2">
                  <InfoRow label="Description" value={blotter.description} />
                </div>
                <div className="col-span-2">
                  <InfoRow label="Persons Involved" value={blotter.personsInvolved} />
                </div>
              </div>
            </div>

            {/* Reporter location */}
            <div className="flex flex-col gap-3">
              <SectionLabel>Reporter Location</SectionLabel>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <InfoRow label="Barangay" value={blotter.barangayName} />
                <InfoRow label="City / Municipality" value={blotter.cityMunicipalityName} />
              </div>
            </div>

            {/* Mediation info (if scheduled) */}
            {blotter.mediationDate && (
              <div
                className="flex flex-col gap-2 rounded-md p-3"
                style={{
                  backgroundColor: "#dbeafe",
                  border: "1px solid #93c5fd",
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[#1e40af]">
                  Mediation Scheduled
                </p>
                <p className="text-sm text-[#0b1c30]">
                  {new Date(blotter.mediationDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                {blotter.mediationNotes && (
                  <p className="text-sm text-[#444653] break-words">
                    {blotter.mediationNotes}
                  </p>
                )}
              </div>
            )}

            {/* Existing notes */}
            {(blotter.staffNotes || blotter.resolutionNotes) && (
              <div className="flex flex-col gap-3">
                <SectionLabel>Notes</SectionLabel>
                {blotter.staffNotes && (
                  <InfoRow label="Staff Notes" value={blotter.staffNotes} />
                )}
                {blotter.resolutionNotes && (
                  <InfoRow label="Resolution Notes" value={blotter.resolutionNotes} />
                )}
              </div>
            )}

            {/* Mediation scheduling form */}
            {showMediation && (
              <div
                className="flex flex-col gap-3 rounded-md p-4"
                style={{
                  backgroundColor: "#eff4ff",
                  border: "1px solid #c4c5d5",
                }}
              >
                <p className="font-semibold text-[14px] text-[#0b1c30]">
                  Schedule Mediation
                </p>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#747685] uppercase tracking-wide">
                    Mediation Date <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="date"
                    value={mediationDate}
                    onChange={(e) => setMediationDate(e.target.value)}
                    className="h-9 rounded-md px-3 text-[14px] text-[#0b1c30] bg-white"
                    style={{ border: "1px solid #c4c5d5" }}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-[#747685] uppercase tracking-wide">
                    Mediation Notes
                  </label>
                  <Textarea
                    value={mediationNotes}
                    onChange={(e) => setMediationNotes(e.target.value)}
                    placeholder="Add notes for the mediation session..."
                    rows={3}
                    className="resize-none bg-white"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setShowMediation(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSchedule}
                    disabled={submitting || !mediationDate}
                    className="bg-[#002576] text-white hover:bg-[#001a52]"
                  >
                    {submitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <CalendarClock className="size-4" />
                    )}
                    Schedule
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer actions */}
        <DialogFooter className="px-6 py-4 shrink-0 border-t border-[#e2e8f0] flex-col items-stretch gap-3 sm:flex-row sm:items-end">
          {/* Status + notes controls */}
          <div className="flex flex-col gap-3 w-full">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#747685] uppercase tracking-wide">
                Status
              </label>
              <Select
                value={statusValue}
                onValueChange={(v) => setStatusValue(v as BlotterStatus)}
              >
                <SelectTrigger className="h-9 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(STATUS_CONFIG) as BlotterStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_CONFIG[s].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#747685] uppercase tracking-wide">
                  Staff Notes
                </label>
                <Textarea
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  placeholder="Internal staff notes..."
                  rows={2}
                  className="resize-none bg-white text-sm"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-[#747685] uppercase tracking-wide">
                  Resolution Notes
                </label>
                <Textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Resolution details (if resolved)..."
                  rows={2}
                  className="resize-none bg-white text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 justify-end flex-wrap">
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={submitting}
                className="text-[#dc2626] border-[#dc2626] hover:bg-[#fef2f2] hover:text-[#dc2626]"
              >
                <Trash2 className="size-4" />
                Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowMediation(true)}
                disabled={submitting}
              >
                <CalendarClock className="size-4" />
                Schedule Mediation
              </Button>
              <Button
                onClick={handleStatusChange}
                disabled={submitting}
                className="bg-[#002576] text-white hover:bg-[#001a52]"
              >
                {submitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
