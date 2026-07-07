import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import VoiceDictationButton from "../../components/VoiceDictationButton";
import VerificationGate from "../../components/VerificationGate";
import { MaterialCommunityIcons, ICONS } from "../../components/Icons";
import { useVerification } from "../../context/VerificationContext";

type IncidentType =
  | "noise_complaint"
  | "property_dispute"
  | "theft"
  | "disturbance"
  | "other";

interface IncidentOption {
  type: IncidentType;
  title: string;
  description: string;
}

const INCIDENT_TYPES: IncidentOption[] = [
  { type: "noise_complaint", title: "Noise Complaint", description: "Excessive noise from neighbors" },
  { type: "property_dispute", title: "Property Dispute", description: "Boundary or land issues" },
  { type: "theft", title: "Theft/Lost Item", description: "Report stolen or lost items" },
  { type: "disturbance", title: "Public Disturbance", description: "Disorderly conduct in public" },
  { type: "other", title: "Other", description: "Other types of incidents" },
];

interface Report {
  id: string;
  title: string;
  status: "under_review" | "mediation_scheduled" | "resolved" | "escalated";
  date: string;
  description: string;
}

const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    title: "Noise Complaint",
    status: "under_review",
    date: "Filed: Jan 15, 2026",
    description: "Loud music from neighbor's house past 10 PM",
  },
  {
    id: "2",
    title: "Property Dispute",
    status: "mediation_scheduled",
    date: "Filed: Jan 10, 2026",
    description: "Boundary fence issue with adjacent lot",
  },
  {
    id: "3",
    title: "Lost Item Report",
    status: "resolved",
    date: "Filed: Jan 5, 2026",
    description: "Lost wallet near barangay hall",
  },
];

const STATUS_LABELS: Record<Report["status"], string> = {
  under_review: "Under Review",
  mediation_scheduled: "Mediation Scheduled",
  resolved: "Resolved",
  escalated: "Escalated",
};

const STATUS_STYLES: Record<Report["status"], object> = {
  under_review: { backgroundColor: "#FEF3C7" },
  mediation_scheduled: { backgroundColor: "#DBEAFE" },
  resolved: { backgroundColor: "#D1FAE5" },
  escalated: { backgroundColor: "#FEE2E2" },
};

const STATUS_ICONS: Record<Report["status"], string> = {
  under_review: ICONS.STATUS_WARNING,
  mediation_scheduled: ICONS.STATUS_INFO,
  resolved: ICONS.STATUS_SUCCESS,
  escalated: ICONS.STATUS_ERROR,
};

interface EBlotterScreenProps {
  onCompleteRegistration?: () => void;
}

