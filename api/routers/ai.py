import os
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from models.database import get_db
from models.schemas import CVAnalysisResult
from services import ai_service

router = APIRouter()

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

    # Jalankan AI analysis dan kembalikan hasil ke frontend
    # Penyimpanan ke DB dilakukan oleh Node.js backend via POST /api/cv/analysis
    result = ai_service.analyze_cv(cv_text, file.filename)
    return CVAnalysisResult(**result)


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


# ── POST /api/ai/reload ──────────────────────────────────────
@router.post("/reload")
def reload_model():
    """Manual reload model AI (berguna saat HuggingFace Space restart)"""
    try:
        success = ai_service.load_ai_model()
        if success:
            return {
                "status": "success",
                "message": "Model AI berhasil di-reload",
                "model_loaded": True,
            }
        else:
            return {
                "status": "failed",
                "message": "Model files tidak ditemukan atau gagal load",
                "model_loaded": False,
            }
    except Exception as e:
        raise HTTPException(500, f"Error saat reload model: {str(e)}")


# ── GET /api/ai/debug-paths ─────────────────────────────────
@router.get("/debug-paths")
def debug_paths():
    """Debug endpoint untuk cek path dan file model"""
    import os
    from pathlib import Path
    
    base_dir = Path(__file__).parent.parent
    ml_dir = base_dir / "ml_models"
    
    return {
        "base_dir": str(base_dir),
        "base_dir_exists": base_dir.exists(),
        "ml_models_dir": str(ml_dir),
        "ml_models_dir_exists": ml_dir.exists(),
        "ml_models_contents": list(ml_dir.iterdir()) if ml_dir.exists() else [],
        "model_path": str(ai_service.MODEL_PATH),
        "model_exists": ai_service.MODEL_PATH.exists(),
        "vectorizer_path": str(ai_service.VECTORIZER_PATH),
        "vectorizer_exists": ai_service.VECTORIZER_PATH.exists(),
        "encoder_path": str(ai_service.ENCODER_PATH),
        "encoder_exists": ai_service.ENCODER_PATH.exists(),
        "current_working_dir": os.getcwd(),
    }
