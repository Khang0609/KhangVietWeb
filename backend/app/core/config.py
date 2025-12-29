import os

class Settings:
    # Use 'redis' as hostname because in docker-compose, the service name is 'redis'
    # Default to localhost for local dev if not running in docker or if port is exposed
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://redis:6379/0")

settings = Settings()
