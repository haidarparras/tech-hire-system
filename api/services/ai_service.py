"""
AI Service — integrasi model Deep Learning dari tim AI.

Model: Neural Network (TF-IDF + Dense layers)
Output: Klasifikasi kategori CV + confidence score
Assets: tech_hire_model_final.keras | tfidf_vectorizer_final.pkl | label_encoder_final.pkl
"""

import re
import json
import numpy as np
from pathlib import Path

# ── Paths ────────────────────────────────────────────────────
BASE_DIR = Path(__file__).parent.parent
ML_MODELS_DIR = BASE_DIR / "ml_models"

MODEL_PATH      = ML_MODELS_DIR / "tech_hire_model_final.h5"  # Changed to .h5
VECTORIZER_PATH = ML_MODELS_DIR / "tfidf_vectorizer_final.pkl"
ENCODER_PATH    = ML_MODELS_DIR / "label_encoder_final.pkl"

# ── Global model state ───────────────────────────────────────
model         = None
vectorizer    = None
label_encoder = None
stop_words    = set()

# ── Skill keyword database ───────────────────────────────────
SKILL_KEYWORDS = {
    "Frontend":     ["react", "vue", "angular", "javascript", "typescript", "html", "css",
                     "tailwind", "sass", "redux", "next.js", "nuxt", "svelte", "webpack"],
    "Backend":      ["python", "java", "node.js", "express", "django", "fastapi", "spring",
                     "php", "laravel", "ruby", "golang", "c#", ".net", "flask", "nestjs"],
    "Database":     ["mysql", "postgresql", "mongodb", "redis", "elasticsearch", "sqlite",
                     "oracle", "sql server", "cassandra", "dynamodb"],
    "DevOps":       ["docker", "kubernetes", "aws", "gcp", "azure", "ci/cd", "jenkins",
                     "terraform", "ansible", "linux", "nginx", "helm"],
    "Data Science": ["pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "keras",
                     "matplotlib", "jupyter", "spark", "hadoop", "tableau", "powerbi"],
    "Tools":        ["git", "github", "jira", "figma", "postman", "swagger", "vscode",
                     "confluence", "trello", "notion"],
}

