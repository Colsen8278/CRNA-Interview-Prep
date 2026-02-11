import { useState } from "react";
import MedCard from "../components/med/MedCard";
import ProtoCard from "../components/proto/ProtoCard";
import PlaceholderCard from "../components/PlaceholderCard";

// Small helper components
function Stat({ t, label, value, icon, accent, onClick }) {
  return (
    <div onClick={onClick} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, cursor: onClick ? "pointer" : "default", transition: "border-color 0.15s" }} onMouseEnter={e => { if (onClick) e.currentTarget.style.borderColor = accent; }} onMouseLeave={e => { if (onClick) e.currentTarget.style.borderColor = t.bd; }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "11px", color: t.tM, fontWeight: 500 }}>{label}</span>
        <span style={{ fontSize: "18px" }}>{icon}</span>
      </div>
      <div style={{ fontSize: "28px", fontWeight: 700, color: accent, marginTop: "2px" }}>{value}</div>
    </div>
  );
}

function SL({ t, icon, title, count, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
      <span style={{ fontSize: "18px" }}>{icon}</span>
      <span style={{ fontSize: "15px", fontWeight: 700 }}>{title}</span>
      <span style={{ background: color ? `${color}18` : t.aD, color: color || t.ac, padding: "2px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: 600 }}>{count}</span>
    </div>
  );
}

function Pill({ t, text, active, onClick }) {
  return (
    <button onClick={onClick} style={{ background: active ? t.bgC : "transparent", color: active ? t.tx : t.tM, border: "none", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "12px", fontWeight: active ? 600 : 400 }}>{text}</button>
  );
}

export default function Dashboard({ meds, protos, quizzes, systems, allItems, conf, setConf, qHist, nav, oPro, sQuiz, setPg, t }) {
  const prog = allItems.length > 0 ? Math.round([...allItems, ...protos].filter(i => (conf[i.id] || 0) >= 3).length / [...allItems, ...protos].length * 100) : 0;

  const weakAreas = [...allItems.map(i => ({ ...i, type: "med" })), ...protos.map(p => ({ ...p, type: "proto" }))].filter(i => conf[i.id] && conf[i.id] <= 2).map(i => ({ id: i.id, name: i.name, stars: conf[i.id], type: i.type }));

  const [viewMode, setViewMode] = useState("type");

  return (
    <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "10px", marginBottom: "20px" }}>
        <Stat t={t} label="Study Sheets" value={allItems.length} icon="📋" accent={t.ac} onClick={() => setPg("pg-meds")} />
        <Stat t={t} label="ACLS/PALS Protocols" value={protos.length} icon="❤️‍🔥" accent="#ef4444" onClick={() => setPg("pg-acls")} />
        <Stat t={t} label="Quizzes" value={Object.keys(quizzes).length} icon="❓" accent={t.pr} onClick={() => setPg("pg-quiz")} />
        <div style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}><span style={{ fontSize: "11px", color: t.tM, fontWeight: 500 }}>Mastery (≥3★)</span><span style={{ fontSize: "16px", fontWeight: 700, color: t.ac }}>{prog}%</span></div>
          <div style={{ height: "5px", background: t.bgS, borderRadius: "3px" }}><div style={{ height: "100%", width: `${prog}%`, background: `linear-gradient(90deg,${t.ac},${t.bl})`, borderRadius: "3px", transition: "width 0.5s" }} /></div>
        </div>
      </div>

      {/* Weak Areas */}
      {weakAreas.length > 0 && <div style={{ marginBottom: "20px", padding: "14px 16px", background: `${t.wn}08`, borderRadius: "10px", border: `1px solid ${t.wn}30` }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: t.wn, marginBottom: "8px" }}>⚡ Focus Areas (rated ≤ 2★)</div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {weakAreas.map(w => <button key={w.id} onClick={() => w.type === "med" ? nav(meds.find(m => m.id === w.id)) : oPro(protos.find(p => p.id === w.id))} style={{ background: t.bgC, border: `1px solid ${t.wn}40`, borderRadius: "7px", padding: "5px 12px", cursor: "pointer", fontSize: "12px", color: t.tx, fontWeight: 500 }}>
            {w.name} <span style={{ color: t.wn }}>{"★".repeat(w.stars)}</span>
          </button>)}
        </div>
      </div>}

      {/* View Toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>Study Library</h2>
        <div style={{ display: "flex", background: t.bgS, borderRadius: "8px", padding: "3px", border: `1px solid ${t.bd}` }}>
          <Pill t={t} text="By Type" active={viewMode === "type"} onClick={() => setViewMode("type")} />
          <Pill t={t} text="By System" active={viewMode === "system"} onClick={() => setViewMode("system")} />
        </div>
      </div>

      {viewMode === "type" && <>
        {/* Medications */}
        <SL t={t} icon="💊" title="Medications" count={meds.length} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
          {meds.map(i => <MedCard key={i.id} item={i} t={t} conf={conf[i.id]} onConf={v => setConf(p => ({ ...p, [i.id]: v }))} onOpen={() => nav(i)} />)}
          <PlaceholderCard t={t} text="More medications coming..." />
        </div>

        {/* ACLS Protocols */}
        <SL t={t} icon="❤️‍🔥" title="ACLS & PALS Protocols" count={protos.length} color="#ef4444" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
          {protos.map(p => <ProtoCard key={p.id} p={p} t={t} conf={conf[p.id]} onConf={v => setConf(prev => ({ ...prev, [p.id]: v }))} onOpen={() => oPro(p)} />)}
        </div>

        {/* Placeholders */}
        <SL t={t} icon="🔧" title="Devices" count={0} />
        <div style={{ marginBottom: "20px" }}><PlaceholderCard t={t} text="Ask about arterial lines, vents, EVDs..." /></div>
        <SL t={t} icon="📖" title="Physiology Concepts" count={0} />
        <div style={{ marginBottom: "20px" }}><PlaceholderCard t={t} text="Ask about Frank-Starling, MAC, O₂-Hb curve..." /></div>

        {/* Quizzes */}
        <SL t={t} icon="❓" title="Quizzes" count={Object.keys(quizzes).length} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
          {Object.entries(quizzes).map(([k, v]) => (
            <div key={k} onClick={() => sQuiz(k)} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}><span style={{ fontSize: "18px" }}>{v.icon}</span><span style={{ fontSize: "15px", fontWeight: 600 }}>{v.label}</span></div>
              <div style={{ fontSize: "12px", color: t.tM, marginBottom: "10px" }}>{v.items.length} questions</div>
              <div style={{ background: t.ac, color: t.acTx, padding: "7px 14px", borderRadius: "7px", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>Start Quiz</div>
            </div>
          ))}
        </div>
      </>}

      {/* System View */}
      {viewMode === "system" && <>
        <SL t={t} icon="❤️‍🔥" title="ACLS & PALS Protocols" count={protos.length} color="#ef4444" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
          {protos.map(p => <ProtoCard key={p.id} p={p} t={t} conf={conf[p.id]} onConf={v => setConf(prev => ({ ...prev, [p.id]: v }))} onOpen={() => oPro(p)} />)}
        </div>

        {Object.entries(systems).map(([sk, sys]) => {
          const items = allItems.filter(i => i.systems.includes(sk));
          return <div key={sk} style={{ marginBottom: "20px" }}>
            <SL t={t} icon={sys.i} title={sys.n} count={items.length} color={sys.c} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px" }}>
              {items.map(i => <MedCard key={i.id} item={i} t={t} conf={conf[i.id]} onConf={v => setConf(p => ({ ...p, [i.id]: v }))} onOpen={() => nav(i)} />)}
              {items.length === 0 && <PlaceholderCard t={t} text={`No ${sys.n.toLowerCase()} content yet`} />}
            </div>
          </div>;
        })}
      </>}

      {/* Quiz History */}
      {qHist.length > 0 && <div style={{ marginTop: "8px" }}>
        <SL t={t} icon="📊" title="Quiz History" count={qHist.length} />
        {qHist.slice(-5).reverse().map((h, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", background: t.bgC, borderRadius: "7px", border: `1px solid ${t.bd}`, marginBottom: "5px", fontSize: "12px" }}>
            <span>{h.label} <span style={{ color: t.tM, marginLeft: "6px" }}>{h.d}</span></span>
            <span style={{ fontWeight: 700, color: h.c / h.t >= 0.8 ? t.ok : t.wn }}>{h.c}/{h.t}</span>
          </div>
        ))}
      </div>}
    </div>
  );
}
