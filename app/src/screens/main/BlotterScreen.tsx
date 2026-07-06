import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function BlotterScreen() {
  const myReports = [
    {
      title: "Noise Complaint",
      status: "Under Review",
      date: "Jan 20, 2026",
      mediation: "Feb 1, 2026",
      statusColor: "#dbeafe",
      statusTextColor: "#1e40af",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>e-Blotter</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          accessible={true}
          accessibilityLabel="1 notification"
          accessibilityRole="button"
        >
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>1</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* File New Report Button */}
        <TouchableOpacity
          style={styles.newReportButton}
          accessible={true}
          accessibilityLabel="File a new incident report"
          accessibilityRole="button"
          accessibilityHint="Open the incident report form"
        >
          <Text style={styles.newReportIcon}>📝</Text>
          <View style={styles.newReportContent}>
            <Text style={styles.newReportTitle}>New Report</Text>
            <Text style={styles.newReportSubtitle}>File a new incident</Text>
          </View>
        </TouchableOpacity>

        {/* My Reports Section */}
        <Text style={styles.sectionTitle}>My Reports</Text>

        {myReports.map((report, index) => (
          <View key={index} style={styles.reportCard}>
            <Text style={styles.reportTitle}>{report.title}</Text>
            <View style={styles.reportStatusBadge}>
              <Text style={[styles.reportStatus, { color: report.statusTextColor }]}>
                {report.status}
              </Text>
            </View>
            <Text style={styles.reportDate}>Filed: {report.date}</Text>
            {report.mediation && (
              <Text style={styles.reportMediation}>
                Mediation: {report.mediation}
              </Text>
            )}
          </View>
        ))}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  notificationButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  newReportButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#22c55e",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  newReportIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  newReportContent: {
    flex: 1,
  },
  newReportTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  newReportSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  reportCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  reportStatusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#dbeafe",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  reportStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
  reportDate: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  reportMediation: {
    fontSize: 12,
    color: "#22c55e",
    fontWeight: "600",
  },
});
