# 📋 Complete Query Conversion Reference

## Database: Supabase PostgreSQL

## Package: `pg` (node-postgres)

## Status: ✅ All 23+ queries converted

---

## 1. CANDIDATES Endpoints (3 queries)

### 1.1 GET /api/candidates

```javascript
// BEFORE (MySQL)
const [rows] = await pool.query("SELECT * FROM candidates ORDER BY score DESC");

// AFTER (PostgreSQL)
const { rows } = await pool.query(
  "SELECT * FROM candidates ORDER BY score DESC",
);
```

### 1.2 PUT /api/candidates/:id/status

```javascript
// BEFORE (MySQL)
await pool.query("UPDATE candidates SET status = ? WHERE id = ?", [
  status,
  req.params.id,
]);

// AFTER (PostgreSQL)
await pool.query("UPDATE candidates SET status = $1 WHERE id = $2", [
  status,
  req.params.id,
]);
```

### 1.3 DELETE /api/candidates/:id

```javascript
// BEFORE (MySQL)
const [result] = await pool.query("DELETE FROM candidates WHERE id = ?", [req.params.id]);
if (result.affectedRows === 0) {

// AFTER (PostgreSQL)
const result = await pool.query("DELETE FROM candidates WHERE id = $1", [req.params.id]);
if (result.rowCount === 0) {
```

---

## 2. JOBS Endpoints (4 queries)

### 2.1 GET /api/jobs

```javascript
// BEFORE (MySQL)
const [rows] = await pool.query("SELECT * FROM jobs ORDER BY created_at DESC");

// AFTER (PostgreSQL)
const { rows } = await pool.query(
  "SELECT * FROM jobs ORDER BY created_at DESC",
);
```

### 2.2 POST /api/jobs (INSERT with RETURNING)

```javascript
// BEFORE (MySQL)
const [result] = await pool.query(
  "INSERT INTO jobs (title, department, location, type, description, requirements, status) VALUES (?, ?, ?, ?, ?, ?, 'open')",
  [title, department, location, type, description, requirements],
);
res
  .status(201)
  .json({ id: result.insertId, message: "Lowongan berhasil dibuat." });

// AFTER (PostgreSQL)
const result = await pool.query(
  "INSERT INTO jobs (title, department, location, type, description, requirements, status) VALUES ($1, $2, $3, $4, $5, $6, 'open') RETURNING id",
  [title, department, location, type, description, requirements],
);
res
  .status(201)
  .json({ id: result.rows[0].id, message: "Lowongan berhasil dibuat." });
```

### 2.3 PUT /api/jobs/:id (UPDATE conditional)

```javascript
// BEFORE (MySQL) - Status only
await pool.query("UPDATE jobs SET status = ? WHERE id = ?", [
  status,
  req.params.id,
]);

// AFTER (PostgreSQL) - Status only
await pool.query("UPDATE jobs SET status = $1 WHERE id = $2", [
  status,
  req.params.id,
]);

// BEFORE (MySQL) - Full update
await pool.query(
  "UPDATE jobs SET title=?, department=?, location=?, type=?, description=?, requirements=?, status=? WHERE id=?",
  [
    title,
    department,
    location,
    type,
    description,
    requirements,
    status || "open",
    req.params.id,
  ],
);

// AFTER (PostgreSQL) - Full update
await pool.query(
  "UPDATE jobs SET title=$1, department=$2, location=$3, type=$4, description=$5, requirements=$6, status=$7 WHERE id=$8",
  [
    title,
    department,
    location,
    type,
    description,
    requirements,
    status || "open",
    req.params.id,
  ],
);
```

### 2.4 DELETE /api/jobs/:id

```javascript
// BEFORE (MySQL)
const [result] = await pool.query("DELETE FROM jobs WHERE id = ?", [req.params.id]);
if (result.affectedRows === 0) {

// AFTER (PostgreSQL)
const result = await pool.query("DELETE FROM jobs WHERE id = $1", [req.params.id]);
if (result.rowCount === 0) {
```

---

## 3. STATS Endpoints (4 queries)

### 3.1 GET /api/stats

