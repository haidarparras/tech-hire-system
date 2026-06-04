import { useState, useEffect } from "react";
import Icon from "../../components/common/Icon";
import { apiFetch } from "../../utils/api";

const CandidateDashboard = ({ setActivePage, user }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annRes, actRes] = await Promise.all([
          apiFetch("/api/announcements"),
          apiFetch("/api/activities")
        ]);
        
        setAnnouncements(Array.isArray(annRes) ? annRes : []);
        setActivities(Array.isArray(actRes) ? actRes : []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
    }).format(d);
  };

  const getAnnouncementIcon = (type) => {
    switch (type) {
      case 'warning': return { name: 'warning', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
      case 'success': return { name: 'check', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
      default: return { name: 'info', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' };
    }
  };

  return (
    <div style={{ paddingBottom: 60, minHeight: "100vh", animation: "fadeInUp 0.4s ease-out", padding: "40px 6%" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
      
      {/* 1. WELCOME BANNER */}
      <div style={{ 
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)", // Warna sistem TechHire
        borderRadius: 16, 
        padding: "40px", 
        marginBottom: 32,
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(99, 102, 241, 0.2)"
      }}>
        {/* Dekorasi Background */}
        <div style={{
          position: "absolute", top: -50, right: -50, width: 250, height: 250,
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%", zIndex: 0
        }} />
        <div style={{
          position: "absolute", bottom: -50, right: 100, width: 150, height: 150,
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%)",
          borderRadius: "50%", zIndex: 0
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 800, marginBottom: 12, color: "white" }}>
            Selamat Datang di TechHire Portal
          </h1>
          <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 16, maxWidth: 600, marginBottom: 28, lineHeight: 1.5 }}>
            Kelola profil, unggah CV, dan pantau status lamaran Anda dalam satu platform terintegrasi berbasis AI.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button 
              onClick={() => setActivePage("cv-upload")}
              style={{
                background: "white", color: "#6366f1", border: "none", borderRadius: 8,
                padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                boxShadow: "0 4px 14px rgba(0,0,0,0.1)", transition: "transform 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <Icon name="upload" size={18} color="#6366f1" />
              Upload CV
            </button>
            <button 
              onClick={() => setActivePage("jobs")} // Akan mengarah ke halaman jobs jika diizinkan (atau tambahkan rute public jobs)
              style={{
                background: "rgba(0,0,0,0.2)", color: "white", border: "1px solid rgba(255,255,255,0.3)", 
                borderRadius: 8, padding: "12px 20px", fontSize: 14, fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.3)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0.2)"}
            >
              <Icon name="briefcase" size={18} color="white" />
              Lihat Lowongan
            </button>
          </div>
        </div>
      </div>

      {/* 2. STAT CARDS GRID */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", 
        gap: 20, 
        marginBottom: 32 
      }}>
        {/* Card 1 */}
        <div style={{ background: "var(--bg-card)", borderRadius: 16, padding: "20px", border: "1px solid var(--border-light)", display: "flex", flexDirection: "column", gap: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" }}>TOTAL LAMARAN</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "white", lineHeight: 1 }}>0</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99, 102, 241, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="briefcase" size={20} color="#6366f1" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#10b981" }}>
            <Icon name="check" size={14} color="#10b981" /> Sistem Aktif
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 20, right: 20, height: 4, background: "#6366f1", borderRadius: "4px 4px 0 0" }} />
        </div>

        {/* Card 2 */}
        <div style={{ background: "var(--bg-card)", borderRadius: 16, padding: "20px", border: "1px solid var(--border-light)", display: "flex", flexDirection: "column", gap: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" }}>CV TERUNGGAH</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "white", lineHeight: 1 }}>{activities.some(a => a.action.toLowerCase().includes('cv')) ? '1' : '0'}</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="document" size={20} color="#3b82f6" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#3b82f6" }}>
            <Icon name="upload" size={14} color="#3b82f6" /> Terakhir diupdate
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 20, right: 20, height: 4, background: "#3b82f6", borderRadius: "4px 4px 0 0" }} />
        </div>

        {/* Card 3 */}
        <div style={{ background: "var(--bg-card)", borderRadius: 16, padding: "20px", border: "1px solid var(--border-light)", display: "flex", flexDirection: "column", gap: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" }}>PENGUMUMAN</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "white", lineHeight: 1 }}>{announcements.length}</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="document" size={20} color="#10b981" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#10b981" }}>
            <Icon name="document" size={14} color="#10b981" /> Info dari HRD
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 20, right: 40, height: 4, background: "#10b981", borderRadius: "4px 4px 0 0" }} />
          <div style={{ position: "absolute", bottom: 0, left: "calc(100% - 36px)", right: 20, height: 4, background: "rgba(16, 185, 129, 0.2)", borderRadius: "4px 4px 0 0" }} />
        </div>

        {/* Card 4 */}
        <div style={{ background: "var(--bg-card)", borderRadius: 16, padding: "20px", border: "1px solid var(--border-light)", display: "flex", flexDirection: "column", gap: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-secondary)", letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" }}>SKOR MATCH AI</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: "white", lineHeight: 1 }}>-</div>
            </div>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(139, 92, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="analytics" size={20} color="#8b5cf6" />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#8b5cf6" }}>
            <Icon name="target" size={14} color="#8b5cf6" /> Belum dikalkulasi
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 20, right: 20, height: 4, background: "#8b5cf6", borderRadius: "4px 4px 0 0" }} />
        </div>
      </div>

      {/* 3. BOTTOM SECTION: 2 COLUMNS */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
        
        {/* Kolom Kiri: Riwayat Aktivitas (Lebih Lebar) */}
        <div style={{ flex: "1 1 min(100%, 500px)", background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border-light)", padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", margin: 0 }}>Riwayat Aktivitas Terbaru</h2>
            <span style={{ fontSize: 12, color: "#6366f1", fontWeight: 600, background: "rgba(99, 102, 241, 0.1)", padding: "4px 10px", borderRadius: 999 }}>Real-time Data</span>
          </div>

          {loading ? (
            <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px 0" }}>Memuat aktivitas...</div>
          ) : activities.length === 0 ? (
            <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 24, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="analytics" size={24} color="var(--text-secondary)" />
              </div>
              Belum ada aktivitas yang tercatat.
            </div>
          ) : (
            <div style={{ position: "relative", paddingLeft: 16 }}>
              <div style={{ position: "absolute", left: 3, top: 8, bottom: 8, width: 2, background: "rgba(255,255,255,0.05)" }} />
              {activities.map((act, idx) => (
                <div key={idx} style={{ position: "relative", paddingBottom: idx === activities.length - 1 ? 0 : 28 }}>
                  <div style={{ position: "absolute", left: -18, top: 4, width: 10, height: 10, borderRadius: "50%", background: "#6366f1", border: "2px solid var(--bg-card)" }} />
                  <div style={{ fontSize: 14, fontWeight: 600, color: "white", marginBottom: 4 }}>{act.action}</div>
                  {act.description && <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>{act.description}</div>}
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{formatDate(act.created_at)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Pengumuman */}
        <div style={{ flex: "1 1 300px", background: "var(--bg-card)", borderRadius: 16, border: "1px solid var(--border-light)", padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "white", margin: 0 }}>Pengumuman HRD</h2>
            <Icon name="document" size={18} color="var(--text-secondary)" />
          </div>

          {loading ? (
            <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px 0" }}>Memuat pengumuman...</div>
          ) : announcements.length === 0 ? (
            <div style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px 0" }}>
              Tidak ada pengumuman.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {announcements.map((ann, idx) => {
                const style = getAnnouncementIcon(ann.type);
                return (
                  <div key={idx} style={{ paddingBottom: 16, borderBottom: idx === announcements.length - 1 ? "none" : "1px solid var(--border-light)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: style.color }} />
                      <div style={{ fontSize: 14, fontWeight: 700, color: "white" }}>{ann.title}</div>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 8, paddingLeft: 18 }}>
                      {ann.content}
                    </div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", paddingLeft: 18 }}>
                      {formatDate(ann.created_at)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
