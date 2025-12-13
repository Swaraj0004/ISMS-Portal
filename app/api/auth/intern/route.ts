import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";
import nodemailer from "nodemailer";

export const config = { api: { bodyParser: true } };

// Create transport per-request to avoid stale global connections and allow
// runtime verification and verbose logging for TLS handshake issues.

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
      const smtpPort = Number(process.env.SMTP_PORT) || 587;
      const mailOptions = {
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
      };

      const transporterLocal = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: smtpPort === 465,
        requireTLS: smtpPort !== 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        tls: { minVersion: "TLSv1.2", rejectUnauthorized: false },
        connectionTimeout: 20000,
        greetingTimeout: 20000,
        socketTimeout: 20000,
        logger: true,
        debug: true,
      });

      try {
        console.log("Attempting transporter.verify for host/port:", process.env.SMTP_HOST, smtpPort);
        await transporterLocal.verify();
        console.log("SMTP verify succeeded");
      } catch (verifyErr) {
        console.error("SMTP verify failed:", verifyErr);
        return;
      }

      // Retry logic for sendMail
      let sendErr: any = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`sendMail attempt ${attempt} options:`, { host: process.env.SMTP_HOST, port: smtpPort, secure: smtpPort === 465 });
          await transporterLocal.sendMail(mailOptions);
          sendErr = null;
          console.log("Confirmation email sent successfully");
          break;
        } catch (e) {
          sendErr = e;
          console.error(`sendMail attempt ${attempt} failed:`, e);
          if (attempt < 3) await new Promise((r) => setTimeout(r, 500 * attempt));
        }
      }
      if (sendErr) console.error("All send attempts failed:", sendErr);
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
