import { useState, useEffect } from "react";
import Icon from "../../components/common/Icon";
import { AI_URL } from "../../utils/api";

const Toggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)}
    style={{ width: 44, height: 24, borderRadius: 999, background: value ? "#6366f1" : "rgba(255,255,255,0.1)", cursor: "pointer", position: "relative", transition: "var(--transition)", flexShrink: 0 }}>
    <div style={{ width: 18, height: 18, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: value ? 23 : 3, transition: "var(--transition)", boxShadow: "0 1px 4px rgba(0,0,0,0.4)" }} />
  </div>
);

const Section = ({ title, icon, children }) => (
  <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "28px 32px", marginBottom: 20 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--border-light)" }}>
      <Icon name={icon} size={18} color="#a5b4fc" />
      <h2 style={{ fontSize: 16, fontWeight: 700 }}>{title}</h2>
    </div>
    {children}
  </div>
);

const Row = ({ label, desc, children }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
    <div>
      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{label}</div>
      {desc && <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{desc}</div>}
    </div>
    {children}
  </div>
);

const SettingsPage = () => {
  // Load dari localStorage atau pakai default
  const [aiThreshold, setAiThreshold] = useState(() => {
    const saved = localStorage.getItem("settings_aiThreshold");
    return saved ? Number(saved) : 75;
  });
  const [maxCandidates, setMaxCandidates] = useState(() => {
    const saved = localStorage.getItem("settings_maxCandidates");
    return saved ? Number(saved) : 100;
  });
  const [emailNotif, setEmailNotif] = useState(() => {
    const saved = localStorage.getItem("settings_emailNotif");
    return saved ? saved === "true" : true;
  });
  const [autoRecommend, setAutoRecommend] = useState(() => {
    const saved = localStorage.getItem("settings_autoRecommend");
    return saved ? saved === "true" : true;
  });
  const [saved, setSaved] = useState(false);

  // AI Model Status
  const [aiStatus, setAiStatus] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [reloading, setReloading] = useState(false);

  const checkAIStatus = async () => {
    setCheckingStatus(true);
    try {
      const res = await fetch(`${AI_URL}/api/ai/status`);
      const data = await res.json();
      setAiStatus(data);
    } catch (err) {
      setAiStatus({ error: "Tidak dapat terhubung ke AI service" });
    }
    setCheckingStatus(false);
  };

  const reloadModel = async () => {
    setReloading(true);
    try {
      const res = await fetch(`${AI_URL}/api/ai/reload`, { method: "POST" });
      const data = await res.json();
      alert(data.message || "Model berhasil di-reload");
      await checkAIStatus(); // Refresh status
    } catch (err) {
      alert("Gagal reload model: " + err.message);
    }
    setReloading(false);
  };

  useEffect(() => {
    checkAIStatus();
  }, []);

  const handleSave = () => {
    // Simpan ke localStorage
    localStorage.setItem("settings_aiThreshold", aiThreshold);
    localStorage.setItem("settings_maxCandidates", maxCandidates);
    localStorage.setItem("settings_emailNotif", emailNotif);
    localStorage.setItem("settings_autoRecommend", autoRecommend);
    
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: 12 }}>
            <Icon name="settings" size={13} color="#a5b4fc" /> Admin Only
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, marginBottom: 6 }}>
            Pengaturan Sistem
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>Konfigurasi AI, notifikasi, dan preferensi rekrutmen.</p>
        </div>

        {saved && (
          <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "var(--radius-md)", padding: "12px 18px", marginBottom: 24, fontSize: 14, color: "#6ee7b7", display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="checkCircle" size={16} color="#6ee7b7" /> Pengaturan berhasil disimpan.
          </div>
        )}

        {/* AI Settings */}
        <Section title="Konfigurasi AI Scoring" icon="cpu">
          {/* AI Model Status */}
          <div style={{ background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "var(--radius-md)", padding: "16px 20px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="activity" size={16} color="#a5b4fc" />
                <span style={{ fontSize: 13, fontWeight: 600, color: "#c7d2fe" }}>Status Model AI</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={checkAIStatus} disabled={checkingStatus}
                  style={{ padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: checkingStatus ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", opacity: checkingStatus ? 0.5 : 1 }}>
                  {checkingStatus ? "Checking..." : "Refresh"}
                </button>
                <button onClick={reloadModel} disabled={reloading}
                  style={{ padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: reloading ? "not-allowed" : "pointer", fontFamily: "var(--font-sans)", background: "#6366f1", border: "1px solid #818cf8", color: "white", opacity: reloading ? 0.5 : 1 }}>
                  {reloading ? "Reloading..." : "Reload Model"}
                </button>
              </div>
            </div>
            
            {aiStatus && !aiStatus.error && (
              <div style={{ display: "grid", gap: 8, fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Files Present:</span>
                  <span style={{ fontWeight: 600, color: aiStatus.model_files_present ? "#6ee7b7" : "#fca5a5" }}>
                    {aiStatus.model_files_present ? "✓ Yes" : "✗ No"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Model Loaded:</span>
                  <span style={{ fontWeight: 600, color: aiStatus.model_loaded ? "#6ee7b7" : "#fca5a5" }}>
                    {aiStatus.model_loaded ? "✓ Loaded" : "✗ Not Loaded"}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-secondary)" }}>Categories:</span>
                  <span style={{ fontWeight: 600, color: "#c7d2fe" }}>{aiStatus.categories?.length || 0}</span>
                </div>
                {!aiStatus.model_loaded && (
                  <div style={{ marginTop: 8, padding: "10px 14px", background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 6, fontSize: 12, color: "#fcd34d", lineHeight: 1.5 }}>
                    ⚠️ Model tidak ter-load. Skor AI akan selalu 75%. Klik "Reload Model" atau restart HuggingFace Space.
                  </div>
                )}
              </div>
            )}
            
            {aiStatus?.error && (
              <div style={{ padding: "10px 14px", background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 6, fontSize: 12, color: "#fca5a5" }}>
                ✗ {aiStatus.error}
              </div>
            )}
          </div>

          <Row label="Threshold Skor AI" desc={`Kandidat dengan skor di atas ${aiThreshold}% otomatis direkomendasikan.`}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input type="range" min={50} max={95} value={aiThreshold} onChange={e => setAiThreshold(Number(e.target.value))}
                style={{ width: 120, accentColor: "#6366f1" }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#a5b4fc", minWidth: 38 }}>{aiThreshold}%</span>
            </div>
          </Row>
          <Row label="Rekrutmen Otomatis" desc="Kandidat di atas threshold langsung berstatus Rekomendasi.">
            <Toggle value={autoRecommend} onChange={setAutoRecommend} />
          </Row>
          <Row label="Maks. Kandidat Diproses" desc="Batas maksimum kandidat yang bisa diproses per bulan.">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input type="number" min={10} max={1000} value={maxCandidates} onChange={e => setMaxCandidates(Number(e.target.value))}
                style={{ width: 80, background: "var(--bg-glass-light)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)", padding: "6px 10px", color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none", textAlign: "center" }} />
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>per bulan</span>
            </div>
          </Row>
        </Section>

        {/* Notifications */}
        <Section title="Notifikasi" icon="chat">
          <Row label="Notifikasi Email" desc="Kirim email saat kandidat baru masuk atau status berubah.">
            <Toggle value={emailNotif} onChange={setEmailNotif} />
          </Row>
          <Row label="Ringkasan Mingguan" desc="Laporan rekrutmen dikirim setiap Senin pagi.">
            <Toggle value={true} onChange={() => {}} />
          </Row>
        </Section>

        {/* Danger Zone */}
        <Section title="Zona Berbahaya" icon="warning">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Reset Semua Data Kandidat", desc: "Hapus seluruh data kandidat dari sistem. Tidak dapat dibatalkan.", color: "#f43f5e" },
              { label: "Reset Database Jobs", desc: "Hapus semua lowongan yang tercatat.", color: "#f59e0b" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{item.desc}</div>
                </div>
                <button style={{ padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)", background: `${item.color}15`, border: `1px solid ${item.color}40`, color: item.color, whiteSpace: "nowrap" }}
                  onClick={() => window.confirm("Tindakan ini tidak dapat dibatalkan. Lanjutkan?")}>
                  Reset
                </button>
              </div>
            ))}
          </div>
        </Section>

        {/* Save */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn-primary" onClick={handleSave} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 32px" }}>
            <Icon name="check" size={16} color="white" /> Simpan Perubahan
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
