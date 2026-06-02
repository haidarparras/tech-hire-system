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
    padding: "10px 14px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "10px",
    color: "white",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
    marginBottom: 10,
    fontFamily: "var(--font-sans)"
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    color: "var(--text-secondary)",
    marginBottom: 4,
    fontWeight: 600,
    fontFamily: "var(--font-sans)"
  };

  return (
    <div className="login-container">
      {/* LEFT SECTION (Form) */}
      <div className="login-left-section">
        <div style={{ maxWidth: 440, margin: "0 auto", width: "100%" }}>
          {/* Logo */}
          <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "var(--font-display)", marginBottom: 16 }}>
            <span style={{ color: "white" }}>Tech</span>
            <span style={{ color: primaryBrand }}>Hire</span>
          </div>

          <h1 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 800, marginBottom: 8, color: "white", fontFamily: "var(--font-display)" }}>
            {isLogin ? "Welcome!" : "Create Account"}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5, marginBottom: 20 }}>
            Access your TechHire dashboard to manage recruitment and unlock limitless opportunities.
          </p>

          <div style={{
            background: "var(--bg-card)",
            borderRadius: 20,
            padding: "24px 24px",
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
            marginBottom: 16
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
                  padding: "12px", 
                  marginTop: 10, 
                  fontSize: 15, 
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "white",
                  border: "none",
                  borderRadius: 10,
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
        <div style={{ position: "absolute", top: "5%", right: "-15%", width: 400, height: 400, borderRadius: "50%", background: "rgba(99, 102, 241, 0.4)", filter: "blur(110px)", pointerEvents: "none", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: "5%", left: "-15%", width: 350, height: 350, borderRadius: "50%", background: "rgba(6, 182, 212, 0.35)", filter: "blur(90px)", pointerEvents: "none", zIndex: 0 }} />

        {/* Grid Overlay */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 500, margin: "0 auto", width: "100%", paddingBottom: 10 }}>
          <div className="section-tag" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 16, background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255, 255, 255, 0.2)" }}>
            <Icon name="ai" size={13} color="#a5b4fc" /> AI Recruitment System
          </div>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 800, marginBottom: 16, lineHeight: 1.2, fontFamily: "var(--font-display)", color: "white" }}>
            Revolusi Rekrutmen Berbasis <span style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #a5f3fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}>AI Cerdas</span>
          </h2>
          <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.5, marginBottom: 32 }}>
            Unggah CV, biarkan kecerdasan buatan menyaring kualifikasi, menganalisis kompetensi, dan merekomendasikan kandidat terbaik secara instan.
          </p>

          {/* Floating Elements Mockup */}
          <div style={{ position: "relative", height: 270 }}>
            
            {/* Dashboard Mockup Card */}
            <div style={{
              position: "absolute",
              top: 15, left: 15, right: 15,
              height: 200,
              background: "rgba(13, 21, 38, 0.55)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: 20,
              boxShadow: "0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 12
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 10 }}>
                <div style={{ fontWeight: 800, color: "white", fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name="analytics" size={16} color="#6366f1" /> TechHire Intelligence
                </div>
                <div className="badge badge-success" style={{ fontSize: 10 }}>AI Active</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(99, 102, 241, 0.15)", color: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="users" size={16} color="#8b5cf6" />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "white", lineHeight: 1.2 }}>142</div>
                    <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>Total CV Masuk</div>
                  </div>
                </div>
                <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 10, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(6, 182, 212, 0.15)", color: "#06b6d4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="zap" size={16} color="#06b6d4" />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "white", lineHeight: 1.2 }}>98%</div>
                    <div style={{ fontSize: 10, color: "var(--text-secondary)" }}>Akurasi AI Match</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card 1 */}
            <div style={{
              position: "absolute",
              top: -15, right: 10,
              background: "rgba(13, 21, 38, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: 12,
              padding: "10px 16px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              display: "flex", alignItems: "center", gap: 8,
              animation: "float 6s ease-in-out infinite"
            }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="check" size={14} color="#10b981" />
              </div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 11, lineHeight: 1.3 }}>
                Proses Instan &lt; 5 Detik
              </div>
            </div>

            {/* Floating Card 2 */}
            <div style={{
              position: "absolute",
              bottom: 10, left: 10,
              background: "rgba(13, 21, 38, 0.7)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(6, 182, 212, 0.3)",
              borderRadius: 12,
              padding: "10px 16px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
              display: "flex", alignItems: "center", gap: 8,
              animation: "float 6s ease-in-out infinite",
              animationDelay: "3s"
            }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="ai" size={14} color="#06b6d4" />
              </div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 11, lineHeight: 1.3 }}>
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
          padding: 24px 6%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background-color: var(--bg-primary, #050814);
          position: relative;
          height: 100%;
          overflow: hidden;
        }

        .login-right-section {
          flex: 1 1 50%;
          min-width: 320px;
          background: linear-gradient(135deg, #0b0d1e 0%, #15193f 40%, #20265f 85%, #2a327e 100%);
          color: var(--text-primary, #f1f5f9);
          padding: 40px 6%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow: hidden;
          height: 100%;
          border-left: 1px solid var(--border-light, rgba(255, 255, 255, 0.06));
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

        /* Prevent Chrome/Edge autofill from overriding dark theme input styles */
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-text-fill-color: white !important;
          -webkit-box-shadow: 0 0 0 1000px #161f30 inset !important;
          transition: background-color 5000s ease-in-out 0s;
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
