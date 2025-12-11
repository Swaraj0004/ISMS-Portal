import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Manager from "@/models/Manager"; 
import Project from "@/models/Project";

export async function GET() {
  try {
    await dbConnect();

    const projects = await Project.find({})
      .populate({
        path: "manager",
        select: "_id fullName",
        options: { strictPopulate: false },
      })
      .lean();


    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("Error in /api/project GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const project = await Project.create(body);
    return NextResponse.json(project);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, ...updateData } = body;

    const updatedProject = await Project.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    return NextResponse.json(updatedProject);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id)
      return NextResponse.json(
        { error: "Missing project ID" },
        { status: 400 }
      );

    await Project.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
