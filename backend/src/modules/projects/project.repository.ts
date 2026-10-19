
import pool from "../../config/db.js";

export async function createProject(
  ownerId: string,
  name: string
) {
  const result = await pool.query(
    `INSERT INTO projects (owner_id, name)
     VALUES ($1, $2)
     RETURNING id, owner_id, name, created_at`,
    [ownerId, name]
  );

  return result.rows[0];
}

export async function findProjectsByOwnerId(
  ownerId: string
) {
  const result = await pool.query(
    `SELECT id, owner_id, name, created_at
     FROM projects
     WHERE owner_id = $1
     ORDER BY created_at DESC`,
    [ownerId]
  );

  return result.rows;
}
