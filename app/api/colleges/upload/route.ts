import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import College, { ICollege } from "@/models/College";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const filePath = path.join(process.cwd(), "data/college.json");
    const data: any[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    for (const item of data) {
      const exists = await College.findOne<ICollege>({ name: item["College Name"] });
      if (!exists) {
        await College.create<ICollege>({
          taluka: item.Taluka,
          name: item["College Name"],
          nameData: item["Name Data"] || "",
        });
      }
    }

    return NextResponse.json({ message: "College data uploaded successfully!" });
  } catch (err) {
    console.error("Error uploading colleges:", err);
    return NextResponse.json({ error: "Failed to upload colleges" }, { status: 500 });
  }
}
