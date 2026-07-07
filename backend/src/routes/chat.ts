import express from "express";
import rateLimit from "express-rate-limit";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  context?: {
    userId?: string;
    location?: {
      region?: string;
      province?: string;
      cityMunicipality?: string;
      barangay?: string;
    };
  };
}

export interface ChatResponse {
  success: boolean;
  data: {
    message: string;
    canEscalate: boolean;
    staffAvailable: boolean;
    suggestedActions?: string[];
  };
  error?: string;
}

// --- Gemini setup (shared with OCR route pattern) ---
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// --- FAQ knowledge base (kept as fallback when Gemini is unavailable) ---
const FAQ_KNOWLEDGE_BASE: Record<string, { answer: string; canEscalate: boolean }> = {
  documents: {
    answer:
      "You can request the following documents: Barangay Clearance, Certificate of Indigency, Barangay ID, and Certificate of Residency. Go to the Documents tab to start a request.",
    canEscalate: true,
  },
  clearance: {
    answer:
      "A Barangay Clearance certifies that you have no pending cases or records in the barangay. It's required for employment, business permits, and other government transactions.",
    canEscalate: true,
  },
  indigency: {
    answer:
      "A Certificate of Indigency certifies that you have limited financial capacity. It's required for financial assistance, scholarships, and medical aid applications.",
    canEscalate: true,
  },
  id: {
    answer:
      "A Barangay ID is an official identification card issued by your barangay. It serves as proof of residency and identity for various transactions.",
    canEscalate: true,
  },
  residency: {
    answer:
      "A Certificate of Residency proves that you are a resident of the barangay. It's required for school enrollment, bank accounts, and other local transactions.",
    canEscalate: true,
  },
  hours: {
    answer:
      "The barangay hall is typically open from 8:00 AM to 5:00 PM, Monday to Friday. Please check with your specific barangay for exact hours.",
    canEscalate: true,
  },
  contact: {
    answer:
      "You can contact your barangay hall by visiting in person or calling their official number. Check your Profile tab for specific contact information.",
    canEscalate: true,
  },
  blotter: {
    answer:
      "To file an e-Blotter (incident report), go to the e-Blotter tab and select the type of incident. You can attach photos and describe what happened.",
    canEscalate: true,
  },
  emergency: {
    answer:
      "For emergencies, please call 911 or your local emergency hotline immediately. The e-Blotter is for non-emergency incident reporting.",
    canEscalate: false,
  },
  help: {
    answer:
      "I'm here to help! You can ask me about: documents, barangay services, office hours, how to file reports, or anything else about e-Kap.",
    canEscalate: true,
  },
  default: {
    answer:
      "I'm not sure about that. Would you like me to connect you with a barangay staff member who can help you better?",
    canEscalate: true,
  },
};

// Simulated staff availability (in production, this would check actual staff online status)
let staffAvailable = true;

// --- Rate limiter: 10 requests / minute / IP, fails open ---
const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.setHeader("Retry-After", "60");
    res.status(429).json({
      success: false,
      error: "Too many messages. Please wait a moment before sending another message.",
    });
  },
  // Fail open: if the rate limiter store errors, do not block the request.
  skip: () => false,
  // express-rate-limit fails open by default on internal store errors.
});

// --- Conversation history (in-memory, limited) ---
interface HistoryEntry {
  messages: ChatMessage[];
  lastUpdated: number;
}
const conversationHistory = new Map<string, HistoryEntry>();
const HISTORY_TTL_MS = 30 * 60 * 1000; // 30 minutes
const MAX_HISTORY_MESSAGES = 5; // per user
const MAX_CONVERSATIONS = 100;

function getHistoryKey(req: express.Request): string {
  const ctx = (req.body as ChatRequest)?.context;
  return (
    ctx?.userId ||
    (req.headers["x-forwarded-for"] as string) ||
    req.ip ||
    "anonymous"
  );
}

