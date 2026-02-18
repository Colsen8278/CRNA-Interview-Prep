import { useState, useRef } from "react";
import { dlPDF, dlDiagram } from "../utils/pdf.js";
import { NotesBox } from "./NotesBox.jsx";
import { Stars } from "./ui.jsx";

function MedDetail({ item, t, theme, tab, setTab, conf, setConf, notes, setNotes }) {
  const svgRef = useRef(null);
  const tabs = ["overview", "receptor", "dosing", "metabolism", "warnings", "pearls", "diagram"];
  const tLbl = { overview: "Overview & MOA", receptor: "Receptor Physiology", dosing: "Dosing & Kinetics", metabolism: "Metabolism", warnings: "Warnings", pearls: "Clinical Pearls", diagram: "Diagram" };
  const clrMap = { ac: t.ac, wn: t.wn, pr: t.pr, pk: t.pk };
  const sevClr = { high: t.dg, mod: t.wn, low: t.tM };

  const makePDF = () => {
    const s = [];
    s.push({ t: "Mechanism of Action", c: `<div style="white-space:pre-line">${item.moa}</div>` });
    s.push({ t: "Quick Reference", c: Object.entries(item.ov).map(([k, v]) => `<div class="bx"><span class="lb">${k}</span><br/><span class="vl">${v}</span></div>`).join("") });
    s.push({ t: "Receptor Physiology", c: `<div style="white-space:pre-line">${item.recPhys}</div>` });
    s.push({ t: "Dosing", c: item.dosing.map(d => `<div class="dc"><div class="dt">${d.ind}</div><div class="dv">${d.dose}</div><div class="dn">${d.notes}</div></div>`).join("") });
    s.push({ t: "Pharmacokinetics", c: `<div class="gr">${[["Onset", item.kin.onset], ["Peak", item.kin.peak], ["Duration", item.kin.dur], ["Vd", item.kin.vd], ["Protein Binding", item.kin.pb], ["Half-Life", item.kin.hl], ["CSHT", item.kin.csht], ["Clearance", item.kin.cl]].map(([k, v]) => `<div class="bx"><span class="lb">${k}</span><br/><span class="vl">${v}</span></div>`).join("")}</div>` });
    s.push({ t: "Metabolism", c: `<div style="white-space:pre-line">${item.metab}</div>` });
    s.push({ t: "Warnings", c: item.warn.map(w => `<div class="bx ${w.tp === "bb" ? "bxd" : w.tp === "cau" ? "bxw" : ""}">${w.tp === "bb" ? "<strong>⬛ BLACK BOX — " : "<strong>"}${w.ti}</strong><br/>${w.tx}</div>`).join("") });
    s.push({ t: "Drug Interactions", c: item.ix.map(x => `<div class="bx"><strong>${x.dr}</strong> (${x.sv})<br/>${x.ef}</div>`).join("") });
    s.push({ t: "Clinical Pearls", c: item.pearls.map((p, i) => `<div class="bx"><strong>#${i + 1} ${p.ti}</strong><br/>${p.tx}</div>`).join("") });
    s.push({ t: "Interview Questions", c: item.intQs.map(q => `<div class="bx"><strong>"${q.q}"</strong><br/>${q.a}</div>`).join("") });
    if (notes) s.push({ t: "My Notes", c: `<div style="white-space:pre-line">${notes}</div>` });
    dlPDF(item.name, s);
  };

  return <div>
    {/* Header */}
    <div style={{ background: t.hd, borderBottom: `3px solid ${t.ac}`, padding: "20px 16px 14px" }}>
      <div style={{ maxWidth: "920px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "4px" }}>
              <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 700 }}>{item.name}</h1>
              <span style={{ color: t.tM, fontSize: "14px" }}>({item.brand})</span>
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>{item.tags.map(tg => <span key={tg} style={{ background: t.aD, border: `1px solid ${t.aB}`, color: t.ac, padding: "2px 10px", borderRadius: "14px", fontSize: "11px", fontWeight: 500 }}>{tg}</span>)}</div>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <Stars value={conf} onChange={setConf} t={t} />
            <button onClick={makePDF} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "8px", padding: "7px 14px", cursor: "pointer", color: t.t2, fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}> PDF</button>
          </div>
        </div>
      </div>
    </div>

    {/* Tabs */}
    <div style={{ borderBottom: `1px solid ${t.bd}`, background: t.bgC, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      <div style={{ display: "flex", gap: "0", maxWidth: "920px", margin: "0 auto", padding: "0 16px" }}>
        {tabs.map(tb => <button key={tb} onClick={() => setTab(tb)} style={{ padding: "10px 12px", background: tab === tb ? t.bgS : "transparent", color: tab === tb ? t.ac : t.tM, border: "none", borderBottom: tab === tb ? `2px solid ${t.ac}` : "2px solid transparent", cursor: "pointer", fontSize: "12px", fontWeight: tab === tb ? 600 : 400, whiteSpace: "nowrap" }}>{tLbl[tb]}</button>)}
      </div>
    </div>

    {/* Content */}
    <div style={{ maxWidth: "920px", margin: "0 auto", padding: "20px 16px" }}>
      {tab === "overview" && <div>
        <h3 style={{ color: t.ac, fontSize: "17px", margin: "0 0 10px" }}>Mechanism of Action</h3>
        <div style={{ lineHeight: 1.85, fontSize: "14px", color: t.t2, whiteSpace: "pre-line" }}>{item.moa}</div>
        <h3 style={{ color: t.ac, fontSize: "17px", margin: "24px 0 10px" }}>Quick Reference</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "8px" }}>
          {Object.entries(item.ov).map(([k, v]) => <div key={k} style={{ padding: "10px 12px", background: t.bgS, borderRadius: "7px", border: `1px solid ${t.bd}` }}><div style={{ fontSize: "10px", color: t.tM, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "2px" }}>{k}</div><div style={{ fontSize: "13px", fontWeight: 500 }}>{v}</div></div>)}
        </div>
        <NotesBox notes={notes} setNotes={setNotes} t={t} />
      </div>}

      {tab === "receptor" && <div>
        <h3 style={{ color: t.ac, fontSize: "17px", margin: "0 0 10px" }}>Receptor-Level Physiology</h3>
        <div style={{ lineHeight: 1.85, fontSize: "14px", color: t.t2, whiteSpace: "pre-line" }}>{item.recPhys}</div>
      </div>}

      {tab === "dosing" && <div>
        <h3 style={{ color: t.ac, fontSize: "17px", margin: "0 0 10px" }}>Dosing</h3>
        {item.dosing.map((d, i) => <div key={i} style={{ padding: "14px", background: t.bgS, borderRadius: "8px", borderLeft: `4px solid ${clrMap[d.clr] || t.ac}`, marginBottom: "8px" }}>
          <div style={{ fontSize: "12px", color: clrMap[d.clr] || t.ac, fontWeight: 600 }}>{d.ind}</div>
          <div style={{ fontSize: "20px", fontWeight: 700, margin: "3px 0" }}>{d.dose}</div>
          <div style={{ fontSize: "12px", color: t.tM, lineHeight: 1.5 }}>{d.notes}</div>
        </div>)}
        <h3 style={{ color: t.ac, fontSize: "17px", margin: "20px 0 10px" }}>Time Course</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "8px" }}>
          {[["Onset", item.kin.onset, item.kin.onsetD], ["Peak", item.kin.peak, item.kin.peakD], ["Duration", item.kin.dur, item.kin.durD]].map(([l, v, d]) => <div key={l} style={{ padding: "14px", background: t.bgS, borderRadius: "8px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
            <div style={{ fontSize: "10px", color: t.tM, textTransform: "uppercase" }}>{l}</div>
            <div style={{ fontSize: "18px", color: t.ac, fontWeight: 700, margin: "3px 0" }}>{v}</div>
            <div style={{ fontSize: "11px", color: t.tM, lineHeight: 1.4 }}>{d}</div>
          </div>)}
        </div>
        <h3 style={{ color: t.ac, fontSize: "17px", margin: "20px 0 10px" }}>PK Parameters</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {[["Vd", item.kin.vd], ["Protein Binding", item.kin.pb], ["Half-Life", item.kin.hl], ["CSHT", item.kin.csht], ["Clearance", item.kin.cl], ["Model", item.kin.model]].map(([k, v]) => <div key={k} style={{ padding: "10px 12px", background: t.bgS, borderRadius: "7px", border: `1px solid ${t.bd}` }}><div style={{ fontSize: "10px", color: t.tM, textTransform: "uppercase" }}>{k}</div><div style={{ fontSize: "13px", fontWeight: 500 }}>{v}</div></div>)}
        </div>
      </div>}

      {tab === "metabolism" && <div>
        <h3 style={{ color: t.ac, fontSize: "17px", margin: "0 0 10px" }}>Metabolism & Elimination</h3>
        <div style={{ lineHeight: 1.85, fontSize: "14px", color: t.t2, whiteSpace: "pre-line" }}>{item.metab}</div>
      </div>}

      {tab === "warnings" && <div>
        {item.warn.map((w, i) => <div key={i} style={{ margin: "0 0 10px", padding: "14px", background: w.tp === "bb" ? `${t.dg}08` : t.bgS, borderRadius: "8px", border: `${w.tp === "bb" ? "2px" : "1px"} solid ${w.tp === "bb" ? t.dg : w.tp === "cau" ? t.wn : t.bd}` }}>
          <h4 style={{ color: w.tp === "bb" ? t.dg : w.tp === "cau" ? t.wn : t.tx, margin: "0 0 4px", fontSize: "14px" }}>{w.tp === "bb" ? "⬛ BLACK BOX — " : w.tp === "cau" ? " " : " "}{w.ti}</h4>
          <p style={{ margin: 0, fontSize: "13px", color: t.t2, lineHeight: 1.7 }}>{w.tx}</p>
        </div>)}
        <h3 style={{ color: t.ac, fontSize: "17px", margin: "20px 0 10px" }}>Drug Interactions</h3>
        {item.ix.map((x, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: "10px", padding: "10px 12px", background: t.bgS, borderRadius: "7px", borderLeft: `3px solid ${sevClr[x.sv]}`, marginBottom: "6px" }}>
          <div><div style={{ fontWeight: 600, fontSize: "13px" }}>{x.dr}</div><div style={{ fontSize: "12px", color: t.tM, lineHeight: 1.5 }}>{x.ef}</div></div>
          <span style={{ padding: "2px 7px", borderRadius: "4px", fontSize: "9px", fontWeight: 700, color: sevClr[x.sv], background: `${sevClr[x.sv]}12`, whiteSpace: "nowrap", height: "fit-content" }}>{x.sv.toUpperCase()}</span>
        </div>)}
      </div>}

      {tab === "pearls" && <div>
        {item.pearls.map((p, i) => <div key={i} style={{ padding: "12px", background: t.bgS, borderRadius: "8px", border: `1px solid ${t.bd}`, marginBottom: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ background: t.aD, color: t.ac, padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: 600 }}>#{i + 1}</span>
            <span style={{ fontWeight: 600, fontSize: "13px" }}>{p.ti}</span>
          </div>
          <p style={{ color: t.tM, fontSize: "13px", lineHeight: 1.7, margin: 0 }}>{p.tx}</p>
        </div>)}
        <div style={{ marginTop: "16px", padding: "14px", background: t.aD, borderRadius: "8px", border: `1px solid ${t.aB}` }}>
          <h4 style={{ color: t.ac, margin: "0 0 10px", fontSize: "14px" }}> Interview Follow-Ups</h4>
          {item.intQs.map((q, i) => <div key={i} style={{ marginBottom: i < item.intQs.length - 1 ? "10px" : 0 }}>
            <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: "13px", lineHeight: 1.6 }}>"{q.q}"</p>
            <p style={{ margin: 0, color: t.tM, fontSize: "13px", lineHeight: 1.6 }}>{q.a}</p>
          </div>)}
        </div>
      </div>}

      {tab === "diagram" && <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
          <div><h3 style={{ color: t.ac, fontSize: "17px", margin: "0 0 3px" }}>{item.id === "norepinephrine" ? "α Adrenergic Receptor Pathways" : item.id === "vasopressin" ? "V / V₂ / KATP Channel Pathways" : "GABA-A Receptor Diagram"}</h3>
            <p style={{ color: t.tM, margin: 0, fontSize: "12px" }}>{item.id === "norepinephrine" ? "NE binding → Gq/Gs/Gi cascades → vasoconstriction + inotropy + autoregulation" : item.id === "vasopressin" ? "AVP binding → V vasoconstriction + KATP closure + V₂/Gs antidiuresis" : "Propofol binding → Cl⁻ influx → hyperpolarization"}</p></div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={() => dlDiagram(svgRef, item.name, "jpeg")} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "7px", padding: "6px 12px", cursor: "pointer", color: t.t2, fontSize: "12px", fontWeight: 600 }}> JPEG</button>
            <button onClick={() => dlDiagram(svgRef, item.name, "png")} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "7px", padding: "6px 12px", cursor: "pointer", color: t.t2, fontSize: "12px", fontWeight: 600 }}> PNG</button>
          </div>
        </div>
        {item.id === "norepinephrine" ? (
        <svg ref={svgRef} viewBox="0 0 800 760" style={{ width: "100%", maxWidth: "820px", background: theme === "dark" ? "#0d1117" : "#f8fafc", borderRadius: "10px", border: `1px solid ${t.bd}` }}>
          <defs>
            <marker id="arG" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#10b981" /></marker>
            <marker id="arB" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#3b82f6" /></marker>
            <marker id="arO" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#f59e0b" /></marker>
            <marker id="arR" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" /></marker>
            <marker id="arT" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#06b6d4" /></marker>
            <marker id="arP" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#a855f7" /></marker>
            <marker id="arGr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill={t.tM} /></marker>
          </defs>

          {/* Title */}
          <text x="400" y="26" textAnchor="middle" fill={t.tx} fontSize="15" fontWeight="700">Norepinephrine — Adrenergic Receptor Signal Transduction</text>
          <text x="400" y="44" textAnchor="middle" fill={t.tM} fontSize="10">Receptor affinity: α₂ {">"} α {">"} β {">>>"} β₂ — Three parallel G-protein cascades</text>

          {/*  COLUMN 1: α / Gq PATHWAY (x center ~155)  */}
          <text x="155" y="72" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="700">α Receptor</text>
          <text x="155" y="86" textAnchor="middle" fill={t.tM} fontSize="9">Vascular Smooth Muscle</text>

          {/* Cell membrane band */}
          <rect x="55" y="92" width="200" height="24" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />
          <text x="60" y="108" fill={theme === "dark" ? "#b8956a" : "#8b6914"} fontSize="7" fontWeight="500">MEMBRANE</text>

          {/* α 7-TM receptor */}
          <rect x="120" y="88" width="70" height="32" rx="6" fill={theme === "dark" ? "#3b1111" : "#fee2e2"} stroke="#ef4444" strokeWidth="1.5" />
          <text x="155" y="108" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">α (7-TM)</text>

          {/* NE molecule binding */}
          <circle cx="110" cy="76" r="11" fill="#10b981" stroke="#34d399" strokeWidth="2" />
          <text x="110" y="80" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">NE</text>
          <line x1="118" y1="83" x2="125" y2="90" stroke="#34d399" strokeWidth="2" strokeDasharray="3,2" />

          {/* Gq protein */}
          <line x1="155" y1="120" x2="155" y2="135" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#arP)" />
          <rect x="120" y="136" width="70" height="22" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="155" y="151" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">Gq / G11</text>

          {/* PLC */}
          <line x1="155" y1="158" x2="155" y2="172" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arO)" />
          <rect x="125" y="173" width="60" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="155" y="187" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="700">PLC</text>

          {/* PIP₂ cleavage label */}
          <text x="200" y="185" fill={t.tM} fontSize="7" fontStyle="italic">PIP₂ →</text>

          {/* IP₃ and DAG split */}
          <line x1="140" y1="193" x2="115" y2="215" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arO)" />
          <line x1="170" y1="193" x2="195" y2="215" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arO)" />

          <rect x="85" y="216" width="55" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="112" y="230" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">IP₃</text>

          <rect x="170" y="216" width="55" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="197" y="230" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">DAG</text>

          {/* IP₃ → SR Ca²⁺ release */}
          <line x1="112" y1="236" x2="112" y2="255" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arB)" />
          <rect x="72" y="256" width="80" height="28" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="112" y="270" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="700">SR → Ca²⁺</text>
          <text x="112" y="280" textAnchor="middle" fill="#3b82f6" fontSize="7">release to cytoplasm</text>

          {/* DAG → PKC */}
          <line x1="197" y1="236" x2="197" y2="255" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arO)" />
          <rect x="172" y="256" width="50" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="197" y="270" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">PKC</text>

          {/* Converge to Ca²⁺-Calmodulin */}
          <line x1="112" y1="284" x2="145" y2="306" stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#arB)" />
          <line x1="197" y1="276" x2="170" y2="306" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#arO)" />
          <rect x="110" y="307" width="90" height="22" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="155" y="322" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="600">Ca²⁺-Calmodulin</text>

          {/* MLCK */}
          <line x1="155" y1="329" x2="155" y2="348" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arT)" />
          <rect x="120" y="349" width="70" height="20" rx="4" fill={theme === "dark" ? "#083344" : "#cffafe"} stroke="#06b6d4" strokeWidth="1.5" />
          <text x="155" y="363" textAnchor="middle" fill="#06b6d4" fontSize="9" fontWeight="700">MLCK</text>

          {/* Final effect: Vasoconstriction */}
          <line x1="155" y1="369" x2="155" y2="390" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arT)" />
          <rect x="85" y="391" width="140" height="32" rx="8" fill={theme === "dark" ? "#7f1d1d" : "#fecaca"} stroke="#ef4444" strokeWidth="2" />
          <text x="155" y="407" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="10" fontWeight="700">VASOCONSTRICTION</text>
          <text x="155" y="419" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="7">↑SVR → ↑MAP</text>


          {/*  COLUMN 2: β / Gs PATHWAY (x center ~430)  */}
          <text x="430" y="72" textAnchor="middle" fill="#3b82f6" fontSize="13" fontWeight="700">β Receptor</text>
          <text x="430" y="86" textAnchor="middle" fill={t.tM} fontSize="9">Cardiac Myocyte</text>

          {/* Cell membrane band */}
          <rect x="330" y="92" width="200" height="24" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />

          {/* β 7-TM receptor */}
          <rect x="395" y="88" width="70" height="32" rx="6" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="430" y="108" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="700">β (7-TM)</text>

          {/* NE molecule */}
          <circle cx="385" cy="76" r="11" fill="#10b981" stroke="#34d399" strokeWidth="2" />
          <text x="385" y="80" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">NE</text>
          <line x1="393" y1="83" x2="400" y2="90" stroke="#34d399" strokeWidth="2" strokeDasharray="3,2" />

          {/* Gs protein */}
          <line x1="430" y1="120" x2="430" y2="135" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#arP)" />
          <rect x="400" y="136" width="60" height="22" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="430" y="151" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">Gsα</text>

          {/* Adenylyl cyclase */}
          <line x1="430" y1="158" x2="430" y2="172" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arO)" />
          <rect x="395" y="173" width="70" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="430" y="187" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="700">Adenylyl Cyclase</text>

          {/* ATP → cAMP */}
          <text x="380" y="200" fill={t.tM} fontSize="7" fontStyle="italic">ATP →</text>
          <line x1="430" y1="193" x2="430" y2="210" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arO)" />
          <rect x="402" y="211" width="56" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="430" y="225" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">↑cAMP</text>

          {/* PKA */}
          <line x1="430" y1="231" x2="430" y2="248" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arO)" />
          <rect x="405" y="249" width="50" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="430" y="263" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">PKA</text>

          {/* PKA targets fan out */}
          <line x1="415" y1="269" x2="365" y2="295" stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#arB)" />
          <line x1="430" y1="269" x2="430" y2="295" stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#arB)" />
          <line x1="445" y1="269" x2="495" y2="295" stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#arB)" />

          {/* L-type Ca²⁺ */}
          <rect x="325" y="296" width="80" height="28" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.2" />
          <text x="365" y="310" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="600">L-type Ca²⁺</text>
          <text x="365" y="320" textAnchor="middle" fill="#3b82f6" fontSize="7">↑Ca²⁺ influx</text>

          {/* RyR2 */}
          <rect x="398" y="296" width="64" height="28" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.2" />
          <text x="430" y="310" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="600">RyR2</text>
          <text x="430" y="320" textAnchor="middle" fill="#3b82f6" fontSize="7">↑CICR</text>

          {/* Phospholamban */}
          <rect x="470" y="296" width="75" height="28" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.2" />
          <text x="507" y="310" textAnchor="middle" fill="#3b82f6" fontSize="7" fontWeight="600">Phospholamban</text>
          <text x="507" y="320" textAnchor="middle" fill="#3b82f6" fontSize="7">↑SERCA2a</text>

          {/* Converge to effects */}
          <line x1="365" y1="324" x2="400" y2="350" stroke="#06b6d4" strokeWidth="1.2" markerEnd="url(#arT)" />
          <line x1="430" y1="324" x2="430" y2="350" stroke="#06b6d4" strokeWidth="1.2" markerEnd="url(#arT)" />
          <line x1="507" y1="324" x2="470" y2="350" stroke="#06b6d4" strokeWidth="1.2" markerEnd="url(#arT)" />

          {/* Inotropy + Lusitropy + Chronotropy */}
          <rect x="355" y="351" width="150" height="22" rx="5" fill={theme === "dark" ? "#083344" : "#cffafe"} stroke="#06b6d4" strokeWidth="1.5" />
          <text x="430" y="366" textAnchor="middle" fill="#06b6d4" fontSize="9" fontWeight="600">↑Ca²⁺ Transient Amplitude</text>

          {/* Final cardiac effects */}
          <line x1="430" y1="373" x2="430" y2="390" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arT)" />
          <rect x="345" y="391" width="170" height="32" rx="8" fill={theme === "dark" ? "#0c2d48" : "#bfdbfe"} stroke="#3b82f6" strokeWidth="2" />
          <text x="430" y="406" textAnchor="middle" fill={theme === "dark" ? "#93c5fd" : "#1d4ed8"} fontSize="9" fontWeight="700">INOTROPY + LUSITROPY</text>
          <text x="430" y="418" textAnchor="middle" fill={theme === "dark" ? "#93c5fd" : "#1d4ed8"} fontSize="7">↑Contractility + ↑Relaxation Rate</text>

          {/* If/HCN chronotropy note */}
          <line x1="455" y1="262" x2="530" y2="262" stroke={t.tM} strokeWidth="1" strokeDasharray="3,2" />
          <text x="535" y="258" fill={t.tM} fontSize="7" fontStyle="italic">Also: If/HCN channels</text>
          <text x="535" y="268" fill={t.tM} fontSize="7" fontStyle="italic">→ ↑Phase 4 slope → Chronotropy</text>


          {/*  COLUMN 3: α₂ / Gi PATHWAY (x center ~680)  */}
          <text x="680" y="72" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="700">α₂ Receptor</text>
          <text x="680" y="86" textAnchor="middle" fill={t.tM} fontSize="9">Presynaptic Terminal</text>

          {/* Membrane band */}
          <rect x="590" y="92" width="180" height="24" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />

          {/* α₂ receptor */}
          <rect x="645" y="88" width="70" height="32" rx="6" fill={theme === "dark" ? "#3b1111" : "#fee2e2"} stroke="#ef4444" strokeWidth="1.5" />
          <text x="680" y="108" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">α₂ (7-TM)</text>

          {/* NE molecule */}
          <circle cx="635" cy="76" r="11" fill="#10b981" stroke="#34d399" strokeWidth="2" />
          <text x="635" y="80" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">NE</text>
          <line x1="643" y1="83" x2="650" y2="90" stroke="#34d399" strokeWidth="2" strokeDasharray="3,2" />

          {/* Gi protein */}
          <line x1="680" y1="120" x2="680" y2="135" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#arP)" />
          <rect x="650" y="136" width="60" height="22" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="680" y="151" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">Giα</text>

          {/* Inhibit AC */}
          <line x1="680" y1="158" x2="680" y2="175" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arR)" />
          <rect x="640" y="176" width="80" height="20" rx="4" fill={theme === "dark" ? "#1c0505" : "#fee2e2"} stroke="#ef4444" strokeWidth="1.2" />
          <text x="680" y="190" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="700">⊘ Adenylyl Cyclase</text>

          {/* ↓cAMP */}
          <line x1="680" y1="196" x2="680" y2="213" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arR)" />
          <rect x="652" y="214" width="56" height="20" rx="4" fill={theme === "dark" ? "#1c0505" : "#fee2e2"} stroke="#ef4444" strokeWidth="1.2" />
          <text x="680" y="228" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">↓cAMP</text>

          {/* Gβγ → GIRK */}
          <line x1="710" y1="148" x2="740" y2="148" stroke={t.tM} strokeWidth="1" strokeDasharray="3,2" />
          <text x="745" y="144" fill={t.tM} fontSize="7" fontStyle="italic">Gβγ → GIRK K⁺</text>
          <text x="745" y="154" fill={t.tM} fontSize="7" fontStyle="italic">→ hyperpolarization</text>

          {/* Negative feedback */}
          <line x1="680" y1="234" x2="680" y2="260" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arR)" />
          <rect x="610" y="261" width="140" height="32" rx="8" fill={theme === "dark" ? "#450a0a" : "#fecaca"} stroke="#ef4444" strokeWidth="2" />
          <text x="680" y="277" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="9" fontWeight="700">NEGATIVE FEEDBACK</text>
          <text x="680" y="289" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="7">↓NE release from terminal</text>

          {/* Same target note */}
          <rect x="618" y="302" width="125" height="18" rx="4" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="680" y="314" textAnchor="middle" fill={t.tM} fontSize="7" fontStyle="italic">Same target as clonidine/dexmed</text>


          {/*  BARORECEPTOR REFLEX ARC (bottom)  */}
          <rect x="55" y="450" width="690" height="100" rx="10" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1.5" />
          <text x="400" y="468" textAnchor="middle" fill={t.tx} fontSize="12" fontWeight="700">BARORECEPTOR REFLEX — The Clinical Paradox</text>

          {/* Flow: ↑MAP → Baroreceptors → ↑CN IX/X → NTS → ↑Vagal → ↓HR */}
          <rect x="72" y="482" width="65" height="28" rx="5" fill={theme === "dark" ? "#7f1d1d" : "#fecaca"} stroke="#ef4444" strokeWidth="1.2" />
          <text x="104" y="497" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="8" fontWeight="600">↑MAP</text>
          <text x="104" y="507" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="6">(from alpha-1)</text>

          <line x1="137" y1="496" x2="162" y2="496" stroke={t.tM} strokeWidth="1.5" markerEnd="url(#arGr)" />

          <rect x="163" y="482" width="90" height="28" rx="5" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="208" y="497" textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="600">Carotid / Aortic</text>
          <text x="208" y="506" textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="600">Baroreceptors</text>

          <line x1="253" y1="496" x2="278" y2="496" stroke={t.tM} strokeWidth="1.5" markerEnd="url(#arGr)" />

          <rect x="279" y="482" width="72" height="28" rx="5" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="315" y="497" textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="600">↑CN IX / X</text>
          <text x="315" y="506" textAnchor="middle" fill="#f59e0b" fontSize="7">afferents</text>

          <line x1="351" y1="496" x2="376" y2="496" stroke={t.tM} strokeWidth="1.5" markerEnd="url(#arGr)" />

          <rect x="377" y="482" width="55" height="28" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.2" />
          <text x="404" y="500" textAnchor="middle" fill="#a855f7" fontSize="8" fontWeight="600">NTS</text>

          <line x1="432" y1="496" x2="457" y2="496" stroke={t.tM} strokeWidth="1.5" markerEnd="url(#arGr)" />

          <rect x="458" y="482" width="75" height="28" rx="5" fill={theme === "dark" ? "#0c2d48" : "#bfdbfe"} stroke="#3b82f6" strokeWidth="1.2" />
          <text x="495" y="497" textAnchor="middle" fill="#3b82f6" fontSize="7" fontWeight="600">↑Vagal Tone</text>
          <text x="495" y="506" textAnchor="middle" fill="#3b82f6" fontSize="7">(parasympathetic)</text>

          <line x1="533" y1="496" x2="558" y2="496" stroke={t.tM} strokeWidth="1.5" markerEnd="url(#arGr)" />

          <rect x="559" y="478" width="170" height="36" rx="8" fill={theme === "dark" ? "#14532d" : "#dcfce7"} stroke="#10b981" strokeWidth="2" />
          <text x="644" y="496" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="700">REFLEX BRADYCARDIA</text>
          <text x="644" y="508" textAnchor="middle" fill="#10b981" fontSize="7" fontWeight="500">Offsets β chronotropy → NET HR ≈ unchanged</text>

          {/* Key distinction callout */}
          <text x="400" y="540" textAnchor="middle" fill={t.tM} fontSize="8" fontWeight="500" fontStyle="italic">This reflex is WHY NE ≠ epinephrine. Epi's β₂ vasodilation prevents the MAP spike → no baroreceptor trigger → tachycardia dominates.</text>


          {/*  NET HEMODYNAMIC EFFECT  */}
          <rect x="170" y="564" width="460" height="50" rx="10" fill={theme === "dark" ? "#052e16" : "#d1fae5"} stroke="#10b981" strokeWidth="2" />
          <text x="400" y="584" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="700">NET EFFECT: ↑MAP + ↑CO + ↑/↓HR</text>
          <text x="400" y="600" textAnchor="middle" fill={theme === "dark" ? "#6ee7b7" : "#047857"} fontSize="9">Ideal vasopressor profile — vasoconstriction WITH cardiac output preservation</text>

          {/* Metabolism note */}
          <rect x="100" y="626" width="600" height="32" rx="6" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="400" y="641" textAnchor="middle" fill={t.tx} fontSize="9" fontWeight="600">Termination: Uptake-1 (neuronal reuptake) → COMT/MAO → normetanephrine → VMA | t½ = 2.4 min | Zero CYP450</text>
          <text x="400" y="653" textAnchor="middle" fill={t.tM} fontSize="8">Context-INSENSITIVE offset — no accumulation regardless of infusion duration</text>

          {/*  LEGEND  */}
          <rect x="55" y="672" width="690" height="76" rx="8" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="80" y="690" fill={t.tx} fontSize="9" fontWeight="600">LEGEND</text>
          <line x1="80" y1="694" x2="730" y2="694" stroke={t.bd} strokeWidth="0.5" />

          <circle cx="80" cy="710" r="5" fill="#10b981" /><text x="90" y="714" fill={t.tM} fontSize="8">Norepinephrine</text>
          <rect x="175" y="705" width="10" height="10" rx="2" fill={theme === "dark" ? "#fee2e2" : "#fee2e2"} stroke="#ef4444" strokeWidth="1" /><text x="190" y="714" fill={t.tM} fontSize="8">α receptors / inhibition</text>
          <rect x="310" y="705" width="10" height="10" rx="2" fill={theme === "dark" ? "#dbeafe" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1" /><text x="325" y="714" fill={t.tM} fontSize="8">β / ions (Ca²⁺)</text>
          <rect x="420" y="705" width="10" height="10" rx="2" fill={theme === "dark" ? "#ede9fe" : "#ede9fe"} stroke="#a855f7" strokeWidth="1" /><text x="435" y="714" fill={t.tM} fontSize="8">G-proteins</text>
          <rect x="520" y="705" width="10" height="10" rx="2" fill={theme === "dark" ? "#fef3c7" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1" /><text x="535" y="714" fill={t.tM} fontSize="8">Second messengers</text>
          <rect x="650" y="705" width="10" height="10" rx="2" fill={theme === "dark" ? "#cffafe" : "#cffafe"} stroke="#06b6d4" strokeWidth="1" /><text x="665" y="714" fill={t.tM} fontSize="8">Effectors</text>

          <text x="80" y="736" fill={t.tM} fontSize="8">7-TM = seven-transmembrane (GPCR) | PLC = phospholipase C | IP₃ = inositol trisphosphate | DAG = diacylglycerol | PKC/PKA = protein kinase C/A</text>
          <text x="80" y="746" fill={t.tM} fontSize="8">MLCK = myosin light chain kinase | SR = sarcoplasmic reticulum | CICR = Ca²⁺-induced Ca²⁺ release | GIRK = G-protein inwardly rectifying K⁺ channel</text>
        </svg>
        ) : item.id === "vasopressin" ? (
        <svg ref={svgRef} viewBox="0 0 800 700" style={{ width: "100%", maxWidth: "820px", background: theme === "dark" ? "#0d1117" : "#f8fafc", borderRadius: "10px", border: `1px solid ${t.bd}` }}>
          <defs>
            <marker id="avB" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#3b82f6" /></marker>
            <marker id="avO" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#f59e0b" /></marker>
            <marker id="avR" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" /></marker>
            <marker id="avT" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#06b6d4" /></marker>
            <marker id="avP" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#a855f7" /></marker>
            <marker id="avGr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill={t.tM} /></marker>
          </defs>

          {/* Title */}
          <text x="400" y="26" textAnchor="middle" fill={t.tx} fontSize="15" fontWeight="700">Vasopressin (AVP) — Non-Adrenergic Signal Transduction</text>
          <text x="400" y="44" textAnchor="middle" fill={t.tM} fontSize="10">Three receptor subtypes: V (Gq) → vasoconstriction | V₂ (Gs) → antidiuresis | V (Gq) → ACTH release</text>

          {/*  COLUMN 1: V / Gq PATHWAY (x ~165)  */}
          <text x="165" y="72" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="700">V Receptor</text>
          <text x="165" y="86" textAnchor="middle" fill={t.tM} fontSize="9">Vascular Smooth Muscle</text>

          {/* Membrane */}
          <rect x="55" y="92" width="220" height="24" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />
          <text x="60" y="108" fill={theme === "dark" ? "#b8956a" : "#8b6914"} fontSize="7" fontWeight="500">MEMBRANE</text>

          {/* V receptor */}
          <rect x="130" y="88" width="70" height="32" rx="6" fill={theme === "dark" ? "#3b1111" : "#fee2e2"} stroke="#ef4444" strokeWidth="1.5" />
          <text x="165" y="108" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">V (7-TM)</text>

          {/* AVP molecule */}
          <circle cx="120" cy="76" r="11" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="2" />
          <text x="120" y="80" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">AVP</text>
          <line x1="128" y1="83" x2="135" y2="90" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3,2" />

          {/* Gq */}
          <line x1="165" y1="120" x2="165" y2="135" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#avP)" />
          <rect x="130" y="136" width="70" height="22" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="165" y="151" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">Gq / G11</text>

          {/* PLC */}
          <line x1="165" y1="158" x2="165" y2="172" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#avO)" />
          <rect x="135" y="173" width="60" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="165" y="187" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="700">PLC</text>

          {/* IP₃ and DAG */}
          <line x1="150" y1="193" x2="110" y2="215" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#avO)" />
          <line x1="180" y1="193" x2="220" y2="215" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#avO)" />

          <rect x="78" y="216" width="60" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="108" y="230" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">IP₃</text>

          <rect x="195" y="216" width="55" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="222" y="230" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">DAG</text>

          {/* IP₃ → SR Ca²⁺ */}
          <line x1="108" y1="236" x2="108" y2="255" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#avB)" />
          <rect x="70" y="256" width="78" height="28" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="109" y="270" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="700">SR → Ca²⁺</text>
          <text x="109" y="280" textAnchor="middle" fill="#3b82f6" fontSize="7">cytoplasmic release</text>

          {/* DAG → PKC */}
          <line x1="222" y1="236" x2="222" y2="255" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#avO)" />
          <rect x="197" y="256" width="50" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="222" y="270" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">PKC</text>

          {/* PKC → closes KATP (branching right) */}
          <line x1="247" y1="266" x2="265" y2="266" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3,2" />
          <text x="270" y="262" fill="#ef4444" fontSize="7" fontWeight="600">CLOSES</text>
          <text x="270" y="272" fill="#ef4444" fontSize="7" fontWeight="600">KATP </text>

          {/* Converge → Ca²⁺-CaM → MLCK */}
          <line x1="109" y1="284" x2="150" y2="305" stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#avB)" />
          <line x1="222" y1="276" x2="180" y2="305" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#avO)" />
          <rect x="115" y="306" width="100" height="22" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="165" y="321" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="600">Ca²⁺-CaM → MLCK</text>

          {/* Vasoconstriction */}
          <line x1="165" y1="328" x2="165" y2="348" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#avT)" />
          <rect x="90" y="349" width="150" height="34" rx="8" fill={theme === "dark" ? "#7f1d1d" : "#fecaca"} stroke="#ef4444" strokeWidth="2" />
          <text x="165" y="366" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="10" fontWeight="700">VASOCONSTRICTION</text>
          <text x="165" y="378" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="7">↑SVR → ↑MAP (non-adrenergic)</text>

          {/* Efferent > Afferent note */}
          <rect x="65" y="392" width="200" height="20" rx="4" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="165" y="406" textAnchor="middle" fill={t.tM} fontSize="7" fontStyle="italic">Efferent arteriole {">"}{">>"} Afferent → ↑GFP → ↑UOP</text>


          {/*  COLUMN 2: V₂ / Gs PATHWAY (x ~440)  */}
          <text x="440" y="72" textAnchor="middle" fill="#3b82f6" fontSize="13" fontWeight="700">V₂ Receptor</text>
          <text x="440" y="86" textAnchor="middle" fill={t.tM} fontSize="9">Renal Collecting Duct</text>

          {/* Membrane */}
          <rect x="340" y="92" width="200" height="24" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />

          {/* V₂ receptor */}
          <rect x="405" y="88" width="70" height="32" rx="6" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="440" y="108" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="700">V₂ (7-TM)</text>

          {/* AVP */}
          <circle cx="395" cy="76" r="11" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="2" />
          <text x="395" y="80" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">AVP</text>
          <line x1="403" y1="83" x2="410" y2="90" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3,2" />

          {/* Gs */}
          <line x1="440" y1="120" x2="440" y2="135" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#avP)" />
          <rect x="410" y="136" width="60" height="22" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="440" y="151" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">Gsα</text>

          {/* AC → cAMP */}
          <line x1="440" y1="158" x2="440" y2="172" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#avO)" />
          <rect x="405" y="173" width="70" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="440" y="187" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="700">Adenylyl Cyclase</text>

          <line x1="440" y1="193" x2="440" y2="210" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#avO)" />
          <rect x="412" y="211" width="56" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="440" y="225" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">↑cAMP</text>

          {/* PKA */}
          <line x1="440" y1="231" x2="440" y2="248" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#avO)" />
          <rect x="415" y="249" width="50" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="440" y="263" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">PKA</text>

          {/* AQP2 translocation */}
          <line x1="440" y1="269" x2="440" y2="295" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#avB)" />
          <rect x="390" y="296" width="100" height="30" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="440" y="311" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="700">AQP2 → Apical</text>
          <text x="440" y="322" textAnchor="middle" fill="#3b82f6" fontSize="7">Membrane Insertion</text>

          {/* Water reabsorption */}
          <line x1="440" y1="326" x2="440" y2="348" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#avT)" />
          <rect x="365" y="349" width="150" height="34" rx="8" fill={theme === "dark" ? "#0c2d48" : "#bfdbfe"} stroke="#3b82f6" strokeWidth="2" />
          <text x="440" y="366" textAnchor="middle" fill={theme === "dark" ? "#93c5fd" : "#1d4ed8"} fontSize="10" fontWeight="700">WATER REABSORPTION</text>
          <text x="440" y="378" textAnchor="middle" fill={theme === "dark" ? "#93c5fd" : "#1d4ed8"} fontSize="7">↑Urine concentration + ↓Free water excretion</text>

          {/* vWF / Factor VIII note */}
          <rect x="365" y="392" width="150" height="20" rx="4" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="440" y="406" textAnchor="middle" fill={t.tM} fontSize="7" fontStyle="italic">Endothelial V₂: ↑vWF + Factor VIII (DDAVP basis)</text>


          {/*  COLUMN 3: V (small) + KATP detail (x ~680)  */}
          <text x="680" y="72" textAnchor="middle" fill="#a855f7" fontSize="13" fontWeight="700">V Receptor</text>
          <text x="680" y="86" textAnchor="middle" fill={t.tM} fontSize="9">Anterior Pituitary</text>

          {/* Membrane */}
          <rect x="590" y="92" width="180" height="24" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />

          {/* V receptor */}
          <rect x="645" y="88" width="70" height="32" rx="6" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="680" y="108" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">V (7-TM)</text>

          {/* AVP */}
          <circle cx="635" cy="76" r="11" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="2" />
          <text x="635" y="80" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">AVP</text>
          <line x1="643" y1="83" x2="650" y2="90" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3,2" />

          {/* Gq → ACTH */}
          <line x1="680" y1="120" x2="680" y2="135" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#avP)" />
          <rect x="650" y="136" width="60" height="22" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="680" y="151" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">Gq</text>

          <line x1="680" y1="158" x2="680" y2="176" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#avP)" />
          <rect x="640" y="177" width="80" height="22" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="680" y="192" textAnchor="middle" fill="#a855f7" fontSize="9" fontWeight="600">PLC → Ca²⁺</text>

          <line x1="680" y1="199" x2="680" y2="218" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#avO)" />
          <rect x="625" y="219" width="110" height="32" rx="8" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="2" />
          <text x="680" y="236" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">ACTH Secretion</text>
          <text x="680" y="247" textAnchor="middle" fill="#f59e0b" fontSize="7">→ Cortisol from adrenals</text>

          {/* Stress response note */}
          <rect x="618" y="260" width="125" height="18" rx="4" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="680" y="272" textAnchor="middle" fill={t.tM} fontSize="7" fontStyle="italic">Links VP to HPA axis / stress response</text>


          {/*  KATP CHANNEL MECHANISM BOX (bottom-right)  */}
          <rect x="560" y="300" width="215" height="112" rx="8" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1.5" />
          <text x="667" y="318" textAnchor="middle" fill={t.tx} fontSize="10" fontWeight="700">KATP Channel Mechanism</text>
          <line x1="575" y1="324" x2="760" y2="324" stroke={t.bd} strokeWidth="0.5" />
          <text x="575" y="340" fill="#ef4444" fontSize="8" fontWeight="600">In Septic Shock:</text>
          <text x="575" y="352" fill={t.tM} fontSize="7">↓ATP + ↑H⁺ + ↑NO → KATP OPEN</text>
          <text x="575" y="364" fill={t.tM} fontSize="7">→ K⁺ efflux → hyperpolarization</text>
          <text x="575" y="376" fill={t.tM} fontSize="7">→ VGCCs stuck closed → vasoplegia</text>
          <text x="575" y="392" fill="#10b981" fontSize="8" fontWeight="600">Vasopressin Rescue:</text>
          <text x="575" y="404" fill="#10b981" fontSize="7">V → PKC → CLOSES KATP → restores</text>
          <text x="704" y="404" fill="#10b981" fontSize="7">Ca²⁺ entry</text>


          {/*  NET EFFECT  */}
          <rect x="55" y="440" width="690" height="55" rx="10" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1.5" />
          <text x="400" y="460" textAnchor="middle" fill={t.tx} fontSize="12" fontWeight="700">WHY VASOPRESSIN WORKS WHEN CATECHOLAMINES FAIL</text>
          <text x="400" y="478" textAnchor="middle" fill={t.tM} fontSize="9">Non-adrenergic pathway | V receptors maintain affinity in acidosis | Closes KATP channels directly via PKC</text>
          <text x="400" y="490" textAnchor="middle" fill={t.tM} fontSize="9">No pulmonary vasoconstriction | Efferent {">"} Afferent renal vasoconstriction → preserves GFR | Inhibits iNOS</text>

          {/*  NET HEMODYNAMIC  */}
          <rect x="170" y="510" width="460" height="50" rx="10" fill={theme === "dark" ? "#1e1b4b" : "#e0e7ff"} stroke="#8b5cf6" strokeWidth="2" />
          <text x="400" y="530" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="700">NET: ↑MAP + ↑CO + ↑HR + ↑UOP</text>
          <text x="400" y="546" textAnchor="middle" fill={theme === "dark" ? "#c4b5fd" : "#6d28d9"} fontSize="9">Non-adrenergic vasopressor — catecholamine-sparing — pulmonary-sparing</text>

          {/* Metabolism note */}
          <rect x="100" y="574" width="600" height="28" rx="6" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="400" y="589" textAnchor="middle" fill={t.tx} fontSize="9" fontWeight="600">Metabolism: Hepatic/renal peptidases (serine protease, carboxypeptidase) | t½ = 10–20 min | Zero CYP450 | Not COMT/MAO</text>
          <text x="400" y="599" textAnchor="middle" fill={t.tM} fontSize="8">Deficiency in sepsis: posterior pituitary stores deplete within 24–48h → exogenous VP = hormone replacement</text>

          {/*  LEGEND  */}
          <rect x="55" y="618" width="690" height="68" rx="8" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="80" y="636" fill={t.tx} fontSize="9" fontWeight="600">LEGEND</text>
          <line x1="80" y1="640" x2="730" y2="640" stroke={t.bd} strokeWidth="0.5" />

          <circle cx="80" cy="656" r="5" fill="#8b5cf6" /><text x="90" y="660" fill={t.tM} fontSize="8">Vasopressin (AVP)</text>
          <rect x="185" y="651" width="10" height="10" rx="2" fill={theme === "dark" ? "#fee2e2" : "#fee2e2"} stroke="#ef4444" strokeWidth="1" /><text x="200" y="660" fill={t.tM} fontSize="8">V (vasoconstriction)</text>
          <rect x="320" y="651" width="10" height="10" rx="2" fill={theme === "dark" ? "#dbeafe" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1" /><text x="335" y="660" fill={t.tM} fontSize="8">V₂ (antidiuresis)</text>
          <rect x="445" y="651" width="10" height="10" rx="2" fill={theme === "dark" ? "#ede9fe" : "#ede9fe"} stroke="#a855f7" strokeWidth="1" /><text x="460" y="660" fill={t.tM} fontSize="8">V / G-proteins</text>
          <rect x="570" y="651" width="10" height="10" rx="2" fill={theme === "dark" ? "#fef3c7" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1" /><text x="585" y="660" fill={t.tM} fontSize="8">2nd messengers</text>

          <text x="80" y="678" fill={t.tM} fontSize="8">7-TM = GPCR | PLC = phospholipase C | IP₃/DAG = 2nd messengers | PKC/PKA = protein kinases | AQP2 = aquaporin-2 | KATP = ATP-sensitive K⁺ channel | vWF = von Willebrand factor</text>
        </svg>
        ) : item.id === "ketamine" ? (
        <svg ref={svgRef} viewBox="0 0 800 620" style={{ width: "100%", maxWidth: "820px", background: theme === "dark" ? "#0d1117" : "#f8fafc", borderRadius: "10px", border: `1px solid ${t.bd}` }}>
          <defs>
            <marker id="kG" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#10b981" /></marker>
            <marker id="kB" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#3b82f6" /></marker>
            <marker id="kR" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" /></marker>
            <marker id="kO" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#f59e0b" /></marker>
            <marker id="kP" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#a855f7" /></marker>
          </defs>

          {/* Title */}
          <text x="400" y="26" textAnchor="middle" fill={t.tx} fontSize="15" fontWeight="700">Ketamine — NMDA Receptor Open-Channel Block</text>
          <text x="400" y="44" textAnchor="middle" fill={t.tM} fontSize="10">Non-competitive, use-dependent antagonism of glutamate-gated Ca²⁺/Na⁺ channel</text>

          {/* ══ EXTRACELLULAR SPACE ══ */}
          <text x="50" y="72" fill={t.tM} fontSize="10" fontWeight="600">EXTRACELLULAR</text>

          {/* Glutamate binding */}
          <circle cx="200" cy="100" r="16" fill="#10b981" stroke="#34d399" strokeWidth="2" />
          <text x="200" y="105" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">Glu</text>
          <text x="200" y="130" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="600">Glutamate</text>
          <line x1="216" y1="106" x2="248" y2="130" stroke="#34d399" strokeWidth="2" strokeDasharray="4,3" />

          {/* Glycine co-agonist */}
          <circle cx="560" cy="100" r="14" fill="#06b6d4" stroke="#22d3ee" strokeWidth="2" />
          <text x="560" y="105" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">Gly</text>
          <text x="560" y="130" textAnchor="middle" fill="#06b6d4" fontSize="9" fontWeight="600">Glycine/D-serine</text>
          <text x="560" y="142" textAnchor="middle" fill={t.tM} fontSize="8">(co-agonist required)</text>
          <line x1="546" y1="106" x2="518" y2="130" stroke="#22d3ee" strokeWidth="2" strokeDasharray="4,3" />

          {/* KETAMINE molecule */}
          <circle cx="400" cy="90" r="22" fill="#ef4444" stroke="#f87171" strokeWidth="3" />
          <text x="400" y="86" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">KET</text>
          <text x="400" y="97" textAnchor="middle" fill="#fff" fontSize="7">PCP site</text>
          <text x="400" y="62" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">KETAMINE</text>

          {/* CELL MEMBRANE */}
          <rect x="80" y="155" width="640" height="30" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />
          <text x="90" y="175" fill={theme === "dark" ? "#b8956a" : "#8b6914"} fontSize="8" fontWeight="500">MEMBRANE</text>

          {/* NMDA RECEPTOR — 4 subunits around pore */}
          {/* NR1 subunit left */}
          <rect x="180" y="148" width="80" height="44" rx="8" fill={theme === "dark" ? "#1a2e1a" : "#dcfce7"} stroke="#10b981" strokeWidth="2" />
          <text x="220" y="168" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="700">GluN1</text>
          <text x="220" y="182" textAnchor="middle" fill={t.tM} fontSize="8">Glycine site</text>

          {/* NR2 subunit right */}
          <rect x="500" y="148" width="80" height="44" rx="8" fill={theme === "dark" ? "#1a2e1a" : "#dcfce7"} stroke="#10b981" strokeWidth="2" />
          <text x="540" y="168" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="700">GluN2</text>
          <text x="540" y="182" textAnchor="middle" fill={t.tM} fontSize="8">Glutamate site</text>

          {/* Channel pore (center) */}
          <rect x="310" y="145" width="140" height="50" rx="6" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="2" />
          <text x="380" y="165" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="700">ION CHANNEL PORE</text>
          <text x="380" y="180" textAnchor="middle" fill={t.tM} fontSize="8">Ca²⁺ / Na⁺ permeable</text>

          {/* Mg²⁺ voltage block */}
          <rect x="355" y="200" width="50" height="22" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="380" y="215" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="700">Mg²⁺</text>
          <text x="440" y="214" fill={t.tM} fontSize="8" fontStyle="italic">voltage-dependent block</text>
          <text x="440" y="226" fill={t.tM} fontSize="7">(expelled upon depolarization)</text>

          <text x="50" y="252" fill={t.tM} fontSize="10" fontWeight="600">INTRACELLULAR</text>

          {/* ══ NORMAL STATE (Left) ══ */}
          <rect x="50" y="268" width="330" height="180" rx="10" fill={t.bgC} stroke={t.ok} strokeWidth="1.5" />
          <text x="215" y="290" textAnchor="middle" fill={t.ok} fontSize="13" fontWeight="700">NORMAL: Channel Open</text>
          <text x="215" y="305" textAnchor="middle" fill={t.tM} fontSize="9">Glu + Gly bound + depolarized (Mg²⁺ expelled)</text>

          {/* Ion flow arrows */}
          <line x1="140" y1="315" x2="140" y2="355" stroke="#3b82f6" strokeWidth="2.5" markerEnd="url(#kB)" />
          <text x="140" y="370" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="700">Ca²⁺</text>
          <line x1="200" y1="315" x2="200" y2="355" stroke="#06b6d4" strokeWidth="2.5" markerEnd="url(#kG)" />
          <text x="200" y="370" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="700">Na⁺</text>

          {/* Downstream signaling */}
          <line x1="170" y1="380" x2="170" y2="400" stroke={t.tM} strokeWidth="1.5" markerEnd="url(#kO)" />
          <rect x="100" y="402" width="140" height="36" rx="6" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="170" y="418" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="700">Ca²⁺ → CaMKII</text>
          <text x="170" y="432" textAnchor="middle" fill={t.tM} fontSize="8">LTP / Central Sensitization</text>

          {/* ══ KETAMINE BLOCKED STATE (Right) ══ */}
          <rect x="420" y="268" width="330" height="180" rx="10" fill={t.bgC} stroke="#ef4444" strokeWidth="2" />
          <text x="585" y="290" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="700">KETAMINE: Channel Blocked</text>
          <text x="585" y="305" textAnchor="middle" fill={t.tM} fontSize="9">Use-dependent — enters OPEN channel, blocks pore</text>

          {/* Ketamine inside pore */}
          <circle cx="585" cy="335" r="18" fill="#ef4444" stroke="#f87171" strokeWidth="2" />
          <text x="585" y="332" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">KET</text>
          <text x="585" y="342" textAnchor="middle" fill="#fff" fontSize="7">in pore</text>

          {/* Blocked ion arrows */}
          <line x1="530" y1="315" x2="530" y2="340" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,3" />
          <text x="530" y="356" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="700"></text>
          <line x1="640" y1="315" x2="640" y2="340" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4,3" />
          <text x="640" y="356" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="700"></text>

          {/* No downstream */}
          <rect x="510" y="410" width="150" height="30" rx="6" fill={theme === "dark" ? "#450a0a" : "#fecaca"} stroke="#ef4444" strokeWidth="1.5" />
          <text x="585" y="430" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="9" fontWeight="700">↓Ca²⁺ influx → BLOCKED</text>

          {/* ══ CLINICAL EFFECTS BOX ══ */}
          <rect x="50" y="465" width="700" height="110" rx="10" fill={t.bgC} stroke={t.bd} strokeWidth="1.5" />
          <text x="400" y="485" textAnchor="middle" fill={t.tx} fontSize="12" fontWeight="700">Clinical Effects of NMDA Blockade</text>

          {/* 4 effect boxes */}
          <rect x="70" y="495" width="145" height="65" rx="6" fill={theme === "dark" ? "#14532d" : "#dcfce7"} stroke={t.ok} strokeWidth="1" />
          <text x="142" y="514" textAnchor="middle" fill={t.ok} fontSize="10" fontWeight="700">Dissociation</text>
          <text x="142" y="528" textAnchor="middle" fill={t.t2} fontSize="8">Thalamo-cortical</text>
          <text x="142" y="540" textAnchor="middle" fill={t.t2} fontSize="8">disconnection</text>
          <text x="142" y="552" textAnchor="middle" fill={t.tM} fontSize="7">Eyes open, nystagmus</text>

          <rect x="230" y="495" width="145" height="65" rx="6" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke={t.bl} strokeWidth="1" />
          <text x="302" y="514" textAnchor="middle" fill={t.bl} fontSize="10" fontWeight="700">Analgesia</text>
          <text x="302" y="528" textAnchor="middle" fill={t.t2} fontSize="8">Dorsal horn NMDA block</text>
          <text x="302" y="540" textAnchor="middle" fill={t.t2} fontSize="8">↓Wind-up / central</text>
          <text x="302" y="552" textAnchor="middle" fill={t.t2} fontSize="8">sensitization</text>

          <rect x="390" y="495" width="145" height="65" rx="6" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1" />
          <text x="462" y="514" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">Sympathomimetic</text>
          <text x="462" y="528" textAnchor="middle" fill={t.t2} fontSize="8">NE/DA reuptake block</text>
          <text x="462" y="540" textAnchor="middle" fill={t.t2} fontSize="8">↑HR, ↑BP, ↑SVR</text>
          <text x="462" y="552" textAnchor="middle" fill={t.tM} fontSize="7">(INDIRECT mechanism)</text>

          <rect x="550" y="495" width="145" height="65" rx="6" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1" />
          <text x="622" y="514" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">Neuroprotection</text>
          <text x="622" y="528" textAnchor="middle" fill={t.t2} fontSize="8">↓Excitotoxic Ca²⁺</text>
          <text x="622" y="540" textAnchor="middle" fill={t.t2} fontSize="8">↓Neuronal death</text>
          <text x="622" y="552" textAnchor="middle" fill={t.tM} fontSize="7">(TBI, status epilepticus)</text>

          {/* Legend */}
          <rect x="50" y="585" width="700" height="28" rx="4" fill={t.bgH} stroke={t.bd} strokeWidth="1" />
          <circle cx="80" cy="599" r="5" fill="#ef4444" /><text x="90" y="603" fill={t.tM} fontSize="9">Ketamine</text>
          <circle cx="175" cy="599" r="5" fill="#10b981" /><text x="185" y="603" fill={t.tM} fontSize="9">Glutamate</text>
          <circle cx="275" cy="599" r="5" fill="#06b6d4" /><text x="285" y="603" fill={t.tM} fontSize="9">Glycine</text>
          <circle cx="355" cy="599" r="5" fill="#3b82f6" /><text x="365" y="603" fill={t.tM} fontSize="9">Ca²⁺</text>
          <circle cx="415" cy="599" r="5" fill="#f59e0b" /><text x="425" y="603" fill={t.tM} fontSize="9">Mg²⁺ block</text>
          <rect x="500" y="594" width="10" height="10" rx="2" fill="none" stroke="#10b981" strokeWidth="1.5" /><text x="515" y="603" fill={t.tM} fontSize="9">NMDA subunits</text>
        </svg>
        ) : (
        <svg ref={svgRef} viewBox="0 0 800 580" style={{ width: "100%", maxWidth: "800px", background: theme === "dark" ? "#0d1117" : "#f8fafc", borderRadius: "10px", border: `1px solid ${t.bd}` }}>
          <text x="400" y="30" textAnchor="middle" fill={t.tx} fontSize="15" fontWeight="600">Propofol at GABA-A Receptor</text>
          <rect x="50" y="200" width="700" height="70" rx="6" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.5" />
          <text x="65" y="238" fill={theme === "dark" ? "#b8956a" : "#8b6914"} fontSize="10">CELL MEMBRANE</text>
          <text x="680" y="192" fill={t.tM} fontSize="10" fontStyle="italic">Extracellular</text>
          <text x="680" y="288" fill={t.tM} fontSize="10" fontStyle="italic">Intracellular</text>
          <rect x="340" y="188" width="60" height="96" rx="4" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke={t.bl} strokeWidth="1.5" />
          <text x="370" y="242" textAnchor="middle" fill={t.bl} fontSize="9" fontWeight="500">Cl⁻ PORE</text>
          <rect x="268" y="198" width="76" height="76" rx="38" fill={theme === "dark" ? "#122040" : "#dbeafe"} stroke="#60a5fa" strokeWidth="1.5" />
          <text x="306" y="240" textAnchor="middle" fill="#60a5fa" fontSize="14" fontWeight="700">α</text>
          <rect x="295" y="152" width="66" height="52" rx="26" fill={theme === "dark" ? "#231530" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="328" y="182" textAnchor="middle" fill="#a855f7" fontSize="14" fontWeight="700">β</text>
          <rect x="365" y="146" width="50" height="46" rx="23" fill={theme === "dark" ? "#0f2918" : "#dcfce7"} stroke="#4ade80" strokeWidth="1.5" />
          <text x="390" y="174" textAnchor="middle" fill="#4ade80" fontSize="14" fontWeight="700">γ</text>
          <rect x="405" y="152" width="66" height="52" rx="26" fill={theme === "dark" ? "#231530" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="438" y="182" textAnchor="middle" fill="#a855f7" fontSize="14" fontWeight="700">β</text>
          <rect x="404" y="198" width="76" height="76" rx="38" fill={theme === "dark" ? "#122040" : "#dbeafe"} stroke="#60a5fa" strokeWidth="1.5" />
          <text x="442" y="240" textAnchor="middle" fill="#60a5fa" fontSize="14" fontWeight="700">α</text>
          <circle cx="280" cy="155" r="14" fill="#10b981" stroke="#34d399" strokeWidth="2" /><text x="280" y="159" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">PROP</text>
          <line x1="288" y1="165" x2="302" y2="170" stroke="#34d399" strokeWidth="2" strokeDasharray="4,3" />
          <circle cx="480" cy="155" r="14" fill="#10b981" stroke="#34d399" strokeWidth="2" /><text x="480" y="159" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">PROP</text>
          <line x1="472" y1="165" x2="458" y2="170" stroke="#34d399" strokeWidth="2" strokeDasharray="4,3" />
          <line x1="260" y1="218" x2="210" y2="120" stroke={t.wn} strokeWidth="1" strokeDasharray="3,3" />
          <rect x="130" y="107" width="82" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke={t.wn} strokeWidth="1" /><text x="171" y="121" textAnchor="middle" fill={t.wn} fontSize="9" fontWeight="500">GABA site (α-β)</text>
          <line x1="280" y1="141" x2="190" y2="80" stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />
          <rect x="95" y="67" width="100" height="20" rx="4" fill={theme === "dark" ? "#052e16" : "#dcfce7"} stroke="#10b981" strokeWidth="1" /><text x="145" y="81" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="500">Propofol (β TM2/3)</text>
          <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill={t.bl} /></marker></defs>
          <circle cx="362" cy="118" r="7" fill="none" stroke={t.bl} strokeWidth="1.5" /><text x="362" y="122" textAnchor="middle" fill={t.bl} fontSize="7" fontWeight="600">Cl⁻</text>
          <line x1="370" y1="130" x2="370" y2="305" stroke={t.bl} strokeWidth="2" markerEnd="url(#ar)" />
          <circle cx="358" cy="320" r="7" fill="none" stroke={t.bl} strokeWidth="1.5" /><text x="358" y="324" textAnchor="middle" fill={t.bl} fontSize="7" fontWeight="600">Cl⁻</text>
          <rect x="260" y="360" width="220" height="65" rx="8" fill={theme === "dark" ? "#0c1a30" : "#eff6ff"} stroke={t.bl} strokeWidth="1.5" />
          <text x="370" y="382" textAnchor="middle" fill={t.bl} fontSize="12" fontWeight="600">HYPERPOLARIZATION</text>
          <text x="370" y="398" textAnchor="middle" fill={t.t2} fontSize="10">−70 mV → −85 mV</text>
          <text x="370" y="414" textAnchor="middle" fill={t.dg} fontSize="10" fontWeight="500">Action potential blocked</text>
          <line x1="370" y1="425" x2="370" y2="450" stroke={t.tM} strokeWidth="1" strokeDasharray="4,3" />
          <rect x="250" y="450" width="240" height="35" rx="8" fill={theme === "dark" ? "#14532d" : "#dcfce7"} stroke={t.ok} strokeWidth="1.5" />
          <text x="370" y="472" textAnchor="middle" fill={t.ok} fontSize="10" fontWeight="600">Sedation → Amnesia → LOC</text>
          <rect x="555" y="340" width="185" height="90" rx="8" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="647" y="358" textAnchor="middle" fill={t.tx} fontSize="10" fontWeight="600">Cl⁻ Channel Modulation</text>
          <line x1="570" y1="365" x2="725" y2="365" stroke={t.bd} strokeWidth="1" />
          <text x="570" y="382" fill="#10b981" fontSize="9">Propofol: ↑ duration + direct gate</text>
          <text x="570" y="398" fill="#10b981" fontSize="9">Barbs: ↑ duration + direct gate</text>
          <text x="570" y="414" fill={t.wn} fontSize="9">BZDs: ↑ frequency, NO direct gate</text>
          <rect x="50" y="520" width="700" height="38" rx="6" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <circle cx="80" cy="539" r="5" fill="#10b981" /><text x="90" y="543" fill={t.tM} fontSize="9">Propofol</text>
          <circle cx="165" cy="539" r="5" fill="none" stroke={t.bl} strokeWidth="1.5" /><text x="175" y="543" fill={t.tM} fontSize="9">Cl⁻</text>
          <rect x="225" y="534" width="10" height="10" rx="5" fill="none" stroke="#60a5fa" strokeWidth="1" /><text x="240" y="543" fill={t.tM} fontSize="9">α subunit</text>
          <rect x="305" y="534" width="10" height="10" rx="5" fill="none" stroke="#a855f7" strokeWidth="1" /><text x="320" y="543" fill={t.tM} fontSize="9">β subunit</text>
          <rect x="395" y="534" width="10" height="10" rx="5" fill="none" stroke="#4ade80" strokeWidth="1" /><text x="410" y="543" fill={t.tM} fontSize="9">γ subunit</text>
        </svg>
        )}
      </div>}
    </div>
  </div>;
}

export { MedDetail };
