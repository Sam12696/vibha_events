import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data lives in backend/data/ — separate from source code
const DATA_FILE = path.join(__dirname, "../../data/projects.json");

async function ensureDataFile() {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error("Error ensuring data file:", error);
    throw new Error("Failed to initialize data file");
  }
}

export async function getAllProjects() {
  await ensureDataFile();
  const data = await fs.readFile(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

export async function getProjectById(id: string) {
  const projects = await getAllProjects();
  return projects.find((p: any) => p.id === id) ?? null;
}

export async function addProject(data: {
  title: string;
  description?: string;
  category: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  authorUid?: string;
}) {
  await ensureDataFile();
  const projects = await getAllProjects();
  const newProject = {
    id: Date.now().toString(),
    ...data,
    createdAt: new Date().toISOString(),
  };
  projects.push(newProject);
  await fs.writeFile(DATA_FILE, JSON.stringify(projects, null, 2));
  return newProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  await ensureDataFile();
  const projects = await getAllProjects();
  const filtered = projects.filter((p: any) => p.id !== id);
  if (filtered.length === projects.length) return false;
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2));
  return true;
}

export function validateProjectData(data: any): boolean {
  return (
    data &&
    typeof data.title === "string" &&
    data.title.trim().length > 0 &&
    typeof data.mediaUrl === "string" &&
    data.mediaUrl.trim().length > 0 &&
    typeof data.category === "string" &&
    (data.mediaType === "image" || data.mediaType === "video")
  );
}

export const projectsService = {
  getAllProjects,
  getProjectById,
  addProject,
  deleteProject,
  validateProjectData,
};
