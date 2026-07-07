import mongoose, { Document, Schema } from "mongoose";

export interface IBarangayIDRequest extends Document {
  firebaseUid: string;
  fullName: string;
  address: string;
  birthDate: string;
  gender: "Male" | "Female" | "Other";
  nationality: string;
  idType: "national_id" | "barangay_id";
  idNumber: string;
  idPhotoBase64: string;
  // PSGC Location Data
  regionCode?: string;
  regionName?: string;
  cityMunicipalityCode?: string;
  cityMunicipalityName?: string;
  barangayCode?: string;
  barangayName?: string;
  status:
    | "pending_review"
    | "processing"
    | "approved"
    | "completed"
    | "rejected";
  staffNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BarangayIDRequestSchema = new Schema<IBarangayIDRequest>(
  {
    firebaseUid: { type: String, required: true, index: true },
    fullName: { type: String, required: true },
    address: { type: String, required: true },
    birthDate: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    nationality: { type: String, default: "Filipino" },
    idType: { type: String, enum: ["national_id", "barangay_id"], required: true },
    idNumber: { type: String, required: true },
    idPhotoBase64: { type: String, required: true },
    // PSGC Location Data
    regionCode: { type: String },
    regionName: { type: String },
    cityMunicipalityCode: { type: String },
    cityMunicipalityName: { type: String },
    barangayCode: { type: String },
    barangayName: { type: String },
    status: {
      type: String,
      enum: [
        "pending_review",
        "processing",
        "approved",
        "completed",
        "rejected",
      ],
      default: "pending_review",
      index: true,
    },
    staffNotes: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const BarangayIDRequest = mongoose.model<IBarangayIDRequest>(
  "BarangayIDRequest",
  BarangayIDRequestSchema
);
