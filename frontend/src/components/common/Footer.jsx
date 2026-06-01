import Icon from "./Icon";

const Footer = ({ setActivePage }) => (
  <footer style={{
    borderTop: "1px solid var(--border-light)",
    background: "var(--bg-secondary)",
    padding: "20px 24px",
  }}>
    <div style={{ 
      maxWidth: 1200, 
      margin: "0 auto", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "space-between", 
      flexWrap: "wrap", 
      gap: 16 
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6,
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="cpu" size={12} color="white" />
        </div>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 800 }}>
          Tech<span style={{ color: "#6366f1" }}>Hire</span>
        </span>
      </div>

      <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
        © 2025 TechHire Intelligence System. Dibuat dengan{" "}
        <Icon name="experience" size={12} color="#f43f5e" style={{ display: "inline", verticalAlign: "middle" }} />
      </p>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span className="badge badge-primary" style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px" }}>
          <Icon name="zap" size={10} color="#a5b4fc" /> AI Powered
        </span>
        <span className="badge badge-success" style={{ fontSize: 11, display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px" }}>
          <Icon name="check" size={10} color="#6ee7b7" /> v1.0.0
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
