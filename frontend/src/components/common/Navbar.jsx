import { useState, useEffect } from "react";
import Icon from "./Icon";

const Navbar = ({ activePage, setActivePage, role, onLogout, user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Role-based nav menus
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
  } else {
    navLinks = [
      { id: "home",     label: "Beranda", icon: "home"     },
      { id: "features", label: "Fitur",   icon: "features" },
      { id: "about",    label: "Tentang", icon: "about"    },
    ];
  }

  const handleNav = (id) => { setActivePage(id); setMenuOpen(false); };

  const handleAuth = () => {
    if (role === "guest") { setActivePage("login"); }
    else { onLogout?.(); }
    setMenuOpen(false);
  };

  // Role badge config
  const roleBadge = {
    admin: { label: "Admin", color: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)" },
    hrd:   { label: "HRD",   color: "#8b5cf6", bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.3)" },
    user:  { label: "User",  color: "#6366f1", bg: "rgba(99,102,241,0.15)",  border: "rgba(99,102,241,0.3)"  },
  }[role] ?? null;

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 24px", transition: "all 0.3s ease",
        background: scrolled ? "rgba(5, 8, 20, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(99,102,241,0.15)" : "none",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>

          {/* Logo */}
          <button onClick={() => handleNav(role === "admin" ? "admin-dashboard" : role === "hrd" ? "hrd-dashboard" : "home")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: "var(--text-primary)" }}>
              Tech<span style={{ color: "#6366f1" }}>Hire</span>
            </span>
            {roleBadge && (
              <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: roleBadge.bg, color: roleBadge.color, border: `1px solid ${roleBadge.border}` }}>
                {roleBadge.label}
              </span>
            )}
          </button>

          {/* Desktop Nav */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="desktop-nav">
            {navLinks.map(link => (
              <button key={link.id} onClick={() => handleNav(link.id)}
                style={{
                  background: activePage === link.id ? "rgba(99,102,241,0.15)" : "none",
                  border: activePage === link.id ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                  borderRadius: "var(--radius-full)",
                  padding: "8px 16px",
                  color: activePage === link.id ? "#a5b4fc" : "var(--text-secondary)",
                  fontSize: 14, fontWeight: 500, cursor: "pointer",
                  transition: "var(--transition)", fontFamily: "var(--font-sans)",
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}
                onMouseEnter={e => { if (activePage !== link.id) { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; } }}
                onMouseLeave={e => { if (activePage !== link.id) { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.background = "none"; } }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* User info pill */}
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px", background: "rgba(255,255,255,0.04)", border: "1px solid var(--border-light)", borderRadius: 999 }}
                className="desktop-nav">
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "white" }}>
                  {user.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }} className="navbar-cta-label">
                  {user.name?.split(" ")[0]}
                </span>
              </div>
            )}

            {role === "guest" ? (
              <button onClick={handleAuth} className="btn-secondary"
                style={{
                  padding: "8px 20px",
                  fontSize: 14,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  border: "1px solid rgba(99,102,241,0.45)",
                  color: "#a5b4fc",
                  background: "transparent",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(99,102,241,0.12)";
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.7)";
                  e.currentTarget.style.color = "#c7d2fe";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(99,102,241,0.45)";
                  e.currentTarget.style.color = "#a5b4fc";
                }}
              >
                <span className="navbar-cta-label">Masuk</span>
                <Icon name="arrowRight" size={15} color="currentColor" />
              </button>
            ) : (
              <button onClick={handleAuth} className="btn-secondary"
                style={{ padding: "10px 22px", fontSize: 14, color: "#f43f5e", borderColor: "rgba(244,63,94,0.3)", display: "flex", alignItems: "center", gap: 6 }}>
                <span className="navbar-cta-label">Keluar</span>
              </button>
            )}

            <button className="mobile-menu-btn" onClick={() => setMenuOpen(prev => !prev)} aria-label="Toggle menu">
              {menuOpen
                ? <Icon name="close" size={20} color="var(--text-primary)" />
                : <Icon name="menu" size={20} color="var(--text-primary)" />
              }
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <div className={`mobile-nav-dropdown ${menuOpen ? "open" : ""}`}>
        {navLinks.map(link => (
          <button key={link.id} onClick={() => handleNav(link.id)}
            className={`mobile-nav-link ${activePage === link.id ? "active" : ""}`}>
            <Icon name={link.icon} size={17} color={activePage === link.id ? "#a5b4fc" : "var(--text-secondary)"} style={{ marginRight: 10 }} />
            {link.label}
          </button>
        ))}
        <div style={{ height: 1, background: "var(--border-light)", margin: "8px 0" }} />
        {user && (
          <div style={{ padding: "10px 16px", fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="candidates" size={14} color="var(--text-muted)" />
            {user.name} · {user.email}
          </div>
        )}
        {role === "guest" ? (
          <button onClick={handleAuth} className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
            Masuk <Icon name="arrowRight" size={16} color="white" />
          </button>
        ) : (
          <button onClick={handleAuth} className="btn-secondary"
            style={{ width: "100%", justifyContent: "center", marginTop: 4, color: "#f43f5e", borderColor: "rgba(244,63,94,0.3)" }}>
            Keluar
          </button>
        )}
      </div>
    </>
  );
};

export default Navbar;
