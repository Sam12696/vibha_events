import { Request, Response } from "express";
import { projectsService } from "../utils/projectsService.js";

/** GET /api/projects */
export async function getProjects(_req: Request, res: Response) {
  try {
    const projects = await projectsService.getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error("Error in getProjects:", error);
    res.status(500).json({ error: "Failed to retrieve projects" });
  }
}

/** GET /api/projects/:id */
export async function getProjectById(req: Request, res: Response) {
  try {
    const project = await projectsService.getProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: "Project not found" });
    res.json(project);
  } catch (error) {
    console.error("Error in getProjectById:", error);
    res.status(500).json({ error: "Failed to retrieve project" });
  }
}

/** POST /api/projects (admin only) */
export async function addProject(req: Request, res: Response) {
  try {
    if (!projectsService.validateProjectData(req.body)) {
      return res.status(400).json({ error: "Invalid project data. title, mediaUrl, category, and mediaType are required." });
    }
    const project = await projectsService.addProject(req.body);
    res.status(201).json(project);
  } catch (error) {
    console.error("Error in addProject:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
}

/** DELETE /api/projects/:id (admin only) */
export async function deleteProject(req: Request, res: Response) {
  try {
    const deleted = await projectsService.deleteProject(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Project not found" });
    res.json({ success: true });
  } catch (error) {
    console.error("Error in deleteProject:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
}

/** GET /api/health */
export function health(_req: Request, res: Response) {
  res.json({ status: "ok", timestamp: new Date().toISOString(), uptime: process.uptime() });
}
