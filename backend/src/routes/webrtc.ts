import express from "express";

const router = express.Router();

export interface WebRTCSignal {
  type: "offer" | "answer" | "ice-candidate";
  data: any;
  userId: string;
  targetUserId?: string;
}

export interface CallRequest {
  userId: string;
  type: "audio" | "video";
  reason?: string;
}

export interface CallResponse {
  success: boolean;
  data: {
    callId: string;
    status: "pending" | "connected" | "ended" | "rejected";
    message?: string;
  };
  error?: string;
}

// In-memory call storage (in production, use Redis or database)
const activeCalls = new Map<string, {
  userId: string;
  type: "audio" | "video";
  status: "pending" | "connected" | "ended" | "rejected";
  startTime: Date;
  signals: WebRTCSignal[];
}>();

let callIdCounter = 0;

/**
 * POST /api/webrtc/call
 * Request a call with staff
 */
router.post("/call", async (req, res) => {
  try {
    const { userId, type, reason }: CallRequest = req.body;

    if (!userId || !type) {
      return res.status(400).json({
        success: false,
        error: "userId and type are required",
      });
    }

    if (!["audio", "video"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Type must be 'audio' or 'video'",
      });
    }

    // Generate call ID
    const callId = `call_${++callIdCounter}`;

    // Store call
    activeCalls.set(callId, {
      userId,
      type,
      status: "pending",
      startTime: new Date(),
      signals: [],
    });

    // In production, this would:
    // 1. Notify staff via WebSocket
    // 2. Check if staff is available
    // 3. Start 15-second watchdog timer

    res.json({
      success: true,
      data: {
        callId,
        status: "pending",
        message: reason ? `Call request: ${reason}` : "Incoming call request",
      },
    });
  } catch (error) {
    console.error("Call request error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create call request",
    });
  }
});

/**
 * POST /api/webrtc/signal
 * Exchange WebRTC signaling data
 */
router.post("/signal", async (req, res) => {
  try {
    const { callId, type, data, userId, targetUserId } = req.body as WebRTCSignal & { callId: string };

    if (!callId || !type || !data || !userId) {
      return res.status(400).json({
        success: false,
        error: "callId, type, data, and userId are required",
      });
    }

    const call = activeCalls.get(callId);
    if (!call) {
      return res.status(404).json({
        success: false,
        error: "Call not found",
      });
    }

    // Store signal
    call.signals.push({
      type,
      data,
      userId,
      targetUserId,
    });

    // In production, this would:
    // 1. Send signal to target via WebSocket
    // 2. Handle ICE candidates
    // 3. Establish peer connection

    res.json({
      success: true,
      data: {
        message: "Signal received",
      },
    });
  } catch (error) {
    console.error("Signal error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process signal",
    });
  }
});

/**
 * GET /api/webrtc/call/:callId
 * Get call status
 */
router.get("/call/:callId", (req, res) => {
  try {
    const { callId } = req.params;

    const call = activeCalls.get(callId);
    if (!call) {
      return res.status(404).json({
        success: false,
        error: "Call not found",
      });
    }

    res.json({
      success: true,
      data: {
        callId,
        status: call.status,
        type: call.type,
        startTime: call.startTime,
      },
    });
  } catch (error) {
    console.error("Get call status error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch call status",
    });
  }
});

/**
 * PUT /api/webrtc/call/:callId/status
 * Update call status (for staff use)
 */
router.put("/call/:callId/status", (req, res) => {
  try {
    const { callId } = req.params;
    const { status } = req.body;

    if (!["pending", "connected", "ended", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
      });
    }

    const call = activeCalls.get(callId);
    if (!call) {
      return res.status(404).json({
        success: false,
        error: "Call not found",
      });
    }

    call.status = status;

    res.json({
      success: true,
      data: {
        callId,
        status,
      },
    });
  } catch (error) {
    console.error("Update call status error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update call status",
    });
  }
});

/**
 * DELETE /api/webrtc/call/:callId
 * End a call
 */
router.delete("/call/:callId", (req, res) => {
  try {
    const { callId } = req.params;

    const call = activeCalls.get(callId);
    if (!call) {
      return res.status(404).json({
        success: false,
        error: "Call not found",
      });
    }

    call.status = "ended";

    // In production, clean up after delay
    setTimeout(() => {
      activeCalls.delete(callId);
    }, 5000);

    res.json({
      success: true,
      data: {
        callId,
        status: "ended",
      },
    });
  } catch (error) {
    console.error("End call error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to end call",
    });
  }
});

export default router;
