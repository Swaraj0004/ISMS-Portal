import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import College, { ICollege } from "@/models/College";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const search = req.nextUrl.searchParams.get("search") || "";

    const query = search ? { name: { $regex: search, $options: "i" } } : {};

    const colleges = await College.find<ICollege>(query, { name: 1 })
      .sort({ name: 1 })
      .limit(10);

    return NextResponse.json(colleges);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name } = await req.json();

    if (!name)
      return NextResponse.json(
        { error: "College name missing" },
        { status: 400 }
      );

    const college = await College.findOne({ name });
    if (!college)
      return NextResponse.json(
        { message: "College not found" },
        { status: 404 }
      );

    return NextResponse.json(college);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { name, nameData } = await req.json();

    if (!name || !nameData)
      return NextResponse.json(
        { error: "Missing college name or nameData" },
        { status: 400 }
      );

    const college = await College.findOneAndUpdate(
      { name },
      { nameData },
      { new: true, upsert: true }
    );

    return NextResponse.json(college);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
