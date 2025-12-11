import mongoose, { Schema } from "mongoose";

export interface ICollege {
  taluka: string;
  name: string;
  nameData?: string;
}

const collegeSchema = new Schema<ICollege>({
  taluka: { type: String, required: true },
  name: { type: String, required: true },
  nameData: { type: String, default: "" },
});

export default mongoose.models.College || mongoose.model<ICollege>("College", collegeSchema);
