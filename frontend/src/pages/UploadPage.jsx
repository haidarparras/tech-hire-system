import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUpload,
  FiPaperclip,
  FiFile,
  FiCheck,
  FiPlay,
  FiArrowUpRight,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

const CATEGORIES = [
  "Software Engineer",
  "AI Engineer",
  "Data Scientist",
  "Backend Engineer",
  "Frontend Engineer",
  "Full Stack Developer",
  "DevOps Engineer",
];

const MOCK_FILES = [
  { name: "Ahmad_Fadhillah_CV.pdf", size: "2.3 MB" },
  { name: "Rafif_Qaiser_CV.pdf", size: "1.8 MB" },
];

export default function UploadPage() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const [positionName, setPositionName] = useState("");
  const [category, setCategory] = useState("Software Engineer");
  const [jobDesc, setJobDesc] = useState("");
  const [extraFiles, setExtraFiles] = useState([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setExtraFiles((prev) => [
      ...prev,
      ...dropped.map((f) => ({
        name: f.name,
        size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      })),
    ]);
  };

  const handleFileInput = (e) => {
    const chosen = Array.from(e.target.files);
    setExtraFiles((prev) => [
      ...prev,
      ...chosen.map((f) => ({
        name: f.name,
        size: `${(f.size / 1024 / 1024).toFixed(1)} MB`,
      })),
    ]);
  };

  const allFiles = [...MOCK_FILES, ...extraFiles];

  return (
    <div
      className="upload-container"
      style={{ maxWidth: 720, margin: "0 auto" }}>
      <style>{`
        .upload-container {
          padding: 40px 24px;
        }
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          marginBottom: 16px;
        }
        @media (max-width: 767px) {
          .upload-container {
            padding: 24px 16px;
          }
          .detail-grid {
            grid-template-columns: 1fr;
          }
          .action-btn { width: 100%; justify-content: center; }
        }
      `}</style>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <span
          style={{
            color: colors.textMuted,
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}>
          Rekrutmen Baru
        </span>
        <h1
          style={{
            color: colors.text,
            fontSize: 28,
            fontWeight: 700,
            margin: "6px 0 4px",
          }}>
          Analisis kandidat
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: 14 }}>
          Upload CV dan tentukan posisi untuk mendapatkan skor kecocokan dari
          model AI.
        </p>
      </div>

      {/* Detail Posisi */}
      <div
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          padding: 24,
          marginBottom: 20,
        }}>
        <h3
          style={{
            color: colors.text,
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 16,
          }}>
          Detail posisi
        </h3>
        <div className="detail-grid">
          <div>
            <label
              style={{
                color: colors.textSecondary,
                fontSize: 12,
                display: "block",
                marginBottom: 6,
              }}>
              Nama posisi
            </label>
            <input
              value={positionName}
              onChange={(e) => setPositionName(e.target.value)}
              placeholder="e.g. Backend Engineer"
              style={{
                width: "100%",
                background: colors.inputBackground,
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: "10px 14px",
                color: colors.text,
                fontSize: 14,
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label
              style={{
                color: "#666",
                fontSize: 12,
                display: "block",
                marginBottom: 6,
              }}>
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                width: "100%",
                background: colors.inputBackground,
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: "10px 14px",
                color: colors.text,
                fontSize: 14,
                outline: "none",
                cursor: "pointer",
              }}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
        <label
          style={{
            color: colors.textSecondary,
            fontSize: 12,
            display: "block",
            marginBottom: 6,
          }}>
          Job description
        </label>
        <textarea
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          placeholder="Tempelkan deskripsi pekerjaan di sini..."
          rows={4}
          style={{
            width: "100%",
            background: colors.inputBackground,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            padding: "10px 14px",
            color: colors.text,
            fontSize: 14,
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Upload Area */}
      <div
        style={{
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
          padding: 24,
          marginBottom: 24,
        }}>
        <h3
          style={{
            color: colors.text,
            fontWeight: 600,
            fontSize: 15,
            marginBottom: 16,
          }}>
          Upload CV kandidat
        </h3>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? colors.accent : colors.border}`,
            borderRadius: 10,
            padding: "40px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            cursor: "pointer",
            background: dragging ? "rgba(34,197,94,0.04)" : "transparent",
            transition: "all 0.2s",
          }}>
          <FiUpload size={30} color={colors.textMuted} />
          <div
            style={{
              color: colors.textSecondary,
              fontWeight: 600,
              fontSize: 15,
            }}>
            Seret &amp; lepas file CV di sini
          </div>
          <div style={{ color: colors.textMuted, fontSize: 12 }}>
            Format PDF atau DOCX · Maks 5 MB per file · Multi-upload didukung
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              inputRef.current?.click();
            }}
            style={{
              background: colors.buttonBackground,
              border: `1px solid ${colors.border}`,
              borderRadius: 7,
              color: colors.buttonText,
              fontSize: 13,
              padding: "8px 18px",
              cursor: "pointer",
              marginTop: 4,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}>
            <FiPaperclip size={14} /> Pilih file
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            multiple
            style={{ display: "none" }}
            onChange={handleFileInput}
          />
        </div>

        {/* File list */}
        <div
          style={{
            marginTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}>
          {allFiles.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: colors.background,
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                padding: "10px 14px",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FiFile size={18} color={colors.textSecondary} />
                <div>
                  <div
                    style={{
                      color: colors.text,
                      fontSize: 13,
                      fontWeight: 500,
                    }}>
                    {f.name}
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: 11 }}>
                    {f.size} · Siap diproses
                  </div>
                </div>
              </div>
              <span
                style={{
                  background: "rgba(34,197,94,0.12)",
                  color: "#22c55e",
                  border: "1px solid rgba(34,197,94,0.25)",
                  borderRadius: 20,
                  fontSize: 11,
                  padding: "3px 10px",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}>
                <FiCheck size={12} /> Siap
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          gap: 12,
        }}>
        <button
          className="action-btn"
          style={{
            background: "none",
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            color: colors.textSecondary,
            fontSize: 14,
            padding: "10px 22px",
            cursor: "pointer",
          }}>
          Batal
        </button>
        <button
          className="action-btn"
          onClick={() => navigate("/dashboard")}
          style={{
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            padding: "10px 24px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}>
          <FiPlay size={14} /> Analisis sekarang <FiArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}
