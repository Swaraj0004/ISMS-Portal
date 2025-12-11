import mongoose, { Schema, models } from "mongoose";

const certificateSchema = new Schema(
  {
    certificateId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    program: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Certificate =
  models.Certificate || mongoose.model("Certificate", certificateSchema);

export default Certificate;
