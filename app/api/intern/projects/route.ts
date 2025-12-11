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
      .select("projectsAssigned")
      .populate({
        path: "projectsAssigned.project",
        select: "title description",
      });

    if (!intern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    return NextResponse.json({ projects: intern.projectsAssigned });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
