import React from 'react';

const EtomidateDiagram = ({ svgRef, theme, t }) => {
  return (
    <svg ref={svgRef} viewBox="0 0 900 780" style={{ width: "100%", maxWidth: "900px", background: theme === "dark" ? "#0d1117" : "#f8fafc", borderRadius: "12px", border: `1px solid ${t.bd}` }}>
      {/* Title */}
      <text x="450" y="35" textAnchor="middle" fill="#e2e8f0" fontSize="16" fontWeight="600">Etomidate: Dual Mechanism — GABA-A Receptor & Adrenal 11β-Hydroxylase</text>

      {/* ==================== LEFT PANEL: GABA-A RECEPTOR ==================== */}
      <rect x="20" y="55" width="420" height="30" rx="4" fill="rgba(45, 212, 191, 0.1)" stroke="rgba(45, 212, 191, 0.3)" strokeWidth="1" />
      <text x="230" y="75" textAnchor="middle" fill="#2dd4bf" fontSize="13" fontWeight="600">GABA-A RECEPTOR — CNS (Hypnotic Effect)</text>

      {/* Cell Membrane */}
      <defs>
        <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a3f35" />
          <stop offset="50%" stopColor="#6b5a4a" />
          <stop offset="100%" stopColor="#4a3f35" />
        </linearGradient>
        <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#3b82f6" />
        </marker>
        <marker id="arrowRed" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="#ef4444" />
        </marker>
      </defs>

      <rect x="30" y="250" width="410" height="70" rx="6" fill="url(#memGrad)" opacity="0.7" />
      <text x="45" y="290" fill="#d4a574" fontSize="10" fontWeight="500">CELL MEMBRANE</text>

      {/* Extracellular / Intracellular labels */}
      <text x="395" y="242" fill="#64748b" fontSize="10" fontStyle="italic">Extracellular</text>
      <text x="395" y="338" fill="#64748b" fontSize="10" fontStyle="italic">Intracellular</text>

      {/* GABA-A Receptor - Pentameric structure */}
      {/* Central pore */}
      <rect x="195" y="235" width="70" height="100" rx="4" fill="#1a2744" stroke="#3b82f6" strokeWidth="2" />
      <text x="230" y="290" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="500">Cl⁻</text>
      <text x="230" y="302" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="500">PORE</text>

      {/* α1 subunit - left */}
      <rect x="130" y="245" width="70" height="80" rx="18" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1.5" />
      <text x="165" y="283" textAnchor="middle" fill="#93c5fd" fontSize="14" fontWeight="600">α</text>
      <text x="165" y="298" textAnchor="middle" fill="#7dd3fc" fontSize="9">subunit</text>

      {/* β2 subunit - left front */}
      <rect x="155" y="200" width="70" height="50" rx="18" fill="#2d1f3d" stroke="#a855f7" strokeWidth="1.5" />
      <text x="190" y="226" textAnchor="middle" fill="#c084fc" fontSize="14" fontWeight="600">β₂</text>
      <text x="190" y="240" textAnchor="middle" fill="#d8b4fe" fontSize="9">subunit</text>

      {/* γ subunit - top center */}
      <rect x="227" y="195" width="50" height="45" rx="18" fill="#1a3a2a" stroke="#4ade80" strokeWidth="1.5" />
      <text x="252" y="220" textAnchor="middle" fill="#86efac" fontSize="14" fontWeight="600">γ</text>

      {/* β3 subunit - right front */}
      <rect x="265" y="200" width="70" height="50" rx="18" fill="#2d1f3d" stroke="#a855f7" strokeWidth="1.5" />
      <text x="300" y="226" textAnchor="middle" fill="#c084fc" fontSize="14" fontWeight="600">β₃</text>
      <text x="300" y="240" textAnchor="middle" fill="#d8b4fe" fontSize="9">subunit</text>

      {/* α2 subunit - right */}
      <rect x="270" y="245" width="70" height="80" rx="18" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1.5" />
      <text x="305" y="283" textAnchor="middle" fill="#93c5fd" fontSize="14" fontWeight="600">α</text>
      <text x="305" y="298" textAnchor="middle" fill="#7dd3fc" fontSize="9">subunit</text>

      {/* Etomidate molecule binding to β2 */}
      <circle cx="130" cy="205" r="18" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" />
      <text x="130" y="201" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">ETO</text>
      <text x="130" y="212" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">MID</text>
      <line x1="145" y1="213" x2="160" y2="218" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,3" />

      {/* Etomidate molecule binding to β3 */}
      <circle cx="360" cy="205" r="18" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" />
      <text x="360" y="201" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">ETO</text>
      <text x="360" y="212" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">MID</text>
      <line x1="345" y1="213" x2="330" y2="218" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,3" />

      {/* Binding site label */}
      <line x1="130" y1="188" x2="80" y2="140" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
      <rect x="20" y="126" width="120" height="20" rx="4" fill="#422006" stroke="#f59e0b" strokeWidth="1" />
      <text x="80" y="140" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="500">Etomidate (β TM2 site)</text>

      {/* GABA binding site label */}
      <line x1="145" y1="268" x2="75" y2="160" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3,3" />
      <rect x="25" y="148" width="100" height="20" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
      <text x="75" y="162" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="500">GABA site (α-β)</text>

      {/* R(+) enantiomer note */}
      <rect x="60" y="100" width="120" height="20" rx="4" fill="#052e16" stroke="#10b981" strokeWidth="1" />
      <text x="120" y="114" textAnchor="middle" fill="#34d399" fontSize="9" fontWeight="500">R(+) enantiomer only</text>

      {/* Cl- ions flowing through pore */}
      <circle cx="220" cy="175" r="8" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="220" y="179" textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="600">Cl⁻</text>
      <circle cx="240" cy="160" r="8" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="240" y="164" textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="600">Cl⁻</text>

      {/* Arrow showing Cl- movement into cell */}
      <line x1="230" y1="185" x2="230" y2="355" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowBlue)" />

      {/* Intracellular Cl- */}
      <circle cx="218" cy="370" r="8" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="218" y="374" textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="600">Cl⁻</text>
      <circle cx="245" cy="385" r="8" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="245" y="389" textAnchor="middle" fill="#60a5fa" fontSize="8" fontWeight="600">Cl⁻</text>

      {/* Hyperpolarization box */}
      <rect x="110" y="410" width="240" height="75" rx="8" fill="#0c1a30" stroke="#3b82f6" strokeWidth="1.5" />
      <text x="230" y="432" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="600">HYPERPOLARIZATION</text>
      <text x="230" y="450" textAnchor="middle" fill="#94a3b8" fontSize="10">−70 mV → −85 mV</text>
      <text x="230" y="466" textAnchor="middle" fill="#94a3b8" fontSize="10">→ Further from threshold (−55 mV)</text>
      <text x="230" y="480" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="500">⛔ Action potential BLOCKED</text>

      {/* Clinical outcome */}
      <line x1="230" y1="490" x2="230" y2="515" stroke="#64748b" strokeWidth="1" strokeDasharray="4,3" />
      <rect x="85" y="515" width="290" height="40" rx="8" fill="#14532d" stroke="#22c55e" strokeWidth="1.5" />
      <text x="230" y="533" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="600">CLINICAL EFFECT</text>
      <text x="230" y="548" textAnchor="middle" fill="#bbf7d0" fontSize="10">Sedation → Amnesia → Loss of Consciousness</text>

      {/* Hemodynamic preservation note */}
      <rect x="60" y="570" width="340" height="35" rx="6" fill="rgba(45, 212, 191, 0.08)" stroke="#2dd4bf" strokeWidth="1" strokeDasharray="5,3" />
      <text x="230" y="590" textAnchor="middle" fill="#2dd4bf" fontSize="10" fontWeight="500">★ HR, MAP, CO, SVR, PAP, PVR — UNCHANGED</text>

      {/* ==================== RIGHT PANEL: ADRENAL 11β-HYDROXYLASE ==================== */}
      <rect x="470" y="55" width="410" height="30" rx="4" fill="rgba(239, 68, 68, 0.1)" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1" />
      <text x="675" y="75" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="600">ADRENAL CORTEX — 11β-Hydroxylase Inhibition</text>

      {/* Adrenal cortex zona fasciculata label */}
      <rect x="530" y="100" width="290" height="25" rx="4" fill="#111827" stroke="#1e293b" strokeWidth="1" />
      <text x="675" y="117" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="500">Zona Fasciculata — Cortisol Synthesis Pathway</text>

      {/* Steroidogenesis pathway */}
      {/* Cholesterol */}
      <rect x="605" y="140" width="140" height="35" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
      <text x="675" y="162" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="500">Cholesterol</text>

      <line x1="675" y1="175" x2="675" y2="200" stroke="#64748b" strokeWidth="1.5" />
      <text x="735" y="192" fill="#64748b" fontSize="9">P450scc</text>

      {/* Pregnenolone */}
      <rect x="605" y="200" width="140" height="35" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
      <text x="675" y="222" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="500">Pregnenolone</text>

      <line x1="675" y1="235" x2="675" y2="260" stroke="#64748b" strokeWidth="1.5" />
      <text x="735" y="252" fill="#64748b" fontSize="9">Multiple steps</text>

      {/* 11-Deoxycortisol */}
      <rect x="595" y="260" width="160" height="35" rx="6" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1.5" />
      <text x="675" y="282" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="600">11-Deoxycortisol</text>

      {/* The critical enzyme step */}
      <line x1="675" y1="295" x2="675" y2="340" stroke="#60a5fa" strokeWidth="2" />

      {/* 11β-Hydroxylase enzyme box */}
      <rect x="585" y="340" width="180" height="50" rx="8" fill="#422006" stroke="#f59e0b" strokeWidth="2" />
      <text x="675" y="362" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="700">11β-Hydroxylase</text>
      <text x="675" y="378" textAnchor="middle" fill="#fbbf24" fontSize="9">(CYP11B1)</text>

      {/* Etomidate inhibition - big red X */}
      <circle cx="545" cy="365" r="22" fill="#f59e0b" stroke="#fbbf24" strokeWidth="2" />
      <text x="545" y="361" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">ETO</text>
      <text x="545" y="372" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">MID</text>
      <line x1="562" y1="363" x2="585" y2="363" stroke="#ef4444" strokeWidth="3" />

      {/* Red X / inhibition symbol */}
      <text x="577" y="345" fill="#ef4444" fontSize="20" fontWeight="900">⊗</text>

      {/* Inhibition label */}
      <rect x="490" y="330" width="50" height="18" rx="3" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1" />
      <text x="515" y="343" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="700">BLOCK</text>

      {/* Arrow down from enzyme - blocked */}
      <line x1="675" y1="390" x2="675" y2="420" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />

      {/* Cortisol - blocked/reduced */}
      <rect x="605" y="420" width="140" height="40" rx="6" fill="rgba(239, 68, 68, 0.1)" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,4" />
      <text x="675" y="438" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="600">Cortisol ↓↓↓</text>
      <text x="675" y="454" textAnchor="middle" fill="#fca5a5" fontSize="9">SYNTHESIS BLOCKED</text>

      {/* Downstream consequences */}
      <line x1="675" y1="465" x2="675" y2="490" stroke="#ef4444" strokeWidth="1" strokeDasharray="4,3" />

      <rect x="530" y="490" width="290" height="110" rx="8" fill="rgba(239, 68, 68, 0.06)" stroke="#ef4444" strokeWidth="1" />
      <text x="675" y="512" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="600">CLINICAL CONSEQUENCES</text>
      <line x1="545" y1="520" x2="805" y2="520" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1" />
      <text x="550" y="538" fill="#fca5a5" fontSize="10">• Suppressed stress response (24–72 hrs)</text>
      <text x="550" y="556" fill="#fca5a5" fontSize="10">• ↑ Vasopressor requirements in sepsis</text>
      <text x="550" y="574" fill="#fca5a5" fontSize="10">• ↓ Mineralocorticoid (aldosterone) synthesis</text>
      <text x="550" y="592" fill="#fca5a5" fontSize="10">• Unreliable cosyntropin stim testing</text>

      {/* Duration box */}
      <rect x="555" y="615" width="240" height="30" rx="6" fill="#111827" stroke="#f59e0b" strokeWidth="1" />
      <text x="675" y="635" textAnchor="middle" fill="#fbbf24" fontSize="10" fontWeight="500">Duration: 24–72 hours from single dose</text>

      {/* ==================== COMPARISON BOX ==================== */}
      <rect x="485" y="660" width="395" height="100" rx="8" fill="#111827" stroke="#1e293b" strokeWidth="1" />
      <text x="682" y="682" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontWeight="600">GABA-A Modulators — Comparison</text>
      <line x1="500" y1="690" x2="865" y2="690" stroke="#1e293b" strokeWidth="1" />
      <text x="505" y="708" fill="#f59e0b" fontSize="10">Etomidate: ↑ Cl⁻ duration + direct gate • Hemostable • Adrenal suppression</text>
      <text x="505" y="726" fill="#34d399" fontSize="10">Propofol:    ↑ Cl⁻ duration + direct gate • ↓↓ SVR/MAP • Antiemetic</text>
      <text x="505" y="744" fill="#fbbf24" fontSize="10">BZDs:          ↑ Cl⁻ frequency only • GABA-dependent • Has reversal (flumazenil)</text>
      <text x="505" y="758" fill="#a78bfa" fontSize="10">Barbiturates: ↑ Cl⁻ duration + direct gate • ↓↓ SVR/MAP • No reversal</text>

      {/* ==================== LEGEND ==================== */}
      <rect x="20" y="660" width="440" height="100" rx="8" fill="#111827" stroke="#1e293b" strokeWidth="1" />
      <text x="45" y="682" fill="#94a3b8" fontSize="11" fontWeight="600">LEGEND</text>
      <line x1="35" y1="690" x2="445" y2="690" stroke="#1e293b" strokeWidth="1" />

      <circle cx="50" cy="710" r="8" fill="#f59e0b" /><text x="65" y="714" fill="#94a3b8" fontSize="10">Etomidate</text>
      <circle cx="180" cy="710" r="8" fill="none" stroke="#3b82f6" strokeWidth="1.5" /><text x="195" y="714" fill="#94a3b8" fontSize="10">Cl⁻ ion</text>
      <rect x="280" y="702" width="14" height="14" rx="2" fill="#1e3a5f" stroke="#60a5fa" strokeWidth="1" /><text x="300" y="714" fill="#94a3b8" fontSize="10">α subunit</text>
      <rect x="375" y="702" width="14" height="14" rx="2" fill="#2d1f3d" stroke="#a855f7" strokeWidth="1" /><text x="395" y="714" fill="#94a3b8" fontSize="10">β subunit</text>

      <rect x="37" y="730" width="14" height="14" rx="2" fill="#1a3a2a" stroke="#4ade80" strokeWidth="1" /><text x="57" y="742" fill="#94a3b8" fontSize="10">γ subunit</text>
      <line x1="175" y1="737" x2="200" y2="737" stroke="#ef4444" strokeWidth="3" />
      <text x="210" y="741" fill="#94a3b8" fontSize="10">Enzyme inhibition (block)</text>
      <line x1="370" y1="737" x2="395" y2="737" stroke="#64748b" strokeWidth="1.5" strokeDasharray="5,3" />
      <text x="405" y="741" fill="#94a3b8" fontSize="10">Blocked pathway</text>
    </svg>
  );
};

export default EtomidateDiagram;
