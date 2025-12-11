import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";
import nodemailer from "nodemailer";

export const config = { api: { bodyParser: true } };

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const body = await req.json();
    const {
      fullName,
      college,
      course,
      department,
      semester,
      refNo,
      email,
      phone,
      interview,
      recommendation,
      collegeId,
    } = body;

    if (
      !fullName ||
      !college ||
      !course ||
      !department ||
      !semester ||
      !refNo ||
      !email ||
      !phone ||
      !interview ||
      !recommendation ||
      !collegeId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(phone))
      return NextResponse.json(
        { error: "Phone number must be 10 digits" },
        { status: 400 }
      );

    if (!/\S+@\S+\.\S+/.test(email))
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );

    const interviewDate = new Date(interview);

    const istDateString = interviewDate.toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    const istDate = new Date(istDateString);

    const day = istDate.getDay();
    const hours = istDate.getHours();
    const holidays = [new Date("2025-10-20"), new Date("2025-10-25")];
    const isHoliday = holidays.some(
      (h) => h.toDateString() === istDate.toDateString()
    );

    if (day === 0 || day === 6)
      return NextResponse.json(
        { error: "Weekends are not allowed" },
        { status: 400 }
      );
    if (isHoliday)
      return NextResponse.json(
        { error: "Selected date is a holiday" },
        { status: 400 }
      );
    if (hours < 11 || hours >= 17)
      return NextResponse.json(
        { error: "Interview time must be between 11:00 and 17:00 IST" },
        { status: 400 }
      );

    const intern = await Intern.create({
      fullName,
      college,
      course,
      department,
      semester,
      refNo,
      email,
      phone,
      interview: interviewDate,
      recommendation,
      collegeId,
    });

    (async () => {
      try {
        await transporter.sendMail({
          from: `"ISMS Support" <${process.env.SMTP_USER}>`,
          to: email,
          subject: "ISMS Internship Interview Schedule Confirmation",
          html: `
            <p>Dear ${fullName},</p>
            <p>Warm greetings from the Maharashtra Remote Sensing Application Center (MRSAC).</p>
            <p>Your registration is successful. Here are your interview details:</p>
            <p><strong>Date:</strong> ${interviewDate.toLocaleDateString(
            "en-US",
            {
              timeZone: "Asia/Kolkata",
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          )}<br/>
            <strong>Time:</strong> ${interviewDate.toLocaleTimeString("en-US", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
          })}<br/>
            <strong>Mode:</strong> Offline<br/>
            <strong>Venue:</strong> MRSAC, VNIT Campus, S.A. Rd, Nagpur, Maharashtra, India - 440010</p>
            <p>Please contact [Support Email] for rescheduling or queries.</p>
            <p>Best regards,<br/>ISMS Support Team<br/>MRSAC</p>
          `,
        });
      } catch (err) {
        console.error("Failed to send confirmation email:", err);
      }
    })();

    return NextResponse.json({
      message:
        "Registration successful, confirmation email will be sent shortly",
      intern,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to register intern" },
      { status: 500 }
    );
  }
}
