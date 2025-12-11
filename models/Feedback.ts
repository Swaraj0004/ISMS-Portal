import mongoose, { Schema, models } from "mongoose";

const feedbackSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    rating: { type: Number, min: 1, max: 5, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const Feedback = models.Feedback || mongoose.model("Feedback", feedbackSchema);
export default Feedback;
