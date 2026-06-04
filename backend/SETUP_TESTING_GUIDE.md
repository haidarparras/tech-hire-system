# 🚀 PostgreSQL Setup & Testing Guide

## Prerequisites

- Node.js v16+
- Supabase account (free tier available at supabase.com)
- npm atau yarn

---

## 📋 Setup Steps

### Step 1: Prepare Supabase Database

1. **Login to Supabase**: https://app.supabase.com
2. **Create/Select Project** or create new
3. **Get Connection String**:
   - Go to: Settings → Database → Connection String
   - Copy the connection string (PostgreSQL URI)
   - Format: `postgresql://[user]:[password]@[host]:[port]/[database]`

### Step 2: Setup .env File

```bash
cd backend
cp .env.example .env
```

**Edit .env:**

```env
# Database URL from Supabase
DATABASE_URL=postgresql://postgres.[project-id].[random-string]:your_password@db.[project-id].supabase.co:5432/postgres

# JWT Secret for authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure

# Server Port
PORT=5000
```

**⚠️ Important Notes:**

- Do NOT commit .env to git
- Make sure DATABASE_URL is correct format: `postgresql://...`
- JWT_SECRET should be at least 32 characters long
- Use .gitignore to exclude .env

### Step 3: Install Dependencies

```bash
npm install
```

**Expected packages:**

```json
{
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "jsonwebtoken": "^9.0.3",
    "pg": "^8.21.0"
  }
}
```

### Step 4: Start Server

```bash
npm start
```

**Expected Output:**

```
[DB] Database initialized: semua tabel siap.
[SERVER] Tech Hire Backend running on http://localhost:5000
```

---

## 🧪 Testing Endpoints

### Test 1: Health Check

```bash
curl http://localhost:5000/health
```

**Expected Response:**

```json
{
  "status": "ok",
  "service": "Tech Hire Backend",
  "port": 5000
}
```

### Test 2: User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "role": "user"
  }'
```

**Expected Response (201):**

```json
{
  "message": "Registrasi berhasil! Silakan login."
}
```

**Test Invalid Email:**

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "invalid-email",
    "password": "Password123"
  }'
```

**Expected Response (400):**

```json
{
  "error": "Format email tidak valid."
}
```

### Test 3: User Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

**Expected Response (200):**

```json
{
  "message": "Login berhasil.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**⚠️ Save the token for next tests!**

### Test 4: Get Users (Requires Admin Token)

First, register as admin or create admin in Supabase directly.

```bash
# Replace TOKEN with the token from login
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response (200):**

```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2026-06-04T10:30:00.000Z"
  }
]
```

**Without Token (401):**

```json
{
  "error": "Akses ditolak: Token tidak ditemukan."
}
```

### Test 5: Create Job (HRD/Admin Role Required)

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "title": "Senior Developer",
    "department": "Engineering",
    "location": "Jakarta",
    "type": "Full-time",
    "description": "Looking for experienced developer",
    "requirements": "5+ years experience"
  }'
```

**Expected Response (201):**

```json
{
  "id": 1,
  "message": "Lowongan berhasil dibuat."
}
```

### Test 6: Get Jobs

```bash
curl -X GET http://localhost:5000/api/jobs \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response (200):**

```json
[
  {
    "id": 1,
    "title": "Senior Developer",
    "department": "Engineering",
    "location": "Jakarta",
    "type": "Full-time",
    "description": "Looking for experienced developer",
    "requirements": "5+ years experience",
    "status": "open",
    "applicants": 0,
    "created_at": "2026-06-04T10:35:00.000Z"
  }
]
```

### Test 7: Update Job Status

```bash
curl -X PUT http://localhost:5000/api/jobs/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "status": "closed"
  }'
```

**Expected Response (200):**

```json
{
  "message": "Lowongan berhasil diperbarui."
}
```

### Test 8: Delete Job

