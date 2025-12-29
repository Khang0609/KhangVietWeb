from typing import Optional, List, Any
from beanie import Document
from pydantic import BaseModel, Field, ConfigDict, EmailStr, model_validator
from datetime import datetime
import pymongo
from enum import Enum

# --- ENUMS and CONFIG MODELS for PRODUCTS ---

class ProductType(str, Enum):
    """ Enum for the type of product """
    READY = "ready"    # Hàng có sẵn
    CUSTOM = "custom"  # Hàng đặt làm

class ProductOptionChoice(BaseModel):
    """ A single choice within an option group, e.g., 'Small' or 'Red' """
    label: str
    price_modifier: float = Field(default=0.0, description="Giá trị cộng thêm vào giá gốc")

class ProductOptionGroup(BaseModel):
    """ A group of options for a product, e.g., 'Kích thước' or 'Màu sắc' """
    name: str
    choices: List[ProductOptionChoice] = []

# --- MAIN DOCUMENT MODELS ---

class Product(Document):
    """
    Represents a product in the store. It can be a ready-made item
    or a customizable one with different options.
    """
    name: str = Field(..., description="Tên sản phẩm")
    price: float = Field(..., description="Giá gốc của sản phẩm")
    category: Optional[str] = Field(default=None, description="Phân loại sản phẩm (e.g., 'Bảng hiệu', 'Hộp đèn')")
    category_id: Optional[str] = Field(default=None, description="ID của danh mục sản phẩm")
    description: Optional[str] = None
    
    # Use the Enum for strict type validation
    type: ProductType = Field(default=ProductType.READY, description="Loại sản phẩm: có sẵn hoặc đặt làm")
    
    # Switched to a list of images
    images: List[str] = Field(default=[], description="Danh sách URL hình ảnh. Ảnh đầu tiên là ảnh bìa.")
    
    # Nested options for customizable products
    options: List[ProductOptionGroup] = Field(default=[], description="Các nhóm tùy chọn cho sản phẩm đặt làm")
    
    # Legacy field support (Hidden from API output usually, but needed for reading from DB)
    image_url: Optional[str] = Field(default=None, description="Legacy string image URL", exclude=True)

    @model_validator(mode='after')
    def migrate_legacy_image(self) -> 'Product':
        # If images list is empty but we have a legacy image_url, migrate it
        if not self.images and self.image_url:
            self.images = [self.image_url]
        return self
    
    # Add slug for SEO-friendly URLs
    slug: str = Field(..., description="URL slug")

    class Settings:
        name = "products"
        indexes = [
            pymongo.IndexModel([("name", pymongo.TEXT)]),
            "category",
            "type",
            # Optimization indexes
            "category_id",
            pymongo.IndexModel([("slug", pymongo.ASCENDING)], unique=True),
        ]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Bảng hiệu Neon tùy chỉnh",
                "price": 2500000,
                "category": "Bảng hiệu",
                "description": "Bảng hiệu đèn Neon uốn theo chữ và thiết kế yêu cầu.",
                "type": "custom",
                "images": [
                    "https://res.cloudinary.com/khangviet/image/upload/v1/product/neon-sign-1.jpg",
                    "https://res.cloudinary.com/khangviet/image/upload/v1/product/neon-sign-2.jpg"
                ],
                "options": [
                    {
                        "name": "Kích thước",
                        "choices": [
                            {"label": "Nhỏ (30cm)", "price_modifier": 0},
                            {"label": "Vừa (50cm)", "price_modifier": 500000},
                            {"label": "Lớn (80cm)", "price_modifier": 1200000}
                        ]
                    },
                    {
                        "name": "Màu sắc",
                        "choices": [
                            {"label": "Trắng ấm", "price_modifier": 0},
                            {"label": "Hồng", "price_modifier": 150000},
                            {"label": "Xanh dương", "price_modifier": 150000}
                        ]
                    }
                ]
            }
        }
    )

# --- SCHEMA REQUEST DTOs (Data Transfer Objects) ---
class CustomerInfo(BaseModel):
    name: str
    phone: str
    email: str
    address: str

