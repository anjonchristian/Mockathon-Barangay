import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/ekap";
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 3000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(uri);
      console.log(`MongoDB connected: ${mongoose.connection.host}`);
      return;
    } catch (error) {
      console.error(`MongoDB connection attempt ${attempt}/${MAX_RETRIES} failed:`, error);
      if (attempt === MAX_RETRIES) {
        console.error("All connection attempts exhausted. Exiting.");
        process.exit(1);
      }
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }
  }
}

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected. Attempting reconnection...");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
