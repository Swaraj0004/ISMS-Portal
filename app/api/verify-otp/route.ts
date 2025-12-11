import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OtpModel from "@/models/Otp";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { email, otp } = await req.json();
    if (!email || !otp)
      return NextResponse.json(
        { error: "Email & OTP required" },
        { status: 400 }
      );

    const record = await OtpModel.findOne({ email });
    if (!record)
      return NextResponse.json(
        { error: "No OTP found, please request again" },
        { status: 400 }
      );

    if (record.expireAt < new Date())
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    if (record.otp !== otp)
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    await OtpModel.deleteOne({ email });

    return NextResponse.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
