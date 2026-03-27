import { Request, Response } from "express";
import { projectsService } from "../utils/projectsService.js";

/**
 * GET /api/projects
 * Retrieve all projects from the database
 */
export async function getProjects(req: Request, res: Response) {
  try {
    const projects = await projectsService.getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error("Error in getProjects:", error);
    res.status(500).json({
      error: "Failed to retrieve projects",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}

/**
 * GET /api/projects/:id
 * Retrieve a single project by ID
 */
export async function getProjectById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const projects = await projectsService.getAllProjects();
    const project = projects.find((p: any) => p.id === id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Error in getProjectById:", error);
    res.status(500).json({ error: "Failed to retrieve project" });
  }
}

/**
 * Health check endpoint
 */
export async function health(req: Request, res: Response) {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
