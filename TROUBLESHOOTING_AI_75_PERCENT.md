# Troubleshooting: AI Match Score Selalu 75%

## 🔍 Root Cause
Skor AI selalu 75% karena **model tidak ter-load di memory**. Ketika model `None`, fungsi `predict_category()` mengembalikan nilai fallback:

```python
def predict_category(text: str) -> tuple[str, float]:
    if model is None:
        return "INFORMATION-TECHNOLOGY", 0.75  # ← FALLBACK!
```

## 📋 Checklist Debugging

### 1️⃣ CEK STATUS MODEL
Buka URL ini di browser:
```
https://padukaHaidar-capstoneproject-techhiring.hf.space/api/ai/status
```

**Response yang BENAR:**
```json
{
  "model_files_present": true,
  "model_loaded": true,
  "categories": ["INFORMATION-TECHNOLOGY", "SALES", "BUSINESS-DEVELOPMENT", ...],
  "message": "[OK] Model AI siap digunakan"
}
```

**Response BERMASALAH:**
```json
{
  "model_files_present": false,
  "model_loaded": false,
  "categories": [],
  "message": "[WARN] Model files belum ada di api/ml_models/. Mode fallback aktif."
}
```

---

### 2️⃣ JIKA `model_files_present: false`
**Artinya:** File model tidak ada di HuggingFace Space

**Solusi:**
1. Buka Space Settings di HuggingFace
2. Pastikan folder `api/ml_models/` ter-upload dengan 3 file:
   - `tech_hire_model_final.keras` (model TensorFlow)
   - `tfidf_vectorizer_final.pkl` (vectorizer)
   - `label_encoder_final.pkl` (encoder)
3. Restart Space (Settings → Factory reboot)

---

### 3️⃣ JIKA `model_files_present: true` TAPI `model_loaded: false`
**Artinya:** File ada, tapi gagal load ke memory

**Kemungkinan Penyebab:**
- Space baru restart (cold start)
- TensorFlow/dependency error saat load
- Memory limit HuggingFace terlampaui

**Solusi:**

#### A. Manual Reload Model
Setelah saya tambahkan endpoint reload, kamu bisa panggil:
```bash
curl -X POST https://padukaHaidar-capstoneproject-techhiring.hf.space/api/ai/reload
```

Atau buka di browser (via Postman/Thunder Client):
```
POST https://padukaHaidar-capstoneproject-techhiring.hf.space/api/ai/reload
```

**Response sukses:**
```json
{
  "status": "success",
  "message": "Model AI berhasil di-reload",
  "model_loaded": true
}
```

#### B. Cek Logs HuggingFace Space
1. Buka Space → Logs tab
2. Cari error yang berkaitan dengan:
   - `[ERROR] Could not load AI model:`
   - `ModuleNotFoundError: No module named 'tensorflow'`
   - `Memory error`

#### C. Restart HuggingFace Space
1. Space Settings → Factory reboot
2. Tunggu 1-2 menit hingga cold start selesai
3. Cek ulang `/api/ai/status`

---

### 4️⃣ JIKA SPACE SERING SLEEP
HuggingFace Free Tier akan sleep setelah idle beberapa menit. Opsi:

1. **Upgrade ke Pro/Enterprise** (Space tidak sleep)
2. **Ping Space secara berkala** (keep-alive)
3. **Run API lokal** untuk development:

```bash
cd api
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

Lalu ubah `frontend/src/utils/api.js`:
```javascript
export const AI_URL = "http://localhost:8000";  // Local API
```

---

## 🛠️ Quick Fix Checklist

| Step | Action | Command/URL |
|------|--------|-------------|
| 1 | Cek status model | `GET https://padukaHaidar-capstoneproject-techhiring.hf.space/api/ai/status` |
| 2 | Reload model manual | `POST https://padukaHaidar-capstoneproject-techhiring.hf.space/api/ai/reload` |
| 3 | Restart Space | HuggingFace Space Settings → Factory reboot |
| 4 | Cek logs | HuggingFace Space → Logs tab |
| 5 | Run lokal (dev) | `cd api && python main.py` |

---

## 📝 Cara Tes Cepat

### Test 1: Status Check
```bash
curl https://padukaHaidar-capstoneproject-techhiring.hf.space/api/ai/status
```

### Test 2: Reload Model
```bash
curl -X POST https://padukaHaidar-capstoneproject-techhiring.hf.space/api/ai/reload
```

### Test 3: Analyze Sample Text
```bash
curl -X POST https://padukaHaidar-capstoneproject-techhiring.hf.space/api/ai/analyze-text \
  -H "Content-Type: application/json" \
  -d '{"text": "Saya seorang software engineer dengan pengalaman 5 tahun di React, Node.js, dan Python. Pernah bekerja di startup teknologi dan membangun sistem microservices."}'
```

**Expected Response** (bukan 75%):
```json
{
  "name": "Kandidat",
  "score": 85.3,  // ← Bukan 75!
  "category": "INFORMATION-TECHNOLOGY",
  ...
}
```

---

## 💡 Kesimpulan

**Masalah:** Model tidak loaded → fallback 75%  
**Root Cause:** HuggingFace Space sleep/restart OR model files missing  
**Solusi Cepat:** Reload model via `/api/ai/reload` atau restart Space  
**Solusi Development:** Run API lokal dengan `python main.py`

---

## 🚨 Jika Masih Stuck

1. Screenshot response dari `/api/ai/status`
2. Screenshot logs HuggingFace Space
3. Kirim ke team untuk debug lebih lanjut

**Contact:** Haidar Parras (team lead)
