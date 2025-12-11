import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Feedback from "@/models/Feedback";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { name, email, rating, message } = await req.json();

    if (!name || !rating || !message) {
      return NextResponse.json(
        { error: "Name, rating, and message are required." },
        { status: 400 }
      );
    }

    const feedback = await Feedback.create({ name, email, rating, message });

    return NextResponse.json(
      { success: true, feedback, message: "Feedback submitted successfully!" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, feedbacks });
  } catch (error: any) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedbacks." },
      { status: 500 }
    );
  }
}
