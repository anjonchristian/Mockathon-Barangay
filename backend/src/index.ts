import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { createWebSocketServer } from "./ws.js";
import ocrRouter from "./routes/ocr.js";
import requestsRouter from "./routes/requests.js";
import watchdogRouter from "./routes/watchdog.js";

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
const WS_PORT = 3001;

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "e-Kap API running", version: "1.0.0" });
});

// Routes
app.use("/api/ocr", ocrRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/watchdog", watchdogRouter);

// Start server
async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // WebSocket server
  createWebSocketServer(WS_PORT);
}

start().catch(console.error);
