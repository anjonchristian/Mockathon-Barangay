import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect, useState } from "react";

interface LoadingTransitionProps {
  message?: string;
  duration?: number;
  onComplete?: () => void;
}

export default function LoadingTransition({
  message = "Loading...",
  duration = 1000,
  onComplete,
}: LoadingTransitionProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onComplete) onComplete();
          return 100;
        }
        return prev + (100 / (duration / 50));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#22c55e" />
      <Text style={styles.message}>{message}</Text>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>{Math.round(progress)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  message: {
    fontSize: 18,
    color: "#333333",
    marginTop: 24,
    textAlign: "center",
  },
  progressBarContainer: {
    width: "80%",
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginTop: 32,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    color: "#666666",
    marginTop: 12,
  },
});
