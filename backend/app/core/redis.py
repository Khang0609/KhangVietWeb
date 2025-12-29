import json
import redis.asyncio as redis
from typing import Optional, Any
from app.core.config import settings

redis_client: Optional[redis.Redis] = None

async def init_redis():
    """Initialize the Redis client."""
    global redis_client
    try:
        redis_client = redis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
        # Test connection
        await redis_client.ping()
        print("--> Successfully connected to Redis!")
    except Exception as e:
        print(f"--> Failed to connect to Redis: {e}")
        redis_client = None

async def get_cache(key: str) -> Optional[Any]:
    """Retrieve data from Redis cache."""
    if redis_client is None:
        return None
    try:
        data = await redis_client.get(key)
        if data:
            return json.loads(data)
    except Exception as e:
        print(f"Error reading from cache: {e}")
    return None

async def set_cache(key: str, value: Any, expire: int = 3600):
    """Store data in Redis cache with TTL."""
    if redis_client is None:
        return
    try:
        await redis_client.set(key, json.dumps(value), ex=expire)
    except Exception as e:
        print(f"Error writing to cache: {e}")

async def clear_cache(key: str):
    """Remove key from Redis cache."""
    if redis_client is None:
        return
    try:
        await redis_client.delete(key)
    except Exception as e:
        print(f"Error clearing cache: {e}")
