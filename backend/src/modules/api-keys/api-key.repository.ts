
import pool from "../../config/db.js";

export async function createApiKey(
  projectId: string,
  keyHash: string,
  name: string
) {
  const result = await pool.query(
    `INSERT INTO project_api_keys
       (project_id, key_hash, name)
     VALUES ($1, $2, $3)
     RETURNING id, project_id, name, created_at`,
    [projectId, keyHash, name]
  );

  return result.rows[0];
}

export async function findApiKeysByProjectId(
  projectId: string
) {
  const result = await pool.query(
    `SELECT id, project_id, name, created_at, revoked_at
     FROM project_api_keys
     WHERE project_id = $1
     ORDER BY created_at DESC`,
    [projectId]
  );

  return result.rows;
}
