import { useState, useEffect } from "react";
import Icon from "../../components/common/Icon";
import { apiFetch } from "../../utils/api";

const API_BACKEND = "http://localhost:5000";

const AdminDashboard = ({ setActivePage, user }) => {
  const [stats, setStats] = useState({ total_candidates: 0, total_jobs: 0, total_users: 0, open_jobs: 0 });
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch("/api/stats").then(r => r.json()).catch(() => ({})),
      apiFetch("/api/candidates").then(r => r.json()).catch(() => []),
    ]).then(([s, c]) => {
      setStats(s);
      setCandidates(Array.isArray(c) ? c.slice(0, 5) : []);
      setLoading(false);
    });
  }, []);

  const metricCards = [
    { label: "Total Kandidat",   value: stats.total_candidates ?? 0, icon: "users",     color: "#6366f1", trend: "+12%" },
    { label: "Lowongan Aktif",   value: stats.open_jobs       ?? 0, icon: "briefcase", color: "#10b981", trend: "+3"   },
    { label: "Total Pengguna",   value: stats.total_users     ?? 0, icon: "candidates", color: "#8b5cf6", trend: "+2"   },
    { label: "Total Lowongan",   value: stats.total_jobs      ?? 0, icon: "dashboard",  color: "#06b6d4", trend: "All"  },
  ];

  const quickActions = [
    { label: "Kelola Pengguna",  icon: "candidates", page: "users",     color: "#6366f1" },
    { label: "Lihat Lowongan",   icon: "briefcase",  page: "jobs",      color: "#10b981" },
    { label: "Jadwal Interview", icon: "calendar",   page: "interviews", color: "#f59e0b" },
    { label: "Pengaturan",       icon: "settings",   page: "settings",  color: "#8b5cf6" },
  ];

  const statusLabel = { recommended: "Rekomendasi", interview: "Interview", review: "Review", new: "Baru", hired: "Hired", rejected: "Ditolak" };
  const statusColor = { recommended: "#10b981", interview: "#f59e0b", review: "#6366f1", new: "#06b6d4", hired: "#10b981", rejected: "#ef4444" };

  return (
    <div style={{ minHeight: "100vh", padding: "40px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: 12 }}>
            <Icon name="dashboard" size={13} color="#a5b4fc" /> Admin Panel
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, marginBottom: 6 }}>
            Selamat datang, {user?.name ?? "Admin"}
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            Ringkasan sistem TechHire secara keseluruhan.
          </p>
        </div>

        {/* Metric Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 16, marginBottom: 36 }}>
          {metricCards.map((m, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "24px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={m.icon} size={20} color={m.color} />
                </div>
                <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>{m.trend}</span>
              </div>
              <div style={{ fontSize: 32, fontWeight: 800, color: m.color, marginBottom: 4 }}>
                {loading ? "—" : m.value}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{m.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "start" }}>

          {/* Recent Candidates */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700 }}>Kandidat Terbaru</h2>
              <button onClick={() => setActivePage("candidates-admin")}
                style={{ fontSize: 13, color: "#a5b4fc", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                Lihat semua <Icon name="arrowRight" size={13} color="#a5b4fc" />
              </button>
            </div>
            {loading ? (
              <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "32px 0", fontSize: 14 }}>Memuat...</div>
            ) : candidates.length === 0 ? (
              <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "32px 0", fontSize: 14 }}>
                Belum ada kandidat.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {candidates.map((c, i) => (
                  <div key={c.id} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "14px 0",
                    borderBottom: i < candidates.length - 1 ? "1px solid var(--border-light)" : "none",
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 15, fontWeight: 800, color: "white",
                    }}>
                      {c.name ? c.name[0].toUpperCase() : "?"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{c.position || "—"}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: statusColor[c.status] ?? "var(--text-secondary)" }}>
                        {c.score ?? "—"}%
                      </span>
                      <span style={{
                        padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                        background: `${statusColor[c.status] ?? "#6366f1"}20`,
                        color: statusColor[c.status] ?? "var(--text-secondary)",
                        border: `1px solid ${statusColor[c.status] ?? "#6366f1"}40`,
                      }}>
                        {statusLabel[c.status] ?? c.status ?? "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: 28 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Akses Cepat</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {quickActions.map((a, i) => (
                <button key={i} onClick={() => setActivePage(a.page)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: "var(--bg-glass-light)", border: "1px solid var(--border-light)",
                    borderRadius: "var(--radius-md)", padding: "14px 18px",
                    cursor: "pointer", transition: "var(--transition)", width: "100%", textAlign: "left",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = `${a.color}50`; e.currentTarget.style.background = `${a.color}10`; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.background = "var(--bg-glass-light)"; }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `${a.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={a.icon} size={18} color={a.color} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}>{a.label}</span>
                  <Icon name="arrowRight" size={14} color="var(--text-muted)" style={{ marginLeft: "auto" }} />
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
