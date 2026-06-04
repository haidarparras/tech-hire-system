import Icon from "../../components/common/Icon";

const features = [
  {
    iconName: "ai",
    title: "AI CV Analyzer",
    description: "Sistem AI kami secara otomatis mengekstrak dan menganalisis informasi dari CV — mulai dari pengalaman kerja, pendidikan, hingga soft skill yang tersembunyi.",
    gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)",
    iconColor: "#a5b4fc",
    tag: "NLP Powered",
    bullets: ["Ekstraksi data otomatis", "Deteksi 200+ skill teknis", "Analisis sentimen profil"],
  },
  {
    iconName: "target",
    title: "Smart Matching Engine",
    description: "Algoritma machine learning kami menghitung skor kecocokan kandidat terhadap posisi secara akurat, mempertimbangkan 50+ parameter relevan.",
    gradient: "linear-gradient(135deg, #06b6d4, #6366f1)",
    iconColor: "#67e8f9",
    tag: "ML Algorithm",
    bullets: ["Skor kecocokan 0-100%", "50+ parameter evaluasi", "Prediksi kinerja kandidat"],
  },
  {
    iconName: "chartBar",
    title: "Analytics Dashboard",
    description: "Visualisasi data rekrutmen secara real-time. Pantau pipeline kandidat, performa hiring, dan insight berbasis data untuk pengambilan keputusan lebih baik.",
    gradient: "linear-gradient(135deg, #10b981, #06b6d4)",
    iconColor: "#6ee7b7",
    tag: "Real-time Data",
    bullets: ["Laporan komprehensif", "Pipeline kandidat visual", "Insight berbasis data"],
  },
  {
    iconName: "search",
    title: "Skill Identifier",
    description: "Identifikasi dan kategorisasi skill kandidat secara mendalam — baik hard skill teknis maupun soft skill — dengan akurasi tinggi menggunakan NLP.",
    gradient: "linear-gradient(135deg, #f59e0b, #ef4444)",
    iconColor: "#fcd34d",
    tag: "Deep Analysis",
    bullets: ["Hard & soft skill mapping", "Sertifikasi terverifikasi", "Gap analysis otomatis"],
  },
  {
    iconName: "recommend",
    title: "Rekomendasi Cerdas",
    description: "Sistem memberikan rekomendasi top kandidat secara otomatis beserta alasan yang transparan, sehingga recruiter bisa membuat keputusan yang lebih percaya diri.",
    gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    iconColor: "#d8b4fe",
    tag: "AI Recommendation",
    bullets: ["Top-N kandidat otomatis", "Alasan rekomendasi transparan", "Perbandingan kandidat"],
  },
  {
    iconName: "shield",
    title: "Anti-Bias System",
    description: "Proses evaluasi yang sepenuhnya objektif berbasis data, menghilangkan bias subjektif dalam seleksi kandidat untuk hasil rekrutmen yang lebih adil.",
    gradient: "linear-gradient(135deg, #10b981, #8b5cf6)",
    iconColor: "#6ee7b7",
    tag: "Fair & Objective",
    bullets: ["Evaluasi berbasis data", "Standar penilaian konsisten", "Audit trail transparan"],
  },
];

const FeatureCard = ({ feature, index }) => (
  <div
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border-light)",
      borderRadius: "var(--radius-lg)",
      padding: 32,
      transition: "var(--transition)",
      cursor: "default",
      position: "relative",
      overflow: "hidden",
      animationDelay: `${index * 0.1}s`,
    }}
    className="animate-fade-in-up feature-card"
    onMouseEnter={e => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow = "var(--shadow-hover)";
      e.currentTarget.style.borderColor = "rgba(99,102,241,0.3)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
      e.currentTarget.style.borderColor = "var(--border-light)";
    }}
  >
    {/* Subtle top accent instead of bright glow */}
    <div style={{
      position: "absolute",
      top: 0, left: 0, right: 0,
      height: 1,
      background: feature.gradient,
      opacity: 0.5,
    }} />

    {/* Premium minimalist Icon */}
    <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
      <Icon name={feature.iconName} size={28} color={feature.iconColor} />
      <div className="badge badge-primary" style={{ margin: 0, background: "transparent", border: "1px solid var(--border-light)", color: "var(--text-secondary)" }}>
        {feature.tag}
      </div>
    </div>

    <h3 style={{
      fontSize: 18,
      fontWeight: 600,
      color: "var(--text-primary)",
      marginBottom: 12,
      letterSpacing: "-0.3px"
    }}>
      {feature.title}
    </h3>

    <p style={{
      fontSize: 14,
      color: "var(--text-secondary)",
      lineHeight: 1.6,
      marginBottom: 24,
    }}>
      {feature.description}
    </p>

    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
      {feature.bullets.map((b, i) => (
        <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
          <span style={{ color: feature.iconColor, opacity: 0.6, fontSize: 14 }}>—</span>
          {b}
        </li>
      ))}
    </ul>
  </div>
);

const FeaturesPage = () => (
  <div style={{ position: "relative", paddingTop: 120 }}>
    {/* BG */}
    <div style={{
      position: "absolute",
      inset: 0,
      background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 60%)",
    }} />

    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 64px", position: "relative" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 72 }}>
        <div className="section-tag" style={{ margin: "0 auto 20px", background: "transparent", border: "1px solid var(--border-light)" }}>
          Fitur Unggulan
        </div>
        <h2 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 4vw, 52px)",
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: 20,
        }}>
          Teknologi AI yang{" "}
          <span className="gradient-text">Mengubah Cara</span>
          <br />
          Anda Merekrut
        </h2>
        <p style={{
          fontSize: 18,
          color: "var(--text-secondary)",
          maxWidth: 560,
          margin: "0 auto",
          lineHeight: 1.7,
        }}>
          Dari analisis CV hingga rekomendasi kandidat terbaik — semua dikerjakan AI kami secara otomatis, cepat, dan akurat.
        </p>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
        gap: 24,
      }}>
        {features.map((f, i) => (
          <FeatureCard key={i} feature={f} index={i} />
        ))}
      </div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        .feature-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </div>
);

export default FeaturesPage;
