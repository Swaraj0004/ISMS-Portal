import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
export async function GET(req: NextRequest) {
  const internId = req.headers.get("intern-id");

  if (!internId || !mongoose.Types.ObjectId.isValid(internId)) {
    return NextResponse.json({ error: "Invalid intern ID" }, { status: 400 });
  }

  try {
    await dbConnect();
    const intern = await Intern.findById(internId).select("notifications");

    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    const notifications = intern.notifications.sort(
      (a: { createdAt: Date }, b: { createdAt: Date }) =>
        b.createdAt.getTime() - a.createdAt.getTime()
    );
    return NextResponse.json({ notifications });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const intern = await Intern.findById(decoded.id);

    if (!intern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    const notifications = intern.notifications.sort(
      (a: { createdAt: Date }, b: { createdAt: Date }) =>
        b.createdAt.getTime() - a.createdAt.getTime()
    );

    return NextResponse.json({ notifications });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const { internId, notificationId } = await req.json();

  if (!internId || !notificationId) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  if (
    !mongoose.Types.ObjectId.isValid(internId) ||
    !mongoose.Types.ObjectId.isValid(notificationId)
  ) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await dbConnect();
    const intern = await Intern.findById(internId);
    if (!intern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    const notif = intern.notifications.id(notificationId);
    if (!notif)
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );

    notif.read = true;
    await intern.save();

    return NextResponse.json({
      success: true,
      notifications: intern.notifications,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}