export default function EBlotterScreen({
  onCompleteRegistration,
}: EBlotterScreenProps = {}) {
  const { verificationStatus } = useVerification();
  const [showForm, setShowForm] = useState(false);
  const [showGate, setShowGate] = useState(false);
  const [selectedType, setSelectedType] = useState<IncidentType | null>(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [personInvolved, setPersonInvolved] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCompleteRegistration = () => {
    onCompleteRegistration?.();
  };

  const handleFileReport = () => {
    // Gate filing new reports for unverified users
    if (verificationStatus !== "approved") {
      setShowGate(true);
      return;
    }
    setShowForm(true);
  };

  const handleSelectType = (type: IncidentType) => {
    setSelectedType(type);
  };

  const handleSubmit = async () => {
    if (!selectedType || !description.trim() || !location.trim()) {
      Alert.alert("Missing Information", "Please select an incident type and fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert(
        "Report Filed",
        "Your incident report has been submitted successfully. You will be notified of updates.",
        [
          {
            text: "OK",
            onPress: () => {
              setShowForm(false);
              setSelectedType(null);
              setDescription("");
              setLocation("");
              setPersonInvolved("");
            },
          },
        ]
      );
    } catch {
      Alert.alert("Error", "Failed to file report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setShowForm(false);
    setSelectedType(null);
    setDescription("");
    setLocation("");
    setPersonInvolved("");
  };

  const handleGateBack = () => {
    setShowGate(false);
  };

  if (showGate) {
    return (
      <View style={styles.container}>
        <VerificationGate
          featureName="filing new reports"
          onCompleteRegistration={handleCompleteRegistration}
          limitedAccessContent={
            <ScrollView style={styles.content}>
              <TouchableOpacity
                onPress={handleGateBack}
                style={styles.backButton}
                accessibilityLabel="Go back to reports list"
                accessibilityRole="button"
              >
                <Text style={styles.backButtonText}>{"< Back"}</Text>
              </TouchableOpacity>
              <Text style={styles.title}>e-Blotter</Text>
              <Text style={styles.subtitle}>
                File incident reports and track status
              </Text>
              <Text style={styles.sectionTitle}>Recent Reports</Text>
              <View style={styles.reportList}>
                {MOCK_REPORTS.map((report) => (
                  <View key={report.id} style={styles.reportCard}>
                    <View style={styles.reportHeader}>
                      <Text style={styles.reportTitle}>{report.title}</Text>
                      <View style={[styles.statusBadge, STATUS_STYLES[report.status]]}>
                        <MaterialCommunityIcons
                          name={STATUS_ICONS[report.status]}
                          size={12}
                          color="#333"
                          style={styles.statusBadgeIcon}
                        />
                        <Text style={styles.statusText}>{STATUS_LABELS[report.status]}</Text>
                      </View>
                    </View>
                    <Text style={styles.reportDate}>{report.date}</Text>
                    <Text style={styles.reportDescription}>{report.description}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          }
        />
      </View>
    );
  }

  if (showForm) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            accessibilityLabel="Go back to reports list"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>{"< Back"}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>File Incident Report</Text>
          <Text style={styles.subtitle}>
            Use the microphone button to dictate your report.
          </Text>

          <Text style={styles.label}>Type of Incident</Text>
          <View style={styles.typeList}>
            {INCIDENT_TYPES.map((incident) => (
              <TouchableOpacity
                key={incident.type}
                style={[
                  styles.typeChip,
                  selectedType === incident.type && styles.typeChipSelected,
                ]}
                onPress={() => handleSelectType(incident.type)}
                accessibilityLabel={`Select ${incident.title}`}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedType === incident.type }}
              >
                <Text
                  style={[
                    styles.typeChipText,
                    selectedType === incident.type && styles.typeChipTextSelected,
                  ]}
                >
                  {incident.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description of Incident</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Describe what happened..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                accessibilityLabel="Incident description"
              />
              <VoiceDictationButton
                onTextReceived={setDescription}
                currentValue={description}
                placeholder="Describe the incident"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Location</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Where did it happen?"
                placeholderTextColor="#999"
                accessibilityLabel="Incident location"
              />
              <VoiceDictationButton
                onTextReceived={setLocation}
                currentValue={location}
                placeholder="Say the location"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Person(s) Involved (Optional)</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={personInvolved}
                onChangeText={setPersonInvolved}
                placeholder="Names of persons involved"
                placeholderTextColor="#999"
                accessibilityLabel="Persons involved"
              />
              <VoiceDictationButton
                onTextReceived={setPersonInvolved}
                currentValue={personInvolved}
                placeholder="Say the names"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityLabel="Submit incident report"
            accessibilityRole="button"
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Report</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>e-Blotter</Text>
        <Text style={styles.subtitle}>
          File incident reports and track status
        </Text>

        <TouchableOpacity
          style={styles.newReportButton}
          onPress={handleFileReport}
          accessibilityLabel="File new incident report"
          accessibilityRole="button"
        >
          <Text style={styles.newReportButtonText}>+ File New Report</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Recent Reports</Text>

        <View style={styles.reportList}>
          {MOCK_REPORTS.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Text style={styles.reportTitle}>{report.title}</Text>
                <View style={[styles.statusBadge, STATUS_STYLES[report.status]]}>
                  <Text style={styles.statusText}>{STATUS_LABELS[report.status]}</Text>
                </View>
              </View>
              <Text style={styles.reportDate}>{report.date}</Text>
              <Text style={styles.reportDescription}>{report.description}</Text>
            </View>
          ))}
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
  backButton: {
    marginBottom: 16,
    minHeight: 48,
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "600",
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 12,
  },
  statusBadgeIcon: {
    marginRight: 4,
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  typeList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  typeChip: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "transparent",
    minHeight: 48,
    justifyContent: "center",
  },
  typeChipSelected: {
    backgroundColor: "#E6F4FE",
    borderColor: "#000",
  },
  typeChipText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  typeChipTextSelected: {
    color: "#000",
    fontWeight: "700",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#000",
    minHeight: 52,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 40,
    minHeight: 56,
    justifyContent: "center",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
