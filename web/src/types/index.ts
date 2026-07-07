// ─── Frontend Display Models ───────────────────────────────────────────────────
// These types bridge the backend API models (from lib/api.ts) to the UI.

/** Kanban statuses used in the dashboard board */
export type KanbanStatus = "pending" | "processing" | "pickup";

/** A card displayed in the Kanban board */
export interface KanbanCard {
  id: string;
  fullName: string;
  docType: string;
  dotColor: string;
  timeAgo: string;
  status: KanbanStatus;
  photoBase64?: string;
}

/** A missed call entry for the Urgencies panel */
export interface MissedCallDisplay {
  id: string;
  name: string;
  timeAgo: string;
  callbackDone: boolean;
}

// ─── Citizen Registration Models ──────────────────────────────────────────────

/** Verification status for a citizen registration */
export type VerificationStatus = "pending" | "approved" | "rejected";

/**
 * Registration — matches the backend User model used by the
 * /api/registration endpoints. The list endpoint excludes
 * `idPhotoBase64` for performance; fetch it separately via
 * getRegistrationPhoto().
 */
export interface Registration {
  _id: string;
  firebaseUid: string;
  fullName: string;
  email?: string;
  phoneNumber?: string;
  regionCode: string;
  regionName: string;
  provinceCode: string;
  provinceName: string;
  cityMunicipalityCode: string;
  cityMunicipalityName: string;
  cityMunicipalityType: "city" | "municipality";
  barangayCode: string;
  barangayName: string;
  idType: string;
  idNumber?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Compute a human-readable relative time string from an ISO date.
 * e.g. "10m ago", "2h ago", "1d ago"
 */
export function timeAgo(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;

  if (diffMs < 0) return "just now";

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `${seconds}s ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  return new Date(isoDate).toLocaleDateString();
}

/**
 * Map backend doc type to display color dot.
 */
export function getDocTypeColor(docType: string): string {
  const colors: Record<string, string> = {
    "Barangay ID": "#002576",
    Clearance: "#8d4f11",
    Certificate: "#62000a",
  };
  return colors[docType] ?? "#444653";
}