```bash
curl -X DELETE http://localhost:5000/api/jobs/1 \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response (200):**

```json
{
  "message": "Lowongan berhasil dihapus."
}
```

---

## 🔍 Testing with Postman

### 1. Create Collection: "Tech Hire API"

### 2. Create Environment Variables

```json
{
  "base_url": "http://localhost:5000",
  "token": "",
  "user_id": 1
}
```

### 3. Create Requests

**a) Register**

- Method: POST
- URL: `{{base_url}}/api/auth/register`
- Body:

```json
{
  "name": "Test User",
  "email": "test{{$timestamp}}@test.com",
  "password": "Password123",
  "role": "user"
}
```

**b) Login**

- Method: POST
- URL: `{{base_url}}/api/auth/login`
- Body:

```json
{
  "email": "test@test.com",
  "password": "Password123"
}
```

- **Pre-request Script**:

```javascript
// Auto-save token for next requests
if (pm.response.code === 200) {
  var jsonData = pm.response.json();
  pm.environment.set("token", jsonData.token);
}
```

**c) Get Jobs**

- Method: GET
- URL: `{{base_url}}/api/jobs`
- Headers:
  - Authorization: `Bearer {{token}}`

---

## 🐛 Troubleshooting

### Error: "Cannot connect to database"

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**

1. Check DATABASE_URL in .env
2. Verify Supabase project is running
3. Check internet connection
4. Try connection string from Supabase dashboard again

### Error: "ENOENT: no such file or directory, open '.env'"

```
Error: ENOENT: no such file or directory
```

**Solution:**

```bash
cd backend
cp .env.example .env
# Edit .env with correct DATABASE_URL
```

### Error: "JWT_SECRET tidak ditemukan di .env"

```
[FATAL] JWT_SECRET tidak ditemukan di .env! Server tidak aman.
```

**Solution:**

- Add JWT_SECRET to .env file
- Make sure it's not commented out

### Error: "Token tidak valid"

```json
{
  "error": "Akses ditolak: Token tidak valid atau sudah kedaluwarsa."
}
```

**Solution:**

1. Token might be expired (24h expiry)
2. Make sure to use "Bearer TOKEN" format
3. Try login again to get new token

### Error: "Email sudah terdaftar"

```json
{
  "error": "Email sudah terdaftar."
}
```

**Solution:**

- Use different email for testing
- Or use timestamp in email: `test{{$timestamp}}@test.com`

### Error: "relation 'jobs' does not exist"

```
error: relation "jobs" does not exist
```

**Solution:**

1. Check if database initialization ran successfully
2. Check logs for `[DB] Database initialized`
3. Manually verify tables in Supabase dashboard
4. Try restarting server to re-initialize

---

## ✅ Full Test Checklist

- [ ] npm install succeeds
- [ ] npm start runs without error
- [ ] Database tables created in Supabase
- [ ] /health endpoint returns OK
- [ ] POST /api/auth/register works
- [ ] POST /api/auth/login returns token
- [ ] GET /api/users works with token
- [ ] POST /api/jobs works (with HRD role)
- [ ] GET /api/jobs returns data
- [ ] PUT /api/jobs/:id updates status
- [ ] DELETE /api/jobs/:id deletes job
- [ ] POST /api/announcements works
- [ ] GET /api/announcements returns data
- [ ] POST /api/activities works
- [ ] GET /api/activities returns data
- [ ] GET /api/stats returns counts
- [ ] DELETE /api/users/:id works (Admin only)
- [ ] Error responses are correct
- [ ] CORS works for http://localhost:5173
- [ ] All endpoints use PostgreSQL syntax

---

## 🔐 Security Notes

1. **Never commit .env** - Add to .gitignore
2. **Use strong JWT_SECRET** - At least 32 characters
3. **Use HTTPS in production** - Not just HTTP
4. **Validate inputs** - Server already has basic validation
5. **Use parameterized queries** - Already implemented with $1, $2, etc.
6. **Hash passwords** - Using bcryptjs with salt 12

---

## 📈 Performance Tips

1. **Connection Pooling**: Already configured in `db.js`
2. **Indexes**: Consider adding indexes on frequently queried columns
3. **Query Optimization**: All queries use proper SELECT fields
4. **Pagination**: Can be added to GET endpoints if needed

---

## 🔗 Useful Links

- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Node-PG Docs**: https://node-postgres.com/
- **Express Docs**: https://expressjs.com/

---

**Last Updated**: 2026-06-04  
**Status**: ✅ Ready for Testing
