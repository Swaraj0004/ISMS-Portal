import jwt from "jsonwebtoken";

export const getTokenData = async (req: Request) => {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
};