class OrderRequestItem(BaseModel):
    product_id: str
    quantity: int

class CreateOrderRequest(BaseModel):
    customer_info: CustomerInfo
    items: List[OrderRequestItem]

# --- SCHEMA CON ĐẠI DIỆN 1 SẢN PHẨM TRONG ĐƠN HÀNG ---
class OrderItem(BaseModel):
    # Lưu TÊN sản phẩm để dễ đọc lịch sử
    product_name: str = Field(..., description="Tên sản phẩm tại thời điểm mua.")
    # ID sản phẩm gốc (dùng để link xem mô tả, ảnh,...)
    product_id: str = Field(..., description="ID MongoDB của sản phẩm gốc.")
    # QUAN TRỌNG: Lưu giá và số lượng tại thời điểm chốt đơn (Snapshot)
    quantity: int = Field(..., gt=0)
    price_at_purchase: float = Field(..., gt=0)

# --- SCHEMA CHÍNH ĐẠI DIỆN ĐƠN HÀNG ---
class Order(Document):
    # Thông tin khách hàng (Không cần bảng riêng vì khách lẻ)
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None # Added email
    customer_address: str
    customer_note: Optional[str] = None
    
    # Danh sách các sản phẩm đã mua (dùng List of OrderItem)

    items: List[OrderItem]
    
    # Tính toán tổng tiền
    total_amount: float = Field(..., gt=0) 
    
    # Trạng thái đơn hàng (sẽ dùng để lọc ở Backend)
    status: str = Field(default="pending")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Settings:
        name = "orders"
        indexes = [
            # Index để tìm kiếm nhanh theo tên và số điện thoại
            pymongo.IndexModel([("customer_name", pymongo.ASCENDING)]),
            pymongo.IndexModel([("customer_phone", pymongo.ASCENDING)]),
            # Index để sắp xếp nhanh theo ngày tạo
            pymongo.IndexModel([("created_at", pymongo.DESCENDING)]),
        ]

class Category(Document):
    """
    Model Category cho sản phẩm
    """
    name: str = Field(..., description="Tên danh mục")
    slug: str = Field(..., description="Slug URL")

    class Settings:
        name = "categories"
        indexes = [
            pymongo.IndexModel([("slug", pymongo.ASCENDING)], unique=True),
            "name"
        ]
    
# 1. Model Công ty (Ví dụ: Vingroup, Coffee House...)
class Company(Document):
    name: str          # Tên: "Tập đoàn Vingroup"
    slug: str          # Link đẹp: "vingroup" (dùng cho URL)
    logo_url: Optional[str] = None
    
    class Settings:
        name = "companies"
        indexes = [
            pymongo.IndexModel([("slug", pymongo.ASCENDING)], unique=True), # using IndexModel for precise declartion
            "name",
        ]

# 2. Model Dự án (Ví dụ: Bảng hiệu Landmark 81)
class Project(Document):
    name: str          # Tên dự án: "Thi công bảng hiệu tòa nhà"
    slug: str          # Link đẹp: "thi-cong-bang-hieu"
    
    # QUAN TRỌNG: Liên kết với công ty nào?
    # Lưu cái slug của công ty vào đây để dễ tìm
    company_slug: str  
    
    address: Optional[str] = None # Địa chỉ thi công
    completion_date: Optional[datetime] = None
    
    # Đây là chỗ chứa danh sách link ảnh
    image_urls: List[str] = [] 
    is_featured: bool = False
    
    class Settings:
        name = "projects"
        indexes = [
            pymongo.IndexModel([("slug", pymongo.ASCENDING)], unique=True),
            "company_slug",
            "is_featured",
            "name",
        ]

class User(Document):
    email: EmailStr
    hashed_password: str
    role: str = Field(default="client") # "client" or "admin"
    full_name: Optional[str] = None

    class Settings:
        name = "users"

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "email": "admin@example.com",
                "full_name": "Admin User",
                "role": "admin"
            }
        }
    )