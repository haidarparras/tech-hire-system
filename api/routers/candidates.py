from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models.database import Candidate, get_db
from models.schemas import CandidateResponse

router = APIRouter()


# ── GET /api/candidates ──────────────────────────────────────
@router.get("/", response_model=List[CandidateResponse])
def get_candidates(db: Session = Depends(get_db)):
    try:
        candidates = (
            db.query(Candidate)
            .order_by(Candidate.score.desc())
            .all()
        )
        return candidates
    except Exception as e:
        raise HTTPException(500, f"Internal Server Error: {e}")


# ── GET /api/candidates/{id} ─────────────────────────────────
@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(404, "Candidate not found")
    return candidate


# ── DELETE /api/candidates/{id} ──────────────────────────────
@router.delete("/{candidate_id}")
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(404, "Candidate not found")
    db.delete(candidate)
    db.commit()
    return {"message": f"Kandidat ID {candidate_id} berhasil dihapus"}


# ── DELETE /api/candidates (hapus semua) ─────────────────────
@router.delete("/")
def delete_all_candidates(db: Session = Depends(get_db)):
    try:
        db.query(Candidate).delete()
        db.commit()
        return {"message": "Seluruh data kandidat berhasil dihapus!"}
    except Exception as e:
        raise HTTPException(500, f"Internal Server Error: {e}")
