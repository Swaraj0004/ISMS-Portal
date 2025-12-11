import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OtpModel from "@/models/Otp";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const { email, fullName } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expireAt = new Date(Date.now() + 5 * 60 * 1000);

    await OtpModel.findOneAndUpdate(
      { email },
      { otp, expireAt },
      { upsert: true }
    );

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const htmlMessage = `
      <p>Dear <strong>${fullName || "User"}</strong>,</p>
      <p>Warm greetings from the Maharashtra Remote Sensing Application Center (MRSAC).</p>
      <p>Thank you for registering on the <strong>ISMS Internship Management System</strong> — the official portal for MRSAC internship programs. Before proceeding further, please verify your email address to activate your account.</p>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>Please enter this code in the registration form on the ISMS portal to verify your email address and proceed with the registration process. This step ensures secure communication and helps us keep your account safe.</p>
      <p>If you did not initiate this registration, please ignore this message.</p>
      <br/>
      <p>Best regards,<br/>ISMS Support Team<br/>Maharashtra Remote Sensing Application Center (MRSAC)</p>
    `;

    await transporter.sendMail({
      from: `"ISMS Support Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify Your Email Address – ISMS Internship Portal",
      html: htmlMessage,
    });

    return NextResponse.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
