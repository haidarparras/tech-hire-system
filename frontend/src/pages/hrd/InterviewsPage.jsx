import { useState } from "react";
import Icon from "../../components/common/Icon";

const today = new Date();
const fmt = (d) => d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short" });

const dummyInterviews = [
  { id: 1, name: "Budi Santoso",    position: "Frontend Developer",    time: "09:00",  date: fmt(today),                              type: "Online",  interviewer: "Anita HRD",    status: "scheduled" },
  { id: 2, name: "Siti Rahayu",     position: "Data Analyst",          time: "11:00",  date: fmt(today),                              type: "Offline", interviewer: "Rudi Manager",  status: "scheduled" },
  { id: 3, name: "Ahmad Fauzi",     position: "Backend Engineer",      time: "14:30",  date: fmt(new Date(today.getTime() + 86400000)), type: "Online",  interviewer: "Anita HRD",    status: "scheduled" },
  { id: 4, name: "Dewi Kartika",    position: "UI/UX Designer",        time: "10:00",  date: fmt(new Date(today.getTime() + 86400000)), type: "Online",  interviewer: "Rudi Manager",  status: "done"       },
  { id: 5, name: "Rizky Pratama",   position: "DevOps Engineer",       time: "13:00",  date: fmt(new Date(today.getTime() + 2*86400000)), type: "Online", interviewer: "Anita HRD",   status: "scheduled" },
];

const typeColor  = { Online: "#6366f1", Offline: "#10b981" };
const statusStyle = {
  scheduled: { label: "Terjadwal", color: "#a5b4fc", bg: "rgba(99,102,241,0.15)", border: "rgba(99,102,241,0.3)" },
  done:      { label: "Selesai",   color: "#6ee7b7", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)" },
  cancelled: { label: "Dibatalkan",color: "#fda4af", bg: "rgba(244,63,94,0.15)",  border: "rgba(244,63,94,0.3)"  },
};

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState(dummyInterviews);
  const [filterDate, setFilterDate] = useState("all");

  const dates = [...new Set(interviews.map(i => i.date))];

  const filtered = filterDate === "all" ? interviews : interviews.filter(i => i.date === filterDate);

  const markDone = (id) => setInterviews(prev => prev.map(i => i.id === id ? { ...i, status: "done" } : i));
  const cancel   = (id) => setInterviews(prev => prev.map(i => i.id === id ? { ...i, status: "cancelled" } : i));

  return (
    <div style={{ paddingTop: 100, minHeight: "100vh" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div className="section-tag" style={{ display: "inline-flex", marginBottom: 12 }}>
            <Icon name="calendar" size={13} color="#a5b4fc" /> Jadwal Interview
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, marginBottom: 6 }}>
            Interview Management
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            Pantau dan kelola semua sesi wawancara kandidat.
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Interview", value: interviews.length,                                    color: "#6366f1", icon: "calendar"     },
            { label: "Hari Ini",        value: interviews.filter(i=>i.date===fmt(today)).length,     color: "#10b981", icon: "clock"        },
            { label: "Terjadwal",       value: interviews.filter(i=>i.status==="scheduled").length,  color: "#f59e0b", icon: "chat"         },
            { label: "Selesai",         value: interviews.filter(i=>i.status==="done").length,       color: "#8b5cf6", icon: "checkCircle"  },
          ].map((m, i) => (
            <div key={i} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-md)", padding: "18px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Icon name={m.icon} size={18} color={m.color} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: m.color, marginBottom: 4 }}>{m.value}</div>
              <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Date Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          {[{ key: "all", label: "Semua" }, ...dates.map(d => ({ key: d, label: d }))].map(f => (
            <button key={f.key} onClick={() => setFilterDate(f.key)}
              style={{
                background: filterDate === f.key ? "rgba(99,102,241,0.15)" : "transparent",
                color: filterDate === f.key ? "#a5b4fc" : "var(--text-secondary)",
                border: `1px solid ${filterDate === f.key ? "rgba(99,102,241,0.3)" : "var(--border-light)"}`,
                padding: "8px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500,
                cursor: "pointer", fontFamily: "var(--font-sans)",
              }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Interview List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(iv => {
            const st = statusStyle[iv.status];
            return (
              <div key={iv.id} style={{ background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "20px 24px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                {/* Time badge */}
                <div style={{ textAlign: "center", minWidth: 56, flexShrink: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#a5b4fc" }}>{iv.time}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{iv.date}</div>
                </div>
                <div style={{ width: 1, height: 48, background: "var(--border-light)", flexShrink: 0 }} />
                {/* Info */}
                <div style={{ flex: 1, minWidth: 160 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{iv.name}</div>
                  <div style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 6 }}>{iv.position}</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: typeColor[iv.type] ?? "#a5b4fc", display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon name="globe" size={11} color={typeColor[iv.type] ?? "#a5b4fc"} /> {iv.type}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 4 }}>
                      <Icon name="candidates" size={11} color="var(--text-muted)" /> {iv.interviewer}
                    </span>
                  </div>
                </div>
                {/* Status badge */}
                <span style={{ padding: "4px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: st.bg, color: st.color, border: `1px solid ${st.border}`, flexShrink: 0 }}>
                  {st.label}
                </span>
                {/* Actions */}
                {iv.status === "scheduled" && (
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => markDone(iv.id)}
                      style={{ padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "#6ee7b7" }}>
                      Selesai
                    </button>
                    <button onClick={() => cancel(iv.id)}
                      style={{ padding: "8px 14px", borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-sans)", background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.3)", color: "#fda4af" }}>
                      Batalkan
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default InterviewsPage;
