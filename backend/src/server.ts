import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

// Import routes and middleware
import apiRoutes from "./routes/projectRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Express app
const app: Express = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

// ============================================
// MIDDLEWARE SETUP
// ============================================

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disabled for development with Vite
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    credentials: true,
  })
);

// Logging middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ============================================
// API ROUTES
// ============================================

app.use("/api", apiRoutes);

// ============================================
// FRONTEND SERVING (Vite in dev, static in prod)
// ============================================

async function setupFrontend() {
  if (process.env.NODE_ENV !== "production") {
    // Development: Use Vite middleware
    try {
      // Get project root (2 levels up from backend/src)
      const projectRoot = path.join(__dirname, "../../");
      
      const vite = await createViteServer({
        root: projectRoot,
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (error) {
      console.error("Warning: Vite server setup failed", error);
    }
  } else {
    // Production: Serve built frontend
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
  
  // 404 handler (must be after frontend is set up)
  app.use(notFoundHandler);

  // Global error handler (must be last)
  app.use(errorHandler);
}

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

// These will be added inside setupFrontend after the frontend is configured

// ============================================
// START SERVER
// ============================================

async function startServer() {
  try {
    await setupFrontend();

    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`
╔══════════════════════════════════════════╗
║   Vibha Events Server                    ║
╚══════════════════════════════════════════╝

Environment: ${process.env.NODE_ENV || "development"}
Server: http://localhost:${PORT}
API: http://localhost:${PORT}/api

Features:
✅ REST API
✅ CORS Enabled
✅ Security (Helmet)
✅ Morgan Logging
${process.env.NODE_ENV !== "production" ? "✅ Vite Dev Server" : "✅ Static Files Serving"}
      `);
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM signal received: closing HTTP server");
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start the server
startServer();

export default app;
