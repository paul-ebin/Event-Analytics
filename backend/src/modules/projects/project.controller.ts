
import type { Response } from "express";
import type { AuthRequest } from "../../middleware/auth.middleware.js";
import { createProjectSchema } from "./project.schema.js";
import {
  createProject,
  getUserProjects,
} from "./project.service.js";

export async function createProjectHandler(
  req: AuthRequest,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  const parsed = createProjectSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid project data",
      details: parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  try {
    const project = await createProject(
      req.userId,
      parsed.data.name
    );

    return res.status(201).json({ project });
  } catch (error) {
    console.error("Create project failed:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}

export async function listProjectsHandler(
  req: AuthRequest,
  res: Response
) {
  if (!req.userId) {
    return res.status(401).json({
      error: "Authentication required",
    });
  }

  try {
    const projects = await getUserProjects(req.userId);

    return res.status(200).json({ projects });
  } catch (error) {
    console.error("List projects failed:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
