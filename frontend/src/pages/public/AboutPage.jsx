import Icon from "../../components/common/Icon";

const team = [
  { id: "CACC131D6Y0251", name: "Ahmad Fadhillah Akbar",    role: "AI Engineer",          avatar: "AF", color: "#6366f1", desc: "Merancang dan mengembangkan model AI untuk analisis CV dan prediksi kecocokan kandidat." },
  { id: "CACC001D6Y0716", name: "Rafif Qaiser Shafiq",      role: "AI Engineer",          avatar: "RQ", color: "#8b5cf6", desc: "Membangun pipeline NLP dan algoritma machine learning untuk ekstraksi informasi kandidat." },
  { id: "CDCC889D6X1473", name: "Khatrunnada Salsabila Zega", role: "Data Scientist",     avatar: "KS", color: "#06b6d4", desc: "Mengolah dan menganalisis data rekrutmen untuk menghasilkan insight berbasis statistik." },
  { id: "CDCC889D6X1193", name: "Aqila Salsabila",          role: "Data Scientist",       avatar: "AS", color: "#10b981", desc: "Membangun model prediktif dan melakukan evaluasi performa sistem matching kandidat." },
  { id: "CFCC189D6X2835", name: "Aulia Dwi Rahmadani",      role: "Fullstack Developer",  avatar: "AD", color: "#f59e0b", desc: "Membangun antarmuka recruiter yang intuitif dan mengelola infrastruktur aplikasi end-to-end." },
  { id: "CFCC190D6Y1283", name: "Haidar Parras",            role: "Fullstack Developer",  avatar: "HP", color: "#f43f5e", desc: "Mengembangkan backend API dan integrasi sistem antara model AI dengan platform web." },
];

const timeline = [
  { phase: "Fase 1", title: "Analisis Kebutuhan",    desc: "Identifikasi pain point recruiter, riset pasar, dan definisi fitur utama sistem.", status: "done"     },
  { phase: "Fase 2", title: "Desain Sistem",          desc: "Perancangan arsitektur AI, database schema, dan UI/UX prototype.",                 status: "done"     },
  { phase: "Fase 3", title: "Pengembangan Core",      desc: "Implementasi CV parser, NLP engine, dan matching algorithm.",                      status: "active"   },
  { phase: "Fase 4", title: "Integrasi & Testing",    desc: "Uji akurasi model, integrasi backend-frontend, dan QA testing.",                   status: "upcoming" },
  { phase: "Fase 5", title: "Deployment",             desc: "Launch platform ke production environment dan monitoring performa.",                status: "upcoming" },
];

const statusStyle = {
  done:     { color: "#10b981", bg: "rgba(16,185,129,0.15)",  border: "rgba(16,185,129,0.3)",  label: "Selesai",   icon: "check"   },
  active:   { color: "#6366f1", bg: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.3)",  label: "Aktif",     icon: "zap"     },
  upcoming: { color: "#475569", bg: "rgba(71,85,105,0.15)",   border: "rgba(71,85,105,0.2)",   label: "Upcoming",  icon: "clock"   },
};

