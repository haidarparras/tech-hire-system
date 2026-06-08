import { useState, useEffect } from "react";
import Icon from "../../components/common/Icon";
import { apiFetch } from "../../utils/api";

const JobsListPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, open, closed

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err) {
      console.error("Failed to load jobs:", err);
    }
    setLoading(false);
  };

  const filteredJobs = jobs.filter(j => {
    if (filter === "all") return true;
    return j.status === filter;
  });

  const openJobs = filteredJobs.filter(j => j.status === "open");

  return (
    <div style={{ paddingTop: 100, minHeight: "100vh", padding: "40px 6%", maxWidth: 1200, margin: "0 auto" }}>
      
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <div className="section-tag" style={{ display: "inline-flex", marginBottom: 12 }}>
          <Icon name="briefcase" size={13} color="#a5b4fc" /> Lowongan Kerja
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, marginBottom: 12 }}>
          Temukan <span className="gradient-text">Karir Impian</span> Anda
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, maxWidth: 640, lineHeight: 1.7 }}>
          Jelajahi lowongan kerja terbaru dan temukan posisi yang sesuai dengan keahlian Anda.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
        {[
          { key: "all", label: "Semua Lowongan", count: jobs.length },
          { key: "open", label: "Dibuka", count: jobs.filter(j => j.status === "open").length },
          { key: "closed", label: "Ditutup", count: jobs.filter(j => j.status === "closed").length },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              border: `1px solid ${filter === tab.key ? "#6366f1" : "var(--border-light)"}`,
              background: filter === tab.key ? "rgba(99,102,241,0.12)" : "var(--bg-card)",
              color: filter === tab.key ? "#a5b4fc" : "var(--text-secondary)",
              fontSize: 14,
              fontWeight: filter === tab.key ? 700 : 500,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "var(--transition)",
            }}>
            {tab.label}
            <span style={{ 
              background: filter === tab.key ? "#6366f1" : "rgba(255,255,255,0.08)", 
              color: filter === tab.key ? "white" : "var(--text-muted)", 
              padding: "2px 8px", 
              borderRadius: 999, 
              fontSize: 12, 
              fontWeight: 700 
            }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-secondary)" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid rgba(99,102,241,0.2)", borderTop: "3px solid #6366f1", margin: "0 auto 16px", animation: "spin-slow 1s linear infinite" }} />
          Memuat lowongan...
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredJobs.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📋</div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Belum Ada Lowongan</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            {filter === "all" ? "Tidak ada lowongan tersedia saat ini." : `Tidak ada lowongan dengan status ${filter}.`}
          </p>
        </div>
      )}

      {/* Jobs Grid */}
      {!loading && filteredJobs.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {filteredJobs.map(job => (
            <div
              key={job.id}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-light)",
                borderRadius: "var(--radius-lg)",
                padding: 24,
                transition: "var(--transition)",
                cursor: "pointer",
                position: "relative",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.15)";
                e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "var(--border-light)";
              }}>
              
              {/* Status Badge */}
              <div style={{ position: "absolute", top: 16, right: 16 }}>
                <span className={`badge badge-${job.status === "open" ? "success" : "secondary"}`} style={{ fontSize: 11 }}>
                  {job.status === "open" ? "Dibuka" : job.status === "closed" ? "Ditutup" : "Draft"}
                </span>
              </div>

              {/* Job Icon */}
              <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <Icon name="briefcase" size={22} color="#6366f1" />
              </div>

              {/* Job Title */}
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "var(--text-primary)" }}>
                {job.title}
              </h3>

              {/* Job Meta */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16, fontSize: 13, color: "var(--text-secondary)" }}>
                {job.department && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="layers" size={13} color="var(--text-muted)" />
                    {job.department}
                  </div>
                )}
                {job.location && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="location" size={13} color="var(--text-muted)" />
                    {job.location}
                  </div>
                )}
                {job.type && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="clock" size={13} color="var(--text-muted)" />
                    {job.type}
                  </div>
                )}
              </div>

              {/* Job Description */}
              {job.description && (
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {job.description}
                </p>
              )}

              {/* Applicants Count */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid var(--border-light)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-muted)" }}>
                  <Icon name="candidates" size={14} color="var(--text-muted)" />
                  {job.applicants || 0} pelamar
                </div>
                {job.status === "open" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("Fitur Apply belum tersedia. Silakan hubungi HRD.");
                    }}
                    className="btn-primary"
                    style={{ padding: "8px 18px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                    <Icon name="send" size={13} color="white" />
                    Apply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default JobsListPage;
