import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Chat from "@/models/Chat";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.id;

    
    const body = await req.json();
    const { projectId, message } = body;

    if (!projectId) return NextResponse.json({ error: "Project ID required" }, { status: 400 });

    await dbConnect();

    
    if (message && message.trim() !== "") {
      await Chat.create({
        project: projectId,
        sender: userId,
        message: message.trim(),
      });
    }

    
    const messages = await Chat.find({ project: projectId })
      .sort({ createdAt: 1 })
      .populate("sender", "fullName email");

    return NextResponse.json(messages);
  } catch (err: any) {
    console.error("Chat POST error:", err);
    return NextResponse.json({ error: err.message || "Something went wrong" }, { status: 500 });
  }
}
