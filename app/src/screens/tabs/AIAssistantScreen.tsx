import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
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
      text: "Hello! I'm your e-Kap assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (inputText.trim()) {
      const newUserMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        isUser: true,
        timestamp: new Date(),
      };

      setMessages([...messages, newUserMessage]);
      setInputText("");

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: "I understand. Let me help you with that. For document requests, please go to the Documents tab. For incident reports, use the e-Blotter tab.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant</Text>
        <Text style={styles.subtitle}>
          Ask questions about barangay services
        </Text>
      </View>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((message) => (
          <View
            key={message.id}
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
        ))}
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
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.disabledButton]}
          onPress={handleSend}
          disabled={!inputText.trim()}
          accessibilityLabel="Send message"
          accessibilityRole="button"
          accessibilityState={{ disabled: !inputText.trim() }}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.talkToOfficialButton}
        accessibilityLabel="Talk to a barangay official"
        accessibilityRole="button"
        accessibilityHint="Start a video call with a staff member"
      >
        <Text style={styles.talkToOfficialButtonText}>📞 Talk to an Official</Text>
      </TouchableOpacity>
    </View>
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
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
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
    minWidth: 80,
  },
  disabledButton: {
    backgroundColor: "#E5E5E5",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  talkToOfficialButton: {
    backgroundColor: "#10B981",
    margin: 20,
    borderRadius: 12,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 56,
  },
  talkToOfficialButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
