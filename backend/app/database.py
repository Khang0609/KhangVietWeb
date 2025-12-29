import motor.motor_asyncio
from beanie import init_beanie
from app.models import Product, Order, Project, Company, User, Category  # Import các models
import os
from dotenv import load_dotenv

# Load biến môi trường từ file .env
load_dotenv()

async def init_db():
    # Get connection string from .env
    mongo_url = os.getenv("MONGODB_URL")
    
    if not mongo_url:
        print("Error: MONGODB_URL not found in .env")
        return

    # Connection Pool Settings
    # maxPoolSize: Allow up to 20 concurrent connections (default: 20)
    max_pool_size = int(os.getenv("MONGODB_MAX_POOL_SIZE", 20))
    # minPoolSize: Keep at least 10 connections open and ready (default: 10)
    min_pool_size = int(os.getenv("MONGODB_MIN_POOL_SIZE", 10))
    # maxIdleTimeMS: Close idle connections after 60 seconds (default: 60000)
    max_idle_time_ms = int(os.getenv("MONGODB_MAX_IDLE_TIME_MS", 60000))
    # connectTimeoutMS: Timeout after 10 seconds if can't connect (default: 10000)
    connect_timeout_ms = int(os.getenv("MONGODB_CONNECT_TIMEOUT_MS", 10000))

    # Create connection with pool settings
    client = motor.motor_asyncio.AsyncIOMotorClient(
        mongo_url,
        maxPoolSize=max_pool_size,
        minPoolSize=min_pool_size,
        maxIdleTimeMS=max_idle_time_ms,
        connectTimeoutMS=connect_timeout_ms
    )

    # IMPORTANT: Select specific database
    database = client.khangviet_db
    
    # Initialize Beanie with models
    await init_beanie(database, document_models=[Product, Order, Company, Project, User, Category]) #type:ignore