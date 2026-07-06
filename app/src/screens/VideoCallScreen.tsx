import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  WatchdogTimer,
  requestCall,
  endCall,
  logWatchdogTimeout,
  checkStaffStatus,
} from "../services/webrtcService";

interface VideoCallScreenProps {
  userId: string;
  onEndCall: () => void;
  onCallbackRequested: () => void;
}

type ConnectionState = "connecting" | "ringing" | "connected" | "ended" | "timeout" | "unavailable";

export default function VideoCallScreen({
  userId,
  onEndCall,
  onCallbackRequested,
}: VideoCallScreenProps) {
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [callId, setCallId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [watchdogRemaining, setWatchdogRemaining] = useState(15);
  const watchdogRef = useRef(new WatchdogTimer());
  const elapsedTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const watchdogTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    initiateCall();

    return () => {
      watchdogRef.current.stop();
      if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
      if (watchdogTimerRef.current) clearInterval(watchdogTimerRef.current);
    };
  }, []);

  const initiateCall = async () => {
    try {
      const staffStatus = await checkStaffStatus();
      if (!staffStatus.staffAvailable) {
        setConnectionState("unavailable");
        return;
      }

      setConnectionState("ringing");
      const result = await requestCall(userId, "video", "Resident requesting video call");
      setCallId(result.callId);

      setWatchdogRemaining(15);
      watchdogTimerRef.current = setInterval(() => {
        setWatchdogRemaining((prev) => {
          if (prev <= 1) {
            if (watchdogTimerRef.current) clearInterval(watchdogTimerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      watchdogRef.current.start(() => {
        handleWatchdogTimeout(result.callId);
      });

      // Simulate connection for demo
      setTimeout(() => {
        if (connectionState !== "timeout" && connectionState !== "ended") {
          setConnectionState("connected");
          watchdogRef.current.stop();
          if (watchdogTimerRef.current) clearInterval(watchdogTimerRef.current);

          elapsedTimerRef.current = setInterval(() => {
            setElapsed((prev) => prev + 1);
          }, 1000);
        }
      }, 3000);
    } catch {
      setConnectionState("unavailable");
    }
  };

  const handleWatchdogTimeout = useCallback(async (failedCallId: string) => {
    setConnectionState("timeout");
    if (watchdogTimerRef.current) clearInterval(watchdogTimerRef.current);

    try {
      await logWatchdogTimeout(failedCallId);
    } catch {
      // watchdog logging is best-effort
    }
  }, []);

  const handleEndCall = async () => {
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    if (watchdogTimerRef.current) clearInterval(watchdogTimerRef.current);
    watchdogRef.current.stop();
    setConnectionState("ended");

    if (callId) {
      try {
        await endCall(callId);
      } catch {
        // best-effort end
      }
    }

    onEndCall();
  };

  const handleRequestCallback = () => {
    onCallbackRequested();
    Alert.alert(
      "Callback Requested",
      "A barangay staff member will call you back as soon as they are available.",
      [{ text: "OK", onPress: onEndCall }]
    );
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (connectionState === "unavailable") {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.statusIcon}>📵</Text>
          <Text style={styles.statusTitle}>Staff Unavailable</Text>
          <Text style={styles.statusText}>
            No barangay staff members are currently available for video calls.
          </Text>

          <TouchableOpacity
            style={styles.callbackButton}
            onPress={handleRequestCallback}
            accessibilityLabel="Request a callback"
            accessibilityRole="button"
          >
            <Text style={styles.callbackButtonText}>Request Callback</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={onEndCall}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (connectionState === "timeout") {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.statusIcon}>⏰</Text>
          <Text style={styles.statusTitle}>No Response</Text>
          <Text style={styles.statusText}>
            The staff did not respond within 15 seconds. Would you like to request a callback?
          </Text>

          <TouchableOpacity
            style={styles.callbackButton}
            onPress={handleRequestCallback}
            accessibilityLabel="Request a callback"
            accessibilityRole="button"
          >
            <Text style={styles.callbackButtonText}>Request Callback</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => {
              setConnectionState("connecting");
              initiateCall();
            }}
            accessibilityLabel="Try again"
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={onEndCall}
            accessibilityLabel="Cancel and go back"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Remote video area */}
      <View style={styles.remoteVideo}>
        <View style={styles.remoteVideoPlaceholder}>
          {connectionState === "connected" ? (
            <>
              <Text style={styles.remoteVideoIcon}>👤</Text>
              <Text style={styles.remoteVideoText}>Barangay Staff</Text>
            </>
          ) : (
            <>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.connectingText}>
                {connectionState === "ringing"
                  ? `Ringing... (${watchdogRemaining}s)`
                  : "Connecting..."}
              </Text>
            </>
          )}
        </View>
      </View>

      {/* Local video (self-view) */}
      <View style={styles.localVideo}>
        <View style={styles.localVideoPlaceholder}>
          {isCameraOff ? (
            <Text style={styles.cameraOffIcon}>📷</Text>
          ) : (
            <Text style={styles.selfViewText}>You</Text>
          )}
        </View>
      </View>

      {/* Call info */}
      {connectionState === "connected" && (
        <View style={styles.callInfo}>
          <Text style={styles.callDuration}>{formatTime(elapsed)}</Text>
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, isMuted && styles.controlButtonActive]}
          onPress={() => setIsMuted(!isMuted)}
          accessibilityLabel={isMuted ? "Unmute microphone" : "Mute microphone"}
          accessibilityRole="button"
        >
          <Text style={styles.controlIcon}>{isMuted ? "🔇" : "🎤"}</Text>
          <Text style={styles.controlLabel}>{isMuted ? "Unmute" : "Mute"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endCallButton}
          onPress={handleEndCall}
          accessibilityLabel="End call"
          accessibilityRole="button"
        >
          <Text style={styles.endCallIcon}>📞</Text>
          <Text style={styles.endCallLabel}>End</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, isCameraOff && styles.controlButtonActive]}
          onPress={() => setIsCameraOff(!isCameraOff)}
          accessibilityLabel={isCameraOff ? "Turn camera on" : "Turn camera off"}
          accessibilityRole="button"
        >
          <Text style={styles.controlIcon}>{isCameraOff ? "📷" : "📹"}</Text>
          <Text style={styles.controlLabel}>{isCameraOff ? "Camera On" : "Camera Off"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  statusIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  statusTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
    textAlign: "center",
  },
  statusText: {
    fontSize: 16,
    color: "#ccc",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  callbackButton: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    marginBottom: 16,
    minWidth: 250,
    alignItems: "center",
    minHeight: 64,
    justifyContent: "center",
  },
  callbackButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  retryButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    marginBottom: 16,
    minWidth: 250,
    alignItems: "center",
    minHeight: 64,
    justifyContent: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: "transparent",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#666",
    paddingVertical: 18,
    paddingHorizontal: 32,
    minWidth: 250,
    alignItems: "center",
    minHeight: 64,
    justifyContent: "center",
  },
  backButtonText: {
    color: "#ccc",
    fontSize: 18,
    fontWeight: "600",
  },
  remoteVideo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  remoteVideoPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  remoteVideoIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  remoteVideoText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },
  connectingText: {
    fontSize: 18,
    color: "#ccc",
    marginTop: 16,
  },
  localVideo: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#fff",
  },
  localVideoPlaceholder: {
    flex: 1,
    backgroundColor: "#2a2a4e",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraOffIcon: {
    fontSize: 32,
    opacity: 0.5,
  },
  selfViewText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  callInfo: {
    position: "absolute",
    top: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  callDuration: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 20,
    gap: 24,
  },
  controlButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonActive: {
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  controlIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  controlLabel: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "500",
  },
  endCallButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },
  endCallIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  endCallLabel: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
});
