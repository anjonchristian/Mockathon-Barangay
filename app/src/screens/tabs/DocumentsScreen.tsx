import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function DocumentsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Documents</Text>
        <Text style={styles.subtitle}>
          Request barangay documents and certificates
        </Text>

        <View style={styles.documentList}>
          <TouchableOpacity
            style={styles.documentCard}
            accessibilityLabel="Request Barangay Clearance"
            accessibilityRole="button"
          >
            <View style={styles.documentIcon}>
              <Text style={styles.iconText}>📄</Text>
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>Barangay Clearance</Text>
              <Text style={styles.documentDescription}>
                Certificate of good moral character
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.documentCard}
            accessibilityLabel="Request Certificate of Indigency"
            accessibilityRole="button"
          >
            <View style={styles.documentIcon}>
              <Text style={styles.iconText}>💳</Text>
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>Certificate of Indigency</Text>
              <Text style={styles.documentDescription}>
                For financial assistance applications
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.documentCard}
            accessibilityLabel="Request Barangay ID"
            accessibilityRole="button"
          >
            <View style={styles.documentIcon}>
              <Text style={styles.iconText}>🆔</Text>
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>Barangay ID</Text>
              <Text style={styles.documentDescription}>
                Official barangay identification card
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.documentCard}
            accessibilityLabel="Request Certificate of Residency"
            accessibilityRole="button"
          >
            <View style={styles.documentIcon}>
              <Text style={styles.iconText}>🏠</Text>
            </View>
            <View style={styles.documentInfo}>
              <Text style={styles.documentTitle}>Certificate of Residency</Text>
              <Text style={styles.documentDescription}>
                Proof of address in the barangay
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  documentList: {
    gap: 16,
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    minHeight: 80,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E6F4FE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 14,
    color: "#666",
  },
  arrow: {
    fontSize: 24,
    color: "#666",
    marginLeft: 12,
  },
});