function getConversation(key: string): ChatMessage[] {
  const entry = conversationHistory.get(key);
  if (!entry) return [];
  if (Date.now() - entry.lastUpdated > HISTORY_TTL_MS) {
    conversationHistory.delete(key);
    return [];
  }
  return entry.messages;
}

function pushConversation(key: string, msg: ChatMessage): void {
  // Evict expired / oldest conversations if we are at capacity
  if (conversationHistory.size >= MAX_CONVERSATIONS) {
    // First pass: drop expired
    const now = Date.now();
    for (const [k, v] of conversationHistory.entries()) {
      if (now - v.lastUpdated > HISTORY_TTL_MS) {
        conversationHistory.delete(k);
      }
    }
    // If still at capacity, evict the oldest
    while (conversationHistory.size >= MAX_CONVERSATIONS) {
      let oldestKey: string | null = null;
      let oldestTime = Infinity;
      for (const [k, v] of conversationHistory.entries()) {
        if (v.lastUpdated < oldestTime) {
          oldestTime = v.lastUpdated;
          oldestKey = k;
        }
      }
      if (oldestKey) conversationHistory.delete(oldestKey);
      else break;
    }
  }

  const existing = getConversation(key);
  existing.push(msg);
  // Keep only the last MAX_HISTORY_MESSAGES
  const trimmed = existing.slice(-MAX_HISTORY_MESSAGES);
  conversationHistory.set(key, { messages: trimmed, lastUpdated: Date.now() });
}

// --- Guardrails ---

const MAX_INPUT_LENGTH = 500;
const MAX_OUTPUT_LENGTH = 1000;

// Patterns that indicate prompt injection attempts
const PROMPT_INJECTION_PATTERNS: RegExp[] = [
  /ignore (all )?previous instructions/i,
  /ignore (the )?(above|prior|previous) (instructions|prompt|rules)/i,
  /disregard (the )?(previous|above|prior)/i,
  /system prompt/i,
  /you are now/i,
  /act as (if you are )?/i,
  /pretend (that )?you are/i,
  /forget (your )?(previous|prior) instructions/i,
  /override (your )?(system|safety) (prompt|instructions)/i,
  /reveal (your )?(system )?prompt/i,
  /\bDAN\b/i,
  /developer mode/i,
  /jailbreak/i,
];

/**
 * Strip HTML/script tags and trim input. Throws on invalid length.
 */
function sanitizeInput(message: string): string {
  if (typeof message !== "string") {
    throw new Error("Invalid message");
  }
  // Strip anything that looks like an HTML/script tag
  const stripped = message.replace(/<[^>]*>/g, "");
  const trimmed = stripped.trim();
  return trimmed;
}

/**
 * Returns true if the message looks like a prompt injection attempt.
 */
function detectPromptInjection(message: string): boolean {
  return PROMPT_INJECTION_PATTERNS.some((p) => p.test(message));
}

// Sensitive info patterns
const PHONE_PATTERN = /(\+63\s?\d{1,4}[\s-]?\d{3,4}[\s-]?\d{3,4})|(09\d{2}[\s-]?\d{3}[\s-]?\d{2,4})/g;
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
// URLs but allow mentions of "e-Kap" app features (we strip raw URLs, then restore e-Kap mentions)
const URL_PATTERN = /https?:\/\/[^\s]+/gi;
const ID_NUMBER_PATTERN = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
const CARD_PATTERN = /\b(?:\d[ -]*?){13,19}\b/g;
const BANK_ACCOUNT_PATTERN = /\b\d{10,16}\b/g;

const SAFE_FALLBACK =
  "I'm sorry, I can only help with barangay services through the e-Kap app. For other concerns, please talk to a barangay staff member via the \"Talk to Official\" feature.";

/**
 * Filter sensitive info out of the AI response and truncate.
 * If the response appears to leak sensitive data, replace with safe fallback.
 */
