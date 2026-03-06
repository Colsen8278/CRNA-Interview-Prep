import { useState, useRef } from "react";
import { dlPDF, dlDiagram } from "../utils/pdf.js";
import { NotesBox } from "./NotesBox.jsx";
import { Stars } from "./ui.jsx";

function NEInteractiveDiagram({ t }) {
  const [activePath, setActivePath] = useState(null);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!activePath) return;
    const id = setInterval(() => setTick(v => (v + 1) % 90), 55);
    return () => clearInterval(id);
  }, [activePath]);

  const paths = {
    a1: {
      label: "α1 Receptor", subtitle: "Vascular Smooth Muscle",
      color: "#ef4444", gp: "Gqα",
      steps: ["PLC activation", "IP₃ + DAG ↑", "Ca²⁺ release", "Vasoconstriction"],
      effect: "↑SVR → ↑MAP",
      note: "Dominant vasopressor effect. Primary mechanism of action. Every IV vasopressor works here.",
    },
    b1: {
      label: "β1 Receptor", subtitle: "Cardiac Myocyte",
      color: "#3b82f6", gp: "Gsα",
      steps: ["Adenylyl cyclase ↑", "cAMP ↑↑", "PKA activation", "+Inotrope / +Chronotrope"],
      effect: "↑CO, ↑contractility",
      note: "NE β1 effect is weaker than α. HR often unchanged or ↓ due to reflex bradycardia from ↑MAP.",
    },
    a2: {
      label: "α2 Receptor", subtitle: "Presynaptic Terminal",
      color: "#a855f7", gp: "Giα",
      steps: ["Adenylyl cyclase ↓", "cAMP ↓↓", "GIRK K⁺ opening", "↓NE release (feedback)"],
      effect: "Negative feedback",
      note: "Autoreceptor: limits own release. Dexmedetomidine/clonidine exploit α2 for sedation and sympatholysis.",
    },
  };

  const W = 560, H = 310;
  const cols = { a1: 100, b1: 285, a2: 470 };
  const memY = 82;

  return (
    <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid #10b98140` }}>
      <div style={{ background: t.bgH, padding: "10px 14px", borderBottom: `1px solid ${t.bd}` }}>
        <span style={{ fontSize: "12px", color: "#10b981", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>&#9654; Norepinephrine — Adrenergic Receptor Cascades</span>
      </div>
      <div style={{ display: "flex", gap: "6px", padding: "10px 14px", background: t.bgH, borderBottom: `1px solid ${t.bd}`, flexWrap: "wrap" }}>
        {Object.entries(paths).map(([k, v]) => (
          <button key={k} onClick={() => setActivePath(activePath === k ? null : k)}
            style={{ padding: "6px 14px", borderRadius: "6px", border: `2px solid ${activePath === k ? v.color : t.bd}`, background: activePath === k ? `${v.color}18` : t.bgC, color: activePath === k ? v.color : t.tM, fontSize: "12px", fontWeight: activePath === k ? 700 : 400, cursor: "pointer" }}>
            {v.label}
          </button>
        ))}
        {activePath && <button onClick={() => setActivePath(null)} style={{ padding: "6px 12px", borderRadius: "6px", border: `1px solid ${t.bd}`, background: t.bgH, color: t.tM, fontSize: "11px", cursor: "pointer" }}>Reset</button>}
      </div>
      <div style={{ background: t.bgH }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", minWidth: "380px" }}>
          <defs>
            {Object.entries(paths).map(([k, v]) => (
              <marker key={k} id={`neArr${k}`} markerWidth="7" markerHeight="7" refX="3" refY="3.5" orient="auto">
                <path d="M0,0 L0,7 L7,3.5 Z" fill={v.color}/>
              </marker>
            ))}
          </defs>
          {/* NE molecule */}
          <circle cx={W / 2} cy="28" r="18" fill="#10b981" stroke="#34d399" strokeWidth="2"/>
          <text x={W / 2} y="24" fill="#fff" fontSize="9" textAnchor="middle" fontWeight="700">NE</text>
          <text x={W / 2} y="34" fill="#fff" fontSize="7" textAnchor="middle">α₁\u003Eα1\u003Eβ1</text>
          {/* Lines from NE to each receptor */}
          {Object.entries(cols).map(([k, cx]) => (
            <line key={k} x1={W / 2} y1="46" x2={cx} y2={memY - 8}
              stroke={paths[k].color} strokeWidth={activePath === k ? "2.5" : "1"} strokeDasharray={activePath === k ? "none" : "4,3"} opacity={activePath && activePath !== k ? 0.25 : 0.8}/>
          ))}
          {/* Membrane */}
          <rect x="40" y={memY} width={W - 80} height="20" rx="3" fill={`${t.ac}12`} stroke={t.bd} strokeWidth="1"/>
          <text x="46" y={memY + 13} fill={t.tM} fontSize="7">MEMBRANE</text>
          {/* Receptors and cascades */}
          {Object.entries(paths).map(([k, v]) => {
            const cx = cols[k];
            const active = activePath === k;
            const phase = tick / 90;
            const nodeYs = [memY + 30, memY + 72, memY + 116, memY + 160, memY + 204];
            return (
              <g key={k} opacity={activePath && !active ? 0.25 : 1}>
                {/* Receptor box */}
                <rect x={cx - 42} y={memY - 12} width="84" height="28" rx="6"
                  fill={active ? `${v.color}25` : t.bgC} stroke={v.color} strokeWidth={active ? "2.5" : "1.5"}/>
                <text x={cx} y={memY + 4} fill={v.color} fontSize="11" textAnchor="middle" fontWeight="700">{v.label}</text>
                {/* Subtitle */}
                <text x={cx} y={nodeYs[0] - 4} fill={t.tM} fontSize="7" textAnchor="middle">{v.subtitle}</text>
                {/* Cascade boxes */}
                {[v.gp, ...v.steps].map((step, i) => {
                  const ny = nodeYs[i];
                  const pulse = active ? (0.5 + Math.abs(Math.sin((phase * Math.PI * 2) - i * 0.7)) * 0.5) : 0.5;
                  return (
                    <g key={i}>
                      {i > 0 && <line x1={cx} y1={nodeYs[i - 1] + 14} x2={cx} y2={ny - 14}
                        stroke={v.color} strokeWidth="1.5" markerEnd={`url(#neArr${k})`} opacity={active ? 0.9 : 0.3}/>}
                      <rect x={cx - 38} y={ny - 13} width="76" height="26" rx="6"
                        fill={`${v.color}${active ? "22" : "10"}`} stroke={v.color} strokeWidth={active ? "1.5" : "0.8"} opacity={active ? pulse : 0.5}/>
                      <text x={cx} y={ny + 3} fill={v.color} fontSize="8.5" textAnchor="middle" fontWeight={active ? "700" : "400"}>{step}</text>
                    </g>
                  );
                })}
                {/* Effect box */}
                <rect x={cx - 44} y={nodeYs[5] - 2} width="88" height="24" rx="8"
                  fill={active ? v.color : `${v.color}10`} stroke={v.color} strokeWidth="2" opacity={active ? 1 : 0.4}/>
                <text x={cx} y={nodeYs[5] + 13} fill={active ? "#fff" : v.color} fontSize="9" textAnchor="middle" fontWeight="700">{v.effect}</text>
              </g>
            );
          })}
          {/* Note on reflex bradycardia */}
          {activePath === "a1" && (
            <g>
              <rect x="6" y={H - 36} width="548" height="28" rx="5" fill={`${"#ef4444"}12`} stroke={"#ef4444"} strokeWidth="1"/>
              <text x="10" y={H - 22} fill={"#ef4444"} fontSize="8.5" fontWeight="600">↑MAP → baroreceptors → ↑vagal tone → reflex bradycardia — offsets β1 chronotropy. Net HR ≈ unchanged or ↓.</text>
            </g>
          )}
        </svg>
      </div>
      {activePath && (
        <div style={{ padding: "10px 16px", background: t.bgC, borderTop: `1px solid ${t.bd}` }}>
          <p style={{ margin: 0, fontSize: "12px", color: t.t2, lineHeight: 1.7 }}>
            <span style={{ color: paths[activePath].color, fontWeight: 700 }}>{paths[activePath].label}: </span>{paths[activePath].note}
          </p>
        </div>
      )}
    </div>
  );
}

function PropofolInteractiveDiagram({ t }) {
  const [mode, setMode] = useState("baseline");
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(v => (v + 1) % 100), 50);
    return () => clearInterval(id);
  }, []);

  const modes = {
    baseline: { label: "Baseline", color: "#64748b", desc: "No drug. Infrequent GABA-A opening. Resting Vm −70 mV.", clRate: 0.05, vm: "−70 mV", openFreq: "Low", gaba: false, propofol: false },
    gaba:     { label: "GABA only", color: "#22c55e", desc: "Endogenous GABA binds α-β interface → pore opens. Cl⁻ influx, hyperpolarization.", clRate: 0.4, vm: "−78 mV", openFreq: "Moderate", gaba: true, propofol: false },
    propofol: { label: "Propofol alone", color: t.ac, desc: "Propofol binds β TM2/TM3 — direct allosteric gating even without GABA (at clinical doses).", clRate: 0.5, vm: "−82 mV", openFreq: "Moderate-High", gaba: false, propofol: true },
    potent:   { label: "GABA + Propofol", color: "#f59e0b", desc: "Propofol potentiates GABA: prolongs channel open time, increases Cl⁻ conductance. Synergistic → anesthesia.", clRate: 0.95, vm: "−85+ mV", openFreq: "Very High", gaba: true, propofol: true },
  };
  const m = modes[mode];

  const W = 500, H = 330;
  const memY1 = 115, memY2 = 185;
  const subunits = [{ label: "α", x: 118, color: "#3b82f6" }, { label: "β", x: 166, color: "#a855f7" }, { label: "α", x: 214, color: "#3b82f6" }, { label: "β", x: 262, color: "#a855f7" }, { label: "γ", x: 310, color: "#22c55e" }];
  const poreX = 238, poreW = 14;
  const clOpen = Math.random() < m.clRate;
  const phase = tick / 100;
  const ions = m.clRate > 0.1 ? Array.from({ length: Math.round(m.clRate * 5), }, (_, i) => {
    const p2 = ((phase) + i / 5) % 1;
    return { x: poreX + poreW / 2 + Math.sin(p2 * 6 + i) * 2, y: memY1 - 15 + p2 * (memY2 + 40 - memY1 + 15), a: Math.sin(p2 * Math.PI) };
  }) : [];

  const vmNum = parseInt(m.vm) || -70;
  const vmBar = Math.min(100, Math.max(0, (Math.abs(vmNum) - 60) / 30 * 100));

  return (
    <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid ${t.ac}40` }}>
      <div style={{ background: t.bgH, padding: "10px 14px", borderBottom: `1px solid ${t.bd}` }}>
        <span style={{ fontSize: "12px", color: t.ac, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>&#9654; Propofol — GABA-A Receptor Mechanism</span>
      </div>
      <div style={{ display: "flex", gap: "6px", padding: "10px 14px", background: t.bgH, borderBottom: `1px solid ${t.bd}`, flexWrap: "wrap" }}>
        {Object.entries(modes).map(([k, v]) => (
          <button key={k} onClick={() => setMode(k)}
            style={{ padding: "6px 14px", borderRadius: "6px", border: `2px solid ${mode === k ? v.color : t.bd}`, background: mode === k ? `${v.color}18` : t.bgC, color: mode === k ? v.color : t.tM, fontSize: "11px", fontWeight: mode === k ? 700 : 400, cursor: "pointer" }}>
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ background: t.bgH }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", minWidth: "360px" }}>
          <defs>
            <marker id="pClArr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 Z" fill="#a855f7"/>
            </marker>
          </defs>
          {/* Zones */}
          <text x="10" y={memY1 - 8} fill={t.tM} fontSize="8" fontWeight="600">EXTRACELLULAR</text>
          <text x="10" y={memY2 + 18} fill={t.tM} fontSize="8" fontWeight="600">INTRACELLULAR</text>

          {/* Membrane */}
          <rect x="90" y={memY1} width="280" height={memY2 - memY1} rx="3" fill={`${t.ac}08`} stroke={t.bd} strokeWidth="1.5"/>
          {Array.from({ length: 19 }, (_, i) => (
            <g key={i}>
              <circle cx={95 + i * 14} cy={memY1 + 8} r="3" fill={`${t.ac}22`} stroke={`${t.ac}44`} strokeWidth="0.5"/>
              <circle cx={95 + i * 14} cy={memY2 - 8} r="3" fill={`${t.ac}22`} stroke={`${t.ac}44`} strokeWidth="0.5"/>
            </g>
          ))}

          {/* Subunits */}
          {subunits.map((s, i) => (
            <g key={i}>
              <rect x={s.x - 18} y={memY1 - 52} width="36" height="118" rx="5"
                fill={`${s.color}18`} stroke={s.color} strokeWidth="1.5"/>
              <text x={s.x} y={(memY1 + memY2) / 2 + 4} fill={s.color} fontSize="13" textAnchor="middle" fontWeight="700">{s.label}</text>
            </g>
          ))}

          {/* Pore */}
          <rect x={poreX} y={memY1 + 4} width={poreW} height={memY2 - memY1 - 8} rx={m.clRate > 0.1 ? poreW / 2 : 1}
            fill={m.clRate > 0.3 ? "#a855f730" : "#64748b20"} stroke={m.clRate > 0.3 ? "#a855f7" : "#64748b"} strokeWidth="1.5"/>
          <text x={poreX + poreW / 2} y={(memY1 + memY2) / 2 + 4} fill={m.clRate > 0.3 ? "#a855f7" : t.tM} fontSize="7" textAnchor="middle" fontWeight="700">
            {m.clRate > 0.3 ? "OPEN" : "CLOSED"}
          </text>

          {/* GABA binding indicators */}
          {m.gaba && [subunits[0], subunits[2]].map((s, i) => (
            <g key={i}>
              <ellipse cx={s.x} cy={memY1 - 52 + 8} rx="14" ry="7" fill="#22c55e30" stroke="#22c55e" strokeWidth="1.5"/>
              <text x={s.x} y={memY1 - 52 + 11} fill="#22c55e" fontSize="7" textAnchor="middle" fontWeight="600">GABA</text>
            </g>
          ))}

          {/* Propofol binding indicator */}
          {m.propofol && [subunits[1], subunits[3]].map((s, i) => (
            <g key={i}>
              <ellipse cx={s.x} cy={memY1 + 30} rx="16" ry="7" fill={`${t.ac}25`} stroke={t.ac} strokeWidth="2"/>
              <text x={s.x} y={memY1 + 33} fill={t.ac} fontSize="7" textAnchor="middle" fontWeight="700">Prop</text>
              <text x={s.x} y={memY1 - 54 - 8} fill={t.ac} fontSize="7" textAnchor="middle">TM2/TM3</text>
            </g>
          ))}

          {/* Ions */}
          {ions.map((ion, i) => (
            <g key={i} opacity={Math.max(0.1, ion.a)}>
              <circle cx={ion.x} cy={ion.y} r="7" fill="#a855f7"/>
              <text x={ion.x} y={ion.y + 3} fill="#fff" fontSize="6.5" textAnchor="middle" fontWeight="700">Cl⁻</text>
            </g>
          ))}
          {m.clRate > 0.1 && (
            <line x1={poreX + poreW / 2} y1={memY1 - 12} x2={poreX + poreW / 2} y2={memY2 + 18}
              stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#pClArr)" opacity="0.5"/>
          )}

          {/* Vm gauge */}
          <rect x={W - 92} y="50" width="76" height="130" rx="8" fill={t.bgC} stroke={m.color} strokeWidth="1.5"/>
          <text x={W - 54} y="66" fill={t.tM} fontSize="8" textAnchor="middle">Membrane Vm</text>
          <rect x={W - 80} y="74" width="52" height="10" rx="3" fill={t.bgH}/>
          <rect x={W - 80} y="74" width={52 * vmBar / 100} height="10" rx="3" fill={m.color}/>
          <text x={W - 54} y="106" fill={m.color} fontSize="22" fontWeight="700" textAnchor="middle">{m.vm}</text>
          <text x={W - 54} y="120" fill={t.tM} fontSize="8" textAnchor="middle">Open freq:</text>
          <text x={W - 54} y="134" fill={m.color} fontSize="9" fontWeight="600" textAnchor="middle">{m.openFreq}</text>
          <text x={W - 54} y="152" fill={t.tM} fontSize="7" textAnchor="middle">Cl⁻ flow:</text>
          <text x={W - 54} y="166" fill={m.color} fontSize="9" fontWeight="600" textAnchor="middle">{Math.round(m.clRate * 100)}%</text>
        </svg>
      </div>
      <div style={{ padding: "10px 16px", background: t.bgC, borderTop: `1px solid ${t.bd}` }}>
        <p style={{ margin: 0, fontSize: "12px", color: t.t2, lineHeight: 1.7 }}>
          <span style={{ color: m.color, fontWeight: 700 }}>{m.label}: </span>{m.desc}
        </p>
      </div>
    </div>
  );
}

function SCHInteractiveDiagram({ t }) {
  const [phase, setPhase] = useState("normal");
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(v => (v + 1) % 120), 55);
    return () => clearInterval(id);
  }, []);

  const phases = {
    normal: { label: "Normal ACh", color: "#22c55e", desc: "Two ACh molecules bind both α subunits → brief channel opening → Na⁺/Ca²⁺ influx → end-plate potential → muscle contraction. AChE rapidly hydrolyzes ACh (milliseconds) → channel closes.", vm: "+40 mV", nachr: "open", ache: true },
    phase1: { label: "SCh Phase I", color: "#f59e0b", desc: "SCh binds α subunits like ACh but resists AChE hydrolysis. Prolonged depolarization → Na⁺ channels inactivate (cannot fire again). Fasciculations then flaccid paralysis. Duration ~5–10 min until plasma cholinesterase hydrolyzes SCh.", vm: "+40 mV → stuck", nachr: "prolonged", ache: false },
    phase2: { label: "SCh Phase II", color: "#ef4444", desc: "With repeated/large doses: receptor desensitization. nAChR shifts to desensitized state (channel closed despite agonist present). Mimics competitive block. Unpredictable duration. Treated like non-depolarizing block (neostigmine may help).", vm: "−70 mV (closed)", nachr: "desensitized", ache: false },
    rocuronium: { label: "Rocuronium (compare)", color: "#3b82f6", desc: "Competitive antagonist: blocks α subunits without activating channel. NO depolarization, NO fasciculations. Membrane stays at resting −70 mV. Reversed by sugammadex encapsulation. Duration 30–60 min.", vm: "−70 mV (resting)", nachr: "blocked", ache: false },
  };
  const p = phases[phase];
  const W = 500, H = 350;
  const memY1 = 140, memY2 = 215;

  const subunits = [{ label: "α", x: 140, color: "#f59e0b" }, { label: "δ", x: 185, color: "#94a3b8" }, { label: "α", x: 230, color: "#f59e0b" }, { label: "\u03B5", x: 275, color: "#94a3b8" }, { label: "β", x: 320, color: "#94a3b8" }];
  const poreX = 207, poreW = 14;
  const tickN = tick / 120;
  const naIons = (p.nachr === "open" || p.nachr === "prolonged") ? Array.from({ length: p.nachr === "prolonged" ? 5 : 3 }, (_, i) => {
    const ph = (tickN + i / (p.nachr === "prolonged" ? 5 : 3)) % 1;
    return { x: poreX + poreW / 2 + Math.sin(ph * 5 + i) * 2, y: memY1 - 12 + ph * (memY2 + 35 - memY1 + 12), a: Math.sin(ph * Math.PI) };
  }) : [];

  const drugColor = phase === "rocuronium" ? "#3b82f6" : "#ef4444";
  const drugLabel = phase === "rocuronium" ? "Roc" : phase === "normal" ? "ACh" : "SCh";

  return (
    <div style={{ borderRadius: "10px", overflow: "hidden", border: `1px solid #f59e0b40` }}>
      <div style={{ background: t.bgH, padding: "10px 14px", borderBottom: `1px solid ${t.bd}` }}>
        <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>&#9654; Succinylcholine — NMJ & Depolarizing Block</span>
      </div>
      <div style={{ display: "flex", gap: "6px", padding: "10px 14px", background: t.bgH, borderBottom: `1px solid ${t.bd}`, flexWrap: "wrap" }}>
        {Object.entries(phases).map(([k, v]) => (
          <button key={k} onClick={() => setPhase(k)}
            style={{ padding: "5px 12px", borderRadius: "6px", border: `2px solid ${phase === k ? v.color : t.bd}`, background: phase === k ? `${v.color}18` : t.bgC, color: phase === k ? v.color : t.tM, fontSize: "11px", fontWeight: phase === k ? 700 : 400, cursor: "pointer" }}>
            {v.label}
          </button>
        ))}
      </div>
      <div style={{ background: t.bgH }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: "block", minWidth: "360px" }}>
          <defs>
            <marker id="schNa" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 Z" fill="#f59e0b"/>
            </marker>
          </defs>
          {/* Zone labels */}
          <text x="10" y={memY1 - 8} fill={t.tM} fontSize="8" fontWeight="600">EXTRACELLULAR (presynaptic terminal releases ACh / SCh applied IV)</text>
          <text x="10" y={memY2 + 18} fill={t.tM} fontSize="8" fontWeight="600">INTRACELLULAR (muscle fiber)</text>

          {/* Membrane */}
          <rect x="100" y={memY1} width="290" height={memY2 - memY1} rx="3" fill={`${t.ac}08`} stroke={t.bd} strokeWidth="1.5"/>
          {Array.from({ length: 19 }, (_, i) => (
            <g key={i}>
              <circle cx={105 + i * 14} cy={memY1 + 8} r="3" fill="#f59e0b22" stroke="#f59e0b44" strokeWidth="0.5"/>
              <circle cx={105 + i * 14} cy={memY2 - 8} r="3" fill="#f59e0b22" stroke="#f59e0b44" strokeWidth="0.5"/>
            </g>
          ))}

          {/* Subunits */}
          {subunits.map((s, i) => {
            const desens = p.nachr === "desensitized";
            return (
              <g key={i}>
                <rect x={s.x - 17} y={memY1 - 55} width="34" height="126" rx="5"
                  fill={desens ? `${s.color}08` : `${s.color}18`} stroke={s.color} strokeWidth={desens ? "1" : "1.5"} strokeDasharray={desens ? "4,2" : "none"}/>
                <text x={s.x} y={(memY1 + memY2) / 2 + 4} fill={desens ? `${s.color}88` : s.color} fontSize="12" textAnchor="middle" fontWeight="700">{s.label}</text>
              </g>
            );
          })}

          {/* Binding sites with drug/ACh molecules */}
          {[subunits[0], subunits[2]].map((s, i) => (
            <g key={i}>
              <ellipse cx={s.x} cy={memY1 - 55 + 8} rx="15" ry="7"
                fill={`${drugColor}30`} stroke={drugColor} strokeWidth="1.5"/>
              <text x={s.x} y={memY1 - 55 + 11} fill={drugColor} fontSize="7" textAnchor="middle" fontWeight="700">{drugLabel}</text>
            </g>
          ))}

          {/* Pore */}
          <rect x={poreX} y={memY1 + 4} width={poreW} height={memY2 - memY1 - 8} rx={p.nachr === "open" || p.nachr === "prolonged" ? poreW / 2 : 1}
            fill={p.nachr === "open" || p.nachr === "prolonged" ? "#f59e0b30" : "#64748b20"}
            stroke={p.nachr === "open" || p.nachr === "prolonged" ? "#f59e0b" : "#64748b"} strokeWidth="1.5"/>
          <text x={poreX + poreW / 2} y={(memY1 + memY2) / 2 + 4} fill={p.nachr === "open" || p.nachr === "prolonged" ? "#f59e0b" : t.tM} fontSize="6.5" textAnchor="middle" fontWeight="700">
            {p.nachr === "open" ? "OPEN" : p.nachr === "prolonged" ? "STUCK" : p.nachr === "desensitized" ? "DESENS" : "BLOCKED"}
          </text>

          {/* AChE label */}
          {p.ache && (
            <g>
              <rect x="370" y={memY1 - 30} width="90" height="24" rx="5" fill="#22c55e18" stroke="#22c55e" strokeWidth="1.5"/>
              <text x="415" y={memY1 - 14} fill="#22c55e" fontSize="9" textAnchor="middle" fontWeight="700">AChE \u2713 active</text>
              <text x="415" y={memY1 - 4} fill="#22c55e" fontSize="7" textAnchor="middle">hydrolyzes ACh rapidly</text>
            </g>
          )}
          {!p.ache && phase !== "normal" && (
            <g>
              <rect x="370" y={memY1 - 30} width="90" height="24" rx="5" fill="#ef444418" stroke="#ef4444" strokeWidth="1.5"/>
              <text x="415" y={memY1 - 14} fill="#ef4444" fontSize="9" textAnchor="middle" fontWeight="700">AChE \u2717 resists</text>
              <text x="415" y={memY1 - 4} fill="#ef4444" fontSize="7" textAnchor="middle">plasma ChE cleaves SCh</text>
            </g>
          )}

          {/* Na ions */}
          {naIons.map((ion, i) => (
            <g key={i} opacity={Math.max(0.1, ion.a)}>
              <circle cx={ion.x} cy={ion.y} r="7" fill="#f59e0b"/>
              <text x={ion.x} y={ion.y + 3} fill="#fff" fontSize="6.5" textAnchor="middle" fontWeight="700">Na⁺</text>
            </g>
          ))}
          {(p.nachr === "open" || p.nachr === "prolonged") && (
            <line x1={poreX + poreW / 2} y1={memY1 - 12} x2={poreX + poreW / 2} y2={memY2 + 18}
              stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#schNa)" opacity="0.5"/>
          )}

          {/* Vm indicator */}
          <rect x={W - 92} y={memY1 - 10} width="84" height="56" rx="6" fill={t.bgC} stroke={p.color} strokeWidth="1.5"/>
          <text x={W - 50} y={memY1 + 6} fill={t.tM} fontSize="8" textAnchor="middle">End-plate Vm</text>
          <text x={W - 50} y={memY1 + 36} fill={p.color} fontSize="15" fontWeight="700" textAnchor="middle">{p.vm}</text>

          {/* Phase I vs II comparison note */}
          {(phase === "phase1" || phase === "phase2") && (
            <g>
              <rect x="10" y={H - 42} width="480" height="30" rx="5"
                fill={phase === "phase1" ? "#f59e0b12" : "#ef444412"}
                stroke={phase === "phase1" ? "#f59e0b" : "#ef4444"} strokeWidth="1"/>
              <text x="16" y={H - 28} fill={phase === "phase1" ? "#f59e0b" : "#ef4444"} fontSize="8.5" fontWeight="700">
                {phase === "phase1" ? "Phase I: Depolarizing block. Na⁺ channels inactivate. Fasciculations first, then paralysis. Reversal: wait for plasma ChE." : "Phase II: Desensitization block. Channel unresponsive to agonist. Unpredictable. May respond to neostigmine."}
              </text>
            </g>
          )}
        </svg>
      </div>
      <div style={{ padding: "10px 16px", background: t.bgC, borderTop: `1px solid ${t.bd}` }}>
        <p style={{ margin: 0, fontSize: "12px", color: t.t2, lineHeight: 1.7 }}>
          <span style={{ color: p.color, fontWeight: 700 }}>{p.label}: </span>{p.desc}
        </p>
      </div>
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════════════════
// INTERACTIVE MEDICATION DIAGRAMS
// ══════════════════════════════════════════════════════════════════════════════

