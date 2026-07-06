import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { extractOCR, submitRequest, OcrResult } from "../services/api";
import { getCurrentUser } from "../services/firebase";

interface ReviewScreenProps {
  imageBase64: string;
  onSubmitSuccess: (requestId: string) => void;
  onRetake: () => void;
}

export default function ReviewScreen({
  imageBase64,
  onSubmitSuccess,
  onRetake,
}: ReviewScreenProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("Filipino");
  const [idNumber, setIdNumber] = useState("");
  const [idType, setIdType] = useState("");

  useEffect(() => {
    performOCR();
  }, []);

  const performOCR = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await extractOCR(imageBase64);
      applyOcrResult(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "OCR extraction failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const applyOcrResult = (result: OcrResult) => {
    if (result.fullName) setFullName(result.fullName);
    if (result.address) setAddress(result.address);
    if (result.birthDate) setBirthDate(result.birthDate);
    if (result.gender) setGender(result.gender);
    if (result.nationality) setNationality(result.nationality);
    if (result.idNumber) setIdNumber(result.idNumber);
    if (result.idType) setIdType(result.idType);
  };

  const handleSubmit = async () => {
    if (!fullName || !address || !birthDate || !gender) {
      setError("Please fill in all required fields");
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      setError("Not authenticated. Please restart the app.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const doc = await submitRequest({
        firebaseUid: user.uid,
        fullName,
        address,
        birthDate,
        gender: gender as "Male" | "Female" | "Other",
        nationality,
        idType: idType === "barangay_id" ? "barangay_id" : "national_id",
        idNumber,
        idPhotoBase64: imageBase64,
      });

      onSubmitSuccess(doc._id);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to submit request"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22c55e" />
          <Text style={styles.loadingText}>Extracting information from your ID...</Text>
          <Text style={styles.loadingSubtext}>
            This may take a few moments. Please wait.
          </Text>
          {error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={performOCR}>
                <Text style={styles.retryButtonText}>Retry OCR</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top 40%: ID Photo */}
      <View style={styles.photoSection}>
        <Image
          source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
          style={styles.idPhoto}
          resizeMode="contain"
        />
      </View>

      {/* Bottom 60%: Form fields */}
      <ScrollView style={styles.formSection} contentContainerStyle={styles.formContent}>
        <Text style={styles.sectionTitle}>Review & Correct</Text>
        <Text style={styles.sectionSubtitle}>
          Please check the information below. You can edit any field if needed.
        </Text>

        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full Name"
          placeholderTextColor="#999"
          accessibilityLabel="Full Name"
          accessibilityHint="Enter your complete name as shown on your ID"
        />

        <Text style={styles.label}>Address *</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={address}
          onChangeText={setAddress}
          placeholder="Address"
          placeholderTextColor="#999"
          multiline
          accessibilityLabel="Address"
          accessibilityHint="Enter your complete residential address"
        />

        <Text style={styles.label}>Birth Date *</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999"
          accessibilityLabel="Birth Date"
          accessibilityHint="Enter your birth date in year-month-day format"
        />

        <Text style={styles.label}>Gender *</Text>
        <TextInput
          style={styles.input}
          value={gender}
          onChangeText={setGender}
          placeholder="Male / Female / Other"
          placeholderTextColor="#999"
          accessibilityLabel="Gender"
          accessibilityHint="Enter your gender: Male, Female, or Other"
        />

        <Text style={styles.label}>Nationality</Text>
        <TextInput
          style={styles.input}
          value={nationality}
          onChangeText={setNationality}
          placeholder="Nationality"
          placeholderTextColor="#999"
          accessibilityLabel="Nationality"
          accessibilityHint="Enter your nationality"
        />

        <Text style={styles.label}>ID Number</Text>
        <TextInput
          style={[styles.input, styles.readOnlyInput]}
          value={idNumber}
          editable={false}
          accessibilityLabel="ID Number"
          accessibilityHint="ID number extracted from your photo"
        />

        {/* Error display */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onRetake}
            disabled={submitting}
            accessibilityLabel="Retake photo"
            accessibilityRole="button"
          >
            <Text style={styles.secondaryButtonText}>Retake Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, submitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityLabel="Submit request"
            accessibilityRole="button"
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Submit Request</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginTop: 24,
    paddingHorizontal: 32,
  },
  loadingSubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 32,
  },
  photoSection: {
    height: "40%",
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  idPhoto: { width: "100%", height: "100%" },
  formSection: { flex: 1 },
  formContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 8, color: "#000" },
  sectionSubtitle: { fontSize: 16, color: "#666", marginBottom: 20, lineHeight: 22 },
  label: { fontSize: 16, fontWeight: "600", color: "#333", marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 18,
    color: "#000",
    backgroundColor: "#fff",
    minHeight: 48,
  },
  multilineInput: { minHeight: 80, textAlignVertical: "top" },
  readOnlyInput: { backgroundColor: "#f9f9f9", color: "#666" },
  errorBox: {
    backgroundColor: "#fee",
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  errorText: { color: "#c00", fontSize: 14 },
  retryButton: {
    marginTop: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#c00",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  retryButtonText: { color: "#c00", fontSize: 14, fontWeight: "600" },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  secondaryButtonText: { fontSize: 16, fontWeight: "600", color: "#333" },
  primaryButton: {
    flex: 1,
    backgroundColor: "#22c55e",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
  },
  disabledButton: { opacity: 0.6 },
  primaryButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
});
