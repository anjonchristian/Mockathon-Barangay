import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";

export default function EBlotterScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>e-Blotter</Text>
        <Text style={styles.subtitle}>
          File incident reports and track status
        </Text>

        <TouchableOpacity
          style={styles.newReportButton}
          accessibilityLabel="File new incident report"
          accessibilityRole="button"
        >
          <Text style={styles.newReportButtonText}>+ File New Report</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Recent Reports</Text>

        <View style={styles.reportList}>
          <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>Noise Complaint</Text>
              <View style={[styles.statusBadge, styles.statusPending]}>
                <Text style={styles.statusText}>Under Review</Text>
              </View>
            </View>
            <Text style={styles.reportDate}>Filed: Jan 15, 2026</Text>
            <Text style={styles.reportDescription}>
              Loud music from neighbor's house past 10 PM
            </Text>
          </View>

          <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>Property Dispute</Text>
              <View style={[styles.statusBadge, styles.statusScheduled]}>
                <Text style={styles.statusText}>Mediation Scheduled</Text>
              </View>
            </View>
            <Text style={styles.reportDate}>Filed: Jan 10, 2026</Text>
            <Text style={styles.reportDescription}>
              Boundary fence issue with adjacent lot
            </Text>
          </View>

          <View style={styles.reportCard}>
            <View style={styles.reportHeader}>
              <Text style={styles.reportTitle}>Lost Item Report</Text>
              <View style={[styles.statusBadge, styles.statusResolved]}>
                <Text style={styles.statusText}>Resolved</Text>
              </View>
            </View>
            <Text style={styles.reportDate}>Filed: Jan 5, 2026</Text>
            <Text style={styles.reportDescription}>
              Lost wallet near barangay hall
            </Text>
          </View>
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
  newReportButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 24,
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  newReportButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  reportList: {
    gap: 16,
  },
  reportCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 12,
  },
  statusPending: {
    backgroundColor: "#FEF3C7",
  },
  statusScheduled: {
    backgroundColor: "#DBEAFE",
  },
  statusResolved: {
    backgroundColor: "#D1FAE5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  reportDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  reportDescription: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
