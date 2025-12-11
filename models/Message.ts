import mongoose, { Schema, model, models } from "mongoose";

interface IMessage {
  projectId: string;
  message: string;
  sender: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  projectId: { type: String, required: true },
  message: { type: String, required: true },
  sender: {
    _id: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const Message = models.Message || model<IMessage>("Message", MessageSchema);
export default Message;
