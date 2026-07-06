import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🆔</Text>
        </View>
        
        <Text style={styles.title}>Welcome to e-Kap</Text>
        
        <Text style={styles.subtitle}>
          Your digital Barangay ID is just a few taps away. Capture your ID, review the details, and submit your request.
        </Text>

        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={styles.stepText}>Capture your ID</Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={styles.stepText}>Review details</Text>
          </View>
          
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={styles.stepText}>Submit request</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onGetStarted}
        accessibilityLabel="Get started with ID capture"
        accessibilityRole="button"
        accessibilityHint="Navigates to the camera screen to capture your ID"
      >
        <Text style={styles.buttonText}>Get Started</Text>
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
  icon: {
    fontSize: 56,
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
});
