import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// Data
import { TH } from "./data/themes.js";
import { MEDS } from "./data/medications.js";
import { PROTOS } from "./data/protocols.js";
import { QUIZZES } from "./data/quizzes.js";
import { SYS } from "./data/systems.js";
import { RECEPTORS } from "./data/receptors.js";

// Components
import { SL, Stat, PH, Pill, Stars } from "./components/ui.jsx";
import { ItemCard } from "./components/ItemCard.jsx";
import { ProtoCard } from "./components/ProtoCard.jsx";
import { SearchRow } from "./components/SearchRow.jsx";
import { MedDetail } from "./components/MedDetail.jsx";
import { ProtoDetail } from "./components/ProtoDetail.jsx";
import { ReceptorDetail } from "./components/ReceptorDetail.jsx";
import { NotesBox } from "./components/NotesBox.jsx";
import { CRRTDevice } from "./components/CRRTDevice.jsx";
import { VentDevice } from "./components/VentDevice.jsx";

// MAIN APP
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
    { id: "pg-behav", label: "Behavioral", icon: "Be" },
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

                {(pg === "pg-phys" || pg === "pg-anes" || pg === "pg-icu" || pg === "pg-behav" || pg === "pg-ref" || pg === "pg-exp") && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: 700 }}>{sidebarLinks.find(l => l.id === pg)?.label}</h2>
          <p style={{ color: t.tM, fontSize: "13px", marginBottom: "20px" }}>Content coming soon</p>
          <PH t={t} text={`${sidebarLinks.find(l => l.id === pg)?.label} content will appear here...`} />
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
