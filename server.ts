import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, "src", "data", "projects.json");

async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify([]));
  }
}

async function startServer() {
  await ensureDataFile();
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for development with Vite
  }));
  app.use(morgan("dev"));
  app.use(express.json());

  // API Routes
  app.get("/api/projects", async (req, res) => {
    try {
      const data = await fs.readFile(DATA_FILE, "utf-8");
      res.json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: "Failed to read projects" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const { title, description, category, mediaUrl, mediaType } = req.body;
      if (!title || !mediaUrl || !category) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const data = await fs.readFile(DATA_FILE, "utf-8");
      const projects = JSON.parse(data);
      
      const newProject = {
        id: Date.now().toString(),
        title,
        description,
        category,
        mediaUrl,
        mediaType,
        createdAt: new Date().toISOString()
      };

      projects.unshift(newProject);
      await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
      res.status(201).json(newProject);
    } catch (err) {
      res.status(500).json({ error: "Failed to save project" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = await fs.readFile(DATA_FILE, "utf-8");
      let projects = JSON.parse(data);
      
      const initialLength = projects.length;
      projects = projects.filter((p: any) => p.id !== id);
      
      if (projects.length === initialLength) {
        return res.status(404).json({ error: "Project not found" });
      }

      await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete project" });
    }
  });

  // Simple Admin Auth (for demo purposes)
  app.post("/api/auth/login", (req, res) => {
    const { password } = req.body;
    // In a real app, use environment variables and proper hashing
    if (password === "admin123") {
      res.json({ success: true, token: "mock-jwt-token" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
