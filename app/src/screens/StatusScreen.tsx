import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { getRequestStatus } from "../services/api";

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
          icon: "✅",
          title: "Approved!",
          subtitle: "Your Barangay ID request has been approved.",
          color: "#22c55e",
        };
      case "rejected":
        return {
          icon: "❌",
          title: "Not Approved",
          subtitle:
            "Your Barangay ID request was not approved. Please contact the barangay hall.",
          color: "#ef4444",
        };
      default:
        return {
          icon: "⏳",
          title: "Pending Review",
          subtitle:
            "Your Barangay ID request has been submitted and is pending staff review.",
          color: "#f59e0b",
        };
    }
  };

  const display = getStatusDisplay();

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>{display.icon}</Text>
      </View>

      <Text style={[styles.title, { color: display.color }]}>
        {display.title}
      </Text>

      <Text style={styles.subtitle}>{display.subtitle}</Text>

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
  iconText: {
    fontSize: 40,
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
    marginBottom: 24,
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
