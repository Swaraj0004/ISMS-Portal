import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";
import College from "@/models/College";
import nodemailer from "nodemailer";
import { convertToPdf } from "@/lib/offerLetter";
import OfferLetter from "@/models/OfferLetter";

export async function GET() {
  await dbConnect();
  const interns = await Intern.find({ isActive: false }).select(
    "fullName email phone college course department semester refNo recommendation collegeId"
  );
  return NextResponse.json({ interns });
}

const generateTempPassword = (length = 10) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    const { id, internshipStart, internshipEnd } = await req.json();

    if (!id)
      return NextResponse.json({ error: "Missing intern ID" }, { status: 400 });

    const intern = await Intern.findById(id);
    if (!intern)
      return NextResponse.json({ error: "Intern not found" }, { status: 404 });

    intern.isActive = true;

    let deanName = "Dean";
    let collegeName = intern.college;

    if (collegeName) {
      const college = await College.findOne({ name: collegeName });
      if (college) {
        collegeName = college.name;
        deanName = college.nameData || "Dean";
      }
    }
    let tempPassword = "";

    let pdfBuffer: Buffer;
    let reference: string;
    try {
      const { pdf, reference: ref } = await convertToPdf({
        collegeName: intern.college.split(",")[0].trim(),
        deanName,
        addressLine: intern.college.split(",").slice(1).join(",").trim() || "",
        department: intern.department,
        semester: intern.semester,
        refNo: intern.refNo || "",
        internshipStart: internshipStart || "",
        internshipEnd: internshipEnd || "",
        studentName: intern.fullName,
      });

      pdfBuffer = pdf;
      reference = ref;

      tempPassword = generateTempPassword();
      intern.password = tempPassword;

      intern.documents = [
        ...(intern.documents || []),
        {
          type: "Offer Letter",
          data: `data:application/pdf;base64,${Buffer.from(pdfBuffer).toString(
            "base64"
          )}`,
          uploadedAt: new Date().toISOString(),
        },
      ];
    } catch (err) {
      console.error("Error generating offer letter PDF:", err);
      return NextResponse.json(
        { error: "Failed to generate offer letter" },
        { status: 500 }
      );
    }

    await intern.save();

    try {
      const offerLetterDoc = new OfferLetter({
        intern: intern._id,
        refNo: reference,
        fullName: intern.fullName,
        collegeName,
        department: intern.department,
        pdfData: `data:application/pdf;base64,${Buffer.from(pdfBuffer).toString(
          "base64"
        )}`,
      });
      await offerLetterDoc.save();
    } catch (saveErr) {
      console.error("Error saving offer letter to OfferLetter model:", saveErr);
    }

    const offerLetter = intern.documents.find(
      (doc: any) => doc.type === "Offer Letter"
    );

    if (!offerLetter) {
      return NextResponse.json(
        { error: "Offer letter not found after generation" },
        { status: 500 }
      );
    }

    const base64Data = offerLetter.data.split(",")[1];

    try {
      const smtpPort = Number(process.env.SMTP_PORT) || 587;
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: smtpPort === 465, // implicit TLS for 465, STARTTLS for 587
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
        from: `"ISMS Support Team" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: intern.email,
        subject: "Welcome to ISMS Internship Portal – Your Account Details",
        html: `
          <p>Dear <strong>${intern.fullName}</strong>,</p>
          <p>Warm greetings from the <strong>Maharashtra Remote Sensing Application Center (MRSAC)</strong>.</p>

          <p>
            Your account has been successfully created on the
            <strong>ISMS Internship Management System</strong>, the official portal developed for MRSAC internship programs.
            You can now log in, explore available roles, apply for internships, and stay updated with important notifications.
          </p>

          <h3>Login Credentials:</h3>
          <p>
            <strong>Email:</strong> ${intern.email}<br/>
            <strong>Password:</strong> ${tempPassword}
          </p>

          <p>Please find your <strong>Offer Letter</strong> attached.</p>

          <p>
            Please use these details to access your profile. For your security, kindly update your password after your first login.
          </p>

          <p>Best regards,<br/><strong>ISMS Support Team</strong></p>
        `,
        attachments: [
          {
            filename: "OfferLetter.pdf",
            content: base64Data,
            encoding: "base64",
          },
        ],
      };

      // Verify connection first
      try {
        console.log('Verifying SMTP connection for', process.env.SMTP_HOST, smtpPort);
        await transporter.verify();
        console.log('SMTP verify succeeded');
      } catch (vErr) {
        console.error('SMTP verify failed:', vErr);
        return NextResponse.json({ error: 'Failed to verify SMTP connection' }, { status: 500 });
      }

      // send with retries
      let sendErr: any = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`sendMail attempt ${attempt} to ${intern.email}`);
          await transporter.sendMail(mailOptions);
          sendErr = null;
          console.log('Activation email sent successfully');
          break;
        } catch (e) {
          sendErr = e;
          console.error(`sendMail attempt ${attempt} failed:`, e);
          if (attempt < 3) await new Promise((r) => setTimeout(r, 500 * attempt));
        }
      }
      if (sendErr) {
        console.error('All send attempts failed:', sendErr);
        return NextResponse.json({ error: 'Failed to send activation email' }, { status: 500 });
      }
    } catch (err) {
      console.error('Error sending activation email:', err);
      return NextResponse.json({ error: 'Failed to send activation email' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Intern activated and offer letter sent successfully.",
      intern,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
