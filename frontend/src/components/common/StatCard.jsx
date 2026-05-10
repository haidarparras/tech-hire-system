import { useTheme } from "../../context/ThemeContext";

export default function StatCard({ icon, label, value, color }) {
  const { colors } = useTheme();
  const displayColor = color || colors.text;

  return (
    <div
      style={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: "20px 22px",
      }}>
      <div
        style={{
          color: colors.textMuted,
          fontSize: 12,
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
        {icon}
        {label}
      </div>

      <div
        style={{
          color: displayColor,
          fontSize: 32,
          fontWeight: 700,
        }}>
        {value}
      </div>
    </div>
  );
}
