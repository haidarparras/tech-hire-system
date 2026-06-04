import { useState, useEffect } from "react";
import Icon from "../../components/common/Icon";
import { apiFetch } from "../../utils/api";

const statusColors = {
  recommended: { bg: "rgba(16,185,129,0.15)", color: "#6ee7b7", border: "rgba(16,185,129,0.3)", label: "Rekomendasi" },
  interview:   { bg: "rgba(245,158,11,0.15)", color: "#fcd34d", border: "rgba(245,158,11,0.3)", label: "Interview"   },
  review:      { bg: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "rgba(99,102,241,0.3)", label: "Review"      },
  new:         { bg: "rgba(6,182,212,0.15)",  color: "#67e8f9", border: "rgba(6,182,212,0.3)",  label: "Baru"        },
  hired:       { bg: "rgba(16,185,129,0.15)", color: "#6ee7b7", border: "rgba(16,185,129,0.3)", label: "Diterima"    },
  rejected:    { bg: "rgba(239,68,68,0.15)",  color: "#fca5a5", border: "rgba(239,68,68,0.3)",  label: "Ditolak"     },
};

const HRDDashboard = ({ setActivePage, user }) => {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [deletingAll, setDeletingAll] = useState(false);

  const formatSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills.map(s => typeof s === "object" ? (s.name || "") : s).filter(Boolean);
    if (typeof skills === "string") {
      try {
        const parsed = JSON.parse(skills);
        if (Array.isArray(parsed)) return parsed.map(s => typeof s === "object" ? (s.name || "") : s).filter(Boolean);
      } catch {}
      return skills.split(",").filter(Boolean);
    }
    return [];
  };

  const loadData = () => {
    setLoading(true);
    Promise.all([
      apiFetch("/api/candidates").then(r => r.json()).catch(() => []),
      apiFetch("/api/jobs").then(r => r.json()).catch(() => []),
    ]).then(([c, j]) => {
      setCandidates(Array.isArray(c) ? c : []);
      setJobs(Array.isArray(j) ? j : []);
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, []);

  const filtered = candidates.filter(c => {
    const matchFilter = filter === "all" || c.status === filter;
    const matchSearch = !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.position?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const metrics = [
    { label: "Total Kandidat",  value: candidates.length,                                   color: "#6366f1", icon: "users"      },
    { label: "Rekomendasi AI",  value: candidates.filter(c=>c.status==="recommended").length, color: "#10b981", icon: "checkCircle" },
    { label: "Interview",       value: candidates.filter(c=>c.status==="interview").length,   color: "#f59e0b", icon: "chat"        },
    { label: "Lowongan Aktif",  value: jobs.filter(j=>j.status==="open").length,              color: "#8b5cf6", icon: "briefcase"   },
  ];

  const handleStatus = async (id, status) => {
    try {
      await apiFetch(`/api/candidates/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      if (selectedCandidate?.id === id) setSelectedCandidate(prev => ({ ...prev, status }));
    } catch {}
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("⚠️ Hapus SEMUA data kandidat? Tindakan ini tidak bisa dibatalkan!")) return;
    setDeletingAll(true);
    await apiFetch("/api/candidates", { method: "DELETE" });
    setCandidates([]);
    setDeletingAll(false);
  };

  const handleDeleteOne = async (id) => {
    if (!window.confirm("Hapus kandidat ini?")) return;
    await apiFetch(`/api/candidates/${id}`, { method: "DELETE" });
    setCandidates(prev => prev.filter(c => c.id !== id));
    setSelectedCandidate(null);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: 12 }}>
            <Icon name="candidates" size={13} color="#a5b4fc" /> HRD Panel
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px,3vw,38px)", fontWeight: 800, marginBottom: 6 }}>
            Pipeline Rekrutmen
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            Selamat datang, {user?.name ?? "HRD"}. Kelola kandidat dan lowongan Anda.
          </p>
        </div>

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 16, marginBottom: 36 }}>
          {metrics.map((m, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "20px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={m.icon} size={18} color={m.color} />
                </div>
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: m.color, marginBottom: 4 }}>
                {loading ? "—" : m.value}
              </div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Search + Filters + Actions */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          {/* Search */}
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
            <Icon name="search" size={15} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau posisi..."
              style={{ width: "100%", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 999, padding: "8px 14px 8px 36px", color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-sans)", outline: "none" }}
            />
          </div>

          {/* Filter pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { key: "all", label: "Semua", icon: "users" },
              { key: "new", label: "Baru", icon: "upload" },
              { key: "recommended", label: "Rekomendasi", icon: "checkCircle" },
              { key: "interview",   label: "Interview",   icon: "chat"        },
              { key: "review",      label: "Review",      icon: "search"      },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                style={{
                  background: filter === f.key ? "rgba(99,102,241,0.15)" : "transparent",
                  color: filter === f.key ? "#a5b4fc" : "var(--text-secondary)",
                  border: `1px solid ${filter === f.key ? "rgba(99,102,241,0.3)" : "var(--border-light)"}`,
                  padding: "7px 14px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                  cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
                  fontFamily: "var(--font-sans)", transition: "var(--transition)",
                }}>
                <Icon name={f.icon} size={12} color={filter === f.key ? "#a5b4fc" : "var(--text-secondary)"} />
                {f.label}
              </button>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setActivePage("jobs")}
              style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)", padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
              <Icon name="briefcase" size={13} color="#a5b4fc" /> Kelola Lowongan
            </button>
            <button onClick={handleDeleteAll} disabled={deletingAll}
              style={{ background: "rgba(244,63,94,0.1)", color: "#fda4af", border: "1px solid rgba(244,63,94,0.3)", padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", opacity: deletingAll ? 0.6 : 1 }}>
              <Icon name="close" size={13} color="#fda4af" /> {deletingAll ? "Menghapus..." : "Hapus Semua"}
            </button>
          </div>
        </div>

        {/* Result count */}
        {!loading && (
          <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 16 }}>
            Menampilkan <strong style={{ color: "var(--text-secondary)" }}>{filtered.length}</strong> dari {candidates.length} kandidat
          </div>
        )}

        {/* Candidate Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-light)" }}>
            <Icon name="users" size={40} color="var(--text-muted)" />
            <h3 style={{ marginTop: 14, fontSize: 17, fontWeight: 600 }}>Belum ada kandidat</h3>
            <p style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)" }}>Upload CV kandidat melalui halaman Upload CV.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
            {filtered.map(c => {
              const st = statusColors[c.status] ?? statusColors.new;
              return (
                <div key={c.id} onClick={() => setSelectedCandidate(c)}
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: 24, cursor: "pointer", transition: "var(--transition)" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.boxShadow = "var(--shadow-hover)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "white", flexShrink: 0 }}>
                      {c.name ? c.name[0].toUpperCase() : "?"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{c.name}</div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{c.position ?? "—"}</div>
                    </div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: c.score >= 90 ? "#10b981" : c.score >= 80 ? "#6366f1" : "#f59e0b" }}>{c.score ?? "—"}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                    {formatSkills(c.skills).slice(0, 4).map(s => (
                      <span key={s} className="badge badge-primary" style={{ fontSize: 11 }}>{s.trim()}</span>
                    ))}
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCandidate && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(5,8,20,0.85)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => setSelectedCandidate(null)}>
          <div onClick={e => e.stopPropagation()} className="animate-fade-in"
            style={{ width: "100%", maxWidth: 560, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: 36, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "white" }}>
                  {selectedCandidate.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{selectedCandidate.name}</h2>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{selectedCandidate.position ?? "—"}</div>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 8, borderRadius: 8, display: "flex" }}>
                <Icon name="close" size={18} color="var(--text-secondary)" />
              </button>
            </div>

            <div style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(16,185,129,0.1))", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "var(--radius-md)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>AI Match Score</div>
                <div style={{ fontSize: 44, fontWeight: 900, background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{selectedCandidate.score ?? "—"}%</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Pendidikan</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedCandidate.education ?? "—"}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8, marginBottom: 4 }}>Pengalaman</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedCandidate.exp ?? "—"}</div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {formatSkills(selectedCandidate.skills).map(s => (
                  <span key={s} className="badge badge-primary" style={{ fontSize: 12 }}>{s.trim()}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>Ubah Status</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { key: "recommended", label: "Rekomendasikan", color: "#10b981" },
                  { key: "interview",   label: "Interview",       color: "#f59e0b" },
                  { key: "hired",       label: "Diterima",        color: "#06b6d4" },
                  { key: "rejected",    label: "Tolak",           color: "#ef4444" },
                ].map(s => (
                  <button key={s.key} onClick={() => handleStatus(selectedCandidate.id, s.key)}
                    style={{ flex: "1 1 auto", padding: "10px 8px", borderRadius: "var(--radius-md)", border: `1px solid ${s.color}40`, background: selectedCandidate.status === s.key ? `${s.color}20` : "transparent", color: s.color, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                <Icon name="calendar" size={15} color="white" /> Jadwalkan Interview
              </button>
              <button onClick={() => handleDeleteOne(selectedCandidate.id)}
                style={{ padding: "10px 18px", borderRadius: "var(--radius-md)", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", color: "#fda4af", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
                <Icon name="close" size={14} color="#fda4af" /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRDDashboard;
