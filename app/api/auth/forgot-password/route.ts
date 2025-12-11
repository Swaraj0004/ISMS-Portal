import { NextRequest, NextResponse } from "next/server";
import Admin from "@/models/Admin";
import Manager from "@/models/Manager";
import Intern from "@/models/Intern";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/dbConnect";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const generateTempPasswordEmail = (fullName: string, tempPassword: string) => `
  <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2a3f54;">ISMS Portal – Temporary Password for Account Access</h2>
      <p>Dear <b>${fullName}</b>,</p>
      <p>
        This is a notification from the <b>ISMS Internship Portal</b> for the
        <b>MRSAC Internship Program</b>. Your temporary password is provided below; please use it
        to log into your account. For security reasons, you’ll be prompted to set a new password
        after your first login.
      </p>
      <p>
        <b>Temporary Password:</b>
        <span style="background-color:#f0f0f0; padding:4px 8px; border-radius:4px;">
          ${tempPassword}
        </span>
      </p>
      <p>If you need assistance, the ISMS support team is here to help.</p>
      <p>Best regards,<br/><b>ISMS Support Team</b></p>
    </body>
  </html>
`;

const generateTempPassword = (length = 10) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ error: "Email is required" }, { status: 400 });

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

    if (role === "Intern" && !user.isActive) {
      return NextResponse.json(
        { error: "Your internship account is not yet active." },
        { status: 403 }
      );
    }

    const tempPassword = generateTempPassword();

    user.password = tempPassword;
    await user.save();

    await transporter.sendMail({
      from: `"ISMS Internship Portal" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Temporary Password for ${role} Account Access`,
      html: generateTempPasswordEmail(user.fullName || "User", tempPassword),
    });

    return NextResponse.json({
      success: true,
      message: `Temporary password sent to your registered email (${role}).`,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
