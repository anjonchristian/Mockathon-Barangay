import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <Text style={styles.name}>Juan Dela Cruz</Text>
          <Text style={styles.location}>Barangay San Isidro, Makati City</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Information</Text>

          <TouchableOpacity style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.iconText}>🆔</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Government ID</Text>
              <Text style={styles.infoValue}>Verified</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.iconText}>📍</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Registered Address</Text>
              <Text style={styles.infoValue}>123 Main St, Brgy. San Isidro</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Text style={styles.iconText}>📱</Text>
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Contact Number</Text>
              <Text style={styles.infoValue}>+63 912 345 6789</Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity</Text>

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
        </View>

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
    backgroundColor: "#000",
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
