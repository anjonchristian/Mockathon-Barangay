import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";

interface SignalingMessage {
  type: "offer" | "answer" | "ice-candidate";
  target: string;
  data: unknown;
}

export function createWebSocketServer(port: number = 3001): WebSocketServer {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    const clientType = req.url?.includes("admin") ? "admin" : "mobile";
    console.log(`WebSocket client connected: ${clientType}`);

    ws.on("message", (raw: Buffer) => {
      try {
        const message: SignalingMessage = JSON.parse(raw.toString());

        // Broadcast to all other connected clients
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
          }
        });

        // Watchdog: if no answer within 15s, emit timeout
        if (message.type === "offer") {
          setTimeout(() => {
            // Check if answer was received (simplified - in production use a real state tracker)
            let answered = false;
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                // In a real implementation, track offer/answer pairs
              }
            });
            if (!answered && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "watchdog_timeout" }));
            }
          }, 15000);
        }
      } catch (err) {
        console.error("WebSocket message error:", err);
      }
    });

    ws.on("close", () => {
      console.log(`WebSocket client disconnected: ${clientType}`);
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err);
    });
  });

  console.log(`WebSocket server running on port ${port}`);
  return wss;
}
