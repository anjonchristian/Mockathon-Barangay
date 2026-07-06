import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import ProgressBar from "../components/ProgressBar";

interface WelcomeCompletionScreenProps {
  userName: string;
  requestId: string;
  onGoToMainApp: () => void;
}

export default function WelcomeCompletionScreen({
  userName,
  requestId,
  onGoToMainApp,
}: WelcomeCompletionScreenProps) {
  const features = [
    {
      icon: "📄",
      title: "Request Documents",
      description: "Get barangay clearance, certificates, and IDs",
    },
    {
      icon: "📋",
      title: "File Incident Reports",
      description: "Report issues and track mediation schedules",
    },
    {
      icon: "🤖",
      title: "Get AI Assistance",
      description: "Chat with our AI helper for quick answers",
    },
    {
      icon: "👤",
      title: "Manage Your Profile",
      description: "Update your information and settings",
    },
  ];

  return (
    <View style={styles.container}>
      <ProgressBar currentStep={3} totalSteps={3} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Success Section */}
        <View style={styles.successSection}>
          <View style={styles.successIconContainer}>
            <Text style={styles.successIcon}>✅</Text>
          </View>
          <Text style={styles.successTitle}>Registration Complete!</Text>
          <Text style={styles.successSubtitle}>Welcome to e-Kap, {userName}!</Text>
        </View>

        {/* Request ID Display */}
        <View style={styles.requestIdSection}>
          <Text style={styles.requestIdLabel}>Request ID</Text>
          <View style={styles.requestIdContainer}>
            <Text style={styles.requestId}>#{requestId}</Text>
            <TouchableOpacity
              style={styles.copyButton}
              accessible={true}
              accessibilityLabel="Copy request ID"
              accessibilityRole="button"
              accessibilityHint="Copy the request ID to clipboard"
            >
              <Text style={styles.copyButtonText}>📋</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Information Message */}
        <View style={styles.infoSection}>
          <Text style={styles.infoText}>
            Your barangay ID request has been submitted successfully. We will notify you once your request is processed. This may take 1-3 business days.
          </Text>
        </View>

        {/* Feature Preview */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>What you can do now:</Text>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={styles.featureCard}
              accessible={true}
              accessibilityLabel={feature.title}
              accessibilityHint={feature.description}
              accessibilityRole="button"
            >
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Go to Main App Button */}
        <TouchableOpacity
          style={styles.mainAppButton}
          onPress={onGoToMainApp}
          accessible={true}
          accessibilityLabel="Go to main app"
          accessibilityRole="button"
          accessibilityHint="Navigate to the main application screen"
        >
          <Text style={styles.mainAppButtonText}>Go to Main App</Text>
          <Text style={styles.mainAppButtonArrow}>→</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  successSection: {
    alignItems: "center",
    paddingVertical: 32,
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    marginBottom: 24,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successIcon: {
    fontSize: 48,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
  requestIdSection: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  requestIdLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  requestIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  requestId: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    fontFamily: "monospace",
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  copyButtonText: {
    fontSize: 20,
  },
  infoSection: {
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  infoText: {
    fontSize: 16,
    color: "#1e40af",
    lineHeight: 24,
  },
  featuresSection: {
    marginBottom: 24,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
  },
  mainAppButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 48,
    minHeight: 56,
    marginBottom: 16,
  },
  mainAppButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
  },
  mainAppButtonArrow: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});
