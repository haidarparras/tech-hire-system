import { useState, useEffect } from "react";
import Icon from "../../components/common/Icon";
import { apiFetch } from "../../utils/api";

const roleStyle = {
  admin: { label: "Admin", color: "#f59e0b", bg: "rgba(245,158,11,0.15)", border: "rgba(245,158,11,0.3)" },
  hrd:   { label: "HRD",   color: "#8b5cf6", bg: "rgba(139,92,246,0.15)", border: "rgba(139,92,246,0.3)" },
  user:  { label: "User",  color: "#6366f1", bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.3)" },
};

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "hrd" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    const data = await apiFetch("/api/users").then(r => r.json()).catch(() => []);
    setUsers(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError("Semua kolom wajib diisi."); return; }
    setSaving(true); setError(""); setSuccess("");
    try {
      // Register endpoint adalah public, tapi bisa pakai apiFetch juga
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat akun");
      setSuccess("Akun berhasil dibuat!");
      setForm({ name: "", email: "", password: "", role: "hrd" });
      setShowForm(false);
      fetchUsers();
    } catch (err) { setError(err.message); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus pengguna ini? Tindakan ini tidak bisa dibatalkan.")) return;
    try {
      const res = await apiFetch(`/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus");
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="section-tag" style={{ display: "inline-flex", marginBottom: 12 }}>
              <Icon name="candidates" size={13} color="#a5b4fc" /> Admin Only
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, marginBottom: 6 }}>
              Manajemen Pengguna
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>Kelola akun HRD, Admin, dan pengguna sistem.</p>
          </div>
          <button className="btn-primary" onClick={() => { setShowForm(true); setError(""); setSuccess(""); }}
            style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
            <Icon name="candidates" size={16} color="white" /> Tambah Pengguna
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 28 }}>
          {[
            { label: "Total Pengguna", value: users.length,                            color: "#6366f1" },
            { label: "Admin",          value: users.filter(u=>u.role==="admin").length, color: "#f59e0b" },
            { label: "HRD",            value: users.filter(u=>u.role==="hrd").length,   color: "#8b5cf6" },
            { label: "User",           value: users.filter(u=>u.role==="user").length,  color: "#06b6d4" },
          ].map((m, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "16px 20px" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: m.color, marginBottom: 4 }}>{loading ? "—" : m.value}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <Icon name="search" size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            style={{ width: "100%", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "12px 14px 12px 42px", color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none" }} />
        </div>

        {success && (
          <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#6ee7b7" }}>{success}</div>
        )}

        {/* User List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>Memuat pengguna...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", background: "rgba(255,255,255,0.02)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--border-light)" }}>
            <Icon name="candidates" size={40} color="var(--text-muted)" />
            <h3 style={{ marginTop: 14, fontSize: 17, fontWeight: 600 }}>Tidak ada pengguna ditemukan</h3>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map(u => {
              const rs = roleStyle[u.role] ?? roleStyle.user;
              return (
                <div key={u.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "18px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${rs.color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, fontWeight: 800, color: rs.color, flexShrink: 0 }}>
                    {u.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{u.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.email}</div>
                  </div>
                  <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: rs.bg, color: rs.color, border: `1px solid ${rs.border}`, flexShrink: 0 }}>
                    {rs.label}
                  </span>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID") : "—"}
                  </div>
                  <button onClick={() => handleDelete(u.id)}
                    style={{ width: 34, height: 34, borderRadius: "var(--radius-sm)", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name="close" size={14} color="#fda4af" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Create User Modal */}
        {showForm && (
          <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(5,8,20,0.85)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
            onClick={() => setShowForm(false)}>
            <div onClick={e => e.stopPropagation()} className="animate-fade-in"
              style={{ width: "100%", maxWidth: 480, background: "var(--bg-secondary)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-xl)", padding: 36 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Tambah Pengguna</h2>
                <button onClick={() => setShowForm(false)} style={{ background: "rgba(255,255,255,0.05)", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, display: "flex" }}>
                  <Icon name="close" size={18} color="var(--text-secondary)" />
                </button>
              </div>
              <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Nama Lengkap *", key: "name",     type: "text",     placeholder: "Nama pengguna" },
                  { label: "Email *",         key: "email",    type: "email",    placeholder: "email@perusahaan.com" },
                  { label: "Password *",      key: "password", type: "password", placeholder: "Min. 6 karakter" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>{f.label}</label>
                    <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ width: "100%", background: "var(--bg-glass-light)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "10px 14px", color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none" }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: "block", fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>Role</label>
                  <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                    style={{ width: "100%", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "10px 14px", color: "var(--text-primary)", fontSize: 14, fontFamily: "var(--font-sans)", outline: "none" }}>
                    <option value="hrd">HRD</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </div>
                {error && <p style={{ fontSize: 13, color: "#f43f5e" }}>{error}</p>}
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button type="submit" className="btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={saving}>
                    {saving ? "Menyimpan..." : "Buat Akun"}
                  </button>
                  <button type="button" className="btn-secondary" style={{ flex: 1, justifyContent: "center" }} onClick={() => setShowForm(false)}>Batal</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UsersPage;
