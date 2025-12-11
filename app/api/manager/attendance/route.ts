import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Intern from "@/models/Intern";
import { getToken } from "next-auth/jwt";

import Project from "@/models/Project";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const authHeader = req.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const token = authHeader.split(" ")[1];
        let decoded: any;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }
        const managerId = decoded.id;
        const projects = await Project.find({ manager: managerId }).select("_id");
        const projectIds = projects.map((p) => p._id);

        const interns = await Intern.find({
            "projectsAssigned.project": { $in: projectIds },
        }).select("fullName email department attendance");

        const attendanceRecords = interns.flatMap((intern) =>
            intern.attendance.map((record: any) => ({
                _id: record._id,
                date: record.date.toISOString().split("T")[0],
                status: record.status,
                confirmedByManager: record.status === "present" || record.status === "absent",
                intern: {
                    _id: intern._id,
                    fullName: intern.fullName,
                    email: intern.email,
                    department: intern.department,
                },
            }))
        );

        attendanceRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return NextResponse.json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await dbConnect();
        const { id, confirmed } = await req.json();

        if (!id) return NextResponse.json({ error: "Missing attendance ID" }, { status: 400 });

        const intern = await Intern.findOne({ "attendance._id": id });

        if (!intern) return NextResponse.json({ error: "Attendance record not found" }, { status: 404 });

        const attendanceRecord = intern.attendance.id(id);
        if (attendanceRecord) {
            attendanceRecord.status = confirmed ? "present" : "absent";
            attendanceRecord.approvedAt = new Date();
        }

        await intern.save();

        return NextResponse.json({ success: true, message: "Attendance updated" });
    } catch (error) {
        console.error("Error updating attendance:", error);
        return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 });
    }
}
