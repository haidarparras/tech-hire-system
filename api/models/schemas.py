from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


# ── Auth Schemas ──────────────────────────────────────────────
class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "user"


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str   # role_name dari join

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    message: str
    token: str
    user: UserResponse


# ── Candidate Schemas (sesuai DB schema yang ada) ─────────────
class SkillItem(BaseModel):
    name: str
    level: float
    category: str


class CandidateResponse(BaseModel):
    id: int
    name: Optional[str]
    position: Optional[str]
    score: Optional[int]
    skills: Optional[Any]    # JSON dari DB
    exp: Optional[str]
    education: Optional[str]
    status: Optional[str]
    avatar: Optional[str]
    color: Optional[str]
    cv_path: Optional[str]
    cv_filename: Optional[str]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True


# ── AI Schemas ────────────────────────────────────────────────
class CVAnalysisResult(BaseModel):
    name: str
    position: str
    category: str
    score: float
    skills: List[SkillItem]
    experience: str
    education: str
    strengths: List[str]
    gaps: List[str]
    recommendation: str
    model_available: bool
