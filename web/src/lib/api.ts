// ═══════════════════════════════════════════════════════════════════════════════
// API Service Layer — e-Kap Barangay Management System
// Connects the web frontend to the Express backend at VITE_API_URL.
// ═══════════════════════════════════════════════════════════════════════════════

import axios, { type AxiosError, type AxiosInstance } from "axios";
import type {
  Registration,
  VerificationStatus,
  Blotter,
  BlotterStatus,
  Staff,
  StaffRole,
} from "@/types";

// ─── Configuration ────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:3001";

// ─── Types: Match Backend Models Exactly ──────────────────────────────────────

/** Possible statuses for a Barangay ID request */
export type RequestStatus =
  | "pending_review"
  | "processing"
  | "approved"
  | "completed"
  | "rejected";

/** Gender enum as stored in the backend */
export type Gender = "Male" | "Female" | "Other";

/** ID type enum */
export type IdType = "national_id" | "barangay_id";

/**
 * BarangayIDRequest — matches the Mongoose model in
 * backend/src/models/BarangayIDRequest.ts
 */
export interface BarangayIDRequest {
  _id: string;
  firebaseUid: string;
  fullName: string;
  address: string;
  birthDate: string; // "YYYY-MM-DD"
  gender: Gender;
  nationality: string;
  idType: IdType;
  idNumber: string;
  idPhotoBase64: string;
  status: RequestStatus;
  staffNotes?: string;
  createdAt: string; // ISO date string from JSON
  updatedAt: string; // ISO date string from JSON
}

/**
 * Payload for creating a new request.
 * `nationality` defaults to "Filipino" on the backend.
 */
export interface CreateRequestPayload {
  firebaseUid: string;
  fullName: string;
  address: string;
  birthDate: string;
  gender: Gender;
  idType: IdType;
  idNumber: string;
  idPhotoBase64: string;
  nationality?: string;
}

/**
 * Payload for updating a request status (PATCH).
 * Valid transitions:
 *   pending_review → processing | rejected   (approve / reject)
 *   processing     → approved | rejected      (mark ready / reject)
 *   approved       → completed                (mark completed)
 */
export interface UpdateRequestPayload {
  status: Extract<
    RequestStatus,
    "processing" | "approved" | "completed" | "rejected"
  >;
  staffNotes?: string;
}

// ─── OCR Types ────────────────────────────────────────────────────────────────

/**
 * Result returned by the OCR endpoint — each field may be null
 * if Gemini could not read it.
 */
export interface OcrResult {
  fullName: string | null;
  address: string | null;
  birthDate: string | null; // YYYY-MM-DD
  gender: Gender | null;
  nationality: string; // defaults to "Filipino"
  idNumber: string | null;
  idType: IdType | null;
}

// ─── Missed Call Types ────────────────────────────────────────────────────────

/**
 * MissedCallLog — matches the Mongoose model in
 * backend/src/models/MissedCallLog.ts
 */
export interface MissedCallLog {
  _id: string;
  firebaseUid: string;
  requestedAt: string; // ISO date string
  createdAt: string; // ISO date string
}

/** Payload for logging a missed call */
export interface CreateMissedCallPayload {
  firebaseUid: string;
  requestedAt: string; // ISO date string or date-compatible string
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

/**
 * Standard success wrapper for single-resource endpoints.
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/**
 * Paginated list response from GET /api/requests
 */
export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Standard error wrapper — every error response follows this shape.
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
}

/**
 * Union type for any API response.
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── WebSocket Protocol ───────────────────────────────────────────────────────

/**
 * Message sent between peers through the signaling server.
 */
export interface SignalingMessage {
  type: "offer" | "answer" | "ice-candidate";
  target: string;
  data: unknown;
}

/**
 * Server-sent message when an offer goes unanswered for 15s.
 */
export interface WatchdogTimeoutMessage {
  type: "watchdog_timeout";
}

/**
 * Union of all possible WebSocket messages the admin client can receive.
 */
export type WsIncomingMessage = SignalingMessage | WatchdogTimeoutMessage;

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

// ─── Error Handling Helpers ──────────────────────────────────────────────────

/**
 * Extract a human-readable error message from an Axios error.
 *
 * Backend always returns `{ success: false, error: "message" }` so we
 * try to read `response.data.error` first, then fall back to the status
 * text or a generic message.
 */
