import mongoose, { Document, Schema } from "mongoose";

export interface IOcrCache extends Document {
  imageHash: string;
  result: object;
  createdAt: Date;
}

const OcrCacheSchema = new Schema<IOcrCache>({
  imageHash: { type: String, required: true, unique: true, index: true },
  result: { type: Schema.Types.Mixed, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 }, // TTL: 1 hour
});

export const OcrCache = mongoose.model<IOcrCache>("OcrCache", OcrCacheSchema);
