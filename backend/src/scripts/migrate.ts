import "dotenv/config";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pool from "../config/db.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const migrationsDir = path.resolve(currentDir, "../../migrations");

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Prevent concurrent migration runners from executing together.
    await client.query(
      "SELECT pg_advisory_xact_lock($1, $2)",
      [42101, 1]
    );

    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        filename TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await client.query("COMMIT");

    const files = (await readdir(migrationsDir))
      .filter((file) => /^\d+_.+\.sql$/.test(file))
      .sort();

    for (const file of files) {
      await client.query("BEGIN");

      try {
        await client.query(
          "SELECT pg_advisory_xact_lock($1, $2)",
          [42101, 1]
        );

        const existing = await client.query(
          "SELECT 1 FROM schema_migrations WHERE filename = $1",
          [file]
        );

        if (existing.rowCount) {
          await client.query("COMMIT");
          console.log(`Already applied: ${file}`);
          continue;
        }

        const sql = await readFile(
          path.join(migrationsDir, file),
          "utf8"
        );

        await client.query(sql);

        await client.query(
          "INSERT INTO schema_migrations (filename) VALUES ($1)",
          [file]
        );

        await client.query("COMMIT");
        console.log(`Applied: ${file}`);
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      }
    }

    console.log("Migrations complete.");
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((error) => {
  console.error("Migration failed:", error);
  process.exitCode = 1;
});