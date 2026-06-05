# 🔧 Cara Fix AI Match Score yang Selalu 75%

## Problem
Setiap kali analisis CV, skornya selalu **75%** dan kategorinya selalu **INFORMATION-TECHNOLOGY**.

## Root Cause
Model AI tidak ter-load di memory HuggingFace Space kamu.

---

## ✅ Solusi Cepat (3 Langkah)

### 1️⃣ Cek Status Model
Buka URL ini di browser:
```
https://padukaHaidar-capstoneproject-techhiring.hf.space/api/ai/status
```

Kamu akan lihat response seperti ini:
```json
{
  "model_files_present": true/false,
  "model_loaded": true/false,
  "categories": [...],
  "message": "..."
}
```

### 2️⃣ Reload Model (NEW!)
Aku sudah tambahkan endpoint baru untuk reload model. Buka URL ini:
```
https://padukaHaidar-capstoneproject-techhiring.hf.space/api/ai/reload
```

Atau pakai curl:
```bash
curl -X POST https://padukaHaidar-capstoneproject-techhiring.hf.space/api/ai/reload
```

Response:
```json
{
  "status": "success",
  "message": "Model AI berhasil di-reload"
}
```

### 3️⃣ Cek Ulang di Frontend
Sekarang ada fitur baru di halaman **Settings** (Admin):
1. Login sebagai admin
2. Buka menu **Pengaturan**
3. Lihat section **"Status Model AI"** di bagian atas
4. Klik tombol **"Reload Model"** kalau status masih "Not Loaded"

Screenshot fitur baru:
```
┌─────────────────────────────────────────────┐
│ 🔵 Status Model AI                          │
│                     [Refresh] [Reload Model]│
│                                             │
│ Files Present:     ✓ Yes                    │
│ Model Loaded:      ✓ Loaded                 │
│ Categories:        7                        │
└─────────────────────────────────────────────┘
```

---

## 🧪 Test Setelah Fix

### Via Frontend
1. Login → Upload CV di halaman HRD
2. Lihat skor hasil analisis → **harus bervariasi** (60-95%), bukan 75% terus

### Via API
```bash
curl -X POST https://padukaHaidar-capstoneproject-techhiring.hf.space/api/ai/analyze-text \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Saya seorang software engineer dengan pengalaman 5 tahun di React, Node.js, Python, dan Docker. Membangun sistem microservices dan REST API."
  }'
```

**Expected Response:**
```json
{
  "name": "Kandidat",
  "score": 87.4,  // ← BUKAN 75!
  "category": "INFORMATION-TECHNOLOGY",
  "skills": [
    {"name": "React", "level": 82, "category": "Frontend"},
    {"name": "Node.js", "level": 79, "category": "Backend"},
    ...
  ]
}
```

---

## 🔍 Jika Masih 75%

### Opsi A: Restart HuggingFace Space
1. Buka Space Settings: https://huggingface.co/spaces/padukaHaidar/capstoneproject-techhiring/settings
2. Scroll ke bawah → klik **"Factory reboot"**
3. Tunggu 1-2 menit
4. Cek ulang `/api/ai/status`

### Opsi B: Cek Logs
1. Buka HuggingFace Space → tab **Logs**
2. Cari error seperti:
   - `[ERROR] Could not load AI model:`
   - `ModuleNotFoundError: No module named 'tensorflow'`
   - Memory error
3. Screenshot dan kirim ke team

### Opsi C: Verifikasi File Model
Pastikan 3 file ini ada di `api/ml_models/`:
- ✅ `tech_hire_model_final.keras`
- ✅ `tfidf_vectorizer_final.pkl`
- ✅ `label_encoder_final.pkl`

Jika salah satu missing, upload ulang folder `api/ml_models/` ke Space.

---

## 💻 Development Mode (Lokal)

Kalau mau development tanpa bergantung HuggingFace:

```bash
# 1. Masuk ke folder API
cd api

# 2. Buat virtual environment
python -m venv venv
venv\Scripts\activate  # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Jalankan server
python main.py
```

Server akan running di `http://localhost:8000`

Lalu ubah `frontend/src/utils/api.js`:
```javascript
export const AI_URL = "http://localhost:8000";  // Ganti ke lokal
```

---

## 📊 Hasil Setelah Fix

| Sebelum | Sesudah |
|---------|---------|
| Score: **75%** terus | Score: **bervariasi** (60-95%) |
| Kategori: **IT** terus | Kategori: **sesuai CV** (Sales, Finance, HR, dll) |
| Skills: **random** | Skills: **akurat** dari CV |
| Model loaded: **false** | Model loaded: **true** |

---

## 🎯 Kesimpulan

1. ✅ Cek status: `/api/ai/status`
2. ✅ Reload model: `/api/ai/reload` (NEW!)
3. ✅ Test analisis CV → skor harus bervariasi
4. ✅ Jika masih stuck → restart Space atau run lokal

**Update Terbaru:**
- ✨ Endpoint `/api/ai/reload` untuk manual reload
- ✨ UI baru di Settings page untuk monitoring AI status
- ✨ Troubleshooting guide lengkap

**File yang sudah diupdate:**
- `api/routers/ai.py` → tambah endpoint reload
- `frontend/src/pages/admin/SettingsPage.jsx` → tambah AI status monitor
- `TROUBLESHOOTING_AI_75_PERCENT.md` → guide lengkap

---

**Questions?** Contact: Haidar Parras (Team Lead)
