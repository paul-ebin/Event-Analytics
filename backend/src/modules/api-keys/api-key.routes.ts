
import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware.js";
import {
  createApiKeyHandler,
  listApiKeysHandler,
  revokeApiKeyHandler
} from "./api-key-controller.js";

const router = Router({ mergeParams: true });

router.post("/", requireAuth, createApiKeyHandler);
router.get("/", requireAuth, listApiKeysHandler);
router.delete("/:keyId", requireAuth, revokeApiKeyHandler);
export default router;
