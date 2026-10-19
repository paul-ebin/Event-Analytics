import express from "express"
import helmet from "helmet"
import cors from "cors"
import pool  from "./config/db.js"
import authRoutes from "./modules/auth/auth.routes.js";
import projectRoutes from "./modules/projects/project.routes.js";
const app = express()

app.use(express.json())
app.use(cors())
app.use(helmet())

app.use("/api/auth" , authRoutes);
app.use("/api/projects", projectRoutes);



app.get("/health/db", async (_req, res) => {
    try {
        const result = await pool.query(
            "SELECT current_database() AS database, NOW() AS time"
        );

        res.status(200).json({
            status: "connected",
            database: result.rows[0].database,
            time: result.rows[0].time,
        });
    } catch (error) {
        console.error("Database connection failed:", error);

        res.status(503).json({
            status: "error",
            message: "Database connection failed",
        });
    }
});

export default app;
