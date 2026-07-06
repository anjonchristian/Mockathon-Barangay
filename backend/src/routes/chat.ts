import express from "express";

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

// FAQ knowledge base (simplified for MVP)
const FAQ_KNOWLEDGE_BASE: Record<string, { answer: string; canEscalate: boolean }> = {
  documents: {
    answer: "You can request the following documents: Barangay Clearance, Certificate of Indigency, Barangay ID, and Certificate of Residency. Go to the Documents tab to start a request.",
    canEscalate: true,
  },
  clearance: {
    answer: "A Barangay Clearance certifies that you have no pending cases or records in the barangay. It's required for employment, business permits, and other government transactions.",
    canEscalate: true,
  },
  indigency: {
    answer: "A Certificate of Indigency certifies that you have limited financial capacity. It's required for financial assistance, scholarships, and medical aid applications.",
    canEscalate: true,
  },
  id: {
    answer: "A Barangay ID is an official identification card issued by your barangay. It serves as proof of residency and identity for various transactions.",
    canEscalate: true,
  },
  residency: {
    answer: "A Certificate of Residency proves that you are a resident of the barangay. It's required for school enrollment, bank accounts, and other local transactions.",
    canEscalate: true,
  },
  hours: {
    answer: "The barangay hall is typically open from 8:00 AM to 5:00 PM, Monday to Friday. Please check with your specific barangay for exact hours.",
    canEscalate: true,
  },
  contact: {
    answer: "You can contact your barangay hall by visiting in person or calling their official number. Check your Profile tab for specific contact information.",
    canEscalate: true,
  },
  blotter: {
    answer: "To file an e-Blotter (incident report), go to the e-Blotter tab and select the type of incident. You can attach photos and describe what happened.",
    canEscalate: true,
  },
  emergency: {
    answer: "For emergencies, please call 911 or your local emergency hotline immediately. The e-Blotter is for non-emergency incident reporting.",
    canEscalate: false,
  },
  help: {
    answer: "I'm here to help! You can ask me about: documents, barangay services, office hours, how to file reports, or anything else about e-Kap.",
    canEscalate: true,
  },
  default: {
    answer: "I'm not sure about that. Would you like me to connect you with a barangay staff member who can help you better?",
    canEscalate: true,
  },
};

// Simulated staff availability (in production, this would check actual staff online status)
let staffAvailable = true;

/**
 * POST /api/chat
 * Send a message to the AI chatbot
 */
router.post("/", async (req, res) => {
  try {
    const { message, context }: ChatRequest = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // Simple keyword matching for FAQ (in production, use actual AI/Gemini)
    const lowerMessage = message.toLowerCase();
    let response = FAQ_KNOWLEDGE_BASE.default;

    // Check for keywords
    for (const [keyword, faq] of Object.entries(FAQ_KNOWLEDGE_BASE)) {
      if (keyword !== "default" && lowerMessage.includes(keyword)) {
        response = faq;
        break;
      }
    }

    // Determine suggested actions based on context
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

    res.json({
      success: true,
      data: {
        message: response.answer,
        canEscalate: response.canEscalate,
        staffAvailable,
        suggestedActions: suggestedActions.length > 0 ? suggestedActions : undefined,
      },
    });
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
