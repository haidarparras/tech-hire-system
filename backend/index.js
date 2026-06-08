import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "./db.js";
import initDb from "./init_db.js";

const app = express();

// ── CORS: Batasi hanya ke origin yang diizinkan ─────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "https://tech-hire-frontend-pi.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan request tanpa origin (misal: Postman, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin '${origin}' tidak diizinkan.`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

// ── JWT Secret ──────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error(
    "[FATAL] JWT_SECRET tidak ditemukan di .env! Server tidak aman.",
  );
  process.exit(1); // Hentikan server jika secret tidak ada
}

// ── Middleware: Verifikasi JWT ──────────────────────────────────────────────
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer <token>"

  if (!token) {
    return res
      .status(401)
      .json({ error: "Akses ditolak: Token tidak ditemukan." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res
      .status(403)
      .json({
        error: "Akses ditolak: Token tidak valid atau sudah kedaluwarsa.",
      });
  }
};

// ── Middleware: Cek Role ────────────────────────────────────────────────────
const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({
          error: `Akses ditolak: Role '${req.user?.role}' tidak diizinkan.`,
        });
    }
    next();
  };

// ═══════════════════════════════════════════════════════════════════════════
// ── CANDIDATES (Protected) ──────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// GET semua kandidat — hanya HRD & Admin
app.get(
  "/api/candidates",
  verifyToken,
  requireRole("hrd", "admin"),
  async (req, res) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM candidates ORDER BY score DESC",
      );
      res.json(rows);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// Update status kandidat — hanya HRD & Admin