export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<ApiErrorResponse>;
    // The backend wraps errors as { success: false, error: "..." }
    if (axiosErr.response?.data?.error) {
      return axiosErr.response.data.error;
    }
    // Network / timeout errors
    if (axiosErr.code === "ECONNABORTED") return "Request timed out";
    if (!axiosErr.response) return "Network error — server unreachable";
    // HTTP status text fallback
    return axiosErr.response.statusText || `HTTP ${axiosErr.response.status}`;
  }
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred";
}

/**
 * Type guard to check if a response succeeded.
 */
export function isSuccess<T>(res: ApiResponse<T>): res is ApiSuccessResponse<T> {
  return res.success === true;
}

// ─── Endpoint Functions ───────────────────────────────────────────────────────

// ─── OCR ──────────────────────────────────────────────────────────────────────

/**
 * POST /api/ocr
 *
 * Upload an ID image for OCR extraction via Gemini 2.0 Flash.
 * Sends multipart/form-data with the image file.
 *
 * @param file - A File or Blob representing the ID photo.
 * @returns The extracted fields (some may be null if unreadable).
 *
 * @example
 * const file = fileInput.files[0];
 * const result = await ocrImage(file);
 * if (result) prefillForm(result);
 */
export async function ocrImage(file: File | Blob): Promise<OcrResult> {
  const formData = new FormData();
  formData.append("image", file);

  const { data } = await api.post<ApiResponse<OcrResult>>("/ocr", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    // OCR can take a while — allow up to 60s
    timeout: 60_000,
  });

  if (!isSuccess(data)) {
    throw new Error(data.error);
  }

  return data.data;
}

// ─── Requests ─────────────────────────────────────────────────────────────────

/**
 * POST /api/requests
 *
 * Create a new Barangay ID request.
 *
 * @throws {Error} If validation fails or server error.
 */
export async function createRequest(
  payload: CreateRequestPayload
): Promise<BarangayIDRequest> {
  const { data } = await api.post<ApiResponse<BarangayIDRequest>>(
    "/requests",
    payload
  );

  if (!isSuccess(data)) {
    throw new Error(data.error);
  }

  return data.data;
}

/**
 * GET /api/requests
 *
 * List requests with optional status filter and pagination.
 *
 * @param params.status - Filter by status (omit for all).
 * @param params.page   - Page number (default 1).
 * @param params.limit  - Items per page (default 20, max 100).
 *
 * @example
 * // Get first 10 pending requests
 * const res = await listRequests({ status: "pending_review", page: 1, limit: 10 });
 * console.log(res.data, res.total);
 */
export async function listRequests(params?: {
  status?: RequestStatus;
  page?: number;
  limit?: number;
}): Promise<ApiPaginatedResponse<BarangayIDRequest>> {
  const query: Record<string, string> = {};

  if (params?.status) query.status = params.status;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const { data } = await api.get<ApiPaginatedResponse<BarangayIDRequest>>(
    "/requests",
    { params: query }
  );

  // The backend always returns 200 with the paginated shape on success.
  return data;
}

/**
 * GET /api/requests/:id
 *
 * Fetch a single request by its MongoDB ObjectId.
 *
 * @throws {Error} If the request is not found (404) or server error.
 */
export async function getRequest(id: string): Promise<BarangayIDRequest> {
  const { data } = await api.get<ApiResponse<BarangayIDRequest>>(
    `/requests/${id}`
  );

  if (!isSuccess(data)) {
    throw new Error(data.error);
  }

  return data.data;
}

/**
 * PATCH /api/requests/:id
 *
 * Approve or reject a request. Optionally include staff notes.
 *
 * @throws {Error} If status is invalid, request not found, or server error.
 *
 * @example
 * // Approve
 * await updateRequest("abc123", { status: "approved" });
 *
 * // Reject with note
 * await updateRequest("abc123", { status: "rejected", staffNotes: "Blurry photo" });
 */
export async function updateRequest(
  id: string,
  payload: UpdateRequestPayload
): Promise<BarangayIDRequest> {
  const { data } = await api.patch<ApiResponse<BarangayIDRequest>>(
    `/requests/${id}`,
    payload
  );

  if (!isSuccess(data)) {
    throw new Error(data.error);
  }

  return data.data;
}

// ─── Watchdog / Missed Calls ──────────────────────────────────────────────────

/**
 * POST /api/watchdog/missed-call
 *
 * Log a missed call from a resident.
 *
 * @throws {Error} If firebaseUid or requestedAt is missing.
 */
export async function createMissedCall(
  payload: CreateMissedCallPayload
): Promise<MissedCallLog> {
  const { data } = await api.post<ApiResponse<MissedCallLog>>(
    "/watchdog/missed-call",
    payload
  );

  if (!isSuccess(data)) {
    throw new Error(data.error);
  }

  return data.data;
}

