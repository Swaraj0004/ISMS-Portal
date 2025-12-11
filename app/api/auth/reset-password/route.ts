import { NextRequest, NextResponse } from "next/server";
import Admin from "@/models/Admin";
import Manager from "@/models/Manager";
import Intern from "@/models/Intern";
import dbConnect from "@/lib/dbConnect";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function PATCH(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const token = authHeader.replace("Bearer ", "");
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { email, currentPassword, newPassword } = await req.json();

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const collections = [
      { model: Admin, role: "Admin" },
      { model: Manager, role: "Manager" },
      { model: Intern, role: "Intern" },
    ];

    let user: any = null;
    let role = "";

    for (const { model, role: r } of collections) {
      const found = await model.findOne({ email });
      if (found) {
        user = found;
        role = r;
        break;
      }
    }

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch)
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 401 }
      );

    user.password = newPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: `Password updated successfully for ${role}.`,
    });
  } catch (err: any) {
    console.error("Reset password error:", err);
    if (err.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
