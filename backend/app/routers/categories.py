from typing import List, Optional
from fastapi import APIRouter, HTTPException, Body
from beanie import PydanticObjectId
from pydantic import BaseModel, Field
from app.models import Category, Product

router = APIRouter(
    prefix="/categories",
    tags=["categories"]
)

class CategoryResponse(Category):
    product_count: int = 0

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None

@router.get("/", response_model=List[CategoryResponse])
async def get_categories():
    """Retrieve all categories with product counts."""
    categories = await Category.find_all().to_list()
    
    # Retrieve all products to count categories manually
    # (Avoids AsyncIOMotorLatentCommandCursor error in some Beanie/Motor versions)
    products = await Product.find_all().to_list()
    
    from collections import Counter
    # Count products by category_id
    # Ensure p.category_id is not None
    counts = Counter(p.category_id for p in products if p.category_id)
    
    result = []
    for cat in categories:
        # Convert PydanticObjectId to string for lookup
        c_id = str(cat.id)
        result.append(
            CategoryResponse(
                **cat.model_dump(),
                product_count=counts.get(c_id, 0)
            )
        )
    return result

@router.post("/", response_model=Category, status_code=201)
async def create_category(category: Category):
    """Create a new category."""
    # Check for duplicate slug
    existing = await Category.find_one(Category.slug == category.slug)
    if existing:
        raise HTTPException(status_code=400, detail="Slug already exists.")
    await category.insert()
    return category

@router.put("/{category_id}", response_model=Category)
async def update_category(category_id: PydanticObjectId, update_data: CategoryUpdate):
    """Update a category."""
    category = await Category.get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    
    # If updating slug, check uniqueness
    if update_data.slug and update_data.slug != category.slug:
        existing = await Category.find_one(Category.slug == update_data.slug)
        if existing:
            raise HTTPException(status_code=400, detail="Slug already exists.")
            
    updates = update_data.model_dump(exclude_unset=True)
    for k, v in updates.items():
        setattr(category, k, v)
    
    await category.save()
    return category

@router.delete("/{category_id}", status_code=204)
async def delete_category(category_id: PydanticObjectId):
    """Delete a category."""
    category = await Category.get(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    
    # Check if products exist in this category
    # Convert ID to string as Product stores it as string
    product_count = await Product.find(Product.category_id == str(category.id)).count()
    if product_count > 0:
        raise HTTPException(status_code=400, detail=f"Cannot delete. There are {product_count} products in this category.")
        
    await category.delete()
    return None
