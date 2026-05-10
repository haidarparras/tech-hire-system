// src/components/layout/Navbar.jsx

import { NavLink, useLocation } from "react-router-dom";
import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";

export default function Navbar() {
  const location = useLocation();
  const { theme, colors, toggleTheme } = useTheme();

  // Cek apakah sedang di halaman prediksi detail (/prediksi/:id)
  const isPrediksiPage = location.pathname.startsWith("/prediksi");

  // Menu navigasi utama
  const navItems = [
    { to: "/", label: "Upload CV", end: true },
    { to: "/dashboard", label: "Dashboard", end: false },
    {
      to: isPrediksiPage ? location.pathname : "/prediksi/1",
      label: "Hasil Prediksi",
      end: false,
    },
  ];

  return (
    <nav
      className="navbar"
      style={{
        background: colors.navbarBackground,
        borderBottom: `1px solid ${colors.border}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
      <style>{`
        .navbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          min-height: 56px;
        }
        .nav-links {
          display: flex;
          gap: 4px;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        @media (max-width: 767px) {
          .navbar {
            flex-direction: column;
            padding: 12px 16px;
            gap: 12px;
          }
          .nav-links {
            width: 100%;
            justify-content: center;
            overflow-x: auto;
            padding-bottom: 4px;
          }
          .nav-item {
            line-height: 36px !important;
            padding: 0 10px !important;
            white-space: nowrap;
          }
          .nav-right {
            width: 100%;
            justify-content: space-between;
            border-top: 1px solid ${colors.border};
            padding-top: 10px;
          }
        }
      `}</style>

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accentHover})`,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 800,
            color: "#fff",
          }}>
          T
        </div>
        <span style={{ color: colors.text, fontWeight: 700, fontSize: 15 }}>
          TechHire Intelligence
        </span>
      </div>

      {/* Navigation */}
      <div className="nav-links">
        {navItems.map(({ to, label, end }) => (
          <NavLink
            key={`${to}-${label}`}
            to={to}
            end={end}
            className="nav-item"
            style={({ isActive }) => ({
              color: isActive ? colors.text : colors.textMuted,
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              padding: "6px 14px",
              textDecoration: "none",
              borderBottom: isActive
                ? `2px solid ${colors.accent}`
                : "2px solid transparent",
              display: "inline-block",
              lineHeight: "44px",
              transition: "all 0.15s ease",
            })}>
            {label}
          </NavLink>
        ))}
      </div>

      {/* Right Section */}
      <div className="nav-right">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Mode terang" : "Mode gelap"}
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: `1px solid ${colors.border}`,
            background: colors.buttonBackground,
            color: colors.text,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}>
          {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* User */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3b82f6, #6366f1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
            }}>
            HP
          </div>
          <span style={{ color: colors.textSecondary, fontSize: 14 }}>
            Haidar
          </span>
        </div>
      </div>
    </nav>
  );
}