function filterOutput(response: string): string {
  if (typeof response !== "string") return SAFE_FALLBACK;

  let filtered = response;

  // Detect serious guardrail violations (PII / financial) before stripping -
  // if present, treat the whole response as unsafe.
  const hasCard = CARD_PATTERN.test(filtered);
  const hasId = ID_NUMBER_PATTERN.test(filtered);
  const hasBank = BANK_ACCOUNT_PATTERN.test(filtered);
  if (hasCard || hasId || hasBank) {
    return SAFE_FALLBACK;
  }

  // Strip phone numbers, emails, and raw URLs
  filtered = filtered
    .replace(PHONE_PATTERN, "[redacted]")
    .replace(EMAIL_PATTERN, "[redacted]")
    .replace(URL_PATTERN, "[link removed]");

  // Truncate to max length on a word boundary if possible
  if (filtered.length > MAX_OUTPUT_LENGTH) {
    const slice = filtered.slice(0, MAX_OUTPUT_LENGTH);
    const lastSpace = slice.lastIndexOf(" ");
    filtered = (lastSpace > 0 ? slice.slice(0, lastSpace) : slice) + "...";
  }

  return filtered.trim();
}

/**
 * Build the system prompt, injecting user location context if available.
 */
function buildSystemPrompt(context?: ChatRequest["context"]): string {
  const loc = context?.location;
  const locationLine =
    loc && (loc.barangay || loc.cityMunicipality || loc.province || loc.region)
      ? `- Location: ${[loc.barangay, loc.cityMunicipality, loc.province, loc.region]
          .filter(Boolean)
          .join(", ")}`
      : "- Location: not provided";

  return `You are e-Kap Assistant, a helpful chatbot for Philippine barangay (local government) services.
You help citizens with questions about:
- Barangay documents (clearance, ID, certificates)
- e-Blotter incident reporting
- Barangay office hours and contact
- General barangay services and procedures

IMPORTANT RULES:
1. ONLY answer questions related to barangay services and the e-Kap app.
2. If asked about unrelated topics (politics, religion, medical advice, legal advice, etc.), politely decline and redirect to barangay services.
3. NEVER ask for or process sensitive personal information (passwords, full ID numbers, financial details, bank accounts).
4. Keep responses concise (2-4 sentences) for mobile readability.
5. Respond in the same language the user uses (English, Tagalog, or Filipino).
6. If a question is complex or you cannot help, suggest the user talk to barangay staff via the "Talk to Official" feature.
7. Be friendly, respectful, and patient - many users are senior citizens.

User context (if available):
${locationLine}`;
}

/**
 * Detect suggested actions based on keywords in the AI response.
 */
function detectSuggestedActions(response: string): string[] {
  const lower = response.toLowerCase();
  const actions: string[] = [];
  if (lower.includes("document") || lower.includes("request") || lower.includes("clearance") || lower.includes("indigency") || lower.includes("residency")) {
    actions.push("Request a Document");
  }
  if (lower.includes("blotter") || lower.includes("report") || lower.includes("incident")) {
    actions.push("File e-Blotter");
  }
  if (lower.includes("staff") || lower.includes("official") || lower.includes("talk")) {
    actions.push("Talk to Staff");
  }
  return actions;
}

/**
 * Fallback to the existing FAQ keyword matching.
 */
function faqFallback(message: string): { answer: string; canEscalate: boolean; suggestedActions: string[] } {
  const lowerMessage = message.toLowerCase();
  let response = FAQ_KNOWLEDGE_BASE.default;

  for (const [keyword, faq] of Object.entries(FAQ_KNOWLEDGE_BASE)) {
    if (keyword !== "default" && lowerMessage.includes(keyword)) {
      response = faq;
      break;
    }
  }

  const suggestedActions: string[] = [];
  if (lowerMessage.includes("document") || lowerMessage.includes("clearance") || lowerMessage.includes("indigency")) {
    suggestedActions.push("Request a Document");
  }
  if (lowerMessage.includes("blotter") || lowerMessage.includes("report")) {
    suggestedActions.push("File e-Blotter");
  }
  if (lowerMessage.includes("help") || lowerMessage.includes("staff")) {
    suggestedActions.push("Talk to Staff");
  }

  return { answer: response.answer, canEscalate: response.canEscalate, suggestedActions };
}