```javascript
// BEFORE (MySQL) - Triple destructuring
const [[[{ total_candidates }]]] = await pool.query(
  "SELECT COUNT(*) AS total_candidates FROM candidates",
);
const [[[{ total_jobs }]]] = await pool.query(
  "SELECT COUNT(*) AS total_jobs FROM jobs",
);
const [[[{ total_users }]]] = await pool.query(
  "SELECT COUNT(*) AS total_users FROM users",
);
const [[[{ open_jobs }]]] = await pool.query(
  "SELECT COUNT(*) AS open_jobs FROM jobs WHERE status = 'open'",
);
res.json({ total_candidates, total_jobs, total_users, open_jobs });

// AFTER (PostgreSQL) - Proper aggregate handling
const countCandidates = await pool.query(
  "SELECT COUNT(*) AS total_candidates FROM candidates",
);
const countJobs = await pool.query("SELECT COUNT(*) AS total_jobs FROM jobs");
const countUsers = await pool.query(
  "SELECT COUNT(*) AS total_users FROM users",
);
const countOpenJobs = await pool.query(
  "SELECT COUNT(*) AS open_jobs FROM jobs WHERE status = 'open'",
);

res.json({
  total_candidates: parseInt(countCandidates.rows[0].total_candidates),
  total_jobs: parseInt(countJobs.rows[0].total_jobs),
  total_users: parseInt(countUsers.rows[0].total_users),
  open_jobs: parseInt(countOpenJobs.rows[0].open_jobs),
});
```

---

## 4. ANNOUNCEMENTS Endpoints (2 queries)

### 4.1 GET /api/announcements

```javascript
// BEFORE (MySQL)
const [rows] = await pool.query(
  "SELECT * FROM announcements ORDER BY created_at DESC",
);

// AFTER (PostgreSQL)
const { rows } = await pool.query(
  "SELECT * FROM announcements ORDER BY created_at DESC",
);
```

### 4.2 POST /api/announcements

```javascript
// BEFORE (MySQL)
await pool.query(
  "INSERT INTO announcements (title, content, type, created_by) VALUES (?, ?, ?, ?)",
  [title, content, type || "info", req.user.id],
);

// AFTER (PostgreSQL)
await pool.query(
  "INSERT INTO announcements (title, content, type, created_by) VALUES ($1, $2, $3, $4)",
  [title, content, type || "info", req.user.id],
);
```

---

## 5. ACTIVITIES Endpoints (2 queries)

### 5.1 GET /api/activities

```javascript
// BEFORE (MySQL)
const [rows] = await pool.query(
  "SELECT * FROM activity_logs WHERE user_id = ? ORDER BY created_at DESC",
  [req.user.id],
);

// AFTER (PostgreSQL)
const { rows } = await pool.query(
  "SELECT * FROM activity_logs WHERE user_id = $1 ORDER BY created_at DESC",
  [req.user.id],
);
```

### 5.2 POST /api/activities

```javascript
// BEFORE (MySQL)
await pool.query(
  "INSERT INTO activity_logs (user_id, action, description) VALUES (?, ?, ?)",
  [req.user.id, action, description],
);

// AFTER (PostgreSQL)
await pool.query(
  "INSERT INTO activity_logs (user_id, action, description) VALUES ($1, $2, $3)",
  [req.user.id, action, description],
);
```

---

## 6. USERS Endpoints (2 queries)

### 6.1 GET /api/users

```javascript
// BEFORE (MySQL)
const [rows] = await pool.query(
  `SELECT users.id, users.name, users.email, roles.role_name AS role, users.created_at
   FROM users
   LEFT JOIN roles ON users.role_id = roles.id
   ORDER BY users.created_at DESC`,
);

// AFTER (PostgreSQL)
const { rows } = await pool.query(
  `SELECT users.id, users.name, users.email, roles.role_name AS role, users.created_at
   FROM users
   LEFT JOIN roles ON users.role_id = roles.id
   ORDER BY users.created_at DESC`,
);
```

### 6.2 DELETE /api/users/:id

```javascript
// BEFORE (MySQL)
const [result] = await pool.query("DELETE FROM users WHERE id = ?", [req.params.id]);
if (result.affectedRows === 0) {

// AFTER (PostgreSQL)
const result = await pool.query("DELETE FROM users WHERE id = $1", [req.params.id]);
if (result.rowCount === 0) {
```

---

## 7. AUTH Endpoints (2 queries)

### 7.1 POST /api/auth/register (SELECT + INSERT)

#### Part 1: Check existing email