const AboutPage = () => (
  <div style={{ paddingTop: 100, minHeight: "100vh" }}>
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 64px" }}>

      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 80 }}>
        <div className="section-tag" style={{ margin: "0 auto 20px" }}>
          <Icon name="globe" size={14} color="#a5b4fc" />
          Tentang Proyek
        </div>
        <h1 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 4vw, 52px)",
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: 24,
        }}>
          Membangun Masa Depan{" "}
          <span className="gradient-text">Rekrutmen Digital</span>
        </h1>
        <p style={{
          fontSize: 17,
          color: "var(--text-secondary)",
          maxWidth: 680,
          margin: "0 auto",
          lineHeight: 1.8,
        }}>
          Tech Hire Intelligence System lahir dari kebutuhan nyata industri: proses rekrutmen yang lambat, bias, dan tidak efisien. Kami membangun platform AI yang mengubah cara perusahaan menemukan talenta tech terbaik.
        </p>
      </div>

      {/* Problem & Solution */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
        marginBottom: 80,
      }}>
        {/* Problem */}
        <div style={{
          background: "rgba(244,63,94,0.06)",
          border: "1px solid rgba(244,63,94,0.2)",
          borderRadius: "var(--radius-xl)",
          padding: 40,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "rgba(244,63,94,0.15)",
            border: "1px solid rgba(244,63,94,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 20,
          }}>
            <Icon name="warning" size={24} color="#f43f5e" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#fda4af" }}>Permasalahan</h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Screening CV manual memakan waktu berhari-hari",
              "Bias subjektif dalam penilaian kandidat",
              "Jumlah pelamar tidak sebanding dengan kualitas",
              "Tidak ada standar penilaian yang konsisten",
              "Proses hiring yang panjang dan tidak efisien",
            ].map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--text-secondary)" }}>
                <Icon name="xCircle" size={15} color="#f43f5e" style={{ marginTop: 1, flexShrink: 0 }} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Solution */}
        <div style={{
          background: "rgba(16,185,129,0.06)",
          border: "1px solid rgba(16,185,129,0.2)",
          borderRadius: "var(--radius-xl)",
          padding: 40,
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 20,
          }}>
            <Icon name="shield" size={24} color="#10b981" />
          </div>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: "#6ee7b7" }}>Solusi Kami</h3>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              "Analisis CV otomatis dalam hitungan detik",
              "Penilaian objektif berbasis data & algoritma",
              "Smart matching dengan 50+ parameter evaluasi",
              "Standar penilaian konsisten & terukur",
              "Dashboard real-time untuk monitor pipeline",
            ].map((item, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--text-secondary)" }}>
                <Icon name="checkCircle" size={15} color="#10b981" style={{ marginTop: 1, flexShrink: 0 }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Research Questions */}
      <div style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-light)",
        borderRadius: "var(--radius-xl)",
        padding: 48,
        marginBottom: 80,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)",
        }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="research" size={20} color="#a5b4fc" />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800 }}>
            Pertanyaan Penelitian
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { q: "01", title: "Pemahaman Informasi CV",   desc: "Bagaimana membangun sistem yang mampu memahami informasi dalam CV secara akurat menggunakan teknologi NLP?" },
            { q: "02", title: "Pemodelan Kecocokan",       desc: "Bagaimana memodelkan kecocokan antara kandidat dan pekerjaan secara komprehensif dan terukur?" },
            { q: "03", title: "Penyajian Rekomendasi",     desc: "Bagaimana menyajikan hasil rekomendasi yang mudah dipahami dan digunakan oleh recruiter?" },
          ].map(item => (
            <div key={item.q} style={{
              display: "flex", gap: 20, padding: "20px 24px",
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.12)",
              borderRadius: "var(--radius-md)",
            }}>
              <div style={{
                fontSize: 24, fontWeight: 900, color: "#6366f1",
                fontFamily: "var(--font-display)", flexShrink: 0,
                width: 40,
              }}>{item.q}</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ marginBottom: 80 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 40 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="calendar" size={20} color="#a5b4fc" />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800 }}>
            Roadmap Pengembangan
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {timeline.map((item, i) => {
            const st = statusStyle[item.status];
            return (
              <div key={i} style={{ display: "flex", gap: 24, position: "relative" }}>
                {/* Line */}
                {i < timeline.length - 1 && (
                  <div style={{
                    position: "absolute", left: 19, top: 44, bottom: -20,
                    width: 2, background: item.status === "done" ? "#10b981" : "rgba(255,255,255,0.06)",
                    zIndex: 0,
                  }} />
                )}

                {/* Dot */}
                <div style={{ flexShrink: 0, zIndex: 1, marginTop: 4 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: st.bg, border: `2px solid ${st.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon name={st.icon} size={16} color={st.color} />
                  </div>
                </div>

                {/* Content */}
                <div style={{ paddingBottom: 32, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{item.phase}</span>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "2px 10px", borderRadius: 999,
                      fontSize: 11, fontWeight: 600, background: st.bg, color: st.color, border: `1px solid ${st.border}`,
                    }}>
                      {st.label}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{item.title}</h3>
                  <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 40 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="users" size={20} color="#a5b4fc" />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800 }}>
            Tim Pengembang
          </h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
        }}>
          {team.map((m, i) => (
            <div key={i} style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-lg)",
              padding: 28,
              textAlign: "center",
              transition: "var(--transition)",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "var(--shadow-hover)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, fontWeight: 800, color: "white",
                margin: "0 auto 16px",
              }}>{m.avatar}</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: m.color, fontWeight: 600, marginBottom: 8 }}>{m.role}</div>
              {/* ID + Status */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 14 }}>
                <span style={{
                  fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace",
                  background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-light)",
                  borderRadius: 4, padding: "2px 6px", letterSpacing: "0.3px",
                }}>
                  {m.id}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700,
                  color: "#10b981", background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.25)",
                  borderRadius: 4, padding: "2px 7px",
                }}>
                  Aktif
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6 }}>{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default AboutPage;
