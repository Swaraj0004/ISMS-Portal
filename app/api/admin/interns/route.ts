import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";

export async function GET() {
  try {
    await dbConnect();
    const interns = await Intern.find({ isActive: true }).select(
      "-password"
    );
    return NextResponse.json(interns);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch interns" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;

    if (!_id) return NextResponse.json({ error: "Intern ID missing" }, { status: 400 });

    await dbConnect();
    const updatedIntern = await Intern.findByIdAndUpdate(_id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedIntern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    return NextResponse.json(updatedIntern);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update intern" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { _id } = await req.json();
    if (!_id) return NextResponse.json({ error: "Intern ID missing" }, { status: 400 });

    await dbConnect();
    await Intern.findByIdAndDelete(_id);

    return NextResponse.json({ message: "Intern deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete intern" }, { status: 500 });
  }
}
