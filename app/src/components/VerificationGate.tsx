import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useVerification } from "../context/VerificationContext";
import { MaterialCommunityIcons, ICONS } from "./Icons";

interface VerificationGateProps {
  /**
   * Content to render when the user is verified (approved). Optional when
   * the gate is used purely to block access (e.g. filing a new report),
   * in which case only `limitedAccessContent` may be provided.
   */
  children?: React.ReactNode;
  featureName: string;
  onCompleteRegistration: () => void;
  /**
   * Optional content to render in a limited/read-only mode for guests who
   * dismiss the registration prompt by tapping "Maybe Later".
   */
  limitedAccessContent?: React.ReactNode;
}

export default function VerificationGate({
  children,
  featureName,
  onCompleteRegistration,
  limitedAccessContent,
}: VerificationGateProps) {
  const { verificationStatus } = useVerification();
  const [dismissed, setDismissed] = useState(false);

  // Approved users always get full access
  if (verificationStatus === "approved") {
    return <>{children}</>;
  }

  // Guest who dismissed the prompt: show limited access content if provided,
  // otherwise render nothing (feature fully gated).
  if (verificationStatus === "guest" && dismissed) {
    return <>{limitedAccessContent ?? null}</>;
  }

  // Pending user who dismissed the prompt: show limited access content if
  // provided, otherwise render nothing (feature fully gated).
  if (verificationStatus === "pending" && dismissed) {
    return <>{limitedAccessContent ?? null}</>;
  }

  if (verificationStatus === "guest") {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.card}>
            <MaterialCommunityIcons
              name={ICONS.VERIFICATION_LOCKED}
              size={48}
              color="#000"
              style={styles.icon}
            />
            <Text style={styles.title}>Registration Required</Text>
            <Text style={styles.message}>
              You need to complete registration to access {featureName}. This
              helps us verify your identity and protect your community.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onCompleteRegistration}
              accessibilityLabel="Complete registration"
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>Complete Registration</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setDismissed(true)}
              accessibilityLabel="Maybe later, continue with limited access"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (verificationStatus === "pending") {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.card}>
            <MaterialCommunityIcons
              name={ICONS.VERIFICATION_PENDING}
              size={48}
              color="#000"
              style={styles.icon}
            />
            <Text style={styles.title}>Verification in Progress</Text>
            <Text style={styles.message}>
              Your registration is being reviewed by barangay staff. You'll be
              notified once verified. In the meantime, you can continue with
              limited access.
            </Text>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => setDismissed(true)}
              accessibilityLabel="Continue with limited access"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>
                Continue with Limited Access
              </Text>
            </TouchableOpacity>

            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Pending Review</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  if (verificationStatus === "rejected") {
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.card}>
            <MaterialCommunityIcons
              name={ICONS.VERIFICATION_REJECTED}
              size={48}
              color="#000"
              style={styles.icon}
            />
            <Text style={styles.title}>Verification Rejected</Text>
            <Text style={styles.message}>
              Your registration was not approved. Please contact your barangay
              office or re-register.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onCompleteRegistration}
              accessibilityLabel="Contact support"
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>Contact Support</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Fallback: render children (should not normally reach here)
  return <>{children}</>;
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
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: "center",
    width: "100%",
    minHeight: 56,
    justifyContent: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    width: "100%",
    minHeight: 56,
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  secondaryButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  statusBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400E",
  },
});
