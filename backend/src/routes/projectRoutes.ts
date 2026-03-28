import { Router } from "express";
import * as projectsController from "../controllers/projectsController.js";
import { requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

/** Public routes */
router.get("/projects", projectsController.getProjects);
router.get("/projects/:id", projectsController.getProjectById);
router.get("/health", projectsController.health);

/** Admin-only routes */
router.post("/projects", requireAdmin, projectsController.addProject);
router.delete("/projects/:id", requireAdmin, projectsController.deleteProject);

export default router;
