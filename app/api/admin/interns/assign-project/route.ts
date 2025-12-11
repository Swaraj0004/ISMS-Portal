import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { internId, projectId, startDate, endDate } = body;

  if (!internId || !projectId || !startDate || !endDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    await dbConnect();

    const intern = await Intern.findById(internId);
    if (!intern) return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    intern.projectsAssigned.push({
      project: projectId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: "assigned",
    });

    await intern.save();

    return NextResponse.json({ message: "Project assigned successfully", intern });
  } catch (error) {
    console.error("Assign project error:", error);
    return NextResponse.json({ error: "Failed to assign project" }, { status: 500 });
  }
}
