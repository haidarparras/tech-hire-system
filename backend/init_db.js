import pool from "./db.js";

async function initDb() {
  try {
    // ── 1. Tabel roles (HARUS dibuat sebelum users karena FK) ──────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        role_name VARCHAR(50) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Seed default roles jika belum ada
    const roleDefaults = ["admin", "user", "hrd"];
    for (const roleName of roleDefaults) {
      await pool.query(
        `INSERT INTO roles (role_name) VALUES ($1) ON CONFLICT (role_name) DO NOTHING`,
        [roleName],
      );
    }

    // ── 2. Tabel users ──────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role_id INT NOT NULL DEFAULT 2,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id)
      )
    `);

    // ── 3. Tabel jobs ───────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        department VARCHAR(255),
        location VARCHAR(255),
        type VARCHAR(100) DEFAULT 'Full-time',
        description TEXT,
        requirements TEXT,
        status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'draft')),
        applicants INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // ── 4. Tabel announcements ──────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS announcements (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success')),
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // ── 5. Tabel activity_logs ──────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL,
        action VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // ── 6. Tabel user_cv ────────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_cv (
        id          SERIAL PRIMARY KEY,
        user_id     INT NOT NULL UNIQUE,
        file_name   VARCHAR(255),
        file_size   INT,
        upload_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // ── 7. Tabel cv_analysis ────────────────────────────────────────────────
    await pool.query(`
      CREATE TABLE IF NOT EXISTS cv_analysis (
        id              SERIAL PRIMARY KEY,
        user_cv_id      INT NOT NULL UNIQUE,
        user_id         INT NOT NULL,
        name            VARCHAR(255),
        position        VARCHAR(255),
        category        VARCHAR(100),
        score           FLOAT,
        skills          JSONB,
        experience      VARCHAR(100),
        education       VARCHAR(255),
        strengths       JSONB,
        gaps            JSONB,
        recommendation  TEXT,
        model_available BOOLEAN DEFAULT FALSE,
        analyzed_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_cv_id) REFERENCES user_cv(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id)    REFERENCES users(id)   ON DELETE CASCADE
      )
    `);

    console.log("[DB] Database initialized: semua tabel siap.");
  } catch (error) {
    console.error("[DB ERROR] Gagal menginisialisasi database:", error);
  }
}

export default initDb;