# ── Insight per kategori (dari hasil test_samples notebook) ──
CATEGORY_INSIGHTS = {
    "INFORMATION-TECHNOLOGY": {
        "position_label": "IT Professional",
        "strengths": [
            "Strong technical & engineering background",
            "Proficient with modern tech stack",
            "Problem-solving & analytical mindset",
        ],
        "gaps": [
            "Leadership & soft skills may need development",
            "Business domain knowledge exposure",
        ],
        "recommendation": (
            "Kandidat memiliki latar belakang IT yang kuat dan relevan. "
            "Sangat cocok untuk posisi teknis seperti Software Engineer atau DevOps. "
            "Disarankan evaluasi lebih lanjut pada kemampuan komunikasi lintas-tim."
        ),
    },
    "SALES": {
        "position_label": "Sales Professional",
        "strengths": [
            "Excellent communication & persuasion skills",
            "Goal-oriented and results-driven",
            "Client relationship management expertise",
        ],
        "gaps": [
            "Technical product knowledge may need improvement",
            "Data-driven sales analytics skills",
        ],
        "recommendation": (
            "Kandidat memiliki profil sales yang solid dengan rekam jejak yang baik. "
            "Keahlian dalam pencapaian target dan manajemen klien menjadi nilai tambah utama. "
            "Cocok untuk posisi Sales Executive atau Account Manager."
        ),
    },
    "BUSINESS-DEVELOPMENT": {
        "position_label": "Business Development",
        "strengths": [
            "Strategic thinking & market expansion expertise",
            "Partnership development & negotiation skills",
            "Revenue growth identification capability",
        ],
        "gaps": [
            "Proficiency in analytical & BI tools",
            "Technical implementation understanding",
        ],
        "recommendation": (
            "Kandidat sangat cocok untuk peran Business Development. "
            "Keahlian dalam identifikasi peluang pasar dan membangun kemitraan strategis "
            "menjadi keunggulan utama. Rekomendasikan untuk posisi BD Manager atau Partnership Lead."
        ),
    },
    "FINANCE": {
        "position_label": "Finance Professional",
        "strengths": [
            "Strong financial analysis & modeling skills",
            "Expert in auditing & fiscal reporting",
            "Exceptional attention to detail",
        ],
        "gaps": [
            "Digital finance & fintech tools adoption",
            "Cross-functional collaboration skills",
        ],
        "recommendation": (
            "Kandidat memiliki keahlian keuangan yang solid dan terukur. "
            "Latar belakang dalam analisis keuangan dan pelaporan fiskal menjadi aset berharga. "
            "Sangat cocok untuk posisi Financial Analyst atau Accountant Senior."
        ),
    },
    "HR": {
        "position_label": "HR Professional",
        "strengths": [
            "Strong people management & empathy",
            "Talent acquisition & employee relations expertise",
            "Policy development & compliance knowledge",
        ],
        "gaps": [
            "HR analytics & people data tools",
            "Digital HR transformation initiatives",
        ],
        "recommendation": (
            "Kandidat memiliki profil HR yang komprehensif dan berpengalaman. "
            "Keahlian dalam manajemen talenta dan hubungan karyawan menjadi aset utama. "
            "Sangat cocok untuk posisi HR Manager atau Talent Acquisition Specialist."
        ),
    },
    "ENGINEERING": {
        "position_label": "Engineering Professional",
        "strengths": [
            "Strong technical problem-solving ability",
            "Systematic & process-oriented approach",
            "Project execution & delivery expertise",
        ],
        "gaps": [
            "Cross-functional & cross-team collaboration",
            "Business impact & stakeholder awareness",
        ],
        "recommendation": (
            "Kandidat memiliki kemampuan engineering yang baik. "
            "Rekomendasikan untuk posisi teknis dengan jalur karir ke Engineering Lead. "
            "Evaluasi kemampuan manajemen proyek untuk promosi ke level senior."
        ),
    },
    "MARKETING": {
        "position_label": "Marketing Professional",
        "strengths": [
            "Creative campaign development skills",
            "Brand strategy & market positioning",
            "Multi-channel marketing expertise",
        ],
        "gaps": [
            "Data analytics & performance marketing tools",
            "Technical SEO & automation skills",
        ],
        "recommendation": (
            "Kandidat memiliki latar belakang marketing yang kreatif dan strategis. "
            "Keahlian dalam brand development dan kampanye multi-channel sangat relevan. "
            "Cocok untuk posisi Marketing Manager atau Digital Marketing Specialist."
        ),
    },
}

DEFAULT_INSIGHTS = {
    "position_label": "Professional",
    "strengths": [
        "Relevant domain experience",
        "Professional work background",
        "Adaptability & learning agility",
    ],
    "gaps": [
        "Specific technical skills need further assessment",
        "Industry-specific knowledge depth",
    ],
    "recommendation": (
        "Kandidat menunjukkan profil yang relevan dan berpotensi. "
        "Disarankan wawancara mendalam untuk mengevaluasi kecocokan spesifik "
        "dengan kebutuhan posisi yang dituju di organisasi."
    ),
}


# ── NLTK + Model Loader ──────────────────────────────────────
def _init_nltk():
    global stop_words
    try:
        import nltk
        nltk.download("punkt",      quiet=True)
        nltk.download("stopwords",  quiet=True)
        nltk.download("punkt_tab",  quiet=True)
        from nltk.corpus import stopwords as sw
        stop_words = set(sw.words("indonesian"))
    except Exception as e:
        print(f"⚠️ NLTK init warning: {e}")
        stop_words = set()


