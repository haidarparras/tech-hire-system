import { recommendationStyle } from "../../utils/recommendationStyle";

export default function Badge({ recommendation }) {
  const badge = recommendationStyle(recommendation);

  return (
    <span
      style={{
        background: badge.bg,
        color: badge.color,
        border: `1px solid ${badge.border}`,
        borderRadius: 20,
        fontSize: 11,
        padding: "4px 12px",
        fontWeight: 600,
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        whiteSpace: "nowrap",
      }}>
      {recommendation}
    </span>
  );
}
