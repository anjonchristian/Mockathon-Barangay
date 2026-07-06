import mongoose, { Document, Schema } from "mongoose";

export interface IMissedCallLog extends Document {
  firebaseUid: string;
  requestedAt: Date;
  createdAt: Date;
}

const MissedCallLogSchema = new Schema<IMissedCallLog>({
  firebaseUid: { type: String, required: true, index: true },
  requestedAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const MissedCallLog = mongoose.model<IMissedCallLog>(
  "MissedCallLog",
  MissedCallLogSchema
);
