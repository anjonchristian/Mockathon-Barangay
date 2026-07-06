import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AIAssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your e-Kap AI Assistant. How can I help you today with barangay services, document requests, or any other concerns?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userText: string): string => {
    const lowerText = userText.toLowerCase();

    if (lowerText.includes("document") || lowerText.includes("clearance")) {
      return "You can request various documents like Barangay Clearance, Certificate of Residency, and Business Permit through the Documents tab. Each document has specific requirements. Would you like me to guide you through the process?";
    }

    if (lowerText.includes("blotter") || lowerText.includes("report") || lowerText.includes("incident")) {
      return "For incident reports, please use the Blotter tab. You can report various types of incidents including noise complaints, vandalism, theft, and more. For emergencies, please call 911 immediately.";
    }

    if (lowerText.includes("id") || lowerText.includes("barangay id")) {
      return "To get a Barangay ID, you'll need to complete the registration process which includes providing personal information, location details, and a photo. The ID will be processed by barangay staff. Would you like to start the registration?";
    }

    if (lowerText.includes("hours") || lowerText.includes("open") || lowerText.includes("time")) {
      return "Barangay halls are typically open from 8:00 AM to 5:00 PM, Monday to Friday. Some may have extended hours or weekend schedules. I recommend contacting your specific barangay for their exact schedule.";
    }

    if (lowerText.includes("contact") || lowerText.includes("phone") || lowerText.includes("number")) {
      return "You can find contact information for your barangay in the Profile section. Alternatively, you can visit the barangay hall in person during office hours.";
    }

    if (lowerText.includes("help") || lowerText.includes("assist")) {
      return "I can help you with:\n\n• Document requests and requirements\n• Incident reporting procedures\n• Barangay ID registration\n• General barangay services information\n• Office hours and contact details\n\nWhat would you like to know more about?";
    }

    return "I understand you're asking about \"" + userText + "\". While I'm still learning, I can help with document requests, incident reports, and general barangay services. Could you provide more details or try rephrasing your question?";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          message.isUser ? styles.userBubble : styles.aiBubble,
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
        <Text
          style={[
            styles.messageTime,
            message.isUser ? styles.userMessageTime : styles.aiMessageTime,
          ]}
        >
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Assistant</Text>
        <Text style={styles.headerSubtitle}>
          Your virtual helper for barangay services
        </Text>
      </View>

      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map(renderMessage)}
        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={styles.messageBubble}>
              <View style={styles.typingIndicator}>
                <ActivityIndicator size="small" color="#22c55e" />
                <Text style={styles.typingText}>AI is typing...</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
          accessibilityLabel="Message input"
          accessibilityHint="Type your question or message for the AI assistant"
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.disabledButton]}
          onPress={handleSendMessage}
          disabled={!inputText.trim() || isTyping}
          accessibilityLabel="Send message"
          accessibilityRole="button"
          accessibilityHint="Send your message to the AI assistant"
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
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
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  userMessage: {
    alignItems: "flex-end",
  },
  aiMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#22c55e",
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  userMessageText: {
    color: "#fff",
  },
  aiMessageText: {
    color: "#000",
  },
  messageTime: {
    fontSize: 11,
  },
  userMessageTime: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "right",
  },
  aiMessageTime: {
    color: "#666",
  },
  typingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  typingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 12,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    maxHeight: 100,
    marginRight: 12,
    minHeight: 48,
  },
  sendButton: {
    backgroundColor: "#22c55e",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