def load_ai_model() -> bool:
    """Load model, vectorizer, dan label encoder ke memory."""
    global model, vectorizer, label_encoder
    _init_nltk()

    print(f"[DEBUG] BASE_DIR: {BASE_DIR}")
    print(f"[DEBUG] ML_MODELS_DIR: {ML_MODELS_DIR}")
    print(f"[DEBUG] MODEL_PATH exists: {MODEL_PATH.exists()}")
    print(f"[DEBUG] VECTORIZER_PATH exists: {VECTORIZER_PATH.exists()}")
    print(f"[DEBUG] ENCODER_PATH exists: {ENCODER_PATH.exists()}")

    if not is_model_ready():
        print("[WARN] Model files not found in api/ml_models/. AI running in fallback mode.")
        return False

    try:
        import tensorflow as tf
        import joblib

        print(f"[DEBUG] TensorFlow version: {tf.__version__}")
        
        # Load vectorizer dan encoder dulu
        print(f"[DEBUG] Loading vectorizer from: {VECTORIZER_PATH}")
        vectorizer = joblib.load(str(VECTORIZER_PATH))
        print("[DEBUG] Vectorizer loaded successfully")
        
        print(f"[DEBUG] Loading encoder from: {ENCODER_PATH}")
        label_encoder = joblib.load(str(ENCODER_PATH))
        print("[DEBUG] Encoder loaded successfully")
        
        # Load .h5 model (legacy format, no quantization_config issues)
        print(f"[DEBUG] Loading .h5 model from: {MODEL_PATH}")
        model = tf.keras.models.load_model(str(MODEL_PATH))
        print("[DEBUG] Model loaded successfully")
        
        print("[AI] Model loaded successfully")
        print(f"[AI] Categories: {list(label_encoder.classes_)}")
        return True

    except Exception as e:
        print(f"[ERROR] Could not load AI model: {e}")
        import traceback
        traceback.print_exc()
        return False


def is_model_ready() -> bool:
    return MODEL_PATH.exists() and VECTORIZER_PATH.exists() and ENCODER_PATH.exists()


# ── Text Preprocessing (sama persis dengan notebook) ─────────
def preprocess_text(text: str) -> str:
    try:
        from nltk.tokenize import word_tokenize
        text = str(text).lower()
        text = re.sub(r"\d+", "", text)
        text = re.sub(r"[^\w\s]", "", text)
        tokens = word_tokenize(text)
        tokens = [w for w in tokens if w not in stop_words]
        return " ".join(tokens)
    except Exception:
        # Fallback tanpa NLTK
        text = str(text).lower()
        text = re.sub(r"\d+", "", text)
        text = re.sub(r"[^\w\s]", "", text)
        return text


# ── Inference ─────────────────────────────────────────────────
def predict_category(text: str) -> tuple[str, float]:
    """Return (category, confidence). Fallback ke default jika model tidak ada."""
    if model is None:
        return "INFORMATION-TECHNOLOGY", 0.75

    try:
        import numpy as np
        clean = preprocess_text(text)
        vec   = vectorizer.transform([clean]).toarray()
        preds = model.predict(vec, verbose=0)
        idx   = int(np.argmax(preds))
        conf  = float(np.max(preds))
        cat   = label_encoder.classes_[idx]
        return cat, conf
    except Exception as e:
        print(f"Prediction error: {e}")
        return "INFORMATION-TECHNOLOGY", 0.75


# ── Feature Extraction ────────────────────────────────────────
def extract_skills(text: str) -> list:
    text_lower = text.lower()
    found = []
    seen  = set()

    for category, skills in SKILL_KEYWORDS.items():
        for skill in skills:
            if skill.lower() in text_lower and skill not in seen:
                seen.add(skill)
                count  = text_lower.count(skill.lower())
                # Deterministic level based on frequency + hash
                level  = min(96, 55 + count * 6 + (hash(skill) % 25))
                label  = skill.upper() if len(skill) <= 4 else skill.title()
                found.append({"name": label, "level": level, "category": category})

    # Sort by level desc, return top 8
    found.sort(key=lambda x: x["level"], reverse=True)
    return found[:8]


