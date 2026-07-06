import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useState } from "react";

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Juan Dela Cruz</Text>
            <Text style={styles.profileSubtitle}>Barangay ID Request</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Status: Pending</Text>
            </View>
          </View>
        </View>

        {/* My Information Section */}
        <Text style={styles.sectionTitle}>My Information</Text>

        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>📍</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>
              Barangay San Jose, City of Makati
            </Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            accessible={true}
            accessibilityLabel="Edit location"
            accessibilityRole="button"
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>📱</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>+63 912 345 6789</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            accessible={true}
            accessibilityLabel="Edit phone"
            accessibilityRole="button"
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoIcon}>📧</Text>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>juan@email.com</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            accessible={true}
            accessibilityLabel="Edit email"
            accessibilityRole="button"
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Section */}
        <Text style={styles.sectionTitle}>Settings</Text>

        <View style={styles.settingItem}>
          <Text style={styles.settingIcon}>🔔</Text>
          <Text style={styles.settingLabel}>Notifications</Text>
          <TouchableOpacity
            style={[
              styles.toggle,
              notificationsEnabled ? styles.toggleOn : styles.toggleOff,
            ]}
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            accessible={true}
            accessibilityLabel="Toggle notifications"
            accessibilityRole="switch"
            accessibilityState={{ checked: notificationsEnabled }}
          >
            <View
              style={[
                styles.toggleThumb,
                notificationsEnabled ? styles.toggleThumbOn : styles.toggleThumbOff,
              ]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingIcon}>🌙</Text>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <TouchableOpacity
            style={[
              styles.toggle,
              darkModeEnabled ? styles.toggleOn : styles.toggleOff,
            ]}
            onPress={() => setDarkModeEnabled(!darkModeEnabled)}
            accessible={true}
            accessibilityLabel="Toggle dark mode"
            accessibilityRole="switch"
            accessibilityState={{ checked: darkModeEnabled }}
          >
            <View
              style={[
                styles.toggleThumb,
                darkModeEnabled ? styles.toggleThumbOn : styles.toggleThumbOff,
              ]}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.settingItem}
          accessible={true}
          accessibilityLabel="Text size settings"
          accessibilityRole="button"
        >
          <Text style={styles.settingIcon}>🔤</Text>
          <Text style={styles.settingLabel}>Text Size</Text>
          <Text style={styles.settingValue}>Medium ▼</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          accessible={true}
          accessibilityLabel="Language settings"
          accessibilityRole="button"
        >
          <Text style={styles.settingIcon}>🌐</Text>
          <Text style={styles.settingLabel}>Language</Text>
          <Text style={styles.settingValue}>English ▼</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          accessible={true}
          accessibilityLabel="Add emergency contact"
          accessibilityRole="button"
        >
          <Text style={styles.settingIcon}>📞</Text>
          <Text style={styles.settingLabel}>Emergency Contact</Text>
          <Text style={styles.settingValue}>Add Contact</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          accessible={true}
          accessibilityLabel="View help and support"
          accessibilityRole="button"
        >
          <Text style={styles.settingIcon}>❓</Text>
          <Text style={styles.settingLabel}>Help & Support</Text>
          <Text style={styles.settingValue}>View FAQ</Text>
        </TouchableOpacity>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          accessible={true}
          accessibilityLabel="Sign out"
          accessibilityRole="button"
        >
          <Text style={styles.signOutIcon}>🚪</Text>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
    marginTop: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 18,
    color: "#000",
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 16,
    color: "#22c55e",
    fontWeight: "600",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  settingIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  settingLabel: {
    flex: 1,
    fontSize: 18,
    color: "#000",
  },
  settingValue: {
    fontSize: 16,
    color: "#6b7280",
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
  },
  toggleOn: {
    backgroundColor: "#22c55e",
  },
  toggleOff: {
    backgroundColor: "#d1d5db",
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  toggleThumbOn: {
    alignSelf: "flex-end",
  },
  toggleThumbOff: {
    alignSelf: "flex-start",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 48,
    minHeight: 56,
    marginTop: 24,
    marginBottom: 16,
  },
  signOutIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  signOutButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
