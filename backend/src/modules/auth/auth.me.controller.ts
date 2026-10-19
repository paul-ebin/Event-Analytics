
import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
import { getUserProfile } from "./auth.service.js";

export async function getMe(
  req: AuthRequest,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  try {
    const user = await getUserProfile(req.userId);

    return res.status(200).json({
      user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "USER_NOT_FOUND"
    ) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    console.error("Get profile failed:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
