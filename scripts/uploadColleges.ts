import "dotenv/config";
import mongoose from "mongoose";
import dbConnect from "../lib/dbConnect";
import College, { ICollege } from "../models/College";
import fs from "fs";
import path from "path";

async function uploadColleges() {
  try {
    await dbConnect();

    const filePath = path.join(process.cwd(), "colleges.json");
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

    process.exit(0);
  } catch (err) {
    console.error("Error uploading colleges:", err);
    process.exit(1);
  }
}

uploadColleges();
