import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

export interface IAdmin {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  password: string;
  role: "admin";
  isActive: boolean;
  createdAt?: Date;
  lastLogin?: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin", enum: ["admin"] },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
