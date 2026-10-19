
import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt.js";

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication token required",
    });
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string"
    ) {
      return res.status(401).json({
        error: "Invalid authentication token",
      });
    }

    (req as AuthRequest).userId = payload.sub;

    return next();
  } catch {
    return res.status(401).json({
      error: "Invalid or expired authentication token",
    });
  }
}
