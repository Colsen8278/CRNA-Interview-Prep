import { useState, useEffect, useRef, useMemo, useCallback } from "react";

import { TH } from "./data/themes.js";
import { dlPDF, dlDiagram } from "./utils/pdf.js";
import { MEDS } from "./data/medications.js";
import { PROTOS } from "./data/protocols.js";
import { QUIZZES } from "./data/quizzes.js";
import { RECEPTORS } from "./data/receptors.js";
import { SYS } from "./data/systems.js";

import { SL, Stat, PH, Pill, Stars } from "./components/ui.jsx";
import { ItemCard } from "./components/ItemCard.jsx";
import { ProtoCard } from "./components/ProtoCard.jsx";
import { SearchRow } from "./components/SearchRow.jsx";
import { MedDetail } from "./components/MedDetail.jsx";
import { ProtoDetail } from "./components/ProtoDetail.jsx";
import { ReceptorDetail } from "./components/ReceptorDetail.jsx";
import { NotesBox } from "./components/NotesBox.jsx";
import { AcidBase } from "./components/AcidBase.jsx";
import { CRRTDevice } from "./components/CRRTDevice.jsx";
import { VentDevice } from "./components/VentDevice.jsx";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [pg, setPg] = useState("dash");
  const [vm, setVm] = useState("type");
  const [sq, setSq] = useState("");
  const [so, setSo] = useState(false);
  const [sel, setSel] = useState(null);
  const [tab, setTab] = useState("overview");
  const [proto, setProto] = useState(null);
  const [deviceView, setDeviceView] = useState(null);
  const [qCat, setQCat] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [qRev, setQRev] = useState(false);
  const [qSc, setQSc] = useState({ c: 0, t: 0 });
  const [conf, setConf] = useState({});
  const [notes, setNotes] = useState({});
  const [qHist, setQHist] = useState([]);
  const [collapsed, setCollapsed] = useState({});
  const [sbOpen, setSbOpen] = useState(true);
  const [recSel, setRecSel] = useState(null);
  const [recTab, setRecTab] = useState("overview");
  const [ipTab, setIpTab] = useState("Narrative");
  const sRef = useRef(null);
  const t = TH[theme];

  const toggleSection = (key) => setCollapsed(p => ({ ...p, [key]: !p[key] }));

  const allItems = MEDS;

  const fs = useMemo(() => {
    const q = sq.toLowerCase().trim();
    if (!q) return { items: allItems, protos: PROTOS };
    return {
      items: allItems.filter(i => i.name.toLowerCase().includes(q) || i.tags.some(t => t.toLowerCase().includes(q))),
      protos: PROTOS.filter(p => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q) || p.sum.toLowerCase().includes(q)),
    };
  }, [sq, allItems]);

  const prog = useMemo(() => {
    const total = allItems.length + PROTOS.length || 1;
    const reviewed = Object.values(conf).filter(v => v >= 3).length;
    return Math.round((reviewed / total) * 100);
  }, [conf, allItems]);

  const weakAreas = useMemo(() => {
    const items = [];
    allItems.forEach(i => { if (conf[i.id] && conf[i.id] <= 2) items.push({ id: i.id, name: i.name, stars: conf[i.id], type: "med" }); });
    PROTOS.forEach(p => { if (conf[p.id] && conf[p.id] <= 2) items.push({ id: p.id, name: p.name, stars: conf[p.id], type: "proto" }); });
    return items;
  }, [conf, allItems]);

  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSo(x => !x); }
      if (e.key === "Escape") setSo(false);
      // Quiz shortcuts
      if (pg === "quiz" && qCat) {
        if (e.code === "Space" && !qRev) { e.preventDefault(); setQRev(true); }
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [pg, qCat, qRev]);

  useEffect(() => { if (so && sRef.current) sRef.current.focus(); }, [so]);

  const nav = (i) => { setSel(i); setTab("overview"); setPg("detail"); setSo(false); setSq(""); };
  const oPro = (p) => { setProto(p); setPg("proto"); setSo(false); setSq(""); };
  const recMedClick = (medId) => { const m = MEDS.find(x => x.id === medId); if (m) nav(m); };
  const oRec = (r) => { setRecSel(r); setRecTab("overview"); setPg("receptor"); setSo(false); setSq(""); };
  const oDev = (d) => { setDeviceView(d); setPg("device"); setSo(false); setSq(""); };
  const sQuiz = (c) => { setQCat(c); setQIdx(0); setQRev(false); setQSc({ c: 0, t: 0 }); setPg("quiz"); };
  const nxtQ = (ok) => {
    const s = { c: qSc.c + (ok ? 1 : 0), t: qSc.t + 1 }; setQSc(s);
    if (qIdx + 1 >= QUIZZES[qCat].items.length) { setQHist(p => [...p, { cat: qCat, label: QUIZZES[qCat].label, ...s, d: new Date().toLocaleDateString() }]); setPg("qres"); }
    else { setQIdx(qIdx + 1); setQRev(false); }
  };

  const sidebarLinks = [
    { id: "dash", label: "Dashboard", icon: "D" },
    { id: "pg-meds", label: "Pharmacology", icon: "Rx" },
    { id: "pg-recep", label: "Receptor Pharm", icon: "Rp" },
    { id: "pg-phys", label: "Physiology", icon: "Ph" },
    { id: "pg-anes", label: "Anesthesia", icon: "An" },
    { id: "pg-icu", label: "ICU Scenarios", icon: "IC" },
    { id: "pg-devices", label: "Devices", icon: "DV" },
    { id: "pg-acls", label: "ACLS / PALS", icon: "AL" },
    { id: "pg-behav", label: "Interview Points", icon: "IP" },
    { id: "pg-ref", label: "Quick Ref", icon: "QR" },
    { id: "pg-exp", label: "Experience Bank", icon: "Ex" },
    { id: "pg-quiz", label: "Quizzes", icon: "Q" },
  ];

  const activePg = (pg === "detail" || pg === "proto" || pg === "quiz" || pg === "qres" || pg === "receptor" || pg === "device") ? null : pg;

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: t.bg, color: t.tx, minHeight: "100vh", transition: "background 0.3s, color 0.3s", display: "flex" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* SIDEBAR */}
      <aside style={{
        width: sbOpen ? "220px" : "56px",
        minHeight: "100vh",
        background: t.bgC,
        borderRight: `1px solid ${t.bd}`,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.2s ease",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 150,
        overflow: "hidden",
      }}>
        {/* Sidebar header */}
        <div style={{ padding: sbOpen ? "16px 16px 12px" : "16px 10px 12px", display: "flex", alignItems: "center", gap: "10px", borderBottom: `1px solid ${t.bd}` }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `linear-gradient(135deg,${t.ac},${t.bl})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "#fff", fontSize: "12px", fontWeight: 700 }}>CR</span>
          </div>
          {sbOpen && <span style={{ fontSize: "15px", fontWeight: 700, whiteSpace: "nowrap" }}>CRNA Prep</span>}
        </div>

        {/* Sidebar nav links */}
        <nav style={{ flex: 1, padding: "8px", display: "flex", flexDirection: "column", gap: "2px", overflowY: "auto" }}>
          {sidebarLinks.map(link => {
            const isActive = activePg === link.id;
            return (
              <button
                key={link.id}
                onClick={() => { setPg(link.id); setSel(null); setProto(null); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: sbOpen ? "9px 12px" : "9px 0",
                  justifyContent: sbOpen ? "flex-start" : "center",
                  background: isActive ? t.aD : "transparent",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  color: isActive ? t.ac : t.t2,
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 500,
                  width: "100%",
                  textAlign: "left",
                  transition: "background 0.15s, color 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = t.bgH; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ width: "24px", height: "24px", borderRadius: "6px", background: isActive ? `${t.ac}20` : t.bgS, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: isActive ? t.ac : t.tM, flexShrink: 0 }}>{link.icon}</span>
                {sbOpen && <span>{link.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar collapse toggle */}
        <button
          onClick={() => setSbOpen(!sbOpen)}
          style={{
            padding: "12px",
            background: "none",
            border: "none",
            borderTop: `1px solid ${t.bd}`,
            cursor: "pointer",
            color: t.tM,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: sbOpen ? "flex-end" : "center",
          }}
        >
          {sbOpen ? "\u25C0" : "\u25B6"}
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div style={{ marginLeft: sbOpen ? "220px" : "56px", flex: 1, minHeight: "100vh", transition: "margin-left 0.2s ease", display: "flex", flexDirection: "column" }}>

        {/* TOP BAR */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "8px 16px", borderBottom: `1px solid ${t.bd}`, background: t.bgC, position: "sticky", top: 0, zIndex: 100, gap: "8px" }}>
          {(pg === "detail" || pg === "proto" || pg === "receptor" || pg === "device") && (
            <button onClick={() => { if (pg === "receptor") { setPg("pg-recep"); setRecSel(null); } else { setPg("dash"); setSel(null); setProto(null); setDeviceView(null); } }} style={{ marginRight: "auto", background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "6px", padding: "5px 12px", color: t.t2, cursor: "pointer", fontSize: "12px", fontWeight: 500 }}>
              \u2190 Back
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "auto" }}>
            <button onClick={() => setSo(true)} style={{ display: "flex", alignItems: "center", gap: "8px", background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "8px", padding: "6px 14px", color: t.tM, cursor: "pointer", fontSize: "13px" }}>
              Search...<span style={{ background: t.bgC, padding: "2px 6px", borderRadius: "4px", fontSize: "10px", border: `1px solid ${t.bd}`, marginLeft: "8px", fontFamily: "monospace" }}>{"\u2318"}K</span>
            </button>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "12px", fontWeight: 500, color: t.t2 }}>
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </nav>

        {/* SEARCH MODAL */}
        {so && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", justifyContent: "center", paddingTop: "10vh" }} onClick={() => setSo(false)}>
          <div style={{ background: t.bgC, borderRadius: "14px", width: "92%", maxWidth: "520px", maxHeight: "440px", overflow: "hidden", border: `1px solid ${t.bd}`, boxShadow: t.sh }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderBottom: `1px solid ${t.bd}` }}>
              <input ref={sRef} value={sq} onChange={e => setSq(e.target.value)} placeholder="Search meds, protocols, quizzes..." style={{ flex: 1, background: "none", border: "none", outline: "none", color: t.tx, fontSize: "14px" }} />
              <button onClick={() => setSo(false)} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "5px", padding: "2px 8px", color: t.tM, cursor: "pointer", fontSize: "10px", fontFamily: "monospace" }}>ESC</button>
            </div>
            <div style={{ maxHeight: "380px", overflowY: "auto", padding: "4px" }}>
              {fs.items.map(i => <SearchRow key={i.id} icon="Rx" title={i.name} sub={i.tags.slice(0, 2).join(" \u00B7 ")} stars={conf[i.id]} onClick={() => nav(i)} t={t} />)}
              {fs.protos.map(p => <SearchRow key={p.id} icon="ALS" title={p.name} sub={p.cat} stars={conf[p.id]} onClick={() => oPro(p)} t={t} />)}
              {Object.entries(QUIZZES).map(([k, v]) => <SearchRow key={k} icon="Q" title={`${v.label} Quiz`} sub={`${v.items.length} questions`} onClick={() => sQuiz(k)} t={t} />)}
              {RECEPTORS.filter(r => !sq || r.name.toLowerCase().includes(sq.toLowerCase()) || r.short.toLowerCase().includes(sq.toLowerCase())).map(r => <SearchRow key={r.id} icon="Rp" title={r.name} sub={r.short} onClick={() => oRec(r)} t={t} />)}
              {fs.items.length === 0 && fs.protos.length === 0 && sq && <div style={{ padding: "32px", textAlign: "center", color: t.tM }}>No results</div>}
            </div>
          </div>
        </div>}

        {/* PAGE CONTENT */}
        <div style={{ flex: 1, overflowY: "auto" }}>

        {/* DASHBOARD */}
        {pg === "dash" && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "10px", marginBottom: "20px" }}>
            <Stat t={t} label="Study Sheets" value={allItems.length} icon="Rx" accent={t.ac} onClick={() => setPg("pg-meds")} />
            <Stat t={t} label="ACLS/PALS Protocols" value={PROTOS.length} icon="ALS" accent="#ef4444" onClick={() => setPg("pg-acls")} />
            <Stat t={t} label="Quizzes" value={Object.keys(QUIZZES).length} icon="Q" accent={t.pr} onClick={() => setPg("pg-quiz")} />
            <div style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}><span style={{ fontSize: "11px", color: t.tM, fontWeight: 500 }}>Mastery (&ge;3)</span><span style={{ fontSize: "16px", fontWeight: 700, color: t.ac }}>{prog}%</span></div>
              <div style={{ height: "5px", background: t.bgS, borderRadius: "3px" }}><div style={{ height: "100%", width: `${prog}%`, background: `linear-gradient(90deg,${t.ac},${t.bl})`, borderRadius: "3px", transition: "width 0.5s" }} /></div>
            </div>
          </div>

          {/* Weak Areas */}
          {weakAreas.length > 0 && <div style={{ marginBottom: "20px", padding: "14px 16px", background: `${t.wn}08`, borderRadius: "10px", border: `1px solid ${t.wn}30` }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: t.wn, marginBottom: "8px" }}>Focus Areas (rated 2 or below)</div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {weakAreas.map(w => <button key={w.id} onClick={() => w.type === "med" ? nav(MEDS.find(m => m.id === w.id)) : oPro(PROTOS.find(p => p.id === w.id))} style={{ background: t.bgC, border: `1px solid ${t.wn}40`, borderRadius: "7px", padding: "5px 12px", cursor: "pointer", fontSize: "12px", color: t.tx, fontWeight: 500 }}>
                {w.name}
              </button>)}
            </div>
          </div>}

          {/* View Toggle */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>Study Library</h2>
            <div style={{ display: "flex", background: t.bgS, borderRadius: "8px", padding: "3px", border: `1px solid ${t.bd}` }}>
              <Pill t={t} text="By Type" active={vm === "type"} onClick={() => setVm("type")} />
              <Pill t={t} text="By System" active={vm === "system"} onClick={() => setVm("system")} />
            </div>
          </div>

          {vm === "type" && <>
            <SL t={t} icon="Rx" title="Medications" count={MEDS.length} collapsed={collapsed.meds} onToggle={() => toggleSection("meds")} />
            {!collapsed.meds && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
              {MEDS.map(i => <ItemCard key={i.id} item={i} t={t} conf={conf[i.id]} onConf={v => setConf(p => ({ ...p, [i.id]: v }))} onOpen={() => nav(i)} />)}
              <PH t={t} text="More medications coming..." />
            </div>}

            <SL t={t} icon="ALS" title="ACLS & PALS Protocols" count={PROTOS.length} color="#ef4444" collapsed={collapsed.protos} onToggle={() => toggleSection("protos")} />
            {!collapsed.protos && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
              {PROTOS.map(p => <ProtoCard key={p.id} p={p} t={t} conf={conf[p.id]} onConf={v => setConf(prev => ({ ...prev, [p.id]: v }))} onOpen={() => oPro(p)} />)}
            </div>}

            <SL t={t} icon="DEV" title="Devices" count={2} collapsed={collapsed.devices} onToggle={() => toggleSection("devices")} />
            {!collapsed.devices && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
              <div onClick={() => oDev("crrt")} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><span style={{ fontSize: "13px", fontWeight: 700, color: t.ac, background: t.aD, padding: "2px 8px", borderRadius: "4px" }}>DEV</span><span style={{ fontSize: "15px", fontWeight: 600, color: t.tx }}>CRRT</span></div>
                <div style={{ fontSize: "12px", color: t.tM, marginBottom: "4px" }}>Continuous Renal Replacement Therapy</div>
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>{["Extracorporeal Circuit","Hemofiltration"].map(tg => <span key={tg} style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: t.aD, color: t.ac, border: `1px solid ${t.aB}` }}>{tg}</span>)}</div>
              </div>
            <div onClick={() => oDev("vent")} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><span style={{ fontSize: "13px", fontWeight: 700, color: t.ac, background: t.aD, padding: "2px 8px", borderRadius: "4px" }}>DEV</span><span style={{ fontSize: "15px", fontWeight: 600, color: t.tx }}>Ventilator Modes</span></div>
              <div style={{ fontSize: "12px", color: t.tM, marginBottom: "4px" }}>Mechanical Ventilation & Anesthesia</div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>{["Vent Modes","Oxygenation","Waveforms"].map(tg => <span key={tg} style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: t.aD, color: t.ac, border: `1px solid ${t.aB}` }}>{tg}</span>)}</div>
            </div>
              <PH t={t} text="More devices coming..." />
            </div>}
            <SL t={t} icon="PHY" title="Physiology Concepts" count={0} collapsed={collapsed.physio} onToggle={() => toggleSection("physio")} />
            {!collapsed.physio && <div style={{ marginBottom: "20px" }}><PH t={t} text="Ask about Frank-Starling, MAC, O2-Hb curve..." /></div>}

            <SL t={t} icon="Q" title="Quizzes" count={Object.keys(QUIZZES).length} collapsed={collapsed.quizzes} onToggle={() => toggleSection("quizzes")} />
            {!collapsed.quizzes && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
              {Object.entries(QUIZZES).map(([k, v]) => (
                <div key={k} onClick={() => sQuiz(k)} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}><span style={{ fontSize: "15px", fontWeight: 600 }}>{v.label}</span></div>
                  <div style={{ fontSize: "12px", color: t.tM, marginBottom: "10px" }}>{v.items.length} questions</div>
                  <div style={{ background: t.ac, color: t.acTx, padding: "7px 14px", borderRadius: "7px", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>Start Quiz</div>
                </div>
              ))}
            </div>}
          </>}

          {vm === "system" && <>
            <SL t={t} icon="ALS" title="ACLS & PALS Protocols" count={PROTOS.length} color="#ef4444" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
              {PROTOS.map(p => <ProtoCard key={p.id} p={p} t={t} conf={conf[p.id]} onConf={v => setConf(prev => ({ ...prev, [p.id]: v }))} onOpen={() => oPro(p)} />)}
            </div>

            {Object.entries(SYS).map(([sk, sys]) => {
              const items = allItems.filter(i => i.systems.includes(sk));
              return <div key={sk} style={{ marginBottom: "20px" }}>
                <SL t={t} icon={sys.i} title={sys.n} count={items.length} color={sys.c} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px" }}>
                  {items.map(i => <ItemCard key={i.id} item={i} t={t} conf={conf[i.id]} onConf={v => setConf(p => ({ ...p, [i.id]: v }))} onOpen={() => nav(i)} />)}
                  {items.length === 0 && <PH t={t} text={`No ${sys.n.toLowerCase()} content yet`} />}
                </div>
              </div>;
            })}
          </>}

          {qHist.length > 0 && <div style={{ marginTop: "8px" }}>
            <SL t={t} icon="" title="Quiz History" count={qHist.length} />
            {qHist.slice(-5).reverse().map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", background: t.bgC, borderRadius: "7px", border: `1px solid ${t.bd}`, marginBottom: "5px", fontSize: "12px" }}>
                <span>{h.label} <span style={{ color: t.tM, marginLeft: "6px" }}>{h.d}</span></span>
                <span style={{ fontWeight: 700, color: h.c / h.t >= 0.8 ? t.ok : t.wn }}>{h.c}/{h.t}</span>
              </div>
            ))}
          </div>}
        </div>}

        {/* STUDY SHEETS PAGE */}
        {pg === "pg-meds" && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>Study Sheets</h2>
            <p style={{ margin: "2px 0 0", color: t.tM, fontSize: "13px" }}>{allItems.length} medication{allItems.length !== 1 ? "s" : ""} loaded</p>
          </div>
          <SL t={t} icon="Rx" title="Medications" count={MEDS.length} collapsed={collapsed.pgMeds} onToggle={() => toggleSection("pgMeds")} />
          {!collapsed.pgMeds && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "24px" }}>
            {MEDS.map(i => <ItemCard key={i.id} item={i} t={t} conf={conf[i.id]} onConf={v => setConf(p => ({ ...p, [i.id]: v }))} onOpen={() => nav(i)} />)}
            <PH t={t} text="More medications coming..." />
          </div>}
          <SL t={t} icon="DEV" title="Devices" count={2} collapsed={collapsed.pgDev} onToggle={() => toggleSection("pgDev")} />
          {!collapsed.pgDev && <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "24px" }}>
            <div onClick={() => oDev("crrt")} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><span style={{ fontSize: "13px", fontWeight: 700, color: t.ac, background: t.aD, padding: "2px 8px", borderRadius: "4px" }}>DEV</span><span style={{ fontSize: "15px", fontWeight: 600, color: t.tx }}>CRRT</span></div>
              <div style={{ fontSize: "12px", color: t.tM, marginBottom: "4px" }}>Continuous Renal Replacement Therapy</div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>{["Extracorporeal Circuit","Hemofiltration"].map(tg => <span key={tg} style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: t.aD, color: t.ac, border: `1px solid ${t.aB}` }}>{tg}</span>)}</div>
            </div>
          <div onClick={() => oDev("vent")} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><span style={{ fontSize: "13px", fontWeight: 700, color: t.ac, background: t.aD, padding: "2px 8px", borderRadius: "4px" }}>DEV</span><span style={{ fontSize: "15px", fontWeight: 600, color: t.tx }}>Ventilator Modes</span></div>
            <div style={{ fontSize: "12px", color: t.tM, marginBottom: "4px" }}>Mechanical Ventilation & Anesthesia</div>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>{["Vent Modes","Oxygenation","Waveforms"].map(tg => <span key={tg} style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: t.aD, color: t.ac, border: `1px solid ${t.aB}` }}>{tg}</span>)}</div>
          </div>
            <PH t={t} text="More devices coming..." />
          </div>}
          <SL t={t} icon="PHY" title="Physiology Concepts" count={0} collapsed={collapsed.pgPhys} onToggle={() => toggleSection("pgPhys")} />
          {!collapsed.pgPhys && <div style={{ marginBottom: "24px" }}><PH t={t} text="Ask about Frank-Starling, MAC, O2-Hb curve..." /></div>}
        </div>}

        {/* ACLS PROTOCOLS PAGE */}
        {pg === "pg-acls" && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>ACLS & PALS Protocols</h2>
            <p style={{ margin: "2px 0 0", color: t.tM, fontSize: "13px" }}>{PROTOS.length} algorithm{PROTOS.length !== 1 ? "s" : ""} loaded</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "12px" }}>
            {PROTOS.map(p => <ProtoCard key={p.id} p={p} t={t} conf={conf[p.id]} onConf={v => setConf(prev => ({ ...prev, [p.id]: v }))} onOpen={() => oPro(p)} />)}
          </div>
        </div>}

        {/* DEVICES PAGE */}
        {pg === "pg-devices" && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>Devices & Equipment</h2>
            <p style={{ margin: "2px 0 0", color: t.tM, fontSize: "13px" }}>2 devices loaded</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "24px" }}>
            <div onClick={() => oDev("crrt")} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><span style={{ fontSize: "13px", fontWeight: 700, color: t.ac, background: t.aD, padding: "2px 8px", borderRadius: "4px" }}>DEV</span><span style={{ fontSize: "15px", fontWeight: 600, color: t.tx }}>CRRT</span></div>
              <div style={{ fontSize: "12px", color: t.tM, marginBottom: "4px" }}>Continuous Renal Replacement Therapy</div>
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>{["Extracorporeal Circuit","Hemofiltration"].map(tg => <span key={tg} style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: t.aD, color: t.ac, border: `1px solid ${t.aB}` }}>{tg}</span>)}</div>
            </div>
          <div onClick={() => oDev("vent")} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><span style={{ fontSize: "13px", fontWeight: 700, color: t.ac, background: t.aD, padding: "2px 8px", borderRadius: "4px" }}>DEV</span><span style={{ fontSize: "15px", fontWeight: 600, color: t.tx }}>Ventilator Modes</span></div>
            <div style={{ fontSize: "12px", color: t.tM, marginBottom: "4px" }}>Mechanical Ventilation & Anesthesia</div>
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>{["Vent Modes","Oxygenation","Waveforms"].map(tg => <span key={tg} style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: t.aD, color: t.ac, border: `1px solid ${t.aB}` }}>{tg}</span>)}</div>
          </div>
            <PH t={t} text="More devices coming..." />
          </div>
        </div>}

                {pg === "pg-phys" && <AcidBase theme={theme} t={t} />}

                {(pg === "pg-anes" || pg === "pg-icu" || pg === "pg-ref" || pg === "pg-exp") && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 700 }}>{sidebarLinks.find(l => l.id === pg)?.label}</h2>
          <p style={{ color: t.tM, fontSize: "13px", marginBottom: "20px" }}>Content coming soon</p>
          <PH t={t} text={`${sidebarLinks.find(l => l.id === pg)?.label} content will appear here...`} />
        </div>}

        {/* INTERVIEW POINTS PAGE */}
        {pg === "pg-behav" && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700 }}>Interview Points</h2>
            <p style={{ margin: 0, color: t.tM, fontSize: "13px" }}>Core narratives, frameworks, and angles for CRNA program interviews</p>
          </div>

          {/* Tab Nav */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "24px", borderBottom: `1px solid ${t.bd}`, paddingBottom: "0" }}>
            {["Narrative", "Analogies", "Stories", "Questions"].map(tab => (
              <button key={tab} onClick={() => setIpTab(tab)} style={{
                padding: "9px 18px", border: "none", background: "transparent", cursor: "pointer",
                fontSize: "13px", fontWeight: ipTab === tab ? 700 : 500,
                color: ipTab === tab ? t.ac : t.t2,
                borderBottom: ipTab === tab ? `2px solid ${t.ac}` : "2px solid transparent",
                marginBottom: "-1px", transition: "color 0.15s, border-color 0.15s",
              }}>{tab}</button>
            ))}
          </div>

          {/* NARRATIVE TAB */}
          {ipTab === "Narrative" && <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Clinical Systems Thinker */}
            <div style={{ background: t.bgC, border: `1px solid ${t.bd}`, borderLeft: `4px solid ${t.ac}`, borderRadius: "12px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "9px", background: `${t.ac}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: t.ac }}>CS</span>
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700 }}>Clinical Systems Thinker</div>
                  <div style={{ fontSize: "12px", color: t.tM }}>Core identity &mdash; Why CRNA</div>
                </div>
              </div>
              <p style={{ margin: "0 0 14px", fontSize: "14px", lineHeight: "1.75", color: t.tx }}>
                You analyze complex, dynamic systems &mdash; identify inefficiencies or gaps &mdash; then engineer a solution. You have done this repeatedly at the unit level. Anesthesia is that exact skill applied at the individual patient level. Every anesthetic plan is a custom-built solution for a single patient&apos;s unique physiology.
              </p>
              <div style={{ padding: "14px 18px", background: t.bgS, borderLeft: `3px solid ${t.ac}`, borderRadius: "0 8px 8px 0", fontSize: "13px", lineHeight: "1.75", color: t.t2, fontStyle: "italic" }}>
                &ldquo;I don&apos;t just want to make independent decisions &mdash; I have a demonstrated methodology for doing so, and a track record of outcomes.&rdquo;
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "14px" }}>
                {[
                  { label: "Clinical Systems Thinker", sub: "your cognitive style" },
                  { label: "Unit-Level Process Engineer", sub: "your track record" },
                  { label: "Precision Practitioner", sub: "where you are headed" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "9px 14px", background: t.bgS, borderRadius: "8px", border: `1px solid ${t.bd}` }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: t.ac, flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", fontWeight: 600, color: t.tx }}>&ldquo;{item.label}&rdquo;</span>
                    <span style={{ fontSize: "12px", color: t.tM }}>&mdash; {item.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution-Oriented / Curiosity-Driven */}
            <div style={{ background: t.bgC, border: `1px solid ${t.bd}`, borderLeft: `4px solid ${t.bl}`, borderRadius: "12px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "9px", background: `${t.bl}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: t.bl }}>SO</span>
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700 }}>Solution-Oriented &amp; Curiosity-Driven</div>
                  <div style={{ fontSize: "12px", color: t.tM }}>How I think &mdash; the mechanism behind the approach</div>
                </div>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: "14px", lineHeight: "1.75", color: t.tx }}>
                When something doesn&apos;t have an immediate answer, that&apos;s not frustrating &mdash; that&apos;s exciting. I ask why things are the way they are, not to challenge the process, but to understand it fully. If there&apos;s no answer, I get curious. That same curiosity is what drives my educational growth.
              </p>
              <p style={{ margin: "0 0 12px", fontSize: "14px", lineHeight: "1.75", color: t.tx }}>
                I don&apos;t create new processes just to generate work. The goal is always to make processes more efficient, enhance safety, and improve outcomes. Any new process has to improve the current workflow, reduce workload, and increase satisfaction &mdash; otherwise it won&apos;t be adopted, and adoption is everything.
              </p>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.75", color: t.tx }}>
                When rolling out something new, I explain the reason behind it. I don&apos;t develop and implement and stop. I roll it out, gather feedback, and continue refining. I am committed to every stage &mdash; development through post-implementation &mdash; because the needs of the system keep evolving.
              </p>
            </div>

            {/* Cross-Functional Collaboration */}
            <div style={{ background: t.bgC, border: `1px solid ${t.bd}`, borderLeft: `4px solid ${t.pr}`, borderRadius: "12px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "9px", background: `${t.pr}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: t.pr }}>CF</span>
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700 }}>Cross-Functional Collaboration</div>
                  <div style={{ fontSize: "12px", color: t.tM }}>Gift of Life &amp; Implementation Specialist roles</div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.75", color: t.tx }}>
                Meaningful improvement in complex healthcare systems requires experts across disciplines working together toward a unified goal. My work with the Gift of Life project and in Implementation Specialist roles placed me at exactly that intersection &mdash; coordinating across nursing, surgery, organ procurement, and administration to execute processes where the margin for error was zero and the stakes were the highest possible.
              </p>
            </div>

            {/* Speed vs Safety */}
            <div style={{ background: t.bgC, border: `1px solid ${t.bd}`, borderLeft: `4px solid ${t.wn}`, borderRadius: "12px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "9px", background: `${t.wn}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: t.wn }}>SS</span>
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700 }}>Speed vs. Safety</div>
                  <div style={{ fontSize: "12px", color: t.tM }}>How I prioritize under pressure</div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.75", color: t.tx }}>
                It is never acceptable to sacrifice patient safety or risk patient outcomes just to meet a metric or timeline. Processes can take longer &mdash; that is okay, as long as the team understands and can account for the delay. A measurement is a tool. The patient is the mission. I have never confused the two, and that distinction is one I carry directly into how I think about anesthesia care.
              </p>
            </div>

            {/* Proactivity */}
            <div style={{ background: t.bgC, border: `1px solid ${t.bd}`, borderLeft: `4px solid ${t.ok}`, borderRadius: "12px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "9px", background: `${t.ok}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: t.ok }}>PR</span>
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700 }}>Proactivity</div>
                  <div style={{ fontSize: "12px", color: t.tM }}>Downstream thinking in real time</div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.75", color: t.tx }}>
                I understand how one decision can impact patient care hours or days later. I always think ahead &mdash; considering how my current actions will shape what comes next. In anesthesia, that mental model is not optional. Every induction decision, every fluid choice, every positioning consideration has a downstream consequence. I have been practicing that kind of thinking at the bedside for years.
              </p>
            </div>

          </div>}

          {/* ANALOGIES TAB */}
          {ipTab === "Analogies" && <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div style={{ background: t.bgC, border: `1px solid ${t.bd}`, borderLeft: `4px solid ${t.pk}`, borderRadius: "12px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "9px", background: `${t.pk}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: t.pk }}>PA</span>
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700 }}>The Painter Analogy</div>
                  <div style={{ fontSize: "12px", color: t.tM }}>Use when asked: &ldquo;Is there a right or wrong way to practice anesthesia?&rdquo;</div>
                </div>
              </div>

              <div style={{ padding: "18px 20px", background: t.bgS, borderRadius: "10px", border: `1px solid ${t.bd}`, fontSize: "14px", lineHeight: "1.85", color: t.t2, fontStyle: "italic", marginBottom: "20px" }}>
                <p style={{ margin: "0 0 14px" }}>
                  &ldquo;I think of CRNAs the way I think of painters. A master in oils and a master in watercolor can both capture the same landscape beautifully &mdash; same subject, same truth, completely different medium. Neither is wrong. Neither is lesser.
                </p>
                <p style={{ margin: "0 0 14px" }}>
                  But here&apos;s what matters: every medium has its own fundamentals. Oil painting demands an understanding of drying time, layering, and how pigments interact over time. Watercolor demands control of water-to-pigment ratios, transparency, and how the paper holds moisture. Ignore those fundamentals &mdash; in either medium &mdash; and the piece fails, regardless of how talented the artist is.
                </p>
                <p style={{ margin: "0 0 14px" }}>
                  Anesthesia is exactly the same. There are numerous correct paths to the same endpoint. But whichever path you choose &mdash; volatile-based, TIVA, regional-heavy &mdash; the fundamentals of that path have to be executed precisely. Airway management, hemodynamic stability, depth of anesthesia, reversal. Those don&apos;t change based on your medium. They&apos;re the reason the patient arrives safely.
                </p>
                <p style={{ margin: 0 }}>
                  The patient is the landscape. Our job is to honor them, protect them, and bring them through. What CRNA school gives me is not just the techniques &mdash; it&apos;s the clinical judgment to know which medium fits this patient, this case, this moment, and the mastery of fundamentals to execute it without compromise.&rdquo;
                </p>
              </div>

              <div style={{ fontSize: "11px", fontWeight: 700, color: t.pk, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>The Three Beats</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { n: "1", title: "Many valid paths exist", body: "The medium analogy &mdash; oils vs. watercolor, volatile vs. TIVA. Same destination, different technique. Neither is wrong." },
                  { n: "2", title: "Every path has non-negotiable fundamentals", body: "The safety anchor. Whichever medium you choose, the core principles of that approach must be executed precisely. This prevents the analogy from implying &ldquo;anything goes.&rdquo;" },
                  { n: "3", title: "Patient-centered close", body: "The patient is the landscape. Land it back on what matters &mdash; not technique preference, but honoring and protecting the individual in front of you." },
                ].map((beat, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", padding: "12px 16px", background: t.bgS, borderRadius: "8px", border: `1px solid ${t.bd}` }}>
                    <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: `${t.pk}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: t.pk }}>{beat.n}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "3px" }}>{beat.title}</div>
                      <div style={{ fontSize: "12px", color: t.t2, lineHeight: "1.6" }} dangerouslySetInnerHTML={{ __html: beat.body }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "16px", padding: "12px 16px", background: `${t.pk}10`, borderRadius: "8px", border: `1px solid ${t.pk}30` }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: t.pk, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.4px" }}>Key Line to Remember</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: t.tx, fontStyle: "italic" }}>&ldquo;The patient is the landscape.&rdquo;</div>
                <div style={{ fontSize: "12px", color: t.tM, marginTop: "4px" }}>This is the line that lands. Everything else builds to it.</div>
              </div>
            </div>

          </div>}

          {/* STORIES TAB */}
          {ipTab === "Stories" && <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div style={{ background: t.bgC, border: `1px solid ${t.bd}`, borderLeft: `4px solid ${t.ok}`, borderRadius: "12px", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "9px", background: `${t.ok}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: t.ok }}>DCD</span>
                </div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700 }}>Gift of Life &mdash; DCD Case</div>
                  <div style={{ fontSize: "12px", color: t.tM }}>Use for: proactivity, cross-functional collaboration, patient-centered care</div>
                </div>
              </div>

              <div style={{ fontSize: "11px", fontWeight: 700, color: t.ok, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>The Scenario</div>
              <p style={{ margin: "0 0 14px", fontSize: "14px", lineHeight: "1.75", color: t.tx }}>
                A young male patient was brought to the TNICU following a fall from a parking garage &mdash; a donation after cardiac death (DCD) case. In coordination with a perfusionist, the team performed bedside autotransfusion. The family was present throughout. In an objectively devastating situation, the process we had prepared for &mdash; the protocols, the cross-functional coordination, the proactive setup &mdash; created the only positive outcome available: a meaningful, dignified donation that gave other families a chance.
              </p>

              <div style={{ fontSize: "11px", fontWeight: 700, color: t.ok, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>What This Story Demonstrates</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
                {[
                  "Proactivity &mdash; the preparation that made the outcome possible happened long before that patient arrived",
                  "Cross-functional collaboration &mdash; nursing, surgery, organ procurement, perfusionist, family all working in concert",
                  "Patient and family-centered care under the most difficult possible circumstances",
                  "Downstream thinking &mdash; understanding that decisions made early in a case shape what is possible at the end",
                ].map((point, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", padding: "9px 14px", background: t.bgS, borderRadius: "8px", fontSize: "13px", color: t.t2 }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: t.ok, flexShrink: 0, marginTop: "6px" }} />
                    <span dangerouslySetInnerHTML={{ __html: point }} />
                  </div>
                ))}
              </div>

              <div style={{ padding: "12px 16px", background: `${t.ok}10`, borderRadius: "8px", border: `1px solid ${t.ok}30` }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: t.ok, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.4px" }}>Interview Framing</div>
                <div style={{ fontSize: "13px", color: t.t2, lineHeight: "1.7" }}>
                  When asked about a time you made a meaningful difference, or about proactivity, or about working in high-stakes interdisciplinary teams &mdash; this is your anchor story. The outcome was not saving the patient. The outcome was creating the only good that was possible from that situation. That distinction is powerful.
                </div>
              </div>
            </div>

            <div style={{ padding: "16px 20px", background: t.bgC, border: `1px dashed ${t.bd}`, borderRadius: "10px", textAlign: "center" }}>
              <p style={{ margin: 0, color: t.tM, fontSize: "13px" }}>Additional stories coming &mdash; add your STAR framework entries here as you build them out</p>
            </div>

          </div>}

          {/* QUESTIONS TAB */}
          {ipTab === "Questions" && <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[
              {
                q: "Why do you want to become a CRNA?",
                a: "Lead with the Clinical Systems Thinker narrative. You are drawn to problems that require deep system understanding before you can change them. Your TNICU projects reflect that discipline. Anesthesia applies that same thinking to human physiology &mdash; every patient is a unique system requiring a custom-built solution.",
                tags: ["Identity", "Why CRNA"],
              },
              {
                q: "Is there a right or wrong way to practice anesthesia?",
                a: "The Painter Analogy. Many valid paths exist. Each path has non-negotiable fundamentals. The patient is the landscape. Land on patient-centered care at the close.",
                tags: ["Philosophy", "Analogy"],
              },
              {
                q: "Tell me about a time you made a meaningful difference.",
                a: "The DCD / Gift of Life case. Bedside autotransfusion with a perfusionist, family present. The preparation and cross-functional coordination made the only positive outcome possible from that situation.",
                tags: ["Story", "STAR"],
              },
              {
                q: "How do you handle a situation where you disagree with a process or protocol?",
                a: "Lead with curiosity &mdash; you ask why things are the way they are to understand fully, not to challenge. If a gap exists, you work through the appropriate channels, build the evidence, and propose solutions that improve workflow and are likely to be adopted.",
                tags: ["Behavioral", "Philosophy"],
              },
              {
                q: "How do you approach patient safety when speed is being prioritized?",
                a: "Direct answer: patient safety is never the variable. It is never acceptable to sacrifice outcomes to meet a metric. Processes can take longer &mdash; as long as the team understands and accounts for the delay. The measurement is a tool. The patient is the mission.",
                tags: ["Safety", "Values"],
              },
            ].map((item, i) => (
              <div key={i} style={{ background: t.bgC, border: `1px solid ${t.bd}`, borderRadius: "10px", padding: "18px 20px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: t.ac, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" }}>Interview Question</div>
                <div style={{ fontSize: "15px", fontWeight: 600, color: t.tx, marginBottom: "12px", lineHeight: "1.5" }}>&ldquo;{item.q}&rdquo;</div>
                <div style={{ fontSize: "11px", fontWeight: 700, color: t.t2, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" }}>Answer Framework</div>
                <div style={{ fontSize: "13px", color: t.t2, lineHeight: "1.7", marginBottom: "12px" }}>{item.a}</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {item.tags.map(tag => (
                    <span key={tag} style={{ fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "6px", background: t.bgS, color: t.tM, border: `1px solid ${t.bd}` }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>}

        </div>}


        {/* RECEPTOR PHARMACOLOGY HUB */}
        {pg === "pg-recep" && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700 }}>Receptor Pharmacology</h2>
            <p style={{ margin: 0, color: t.tM, fontSize: "13px" }}>The four fundamental receptor superfamilies through which nearly all drugs act</p>
          </div>

          {/* 2x2 Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "14px", marginBottom: "28px" }}>
            {RECEPTORS.map(r => (
              <div key={r.id} onClick={() => oRec(r)} style={{ padding: "20px", background: t.bgC, borderRadius: "12px", border: `1px solid ${t.bd}`, borderLeft: `4px solid ${r.color}`, cursor: "pointer", transition: "border-color 0.15s, transform 0.15s" }} onMouseEnter={e => { e.currentTarget.style.borderColor = r.color; e.currentTarget.style.transform = "translateY(-2px)"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = t.bd; e.currentTarget.style.transform = "none"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${r.color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "14px", fontWeight: 700, color: r.color }}>{r.id === "lgic" ? "IC" : r.id === "gpcr" ? "GP" : r.id === "rtk" ? "TK" : "NR"}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 700 }}>{r.name}</div>
                    <div style={{ fontSize: "11px", color: t.tM }}>{r.short}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                  <span style={{ background: `${r.color}12`, color: r.color, padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 600 }}>{r.speed}</span>
                  <span style={{ background: t.bgS, color: t.tM, padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 500 }}>{r.mechanism}</span>
                </div>
                <div style={{ fontSize: "12px", color: t.t2 }}>
                  {r.linkedMeds.length > 0
                    ? <span>{r.linkedMeds.length} linked med{r.linkedMeds.length !== 1 ? "s" : ""}: {r.linkedMeds.map(m => m.name).join(", ")}</span>
                    : <span style={{ fontStyle: "italic", color: t.tM }}>No linked meds yet</span>
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>Side-by-Side Comparison</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "700px" }}>
                <thead>
                  <tr style={{ background: t.bgS }}>
                    {["Feature", "Ligand-Gated Ion Channel", "GPCR", "Enzyme-Linked", "Intracellular/Nuclear"].map(h => (
                      <th key={h} style={{ padding: "10px", borderBottom: `2px solid ${t.bd}`, textAlign: "left", color: t.ac, fontWeight: 600, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.3px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { f: "Location", v: ["Cell membrane", "Cell membrane", "Cell membrane", "Cytoplasm / Nucleus"] },
                    { f: "Structure", v: ["Pentameric channel", "7TM + G-protein", "Single TM + kinase", "Transcription factor"] },
                    { f: "Mechanism", v: ["Direct ion flux", "G-protein --> 2nd messengers", "Phosphorylation cascades", "Gene transcription"] },
                    { f: "Speed", v: ["Milliseconds", "Seconds-minutes", "Minutes-hours", "Hours-days"] },
                    { f: "Amplification", v: ["None (1:1)", "High (cascade)", "Moderate", "High (gene products)"] },
                    { f: "Key Examples", v: ["GABA-A, nACh, NMDA", "alpha/beta adrenergic, opioid, V1/V2", "Insulin-R, EGFR, ANP-R", "Glucocorticoid-R, Thyroid-R"] },
                    { f: "Prototype Drug", v: ["Propofol, Succinylcholine", "Norepinephrine, Morphine", "Insulin", "Dexamethasone"] },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${t.bd}` }}>
                      <td style={{ padding: "8px 10px", fontWeight: 600, color: t.tx }}>{row.f}</td>
                      {row.v.map((v, j) => (
                        <td key={j} style={{ padding: "8px 10px", color: t.t2 }}>{v}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>}

        {/* RECEPTOR DETAIL PAGE */}
        {pg === "receptor" && recSel && <ReceptorDetail r={recSel} t={t} theme={theme} onMedClick={recMedClick} tab={recTab} setTab={setRecTab} />}

        {/* QUIZZES PAGE */}
        {pg === "pg-quiz" && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>Quizzes</h2>
            <p style={{ margin: "2px 0 0", color: t.tM, fontSize: "13px" }}>{Object.keys(QUIZZES).length} quiz bank{Object.keys(QUIZZES).length !== 1 ? "s" : ""} available</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "12px", marginBottom: "24px" }}>
            {Object.entries(QUIZZES).map(([k, v]) => (
              <div key={k} onClick={() => sQuiz(k)} style={{ padding: "20px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}><span style={{ fontSize: "22px" }}>{v.icon}</span><span style={{ fontSize: "18px", fontWeight: 700 }}>{v.label}</span></div>
                <div style={{ fontSize: "13px", color: t.tM, marginBottom: "14px" }}>{v.items.length} questions</div>
                <div style={{ background: t.ac, color: t.acTx, padding: "9px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textAlign: "center" }}>Start Quiz</div>
              </div>
            ))}
          </div>
          {qHist.length > 0 && <div>
            <SL t={t} icon="" title="Quiz History" count={qHist.length} />
            {qHist.slice(-10).reverse().map((h, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: t.bgC, borderRadius: "7px", border: `1px solid ${t.bd}`, marginBottom: "5px", fontSize: "13px" }}>
                <span>{h.label} <span style={{ color: t.tM, marginLeft: "8px" }}>{h.d}</span></span>
                <span style={{ fontWeight: 700, color: h.c / h.t >= 0.8 ? t.ok : t.wn }}>{h.c}/{h.t} ({Math.round(h.c / h.t * 100)}%)</span>
              </div>
            ))}
          </div>}
        </div>}

        {/* MEDICATION DETAIL */}
        {pg === "detail" && sel && <MedDetail item={sel} t={t} theme={theme} tab={tab} setTab={setTab} conf={conf[sel.id] || 0} setConf={v => setConf(p => ({ ...p, [sel.id]: v }))} notes={notes[sel.id] || ""} setNotes={v => setNotes(p => ({ ...p, [sel.id]: v }))} />}

        {/* PROTOCOL DETAIL */}
        {pg === "device" && deviceView === "crrt" && <CRRTDevice t={t} theme={theme} />}
        {pg === "device" && deviceView === "vent" && <VentDevice t={t} theme={theme} />}

        {pg === "proto" && proto && <ProtoDetail p={proto} t={t} theme={theme} conf={conf[proto.id] || 0} setConf={v => setConf(p => ({ ...p, [proto.id]: v }))} notes={notes[proto.id] || ""} setNotes={v => setNotes(p => ({ ...p, [proto.id]: v }))} />}

        {/* QUIZ */}
        {pg === "quiz" && qCat && <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>{QUIZZES[qCat].icon} {QUIZZES[qCat].label}</h2>
            <span style={{ color: t.tM, fontSize: "12px" }}>Q{qIdx + 1}/{QUIZZES[qCat].items.length}</span>
          </div>
          <div style={{ height: "3px", background: t.bgS, borderRadius: "2px", marginBottom: "20px" }}><div style={{ height: "100%", width: `${(qIdx / QUIZZES[qCat].items.length) * 100}%`, background: t.ac, transition: "width 0.3s" }} /></div>
          <div style={{ padding: "20px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}` }}>
            <div style={{ fontSize: "11px", color: t.ac, fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{QUIZZES[qCat].items[qIdx].c}</div>
            <p style={{ fontSize: "15px", lineHeight: 1.75, margin: "0 0 16px" }}>{QUIZZES[qCat].items[qIdx].q}</p>
            {!qRev ? <button onClick={() => setQRev(true)} style={{ background: t.ac, color: t.acTx, border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Reveal Answer (Space)</button>
              : <>
                <div style={{ padding: "14px", background: t.bgS, borderRadius: "8px", border: `1px solid ${t.bd}`, marginBottom: "14px" }}>
                  <div style={{ fontSize: "10px", color: t.ac, fontWeight: 600, marginBottom: "4px", textTransform: "uppercase" }}>Answer</div>
                  <p style={{ fontSize: "13px", lineHeight: 1.8, margin: 0 }}>{QUIZZES[qCat].items[qIdx].a}</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => nxtQ(true)} style={{ flex: 1, background: `${t.ok}10`, border: `2px solid ${t.ok}`, borderRadius: "8px", padding: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: t.ok }}>Got it</button>
                  <button onClick={() => nxtQ(false)} style={{ flex: 1, background: `${t.dg}08`, border: `2px solid ${t.dg}`, borderRadius: "8px", padding: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: t.dg }}>Review</button>
                </div>
              </>}
          </div>
          <div style={{ textAlign: "center", marginTop: "10px", color: t.tM, fontSize: "11px" }}>Score: {qSc.c}/{qSc.t}</div>
        </div>}

        {/* QUIZ RESULTS */}
        {pg === "qres" && <div style={{ maxWidth: "420px", margin: "0 auto", padding: "56px 16px", textAlign: "center" }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "22px" }}>Quiz Complete</h2>
          <div style={{ fontSize: "48px", fontWeight: 700, color: qSc.c / qSc.t >= 0.8 ? t.ok : t.wn }}>{qSc.c}/{qSc.t}</div>
          <p style={{ color: t.tM, margin: "6px 0 28px" }}>{Math.round(qSc.c / qSc.t * 100)}% correct</p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <button onClick={() => sQuiz(qCat)} style={{ background: t.ac, color: t.acTx, border: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}>Retry</button>
            <button onClick={() => setPg("dash")} style={{ background: t.bgS, color: t.tx, border: `1px solid ${t.bd}`, borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}>Dashboard</button>
          </div>
        </div>}

        </div>
      </div>
    </div>
  );
}
