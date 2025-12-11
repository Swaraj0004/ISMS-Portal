import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface DecodedToken {
  _id: string;
  email: string;
  role: string;
}

export async function verifyToken(req: NextRequest): Promise<DecodedToken | null> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;

    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
