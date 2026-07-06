import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

export default function DocumentsScreen() {
  const documentTypes = [
    {
      icon: "📄",
      title: "Barangay Clearance",
      description: "For employment, school",
    },
    {
      icon: "📄",
      title: "Certificate of Indigency",
      description: "For financial assistance",
    },
    {
      icon: "🆔",
      title: "Barangay ID",
      description: "Official identification",
    },
  ];

  const myRequests = [
    {
      title: "Barangay Clearance",
      status: "Ready for Pickup",
      date: "Jan 15, 2026",
      statusColor: "#dcfce7",
      statusTextColor: "#166534",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Documents</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          accessible={true}
          accessibilityLabel="3 notifications"
          accessibilityRole="button"
        >
          <Text style={styles.notificationIcon}>🔔</Text>
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Request a Document Section */}
        <Text style={styles.sectionTitle}>Request a Document</Text>

        {documentTypes.map((doc, index) => (
          <TouchableOpacity
            key={index}
            style={styles.documentCard}
            accessible={true}
            accessibilityLabel={doc.title}
            accessibilityHint={doc.description}
            accessibilityRole="button"
          >
            <Text style={styles.documentIcon}>{doc.icon}</Text>
            <View style={styles.documentContent}>
              <Text style={styles.documentTitle}>{doc.title}</Text>
              <Text style={styles.documentDescription}>{doc.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* My Requests Section */}
        <Text style={styles.sectionTitle}>My Requests</Text>

        {myRequests.map((request, index) => (
          <View key={index} style={styles.requestCard}>
            <Text style={styles.requestTitle}>{request.title}</Text>
            <View style={styles.requestStatusBadge}>
              <Text style={[styles.requestStatus, { color: request.statusTextColor }]}>
                {request.status}
              </Text>
            </View>
            <Text style={styles.requestDate}>Requested: {request.date}</Text>
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
    marginTop: 8,
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  documentIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  documentContent: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 14,
    color: "#666",
  },
  requestCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  requestStatusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  requestStatus: {
    fontSize: 12,
    fontWeight: "600",
  },
  requestDate: {
    fontSize: 12,
    color: "#6b7280",
  },
});
