import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";

interface DocumentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirements: string[];
}

const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: "barangay_clearance",
    name: "Barangay Clearance",
    description: "Certificate of clearance for various purposes",
    icon: "📄",
    requirements: ["Valid ID", "Proof of residence"],
  },
  {
    id: "barangay_id",
    name: "Barangay ID",
    description: "Official barangay identification card",
    icon: "🆔",
    requirements: ["Valid ID", "Birth certificate", "Proof of residence"],
  },
  {
    id: "certificate_of_indigency",
    name: "Certificate of Indigency",
    description: "Proof of indigency for government assistance",
    icon: "📋",
    requirements: ["Valid ID", "Income statement", "Proof of residence"],
  },
  {
    id: "certificate_of_residency",
    name: "Certificate of Residency",
    description: "Proof of residency in the barangay",
    icon: "🏠",
    requirements: ["Valid ID", "Proof of residence"],
  },
  {
    id: "business_permit",
    name: "Business Permit",
    description: "Permit to operate a business in the barangay",
    icon: "💼",
    requirements: ["Valid ID", "DTI registration", "Proof of residence"],
  },
];

export default function DocumentsScreen() {
  const [selectedDocument, setSelectedDocument] = useState<DocumentType | null>(
    null
  );
  const [purpose, setPurpose] = useState("");
  const [requesting, setRequesting] = useState(false);

  const handleDocumentSelect = (document: DocumentType) => {
    setSelectedDocument(document);
    setPurpose("");
  };

  const handleBack = () => {
    setSelectedDocument(null);
    setPurpose("");
  };

  const handleSubmitRequest = () => {
    if (!purpose.trim()) {
      Alert.alert("Required Field", "Please specify the purpose of your request.");
      return;
    }

    Alert.alert(
      "Confirm Request",
      `Submit request for ${selectedDocument?.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Submit",
          onPress: () => {
            setRequesting(true);
            // Simulate API call
            setTimeout(() => {
              setRequesting(false);
              Alert.alert(
                "Request Submitted",
                "Your document request has been submitted successfully. You will be notified once it's ready for pickup.",
                [{ text: "OK", onPress: handleBack }]
              );
            }, 1500);
          },
        },
      ]
    );
  };

  if (selectedDocument) {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            accessibilityLabel="Go back to document list"
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.selectedDocumentHeader}>
            <Text style={styles.documentIcon}>{selectedDocument.icon}</Text>
            <Text style={styles.documentTitle}>{selectedDocument.name}</Text>
            <Text style={styles.documentDescription}>
              {selectedDocument.description}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requirements</Text>
            {selectedDocument.requirements.map((req, index) => (
              <View key={index} style={styles.requirementItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Purpose *</Text>
            <TextInput
              style={styles.textArea}
              value={purpose}
              onChangeText={setPurpose}
              placeholder="Specify the purpose of your request..."
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              accessibilityLabel="Purpose of request"
              accessibilityHint="Enter the reason for requesting this document"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, requesting && styles.disabledButton]}
            onPress={handleSubmitRequest}
            disabled={requesting}
            accessibilityLabel="Submit document request"
            accessibilityRole="button"
          >
            <Text style={styles.submitButtonText}>
              {requesting ? "Submitting..." : "Submit Request"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentPadding}>
        <Text style={styles.headerTitle}>Document Requests</Text>
        <Text style={styles.headerSubtitle}>
          Select a document type to request from your barangay
        </Text>

        {DOCUMENT_TYPES.map((document) => (
          <TouchableOpacity
            key={document.id}
            style={styles.documentCard}
            onPress={() => handleDocumentSelect(document)}
            accessibilityLabel={`Request ${document.name}`}
            accessibilityRole="button"
            accessibilityHint={`Tap to request ${document.name}`}
          >
            <View style={styles.documentCardHeader}>
              <Text style={styles.documentCardIcon}>{document.icon}</Text>
              <View style={styles.documentCardInfo}>
                <Text style={styles.documentCardTitle}>{document.name}</Text>
                <Text style={styles.documentCardDescription}>
                  {document.description}
                </Text>
              </View>
              <Text style={styles.documentCardArrow}>→</Text>
            </View>
            <View style={styles.documentCardFooter}>
              <Text style={styles.requirementsCount}>
                {document.requirements.length} requirement
                {document.requirements.length > 1 ? "s" : ""}
              </Text>
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
  documentCard: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: 48,
  },
  documentCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  documentCardIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  documentCardInfo: {
    flex: 1,
  },
  documentCardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  documentCardDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  documentCardArrow: {
    fontSize: 20,
    color: "#22c55e",
    fontWeight: "bold",
  },
  documentCardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
    paddingTop: 12,
  },
  requirementsCount: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
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
  selectedDocumentHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  documentIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  documentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  documentDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
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
  requirementItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: "#22c55e",
    marginRight: 8,
    fontWeight: "bold",
  },
  requirementText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
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
    backgroundColor: "#22c55e",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
    marginTop: 8,
  },
  disabledButton: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
