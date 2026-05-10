import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiCheckCircle, FiBarChart2 } from "react-icons/fi";
import { MOCK_CANDIDATES } from "../mocks/candidates";
import { useCandidates } from "../hooks/useCandidates";
import { formatScore } from "../utils/formatScore";
import { useTheme } from "../context/ThemeContext";
import StatCard from "../components/common/StatCard";
import CandidateCard from "../components/common/CandidateCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [tab, setTab] = useState("semua");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("skor");
  const {
    loading,
    candidates: filtered,
    stats,
  } = useCandidates(tab, search, sort);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      className="dashboard-container"
      style={{
        maxWidth: 860,
        margin: "0 auto",
        background: colors.background,
        color: colors.text,
        minHeight: "100vh",
        transition: "background 0.3s, color 0.3s",
      }}>
      <style>{`
        .dashboard-container {
          padding: 40px 24px;
        }
        .header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 28px;
        }
        .search-sort-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }
        .table-header {
          display: grid;
          grid-template-columns: 1fr 100px 180px 170px 30px;
          gap: 20px 24px;
          padding: 6px 16px;
          margin-bottom: 4px;
        }
        @media (max-width: 1023px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 767px) {
          .dashboard-container { padding: 24px 16px; }
          .header-row { flex-direction: column; gap: 16px; }
          .stats-grid { grid-template-columns: 1fr; }
          .search-sort-row { flex-direction: column; }
          .table-header { display: none; }
          .upload-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      {/* Header */}
      <div className="header-row">
        <div>
          <span
            style={{
              color: colors.textMuted,
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}>
            Rekrutmen Aktif
          </span>
          <h1
            style={{
              color: colors.text,
              fontSize: 28,
              fontWeight: 700,
              margin: "6px 0 4px",
            }}>
            Dashboard kandidat
          </h1>
          <p style={{ color: colors.textSecondary, fontSize: 14 }}>
            Posisi:{" "}
            <strong style={{ color: colors.textSecondary }}>
              Backend Engineer
            </strong>{" "}
            · {MOCK_CANDIDATES.length} kandidat dianalisis
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            className="upload-btn"
            onClick={() => navigate("/")}
            style={{
              background: colors.card,
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              color: colors.textSecondary,
              fontSize: 13,
              fontWeight: 600,
              padding: "10px 18px",
              cursor: "pointer",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = colors.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = colors.border;
            }}>
            + Upload baru
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {[
          {
            icon: <FiUsers size={16} />,
            label: "Total kandidat",
            value: stats.totalCandidates,
            color: colors.text,
          },
          {
            icon: <FiCheckCircle size={16} />,
            label: "Lolos threshold",
            value: stats.passedCandidates,
            color: "#22c55e",
          },
          {
            icon: <FiBarChart2 size={16} />,
            label: "Rata-rata skor",
            value: formatScore(stats.averageScore),
            color: colors.text,
          },
        ].map((item, index) => (
          <StatCard key={index} {...item} />
        ))}
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: `1px solid ${colors.border}`,
          marginBottom: 20,
        }}>
        {[
          ["semua", "Semua kandidat"],
          ["direkomendasikan", "Direkomendasikan"],
          ["review", "Perlu review"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: tab === key ? colors.text : colors.textMuted,
              fontWeight: tab === key ? 600 : 400,
              fontSize: 14,
              padding: "8px 16px",
              borderBottom:
                tab === key
                  ? `2px solid ${colors.accent}`
                  : "2px solid transparent",
              transition: "all 0.2s",
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Search & Sort */}
      <div className="search-sort-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kandidat..."
          style={{
            flex: 1,
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            padding: "10px 14px",
            color: colors.text,
            fontSize: 14,
            outline: "none",
            transition: "all 0.2s",
          }}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          style={{
            background: colors.card,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            padding: "10px 14px",
            color: colors.textSecondary,
            fontSize: 14,
            outline: "none",
            cursor: "pointer",
            transition: "all 0.2s",
          }}>
          <option value="skor">Urutkan: Skor (Tertinggi)</option>
          <option value="nama">Urutkan: Nama A-Z</option>
        </select>
      </div>

      {/* Table Header */}
      <div className="table-header">
        {["KANDIDAT", "SKOR", "SKILL MATCH", "REKOMENDASI", ""].map((h, i) => (
          <div
            key={i}
            style={{
              color: colors.textMuted,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textAlign: i === 1 || i === 2 ? "left" : "left",
            }}>
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {filtered.map((candidate) => (
          <CandidateCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
}
