import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firebaseUid: string;
  email?: string;
  phoneNumber?: string;
  fullName: string;
  // PSGC Location Data
  regionCode: string;
  regionName: string;
  provinceCode: string;
  provinceName: string;
  cityMunicipalityCode: string;
  cityMunicipalityName: string;
  cityMunicipalityType: "city" | "municipality";
  barangayCode: string;
  barangayName: string;
  // ID Verification
  idPhotoBase64: string;
  idType: "national_id" | "barangay_id" | "other";
  idNumber?: string;
  isVerified: boolean;
  verificationStatus: "pending" | "approved" | "rejected";
  verificationNotes?: string;
  // Additional Info
  address?: string;
  birthDate?: string;
  gender?: "Male" | "Female" | "Other";
  nationality?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, sparse: true },
    phoneNumber: { type: String, sparse: true },
    fullName: { type: String, required: true },
    // PSGC Location Data
    regionCode: { type: String, required: true },
    regionName: { type: String, required: true },
    provinceCode: { type: String, required: true },
    provinceName: { type: String, required: true },
    cityMunicipalityCode: { type: String, required: true },
    cityMunicipalityName: { type: String, required: true },
    cityMunicipalityType: {
      type: String,
      enum: ["city", "municipality"],
      required: true,
    },
    barangayCode: { type: String, required: true },
    barangayName: { type: String, required: true },
    // ID Verification
    idPhotoBase64: { type: String, required: true },
    idType: {
      type: String,
      enum: ["national_id", "barangay_id", "other"],
      required: true,
    },
    idNumber: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    verificationNotes: { type: String },
    // Additional Info
    address: { type: String },
    birthDate: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    nationality: { type: String, default: "Filipino" },
  },
  {
    timestamps: true,
  }
);

// Compound index for location-based queries
UserSchema.index({ regionCode: 1, provinceCode: 1, cityMunicipalityCode: 1, barangayCode: 1 });

export const User = mongoose.model<IUser>("User", UserSchema);
