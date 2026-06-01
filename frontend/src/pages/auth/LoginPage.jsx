import { useState } from "react";
import Icon from "../../components/common/Icon";
import { apiFetch } from "../../utils/api";

const LoginPage = ({ setRole, setActivePage, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setFormRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const primaryBrand = "#6366f1";
  const primaryBrandHover = "#8b5cf6";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin 
      ? { email, password } 
      : { name, email, password, role };

    try {
      const response = await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan");
      }

      if (isLogin) {
        localStorage.setItem("techhire_token", data.token);
        localStorage.setItem("techhire_user", JSON.stringify(data.user));

        if (onLogin) {
          onLogin(data.user);
        } else {
          setRole(data.user.role);
          if (data.user.role === "admin") setActivePage("admin-dashboard");
          else if (data.user.role === "hrd") setActivePage("hrd-dashboard");
          else setActivePage("candidates");
        }
      } else {
        setIsLogin(true);
        setError("Registrasi berhasil! Silakan login.");
        setPassword("");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    color: "white",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s",
    marginBottom: 16,
    fontFamily: "var(--font-sans)"
  };

  const labelStyle = {
    display: "block",
    fontSize: 13,
    color: "var(--text-secondary)",
    marginBottom: 8,
    fontWeight: 600,
    fontFamily: "var(--font-sans)"
  };

  return (
    <div className="login-container">
      {/* LEFT SECTION (Form) */}
      <div className="login-left-section">
        <div style={{ maxWidth: 440, margin: "0 auto", width: "100%" }}>
          {/* Logo */}
          <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "var(--font-display)", marginBottom: 40 }}>
            <span style={{ color: "white" }}>Tech</span>
            <span style={{ color: primaryBrand }}>Hire</span>
          </div>

          <h1 style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 800, marginBottom: 16, color: "white", fontFamily: "var(--font-display)" }}>
            {isLogin ? "Welcome!" : "Create Account"}
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 40 }}>
            Access your TechHire dashboard to manage recruitment and unlock limitless opportunities.
          </p>

          <div style={{
            background: "var(--bg-card)",
            borderRadius: 24,
            padding: "40px 32px",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            marginBottom: 32
          }}>
            {error && (
              <div style={{
                padding: "12px", background: error.includes("berhasil") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                border: `1px solid ${error.includes("berhasil") ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                color: error.includes("berhasil") ? "#34d399" : "#f87171",
                borderRadius: 12, marginBottom: 20, fontSize: 14, fontWeight: 500
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <label style={labelStyle}>Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    placeholder="John Doe" 
                    style={inputStyle}
                    required 
                  />

                  <label style={labelStyle}>Register As</label>
                  <select 
                    value={role} 
                    onChange={e => setFormRole(e.target.value)}
                    style={{...inputStyle, cursor: "pointer"}}
                  >
                    <option value="user" style={{background: "#0f172a"}}>Candidate / Applicant</option>
                    <option value="hrd" style={{background: "#0f172a"}}>HRD / Recruiter</option>
                  </select>
                </>
              )}

              <label style={labelStyle}>Email Address</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 16, top: 15, opacity: 0.5 }}>
                  <Icon name="candidates" size={18} color="white" />
                </div>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  style={{ ...inputStyle, paddingLeft: 44 }}
                  required 
                />
              </div>

              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 16, top: 15, opacity: 0.5 }}>
                  <Icon name="search" size={18} color="white" />
                </div>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  style={{ ...inputStyle, paddingLeft: 44 }}
                  required 
                />
              </div>

              <button 
                type="submit" 
                style={{ 
                  width: "100%", 
                  padding: "16px", 
                  marginTop: 16, 
                  fontSize: 16, 
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white",
                  border: "none",
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "opacity 0.2s",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 8
                }}
                disabled={loading}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}
              >
                {loading ? "Processing..." : (isLogin ? "Masuk" : "Create Account")}
              </button>
            </form>
          </div>

          <div style={{ textAlign: "center", fontSize: 15, color: "var(--text-secondary)" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              style={{ color: primaryBrandHover, cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}
            >
              {isLogin ? "Sign up" : "Log in"}
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION (Graphics) */}
      <div className="login-right-section">
        {/* Ambient Glowing Orbs */}
        <div style={{ position: "absolute", top: "10%", right: "-10%", width: 350, height: 350, borderRadius: "50%", background: "rgba(99, 102, 241, 0.25)", filter: "blur(120px)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "10%", left: "-10%", width: 300, height: 300, borderRadius: "50%", background: "rgba(6, 182, 212, 0.2)", filter: "blur(100px)", pointerEvents: "none", zIndex: 0 }} />

        {/* Grid Overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99, 102, 241, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.04) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 500, margin: "0 auto", width: "100%", paddingBottom: 20 }}>
          <div className="section-tag" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20, background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)" }}>
            <Icon name="ai" size={13} color="#a5b4fc" /> AI Recruitment System
          </div>
          <h2 style={{ fontSize: "clamp(28px, 3.2vw, 42px)", fontWeight: 800, marginBottom: 20, lineHeight: 1.2, fontFamily: "var(--font-display)", color: "white" }}>
            Revolusi Rekrutmen Berbasis <span className="gradient-text">AI Cerdas</span>
          </h2>
          <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 48 }}>
            Unggah CV, biarkan kecerdasan buatan menyaring kualifikasi, menganalisis kompetensi, dan merekomendasikan kandidat terbaik secara instan.
          </p>

          {/* Floating Elements Mockup */}
          <div style={{ position: "relative", height: 320 }}>
            
            {/* Dashboard Mockup Card */}
            <div style={{
              position: "absolute",
              top: 30, left: 20, right: 20,
              height: 230,
              background: "rgba(13, 21, 38, 0.55)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: 24,
              boxShadow: "0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 12 }}>
                <div style={{ fontWeight: 800, color: "white", fontSize: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="analytics" size={18} color="#6366f1" /> TechHire Intelligence
                </div>
                <div className="badge badge-success" style={{ fontSize: 11 }}>AI Active</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99, 102, 241, 0.15)", color: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="users" size={18} color="#8b5cf6" />
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "white", lineHeight: 1.2 }}>142</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Total CV Masuk</div>
                  </div>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 16, padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(6, 182, 212, 0.15)", color: "#06b6d4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="zap" size={18} color="#06b6d4" />
                  </div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "white", lineHeight: 1.2 }}>98%</div>
                    <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>Akurasi AI Match</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card 1 */}
            <div style={{
              position: "absolute",
              top: -10, right: 0,
              background: "rgba(13, 21, 38, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: 16,
              padding: "12px 18px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              display: "flex", alignItems: "center", gap: 10,
              animation: "float 6s ease-in-out infinite"
            }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="check" size={16} color="#10b981" />
              </div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 12, lineHeight: 1.3 }}>
                Proses Instan &lt; 5 Detik
              </div>
            </div>

            {/* Floating Card 2 */}
            <div style={{
              position: "absolute",
              bottom: 10, left: 0,
              background: "rgba(13, 21, 38, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              borderRadius: 16,
              padding: "12px 18px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              display: "flex", alignItems: "center", gap: 10,
              animation: "float 6s ease-in-out infinite",
              animationDelay: "3s"
            }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="ai" size={16} color="#06b6d4" />
              </div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 12, lineHeight: 1.3 }}>
                Smart Skill Mapping
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          flex-wrap: wrap;
          height: 100vh;
          overflow: hidden;
          background-color: var(--bg-primary, #050814);
          color: var(--text-primary);
        }

        .login-left-section {
          flex: 1 1 50%;
          min-width: 320px;
          padding: 40px 6%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background-color: var(--bg-primary, #050814);
          position: relative;
          height: 100%;
          overflow-y: auto;
        }

        .login-right-section {
          flex: 1 1 50%;
          min-width: 320px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 60px 40px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          height: 100%;
        }

        .login-left-section::-webkit-scrollbar {
          width: 6px;
        }
        .login-left-section::-webkit-scrollbar-track {
          background: transparent;
        }
        .login-left-section::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.3);
          border-radius: 9999px;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        @media (max-width: 800px) {
          .login-container {
            height: auto;
            min-height: 100vh;
            overflow: auto;
          }
          .login-left-section {
            height: auto;
            overflow: visible;
            padding: 60px 24px 40px;
          }
          .login-right-section {
            height: auto;
            overflow: visible;
            padding: 40px 24px 60px;
          }
          .glass-card { margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
