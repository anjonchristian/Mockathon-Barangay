import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons, ICONS } from "../components/Icons";

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

export default function WelcomeScreen({ onGetStarted, onSkip }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name={ICONS.DOC_BARANGAY_ID} size={56} color="#1a73e8" />
        </View>
        
        <Text style={styles.title}>Welcome to e-Kap</Text>
        
        <Text style={styles.subtitle}>
          Your digital Barangay ID is just a few taps away. Complete your registration, access services, and stay connected with your community.
        </Text>

        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Complete registration</Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Access services</Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Stay connected</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onGetStarted}
        accessibilityLabel="Get started with registration"
        accessibilityRole="button"
        accessibilityHint="Navigates to the registration screen to complete your profile"
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={onSkip}
        accessibilityLabel="Skip for now and continue as guest"
        accessibilityRole="button"
        accessibilityHint="Skips registration and takes you to the app as a guest. You can complete registration later from your profile."
      >
        <Text style={styles.skipButtonText}>Skip for Now</Text>
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
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E6F4FE",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 48,
    paddingHorizontal: 16,
  },
  stepsContainer: {
    width: "100%",
    paddingHorizontal: 16,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumberText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  stepText: {
    fontSize: 16,
    color: "#333",
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
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  skipButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 48,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  skipButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
});
