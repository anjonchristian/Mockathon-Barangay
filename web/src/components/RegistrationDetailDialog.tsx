import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Check, X, Loader2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import {
  getRegistrationPhoto,
  verifyRegistration,
  extractErrorMessage,
} from "@/lib/api";
import type { Registration } from "@/types";

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Registration["verificationStatus"] }) {
  const config: Record<
    Registration["verificationStatus"],
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

interface RegistrationDetailDialogProps {
  registration: Registration | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful approve/reject so the parent can refresh */
  onVerified?: (firebaseUid: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RegistrationDetailDialog({
  registration,
  open,
  onOpenChange,
  onVerified,
}: RegistrationDetailDialogProps) {
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [showReject, setShowReject] = useState(false);
  const [rejectNotes, setRejectNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const uid = registration?.firebaseUid;

  // Fetch the ID photo whenever a new registration is opened
  const fetchPhoto = useCallback(async () => {
    if (!uid) return;
    setPhoto(null);
    setPhotoError(null);
    setPhotoLoading(true);
    try {
      const res = await getRegistrationPhoto(uid);
      setPhoto(res.idPhotoBase64);
    } catch (err) {
      setPhotoError(extractErrorMessage(err));
    } finally {
      setPhotoLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    if (open && uid) {
      fetchPhoto();
      // Reset reject form on each open
      setShowReject(false);
      setRejectNotes("");
    }
    if (!open) {
      setPhoto(null);
      setPhotoError(null);
      setShowReject(false);
      setRejectNotes("");
    }
  }, [open, uid, fetchPhoto]);

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleApprove = useCallback(async () => {
    if (!uid) return;
    setSubmitting(true);
    try {
      await verifyRegistration(uid, { status: "approved" });
      toast.success("Citizen verified and approved");
      onVerified?.(uid);
      onOpenChange(false);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }, [uid, onVerified, onOpenChange]);

  const handleReject = useCallback(async () => {
    if (!uid) return;
    const notes = rejectNotes.trim();
    if (!notes) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setSubmitting(true);
    try {
      await verifyRegistration(uid, { status: "rejected", notes });
      toast.success("Registration rejected");
      onVerified?.(uid);
      onOpenChange(false);
    } catch (err) {
      toast.error(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }, [uid, rejectNotes, onVerified, onOpenChange]);

  if (!registration) return null;

  const isPending = registration.verificationStatus === "pending";
  const isRejected = registration.verificationStatus === "rejected";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 shrink-0">
          <DialogTitle className="text-[20px] font-semibold text-[#0b1c30]">
            Citizen Registration
          </DialogTitle>
          <DialogDescription className="text-[14px] text-[#747685]">
            Review the applicant's details and ID photo before verifying.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-220px)]">
          <div className="px-6 pb-4 flex flex-col gap-6">
            {/* Header: name + status */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-[20px] text-[#0b1c30] leading-tight">
                  {registration.fullName}
                </p>
                <p className="text-[14px] text-[#444653]">
                  {registration.barangayName}
                  {registration.cityMunicipalityName
                    ? `, ${registration.cityMunicipalityName}`
                    : ""}
                  {registration.provinceName
                    ? `, ${registration.provinceName}`
                    : ""}
                </p>
              </div>
              <StatusBadge status={registration.verificationStatus} />
            </div>

            {/* ID Photo */}
            <div className="flex flex-col gap-2">
              <SectionLabel>ID Photo</SectionLabel>
              <div
                className="relative w-full rounded-md overflow-hidden bg-[#f1f5f9] flex items-center justify-center"
                style={{
                  border: "1px solid #e2e8f0",
                  minHeight: 240,
                  maxHeight: 360,
                }}
              >
                {photoLoading && (
                  <div className="flex flex-col items-center gap-2 py-12 text-[#747685]">
                    <Loader2 className="size-6 animate-spin" />
                    <span className="text-[13px]">Loading photo...</span>
                  </div>
                )}
                {photoError && !photoLoading && (
                  <div className="flex flex-col items-center gap-2 py-12 text-[#dc2626]">
                    <AlertTriangle className="size-6" />
                    <span className="text-[13px]">{photoError}</span>
                  </div>
                )}
                {photo && !photoLoading && (
                  <img
                    src={
                      photo.startsWith("data:")
                        ? photo
                        : `data:image/jpeg;base64,${photo}`
                    }
                    alt="ID photo"
                    className="w-full h-auto max-h-[360px] object-contain"
                  />
                )}
                {!photo && !photoLoading && !photoError && (
                  <span className="text-[13px] text-[#747685] py-12">
                    No photo available
                  </span>
                )}
              </div>
            </div>

            {/* Personal info */}
            <div className="flex flex-col gap-3">
              <SectionLabel>Personal Information</SectionLabel>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <InfoRow label="Full Name" value={registration.fullName} />
                <InfoRow label="Birth Date" value={registration.birthDate} />
                <InfoRow label="Gender" value={registration.gender} />
                <InfoRow label="Nationality" value={registration.nationality} />
                <InfoRow label="Email" value={registration.email} />
                <InfoRow label="Phone" value={registration.phoneNumber} />
                <div className="col-span-2">
                  <InfoRow label="Address" value={registration.address} />
                </div>
              </div>
            </div>

            {/* Location info */}
            <div className="flex flex-col gap-3">
              <SectionLabel>Location</SectionLabel>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <InfoRow label="Region" value={registration.regionName} />
                <InfoRow label="Province" value={registration.provinceName} />
                <InfoRow
                  label="City / Municipality"
                  value={registration.cityMunicipalityName}
                />
                <InfoRow label="Barangay" value={registration.barangayName} />
              </div>
            </div>

            {/* ID info */}
            <div className="flex flex-col gap-3">
              <SectionLabel>ID Information</SectionLabel>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <InfoRow label="ID Type" value={registration.idType} />
                <InfoRow label="ID Number" value={registration.idNumber} />
              </div>
            </div>

            {/* Rejection notes (if rejected) */}
            {isRejected && registration.verificationNotes && (
              <div
                className="flex flex-col gap-2 rounded-md p-3"
                style={{
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-[#b91c1c]">
                  Rejection Reason
                </p>
                <p className="text-sm text-[#0b1c30] break-words">
                  {registration.verificationNotes}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer actions */}
        <DialogFooter className="px-6 py-4 shrink-0 border-t border-[#e2e8f0] flex-col items-stretch gap-3 sm:flex-row sm:items-end">
          {isPending && !showReject && (
            <div className="flex gap-2 w-full sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setShowReject(true)}
                disabled={submitting}
                className="text-[#dc2626] border-[#dc2626] hover:bg-[#fef2f2] hover:text-[#dc2626]"
              >
                <X className="size-4" />
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={submitting}
                className="bg-[#16a34a] text-white hover:bg-[#15803d]"
              >
                <Check className="size-4" />
                Approve
              </Button>
            </div>
          )}

          {isPending && showReject && (
            <div className="flex flex-col gap-2 w-full">
              <label className="text-xs font-medium text-[#747685] uppercase tracking-wide">
                Reason for rejection <span className="text-[#dc2626]">*</span>
              </label>
              <Textarea
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
                placeholder="Explain why this registration is being rejected..."
                rows={3}
                className="resize-none"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReject(false);
                    setRejectNotes("");
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleReject}
                  disabled={submitting || !rejectNotes.trim()}
                  className="bg-[#dc2626] text-white hover:bg-[#b91c1c]"
                >
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <X className="size-4" />
                  )}
                  Confirm Reject
                </Button>
              </div>
            </div>
          )}

          {!isPending && (
            <div className="flex justify-end w-full">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
