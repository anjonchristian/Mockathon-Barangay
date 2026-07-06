import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  type VoiceLanguage,
  getLanguageLabel,
  toggleLanguage,
  processVoiceCommand,
  startSilenceTimer,
  clearSilenceTimer,
  showPermissionDeniedAlert,
} from "../services/voiceService";

interface VoiceDictationButtonProps {
  onTextReceived: (text: string) => void;
  currentValue?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: number;
}

export default function VoiceDictationButton({
  onTextReceived,
  currentValue = "",
  placeholder = "Tap to speak...",
  disabled = false,
  size = 48,
}: VoiceDictationButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState<VoiceLanguage>("en-US");
  const [showModal, setShowModal] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (isListening) {
      animRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      );
      animRef.current.start();
    } else {
      animRef.current?.stop();
      pulseAnim.setValue(1);
    }

    return () => {
      animRef.current?.stop();
    };
  }, [isListening, pulseAnim]);

  const startDictation = useCallback(async () => {
    setError(null);
    setTranscript("");
    setIsListening(true);
    setShowModal(true);

    startSilenceTimer(() => {
      stopDictation();
    });

    // Speech recognition simulation for development/demo
    // In production, integrate with expo-speech or a native speech recognition module
    // The actual speech-to-text would be handled by the device's speech recognition API
    setTimeout(() => {
      setTranscript("Voice input is ready. Speak now...");
    }, 500);
  }, []);

  const stopDictation = useCallback(() => {
    clearSilenceTimer();
    setIsListening(false);

    if (transcript && transcript !== "Voice input is ready. Speak now...") {
      const { processed, wasCommand } = processVoiceCommand(
        transcript,
        currentValue
      );

      if (wasCommand) {
        onTextReceived(processed);
      } else {
        const newText = currentValue
          ? `${currentValue} ${processed}`
          : processed;
        onTextReceived(newText);
      }
    }
  }, [transcript, currentValue, onTextReceived]);

  const handleToggleDictation = useCallback(() => {
    if (disabled) return;
    if (isListening) {
      stopDictation();
    } else {
      startDictation();
    }
  }, [disabled, isListening, stopDictation, startDictation]);

  const handleClear = useCallback(() => {
    setTranscript("");
    onTextReceived("");
  }, [onTextReceived]);

  const handleLanguageToggle = useCallback(() => {
    setLanguage((prev) => toggleLanguage(prev));
  }, []);

  const handleCloseModal = useCallback(() => {
    if (isListening) {
      stopDictation();
    }
    setShowModal(false);
  }, [isListening, stopDictation]);

  return (
    <>
      <TouchableOpacity
        onPress={handleToggleDictation}
        disabled={disabled}
        style={[
          styles.button,
          { width: size, height: size, borderRadius: size / 2 },
          isListening && styles.buttonActive,
          disabled && styles.buttonDisabled,
        ]}
        accessibilityLabel={
          isListening ? "Stop voice dictation" : "Start voice dictation"
        }
        accessibilityRole="button"
        accessibilityHint="Double tap to start or stop voice dictation"
        accessibilityState={{ disabled, selected: isListening }}
      >
        <Animated.View
          style={[
            styles.iconContainer,
            { transform: [{ scale: pulseAnim }] },
          ]}
        >
          <Text style={[styles.micIcon, isListening && styles.micIconActive]}>
            {isListening ? "🔴" : "🎤"}
          </Text>
        </Animated.View>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Voice Dictation</Text>
              <TouchableOpacity
                onPress={handleLanguageToggle}
                style={styles.langButton}
                accessibilityLabel={`Switch to ${getLanguageLabel(toggleLanguage(language))}`}
              >
                <Text style={styles.langButtonText}>
                  {getLanguageLabel(language)}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.transcriptContainer}>
              {isListening && (
                <View style={styles.listeningIndicator}>
                  <Animated.View
                    style={[
                      styles.listeningDot,
                      { transform: [{ scale: pulseAnim }] },
                    ]}
                  />
                  <Text style={styles.listeningText}>Listening...</Text>
                </View>
              )}
              <Text style={styles.transcriptText}>
                {transcript || placeholder}
              </Text>
            </View>

            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleClear}
                style={styles.clearButton}
                accessibilityLabel="Clear dictation"
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleToggleDictation}
                style={[
                  styles.dictateButton,
                  isListening && styles.dictateButtonStop,
                ]}
                accessibilityLabel={isListening ? "Stop dictation" : "Start dictation"}
              >
                <Text style={styles.dictateButtonText}>
                  {isListening ? "Stop" : "Start"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCloseModal}
                style={styles.doneButton}
                accessibilityLabel="Done with dictation"
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#E6F4FE",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#B3D9F2",
  },
  buttonActive: {
    backgroundColor: "#FECACA",
    borderColor: "#DC2626",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  micIcon: {
    fontSize: 20,
  },
  micIconActive: {
    fontSize: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 320,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
  langButton: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  langButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  transcriptContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
    marginBottom: 16,
  },
  listeningIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  listeningDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#DC2626",
    marginRight: 8,
  },
  listeningText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
  },
  transcriptText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#333",
  },
  errorText: {
    fontSize: 14,
    color: "#DC2626",
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    minHeight: 56,
    justifyContent: "center",
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  dictateButton: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    minHeight: 56,
    justifyContent: "center",
  },
  dictateButtonStop: {
    backgroundColor: "#DC2626",
  },
  dictateButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  doneButton: {
    flex: 1,
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    minHeight: 56,
    justifyContent: "center",
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