```javascript
// BEFORE (MySQL)
const [existingUsers] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
if (existingUsers.length > 0) {

// AFTER (PostgreSQL)
const existingUsersResult = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
if (existingUsersResult.rows.length > 0) {
```

#### Part 2: Get role_id

```javascript
// BEFORE (MySQL)
const [[roleRow]] = await pool.query(
  "SELECT id FROM roles WHERE role_name = ?",
  [userRole],
);
const roleId = roleRow ? roleRow.id : 2;

// AFTER (PostgreSQL)
const roleResult = await pool.query(
  "SELECT id FROM roles WHERE role_name = $1",
  [userRole],
);
const roleId = roleResult.rows.length > 0 ? roleResult.rows[0].id : 2;
```

#### Part 3: Insert user

```javascript
// BEFORE (MySQL)
await pool.query(
  "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
  [name, email, hashedPassword, roleId],
);

// AFTER (PostgreSQL)
await pool.query(
  "INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4)",
  [name, email, hashedPassword, roleId],
);
```

### 7.2 POST /api/auth/login

```javascript
// BEFORE (MySQL)
const [users] = await pool.query(
  `SELECT users.*, roles.role_name AS role
   FROM users
   LEFT JOIN roles ON users.role_id = roles.id
   WHERE users.email = ?`,
  [email],
);

// AFTER (PostgreSQL)
const usersResult = await pool.query(
  `SELECT users.*, roles.role_name AS role
   FROM users
   LEFT JOIN roles ON users.role_id = roles.id
   WHERE users.email = $1`,
  [email],
);
const users = usersResult.rows;
```

---

## 🗄️ Schema Changes (5 tables)

### CREATE TABLE roles

```sql
-- BEFORE (MySQL)
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- AFTER (PostgreSQL)
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

-- Seed data
-- BEFORE: INSERT IGNORE INTO roles (role_name) VALUES (?)
-- AFTER: INSERT INTO roles (role_name) VALUES ($1) ON CONFLICT (role_name) DO NOTHING
```

### CREATE TABLE users

```sql
-- BEFORE (MySQL)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ...
)

-- AFTER (PostgreSQL)
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  ...
)
```

### CREATE TABLE jobs

```sql
-- BEFORE (MySQL)
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ...
  status ENUM('open','closed','draft') DEFAULT 'open',
  ...
)

-- AFTER (PostgreSQL)
CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  ...
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'draft')),
  ...
)
```

### CREATE TABLE announcements

```sql
-- BEFORE (MySQL)
CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ...
  type ENUM('info', 'warning', 'success') DEFAULT 'info',
  ...
)

-- AFTER (PostgreSQL)
CREATE TABLE IF NOT EXISTS announcements (
  id SERIAL PRIMARY KEY,
  ...
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success')),
  ...
)
```

### CREATE TABLE activity_logs

```sql
-- BEFORE (MySQL)
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ...
)

-- AFTER (PostgreSQL)
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  ...
)
```

---

## 📊 Conversion Statistics

| Category          | Count  | Status |
| ----------------- | ------ | ------ |
| SELECT Queries    | 8      | ✅     |
| INSERT Queries    | 5      | ✅     |
| UPDATE Queries    | 3      | ✅     |
| DELETE Queries    | 4      | ✅     |
| Aggregate Queries | 3      | ✅     |
| **Total Queries** | **23** | ✅     |
| Tables Converted  | 5      | ✅     |
| **Total Schema**  | **5**  | ✅     |

---

## 🔑 Key Conversions

| MySQL                 | PostgreSQL                    | Type            |
| --------------------- | ----------------------------- | --------------- |
| `?`                   | `$1, $2, $3...`               | Placeholder     |
| `const [rows]`        | `const { rows }`              | Result          |
| `result.insertId`     | `RETURNING id` + `rows[0].id` | Insert ID       |
| `result.affectedRows` | `result.rowCount`             | Affected Rows   |
| `INT AUTO_INCREMENT`  | `SERIAL`                      | Auto ID         |
| `ENUM(...)`           | `VARCHAR + CHECK`             | Enum Type       |
| `INSERT IGNORE`       | `ON CONFLICT DO NOTHING`      | Insert Conflict |

---

**Last Updated**: 2026-06-04  
**Conversion Status**: ✅ COMPLETE
