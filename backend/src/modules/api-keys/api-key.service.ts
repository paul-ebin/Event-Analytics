
import { generateApiKey } from "../../utils/api-key.js";
import {
  createApiKey as createApiKeyRepository,
  findApiKeysByProjectId,
} from "./api-key.repository.js";
import pool from "../../config/db.js";

async function verifyProjectOwnership(
  projectId: string,
  userId: string
) {
  const result = await pool.query(
    `SELECT id  
     FROM projects
     WHERE id = $1 AND owner_id = $2
     LIMIT 1`,
    [projectId, userId]
  );

  return result.rows.length > 0;
}

export async function createProjectApiKey(
  projectId: string,
  userId: string,
  name: string
) {
  const ownsProject = await verifyProjectOwnership(
    projectId,
    userId
  );

  if (!ownsProject) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  const { apiKey, keyHash } = generateApiKey();

  const savedKey = await createApiKeyRepository(
    projectId,
    keyHash,
    name
  );

  return {
    ...savedKey,
    apiKey,
  };
}

export async function getProjectApiKeys(
  projectId: string,
  userId: string
) {
  const ownsProject = await verifyProjectOwnership(
    projectId,
    userId
  );

  if (!ownsProject) {
    throw new Error("PROJECT_NOT_FOUND");
  }

  return findApiKeysByProjectId(projectId);
}
