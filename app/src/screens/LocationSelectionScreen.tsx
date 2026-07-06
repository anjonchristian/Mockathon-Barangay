import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import ProgressBar from "../components/ProgressBar";
import LargeDropdown from "../components/LargeDropdown";

interface LocationSelectionScreenProps {
  onNext: (location: { region: string; city: string; barangay: string }) => void;
  onSkip: () => void;
  onBack: () => void;
}

// Mock data - replace with actual PSGC API calls
const mockRegions = [
  { label: "National Capital Region (NCR)", value: "ncr" },
  { label: "Region I - Ilocos Region", value: "region-1" },
  { label: "Region II - Cagayan Valley", value: "region-2" },
  { label: "Region III - Central Luzon", value: "region-3" },
  { label: "Region IV-A - CALABARZON", value: "region-4a" },
  { label: "Region IV-B - MIMAROPA", value: "region-4b" },
  { label: "Region V - Bicol Region", value: "region-5" },
  { label: "Region VI - Western Visayas", value: "region-6" },
  { label: "Region VII - Central Visayas", value: "region-7" },
  { label: "Region VIII - Eastern Visayas", value: "region-8" },
  { label: "Region IX - Zamboanga Peninsula", value: "region-9" },
  { label: "Region X - Northern Mindanao", value: "region-10" },
  { label: "Region XI - Davao Region", value: "region-11" },
  { label: "Region XII - SOCCSKSARGEN", value: "region-12" },
  { label: "Region XIII - Caraga", value: "region-13" },
  { label: "BARMM - Bangsamoro", value: "barmm" },
];

const mockCities: Record<string, Array<{ label: string; value: string }>> = {
  ncr: [
    { label: "City of Manila", value: "manila" },
    { label: "Quezon City", value: "quezon-city" },
    { label: "Caloocan", value: "caloocan" },
    { label: "Las Piñas", value: "las-pinas" },
    { label: "Makati", value: "makati" },
    { label: "Malabon", value: "malabon" },
    { label: "Mandaluyong", value: "mandaluyong" },
    { label: "Marikina", value: "marikina" },
    { label: "Muntinlupa", value: "muntinlupa" },
    { label: "Navotas", value: "navotas" },
    { label: "Parañaque", value: "paranaque" },
    { label: "Pasay", value: "pasay" },
    { label: "Pasig", value: "pasig" },
    { label: "Pateros", value: "pateros" },
    { label: "San Juan", value: "san-juan" },
    { label: "Taguig", value: "taguig" },
    { label: "Valenzuela", value: "valenzuela" },
  ],
};

const mockBarangays: Record<string, Array<{ label: string; value: string }>> = {
  makati: [
    { label: "Barangay San Antonio", value: "san-antonio" },
    { label: "Barangay San Lorenzo", value: "san-lorenzo" },
    { label: "Barangay Bel-Air", value: "bel-air" },
    { label: "Barangay Poblacion", value: "poblacion" },
    { label: "Barangay Guadalupe Nuevo", value: "guadalupe-nuevo" },
    { label: "Barangay Guadalupe Viejo", value: "guadalupe-viejo" },
  ],
};

export default function LocationSelectionScreen({
  onNext,
  onSkip,
  onBack,
}: LocationSelectionScreenProps) {
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [barangay, setBarangay] = useState("");
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegionChange = (value: string) => {
    setRegion(value);
    setCity("");
    setBarangay("");
    setError(null);

    // Simulate API call for cities
    setLoadingCities(true);
    setTimeout(() => {
      setLoadingCities(false);
    }, 500);
  };

  const handleCityChange = (value: string) => {
    setCity(value);
    setBarangay("");
    setError(null);

    // Simulate API call for barangays
    setLoadingBarangays(true);
    setTimeout(() => {
      setLoadingBarangays(false);
    }, 500);
  };

  const handleContinue = () => {
    if (!region || !city || !barangay) {
      setError("Please select your region, city, and barangay");
      return;
    }

    onNext({ region, city, barangay });
  };

  const canContinue = region && city && barangay;

  const cities = region ? mockCities[region] || [] : [];
  const barangays = city ? mockBarangays[city] || [] : [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          accessible={true}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Step 1 of 3</Text>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkip}
          accessible={true}
          accessibilityLabel="Skip for now"
          accessibilityRole="button"
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <ProgressBar currentStep={1} totalSteps={3} />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Icon and Title */}
        <View style={styles.titleSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>📍</Text>
          </View>
          <Text style={styles.title}>Location Selection</Text>
          <Text style={styles.subtitle}>
            Select your barangay to get started with e-Kap services.
          </Text>
        </View>

        {/* Dropdowns */}
        <View style={styles.formSection}>
          <LargeDropdown
            label="Region"
            value={region}
            options={mockRegions}
            onSelect={handleRegionChange}
            accessibilityLabel="Select your region"
            accessibilityHint="Double tap to choose your region from the list"
          />

          <LargeDropdown
            label="City/Municipality"
            value={city}
            options={cities}
            onSelect={handleCityChange}
            loading={loadingCities}
            disabled={!region}
            error={!region ? "Please select a region first" : undefined}
            accessibilityLabel="Select your city or municipality"
            accessibilityHint="Double tap to choose your city from the list"
          />

          <LargeDropdown
            label="Barangay"
            value={barangay}
            options={barangays}
            onSelect={setBarangay}
            loading={loadingBarangays}
            disabled={!city}
            error={!city ? "Please select a city first" : undefined}
            accessibilityLabel="Select your barangay"
            accessibilityHint="Double tap to choose your barangay from the list"
          />
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, !canContinue && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!canContinue}
          accessible={true}
          accessibilityLabel="Continue to next step"
          accessibilityRole="button"
          accessibilityHint="Proceed to ID verification"
          accessibilityState={{ disabled: !canContinue }}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
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
  backButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 24,
    color: "#000",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 16,
    color: "#22c55e",
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0fdf4",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  formSection: {
    marginBottom: 24,
  },
  errorBox: {
    backgroundColor: "#fee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fca5a5",
  },
  errorText: {
    fontSize: 14,
    color: "#dc2626",
    textAlign: "center",
  },
  continueButton: {
    backgroundColor: "#22c55e",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 48,
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: "#d1d5db",
    opacity: 0.6,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