app.put(
  "/api/candidates/:id/status",
  verifyToken,
  requireRole("hrd", "admin"),
  async (req, res) => {
    try {
      const { status } = req.body;
      const allowedStatuses = ["new", "reviewed", "hired", "rejected"];
      if (!allowedStatuses.includes(status)) {
        return res
          .status(400)
          .json({
            error: `Status tidak valid. Pilih dari: ${allowedStatuses.join(", ")}`,
          });
      }
      await pool.query("UPDATE candidates SET status = $1 WHERE id = $2", [
        status,
        req.params.id,
      ]);
      res.json({ message: "Status updated" });
    } catch (error) {
      console.error("Error updating candidate status:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// Hapus SEMUA kandidat — hanya Admin
app.delete(
  "/api/candidates",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      await pool.query("TRUNCATE TABLE candidates");
      res.json({ message: "Seluruh data kandidat berhasil dihapus!" });
    } catch (error) {
      console.error("Error deleting candidates:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// Hapus satu kandidat — hanya Admin & HRD
app.delete(
  "/api/candidates/:id",
  verifyToken,
  requireRole("hrd", "admin"),
  async (req, res) => {
    try {
      const result = await pool.query("DELETE FROM candidates WHERE id = $1", [
        req.params.id,
      ]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Kandidat tidak ditemukan." });
      }
      res.json({ message: `Kandidat ID ${req.params.id} berhasil dihapus.` });
    } catch (error) {
      console.error("Error deleting candidate:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════════
// ── JOBS (Protected) ────────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// GET semua lowongan — semua role yang login
app.get("/api/jobs", verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM jobs ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Buat lowongan baru — HRD & Admin
app.post(
  "/api/jobs",
  verifyToken,
  requireRole("hrd", "admin"),
  async (req, res) => {
    try {
      const { title, department, location, type, description, requirements } =
        req.body;
      if (!title) {
        return res
          .status(400)
          .json({ error: "Judul lowongan (title) wajib diisi." });
      }
      const result = await pool.query(
        "INSERT INTO jobs (title, department, location, type, description, requirements, status) VALUES ($1, $2, $3, $4, $5, $6, 'open') RETURNING id",
        [title, department, location, type, description, requirements],
      );
      res
        .status(201)
        .json({ id: result.rows[0].id, message: "Lowongan berhasil dibuat." });
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// Update status lowongan — HRD & Admin
app.put(
  "/api/jobs/:id",
  verifyToken,
  requireRole("hrd", "admin"),
  async (req, res) => {
    try {
      const {
        status,
        title,
        department,
        location,
        type,
        description,
        requirements,
      } = req.body;
      // Jika hanya update status
      if (status && !title) {
        const allowedStatuses = ["open", "closed", "draft"];
        if (!allowedStatuses.includes(status)) {
          return res.status(400).json({ error: "Status tidak valid." });
        }
        await pool.query("UPDATE jobs SET status = $1 WHERE id = $2", [
          status,
          req.params.id,
        ]);
      } else {
        // Update seluruh field
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
      }
      res.json({ message: "Lowongan berhasil diperbarui." });
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// Hapus lowongan — Admin saja
app.delete(
  "/api/jobs/:id",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      const result = await pool.query("DELETE FROM jobs WHERE id = $1", [
        req.params.id,
      ]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Lowongan tidak ditemukan." });
      }
      res.json({ message: "Lowongan berhasil dihapus." });
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════════
// ── STATS (Protected) ───────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

app.get(
  "/api/stats",
  verifyToken,
  requireRole("hrd", "admin"),
  async (req, res) => {
    try {
      const countCandidates = await pool.query(
        "SELECT COUNT(*) AS total_candidates FROM candidates",
      );
      const countJobs = await pool.query(
        "SELECT COUNT(*) AS total_jobs FROM jobs",
      );
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
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════════
// ── ANNOUNCEMENTS (Protected) ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

app.get("/api/announcements", verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM announcements ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post(
  "/api/announcements",
  verifyToken,
  requireRole("hrd", "admin"),
  async (req, res) => {
    try {
      const { title, content, type } = req.body;
      if (!title || !content) {
        return res
          .status(400)
          .json({ error: "Title dan content wajib diisi." });
      }
      await pool.query(
        "INSERT INTO announcements (title, content, type, created_by) VALUES ($1, $2, $3, $4)",
        [title, content, type || "info", req.user.id],
      );
      res.status(201).json({ message: "Pengumuman berhasil dibuat." });
    } catch (error) {
      console.error("Error creating announcement:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════════
// ── ACTIVITY LOGS (Protected) ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

app.get("/api/activities", verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM activity_logs WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id],
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/activities", verifyToken, async (req, res) => {
  try {
    const { action, description } = req.body;
    if (!action) {
      return res.status(400).json({ error: "Action wajib diisi." });
    }
    await pool.query(
      "INSERT INTO activity_logs (user_id, action, description) VALUES ($1, $2, $3)",
      [req.user.id, action, description],
    );
    res.status(201).json({ message: "Log aktivitas berhasil disimpan." });
  } catch (error) {
    console.error("Error creating activity log:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ── USERS (Admin only) ──────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

app.get("/api/users", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT users.id, users.name, users.email, roles.role_name AS role, users.created_at
       FROM users
       LEFT JOIN roles ON users.role_id = roles.id
       ORDER BY users.created_at DESC`,
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete(
  "/api/users/:id",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    try {
      // Cegah admin menghapus dirinya sendiri
      if (parseInt(req.params.id) === req.user.id) {
        return res
          .status(400)
          .json({ error: "Tidak bisa menghapus akun sendiri." });
      }
      const result = await pool.query("DELETE FROM users WHERE id = $1", [
        req.params.id,
      ]);
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "User tidak ditemukan." });
      }
      res.json({ message: "User berhasil dihapus." });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
);

// ═══════════════════════════════════════════════════════════════════════════
// ── AUTHENTICATION (Public) ─────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, dan password wajib diisi." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password minimal 6 karakter." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Format email tidak valid." });
    }

    // Cek duplikasi email
    const existingUsersResult = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email],
    );
    if (existingUsersResult.rows.length > 0) {
      return res.status(400).json({ error: "Email sudah terdaftar." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Ambil role_id dari DB (aman dari hardcode)
    const validRoles = ["user", "hrd"]; // Admin tidak bisa daftar sendiri
    const userRole = validRoles.includes(role) ? role : "user";
    const roleResult = await pool.query(
      "SELECT id FROM roles WHERE role_name = $1",
      [userRole],
    );
    const roleId = roleResult.rows.length > 0 ? roleResult.rows[0].id : 2;

    await pool.query(
      "INSERT INTO users (name, email, password, role_id) VALUES ($1, $2, $3, $4)",
      [name, email, hashedPassword, roleId],
    );

    res.status(201).json({ message: "Registrasi berhasil! Silakan login." });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email dan password wajib diisi." });
    }

    // Join dengan roles untuk mendapatkan role_name
    const usersResult = await pool.query(
      `SELECT users.*, roles.role_name AS role
       FROM users
       LEFT JOIN roles ON users.role_id = roles.id
       WHERE users.email = $1`,
      [email],
    );
    const users = usersResult.rows;

    if (users.length === 0) {
      return res.status(401).json({ error: "Email atau password salah." });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email atau password salah." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.json({
      message: "Login berhasil.",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ── CV MANAGEMENT (Protected) ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════

// GET CV aktif + analisis AI milik user yang sedang login
app.get("/api/cv/me", verifyToken, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         uc.id          AS cv_id,
         uc.user_id,
         uc.file_name,
         uc.file_size,
         uc.upload_at,
         uc.updated_at,
         ca.id          AS analysis_id,
         ca.name,
         ca.position,
         ca.category,
         ca.score,
         ca.skills,
         ca.experience,
         ca.education,
         ca.strengths,
         ca.gaps,
         ca.recommendation,
         ca.model_available,
         ca.analyzed_at
       FROM user_cv uc
       LEFT JOIN cv_analysis ca ON ca.user_cv_id = uc.id
       WHERE uc.user_id = $1`,
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.json({ cv: null, analysis: null });
    }

    const row = rows[0];
    res.json({
      cv: {
        id:        row.cv_id,
        user_id:   row.user_id,
        file_name: row.file_name,
        file_size: row.file_size,
        upload_at: row.upload_at,
        updated_at: row.updated_at,
      },
      analysis: row.analysis_id
        ? {
            id:              row.analysis_id,
            name:            row.name,
            position:        row.position,
            category:        row.category,
            score:           row.score,
            skills:          row.skills,
            experience:      row.experience,
            education:       row.education,
            strengths:       row.strengths,
            gaps:            row.gaps,
            recommendation:  row.recommendation,
            model_available: row.model_available,
            analyzed_at:     row.analyzed_at,
          }
        : null,
    });
  } catch (error) {
    console.error("Error fetching CV:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST simpan / update hasil analisis AI — UPSERT (Satu User = Satu CV Aktif)
app.post("/api/cv/analysis", verifyToken, async (req, res) => {
  try {
    const {
      file_name,
      file_size,
      name,
      position,
      category,
      score,
      skills,
      experience,
      education,
      strengths,
      gaps,
      recommendation,
      model_available,
    } = req.body;

    if (!name || score === undefined) {
      return res.status(400).json({ error: "Field 'name' dan 'score' wajib diisi." });
    }

    const userId = req.user.id;

    // ── UPSERT user_cv: satu row per user ────────────────────────────────────
    const cvResult = await pool.query(
      `INSERT INTO user_cv (user_id, file_name, file_size, upload_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (user_id) DO UPDATE
         SET file_name  = EXCLUDED.file_name,
             file_size  = EXCLUDED.file_size,
             updated_at = NOW()
       RETURNING id`,
      [userId, file_name || null, file_size || null]
    );

    const userCvId = cvResult.rows[0].id;

    // ── UPSERT cv_analysis: satu row per CV ──────────────────────────────────
    await pool.query(
      `INSERT INTO cv_analysis
         (user_cv_id, user_id, name, position, category, score, skills,
          experience, education, strengths, gaps, recommendation, model_available, analyzed_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,NOW())
       ON CONFLICT (user_cv_id) DO UPDATE
         SET name            = EXCLUDED.name,
             position        = EXCLUDED.position,
             category        = EXCLUDED.category,
             score           = EXCLUDED.score,
             skills          = EXCLUDED.skills,
             experience      = EXCLUDED.experience,
             education       = EXCLUDED.education,
             strengths       = EXCLUDED.strengths,
             gaps            = EXCLUDED.gaps,
             recommendation  = EXCLUDED.recommendation,
             model_available = EXCLUDED.model_available,
             analyzed_at     = NOW()`,
      [
        userCvId,
        userId,
        name,
        position || null,
        category || null,
        score,
        JSON.stringify(skills || []),
        experience || null,
        education || null,
        JSON.stringify(strengths || []),
        JSON.stringify(gaps || []),
        recommendation || null,
        model_available ?? false,
      ]
    );

    // ── Catat aktivitas ───────────────────────────────────────────────────────
    await pool.query(
      "INSERT INTO activity_logs (user_id, action, description) VALUES ($1, $2, $3)",
      [userId, "cv_uploaded", `CV '${file_name || "dokumen"}' diupload dan dianalisis AI`]
    ).catch(() => {}); // non-fatal

    res.status(200).json({ message: "CV dan hasil analisis berhasil disimpan.", cv_id: userCvId });
  } catch (error) {
    console.error("Error saving CV analysis:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET semua kandidat (satu CV aktif per user) — HRD & Admin
app.get(
  "/api/cv/candidates",
  verifyToken,
  requireRole("hrd", "admin"),
  async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT
           u.id           AS user_id,
           u.name         AS user_name,
           u.email,
           u.created_at   AS registered_at,
           uc.id          AS cv_id,
           uc.file_name,
           uc.file_size,
           uc.updated_at  AS cv_updated_at,
           ca.id          AS analysis_id,
           ca.name        AS candidate_name,
           ca.position,
           ca.category,
           ca.score,
           ca.skills,
           ca.experience,
           ca.education,
           ca.strengths,
           ca.gaps,
           ca.recommendation,
           ca.model_available,
           ca.analyzed_at
         FROM users u
         LEFT JOIN user_cv   uc ON uc.user_id    = u.id
         LEFT JOIN cv_analysis ca ON ca.user_cv_id = uc.id
         LEFT JOIN roles r ON r.id = u.role_id
         WHERE r.role_name = 'user'
         ORDER BY ca.score DESC NULLS LAST, u.created_at DESC`
      );

      const candidates = rows.map((row) => ({
        user_id:        row.user_id,
        user_name:      row.user_name,
        email:          row.email,
        registered_at:  row.registered_at,
        has_cv:         !!row.cv_id,
        cv: row.cv_id
          ? {
              id:         row.cv_id,
              file_name:  row.file_name,
              file_size:  row.file_size,
              updated_at: row.cv_updated_at,
            }
          : null,
        analysis: row.analysis_id
          ? {
              id:              row.analysis_id,
              name:            row.candidate_name,
              position:        row.position,
              category:        row.category,
              score:           row.score,
              skills:          row.skills,
              experience:      row.experience,
              education:       row.education,
              strengths:       row.strengths,
              gaps:            row.gaps,
              recommendation:  row.recommendation,
              model_available: row.model_available,
              analyzed_at:     row.analyzed_at,
            }
          : null,
      }));

      res.json(candidates);
    } catch (error) {
      console.error("Error fetching CV candidates:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// GET detail satu kandidat — HRD & Admin
app.get(
  "/api/cv/candidate/:userId",
  verifyToken,
  requireRole("hrd", "admin"),
  async (req, res) => {
    try {
      const { rows } = await pool.query(
        `SELECT
           u.id           AS user_id,
           u.name         AS user_name,
           u.email,
           u.created_at   AS registered_at,
           uc.id          AS cv_id,
           uc.file_name,
           uc.file_size,
           uc.updated_at  AS cv_updated_at,
           ca.id          AS analysis_id,
           ca.name        AS candidate_name,
           ca.position,
           ca.category,
           ca.score,
           ca.skills,
           ca.experience,
           ca.education,
           ca.strengths,
           ca.gaps,
           ca.recommendation,
           ca.model_available,
           ca.analyzed_at
         FROM users u
         LEFT JOIN user_cv    uc ON uc.user_id    = u.id
         LEFT JOIN cv_analysis ca ON ca.user_cv_id = uc.id
         WHERE u.id = $1`,
        [req.params.userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "User tidak ditemukan." });
      }

      const row = rows[0];
      res.json({
        user_id:       row.user_id,
        user_name:     row.user_name,
        email:         row.email,
        registered_at: row.registered_at,
        has_cv:        !!row.cv_id,
        cv: row.cv_id
          ? { id: row.cv_id, file_name: row.file_name, file_size: row.file_size, updated_at: row.cv_updated_at }
          : null,
        analysis: row.analysis_id
          ? {
              id:              row.analysis_id,
              name:            row.candidate_name,
              position:        row.position,
              category:        row.category,
              score:           row.score,
              skills:          row.skills,
              experience:      row.experience,
              education:       row.education,
              strengths:       row.strengths,
              gaps:            row.gaps,
              recommendation:  row.recommendation,
              model_available: row.model_available,
              analyzed_at:     row.analyzed_at,
            }
          : null,
      });
    } catch (error) {
      console.error("Error fetching candidate detail:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// ── Health Check (Public) ───────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Tech Hire Backend",
    message: "Server utama berhasil berjalan di Vercel!",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Tech Hire Backend",
    port: process.env.PORT || 5000,
  });
});

// ── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res
    .status(404)
    .json({ error: `Route '${req.method} ${req.path}' tidak ditemukan.` });
});

// ── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[ERROR]", err.message);
  if (err.message?.startsWith("CORS:")) {
    return res.status(403).json({ error: err.message });
  }
  res.status(500).json({ error: "Internal Server Error" });
});

// ── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  await initDb();
  console.log(`[SERVER] Tech Hire Backend running on http://localhost:${PORT}`);
});
