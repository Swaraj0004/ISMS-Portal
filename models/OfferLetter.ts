import mongoose, { Schema } from "mongoose";

const offerLetterSchema = new Schema(
  {
    intern: { type: Schema.Types.ObjectId, ref: "Intern", required: true },
    refNo: { type: String, required: true },
    fullName: { type: String, required: true },
    collegeName: { type: String, required: true },
    department: { type: String, required: true },
    pdfData: { type: String, required: true },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.OfferLetter ||
  mongoose.model("OfferLetter", offerLetterSchema);
