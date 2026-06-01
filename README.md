# Tech-Hire System

Sistem rekrutmen berbasis AI full-stack yang dapat menganalisis CV otomatis, mengklasifikasikan kandidat, dan mengelola pipeline rekrutmen.

---

## 🏗️ Arsitektur

```
frontend/ (React + Vite + Tailwind)  :5173
backend/  (Node.js + Express)        :5000
api/      (FastAPI + Python + AI)    :8000
database  (MySQL)                    :3306
```

---

## ⚡ Cara Menjalankan

### 1. Prasyarat
- Node.js v18+
- Python 3.10+
- MySQL (Laragon atau XAMPP)
- pip

### 2. Setup Database
Pastikan MySQL berjalan, buat database `tech_hire_db`:
```sql
CREATE DATABASE IF NOT EXISTS tech_hire_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Backend Node.js
```bash
cd backend
cp .env.example .env       # Edit .env sesuai konfigurasi
npm install
node index.js              # Server berjalan di :5000
```

### 4. API Python (FastAPI + AI)
```bash
cd api
cp .env.example .env       # Edit .env sesuai konfigurasi
pip install -r requirements.txt
python main.py             # Server berjalan di :8000
```

### 5. Frontend React
```bash
cd frontend
npm install
npm run dev                # Berjalan di :5173
```

---

## 🔐 Sistem Autentikasi

### Role yang Tersedia

| Role | Akses |
|------|-------|
| `admin` | Dashboard admin, manajemen user, statistik, semua fitur HRD |
| `hrd` | Dashboard HRD, manajemen kandidat, lowongan, interview |
| `user` | Upload dan analisis CV |

### Alur Login
1. POST ke `http://localhost:5000/api/auth/login`
2. Token JWT disimpan di `localStorage` (`techhire_token`)
3. Semua request berikutnya otomatis menyertakan `Authorization: Bearer <token>`

---

## 🔑 Environment Variables

### backend/.env
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=tech_hire_db
PORT=5000
JWT_SECRET=ganti_dengan_string_acak_yang_kuat
```

### api/.env
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=tech_hire_db
PORT=8000
JWT_SECRET=harus_sama_dengan_backend
```

---

## 📡 API Endpoints

### Backend Node.js (:5000)

| Method | Endpoint | Auth | Role |
|--------|----------|------|------|
| POST | `/api/auth/register` | ❌ | - |
| POST | `/api/auth/login` | ❌ | - |
| GET | `/api/stats` | ✅ | hrd, admin |
| GET | `/api/candidates` | ✅ | hrd, admin |
| PUT | `/api/candidates/:id/status` | ✅ | hrd, admin |
| DELETE | `/api/candidates/:id` | ✅ | hrd, admin |
| DELETE | `/api/candidates` | ✅ | admin |
| GET | `/api/jobs` | ✅ | semua login |
| POST | `/api/jobs` | ✅ | hrd, admin |
| PUT | `/api/jobs/:id` | ✅ | hrd, admin |
| DELETE | `/api/jobs/:id` | ✅ | admin |
| GET | `/api/users` | ✅ | admin |
| DELETE | `/api/users/:id` | ✅ | admin |

### API Python FastAPI (:8000)

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/` | Status API |
| GET | `/health` | Health check |
| GET | `/docs` | Swagger UI |
| POST | `/api/auth/login` | Login (Python side) |
| POST | `/api/ai/analyze` | Upload & analisis CV |
| GET | `/api/ai/status` | Status model AI |
| GET | `/api/candidates` | Daftar kandidat (Python) |

---

## 🤖 Model AI

- **Model**: Neural Network (Dense layers)
- **Vectorizer**: TF-IDF
- **Lokasi**: `api/ml_models/`
- **Kategori**: IT, Sales, Business Dev, Finance, HR, Engineering, Marketing
- **Input**: Teks CV (PDF / DOC / DOCX)
- **Output**: Kategori + confidence score + skills extraction

---

## 🛡️ Keamanan

- ✅ JWT token wajib ada untuk semua endpoint sensitif
- ✅ CORS dibatasi hanya ke `localhost:5173`
- ✅ Password di-hash dengan bcrypt (salt rounds: 12)
- ✅ Role-based access control (RBAC) per endpoint
- ✅ Admin tidak bisa menghapus akun dirinya sendiri
- ✅ Validasi input di semua endpoint
- ✅ JWT_SECRET wajib dikonfigurasi (server tidak bisa start tanpanya)

---

## 📁 Struktur Proyek

```
tech-hire-system/
├── frontend/
│   ├── src/
│   │   ├── utils/api.js          ← Centralized API utility (JWT auto-attach)
│   │   ├── pages/
│   │   │   ├── admin/            ← AdminDashboard, UsersPage, SettingsPage
│   │   │   ├── hrd/              ← HRDDashboard, JobsPage, InterviewsPage
│   │   │   ├── user/             ← CVUploadPage
│   │   │   ├── auth/             ← LoginPage
│   │   │   └── public/           ← HeroPage, FeaturesPage, AboutPage
│   │   └── components/common/    ← Navbar, Footer, Icon, CVAnalyzer
│   └── package.json
├── backend/
│   ├── index.js                  ← Express server + JWT middleware + RBAC
│   ├── init_db.js                ← DB init (roles, users, jobs tables)
│   ├── db.js                     ← MySQL connection pool
│   ├── .env                      ← Konfigurasi (tidak di-commit)
│   └── .env.example              ← Template konfigurasi
├── api/
│   ├── main.py                   ← FastAPI app entry point
│   ├── routers/
│   │   ├── ai.py                 ← CV upload & analisis endpoint
│   │   ├── auth.py               ← Auth endpoint (Python side)
│   │   └── candidates.py         ← Candidates CRUD
│   ├── services/ai_service.py    ← Model loading & inference logic
│   ├── models/
│   │   ├── database.py           ← SQLAlchemy ORM models
│   │   └── schemas.py            ← Pydantic schemas
│   ├── ml_models/                ← Model files (.keras, .pkl)
│   ├── .env                      ← Konfigurasi (tidak di-commit)
│   └── .env.example              ← Template konfigurasi
└── .gitignore
```
