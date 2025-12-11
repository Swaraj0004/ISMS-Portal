import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const intern = await Intern.findById(id).select("fullName attendance");

        if (!intern) {
            return NextResponse.json({ error: "Intern not found" }, { status: 404 });
        }

        return NextResponse.json({
            name: intern.fullName,
            attendance: intern.attendance,
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to fetch intern attendance" },
            { status: 500 }
        );
    }
}
