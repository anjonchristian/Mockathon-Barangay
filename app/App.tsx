import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { loginAnonymously, onAuthChange } from "./src/services/firebase";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Try to sign in anonymously on launch
    loginAnonymously()
      .then(() => setIsReady(true))
      .catch((err) => {
        console.error("Auth error:", err);
        // Even if auth fails, allow app to proceed for MVP
        setError(err.message);
        setIsReady(true);
      });

    // Listen for auth state
    const unsub = onAuthChange((user) => {
      if (user) {
        console.log("Authenticated as:", user.uid);
      }
    });

    return () => unsub();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 16, fontSize: 16 }}>Loading...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>e-Kap</Text>
        <Text style={{ fontSize: 16, marginTop: 8, color: "#666" }}>Barangay ID Request</Text>
        {error && (
          <Text style={{ fontSize: 12, marginTop: 8, color: "red" }}>
            Auth warning: {error}
          </Text>
        )}
        <StatusBar style="auto" />
      </View>
    </SafeAreaProvider>
  );
}
