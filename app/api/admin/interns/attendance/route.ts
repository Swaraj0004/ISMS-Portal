import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";

export async function GET() {
  try {
    await dbConnect();

    const interns = await Intern.find({ isActive: true })
      .populate("projectsAssigned.project", "name description")
      .populate("mentor", "fullName email");

    const data = interns.map((intern) => {
      const attendance = intern.attendance || [];
      const present = attendance.filter(
        (a: any) => a.status === "present"
      ).length;
      const absent = attendance.filter(
        (a: any) => a.status === "absent"
      ).length;
      const pending = attendance.filter(
        (a: any) => a.status === "pending"
      ).length;

      return {
        id: intern._id,
        name: intern.fullName,
        college: intern.college,
        course: intern.course,
        project: intern.projectsAssigned[0]?.project?.name || "Not Assigned",
        mentor: intern.mentor?.fullName || "—",
        present,
        absent,
        pending,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