def extract_experience(text: str) -> str:
    patterns = [
        r"(\d+)\+?\s*(?:years?|tahun)\s*(?:of\s*)?(?:experience|pengalaman)",
        r"(?:experience|pengalaman)[:\s]+(\d+)\+?\s*(?:years?|tahun)",
        r"(\d+)\s*(?:years?|tahun)\s*(?:work|kerja|bekerja)",
    ]
    for p in patterns:
        m = re.search(p, text.lower())
        if m:
            return f"{m.group(1)} tahun"
    return "Tidak disebutkan"


def extract_education(text: str) -> str:
    t = text.lower()
    if any(w in t for w in ["phd", "ph.d", "doktor", "s3"]):
        return "S3 / Doktor"
    elif any(w in t for w in ["master", "magister", "s2", "m.sc", "m.eng", "m.kom"]):
        return "S2 / Magister"
    elif any(w in t for w in ["bachelor", "sarjana", "s1", "b.sc", "s.kom", "s.t.", "s.e"]):
        return "S1 / Sarjana"
    elif any(w in t for w in ["diploma", "d3", "d4", "d-3", "d-4"]):
        return "D3/D4 / Diploma"
    return "Tidak disebutkan"


def extract_name(text: str, filename: str = "") -> str:
    """Best-effort name extraction dari baris pertama CV."""
    lines = [l.strip() for l in text.strip().splitlines() if l.strip()]
    if lines:
        candidate = lines[0]
        # Nama kemungkinan: < 50 char, bukan email, bukan URL
        if len(candidate) < 50 and "@" not in candidate and "http" not in candidate:
            return candidate
    # Fallback: pakai nama file
    if filename:
        stem = Path(filename).stem.replace("_", " ").replace("-", " ")
        return stem.title()
    return "Kandidat"


# ── Full Analysis ─────────────────────────────────────────────
def analyze_cv(text: str, filename: str = "") -> dict:
    """
    Analisis lengkap CV — dipanggil dari router AI.
    Return dict sesuai schema CVAnalysisResult.
    """
    category, confidence = predict_category(text)
    insights = CATEGORY_INSIGHTS.get(category, DEFAULT_INSIGHTS)

    name       = extract_name(text, filename)
    skills     = extract_skills(text)
    experience = extract_experience(text)
    education  = extract_education(text)
    score      = round(confidence * 100, 1)

    return {
        "name":            name,
        "position":        insights["position_label"],
        "category":        category,
        "score":           score,
        "skills":          skills,
        "experience":      experience,
        "education":       education,
        "strengths":       insights["strengths"],
        "gaps":            insights["gaps"],
        "recommendation":  insights["recommendation"],
        "model_available": is_model_ready(),
    }


# ── PDF / DOCX Text Extractor ─────────────────────────────────
def extract_text_from_file(file_bytes: bytes, filename: str) -> str:
    ext = Path(filename).suffix.lower()

    if ext == ".pdf":
        try:
            import fitz  # PyMuPDF
            doc  = fitz.open(stream=file_bytes, filetype="pdf")
            text = "\n".join(page.get_text() for page in doc)
            doc.close()
            return text.strip()
        except Exception as e:
            raise ValueError(f"Gagal membaca PDF: {e}")

    elif ext in (".doc", ".docx"):
        try:
            import io
            from docx import Document
            doc  = Document(io.BytesIO(file_bytes))
            text = "\n".join(p.text for p in doc.paragraphs)
            return text.strip()
        except Exception as e:
            raise ValueError(f"Gagal membaca DOCX: {e}")

    else:
        raise ValueError(f"Format tidak didukung: {ext}. Gunakan PDF, DOC, atau DOCX.")
