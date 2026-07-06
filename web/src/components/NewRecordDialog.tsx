import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { createRequest, extractErrorMessage } from "@/lib/api";
import type { Gender, IdType } from "@/lib/api";

// ─── Walk-in UID helpers ───────────────────────────────────────────────────────

const WALKIN_UID_KEY = "ekap_walkin_uid";

function getWalkinUid(): string {
  let uid = localStorage.getItem(WALKIN_UID_KEY);
  if (!uid) {
    uid = `walkin-${crypto.randomUUID().slice(0, 8)}`;
    localStorage.setItem(WALKIN_UID_KEY, uid);
  }
  return uid;
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface NewRecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a record is successfully created */
  onCreated?: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function NewRecordDialog({
  open,
  onOpenChange,
  onCreated,
}: NewRecordDialogProps) {
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<Gender>("Male");
  const [idType, setIdType] = useState<IdType>("barangay_id");
  const [idNumber, setIdNumber] = useState("");
  const [nationality, setNationality] = useState("Filipino");
  const [photoBase64, setPhotoBase64] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  // Reset form to defaults
  const resetForm = useCallback(() => {
    setFullName("");
    setAddress("");
    setBirthDate("");
    setGender("Male");
    setIdType("barangay_id");
    setIdNumber("");
    setNationality("Filipino");
    setPhotoBase64("");
    setFileName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // Handle file selection → read as base64
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // result is "data:image/...;base64,..." — strip the prefix
        const base64 = result.split(",")[1] ?? "";
        setPhotoBase64(base64);
      };
      reader.onerror = () => {
        toast.error("Failed to read image file");
      };
      reader.readAsDataURL(file);
    },
    [],
  );

  // Submit the form
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate required fields
      if (!fullName.trim()) {
        toast.error("Full name is required");
        return;
      }
      if (!address.trim()) {
        toast.error("Address is required");
        return;
      }
      if (!birthDate) {
        toast.error("Birth date is required");
        return;
      }
      if (!idNumber.trim()) {
        toast.error("ID number is required");
        return;
      }
      if (!photoBase64) {
        toast.error("ID photo is required");
        return;
      }

      setSubmitting(true);
      try {
        await createRequest({
          firebaseUid: getWalkinUid(),
          fullName: fullName.trim(),
          address: address.trim(),
          birthDate,
          gender,
          idType,
          idNumber: idNumber.trim(),
          idPhotoBase64: photoBase64,
          nationality: nationality.trim() || "Filipino",
        });

        toast.success("Walk-in record created", {
          description: `${fullName.trim()} — pending review`,
        });
        resetForm();
        onOpenChange(false);
        onCreated?.();
      } catch (err) {
        toast.error(extractErrorMessage(err));
      } finally {
        setSubmitting(false);
      }
    },
    [
      fullName,
      address,
      birthDate,
      gender,
      idType,
      idNumber,
      photoBase64,
      nationality,
      resetForm,
      onOpenChange,
      onCreated,
    ],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-semibold text-[20px] text-[#0b1c30]">
            New Walk-in Record
          </DialogTitle>
          <DialogDescription className="text-[14px] text-[#747685]">
            Create a new document request for a walk-in resident.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 mt-2">
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="nr-fullName"
              className="font-medium text-[14px] text-[#444653]"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="nr-fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Juan Dela Cruz"
              required
              className="bg-white h-10 w-full rounded-sm px-3 py-2 font-normal text-[16px] text-[#0b1c30] placeholder:text-[#747685] outline-none focus:ring-1 focus:ring-[#002576]"
              style={{ border: "1px solid #c4c5d5" }}
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="nr-address"
              className="font-medium text-[14px] text-[#444653]"
            >
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="nr-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 123 Rizal St., Barangay Poblacion"
              required
              rows={3}
              className="bg-white w-full rounded-sm px-3 py-2 font-normal text-[16px] text-[#0b1c30] placeholder:text-[#747685] outline-none focus:ring-1 focus:ring-[#002576] resize-none"
              style={{ border: "1px solid #c4c5d5" }}
            />
          </div>

          {/* Birth Date + Nationality row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="nr-birthDate"
                className="font-medium text-[14px] text-[#444653]"
              >
                Birth Date <span className="text-red-500">*</span>
              </label>
              <input
                id="nr-birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="bg-white h-10 w-full rounded-sm px-3 py-2 font-normal text-[16px] text-[#0b1c30] outline-none focus:ring-1 focus:ring-[#002576]"
                style={{ border: "1px solid #c4c5d5" }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="nr-nationality"
                className="font-medium text-[14px] text-[#444653]"
              >
                Nationality
              </label>
              <input
                id="nr-nationality"
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="Filipino"
                className="bg-white h-10 w-full rounded-sm px-3 py-2 font-normal text-[16px] text-[#0b1c30] placeholder:text-[#747685] outline-none focus:ring-1 focus:ring-[#002576]"
                style={{ border: "1px solid #c4c5d5" }}
              />
            </div>
          </div>

          {/* Gender + ID Type row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="nr-gender"
                className="font-medium text-[14px] text-[#444653]"
              >
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                id="nr-gender"
                value={gender}
                onChange={(e) => setGender(e.target.value as Gender)}
                required
                className="bg-white h-10 w-full rounded-sm px-3 py-2 font-normal text-[16px] text-[#0b1c30] outline-none focus:ring-1 focus:ring-[#002576] appearance-none"
                style={{ border: "1px solid #c4c5d5" }}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="nr-idType"
                className="font-medium text-[14px] text-[#444653]"
              >
                ID Type <span className="text-red-500">*</span>
              </label>
              <select
                id="nr-idType"
                value={idType}
                onChange={(e) => setIdType(e.target.value as IdType)}
                required
                className="bg-white h-10 w-full rounded-sm px-3 py-2 font-normal text-[16px] text-[#0b1c30] outline-none focus:ring-1 focus:ring-[#002576] appearance-none"
                style={{ border: "1px solid #c4c5d5" }}
              >
                <option value="barangay_id">Barangay ID</option>
                <option value="national_id">National ID</option>
              </select>
            </div>
          </div>

          {/* ID Number */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="nr-idNumber"
              className="font-medium text-[14px] text-[#444653]"
            >
              ID Number <span className="text-red-500">*</span>
            </label>
            <input
              id="nr-idNumber"
              type="text"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              placeholder="e.g. BRGY-2026-00123"
              required
              className="bg-white h-10 w-full rounded-sm px-3 py-2 font-normal text-[16px] text-[#0b1c30] placeholder:text-[#747685] outline-none focus:ring-1 focus:ring-[#002576]"
              style={{ border: "1px solid #c4c5d5" }}
            />
          </div>

          {/* ID Photo Upload */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="nr-photo"
              className="font-medium text-[14px] text-[#444653]"
            >
              Upload ID Photo <span className="text-red-500">*</span>
            </label>
            <div
              className="flex items-center gap-3 bg-white h-10 w-full rounded-sm px-3 outline-none focus-within:ring-1 focus-within:ring-[#002576]"
              style={{ border: "1px solid #c4c5d5" }}
            >
              <input
                ref={fileInputRef}
                id="nr-photo"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                required
                className="flex-1 text-[14px] text-[#0b1c30] file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-[14px] file:font-medium file:bg-[#002576] file:text-white file:cursor-pointer hover:file:opacity-90 cursor-pointer"
              />
            </div>
            {fileName && (
              <p className="text-[12px] text-[#747685] mt-0.5">
                Selected: {fileName}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="bg-white h-12 px-6 rounded-sm font-medium text-[16px] text-[#0b1c30] hover:bg-gray-50 transition-colors"
              style={{ border: "1px solid #c4c5d5" }}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#002576] h-12 px-6 rounded-sm font-medium text-[16px] text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting && (
                <div className="animate-spin rounded-full size-4 border-2 border-white border-t-transparent" />
              )}
              {submitting ? "Creating..." : "Create Record"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
