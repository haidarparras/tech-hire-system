import { useState, useEffect, useRef } from "react";
import Icon from "../../components/common/Icon";
import { apiFetch, AI_URL } from "../../utils/api";

const statusColors = {
  recommended: { bg: "rgba(16,185,129,0.15)", color: "#6ee7b7", border: "rgba(16,185,129,0.3)", label: "Rekomendasi" },
  interview:   { bg: "rgba(245,158,11,0.15)", color: "#fcd34d", border: "rgba(245,158,11,0.3)", label: "Interview"   },
  review:      { bg: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "rgba(99,102,241,0.3)", label: "Review"      },
  new:         { bg: "rgba(6,182,212,0.15)",  color: "#67e8f9", border: "rgba(6,182,212,0.3)",  label: "Baru"        },
  hired:       { bg: "rgba(16,185,129,0.15)", color: "#6ee7b7", border: "rgba(16,185,129,0.3)", label: "Diterima"    },
  rejected:    { bg: "rgba(239,68,68,0.15)",  color: "#fca5a5", border: "rgba(239,68,68,0.3)",  label: "Ditolak"     },
};

const HRDDashboard = ({ setActivePage, user }) => {
  const [candidates, setCandidates]       = useState([]);
  const [jobs, setJobs]                   = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [statusFilter, setStatusFilter]   = useState("all");
  const [positionFilter, setPositionFilter] = useState("all");
  const [search, setSearch]               = useState("");
  const [deletingAll, setDeletingAll]     = useState(false);
  const [cvLoading, setCvLoading]         = useState(false);
  const [cvModal, setCvModal]             = useState(null); // { url, filename }
  const [posDropOpen, setPosDropOpen]     = useState(false);
  const posDropRef = useRef(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (posDropRef.current && !posDropRef.current.contains(e.target)) {
        setPosDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Unique positions from candidates
  const uniquePositions = [...new Set(candidates.map(c => c.position).filter(Boolean))].sort();

  const filtered = candidates.filter(c => {
    const matchStatus   = statusFilter === "all" || c.status === statusFilter;
    const matchPosition = positionFilter === "all" || c.position === positionFilter;
    const matchSearch   = !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.position?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPosition && matchSearch;
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

  // Jadwalkan Interview — simpan ke localStorage lalu navigasi
  const handleScheduleInterview = (candidate) => {
    localStorage.setItem("techhire_schedule_candidate", JSON.stringify({
      id: candidate.id,
      name: candidate.name,
      position: candidate.position ?? "",
    }));
    setSelectedCandidate(null);
    setActivePage("interviews");
  };

  // Unduh Laporan PDF — buka print window dengan format laporan
  const handleDownloadPDF = (candidate) => {
    const skills = formatSkills(candidate.skills).join(", ") || "—";
    const st = statusColors[candidate.status] ?? statusColors.new;
    const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>Laporan Kandidat — ${candidate.name}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e1e2e; background: #fff; padding: 48px; }
    .header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #e5e7eb; }
    .logo { font-size: 13px; color: #6366f1; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
    .date { font-size: 12px; color: #9ca3af; }
    .avatar { width: 64px; height: 64px; border-radius: 16px; background: linear-gradient(135deg,#6366f1,#8b5cf6); color: #fff; font-size: 28px; font-weight: 800; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
    h1 { font-size: 26px; font-weight: 800; color: #1e1e2e; margin-bottom: 4px; }
    .position { font-size: 14px; color: #6b7280; margin-bottom: 12px; }
    .status-badge { display: inline-block; padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; background: #ede9fe; color: #6366f1; }
    .score-box { background: linear-gradient(135deg,#f0f0ff,#e8f5e9); border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px 32px; margin: 24px 0; display: flex; justify-content: space-between; align-items: center; }
    .score-val { font-size: 52px; font-weight: 900; color: #6366f1; line-height: 1; }
    .score-label { font-size: 12px; color: #9ca3af; margin-bottom: 4px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
    .info-box { background: #f9fafb; border-radius: 12px; padding: 16px 20px; }
    .info-box label { font-size: 11px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px; }
    .info-box span { font-size: 15px; font-weight: 600; color: #1e1e2e; }
    .section-title { font-size: 13px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
    .skills { display: flex; flex-wrap: wrap; gap: 8px; }
    .skill { background: #ede9fe; color: #6366f1; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 500; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #9ca3af; text-align: center; }
    @media print { body { padding: 28px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">⚡ Tech Hire System</div>
    <div class="date">Dicetak: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
  </div>

  <div class="avatar">${candidate.name?.[0]?.toUpperCase() ?? "?"}</div>
  <h1>${candidate.name ?? "—"}</h1>
  <div class="position">${candidate.position ?? "—"}</div>
  <span class="status-badge">${st.label}</span>

  <div class="score-box">
    <div>
      <div class="score-label">AI Match Score</div>
      <div class="score-val">${candidate.score ?? "—"}<span style="font-size:24px">%</span></div>
    </div>
    <div style="text-align:right">
      <div class="score-label">Tanggal Upload</div>
      <div style="font-size:14px;font-weight:600">${candidate.created_at ? new Date(candidate.created_at).toLocaleDateString("id-ID") : "—"}</div>
    </div>
  </div>

  <div class="info-grid">
    <div class="info-box"><label>Pendidikan</label><span>${candidate.education ?? "—"}</span></div>
    <div class="info-box"><label>Pengalaman</label><span>${candidate.exp ?? "—"}</span></div>
  </div>

  <div style="margin-bottom:24px">
    <div class="section-title">Skills</div>
    <div class="skills">${formatSkills(candidate.skills).map(s => `<span class="skill">${s.trim()}</span>`).join("") || "—"}</div>
  </div>

  <div class="footer">Laporan ini digenerate otomatis oleh Tech Hire System &bull; Dokumen Rahasia</div>
  <script>window.print(); window.onafterprint = () => window.close();</script>
</body>
</html>`;
    const win = window.open("", "_blank", "width=900,height=700");
    if (win) { win.document.write(html); win.document.close(); }
    else { alert("Izinkan pop-up untuk mengunduh laporan PDF."); }
  };

  // View CV — fetch from AI service and open blob URL
  const handleViewCV = async (candidate) => {
    if (!candidate.cv_path && !candidate.cv_filename) {
      alert("CV tidak tersedia untuk kandidat ini.");
      return;
    }
    setCvLoading(true);
    try {
      const token = localStorage.getItem("techhire_token");
      const res = await fetch(`${AI_URL}/api/ai/cv/${candidate.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) { alert("CV tidak ditemukan atau belum tersedia."); return; }
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const filename = candidate.cv_filename || "cv.pdf";
      // Jika PDF → tampilkan di modal, selain itu → download
      if (blob.type === "application/pdf" || filename.endsWith(".pdf")) {
        setCvModal({ url, filename });
      } else {
        const a = document.createElement("a");
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      alert("Gagal mengambil file CV.");
    } finally {
      setCvLoading(false);
    }
  };

  const closeCvModal = () => {
    if (cvModal?.url) URL.revokeObjectURL(cvModal.url);
    setCvModal(null);
  };

  const pillBtn = (active, onClick, icon, label) => (
    <button onClick={onClick}
      style={{
        background: active ? "rgba(99,102,241,0.15)" : "transparent",
        color: active ? "#a5b4fc" : "var(--text-secondary)",
        border: `1px solid ${active ? "rgba(99,102,241,0.3)" : "var(--border-light)"}`,
        padding: "7px 14px", borderRadius: 999, fontSize: 13, fontWeight: 500,
        cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 5,
        fontFamily: "var(--font-sans)", transition: "var(--transition)",
      }}>
      {icon && <Icon name={icon} size={12} color={active ? "#a5b4fc" : "var(--text-secondary)"} />}
      {label}
    </button>
  );

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

        {/* ── Filter & Search Bar ─────────────────────────── */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "20px 24px", marginBottom: 20 }}>

          {/* Row 1: Search + Posisi dropdown + Actions */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 16 }}>
            {/* Search */}
            <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
              <Icon name="search" size={15} color="var(--text-muted)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari nama atau posisi..."
                style={{ width: "100%", background: "var(--bg-secondary)", border: "1px solid var(--border-light)", borderRadius: 999, padding: "8px 14px 8px 36px", color: "var(--text-primary)", fontSize: 13, fontFamily: "var(--font-sans)", outline: "none" }}
              />
            </div>

            {/* Position Dropdown */}
            <div ref={posDropRef} style={{ position: "relative" }}>
              <button
                onClick={() => setPosDropOpen(v => !v)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: positionFilter !== "all" ? "rgba(139,92,246,0.15)" : "var(--bg-secondary)",
                  color: positionFilter !== "all" ? "#c4b5fd" : "var(--text-secondary)",
                  border: `1px solid ${positionFilter !== "all" ? "rgba(139,92,246,0.4)" : "var(--border-light)"}`,
                  padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                  cursor: "pointer", fontFamily: "var(--font-sans)", minWidth: 180,
                  transition: "var(--transition)",
                }}>
                <Icon name="briefcase" size={13} color={positionFilter !== "all" ? "#c4b5fd" : "var(--text-secondary)"} />
                {positionFilter === "all" ? "Semua Posisi" : positionFilter}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: "auto", transform: posDropOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {posDropOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 100,
                  background: "var(--bg-card)", border: "1px solid var(--border-light)",
                  borderRadius: "var(--radius-md)", padding: "6px 0", minWidth: 220,
                  boxShadow: "0 16px 48px rgba(0,0,0,0.4)", maxHeight: 280, overflowY: "auto",
                }}>
                  {[{ key: "all", label: "Semua Posisi" }, ...uniquePositions.map(p => ({ key: p, label: p }))].map(opt => (
                    <button key={opt.key}
                      onClick={() => { setPositionFilter(opt.key); setPosDropOpen(false); }}
                      style={{
                        display: "flex", alignItems: "center", gap: 10, width: "100%",
                        padding: "9px 16px", background: positionFilter === opt.key ? "rgba(139,92,246,0.12)" : "transparent",
                        color: positionFilter === opt.key ? "#c4b5fd" : "var(--text-primary)",
                        border: "none", cursor: "pointer", fontSize: 13, fontFamily: "var(--font-sans)",
                        textAlign: "left", fontWeight: positionFilter === opt.key ? 600 : 400,
                      }}>
                      {positionFilter === opt.key && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      )}
                      {positionFilter !== opt.key && <span style={{ width: 12 }} />}
                      {opt.label}
                      {opt.key !== "all" && (
                        <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-muted)", background: "rgba(255,255,255,0.05)", padding: "1px 7px", borderRadius: 999 }}>
                          {candidates.filter(c => c.position === opt.key).length}
                        </span>
                      )}
                    </button>
                  ))}
                  {uniquePositions.length === 0 && (
                    <div style={{ padding: "12px 16px", fontSize: 13, color: "var(--text-muted)" }}>Belum ada data posisi</div>
                  )}
                </div>
              )}
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

          {/* Row 2: Status filter pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)", marginRight: 4 }}>Status:</span>
            {[
              { key: "all",         label: "Semua",        icon: "users"       },
              { key: "new",         label: "Baru",          icon: "upload"      },
              { key: "recommended", label: "Rekomendasi",   icon: "checkCircle" },
              { key: "interview",   label: "Interview",     icon: "chat"        },
              { key: "review",      label: "Review",        icon: "search"      },
              { key: "hired",       label: "Diterima",      icon: "checkCircle" },
              { key: "rejected",    label: "Ditolak",       icon: "close"       },
            ].map(f => pillBtn(statusFilter === f.key, () => setStatusFilter(f.key), f.icon, f.label))}
          </div>
        </div>

        {/* Active Filters Summary */}
        {(positionFilter !== "all" || statusFilter !== "all" || search) && !loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>Filter aktif:</span>
            {positionFilter !== "all" && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(139,92,246,0.12)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.3)", padding: "3px 10px", borderRadius: 999, fontSize: 12 }}>
                Posisi: {positionFilter}
                <button onClick={() => setPositionFilter("all")} style={{ background: "none", border: "none", color: "#c4b5fd", cursor: "pointer", padding: 0, lineHeight: 1 }}>×</button>
              </span>
            )}
            {statusFilter !== "all" && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.12)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)", padding: "3px 10px", borderRadius: 999, fontSize: 12 }}>
                Status: {statusColors[statusFilter]?.label ?? statusFilter}
                <button onClick={() => setStatusFilter("all")} style={{ background: "none", border: "none", color: "#a5b4fc", cursor: "pointer", padding: 0, lineHeight: 1 }}>×</button>
              </span>
            )}
            {search && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(6,182,212,0.1)", color: "#67e8f9", border: "1px solid rgba(6,182,212,0.3)", padding: "3px 10px", borderRadius: 999, fontSize: 12 }}>
                Cari: "{search}"
                <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "#67e8f9", cursor: "pointer", padding: 0, lineHeight: 1 }}>×</button>
              </span>
            )}
          </div>
        )}

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
            <h3 style={{ marginTop: 14, fontSize: 17, fontWeight: 600 }}>Tidak ada kandidat ditemukan</h3>
            <p style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)" }}>
              {positionFilter !== "all" || statusFilter !== "all" || search
                ? "Coba ubah filter atau kata kunci pencarian."
                : "Upload CV kandidat melalui halaman Upload CV."}
            </p>
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
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                      {st.label}
                    </span>
                    {(c.cv_path || c.cv_filename) && (
                      <span style={{ fontSize: 11, color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        CV tersedia
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Detail Modal ────────────────────────────────────── */}
      {selectedCandidate && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(5,8,20,0.85)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          onClick={() => setSelectedCandidate(null)}>
          <div onClick={e => e.stopPropagation()} className="animate-fade-in"
            style={{ width: "100%", maxWidth: 580, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: 36, maxHeight: "90vh", overflowY: "auto" }}>

            {/* Modal Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "white" }}>
                  {selectedCandidate.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{selectedCandidate.name}</h2>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 6 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                    {selectedCandidate.position ?? "—"}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 8, borderRadius: 8, display: "flex" }}>
                <Icon name="close" size={18} color="var(--text-secondary)" />
              </button>
            </div>

            {/* Score + Info */}
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

            {/* CV Section */}
            <div style={{ marginBottom: 24, background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(99,102,241,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>Curriculum Vitae</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {selectedCandidate.cv_filename ?? "Belum ada CV yang diupload"}
                    </div>
                  </div>
                </div>
                {(selectedCandidate.cv_path || selectedCandidate.cv_filename) ? (
                  <button
                    onClick={() => handleViewCV(selectedCandidate)}
                    disabled={cvLoading}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "rgba(99,102,241,0.15)", color: "#a5b4fc",
                      border: "1px solid rgba(99,102,241,0.35)", padding: "8px 16px",
                      borderRadius: 999, fontSize: 12, fontWeight: 600,
                      cursor: cvLoading ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)",
                      opacity: cvLoading ? 0.7 : 1, transition: "var(--transition)",
                    }}>
                    {cvLoading ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                    {cvLoading ? "Memuat..." : "Lihat CV"}
                  </button>
                ) : (
                  <span style={{ fontSize: 11, color: "var(--text-muted)", fontStyle: "italic" }}>Tidak tersedia</span>
                )}
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 10 }}>Skills</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {formatSkills(selectedCandidate.skills).map(s => (
                  <span key={s} className="badge badge-primary" style={{ fontSize: 12 }}>{s.trim()}</span>
                ))}
              </div>
            </div>

            {/* Status Change */}
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

            {/* Footer Buttons */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => handleScheduleInterview(selectedCandidate)}
                className="btn-primary" style={{ flex: "1 1 150px", justifyContent: "center" }}>
                <Icon name="calendar" size={14} color="white" /> Jadwalkan Interview
              </button>
              <button onClick={() => handleDownloadPDF(selectedCandidate)}
                style={{ flex: "1 1 130px", padding: "10px 14px", borderRadius: "var(--radius-md)", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#6ee7b7", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Unduh PDF
              </button>
              <button onClick={() => { setSelectedCandidate(null); setActivePage("hrd-upload"); }}
                style={{ flex: "1 1 120px", padding: "10px 14px", borderRadius: "var(--radius-md)", background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.3)", color: "#c4b5fd", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                Analisis Baru
              </button>
              <button onClick={() => handleDeleteOne(selectedCandidate.id)}
                style={{ padding: "10px 14px", borderRadius: "var(--radius-md)", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", color: "#fda4af", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)" }}>
                <Icon name="close" size={14} color="#fda4af" /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CV Preview Modal (PDF) ────────────────────────── */}
      {cvModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={closeCvModal}>
          <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 860, display: "flex", flexDirection: "column", height: "90vh" }}>
            {/* CV Modal Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{cvModal.filename}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <a href={cvModal.url} download={cvModal.filename}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.15)", color: "#a5b4fc", border: "1px solid rgba(99,102,241,0.3)", padding: "7px 14px", borderRadius: 999, fontSize: 12, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-sans)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download
                </a>
                <button onClick={closeCvModal}
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid var(--border-light)", color: "var(--text-secondary)", cursor: "pointer", padding: "7px 14px", borderRadius: 999, fontSize: 12, fontFamily: "var(--font-sans)" }}>
                  Tutup
                </button>
              </div>
            </div>
            {/* PDF iframe */}
            <div style={{ flex: 1, borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-light)", background: "#fff" }}>
              <iframe
                src={cvModal.url}
                title="CV Preview"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default HRDDashboard;