// ── Norepinephrine: Adrenergic Receptor Cascade ───────────────────────────────

// ── Shared: membrane SVG + cascade divs pattern ──────────────────────────────
// GpcrSVG: 600×210 membrane visualization only — NO cascade text inside SVG
function GpcrSVG({ t, drugAbbr, drugColor, gpType, gpColor, recLabel, activated }) {
  const W = 600, H = 210;
  const memY = 88, memH = 28;
  const rcx = 300;
  const gaX = activated ? 150 : 262;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display:"block", minWidth:"340px" }}>
      {/* Zone backgrounds */}
      <rect x="0" y="0" width={W} height={memY} fill={`${drugColor}09`}/>
      <rect x="0" y={memY + memH} width={W} height={H - memY - memH} fill={`${gpColor}06`}/>

      {/* Zone labels */}
      <text x="14" y="15" fill={t.tM} fontSize="8" fontWeight="700" opacity="0.55">EXTRACELLULAR</text>
      <text x="14" y={memY + memH + 17} fill={t.tM} fontSize="8" fontWeight="700" opacity="0.55">INTRACELLULAR</text>

      {/* Membrane bilayer */}
      <rect x="65" y={memY} width={W - 130} height={memH} rx="3" fill={t.bgC} stroke={t.bd} strokeWidth="1.5"/>
      {Array.from({ length: 25 }, (_, i) => (
        <g key={i}>
          <circle cx={73 + i * 18} cy={memY + 7}  r="4" fill={`${drugColor}18`} stroke={`${drugColor}35`} strokeWidth="0.8"/>
          <circle cx={73 + i * 18} cy={memY + 21} r="4" fill={`${drugColor}18`} stroke={`${drugColor}35`} strokeWidth="0.8"/>
        </g>
      ))}

      {/* 3 TM helices spanning membrane */}
      {[rcx - 26, rcx, rcx + 26].map((hx, i) => (
        <rect key={i} x={hx - 9} y={memY - 22 + (i === 1 ? 7 : 0)} width="18" height={memH + 22}
          rx="6" fill={`${drugColor}22`} stroke={drugColor} strokeWidth="1.8" opacity="0.9"/>
      ))}

      {/* Receptor name */}
      <text x={rcx} y={memY - 32} fill={drugColor} fontSize="11" textAnchor="middle" fontWeight="700">{recLabel}</text>

      {/* Drug molecule */}
      <circle cx={rcx} cy="32" r="22"
        fill={activated ? `${drugColor}35` : `${drugColor}18`}
        stroke={drugColor} strokeWidth={activated ? "2.5" : "1.8"}/>
      <text x={rcx} y="29" fill={drugColor} fontSize="9"  textAnchor="middle" fontWeight="700">{drugAbbr}</text>
      <text x={rcx} y="41" fill={drugColor} fontSize="7"  textAnchor="middle">{activated ? "Bound ✓" : "→ binds"}</text>

      {/* Drug → receptor binding line */}
      <line x1={rcx} y1="54" x2={rcx} y2={memY - 24}
        stroke={drugColor} strokeWidth={activated ? "2" : "1.2"} strokeDasharray="3,2"/>

      {/* G-protein Gα (slides left when active) */}
      <ellipse cx={gaX} cy="158" rx="32" ry="22"
        fill={activated ? `${gpColor}28` : `${gpColor}15`}
        stroke={gpColor} strokeWidth={activated ? "2.2" : "1.5"}/>
      <text x={gaX} y="155" fill={gpColor} fontSize="10" textAnchor="middle" fontWeight="700">G&#945;</text>
      <text x={gaX} y="168" fill={gpColor} fontSize="8"  textAnchor="middle">{gpType}</text>

      {/* Gβγ */}
      <ellipse cx={activated ? rcx + 15 : rcx + 35} cy="165" rx="24" ry="14"
        fill={`${t.tM}18`} stroke={t.bd} strokeWidth="1.5"/>
      <text x={activated ? rcx + 15 : rcx + 35} y="169" fill={t.tM} fontSize="9" textAnchor="middle">G&#946;&#947;</text>

      {/* Coupling line when inactive */}
      {!activated && (
        <line x1={gaX + 20} y1="137" x2={rcx - 20} y2={memY + memH + 4}
          stroke={gpColor} strokeWidth="1" strokeDasharray="4,3" opacity="0.35"/>
      )}

      {/* Status label at bottom */}
      <text x={rcx} y="200" fill={activated ? gpColor : t.tM} fontSize="10" textAnchor="middle">
        {activated ? "Gα dissociates — cascade initiated" : "Click Activate below to show signaling cascade"}
      </text>
    </svg>
  );
}

