from typing import List
from fastapi import APIRouter, HTTPException
from app.models import Company, Project

# --------------------------
# --- COMPANY API ENDPOINTS ---
# --------------------------
# Mini app
router = APIRouter(    # Tự động thêm /projects vào trước mọi API trong file này
    tags=["companies"]      # Để gom nhóm đẹp đẹp trên Swagger UI
)

@router.get("/")

@router.get("/companies", response_model=List[Company])
async def get_companies():
    """Retrieve all companies."""
    companies = await Company.find_all().to_list()
    return companies

@router.post("/companies", status_code=201)
async def create_company(company: Company):
    """Create a new company."""
    # Prevent duplicate slugs
    if await Company.find_one(Company.slug == company.slug):
        raise HTTPException(status_code=400, detail="Company slug already exists.")
    
    await company.create()
    return {"message": "Company created successfully", "id": str(company.id)}

@router.get("/companies/{company_slug}/projects", response_model=List[Project])
async def get_projects_by_company(company_slug: str):
    """Get all projects associated with a specific company slug."""
    if not await Company.find_one(Company.slug == company_slug):
        raise HTTPException(status_code=404, detail="Company not found.")
        
    projects = await Project.find(Project.company_slug == company_slug).to_list()
    return projects