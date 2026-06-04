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

  // Definisi warna secara lokal di dalam komponen
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
        setError(data.error || "Login gagal, periksa email dan password Anda.");
        setLoading(false);
        return;
      }

      if (isLogin) {
        localStorage.setItem("techhire_token", data.token);
        localStorage.setItem("techhire_user", JSON.stringify(data.user));
        if (onLogin) onLogin(data.user);
      } else {
        setIsLogin(true);
        setError("Registrasi berhasil! Silakan login.");
        setPassword("");
      }
    } catch (err) {
      setError("Gagal terhubung ke server. Silakan coba lagi.");
      setLoading(false);
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
    <div style={{ display: "flex", flexWrap: "wrap", minHeight: "100vh", backgroundColor: "var(--bg-dark)", color: "var(--text-primary)" }}>
      {/* LEFT SECTION */}
      <div style={{ flex: "1 1 50%", minWidth: 320, padding: "40px 6%", display: "flex", flexDirection: "column", justifyContent: "center", backgroundColor: "var(--bg-dark)", position: "relative" }}>
        <div style={{ maxWidth: 440, margin: "0 auto", width: "100%" }}>
          <div style={{ fontSize: 28, fontWeight: 900, fontFamily: "var(--font-display)", marginBottom: 40 }}>
            <span style={{ color: "white" }}>Tech</span>
            <span style={{ color: primaryBrand }}>Hire</span>
          </div>

          <h1 style={{ fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 800, marginBottom: 16, color: "white", fontFamily: "var(--font-display)" }}>
            {isLogin ? "Welcome!" : "Create Account"}
          </h1>
          
          <div style={{ background: "var(--bg-card)", borderRadius: 24, padding: "40px 32px", border: "1px solid rgba(255,255,255,0.05)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)", marginBottom: 32 }}>
            {error && (
              <div style={{ padding: "12px", background: error.includes("berhasil") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", border: `1px solid ${error.includes("berhasil") ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`, color: error.includes("berhasil") ? "#34d399" : "#f87171", borderRadius: 12, marginBottom: 20, fontSize: 14, fontWeight: 500 }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <>
                  <label style={labelStyle}>Full Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" style={inputStyle} required />
                  <label style={labelStyle}>Register As</label>
                  <select value={role} onChange={e => setFormRole(e.target.value)} style={{...inputStyle, cursor: "pointer"}}>
                    <option value="user" style={{background: "#0f172a"}}>Candidate / Applicant</option>
                    <option value="hrd" style={{background: "#0f172a"}}>HRD / Recruiter</option>
                  </select>
                </>
              )}
              <label style={labelStyle}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address" style={inputStyle} required />
              <label style={labelStyle}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} required />
              
              <button type="submit" style={{ width: "100%", padding: "16px", marginTop: 16, fontSize: 16, fontWeight: 700, background: `linear-gradient(135deg, ${primaryBrand}, ${primaryBrandHover})`, color: "white", border: "none", borderRadius: 12, cursor: "pointer" }} disabled={loading}>
                {loading ? "Processing..." : (isLogin ? "Continue with E-mail" : "Create Account")}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION (Graphics) */}
      <div style={{ flex: "1 1 50%", minWidth: 320, background: `linear-gradient(135deg, ${primaryBrand} 0%, ${primaryBrandHover} 100%)`, color: "white", padding: "60px 40px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
         {/* Konten Grafis tetap sama... */}
      </div>
    </div>
  );
};

export default LoginPage;