import json
import os
import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import Optional

from models.database import Candidate, get_db
from models.schemas import CVAnalysisResult
from services import ai_service

router = APIRouter()

# Direktori penyimpanan file CV
CV_UPLOAD_DIR = Path("uploads/cv")
CV_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Avatar emoji pool berdasarkan kategori
CATEGORY_AVATARS = {
    "INFORMATION-TECHNOLOGY": "💻",
    "SALES":                  "📈",
    "BUSINESS-DEVELOPMENT":   "🤝",
    "FINANCE":                "💰",
    "HR":                     "👥",
    "ENGINEERING":            "⚙️",
    "MARKETING":              "📣",
}
CATEGORY_COLORS = {
    "INFORMATION-TECHNOLOGY": "#6366f1",
    "SALES":                  "#10b981",
    "BUSINESS-DEVELOPMENT":   "#8b5cf6",
    "FINANCE":                "#f59e0b",
    "HR":                     "#06b6d4",
    "ENGINEERING":            "#ef4444",
    "MARKETING":              "#ec4899",
}


# ── POST /api/ai/analyze ─────────────────────────────────────
@router.post("/analyze", response_model=CVAnalysisResult)
async def analyze_cv(
    file: UploadFile = File(...),
    save_to_db: Optional[str] = Form("true"),
    uploaded_by: Optional[int] = Form(None),
    db: Session = Depends(get_db),
):
    # Validasi ekstensi
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in {".pdf", ".doc", ".docx"}:
        raise HTTPException(400, f"Format tidak didukung: {ext}. Gunakan PDF, DOC, atau DOCX.")

    # Validasi ukuran (max 10MB)
    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:
        raise HTTPException(400, "Ukuran file terlalu besar. Maksimal 10MB.")

    # Ekstrak teks
    try:
        cv_text = ai_service.extract_text_from_file(file_bytes, file.filename)
    except ValueError as e:
        raise HTTPException(422, str(e))

    if not cv_text.strip():
        raise HTTPException(422, "File tidak mengandung teks yang dapat dibaca.")

    # Jalankan AI analysis
    result = ai_service.analyze_cv(cv_text, file.filename)

    # Simpan ke DB jika diminta
    should_save = save_to_db.lower() in ("true", "1", "yes")
    if should_save:
        try:
            category = result["category"]

            # Simpan file CV ke disk
            safe_name = f"{result['name'].replace(' ', '_')}_{file.filename}"
            cv_save_path = CV_UPLOAD_DIR / safe_name
            with open(cv_save_path, "wb") as f:
                f.write(file_bytes)

            candidate = Candidate(
                name=result["name"],
                position=result["position"],
                score=int(result["score"]),
                skills=result["skills"],        # Langsung list (SQLAlchemy JSON)
                exp=result["experience"],
                education=result["education"],
                status="new",
                avatar=CATEGORY_AVATARS.get(category, "👤"),
                color=CATEGORY_COLORS.get(category, "#6366f1"),
                cv_path=str(cv_save_path),
                cv_filename=file.filename,
            )
            db.add(candidate)
            db.commit()
        except Exception as e:
            print(f"[WARN] Gagal simpan kandidat ke DB: {e}")

    return CVAnalysisResult(**result)


# ── GET /api/ai/cv/{candidate_id} — Serve file CV ────────────
@router.get("/cv/{candidate_id}")
def get_cv_file(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(404, "Kandidat tidak ditemukan")
    if not candidate.cv_path or not Path(candidate.cv_path).exists():
        raise HTTPException(404, "File CV tidak tersedia")
    return FileResponse(
        path=candidate.cv_path,
        filename=candidate.cv_filename or "cv.pdf",
        media_type="application/octet-stream",
    )


# ── POST /api/ai/analyze-text ────────────────────────────────
@router.post("/analyze-text", response_model=CVAnalysisResult)
def analyze_text(body: dict):
    text = body.get("text", "").strip()
    if not text:
        raise HTTPException(400, "Field 'text' tidak boleh kosong.")
    if len(text) < 50:
        raise HTTPException(400, "Teks terlalu pendek untuk dianalisis.")
    result = ai_service.analyze_cv(text)
    return CVAnalysisResult(**result)


# ── GET /api/ai/status ───────────────────────────────────────
@router.get("/status")
def model_status():
    ready  = ai_service.is_model_ready()
    loaded = ai_service.model is not None

    categories = []
    if ai_service.label_encoder is not None:
        categories = list(ai_service.label_encoder.classes_)

    return {
        "model_files_present": ready,
        "model_loaded":        loaded,
        "categories":          categories,
        "message": (
            "[OK] Model AI siap digunakan"
            if loaded
            else "[WARN] Model files belum ada di api/ml_models/. Mode fallback aktif."
        ),
    }
