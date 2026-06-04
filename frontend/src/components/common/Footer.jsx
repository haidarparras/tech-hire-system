import Icon from "./Icon";

const Footer = ({ setActivePage }) => {
  const year = new Date().getFullYear();

  const navLinks = [
    {
      heading: "Platform",
      links: [
        { label: "Beranda",       page: "home"     },
        { label: "Fitur",         page: "features" },
        { label: "Tentang",       page: "about"    },
      ],
    },
    {
      heading: "Produk",
      links: [
        { label: "AI CV Analyzer",       page: "features" },
        { label: "Smart Matching",       page: "features" },
        { label: "Analytics Dashboard",  page: "features" },
        { label: "Anti-Bias System",     page: "features" },
      ],
    },
    {
      heading: "Akun",
      links: [
        { label: "Masuk",          page: "login"     },
        { label: "Upload CV",      page: "candidates" },
        { label: "Dashboard HRD",  page: "hrd-dashboard" },
      ],
    },
  ];

  return (
    <footer style={{
      background: "var(--bg-secondary)",
      borderTop: "1px solid var(--border-light)",
      marginTop: "auto",
    }}>
      {/* Main footer body */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "56px 24px 40px",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: 48,
      }}
        className="footer-body-grid"
      >
        {/* Brand column */}
        <div>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Icon name="cpu" size={16} color="white" />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800 }}>
              Tech<span style={{ color: "#6366f1" }}>Hire</span>
            </span>
          </div>

          {/* Tagline */}
          <p style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            lineHeight: 1.7,
            marginBottom: 24,
            maxWidth: 280,
          }}>
            Platform rekrutmen berbasis AI yang membantu perusahaan menemukan talenta tech terbaik secara lebih cepat dan objektif.
          </p>

          {/* Badges */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="badge badge-success" style={{
              fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px",
            }}>
              <Icon name="check" size={10} color="#6ee7b7" /> v1.0.0
            </span>
          </div>
        </div>

        {/* Nav columns */}
        {navLinks.map((col) => (
          <div key={col.heading}>
            <div style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.8px",
              marginBottom: 20,
            }}>
              {col.heading}
            </div>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {col.links.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => setActivePage?.(link.page)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      fontSize: 14,
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-sans)",
                      transition: "color 0.2s",
                      textAlign: "left",
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--text-primary)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--text-secondary)"}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div style={{
        borderTop: "1px solid var(--border-light)",
        maxWidth: 1200,
        margin: "0 auto",
      }} />

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
          © {year} TechHire Intelligence System. Dibuat dengan{" "}
          <Icon name="experience" size={12} color="#f43f5e" style={{ display: "inline", verticalAlign: "middle" }} />
          {" "}untuk masa depan rekrutmen.
        </p>
        <p style={{ fontSize: 12, color: "var(--text-muted)", margin: 0 }}>
          FullStack Web Developer · Data Scientist · AI Engineer
        </p>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .footer-body-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
          }
          .footer-body-grid > div:first-child {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 480px) {
          .footer-body-grid {
            grid-template-columns: 1fr 1fr !important;
            padding: 40px 16px 28px !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
