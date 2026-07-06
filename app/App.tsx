import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View, Text, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { loginAnonymously, onAuthChange } from "./src/services/firebase";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loginAnonymously()
      .then(() => setIsReady(true))
      .catch((err) => {
        console.error("Auth error:", err);
        setError(err.message);
        setIsReady(true);
      });

    const unsub = onAuthChange((user) => {
      if (user) {
        console.log("Authenticated as:", user.uid);
      }
    });

    return () => unsub();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 32 }}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={{ marginTop: 24, fontSize: 18, fontWeight: "600", color: "#333", textAlign: "center" }}>
          Getting Ready...
        </Text>
        <Text style={{ marginTop: 8, fontSize: 16, color: "#666", textAlign: "center" }}>
          {error ? "Something went wrong. Please restart the app." : "Preparing e-Kap for you"}
        </Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
