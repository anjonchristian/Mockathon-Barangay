import { Alert } from "react-native";

export type VoiceLanguage = "en-US" | "fil-PH";

export interface VoiceServiceState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  language: VoiceLanguage;
}

const SILENCE_TIMEOUT_MS = 30000;

let silenceTimer: ReturnType<typeof setTimeout> | null = null;

export function clearSilenceTimer(): void {
  if (silenceTimer) {
    clearTimeout(silenceTimer);
    silenceTimer = null;
  }
}

export function startSilenceTimer(onTimeout: () => void): void {
  clearSilenceTimer();
  silenceTimer = setTimeout(onTimeout, SILENCE_TIMEOUT_MS);
}

export function getLanguageLabel(lang: VoiceLanguage): string {
  return lang === "en-US" ? "English" : "Tagalog";
}

export function toggleLanguage(current: VoiceLanguage): VoiceLanguage {
  return current === "en-US" ? "fil-PH" : "en-US";
}

export function processVoiceCommand(
  text: string,
  currentValue: string
): { processed: string; wasCommand: boolean } {
  const lower = text.toLowerCase().trim();

  if (lower === "clear" || lower === "i-clear" || lower === "burahin") {
    return { processed: "", wasCommand: true };
  }

  if (lower === "delete" || lower === "i-delete" || lower === "tanggalin") {
    const words = currentValue.trim().split(" ");
    words.pop();
    return { processed: words.join(" "), wasCommand: true };
  }

  return { processed: text, wasCommand: false };
}

export function showPermissionDeniedAlert(): void {
  Alert.alert(
    "Microphone Permission Required",
    "Please enable microphone access in your device settings to use voice dictation.",
    [{ text: "OK" }]
  );
}

export const SUPPORTED_LANGUAGES: { value: VoiceLanguage; label: string }[] = [
  { value: "en-US", label: "English" },
  { value: "fil-PH", label: "Tagalog" },
];
