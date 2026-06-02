import { useState, useEffect } from "react";
import "./index.css";
import Navbar from "./components/common/Navbar";
import HeroPage from "./pages/public/HeroPage";
import FeaturesPage from "./pages/public/FeaturesPage";
import AboutPage from "./pages/public/AboutPage";
import Footer from "./components/common/Footer";
import Sidebar from "./components/common/Sidebar";
import LoginPage from "./pages/auth/LoginPage";
import Icon from "./components/common/Icon";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersPage from "./pages/admin/UsersPage";
import SettingsPage from "./pages/admin/SettingsPage";

// HRD pages
import HRDDashboard from "./pages/hrd/HRDDashboard";
import JobsPage from "./pages/hrd/JobsPage";
import InterviewsPage from "./pages/hrd/InterviewsPage";

// Shared / User pages
import CVUploadPage from "./pages/user/CVUploadPage";
import CandidateDashboard from "./pages/user/CandidateDashboard";

const PageWrapper = ({ children }) => (
  <div style={{ animation: "fadeInUp 0.4s ease-out" }}>
    {children}
  </div>
);

function App() {
  const [activePage, setActivePage] = useState("home");
  const [role, setRole] = useState("guest");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("techhire_user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setRole(userData.role);
        setUser(userData);
        // Auto-redirect if on home page
        if (activePage === "home" || activePage === "login") {
          if (userData.role === "admin") setActivePage("admin-dashboard");
          else if (userData.role === "hrd") setActivePage("hrd-dashboard");
          else setActivePage("candidates");
        }
      } catch (e) {}
    }
  }, []);

  const handleLogin = (userData) => {
    setRole(userData.role);
    setUser(userData);
    if (userData.role === "admin") setActivePage("admin-dashboard");
    else if (userData.role === "hrd") setActivePage("hrd-dashboard");
    else setActivePage("candidates");
  };

  const handleLogout = () => {
    localStorage.removeItem("techhire_token");
    localStorage.removeItem("techhire_user");
    setRole("guest");
    setUser(null);
    setActivePage("home");
  };

  const renderPage = () => {
    switch (activePage) {

      // ── Public ──────────────────────────────────────────────────
      case "home":
        return (
          <PageWrapper>
            <HeroPage setActivePage={setActivePage} />
            <div className="mini-feature-grid">
              {[
                { icon: <Icon name="cpu" size={24} color="#6366f1" />,      title: "Analisis CV Otomatis",  desc: "Ekstrak informasi CV dalam hitungan detik",         color: "#6366f1" },
                { icon: <Icon name="target" size={24} color="#8b5cf6" />,   title: "Smart Matching",        desc: "Skor kecocokan berbasis 50+ parameter",             color: "#8b5cf6" },
                { icon: <Icon name="analytics" size={24} color="#06b6d4" />,title: "Analytics Real-time",   desc: "Pantau pipeline rekrutmen secara langsung",         color: "#06b6d4" },
                { icon: <Icon name="zap" size={24} color="#10b981" />,      title: "Rekomendasi AI",        desc: "Top kandidat dipilih otomatis oleh AI",             color: "#10b981" },
              ].map((item, i) => (
                <div key={i}
                  onClick={() => setActivePage(i === 2 ? "hrd-dashboard" : i === 0 ? "candidates" : "features")}
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "24px 28px", cursor: "pointer", transition: "var(--transition)", display: "flex", alignItems: "flex-start", gap: 16 }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = `${item.color}50`; e.currentTarget.style.boxShadow = `0 8px 30px ${item.color}20`; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--border-light)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${item.color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{item.title}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Banner */}
            <div className="cta-banner-wrapper">
              <div className="cta-banner-inner" style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 50%, rgba(6,182,212,0.15) 100%)", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "var(--radius-xl)", padding: "56px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                <div style={{ position: "relative" }}>
                  <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 800, marginBottom: 16 }}>
                    Siap Merevolusi Proses Rekrutmen Anda?
                  </h2>
                  <p style={{ fontSize: 16, color: "var(--text-secondary)", marginBottom: 36, maxWidth: 500, margin: "0 auto 36px" }}>
                    Bergabung dengan ratusan perusahaan yang sudah menggunakan AI untuk menemukan talenta terbaik mereka.
                  </p>
                  <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                    <button className="btn-primary" onClick={() => setActivePage(role === "user" ? "candidates" : "login")}
                      style={{ fontSize: 16, padding: "14px 36px", display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon name="document" size={20} color="white" /> Upload CV Pertama
                    </button>
                    <button className="btn-secondary" onClick={() => setActivePage(role === "admin" ? "admin-dashboard" : role === "hrd" ? "hrd-dashboard" : "login")}
                      style={{ fontSize: 16, padding: "14px 36px", display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon name="dashboard" size={20} color="currentColor" /> Lihat Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </PageWrapper>
        );

      case "features":
        return <PageWrapper><FeaturesPage /></PageWrapper>;

      case "about":
        return <PageWrapper><AboutPage /></PageWrapper>;

      case "login":
        return <PageWrapper><LoginPage setRole={setRole} setActivePage={setActivePage} onLogin={handleLogin} /></PageWrapper>;

      // ── User ────────────────────────────────────────────────────
      case "candidates":
        if (role !== "user") return <PageWrapper><LoginPage setRole={setRole} setActivePage={setActivePage} onLogin={handleLogin} /></PageWrapper>;
        return <PageWrapper><CandidateDashboard setActivePage={setActivePage} user={user} /></PageWrapper>;

      case "cv-upload":
        if (role !== "user") return <PageWrapper><LoginPage setRole={setRole} setActivePage={setActivePage} onLogin={handleLogin} /></PageWrapper>;
        return <PageWrapper><CVUploadPage /></PageWrapper>;

      // ── Admin ───────────────────────────────────────────────────
      case "admin-dashboard":
        if (role !== "admin") return <PageWrapper><LoginPage setRole={setRole} setActivePage={setActivePage} onLogin={handleLogin} /></PageWrapper>;
        return <PageWrapper><AdminDashboard setActivePage={setActivePage} user={user} /></PageWrapper>;

      case "users":
        if (role !== "admin") return <PageWrapper><LoginPage setRole={setRole} setActivePage={setActivePage} onLogin={handleLogin} /></PageWrapper>;
        return <PageWrapper><UsersPage /></PageWrapper>;

      case "settings":
        if (role !== "admin") return <PageWrapper><LoginPage setRole={setRole} setActivePage={setActivePage} onLogin={handleLogin} /></PageWrapper>;
        return <PageWrapper><SettingsPage /></PageWrapper>;

      // ── HRD (& Admin can view) ───────────────────────────────────
      case "hrd-dashboard":
        if (role !== "hrd" && role !== "admin") return <PageWrapper><LoginPage setRole={setRole} setActivePage={setActivePage} onLogin={handleLogin} /></PageWrapper>;
        return <PageWrapper><HRDDashboard setActivePage={setActivePage} user={user} /></PageWrapper>;

      case "jobs":
        if (role !== "hrd" && role !== "admin") return <PageWrapper><LoginPage setRole={setRole} setActivePage={setActivePage} onLogin={handleLogin} /></PageWrapper>;
        return <PageWrapper><JobsPage /></PageWrapper>;

      case "interviews":
        if (role !== "hrd" && role !== "admin") return <PageWrapper><LoginPage setRole={setRole} setActivePage={setActivePage} onLogin={handleLogin} /></PageWrapper>;
        return <PageWrapper><InterviewsPage setActivePage={setActivePage} /></PageWrapper>;

      case "hrd-upload":
        if (role !== "hrd" && role !== "admin") return <PageWrapper><LoginPage setRole={setRole} setActivePage={setActivePage} onLogin={handleLogin} /></PageWrapper>;
        return <PageWrapper><CVUploadPage setActivePage={setActivePage} /></PageWrapper>;

      // ── Admin also has access to candidates pipeline ─────────────
      case "candidates-admin":
        if (role !== "admin" && role !== "hrd") return <PageWrapper><LoginPage setRole={setRole} setActivePage={setActivePage} onLogin={handleLogin} /></PageWrapper>;
        return <PageWrapper><HRDDashboard setActivePage={setActivePage} user={user} /></PageWrapper>;

      default:
        return <PageWrapper><HeroPage setActivePage={setActivePage} /></PageWrapper>;
    }
  };

  const isShowingLogin = () => {
    if (activePage === "login") return true;
    if (activePage === "candidates" && role !== "user") return true;
    if (activePage === "cv-upload" && role !== "user") return true;
    if (activePage === "admin-dashboard" && role !== "admin") return true;
    if (activePage === "users" && role !== "admin") return true;
    if (activePage === "settings" && role !== "admin") return true;
    if (activePage === "hrd-dashboard" && role !== "hrd" && role !== "admin") return true;
    if (activePage === "jobs" && role !== "hrd" && role !== "admin") return true;
    if (activePage === "interviews" && role !== "hrd" && role !== "admin") return true;
    if (activePage === "candidates-admin" && role !== "admin" && role !== "hrd") return true;
    return false;
  };

  const isDashboardRoute = () => {
    if (activePage === "home" || activePage === "features" || activePage === "about") return false;
    if (activePage === "login") return false;
    return true;
  };

  const showAuthPage = isShowingLogin();
  const showDashboardLayout = isDashboardRoute() && role !== "guest" && !showAuthPage;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {showDashboardLayout ? (
        <>
          <Sidebar activePage={activePage} setActivePage={setActivePage} role={role} onLogout={handleLogout} user={user} />
          <main className="dashboard-main">
            {renderPage()}
            <Footer setActivePage={setActivePage} />
          </main>
        </>
      ) : (
        <>
          {!showAuthPage && <Navbar activePage={activePage} setActivePage={setActivePage} role={role} onLogout={handleLogout} user={user} />}
          <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {renderPage()}
          </main>
          {!showAuthPage && <Footer setActivePage={setActivePage} />}
        </>
      )}
    </div>
  );
}

export default App;
