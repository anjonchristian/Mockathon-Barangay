import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export interface BarangayIDRequest {
  _id: string;
  firebaseUid: string;
  fullName: string;
  address: string;
  birthDate: string;
  gender: string;
  nationality: string;
  idType: string;
  idNumber: string;
  idPhotoBase64: string;
  status: "pending_review" | "approved" | "rejected";
  staffNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MissedCallEntry {
  _id: string;
  firebaseUid: string;
  requestedAt: string;
  createdAt: string;
}

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

/**
 * GET /api/requests - Fetch requests with optional status filter
 */
export async function fetchRequests(status?: string): Promise<BarangayIDRequest[]> {
  const params: Record<string, string> = { limit: "50" };
  if (status) params.status = status;

  const response = await api.get<{
    success: boolean;
    data: BarangayIDRequest[];
    total: number;
    page: number;
    limit: number;
  }>("/requests", { params });

  if (!response.data.success) {
    throw new Error("Failed to fetch requests");
  }
  return response.data.data;
}

/**
 * PATCH /api/requests/:id - Update request status (approve/reject)
 */
export async function updateRequestStatus(
  id: string,
  status: "approved" | "rejected",
  staffNotes?: string
): Promise<BarangayIDRequest> {
  const response = await api.patch<{ success: boolean; data: BarangayIDRequest }>(
    `/requests/${id}`,
    { status, staffNotes }
  );

  if (!response.data.success) {
    throw new Error("Failed to update request status");
  }
  return response.data.data;
}

/**
 * GET /api/watchdog/missed-calls - Fetch missed calls
 */
export async function fetchMissedCalls(): Promise<MissedCallEntry[]> {
  const response = await api.get<{ success: boolean; data: MissedCallEntry[] }>(
    "/watchdog/missed-calls"
  );

  if (!response.data.success) {
    throw new Error("Failed to fetch missed calls");
  }
  return response.data.data;
}
