import mongoose, { Document, Schema } from "mongoose";

export interface IBlotter extends Document {
  firebaseUid: string;
  reportId: string;
  incidentType:
    | "noise_complaint"
    | "property_dispute"
    | "theft"
    | "vandalism"
    | "harassment"
    | "other";
  title: string;
  description: string;
  location?: string;
  personsInvolved?: string;
  evidencePhotos: string[];
  status:
    | "under_review"
    | "scheduled_mediation"
    | "resolved"
    | "escalated_pnp";
  mediationDate: Date | null;
  mediationNotes: string;
  staffNotes: string;
  resolutionNotes: string;
  // PSGC location of reporter
  barangayCode: string;
  barangayName: string;
  cityMunicipalityCode: string;
  cityMunicipalityName: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlotterSchema = new Schema<IBlotter>(
  {
    firebaseUid: { type: String, required: true, index: true },
    reportId: { type: String, unique: true, index: true },
    incidentType: {
      type: String,
      enum: [
        "noise_complaint",
        "property_dispute",
        "theft",
        "vandalism",
        "harassment",
        "other",
      ],
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    location: { type: String, trim: true, maxlength: 500 },
    personsInvolved: { type: String, trim: true, maxlength: 1000 },
    evidencePhotos: [{ type: String }],
    status: {
      type: String,
      enum: [
        "under_review",
        "scheduled_mediation",
        "resolved",
        "escalated_pnp",
      ],
      default: "under_review",
      index: true,
    },
    mediationDate: { type: Date, default: null },
    mediationNotes: { type: String, trim: true, maxlength: 2000, default: "" },
    staffNotes: { type: String, trim: true, maxlength: 2000, default: "" },
    resolutionNotes: { type: String, trim: true, maxlength: 2000, default: "" },
    // PSGC location of reporter
    barangayCode: { type: String, required: true },
    barangayName: { type: String, required: true },
    cityMunicipalityCode: { type: String, required: true },
    cityMunicipalityName: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Blotter = mongoose.model<IBlotter>("Blotter", BlotterSchema);

// Auto-generate reportId like "BL-2024-0001" (attached after model creation
// so the model is in scope and not affected by temporal dead zone).
BlotterSchema.pre<IBlotter>("validate", async function () {
  if (!this.reportId) {
    const count = await Blotter.countDocuments();
    const year = new Date().getFullYear();
    this.reportId = `BL-${year}-${String(count + 1).padStart(4, "0")}`;
  }
});
