import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { LocationData, formatLocation } from "../../services/psgcService";
import { registerUser, RegistrationPayload } from "../../services/api";
import { getAuth } from "firebase/auth";
import { MaterialCommunityIcons, ICONS } from "../../components/Icons";

interface RegistrationStep3Props {
  onComplete: () => void;
  onBack: () => void;
  location: LocationData;
  idPhotoBase64: string;
}

export default function RegistrationStep3({
  onComplete,
  onBack,
  location,
  idPhotoBase64,
}: RegistrationStep3Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Get Firebase UID
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User not authenticated. Please sign in first.");
      }

      // Prepare registration payload
      const payload: RegistrationPayload = {
        firebaseUid: user.uid,
        email: user.email || undefined,
        phoneNumber: user.phoneNumber || undefined,
        fullName: user.displayName || "Resident", // Will be updated with OCR data in production
        regionCode: location.region?.code || "",
        regionName: location.region?.name || "",
        provinceCode: location.province?.code || "",
        provinceName: location.province?.name || "",
        cityMunicipalityCode: location.cityMunicipality?.code || "",
        cityMunicipalityName: location.cityMunicipality?.name || "",
        cityMunicipalityType: (location.cityMunicipality?.type || "municipality").toLowerCase() as "city" | "municipality",
        barangayCode: location.barangay?.code || "",
        barangayName: location.barangay?.name || "",
        idPhotoBase64,
        idType: "other", // Will be determined by OCR in production
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
        error instanceof Error ? error.message : "Failed to register. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.content}>
        {isComplete ? (
          <>
            <View style={styles.successIcon}>
              <MaterialCommunityIcons name={ICONS.STATUS_SUCCESS} size={48} color="#fff" />
            </View>
            <Text style={styles.title}>Registration Complete!</Text>
            <Text style={styles.subtitle}>
              You have successfully registered with {location.barangay?.name}. You can now access
              all e-Kap services.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>Review & Submit</Text>
            <Text style={styles.subtitle}>
              Please review your registration details before submitting.
            </Text>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Location</Text>
              <Text style={styles.summaryValue}>{formatLocation(location)}</Text>

              <View style={styles.divider} />

              <Text style={styles.summaryLabel}>ID Photo</Text>
              <Text style={styles.summaryValue}>Captured</Text>

              <View style={styles.divider} />

              <Text style={styles.summaryLabel}>Registration Status</Text>
              <Text style={styles.summaryValue}>Pending Review</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>What happens next?</Text>
              <Text style={styles.infoBoxText}>
                • Your registration will be reviewed by barangay staff{"\n"}• You'll receive a
                notification once approved{"\n"}• You can start using basic features immediately
              </Text>
            </View>
          </>
        )}
      </View>

      {!isComplete && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onBack}
            disabled={isSubmitting}
            accessibilityLabel="Go back to ID verification"
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, isSubmitting && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isSubmitting}
            accessibilityLabel="Submit registration"
            accessibilityRole="button"
            accessibilityState={{ disabled: isSubmitting }}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit Registration</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 32,
    textAlign: "center",
  },
  summaryCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5E5",
    marginBottom: 16,
  },
  infoBox: {
    backgroundColor: "#E6F4FE",
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#000",
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  infoBoxText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 32,
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
