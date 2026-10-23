import express from "express";
import cors from "cors";
import todoRoute from "./routes/todo.route.js";
import { prisma, pool } from "./config/db.js";
import corsOptions from "./config/cors.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));

// Mount routes (supporting both plural standard and singular compatibility)
app.use("/api/todos", todoRoute);
app.use("/api/todo", todoRoute);

// 404 handler for unhandled endpoints
app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Centralized unhandled error handler
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("Unhandled server error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

const server = app.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
});

// Graceful shutdown
const shutdown = async () => {
    console.log("Shutting down server...");
    server.close(async () => {
        try {
            await prisma.$disconnect();
            await pool.end();
            console.log("Database connections closed.");
        } catch (error) {
            console.error("Error during database disconnect:", error);
        } finally {
            process.exit(0);
        }
    });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
