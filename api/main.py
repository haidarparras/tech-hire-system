"""
Tech Hire System — FastAPI Backend v2.0
AI-powered recruitment system
Port: 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from models.database import create_tables
from routers import auth, candidates, ai
from services import ai_service


@asynccontextmanager
async def lifespan(app: FastAPI):
    # -- Startup --
    print("[INFO] Tech Hire System API starting...")
    create_tables()
    ai_service.load_ai_model()
    print("[INFO] Server ready at http://localhost:8000")
    print("[INFO] API Docs: http://localhost:8000/docs")
    yield
    # -- Shutdown --
    print("[INFO] Server shutting down...")


app = FastAPI(
    title="Tech Hire System API",
    description=(
        "API sistem rekrutmen bertenaga AI. "
        "Mendukung analisis CV otomatis, klasifikasi kandidat, dan manajemen pengguna."
    ),
    version="2.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────
app.include_router(auth.router,       prefix="/api/auth",       tags=["🔐 Authentication"])
app.include_router(candidates.router, prefix="/api/candidates", tags=["👤 Candidates"])
app.include_router(ai.router,         prefix="/api/ai",         tags=["🤖 AI Analysis"])


# ── Root ──────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {
        "service": "Tech Hire System API",
        "version": "2.0.0",
        "status":  "running",
        "docs":    "http://localhost:8000/docs",
        "ai_ready": ai_service.is_model_ready(),
    }


@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok"}


# ── Entry point ───────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
