from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models import Project, Company
from beanie import PydanticObjectId
from datetime import datetime

# Mini app
router = APIRouter(
    prefix="/projects",    # Tự động thêm /projects vào trước mọi API trong file này
    tags=["projects"]      # Để gom nhóm đẹp đẹp trên Swagger UI
)

# --------------------------
# --- PROJECT API ENDPOINTS ---
# --------------------------

# Pydantic model for updating a project
class UpdateProjectModel(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    company_slug: Optional[str] = None
    address: Optional[str] = None
    completion_date: Optional[datetime] = None
    image_urls: Optional[List[str]] = None
    is_featured: Optional[bool] = None

# Response model for featured projects to send only necessary data
class FeaturedProjectResponse(BaseModel):
    name: str
    slug: str
    address: Optional[str]
    company_slug: str
    image_urls: List[str]

@router.get("/featured", response_model=List[FeaturedProjectResponse])
async def get_featured_projects():
    """Retrieve up to 6 featured projects."""
    projects = await Project.find(Project.is_featured == True).limit(6).to_list()
    return projects

from app.core.redis import get_cache, set_cache, clear_cache

# ... imports ...

@router.get("/", response_model=List[Project])
async def get_projects(company_slug: Optional[str] = None):
    """Retrieve all projects, optionally filtering by company slug."""
    if company_slug:
        # Check if company exists to avoid returning empty list for non-existent slugs
        if not await Company.find_one(Company.slug == company_slug):
            raise HTTPException(status_code=404, detail=f"Company with slug '{company_slug}' not found.")
        projects = await Project.find(Project.company_slug == company_slug).to_list()
    else:
        # Check cache first for full list
        cached_projects = await get_cache("all_projects")
        if cached_projects:
            return cached_projects

        projects = await Project.find_all().to_list()
        # Store in cache (serialize Pydantic models to JSON-compatible dicts)
        await set_cache("all_projects", [p.model_dump(mode='json') for p in projects], 3600)
    
    return projects

@router.post("/", status_code=201)
async def create_project(project: Project):
    """Create a new project."""
    # Ensure the associated company exists
    company = await Company.find_one(Company.slug == project.company_slug)
    if not company:
        raise HTTPException(status_code=404, detail="Associated company not found.")

    await project.create()
    await clear_cache("all_projects")
    return {"message": "Project created successfully", "id": str(project.id)}

@router.get("/{slug}", response_model=Project)
async def get_project(slug: str):
    """Retrieve a single project by its slug."""
    project = await Project.find_one(Project.slug == slug)
    if project:
        return project
    raise HTTPException(status_code=404, detail="Project not found.")

@router.put("/{project_id}", response_model=Project)
async def update_project(project_id: PydanticObjectId, project_update: UpdateProjectModel):
    """Update an existing project."""
    project = await Project.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    update_data = project_update.model_dump(exclude_unset=True)

    # If company_slug is being updated, verify the new company exists
    if "company_slug" in update_data and update_data["company_slug"]:
        company = await Company.find_one(Company.slug == update_data["company_slug"])
        if not company:
            raise HTTPException(
                status_code=404, 
                detail=f"Company with slug '{update_data['company_slug']}' not found."
            )

    # Update the project document
    for key, value in update_data.items():
        setattr(project, key, value)

    await project.save()
    await clear_cache("all_projects")
    return project