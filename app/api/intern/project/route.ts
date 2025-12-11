import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();

    const { internId, projectId, startDate, endDate, status } = body;

    if (!internId || !projectId) {
      return NextResponse.json(
        { error: "Missing internId or projectId" },
        { status: 400 }
      );
    }

    await dbConnect();
    const intern = await Intern.findById(internId);
    if (!intern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    const assignments =
      intern.projectsAssigned as (typeof intern.projectsAssigned)[number][];
    const assignment = assignments.find(
      (a) => a.project?.toString() === projectId
    );

    if (!assignment)
      return NextResponse.json(
        { error: "Assignment not found" },
        { status: 404 }
      );

    if (startDate) assignment.startDate = new Date(startDate);
    if (endDate) assignment.endDate = new Date(endDate);
    if (status) assignment.status = status;

    await intern.save();
    return NextResponse.json({ message: "Assignment updated", intern });
  } catch (err: any) {
    console.error("🔥 PATCH ERROR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { internId, projectId } = await req.json();

    if (!internId || !projectId) {
      return NextResponse.json(
        { error: "Missing internId or projectId" },
        { status: 400 }
      );
    }

    const intern = await Intern.findById(internId);
    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    intern.projectsAssigned = intern.projectsAssigned.filter(
      (a: any) => a.project.toString() !== projectId.toString()
    );

    await intern.save();

    return NextResponse.json({ message: "Assignment deleted successfully" });
  } catch (error: any) {
    console.error("DELETE /api/intern/project Error:", error);
    return NextResponse.json(
      { error: "Failed to delete assignment" },
      { status: 500 }
    );
  }
}
