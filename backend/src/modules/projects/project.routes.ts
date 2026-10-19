import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  createProjectHandler,
  listProjectsHandler,
} from "./project.controller.js";

const router = Router();

router.post("/", requireAuth, createProjectHandler);
router.get("/", requireAuth, listProjectsHandler);

export default router;