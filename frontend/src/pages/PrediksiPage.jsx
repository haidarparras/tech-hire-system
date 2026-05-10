import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheck,
  FiMail,
  FiArrowUpRight,
  FiDownload,
  FiExternalLink,
} from "react-icons/fi";
import { MOCK_CANDIDATES } from "../mocks/candidates";
import { formatScore } from "../utils/formatScore";
import { scoreColor } from "../utils/scoreColor";
import { recommendationStyle } from "../utils/recommendationStyle";
import { useTheme } from "../context/ThemeContext";

export default function PrediksiPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { colors } = useTheme();

  const sortedCandidates = [...MOCK_CANDIDATES].sort(
    (a, b) => b.score - a.score,
  );
  const candidate =
    MOCK_CANDIDATES.find((c) => c.id === Number(id)) || MOCK_CANDIDATES[0];
  const c = candidate;
  const roundedScore = Math.round(c.score);
  const scoreColorValue = scoreColor(c.score);
  const badge = recommendationStyle(c.recommendation);
  const scoreLabel =
    c.score >= 75 ? "Tinggi" : c.score >= 55 ? "Sedang" : "Rendah";

  const r = 44;
  const circ = 2 * Math.PI * r;
  const offset = circ - (roundedScore / 100) * circ;

  return (
    <div
      className="prediksi-container"
      style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      <style>{`
        .prediksi-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 32px;
          align-items: start;
        }
        @media (max-width: 992px) {
          .prediksi-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="prediksi-layout">
        {/* Sidebar Kiri: Ranking Kandidat */}
        <div
          style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            padding: "20px 0",
            position: "sticky",
            top: 80,
          }}>
          <div
            style={{
              padding: "0 20px 16px",
              borderBottom: `1px solid ${colors.border}`,
              marginBottom: 12,
            }}>
            <h3
              style={{
                color: colors.text,
                fontSize: 16,
                fontWeight: 700,
                margin: 0,
              }}>
              Ranking Kandidat
            </h3>
            <span style={{ color: colors.textMuted, fontSize: 12 }}>
              Berdasarkan skor AI
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {sortedCandidates.map((item) => {
              const isActive = item.id === c.id;
              const itemBadge = recommendationStyle(item.recommendation);
              return (
                <div
                  key={item.id}
                  onClick={() => navigate(`/prediksi/${item.id}`)}
                  style={{
                    padding: "12px 20px",
                    cursor: "pointer",
                    background: isActive ? `${colors.accent}10` : "transparent",
                    borderLeft: `3px solid ${isActive ? colors.accent : "transparent"}`,
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background =
                        colors.buttonBackground;
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = "transparent";
                  }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}>
                    <span
                      style={{
                        color: isActive ? colors.accent : colors.text,
                        fontSize: 14,
                        fontWeight: 600,
                      }}>
                      {item.name}
                    </span>
                    <span
                      style={{
                        color: scoreColor(item.score),
                        fontSize: 14,
                        fontWeight: 700,
                      }}>
                      {Math.round(item.score)}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: itemBadge.color,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.02em",
                    }}>
                    {item.recommendation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Kolom Kanan: Detail Kandidat */}
        <div>
          {/* Back */}
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: "none",
              border: "none",
              color: colors.textSecondary,
              cursor: "pointer",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 24,
              padding: 0,
            }}>
            <FiArrowLeft size={16} /> Kembali ke dashboard
          </button>

          {/* Top row profile + Score */}
          <div className="profile-score-grid">
            {/* Profile */}
            <div
              style={{
                background: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: 24,
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  marginBottom: 20,
                  flexWrap: "wrap",
                }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: `${scoreColorValue}20`,
                    border: `2px solid ${scoreColorValue}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: scoreColorValue,
                    fontWeight: 800,
                    fontSize: 16,
                  }}>
                  {c.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      color: colors.text,
                      fontWeight: 700,
                      fontSize: 18,
                      margin: "0 0 2px",
                    }}>
                    {c.name}
                  </h2>
                  <div style={{ color: colors.textSecondary, fontSize: 13 }}>
                    {c.role} · {c.experience}
                  </div>
                </div>
                <span
                  style={{
                    background: badge.bg,
                    color: badge.color,
                    border: `1px solid ${badge.border}`,
                    borderRadius: 20,
                    fontSize: 11,
                    padding: "5px 14px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}>
                  <FiCheck size={14} /> {c.recommendation}
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}>
                {[
                  ["Pendidikan", c.education],
                  ["Institusi", c.institution],
                  ["Email", c.email],
                  ["Lokasi", c.location],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div
                      style={{
                        color: colors.textSecondary,
                        fontSize: 11,
                        fontWeight: 600,
                        marginBottom: 3,
                      }}>
                      {label}
                    </div>
                    <div
                      style={{
                        color: label === "Email" ? colors.accent : colors.text,
                        fontSize: 14,
                      }}>
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Score */}
            <div
              style={{
                background: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}>
              <div
                style={{
                  color: colors.textMuted,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                }}>
                SKOR AI
              </div>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  stroke={colors.background}
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  stroke={scoreColorValue}
                  strokeWidth="8"
                  strokeDasharray={circ}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
                <text
                  x="50"
                  y="45"
                  textAnchor="middle"
                  fill={colors.text}
                  fontSize="20"
                  fontWeight="800">
                  {Math.round(c.score)}
                </text>
                <text
                  x="50"
                  y="60"
                  textAnchor="middle"
                  fill={colors.textMuted}
                  fontSize="10">
                  /100
                </text>
              </svg>
              <span
                style={{
                  background: badge.bg,
                  color: badge.color,
                  border: `1px solid ${badge.border}`,
                  borderRadius: 20,
                  fontSize: 11,
                  padding: "4px 14px",
                  fontWeight: 700,
                }}>
                {scoreLabel}
              </span>
            </div>
          </div>

          {/* Bottom row: Skills + Breakdown */}
          <div className="skills-breakdown-grid">
            {/* Skills */}
            <div
              style={{
                background: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: 24,
              }}>
              <h3
                style={{
                  color: colors.text,
                  fontWeight: 600,
                  fontSize: 15,
                  marginBottom: 16,
                }}>
                Analisis skill
              </h3>
              <div
                style={{
                  color: colors.textMuted,
                  fontSize: 12,
                  marginBottom: 8,
                }}>
                Skill yang cocok dengan posisi
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 20,
                }}>
                {c.skills.map((s) => (
                  <span
                    key={s}
                    style={{
                      background: "rgba(34,197,94,0.1)",
                      color: "#22c55e",
                      border: "1px solid rgba(34,197,94,0.2)",
                      borderRadius: 6,
                      fontSize: 12,
                      padding: "4px 12px",
                    }}>
                    {s}
                  </span>
                ))}
              </div>
              <div
                style={{
                  color: colors.textMuted,
                  fontSize: 12,
                  marginBottom: 8,
                }}>
                Skill yang belum ditemukan
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {c.missingSkills.map((s) => (
                  <span
                    key={s}
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      color: "#ef4444",
                      border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: 6,
                      fontSize: 12,
                      padding: "4px 12px",
                    }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Breakdown */}
            <div
              style={{
                background: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: 12,
                padding: 24,
              }}>
              <h3
                style={{
                  color: colors.text,
                  fontWeight: 600,
                  fontSize: 15,
                  marginBottom: 16,
                }}>
                Breakdown skor
              </h3>
              {[
                ["Skill match", c.breakdown.skillMatch],
                ["Pengalaman", c.breakdown.pengalaman],
                ["Pendidikan", c.breakdown.pendidikan],
                ["Relevansi", c.breakdown.relevansi],
              ].map(([label, val]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 14,
                  }}>
                  <div
                    style={{
                      color: colors.textSecondary,
                      fontSize: 13,
                      width: 90,
                      flexShrink: 0,
                    }}>
                    {label}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: 6,
                      background: colors.background,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${val}%`,
                        background: "linear-gradient(90deg, #16a34a, #22c55e)",
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      color: colors.text,
                      fontSize: 13,
                      fontWeight: 600,
                      width: 36,
                      textAlign: "right",
                    }}>
                    {formatScore(val)}
                  </div>
                </div>
              ))}
              <div
                className="action-btn-group"
                style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button
                  style={{
                    flex: 1,
                    background: colors.buttonBackground,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                    color: colors.buttonText,
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "10px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}>
                  <FiMail size={14} /> Undang interview{" "}
                  <FiArrowUpRight size={12} />
                </button>
                <button
                  style={{
                    background: colors.buttonBackground,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                    color: colors.textSecondary,
                    fontSize: 14,
                    padding: "10px 14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  <FiDownload size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Preview CV Section */}
          <div
            style={{
              marginTop: 24,
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 12,
              padding: 24,
            }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}>
              <h3
                style={{
                  color: colors.text,
                  fontWeight: 600,
                  fontSize: 16,
                  margin: 0,
                }}>
                Preview CV
              </h3>
              <div
                className="action-btn-group"
                style={{ display: "flex", gap: 10 }}>
                <a
                  href={c.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: colors.buttonBackground,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                    color: colors.textSecondary,
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "8px 14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}>
                  <FiExternalLink size={14} /> Buka di Tab Baru
                </a>
                <a
                  href={c.cvUrl}
                  download
                  style={{
                    background: colors.buttonBackground,
                    border: `1px solid ${colors.border}`,
                    borderRadius: 8,
                    color: colors.textSecondary,
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "8px 14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    textDecoration: "none",
                    transition: "all 0.2s",
                  }}>
                  <FiDownload size={14} /> Download
                </a>
              </div>
            </div>

            {c.cvUrl ? (
              <iframe
                src={c.cvUrl}
                title={`CV Preview - ${c.name}`}
                className="cv-iframe"
                style={{
                  width: "100%",
                  height: 600,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 8,
                  background: colors.background,
                }}
              />
            ) : (
              <div
                style={{
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: colors.background,
                  borderRadius: 8,
                  color: colors.textMuted,
                  fontSize: 14,
                  border: `1px dashed ${colors.border}`,
                }}>
                CV belum tersedia.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
