import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Manager from "@/models/Manager";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();
  const manager = await Manager.findById(id).select("-password");
  if (!manager)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(manager);
}
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();
  const body = await req.json();

  const existingManager = await Manager.findById(id);
  if (!existingManager)
    return NextResponse.json({ error: "Manager not found" }, { status: 404 });

  if (!body.password) {
    body.password = existingManager.password;
  }

  const updated = await Manager.findByIdAndUpdate(id, body, {
    new: true,
  }).select("-password");

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await dbConnect();
  await Manager.findByIdAndDelete(id);
  return NextResponse.json({ message: "Manager deleted" });
}
