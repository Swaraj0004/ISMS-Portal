import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import Intern from "@/models/Intern";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
    }
    const { id } = body;

    await dbConnect();

    if (id) {
      const intern = await Intern.findById(id)
        .populate("projectsAssigned.project")
        .select("fullName email course department documents");

      if (!intern)
        return NextResponse.json(
          { error: "Intern not found" },
          { status: 404 }
        );

      return NextResponse.json({
        documents: intern.documents || [],
        fullName: intern.fullName,
        email: intern.email,
      });
    }

    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const intern = await Intern.findById(decoded.id)
      .populate("projectsAssigned.project")
      .select("-password");

    if (!intern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    return NextResponse.json(intern);
  } catch (error) {
    console.error("POST /api/intern/me error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const updateData = await req.json();

    await dbConnect();

    const intern = await Intern.findById(decoded.id);
    if (!intern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    const simpleFields = [
      "fullName",
      "course",
      "department",
      "semester",
      "refNo",
      "phone",
    ];
    simpleFields.forEach((f) => {
      if (updateData[f] !== undefined) intern[f] = updateData[f];
    });

    if (updateData.documents && Array.isArray(updateData.documents)) {
      intern.documents = [...(intern.documents || []), ...updateData.documents];
    }

    await intern.save();

    return NextResponse.json(intern);
  } catch (error) {
    console.error("PATCH /api/intern/me error:", error);
    return NextResponse.json(
      { error: "Failed to update intern" },
      { status: 500 }
    );
  }
}
