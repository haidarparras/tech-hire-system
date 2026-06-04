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
