from fastapi import HTTPException, APIRouter, Depends, Response, Cookie
from app.models import User
from app.auth import (
    create_access_token, 
    create_refresh_token, 
    get_password_hash, 
    verify_password, 
    decode_token
)
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional
from fastapi.security import OAuth2PasswordBearer

# --- AUTH & SECURITY ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: str = "client"

class UserOut(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: str

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Dependency to get the current user from a token."""
    payload = decode_token(token)
    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    email = payload.get("sub")
    token_type = payload.get("type")
    
    if email is None or token_type != "access":
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Validate email format
    try:
        # Validate email format using a Pydantic model
        class EmailCheck(BaseModel):
            email: EmailStr
        try:
            email = EmailCheck(email=email).email
        except Exception:
            raise HTTPException(
                status_code=401,
                detail="Invalid email format in token",
                headers={"WWW-Authenticate": "Bearer"},
            )
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid email format in token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = await User.find_one(User.email == email)
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

router = APIRouter(
    tags=["auth"]
)

@router.get("/")

# ----------------------------
# --- AUTHENTICATION API ENDPOINTS ---
# ----------------------------

@router.post("/users", status_code=201)
async def create_user(user_in: UserCreate):
    """
    Create a new user. Can be used to seed the initial admin user.
    """
    existing_user = await User.find_one(User.email == user_in.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user_in.password)
    user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        full_name=user_in.full_name,
        role=user_in.role
    )

    await user.create()
    return {"message": "Admin created successfully"}

@router.post("/token", response_model=Token)
async def login_for_access_token(response: Response, form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Login endpoint. Returns Access Token and sets Refresh Token HttpOnly cookie.
    """
    user = await User.find_one(User.email == form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.email})
    refresh_token = create_refresh_token(data={"sub": user.email})
    
    # Set Refresh Token in HttpOnly Cookie (7 days)
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True, # Require HTTPS (ensure you are on HTTPS or localhost)
        samesite="lax",
        max_age=7 * 24 * 60 * 60 # 7 days in seconds
    )
    
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "role": user.role
    }

@router.post("/refresh", response_model=Token)
async def refresh_access_token(response: Response, refresh_token: str = Cookie(None)):
    """
    Refresh Access Token using HttpOnly Cookie.
    """
    if not refresh_token:
         raise HTTPException(status_code=401, detail="Refresh token missing")
    
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
        
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token payload")
        
    user = await User.find_one(User.email == email)
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
        
    # Rotate tokens (Security best practice: issue new access AND refresh)
    new_access_token = create_access_token(data={"sub": user.email})
    new_refresh_token = create_refresh_token(data={"sub": user.email})
    
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=True, 
        samesite="lax",
        max_age=7 * 24 * 60 * 60
    )
    
    return {
        "access_token": new_access_token,
        "token_type": "bearer",
        "role": user.role
    }

@router.post("/logout")
async def logout(response: Response):
    """
    Logout by clearing the refresh token cookie.
    """
    response.delete_cookie(key="refresh_token")
    return {"message": "Logged out successfully"}

@router.get("/users/me", response_model=UserOut)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Protected route to get the current logged-in user's information.
    """
    return current_user