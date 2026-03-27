import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to projects data file (from backend/src/utils/ → up 3 levels to root → src/data/)
const DATA_FILE = path.join(__dirname, "../../../src/data/projects.json");

// Ensure data directory exists
async function ensureDataFile() {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify([]));
    }
  } catch (error) {
    console.error("Error ensuring data file:", error);
    throw new Error("Failed to initialize data file");
  }
}

// Get all projects
export async function getAllProjects() {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading projects:", error);
    throw new Error("Failed to read projects");
  }
}

// Validate project data
export function validateProjectData(data: any): boolean {
  return (
    data &&
    typeof data.title === "string" &&
    typeof data.mediaUrl === "string" &&
    typeof data.category === "string" &&
    (data.mediaType === "image" || data.mediaType === "video")
  );
}

export const projectsService = {
  getAllProjects,
  validateProjectData,
  ensureDataFile,
};
