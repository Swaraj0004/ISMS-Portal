import { AuthenticatedNextRequest } from "./types";
import jwt from "jsonwebtoken";

export const requireRole = (roles: string[]) => {
  return async (req: AuthenticatedNextRequest, res: any, next: any) => {
    try {
      const token = req.cookies.get("token")?.value;
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = {
        id: decoded.id,
        role: decoded.role,
        email: decoded.email,
      };

      await next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
