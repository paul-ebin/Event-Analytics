
import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
import {
  createProjectApiKey,
  getProjectApiKeys,
} from "./api-key.service.js";

export async function createApiKeyHandler(
  req: AuthRequest,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const projectId = req.params.projectId;

  if (typeof projectId !== "string" || !projectId.trim()) {
    return res.status(400).json({
      error: "Invalid project ID",
    });
  }

  const name =
    typeof req.body?.name === "string"
      ? req.body.name.trim()
      : "Default key";

  if (!name || name.length > 100) {
    return res.status(400).json({
      error: "Key name must be between 1 and 100 characters",
    });
  }

  try {
    const apiKey = await createProjectApiKey(
      projectId,
      req.userId,
      name
    );

    return res.status(201).json({ apiKey });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "PROJECT_NOT_FOUND"
    ) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    console.error("Create API key failed:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

export async function listApiKeysHandler(
  req: AuthRequest,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const projectId = req.params.projectId;

  if (typeof projectId !== "string" || !projectId.trim()) {
    return res.status(400).json({
      error: "Invalid project ID",
    });
  }

  try {
    const keys = await getProjectApiKeys(
      projectId,
      req.userId
    );

    return res.status(200).json({ keys });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "PROJECT_NOT_FOUND"
    ) {
      return res.status(404).json({
        error: "Project not found",
      });
    }

    console.error("List API keys failed:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
