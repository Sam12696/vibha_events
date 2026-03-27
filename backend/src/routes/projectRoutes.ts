import { Router } from "express";
import * as projectsController from "../controllers/projectsController.js";

const router = Router();

/**
 * GET /api/projects
 * Get all projects
 */
router.get("/projects", projectsController.getProjects);

/**
 * GET /api/projects/:id
 * Get a single project by ID
 */
router.get("/projects/:id", projectsController.getProjectById);

/**
 * GET /api/health
 * Health check endpoint
 */
router.get("/health", projectsController.health);

export default router;
