import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import dbConnect from "@/lib/dbConnect";
import Manager from "@/models/Manager";

export async function GET() {
  await dbConnect();
  const managers = await Manager.find().select("-password");
  return NextResponse.json(managers);
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { fullName, email, phone, password } = await req.json();

    if (!fullName || !email || !phone || !password)
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );

    const existing = await Manager.findOne({ email });
    if (existing)
      return NextResponse.json(
        { error: "Manager already exists" },
        { status: 400 }
      );

    const manager = new Manager({ fullName, email, phone, password });
    await manager.save();

    const smtpPort = Number(process.env.SMTP_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: smtpPort,
      secure: smtpPort === 465,
      requireTLS: smtpPort !== 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: { minVersion: 'TLSv1.2', rejectUnauthorized: false },
      connectionTimeout: 20000,
      greetingTimeout: 20000,
      socketTimeout: 20000,
      logger: true,
      debug: true,
    });

    const mailOptions = {
      from: `"ISMS Portal" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: "ISMS Portal – Project Manager Account Created",
      html: `
        <p>Dear <strong>${fullName}</strong>,</p>
        <p>
          We are pleased to inform you that your Project Manager account has been successfully created on the
          <strong>ISMS Internship Management System</strong>, developed for the
          <strong>Maharashtra Remote Sensing Application Center (MRSAC)</strong>.
        </p>
        <p>
          This account has been set up and assigned to you by the company to facilitate project oversight,
          intern management, and collaborative coordination with HR. You now have access to monitor intern progress,
          assign project tasks, and support the success of our internship program.
        </p>
        <h3>Login Credentials:</h3>
        <p><strong>Email:</strong> ${email}<br/>
        <strong>Password:</strong> ${password}</p>

        <p>
          For your security, please change your password after your first login. Should you have any questions or require assistance,
          the company’s support resources are available to help.
        </p>
        <p>
          Welcome to the ISMS portal, and thank you for your leadership in our projects.
        </p>
        <br/>
        <p>Best regards,<br/>
        <strong>MRSAC</strong> (on behalf of Company Management)</p>
      `,
    };

    // Verify connection and retry send for robustness
    try {
      console.log('Verifying SMTP connection for', process.env.SMTP_HOST, smtpPort);
      await transporter.verify();
      console.log('SMTP verify succeeded');
    } catch (vErr) {
      console.error('SMTP verify failed:', vErr);
      return NextResponse.json({ error: 'Failed to verify SMTP connection' }, { status: 500 });
    }

    let sendErr: any = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`sendMail attempt ${attempt} to ${email}`);
        await transporter.sendMail(mailOptions);
        sendErr = null;
        console.log('Manager creation email sent successfully');
        break;
      } catch (e) {
        sendErr = e;
        console.error(`sendMail attempt ${attempt} failed:`, e);
        if (attempt < 3) await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }
    if (sendErr) {
      console.error('All send attempts failed:', sendErr);
      return NextResponse.json({ error: 'Failed to send manager email' }, { status: 500 });
    }

    return NextResponse.json({
      message: "Manager created and email sent",
      manager,
    });
  } catch (error) {
    console.error("Error creating manager:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
