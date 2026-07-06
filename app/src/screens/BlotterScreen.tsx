import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

interface IncidentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  severity: "low" | "medium" | "high";
}

const INCIDENT_TYPES: IncidentType[] = [
  {
    id: "noise_complaint",
    name: "Noise Complaint",
    description: "Excessive noise disturbing the peace",
    icon: "🔊",
    severity: "low",
  },
  {
    id: "vandalism",
    name: "Vandalism",
    description: "Property damage or graffiti",
    icon: "🎨",
    severity: "medium",
  },
  {
    id: "theft",
    name: "Theft",
    description: "Stolen property or belongings",
    icon: "📦",
    severity: "high",
  },
  {
    id: "assault",
    name: "Assault",
    description: "Physical altercation or threat",
    icon: "⚠️",
    severity: "high",
  },
  {
    id: "dispute",
    name: "Dispute",
    description: "Conflict between neighbors or individuals",
    icon: "💬",
    severity: "medium",
  },
  {
    id: "suspicious_activity",
    name: "Suspicious Activity",
    description: "Unusual or concerning behavior",
    icon: "👁️",
    severity: "medium",
  },
];

export default function BlotterScreen() {
  const [selectedIncident, setSelectedIncident] = useState<IncidentType | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [witnesses, setWitnesses] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleIncidentSelect = (incident: IncidentType) => {
    setSelectedIncident(incident);
    setDescription("");
    setLocation("");
    setDateTime("");
    setWitnesses("");
  };

  const handleBack = () => {
    setSelectedIncident(null);
    setDescription("");
    setLocation("");
    setDateTime("");
    setWitnesses("");
  };

  const handleSubmitReport = () => {
    if (!description.trim()) {
      Alert.alert("Required Field", "Please provide a description of the incident.");
      return;
    }

    if (!location.trim()) {
      Alert.alert("Required Field", "Please specify the location of the incident.");
      return;
    }

    Alert.alert(
      "Confirm Report",
      `Submit report for ${selectedIncident?.name}? This will be sent to barangay authorities.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: () => {
            setSubmitting(true);
            // Simulate API call
            setTimeout(() => {
              setSubmitting(false);
              Alert.alert(
                "Report Submitted",
                "Your incident report has been submitted successfully. Barangay authorities will review and take appropriate action.",
                [{ text: "OK", onPress: handleBack }]
              );
            }, 1500);
          },
        },
      ]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "#22c55e";
      case "medium":
        return "#f59e0b";
      case "high":
        return "#ef4444";
      default:
        return "#666";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "low":
        return "Low Priority";
      case "medium":
        return "Medium Priority";
      case "high":
        return "High Priority";
      default:
        return "";
    }
  };

  if (selectedIncident) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            accessibilityLabel="Go back to incident types"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.selectedIncidentHeader}>
            <Text style={styles.incidentIcon}>{selectedIncident.icon}</Text>
            <Text style={styles.incidentTitle}>{selectedIncident.name}</Text>
            <Text style={styles.incidentDescription}>
              {selectedIncident.description}
            </Text>
            <View
              style={[
                styles.severityBadge,
                { backgroundColor: getSeverityColor(selectedIncident.severity) },
              ]}
            >
              <Text style={styles.severityText}>
                {getSeverityLabel(selectedIncident.severity)}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Incident Details *</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe what happened in detail..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              accessibilityLabel="Incident description"
              accessibilityHint="Provide a detailed description of the incident"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location *</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Where did this happen?"
              placeholderTextColor="#999"
              accessibilityLabel="Incident location"
              accessibilityHint="Enter the location where the incident occurred"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            <TextInput
              style={styles.input}
              value={dateTime}
              onChangeText={setDateTime}
              placeholder="When did this happen? (e.g., Jan 15, 2026, 3:00 PM)"
              placeholderTextColor="#999"
              accessibilityLabel="Date and time"
              accessibilityHint="Enter when the incident occurred"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Witnesses (Optional)</Text>
            <TextInput
              style={styles.textArea}
              value={witnesses}
              onChangeText={setWitnesses}
              placeholder="Names and contact information of any witnesses..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              accessibilityLabel="Witnesses"
              accessibilityHint="Provide information about any witnesses"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.disabledButton]}
            onPress={handleSubmitReport}
            disabled={submitting}
            accessibilityLabel="Submit incident report"
            accessibilityRole="button"
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Report</Text>
            )}
          </TouchableOpacity>

          <View style={styles.disclaimerBox}>
            <Text style={styles.disclaimerText}>
              ⚠️ False reports may result in legal consequences. Please report only
              genuine incidents.
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        <Text style={styles.headerTitle}>Blotter Report</Text>
        <Text style={styles.headerSubtitle}>
          Report incidents or concerns to your barangay
        </Text>

        <View style={styles.emergencyNotice}>
          <Text style={styles.emergencyIcon}>🚨</Text>
          <Text style={styles.emergencyText}>
            For emergencies, call 911 or contact local authorities immediately.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Select Incident Type</Text>

        {INCIDENT_TYPES.map((incident) => (
          <TouchableOpacity
            key={incident.id}
            style={styles.incidentCard}
            onPress={() => handleIncidentSelect(incident)}
            accessibilityLabel={`Report ${incident.name}`}
            accessibilityRole="button"
            accessibilityHint={`Tap to report ${incident.name}`}
          >
            <View style={styles.incidentCardHeader}>
              <Text style={styles.incidentCardIcon}>{incident.icon}</Text>
              <View style={styles.incidentCardInfo}>
                <Text style={styles.incidentCardTitle}>{incident.name}</Text>
                <Text style={styles.incidentCardDescription}>
                  {incident.description}
                </Text>
              </View>
              <View
                style={[
                  styles.severityDot,
                  { backgroundColor: getSeverityColor(incident.severity) },
                ]}
              />
            </View>
          </TouchableOpacity>
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
  content: {
    flex: 1,
  },
  contentPadding: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    lineHeight: 22,
  },
  emergencyNotice: {
    flexDirection: "row",
    backgroundColor: "#fef3c7",
    borderWidth: 1,
    borderColor: "#f59e0b",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    alignItems: "center",
  },
  emergencyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  emergencyText: {
    fontSize: 14,
    color: "#92400e",
    flex: 1,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  incidentCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    minHeight: 48,
  },
  incidentCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  incidentCardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  incidentCardInfo: {
    flex: 1,
  },
  incidentCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  incidentCardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  severityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  backButton: {
    marginBottom: 20,
    minHeight: 48,
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#22c55e",
    fontWeight: "600",
  },
  selectedIncidentHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  incidentIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  incidentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  incidentDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 12,
  },
  severityBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  severityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  section: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    minHeight: 48,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    minHeight: 120,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#ef4444",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  disclaimerBox: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 8,
    padding: 12,
  },
  disclaimerText: {
    fontSize: 12,
    color: "#991b1b",
    lineHeight: 18,
  },
});
