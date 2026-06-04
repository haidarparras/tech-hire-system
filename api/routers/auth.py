from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

from models.database import User, Role, get_db
from models.schemas import RegisterRequest, LoginRequest, LoginResponse, UserResponse

load_dotenv()

router      = APIRouter()

JWT_SECRET  = os.getenv("JWT_SECRET", "fallback_secret_key")
JWT_ALGO    = "HS256"
JWT_EXPIRES = 24  # hours


def hash_password(password: str) -> str:
    # bcrypt requires bytes
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))
    except ValueError:
        return False


def create_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=JWT_EXPIRES)
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def get_role_id(db: Session, role_name: str) -> int:
    """Lookup role_id dari role_name. Default ke 'user' jika tidak ditemukan."""
    role = db.query(Role).filter(Role.role_name == role_name).first()
    if role:
        return role.id
    # Fallback ke role 'user'
    user_role = db.query(Role).filter(Role.role_name == "user").first()
    return user_role.id if user_role else 2


# ── POST /api/auth/register ──────────────────────────────────
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    if not body.name or not body.email or not body.password:
        raise HTTPException(400, "Name, email, and password are required")

    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(400, "Email is already registered")

    valid_roles = ["user", "hrd", "admin"]
    role_name   = body.role if body.role in valid_roles else "user"
    role_id     = get_role_id(db, role_name)

    user = User(
        name=body.name,
        email=body.email,
        password=hash_password(body.password),
        role_id=role_id,
    )
    db.add(user)
    db.commit()
    return {"message": "User registered successfully"}


# ── POST /api/auth/login ─────────────────────────────────────
@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    if not body.email or not body.password:
        raise HTTPException(400, "Email and password are required")

    # Join dengan roles untuk mendapatkan role_name
    user = (
        db.query(User)
        .filter(User.email == body.email)
        .first()
    )
    if not user or not verify_password(body.password, user.password):
        raise HTTPException(401, "Invalid credentials")

    # Dapatkan role_name dari relasi
    role_name = user.role.role_name if user.role else "user"

    token = create_token({
        "id":    user.id,
        "role":  role_name,
        "name":  user.name,
        "email": user.email,
    })

    return LoginResponse(
        message="Login successful",
        token=token,
        user=UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=role_name,
        ),
    )


# ── GET /api/auth/me ─────────────────────────────────────────
@router.get("/me")
def get_me():
    return {"message": "Decode JWT payload di frontend untuk info user"}
