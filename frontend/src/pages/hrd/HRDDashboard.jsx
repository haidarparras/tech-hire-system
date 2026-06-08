import { useState, useEffect } from "react";
import Icon from "../../components/common/Icon";
import { apiFetch } from "../../utils/api";

const statusColors = {
  recommended: { bg: "rgba(16,185,129,0.15)",  color: "#6ee7b7", border: "rgba(16,185,129,0.3)",  label: "Rekomendasi" },
  interview:   { bg: "rgba(245,158,11,0.15)",  color: "#fcd34d", border: "rgba(245,158,11,0.3)",  label: "Interview"   },
  review:      { bg: "rgba(99,102,241,0.15)",  color: "#a5b4fc", border: "rgba(99,102,241,0.3)",  label: "Review"      },
  new:         { bg: "rgba(6,182,212,0.15)",   color: "#67e8f9", border: "rgba(6,182,212,0.3)",   label: "Baru"        },
  hired:       { bg: "rgba(16,185,129,0.15)",  color: "#6ee7b7", border: "rgba(16,185,129,0.3)",  label: "Diterima"    },
  rejected:    { bg: "rgba(239,68,68,0.15)",   color: "#fca5a5", border: "rgba(239,68,68,0.3)",   label: "Ditolak"     },
  no_cv:       { bg: "rgba(107,114,128,0.12)", color: "#9ca3af", border: "rgba(107,114,128,0.25)", label: "Belum CV"   },
};

