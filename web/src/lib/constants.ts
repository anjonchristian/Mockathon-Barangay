// ─── API Configuration ────────────────────────────────────────────────────────

/** Base URL for the Express backend API */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

/** WebSocket URL for the signaling server */
export const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:3001";

/** How often (ms) to poll for new requests */
export const POLL_INTERVAL = 5_000;

/** How often (ms) to poll for missed calls */
export const MISSED_CALLS_POLL_INTERVAL = 10_000;

// ─── Display Constants ────────────────────────────────────────────────────────

/** Mapping from doc type → dot color for Kanban cards */
export const DOC_TYPE_COLORS: Record<string, string> = {
  "Barangay ID": "#002576",
  Clearance: "#8d4f11",
  Certificate: "#62000a",
  default: "#444653",
};
