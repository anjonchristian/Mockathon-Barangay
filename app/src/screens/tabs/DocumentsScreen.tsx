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

type DocumentType =
  | "barangay_clearance"
  | "certificate_of_indigency"
  | "barangay_id"
  | "certificate_of_residency";

interface DocumentOption {
  type: DocumentType;
  title: string;
  description: string;
  icon: string;
}

const DOCUMENT_OPTIONS: DocumentOption[] = [
  {
    type: "barangay_clearance",
    title: "Barangay Clearance",
    description: "Certificate of good moral character",
    icon: "📄",
  },
  {
    type: "certificate_of_indigency",
    title: "Certificate of Indigency",
    description: "For financial assistance applications",
    icon: "💳",
  },
  {
    type: "barangay_id",
    title: "Barangay ID",
    description: "Official barangay identification card",
    icon: "🆔",
  },
  {
    type: "certificate_of_residency",
    title: "Certificate of Residency",
    description: "Proof of address in the barangay",
    icon: "🏠",
  },
];

export default function DocumentsScreen() {
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [purpose, setPurpose] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSelectDocument = (type: DocumentType) => {
    setSelectedDoc(type);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!fullName.trim() || !address.trim() || !purpose.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      Alert.alert(
        "Request Submitted",
        "Your document request has been submitted successfully. You will be notified when it is ready.",
        [
          {
            text: "OK",
            onPress: () => {
              setShowForm(false);
              setSelectedDoc(null);
              setFullName("");
              setAddress("");
              setPurpose("");
            },
          },
        ]
      );
    } catch {
      Alert.alert("Error", "Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    setShowForm(false);
    setSelectedDoc(null);
    setFullName("");
    setAddress("");
    setPurpose("");
  };

  if (showForm) {
    const doc = DOCUMENT_OPTIONS.find((d) => d.type === selectedDoc);
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            onPress={handleBack}
            style={styles.backButton}
            accessibilityLabel="Go back to document list"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>{"< Back"}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{doc?.title}</Text>
          <Text style={styles.subtitle}>
            Fill in the details below. Use the microphone button to dictate.
          </Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                placeholderTextColor="#999"
                accessibilityLabel="Full name input"
              />
              <VoiceDictationButton
                onTextReceived={setFullName}
                currentValue={fullName}
                placeholder="Say your full name"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter your address"
                placeholderTextColor="#999"
                multiline
                accessibilityLabel="Address input"
              />
              <VoiceDictationButton
                onTextReceived={setAddress}
                currentValue={address}
                placeholder="Say your address"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Purpose</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={purpose}
                onChangeText={setPurpose}
                placeholder="Why do you need this document?"
                placeholderTextColor="#999"
                multiline
                accessibilityLabel="Purpose input"
              />
              <VoiceDictationButton
                onTextReceived={setPurpose}
                currentValue={purpose}
                placeholder="Explain the purpose"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityLabel="Submit document request"
            accessibilityRole="button"
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Request</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Documents</Text>
        <Text style={styles.subtitle}>
          Request barangay documents and certificates
        </Text>

        <View style={styles.documentList}>
          {DOCUMENT_OPTIONS.map((doc) => (
            <TouchableOpacity
              key={doc.type}
              style={styles.documentCard}
              onPress={() => handleSelectDocument(doc.type)}
              accessibilityLabel={`Request ${doc.title}`}
              accessibilityRole="button"
            >
              <View style={styles.documentIcon}>
                <Text style={styles.iconText}>{doc.icon}</Text>
              </View>
              <View style={styles.documentInfo}>
                <Text style={styles.documentTitle}>{doc.title}</Text>
                <Text style={styles.documentDescription}>{doc.description}</Text>
              </View>
              <Text style={styles.arrow}>{">"}</Text>
            </TouchableOpacity>
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
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
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
