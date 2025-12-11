import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import Intern from "@/models/Intern";
import Manager from "@/models/Manager";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json(
                { error: "Manager ID is required" },
                { status: 400 }
            );
        }

        const manager = await Manager.findById(id);
        if (!manager) {
            console.log("Manager not found for ID:", id);
            return NextResponse.json({ error: "Manager not found" }, { status: 404 });
        }

        const projects = await Project.find({ manager: id }).select("_id");
        const projectIds = projects.map((p) => p._id);

        const interns = await Intern.find({
            "projectsAssigned.project": { $in: projectIds },
        }).select(
            "fullName email phone college course department semester isActive"
        );

        return NextResponse.json({ interns });
    } catch (error) {
        console.error("Error fetching manager interns:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
