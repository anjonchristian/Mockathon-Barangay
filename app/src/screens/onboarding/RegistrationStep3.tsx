import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { LocationData, formatLocation } from "../../services/psgcService";
import {
  registerUser,
  extractOCR,
  RegistrationPayload,
  OcrResult,
} from "../../services/api";
import { getAuth } from "firebase/auth";
import { MaterialCommunityIcons, ICONS } from "../../components/Icons";

interface RegistrationStep3Props {
  onComplete: () => void;
  onBack: () => void;
  location: LocationData;
  idPhotoBase64: string;
}

const GENDER_OPTIONS: Array<"Male" | "Female" | "Other"> = [
  "Male",
  "Female",
  "Other",
];

const ID_TYPE_OPTIONS: Array<"national_id" | "barangay_id" | "other"> = [
  "national_id",
  "barangay_id",
  "other",
];

const ID_TYPE_LABELS: Record<string, string> = {
  national_id: "National ID",
  barangay_id: "Barangay ID",
  other: "Other",
};

export default function RegistrationStep3({
  onComplete,
  onBack,
  location,
  idPhotoBase64,
}: RegistrationStep3Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [ocrAutoFilled, setOcrAutoFilled] = useState(false);

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<"" | "Male" | "Female" | "Other">("");
  const [nationality, setNationality] = useState("Filipino");
  const [idNumber, setIdNumber] = useState("");
  const [idType, setIdType] = useState<"national_id" | "barangay_id" | "other">(
    "other"
  );

  useEffect(() => {
    if (idPhotoBase64) {
      performOCR();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const performOCR = async () => {
    try {
      setOcrLoading(true);
      setOcrError(null);
      const result = await extractOCR(idPhotoBase64);
      applyOcrResult(result);
      setOcrAutoFilled(true);
    } catch (err) {
      setOcrError(
        err instanceof Error ? err.message : "OCR extraction failed"
      );
      // Show a non-blocking warning but let the user continue manually
      Alert.alert(
        "Could not extract ID info",
        "Please fill in your details manually.",
        [{ text: "OK" }]
      );
    } finally {
      setOcrLoading(false);
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
    if (!fullName.trim()) {
      Alert.alert("Missing field", "Please enter your full name.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Get Firebase UID
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User not authenticated. Please sign in first.");
      }

      // Prepare registration payload with OCR-extracted (or manually edited) data
      const payload: RegistrationPayload = {
        firebaseUid: user.uid,
        email: user.email || undefined,
        phoneNumber: user.phoneNumber || undefined,
        fullName: fullName.trim(),
        regionCode: location.region?.code || "",
        regionName: location.region?.name || "",
        provinceCode: location.province?.code || "",
        provinceName: location.province?.name || "",
        cityMunicipalityCode: location.cityMunicipality?.code || "",
        cityMunicipalityName: location.cityMunicipality?.name || "",
        cityMunicipalityType: (
          location.cityMunicipality?.type || "municipality"
        ).toLowerCase() as "city" | "municipality",
        barangayCode: location.barangay?.code || "",
        barangayName: location.barangay?.name || "",
        idPhotoBase64,
        idType,
        idNumber: idNumber.trim() || undefined,
        address: address.trim() || undefined,
        birthDate: birthDate.trim() || undefined,
        gender: (gender || undefined) as
          | "Male"
          | "Female"
          | "Other"
          | undefined,
        nationality: nationality.trim() || undefined,
      };

      // Call registration API
      await registerUser(payload);

      setIsSubmitting(false);
      setIsComplete(true);

      // Auto-advance after showing success
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert(
        "Registration Failed",
        error instanceof Error
          ? error.message
          : "Failed to register. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.stepDot}>
        <Text style={styles.stepDotText}>1</Text>
      </View>
      <View style={styles.stepLine} />
      <View style={styles.stepDot}>
        <Text style={styles.stepDotText}>2</Text>
      </View>
      <View style={styles.stepLine} />
      <View style={[styles.stepDot, styles.activeStep]}>
        <Text style={styles.stepDotText}>3</Text>
      </View>
    </View>
  );

  if (isComplete) {
    return (
      <View style={styles.container}>
        {renderStepIndicator()}
        <View style={styles.content}>
          <View style={styles.successIcon}>
            <MaterialCommunityIcons name={ICONS.STATUS_SUCCESS} size={48} color="#fff" />
          </View>
          <Text style={styles.title}>Registration Complete!</Text>
          <Text style={styles.subtitle}>
            You have successfully registered with {location.barangay?.name}. You can now access
            all e-Kap services.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderStepIndicator()}

      <ScrollView
        style={styles.formSection}
        contentContainerStyle={styles.formContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Review & Submit</Text>
        <Text style={styles.subtitle}>
          Please review your registration details before submitting.
        </Text>

        {ocrLoading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Extracting ID information...</Text>
            <Text style={styles.loadingSubtext}>
              This may take a few moments. Please wait.
            </Text>
          </View>
        )}

        {!ocrLoading && ocrAutoFilled && (
          <View style={styles.autoFilledBanner}>
            <MaterialCommunityIcons
              name={ICONS.STATUS_SUCCESS}
              size={18}
              color="#10B981"
            />
            <Text style={styles.autoFilledText}>Auto-filled from ID</Text>
            <TouchableOpacity
              onPress={performOCR}
              accessibilityLabel="Re-run OCR extraction"
              accessibilityRole="button"
            >
              <Text style={styles.reExtractText}>Re-extract</Text>
            </TouchableOpacity>
          </View>
        )}

        {!ocrLoading && ocrError && !ocrAutoFilled && (
          <View style={styles.warnBox}>
            <Text style={styles.warnText}>
              Could not extract ID info. Please fill in manually.
            </Text>
            <TouchableOpacity
              onPress={performOCR}
              accessibilityLabel="Retry OCR extraction"
              accessibilityRole="button"
            >
              <Text style={styles.retryText}>Retry OCR</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Location</Text>
          <Text style={styles.summaryValue}>{formatLocation(location)}</Text>

          <View style={styles.divider} />

          <Text style={styles.summaryLabel}>ID Photo</Text>
          <Text style={styles.summaryValue}>Captured</Text>
        </View>

        <Text style={styles.sectionTitle}>Your Details</Text>
        <Text style={styles.sectionSubtitle}>
          Fields below were extracted from your ID. Edit any field if needed.
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

        <Text style={styles.label}>Address</Text>
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

        <Text style={styles.label}>Birth Date</Text>
        <TextInput
          style={styles.input}
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999"
          accessibilityLabel="Birth Date"
          accessibilityHint="Enter your birth date in year-month-day format"
        />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerRow}>
          {GENDER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.pill,
                gender === option && styles.pillActive,
              ]}
              onPress={() => setGender(option)}
              accessibilityLabel={`Select gender ${option}`}
              accessibilityRole="button"
              accessibilityState={{ selected: gender === option }}
            >
              <Text
                style={[
                  styles.pillText,
                  gender === option && styles.pillTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
          style={styles.input}
          value={idNumber}
          onChangeText={setIdNumber}
          placeholder="ID Number"
          placeholderTextColor="#999"
          accessibilityLabel="ID Number"
          accessibilityHint="ID number extracted from your photo or enter manually"
        />

        <Text style={styles.label}>ID Type</Text>
        <View style={styles.pickerRow}>
          {ID_TYPE_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.pill,
                idType === option && styles.pillActive,
              ]}
              onPress={() => setIdType(option)}
              accessibilityLabel={`Select ID type ${ID_TYPE_LABELS[option]}`}
              accessibilityRole="button"
              accessibilityState={{ selected: idType === option }}
            >
              <Text
                style={[
                  styles.pillText,
                  idType === option && styles.pillTextActive,
                ]}
              >
                {ID_TYPE_LABELS[option]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoBoxTitle}>What happens next?</Text>
          <Text style={styles.infoBoxText}>
            {"\u2022"} Your registration will be reviewed by barangay staff{"\n"}
            {"\u2022"} You'll receive a notification once approved{"\n"}
            {"\u2022"} You can start using basic features immediately
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          disabled={isSubmitting || ocrLoading}
          accessibilityLabel="Go back to ID verification"
          accessibilityRole="button"
          accessibilityState={{ disabled: isSubmitting || ocrLoading }}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, (isSubmitting || ocrLoading) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting || ocrLoading}
          accessibilityLabel="Submit registration"
          accessibilityRole="button"
          accessibilityState={{ disabled: isSubmitting || ocrLoading }}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Submit Registration</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: "#000",
  },
  stepDotText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  stepLine: {
    width: 32,
    height: 2,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 4,
  },
  formSection: {
    flex: 1,
  },
  formContent: {
    padding: 24,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    marginTop: 8,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    lineHeight: 20,
  },
  loadingBox: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginTop: 16,
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  autoFilledBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    gap: 8,
  },
  autoFilledText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
  },
  reExtractText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },
  warnBox: {
    backgroundColor: "#FFF7ED",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  warnText: {
    flex: 1,
    fontSize: 14,
    color: "#B45309",
  },
  retryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B45309",
  },
  summaryCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    marginTop: 12,
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
  multilineInput: {
    minHeight: 72,
    textAlignVertical: "top",
  },
  pickerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  pill: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#fff",
  },
  pillActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  pillText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  pillTextActive: {
    color: "#fff",
  },
  infoBox: {
    backgroundColor: "#E6F4FE",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#000",
    marginTop: 24,
  },
  infoBoxTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  infoBoxText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 24,
    gap: 12,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 18,
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    flex: 2,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 18,
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#E5E5E5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
