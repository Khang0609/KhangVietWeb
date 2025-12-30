from app.routers import all_routers
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from app.database import init_db
from app.core.redis import init_redis
from contextlib import asynccontextmanager
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware


# Async context manager for application lifespan events
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles application startup and shutdown events.
    Connects to the database on startup.
    """
    await init_db()
    print("--> Successfully connected to MongoDB!")
    
    # Check and seed categories
    from app.models import Category
    if await Category.count() == 0:
        print("--> Seeding default categories...")
        defaults = [
            {"name": "Bảng hiệu trọn gói", "slug": "bang-hieu-tron-goi"},
            {"name": "Vật tư quảng cáo", "slug": "vat-tu-quang-cao"},
            {"name": "Standee/Kệ X", "slug": "standee-ke-x"},
            {"name": "Đèn Neon", "slug": "den-neon"},
        ]
        for cat_data in defaults:
            await Category(**cat_data).insert()
        print("--> Seeding complete.")

    await init_redis()
    yield
    # Cleanup tasks can be added here if needed

app = FastAPI(lifespan=lifespan)
app.add_middleware(HTTPSRedirectMiddleware)

# --- Middleware to limit upload size (Custom) ---
# Enforce roughly 10MB limit + overhead
MAX_UPLOAD_SIZE = 10 * 1024 * 1024 + 1024 * 1024 # 11MB to be safe

@app.middleware("http")
async def limit_upload_size(request: Request, call_next):
    if request.method == "POST":
        content_length = request.headers.get("content-length")
        if content_length:
            content_length = int(content_length)
            if content_length > MAX_UPLOAD_SIZE:
                return JSONResponse(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    content={"detail": "File size exceeds 10MB limit"}
                )
    return await call_next(request)

# --- CORS Configuration ---

origins = ["https://khang-viet-web-s2ra.vercel.app", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000) # Zip any files larger than 1 kB

for router in all_routers:
    app.include_router(router)

# --- Root Endpoint ---
@app.get("/")
async def read_root():
    return {"message": "Khang Viet Backend Server is running!"}