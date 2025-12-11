import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";
import Project from "@/models/Project";

export async function GET() {
  try {
    await dbConnect();

    const totalInterns = await Intern.countDocuments();
    const activeInterns = await Intern.countDocuments({ status: "active" });
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({
      status: "completed",
    });

    const internsByMonth = await Intern.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const projectStatus = await Project.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      totalInterns,
      activeInterns,
      totalProjects,
      completedProjects,
      internsByMonth,
      projectStatus,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
