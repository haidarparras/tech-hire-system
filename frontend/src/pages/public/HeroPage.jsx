import { useState, useEffect } from "react";
import Icon from "../../components/common/Icon";

const stats = [
  { value: "94%", label: "Akurasi Matching",   iconName: "target"   },
  { value: "10x", label: "Lebih Cepat",         iconName: "zap"      },
  { value: "2.500+", label: "CV Dianalisis",    iconName: "document" },
  { value: "98%", label: "Kepuasan Recruiter",  iconName: "star"     },
];

const FloatingCard = ({ style, children }) => (
  <div style={{
    position: "absolute",
    background: "rgba(13, 21, 38, 0.9)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: 16,
    padding: "14px 18px",
    backdropFilter: "blur(20px)",
    ...style,
  }}>
    {children}
  </div>
);

const HeroPage = ({ setActivePage }) => {
  const [matchScore, setMatchScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatchScore(prev => {
        if (prev >= 94) { clearInterval(interval); return 94; }
        return prev + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: "relative", paddingBottom: 40, overflow: "hidden" }}>
      {/* Gradient Background */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 50%, rgba(139,92,246,0.12) 0%, transparent 60%), var(--bg-primary)",
      }} />

      {/* Animated orbs */}
      <div style={{
        position: "absolute",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
        top: "10%", left: "-10%",
        animation: "float 8s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
        top: "20%", right: "-5%",
        animation: "float 10s ease-in-out infinite reverse",
      }} />

      {/* Grid pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)",
      }} />

      {/* Content */}
      <div className="hero-grid" style={{
        position: "relative",
        maxWidth: 1200, margin: "0 auto",
        padding: "110px 24px 60px",
        alignItems: "flex-start"
      }}>
        {/* Left */}
        <div className="animate-fade-in-up">
          <div className="section-tag" style={{ marginBottom: 20 }}>
            <Icon name="cpu" size={14} color="#a5b4fc" />
            AI-Powered Recruitment
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 4vw, 46px)",
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: "-0.5px",
            marginBottom: 20,
            color: "var(--text-primary)",
          }}>
            Rekrut Talenta{" "}
            <span className="gradient-text">Tech Terbaik</span>
            <br />
            dengan Kecerdasan AI
          </h1>

          <p style={{
            fontSize: "clamp(14px, 1.5vw, 16px)",
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: 36,
            maxWidth: 520,
          }}>
            Platform rekrutmen berbasis AI yang menganalisis CV secara otomatis, mengidentifikasi skill kandidat, dan memprediksi tingkat kecocokan — sehingga proses hiring menjadi <strong style={{ color: "var(--text-primary)" }}>10x lebih cepat</strong> dan lebih objektif.
          </p>

          <div className="hero-btns" style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 48 }}>
            <button className="btn-primary" onClick={() => setActivePage("dashboard")}
              style={{ fontSize: 15, padding: "12px 28px", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="zap" size={16} color="white" />
              Coba Sekarang
            </button>
            <button className="btn-secondary" onClick={() => setActivePage("features")}
              style={{ fontSize: 15, padding: "12px 28px", display: "flex", alignItems: "center", gap: 8 }}>
              <Icon name="arrowRight" size={16} color="currentColor" />
              Lihat Demo
            </button>
          </div>

          {/* Stats row */}
          <div className="hero-stats" style={{ gap: 24 }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: "left" }}>
                <div style={{
                  fontSize: 24, fontWeight: 800,
                  fontFamily: "var(--font-display)",
                  background: "var(--gradient-primary)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Hero Visual */}
        <div className="hero-visual" style={{ position: "relative", display: "flex", justifyContent: "flex-end", paddingTop: 10 }}>
          {/* Main card */}
          <div className="glass-card animate-float" style={{
            width: 320, padding: 24,
            boxShadow: "var(--shadow-glow)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="cpu" size={22} color="white" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>AI Analysis</div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>CV Screening Active</div>
              </div>
              <div style={{
                marginLeft: "auto",
                width: 10, height: 10, borderRadius: "50%",
                background: "#10b981",
                boxShadow: "0 0 10px #10b981",
              }} />
            </div>

            {/* Match score */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Tingkat Kecocokan</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#10b981" }}>{matchScore}%</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 999 }}>
                <div style={{
                  height: "100%",
                  width: `${matchScore}%`,
                  background: "linear-gradient(90deg, #6366f1, #10b981)",
                  borderRadius: 999,
                  transition: "width 0.1s linear",
                }} />
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginBottom: 10 }}>Skill Terdeteksi</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["React", "Node.js", "Python", "ML", "SQL", "Docker"].map(skill => (
                  <span key={skill} className="badge badge-primary" style={{ fontSize: 11 }}>{skill}</span>
                ))}
              </div>
            </div>

            <button className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 20px", fontSize: 13 }}>
              Lihat Laporan Lengkap →
            </button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default HeroPage;
