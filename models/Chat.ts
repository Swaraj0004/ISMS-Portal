import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "Intern", required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);
