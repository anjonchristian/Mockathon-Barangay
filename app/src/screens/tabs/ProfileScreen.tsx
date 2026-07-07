import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useVerification } from "../../context/VerificationContext";

type VerificationStatus = "guest" | "pending" | "approved" | "rejected";

interface ProfileScreenProps {
  onCompleteRegistration: () => void;
}

const STATUS_COLORS: Record<VerificationStatus, string> = {
  guest: "#666666",
  pending: "#F59E0B",
  approved: "#16A34A",
  rejected: "#DC2626",
};

const STATUS_LABELS: Record<VerificationStatus, string> = {
  guest: "Guest",
  pending: "Verification Pending",
  approved: "Verified",
  rejected: "Verification Rejected",
};

export default function ProfileScreen({ onCompleteRegistration }: ProfileScreenProps) {
  const {
    verificationStatus,
    fullName,
    refreshVerificationStatus,
    clearVerification,
  } = useVerification();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshVerificationStatus();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = () => {
    clearVerification();
  };

  const displayName = verificationStatus === "guest" ? "Guest User" : fullName || "User";
  const statusColor = STATUS_COLORS[verificationStatus];
  const statusLabel = STATUS_LABELS[verificationStatus];
  const initials =
    verificationStatus === "guest"
      ? "👤"
      : (fullName || "U")
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: statusColor }]}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{displayName}</Text>
          {verificationStatus !== "guest" && (
            <Text style={styles.location}>Barangay San Isidro, Makati City</Text>
          )}
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusBadgeText}>{statusLabel}</Text>
          </View>
        </View>

        {/* Refresh Status Button */}
        <TouchableOpacity
          style={styles.refreshRow}
          onPress={handleRefresh}
          disabled={isRefreshing}
          accessibilityLabel="Refresh verification status"
          accessibilityRole="button"
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.refreshIcon}>🔄</Text>
          )}
          <Text style={styles.refreshText}>
            {isRefreshing ? "Refreshing..." : "Refresh Status"}
          </Text>
        </TouchableOpacity>

        {/* Guest: Complete Registration Card */}
        {verificationStatus === "guest" && (
          <View style={styles.section}>
            <View style={styles.actionCard}>
              <View style={styles.actionCardHeader}>
                <Text style={styles.actionCardIcon}>📝</Text>
                <Text style={styles.actionCardTitle}>Complete Your Registration</Text>
              </View>
              <Text style={styles.actionCardMessage}>
                Register to access all features like document requests, e-Blotter filing, and live
                staff assistance.
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={onCompleteRegistration}
                accessibilityLabel="Get started with registration"
                accessibilityRole="button"
              >
                <Text style={styles.primaryButtonText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Pending: Status Card */}
        {verificationStatus === "pending" && (
          <View style={styles.section}>
            <View style={[styles.statusCard, { borderColor: STATUS_COLORS.pending }]}>
              <Text style={styles.statusCardIcon}>⏳</Text>
              <Text style={styles.statusCardText}>
                Your registration is being reviewed by barangay staff. This usually takes 1-2
                business days.
              </Text>
            </View>
          </View>
        )}

        {/* Rejected: Status Card + Actions */}
        {verificationStatus === "rejected" && (
          <View style={styles.section}>
            <View style={[styles.statusCard, { borderColor: STATUS_COLORS.rejected }]}>
              <Text style={styles.statusCardIcon}>⚠️</Text>
              <Text style={styles.statusCardText}>
                Your registration was not approved. Please visit your barangay office or contact
                support.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.secondaryButton}
              accessibilityLabel="Contact support"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryButtonText}>Contact Support</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onCompleteRegistration}
              accessibilityLabel="Re-register"
              accessibilityRole="button"
            >
              <Text style={styles.primaryButtonText}>Re-register</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* My Information: only for pending/approved/rejected */}
        {verificationStatus !== "guest" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>My Information</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text style={styles.iconText}>🆔</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Government ID</Text>
                <Text style={styles.infoValue}>
                  {verificationStatus === "approved" ? "Verified" : "Submitted"}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text style={styles.iconText}>📍</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Registered Address</Text>
                <Text style={styles.infoValue}>123 Main St, Brgy. San Isidro</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text style={styles.iconText}>📱</Text>
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Contact Number</Text>
                <Text style={styles.infoValue}>+63 912 345 6789</Text>
              </View>
            </View>
          </View>
        )}

        {/* Activity: full for approved, limited for guest */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>

          {verificationStatus === "guest" ? (
            <Text style={styles.emptyMessage}>
              No activity yet. Complete registration to start using e-Kap services.
            </Text>
          ) : (
            <>
              <TouchableOpacity style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Text style={styles.iconText}>📄</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Document Requests</Text>
                  <Text style={styles.infoValue}>3 requests</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Text style={styles.iconText}>📋</Text>
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Blotter Reports</Text>
                  <Text style={styles.infoValue}>1 report</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Settings: always shown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <TouchableOpacity style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.iconText}>🔔</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Notifications</Text>
              <Text style={styles.infoValue}>Enabled</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.iconText}>🔐</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Privacy & Security</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.iconText}>❓</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Help & Support</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityLabel="Log out"
          accessibilityRole="button"
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
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
  header: {
    alignItems: "center",
    padding: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 4,
  },
  statusBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  refreshRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  refreshIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  refreshText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  actionCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 20,
  },
  actionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  actionCardIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  actionCardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    flex: 1,
  },
  actionCardMessage: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 16,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    marginBottom: 12,
  },
  statusCardIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  statusCardText: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    flex: 1,
  },
  primaryButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 56,
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 56,
    borderWidth: 2,
    borderColor: "#000",
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 16,
    color: "#000",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: "#666",
  },
  arrow: {
    fontSize: 24,
    color: "#666",
  },
  emptyMessage: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  logoutButton: {
    margin: 20,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 56,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
