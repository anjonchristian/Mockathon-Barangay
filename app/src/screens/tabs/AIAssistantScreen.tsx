import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  sendChatMessage,
  checkStaffStatus,
} from "../../services/webrtcService";
import { MaterialCommunityIcons, ICONS } from "../../components/Icons";
import { useVerification } from "../../context/VerificationContext";
import VideoCallScreen from "../VideoCallScreen";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  suggestedActions?: string[];
}

interface AIAssistantScreenProps {
  onCompleteRegistration?: () => void;
}

export default function AIAssistantScreen({
  onCompleteRegistration,
}: AIAssistantScreenProps = {}) {
  const { verificationStatus } = useVerification();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your e-Kap assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
      suggestedActions: ["Request a Document", "File e-Blotter", "Talk to Staff"],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [staffAvailable, setStaffAvailable] = useState<boolean | null>(null);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [callbackRequested, setCallbackRequested] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    checkStaffAvailability();
  }, []);

  const checkStaffAvailability = async () => {
    try {
      const status = await checkStaffStatus();
      setStaffAvailable(status.staffAvailable);
    } catch {
      setStaffAvailable(false);
    }
  };

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(text);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        isUser: false,
        timestamp: new Date(),
        suggestedActions: response.suggestedActions,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setStaffAvailable(response.staffAvailable);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your message. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [inputText, isLoading]);

  const handleQuickQuestion = useCallback((question: string) => {
    setInputText(question);
  }, []);

  const handleSuggestedAction = useCallback((action: string) => {
    if (action === "Talk to Staff") {
      // Gate WebRTC escalation for unverified users
      if (verificationStatus !== "approved") {
        Alert.alert(
          "Registration Required",
          "Complete registration to talk to a barangay staff member. The AI assistant is still available to help you.",
          [
            { text: "Maybe Later", style: "cancel" },
            {
              text: "Complete Registration",
              onPress: () => onCompleteRegistration?.(),
            },
          ]
        );
        return;
      }
      handleTalkToOfficial();
    } else {
      setInputText(action);
    }
  }, [verificationStatus, onCompleteRegistration]);

  const handleTalkToOfficial = useCallback(async () => {
    try {
      const status = await checkStaffStatus();
      if (!status.staffAvailable) {
        Alert.alert(
          "Staff Unavailable",
          "No staff members are currently available. Would you like to request a callback?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Request Callback",
              onPress: handleRequestCallback,
            },
          ]
        );
        return;
      }

      setShowVideoCall(true);
    } catch {
      Alert.alert("Error", "Unable to connect. Please try again later.");
    }
  }, []);

  const handleRequestCallback = useCallback(() => {
    setCallbackRequested(true);
    const callbackMessage: Message = {
      id: Date.now().toString(),
      text: "Your callback request has been logged. A barangay staff member will call you back as soon as they are available.",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, callbackMessage]);
  }, []);

  const handleEndCall = useCallback(() => {
    setShowVideoCall(false);
    const callEndedMessage: Message = {
      id: Date.now().toString(),
      text: "Video call ended. Is there anything else I can help you with?",
      isUser: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, callEndedMessage]);
  }, []);

  if (showVideoCall) {
    return (
      <VideoCallScreen
        userId="resident-user"
        onEndCall={handleEndCall}
        onCallbackRequested={() => {
          setShowVideoCall(false);
          handleRequestCallback();
        }}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant</Text>
        <View style={styles.headerRow}>
          <Text style={styles.subtitle}>
            Ask questions about barangay services
          </Text>
          <View style={styles.staffIndicator}>
            <View
              style={[
                styles.staffDot,
                staffAvailable ? styles.staffOnline : styles.staffOffline,
              ]}
            />
            <Text style={styles.staffText}>
              {staffAvailable === null
                ? "Checking..."
                : staffAvailable
                ? "Staff Online"
                : "Staff Offline"}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View key={message.id}>
            <View
              style={[
                styles.messageBubble,
                message.isUser ? styles.userMessage : styles.aiMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.isUser ? styles.userMessageText : styles.aiMessageText,
                ]}
              >
                {message.text}
              </Text>
            </View>
            {message.suggestedActions && message.suggestedActions.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.suggestedActionsContainer}
              >
                {message.suggestedActions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestedActionChip}
                    onPress={() => handleSuggestedAction(action)}
                    accessibilityLabel={action}
                    accessibilityRole="button"
                  >
                    <Text style={styles.suggestedActionText}>{action}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        ))}
        {isLoading && (
          <View style={[styles.messageBubble, styles.aiMessage]}>
            <ActivityIndicator size="small" color="#666" />
          </View>
        )}
      </ScrollView>

      <View style={styles.quickQuestions}>
        <Text style={styles.quickQuestionsTitle}>Quick Questions:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickQuestionsScroll}>
          <TouchableOpacity
            style={styles.quickQuestionChip}
            onPress={() => handleQuickQuestion("What documents can I request?")}
          >
            <Text style={styles.quickQuestionText}>What documents can I request?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickQuestionChip}
            onPress={() => handleQuickQuestion("How do I file a blotter report?")}
          >
            <Text style={styles.quickQuestionText}>How do I file a blotter report?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickQuestionChip}
            onPress={() => handleQuickQuestion("What are the office hours?")}
          >
            <Text style={styles.quickQuestionText}>What are the office hours?</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your question..."
          placeholderTextColor="#999"
          multiline
          accessibilityLabel="Type your question"
          onSubmitEditing={handleSend}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.disabledButton]}
          onPress={handleSend}
          disabled={!inputText.trim() || isLoading}
          accessibilityLabel="Send message"
          accessibilityRole="button"
          accessibilityState={{ disabled: !inputText.trim() || isLoading }}
        >
          <MaterialCommunityIcons
            name={ICONS.ACTION_SEND}
            size={20}
            color={!inputText.trim() || isLoading ? "#999" : "#fff"}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.talkToOfficialButton,
          verificationStatus !== "approved"
            ? styles.talkToOfficialButtonLocked
            : !staffAvailable && styles.talkToOfficialButtonOffline,
        ]}
        onPress={
          verificationStatus === "approved"
            ? handleTalkToOfficial
            : () => onCompleteRegistration?.()
        }
        accessibilityLabel={
          verificationStatus === "approved"
            ? "Talk to a barangay official"
            : "Complete registration to talk to staff"
        }
        accessibilityRole="button"
        accessibilityHint={
          verificationStatus === "approved"
            ? staffAvailable
              ? "Start a video call with a staff member"
              : "Request a callback from a staff member"
            : "Complete registration to access this feature"
        }
      >
        <View style={styles.talkToOfficialButtonContent}>
          <MaterialCommunityIcons
            name={
              verificationStatus === "approved"
                ? ICONS.ACTION_PHONE
                : ICONS.VERIFICATION_LOCKED
            }
            size={20}
            color="#fff"
            style={styles.talkToOfficialButtonIcon}
          />
          <Text style={styles.talkToOfficialButtonText}>
            {verificationStatus === "approved"
              ? staffAvailable
                ? "Talk to an Official"
                : "Request Callback"
              : "Complete Registration to talk to staff"}
          </Text>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    flex: 1,
  },
  staffIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  staffDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  staffOnline: {
    backgroundColor: "#10B981",
  },
  staffOffline: {
    backgroundColor: "#DC2626",
  },
  staffText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  messagesContainer: {
    flex: 1,
    padding: 20,
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    backgroundColor: "#000",
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  aiMessage: {
    backgroundColor: "#F5F5F5",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: "#fff",
  },
  aiMessageText: {
    color: "#000",
  },
  suggestedActionsContainer: {
    flexDirection: "row",
    marginBottom: 12,
    paddingLeft: 8,
  },
  suggestedActionChip: {
    backgroundColor: "#E6F4FE",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#B3D9F2",
  },
  suggestedActionText: {
    fontSize: 13,
    color: "#000",
    fontWeight: "500",
  },
  quickQuestions: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  quickQuestionsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  quickQuestionsScroll: {
    flexDirection: "row",
  },
  quickQuestionChip: {
    backgroundColor: "#E6F4FE",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  quickQuestionText: {
    fontSize: 14,
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#000",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 56,
  },
  disabledButton: {
    backgroundColor: "#E5E5E5",
  },
  talkToOfficialButton: {
    backgroundColor: "#10B981",
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 56,
  },
  talkToOfficialButtonOffline: {
    backgroundColor: "#6B7280",
  },
  talkToOfficialButtonLocked: {
    backgroundColor: "#4B5563",
  },
  talkToOfficialButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  talkToOfficialButtonIcon: {
    marginRight: 8,
  },
  talkToOfficialButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
