import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import Manager from "@/models/Manager";
import Intern from "@/models/Intern";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "fallback_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedUsername = username.trim().toLowerCase();

    await dbConnect();

    const collections = [
      { model: Admin, role: "admin" },
      { model: Manager, role: "manager" },
      { model: Intern, role: "intern" },
    ];

    let user: any = null;
    let role = "";

    for (const { model, role: r } of collections) {
      const found = await model.findOne({ email: normalizedUsername });
      if (found) {
        user = found;
        role = r;
        break;
      }
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.password) {
      return NextResponse.json(
        { error: "User record incomplete" },
        { status: 500 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (role === "intern" && !user.isActive) {
      return NextResponse.json(
        { error: "Your account is not yet activated. Please contact admin." },
        { status: 403 }
      );
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        name: user.fullName || user.username,
      },
      JWT_SECRET as any,
      { expiresIn: JWT_EXPIRES_IN } as any
    );

    const { password: _, ...safeUser } = user.toObject();

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: safeUser,
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
