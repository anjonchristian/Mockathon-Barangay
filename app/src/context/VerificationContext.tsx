import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "../services/firebase";
import { getRegistrationStatus } from "../services/api";

const STORAGE_KEY = "ekap_verification_state";

export type VerificationStatus = "guest" | "pending" | "approved" | "rejected";

export interface RegistrationData {
  fullName: string;
  verificationStatus: VerificationStatus;
  isVerified: boolean;
}

interface VerificationState {
  isRegistered: boolean;
  isVerified: boolean;
  verificationStatus: VerificationStatus;
  firebaseUid: string | null;
  fullName: string | null;
}

interface VerificationContextValue extends VerificationState {
  /** Set registration data after a successful registration submission. */
  setRegistrationData: (data: RegistrationData) => void;
  /** Mark the current user as a guest (unverified) using their Firebase UID. */
  markAsGuest: (firebaseUid: string) => void;
  /** Re-fetch verification status from the backend for the current user. */
  refreshVerificationStatus: () => Promise<void>;
  /** Clear all verification state (e.g. on logout). */
  clearVerification: () => Promise<void>;
  /** Whether the provider is currently loading initial state. */
  isLoading: boolean;
}

const defaultState: VerificationState = {
  isRegistered: false,
  isVerified: false,
  verificationStatus: "guest",
  firebaseUid: null,
  fullName: null,
};

const VerificationContext = createContext<VerificationContextValue | undefined>(
  undefined
);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<VerificationState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  // Persist state to AsyncStorage whenever it changes (skip the initial default).
  const persistState = useCallback(async (next: VerificationState) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (error) {
      console.warn("Failed to persist verification state:", error);
    }
  }, []);

  const updateState = useCallback(
    (updater: (prev: VerificationState) => VerificationState) => {
      setState((prev) => {
        const next = updater(prev);
        persistState(next);
        return next;
      });
    },
    [persistState]
  );

  const setRegistrationData = useCallback(
    (data: RegistrationData) => {
      updateState((prev) => ({
        ...prev,
        isRegistered: true,
        isVerified: data.isVerified,
        verificationStatus: data.verificationStatus,
        fullName: data.fullName,
      }));
    },
    [updateState]
  );

  const markAsGuest = useCallback(
    (firebaseUid: string) => {
      updateState((prev) => ({
        ...prev,
        isRegistered: false,
        isVerified: false,
        verificationStatus: "guest",
        firebaseUid,
        fullName: null,
      }));
    },
    [updateState]
  );

  const refreshVerificationStatus = useCallback(async () => {
    const user = getCurrentUser();
    if (!user) {
      return;
    }
    try {
      const result = await getRegistrationStatus(user.uid);
      const status = normalizeVerificationStatus(result.verificationStatus);
      updateState((prev) => ({
        ...prev,
        firebaseUid: user.uid,
        isRegistered: true,
        isVerified: result.isVerified,
        verificationStatus: status,
        fullName: prev.fullName,
      }));
    } catch (error: any) {
      // 404 means the user is not registered yet -> treat as guest.
      if (error?.response?.status === 404) {
        updateState((prev) => ({
          ...prev,
          firebaseUid: user.uid,
          isRegistered: false,
          isVerified: false,
          verificationStatus: "guest",
          fullName: null,
        }));
      } else {
        console.warn("Failed to refresh verification status:", error);
      }
    }
  }, [updateState]);

  const clearVerification = useCallback(async () => {
    setState(defaultState);
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn("Failed to clear verification state:", error);
    }
  }, []);

  // On mount: load persisted state, then reconcile with Firebase auth + backend.
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initialize = async () => {
      // 1. Load any persisted state for a fast first paint.
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as VerificationState;
          setState(parsed);
        }
      } catch (error) {
        console.warn("Failed to load verification state:", error);
      }

      // 2. Reconcile with Firebase auth + backend registration status.
      const user = getCurrentUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getRegistrationStatus(user.uid);
        const status = normalizeVerificationStatus(result.verificationStatus);
        const next: VerificationState = {
          firebaseUid: user.uid,
          isRegistered: true,
          isVerified: result.isVerified,
          verificationStatus: status,
          fullName: null,
        };
        setState(next);
        persistState(next);
      } catch (error: any) {
        if (error?.response?.status === 404) {
          // Not registered -> guest.
          const next: VerificationState = {
            firebaseUid: user.uid,
            isRegistered: false,
            isVerified: false,
            verificationStatus: "guest",
            fullName: null,
          };
          setState(next);
          persistState(next);
        } else {
          console.warn("Failed to fetch registration status on init:", error);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [persistState]);

  const value: VerificationContextValue = {
    ...state,
    setRegistrationData,
    markAsGuest,
    refreshVerificationStatus,
    clearVerification,
    isLoading,
  };

  return (
    <VerificationContext.Provider value={value}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification(): VerificationContextValue {
  const ctx = useContext(VerificationContext);
  if (!ctx) {
    throw new Error("useVerification must be used within a VerificationProvider");
  }
  return ctx;
}

/**
 * Normalize backend verification status strings into the canonical union type.
 * The backend may return values like "pending_review" which maps to "pending".
 */
function normalizeVerificationStatus(
  raw: string
): VerificationStatus {
  const normalized = (raw || "").toLowerCase().trim();
  if (normalized === "approved") return "approved";
  if (normalized === "rejected") return "rejected";
  if (
    normalized === "pending" ||
    normalized === "pending_review" ||
    normalized.startsWith("pending")
  ) {
    return "pending";
  }
  // Unknown / unregistered users default to guest.
  return "guest";
}
