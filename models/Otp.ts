import mongoose, { Schema, model, models } from "mongoose";

const otpSchema = new Schema({
  email: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  expireAt: { type: Date, required: true },
});

export default models.Otp || model("Otp", otpSchema);
