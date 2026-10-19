
import pool from "../../config/db.js";

export async function findUserByEmail(email: string) {
  const result = await pool.query(
    `SELECT id
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email]
  );

  return result.rows.length > 0;
}

export async function createUser(
  email: string,
  passwordHash: string
) {
  const result = await pool.query(
    `INSERT INTO users (email, password_hash)
     VALUES ($1, $2)
     RETURNING id, email, created_at`,
    [email, passwordHash]
  );

  return result.rows[0];
}


export async function findUserByEmailForLogin(email: string) {
  const result = await pool.query(
    `SELECT id, email, password_hash, created_at
     FROM users
     WHERE email = $1
     LIMIT 1`,
    [email]
  );

  return result.rows[0] ?? null;
}


export async function findUserById(userId: string) {
  const result = await pool.query(
    `SELECT id, email, created_at
     FROM users
     WHERE id = $1
     LIMIT 1`,
    [userId]
  );

  return result.rows[0] ?? null;
}