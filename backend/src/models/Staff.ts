import mongoose, { Document, Schema } from "mongoose";

export type StaffRole = "staff" | "admin" | "captain";

export interface IStaff extends Document {
  firebaseUid?: string;
  email: string;
  fullName: string;
  role: StaffRole;
  position: string;
  barangayCode?: string;
  barangayName?: string;
  cityMunicipalityCode?: string;
  cityMunicipalityName?: string;
  isActive: boolean;
  lastLoginAt: Date | null;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    firebaseUid: { type: String, unique: true, sparse: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["staff", "admin", "captain"],
      default: "staff",
      index: true,
    },
    position: { type: String, trim: true, default: "" },
    barangayCode: { type: String, trim: true },
    barangayName: { type: String, trim: true },
    cityMunicipalityCode: { type: String, trim: true },
    cityMunicipalityName: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    lastLoginAt: { type: Date, default: null },
    phoneNumber: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
  }
);

export const Staff = mongoose.model<IStaff>("Staff", StaffSchema);