/**
 * GET /api/watchdog/missed-calls
 *
 * List the 50 most recent missed calls, newest first.
 */
export async function listMissedCalls(): Promise<MissedCallLog[]> {
  const { data } = await api.get<ApiResponse<MissedCallLog[]>>(
    "/watchdog/missed-calls"
  );

  if (!isSuccess(data)) {
    throw new Error(data.error);
  }

  return data.data;
}

// ─── Citizen Registrations ────────────────────────────────────────────────────

/**
 * Paginated list response shape returned by GET /api/registration.
 */
export interface RegistrationListResponse {
  data: Registration[];
  total: number;
  page: number;
  limit: number;
}

/**
 * GET /api/registration
 *
 * List citizen registrations with optional status filter and pagination.
 * NOTE: The list endpoint excludes `idPhotoBase64` for performance —
 * fetch the photo separately via getRegistrationPhoto().
 *
 * @param params.status - Filter by verification status (omit for all).
 * @param params.page   - Page number (default 1).
 * @param params.limit  - Items per page (default 20).
 */
export async function listRegistrations(params?: {
  status?: VerificationStatus;
  page?: number;
  limit?: number;
}): Promise<RegistrationListResponse> {
  const query: Record<string, string> = {};

  if (params?.status) query.status = params.status;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const { data } = await api.get<RegistrationListResponse>(
    "/registration",
    { params: query }
  );

  return data;
}

/**
 * GET /api/registration/:firebaseUid
 *
 * Fetch a single citizen registration by Firebase UID.
 *
 * @throws {Error} If the registration is not found (404) or server error.
 */
export async function getRegistration(firebaseUid: string): Promise<Registration> {
  const { data } = await api.get<ApiResponse<Registration>>(
    `/registration/${firebaseUid}`
  );

  if (!isSuccess(data)) {
    throw new Error(data.error);
  }

  return data.data;
}

/**
 * GET /api/registration/:firebaseUid/photo
 *
 * Fetch the ID photo (base64) for a registration. Kept separate from the
 * list endpoint for performance.
 */
export async function getRegistrationPhoto(
  firebaseUid: string
): Promise<{ idPhotoBase64: string }> {
  const { data } = await api.get<ApiResponse<{ idPhotoBase64: string }>>(
    `/registration/${firebaseUid}/photo`
  );

  if (!isSuccess(data)) {
    throw new Error(data.error);
  }

  return data.data;
}

/**
 * PUT /api/registration/:firebaseUid/verify
 *
 * Approve or reject a citizen registration. Optionally include notes
 * (required for rejections on the frontend).
 *
 * @throws {Error} If status is invalid, registration not found, or server error.
 *
 * @example
 * // Approve
 * await verifyRegistration("uid123", { status: "approved" });
 *
 * // Reject with notes
 * await verifyRegistration("uid123", { status: "rejected", notes: "Unclear ID photo" });
 */
export async function verifyRegistration(
  firebaseUid: string,
  payload: { status: "approved" | "rejected"; notes?: string }
): Promise<Registration> {
  const { data } = await api.put<ApiResponse<Registration>>(
    `/registration/${firebaseUid}/verify`,
    payload
  );

  if (!isSuccess(data)) {
    throw new Error(data.error);
  }

  return data.data;
}

// ─── Blotter Reports ──────────────────────────────────────────────────────────

/**
 * Paginated list response shape returned by GET /api/blotter.
 */
