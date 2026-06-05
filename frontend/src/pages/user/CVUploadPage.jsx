import { useState, useRef } from "react";
import Icon from "../../components/common/Icon";
import { aiFetch } from "../../utils/api";

const CVUploadPage = () => {
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [step, setStep] = useState("upload"); // upload | ready | analyzing | result | error
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setStep("ready");
    setErrorMsg("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const startAnalysis = async () => {
    setStep("analyzing");
    setProgress(0);
    setErrorMsg("");

    // Animasi progress bar sementara menunggu API
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 8;
      if (p >= 90) p = 90; // Berhenti di 90% sampai API selesai
      setProgress(Math.min(p, 90));
    }, 250);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("save_to_db", "true");

      const res = await aiFetch("/api/ai/analyze", {
        method: "POST",
        body: formData,
      });

      clearInterval(interval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Terjadi kesalahan pada server");
      }

      const data = await res.json();
      setProgress(100);
      setTimeout(() => {
        setResult(data);
        setStep("result");
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setErrorMsg(err.message || "Gagal menghubungi server AI. Pastikan FastAPI berjalan di port 8000.");
      setStep("error");
    }
  };

  const reset = () => {
    setFile(null);
    setAnalyzing(false);
    setProgress(0);
    setResult(null);
    setStep("upload");
    setErrorMsg("");
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const analysisSteps = [
    { label: "Membaca dokumen CV", done: progress >= 20 },
    { label: "Mengekstrak informasi pribadi", done: progress >= 40 },
    { label: "Mengidentifikasi skill & keahlian", done: progress >= 60 },
    { label: "Menghitung skor kecocokan", done: progress >= 80 },
    { label: "Menyiapkan laporan rekomendasi", done: progress >= 100 },
  ];

  return (
    <div style={{ padding: "40px 6%", maxWidth: 800, margin: "0 auto", width: "100%", animation: "fadeInUp 0.4s ease-out" }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div className="section-tag" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="ai" size={13} color="#a5b4fc" /> AI CV Analyzer
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 3vw, 44px)",
            fontWeight: 800,
            marginBottom: 12,
          }}>
            Analisis CV{" "}
            <span className="gradient-text">Secara Instan</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, maxWidth: 540, lineHeight: 1.7 }}>
            Upload CV kandidat dan biarkan AI kami menganalisis skill, pengalaman, dan tingkat kecocokan dalam hitungan detik.
          </p>
        </div>

        {/* Upload Zone */}
        {(step === "upload" || step === "ready") && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !file && fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? "#6366f1" : file ? "rgba(16,185,129,0.5)" : "rgba(99,102,241,0.25)"}`,
              borderRadius: "var(--radius-xl)",
              padding: "60px 40px",
              textAlign: "center",
              cursor: file ? "default" : "pointer",
              background: dragOver ? "rgba(99,102,241,0.07)" : file ? "rgba(16,185,129,0.05)" : "var(--bg-card)",
              transition: "var(--transition)",
              marginBottom: 24,
            }}
          >
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }}
              onChange={e => handleFile(e.target.files[0])} />

            {!file ? (
              <div style={{ marginBottom: 20 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 20,
                  background: "rgba(99,102,241,0.12)",
                  border: "2px dashed rgba(99,102,241,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  <Icon name="upload" size={32} color="#6366f1" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
                  Drag & Drop CV di sini
                </h3>
                <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 20 }}>
                  atau klik untuk memilih file
                </p>
                <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                  {["PDF", "DOC", "DOCX"].map(t => (
                    <span key={t} className="badge badge-primary">{t}</span>
                  ))}
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: 12, marginTop: 16 }}>Ukuran maksimal: 10MB</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: 20,
                    background: "rgba(16,185,129,0.12)",
                    border: "2px solid rgba(16,185,129,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                  }}>
                    <Icon name="checkCircle" size={32} color="#10b981" />
                  </div>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: "#10b981" }}>
                  File Siap Dianalisis
                </h3>
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 12,
                  background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)",
                  borderRadius: 12, padding: "12px 20px", marginBottom: 8,
                }}>
                  <Icon name="document" size={20} color="#10b981" />
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{file.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {(file.size / 1024).toFixed(0)} KB
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Target Position */}
        {step === "ready" && (
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: 10 }}>
              Target Posisi (Opsional)
            </label>
            <select style={{
              width: "100%",
              padding: "12px 16px",
              background: "var(--bg-card)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-md)",
              color: "var(--text-primary)",
              fontSize: 14,
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
              outline: "none",
            }}>
              <option value="">Pilih posisi yang diinginkan...</option>
              <option>Frontend Developer</option>
              <option>Backend Developer</option>
              <option>Full Stack Engineer</option>
              <option>ML Engineer</option>
              <option>DevOps Engineer</option>
              <option>Data Engineer</option>
            </select>
          </div>
        )}

        {/* Action Buttons */}
        {step === "ready" && (
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-primary" onClick={startAnalysis}
              style={{ flex: 1, justifyContent: "center", fontSize: 16, padding: "14px", gap: 8 }}>
              <Icon name="cpu" size={17} color="white" /> Analisis dengan AI
            </button>
            <button className="btn-secondary" onClick={reset} style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="close" size={15} color="currentColor" /> Reset
            </button>
          </div>
        )}

        {/* Analyzing State */}
        {step === "analyzing" && (
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-light)",
            borderRadius: "var(--radius-xl)",
            padding: 48,
            textAlign: "center",
          }}>
            {/* Spinner */}
            <div style={{
              width: 80, height: 80, borderRadius: "50%",
              border: "4px solid rgba(99,102,241,0.2)",
              borderTop: "4px solid #6366f1",
              margin: "0 auto 32px",
              animation: "spin-slow 1s linear infinite",
            }} />

            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>AI Sedang Menganalisis...</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 32 }}>
              Model Deep Learning sedang memproses dokumen CV Anda
            </p>

            {/* Progress bar */}
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>Progress Analisis</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#6366f1" }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
                <div style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #6366f1, #8b5cf6, #10b981)",
                  borderRadius: 999,
                  transition: "width 0.2s ease",
                }} />
              </div>
            </div>

            {/* Steps */}
            <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: 10 }}>
              {analysisSteps.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: s.done ? "#10b981" : "rgba(255,255,255,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, flexShrink: 0,
                    transition: "background 0.3s",
                  }}>
                    {s.done ? "✓" : <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: progress >= (i + 1) * 20 - 10 ? "#6366f1" : "rgba(255,255,255,0.2)",
                    }} />}
                  </div>
                  <span style={{ fontSize: 14, color: s.done ? "var(--text-primary)" : "var(--text-muted)" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {step === "error" && (
          <div style={{
            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: "var(--radius-xl)", padding: 48, textAlign: "center",
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: "rgba(239,68,68,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 24px", fontSize: 32,
            }}>⚠️</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: "#ef4444" }}>
              Analisis Gagal
            </h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, maxWidth: 480, margin: "0 auto 28px" }}>
              {errorMsg}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn-primary" onClick={() => setStep("ready")}
                style={{ gap: 8, padding: "12px 28px" }}>
                🔄 Coba Lagi
              </button>
              <button className="btn-secondary" onClick={reset} style={{ padding: "12px 24px" }}>
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {step === "result" && result && (
          <div className="animate-fade-in" id="print-area">
            {/* Score Card */}
            <div style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(16,185,129,0.12))",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: "var(--radius-xl)",
              padding: 40,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 24,
            }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 8 }}>AI Match Score</div>
                <div style={{
                  fontSize: 72,
                  fontWeight: 900,
                  fontFamily: "var(--font-display)",
                  background: "linear-gradient(135deg, #6366f1, #10b981)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  lineHeight: 1,
                  marginBottom: 8,
                }}>
                  {result.score}%
                </div>
                <div className="badge badge-success" style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <Icon name="check" size={12} color="#6ee7b7" /> Kandidat Sangat Cocok
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>{result.name}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 8 }}>{result.position}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon name="education" size={13} color="var(--text-muted)" /> {result.education}
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon name="clock" size={13} color="var(--text-muted)" /> {result.experience}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div style={{
              background: "var(--bg-card)", border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-lg)", padding: 32, marginBottom: 24,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Profil Skill Kandidat</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {result.skills.map(sk => (
                  <div key={sk.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{sk.name}</span>
                        <span className="badge" style={{
                          fontSize: 10,
                          background: "rgba(255,255,255,0.05)",
                          color: "var(--text-muted)",
                          border: "none",
                          padding: "2px 8px",
                        }}>{sk.category}</span>
                      </div>
                      <span style={{
                        fontSize: 13, fontWeight: 700,
                        color: sk.level >= 85 ? "#10b981" : sk.level >= 70 ? "#6366f1" : "#f59e0b",
                      }}>{sk.level}%</span>
                    </div>
                    <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
                      <div style={{
                        height: "100%",
                        width: `${sk.level}%`,
                        background: sk.level >= 85 ? "linear-gradient(90deg, #10b981, #06b6d4)"
                          : sk.level >= 70 ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                          : "linear-gradient(90deg, #f59e0b, #ef4444)",
                        borderRadius: 999,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Gaps */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
              <div style={{
                background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.2)",
                borderRadius: "var(--radius-lg)", padding: 24,
              }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: "#10b981", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="award" size={16} color="#10b981" /> Kekuatan
                </h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.strengths.map((s, i) => (
                    <li key={i} style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon name="check" size={13} color="#10b981" /> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{
                background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)",
                borderRadius: "var(--radius-lg)", padding: 24,
              }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: "#f59e0b", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="pin" size={16} color="#f59e0b" /> Area Peningkatan
                </h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                  {result.gaps.map((g, i) => (
                    <li key={i} style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
                      <Icon name="warning" size={13} color="#f59e0b" /> {g}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AI Recommendation */}
            <div style={{
              background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: "var(--radius-lg)", padding: 28, marginBottom: 28,
            }}>
              <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="ai" size={18} color="#a5b4fc" /> Rekomendasi AI
              </h4>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8 }}>
                {result.recommendation}
              </p>
            </div>

            {/* Action */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }} className="no-print">
              <button onClick={handleDownloadPDF} className="btn-primary" style={{ flex: 1, justifyContent: "center", padding: "14px", gap: 8 }}>
                <Icon name="download" size={16} color="white" /> Unduh Laporan PDF
              </button>
              <button onClick={reset} className="btn-secondary" style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 6 }}>
                <Icon name="refresh" size={16} color="currentColor" /> Analisis Baru
              </button>
            </div>
          </div>
        )}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media print {
          /* Sembunyikan sidebar, mobile header, footer, overlay, navbar, dan tombol aksi */
          aside, .sidebar-container, .sidebar-mobile-header, .sidebar-overlay, nav, footer, .no-print, button {
            display: none !important;
          }
          /* Jadikan area cetak memenuhi seluruh halaman */
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: #050814 !important; /* Latar belakang premium yang sama dengan dasbor */
            color: #f1f5f9 !important;
          }
          body, html {
            background: #050814 !important;
            color: #f1f5f9 !important;
          }
          /* Memastikan warna latar belakang diprint */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CVUploadPage;
