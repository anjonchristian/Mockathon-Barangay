import { useState, useEffect, useCallback, useRef } from "react";
import { SignalingClient } from "@/lib/api";

export interface IncomingCallInfo {
  target: string;
  data: unknown;
}

interface UseSignalingReturn {
  /** The active incoming call, or null */
  incomingCall: IncomingCallInfo | null;
  /** Whether the WebSocket is connected */
  connected: boolean;
  /** Accept the current incoming call */
  acceptCall: () => void;
  /** Decline the current incoming call */
  declineCall: () => void;
}

/**
 * Hook that connects to the WebSocket signaling server as an admin client.
 *
 * - Listens for incoming "offer" messages and surfaces them via `incomingCall`.
 * - Provides `acceptCall` / `declineCall` actions to dismiss the prompt.
 *
 * @example
 * ```tsx
 * const { incomingCall, connected, acceptCall, declineCall } = useSignaling();
 *
 * return (
 *   <>
 *     {incomingCall && (
 *       <IncomingCallToast
 *         callerName="Lolo Cardo"
 *         onAccept={acceptCall}
 *         onDecline={declineCall}
 *       />
 *     )}
 *   </>
 * );
 * ```
 */
export function useSignaling(): UseSignalingReturn {
  const [incomingCall, setIncomingCall] = useState<IncomingCallInfo | null>(null);
  const [connected, setConnected] = useState(false);
  const clientRef = useRef<SignalingClient | null>(null);

  useEffect(() => {
    const client = new SignalingClient("admin");
    clientRef.current = client;

    client.onOpen(() => {
      setConnected(true);
    });

    client.onClose(() => {
      setConnected(false);
    });

    client.onMessage((msg) => {
      if (msg.type === "offer") {
        // An incoming video call from a resident — surface the toast
        setIncomingCall({ target: msg.target, data: msg.data });
      }
      if (msg.type === "watchdog_timeout") {
        // No answer received within 15s — clear any pending call
        setIncomingCall((prev) => prev?.target ? prev : null);
      }
    });

    client.connect();

    return () => {
      client.disconnect();
      clientRef.current = null;
    };
  }, []);

  const acceptCall = useCallback(() => {
    const call = incomingCall;
    if (!call) return;
    // Send an answer back through the signaling channel
    clientRef.current?.sendAnswer(call.target, { accepted: true });
    setIncomingCall(null);
  }, [incomingCall]);

  const declineCall = useCallback(() => {
    const call = incomingCall;
    if (!call) return;
    // Notify the caller that we declined
    clientRef.current?.sendAnswer(call.target, { accepted: false });
    setIncomingCall(null);
  }, [incomingCall]);

  return {
    incomingCall,
    connected,
    acceptCall,
    declineCall,
  };
}