export interface BlotterListResponse {
  data: Blotter[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Payload for PATCH /api/blotter/:id — all fields optional.
 */
export interface UpdateBlotterPayload {
  status?: BlotterStatus;
  mediationDate?: string | null;
  mediationNotes?: string;
  staffNotes?: string;
  resolutionNotes?: string;
}

/**
 * GET /api/blotter
 *
 * List blotter reports with optional status filter and pagination.
 *
 * @param params.status - Filter by status (omit for all).
 * @param params.page   - Page number (default 1).
 * @param params.limit  - Items per page (default 20).
 */
export async function listBlotters(params?: {
  status?: BlotterStatus;
  page?: number;
  limit?: number;
}): Promise<BlotterListResponse> {
  const query: Record<string, string> = {};

  if (params?.status) query.status = params.status;
  if (params?.page) query.page = String(params.page);
  if (params?.limit) query.limit = String(params.limit);

  const { data } = await api.get<BlotterListResponse>("/blotter", {
    params: query,
  });

  return data;
}

/**
 * GET /api/blotter/:id
 *
 * Fetch a single blotter report by its MongoDB ObjectId.
 *
 * @throws {Error} If the blotter is not found (404) or server error.
 */
export async function getBlotter(id: string): Promise<Blotter> {
  const { data } = await api.get<ApiResponse<Blotter>>(`/blotter/${id}`);

  if (!isSuccess(data)) {
    throw new Error(data.error);
  }

  return data.data;
}

/**
 * PATCH /api/blotter/:id
 *
 * Update a blotter report — status, mediation details, or staff notes.
 * All fields are optional; only provided fields are updated.
 *
 * @throws {Error} If the blotter is not found or server error.
 *
 * @example
 * // Change status
 * await updateBlotter("abc123", { status: "resolved" });
 *
 * // Schedule mediation
 * await updateBlotter("abc123", {
 *   status: "scheduled_mediation",
 *   mediationDate: "2025-01-15T09:00:00.000Z",
 *   mediationNotes: "Both parties requested to attend."
 * });
 */
export async function updateBlotter(
  id: string,
  payload: UpdateBlotterPayload
): Promise<Blotter> {
  const { data } = await api.patch<ApiResponse<Blotter>>(
    `/blotter/${id}`,
    payload
  );

  if (!isSuccess(data)) {
    throw new Error(data.error);
  }

  return data.data;
}

/**
 * DELETE /api/blotter/:id
 *
 * Delete a blotter report permanently.
 *
 * @throws {Error} If the blotter is not found or server error.
 */
export async function deleteBlotter(id: string): Promise<void> {
  await api.delete<ApiResponse<null>>(`/blotter/${id}`);
}

// ─── Staff Management ─────────────────────────────────────────────────────────

/** Payload for creating a new staff member */
export interface CreateStaffPayload {
  firebaseUid?: string;
  email: string;
  fullName: string;
  role?: StaffRole;
  position?: string;
  barangayCode?: string;
  barangayName?: string;
  cityMunicipalityCode?: string;
  cityMunicipalityName?: string;
  isActive?: boolean;
  phoneNumber?: string;
}

/** Payload for updating a staff member (all fields optional) */
export interface UpdateStaffPayload {
  firebaseUid?: string;
  email?: string;
  fullName?: string;
  role?: StaffRole;
  position?: string;
  barangayCode?: string;
  barangayName?: string;
  cityMunicipalityCode?: string;
  cityMunicipalityName?: string;
  isActive?: boolean;
  phoneNumber?: string;
}

/**
 * GET /api/staff
 *
 * List all staff members. Pass `isActive` to filter by active/inactive.
 */
export async function listStaff(params?: {
  isActive?: boolean;
}): Promise<Staff[]> {
  const query: Record<string, string> = {};
  if (params?.isActive !== undefined) {
    query.isActive = String(params.isActive);
  }
  const { data } = await api.get<ApiResponse<Staff[]>>("/staff", {
    params: query,
  });
  if (!isSuccess(data)) {
    throw new Error(data.error);
  }
  return data.data;
}

/**
 * GET /api/staff/:id
 *
 * Fetch a single staff member by MongoDB ObjectId.
 */
export async function getStaff(id: string): Promise<Staff> {
  const { data } = await api.get<ApiResponse<Staff>>(`/staff/${id}`);
  if (!isSuccess(data)) {
    throw new Error(data.error);
  }
  return data.data;
}

/**
 * POST /api/staff
 *
 * Create a new staff member.
 */
export async function createStaff(
  payload: CreateStaffPayload
): Promise<Staff> {
  const { data } = await api.post<ApiResponse<Staff>>("/staff", payload);
  if (!isSuccess(data)) {
    throw new Error(data.error);
  }
  return data.data;
}

/**
 * PATCH /api/staff/:id
 *
 * Update a staff member (role, position, isActive, etc.).
 */
export async function updateStaff(
  id: string,
  payload: UpdateStaffPayload
): Promise<Staff> {
  const { data } = await api.patch<ApiResponse<Staff>>(
    `/staff/${id}`,
    payload
  );
  if (!isSuccess(data)) {
    throw new Error(data.error);
  }
  return data.data;
}

/**
 * DELETE /api/staff/:id
 *
 * Delete a staff member permanently.
 */
export async function deleteStaff(id: string): Promise<void> {
  await api.delete<ApiResponse<null>>(`/staff/${id}`);
}

// ─── Analytics ────────────────────────────────────────────────────────────────

/**
 * Overview payload returned by GET /api/analytics/overview.
 */
export interface AnalyticsOverview {
  registrations: Record<string, number>;
  requests: Record<string, number>;
  blotters: Record<string, number>;
  totalMissedCalls: number;
  avgProcessingTimeHours: number | null;
  daily: Array<{
    date: string;
    registrations: number;
    requests: number;
    blotters: number;
  }>;
}

/**
 * GET /api/analytics/overview
 *
 * Aggregated counts across registrations, document requests, blotter
 * reports, missed calls, plus daily totals for the last 7 days.
 */
export async function getAnalyticsOverview(): Promise<AnalyticsOverview> {
  const { data } = await api.get<ApiResponse<AnalyticsOverview>>(
    "/analytics/overview"
  );
  if (!isSuccess(data)) {
    throw new Error(data.error);
  }
  return data.data;
}

// ─── Health Check ─────────────────────────────────────────────────────────────

/**
 * GET /
 *
 * Quick health check to verify the API is reachable.
 */
export async function healthCheck(): Promise<{ message: string; version: string }> {
  const { data } = await api.get<{ message: string; version: string }>("/");
  return data;
}

// ─── WebSocket Client ─────────────────────────────────────────────────────────

/**
 * Lightweight WebSocket client for the signaling server.
 *
 * Usage:
 * ```ts
 * const ws = new SignalingClient("admin");
 * ws.onMessage((msg) => {
 *   if (msg.type === "offer") handleOffer(msg);
 * });
 * ws.sendOffer({ sdp: "...", target: "mobile-uid" });
 * ws.disconnect();
 * ```
 */
export class SignalingClient {
  private ws: WebSocket | null = null;
  private listeners: Array<(msg: WsIncomingMessage) => void> = [];
  private onOpenCbs: Array<() => void> = [];
  private onCloseCbs: Array<() => void> = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private shouldReconnect = true;
  private role: "admin" | "mobile";
  private uid: string | undefined;

  /**
   * @param role  - "admin" or "mobile" — determines the URL path.
   * @param uid   - Optional unique identifier for this client.
   */
  constructor(role: "admin" | "mobile", uid?: string) {
    this.role = role;
    this.uid = uid;
  }

  /**
   * Open the WebSocket connection.
   */
  connect(): void {
    const url = `${WS_URL}/${this.role}${this.uid ? `?uid=${this.uid}` : ""}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.onOpenCbs.forEach((cb) => cb());
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const msg: WsIncomingMessage = JSON.parse(event.data);
        this.listeners.forEach((cb) => cb(msg));
      } catch {
        console.warn("[SignalingClient] Failed to parse message:", event.data);
      }
    };

    this.ws.onclose = () => {
      this.onCloseCbs.forEach((cb) => cb());
      this.scheduleReconnect();
    };

    this.ws.onerror = (err) => {
      console.error("[SignalingClient] WebSocket error:", err);
    };
  }

  /**
   * Disconnect and stop attempting reconnection.
   */
  disconnect(): void {
    this.shouldReconnect = false;
    this.ws?.close();
    this.ws = null;
  }

  /**
   * Register a callback for every incoming message.
   */
  onMessage(cb: (msg: WsIncomingMessage) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  /**
   * Register a callback for when the connection opens.
   */
  onOpen(cb: () => void): () => void {
    this.onOpenCbs.push(cb);
    return () => {
      this.onOpenCbs = this.onOpenCbs.filter((l) => l !== cb);
    };
  }

  /**
   * Register a callback for when the connection closes.
   */
  onClose(cb: () => void): () => void {
    this.onCloseCbs.push(cb);
    return () => {
      this.onCloseCbs = this.onCloseCbs.filter((l) => l !== cb);
    };
  }

  // ── Send helpers ────────────────────────────────────────────────────────

  sendOffer(target: string, data: unknown): void {
    this.send({ type: "offer", target, data });
  }

  sendAnswer(target: string, data: unknown): void {
    this.send({ type: "answer", target, data });
  }

  sendIceCandidate(target: string, data: unknown): void {
    this.send({ type: "ice-candidate", target, data });
  }

  private send(msg: SignalingMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    } else {
      console.warn("[SignalingClient] Cannot send — WebSocket not open");
    }
  }

  // ── Reconnection ─────────────────────────────────────────────────────────

  private scheduleReconnect(): void {
    if (!this.shouldReconnect) return;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn("[SignalingClient] Max reconnect attempts reached");
      return;
    }

    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts);
    this.reconnectAttempts++;

    setTimeout(() => {
      if (this.shouldReconnect) this.connect();
    }, delay);
  }
}

export default api;
