import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

export interface IManager {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: "manager";
  createdAt?: Date;
  projectsAssigned: mongoose.Types.ObjectId[];
  isActive: boolean;
  lastLogin?: Date;
}

const managerSchema = new Schema<IManager>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "manager", enum: ["manager"] },
    projectsAssigned: [{ type: Schema.Types.ObjectId, ref: "Project" }],
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

managerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

managerSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Manager ||
  mongoose.model("Manager", managerSchema);