const HRDDashboard = ({ setActivePage, user }) => {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [selected, setSelected]     = useState(null);
  const [filter, setFilter]         = useState("all");
  const [search, setSearch]         = useState("");
  const [statusMap, setStatusMap]   = useState({}); // { userId: status }

  // ── Helpers ────────────────────────────────────────────────────────────────
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

  const formatDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  const getStatus = (c) => statusMap[c.user_id] || (c.has_cv ? "new" : "no_cv");

  // ── Load data ─────────────────────────────────────────────────────────────
  const loadData = () => {
    setLoading(true);
    Promise.all([
      apiFetch("/api/cv/candidates").then(r => r.json()).catch(() => []),
      apiFetch("/api/jobs").then(r => r.json()).catch(() => []),
    ]).then(([c, j]) => {
      setCandidates(Array.isArray(c) ? c : []);
      setJobs(Array.isArray(j) ? j : []);
      setLoading(false);
    });
  };

  useEffect(() => { loadData(); }, []);

  // ── Filter ────────────────────────────────────────────────────────────────
  const filtered = candidates.filter(c => {
    const st         = getStatus(c);
    const matchFilter =
      filter === "all"   ||
      (filter === "no_cv" && !c.has_cv) ||
      (filter !== "no_cv" && st === filter);
    const name         = c.analysis?.name || c.user_name || "";
    const position     = c.analysis?.position || "";
    const matchSearch  = !search ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      position.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // ── Metrics ───────────────────────────────────────────────────────────────
  const metrics = [
    { label: "Total Kandidat",   value: candidates.length,                                         color: "#6366f1", icon: "users"       },
    { label: "Sudah Upload CV",  value: candidates.filter(c => c.has_cv).length,                   color: "#10b981", icon: "checkCircle"  },
    { label: "Rekomendasikan",   value: Object.values(statusMap).filter(s => s === "recommended").length, color: "#f59e0b", icon: "award" },
    { label: "Lowongan Aktif",   value: jobs.filter(j => j.status === "open").length,              color: "#8b5cf6", icon: "briefcase"   },
  ];

  // ── Status update (local state) ───────────────────────────────────────────
  const handleStatus = (userId, status) => {
    setStatusMap(prev => ({ ...prev, [userId]: status }));
    if (selected?.user_id === userId) setSelected(prev => ({ ...prev, _status: status }));
  };

  // ─────────────────────────────────────────────────────────────────────────
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
            Selamat datang, {user?.name ?? "HRD"}. Satu CV aktif per kandidat.
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

        {/* Search + Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
            <Icon name="search" size={15} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama, posisi, atau email..."
              style={{ width: "100%", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: 999, padding: "8px 14px 8px 36px", color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-sans)", outline: "none" }} />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { key: "all",           label: "Semua",        icon: "users"       },
              { key: "new",           label: "Baru",         icon: "upload"      },
              { key: "recommended",   label: "Rekomendasi",  icon: "checkCircle" },
              { key: "interview",     label: "Interview",    icon: "chat"        },
              { key: "hired",         label: "Diterima",     icon: "award"       },
              { key: "no_cv",         label: "Belum CV",     icon: "warning"     },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                style={{
                  background: filter === f.key ? "rgba(99,102,241,0.15)" : "transparent",
                  color:      filter === f.key ? "#a5b4fc" : "var(--text-secondary)",
                  border:     `1px solid ${filter === f.key ? "rgba(99,102,241,0.3)" : "var(--border-light)"}`,
                  padding: "7px 14px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                  cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
                  fontFamily: "var(--font-sans)", transition: "var(--transition)",
                }}>
                <Icon name={f.icon} size={12} color={filter === f.key ? "#a5b4fc" : "var(--text-secondary)"} />
                {f.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button onClick={() => setActivePage("jobs")}
              style={{ background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)", padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
              <Icon name="briefcase" size={13} color="#a5b4fc" /> Kelola Lowongan
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
            <p style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)" }}>
              {filter === "no_cv" ? "Semua kandidat sudah memiliki CV." : "Belum ada kandidat yang cocok dengan filter ini."}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
            {filtered.map(c => {
              const st       = statusColors[getStatus(c)] ?? statusColors.new;
              const a        = c.analysis;
              const dispName = a?.name || c.user_name || "—";
              const score    = a?.score;
              return (
                <div key={c.user_id} onClick={() => setSelected(c)}
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: 24, cursor: "pointer", transition: "var(--transition)", position: "relative" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)"; e.currentTarget.style.boxShadow = "var(--shadow-hover)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.boxShadow = "none"; }}>

                  {/* Badge CV status */}
                  {!c.has_cv && (
                    <div style={{ position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 700, color: "#9ca3af", background: "rgba(107,114,128,0.1)", border: "1px solid rgba(107,114,128,0.2)", borderRadius: 999, padding: "2px 8px" }}>
                      Belum Upload CV
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "white", flexShrink: 0 }}>
                      {dispName[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{dispName}</div>
                      <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{a?.position ?? "Belum dianalisis"}</div>
                      <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{c.email}</div>
                    </div>
                    {score !== undefined && score !== null && (
                      <div style={{ fontSize: 22, fontWeight: 800, color: score >= 90 ? "#10b981" : score >= 80 ? "#6366f1" : "#f59e0b" }}>{score.toFixed ? score.toFixed(1) : score}</div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
                    {formatSkills(a?.skills).slice(0, 4).map(s => (
                      <span key={s} className="badge badge-primary" style={{ fontSize: 11 }}>{s.trim()}</span>
                    ))}
                    {!a && <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Belum ada analisis AI</span>}
                  </div>

                  {c.cv && (
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 10 }}>
                      📄 {c.cv.file_name || "CV"} · Diperbarui {formatDate(c.cv.updated_at)}
                    </div>
                  )}

                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                    {st.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selected && (() => {
        const a        = selected.analysis;
        const st       = statusColors[getStatus(selected)] ?? statusColors.new;
        const dispName = a?.name || selected.user_name || "—";
        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(5,8,20,0.85)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={() => setSelected(null)}>
            <div onClick={e => e.stopPropagation()} className="animate-fade-in"
              style={{ width: "100%", maxWidth: 600, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: 36, maxHeight: "92vh", overflowY: "auto" }}>

              {/* Modal Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "white" }}>
                    {dispName[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 2 }}>{dispName}</h2>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{a?.position ?? "Belum dianalisis"}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{selected.email}</div>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 8, borderRadius: 8, display: "flex" }}>
                  <Icon name="close" size={18} color="var(--text-secondary)" />
                </button>
              </div>

              {/* Score Card */}
              {a ? (
                <div style={{ background: "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(16,185,129,0.1))", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "var(--radius-md)", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>AI Match Score</div>
                    <div style={{ fontSize: 44, fontWeight: 900, background: "var(--gradient-primary)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      {typeof a.score === "number" ? a.score.toFixed(1) : a.score}%
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 4 }}>
                      Dianalisis: {a.analyzed_at ? new Date(a.analyzed_at).toLocaleDateString("id-ID") : "—"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>Pendidikan</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{a.education ?? "—"}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8, marginBottom: 4 }}>Pengalaman</div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{a.experience ?? "—"}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 8, marginBottom: 4 }}>Kategori</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#a5b4fc" }}>{a.category ?? "—"}</div>
                  </div>
                </div>
              ) : (
                <div style={{ background: "rgba(107,114,128,0.08)", border: "1px solid rgba(107,114,128,0.2)", borderRadius: "var(--radius-md)", padding: "20px 24px", marginBottom: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
                  Kandidat belum mengupload atau menganalisis CV.
                </div>
              )}

              {/* CV Info */}
              {selected.cv && (
                <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon name="document" size={16} color="#10b981" />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#10b981" }}>{selected.cv.file_name || "Dokumen CV"}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      Diperbarui: {formatDate(selected.cv.updated_at)}
                    </div>
                  </div>
                </div>
              )}

              {/* Skills */}
              {a?.skills && formatSkills(a.skills).length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>Skills</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {formatSkills(a.skills).map(s => (
                      <span key={s} className="badge badge-primary" style={{ fontSize: 12 }}>{s.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Gaps */}
              {a && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  {a.strengths?.length > 0 && (
                    <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "var(--radius-md)", padding: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", marginBottom: 8 }}>✓ Kekuatan</div>
                      {(Array.isArray(a.strengths) ? a.strengths : []).map((s, i) => (
                        <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>• {s}</div>
                      ))}
                    </div>
                  )}
                  {a.gaps?.length > 0 && (
                    <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "var(--radius-md)", padding: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#f59e0b", marginBottom: 8 }}>⚠ Area Peningkatan</div>
                      {(Array.isArray(a.gaps) ? a.gaps : []).map((g, i) => (
                        <div key={i} style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>• {g}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* AI Recommendation */}
              {a?.recommendation && (
                <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "var(--radius-md)", padding: "16px 20px", marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#a5b4fc", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="ai" size={13} color="#a5b4fc" /> Rekomendasi AI
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>{a.recommendation}</p>
                </div>
              )}

              {/* Status update */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 12 }}>Ubah Status Rekrutmen</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { key: "recommended", label: "Rekomendasikan", color: "#10b981" },
                    { key: "interview",   label: "Interview",       color: "#f59e0b" },
                    { key: "hired",       label: "Diterima",        color: "#06b6d4" },
                    { key: "rejected",    label: "Tolak",           color: "#ef4444" },
                  ].map(s => (
                    <button key={s.key} onClick={() => handleStatus(selected.user_id, s.key)}
                      style={{ flex: "1 1 auto", padding: "10px 8px", borderRadius: "var(--radius-md)", border: `1px solid ${s.color}40`, background: getStatus(selected) === s.key ? `${s.color}20` : "transparent", color: s.color, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-sans)" }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current status badge */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Status saat ini:</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                  {st.label}
                </span>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default HRDDashboard;
