import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, JWT_SECRET);
    const intern = await Intern.findById(decoded.id).select("weeklyTasks");

    if (!intern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    return NextResponse.json(intern.weeklyTasks, { status: 200 });
  } catch (err) {
    console.error("GET /api/intern/tasks error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { internId, title, description, deadline } = body;

    if (!internId || !title || !description)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const intern = await Intern.findById(internId);
    if (!intern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    const task = {
      title,
      description,
      deadline,
      status: "pending",
      feedback: "",
      weekNumber: intern.weeklyTasks?.length + 1 || 1,
    };

    intern.weeklyTasks.push(task);
    await intern.save();

    return NextResponse.json(
      { message: "Task added successfully", task },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/intern/tasks error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { taskId, internId, status, feedback, document } = body;

    const intern = await Intern.findById(internId);
    if (!intern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    const task = intern.weeklyTasks.id(taskId);
    if (!task)
      return NextResponse.json({ error: "Task not found" }, { status: 404 });

    if (status) task.status = status;
    if (feedback) task.feedback = feedback;
    if (document) task.document = document;

    await intern.save();
    return NextResponse.json(
      { message: "Task updated", task },
      { status: 200 }
    );
  } catch (err) {
    console.error("PATCH /api/intern/tasks error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
