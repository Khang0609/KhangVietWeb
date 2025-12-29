from typing import List, Optional
from fastapi import HTTPException, APIRouter
from app.models import Product, ProductType, ProductOptionGroup
from beanie import PydanticObjectId
from pydantic import BaseModel

router = APIRouter(
    prefix="/products",
    tags=["products"]
)

# --- Pydantic model for UPDATE operations ---
class UpdateProductModel(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    category_id: Optional[str] = None
    description: Optional[str] = None
    type: Optional[ProductType] = None
    images: Optional[List[str]] = None
    options: Optional[List[ProductOptionGroup]] = None

# --------------------------
# --- PRODUCT API ENDPOINTS ---
# --------------------------

@router.get("/", response_model=List[Product])
async def get_products():
    """Retrieve all products from the database."""
    products = await Product.find_all().to_list()
    return products

@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: PydanticObjectId):
    """Retrieve a single product by its ID."""
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return product

@router.post("/", response_model=Product, status_code=201)
async def create_product(product: Product):
    """Create a new product with the complex structure."""
    await product.insert()
    return product

@router.put("/{product_id}", response_model=Product)
async def update_product(product_id: PydanticObjectId, product_update: UpdateProductModel):
    """Update an existing product."""
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    update_data = product_update.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(product, key, value)
        
    await product.save()
    return product

@router.delete("/{product_id}", status_code=204)
async def delete_product(product_id: PydanticObjectId):
    """Delete a product by its ID."""
    product = await Product.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    await product.delete()
    return None # No content response