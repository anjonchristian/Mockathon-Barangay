import axios from "axios";

// API base URL from environment variable
// Falls back to Android emulator default if not set
const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000/api";

export interface OcrResult {
  fullName: string | null;
  address: string | null;
  birthDate: string | null;
  gender: "Male" | "Female" | "Other" | null;
  nationality: string | null;
  idNumber: string | null;
  idType: "national_id" | "barangay_id" | null;
}

export interface BarangayIDRequestPayload {
  firebaseUid: string;
  fullName: string;
  address: string;
  birthDate: string;
  gender: "Male" | "Female" | "Other";
  nationality: string;
  idType: "national_id" | "barangay_id";
  idNumber: string;
  idPhotoBase64: string;
}

export interface RegistrationPayload {
  firebaseUid: string;
  email?: string;
  phoneNumber?: string;
  fullName: string;
  regionCode: string;
  regionName: string;
  provinceCode: string;
  provinceName: string;
  cityMunicipalityCode: string;
  cityMunicipalityName: string;
  cityMunicipalityType: "city" | "municipality";
  barangayCode: string;
  barangayName: string;
  idPhotoBase64: string;
  idType: "national_id" | "barangay_id" | "other";
  idNumber?: string;
  address?: string;
  birthDate?: string;
  gender?: "Male" | "Female" | "Other";
  nationality?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface RequestListResponse {
  success: boolean;
  data: BarangayIDRequestDoc[];
  total: number;
  page: number;
  limit: number;
}

export interface BarangayIDRequestDoc {
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

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

// Request timing interceptor for debugging
api.interceptors.request.use((config) => {
  if (config.url === "/ocr") {
    (config as any)._startTime = Date.now();
  }
  return config;
});

api.interceptors.response.use((response) => {
  const startTime = (response.config as any)._startTime;
  if (startTime) {
    const elapsed = Date.now() - startTime;
    console.log(`OCR request took ${elapsed}ms`);
  }
  return response;
});

/**
 * POST /api/ocr - Send ID image for OCR extraction
 * Sends the image as multipart/form-data (actual JPEG)
 */
export async function extractOCR(imageBase64: string): Promise<OcrResult> {
  // Convert base64 to blob for multipart upload
  const byteString = atob(imageBase64);
  const mimeType = "image/jpeg";
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeType });

  const formData = new FormData();
  formData.append("image", blob, "captured-id.jpeg");

  const response = await api.post<ApiResponse<OcrResult>>("/ocr", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (!response.data.success) {
    throw new Error(response.data.error || "OCR extraction failed");
  }

  return response.data.data;
}

/**
 * POST /api/requests - Submit a barangay ID request
 */
export async function submitRequest(
  payload: BarangayIDRequestPayload
): Promise<BarangayIDRequestDoc> {
  const response = await api.post<ApiResponse<BarangayIDRequestDoc>>(
    "/requests",
    payload,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to submit request");
  }

  return response.data.data;
}

/**
 * GET /api/requests/:id - Get request status by ID
 */
export async function getRequestStatus(
  id: string
): Promise<BarangayIDRequestDoc> {
  const response = await api.get<ApiResponse<BarangayIDRequestDoc>>(
    `/requests/${id}`
  );

  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to fetch request status");
  }

  return response.data.data;
}

/**
 * POST /api/registration - Register a new user
 */
export async function registerUser(
  payload: RegistrationPayload
): Promise<{ userId: string; verificationStatus: string }> {
  const response = await api.post<ApiResponse<{ userId: string; verificationStatus: string }>>(
    "/registration",
    payload,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to register user");
  }

  return response.data.data;
}

/**
 * GET /api/registration/:firebaseUid - Get user registration status
 */
export async function getRegistrationStatus(
  firebaseUid: string
): Promise<{ userId: string; verificationStatus: string; isVerified: boolean }> {
  const response = await api.get<
    ApiResponse<{ userId: string; verificationStatus: string; isVerified: boolean }>
  >(`/registration/${firebaseUid}`);

  if (!response.data.success) {
    throw new Error(response.data.error || "Failed to fetch registration status");
  }

  return response.data.data;
}