/**
 * POST /api/chat
 * Send a message to the AI chatbot (Gemini-powered with guardrails)
 */
router.post("/", chatRateLimiter, async (req, res) => {
  try {
    const { message, context }: ChatRequest = req.body;

    // --- Input validation ---
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    let sanitized: string;
    try {
      sanitized = sanitizeInput(message);
    } catch {
      return res.status(400).json({
        success: false,
        error: "Invalid message",
      });
    }

    if (sanitized.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Message cannot be empty",
      });
    }

    if (sanitized.length > MAX_INPUT_LENGTH) {
      return res.status(400).json({
        success: false,
        error: `Message is too long. Please keep it under ${MAX_INPUT_LENGTH} characters.`,
      });
    }

    // --- Prompt injection check ---
    if (detectPromptInjection(sanitized)) {
      return res.status(400).json({
        success: false,
        error: "I can only answer questions about barangay services.",
      });
    }

    // --- Gemini availability check; fall back to FAQ if not configured ---
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY missing - falling back to FAQ");
      const fallback = faqFallback(sanitized);
      return res.json({
        success: true,
        data: {
          message: fallback.answer,
          canEscalate: fallback.canEscalate,
          staffAvailable,
          suggestedActions: fallback.suggestedActions.length > 0 ? fallback.suggestedActions : undefined,
        },
      });
    }

    const historyKey = getHistoryKey(req);
    const history = getConversation(historyKey);

    const systemPrompt = buildSystemPrompt(context);

    // Build contents for Gemini: system prompt first, then conversation history
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Seed with system prompt as the first user turn so the model treats it as instructions
    contents.push({ role: "user", parts: [{ text: systemPrompt }] });
    contents.push({
      role: "model",
      parts: [{ text: "Understood. I will act as e-Kap Assistant and follow these rules." }],
    });

    // Append prior conversation history
    for (const msg of history) {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    }

    // Append the current user message
    contents.push({ role: "user", parts: [{ text: sanitized }] });

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent({ contents });
      const rawResponse = result.response.text();
      const filtered = filterOutput(rawResponse);

      const suggestedActions = detectSuggestedActions(filtered);
      const lowerSanitized = sanitized.toLowerCase();
      const canEscalate = !lowerSanitized.includes("emergency");

      // Store in conversation history
      pushConversation(historyKey, {
        role: "user",
        content: sanitized,
        timestamp: new Date().toISOString(),
      });
      pushConversation(historyKey, {
        role: "assistant",
        content: filtered,
        timestamp: new Date().toISOString(),
      });

      return res.json({
        success: true,
        data: {
          message: filtered,
          canEscalate,
          staffAvailable,
          suggestedActions: suggestedActions.length > 0 ? suggestedActions : undefined,
        },
      });
    } catch (geminiError) {
      // Gemini failed (timeout, API error, etc.) - fall back to FAQ
      console.error("Gemini chat error, falling back to FAQ:", geminiError);
      const fallback = faqFallback(sanitized);
      return res.json({
        success: true,
        data: {
          message: fallback.answer,
          canEscalate: fallback.canEscalate,
          staffAvailable,
          suggestedActions: fallback.suggestedActions.length > 0 ? fallback.suggestedActions : undefined,
        },
      });
    }
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process message",
    });
  }
});

/**
 * GET /api/chat/staff-status
 * Check if staff is available for escalation
 */
router.get("/staff-status", (_req, res) => {
  res.json({
    success: true,
    data: {
      staffAvailable,
      estimatedWaitTime: staffAvailable ? 0 : 5, // minutes
    },
  });
});

/**
 * POST /api/chat/staff-status
 * Update staff availability (for admin use)
 */
router.post("/staff-status", (req, res) => {
  const { available } = req.body;

  if (typeof available !== "boolean") {
    return res.status(400).json({
      success: false,
      error: "Available must be a boolean",
    });
  }

  staffAvailable = available;

  res.json({
    success: true,
    data: {
      staffAvailable,
    },
  });
});

export default router;
