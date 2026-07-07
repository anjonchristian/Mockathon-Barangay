import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { getRequestStatus } from "../services/api";
import { MaterialCommunityIcons, ICONS } from "../components/Icons";

interface StatusScreenProps {
  requestId: string;
  onDone: () => void;
}

export default function StatusScreen({ requestId, onDone }: StatusScreenProps) {
  const [status, setStatus] = useState<string>("pending_review");
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetchStatus();
    // Poll every 10 seconds for status updates
    intervalRef.current = setInterval(fetchStatus, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const fetchStatus = async () => {
    try {
      const doc = await getRequestStatus(requestId);
      setStatus(doc.status);
    } catch {
      // Silently fail on poll
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = () => {
    switch (status) {
      case "approved":
        return {
          icon: ICONS.STATUS_SUCCESS,
          title: "Approved!",
          subtitle: "Your Barangay ID request has been approved.",
          instruction: "You may now visit the barangay hall to claim your ID.",
          color: "#22c55e",
        };
      case "rejected":
        return {
          icon: ICONS.STATUS_ERROR,
          title: "Not Approved",
          subtitle:
            "Your Barangay ID request was not approved. Please contact the barangay hall.",
          instruction: "Please visit the barangay hall for assistance with your request.",
          color: "#ef4444",
        };
      default:
        return {
          icon: ICONS.VERIFICATION_PENDING,
          title: "Pending Review",
          subtitle:
            "Your Barangay ID request has been submitted and is pending staff review.",
          instruction: "We will notify you once your request is processed. This may take 1-3 business days.",
          color: "#f59e0b",
        };
    }
  };

  const display = getStatusDisplay();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons name={display.icon} size={48} color={display.color} />
      </View>

      <Text style={[styles.title, { color: display.color }]}>
        {display.title}
      </Text>

      <Text style={styles.subtitle}>{display.subtitle}</Text>

      <View style={styles.instructionBox}>
        <Text style={styles.instructionText}>{display.instruction}</Text>
      </View>

      <View style={styles.idContainer}>
        <Text style={styles.idLabel}>Request ID</Text>
        <Text style={styles.idValue}>{requestId}</Text>
      </View>

      {loading && (
        <ActivityIndicator size="small" color="#666" style={{ marginTop: 16 }} />
      )}

      <TouchableOpacity
        style={styles.doneButton}
        onPress={onDone}
        accessibilityLabel="Done - return to home"
        accessibilityRole="button"
        accessibilityHint="Return to the welcome screen to start a new request"
      >
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  iconContainer: {
    marginBottom: 24,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 16,
  },
  instructionBox: {
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  instructionText: {
    fontSize: 16,
    color: "#166534",
    textAlign: "center",
    lineHeight: 22,
  },
  idContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    width: "100%",
    marginBottom: 32,
  },
  idLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  idValue: {
    fontSize: 14,
    color: "#333",
    fontFamily: "monospace",
  },
  doneButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
