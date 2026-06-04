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

      // Jika response gagal, tampilkan error dan JANGAN redirect
      if (!response.ok) {
        setError(data.error || data.message || "Terjadi kesalahan");
        setLoading(false);
        return; // STOP di sini, jangan lanjut ke redirect
      }

      // Hanya eksekusi bagian ini jika login/register SUKSES
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
      // Catch untuk error jaringan/fetch, bukan error login
      setError(err.message || "Terjadi kesalahan koneksi");
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
    <div style={{
      display: "flex", 
      flexWrap: "wrap",
      minHeight: "100vh",
      backgroundColor: "var(--bg-dark)",
      color: "var(--text-primary)"
    }}>
      {/* LEFT SECTION (Form) */}
      <div style={{
        flex: "1 1 50%",
        minWidth: 320,
        padding: "40px 6%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "var(--bg-dark)",
        position: "relative"
      }}>
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
                {loading ? "Processing..." : (isLogin ? "Continue with E-mail" : "Create Account")}
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
      <div style={{
        flex: "1 1 50%",
        minWidth: 320,
        backgroundColor: primaryBrand,
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        color: "white",
        padding: "60px 40px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Decorative Circles */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", border: "40px solid rgba(255,255,255,0.05)", zIndex: 0 }} />
        <div style={{ position: "absolute", bottom: -50, left: -50, width: 250, height: 250, borderRadius: "50%", border: "20px solid rgba(255,255,255,0.05)", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 500, margin: "0 auto", width: "100%", paddingTop: "10vh" }}>
          <h2 style={{ fontSize: "clamp(32px, 3.5vw, 48px)", fontWeight: 800, marginBottom: 24, lineHeight: 1.15, fontFamily: "var(--font-display)" }}>
            Unlock Limitless Opportunities
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.9)", lineHeight: 1.6, marginBottom: 60 }}>
            Partner with us to elevate your potential and achieve impactful, long-term success.
          </p>

          {/* Floating Elements Mockup */}
          <div style={{ position: "relative", height: 300 }}>
            
            {/* Dashboard Mockup Card */}
            <div style={{
              position: "absolute",
              top: 0, left: 40, right: -40,
              height: 250,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 24,
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
              padding: 24,
              display: "flex",
              flexDirection: "column",
              gap: 16
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 12 }}>
                <div style={{ fontWeight: 800, color: "white", fontSize: 18 }}>Dashboard</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.2)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="users" size={16} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>27</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Total Candidates</div>
                  </div>
                </div>
                <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: 12, display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.2)", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="briefcase" size={16} color="white" />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "white" }}>8</div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.7)" }}>Current Openings</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card 1 */}
            <div style={{
              position: "absolute",
              top: -30, right: 20,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "20px 24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              textAlign: "center",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              animation: "float 6s ease-in-out infinite"
            }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="briefcase" size={24} color="white" />
              </div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 13, maxWidth: 120, lineHeight: 1.4 }}>
                No Extra Cost To Manage Recruitment
              </div>
            </div>

            {/* Floating Card 2 */}
            <div style={{
              position: "absolute",
              bottom: -20, left: -20,
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "20px 24px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              textAlign: "center",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
              animation: "float 6s ease-in-out infinite",
              animationDelay: "3s"
            }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="ai" size={24} color="white" />
              </div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 13, maxWidth: 120, lineHeight: 1.4 }}>
                AI-Powered Resume Filtering
              </div>
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        /* Add some specific responsive adjustments */
        @media (max-width: 800px) {
          .glass-card { margin: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
