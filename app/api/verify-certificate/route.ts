import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import OfferLetter from "@/models/OfferLetter";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing certificate ID" },
        { status: 400 }
      );
    }

    const offerLetter = await OfferLetter.findOne({ refNo: id });

    if (!offerLetter) {
      return NextResponse.json({}, { status: 404 });
    }

    return NextResponse.json({
      name: offerLetter.fullName,
      college: offerLetter.collegeName,
      department: offerLetter.department,
      issueDate: new Date(offerLetter.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      certificateId: offerLetter.refNo,
      pdfData: offerLetter.pdfData,
    });
  } catch (error) {
    console.error("Verification API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
