import { useState, useRef } from "react";
import { dlPDF } from "../utils/pdf.js";

function LGICDiagram({ t }) {
  const [channelType, setChannelType] = useState("gabaa");
  const [poreOpen, setPoreOpen] = useState(false);
  const [drugBound, setDrugBound] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!poreOpen) { setTick(0); return; }
    const id = setInterval(() => setTick(v => (v + 1) % 80), 55);
    return () => clearInterval(id);
  }, [poreOpen]);

  const cfg = {
    gabaa: {
      label: "GABA-A Receptor", subtype: "Cl⁻ channel — Inhibitory",
      subunits: ["α1","β2","α1","β3","γ2"],
      subColors: ["#3b82f6","#a855f7","#3b82f6","#a855f7","#22c55e"],
      poreColor: "#a855f7",
      ion: "Cl⁻", ionColor: "#a855f7",
      color: "#3b82f6",
      effect: "Cl⁻ influx → hyperpolarization → neuronal inhibition",
      vmClosed: "−70 mV", vmOpen: "−85 mV",
      note: "Propofol & Etomidate: β-TM2/TM3 interface → ↑channel open duration. Benzodiazepines: α-γ interface → ↑open frequency (no direct gate). Barbiturates: β subunit → ↑duration + direct activation.",
      bindLabels: [
        { sub: 0, label: "GABA", color: "#22c55e" },
        { sub: 2, label: "GABA", color: "#22c55e" },
        { sub: 1, label: "Propofol/\nEtomidate", color: "#f59e0b" },
        { sub: 4, label: "BZD site", color: "#ec4899" },
      ],
    },
    nachr: {
      label: "Nicotinic ACh Receptor (NMJ)", subtype: "Na⁺ / Ca²⁺ channel — Excitatory",
      subunits: ["α1","\u03B51","α1","δ1","β1"],
      subColors: ["#f59e0b","#64748b","#f59e0b","#64748b","#64748b"],
      poreColor: "#f59e0b",
      ion: "Na⁺", ionColor: "#f59e0b",
      color: "#f59e0b",
      effect: "Na⁺ / Ca²⁺ influx → end-plate depolarization → muscle contraction",
      vmClosed: "−80 mV", vmOpen: "+10 mV",
      note: "Two ACh molecules must bind (both α subunits). Succinylcholine mimics ACh but is not hydrolyzed → Phase I block. Rocuronium/Vecuronium/Cisatracurium competitively block α sites without depolarization.",
      bindLabels: [
        { sub: 0, label: "ACh / SCh", color: "#22c55e" },
        { sub: 2, label: "ACh / SCh", color: "#22c55e" },
      ],
    },
  };

  const c = cfg[channelType];

  // Layout
  const W = 560, H = 400;
  const memY1 = 155, memY2 = 230;
  const subW = 46, subH = 145, subGap = 10;
  const totalW = 5 * subW + 4 * subGap;
  const startX = (W - totalW) / 2;
  const subCY = (memY1 + memY2) / 2;
  const subXs = Array.from({ length: 5 }, (_, i) => startX + i * (subW + subGap));
  
  // Pore is visually between subunits 2 and 3 (index 2 right edge to index 3 left edge)
  const poreX = subXs[2] + subW + 1;
  const poreW2 = subXs[3] - (subXs[2] + subW) - 2; // = subGap - 2 = 8

  // Animated ions travel down through pore center
  const poreCX = poreX + poreW2 / 2;
  const ions = poreOpen ? Array.from({ length: 5 }, (_, i) => {
    const phase = ((tick / 80) + i / 5) % 1;
    const y = (memY1 - 24) + phase * (memY2 + 50 - (memY1 - 24));
    return { x: poreCX + Math.sin(phase * 10 + i) * 1.5, y, a: Math.min(1, Math.sin(phase * Math.PI) * 1.8) };
  }) : [];

  return (
    <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid ${c.color}40` }}>
      {/* Header */}
      <div style={{ background: t.bgH, padding: "10px 14px", borderBottom: `1px solid ${t.bd}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <span style={{ fontSize: "12px", color: c.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>&#9654; Ligand-Gated Ion Channel &#8212; Interactive</span>
        <div style={{ display: "flex", gap: "8px" }}>
          {Object.entries(cfg).map(([k, v]) => (
            <button key={k} onClick={() => { setChannelType(k); setPoreOpen(false); setDrugBound(false); }}
              style={{ padding: "4px 12px", borderRadius: "6px", border: `1px solid ${channelType === k ? v.color : t.bd}`, background: channelType === k ? `${v.color}18` : t.bgC, color: channelType === k ? v.color : t.tM, fontSize: "11px", fontWeight: channelType === k ? 700 : 400, cursor: "pointer" }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* SVG */}
      <div style={{ background: t.bgH }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", minWidth: "360px" }}>
          <defs>
            <marker id="lgicIon2" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L7,3.5 Z" fill={c.ionColor}/>
            </marker>
          </defs>

          {/* Title */}
          <text x={W/2} y="20" fill={c.color} fontSize="13" fontWeight="700" textAnchor="middle">{c.label}</text>
          <text x={W/2} y="35" fill={t.tM} fontSize="9" textAnchor="middle">{c.subtype} &#8212; Pentameric ({c.subunits.join("-")})</text>

          {/* Zone labels */}
          <text x="10" y={memY1 - 14} fill={t.tM} fontSize="7" fontWeight="600">EXTRACELLULAR</text>
          <text x="10" y={memY2 + 22} fill={t.tM} fontSize="7" fontWeight="600">INTRACELLULAR</text>

          {/* Membrane */}
          <rect x={startX - 14} y={memY1} width={totalW + 28} height={memY2 - memY1}
            rx="3" fill={`${t.ac}06`} stroke={t.bd} strokeWidth="1.5"/>
          {Array.from({ length: Math.floor((totalW + 28) / 11) }, (_, i) => (
            <g key={i}>
              <circle cx={startX - 10 + i * 11} cy={memY1 + 7} r="2.5" fill={`${t.ac}20`} stroke={`${t.ac}40`} strokeWidth="0.4"/>
              <circle cx={startX - 10 + i * 11} cy={memY2 - 7} r="2.5" fill={`${t.ac}20`} stroke={`${t.ac}40`} strokeWidth="0.4"/>
            </g>
          ))}
          <text x={startX + totalW + 16} y={subCY - 4} fill={t.tM} fontSize="7">Lipid</text>
          <text x={startX + totalW + 16} y={subCY + 6} fill={t.tM} fontSize="7">bilayer</text>

          {/* Subunits */}
          {subXs.map((sx, i) => {
            const active = drugBound && c.bindLabels.some(b => b.sub === i);
            return (
              <g key={i}>
                <rect x={sx} y={memY1 - 60} width={subW} height={subH} rx="5"
                  fill={active ? `${c.subColors[i]}40` : `${c.subColors[i]}14`}
                  stroke={c.subColors[i]} strokeWidth={active ? "2.5" : "1.5"}/>
                <text x={sx + subW/2} y={subCY + 4} fill={c.subColors[i]} fontSize="12" textAnchor="middle" fontWeight="700">{c.subunits[i]}</text>
                <text x={sx + subW/2} y={memY1 - 66} fill={t.tM} fontSize="6.5" textAnchor="middle">EC</text>
                <text x={sx + subW/2} y={memY1 - 60 + subH + 13} fill={t.tM} fontSize="6.5" textAnchor="middle">IC</text>
              </g>
            );
          })}

          {/* Central pore — widened for clarity */}
          <rect x={poreX} y={memY1 + 5} width={poreW2} height={memY2 - memY1 - 10} rx={3}
            fill={poreOpen ? `${c.poreColor}35` : `${t.bd}50`}
            stroke={poreOpen ? c.poreColor : t.tM} strokeWidth={poreOpen ? "2" : "1"}/>
          <text x={poreX + poreW2/2} y={subCY + 4} fill={poreOpen ? c.poreColor : t.tM}
            fontSize="6" textAnchor="middle" fontWeight="700" style={{ textTransform: "uppercase" }}>
            {poreOpen ? "OPEN" : "CLOSED"}
          </text>

          {/* Drug binding sites */}
          {drugBound && c.bindLabels.map((bs, i) => {
            const sx = subXs[bs.sub];
            return (
              <g key={i}>
                <ellipse cx={sx + subW/2} cy={memY1 - 52} rx="17" ry="9"
                  fill={`${bs.color}30`} stroke={bs.color} strokeWidth="1.8"/>
                <text x={sx + subW/2} y={memY1 - 49} fill={bs.color} fontSize="7" textAnchor="middle" fontWeight="700">{bs.label.split("\n")[0]}</text>
              </g>
            );
          })}

          {/* Ion animation */}
          {ions.map((ion, i) => (
            <g key={i} opacity={Math.max(0.1, ion.a)}>
              <circle cx={ion.x} cy={ion.y} r="7" fill={c.ionColor}/>
              <text x={ion.x} y={ion.y + 3} fill="#fff" fontSize="7" textAnchor="middle" fontWeight="700">{c.ion}</text>
            </g>
          ))}
          {poreOpen && (
            <line x1={poreCX} y1={memY1 - 20} x2={poreCX} y2={memY2 + 22}
              stroke={c.ionColor} strokeWidth="1.5" strokeDasharray="4,3"
              markerEnd="url(#lgicIon2)" opacity="0.45"/>
          )}

          {/* Vm display */}
          <rect x={W - 90} y={memY1 + 6} width="82" height="56" rx="7"
            fill={t.bgC} stroke={poreOpen ? c.poreColor : t.bd} strokeWidth="1.5"/>
          <text x={W - 49} y={memY1 + 21} fill={t.tM} fontSize="8" textAnchor="middle">Membrane Vm</text>
          <text x={W - 49} y={memY1 + 46} fill={poreOpen ? c.poreColor : t.tx} fontSize="19" fontWeight="700" textAnchor="middle">
            {poreOpen ? c.vmOpen : c.vmClosed}
          </text>
          <text x={W - 49} y={memY1 + 58} fill={t.tM} fontSize="7" textAnchor="middle">mV</text>

          {/* Ion direction callout */}
          {poreOpen && (
            <text x={poreCX + 14} y={memY1 + 35} fill={c.ionColor} fontSize="8" fontWeight="600">{c.ion} influx</text>
          )}

          {/* Legend row */}
          {c.subColors.filter((v, i, a) => a.indexOf(v) === i).map((col, i) => (
            <g key={i}>
              <rect x={startX + i * 130} y={H - 22} width="9" height="9" rx="2" fill={`${col}25`} stroke={col} strokeWidth="1.2"/>
              <text x={startX + i * 130 + 13} y={H - 14} fill={t.t2} fontSize="8">
                {col === "#3b82f6" ? "α subunit (GABA-A)" : col === "#a855f7" ? "β subunit (GABA-A)" : col === "#22c55e" ? "γ subunit (BZD site)" : col === "#f59e0b" ? "α subunit (nAChR)" : "structural"}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Controls */}
      <div style={{ padding: "14px 16px", background: t.bgC, borderTop: `1px solid ${t.bd}` }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
          <button onClick={() => setPoreOpen(p => !p)}
            style={{ padding: "8px 18px", borderRadius: "8px", border: `2px solid ${c.color}`, background: poreOpen ? c.color : "transparent", color: poreOpen ? "#fff" : c.color, fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            {poreOpen ? "\u25a0 Close Pore" : "\u25ba Open Pore"}
          </button>
          <button onClick={() => setDrugBound(d => !d)}
            style={{ padding: "8px 18px", borderRadius: "8px", border: `2px solid ${t.wn}`, background: drugBound ? t.wn : "transparent", color: drugBound ? "#000" : t.wn, fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
            {drugBound ? "Remove Drug" : "Bind Drug"}
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", fontSize: "12px" }}>
          <div style={{ padding: "10px", background: t.bgH, borderRadius: "8px" }}>
            <div style={{ color: c.color, fontWeight: 700, marginBottom: "4px" }}>Net Effect</div>
            <div style={{ color: t.t2, lineHeight: 1.6 }}>{c.effect}</div>
            <div style={{ marginTop: "6px", display: "flex", gap: "12px" }}>
              <div><span style={{ color: t.tM }}>Closed: </span><span style={{ color: t.tx, fontWeight: 600 }}>{c.vmClosed}</span></div>
              <div><span style={{ color: t.tM }}>Open: </span><span style={{ color: c.poreColor, fontWeight: 600 }}>{c.vmOpen}</span></div>
            </div>
          </div>
          <div style={{ padding: "10px", background: t.bgH, borderRadius: "8px" }}>
            <div style={{ color: t.wn, fontWeight: 700, marginBottom: "4px" }}>Drug Binding Sites</div>
            <div style={{ color: t.t2, lineHeight: 1.65 }}>{c.note}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── GPCR Interactive Diagram ─────────────────────────────────────────────────
function GPCRDiagram({ t }) {
  const [step, setStep] = useState(0); // 0=idle, 1=ligand bound, 2=activated, 3=cascade
  const [pathway, setPathway] = useState("gs");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (step < 3) { setTick(0); return; }
    const id = setInterval(() => setTick(v => (v + 1) % 100), 55);
    return () => clearInterval(id);
  }, [step]);

  const pw = {
    gs: { label: "Gs", color: "#22c55e", receptors: "β1, β2, D1, H2, V2", effector: "Adenylyl Cyclase ↑", messenger: "cAMP ↑↑", kinase: "PKA", shortEffect: "↑HR, ↑contractility, smooth muscle relax", fullEffect: "Increased heart rate & contractility (β1), smooth muscle relaxation (β2), increased renin secretion", drugs: "β1: Dobutamine, Isoproterenol\nβ2: Albuterol, Terbutaline" },
    gi: { label: "Gi", color: "#ef4444", receptors: "α2, M2, opioid (μ/\u03BA/δ), D2", effector: "Adenylyl Cyclase ↓", messenger: "cAMP ↓↓", kinase: "PKA↓", shortEffect: "↓HR, ↓AV conduction, analgesia", fullEffect: "Bradycardia & decreased AV conduction (M2), analgesia & sedation (opioid), vasoconstriction (α2)", drugs: "α2: Clonidine, Dexmedetomidine\nM2: Neostigmine (indirect)\nOpioid: Morphine, Fentanyl" },
    gq: { label: "Gq", color: "#f59e0b", receptors: "α1, M1, M3, H1, AT1, V1a", effector: "Phospholipase C ↑", messenger: "IP₃ + DAG ↑", kinase: "PKC + Ca²⁺ release", shortEffect: "Vasoconstriction, secretion, contraction", fullEffect: "Vasoconstriction (α1), bronchoconstriction & secretion (M3), uterine/vascular contraction (V1a)", drugs: "α1: Phenylephrine, Norepinephrine\nM3: Pilocarpine\nV1a: Vasopressin" },
  };
  const p = pw[pathway];
  const W = 600, H = 390;
  const rcx = 180, memY1 = 148, memY2 = 228;

  const gx = step >= 2 ? 390 : 190;
  const gy = step >= 2 ? 295 : 292;

  const cascadeNodes = [
    { label: p.effector, y: 130 },
    { label: p.messenger, y: 200 },
    { label: p.kinase, y: 270 },
  ];

  const stepLabels = [
    { n: "1", txt: "Bind Ligand", active: step >= 1 },
    { n: "2", txt: "Activate G-protein", active: step >= 2 },
    { n: "3", txt: "Select Pathway + Cascade", active: step >= 3 },
  ];

  return (
    <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid ${t.ac}40` }}>
      {/* Header */}
      <div style={{ background: t.bgH, padding: "10px 14px", borderBottom: `1px solid ${t.bd}` }}>
        <span style={{ fontSize: "12px", color: t.ac, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
          &#9654; GPCR &mdash; 7-Transmembrane Receptor &mdash; Interactive
        </span>
      </div>

      {/* Step progress */}
      <div style={{ display: "flex", gap: "6px", padding: "10px 14px", background: t.bgH, borderBottom: `1px solid ${t.bd}`, alignItems: "center", flexWrap: "wrap" }}>
        {stepLabels.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: s.active ? t.ac : t.bgC, border: `2px solid ${s.active ? t.ac : t.bd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, color: s.active ? t.acTx : t.tM, flexShrink: 0 }}>{s.n}</div>
            <span style={{ fontSize: "11px", color: s.active ? t.ac : t.tM, fontWeight: s.active ? 600 : 400 }}>{s.txt}</span>
            {i < 2 && <span style={{ color: t.bd, margin: "0 4px" }}>&#8250;</span>}
          </div>
        ))}
      </div>

      {/* SVG diagram */}
      <div style={{ background: t.bgH }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", minWidth: "380px" }}>
          <defs>
            <marker id="gpcrArrow" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L7,3.5 Z" fill={p.color} />
            </marker>
            <marker id="gpcrArrowBlue" markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
              <path d="M0,0 L0,7 L7,3.5 Z" fill={t.bl} />
            </marker>
          </defs>

          {/* Zone labels */}
          <text x="12" y="90" fill={t.tM} fontSize="8" fontWeight="600">EXTRACELLULAR</text>
          <text x="12" y="284" fill={t.tM} fontSize="8" fontWeight="600">INTRACELLULAR</text>

          {/* Membrane */}
          <rect x="80" y={memY1} width="290" height={memY2 - memY1} rx="4" fill={t.bgC} stroke={t.bd} strokeWidth="1.5"/>
          {Array.from({ length: 18 }, (_, i) => (
            <g key={i}>
              <circle cx={87 + i * 15} cy={memY1 + 10} r="3" fill={`${t.ac}22`} stroke={`${t.ac}44`} strokeWidth="0.5"/>
              <circle cx={87 + i * 15} cy={memY2 - 10} r="3" fill={`${t.ac}22`} stroke={`${t.ac}44`} strokeWidth="0.5"/>
            </g>
          ))}
          <text x="385" y={memY1 + (memY2 - memY1) / 2 + 4} fill={t.tM} fontSize="8">Lipid</text>
          <text x="385" y={memY1 + (memY2 - memY1) / 2 + 14} fill={t.tM} fontSize="8">bilayer</text>

          {/* 7 TM helices */}
          {[0,1,2,3,4,5,6].map(i => {
            const hx = 100 + i * 26;
            const htop = memY1 + 6 + (i % 2 === 0 ? 0 : 8);
            const hbot = memY2 - 6 + (i % 2 === 0 ? 8 : 0);
            const lit = step >= 1;
            return (
              <g key={i}>
                <rect x={hx - 9} y={htop} width="18" height={hbot - htop} rx="5"
                  fill={lit ? `${t.ac}30` : `${t.bd}80`} stroke={t.ac} strokeWidth={lit ? "2" : "1"}/>
                <text x={hx} y={htop + (hbot - htop) / 2 + 4} fill={lit ? t.ac : t.tM} fontSize="9" textAnchor="middle" fontWeight="700">{i + 1}</text>
              </g>
            );
          })}

          {/* TM label */}
          <text x={rcx} y={memY1 - 48} fill={t.ac} fontSize="12" fontWeight="700" textAnchor="middle">7TM Receptor</text>
          <text x={rcx} y={memY1 - 34} fill={t.tM} fontSize="8" textAnchor="middle">Seven transmembrane helices (TM1–TM7)</text>

          {/* Extracellular loops */}
          {[[100,126],[152,178],[204,230]].map(([x1,x2],i) => (
            <path key={i} d={`M${x1},${memY1+6} Q${(x1+x2)/2},${memY1-14-(i===1?8:0)} ${x2},${memY1+14}`}
              fill="none" stroke={t.ac} strokeWidth="1.5" opacity="0.5"/>
          ))}
          {/* Intracellular loops */}
          {[[126,152],[178,204]].map(([x1,x2],i) => (
            <path key={i} d={`M${x1},${memY2-6} Q${(x1+x2)/2},${memY2+18} ${x2},${memY2-6}`}
              fill="none" stroke={t.ac} strokeWidth="1.5" opacity="0.5"/>
          ))}

          {/* Ligand */}
          {step >= 1 && (
            <g>
              <ellipse cx={rcx} cy={memY1 - 20} rx="24" ry="13" fill={`${t.wn}35`} stroke={t.wn} strokeWidth="2.5"/>
              <text x={rcx} y={memY1 - 16} fill={t.wn} fontSize="10" textAnchor="middle" fontWeight="700">Drug</text>
              <line x1={rcx} y1={memY1 - 7} x2={rcx} y2={memY1 + 6} stroke={t.wn} strokeWidth="1.5" strokeDasharray="3,2"/>
            </g>
          )}

          {/* G-protein */}
          <g>
            {/* Gα */}
            <ellipse cx={gx} cy={gy} rx="30" ry="20"
              fill={step >= 2 ? `${p.color}25` : `${t.bl}15`}
              stroke={step >= 2 ? p.color : t.bl} strokeWidth="2"/>
            <text x={gx} y={gy - 2} fill={step >= 2 ? p.color : t.bl} fontSize="11" textAnchor="middle" fontWeight="700">G&#945;</text>
            <text x={gx} y={gy + 10} fill={step >= 2 ? p.color : t.bl} fontSize="7" textAnchor="middle">
              {step >= 2 ? "GTP (active)" : "GDP (inactive)"}
            </text>
            {/* Gβγ - stays near receptor when inactive, separates when active */}
            <ellipse cx={step >= 2 ? gx + 55 : gx + 38} cy={gy + 10} rx="22" ry="14"
              fill={t.bgC} stroke={t.bd} strokeWidth="1.5"/>
            <text x={step >= 2 ? gx + 55 : gx + 38} y={gy + 14} fill={t.tM} fontSize="9" textAnchor="middle">G&#946;&#947;</text>
            {/* Docking line when inactive */}
            {step < 2 && (
              <line x1={gx - 20} y1={gy - 12} x2={230} y2={memY2 + 6}
                stroke={t.bl} strokeWidth="1.5" strokeDasharray="4,2" opacity="0.5"/>
            )}
            {/* GDP→GTP label */}
            {step === 2 && (
              <text x={gx} y={gy - 32} fill={p.color} fontSize="9" textAnchor="middle" fontWeight="700">GDP &#8594; GTP (activated!)</text>
            )}
          </g>

          {/* Cascade — only shown at step 3 */}
          {step >= 3 && (() => {
            const phase = tick / 100;
            return (
              <g>
                {/* Connector from Gα to first cascade node */}
                <line x1={gx + 28} y1={gy - 8} x2={490} y2={cascadeNodes[0].y + 16}
                  stroke={p.color} strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7"/>
                <text x="430" y="108" fill={p.color} fontSize="9" fontWeight="700">Cascade:</text>
                {cascadeNodes.map((n, i) => {
                  const pulse = 0.6 + Math.abs(Math.sin((phase * Math.PI * 2) - i * 0.9)) * 0.4;
                  return (
                    <g key={i}>
                      {i > 0 && (
                        <line x1="490" y1={cascadeNodes[i-1].y + 16} x2="490" y2={n.y - 16}
                          stroke={p.color} strokeWidth="2" markerEnd="url(#gpcrArrow)" opacity="0.8"/>
                      )}
                      <rect x="440" y={n.y - 16} width="100" height="32" rx="8"
                        fill={`${p.color}22`} stroke={p.color} strokeWidth="1.5" opacity={pulse}/>
                      <text x="490" y={n.y + 4} fill={p.color} fontSize="10" textAnchor="middle" fontWeight="700">{n.label}</text>
                    </g>
                  );
                })}
                {/* Net effect box */}
                <rect x="435" y="308" width="110" height="44" rx="8" fill={`${p.color}15`} stroke={p.color} strokeWidth="1.5"/>
                <line x1="490" y1={cascadeNodes[2].y + 16} x2="490" y2="308"
                  stroke={p.color} strokeWidth="2" markerEnd="url(#gpcrArrow)" opacity="0.8"/>
                <text x="490" y="323" fill={p.color} fontSize="8" textAnchor="middle" fontWeight="700">Net Effect</text>
                <text x="490" y="335" fill={p.color} fontSize="7" textAnchor="middle">{p.shortEffect.split(",")[0]}</text>
                <text x="490" y="345" fill={p.color} fontSize="7" textAnchor="middle">{p.shortEffect.split(",")[1] || ""}</text>
              </g>
            );
          })()}

          {/* Step hint at bottom */}
          <rect x="80" y="362" width="380" height="22" rx="5" fill={t.bgC} stroke={t.bd} strokeWidth="1"/>
          <text x="270" y="377" fill={t.tM} fontSize="9" textAnchor="middle">
            {step === 0 ? "Step 1: Click “Bind Ligand” below" :
             step === 1 ? "Step 2: Click “Activate G-Protein” below" :
             step === 2 ? "Step 3: Click “Select & Show Cascade” and choose a pathway" :
             `Gα (${p.label}) → ${p.effector} → ${p.messenger} → ${p.kinase}`}
          </text>
        </svg>
      </div>

      {/* Controls */}
      <div style={{ padding: "14px 16px", background: t.bgC, borderTop: `1px solid ${t.bd}` }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
          <button onClick={() => { setStep(step >= 1 ? 0 : 1); if (step >= 1) setStep(0); }}
            style={{ padding: "8px 16px", borderRadius: "8px", border: `2px solid ${t.wn}`, background: step >= 1 ? t.wn : "transparent", color: step >= 1 ? "#000" : t.wn, fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
            {step >= 1 ? "✓ Ligand Bound" : "1. Bind Ligand"}
          </button>
          <button onClick={() => step >= 1 && setStep(step >= 2 ? 1 : 2)}
            style={{ padding: "8px 16px", borderRadius: "8px", border: `2px solid ${t.bl}`, background: step >= 2 ? t.bl : "transparent", color: step >= 2 ? "#fff" : (step >= 1 ? t.bl : t.tM), fontSize: "12px", fontWeight: 700, cursor: step >= 1 ? "pointer" : "not-allowed", opacity: step >= 1 ? 1 : 0.4 }}>
            {step >= 2 ? "✓ G-Protein Active" : "2. Activate G-Protein"}
          </button>
          <button onClick={() => step >= 2 && setStep(step >= 3 ? 2 : 3)}
            style={{ padding: "8px 16px", borderRadius: "8px", border: `2px solid ${p.color}`, background: step >= 3 ? p.color : "transparent", color: step >= 3 ? "#fff" : (step >= 2 ? p.color : t.tM), fontSize: "12px", fontWeight: 700, cursor: step >= 2 ? "pointer" : "not-allowed", opacity: step >= 2 ? 1 : 0.4 }}>
            {step >= 3 ? "✓ Cascade Active" : "3. Show Cascade"}
          </button>
          <button onClick={() => { setStep(0); }}
            style={{ padding: "8px 14px", borderRadius: "8px", border: `1px solid ${t.bd}`, background: t.bgH, color: t.tM, fontSize: "12px", cursor: "pointer" }}>
            Reset
          </button>
        </div>

        {/* Pathway selector — only relevant at step 3 */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ fontSize: "11px", color: t.tM, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {step < 3 ? "Pathway (activate cascade first to see)" : "Active Pathway:"}
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {Object.entries(pw).map(([k, v]) => (
              <button key={k} onClick={() => setPathway(k)}
                style={{ padding: "6px 14px", borderRadius: "6px", border: `2px solid ${pathway === k ? v.color : t.bd}`, background: pathway === k ? `${v.color}20` : t.bgH, color: pathway === k ? v.color : t.tM, fontSize: "12px", fontWeight: pathway === k ? 700 : 400, cursor: "pointer" }}>
                G{k} &mdash; {v.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pathway detail card */}
        <div style={{ padding: "12px 14px", background: t.bgH, borderRadius: "8px", borderLeft: `4px solid ${p.color}` }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: p.color, marginBottom: "8px" }}>G{pathway === "gs" ? "s" : pathway === "gi" ? "i" : "q"} Pathway</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: "8px", fontSize: "12px" }}>
            <div><span style={{ color: t.tM }}>Receptors: </span><span style={{ color: p.color, fontWeight: 600 }}>{p.receptors}</span></div>
            <div><span style={{ color: t.tM }}>Effector: </span><span style={{ color: p.color, fontWeight: 600 }}>{p.effector}</span></div>
            <div><span style={{ color: t.tM }}>Messenger: </span><span style={{ color: p.color, fontWeight: 600 }}>{p.messenger}</span></div>
            <div><span style={{ color: t.tM }}>Kinase: </span><span style={{ color: p.color, fontWeight: 600 }}>{p.kinase}</span></div>
          </div>
          <div style={{ marginTop: "8px", fontSize: "12px" }}><span style={{ color: t.tM }}>Full effect: </span><span style={{ color: p.color }}>{p.fullEffect}</span></div>
          <div style={{ marginTop: "6px", fontSize: "11px", color: t.tM, whiteSpace: "pre-line" }}>{p.drugs}</div>
        </div>
      </div>
    </div>
  );
}



// ── Linked Medication Diagrams (shown below receptor superfamily diagram) ─────
function LinkedMedDiagrams({ recId, color, t, onMedClick }) {
  const [openId, setOpenId] = useState(null);

  const lgicMeds = [
    { id: "propofol",       name: "Propofol",        note: "GABA-A positive allosteric modulator + direct agonist", component: "propofol" },
    { id: "etomidate",      name: "Etomidate",        note: "GABA-A modulator at β-subunit TM1/3 — potentiation only", component: "etomidate" },
    { id: "succinylcholine",name: "Succinylcholine",  note: "nAChR depolarizing agonist — Phase I & II block", component: "succinylcholine" },
    { id: "cisatracurium",  name: "Cisatracurium",    note: "nAChR competitive (non-depolarizing) antagonist", component: "cisatracurium" },
    { id: "rocuronium",     name: "Rocuronium",       note: "nAChR competitive antagonist — rapid onset, dual reversal", component: "rocuronium" },
    { id: "vecuronium",     name: "Vecuronium",       note: "nAChR competitive antagonist — CV neutral, active metabolite", component: "vecuronium" },
  ];

  const gpcrMeds = [
    { id: "norepinephrine", name: "Norepinephrine",   note: "α₁(Gq) / α₂(Gi) / β₁(Gs) — full adrenergic agonist", component: "ne" },
    { id: "fentanyl",       name: "Fentanyl",         note: "μ-opioid receptor — Gi cascade, GIRK & VGCC", component: "fentanyl" },
    { id: "vasopressin",    name: "Vasopressin",       note: "V1a(Gq) vasoconstriction / V2(Gs) antidiuresis", component: "vasopressin" },
    { id: "epinephrine",    name: "Epinephrine",      note: "Non-selective α+β agonist — Gq/Gs/Gi", component: "epinephrine" },
    { id: "phenylephrine",  name: "Phenylephrine",    note: "Pure α₁(Gq) agonist — SVR↑, reflex brady", component: "phenylephrine" },
    { id: "atropine",       name: "Atropine",         note: "M2 muscarinic (Gi) antagonist — chronotropy↑", component: "atropine" },
    { id: "glycopyrrolate", name: "Glycopyrrolate",   note: "M1/M2/M3 antagonist — quaternary, no CNS penetration", component: "glycopyrrolate" },
    { id: "labetalol",      name: "Labetalol",        note: "α₁ + β₁/β₂ antagonist — balanced BP reduction", component: "labetalol" },
    { id: "hydralazine",    name: "Hydralazine",      note: "Direct arteriolar vasodilation via NO/cGMP", component: "hydralazine" },
  ];

  const meds = recId === "lgic" ? lgicMeds : gpcrMeds;
  const sectionLabel = recId === "lgic"
    ? "Linked Medication Diagrams — LGIC Drug Library"
    : "Linked Medication Diagrams — GPCR Drug Library";
  const subtitle = recId === "lgic"
    ? "Each drug below acts at a ligand-gated ion channel. Expand any card to see its mechanism at the receptor level."
    : "Each drug below acts via a G-protein coupled receptor. Expand any card to see its specific cascade and clinical effect.";

  const renderDiagram = (med) => {
    if (med.component === "propofol")        return <PropofolDiagram t={t} />;
    if (med.component === "etomidate")       return <EtomitateDiagram t={t} />;
    if (med.component === "succinylcholine") return <NMJDiagram t={t} drugId="succinylcholine" />;
    if (med.component === "cisatracurium")   return <NMJDiagram t={t} drugId="cisatracurium" />;
    if (med.component === "rocuronium")      return <RocuroniumDiagram t={t} />;
    if (med.component === "vecuronium")      return <VecuroniumDiagram t={t} />;
    if (med.component === "ne")              return <NEDiagram t={t} />;
    if (med.component === "vasopressin")     return <VasopressinDiagram t={t} />;
    if (med.component === "epinephrine")     return <EpinephrineDiagram t={t} />;
    if (med.component === "phenylephrine")   return <PhenylephrineDiagram t={t} />;
    if (med.component === "atropine")        return <AtropineDiagram t={t} />;
    if (med.component === "glycopyrrolate")  return <GlycopyrrolateDiagram t={t} />;
    if (med.component === "labetalol")       return <LabetalolDiagram t={t} />;
    if (med.component === "hydralazine")     return <HydralazineDiagram t={t} />;
    if (med.component === "fentanyl")        return <FentanylDiagram t={t} />;
    return (
      <div style={{ padding: "24px", textAlign: "center", background: t.bgH, borderRadius: "8px", border: `1px solid ${color}30` }}>
        <div style={{ fontSize: "13px", color: t.tM, fontStyle: "italic", marginBottom: "8px" }}>
          Interactive diagram for {med.name} — coming in next build
        </div>
        <button onClick={() => onMedClick && onMedClick(med.id)}
          style={{ padding: "7px 16px", borderRadius: "7px", border: `1px solid ${color}`, background: "transparent",
            color: color, fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
          Go to {med.name} medication page →
        </button>
      </div>
    );
  };

  return (
    <div style={{ marginTop: "24px" }}>
      {/* Section header */}
      <div style={{ marginBottom: "14px", padding: "14px 16px", background: `${color}10`,
        borderRadius: "10px", border: `1px solid ${color}30` }}>
        <div style={{ fontSize: "12px", fontWeight: 700, color: color, textTransform: "uppercase",
          letterSpacing: "0.5px", marginBottom: "4px" }}>
          {sectionLabel}
        </div>
        <div style={{ fontSize: "12px", color: t.tM, lineHeight: 1.6 }}>{subtitle}</div>
      </div>

      {/* Med cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {meds.map(med => {
          const isOpen = openId === med.id;
          const hasInteractive = !!med.component;
          return (
            <div key={med.id} style={{ borderRadius: "10px", overflow: "hidden",
              border: `1px solid ${isOpen ? color : t.bd}`,
              transition: "border-color 0.2s" }}>
              {/* Card header — always visible */}
              <button onClick={() => setOpenId(isOpen ? null : med.id)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 16px", background: isOpen ? `${color}10` : t.bgC,
                  border: "none", cursor: "pointer", textAlign: "left", transition: "background 0.2s" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${color}18`,
                    border: `2px solid ${isOpen ? color : color + "60"}`, display: "flex", alignItems: "center",
                    justifyContent: "center", flexShrink: 0, transition: "border-color 0.2s" }}>
                    <span style={{ fontSize: "11px", fontWeight: 800, color: color }}>
                      {med.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: isOpen ? color : t.tx,
                      display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      {med.name}
                      {hasInteractive && (
                        <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "4px",
                          background: `${color}18`, color: color, fontWeight: 600 }}>
                          Interactive
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "11px", color: t.tM, marginTop: "2px", lineHeight: 1.5 }}>
                      {med.note}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0, marginLeft: "12px" }}>
                  <button onClick={e => { e.stopPropagation(); onMedClick && onMedClick(med.id); }}
                    style={{ padding: "4px 10px", borderRadius: "6px", border: `1px solid ${color}50`,
                      background: "transparent", color: color, fontSize: "11px", fontWeight: 600,
                      cursor: "pointer", whiteSpace: "nowrap" }}>
                    Full card →
                  </button>
                  <span style={{ color: isOpen ? color : t.tM, fontSize: "16px", transition: "transform 0.2s",
                    display: "inline-block", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                    &#9660;
                  </span>
                </div>
              </button>
              {/* Expanded diagram */}
              {isOpen && (
                <div style={{ padding: "16px", background: t.bgH, borderTop: `1px solid ${color}30` }}>
                  {renderDiagram(med)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// RECEPTOR DETAIL
function ReceptorDetail({ r, t, theme, onMedClick, tab, setTab }) {
  const tabs = ["overview", "cascade", "clinical", "diagram"];
  const tLbl = { overview: "Overview & Mechanism", cascade: "Signaling Cascade", clinical: "Clinical Pharmacology", diagram: "Diagram" };

  const pdfSections = () => {
    const s = [];
    s.push({ t: "Overview & Mechanism", c: r.overview.map(p => `<p>${p}</p>`).join("") });
    s.push({ t: "Signaling Cascade", c: r.cascade.map(p => `<p>${p}</p>`).join("") });
    if (r.id === "lgic") {
      s.push({ t: "Key Channels", c: r.clinical.map(ch => `<div class="bx"><strong>${ch.name}</strong><br/><span class="lb">Subunits:</span> ${ch.subunits}<br/><span class="lb">Ions:</span> ${ch.ions}<br/><span class="lb">Drugs:</span> ${ch.drugs}<br/><span class="lb">Significance:</span> ${ch.significance}</div>`).join("") });
    } else if (r.id === "gpcr") {
      s.push({ t: "G-Protein Comparison", c: `<table style="width:100%;border-collapse:collapse;font-size:11px;margin:8px 0"><tr style="background:#f0fdfa">${["G-Protein","Receptors","Effector","2nd Messengers","Kinase","Net Effect"].map(h=>`<th style="padding:6px;border:1px solid #e2e8f0;text-align:left">${h}</th>`).join("")}</tr>${r.gTable.map(row=>`<tr>${[row.gType,row.receptors,row.effector,row.messengers,row.kinase,row.effect].map(v=>`<td style="padding:5px;border:1px solid #e2e8f0">${v}</td>`).join("")}</tr>`).join("")}</table>` });
      s.push({ t: "Clinical: By Organ System", c: r.clinical.map(c => `<div class="bx"><strong>${c.system}</strong><br/>${c.receptors}</div>`).join("") });
    } else if (r.id === "rtk") {
      s.push({ t: "Clinical Relevance", c: r.clinical.map(c => `<div class="bx"><strong>${c.target}</strong><br/>${c.relevance}</div>`).join("") });
    } else if (r.id === "nuclear") {
      s.push({ t: "Clinical Relevance", c: r.clinical.map(c => `<div class="bx"><strong>${c.target}</strong><br/>${c.relevance}</div>`).join("") });
    }
    return s;
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: r.color }} />
          <span style={{ fontSize: "11px", color: t.tM, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600 }}>Receptor Superfamily</span>
        </div>
        <h1 style={{ margin: "0 0 4px", fontSize: "26px", fontWeight: 700 }}>{r.name}</h1>
        <p style={{ margin: 0, color: t.t2, fontSize: "14px" }}>{r.short}</p>
        <div style={{ display: "flex", gap: "8px", marginTop: "10px", flexWrap: "wrap" }}>
          <span style={{ background: `${r.color}18`, color: r.color, padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>{r.speed}</span>
          <span style={{ background: t.aD, color: t.ac, padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>{r.location}</span>
          <span style={{ background: `${t.pr}15`, color: t.pr, padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600 }}>{r.structure}</span>
        </div>
      </div>

      {/* Linked Medications Banner */}
      <div style={{ padding: "12px 16px", background: t.bgS, borderRadius: "10px", border: `1px solid ${t.bd}`, marginBottom: "16px" }}>
        <div style={{ fontSize: "10px", color: t.tM, textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 600, marginBottom: "6px" }}>Linked Medications</div>
        {r.linkedMeds.length > 0 ? (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {r.linkedMeds.map(m => (
              <button key={m.id} onClick={() => onMedClick(m.id)} style={{ background: t.ac, color: t.acTx, border: "none", borderRadius: "6px", padding: "5px 12px", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                {m.name} <span style={{ opacity: 0.7, fontSize: "10px" }}>({m.note})</span> <span style={{ marginLeft: "2px" }}>-&gt;</span>
              </button>
            ))}
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: "12px", color: t.tM, fontStyle: "italic" }}>Medications targeting {r.name.toLowerCase()} (e.g., {r.futureMeds}) will be linked here as they are added.</p>
        )}
      </div>

      {/* PDF Export */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "12px" }}>
        <button onClick={() => dlPDF(r.name, pdfSections())} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "6px", padding: "5px 12px", cursor: "pointer", fontSize: "11px", color: t.t2, fontWeight: 500 }}>Export PDF</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "2px", marginBottom: "20px", background: t.bgS, borderRadius: "10px", padding: "3px", border: `1px solid ${t.bd}`, overflowX: "auto" }}>
        {tabs.map(tb => (
          <button key={tb} onClick={() => setTab(tb)} style={{
            padding: "8px 14px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap",
            background: tab === tb ? t.ac : "transparent", color: tab === tb ? t.acTx : t.tM,
            transition: "all 0.15s"
          }}>{tLbl[tb]}</button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" && <div>
        {r.overview.map((p, i) => <p key={i} style={{ fontSize: "14px", lineHeight: 1.8, color: t.t2, marginBottom: "14px" }}>{p}</p>)}
      </div>}

      {/* CASCADE TAB */}
      {tab === "cascade" && <div>
        {r.cascade.map((p, i) => <p key={i} style={{ fontSize: "14px", lineHeight: 1.8, color: t.t2, marginBottom: "14px" }}>{p}</p>)}
        {/* G-protein comparison table for GPCR */}
        {r.id === "gpcr" && r.gTable && <div style={{ marginTop: "16px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "10px" }}>G-Protein Family Comparison</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ background: t.bgS }}>
                  {["G-Protein", "Receptors", "Effector", "2nd Messengers", "Kinase", "Net Effect"].map(h => (
                    <th key={h} style={{ padding: "8px 10px", borderBottom: `2px solid ${t.bd}`, textAlign: "left", color: t.ac, fontWeight: 600, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.3px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.gTable.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${t.bd}` }}>
                    <td style={{ padding: "8px 10px", fontWeight: 700, color: t.ac }}>{row.gType}</td>
                    <td style={{ padding: "8px 10px", color: t.t2 }}>{row.receptors}</td>
                    <td style={{ padding: "8px 10px", color: t.t2 }}>{row.effector}</td>
                    <td style={{ padding: "8px 10px", color: t.t2 }}>{row.messengers}</td>
                    <td style={{ padding: "8px 10px", color: t.t2 }}>{row.kinase}</td>
                    <td style={{ padding: "8px 10px", color: t.tx, fontWeight: 500 }}>{row.effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>}
      </div>}

      {/* CLINICAL TAB */}
      {tab === "clinical" && <div>
        {r.id === "lgic" && <>
          <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "12px" }}>Key Ligand-Gated Channels in Anesthesia</h3>
          {r.clinical.map((ch, i) => (
            <div key={i} style={{ padding: "14px 16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, marginBottom: "10px" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: t.ac, marginBottom: "8px" }}>{ch.name}</div>
              <div style={{ display: "grid", gap: "6px", fontSize: "13px" }}>
                <div><span style={{ color: t.tM, fontWeight: 600, fontSize: "10px", textTransform: "uppercase" }}>Subunits: </span><span style={{ color: t.t2 }}>{ch.subunits}</span></div>
                <div><span style={{ color: t.tM, fontWeight: 600, fontSize: "10px", textTransform: "uppercase" }}>Ion Selectivity: </span><span style={{ color: t.t2 }}>{ch.ions}</span></div>
                <div><span style={{ color: t.tM, fontWeight: 600, fontSize: "10px", textTransform: "uppercase" }}>Key Drugs: </span><span style={{ color: t.t2 }}>{ch.drugs}</span></div>
                <div><span style={{ color: t.tM, fontWeight: 600, fontSize: "10px", textTransform: "uppercase" }}>Clinical Significance: </span><span style={{ color: t.tx }}>{ch.significance}</span></div>
              </div>
            </div>
          ))}
        </>}
        {r.id === "gpcr" && <>
          <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "12px" }}>GPCRs by Organ System</h3>
          {r.clinical.map((c, i) => (
            <div key={i} style={{ padding: "14px 16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, marginBottom: "10px" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: t.ac, marginBottom: "6px" }}>{c.system}</div>
              <p style={{ fontSize: "13px", lineHeight: 1.7, color: t.t2, margin: 0 }}>{c.receptors}</p>
            </div>
          ))}
          
          {/* Receptor Effects Table */}
          {r.receptorEffects && <>
            <h3 style={{ fontSize: "15px", fontWeight: 700, margin: "20px 0 12px" }}>Receptor Types & G-Protein Coupling</h3>
            <div style={{ overflowX: "auto", marginBottom: "16px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "600px" }}>
                <thead>
                  <tr style={{ background: t.bgS }}>
                    {["Receptor Category", "Gq", "Gs", "Gi", "Main Effects"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", borderBottom: `2px solid ${t.bd}`, textAlign: "left", color: t.ac, fontWeight: 600, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.3px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {r.receptorEffects.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${t.bd}` }}>
                      <td style={{ padding: "8px 10px", fontWeight: 700, color: t.tx }}>{row.category}</td>
                      <td style={{ padding: "8px 10px", color: row.gq === "N/A" ? t.tM : t.t2, fontStyle: row.gq === "N/A" ? "italic" : "normal" }}>{row.gq}</td>
                      <td style={{ padding: "8px 10px", color: row.gs === "N/A" ? t.tM : t.t2, fontStyle: row.gs === "N/A" ? "italic" : "normal" }}>{row.gs}</td>
                      <td style={{ padding: "8px 10px", color: row.gi === "N/A" ? t.tM : t.t2, fontStyle: row.gi === "N/A" ? "italic" : "normal" }}>{row.gi}</td>
                      <td style={{ padding: "8px 10px", color: t.t2, fontSize: "11px", lineHeight: 1.5 }}>{row.effects}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>}

          <div style={{ padding: "14px 16px", background: `${t.wn}08`, borderRadius: "10px", border: `1px solid ${t.wn}30`, marginTop: "14px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: t.wn, marginBottom: "6px" }}>Clinical Pearl: Receptor Desensitization</div>
            <p style={{ fontSize: "13px", lineHeight: 1.7, color: t.t2, margin: 0 }}>Chronic beta-1 agonist exposure (as in heart failure with elevated catecholamines) causes receptor downregulation through beta-arrestin-mediated internalization. This explains why heart failure patients have blunted responses to beta-agonists and why beta-blockers paradoxically improve outcomes -- they allow receptor re-sensitization over time. Understanding the G-protein determines the clinical effect of any drug acting at these receptors.</p>
          </div>
          <div style={{ padding: "14px 16px", background: `${t.pr}08`, borderRadius: "10px", border: `1px solid ${t.pr}30`, marginTop: "10px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: t.pr, marginBottom: "6px" }}>Mnemonic: Gq-coupled Receptor Ligands</div>
            <p style={{ fontSize: "13px", lineHeight: 1.7, color: t.t2, margin: 0 }}><strong>TRy VAn GOGH</strong> -- TRH, Vasopressin (V1), Angiotensin II, GnRH, Oxytocin, Gastrin, Histamine (H1). All act through the Gq/PLC/IP3/DAG/Ca2+ pathway producing contraction or secretion.</p>
          </div>
          <div style={{ padding: "14px 16px", background: `${t.dg}08`, borderRadius: "10px", border: `1px solid ${t.dg}30`, marginTop: "10px" }}>
            <div style={{ fontSize: "12px", fontWeight: 700, color: t.dg, marginBottom: "6px" }}>High-Yield: Toxin Targets</div>
            <p style={{ fontSize: "13px", lineHeight: 1.7, color: t.t2, margin: 0 }}><strong>Cholera toxin</strong> ADP-ribosylates Gs-alpha, locking it in the active (GTP-bound) state. Persistent adenylyl cyclase activation causes massive cAMP accumulation in intestinal epithelium, driving Cl- and water secretion (secretory diarrhea). <strong>Pertussis toxin</strong> ADP-ribosylates Gi-alpha, preventing GDP-GTP exchange and locking it inactive. This removes the inhibitory brake on adenylyl cyclase, causing elevated cAMP. In respiratory epithelium: impaired immune signaling. In the heart: explains pertussis-associated tachycardia (loss of M2/Gi vagal tone).</p>
          </div>
        </>}
        {(r.id === "rtk" || r.id === "nuclear") && <>
          <h3 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "12px" }}>Clinical Relevance in Anesthesia & ICU</h3>
          {r.clinical.map((c, i) => (
            <div key={i} style={{ padding: "14px 16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, marginBottom: "10px" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: t.ac, marginBottom: "6px" }}>{c.target}</div>
              <p style={{ fontSize: "13px", lineHeight: 1.7, color: t.t2, margin: 0 }}>{c.relevance}</p>
            </div>
          ))}
        </>}
      </div>}

      {/* DIAGRAM TAB */}
      {tab === "diagram" && <div>
        {r.id === "lgic" && <LGICDiagram t={t} />}
        {r.id === "gpcr" && <GPCRDiagram t={t} />}
        {r.id !== "lgic" && r.id !== "gpcr" && <div style={{ padding: "24px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
          <p style={{ color: t.tM, fontSize: "13px", fontStyle: "italic" }}>Interactive diagram for {r.name} -- coming in next build iteration.</p>
          <p style={{ color: t.tM, fontSize: "12px" }}>Will show: {r.id === "rtk" ? "RTK dimerization and PI3K-Akt cascade" : "cytoplasmic receptor with nuclear translocation"}</p>
        </div>}
        {(r.id === "lgic" || r.id === "gpcr") && <LinkedMedDiagrams recId={r.id} color={r.color} t={t} onMedClick={onMedClick} />}
      </div>}
    </div>
  );
}


// NOTES COMPONENT

export { ReceptorDetail };
