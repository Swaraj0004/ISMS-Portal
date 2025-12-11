import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id)
      return NextResponse.json({ error: "Missing intern ID" }, { status: 400 });

    await dbConnect();
    const intern = await Intern.findById(id)
      .populate("projectsAssigned.project")
      .populate("attendance.project")
      .select("-password");

    if (!intern) {
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });
    }

    return NextResponse.json(intern);
  } catch (error) {
    console.error("POST /api/admin/intern-docs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch intern documents" },
      { status: 500 }
    );
  }
}
