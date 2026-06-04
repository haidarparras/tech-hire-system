import { useState } from "react";
import Icon from "./Icon";

const Sidebar = ({ activePage, setActivePage, role, onLogout, user }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  let navLinks = [];
  if (role === "admin") {
    navLinks = [
      { id: "admin-dashboard", label: "Dashboard",  icon: "dashboard"   },
      { id: "hrd-dashboard",   label: "Kandidat",   icon: "candidates"  },
      { id: "jobs",            label: "Lowongan",   icon: "briefcase"   },
      { id: "interviews",      label: "Interview",  icon: "calendar"    },
      { id: "users",           label: "Pengguna",   icon: "users"       },
      { id: "settings",        label: "Pengaturan", icon: "settings"    },
    ];
  } else if (role === "hrd") {
    navLinks = [
      { id: "hrd-dashboard", label: "Dashboard", icon: "dashboard"  },
      { id: "jobs",          label: "Lowongan",  icon: "briefcase"  },
      { id: "interviews",    label: "Interview", icon: "calendar"   },
    ];
  } else if (role === "user") {
    navLinks = [
      { id: "candidates", label: "Beranda",  icon: "home"     },
      { id: "cv-upload",  label: "Upload CV", icon: "upload"   },
    ];
  }

  const roleBadge = {
    admin: { label: "Admin", color: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)" },
    hrd:   { label: "HRD",   color: "#8b5cf6", bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.3)" },
    user:  { label: "User",  color: "#6366f1", bg: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.3)"  },
  }[role] ?? null;

  const handleNav = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header (Only visible on small screens) */}
      <div className="sidebar-mobile-header">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 800 }}>
            Tech<span style={{ color: "#6366f1" }}>Hire</span>
          </span>
          {roleBadge && (
            <span style={{ padding: "2px 8px", borderRadius: 999, fontSize: 10, fontWeight: 700, background: roleBadge.bg, color: roleBadge.color, border: `1px solid ${roleBadge.border}` }}>
              {roleBadge.label}
            </span>
          )}
        </div>
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Icon name={mobileMenuOpen ? "close" : "menu"} size={20} color="white" />
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={`sidebar-container ${mobileMenuOpen ? "open" : ""}`}>
        {/* Logo Section */}
        <div style={{ padding: "24px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--border-light)" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="cpu" size={16} color="white" />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800 }}>
            Tech<span style={{ color: "#6366f1" }}>Hire</span>
          </span>
        </div>

        {/* User Info Section */}
        {user && (
          <div style={{ padding: "24px 20px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--bg-glass-light)", border: "1px solid var(--border-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#a5b4fc" }}>
              {user.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontWeight: 600, fontSize: 15, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                {roleBadge && (
                  <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700, background: roleBadge.bg, color: roleBadge.color }}>
                    {roleBadge.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav style={{ flex: 1, padding: "0 16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 1, padding: "16px 12px 8px" }}>
            Menu Utama
          </div>
          {navLinks.map(link => {
            const isActive = activePage === link.id;
            return (
              <button 
                key={link.id} 
                onClick={() => handleNav(link.id)}
                style={{
                  background: isActive ? "rgba(99,102,241,0.15)" : "transparent",
                  border: "none",
                  borderLeft: isActive ? "3px solid #6366f1" : "3px solid transparent",
                  borderRadius: "0 8px 8px 0",
                  padding: "12px 16px",
                  color: isActive ? "#a5b4fc" : "var(--text-secondary)",
                  fontSize: 15, fontWeight: 500, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                  transition: "all 0.2s", textAlign: "left", width: "100%", fontFamily: "var(--font-sans)"
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "white"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "transparent"; } }}
              >
                <Icon name={link.icon} size={18} color={isActive ? "#a5b4fc" : "var(--text-secondary)"} />
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: "20px 16px", borderTop: "1px solid var(--border-light)" }}>
          <button 
            onClick={() => { onLogout(); setMobileMenuOpen(false); }}
            style={{
              width: "100%", padding: "12px 16px", background: "transparent", border: "1px solid rgba(244, 63, 94, 0.2)",
              borderRadius: 8, color: "#f43f5e", fontSize: 14, fontWeight: 600, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(244, 63, 94, 0.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <Icon name="arrowRight" size={16} color="#f43f5e" style={{ transform: "rotate(180deg)" }} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
