import { View, Text, StyleSheet } from "react-native";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = currentStep / totalSteps;
  const progressPercentage = `${progress * 100}%`;

  return (
    <View style={styles.container}>
      {/* Progress bar */}
      <View style={styles.barContainer}>
        <View style={[styles.barFill, { width: progressPercentage }]} />
      </View>

      {/* Step indicators */}
      <View style={styles.stepsContainer}>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <View key={stepNumber} style={styles.stepIndicator}>
              <View
                style={[
                  styles.stepCircle,
                  isCompleted && styles.stepCircleCompleted,
                  isCurrent && styles.stepCircleCurrent,
                  isPending && styles.stepCirclePending,
                ]}
              >
                <Text
                  style={[
                    styles.stepNumber,
                    isCompleted && styles.stepNumberCompleted,
                    isCurrent && styles.stepNumberCurrent,
                    isPending && styles.stepNumberPending,
                  ]}
                >
                  {isCompleted ? "✓" : stepNumber}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  isCurrent && styles.stepLabelCurrent,
                ]}
              >
                {getStepLabel(stepNumber)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function getStepLabel(step: number): string {
  switch (step) {
    case 1:
      return "Location";
    case 2:
      return "Verify ID";
    case 3:
      return "Complete";
    default:
      return "";
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  barContainer: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  barFill: {
    height: "100%",
    backgroundColor: "#22c55e",
    borderRadius: 4,
  },
  stepsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stepIndicator: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepCircleCompleted: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  stepCircleCurrent: {
    backgroundColor: "#22c55e",
    borderColor: "#22c55e",
  },
  stepCirclePending: {
    backgroundColor: "#fff",
    borderColor: "#d1d5db",
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  stepNumberCompleted: {
    color: "#fff",
  },
  stepNumberCurrent: {
    color: "#fff",
  },
  stepNumberPending: {
    color: "#6b7280",
  },
  stepLabel: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "500",
  },
  stepLabelCurrent: {
    color: "#22c55e",
    fontWeight: "600",
  },
});
