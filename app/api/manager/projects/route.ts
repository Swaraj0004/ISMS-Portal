import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import Manager from "@/models/Manager";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { id } = await req.json();

    if (!id)
      return NextResponse.json({ error: "Manager ID is required" }, { status: 400 });

    const managerExists = await Manager.findById(id);
    if (!managerExists)
      return NextResponse.json({ error: "Manager not found" }, { status: 404 });

    const projects = await Project.find({ manager: id })
      .populate({
        path: "manager",
        select: "fullName email",
      })
      .populate({
        path: "interns.intern",
        select: "fullName email phone",
      })
      .lean();

    const formattedProjects = projects.map((p) => ({
      project: {
        _id: p._id,
        title: p.title,
        description: p.description,
      },
      startDate: p.startDate,
      endDate: p.endDate,
      status: p.isActive ? "in-progress" : "completed",
      interns: p.interns?.map((i: any) => ({
        intern: i.intern,
        startDate: i.startDate,
        endDate: i.endDate,
        status: i.status,
        feedback: i.feedback,
      })),
    }));

    return NextResponse.json({
      success: true,
      projects: formattedProjects,
    });
  } catch (err) {
    console.error("Error fetching manager projects:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