// CascadeFlow: renders pathway steps as React divs — no SVG text, no encoding issues
function CascadeFlow({ steps, t }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", flexWrap:"wrap", gap:"6px", padding:"14px 14px 0" }}>
      <div style={{ width:"100%", fontSize:"10px", fontWeight:700, color:t.tM, textTransform:"uppercase", letterSpacing:"0.5px", marginBottom:"8px" }}>
        Signaling Cascade
      </div>
      {steps.map((s, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:"6px" }}>
          <div style={{
            padding:"8px 12px",
            background:`${s.color}18`,
            border:`1.5px solid ${s.color}60`,
            borderRadius:"8px",
            fontSize:"11px", fontWeight:700, color:s.color,
            lineHeight:1.5, textAlign:"center", minWidth:"78px", maxWidth:"120px"
          }}>
            {s.label}
          </div>
          {i < steps.length - 1 && (
            <div style={{ color:t.tM, fontSize:"18px", flexShrink:0, lineHeight:1 }}>&#8594;</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Norepinephrine: α1 / α2 / β1 receptors ───────────────────────────────────
function NEDiagram({ t }) {
  const [rec, setRec] = useState("a1");
  const [activated, setActivated] = useState(false);

  const recs = {
    a1: {
      label: "α1 Receptor",
      recLabel: "α1-Adrenoceptor",
      abbr: "NE",
      loc: "Vascular smooth muscle",
      drugColor: "#ef4444",
      gpType: "Gq",
      gpColor: "#f59e0b",
      steps: [
        { label: "NE binds α1",    color: "#ef4444" },
        { label: "Gq activates",   color: "#f59e0b" },
        { label: "PLC ↑",          color: "#f59e0b" },
        { label: "IP3 + DAG",      color: "#f59e0b" },
        { label: "Ca²⁺ ↑ / PKC ↑", color: "#f59e0b" },
        { label: "Vasoconstriction↑SVR↑MAP", color: "#ef4444" },
      ],
      desc: "α1 receptors on vascular smooth muscle couple to Gq. PLC cleaves PIP2 → IP3 (triggers SR Ca²⁺ release) + DAG (activates PKC). Ca²⁺-calmodulin activates MLCK → myosin phosphorylation → vasoconstriction. Net: SVR↑, MAP↑. Reflex bradycardia possible at high doses.",
    },
    a2: {
      label: "α2 Receptor",
      recLabel: "α2-Adrenoceptor",
      abbr: "NE",
      loc: "Presynaptic terminal / CNS",
      drugColor: "#8b5cf6",
      gpType: "Gi",
      gpColor: "#ef4444",
      steps: [
        { label: "NE binds α2",      color: "#8b5cf6" },
        { label: "Gi activates",     color: "#ef4444" },
        { label: "AC inhibited ↓",   color: "#ef4444" },
        { label: "cAMP ↓↓",          color: "#ef4444" },
        { label: "PKA ↓",            color: "#ef4444" },
        { label: "NE release ↓ / Sedation", color: "#8b5cf6" },
      ],
      desc: "α2 is primarily a presynaptic autoreceptor — NE feeds back to inhibit its own release. Gi couples to adenylyl cyclase inhibition → cAMP↓ → PKA↓ → vesicle release↓. Also mediates sedation/analgesia centrally (locus coeruleus). Basis for dexmedetomidine mechanism.",
    },
    b1: {
      label: "β1 Receptor",
      recLabel: "β1-Adrenoceptor",
      abbr: "NE",
      loc: "SA node / Myocardium",
      drugColor: "#3b82f6",
      gpType: "Gs",
      gpColor: "#22c55e",
      steps: [
        { label: "NE binds β1",        color: "#3b82f6" },
        { label: "Gs activates",       color: "#22c55e" },
        { label: "AC ↑",               color: "#22c55e" },
        { label: "cAMP ↑↑",            color: "#22c55e" },
        { label: "PKA ↑",              color: "#22c55e" },
        { label: "HR ↑ / Contractility ↑", color: "#3b82f6" },
      ],
      desc: "β1 in the SA node increases If (funny current) → faster depolarization → ↑HR (chronotropy). In ventricular myocytes, PKA phosphorylates L-type Ca²⁺ channels (↑Ca²⁺ influx), RyR2, and phospholamban (↑SERCA activity) → ↑contractility (inotropy) and faster relaxation (lusitropy).",
    },
  };

  const r = recs[rec];

  return (
    <div style={{ borderRadius:"10px", overflow:"hidden", border:`1px solid ${r.drugColor}40` }}>
      <div style={{ background:t.bgH, padding:"10px 14px", borderBottom:`1px solid ${t.bd}`,
        display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", alignItems:"center" }}>
        <span style={{ fontSize:"12px", color:r.drugColor, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>
          &#9654; Norepinephrine &mdash; Adrenergic Receptors
        </span>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {Object.entries(recs).map(([k, v]) => (
            <button key={k} onClick={() => { setRec(k); setActivated(false); }}
              style={{ padding:"4px 12px", borderRadius:"6px", border:`2px solid ${rec===k ? v.drugColor : t.bd}`,
                background: rec===k ? `${v.drugColor}18` : t.bgC, color: rec===k ? v.drugColor : t.tM,
                fontSize:"11px", fontWeight: rec===k ? 700 : 400, cursor:"pointer" }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background:t.bgH }}>
        <GpcrSVG t={t} drugAbbr={r.abbr} drugColor={r.drugColor}
          gpType={r.gpType} gpColor={r.gpColor} recLabel={r.recLabel} activated={activated}/>
      </div>
      {activated && <CascadeFlow steps={r.steps} t={t}/>}
      <div style={{ padding:"12px 14px", background:t.bgC, borderTop:`1px solid ${t.bd}` }}>
        <div style={{ display:"flex", gap:"8px", marginBottom:"12px", flexWrap:"wrap" }}>
          <button onClick={() => setActivated(a => !a)}
            style={{ padding:"7px 16px", borderRadius:"8px", border:`2px solid ${r.gpColor}`,
              background: activated ? r.gpColor : "transparent", color: activated ? "#fff" : r.gpColor,
              fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
            {activated ? "✓ Cascade Active" : "Activate G-Protein"}
          </button>
          <button onClick={() => setActivated(false)}
            style={{ padding:"7px 12px", borderRadius:"8px", border:`1px solid ${t.bd}`,
              background:t.bgH, color:t.tM, fontSize:"12px", cursor:"pointer" }}>Reset</button>
        </div>
        <div style={{ padding:"10px 14px", background:t.bgH, borderRadius:"8px", borderLeft:`4px solid ${r.drugColor}` }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:r.drugColor, marginBottom:"4px" }}>{r.label} — {r.loc}</div>
          <p style={{ margin:0, fontSize:"12px", color:t.t2, lineHeight:1.7 }}>{r.desc}</p>
        </div>
      </div>
    </div>
  );
}

// ── Fentanyl: μ-Opioid Receptor (Gi) ─────────────────────────────────────────
function FentanylDiagram({ t }) {
  const [focus, setFocus] = useState("analgesia");
  const [activated, setActivated] = useState(false);

  const foci = {
    analgesia: {
      label: "Analgesia (Dorsal Horn)",
      color: "#22c55e",
      steps: [
        { label: "Fentanyl binds μ-OR", color: "#a855f7" },
        { label: "Gi activates",         color: "#ef4444" },
        { label: "AC ↓ / cAMP ↓",        color: "#ef4444" },
        { label: "VGCC Ca²⁺ ↓",          color: "#3b82f6" },
        { label: "SP / Glu release ↓",   color: "#ef4444" },
        { label: "GIRK K⁺ ↑",            color: "#22c55e" },
        { label: "Hyperpolarization → Analgesia", color: "#22c55e" },
      ],
      desc: "Fentanyl binds μ-OR on presynaptic Aδ/C fibers AND postsynaptic dorsal horn neurons. Gi → AC↓ → cAMP↓ → VGCC inactivation (↓Ca²⁺ influx presynaptically → ↓substance P/glutamate release). Gi also activates GIRK K⁺ channels (postsynaptic hyperpolarization) → decreased nociceptive transmission.",
    },
    resp: {
      label: "Resp Depression (Brainstem)",
      color: "#ef4444",
      steps: [
        { label: "Fentanyl binds μ-OR", color: "#a855f7" },
        { label: "Gi activates",         color: "#ef4444" },
        { label: "cAMP ↓",               color: "#ef4444" },
        { label: "preBötzinger pacemaker ↓", color: "#ef4444" },
        { label: "Respiratory rate ↓",   color: "#ef4444" },
        { label: "Apnea risk ↑",          color: "#ef4444" },
      ],
      desc: "μ-OR in the preBötzinger complex (medullary respiratory rhythm generator). Gi → ↓cAMP → reduced pacemaker neuron firing → dose-dependent respiratory depression: analgesia → sedation → apnea. Reversible with naloxone (μ-OR competitive antagonist, Kd ~1 nM).",
    },
    gi: {
      label: "GI (Enteric μ-OR)",
      color: "#f59e0b",
      steps: [
        { label: "Fentanyl binds μ-OR",  color: "#a855f7" },
        { label: "Gi activates",          color: "#ef4444" },
        { label: "Enteric neuron cAMP ↓", color: "#f59e0b" },
        { label: "Propulsive motility ↓", color: "#f59e0b" },
        { label: "Sphincter tone ↑",      color: "#f59e0b" },
        { label: "Constipation",          color: "#f59e0b" },
      ],
      desc: "Enteric μ-OR activation hyperpolarizes enteric neurons → ↓propulsive peristalsis, ↑sphincter tone, ↓secretion. Constipation is a peripheral effect that does NOT develop tolerance (unlike analgesia and euphoria). Basis for methylnaltrexone (peripherally restricted μ antagonist) to treat opioid-induced constipation.",
    },
  };

  const fc = foci[focus];

  return (
    <div style={{ borderRadius:"10px", overflow:"hidden", border:"1px solid #a855f740" }}>
      <div style={{ background:t.bgH, padding:"10px 14px", borderBottom:`1px solid ${t.bd}`,
        display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", alignItems:"center" }}>
        <span style={{ fontSize:"12px", color:"#a855f7", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>
          &#9654; Fentanyl &mdash; &#956;-Opioid Receptor (Gi-coupled GPCR)
        </span>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {Object.entries(foci).map(([k, v]) => (
            <button key={k} onClick={() => { setFocus(k); setActivated(false); }}
              style={{ padding:"4px 10px", borderRadius:"6px", border:`2px solid ${focus===k ? v.color : t.bd}`,
                background: focus===k ? `${v.color}18` : t.bgC, color: focus===k ? v.color : t.tM,
                fontSize:"11px", fontWeight: focus===k ? 700 : 400, cursor:"pointer" }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background:t.bgH }}>
        <GpcrSVG t={t} drugAbbr="FENT" drugColor="#a855f7"
          gpType="Gi" gpColor="#ef4444" recLabel="μ-Opioid Receptor (7TM GPCR)" activated={activated}/>
      </div>
      {activated && <CascadeFlow steps={fc.steps} t={t}/>}
      <div style={{ padding:"12px 14px", background:t.bgC, borderTop:`1px solid ${t.bd}` }}>
        <button onClick={() => setActivated(a => !a)}
          style={{ padding:"7px 16px", borderRadius:"8px", border:"2px solid #a855f7",
            background: activated ? "#a855f7" : "transparent", color: activated ? "#fff" : "#a855f7",
            fontSize:"12px", fontWeight:700, cursor:"pointer", marginBottom:"12px" }}>
          {activated ? "✓ Fentanyl Bound & Active" : "Bind Fentanyl to μ-OR"}
        </button>
        <div style={{ padding:"10px 14px", background:t.bgH, borderRadius:"8px", borderLeft:`4px solid ${fc.color}` }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:fc.color, marginBottom:"4px" }}>{fc.label}</div>
          <p style={{ margin:0, fontSize:"12px", color:t.t2, lineHeight:1.7 }}>{fc.desc}</p>
        </div>
      </div>
    </div>
  );
}

// ── Vasopressin: V1a (Gq) + V2 (Gs) ─────────────────────────────────────────
function VasopressinDiagram({ t }) {
  const [rec, setRec] = useState("v1a");
  const [activated, setActivated] = useState(false);

  const recs = {
    v1a: {
      label: "V1a Receptor",
      recLabel: "V1a-R (Vascular)",
      loc: "Vascular smooth muscle, liver",
      drugColor: "#06b6d4",
      gpType: "Gq",
      gpColor: "#f59e0b",
      steps: [
        { label: "AVP binds V1a",    color: "#06b6d4" },
        { label: "Gq activates",     color: "#f59e0b" },
        { label: "PLC ↑",            color: "#f59e0b" },
        { label: "IP3 + DAG",        color: "#f59e0b" },
        { label: "Ca²⁺ ↑ / PKC ↑",  color: "#f59e0b" },
        { label: "Vasoconstriction → SVR ↑", color: "#06b6d4" },
      ],
      desc: "V1a receptors on vascular smooth muscle couple to Gq → PLC → IP3-mediated SR Ca²⁺ release + DAG → PKC → MLCK activation → vasoconstriction. At pharmacologic doses, vasopressin produces profound vasoconstriction via V1a, making it effective in vasodilatory shock (sepsis, post-cardiac surgery). Also present in liver: V1a → glycogenolysis.",
    },
    v2: {
      label: "V2 Receptor",
      recLabel: "V2-R (Renal Collecting Duct)",
      loc: "Renal collecting duct principal cells",
      drugColor: "#06b6d4",
      gpType: "Gs",
      gpColor: "#22c55e",
      steps: [
        { label: "AVP binds V2",     color: "#06b6d4" },
        { label: "Gs activates",     color: "#22c55e" },
        { label: "AC ↑",             color: "#22c55e" },
        { label: "cAMP ↑↑",          color: "#22c55e" },
        { label: "PKA ↑",            color: "#22c55e" },
        { label: "AQP2 insertion",   color: "#06b6d4" },
        { label: "H₂O reabsorption ↑ (Antidiuresis)", color: "#06b6d4" },
      ],
      desc: "V2 receptors in the renal collecting duct couple to Gs → AC → cAMP↑ → PKA → phosphorylation of aquaporin-2 (AQP2) → AQP2 traffics from intracellular vesicles to the apical membrane → free water reabsorption. Basis for vasopressin as antidiuretic hormone (ADH) in DI treatment. Desmopressin (DDAVP) is a selective V2 agonist.",
    },
  };

  const r = recs[rec];

  return (
    <div style={{ borderRadius:"10px", overflow:"hidden", border:"1px solid #06b6d440" }}>
      <div style={{ background:t.bgH, padding:"10px 14px", borderBottom:`1px solid ${t.bd}`,
        display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", alignItems:"center" }}>
        <span style={{ fontSize:"12px", color:"#06b6d4", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>
          &#9654; Vasopressin (AVP) &mdash; V1a / V2 Receptors
        </span>
        <div style={{ display:"flex", gap:"6px" }}>
          {Object.entries(recs).map(([k, v]) => (
            <button key={k} onClick={() => { setRec(k); setActivated(false); }}
              style={{ padding:"4px 12px", borderRadius:"6px", border:`2px solid ${rec===k ? v.drugColor : t.bd}`,
                background: rec===k ? `${v.drugColor}18` : t.bgC, color: rec===k ? v.drugColor : t.tM,
                fontSize:"11px", fontWeight: rec===k ? 700 : 400, cursor:"pointer" }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background:t.bgH }}>
        <GpcrSVG t={t} drugAbbr="AVP" drugColor={r.drugColor}
          gpType={r.gpType} gpColor={r.gpColor} recLabel={r.recLabel} activated={activated}/>
      </div>
      {activated && <CascadeFlow steps={r.steps} t={t}/>}
      <div style={{ padding:"12px 14px", background:t.bgC, borderTop:`1px solid ${t.bd}` }}>
        <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
          <button onClick={() => setActivated(a => !a)}
            style={{ padding:"7px 16px", borderRadius:"8px", border:`2px solid ${r.gpColor}`,
              background: activated ? r.gpColor : "transparent", color: activated ? "#fff" : r.gpColor,
              fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
            {activated ? "✓ Cascade Active" : "Activate G-Protein"}
          </button>
          <button onClick={() => setActivated(false)}
            style={{ padding:"7px 12px", borderRadius:"8px", border:`1px solid ${t.bd}`,
              background:t.bgH, color:t.tM, fontSize:"12px", cursor:"pointer" }}>Reset</button>
        </div>
        <div style={{ padding:"10px 14px", background:t.bgH, borderRadius:"8px", borderLeft:`4px solid ${r.drugColor}` }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:r.drugColor, marginBottom:"4px" }}>{r.label} — {r.loc}</div>
          <p style={{ margin:0, fontSize:"12px", color:t.t2, lineHeight:1.7 }}>{r.desc}</p>
        </div>
      </div>
    </div>
  );
}

// ── Epinephrine: α1 / α2 / β1 / β2 ──────────────────────────────────────────
function EpinephrineDiagram({ t }) {
  const [rec, setRec] = useState("a1");
  const [activated, setActivated] = useState(false);

  const recs = {
    a1: {
      label: "α1 (Gq)",
      recLabel: "α1-Adrenoceptor",
      drugColor: "#f97316",
      gpType: "Gq", gpColor: "#f59e0b",
      steps: [
        { label: "Epi binds α1", color: "#f97316" },
        { label: "Gq activates",  color: "#f59e0b" },
        { label: "PLC ↑",         color: "#f59e0b" },
        { label: "IP3 + DAG",     color: "#f59e0b" },
        { label: "Ca²⁺ ↑ / PKC ↑", color: "#f59e0b" },
        { label: "Vasoconstriction ↑SVR", color: "#f97316" },
      ],
      desc: "At HIGH doses, epinephrine dominates at α1 → Gq → PLC → IP3/DAG → Ca²⁺ → vasoconstriction. SVR↑, MAP↑. This is the mechanism behind post-anaphylaxis epinephrine: reverses distributive vasodilation. Important: unlike phenylephrine, epinephrine also drives β1 simultaneously at all doses.",
    },
    a2: {
      label: "α2 (Gi)",
      recLabel: "α2-Adrenoceptor",
      drugColor: "#f97316",
      gpType: "Gi", gpColor: "#ef4444",
      steps: [
        { label: "Epi binds α2",     color: "#f97316" },
        { label: "Gi activates",     color: "#ef4444" },
        { label: "AC ↓",             color: "#ef4444" },
        { label: "cAMP ↓",           color: "#ef4444" },
        { label: "NE release ↓",     color: "#ef4444" },
        { label: "Sympatholysis / Presynaptic inhibition", color: "#f97316" },
      ],
      desc: "α2 presynaptic autoreceptors reduce norepinephrine release. Gi → AC↓ → cAMP↓. Epinephrine has lower α2 affinity than norepinephrine, so α2 effects are less prominent. The α2 effect helps modulate excessive sympathetic tone at high catecholamine levels.",
    },
    b1: {
      label: "β1 (Gs)",
      recLabel: "β1-Adrenoceptor",
      drugColor: "#f97316",
      gpType: "Gs", gpColor: "#22c55e",
      steps: [
        { label: "Epi binds β1",       color: "#f97316" },
        { label: "Gs activates",       color: "#22c55e" },
        { label: "AC ↑",               color: "#22c55e" },
        { label: "cAMP ↑",             color: "#22c55e" },
        { label: "PKA ↑",              color: "#22c55e" },
        { label: "HR ↑ / Contractility ↑ / CO ↑", color: "#f97316" },
      ],
      desc: "β1 present at ALL epinephrine doses. Gs → AC → cAMP↑ → PKA → phosphorylation of L-type Ca²⁺ channels, RyR2, phospholamban → ↑inotropy + ↑chronotropy. Epinephrine is stronger at β1 than norepinephrine, making it more tachycardic at equivalent pressor doses.",
    },
    b2: {
      label: "β2 (Gs)",
      recLabel: "β2-Adrenoceptor",
      drugColor: "#f97316",
      gpType: "Gs", gpColor: "#22c55e",
      steps: [
        { label: "Epi binds β2",        color: "#f97316" },
        { label: "Gs activates",        color: "#22c55e" },
        { label: "AC ↑",                color: "#22c55e" },
        { label: "cAMP ↑",              color: "#22c55e" },
        { label: "PKA ↑",               color: "#22c55e" },
        { label: "Bronchodilation + Vasodilation (skeletal muscle)", color: "#f97316" },
      ],
      desc: "β2 receptors on bronchial smooth muscle and peripheral vasculature. Gs → cAMP↑ → PKA → MLCK inhibition → smooth muscle relaxation → bronchodilation + vasodilation. At LOW doses epinephrine, β2 vasodilation in skeletal muscle can DROP diastolic BP despite β1-driven HR increase — explaining the widened pulse pressure at low doses.",
    },
  };

  const r = recs[rec];

  return (
    <div style={{ borderRadius:"10px", overflow:"hidden", border:"1px solid #f9731640" }}>
      <div style={{ background:t.bgH, padding:"10px 14px", borderBottom:`1px solid ${t.bd}`,
        display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", alignItems:"center" }}>
        <span style={{ fontSize:"12px", color:"#f97316", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>
          &#9654; Epinephrine &mdash; &#945;1 / &#945;2 / &#946;1 / &#946;2 Receptors
        </span>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {Object.entries(recs).map(([k, v]) => (
            <button key={k} onClick={() => { setRec(k); setActivated(false); }}
              style={{ padding:"4px 10px", borderRadius:"6px", border:`2px solid ${rec===k ? "#f97316" : t.bd}`,
                background: rec===k ? "#f9731618" : t.bgC, color: rec===k ? "#f97316" : t.tM,
                fontSize:"11px", fontWeight: rec===k ? 700 : 400, cursor:"pointer" }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background:t.bgH }}>
        <GpcrSVG t={t} drugAbbr="EPI" drugColor={r.drugColor}
          gpType={r.gpType} gpColor={r.gpColor} recLabel={r.recLabel} activated={activated}/>
      </div>
      {activated && <CascadeFlow steps={r.steps} t={t}/>}
      <div style={{ padding:"12px 14px", background:t.bgC, borderTop:`1px solid ${t.bd}` }}>
        <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
          <button onClick={() => setActivated(a => !a)}
            style={{ padding:"7px 16px", borderRadius:"8px", border:"2px solid #f97316",
              background: activated ? "#f97316" : "transparent", color: activated ? "#fff" : "#f97316",
              fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
            {activated ? "✓ Cascade Active" : "Activate G-Protein"}
          </button>
          <button onClick={() => setActivated(false)}
            style={{ padding:"7px 12px", borderRadius:"8px", border:`1px solid ${t.bd}`,
              background:t.bgH, color:t.tM, fontSize:"12px", cursor:"pointer" }}>Reset</button>
        </div>
        <div style={{ padding:"10px 14px", background:t.bgH, borderRadius:"8px", borderLeft:"4px solid #f97316" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:"#f97316", marginBottom:"4px" }}>{r.label} — {r.recLabel}</div>
          <p style={{ margin:0, fontSize:"12px", color:t.t2, lineHeight:1.7 }}>{r.desc}</p>
        </div>
        <div style={{ marginTop:"10px", padding:"8px 12px", background:"#f9731610", borderRadius:"8px", fontSize:"11px", color:t.t2 }}>
          <strong style={{ color:"#f97316" }}>Dose-response tip:</strong> Low dose epi → β1+β2 dominant (HR↑, vasodilation). High dose → α1 dominant (vasoconstriction). Unlike NE, epinephrine always hits β2 — key in anaphylaxis (bronchodilation + vasoconstriction simultaneously).
        </div>
      </div>
    </div>
  );
}

// ── Phenylephrine: Pure α1 (Gq) ──────────────────────────────────────────────
function PhenylephrineDiagram({ t }) {
  const [activated, setActivated] = useState(false);

  const steps = [
    { label: "Phenyl binds α1",     color: "#ef4444" },
    { label: "Gq activates",        color: "#f59e0b" },
    { label: "PLC ↑",               color: "#f59e0b" },
    { label: "IP3 + DAG",           color: "#f59e0b" },
    { label: "Ca²⁺ ↑ / PKC ↑",     color: "#f59e0b" },
    { label: "Vasoconstriction ↑SVR ↑MAP", color: "#ef4444" },
    { label: "Reflex bradycardia",  color: "#64748b" },
  ];

  return (
    <div style={{ borderRadius:"10px", overflow:"hidden", border:"1px solid #ef444440" }}>
      <div style={{ background:t.bgH, padding:"10px 14px", borderBottom:`1px solid ${t.bd}` }}>
        <span style={{ fontSize:"12px", color:"#ef4444", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>
          &#9654; Phenylephrine &mdash; Pure &#945;1-Agonist (Gq)
        </span>
      </div>
      <div style={{ background:t.bgH }}>
        <GpcrSVG t={t} drugAbbr="PE" drugColor="#ef4444"
          gpType="Gq" gpColor="#f59e0b" recLabel="α1-Adrenoceptor (pure)" activated={activated}/>
      </div>
      {activated && <CascadeFlow steps={steps} t={t}/>}
      <div style={{ padding:"12px 14px", background:t.bgC, borderTop:`1px solid ${t.bd}` }}>
        <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
          <button onClick={() => setActivated(a => !a)}
            style={{ padding:"7px 16px", borderRadius:"8px", border:"2px solid #f59e0b",
              background: activated ? "#f59e0b" : "transparent", color: activated ? "#fff" : "#f59e0b",
              fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
            {activated ? "✓ Cascade Active" : "Activate Gq Cascade"}
          </button>
          <button onClick={() => setActivated(false)}
            style={{ padding:"7px 12px", borderRadius:"8px", border:`1px solid ${t.bd}`,
              background:t.bgH, color:t.tM, fontSize:"12px", cursor:"pointer" }}>Reset</button>
        </div>
        <div style={{ padding:"10px 14px", background:t.bgH, borderRadius:"8px", borderLeft:"4px solid #ef4444" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:"#ef4444", marginBottom:"4px" }}>Pure α1 Agonist — No β Activity</div>
          <p style={{ margin:0, fontSize:"12px", color:t.t2, lineHeight:1.7 }}>
            Phenylephrine is a selective α1 agonist with essentially no β-receptor activity. Gq → PLC → IP3/DAG → Ca²⁺ → MLCK → vasoconstriction. SVR↑, MAP↑. Because there is no direct cardiac stimulation, the BP rise triggers baroreceptor-mediated reflex bradycardia via vagal activation. This makes phenylephrine the vasopressor of choice when tachycardia must be avoided (e.g., post-CABG, neuraxial anesthesia hypotension, obstructive cardiomyopathy).
          </p>
        </div>
        <div style={{ marginTop:"10px", padding:"8px 12px", background:"#ef444410", borderRadius:"8px", fontSize:"11px", color:t.t2 }}>
          <strong style={{ color:"#ef4444" }}>vs Epinephrine:</strong> Epi adds β1 (tachycardia) + β2 (bronchodilation). Phenylephrine produces clean vasoconstriction without tachycardia. In neuraxial hypotension, phenylephrine is first-line; ephedrine reserved for bradycardia + hypotension.
        </div>
      </div>
    </div>
  );
}

// ── Atropine: M2 Muscarinic Antagonist (Gi blockade) ────────────────────────
function AtropineDiagram({ t }) {
  const [mode, setMode] = useState("normal");
  const [activated, setActivated] = useState(false);

  const modes = {
    normal: {
      label: "Normal M2 (ACh)",
      drugAbbr: "ACh",
      drugColor: "#22c55e",
      gpType: "Gi", gpColor: "#ef4444",
      recLabel: "M2 Muscarinic Receptor",
      steps: [
        { label: "ACh binds M2",      color: "#22c55e" },
        { label: "Gi activates",      color: "#ef4444" },
        { label: "AC ↓",              color: "#ef4444" },
        { label: "cAMP ↓",            color: "#ef4444" },
        { label: "IKACh K⁺ ↑",        color: "#22c55e" },
        { label: "SA/AV node hyperpolarized → HR ↓", color: "#ef4444" },
      ],
      desc: "Normally, vagal ACh activates M2 (Gi-coupled) on SA and AV nodes. Gi inhibits adenylyl cyclase (cAMP↓) AND directly opens IKACh (inward-rectifier K⁺ channels via βγ subunits) → hyperpolarization → HR↓, AV conduction↓. This is the physiologic basis of vagal bradycardia.",
    },
    blocked: {
      label: "Atropine Blocks M2",
      drugAbbr: "ATR",
      drugColor: "#f59e0b",
      gpType: "Gi", gpColor: "#64748b",
      recLabel: "M2 Receptor (BLOCKED)",
      steps: [
        { label: "Atropine binds M2", color: "#f59e0b" },
        { label: "Competitive antagonist", color: "#f59e0b" },
        { label: "Gi NOT activated",  color: "#64748b" },
        { label: "AC uninhibited",    color: "#22c55e" },
        { label: "cAMP maintained ↑", color: "#22c55e" },
        { label: "IKACh K⁺ blocked", color: "#22c55e" },
        { label: "HR ↑ / AV conduction ↑", color: "#f59e0b" },
      ],
      desc: "Atropine competitively antagonizes ACh at M2 receptors. By blocking Gi coupling, it relieves vagal tone: cAMP rises (uninhibited AC), IKACh channels close → SA node firing rate increases (chronotropy), AV nodal conduction speeds. Clinical doses 0.4–1 mg IV. At low doses (< 0.4 mg), paradoxical bradycardia can occur from central vagal stimulation.",
    },
  };

  const m = modes[mode];

  return (
    <div style={{ borderRadius:"10px", overflow:"hidden", border:"1px solid #f59e0b40" }}>
      <div style={{ background:t.bgH, padding:"10px 14px", borderBottom:`1px solid ${t.bd}`,
        display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", alignItems:"center" }}>
        <span style={{ fontSize:"12px", color:"#f59e0b", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>
          &#9654; Atropine &mdash; M2 Muscarinic Antagonist
        </span>
        <div style={{ display:"flex", gap:"6px" }}>
          {Object.entries(modes).map(([k, v]) => (
            <button key={k} onClick={() => { setMode(k); setActivated(false); }}
              style={{ padding:"4px 10px", borderRadius:"6px", border:`2px solid ${mode===k ? v.drugColor : t.bd}`,
                background: mode===k ? `${v.drugColor}18` : t.bgC, color: mode===k ? v.drugColor : t.tM,
                fontSize:"11px", fontWeight: mode===k ? 700 : 400, cursor:"pointer" }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background:t.bgH }}>
        <GpcrSVG t={t} drugAbbr={m.drugAbbr} drugColor={m.drugColor}
          gpType={m.gpType} gpColor={m.gpColor} recLabel={m.recLabel} activated={activated}/>
      </div>
      {activated && <CascadeFlow steps={m.steps} t={t}/>}
      <div style={{ padding:"12px 14px", background:t.bgC, borderTop:`1px solid ${t.bd}` }}>
        <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
          <button onClick={() => setActivated(a => !a)}
            style={{ padding:"7px 16px", borderRadius:"8px", border:`2px solid ${m.drugColor}`,
              background: activated ? m.drugColor : "transparent", color: activated ? "#fff" : m.drugColor,
              fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
            {activated ? "✓ Pathway Active" : "Show Pathway"}
          </button>
          <button onClick={() => setActivated(false)}
            style={{ padding:"7px 12px", borderRadius:"8px", border:`1px solid ${t.bd}`,
              background:t.bgH, color:t.tM, fontSize:"12px", cursor:"pointer" }}>Reset</button>
        </div>
        <div style={{ padding:"10px 14px", background:t.bgH, borderRadius:"8px", borderLeft:`4px solid ${m.drugColor}` }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:m.drugColor, marginBottom:"4px" }}>{m.label}</div>
          <p style={{ margin:0, fontSize:"12px", color:t.t2, lineHeight:1.7 }}>{m.desc}</p>
        </div>
      </div>
    </div>
  );
}

// ── Glycopyrrolate: M1 / M2 / M3 Antagonist (quaternary) ────────────────────
function GlycopyrrolateDiagram({ t }) {
  const [rec, setRec] = useState("m2");
  const [activated, setActivated] = useState(false);

  const recs = {
    m1: {
      label: "M1 (Gq)",
      recLabel: "M1 Muscarinic Receptor",
      drugColor: "#8b5cf6",
      gpType: "Gq", gpColor: "#f59e0b",
      steps: [
        { label: "Glyco blocks M1",    color: "#8b5cf6" },
        { label: "Gq NOT activated",   color: "#64748b" },
        { label: "PLC NOT activated",  color: "#64748b" },
        { label: "IP3/DAG blocked",    color: "#64748b" },
        { label: "Gastric acid ↓", color: "#8b5cf6" },
      ],
      desc: "M1 receptors are Gq-coupled and mediate gastric acid secretion and CNS cholinergic transmission. Glycopyrrolate blocks M1, reducing gastric acid production. Because glycopyrrolate is a QUATERNARY ammonium compound, it does NOT cross the blood-brain barrier — no CNS antimuscarinic effects (no confusion, no delirium, unlike atropine).",
    },
    m2: {
      label: "M2 (Gi)",
      recLabel: "M2 Muscarinic Receptor",
      drugColor: "#8b5cf6",
      gpType: "Gi", gpColor: "#ef4444",
      steps: [
        { label: "Glyco blocks M2",    color: "#8b5cf6" },
        { label: "Gi NOT activated",   color: "#64748b" },
        { label: "AC maintained",      color: "#22c55e" },
        { label: "cAMP ↑",             color: "#22c55e" },
        { label: "IKACh K⁺ blocked",   color: "#22c55e" },
        { label: "HR ↑ / Prevents neostigmine bradycardia", color: "#8b5cf6" },
      ],
      desc: "M2 on SA/AV nodes — primary cardiac target. Glycopyrrolate blocks vagal bradycardia. In NMB reversal, neostigmine causes muscarinic side effects (bradycardia, bronchospasm, hypersalivation). Glycopyrrolate is given 0.2 mg per 1 mg neostigmine to counteract these. Its slower onset (2–3 min) better matches neostigmine's onset than atropine's faster onset.",
    },
    m3: {
      label: "M3 (Gq)",
      recLabel: "M3 Muscarinic Receptor",
      drugColor: "#8b5cf6",
      gpType: "Gq", gpColor: "#f59e0b",
      steps: [
        { label: "Glyco blocks M3",    color: "#8b5cf6" },
        { label: "Gq NOT activated",   color: "#64748b" },
        { label: "PLC NOT activated",  color: "#64748b" },
        { label: "Secretions ↓",       color: "#8b5cf6" },
        { label: "Bronchospasm ↓",     color: "#8b5cf6" },
        { label: "GI motility ↓",      color: "#8b5cf6" },
      ],
      desc: "M3 receptors are Gq-coupled on exocrine glands (salivary, bronchial, GI) and smooth muscle. Activation → PLC → IP3/DAG → Ca²⁺ → secretion and smooth muscle contraction. Glycopyrrolate blocks M3 → dry mouth, reduced airway secretions (useful pre-op), ↓GI motility. M3 block reduces neostigmine-induced bronchospasm and hypersalivation.",
    },
  };

  const r = recs[rec];

  return (
    <div style={{ borderRadius:"10px", overflow:"hidden", border:"1px solid #8b5cf640" }}>
      <div style={{ background:t.bgH, padding:"10px 14px", borderBottom:`1px solid ${t.bd}`,
        display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", alignItems:"center" }}>
        <span style={{ fontSize:"12px", color:"#8b5cf6", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>
          &#9654; Glycopyrrolate &mdash; M1 / M2 / M3 Antagonist (Quaternary)
        </span>
        <div style={{ display:"flex", gap:"6px" }}>
          {Object.entries(recs).map(([k, v]) => (
            <button key={k} onClick={() => { setRec(k); setActivated(false); }}
              style={{ padding:"4px 10px", borderRadius:"6px", border:`2px solid ${rec===k ? "#8b5cf6" : t.bd}`,
                background: rec===k ? "#8b5cf618" : t.bgC, color: rec===k ? "#8b5cf6" : t.tM,
                fontSize:"11px", fontWeight: rec===k ? 700 : 400, cursor:"pointer" }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background:t.bgH }}>
        <GpcrSVG t={t} drugAbbr="GLYCO" drugColor={r.drugColor}
          gpType={r.gpType} gpColor={r.gpColor} recLabel={r.recLabel} activated={activated}/>
      </div>
      {activated && <CascadeFlow steps={r.steps} t={t}/>}
      <div style={{ padding:"12px 14px", background:t.bgC, borderTop:`1px solid ${t.bd}` }}>
        <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
          <button onClick={() => setActivated(a => !a)}
            style={{ padding:"7px 16px", borderRadius:"8px", border:"2px solid #8b5cf6",
              background: activated ? "#8b5cf6" : "transparent", color: activated ? "#fff" : "#8b5cf6",
              fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
            {activated ? "✓ Pathway Active" : "Show Block Pathway"}
          </button>
          <button onClick={() => setActivated(false)}
            style={{ padding:"7px 12px", borderRadius:"8px", border:`1px solid ${t.bd}`,
              background:t.bgH, color:t.tM, fontSize:"12px", cursor:"pointer" }}>Reset</button>
        </div>
        <div style={{ padding:"10px 14px", background:t.bgH, borderRadius:"8px", borderLeft:"4px solid #8b5cf6" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:"#8b5cf6", marginBottom:"4px" }}>{r.label} — {r.recLabel}</div>
          <p style={{ margin:0, fontSize:"12px", color:t.t2, lineHeight:1.7 }}>{r.desc}</p>
        </div>
        <div style={{ marginTop:"10px", padding:"8px 12px", background:"#8b5cf610", borderRadius:"8px", fontSize:"11px", color:t.t2 }}>
          <strong style={{ color:"#8b5cf6" }}>Key distinction from atropine:</strong> Glycopyrrolate is quaternary → cannot cross blood-brain barrier → no CNS side effects. Preferred when avoiding confusion/delirium is important. Also longer duration (4–8 hr vs atropine 1–2 hr).
        </div>
      </div>
    </div>
  );
}

// ── Labetalol: α1 + β1/β2 Antagonist ────────────────────────────────────────
function LabetalolDiagram({ t }) {
  const [rec, setRec] = useState("a1");
  const [activated, setActivated] = useState(false);

  const recs = {
    a1: {
      label: "α1 Block (Gq blocked)",
      recLabel: "α1-Adrenoceptor (BLOCKED)",
      drugColor: "#3b82f6",
      gpType: "Gq", gpColor: "#64748b",
      steps: [
        { label: "Labetalol blocks α1", color: "#3b82f6" },
        { label: "Gq NOT activated",    color: "#64748b" },
        { label: "PLC NOT activated",   color: "#64748b" },
        { label: "No IP3/DAG/Ca²⁺",    color: "#64748b" },
        { label: "Vasodilation ↑",      color: "#3b82f6" },
        { label: "SVR ↓ → BP ↓",        color: "#3b82f6" },
      ],
      desc: "α1 block prevents catecholamine-mediated vasoconstriction → vasodilation → SVR↓. IV labetalol has an α:β ratio of approximately 1:7 (IV) — meaning β-blockade is the dominant mechanism IV, with α1 block providing additional vasodilation. This prevents the reflex tachycardia that would otherwise occur with pure vasodilators (like hydralazine).",
    },
    b1: {
      label: "β1 Block (Gs blocked)",
      recLabel: "β1-Adrenoceptor (BLOCKED)",
      drugColor: "#3b82f6",
      gpType: "Gs", gpColor: "#64748b",
      steps: [
        { label: "Labetalol blocks β1",  color: "#3b82f6" },
        { label: "Gs NOT activated",     color: "#64748b" },
        { label: "AC NOT activated",     color: "#64748b" },
        { label: "cAMP maintained low",  color: "#64748b" },
        { label: "PKA ↓",               color: "#64748b" },
        { label: "HR ↓ / Contractility ↓ → CO ↓", color: "#3b82f6" },
      ],
      desc: "β1 blockade reduces SA node automaticity (HR↓) and myocardial contractility. Combined with α1 block, this prevents reflex tachycardia from the vasodilation — the net effect is BP↓ with minimal or no change in HR. This is the hemodynamic profile that makes labetalol ideal for hypertensive emergencies, pheochromocytoma, and aortic dissection.",
    },
    b2: {
      label: "β2 Block (risk)",
      recLabel: "β2-Adrenoceptor (BLOCKED)",
      drugColor: "#ef4444",
      gpType: "Gs", gpColor: "#64748b",
      steps: [
        { label: "Labetalol blocks β2",  color: "#ef4444" },
        { label: "Gs NOT activated",     color: "#64748b" },
        { label: "No cAMP in smooth muscle", color: "#64748b" },
        { label: "Bronchospasm risk ↑",  color: "#ef4444" },
        { label: "Peripheral vasoconstriction ↑", color: "#ef4444" },
      ],
      desc: "β2 block is the primary adverse effect of labetalol. β2 on bronchial smooth muscle normally maintains bronchodilation — block can precipitate bronchospasm in reactive airway disease. β2 also promotes vasodilation in skeletal muscle; blocking it can worsen peripheral vascular disease. CONTRAINDICATED in bronchospastic disease. Use with caution in COPD, asthma.",
    },
  };

  const r = recs[rec];

  return (
    <div style={{ borderRadius:"10px", overflow:"hidden", border:"1px solid #3b82f640" }}>
      <div style={{ background:t.bgH, padding:"10px 14px", borderBottom:`1px solid ${t.bd}`,
        display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"8px", alignItems:"center" }}>
        <span style={{ fontSize:"12px", color:"#3b82f6", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>
          &#9654; Labetalol &mdash; &#945;1 + &#946;1/&#946;2 Antagonist (IV &#945;:&#946; = 1:7)
        </span>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {Object.entries(recs).map(([k, v]) => (
            <button key={k} onClick={() => { setRec(k); setActivated(false); }}
              style={{ padding:"4px 10px", borderRadius:"6px", border:`2px solid ${rec===k ? v.drugColor : t.bd}`,
                background: rec===k ? `${v.drugColor}18` : t.bgC, color: rec===k ? v.drugColor : t.tM,
                fontSize:"11px", fontWeight: rec===k ? 700 : 400, cursor:"pointer" }}>
              {v.label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ background:t.bgH }}>
        <GpcrSVG t={t} drugAbbr="LAB" drugColor={r.drugColor}
          gpType={r.gpType} gpColor={r.gpColor} recLabel={r.recLabel} activated={activated}/>
      </div>
      {activated && <CascadeFlow steps={r.steps} t={t}/>}
      <div style={{ padding:"12px 14px", background:t.bgC, borderTop:`1px solid ${t.bd}` }}>
        <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
          <button onClick={() => setActivated(a => !a)}
            style={{ padding:"7px 16px", borderRadius:"8px", border:`2px solid ${r.drugColor}`,
              background: activated ? r.drugColor : "transparent", color: activated ? "#fff" : r.drugColor,
              fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
            {activated ? "✓ Block Active" : "Show Receptor Block"}
          </button>
          <button onClick={() => setActivated(false)}
            style={{ padding:"7px 12px", borderRadius:"8px", border:`1px solid ${t.bd}`,
              background:t.bgH, color:t.tM, fontSize:"12px", cursor:"pointer" }}>Reset</button>
        </div>
        <div style={{ padding:"10px 14px", background:t.bgH, borderRadius:"8px", borderLeft:`4px solid ${r.drugColor}` }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:r.drugColor, marginBottom:"4px" }}>{r.label}</div>
          <p style={{ margin:0, fontSize:"12px", color:t.t2, lineHeight:1.7 }}>{r.desc}</p>
        </div>
      </div>
    </div>
  );
}

// ── Hydralazine: Direct Arteriolar Vasodilation ───────────────────────────────
function HydralazineDiagram({ t }) {
  const [activated, setActivated] = useState(false);

  const steps = [
    { label: "Hydralazine enters VSMC", color: "#10b981" },
    { label: "K⁺ channel opening (KATP)", color: "#10b981" },
    { label: "Membrane hyperpolarization", color: "#10b981" },
    { label: "VGCC Ca²⁺ ↓",              color: "#3b82f6" },
    { label: "MLCK activity ↓",           color: "#10b981" },
    { label: "Myosin dephosphorylation",  color: "#10b981" },
    { label: "Arteriolar relaxation → SVR ↓ → BP ↓", color: "#10b981" },
  ];

  return (
    <div style={{ borderRadius:"10px", overflow:"hidden", border:"1px solid #10b98140" }}>
      <div style={{ background:t.bgH, padding:"10px 14px", borderBottom:`1px solid ${t.bd}` }}>
        <span style={{ fontSize:"12px", color:"#10b981", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>
          &#9654; Hydralazine &mdash; Direct Arteriolar Vasodilation
        </span>
      </div>
      {/* Non-GPCR note */}
      <div style={{ margin:"0", padding:"8px 14px", background:"#10b98110", borderBottom:`1px solid #10b98130`,
        fontSize:"11px", color:"#10b981" }}>
        Note: Hydralazine acts DIRECTLY on vascular smooth muscle cells (VSMC) — not via a classical GPCR cascade. Exact molecular target not fully established.
      </div>
      <div style={{ background:t.bgH }}>
        {/* Custom SVG for direct smooth muscle action */}
        <svg viewBox="0 0 600 210" width="100%" style={{ display:"block", minWidth:"340px" }}>
          {/* Smooth muscle cell */}
          <rect x="80" y="50" width="440" height="120" rx="16"
            fill={`#10b98108`} stroke="#10b981" strokeWidth="1.8"/>
          <text x="300" y="72" fill="#10b981" fontSize="11" textAnchor="middle" fontWeight="700">Vascular Smooth Muscle Cell (VSMC)</text>

          {/* Drug molecule entering */}
          <circle cx="140" cy="110" r="24" fill={activated ? "#10b98130" : "#10b98118"} stroke="#10b981" strokeWidth={activated ? "2.5" : "1.8"}/>
          <text x="140" y="107" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="700">HYD</text>
          <text x="140" y="119" fill="#10b981" fontSize="7" textAnchor="middle">{activated ? "Inside" : "enters"}</text>

          {/* KATP channel */}
          <rect x="220" y="88" width="64" height="44" rx="8" fill={activated ? "#10b98120" : `${t.bgC}`} stroke="#10b981" strokeWidth="1.5"/>
          <text x="252" y="109" fill="#10b981" fontSize="9" textAnchor="middle" fontWeight="700">K&#7504;</text>
          <text x="252" y="122" fill="#10b981" fontSize="8" textAnchor="middle">channel</text>
          {activated && <text x="252" y="145" fill="#10b981" fontSize="8" textAnchor="middle">K&#8314; out &#8595;</text>}

          {/* VGCC */}
          <rect x="326" y="88" width="64" height="44" rx="8" fill={activated ? "#3b82f620" : t.bgC} stroke="#3b82f6" strokeWidth="1.5"/>
          <text x="358" y="109" fill="#3b82f6" fontSize="9" textAnchor="middle" fontWeight="700">VGCC</text>
          <text x="358" y="122" fill="#3b82f6" fontSize="8" textAnchor="middle">Ca&#178;&#8314; channel</text>
          {activated && <text x="358" y="145" fill="#3b82f6" fontSize="8" textAnchor="middle">Ca&#178;&#8314; &#8595;</text>}

          {/* MLCK */}
          <rect x="432" y="88" width="64" height="44" rx="8" fill={activated ? "#64748b20" : t.bgC} stroke="#64748b" strokeWidth="1.5"/>
          <text x="464" y="109" fill="#64748b" fontSize="9" textAnchor="middle" fontWeight="700">MLCK</text>
          <text x="464" y="122" fill="#64748b" fontSize="8" textAnchor="middle">↓ activity</text>

          {/* Arrows between elements */}
          {activated && (
            <>
              <line x1="164" y1="110" x2="218" y2="110" stroke="#10b981" strokeWidth="1.8" strokeDasharray="4,2"/>
              <line x1="284" y1="110" x2="324" y2="110" stroke="#3b82f6" strokeWidth="1.8" strokeDasharray="4,2"/>
              <line x1="390" y1="110" x2="430" y2="110" stroke="#64748b" strokeWidth="1.8" strokeDasharray="4,2"/>
            </>
          )}

          {/* Net effect label */}
          <text x="300" y="190" fill={activated ? "#10b981" : t.tM} fontSize="10" textAnchor="middle" fontWeight={activated ? "700" : "400"}>
            {activated ? "Net: Arteriolar relaxation → SVR ↓ → MAP ↓ (venous side spared)" : "Click Activate to show mechanism"}
          </text>
        </svg>
      </div>
      {activated && <CascadeFlow steps={steps} t={t}/>}
      <div style={{ padding:"12px 14px", background:t.bgC, borderTop:`1px solid ${t.bd}` }}>
        <div style={{ display:"flex", gap:"8px", marginBottom:"12px" }}>
          <button onClick={() => setActivated(a => !a)}
            style={{ padding:"7px 16px", borderRadius:"8px", border:"2px solid #10b981",
              background: activated ? "#10b981" : "transparent", color: activated ? "#fff" : "#10b981",
              fontSize:"12px", fontWeight:700, cursor:"pointer" }}>
            {activated ? "✓ Mechanism Active" : "Show Mechanism"}
          </button>
          <button onClick={() => setActivated(false)}
            style={{ padding:"7px 12px", borderRadius:"8px", border:`1px solid ${t.bd}`,
              background:t.bgH, color:t.tM, fontSize:"12px", cursor:"pointer" }}>Reset</button>
        </div>
        <div style={{ padding:"10px 14px", background:t.bgH, borderRadius:"8px", borderLeft:"4px solid #10b981" }}>
          <div style={{ fontSize:"11px", fontWeight:700, color:"#10b981", marginBottom:"4px" }}>Mechanism — Direct Arteriolar Action</div>
          <p style={{ margin:0, fontSize:"12px", color:t.t2, lineHeight:1.7 }}>
            Hydralazine acts directly on arteriolar smooth muscle cells. The precise molecular target remains incompletely understood but the dominant mechanism appears to be opening of ATP-sensitive K⁺ channels (KATP) → K⁺ efflux → membrane hyperpolarization → voltage-gated Ca²⁺ channel (VGCC) closure → intracellular Ca²⁺↓ → MLCK activity↓ → myosin dephosphorylation → smooth muscle relaxation → arteriolar vasodilation. Hydralazine is SELECTIVE for arterioles (spares veins) → no significant preload reduction. This raises CO via afterload reduction and triggers reflex tachycardia (baroreceptor) — typically co-administered with a β-blocker or given in heart failure where the reflex is blunted.
          </p>
        </div>
        <div style={{ marginTop:"10px", padding:"8px 12px", background:"#ef444410", borderRadius:"8px", fontSize:"11px", color:t.t2 }}>
          <strong style={{ color:"#ef4444" }}>Reflex tachycardia warning:</strong> SVR↓ → baroreceptor activation → sympathetic surge → HR↑. In hypertensive emergencies, this can worsen myocardial oxygen demand. Pair with labetalol or metoprolol to blunt reflex. Avoid in aortic dissection (reflex tachycardia increases shear stress).
        </div>
      </div>
    </div>
  );
}


// ── Etomidate: GABA-A at β-subunit TM1/3 ─────────────────────────────────────
function EtomitateDiagram({ t }) {
  const [state, setState] = useState("resting");
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(v => (v + 1) % 120), 50);
    return () => clearInterval(id);
  }, []);

  const states = [
    { id: "resting", label: "Resting",               color: "#64748b" },
    { id: "gaba",    label: "GABA Alone",             color: "#22c55e" },
    { id: "etom",    label: "Etomidate Potentiation", color: "#8b5cf6" },
  ];
  const cur = states.find(s => s.id === state);
  const poreOpen = state !== "resting";
  const poreW = state === "resting" ? 5 : state === "gaba" ? 14 : 22;
  const vm = state === "resting" ? "-70 mV" : state === "gaba" ? "-82 mV" : "-93 mV";

  const ions = Array.from({ length: 6 }, (_, i) => {
    const prog = ((tick / 120) + i / 6) % 1;
    return { x: 280 + (Math.sin(tick / 20 + i) * 2), y: 105 + prog * 190, op: poreOpen ? (0.4 + 0.5 * Math.sin(prog * Math.PI)) : 0 };
  });

  // Pentamer: 2 alpha, 2 beta, 1 gamma arranged around central pore
  const subData = [
    { angle: -90, label: "α1", fill: "#3b82f6" },
    { angle: -18, label: "β2", fill: "#8b5cf6" },
    { angle:  54, label: "γ2", fill: "#10b981" },
    { angle: 126, label: "β2", fill: "#8b5cf6" },
    { angle: 198, label: "α1", fill: "#3b82f6" },
  ];
  const r = 60, cx = 280, cy = 195;

  return (
    <div style={{ borderRadius:"10px", overflow:"hidden", border:"1px solid #8b5cf640" }}>
      <div style={{ background:t.bgH, padding:"10px 14px", borderBottom:`1px solid ${t.bd}` }}>
        <span style={{ fontSize:"12px", color:"#8b5cf6", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>
          &#9654; Etomidate &mdash; GABA-A Receptor (&#946;-subunit TM1/3 site)
        </span>
      </div>
      <div style={{ display:"flex", gap:"6px", padding:"10px 14px", background:t.bgH, borderBottom:`1px solid ${t.bd}`, flexWrap:"wrap" }}>
        {states.map(s => (
          <button key={s.id} onClick={() => setState(s.id)}
            style={{ padding:"5px 12px", borderRadius:"6px", border:`2px solid ${state===s.id ? s.color : t.bd}`,
              background: state===s.id ? `${s.color}18` : t.bgC, color: state===s.id ? s.color : t.tM,
              fontSize:"11px", fontWeight: state===s.id ? 700 : 400, cursor:"pointer" }}>
            {s.label}
          </button>
        ))}
      </div>
      <div style={{ background:t.bgH }}>
        <svg viewBox="0 0 560 370" width="100%" style={{ display:"block", minWidth:"340px" }}>
          {/* Extracellular / membrane / intracellular labels */}
          <text x="16" y="90" fill={t.tM} fontSize="9">Extracellular</text>
          <rect x="0" y="142" width="560" height="106" fill={`${t.bgC}bb`}/>
          <rect x="0" y="142" width="560" height="7"  fill="#94a3b820"/>
          <rect x="0" y="241" width="560" height="7"  fill="#94a3b820"/>
          <text x="16" y="202" fill={t.tM} fontSize="9" fontWeight="600">MEMBRANE</text>
          <text x="16" y="270" fill={t.tM} fontSize="9">Intracellular</text>

          {/* Pentameric subunits */}
          {subData.map((su, i) => {
            const rad = su.angle * Math.PI / 180;
            const sx = cx + r * Math.cos(rad), sy = cy + r * Math.sin(rad);
            return (
              <g key={i}>
                <ellipse cx={sx} cy={sy} rx="25" ry="38" fill={`${su.fill}20`} stroke={su.fill} strokeWidth="2"/>
                <text x={sx} y={sy - 4} fill={su.fill} fontSize="12" textAnchor="middle" fontWeight="800">{su.label}</text>
                <text x={sx} y={sy + 11} fill={su.fill} fontSize="8" textAnchor="middle">sub</text>
              </g>
            );
          })}

          {/* Central Cl- pore */}
          <ellipse cx={cx} cy={cy} rx={poreW} ry="38"
            fill={poreOpen ? "#06b6d420" : "#64748b10"}
            stroke={poreOpen ? "#06b6d4" : "#64748b"} strokeWidth="2.5"/>
          <text x={cx} y={cy + 4} fill={poreOpen ? "#06b6d4" : "#64748b"} fontSize="8" textAnchor="middle" fontWeight="700">Cl&#8315;</text>

          {/* Flowing Cl- ions */}
          {ions.map((ion, i) => (
            <circle key={i} cx={ion.x} cy={ion.y} r="6"
              fill="#06b6d430" stroke="#06b6d4" strokeWidth="1.5" opacity={ion.op}/>
          ))}
          {poreOpen && (
            <text x={cx + 30} y={cy - 20} fill="#06b6d4" fontSize="10" fontWeight="700">Cl&#8315; influx &#8595;</text>
          )}

          {/* GABA binding indicators — extracellular alpha-beta interface */}
          {(state === "gaba" || state === "etom") && [{ ax: -54 }, { ax: 162 }].map((s, i) => {
            const rad = s.ax * Math.PI / 180;
            const bx = cx + (r + 14) * Math.cos(rad);
            const by = cy - 32 + (r + 14) * Math.sin(rad) / 2;
            return (
              <g key={i}>
                <circle cx={bx} cy={by} r="10" fill="#22c55e30" stroke="#22c55e" strokeWidth="1.5"/>
                <text x={bx} y={by + 4} fill="#22c55e" fontSize="8" textAnchor="middle" fontWeight="800">G</text>
              </g>
            );
          })}

          {/* Etomidate binding sites — beta TM1/3 transmembrane */}
          {state === "etom" && [{ ax: -18 }, { ax: 126 }].map((s, i) => {
            const rad = s.ax * Math.PI / 180;
            const bx = cx + (r - 4) * Math.cos(rad);
            const by = cy + (r - 4) * Math.sin(rad);
            return (
              <g key={i}>
                <circle cx={bx} cy={by} r="11"
                  fill="#8b5cf640" stroke="#8b5cf6" strokeWidth="2"
                  opacity={0.7 + 0.3 * Math.sin(tick / 15)}/>
                <text x={bx} y={by + 4} fill="#8b5cf6" fontSize="8" textAnchor="middle" fontWeight="800">Eto</text>
              </g>
            );
          })}

          {/* Vm + state label */}
          <rect x="10" y="308" width="110" height="28" rx="6" fill={t.bgC} stroke={cur.color} strokeWidth="1.5"/>
          <text x="65" y="326" fill={cur.color} fontSize="11" textAnchor="middle" fontWeight="800">Vm {vm}</text>

          {/* Key callout vs propofol */}
          <rect x="380" y="308" width="170" height="50" rx="6" fill={t.bgC} stroke="#8b5cf640" strokeWidth="1"/>
          <text x="390" y="325" fill="#8b5cf6" fontSize="9" fontWeight="700">vs Propofol:</text>
          <text x="390" y="339" fill={t.tM} fontSize="8">Propofol binds &#946;-TM2/3 &#8594; direct gating</text>
          <text x="390" y="352" fill={t.tM} fontSize="8">Etomidate &#946;-TM1/3 &#8594; potentiates only</text>

          {/* Legend */}
          <g transform="translate(10,10)">
            <rect width="210" height="54" rx="6" fill={t.bgC} stroke={`${t.bd}`} strokeWidth="1"/>
            <circle cx="14" cy="16" r="8" fill="#22c55e30" stroke="#22c55e" strokeWidth="1.5"/>
            <text x="14" y="19" fill="#22c55e" fontSize="7" textAnchor="middle" fontWeight="700">G</text>
            <text x="28" y="20" fill={t.tM} fontSize="9">GABA &#8212; &#945;-&#946; interface (extracellular)</text>
            <circle cx="14" cy="36" r="8" fill="#8b5cf640" stroke="#8b5cf6" strokeWidth="1.5"/>
            <text x="14" y="39" fill="#8b5cf6" fontSize="7" textAnchor="middle" fontWeight="700">Eto</text>
            <text x="28" y="40" fill={t.tM} fontSize="9">Etomidate &#8212; &#946;-subunit TM1/3</text>
            <circle cx="14" cy="52" r="5" fill="#06b6d430" stroke="#06b6d4" strokeWidth="1"/>
            <text x="28" y="55" fill={t.tM} fontSize="8">Cl&#8315; ion (influx &#8594; hyperpolarization)</text>
          </g>
        </svg>
      </div>

      {/* Adrenal suppression panel */}
      <div style={{ margin:"0 14px 14px", padding:"12px 14px", background: `#ef444410`, borderRadius:"8px", border:"1px solid #ef444430" }}>
        <div style={{ fontSize:"11px", fontWeight:700, color:"#ef4444", marginBottom:"6px" }}>
          &#9888; Adrenal Suppression &mdash; Key Clinical Warning
        </div>
        <div style={{ fontSize:"12px", color:t.t2, lineHeight:1.7 }}>
          Etomidate inhibits <strong>11&#946;-hydroxylase</strong> (CYP11B1) in the adrenal cortex, blocking the final step of cortisol synthesis (11-deoxycortisol &#8594; cortisol). Even a <em>single induction dose</em> suppresses cortisol production for 6&#8211;24 hours. In septic patients or those with adrenal insufficiency, this is clinically significant. Consider hydrocortisone supplementation if etomidate is used for sepsis intubation.
        </div>
      </div>

      {/* Description */}
      <div style={{ padding:"10px 14px", background:t.bgC, borderTop:`1px solid ${t.bd}`, fontSize:"12px", color:t.t2, lineHeight:1.7 }}>
        {state === "resting" && <p style={{ margin:0 }}>Resting GABA-A: Cl&#8315; pore sealed. No agonist bound. Membrane potential at &#8722;70 mV baseline.</p>}
        {state === "gaba" && <p style={{ margin:0 }}><strong style={{ color:"#22c55e" }}>GABA alone:</strong> Binds &#945;-&#946; interface in extracellular domain &#8594; conformational change &#8594; Cl&#8315; influx &#8594; mild hyperpolarization. Modest increase in channel open probability.</p>}
        {state === "etom" && <p style={{ margin:0 }}><strong style={{ color:"#8b5cf6" }}>Etomidate potentiation:</strong> Binds &#946;-subunit TM1/3 transmembrane region &#8212; a site distinct from propofol (TM2/3) and benzodiazepines (&#945;-&#947; interface). Markedly prolongs channel open duration in the presence of GABA. Unlike propofol, etomidate cannot directly gate the channel without GABA, which contributes to its superior cardiovascular stability and lack of propofol infusion syndrome risk.</p>}
      </div>
    </div>
  );
}

// ── Rocuronium Diagram: NMJ competitive block + sugammadex reversal ───────────
function RocuroniumDiagram({ t }) {
  const [phase, setPhase] = useState("normal");
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(v => (v + 1) % 100), 55);
    return () => clearInterval(id);
  }, []);

  const phases = [
    { id: "normal",   label: "Normal NMJ",         color: "#22c55e" },
    { id: "partial",  label: "Partial Block",       color: "#f59e0b" },
    { id: "full",     label: "Full Block (RSI)",    color: "#ef4444" },
    { id: "suggest",  label: "Sugammadex Reversal", color: "#10b981" },
    { id: "neostig",  label: "Neostigmine Reversal",color: "#3b82f6" },
  ];
  const ph = phases.find(p => p.id === phase);
  const drugColor = "#f59e0b";
  const W = 560, H = 380;
  const nerveY = 50, cleftY = 148, muscleY = 248;
  const vesiclePh = tick / 100;

  const nAChRBlocked = [
    phase === "partial" || phase === "full",
    phase === "partial" || phase === "full",
    phase === "full",
    phase === "full",
  ];
  const nAChROpen = phase === "normal" || phase === "suggest" || phase === "neostig";
  const tofFade = phase === "partial";

  return (
    <div style={{ borderRadius:"10px", overflow:"hidden", border:`1px solid ${drugColor}40` }}>
      <div style={{ background:t.bgH, padding:"10px 14px", borderBottom:`1px solid ${t.bd}` }}>
        <span style={{ fontSize:"12px", color:drugColor, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>
          &#9654; Rocuronium &mdash; Competitive nAChR Antagonist + Dual Reversal
        </span>
      </div>
      <div style={{ display:"flex", gap:"6px", padding:"10px 14px", background:t.bgH, borderBottom:`1px solid ${t.bd}`, flexWrap:"wrap" }}>
        {phases.map(p => (
          <button key={p.id} onClick={() => setPhase(p.id)}
            style={{ padding:"5px 12px", borderRadius:"6px", border:`2px solid ${phase===p.id ? p.color : t.bd}`,
              background: phase===p.id ? `${p.color}18` : t.bgC, color: phase===p.id ? p.color : t.tM,
              fontSize:"11px", fontWeight: phase===p.id ? 700 : 400, cursor:"pointer" }}>
            {p.label}
          </button>
        ))}
      </div>
      <div style={{ background:t.bgH }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display:"block", minWidth:"380px" }}>
          <defs>
            <marker id="rocArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 Z" fill="#f59e0b"/>
            </marker>
          </defs>

          {/* Motor nerve terminal */}
          <rect x="150" y={nerveY} width="260" height="65" rx="12" fill={t.bgC} stroke={t.bd} strokeWidth="1.5"/>
          <text x="280" y={nerveY + 20} fill={t.tx} fontSize="11" textAnchor="middle" fontWeight="700">Motor Nerve Terminal</text>
          <text x="280" y={nerveY + 35} fill={t.tM} fontSize="8" textAnchor="middle">AP &#8594; Ca&#178;&#8314; influx &#8594; ACh exocytosis</text>

          {/* TOF indicator */}
          {tofFade && (
            <g>
              <text x="450" y={nerveY + 20} fill="#f59e0b" fontSize="9" fontWeight="700">TOF FADE</text>
              {[0,1,2,3].map(i => (
                <rect key={i} x={438 + i*14} y={nerveY + 25} width="11" height={14 - i * 3}
                  rx="2" fill={`#f59e0b${Math.round(255 - i*50).toString(16).padStart(2,'0')}`}/>
              ))}
            </g>
          )}

          {/* ACh vesicles */}
          {Array.from({ length: 5 }, (_, i) => {
            const vy = nerveY + 52 + Math.sin(vesiclePh * Math.PI * 2 + i) * 3;
            const vx = 185 + i * 36;
            const released = phase !== "normal" && i <= 2;
            return (
              <g key={i}>
                <circle cx={vx} cy={released ? cleftY - 18 + vesiclePh * 28 : vy} r="9"
                  fill="#22c55e28" stroke="#22c55e" strokeWidth="1.5" opacity={released ? 0.7 : 1}/>
                <text x={vx} y={(released ? cleftY - 18 + vesiclePh * 28 : vy) + 3}
                  fill="#22c55e" fontSize="7" textAnchor="middle" fontWeight="700">ACh</text>
              </g>
            );
          })}

          {/* Synaptic cleft */}
          <text x="14" y={cleftY + 12} fill={t.tM} fontSize="8" fontWeight="600">CLEFT</text>
          <rect x="100" y={cleftY} width="360" height={muscleY - cleftY} fill={t.bgH}/>

          {/* Rocuronium molecules */}
          {(phase === "partial" || phase === "full") && Array.from({ length: phase === "full" ? 5 : 3 }, (_, i) => (
            <g key={i}>
              <circle cx={155 + i * 58} cy={cleftY + 28} r="10"
                fill={`${drugColor}28`} stroke={drugColor} strokeWidth="1.5"/>
              <text x={155 + i * 58} y={cleftY + 32} fill={drugColor} fontSize="7" textAnchor="middle" fontWeight="700">Roc</text>
            </g>
          ))}

          {/* Sugammadex encapsulation animation */}
          {phase === "suggest" && Array.from({ length: 4 }, (_, i) => (
            <g key={i}>
              <circle cx={165 + i * 60} cy={cleftY + 28} r="14"
                fill="#10b98118" stroke="#10b981" strokeWidth="1.5"
                opacity={0.5 + 0.4 * Math.sin(tick / 12 + i)}/>
              <text x={165 + i * 60} y={cleftY + 24} fill="#10b981" fontSize="6" textAnchor="middle" fontWeight="700">&#947;-CD</text>
              <text x={165 + i * 60} y={cleftY + 34} fill="#10b981" fontSize="5" textAnchor="middle">encapsulates</text>
              <text x={165 + i * 60} y={cleftY + 43} fill={drugColor} fontSize="5" textAnchor="middle">Roc</text>
            </g>
          ))}

          {/* Neostigmine: extra ACh in cleft */}
          {phase === "neostig" && Array.from({ length: 5 }, (_, i) => (
            <g key={i}>
              <circle cx={148 + i * 54} cy={cleftY + 45} r="9"
                fill="#3b82f618" stroke="#3b82f6" strokeWidth="1.5"/>
              <text x={148 + i * 54} y={cleftY + 49} fill="#3b82f6" fontSize="6" textAnchor="middle" fontWeight="700">ACh</text>
            </g>
          ))}

          {/* Motor end plate */}
          <rect x="100" y={muscleY} width="360" height="65" rx="8" fill={t.bgC} stroke={t.bd} strokeWidth="1.5"/>
          <text x="280" y={muscleY + 17} fill={t.tx} fontSize="10" textAnchor="middle" fontWeight="700">Motor End Plate</text>

          {/* nAChRs */}
          {[160, 220, 300, 380].map((rx, i) => {
            const blocked = nAChRBlocked[i];
            const open = nAChROpen;
            const col = blocked ? drugColor : (open ? "#22c55e" : t.tM);
            return (
              <g key={i}>
                <rect x={rx - 14} y={muscleY + 24} width="28" height="28" rx="6"
                  fill={blocked ? `${drugColor}18` : (open ? "#22c55e18" : t.bgH)}
                  stroke={col} strokeWidth={blocked ? 2 : 1.5}/>
                <text x={rx} y={muscleY + 38} fill={col} fontSize="8" textAnchor="middle" fontWeight="700">nAChR</text>
                <text x={rx} y={muscleY + 50} fill={col} fontSize="7" textAnchor="middle">
                  {blocked ? "BLOCKED" : (open ? "OPEN" : "closed")}
                </text>
              </g>
            );
          })}

          {/* Ion flow when open */}
          {nAChROpen && (
            <g>
              <line x1="280" y1={muscleY + 52} x2="280" y2={muscleY + 78} stroke="#f59e0b" strokeWidth="2" markerEnd="url(#rocArrow)"/>
              <text x="298" y={muscleY + 70} fill="#f59e0b" fontSize="9">Na&#8314; in</text>
            </g>
          )}

          {/* Status bar */}
          <rect x="100" y="330" width="360" height="30" rx="6" fill={t.bgC} stroke={ph.color} strokeWidth="1.5"/>
          <text x="280" y="349" fill={ph.color} fontSize="10" textAnchor="middle" fontWeight="700">
            {phase === "normal"  ? "Normal NMJ — Full contraction" :
             phase === "partial" ? "Partial block — TOF fade, reduced strength" :
             phase === "full"    ? "Full paralysis — RSI dose (1.2 mg/kg)" :
             phase === "suggest" ? "Sugammadex: 1:1 encapsulation, instant reversal" :
                                   "Neostigmine: ACh excess outcompetes Roc"}
          </text>
        </svg>
      </div>
      <div style={{ padding:"10px 14px", background:t.bgC, borderTop:`1px solid ${t.bd}`, fontSize:"12px", color:t.t2, lineHeight:1.7 }}>
        {phase === "normal"  && <p style={{ margin:0 }}>Normal NMJ: ACh binds both &#945;-subunit sites &#8594; Na&#8314;/K&#8314; flux &#8594; end plate depolarization &#8594; muscle contraction. TOF ratio = 1.0.</p>}
        {phase === "partial" && <p style={{ margin:0 }}><strong style={{ color:drugColor }}>Partial competitive block:</strong> Rocuronium occupies &#945;-subunits on some receptors. Reduced end plate potential. TOF shows characteristic <em>fade</em> (T4 &lt; T3 &lt; T2 &lt; T1) due to presynaptic nAChR blockade reducing ACh mobilization with repeated stimulation.</p>}
        {phase === "full"    && <p style={{ margin:0 }}><strong style={{ color:"#ef4444" }}>Full NMJ block (RSI 1.2 mg/kg):</strong> Rocuronium onset ~60 sec at RSI dose. Low potency (ED95 = 0.3 mg/kg) means high molar dose &#8594; fast NMJ flooding &#8594; fast onset. No fasciculations (no depolarization occurs). Duration 45&#8211;90 min.</p>}
        {phase === "suggest" && <p style={{ margin:0 }}><strong style={{ color:"#10b981" }}>Sugammadex (modified &#947;-cyclodextrin):</strong> Encapsulates rocuronium 1:1 in its hydrophobic core &#8594; renders it pharmacologically inactive &#8594; plasma gradient pulls drug off nAChR &#8594; reversal in 1&#8211;3 min even at full RSI block. Dose: 16 mg/kg for immediate reversal.</p>}
        {phase === "neostig" && <p style={{ margin:0 }}><strong style={{ color:"#3b82f6" }}>Neostigmine reversal:</strong> Inhibits acetylcholinesterase &#8594; ACh accumulates &#8594; mass-action effect outcompetes rocuronium at nAChR &#945;-subunits. Requires TOF count &#8805;2 to be effective. Must co-administer anticholinergic (glycopyrrolate/atropine) to blunt muscarinic side effects.</p>}
      </div>
    </div>
  );
}

// ── Vecuronium Diagram: NMJ block + active metabolite accumulation ────────────
function VecuroniumDiagram({ t }) {
  const [phase, setPhase] = useState("normal");
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(v => (v + 1) % 100), 55);
    return () => clearInterval(id);
  }, []);

  const phases = [
    { id: "normal",   label: "Normal NMJ",           color: "#22c55e" },
    { id: "block",    label: "Vecuronium Block",      color: "#8b5cf6" },
    { id: "icu",      label: "ICU Accumulation",      color: "#ef4444" },
    { id: "suggest",  label: "Sugammadex Reversal",   color: "#10b981" },
  ];
  const ph = phases.find(p => p.id === phase);
  const drugColor = "#8b5cf6";
  const W = 560, H = 380;
  const nerveY = 50, cleftY = 148, muscleY = 248;
  const vesiclePh = tick / 100;
  const nAChROpen = phase === "normal" || phase === "suggest";

  return (
    <div style={{ borderRadius:"10px", overflow:"hidden", border:`1px solid ${drugColor}40` }}>
      <div style={{ background:t.bgH, padding:"10px 14px", borderBottom:`1px solid ${t.bd}` }}>
        <span style={{ fontSize:"12px", color:drugColor, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.5px" }}>
          &#9654; Vecuronium &mdash; Cardiovascular-Neutral NMB + Active Metabolite Risk
        </span>
      </div>
      <div style={{ display:"flex", gap:"6px", padding:"10px 14px", background:t.bgH, borderBottom:`1px solid ${t.bd}`, flexWrap:"wrap" }}>
        {phases.map(p => (
          <button key={p.id} onClick={() => setPhase(p.id)}
            style={{ padding:"5px 12px", borderRadius:"6px", border:`2px solid ${phase===p.id ? p.color : t.bd}`,
              background: phase===p.id ? `${p.color}18` : t.bgC, color: phase===p.id ? p.color : t.tM,
              fontSize:"11px", fontWeight: phase===p.id ? 700 : 400, cursor:"pointer" }}>
            {p.label}
          </button>
        ))}
      </div>
      <div style={{ background:t.bgH }}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display:"block", minWidth:"380px" }}>
          <defs>
            <marker id="vecArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
              <path d="M0,0 L0,6 L6,3 Z" fill="#f59e0b"/>
            </marker>
          </defs>

          {/* Motor nerve — note NO HR/BP effect label */}
          <rect x="120" y={nerveY} width="280" height="65" rx="12" fill={t.bgC} stroke={t.bd} strokeWidth="1.5"/>
          <text x="260" y={nerveY + 20} fill={t.tx} fontSize="11" textAnchor="middle" fontWeight="700">Motor Nerve Terminal</text>
          <text x="260" y={nerveY + 35} fill={t.tM} fontSize="8" textAnchor="middle">AP &#8594; Ca&#178;&#8314; influx &#8594; ACh exocytosis</text>

          {/* Cardiovascular neutral badge */}
          <rect x="430" y={nerveY + 5} width="115" height="40" rx="6" fill="#22c55e10" stroke="#22c55e40" strokeWidth="1"/>
          <text x="487" y={nerveY + 21} fill="#22c55e" fontSize="9" textAnchor="middle" fontWeight="700">CV Neutral</text>
          <text x="487" y={nerveY + 34} fill={t.tM} fontSize="8" textAnchor="middle">No histamine</text>
          <text x="487" y={nerveY + 44} fill={t.tM} fontSize="8" textAnchor="middle">No vagolysis</text>

          {/* ACh vesicles */}
          {Array.from({ length: 5 }, (_, i) => {
            const vy = nerveY + 52 + Math.sin(vesiclePh * Math.PI * 2 + i) * 3;
            const vx = 155 + i * 35;
            const released = phase !== "normal" && i <= 2;
            return (
              <g key={i}>
                <circle cx={vx} cy={released ? cleftY - 18 + vesiclePh * 28 : vy} r="9"
                  fill="#22c55e28" stroke="#22c55e" strokeWidth="1.5" opacity={released ? 0.7 : 1}/>
                <text x={vx} y={(released ? cleftY - 18 + vesiclePh * 28 : vy) + 3}
                  fill="#22c55e" fontSize="7" textAnchor="middle" fontWeight="700">ACh</text>
              </g>
            );
          })}

          {/* Cleft */}
          <text x="14" y={cleftY + 12} fill={t.tM} fontSize="8" fontWeight="600">CLEFT</text>
          <rect x="80" y={cleftY} width="390" height={muscleY - cleftY} fill={t.bgH}/>

          {/* Vecuronium molecules */}
          {(phase === "block") && Array.from({ length: 4 }, (_, i) => (
            <g key={i}>
              <circle cx={130 + i * 65} cy={cleftY + 30} r="10"
                fill={`${drugColor}28`} stroke={drugColor} strokeWidth="1.5"/>
              <text x={130 + i * 65} y={cleftY + 34} fill={drugColor} fontSize="7" textAnchor="middle" fontWeight="700">Vec</text>
            </g>
          ))}

          {/* ICU Accumulation: parent + active metabolite */}
          {phase === "icu" && (<>
            {Array.from({ length: 4 }, (_, i) => (
              <g key={i}>
                <circle cx={120 + i * 68} cy={cleftY + 22} r="10" fill={`${drugColor}28`} stroke={drugColor} strokeWidth="1.5"/>
                <text x={120 + i * 68} y={cleftY + 26} fill={drugColor} fontSize="7" textAnchor="middle" fontWeight="700">Vec</text>
              </g>
            ))}
            {Array.from({ length: 4 }, (_, i) => (
              <g key={i}>
                <circle cx={135 + i * 68} cy={cleftY + 50} r="10" fill="#ef444428" stroke="#ef4444" strokeWidth="1.5"
                  opacity={0.6 + 0.4 * Math.sin(tick / 12 + i)}/>
                <text x={135 + i * 68} y={cleftY + 47} fill="#ef4444" fontSize="5.5" textAnchor="middle" fontWeight="700">3-OH</text>
                <text x={135 + i * 68} y={cleftY + 57} fill="#ef4444" fontSize="5.5" textAnchor="middle">Vec</text>
              </g>
            ))}
            <rect x="10" y={cleftY + 10} width="68" height="52" rx="5" fill="#ef444410" stroke="#ef444440" strokeWidth="1"/>
            <text x="44" y={cleftY + 26} fill="#ef4444" fontSize="8" textAnchor="middle" fontWeight="700">ICU</text>
            <text x="44" y={cleftY + 40} fill="#ef4444" fontSize="7" textAnchor="middle">active</text>
            <text x="44" y={cleftY + 52} fill="#ef4444" fontSize="7" textAnchor="middle">metabolite</text>
          </>)}

          {/* Sugammadex */}
          {phase === "suggest" && Array.from({ length: 4 }, (_, i) => (
            <g key={i}>
              <circle cx={130 + i * 68} cy={cleftY + 28} r="14" fill="#10b98118" stroke="#10b981" strokeWidth="1.5"
                opacity={0.5 + 0.4 * Math.sin(tick / 12 + i)}/>
              <text x={130 + i * 68} y={cleftY + 25} fill="#10b981" fontSize="6" textAnchor="middle" fontWeight="700">&#947;-CD</text>
              <text x={130 + i * 68} y={cleftY + 35} fill="#10b981" fontSize="5" textAnchor="middle">encapsulates Vec</text>
            </g>
          ))}

          {/* Motor end plate */}
          <rect x="80" y={muscleY} width="390" height="65" rx="8" fill={t.bgC} stroke={t.bd} strokeWidth="1.5"/>
          <text x="275" y={muscleY + 17} fill={t.tx} fontSize="10" textAnchor="middle" fontWeight="700">Motor End Plate</text>

          {[155, 220, 295, 370].map((rx, i) => {
            const blocked = phase === "block" || phase === "icu";
            const open = nAChROpen;
            const col = blocked ? drugColor : (open ? "#22c55e" : t.tM);
            return (
              <g key={i}>
                <rect x={rx - 14} y={muscleY + 24} width="28" height="28" rx="6"
                  fill={blocked ? `${drugColor}18` : (open ? "#22c55e18" : t.bgH)}
                  stroke={col} strokeWidth={blocked ? 2 : 1.5}/>
                <text x={rx} y={muscleY + 38} fill={col} fontSize="8" textAnchor="middle" fontWeight="700">nAChR</text>
                <text x={rx} y={muscleY + 50} fill={col} fontSize="7" textAnchor="middle">
                  {blocked ? "BLOCKED" : (open ? "OPEN" : "closed")}
                </text>
              </g>
            );
          })}

          {nAChROpen && (
            <g>
              <line x1="275" y1={muscleY + 52} x2="275" y2={muscleY + 78} stroke="#f59e0b" strokeWidth="2" markerEnd="url(#vecArrow)"/>
              <text x="293" y={muscleY + 70} fill="#f59e0b" fontSize="9">Na&#8314; in</text>
            </g>
          )}

          {/* Status */}
          <rect x="80" y="330" width="390" height="30" rx="6" fill={t.bgC} stroke={ph.color} strokeWidth="1.5"/>
          <text x="275" y="349" fill={ph.color} fontSize="10" textAnchor="middle" fontWeight="700">
            {phase === "normal"  ? "Normal NMJ — full contraction, CV unchanged" :
             phase === "block"   ? "Competitive block — onset 3–5 min, duration 20–60 min" :
             phase === "icu"     ? "ICU: 3-OH metabolite accumulates — prolonged paralysis risk" :
                                   "Sugammadex encapsulates Vec (lower affinity than Roc)"}
          </text>
        </svg>
      </div>
      <div style={{ padding:"10px 14px", background:t.bgC, borderTop:`1px solid ${t.bd}`, fontSize:"12px", color:t.t2, lineHeight:1.7 }}>
        {phase === "normal"  && <p style={{ margin:0 }}>Normal NMJ: No cardiovascular effects from vecuronium &#8212; no histamine release, no vagolysis (M2 antagonism), no sympathetic stimulation. Heart rate and blood pressure unchanged. This is the primary advantage over older agents like pancuronium.</p>}
        {phase === "block"   && <p style={{ margin:0 }}><strong style={{ color:drugColor }}>Competitive nAChR block:</strong> Identical mechanism to rocuronium (&#945;-subunit antagonism) but higher potency (ED95 = 0.05 mg/kg vs. rocuronium 0.3 mg/kg). Higher potency = slower onset (3&#8211;5 min at 0.1 mg/kg) due to fewer molecules reaching the NMJ. Intermediate duration: 20&#8211;60 min.</p>}
        {phase === "icu"     && <p style={{ margin:0 }}><strong style={{ color:"#ef4444" }}>ICU accumulation &#8212; active metabolite danger:</strong> 3-desacetylvecuronium retains 50&#8211;80% of parent activity. In hepatic or renal failure, or with prolonged ICU infusions, this metabolite accumulates and produces paralysis lasting 24&#8211;72+ hours after the drip is stopped. Avoid prolonged vecuronium infusions in critically ill patients. Cisatracurium (Hofmann elimination) is preferred in ICU.</p>}
        {phase === "suggest" && <p style={{ margin:0 }}><strong style={{ color:"#10b981" }}>Sugammadex:</strong> Encapsulates vecuronium within its &#947;-cyclodextrin ring, but with ~10&#215; lower affinity than for rocuronium (steroidal NMBA binding depends on molecular fit). Standard dosing effective, but deeper blocks may need higher doses. Note: sugammadex does NOT encapsulate the 3-OH metabolite as effectively &#8212; clinical monitoring is essential after reversal.</p>}
      </div>
    </div>
  );
}

// ── Receptor Superfamily Reference (shown below med-specific diagram) ─────────
function ReceptorFamilyRef({ medId, t }) {
  return null;
}

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
    s.push({ t: "Warnings", c: item.warn.map(w => `<div class="bx ${w.tp === "bb" ? "bxd" : w.tp === "cau" ? "bxw" : ""}">${w.tp === "bb" ? "<strong>â¬› BLACK BOX — " : "<strong>"}${w.ti}</strong><br/>${w.tx}</div>`).join("") });
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
          <h4 style={{ color: w.tp === "bb" ? t.dg : w.tp === "cau" ? t.wn : t.tx, margin: "0 0 4px", fontSize: "14px" }}>{w.tp === "bb" ? "â¬› BLACK BOX — " : w.tp === "cau" ? " " : " "}{w.ti}</h4>
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
          <NEDiagram t={t} />
        ) : item.id === "propofol" ? (
          <PropofolDiagram t={t} />
        ) : item.id === "cisatracurium" ? (
          <NMJDiagram t={t} drugId="cisatracurium" />
        ) : item.id === "succinylcholine" ? (
          <NMJDiagram t={t} drugId="succinylcholine" />
        ) : item.id === "fentanyl" ? (
          <FentanylDiagram t={t} />
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

          {/* â•â• EXTRACELLULAR SPACE â•â• */}
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

          {/* â•â• NORMAL STATE (Left) â•â• */}
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

          {/* â•â• KETAMINE BLOCKED STATE (Right) â•â• */}
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

          {/* â•â• CLINICAL EFFECTS BOX â•â• */}
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
          <div style={{ padding: "32px", textAlign: "center", background: t.bgH, borderRadius: "10px", border: `1px solid ${t.bd}` }}>
            <div style={{ fontSize: "14px", color: t.tM, fontStyle: "italic" }}>Interactive diagram coming soon for {item.name}</div>
          </div>
        )}
        <ReceptorFamilyRef medId={item.id} t={t} />
      </div>}
    </div>
  </div>;
}


export { MedDetail };
