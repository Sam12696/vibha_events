import "dotenv/config"; // load .env before anything else
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

import projectRoutes from "./routes/projectRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const PORT = parseInt(process.env.PORT || "3000", 10);
const isProd = process.env.NODE_ENV === "production";

// ─── Security ────────────────────────────────────────────────────────────────

app.use(
  helmet({
    // TODO: Enable and configure CSP for production with your asset domains
    contentSecurityPolicy: false,
  })
);

// ─── CORS ────────────────────────────────────────────────────────────────────

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [`http://localhost:${PORT}`];

app.use(
  cors({
    origin: isProd ? allowedOrigins : true, // allow all in dev
    credentials: true,
  })
);

// ─── Logging & Parsing ───────────────────────────────────────────────────────

app.use(morgan(isProd ? "combined" : "dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ─── API Routes ──────────────────────────────────────────────────────────────

app.use("/api", projectRoutes);
app.use("/api/auth", authRoutes);

// ─── Frontend Serving ────────────────────────────────────────────────────────

async function setupFrontend() {
  if (!isProd) {
    // Development: Vite middleware (reads vite.config.ts at project root)
    try {
      const projectRoot = path.join(__dirname, "../../");
      const vite = await createViteServer({
        configFile: path.join(projectRoot, "vite.config.ts"),
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (error) {
      console.error("Warning: Vite dev server setup failed", error);
    }
  } else {
    // Production: serve built frontend from dist/
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.use(notFoundHandler);
  app.use(errorHandler);
}

// ─── Start ───────────────────────────────────────────────────────────────────

async function startServer() {
  try {
    await setupFrontend();

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`
╔══════════════════════════════════════════╗
║   Vibha Events Server                    ║
╚══════════════════════════════════════════╝

Environment : ${process.env.NODE_ENV || "development"}
Server      : http://localhost:${PORT}
API         : http://localhost:${PORT}/api
Auth        : http://localhost:${PORT}/api/auth

Features:
  ✅ REST API (projects CRUD)
  ✅ JWT Authentication
  ✅ CORS (${isProd ? allowedOrigins.join(", ") : "all origins"})
  ✅ Security Headers (Helmet)
  ✅ Request Logging (Morgan)
  ${isProd ? "✅ Static File Serving" : "✅ Vite Dev Server"}
      `);
    });

    process.on("SIGTERM", () => {
      console.log("SIGTERM received — shutting down gracefully");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
