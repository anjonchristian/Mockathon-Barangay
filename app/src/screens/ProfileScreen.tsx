import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import { getCurrentUser } from "../services/firebase";

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  barangay: string;
  idNumber?: string;
  idStatus: "pending" | "approved" | "rejected" | "none";
}

export default function ProfileScreen() {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: "Juan Dela Cruz",
    email: "juan@example.com",
    phone: "09123456789",
    address: "123 Main Street",
    barangay: "Barangay 1, Quezon City",
    idNumber: "QC-2024-0001",
    idStatus: "approved",
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            // Handle logout logic
            Alert.alert("Logged Out", "You have been logged out successfully.");
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing feature coming soon!");
  };

  const handleRequestID = () => {
    Alert.alert("Request ID", "Navigate to ID request flow");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#22c55e";
      case "pending":
        return "#f59e0b";
      case "rejected":
        return "#ef4444";
      default:
        return "#666";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Approved";
      case "pending":
        return "Pending Review";
      case "rejected":
        return "Rejected";
      default:
        return "Not Requested";
    }
  };

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>JD</Text>
      </View>
      <Text style={styles.profileName}>{userProfile.fullName}</Text>
      <Text style={styles.profileEmail}>{userProfile.email}</Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={handleEditProfile}
        accessibilityLabel="Edit profile"
        accessibilityRole="button"
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );

  const renderIDCard = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Barangay ID</Text>
      <View style={styles.idCard}>
        <View style={styles.idCardHeader}>
          <Text style={styles.idCardTitle}>Barangay ID</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(userProfile.idStatus) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(userProfile.idStatus)}</Text>
          </View>
        </View>
        {userProfile.idStatus !== "none" ? (
          <View style={styles.idCardBody}>
            <View style={styles.idCardRow}>
              <Text style={styles.idCardLabel}>ID Number:</Text>
              <Text style={styles.idCardValue}>{userProfile.idNumber}</Text>
            </View>
            <View style={styles.idCardRow}>
              <Text style={styles.idCardLabel}>Name:</Text>
              <Text style={styles.idCardValue}>{userProfile.fullName}</Text>
            </View>
            <View style={styles.idCardRow}>
              <Text style={styles.idCardLabel}>Barangay:</Text>
              <Text style={styles.idCardValue}>{userProfile.barangay}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.idCardBody}>
            <Text style={styles.noIdText}>
              You don't have a Barangay ID yet. Request one to access exclusive services.
            </Text>
            <TouchableOpacity
              style={styles.requestIdButton}
              onPress={handleRequestID}
              accessibilityLabel="Request Barangay ID"
              accessibilityRole="button"
            >
              <Text style={styles.requestIdButtonText}>Request ID</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  const renderPersonalInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{userProfile.phone}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{userProfile.email}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address</Text>
          <Text style={styles.infoValue}>{userProfile.address}</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Barangay</Text>
          <Text style={styles.infoValue}>{userProfile.barangay}</Text>
        </View>
      </View>
    </View>
  );

  const renderSettings = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Settings</Text>
      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive updates about your requests
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#e5e7eb", true: "#22c55e" }}
            thumbColor="#fff"
            accessibilityLabel="Toggle push notifications"
            accessibilityRole="switch"
          />
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Use dark theme for the app
            </Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
            trackColor={{ false: "#e5e7eb", true: "#22c55e" }}
            thumbColor="#fff"
            accessibilityLabel="Toggle dark mode"
            accessibilityRole="switch"
          />
        </View>
      </View>
    </View>
  );

  const renderContactInfo = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Barangay Contact</Text>
      <View style={styles.contactCard}>
        <View style={styles.contactRow}>
          <Text style={styles.contactIcon}>📍</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Address</Text>
            <Text style={styles.contactValue}>
              Barangay Hall, Main Street
            </Text>
          </View>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.contactRow}>
          <Text style={styles.contactIcon}>📞</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Phone</Text>
            <Text style={styles.contactValue}>+63 2 8123 4567</Text>
          </View>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.contactRow}>
          <Text style={styles.contactIcon}>🕐</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactLabel}>Office Hours</Text>
            <Text style={styles.contactValue}>
              Mon-Fri: 8:00 AM - 5:00 PM
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={styles.section}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => Alert.alert("Help", "Help center coming soon!")}
        accessibilityLabel="Get help"
        accessibilityRole="button"
      >
        <Text style={styles.actionButtonText}>❓ Help & Support</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => Alert.alert("About", "e-Kap v1.0.0\nYour digital barangay services companion")}
        accessibilityLabel="About e-Kap"
        accessibilityRole="button"
      >
        <Text style={styles.actionButtonText}>ℹ️ About e-Kap</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.logoutButton]}
        onPress={handleLogout}
        accessibilityLabel="Logout"
        accessibilityRole="button"
      >
        <Text style={[styles.actionButtonText, styles.logoutButtonText]}>🚪 Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentPadding}>
      {renderProfileHeader()}
      {renderIDCard()}
      {renderPersonalInfo()}
      {renderSettings()}
      {renderContactInfo()}
      {renderActions()}
      <Text style={styles.versionText}>e-Kap v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  contentPadding: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#22c55e",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  editButton: {
    borderWidth: 1,
    borderColor: "#22c55e",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 8,
    minHeight: 40,
    justifyContent: "center",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#22c55e",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  idCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  idCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  idCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  idCardBody: {
    paddingTop: 8,
  },
  idCardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  idCardLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  idCardValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "600",
  },
  noIdText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 20,
  },
  requestIdButton: {
    backgroundColor: "#22c55e",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    minHeight: 44,
    justifyContent: "center",
  },
  requestIdButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    minHeight: 48,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#f3f4f6",
    marginLeft: 16,
  },
  settingsCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    minHeight: 48,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: "#666",
  },
  contactCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  contactRow: {
    flexDirection: "row",
    padding: 16,
    minHeight: 48,
    alignItems: "center",
  },
  contactIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
  },
  actionButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    minHeight: 48,
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  logoutButton: {
    borderColor: "#ef4444",
  },
  logoutButtonText: {
    color: "#ef4444",
  },
  versionText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 24,
  },
});
