from datetime import datetime, timedelta, timezone
from typing import Optional, Final
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration
SECRET_KEY_RAW: Optional[str] = os.getenv("JWT_SECRET_KEY")
if SECRET_KEY_RAW == None:
    raise ValueError("LỖI CẤU HÌNH: JWT_SECRET_KEY không được thiết lập trong file .env.")
SECRET_KEY: Final[str] = SECRET_KEY_RAW

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")



def verify_password(plain_password, hashed_password):
    """Verifies a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    """Hashes a password."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Creates a new JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Creates a new JWT refresh token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str):
    """Decodes a JWT token and returns the payload."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
