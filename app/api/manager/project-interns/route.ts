import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import Manager from "@/models/Manager";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { managerId } = await req.json();

    if (!managerId)
      return NextResponse.json(
        { error: "Manager ID is required" },
        { status: 400 }
      );

    const managerExists = await Manager.exists({ _id: managerId });
    if (!managerExists)
      return NextResponse.json({ error: "Manager not found" }, { status: 404 });

    const projects = await Project.find({ manager: managerId })
      .populate({
        path: "interns.intern",
        model: "Intern",
        select:
          "fullName email phone college course department semester isActive",
      })
      .select("title interns startDate endDate")
      .lean();

    if (!projects.length)
      return NextResponse.json(
        { success: true, interns: [], message: "No interns found for this manager" },
        { status: 200 }
      );

    const internsList = projects.flatMap((project) =>
      (project.interns || [])
        .filter((a: any) => a.intern)
        .map((a: any) => ({
          projectId: project._id,
          projectTitle: project.title,
          internId: a.intern._id,
          fullName: a.intern.fullName,
          email: a.intern.email,
          phone: a.intern.phone,
          college: a.intern.college,
          course: a.intern.course,
          department: a.intern.department,
          semester: a.intern.semester,
          startDate: a.startDate,
          endDate: a.endDate,
          status: a.status,
          feedback: a.feedback || "",
        }))
    );

    return NextResponse.json({ success: true, interns: internsList });
  } catch (err: any) {
    console.error("❌ Error fetching interns for manager projects:", err);
    return NextResponse.json(
      { error: "Internal server error", details: err.message },
      { status: 500 }
    );
  }
}
