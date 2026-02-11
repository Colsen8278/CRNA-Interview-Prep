import { useState } from "react";
import { loadState, saveState } from "../utils/storage";
import { BEHAVIORAL_CATEGORIES } from "../data/placeholders";

const EMPTY_ENTRY = { situation: "", task: "", action: "", result: "", tags: [] };

export default function ExperienceBankPage({ t }) {
  const [entries, setEntries] = useState(() => loadState("experience-bank", []));
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_ENTRY);
  const [filterCat, setFilterCat] = useState("all");

  const save = () => {
    const updated = editing !== null
      ? entries.map((e, i) => i === editing ? { ...form, id: e.id } : e)
      : [...entries, { ...form, id: Date.now().toString() }];
    setEntries(updated);
    saveState("experience-bank", updated);
    setEditing(null);
    setForm(EMPTY_ENTRY);
  };

  const remove = (idx) => {
    const updated = entries.filter((_, i) => i !== idx);
    setEntries(updated);
    saveState("experience-bank", updated);
  };

  const startEdit = (idx) => {
    setEditing(idx);
    setForm(entries[idx]);
  };

  const filtered = filterCat === "all" ? entries : entries.filter(e => e.tags.includes(filterCat));

  const inputStyle = { width: "100%", padding: "10px 12px", background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "8px", color: t.tx, fontSize: "13px", lineHeight: 1.6, resize: "vertical", fontFamily: "inherit", outline: "none", boxSizing: "border-box" };

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <span style={{ fontSize: "28px" }}>📝</span>
        <div>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>Personal Experience Bank</h2>
          <p style={{ margin: "2px 0 0", color: t.tM, fontSize: "13px" }}>{entries.length} experience{entries.length !== 1 ? "s" : ""} saved — mapped to STAR format for interview recall</p>
        </div>
      </div>

      {/* Add/Edit Form */}
      <div style={{ padding: "20px", background: t.bgC, borderRadius: "12px", border: `1px solid ${t.bd}`, marginBottom: "24px" }}>
        <h3 style={{ color: t.ac, fontSize: "15px", margin: "0 0 14px" }}>{editing !== null ? "Edit Experience" : "Add New Experience"}</h3>
        <div style={{ display: "grid", gap: "10px" }}>
          <div>
            <label style={{ fontSize: "11px", color: t.tM, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px", display: "block" }}>Situation</label>
            <textarea value={form.situation} onChange={e => setForm({ ...form, situation: e.target.value })} placeholder="Set the scene — what was happening?" style={{ ...inputStyle, minHeight: "60px" }} />
          </div>
          <div>
            <label style={{ fontSize: "11px", color: t.tM, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px", display: "block" }}>Task</label>
            <textarea value={form.task} onChange={e => setForm({ ...form, task: e.target.value })} placeholder="What was your specific responsibility?" style={{ ...inputStyle, minHeight: "60px" }} />
          </div>
          <div>
            <label style={{ fontSize: "11px", color: t.tM, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px", display: "block" }}>Action</label>
            <textarea value={form.action} onChange={e => setForm({ ...form, action: e.target.value })} placeholder="What did you do? Be specific." style={{ ...inputStyle, minHeight: "60px" }} />
          </div>
          <div>
            <label style={{ fontSize: "11px", color: t.tM, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px", display: "block" }}>Result</label>
            <textarea value={form.result} onChange={e => setForm({ ...form, result: e.target.value })} placeholder="What was the outcome?" style={{ ...inputStyle, minHeight: "60px" }} />
          </div>
          <div>
            <label style={{ fontSize: "11px", color: t.tM, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px", display: "block" }}>Interview Categories</label>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {BEHAVIORAL_CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setForm(f => ({ ...f, tags: f.tags.includes(cat.id) ? f.tags.filter(t => t !== cat.id) : [...f.tags, cat.id] }))} style={{ padding: "4px 10px", borderRadius: "14px", fontSize: "11px", fontWeight: 500, cursor: "pointer", border: form.tags.includes(cat.id) ? `2px solid ${t.ac}` : `1px solid ${t.bd}`, background: form.tags.includes(cat.id) ? t.aD : t.bgS, color: form.tags.includes(cat.id) ? t.ac : t.tM }}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={save} disabled={!form.situation.trim()} style={{ background: t.ac, color: t.acTx, border: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: "pointer", opacity: form.situation.trim() ? 1 : 0.5, fontSize: "13px" }}>{editing !== null ? "Update" : "Save Experience"}</button>
            {editing !== null && <button onClick={() => { setEditing(null); setForm(EMPTY_ENTRY); }} style={{ background: t.bgS, color: t.tx, border: `1px solid ${t.bd}`, borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: "pointer", fontSize: "13px" }}>Cancel</button>}
          </div>
        </div>
      </div>

      {/* Filter */}
      {entries.length > 0 && <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
        <button onClick={() => setFilterCat("all")} style={{ padding: "4px 12px", borderRadius: "14px", fontSize: "11px", fontWeight: 600, cursor: "pointer", border: filterCat === "all" ? `2px solid ${t.ac}` : `1px solid ${t.bd}`, background: filterCat === "all" ? t.aD : t.bgS, color: filterCat === "all" ? t.ac : t.tM }}>All ({entries.length})</button>
        {BEHAVIORAL_CATEGORIES.map(cat => {
          const count = entries.filter(e => e.tags.includes(cat.id)).length;
          if (count === 0) return null;
          return <button key={cat.id} onClick={() => setFilterCat(cat.id)} style={{ padding: "4px 12px", borderRadius: "14px", fontSize: "11px", fontWeight: 500, cursor: "pointer", border: filterCat === cat.id ? `2px solid ${t.ac}` : `1px solid ${t.bd}`, background: filterCat === cat.id ? t.aD : t.bgS, color: filterCat === cat.id ? t.ac : t.tM }}>{cat.icon} {cat.name} ({count})</button>;
        })}
      </div>}

      {/* Entries */}
      {filtered.map((entry, idx) => {
        const realIdx = entries.indexOf(entry);
        return (
          <div key={entry.id || idx} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, marginBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                {entry.tags.map(tagId => {
                  const cat = BEHAVIORAL_CATEGORIES.find(c => c.id === tagId);
                  return cat ? <span key={tagId} style={{ background: t.aD, color: t.ac, padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: 500 }}>{cat.icon} {cat.name}</span> : null;
                })}
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button onClick={() => startEdit(realIdx)} style={{ background: "none", border: "none", cursor: "pointer", color: t.tM, fontSize: "12px" }}>✏️</button>
                <button onClick={() => remove(realIdx)} style={{ background: "none", border: "none", cursor: "pointer", color: t.dg, fontSize: "12px" }}>🗑️</button>
              </div>
            </div>
            {[["Situation", entry.situation], ["Task", entry.task], ["Action", entry.action], ["Result", entry.result]].map(([label, text]) => text && (
              <div key={label} style={{ marginBottom: "6px" }}>
                <span style={{ fontSize: "10px", color: t.ac, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</span>
                <p style={{ margin: "2px 0 0", fontSize: "13px", color: t.t2, lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        );
      })}

      {entries.length === 0 && <div style={{ padding: "48px", background: t.bgC, borderRadius: "12px", border: `1px dashed ${t.bd}`, textAlign: "center" }}>
        <div style={{ fontSize: "36px", marginBottom: "12px" }}>📝</div>
        <p style={{ color: t.tM, fontSize: "14px", margin: 0 }}>No experiences saved yet — add your clinical stories above</p>
      </div>}
    </div>
  );
}
