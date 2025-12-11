import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import Message from "@/models/Message";

export async function GET(req: NextRequest, context: any) {
  await connectDB();

  const projectId = context?.params?.projectId;

  try {
    const messages = await Message.find({ projectId }).sort({ createdAt: 1 });
    return NextResponse.json({ messages });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}


export async function POST(req: NextRequest, context: any) {
  await connectDB();

  const projectId = context?.params?.projectId;

  try {
    const body = await req.json();
    const { message, sender } = body;

    if (!message || !sender?._id) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const newMessage = await Message.create({
      projectId,
      message,
      sender,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: newMessage }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
