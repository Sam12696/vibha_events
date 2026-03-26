from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class PortfolioProject(BaseModel):
    id: str
    mediaUrl: str
    mediaType: str  # 'image' or 'video'
    category: str
    title: str
    description: Optional[str] = None
    createdAt: str
    authorUid: str

# In-memory storage (replace with DB for production)
projects: List[PortfolioProject] = []

@app.get("/projects", response_model=List[PortfolioProject])
def get_projects():
    return projects

@app.post("/projects", response_model=PortfolioProject)
def add_project(project: PortfolioProject):
    projects.append(project)
    return project

@app.delete("/projects/{project_id}")
def delete_project(project_id: str):
    global projects
    projects = [p for p in projects if p.id != project_id]
    return {"ok": True}

@app.get("/projects/{project_id}", response_model=PortfolioProject)
def get_project(project_id: str):
    for p in projects:
        if p.id == project_id:
            return p
    raise HTTPException(status_code=404, detail="Project not found")
