import mongoose, { Schema, Document } from "mongoose";
// Ensure Manager model is registered before referencing it in refs
import "./Manager";

const internAssignmentSchema = new Schema(
  {
    intern: { type: Schema.Types.ObjectId, ref: "Intern", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
    feedback: { type: String, trim: true },
    assignedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

export interface IProject extends Document {
  title: string;
  description: string;
  manager: mongoose.Types.ObjectId;
  interns: mongoose.Types.ObjectId[];
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    manager: { type: Schema.Types.ObjectId, ref: "Manager", required: true },
    interns: [internAssignmentSchema],
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Project =
  mongoose.models.Project || mongoose.model<IProject>("Project", projectSchema);

export default Project;
