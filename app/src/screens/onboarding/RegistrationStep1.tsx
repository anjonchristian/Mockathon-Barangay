import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import LocationSelector from "../../components/LocationSelector";
import { LocationData, isLocationComplete } from "../../services/psgcService";

interface RegistrationStep1Props {
  onNext: (location: LocationData) => void;
  initialLocation?: LocationData;
}

export default function RegistrationStep1({
  onNext,
  initialLocation,
}: RegistrationStep1Props) {
  const [location, setLocation] = React.useState<LocationData>(
    initialLocation || { region: null, province: null, cityMunicipality: null, barangay: null }
  );
  const [isValid, setIsValid] = React.useState(false);

  const handleLocationChange = (newLocation: LocationData) => {
    setLocation(newLocation);
    setIsValid(isLocationComplete(newLocation));
  };

  const handleNext = () => {
    if (isValid) {
      onNext(location);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.stepIndicator}>
          <View style={[styles.stepDot, styles.activeStep]}>
            <Text style={styles.stepDotText}>1</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepDot}>
            <Text style={styles.stepDotText}>2</Text>
          </View>
          <View style={styles.stepLine} />
          <View style={styles.stepDot}>
            <Text style={styles.stepDotText}>3</Text>
          </View>
        </View>

        <Text style={styles.title}>Select Your Location</Text>
        <Text style={styles.subtitle}>
          Please select your region, province, city/municipality, and barangay to register with your local
          barangay.
        </Text>

        <LocationSelector
          onLocationChange={handleLocationChange}
          initialLocation={initialLocation}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, !isValid && styles.disabledButton]}
        onPress={handleNext}
        disabled={!isValid}
        accessibilityLabel="Continue to ID verification"
        accessibilityRole="button"
        accessibilityState={{ disabled: !isValid }}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    padding: 32,
  },
  content: {
    flex: 1,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E5E5",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: "#000",
  },
  stepDotText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  activeStepText: {
    color: "#fff",
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: "#E5E5E5",
    marginHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 48,
    minHeight: 56,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: "#E5E5E5",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
