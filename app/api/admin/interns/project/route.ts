import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";

export async function GET() {
  try {
    await dbConnect();
    const interns = await Intern.find({ isActive: true })
      .select("-password")
      .populate({
        path: "projectsAssigned.project",
        select: "_id title",
      });
    return NextResponse.json(interns);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch interns" },
      { status: 500 }
    );
  }
}
