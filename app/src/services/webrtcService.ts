import axios from "axios";

const API_BASE = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000/api";
const WS_URL = process.env.EXPO_PUBLIC_WS_URL || "ws://10.0.2.2:3001";

export type CallStatus = "pending" | "connected" | "ended" | "rejected" | "timeout";
export type CallType = "audio" | "video";

export interface CallRequest {
  userId: string;
  type: CallType;
  reason?: string;
}

export interface CallState {
  callId: string | null;
  status: CallStatus;
  type: CallType;
  startTime: Date | null;
}

export interface StaffStatus {
  staffAvailable: boolean;
  estimatedWaitTime: number;
}

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

export async function requestCall(
  userId: string,
  type: CallType,
  reason?: string
): Promise<{ callId: string; status: string }> {
  const { data } = await api.post("/webrtc/call", { userId, type, reason });
  if (!data.success) throw new Error(data.error || "Failed to request call");
  return data.data;
}

export async function getCallStatus(
  callId: string
): Promise<{ callId: string; status: CallStatus; type: CallType }> {
  const { data } = await api.get(`/webrtc/call/${callId}`);
  if (!data.success) throw new Error(data.error || "Failed to get call status");
  return data.data;
}

export async function endCall(callId: string): Promise<void> {
  const { data } = await api.delete(`/webrtc/call/${callId}`);
  if (!data.success) throw new Error(data.error || "Failed to end call");
}

export async function sendSignal(
  callId: string,
  type: "offer" | "answer" | "ice-candidate",
  signalData: unknown,
  userId: string
): Promise<void> {
  const { data } = await api.post("/webrtc/signal", {
    callId,
    type,
    data: signalData,
    userId,
  });
  if (!data.success) throw new Error(data.error || "Failed to send signal");
}

export async function checkStaffStatus(): Promise<StaffStatus> {
  const { data } = await api.get("/chat/staff-status");
  if (!data.success) throw new Error(data.error || "Failed to check staff status");
  return data.data;
}

export async function sendChatMessage(
  message: string,
  context?: { userId?: string; location?: Record<string, string> }
): Promise<{
  message: string;
  canEscalate: boolean;
  staffAvailable: boolean;
  suggestedActions?: string[];
}> {
  const { data } = await api.post("/chat", { message, context });
  if (!data.success) throw new Error(data.error || "Failed to send chat message");
  return data.data;
}

export async function logWatchdogTimeout(callId: string): Promise<void> {
  const { data } = await api.post("/watchdog", { callId, timeout: 15000 });
  if (!data.success) throw new Error(data.error || "Failed to log watchdog timeout");
}

const WATCHDOG_TIMEOUT_MS = 15000;

export class WatchdogTimer {
  private timer: ReturnType<typeof setTimeout> | null = null;
  private onTimeout: (() => void) | null = null;

  start(callback: () => void): void {
    this.stop();
    this.onTimeout = callback;
    this.timer = setTimeout(() => {
      this.onTimeout?.();
      this.timer = null;
    }, WATCHDOG_TIMEOUT_MS);
  }

  stop(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.onTimeout = null;
  }

  isRunning(): boolean {
    return this.timer !== null;
  }
}

export class SignalingClient {
  private ws: WebSocket | null = null;
  private listeners: Array<(msg: Record<string, unknown>) => void> = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private shouldReconnect = true;
  private userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }

  connect(): void {
    const url = `${WS_URL}/mobile?uid=${this.userId}`;
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data as string);
        this.listeners.forEach((cb) => cb(msg));
      } catch {
        // ignore malformed messages
      }
    };

    this.ws.onclose = () => {
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      // error handling via onclose
    };
  }

  disconnect(): void {
    this.shouldReconnect = false;
    this.ws?.close();
    this.ws = null;
  }

  onMessage(cb: (msg: Record<string, unknown>) => void): () => void {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== cb);
    };
  }

  send(msg: Record<string, unknown>): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  private scheduleReconnect(): void {
    if (!this.shouldReconnect) return;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

    const delay = 2000 * Math.pow(1.5, this.reconnectAttempts);
    this.reconnectAttempts++;

    setTimeout(() => {
      if (this.shouldReconnect) this.connect();
    }, delay);
  }
}
