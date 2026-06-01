import { useState, useEffect } from "react";
import Icon from "../../components/common/Icon";
import { apiFetch } from "../../utils/api";

const statusStyle = {
  open:   { label: "Aktif",  color: "#10b981", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)" },
  closed: { label: "Tutup",  color: "#f43f5e", bg: "rgba(244,63,94,0.15)",  border: "rgba(244,63,94,0.3)"  },
  draft:  { label: "Draft",  color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.3)" },
};

const emptyForm = { title: "", department: "", location: "", type: "Full-time", description: "", requirements: "" };

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    const data = await apiFetch("/api/jobs").then(r => r.json()).catch(() => []);
    setJobs(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { setError("Nama posisi wajib diisi."); return; }
    setSaving(true); setError("");
    try {
      const res = await apiFetch("/api/jobs", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");
      setForm(emptyForm); setShowForm(false); fetchJobs();
    } catch (err) { setError(err.message || "Gagal menyimpan lowongan. Pastikan backend menyala."); }
    setSaving(false);
  };

  const toggleStatus = async (id, current) => {
    const next = current === "open" ? "closed" : "open";
    await apiFetch(`/api/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: next }),
    });
    fetchJobs();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus lowongan ini? Tindakan ini tidak bisa dibatalkan.")) return;
    try {
      const res = await apiFetch(`/api/jobs/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus");
      fetchJobs();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = jobs.filter(j =>
    !search ||
    j.title?.toLowerCase().includes(search.toLowerCase()) ||
    j.department?.toLowerCase().includes(search.toLowerCase()) ||
    j.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="section-tag" style={{ display: "inline-flex", marginBottom: 12 }}>
              <Icon name="briefcase" size={13} color="#a5b4fc" /> Manajemen Lowongan
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, marginBottom: 6 }}>Daftar Lowongan</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>Kelola posisi yang sedang dibuka atau direncanakan.</p>
          </div>
          <button className="btn-primary" onClick={() => { setShowForm(true); setError(""); }}
            style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
            <Icon name="upload" size={16} color="white" /> Tambah Lowongan
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Total",  value: jobs.length,                              color: "#6366f1" },
            { label: "Aktif",  value: jobs.filter(j=>j.status==="open").length,  color: "#10b981" },
            { label: "Tutup",  value: jobs.filter(j=>j.status==="closed").length, color: "#f43f5e" },
            { label: "Draft",  value: jobs.filter(j=>j.status==="draft").length,  color: "#94a3b8" },
          ].map((m, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "14px 18px" }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: m.color, marginBottom: 2 }}>{loading ? "—" : m.value}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <Icon name="search" size={15} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari lowongan, departemen, atau lokasi..."
            style={{ width: "100%", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "11px 14px 11px 42px", color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none" }} />
        </div>

        {/* Form Modal */}
        {showForm && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(5,8,20,0.85)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={() => setShowForm(false)}>
            <div onClick={e => e.stopPropagation()} className="animate-fade-in"
              style={{ width: "100%", maxWidth: 540, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: 36, maxHeight: "90vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Tambah Lowongan Baru</h2>
                <button onClick={() => setShowForm(false)} style={{ background: "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, display: "flex" }}>
                  <Icon name="close" size={18} color="var(--text-secondary)" />
                </button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Nama Posisi *", key: "title",      placeholder: "contoh: Frontend Developer"  },
                  { label: "Departemen",    key: "department", placeholder: "contoh: Engineering"          },
                  { label: "Lokasi",        key: "location",   placeholder: "contoh: Jakarta / Remote"     },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>{f.label}</label>
                    <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ width: "100%", background: "var(--bg-glass-light)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "10px 14px", color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none" }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>Tipe</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                    style={{ width: "100%", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "10px 14px", color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none" }}>
                    {["Full-time", "Part-time", "Contract", "Internship", "Remote"].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>Deskripsi</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    placeholder="Deskripsi singkat posisi..." rows={3}
                    style={{ width: "100%", background: "var(--bg-glass-light)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "10px 14px", color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none", resize: "vertical" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>Kualifikasi</label>
                  <textarea value={form.requirements} onChange={e => setForm(p => ({ ...p, requirements: e.target.value }))}
                    placeholder="Persyaratan kandidat..." rows={3}
                    style={{ width: "100%", background: "var(--bg-glass-light)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "10px 14px", color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none", resize: "vertical" }} />
                </div>
                {error && <p style={{ fontSize: 13, color: "#f43f5e" }}>{error}</p>}
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={saving}>
                    {saving ? "Menyimpan..." : "Simpan Lowongan"}
                  </button>
                  <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowForm(false)}>
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Jobs List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>Memuat lowongan...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-light)" }}>
            <Icon name="briefcase" size={40} color="var(--text-muted)" />
            <h3 style={{ marginTop: 14, fontSize: 17, fontWeight: 600 }}>{search ? "Tidak ada hasil pencarian" : "Belum ada lowongan"}</h3>
            <p style={{ marginTop: 8, fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>
              {search ? `Tidak ditemukan lowongan untuk "${search}"` : "Mulai dengan menambahkan posisi yang sedang dibuka."}
            </p>
            {!search && (
              <button className="btn-primary" onClick={() => setShowForm(true)} style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon name="upload" size={15} color="white" /> Tambah Pertama
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map(job => {
              const st = statusStyle[job.status] ?? statusStyle.draft;
              return (
                <div key={job.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700 }}>{job.title}</h3>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: st.bg, color: st.color, border: `1px solid ${st.border}` }}>{st.label}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      {job.department && <span style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 5 }}><Icon name="candidates" size={12} color="var(--text-muted)" />{job.department}</span>}
                      {job.location   && <span style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 5 }}><Icon name="pin" size={12} color="var(--text-muted)" />{job.location}</span>}
                      {job.type       && <span style={{ fontSize: 13, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 5 }}><Icon name="clock" size={12} color="var(--text-muted)" />{job.type}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => toggleStatus(job.id, job.status)}
                      style={{ padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)", border: `1px solid ${job.status === "open" ? "rgba(244,63,94,0.3)" : "rgba(16,185,129,0.3)"}`, background: job.status === "open" ? "rgba(244,63,94,0.1)" : "rgba(16,185,129,0.1)", color: job.status === "open" ? "#fda4af" : "#6ee7b7" }}>
                      {job.status === "open" ? "Tutup" : "Buka Kembali"}
                    </button>
                    <button onClick={() => handleDelete(job.id)}
                      style={{ width: 36, height: 36, borderRadius: "var(--radius-sm)", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Icon name="close" size={15} color="#fda4af" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
