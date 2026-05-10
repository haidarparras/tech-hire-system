import { FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Badge from "./Badge";
import { scoreColor } from "../../utils/scoreColor";
import { formatScore } from "../../utils/formatScore";
import { useTheme } from "../../context/ThemeContext";

export default function CandidateCard({ candidate }) {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const scoreColorValue = scoreColor(candidate.score);

  return (
    <div
      onClick={() => navigate(`/prediksi/${candidate.id}`)}
      className="candidate-card"
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 10,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.accent;
        e.currentTarget.style.background = colors.buttonBackground;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.background = colors.card;
      }}>
      <style>{`
        .candidate-card {
          display: grid;
          grid-template-columns: 1fr 100px 180px 170px 30px;
          gap: 20px 24px;
          align-items: center;
          padding: 14px 16px;
        }
        @media (max-width: 767px) {
          .candidate-card {
            grid-template-columns: 1fr 60px;
            gap: 12px;
          }
          .hide-mobile { display: none; }
        }
      `}</style>
      {/* Kandidat */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            flexShrink: 0,
            background: `${scoreColorValue}20`,
            border: `1.5px solid ${scoreColorValue}44`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: scoreColorValue,
            fontWeight: 700,
            fontSize: 12,
          }}>
          {candidate.initials}
        </div>

        <div>
          <div
            style={{
              color: colors.text,
              fontWeight: 600,
              fontSize: 14,
            }}>
            {candidate.name}
          </div>
          <div style={{ color: colors.textMuted, fontSize: 12 }}>
            {candidate.experience}
          </div>
        </div>
      </div>

      {/* Skor */}
      <div
        style={{
          color: scoreColorValue,
          fontWeight: 700,
          fontSize: 18,
        }}>
        {formatScore(candidate.score)}
      </div>

      {/* Skill Match */}
      <div className="hide-mobile">
        <div
          style={{
            height: 6,
            background: colors.border,
            borderRadius: 3,
            overflow: "hidden",
            marginBottom: 4,
          }}>
          <div
            style={{
              height: "100%",
              width: `${(candidate.skillMatch / candidate.totalSkill) * 100}%`,
              background: scoreColorValue,
              borderRadius: 3,
            }}
          />
        </div>

        <div style={{ color: colors.textMuted, fontSize: 11 }}>
          {candidate.skillMatch}/{candidate.totalSkill} skill
        </div>
      </div>

      {/* Badge */}
      <div className="hide-mobile">
        <Badge recommendation={candidate.recommendation} />
      </div>

      {/* Arrow */}
      <div style={{ color: colors.textMuted, fontSize: 16 }}>
        <FiChevronRight size={18} />
      </div>
    </div>
  );
}
