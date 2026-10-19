
import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";

export function getMe(req: AuthRequest, res: Response) {
  return res.status(200).json({
    userId: req.userId,
  });
}
