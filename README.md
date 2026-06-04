# TechHire Intelligence System

> Platform rekrutmen berbasis AI yang menganalisis CV secara otomatis, mengidentifikasi skill kandidat, dan memprediksi tingkat kecocokan — sehingga proses hiring menjadi **10x lebih cepat** dan lebih objektif.

---

## Tentang Proyek

TechHire Intelligence System lahir dari kebutuhan nyata industri: proses rekrutmen yang lambat, bias, dan tidak efisien. Platform ini membangun ekosistem rekrutmen end-to-end dengan tiga komponen utama:

| Komponen | Teknologi | Deskripsi |
|---|---|---|
| **Frontend** | React 19 + Vite | Antarmuka recruiter dan kandidat |
| **Backend** | Node.js + Express | REST API, autentikasi JWT |
| **AI Service** | Python + FastAPI | NLP, CV parsing, model matching |

---

## Fitur Utama

- **AI CV Analyzer** — Ekstraksi otomatis data CV (pengalaman, pendidikan, skill) menggunakan NLP
- **Smart Matching Engine** — Skor kecocokan kandidat vs posisi berbasis 50+ parameter
- **Analytics Dashboard** — Visualisasi real-time pipeline rekrutmen dan insight hiring
- **Skill Identifier** — Deteksi 200+ hard skill & soft skill dengan gap analysis
- **Rekomendasi Cerdas** — Top-N kandidat otomatis dengan alasan transparan
- **Anti-Bias System** — Evaluasi objektif berbasis data, audit trail transparan

---

## Struktur Proyek

```
tech-hire-system/
├── frontend/          # React + Vite (port 5173)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   └── package.json
│
├── backend/           # Node.js + Express (port 5000)
│   ├── routers/
│   ├── index.js
│   └── package.json
│
└── api/               # Python FastAPI — AI Service (port 8000)
    ├── routers/
    ├── services/
    ├── ml_models/
    ├── models/
    └── main.py
```

---

## Prasyarat

Pastikan sudah terinstal:

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.10+
- [PostgreSQL](https://www.postgresql.org/) atau MySQL

---

## Instalasi & Menjalankan Lokal

### 1. Clone repo

```bash
git clone https://github.com/USERNAME/tech-hire-system.git
cd tech-hire-system
```

### 2. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env   # sesuaikan jika ada
npm run dev
# → http://localhost:5173
```

### 3. Setup Backend (Node.js)

```bash
cd backend
npm install
cp .env.example .env   # isi DB_HOST, DB_USER, DB_PASSWORD, JWT_SECRET
node init_db.js        # inisialisasi database
npm start
# → http://localhost:5000
```

### 4. Setup AI Service (Python)

```bash
cd api
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
cp .env.example .env         # isi DB_*, JWT_SECRET
uvicorn main:app --reload --port 8000
# → http://localhost:8000
```

---

## Konfigurasi Environment

Database menggunakan **Supabase** (PostgreSQL cloud). Dapatkan connection string dari:
`Supabase Dashboard → Project Settings → Database → Connection string → URI`

### `backend/.env`

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
PORT=5000
JWT_SECRET=your_secret_key
```

### `api/.env`

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
PORT=8000
JWT_SECRET=your_secret_key   # harus sama dengan backend
```

> ⚠️ `JWT_SECRET` di backend dan api **harus identik**.  
> ⚠️ Jangan pernah commit file `.env` ke repository.

---

## Tech Stack

### Frontend
- React 19, Vite 8
- Tailwind CSS 4
- Plus Jakarta Sans + Inter (Google Fonts)

### Backend
- Node.js, Express 5
- Supabase PostgreSQL (`pg`), JWT (`jsonwebtoken`), bcryptjs

### AI Service
- FastAPI, Uvicorn
- TensorFlow 2.18, scikit-learn, NLTK
- PyMuPDF, python-docx (CV parsing)
- SQLAlchemy + Supabase PostgreSQL

---

## Model AI

### Arsitektur

| Komponen | Detail |
|---|---|
| **Model** | Neural Network (Dense layers) |
| **Vectorizer** | TF-IDF (Term Frequency-Inverse Document Frequency) |
| **Framework** | TensorFlow 2.18 + scikit-learn |
| **Lokasi** | `api/ml_models/` |

### File Model

```
api/ml_models/
├── tech_hire_model_final.keras   ← Neural Network model
├── tfidf_vectorizer_final.pkl    ← TF-IDF vectorizer
└── label_encoder_final.pkl       ← Label encoder kategori
```

### Kategori Prediksi

Model mampu mengklasifikasikan CV ke dalam 7 kategori bidang pekerjaan:

`IT` · `Sales` · `Business Development` · `Finance` · `HR` · `Engineering` · `Marketing`

### Input & Output

```
Input  : Teks CV (format PDF / DOC / DOCX)
           ↓ ekstraksi teks (PyMuPDF / python-docx)
           ↓ preprocessing & TF-IDF vectorization
           ↓ prediksi Neural Network

Output : {
           "kategori"         : "IT",
           "confidence_score" : 0.94,
           "skills"           : ["Python", "TensorFlow", "SQL", ...]
         }
```

> ⚠️ File `.keras` dan `.pkl` tidak di-commit ke repo (tercantum di `.gitignore`). Hubungi tim untuk mendapatkan file model.

---

## Tim Pengembang

| ID | Nama | Role |
|---|---|---|
| CACC131D6Y0251 | Ahmad Fadhillah Akbar | AI Engineer |
| CACC001D6Y0716 | Rafif Qaiser Shafiq | AI Engineer |
| CDCC889D6X1473 | Khatrunnada Salsabila Zega | Data Scientist |
| CDCC889D6X1193 | Aqila Salsabila | Data Scientist |
| CFCC189D6X2835 | Aulia Dwi Rahmadani | Fullstack Developer |
| CFCC190D6Y1283 | Haidar Parras | Fullstack Developer |

---

## Roadmap

- [x] Fase 1 — Analisis Kebutuhan
- [x] Fase 2 — Desain Sistem & UI/UX Prototype
- [x] Fase 3 — Pengembangan Core (CV Parser, NLP Engine, Matching Algorithm)
- [ ] Fase 4 — Integrasi & Testing
- [ ] Fase 5 — Deployment ke Production

---

## Lisensi

Proyek ini dibuat untuk keperluan Dicoding. © 2026 TechHire Intelligence System.
