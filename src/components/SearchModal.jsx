import { useRef, useEffect } from "react";

function SearchRow({ icon, title, sub, stars, onClick, t }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 12px", background: "none", border: "none", borderRadius: "6px", cursor: "pointer", color: t.tx, textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background = t.bgS} onMouseLeave={e => e.currentTarget.style.background = "none"}>
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: "13px" }}>{title}</div><div style={{ fontSize: "11px", color: t.tM }}>{sub}</div></div>
      {stars > 0 && <span style={{ color: t.wn, fontSize: "11px" }}>{"★".repeat(stars)}</span>}
    </button>
  );
}

export default function SearchModal({ open, onClose, query, setQuery, filteredItems, filteredProtos, quizzes, conf, onNavMed, onNavProto, onNavQuiz, t }) {
  const sRef = useRef(null);
  useEffect(() => { if (open && sRef.current) sRef.current.focus(); }, [open]);

  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", justifyContent: "center", paddingTop: "10vh" }} onClick={onClose}>
      <div style={{ background: t.bgC, borderRadius: "14px", width: "92%", maxWidth: "520px", maxHeight: "440px", overflow: "hidden", border: `1px solid ${t.bd}`, boxShadow: t.sh }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: `1px solid ${t.bd}` }}>
          <span>🔍</span>
          <input ref={sRef} value={query} onChange={e => setQuery(e.target.value)} placeholder="Search meds, protocols, quizzes..." style={{ flex: 1, background: "none", border: "none", outline: "none", color: t.tx, fontSize: "14px" }} />
          <button onClick={onClose} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "5px", padding: "2px 7px", color: t.tM, cursor: "pointer", fontSize: "10px" }}>ESC</button>
        </div>
        <div style={{ maxHeight: "380px", overflowY: "auto", padding: "4px" }}>
          {filteredItems.map(i => <SearchRow key={i.id} icon="💊" title={i.name} sub={i.tags.slice(0, 2).join(" · ")} stars={conf[i.id]} onClick={() => onNavMed(i)} t={t} />)}
          {filteredProtos.map(p => <SearchRow key={p.id} icon="❤️‍🔥" title={p.name} sub={p.cat} stars={conf[p.id]} onClick={() => onNavProto(p)} t={t} />)}
          {Object.entries(quizzes).map(([k, v]) => <SearchRow key={k} icon={v.icon} title={`${v.label} Quiz`} sub={`${v.items.length} questions`} onClick={() => onNavQuiz(k)} t={t} />)}
          {filteredItems.length === 0 && filteredProtos.length === 0 && query && <div style={{ padding: "32px", textAlign: "center", color: t.tM }}>No results</div>}
        </div>
      </div>
    </div>
  );
}
