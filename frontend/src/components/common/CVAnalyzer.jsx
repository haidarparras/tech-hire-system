// components/CVAnalyzer.jsx
// Letakkan file ini di: components/CVAnalyzer.jsx
// Pasang di halaman mana saja dengan: import CVAnalyzer from "@/components/CVAnalyzer"

"use client";

import { useState, useRef, useCallback } from "react";
import { aiFetch } from "../../utils/api";
// ── Warna per confidence level ─────────────────────────────────────────────
function confidenceColor(score) {
  if (score >= 0.8) return { bar: "#22c55e", text: "text-green-400", label: "Sangat Yakin" };
  if (score >= 0.6) return { bar: "#eab308", text: "text-yellow-400", label: "Cukup Yakin" };
  return { bar: "#ef4444", text: "text-red-400", label: "Kurang Yakin" };
}

// ── Sub-components ──────────────────────────────────────────────────────────
function DropZone({ onFile, dragging, setDragging }) {
  const inputRef = useRef(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) onFile(f);
    },
    [onFile, setDragging]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative flex flex-col items-center justify-center gap-3
        w-full min-h-[200px] rounded-2xl border-2 border-dashed
        cursor-pointer transition-all duration-200 select-none
        ${dragging
          ? "border-indigo-400 bg-indigo-950/40 scale-[1.01]"
          : "border-slate-600 bg-slate-800/40 hover:border-indigo-500 hover:bg-slate-800/70"
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      <div className="text-4xl">{dragging ? "📂" : "📄"}</div>
      <div className="text-center">
        <p className="font-semibold text-slate-200">
          {dragging ? "Lepaskan file di sini" : "Drag & drop CV kamu"}
        </p>
        <p className="text-sm text-slate-400 mt-1">atau klik untuk pilih file</p>
      </div>
      <span className="px-3 py-1 rounded-full bg-slate-700 text-xs text-slate-300 font-mono">
        .PDF &nbsp;·&nbsp; .TXT
      </span>
    </div>
  );
}

function ResultCard({ result }) {
  const { bar, text, label } = confidenceColor(result.confidence);
  const pct = Math.round(result.confidence * 100);

  return (
    <div className="rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-indigo-600/20 border-b border-slate-700 px-5 py-4 flex items-center gap-3">
        <span className="text-2xl">🎯</span>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-widest">Prediksi Kategori</p>
          <h3 className="text-xl font-bold text-white">{result.category}</h3>
        </div>
        <div className={`ml-auto text-right`}>
          <p className={`text-2xl font-black ${text}`}>{pct}%</p>
          <p className={`text-xs ${text}`}>{label}</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="px-5 pt-4">
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, background: bar }}
          />
        </div>
      </div>

      {/* Top 3 */}
      <div className="px-5 py-4">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Top 3 Prediksi</p>
        <div className="flex flex-col gap-2">
          {result.top3.map((item, i) => {
            const p = Math.round(item.confidence * 100);
            const { bar: b } = confidenceColor(item.confidence);
            return (
              <div key={i} className="flex items-center gap-3">
                <span className="text-slate-500 text-xs w-4">{i + 1}</span>
                <span className="text-sm text-slate-300 flex-1 truncate">{item.category}</span>
                <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${p}%`, background: b }} />
                </div>
                <span className="text-xs text-slate-400 w-8 text-right">{p}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-700 flex items-center justify-between">
        <span className="text-xs text-slate-500">📎 {result.filename}</span>
        <span className="text-xs text-slate-500">⚡ {result.processing_time_ms}ms</span>
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function CVAnalyzer() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFile = useCallback((f) => {
    setFile(f);
    setResult(null);
    setError(null);
  }, []);

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await aiFetch("/api/ai/analyze", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Terjadi kesalahan" }));
        throw new Error(err.detail || `Error ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">
            CV <span className="text-indigo-400">Analyzer</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Upload CV kamu dan AI akan mendeteksi kategori pekerjaannya
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Drop zone (sembunyikan jika sudah ada result) */}
          {!result && (
            <DropZone
              onFile={handleFile}
              dragging={dragging}
              setDragging={setDragging}
            />
          )}

          {/* File preview pill */}
          {file && !result && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700">
              <span className="text-xl">{file.name.endsWith(".pdf") ? "📕" : "📝"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{file.name}</p>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                onClick={handleReset}
                className="text-slate-500 hover:text-red-400 transition-colors text-lg"
                title="Hapus file"
              >
                ✕
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Result */}
          {result && <ResultCard result={result} />}

          {/* Buttons */}
          {!result ? (
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`
                w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200
                ${!file || loading
                  ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40 active:scale-[0.98]"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Menganalisis...
                </span>
              ) : (
                "🔍 Analisis CV"
              )}
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide border border-slate-600 text-slate-300 hover:bg-slate-800 transition-all"
            >
              ↩ Analisis CV Lain
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
