from sqlalchemy import (
    create_engine, Column, Integer, String, Text,
    Float, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from dotenv import load_dotenv
from datetime import datetime
import os

load_dotenv()

DB_HOST     = os.getenv("DB_HOST", "127.0.0.1")
DB_USER     = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "")
DB_NAME     = os.getenv("DB_NAME", "tech_hire_db")

DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"

engine       = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base         = declarative_base()


# ── ORM Models (sesuai schema DB yang ada) ───────────────────

class Role(Base):
    __tablename__ = "roles"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    role_name  = Column(String(50), nullable=False, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="role")


class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    role_id    = Column(Integer, ForeignKey("roles.id"), nullable=False, default=2)
    name       = Column(String(100), nullable=False)
    email      = Column(String(100), nullable=False, unique=True)
    password   = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    role = relationship("Role", back_populates="users")


class Candidate(Base):
    """Sesuai schema candidates tabel yang sudah ada di DB."""
    __tablename__ = "candidates"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    name       = Column(String(255), nullable=False)
    position   = Column(String(255), nullable=False)   # label posisi dari AI
    score      = Column(Integer, default=0)             # confidence * 100 (integer)
    skills     = Column(JSON)                           # list of skill objects
    exp        = Column(String(100))                    # pengalaman kerja
    education  = Column(String(255))
    status     = Column(String(50), default="new")      # new | reviewed | hired | rejected
    avatar     = Column(String(10), default="👤")
    color      = Column(String(20), default="#6366f1")
    created_at = Column(DateTime, default=datetime.utcnow)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Buat tabel baru yang belum ada, skip yang sudah ada."""
    try:
        # Buat tabel roles & users & candidates jika belum ada
        Base.metadata.create_all(bind=engine)

        # Pastikan roles default ada (admin, user, hrd)
        db = SessionLocal()
        try:
            for role_name in ["admin", "user", "hrd"]:
                exists = db.query(Role).filter(Role.role_name == role_name).first()
                if not exists:
                    db.add(Role(role_name=role_name))
            db.commit()
        finally:
            db.close()

        print("[DB] Database tables initialized")
    except Exception as e:
        print(f"[DB ERROR] {e}")
        raise
