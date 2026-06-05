import { useState } from "react";
import Icon from "../../components/common/Icon";

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
