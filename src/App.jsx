import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// THEMES
const TH = {
  dark: {
    bg:"#06090f",bgC:"#0d1220",bgH:"#111827",bgS:"#111827",bgI:"#0f172a",
    bd:"#1e293b",bdH:"#334155",tx:"#e2e8f0",t2:"#94a3b8",tM:"#64748b",
    ac:"#2dd4bf",aD:"rgba(45,212,191,0.12)",aB:"rgba(45,212,191,0.3)",
    wn:"#f59e0b",dg:"#ef4444",ok:"#22c55e",pr:"#a855f7",pk:"#ec4899",bl:"#3b82f6",
    hd:"linear-gradient(135deg,#0a1628,#0d1f2d)",sh:"0 4px 24px rgba(0,0,0,0.4)",
    acTx:"#06090f"
  },
  light: {
    bg:"#f8fafc",bgC:"#ffffff",bgH:"#f1f5f9",bgS:"#f1f5f9",bgI:"#ffffff",
    bd:"#e2e8f0",bdH:"#cbd5e1",tx:"#0f172a",t2:"#475569",tM:"#94a3b8",
    ac:"#0d9488",aD:"rgba(13,148,136,0.08)",aB:"rgba(13,148,136,0.25)",
    wn:"#d97706",dg:"#dc2626",ok:"#16a34a",pr:"#7c3aed",pk:"#db2777",bl:"#2563eb",
    hd:"linear-gradient(135deg,#f0fdfa,#e0f2fe)",sh:"0 4px 24px rgba(0,0,0,0.06)",
    acTx:"#ffffff"
  },
};

// DOWNLOAD: PDF
function dlPDF(title, sections) {
  const css = `@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}@page{margin:18mm 14mm}}
body{font-family:'Helvetica Neue',Helvetica,sans-serif;max-width:720px;margin:0 auto;padding:40px 28px;color:#1e293b;line-height:1.7;font-size:13px}
h1{font-size:26px;border-bottom:3px solid #0d9488;padding-bottom:6px;margin-bottom:4px}
h2{font-size:16px;color:#0d9488;margin-top:22px;border-bottom:1px solid #e2e8f0;padding-bottom:3px}
.sub{color:#64748b;font-size:13px;margin-bottom:18px}
.bx{background:#f8fafc;border:1px solid #e2e8f0;border-radius:5px;padding:10px 12px;margin:6px 0;page-break-inside:avoid}
.bxd{background:#fef2f2;border:2px solid #ef4444}
.bxw{background:#fffbeb;border:1px solid #f59e0b}
.dc{border-left:4px solid #0d9488;padding:8px 12px;background:#f8fafc;margin:6px 0;border-radius:0 5px 5px 0;page-break-inside:avoid}
.dt{font-size:11px;color:#0d9488;font-weight:600}.dv{font-size:16px;font-weight:700;margin:2px 0}.dn{font-size:11px;color:#64748b}
.lb{font-size:10px;text-transform:uppercase;letter-spacing:.4px;color:#64748b}.vl{font-size:13px;font-weight:600}
.gr{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.step{padding:8px 12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:5px;margin:6px 0;page-break-inside:avoid}
.sn{display:inline-block;background:#f0fdfa;color:#0d9488;border-radius:50%;width:22px;height:22px;text-align:center;line-height:22px;font-size:11px;font-weight:700;margin-right:8px}
.ft{margin-top:36px;padding-top:10px;border-top:1px solid #e2e8f0;font-size:9px;color:#94a3b8;text-align:center}`;
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title} — CRNA Prep</title><style>${css}</style></head><body>
<h1>${title}</h1><div class="sub">CRNA Interview Prep Study Sheet &bull; ${new Date().toLocaleDateString()}</div>
${sections.map(s => `<h2>${s.t}</h2><div>${s.c}</div>`).join("")}
<div class="ft">Generated from CRNA Prep Study Platform &bull; Open this file in a browser and use Print → Save as PDF</div>
<script>window.onload=function(){setTimeout(function(){window.print()},600)}<\/script></body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}-study-sheet.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

// DOWNLOAD: Diagram Image
function dlDiagram(svgRef, title, fmt) {
  const svg = svgRef.current;
  if (!svg) { alert("No diagram to export"); return; }
  const data = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();
  const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  img.onload = () => {
    canvas.width = 1600; canvas.height = 1200;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 1600, 1200);
    ctx.drawImage(img, 0, 0, 1600, 1200);
    URL.revokeObjectURL(url);
    const a = document.createElement("a");
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-diagram.${fmt === "jpeg" ? "jpg" : "png"}`;
    a.href = canvas.toDataURL(fmt === "jpeg" ? "image/jpeg" : "image/png", 0.95);
    a.click();
  };
  img.src = url;
}

// STUDY DATA
const MEDS = [{
  id: "propofol", name: "Propofol", brand: "Diprivan",
  tags: ["Sedative-Hypnotic", "GABA-A Agonist", "Alkylphenol", "IV Anesthetic"],
  systems: ["neuro", "pharm"], type: "medication",
  ov: { "Drug Class": "Alkylphenol sedative-hypnotic", "Primary Target": "GABA-A receptor (β-subunit)", "Action": "Positive allosteric modulator + direct agonist", "Ion Channel": "Cl⁻ channel → hyperpolarization", "Formulation": "1% lipid emulsion (10 mg/mL)", "Schedule": "Not federally scheduled" },
  moa: `Propofol (2,6-diisopropylphenol) acts primarily through positive allosteric modulation of the GABA-A receptor — the major inhibitory ligand-gated chloride ion channel in the CNS. It binds to the β-subunit at the TM2/TM3 transmembrane domains, distinct from the GABA binding site (α-β interface).

At lower concentrations, propofol potentiates endogenous GABA by increasing the duration of chloride channel opening — prolonged Cl⁻ influx produces greater postsynaptic hyperpolarization.

At higher (induction) concentrations, propofol directly gates the GABA-A chloride channel even without GABA — forcing the channel open independently for rapid, profound CNS depression.

Net effect: widespread neuronal hyperpolarization (−70 mV → −85 mV), making neurons far less likely to fire. This produces sedation, amnesia, anxiolysis, and general anesthesia.

Secondary mechanisms: NMDA receptor inhibition, voltage-gated Na⁺ channel modulation, slow Ca²⁺ channel inhibition — contributing to neuroprotection, reduced CMRO₂, and decreased ICP.`,
  recPhys: `The GABA-A receptor is a pentameric ligand-gated ion channel (ionotropic) — five subunits (2α, 2β, 1γ) around a central Cl⁻ pore. Ionotropic = direct coupling of binding to ion flow (no second messengers) = rapid onset.

Step 1 — Drug Binding: Propofol binds hydrophobic pockets in β-subunit TM2/TM3. Extreme lipophilicity (oil:water ~4500:1) enables rapid BBB crossing.

Step 2 — Conformational Change: Stabilizes channel open state. Allosteric: ↑ mean open time when GABA binds. Direct-gating: opens pore without GABA.

Step 3 — Cl⁻ Influx: Cl⁻ flows inward down electrochemical gradient, driving membrane potential from −70 mV toward −80 to −90 mV.

Step 4 — Hyperpolarization: Neuron needs substantially larger excitatory input to reach threshold (−55 mV). Billions of neurons simultaneously = global CNS depression.

KEY DISTINCTION: Propofol/barbiturates ↑ Cl⁻ channel open DURATION + can directly gate. Benzodiazepines ↑ opening FREQUENCY + require GABA (no direct gating). Classic interview question.`,
  dosing: [
    { ind: "Induction", dose: "1.5–2.5 mg/kg IV", notes: "Over 20–30 sec. Reduce 25–50% in elderly/unstable/ASA III–IV.", clr: "ac" },
    { ind: "ICU Sedation", dose: "5–50 mcg/kg/min", notes: "Start 5–10, titrate to RASS. Trigs q48h. PRIS risk >70 mcg/kg/min or >48h.", clr: "wn" },
    { ind: "Procedural Sedation", dose: "0.5–1.0 mg/kg → 25–75 mcg/kg/min", notes: "Titrate 10–20 mg q30–60 sec. Airway equipment ready.", clr: "pr" },
    { ind: "TIVA", dose: "100–200 mcg/kg/min", notes: "With remifentanil. Favorable context-sensitive half-time.", clr: "pk" },
  ],
  kin: { onset: "15–30 sec", onsetD: "One arm-brain circulation time", peak: "1–2 min", peakD: "Full effect within 90 sec", dur: "5–10 min (bolus)", durD: "Redistribution, NOT metabolism", vd: "2–10 L/kg", pb: "97–99%", hl: "4–12h terminal", csht: "~25 min (3h infusion)", cl: "20–30 mL/kg/min", model: "Three-compartment" },
  metab: `Primary: hepatic conjugation (glucuronidation/sulfation) via UGT1A9 and CYP2B6. All metabolites inactive, renally excreted.

Critical: clearance (20–30 mL/kg/min) EXCEEDS hepatic blood flow (~21 mL/kg/min) → extrahepatic metabolism (lungs ~30%, kidneys). Clearance preserved in hepatic dysfunction.

88% excreted in urine as metabolites within 5 days. <0.3% unchanged.

Elderly: ↓Vd, ↓clearance, ↑sensitivity → reduce 25–50%. Hepatic impairment: modest effect. Renal: no adjustment. Pediatrics: higher Vd/clearance per-kg, higher PRIS risk.`,
  warn: [
    { tp: "bb", ti: "Propofol Infusion Syndrome (PRIS)", tx: "Prolonged (>48h) high-dose (>70 mcg/kg/min): metabolic acidosis, rhabdomyolysis, hyperK, cardiac failure → asystole. Impaired mitochondrial fatty acid oxidation. Mortality 30–80%." },
    { tp: "bb", ti: "Pediatric ICU Sedation", tx: "Not FDA-approved. Multiple pediatric deaths reported." },
    { tp: "ci", ti: "Absolute Contraindications", tx: "Hypersensitivity to propofol, eggs, soybeans." },
    { tp: "cau", ti: "Hemodynamic Depression", tx: "↓SVR 15–40% + myocardial depression. Blunted baroreflex." },
    { tp: "cau", ti: "Respiratory Depression", tx: "Apnea 30–90 sec at induction. ↓ response to hypoxia and hypercarbia." },
  ],
  ix: [
    { dr: "Opioids", ef: "Synergistic respiratory depression + hypotension. Reduce propofol 25–50%.", sv: "high" },
    { dr: "Benzodiazepines", ef: "Additive CNS/respiratory depression.", sv: "high" },
    { dr: "Vasopressors", ef: "May need ↑ support for vasodilation.", sv: "mod" },
  ],
  pearls: [
    { ti: "Why propofol?", tx: "Best recovery profile — rapid, clear-headed, antiemetic. ↓ICP/CMRO₂. Trade-off: hemodynamic depression." },
    { ti: "Antiemetic", tx: "Active at subhypnotic doses (10–20 mg). D2 antagonism in CTZ. TIVA < PONV vs. volatiles." },
    { ti: "ICP effects", tx: "↓CMRO₂/CBF/ICP via flow-metabolism coupling. Watch CPP = MAP−ICP." },
    { ti: "Injection pain", tx: "28–90%. Mitigate: large vein, lidocaine 20–40 mg pretreat or mix 20 mg/200 mg propofol." },
    { ti: "No analgesia", tx: "Zero. Always pair with analgesics (eCASH/PADIS)." },
    { ti: "Green urine", tx: "Quinol metabolites — benign. Reassurance, not workup." },
  ],
  intQs: [
    { q: "MAP drops to 52 after induction?", a: "Phenylephrine 100–200 mcg IV. Volume. Ephedrine 5–10 mg if HR low." },
    { q: "Propofol vs etomidate in trauma?", a: "Etomidate: hemodynamically neutral. Trade-off: adrenal suppression (11β-hydroxylase)." },
    { q: "ICU patient: unexplained acidosis + rising CK?", a: "PRIS. Stop propofol, switch sedative, check trigs/lactate/CK." },
  ],
},{
  id: "norepinephrine", name: "Norepinephrine", brand: "Levophed",
  tags: ["Vasopressor", "Catecholamine", "α Agonist", "Sympathomimetic"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Endogenous catecholamine / direct-acting sympathomimetic", "Primary Targets": "α > α₂ > β >> β₂ adrenergic receptors", "Action": "Full agonist at α and β negligible β₂", "Net Effect": "↑SVR (vasoconstriction) + preserved CO (inotropy) ± reflex ↓HR", "Formulation": "4 mg/4 mL concentrate → dilute in D5W", "First-Line": "Septic shock (SSC 2021 — strong recommendation)" },
  moa: `Norepinephrine is an endogenous catecholamine and direct-acting sympathomimetic with the receptor affinity hierarchy α₂ > α > β >> β₂. This profile delivers potent vasoconstriction with cardiac output preservation — the ideal hemodynamic response for distributive shock.

At the α receptor (Gq-coupled), NE activates PLC → IP₃ + DAG → intracellular Ca²⁺ release from SR + PKC activation → MLCK-mediated smooth muscle contraction → vasoconstriction. Vascular beds most affected: splanchnic > cutaneous > renal > skeletal muscle. Cerebral circulation is relatively protected by autoregulation.

At the β receptor (Gs-coupled), NE activates adenylyl cyclase → ↑cAMP → PKA → phosphorylation of L-type Ca²⁺ channels (↑Ca²⁺ influx = inotropy), RyR2 (enhanced CICR), and phospholamban (faster relaxation = lusitropy). Direct chronotropic effect via If/HCN channels in SA node.

THE BARORECEPTOR PARADOX: NE's dominant α effect raises MAP → carotid/aortic baroreceptors → ↑vagal tone → REFLEX BRADYCARDIA offsets the direct β chronotropic effect. Net HR often stays the same or decreases. This fundamentally distinguishes NE from epinephrine and dobutamine, which reliably increase HR.

NE has ~10-fold selectivity for β over β₂ (Xu et al., Cell Research 2021). The structural basis: identical orthosteric binding pockets but different extracellular vestibule entry pathways — NE (lacking epinephrine's N-methyl group) enters β 30–60× faster than β₂.`,
  recPhys: `α PATHWAY (Gq → PLC → IP₃/DAG):
Step 1 — NE binds postsynaptic α receptor → Gq/G protein activates phospholipase C (PLC).
Step 2 — PLC cleaves PIP₂ → IP₃ + DAG. IP₃ binds SR receptors → Ca²⁺ floods cytoplasm.
Step 3 — DAG activates PKC → sensitizes contractile apparatus to Ca²⁺, inhibits KATP channels → depolarization → additional Ca²⁺ entry via L-type channels.
Step 4 — Ca²⁺-calmodulin → MLCK → phosphorylates myosin light chains → smooth muscle contraction → VASOCONSTRICTION.

β PATHWAY (Gs → adenylyl cyclase → cAMP):
Step 1 — NE binds cardiac β → Gs activates adenylyl cyclase → ↑cAMP → PKA.
Step 2 — PKA phosphorylates: (a) L-type Ca²⁺ channels → ↑Ca²⁺ influx = INOTROPY; (b) RyR2 → enhanced Ca²⁺-induced Ca²⁺ release; (c) phospholamban → disinhibits SERCA2a → faster Ca²⁺ reuptake = LUSITROPY; (d) If/HCN channels → faster phase 4 depolarization = CHRONOTROPY.

α₂ PRESYNAPTIC BRAKE (Gi → ↓cAMP):
NE simultaneously activates α₂ autoreceptors on presynaptic nerve terminals → Gi inhibits adenylyl cyclase → ↓cAMP → Gβγ opens GIRK K⁺ channels → hyperpolarization → NEGATIVE FEEDBACK limiting further NE release. This self-limiting mechanism prevents runaway sympathetic activation. Same target as clonidine/dexmedetomidine.

KEY COMPARISONS:
• vs. EPINEPHRINE: Epi has equipotent β₂ → dose-dependent vasodilation (low dose), bronchodilation, more tachycardia/arrhythmias, lactic acidosis. NE has no biphasic behavior.
• vs. VASOPRESSIN: Non-adrenergic (V pathway). Maintains function in acidosis. No inotropy/chronotropy. Preferential EFFERENT arteriolar constriction (may preserve GFR). Also inhibits KATP channels directly.
• vs. PHENYLEPHRINE: Pure α only — raises SVR but may ↓CO (no β support). Reflex bradycardia without compensatory inotropy.`,
  dosing: [
    { ind: "Septic Shock (1st-line)", dose: "0.05–0.1 mcg/kg/min start → titrate to MAP ≥65", notes: "FDA label: 8–12 mcg/min start. Titrate q5-15 min by 0.05–0.1 mcg/kg/min. Add vasopressin at 0.25–0.5 mcg/kg/min.", clr: "ac" },
    { ind: "Maintenance Range", dose: "0.01–0.3 mcg/kg/min", notes: "High-dose/refractory: up to 1 mcg/kg/min. Max reported ~3 mcg/kg/min (rare).", clr: "bl" },
    { ind: "Cardiogenic Shock", dose: "0.01–0.3 mcg/kg/min", notes: "Lower doses. Combine with inotrope (dobutamine 2–20 mcg/kg/min). Avoid escalating NE alone — worsens afterload.", clr: "wn" },
    { ind: "Intraoperative (EPON protocol)", dose: "0.02–0.1 mcg/kg/min", notes: "Prophylactic from induction. EPON trial: ↓complications 44% vs 58% (P=0.004).", clr: "pr" },
    { ind: "Spinal Hypotension (OB)", dose: "0.05 mcg/kg/min infusion", notes: "Bolus: 4–8 mcg (ED90 ≈ 6 mcg). 1 mcg NE ≈ 10–12.5 mcg phenylephrine.", clr: "pk" },
  ],
  kin: { onset: "1–2 min", onsetD: "Rapid — ideal for acute hemodynamic rescue", peak: "1–2 min", peakD: "Steady-state plasma level ~5 min", dur: "1–2 min after stopping", durD: "Context-INSENSITIVE — offset independent of infusion duration", vd: "Not applicable (continuous infusion only)", pb: "~25%", hl: "2.4 min", csht: "N/A — does not accumulate", cl: "Enzymatic (COMT/MAO) + neuronal reuptake", model: "Rapid clearance, no redistribution" },
  metab: `Primary termination: NEURONAL REUPTAKE (Uptake-1) into sympathetic nerve terminals — the dominant mechanism. This is the target blocked by TCAs and cocaine.

Enzymatic metabolism:
(1) COMT (catechol-O-methyltransferase) → normetanephrine (in liver, kidneys, extraneuronal tissue)
(2) MAO-A (monoamine oxidase) → DHPG (on mitochondrial membranes within nerve terminals)
Both pathways converge → VMA (vanillylmandelic acid) → renally excreted as sulfate/glucuronide conjugates. VMA = the metabolite measured in pheochromocytoma screening.

ZERO CYP450 involvement — three clinical implications:
(1) No CYP-mediated drug interactions (unaffected by inhibitors/inducers)
(2) Predictable PK even in polypharmacy
(3) NO dose adjustment for hepatic or renal impairment

In multi-organ dysfunction, NE pharmacokinetics remain remarkably reliable because metabolism is distributed across multiple organ systems via non-CYP enzymes.`,
  warn: [
    { tp: "bb", ti: "Extravasation → Tissue Necrosis", tx: "Intense α vasoconstriction → ischemia → necrosis → gangrene. RESCUE: Phentolamine 5–10 mg in 10–15 mL NS, infiltrate SC with 25G needle throughout ischemic area. Most effective within 12h. May repeat. Warm compresses (NOT cold)." },
    { tp: "ci", ti: "Mesenteric/Peripheral Vascular Disease", tx: "Use with extreme caution — ↑risk digital ischemia, bowel ischemia. Monitor lactate, abdominal exam, extremity perfusion." },
    { tp: "cau", ti: "MAOI Interaction (CRITICAL)", tx: "MAOIs (phenelzine, tranylcypromine, LINEZOLID) block MAO → impaired NE degradation → SEVERE prolonged hypertensive crisis. Most dangerous interaction." },
    { tp: "cau", ti: "TCA Interaction", tx: "Block norepinephrine transporter (NET) — primary termination mechanism. Dramatically amplifies/prolongs NE effect → severe sustained hypertension." },
    { tp: "cau", ti: "Dilution Requirement", tx: "Must dilute in D5W (dextrose-containing solutions). NE undergoes oxidation in saline-only solutions per FDA labeling." },
  ],
  ix: [
    { dr: "MAOIs / Linezolid", ef: "Blocked MAO degradation → severe prolonged hypertensive crisis. Most dangerous interaction.", sv: "high" },
    { dr: "TCAs", ef: "Block neuronal reuptake (Uptake-1) → amplified/prolonged pressor response.", sv: "high" },
    { dr: "Non-selective β-blockers", ef: "Propranolol blocks β compensation → unopposed α → severe HTN + reflex bradycardia.", sv: "high" },
    { dr: "Halogenated Anesthetics", ef: "Myocardial sensitization to catecholamines. Lower risk with modern agents (sevo/des/iso) vs halothane.", sv: "mod" },
    { dr: "Vasopressin", ef: "Synergistic vasopression. Allows NE dose reduction (catecholamine-sparing). SSC 2021: add at NE 0.25–0.5 mcg/kg/min.", sv: "low" },
  ],
  pearls: [
    { ti: "Why NE over dopamine?", tx: "SOAP II (NEJM 2010, n=1679): Dopamine → 2× arrhythmia rate (24% vs 12%). Higher mortality in cardiogenic shock subgroup. NE is safer across all shock subtypes." },
    { ti: "NE + Vasopressin (VASST/VANISH)", tx: "VASST: add VP at NE ≥5 mcg/min → NE-sparing, possible benefit in less severe shock. VANISH: VP ↓ need for RRT (25% vs 35%). VP works in acidosis when adrenergic receptors fail." },
    { ti: "MAP target (SEPSISPAM)", tx: "65–70 mmHg standard. Chronic HTN patients: 80–85 → ↓RRT need (32% vs 42%) but ↑afib. Individualize." },
    { ti: "Peripheral IV is safe", tx: "Yerke et al. (CHEST 2024, n=635): extravasation 5.5%, zero surgical interventions. 51.6% never needed CVC. Use ≥18G in antecubital fossa or above." },
    { ti: "Intraoperative paradigm shift", tx: "EPON trial (2025): prophylactic NE from induction → 44% vs 58% complications. NE maintains CO better than phenylephrine (pure alpha-1) due to beta-1 inotropy." },
    { ti: "SSC 2021 Vasopressor Hierarchy", tx: "1) NE first-line → 2) Add vasopressin at 0.25–0.5 mcg/kg/min → 3) Add epinephrine → 4) Dobutamine for cardiac dysfunction → 5) Hydrocortisone if NE ≥0.25 for ≥4h." },
  ],
  intQs: [
    { q: "Septic shock, MAP 52 on 30L crystalloid. Next step?", a: "Start NE 0.05–0.1 mcg/kg/min. Titrate q5-15 min to MAP ≥65. Don't delay pressors for more fluid." },
    { q: "Patient on NE 0.4 mcg/kg/min, still MAP 58?", a: "Add vasopressin 0.03–0.04 U/min (SSC 2021 threshold: 0.25–0.5 mcg/kg/min). Consider hydrocortisone 200 mg/day." },
    { q: "NE extravasates into forearm. What do you do?", a: "Stop infusion. Infiltrate phentolamine 5–10 mg in 10–15 mL NS subcutaneously throughout ischemic area with 25G needle within 12h. Warm compresses. Restart NE at new proximal site." },
    { q: "Why NE over phenylephrine intraop?", a: "Phenylephrine (pure α raises SVR but ↓CO via reflex bradycardia without β compensation. NE's β activity preserves CO while supporting BP. EPON trial and POQI 2024 consensus support NE." },
  ],
},{
  id: "vasopressin", name: "Vasopressin (AVP)", brand: "Vasostrict",
  tags: ["Vasopressor", "Non-Catecholamine", "V Agonist", "Antidiuretic Hormone"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Endogenous nonapeptide / non-catecholamine vasopressor", "Primary Targets": "V (vascular) > V (pituitary) > V₂ (renal)", "Action": "Full agonist — non-adrenergic vasoconstriction + antidiuresis", "Net Effect": "↑SVR (adrenergic-independent) + preserved renal perfusion + NO β-adrenergic effects", "Formulation": "20 units/mL — dilute prior to infusion", "Role": "2nd-line vasopressor in septic shock (SSC 2021); catecholamine-sparing" },
  moa: `Vasopressin (arginine vasopressin, AVP, ADH) is an endogenous nonapeptide hormone synthesized in the supraoptic and paraventricular nuclei of the hypothalamus, stored in the posterior pituitary, and released in response to hyperosmolality, hypovolemia, and hypotension.

It acts on three distinct G-protein coupled receptor subtypes — V V and V₂ — each mediating different physiologic effects through different G-protein cascades. Critically, vasopressin's vasoconstrictor mechanism is COMPLETELY INDEPENDENT of adrenergic receptors. This is the key clinical advantage: it works when catecholamines fail.

In vasodilatory shock, vasopressin restores vascular tone through FOUR mechanisms:

1. V receptor activation (Gq → PLC → IP₃/DAG → ↑Ca²⁺ → smooth muscle contraction) — the primary vasoconstrictor pathway. Identical downstream cascade to α but via a different receptor.

2. KATP channel closure — In septic shock, hypoxia and acidosis activate ATP-sensitive K⁺ channels (KATP) → K⁺ efflux → hyperpolarization → voltage-gated Ca²⁺ channels remain closed → vasoplegia (catecholamine resistance). Vasopressin closes KATP channels via PKC, restoring the ability of Ca²⁺ channels to open. This directly explains why vasopressin works in acidotic, catecholamine-resistant shock.

3. NO modulation — Vasopressin inhibits inducible nitric oxide synthase (iNOS) expression, reducing pathologic NO-mediated vasodilation in sepsis.

4. Potentiation of endogenous vasoconstrictors — Sensitizes vascular smooth muscle to catecholamines, enhancing NE effect at lower doses (catecholamine-sparing).

VASOPRESSIN DEFICIENCY IN SEPSIS: Endogenous AVP stores deplete within 24–48h of sustained shock due to exhaustion of posterior pituitary reserves. Serum levels paradoxically DROP to inappropriately low levels. Exogenous vasopressin replaces this deficit — it is "hormone replacement" as much as vasopressor therapy.`,
  recPhys: `V PATHWAY — Vascular Smooth Muscle (Gq → PLC → IP₃/DAG):
Step 1 — AVP binds V receptor (7-TM GPCR) on vascular smooth muscle → Gq/G protein activates phospholipase C (PLC).
Step 2 — PLC cleaves PIP₂ → IP₃ + DAG. IP₃ binds SR receptors → Ca²⁺ release into cytoplasm.
Step 3 — DAG activates PKC → (a) directly opens voltage-gated Ca²⁺ channels (VGCCs) via depolarization; (b) CLOSES KATP channels (Kir6.1/SUR2B) → prevents K⁺ efflux → maintains depolarization → Ca²⁺ entry.
Step 4 — Ca²⁺-calmodulin → MLCK → phosphorylates myosin light chains → VASOCONSTRICTION.
Location: highest V density in splanchnic, skin, skeletal muscle vasculature. Notably ABSENT in pulmonary vasculature — vasopressin does NOT increase PVR. Preferentially constricts EFFERENT > afferent renal arterioles → ↑GFP → paradoxical increase in urine output despite being "antidiuretic hormone."

V₂ PATHWAY — Renal Collecting Duct (Gs → adenylyl cyclase → cAMP):
Step 1 — AVP binds V₂ receptor (basolateral membrane of principal cells) → Gs activates adenylyl cyclase → ↑cAMP → PKA.
Step 2 — PKA phosphorylates AQP2 vesicles → AQP2 water channels translocate to apical membrane.
Step 3 — Water reabsorbed from tubular lumen → concentrated urine, free water retention.
Also: V₂ activation on vascular endothelium → release of von Willebrand factor (vWF) + Factor VIII → procoagulant effect (basis for desmopressin/DDAVP use in bleeding).

V PATHWAY — Anterior Pituitary (Gq → PLC → IP₃/DAG):
AVP binds V receptors on corticotroph cells → same Gq cascade → ACTH secretion → cortisol release. This pathway links vasopressin to the stress response and explains the synergy between vasopressin and corticosteroids in septic shock.

KATP CHANNEL MECHANISM (Why vasopressin works when catecholamines fail):
In septic shock: ↓ATP + ↑H⁺ + ↑lactate + ↑NO → KATP channels OPEN → K⁺ efflux → smooth muscle hyperpolarization → VGCCs cannot open → NO Ca²⁺ entry → vasoplegia. Catecholamines cannot overcome this because α signaling requires intact depolarization to open VGCCs. Vasopressin bypasses this entirely: V directly CLOSES KATP channels → restores depolarization → VGCCs can open again → Ca²⁺ entry → contraction restored.

ACID RESISTANCE: Unlike catecholamine receptors (α β which lose affinity in acidotic environments, V receptors maintain full binding affinity regardless of pH. Classic interview point.

KEY COMPARISONS:
• vs. NOREPINEPHRINE: NE is adrenergic-dependent (fails in acidosis/vasoplegia). NE has β inotropy. NE causes tachycardia risk. VP is non-adrenergic, no inotropy, no chronotropy, spares pulmonary circulation.
• vs. PHENYLEPHRINE: Both lack inotropy. But VP closes KATP channels (works in vasoplegia), PE does not. VP spares pulmonary circulation, PE does not.
• vs. EPINEPHRINE: Epi has β → tachycardia, arrhythmia, lactic acidosis. VP has zero adrenergic effects.`,
  dosing: [
    { ind: "Septic Shock (2nd-line, SSC 2021)", dose: "0.03–0.04 U/min (FIXED, non-weight-based)", notes: "Add when NE 0.25–0.5 mcg/kg/min. Do NOT titrate above 0.04 U/min — higher doses ↑ischemic risk. Not a standalone vasopressor — always WITH norepinephrine.", clr: "ac" },
    { ind: "Post-Cardiotomy Vasoplegia", dose: "0.01–0.04 U/min", notes: "Start low. Common after CPB due to vasopressin depletion. VANCS trial validated benefit.", clr: "bl" },
    { ind: "Hepatorenal Syndrome", dose: "Terlipressin preferred (V analog)", notes: "Terlipressin 1–2 mg IV q4-6h (not yet FDA-approved in US as of 2025). VP 0.01–0.04 U/min if terlipressin unavailable.", clr: "wn" },
    { ind: "Diabetes Insipidus (central)", dose: "Desmopressin (DDAVP) preferred", notes: "DDAVP 1–4 mcg IV q12h (selective V₂ agonist). AVP 2.5–10 U IM/SC q4-6h rarely used (short duration, V side effects).", clr: "pr" },
    { ind: "GI Variceal Hemorrhage", dose: "0.2–0.4 U/min IV", notes: "Splanchnic vasoconstriction ↓ portal pressure. Max 0.8 U/min. Co-administer with nitroglycerin to prevent coronary vasoconstriction. Octreotide/terlipressin preferred.", clr: "pk" },
  ],
  kin: { onset: "1–2 min IV", onsetD: "Rapid onset — comparable to catecholamines", peak: "5–15 min", peakD: "Steady-state with continuous infusion", dur: "30–60 min after stopping", durD: "Longer than catecholamines (NE offset 1–2 min)", vd: "140 mL/kg", pb: "~1% (minimal)", hl: "10–20 min", csht: "N/A — fixed-dose infusion", cl: "Hepatic + renal peptidase cleavage", model: "Rapid enzymatic degradation" },
  metab: `Vasopressin is a 9-amino-acid cyclic peptide (Cys-Tyr-Phe-Gln-Asn-Cys-Pro-Arg-Gly-NH₂) with a disulfide bridge between Cys¹ and Cys⁶.

Metabolism: Enzymatic cleavage by peptidases — primarily hepatic and renal serine proteases, carboxypeptidases, and disulfide oxidoreductases. Metabolites are pharmacologically inactive. Half-life 10–20 minutes (shorter in shock states due to increased clearance).

ZERO CYP450 involvement — same advantage as norepinephrine: no hepatic drug interactions, no dose adjustment needed for hepatic/renal impairment.

Pregnancy: OXYTOCINASE (a circulating aminopeptidase produced by the placenta from early pregnancy) rapidly degrades vasopressin. This increases clearance substantially in pregnant patients and is a reason some practitioners increase dose or prefer synthetic analogs. Desmopressin (DDAVP) is resistant to oxytocinase degradation.

Excretion: ~5–15% unchanged in urine. Remainder cleared by enzymatic degradation.

CRITICAL DISTINCTION from catecholamines: Vasopressin is NOT taken up by neuronal Uptake-1 (NE transporter) and is NOT degraded by COMT or MAO. Completely independent metabolic pathway — this is why it works when catecholamine metabolism is overwhelmed.`,
  warn: [
    { tp: "bb", ti: "Tissue Ischemia (Dose-Dependent)", tx: "Potent vasoconstriction can cause: mesenteric ischemia (splanchnic V density is HIGH), digital ischemia/gangrene, skin necrosis, coronary vasoconstriction → demand ischemia. Risk increases sharply above 0.04 U/min. Do NOT titrate as sole vasopressor." },
    { tp: "ci", ti: "Coronary Artery Disease", tx: "V coronary vasoconstriction can precipitate ischemia. VASST excluded unstable coronary patients. Use with extreme caution — if used, keep ≤0.03 U/min and monitor troponin." },
    { tp: "cau", ti: "Hyponatremia Risk", tx: "V₂ activation → free water retention → dilutional hyponatremia. Monitor serum Na⁺. Risk higher with prolonged infusion. Can complicate neuro patients where Na⁺ targets matter." },
    { tp: "cau", ti: "Mesenteric Ischemia", tx: "Splanchnic bed has highest V receptor density. Monitor lactate and abdominal exam. VASST excluded patients with suspected mesenteric ischemia." },
    { tp: "cau", ti: "Not a Standalone Vasopressor", tx: "Must be used WITH norepinephrine in septic shock — not as replacement. Fixed dose, not titrated. Does not provide β inotropy — cardiac output not supported." },
  ],
  ix: [
    { dr: "Norepinephrine", ef: "Synergistic vasopression (different receptor pathways). VP allows NE dose reduction (catecholamine-sparing). SSC 2021 standard combination.", sv: "low" },
    { dr: "Corticosteroids", ef: "VP + hydrocortisone may have synergistic benefit. V pathway. VANISH showed trend toward benefit with hydrocortisone + VP.", sv: "low" },
    { dr: "Indomethacin/NSAIDs", ef: "Potentiate antidiuretic effect by inhibiting prostaglandin-mediated antagonism of V₂ action → enhanced water retention.", sv: "mod" },
    { dr: "Carbamazepine/SSRIs", ef: "Potentiate ADH effect → ↑risk SIADH-like hyponatremia when combined with VP.", sv: "mod" },
    { dr: "Lithium/Demeclocycline", ef: "V₂ receptor antagonism → blunts antidiuretic effect. May counteract VP-mediated water retention.", sv: "mod" },
    { dr: "Halogenated Anesthetics", ef: "Volatiles may impair vasopressin release from posterior pituitary. May need higher exogenous doses under GA.", sv: "low" },
  ],
  pearls: [
    { ti: "Why VP works when NE fails", tx: "In severe sepsis: acidosis + ↑NO + ↓ATP → KATP channels open → catecholamine-resistant vasoplegia. VP bypasses adrenergic receptors entirely, closes KATP channels via PKC, and V receptors maintain affinity in acidosis. Non-adrenergic rescue." },
    { ti: "VASST (NEJM 2008, n=778)", tx: "VP 0.03 U/min + NE vs NE alone. No mortality difference overall (35.4% vs 39.3%). SUBGROUP: less severe shock (NE 5–14 mcg/min) → mortality 26.5% vs 35.7% (P=0.05). Established safety of VP ≤0.03 U/min." },
    { ti: "VANISH (JAMA 2016, n=409)", tx: "Early VP vs NE as first-line. No difference in kidney failure-free days (primary). BUT: VP group had ↓RRT need (25.4% vs 35.3%, absolute difference −9.9%). Renal-sparing signal — likely from preferential efferent arteriolar constriction." },
    { ti: "Efferent > Afferent", tx: "VP constricts EFFERENT arterioles >> afferent (unlike NE/PE which constrict both equally). This ↑glomerular filtration pressure → paradoxically ↑urine output despite being 'antidiuretic hormone.' Classic interview question." },
    { ti: "Pulmonary-sparing", tx: "VP does NOT constrict pulmonary vasculature — may even vasodilate (NO-mediated). Preferred over catecholamines in patients with RV failure or pulmonary hypertension." },
    { ti: "Removed from ACLS (2015/2025)", tx: "40 U IV single-dose was equivalent to epinephrine 1 mg — no added benefit. AHA 2025: 'Do not substitute vasopressin alone or with epinephrine for epinephrine' (Class 3: No Benefit). Removed to simplify algorithm, not because it's harmful." },
    { ti: "SSC 2021 Vasopressor Hierarchy", tx: "1) NE first-line → 2) Add VP 0.03 U/min at NE 0.25–0.5 mcg/kg/min (weak recommendation) → 3) Add epinephrine → 4) Dobutamine for cardiac dysfunction → 5) Hydrocortisone if NE ≥0.25 for ≥4h." },
    { ti: "Decatecholaminization trend", tx: "2024–2025 literature supports earlier VP addition to reduce catecholamine exposure. High-dose catecholamines → myocardial toxicity, arrhythmias, metabolic derangement. VP spares catecholamine dose." },
  ],
  intQs: [
    { q: "Patient on NE 0.5 mcg/kg/min, MAP 56, pH 7.18. What's happening and what do you add?", a: "Catecholamine-resistant vasoplegia. Acidosis opens KATP channels → hyperpolarization → α receptors can't transduce signal. Add VP 0.03 U/min — non-adrenergic, closes KATP channels via PKC, V receptors maintain affinity in acidosis. Also give bicarb if pH <7.15 and consider hydrocortisone." },
    { q: "Why does urine output increase when you start vasopressin?", a: "V receptors preferentially constrict EFFERENT arterioles >> afferent. This ↑glomerular filtration pressure → ↑GFR → ↑UOP. Despite V₂-mediated water reabsorption, the net effect at low doses is increased filtration." },
    { q: "VP was removed from ACLS. Does that mean it doesn't work?", a: "It was equivalent to epinephrine — removed to simplify, not for harm. AHA 2025 classifies it Class 3: No Benefit (not Class 3: Harm). In cardiac arrest, epinephrine's α + β effects on coronary perfusion are sufficient. VP's role is in SHOCK, not arrest." },
    { q: "Cardiogenic shock patient on NE + dobutamine. Can you add VP?", a: "Use cautiously. VP has NO β inotropy and increases afterload (↑SVR). In cardiogenic shock with ↓CO, ↑afterload without ↑contractility worsens output. VP better suited for distributive/vasodilatory shock where the problem is low SVR, not low CO." },
  ],
},{
  id: "atropine", name: "Atropine", brand: "AtroPen",
  tags: ["Anticholinergic", "Muscarinic Antagonist", "Parasympatholytic", "Tertiary Amine"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Naturally-occurring belladonna alkaloid / non-selective muscarinic antagonist", "Primary Target": "M1, M2, M3, M4, M5 muscarinic receptors (competitive antagonist)", "Action": "Blocks ACh at all muscarinic subtypes — no nicotinic activity", "G-Proteins": "Blocks M2 (Gi) and M1/M3 (Gq) signaling", "Structure": "Tertiary amine → crosses BBB (CNS effects)", "Key Feature": "Vagolytic: removes parasympathetic brake on heart" },
  moa: "Atropine is a competitive antagonist at all five muscarinic receptor subtypes (M1–M5). Its primary clinical effect is vagolysis — blocking M2 receptors on the SA node.\n\nM2 blockade (Gi pathway): Normally, vagal ACh activates M2 → Gi → ↓cAMP + G\u03b2\u03b3 opens GIRK channels → K\u207a efflux → hyperpolarization → slowed HR. Atropine blocks this entire cascade, removing the parasympathetic brake and allowing intrinsic sympathetic tone to predominate → ↑HR.\n\nM3 blockade (Gq pathway): Normally M3 → Gq → PLC → IP₃/DAG → Ca\u00b2\u207a → smooth muscle contraction + glandular secretion. Atropine blocks this → bronchodilation, ↓secretions, mydriasis, cycloplegia, ↓GI motility, urinary retention.\n\nM1 blockade: Blocks CNS cholinergic transmission (crosses BBB as tertiary amine) → central anticholinergic effects at high doses (confusion, agitation, hallucinations).\n\nCritical dose-response paradox: At doses <0.5 mg, atropine can cause PARADOXICAL BRADYCARDIA. This occurs because low doses preferentially block presynaptic M1 autoreceptors on vagal nerve terminals (which normally inhibit ACh release), resulting in increased ACh release that overwhelms the partial postsynaptic M2 blockade. This is why the minimum effective dose is 0.5 mg IV.",
  recPhys: "The M2 muscarinic receptor is a GPCR coupled to Gi proteins. The vagolytic mechanism at the SA node proceeds as follows:\n\nNormal vagal tone: Vagus nerve releases ACh → binds M2 on SA node → activates Gi → two effects: (1) G\u03b1i inhibits adenylyl cyclase → ↓cAMP → ↓If (funny current) → slower Phase 4 depolarization. (2) G\u03b2\u03b3 directly opens GIRK channels (Kir3.1/3.4) → K\u207a efflux → hyperpolarization → more negative maximum diastolic potential. Combined: slower firing rate = bradycardia.\n\nAtropine effect: Competitively blocks ACh at M2 → removes BOTH mechanisms → cAMP rises (If increases), GIRK channels close (less hyperpolarization) → SA node firing rate increases → tachycardia.\n\nThe M3 receptor couples to Gq → PLC → IP₃/DAG → Ca\u00b2\u207a release from SR → smooth muscle contraction + secretion. Atropine blocks this in bronchial smooth muscle (bronchodilation), GI smooth muscle (↓motility), salivary/sweat glands (↓secretions), and pupillary sphincter (mydriasis).\n\nKey structural point: Atropine is a TERTIARY amine (lipophilic, crosses BBB) vs glycopyrrolate which is QUATERNARY (charged, cannot cross BBB). This is the single most important distinction for interview purposes.",
  dosing: [
    { ind: "Symptomatic Bradycardia", dose: "0.5 mg IV q3–5 min", notes: "Max 3 mg total. NEVER give <0.5 mg (paradoxical bradycardia). ACLS first-line for bradycardia.", clr: "ac" },
    { ind: "Cardiac Arrest (PEA/Asystole)", dose: "1 mg IV q3–5 min", notes: "Max 3 mg (full vagolysis). No longer in AHA 2020 ACLS for arrest — removed but not harmful.", clr: "wn" },
    { ind: "Organophosphate Poisoning", dose: "2–6 mg IV, then double q5–10 min", notes: "Titrate to dry secretions. May need massive doses (100+ mg). Pralidoxime as adjunct.", clr: "pr" },
    { ind: "Premedication (antisialagogue)", dose: "0.01–0.02 mg/kg IV/IM", notes: "Given before ketamine to reduce hypersalivation. Glycopyrrolate preferred (fewer CNS effects).", clr: "pk" },
    { ind: "NMB Reversal Adjunct", dose: "0.015–0.02 mg/kg IV", notes: "Given with neostigmine to counter muscarinic side effects. Match onset: atropine (fast) with neostigmine.", clr: "dg" },
  ],
  kin: { onset: "IV: 30–60 sec", onsetD: "Rapid absorption, high lipophilicity", peak: "2–4 min", peakD: "Peak vagolytic effect", dur: "60–120 min", durD: "Varies by dose and target organ", vd: "1–6 L/kg", pb: "14–22%", hl: "2–3 hours", csht: "N/A (bolus dosing)", cl: "Hepatic", model: "Two-compartment" },
  metab: "Primary: hepatic hydrolysis by esterases and CYP-mediated oxidation. Approximately 50% hepatic metabolism, 50% renal excretion unchanged.\n\nActive metabolites: noratropine (minor activity), tropine, tropic acid — all significantly less active than parent compound.\n\nRenal excretion: 30–50% unchanged drug in urine. Half-life 2–3 hours in adults, prolonged in elderly and renal impairment.\n\nNo significant CYP450 interactions. Not removed by dialysis effectively.\n\nPediatric: faster metabolism, may need higher weight-based doses. Elderly: increased sensitivity to CNS effects (delirium), prolonged duration.",
  warn: [
    { tp: "bb", ti: "Paradoxical Bradycardia", tx: "Doses <0.5 mg can WORSEN bradycardia via preferential presynaptic M1 blockade → increased ACh release. NEVER give less than 0.5 mg IV." },
    { tp: "ci", ti: "Narrow-Angle Glaucoma", tx: "Mydriasis blocks aqueous humor drainage → acute ↑IOP. Relative contraindication." },
    { tp: "ci", ti: "Obstructive Uropathy", tx: "Urinary retention from detrusor relaxation. Caution in BPH." },
    { tp: "cau", ti: "Tachyarrhythmia Risk", tx: "Full vagolysis can unmask or worsen SVT, AFib with RVR. Use cautiously in ACS (increased myocardial O2 demand)." },
    { tp: "cau", ti: "Denervated Heart", tx: "Atropine INEFFECTIVE in transplant patients — no vagal innervation to block. Use direct agonists (isoproterenol, epinephrine) or pacing." },
    { tp: "cau", ti: "CNS Effects (Tertiary Amine)", tx: "Crosses BBB: agitation, confusion, hallucinations, hyperthermia at high doses. Central anticholinergic syndrome treated with physostigmine." },
  ],
  ix: [
    { dr: "Neostigmine/Pyridostigmine", ef: "Atropine counters muscarinic effects of AChE inhibitors. Standard pairing for NMB reversal.", sv: "high" },
    { dr: "Other Anticholinergics", ef: "Additive: ↑tachycardia, urinary retention, ileus, hyperthermia. Watch polypharmacy in elderly.", sv: "mod" },
    { dr: "Potassium (hyperkalemia)", ef: "Atropine ineffective for bradycardia caused by hyperkalemia — treat K\u207a directly.", sv: "high" },
  ],
  pearls: [
    { ti: "Minimum Dose Rule", tx: "NEVER give <0.5 mg IV. Paradoxical bradycardia from low-dose preferential presynaptic M1 blockade is a classic interview trap." },
    { ti: "Transplant Heart = Atropine Failure", tx: "Denervated hearts lack vagal innervation. Atropine has nothing to block. Use isoproterenol (direct \u03b21), epinephrine, or pacing." },
    { ti: "Atropine vs Glycopyrrolate", tx: "Atropine: tertiary amine, crosses BBB, faster onset (30–60s vs 2–3 min), more tachycardia, antisialagogue + bronchodilation. Glycopyrrolate: quaternary, no BBB crossing, no CNS effects, better antisialagogue, less tachycardia." },
    { ti: "Organophosphate Toxicity", tx: "Competitive antagonism at muscarinic receptors counters SLUDGE/DUMBELS symptoms. Does NOT reverse nicotinic effects (fasciculations, paralysis) — need pralidoxime for that." },
    { ti: "Paired with Neostigmine", tx: "Standard NMB reversal: neostigmine 0.04–0.07 mg/kg + atropine 0.015–0.02 mg/kg. Or glycopyrrolate 0.2 mg per 1 mg neostigmine. Atropine onset matches neostigmine better." },
  ],
  intQs: [
    { q: "Patient develops HR 35 intraop. You give 0.3 mg atropine IV but HR drops to 28. Why?", a: "Paradoxical bradycardia from inadequate dose. At <0.5 mg, central vagal stimulation and presynaptic M1 blockade overwhelm peripheral M2 blockade. Give 0.5–1 mg IV immediately for full SA node blockade." },
    { q: "Why choose atropine over glycopyrrolate in airway emergency with bradycardia?", a: "Two advantages: (1) Faster onset (30–60s vs 2–3 min). (2) M3 blockade provides bronchodilation — glycopyrrolate lacks meaningful bronchodilation in emergency timeframes. Atropine addresses both problems simultaneously." },
    { q: "Heart transplant patient becomes bradycardic. What do you do?", a: "Atropine will NOT work — denervated heart has no vagal innervation to block. Use isoproterenol (direct \u03b21 agonist), epinephrine, or transcutaneous/transvenous pacing." },
  ],
},{
  id: "epinephrine", name: "Epinephrine", brand: "Adrenalin",
  tags: ["Endogenous Catecholamine", "Non-Selective Agonist", "\u03b1+\u03b2 Agonist", "Sympathomimetic"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Endogenous catecholamine / non-selective adrenergic agonist", "Primary Targets": "\u03b11, \u03b12, \u03b21, \u03b22, \u03b23 adrenergic receptors (all subtypes)", "Action": "Full agonist at all adrenergic receptors — dose-dependent selectivity", "G-Proteins": "\u03b11=Gq, \u03b12=Gi, \u03b21/\u03b22=Gs", "Formulation": "1:1,000 (1 mg/mL) and 1:10,000 (0.1 mg/mL)", "Key Feature": "Dose-dependent receptor profile: low=\u03b22, mid=\u03b21, high=\u03b1" },
  moa: "Epinephrine activates all five adrenergic receptor subtypes through GPCR mechanisms with dose-dependent selectivity:\n\n\u03b11-adrenergic (Gq): PLC → IP₃/DAG → ↑Ca\u00b2\u207a → vasoconstriction, ↑SVR, ↑BP. Predominates at HIGH doses (>10 mcg/min).\n\n\u03b12-adrenergic (Gi): ↓adenylyl cyclase → presynaptic inhibition → negative feedback on NE release. Significant only at very high doses.\n\n\u03b21-adrenergic (Gs): adenylyl cyclase → ↑cAMP → PKA → phosphorylates L-type Ca\u00b2\u207a channels (↑inotropy), RyR2 (↑CICR), phospholamban (↑lusitropy), HCN/If channels (↑chronotropy). Predominates at INTERMEDIATE doses (4–5 mcg/min).\n\n\u03b22-adrenergic (Gs): ↑cAMP in smooth muscle → PKA → MLCK inhibition → smooth muscle relaxation → bronchodilation + peripheral vasodilation. Predominates at LOW doses (1–2 mcg/min).\n\nClassic BP pattern: SBP ↑↑, DBP ↓ or unchanged, widened pulse pressure.",
  recPhys: "Dose-dependent receptor selectivity is the defining pharmacologic principle of epinephrine:\n\nLow dose (≤2 mcg/min): \u03b22 effects dominate. \u03b22 has higher affinity for epinephrine than \u03b21 or \u03b11. Gs → ↑cAMP → PKA → MLCK inactivation → vascular smooth muscle relaxation + bronchial smooth muscle relaxation. Clinically: ↓SVR, ↓DBP, bronchodilation.\n\nModerate dose (2–10 mcg/min): \u03b21 effects emerge. Gs → ↑cAMP → PKA phosphorylates: L-type Ca\u00b2\u207a channels (↑Ca\u00b2\u207a entry = ↑inotropy), phospholamban (relieves SERCA inhibition = ↑lusitropy), HCN channels (↑If = ↑chronotropy), RyR2 (↑Ca\u00b2\u207a-induced Ca\u00b2\u207a release). Clinically: ↑HR, ↑contractility, ↑CO.\n\nHigh dose (>10 mcg/min): \u03b11 effects predominate. Gq → PLC → IP₃/DAG → ↑intracellular Ca\u00b2\u207a → calmodulin-MLCK activation → vascular smooth muscle contraction. Clinically: ↑SVR, ↑MAP, reflex bradycardia possible.\n\nACLS dose (1 mg IV push): Massive \u03b11 effect. The purpose is NOT cardiac stimulation — it is to increase aortic root diastolic pressure to maximize coronary perfusion pressure (CPP = AoDBP – LVEDP) during chest compressions.",
  dosing: [
    { ind: "Cardiac Arrest", dose: "1 mg IV/IO q3–5 min", notes: "1:10,000 (0.1 mg/mL). Shockable rhythms: after 2nd shock. PEA/Asystole: ASAP.", clr: "ac" },
    { ind: "Anaphylaxis", dose: "0.3–0.5 mg IM (1:1,000)", notes: "Anterolateral thigh. Repeat q5–15 min PRN. IV only for refractory/cardiovascular collapse.", clr: "wn" },
    { ind: "Vasopressor Infusion", dose: "1–40 mcg/min", notes: "Titrate to MAP. Low dose (≤5): \u03b2 predominant. High dose (>10): \u03b1 predominant.", clr: "pr" },
    { ind: "Bradycardia (refractory)", dose: "2–10 mcg/min infusion", notes: "After atropine failure. Alternative to pacing. Direct \u03b21 chronotropy.", clr: "pk" },
    { ind: "Bronchospasm", dose: "0.1–0.3 mg IV (1:10,000) or nebulized 2.25% racemic", notes: "\u03b22-mediated bronchodilation. Racemic epi for croup/post-extubation stridor.", clr: "dg" },
  ],
  kin: { onset: "IV: immediate (15–30 sec). IM: 5–10 min", onsetD: "Most rapid of all catecholamines IV", peak: "IV: 1–2 min. IM: 20–30 min", peakD: "SC absorption is erratic — avoid in anaphylaxis", dur: "5–10 min (bolus)", durD: "Rapid enzymatic degradation", vd: "Large (distributes widely)", pb: "~50%", hl: "2–3 min", csht: "N/A", cl: "MAO + COMT (extremely rapid)", model: "Rapid redistribution" },
  metab: "Metabolism is extremely rapid via two enzyme systems:\n\n1. COMT (catechol-O-methyltransferase): Methylates the catechol hydroxyl groups. Present in liver, kidney, and virtually all tissues. Produces metanephrine (primary metabolite).\n\n2. MAO (monoamine oxidase): Oxidative deamination. MAO-A and MAO-B in gut, liver, nerve terminals. Produces 3,4-dihydroxymandelic acid.\n\nFinal common metabolite: Vanillylmandelic acid (VMA) — excreted renally. 24-hour urine VMA/metanephrines used to diagnose pheochromocytoma.\n\nHalf-life only 2–3 minutes explains need for continuous infusion and q3–5 min repeat dosing in ACLS.\n\nDrug interactions: MAOIs block degradation → dramatically potentiated effect → hypertensive crisis. TCAs block neuronal reuptake → potentiated effect. Beta-blockers shift receptor balance toward unopposed \u03b1 → severe hypertension + reflex bradycardia.",
  warn: [
    { tp: "bb", ti: "Extravasation Injury", tx: "\u03b11 vasoconstriction causes tissue ischemia/necrosis. Treat with phentolamine (\u03b1-blocker) 5–10 mg in 10 mL NS injected locally. Central line preferred for infusions." },
    { tp: "ci", ti: "Halogenated Anesthetics", tx: "Sensitize myocardium to catecholamines → VFib/VT risk. Halothane worst. Limit epi to 1–1.5 mcg/kg in 10 min with sevoflurane." },
    { tp: "cau", ti: "Tachyarrhythmias", tx: "Dose-dependent \u03b21 stimulation: sinus tach, SVT, VT, VFib. Worse with hypokalemia, hypomagnesemia, digitalis toxicity." },
    { tp: "cau", ti: "Metabolic Effects", tx: "\u03b22 glycogenolysis → hyperglycemia. \u03b22 cellular K\u207a uptake → hypokalemia. Lactate elevation (aerobic glycolysis, NOT tissue hypoperfusion)." },
    { tp: "cau", ti: "MAOI Interaction", tx: "Blocks MAO degradation pathway → massively potentiated catecholamine effect. Contraindicated or use extreme caution with dose reduction." },
  ],
  ix: [
    { dr: "MAOIs", ef: "Block MAO degradation → 10–20x potentiation. Hypertensive crisis, arrhythmias. Contraindicated or use 1/10th dose.", sv: "high" },
    { dr: "Beta-Blockers", ef: "Unopposed \u03b1 stimulation → severe HTN + reflex bradycardia. Especially dangerous with non-selective (propranolol).", sv: "high" },
    { dr: "TCAs", ef: "Block neuronal NE reuptake → potentiated adrenergic effect. Exaggerated pressor response.", sv: "mod" },
    { dr: "Volatile Anesthetics", ef: "Myocardial sensitization to catecholamines. VT/VFib risk. Halothane > isoflurane > sevoflurane > desflurane.", sv: "high" },
  ],
  pearls: [
    { ti: "Dose-Dependent Selectivity", tx: "LOW (≤2 mcg/min): \u03b22 = vasodilation + bronchodilation. MID (3–10): \u03b21 = ↑HR/contractility. HIGH (>10): \u03b11 = vasoconstriction. Memorize this gradient." },
    { ti: "Epi-Induced Lactate", tx: "\u03b22-mediated aerobic glycogenolysis produces lactate directly. This is PHARMACOLOGIC, not from tissue hypoperfusion. Don't chase this lactate with fluids — common ICU pitfall." },
    { ti: "NE Preferred Over Epi in Sepsis", tx: "Epi causes more tachycardia, dysrhythmias, and metabolic derangement vs NE. SSC 2021: NE first-line, epi reserved for inadequate response to NE + VP." },
    { ti: "ACLS: After 2nd Shock", tx: "In shockable rhythms (VFib/pVT): epi 1 mg after 2nd shock, then q3–5 min. In non-shockable (PEA/asystole): epi ASAP — earlier epi improves outcomes." },
    { ti: "Anaphylaxis: IM Not IV", tx: "IM 0.3–0.5 mg into anterolateral thigh. IV epinephrine reserved for cardiovascular collapse only. SC is unreliable — vasoconstriction limits its own absorption." },
  ],
  intQs: [
    { q: "Patient in anaphylaxis, BP 60/40, diffuse urticaria. Walk me through management.", a: "IM epinephrine 0.3–0.5 mg anterolateral thigh IMMEDIATELY. Remove trigger. Large-bore IV, aggressive fluid resuscitation. If no response in 5 min, repeat IM epi. If cardiovascular collapse, IV epi 0.1–0.2 mg slow push or infusion 1–10 mcg/min. Adjuncts: diphenhydramine, famotidine, methylprednisolone, albuterol for bronchospasm." },
    { q: "Why does epinephrine cause lactic acidosis?", a: "\u03b22-mediated glycogenolysis → pyruvate overwhelms mitochondrial capacity → shunted to anaerobic glycolysis → lactate production. This is a DIRECT pharmacologic effect, not tissue hypoperfusion. Critical distinction — don't treat epi-induced lactate with more fluids." },
    { q: "Epi vs NE in septic shock — which and why?", a: "NE first-line (SSC 2021). NE has favorable \u03b11>\u03b21 profile: vasoconstriction + preserved CO without excessive tachycardia/dysrhythmias. Epi causes more \u03b21/\u03b22 effects: tachycardia, dysrhythmias, lactate elevation, metabolic derangement. Epi reserved for refractory shock after NE + VP." },
  ],
},{
  id: "phenylephrine", name: "Phenylephrine", brand: "Neo-Synephrine / Vazculep",
  tags: ["Non-Catecholamine", "Pure \u03b11 Agonist", "Direct-Acting", "IV Vasopressor"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Synthetic non-catecholamine vasopressor", "Primary Target": "\u03b11-adrenergic receptor (pure, selective)", "Action": "Direct \u03b11 agonist — zero \u03b2 activity", "G-Protein": "Gq → PLC → IP₃/DAG → Ca\u00b2\u207a → vasoconstriction", "Structure": "Non-catecholamine (single hydroxyl → no COMT metabolism)", "Net Effect": "↑SVR/MAP + reflex ↓HR + ↓CO" },
  moa: "Phenylephrine is a selective \u03b11-adrenergic receptor agonist with ZERO \u03b2-receptor activity.\n\n\u03b11 activation (Gq): PLC cleaves PIP₂ → IP₃ + DAG. IP₃ binds IP₃ receptors on SR → Ca\u00b2\u207a release. DAG activates PKC. Ca\u00b2\u207a binds calmodulin → activates MLCK → myosin light chain phosphorylation → actin-myosin cross-bridging → vascular smooth muscle contraction → ↑SVR.\n\nThis is pure afterload increase without ANY direct cardiac stimulation.\n\nThe resulting ↑MAP triggers the baroreceptor reflex: carotid/aortic arch baroreceptors detect ↑stretch → ↑afferent firing to NTS in medulla → ↑vagal (parasympathetic) output + ↓sympathetic output → REFLEX BRADYCARDIA.\n\nNet hemodynamic profile: ↑SVR, ↑MAP, ↓HR (reflex), ↓CO (reduced HR + increased afterload). This is the opposite of ephedrine's profile and a critical interview distinction.",
  recPhys: "The \u03b11-adrenergic receptor is a GPCR coupled exclusively to Gq. The vasoconstriction pathway:\n\nStep 1 — Receptor activation: Phenylephrine binds \u03b11 → conformational change → Gq activation → G\u03b1q-GTP dissociates from G\u03b2\u03b3.\n\nStep 2 — PLC activation: G\u03b1q activates phospholipase C (PLC-\u03b2) on the inner membrane leaflet.\n\nStep 3 — PIP₂ hydrolysis: PLC cleaves membrane phospholipid PIP₂ into two second messengers: IP₃ (soluble, diffuses into cytoplasm) and DAG (remains membrane-bound).\n\nStep 4 — Ca\u00b2\u207a release: IP₃ binds IP₃ receptors on SR → Ca\u00b2\u207a floods into cytoplasm.\n\nStep 5 — MLCK activation: Ca\u00b2\u207a binds calmodulin (4 Ca\u00b2\u207a per calmodulin) → Ca\u00b2\u207a-calmodulin complex activates myosin light chain kinase (MLCK).\n\nStep 6 — Contraction: MLCK phosphorylates myosin light chains → myosin ATPase activated → actin-myosin cross-bridge cycling → sustained vascular smooth muscle contraction.\n\nSimultaneously, DAG activates PKC, which sustains contraction via Rho kinase-mediated calcium sensitization (inhibits myosin light chain phosphatase, maintaining phosphorylation even as Ca\u00b2\u207a falls). This is why \u03b11 vasoconstriction is sustained.\n\nBaroreceptor reflex: ↑MAP → ↑carotid sinus stretch → ↑CN IX (glossopharyngeal) afferent firing → NTS → ↑CN X (vagus) efferent → M2 activation on SA node → GIRK channel opening → K\u207a efflux → bradycardia. This is physiologic, not toxic.",
  dosing: [
    { ind: "Hypotension Bolus", dose: "50–200 mcg IV", notes: "Push dose. Onset 30–60 sec. Repeat q1–2 min PRN. Common in OR and procedural settings.", clr: "ac" },
    { ind: "Vasopressor Infusion", dose: "40–360 mcg/min", notes: "Titrate to MAP ≥65. Pure afterload agent. No direct cardiac stimulation.", clr: "wn" },
    { ind: "Spinal Hypotension (OB)", dose: "100–200 mcg bolus, then 25–50 mcg/min", notes: "First-line vasopressor in obstetric spinal anesthesia. Preserves uterine blood flow better than ephedrine.", clr: "pr" },
    { ind: "Nasal Decongestant", dose: "0.25–1% topical", notes: "Mucosal vasoconstriction. Before nasotracheal intubation (combined with lidocaine).", clr: "pk" },
  ],
  kin: { onset: "IV: 30–60 sec", onsetD: "Rapid direct receptor binding", peak: "1–2 min", peakD: "Peak vasoconstriction", dur: "15–20 min (bolus)", durD: "Longer than catecholamines (no COMT metabolism)", vd: "Moderate", pb: "~95%", hl: "2.5–3 hours", csht: "N/A", cl: "Hepatic MAO", model: "Two-compartment" },
  metab: "Critical structural difference from catecholamines: phenylephrine has only ONE hydroxyl group on its benzene ring (meta position) vs two for catecholamines (catechol ring = 3,4-dihydroxy). This means NO COMT metabolism.\n\nPrimary: MAO (monoamine oxidase) in the liver and GI tract. Intestinal MAO causes extensive first-pass metabolism (oral bioavailability only ~38%).\n\nSecondary: hepatic sulfotransferases (conjugation).\n\nThis single-hydroxyl structure gives phenylephrine a longer duration of action (15–20 min) compared to catecholamines like NE (1–2 min), which are rapidly degraded by BOTH MAO and COMT.\n\nNo active metabolites. Renal excretion of metabolites.\n\nMAOI interaction: blocks primary degradation pathway → dramatically prolonged and potentiated pressor effect → hypertensive crisis. Use vasopressin instead.",
  warn: [
    { tp: "bb", ti: "Reflex Bradycardia", tx: "Expected baroreceptor response to ↑SVR. Clinically significant if HR drops below 50. Can worsen cardiac output in patients dependent on rate." },
    { tp: "ci", ti: "Severe Aortic Stenosis", tx: "These patients are preload-dependent and afterload-sensitive. Acute ↑SVR may precipitate decompensation, though moderate PE use is sometimes necessary." },
    { tp: "cau", ti: "MAOI Interaction", tx: "MAO is the PRIMARY metabolic pathway. MAOIs → severely potentiated and prolonged effect. Contraindicated or use with extreme caution." },
    { tp: "cau", ti: "Decreased Cardiac Output", tx: "Pure afterload increase + reflex bradycardia → ↓CO. Problematic in patients with poor contractile reserve (cardiogenic shock, severe HF)." },
    { tp: "cau", ti: "Uterine Artery Constriction", tx: "High doses can ↓uteroplacental blood flow. Use lowest effective dose in OB. Despite this concern, PE is still preferred over ephedrine for OB spinal hypotension." },
  ],
  ix: [
    { dr: "MAOIs", ef: "Block primary metabolic pathway → dramatically potentiated/prolonged effect. Hypertensive crisis. Avoid or use vasopressin.", sv: "high" },
    { dr: "Oxytocin", ef: "Additive hypotension when oxytocin given (vasodilation) → may need increased PE dose. Common OB interaction.", sv: "mod" },
    { dr: "Beta-Blockers", ef: "Exaggerated reflex bradycardia + enhanced hypertension (unopposed \u03b11 effect amplified).", sv: "mod" },
  ],
  pearls: [
    { ti: "Pure \u03b11 = Pure Afterload", tx: "No \u03b2 activity means no inotropy, no chronotropy. ↑SVR + reflex ↓HR = can ↓CO. Use when you want MAP without cardiac stimulation." },
    { ti: "OB Spinal: PE > Ephedrine", tx: "PE is first-line for spinal hypotension in C-section. Ephedrine crosses placenta more → fetal tachycardia + acidosis. PE preserves fetal pH better." },
    { ti: "Structure Determines Metabolism", tx: "One hydroxyl (non-catecholamine) = no COMT = longer duration (15–20 min vs 1–2 min for NE). Interview: 'Why does phenylephrine last longer than norepinephrine?'" },
    { ti: "Push-Dose Pressor", tx: "Phenylephrine 100 mcg IV is the classic push-dose pressor for acute hypotension (induction, spinal). Onset 30–60s, duration 15 min. Know how to make it from a 10 mg/mL vial." },
    { ti: "Baroreceptor Reflex Demonstration", tx: "The reflex bradycardia from PE is the cleanest demonstration of the baroreceptor reflex in clinical practice. Interviewers love asking about this pathway." },
  ],
  intQs: [
    { q: "BP drops to 75/40 after spinal for C-section. What's your first vasopressor?", a: "Phenylephrine 100–200 mcg IV bolus. PE is first-line over ephedrine for OB spinal hypotension. Better fetal acid-base status, less placental transfer, and the ↑SVR directly counters the sympathectomy-induced vasodilation." },
    { q: "Why does phenylephrine decrease cardiac output?", a: "Two mechanisms: (1) Pure \u03b11 → ↑afterload without ↑contractility = ↑resistance against which the LV must eject. (2) Baroreceptor-mediated reflex bradycardia → ↓HR. CO = HR \u00d7 SV, and both components decrease. This is expected pharmacology, not toxicity." },
    { q: "Patient on phenelzine (MAOI) needs a vasopressor. Can you use phenylephrine?", a: "NO — contraindicated. MAOIs block MAO, the primary metabolic pathway for PE. PE accumulates → severe hypertensive crisis. Use vasopressin instead (non-adrenergic pathway, not metabolized by MAO or COMT)." },
  ],
},{
  id: "ephedrine", name: "Ephedrine", brand: "Generic",
  tags: ["Mixed-Acting Sympathomimetic", "Non-Catecholamine", "\u03b1+\u03b2 Agonist", "Indirect + Direct"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Mixed-acting sympathomimetic (direct + indirect)", "Primary Targets": "\u03b11, \u03b21, \u03b22 (direct agonist) + presynaptic NE release (indirect)", "Action": "Direct receptor agonist AND indirect NE-releasing agent", "G-Proteins": "\u03b11=Gq, \u03b21/\u03b22=Gs", "Structure": "Non-catecholamine (no COMT metabolism, oral bioavailability)", "Key Feature": "Dual mechanism: 25% direct + 75% indirect (NE release via VMAT2 reversal)" },
  moa: "Ephedrine has a unique dual mechanism of action:\n\n1. INDIRECT (75% of effect): Enters presynaptic nerve terminal via uptake-1 (NET) → displaces norepinephrine from storage vesicles by reversing VMAT2 (vesicular monoamine transporter 2) → NE floods into synaptic cleft → activates postsynaptic \u03b1 and \u03b2 receptors.\n\n2. DIRECT (25% of effect): Directly binds and activates \u03b11, \u03b21, and \u03b22 adrenergic receptors (weak partial agonist activity).\n\nHemodynamic profile: ↑HR (\u03b21 + NE-mediated), ↑contractility (\u03b21), ↑SVR (\u03b11), ↑MAP. Preserves cardiac output better than pure \u03b11 agonists.\n\nTACHYPHYLAXIS: Repeated doses cause diminished response because:\n(1) Presynaptic NE stores become depleted (primary mechanism) — if you've released all stored NE, there's nothing left to displace.\n(2) Receptor desensitization (minor contributor).\nThis is why ephedrine becomes ineffective after 3–4 boluses and you should switch to phenylephrine or epinephrine.",
  recPhys: "The indirect NE-releasing mechanism makes ephedrine fundamentally different from direct-acting agents:\n\nStep 1 — Neuronal uptake: Ephedrine enters the presynaptic adrenergic nerve terminal via NET (norepinephrine transporter / uptake-1). This is the same transporter that recycles released NE back into the terminal.\n\nStep 2 — VMAT2 reversal: Inside the terminal, ephedrine interacts with VMAT2 (vesicular monoamine transporter 2), which normally packages NE into vesicles. Ephedrine reverses this transporter, causing NE to flood out of vesicles into the cytoplasm.\n\nStep 3 — NE efflux: Elevated cytoplasmic NE reverses NET itself → NE flows OUT of the terminal into the synaptic cleft (non-exocytic release, NOT calcium-dependent vesicle fusion).\n\nStep 4 — Receptor activation: Released NE + direct ephedrine binding activates post-synaptic receptors: \u03b11-Gq (↑SVR), \u03b21-Gs (↑HR, ↑contractility), \u03b22-Gs (↑bronchodilation).\n\nCritical implications:\n• TCAs/cocaine block NET → ephedrine cannot enter the terminal → indirect mechanism abolished → markedly reduced effect\n• Reserpine depletes vesicular NE stores → nothing to release → ephedrine ineffective\n• MAOIs increase cytoplasmic NE → more available for release → exaggerated hypertensive response\n• Repeated dosing depletes NE stores → tachyphylaxis (classic interview question)",
  dosing: [
    { ind: "Acute Hypotension", dose: "5–10 mg IV bolus", notes: "Onset 1–2 min. Repeat q3–5 min PRN. Max ~50 mg before switching agents (tachyphylaxis).", clr: "ac" },
    { ind: "Spinal Hypotension", dose: "5–10 mg IV", notes: "Second-line to phenylephrine in OB. Preserves HR/CO but crosses placenta → fetal tachycardia/acidosis.", clr: "wn" },
    { ind: "Bronchospasm (oral)", dose: "25–50 mg PO q4–6h", notes: "Non-catecholamine → oral bioavailability. Largely replaced by selective \u03b22 agonists.", clr: "pr" },
  ],
  kin: { onset: "IV: 1–2 min. IM: 10–20 min", onsetD: "Indirect mechanism requires neuronal uptake + NE displacement", peak: "2–5 min IV", peakD: "Time to achieve maximal NE release", dur: "10–15 min (bolus)", durD: "Longer than catecholamines (non-catecholamine structure)", vd: "3–6 L/kg", pb: "Low", hl: "3–6 hours", csht: "N/A", cl: "Hepatic MAO + renal unchanged", model: "Two-compartment" },
  metab: "Non-catecholamine structure (no catechol ring = no COMT metabolism), explaining oral bioavailability and longer duration.\n\nPrimary: hepatic MAO oxidative deamination + N-demethylation.\nSecondary: 40–70% excreted unchanged in urine (pH-dependent: acidic urine increases excretion).\n\nNo active metabolites.\n\nHalf-life 3–6 hours — significantly longer than catecholamines (minutes).\n\nKey drug interaction: MAOIs block MAO degradation of both ephedrine AND the released NE → severe hypertensive crisis from dual potentiation. Wait 2–3 weeks after MAOI discontinuation.",
  warn: [
    { tp: "bb", ti: "Tachyphylaxis", tx: "Repeated doses deplete presynaptic NE stores. Effect diminishes after 3–4 boluses. Switch to direct-acting agents (phenylephrine, epinephrine) if this occurs." },
    { tp: "ci", ti: "MAOI Interaction", tx: "Dangerous potentiation. MAOIs block degradation of displaced NE + block ephedrine metabolism. Can cause severe hypertensive crisis, ICH, death." },
    { tp: "cau", ti: "Cocaine/TCA Interaction", tx: "Block NET (uptake-1) → ephedrine cannot enter nerve terminal → indirect mechanism abolished. Effect markedly reduced. Switch to direct-acting agents." },
    { tp: "cau", ti: "Fetal Effects (OB)", tx: "Crosses placenta more readily than phenylephrine → fetal \u03b2 stimulation → tachycardia + metabolic acidosis. PE preferred in OB spinal hypotension." },
  ],
  ix: [
    { dr: "MAOIs", ef: "Dangerous dual potentiation: blocks degradation of both ephedrine and displaced NE. Hypertensive crisis.", sv: "high" },
    { dr: "TCAs / Cocaine", ef: "Block NET → indirect mechanism abolished → markedly reduced effect. Use direct-acting agents instead.", sv: "high" },
    { dr: "Reserpine", ef: "Depletes vesicular NE stores → nothing to release → ephedrine ineffective.", sv: "mod" },
    { dr: "Volatile Anesthetics", ef: "Catecholamine sensitization (from released NE) → dysrhythmia risk, though less than with exogenous catecholamines.", sv: "mod" },
  ],
  pearls: [
    { ti: "75% Indirect / 25% Direct", tx: "Most of ephedrine's effect comes from releasing stored NE, not direct receptor binding. This explains tachyphylaxis (NE depletion) and drug interactions (NET blockers)." },
    { ti: "Tachyphylaxis Mechanism", tx: "After 3–4 boluses, NE stores are depleted. No NE to release = no indirect effect. Switch to phenylephrine (pure direct) or epinephrine (direct agonist)." },
    { ti: "PE vs Ephedrine in OB", tx: "PE: first-line. Less placental transfer, better fetal pH. Ephedrine: preserves CO/HR (useful if bradycardia present) but fetal tachycardia/acidosis risk." },
    { ti: "Why NET Blockers Matter", tx: "TCAs and cocaine block the uptake-1 transporter that ephedrine needs to enter the nerve terminal. No entry = no NE release = minimal effect. Classic pharmacology concept." },
  ],
  intQs: [
    { q: "You give ephedrine 10 mg x3 for post-spinal hypotension and the patient stops responding. Why?", a: "Tachyphylaxis from NE store depletion. Ephedrine's primary mechanism (75%) is indirect NE release via VMAT2 reversal. After 3–4 doses, presynaptic vesicular NE is exhausted. Switch to phenylephrine (direct \u03b11) or epinephrine (direct \u03b1+\u03b2)." },
    { q: "Patient on amitriptyline (TCA) needs a vasopressor. Can you use ephedrine?", a: "Ephedrine will be markedly less effective. TCAs block NET, preventing ephedrine from entering nerve terminals and displacing NE. Use phenylephrine (direct \u03b11 agonist) or norepinephrine (direct-acting, doesn't require NET for its agonist effect)." },
    { q: "Ephedrine vs phenylephrine — when do you choose each?", a: "Ephedrine: when you want ↑MAP + ↑HR + preserved CO (first few doses before tachyphylaxis). PE: when you want pure ↑SVR and can tolerate reflex bradycardia and ↓CO. In OB: PE first-line (better fetal outcomes). In bradycardic hypotension: ephedrine may be preferred (maintains HR)." },
  ],
},{
  id: "glycopyrrolate", name: "Glycopyrrolate", brand: "Robinul",
  tags: ["Anticholinergic", "Muscarinic Antagonist", "Quaternary Amine", "Parasympatholytic"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Synthetic quaternary ammonium antimuscarinic", "Primary Target": "M1, M2, M3 muscarinic receptors (competitive antagonist)", "Action": "Blocks ACh at muscarinic receptors — preferential M1/M3 selectivity", "G-Proteins": "Blocks M2 (Gi) and M1/M3 (Gq) signaling", "Structure": "Quaternary ammonium → CANNOT cross BBB (no CNS effects)", "Key Feature": "Peripheral anticholinergic without central side effects" },
  moa: "Glycopyrrolate is a synthetic quaternary ammonium antimuscarinic agent. It competitively antagonizes acetylcholine at muscarinic receptors with preferential affinity for M1 and M3 subtypes.\n\nM2 blockade (SA node): Same vagolytic mechanism as atropine — blocks Gi signaling, removes GIRK channel K\u207a efflux, restores cAMP/If → ↑HR. However, glycopyrrolate produces LESS tachycardia than atropine because it has relatively lower M2 affinity and slower onset at the SA node.\n\nM3 blockade (glands/smooth muscle): Blocks Gq/PLC/IP₃ pathway → potent antisialagogue (reduces salivary, bronchial, gastric secretions), reduces GI motility, bronchodilation.\n\nThe CRITICAL structural difference: quaternary nitrogen bears a permanent positive charge → cannot cross lipid bilayer membranes → CANNOT cross the blood-brain barrier. This eliminates ALL central anticholinergic effects (confusion, agitation, sedation, hallucinations, central fever). This is the single most important distinction from atropine for interview purposes.",
  recPhys: "The quaternary ammonium structure defines glycopyrrolate's pharmacology:\n\nStructure: The nitrogen atom has four carbon substituents, creating a permanent positive charge (quaternary amine). Atropine, in contrast, has three substituents (tertiary amine) and can exist in uncharged form at physiologic pH → crosses BBB.\n\nPeripheral M2 (SA node, Gi-coupled): Glycopyrrolate blocks vagal input but with slower onset (2–3 min vs 30–60 sec for atropine) and produces a more gradual, moderate heart rate increase. The vagolytic effect is present but less dramatic.\n\nPeripheral M3 (glands, Gq-coupled): Glycopyrrolate is actually a MORE POTENT antisialagogue than atropine. It reduces salivary secretion volume by ~80%, making it the preferred agent for reducing secretions before intubation, with fiberoptic procedures, and with ketamine administration.\n\nGastric acid: M3/M1 blockade on parietal cells → ↓acid secretion + ↓volume. M1 blockade on enterochromaffin cells → ↓histamine release. This is why glycopyrrolate was originally developed as an anti-ulcer medication.\n\nNo CNS effects: Cannot produce central anticholinergic syndrome (confusion, agitation, hallucinations, hyperthermia). If a patient develops central anticholinergic toxicity, physostigmine is the treatment (tertiary amine AChE inhibitor that crosses BBB).",
  dosing: [
    { ind: "Antisialagogue", dose: "0.2 mg IV", notes: "Standard perioperative dose. Give 15–30 min before induction for optimal drying effect.", clr: "ac" },
    { ind: "NMB Reversal Adjunct", dose: "0.2 mg per 1 mg neostigmine", notes: "0.2 mg glyco per 1 mg neostigmine. Onset matches neostigmine better than atropine for sustained effect.", clr: "wn" },
    { ind: "Bradycardia", dose: "0.1–0.2 mg IV", notes: "Slower onset than atropine (2–3 min vs 30–60 sec). Less tachycardia. Use when moderate vagolysis is adequate.", clr: "pr" },
    { ind: "Chronic Drooling/Secretions", dose: "1–2 mg PO TID", notes: "Off-label. Quaternary structure limits GI absorption (~10% bioavailability) but adequate for local GI/salivary effects.", clr: "pk" },
  ],
  kin: { onset: "IV: 2–3 min", onsetD: "Slower than atropine (30–60 sec)", peak: "5–10 min", peakD: "Gradual vagolytic effect", dur: "2–4 hours", durD: "Longer than atropine (60–120 min)", vd: "0.42 L/kg", pb: "Low", hl: "0.6–1.2 hours", csht: "N/A", cl: "Primarily renal unchanged", model: "Multi-compartment" },
  metab: "Minimal hepatic metabolism — this is the key pharmacokinetic distinction.\n\n80% excreted UNCHANGED in urine via glomerular filtration + tubular secretion.\n10–20% biliary excretion.\nMinimal CYP450 involvement.\n\nNo active metabolites.\n\nRenal impairment: significant accumulation since primary excretion is renal unchanged. Dose reduction required in CKD/AKI. Atropine may be preferred in severe renal failure (50/50 hepatic/renal).\n\nNot removed by hemodialysis (too large, charged molecule).\n\nDuration is LONGER than atropine (2–4h vs 1–2h) despite shorter elimination half-life, because glycopyrrolate's effect at the receptor outlasts its plasma concentration (slow receptor dissociation).",
  warn: [
    { tp: "cau", ti: "Renal Dosing Required", tx: "80% renal excretion unchanged. Accumulates in CKD/AKI → prolonged anticholinergic effects. Reduce dose or use atropine (50% hepatic metabolism)." },
    { tp: "cau", ti: "Urinary Retention", tx: "M3 blockade relaxes detrusor → retention risk. Caution in BPH, neurogenic bladder." },
    { tp: "cau", ti: "Narrow-Angle Glaucoma", tx: "Mydriasis from M3 blockade → ↑IOP risk. Relative contraindication (same as atropine)." },
    { tp: "cau", ti: "GI Ileus", tx: "↓GI motility from M3 blockade. Caution in patients with existing ileus or bowel obstruction." },
  ],
  ix: [
    { dr: "Neostigmine", ef: "Standard pairing: glyco 0.2 mg per neostigmine 1 mg. Counters muscarinic side effects of AChE inhibition.", sv: "high" },
    { dr: "Other Anticholinergics", ef: "Additive peripheral effects: tachycardia, urinary retention, ileus, ↓secretions. Watch total anticholinergic burden.", sv: "mod" },
    { dr: "Potassium Chloride (oral)", ef: "Slowed GI transit from glycopyrrolate → prolonged KCl contact with mucosa → ulceration risk.", sv: "mod" },
  ],
  pearls: [
    { ti: "Quaternary = No BBB Crossing", tx: "Permanent positive charge cannot cross lipid bilayer. Zero CNS effects (no confusion, agitation, hallucinations). This is the #1 reason to choose glycopyrrolate over atropine when CNS effects are undesirable." },
    { ti: "Better Antisialagogue Than Atropine", tx: "Glycopyrrolate is a more potent drying agent despite being less potent as a vagolytic. Preferred for: fiberoptic intubation prep, ketamine premedication, excessive secretions." },
    { ti: "Glyco vs Atropine: The Interview Table", tx: "Onset: Glyco 2–3 min vs Atropine 30–60 sec. BBB: Glyco NO vs Atropine YES. Tachycardia: Glyco less vs Atropine more. Duration: Glyco longer. Antisialagogue: Glyco better. Renal: Glyco 80% unchanged vs Atropine 50%." },
    { ti: "Neostigmine Pairing", tx: "0.2 mg glyco per 1 mg neostigmine. Glycopyrrolate's onset (2–3 min) better matches neostigmine's onset than atropine's faster onset, providing more sustained protection against muscarinic effects." },
    { ti: "Renal Failure Consideration", tx: "80% excreted unchanged in urine. In CKD/ESRD: accumulates → prolonged effect. Switch to atropine (50% hepatic) or reduce dose significantly." },
  ],
  intQs: [
    { q: "Patient needs antisialagogue before fiberoptic intubation. Atropine or glycopyrrolate?", a: "Glycopyrrolate. Superior antisialagogue effect (more potent M3 blockade at glands). No CNS effects (quaternary amine, no BBB crossing). Less tachycardia. Longer duration. Give 0.2 mg IV 15–30 min before procedure." },
    { q: "Why can't glycopyrrolate cross the blood-brain barrier?", a: "Quaternary ammonium structure: the nitrogen has 4 carbon substituents creating a permanent positive charge at any pH. Charged molecules cannot cross lipid bilayer membranes. Atropine is tertiary (3 substituents), can be uncharged at physiologic pH, and freely crosses the BBB." },
    { q: "Patient in renal failure needs an anticholinergic. What's your concern with glycopyrrolate?", a: "80% is excreted unchanged in urine. Renal failure → drug accumulation → prolonged anticholinergic effects (tachycardia, urinary retention, ileus). Consider atropine instead (50% hepatic metabolism, 50% renal) or significantly reduce glycopyrrolate dose." },
  ],
},{
  id: "hydralazine", name: "Hydralazine", brand: "Apresoline",
  tags: ["Direct Vasodilator", "Arteriolar Selective", "Non-Adrenergic", "Hydrazinophthalazine"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Direct-acting arteriolar vasodilator (hydrazinophthalazine)", "Primary Target": "Vascular smooth muscle — arteriolar > venous", "Action": "Multiple mechanisms: ↑NO/cGMP, interference with IP₃-mediated Ca\u00b2\u207a release, K\u207a channel opening", "G-Protein": "Non-receptor mechanism (downstream of GPCR signaling)", "Selectivity": "Arteriolar >> venous (minimal preload reduction)", "Key Feature": "Arteriolar selectivity + reflex tachycardia + pregnancy safe" },
  moa: "Hydralazine produces arteriolar vasodilation through multiple interconnected mechanisms that converge on reducing intracellular calcium in vascular smooth muscle:\n\n1. NO/cGMP pathway: Stimulates endothelial NO release → NO diffuses into vascular smooth muscle → activates soluble guanylate cyclase (sGC) → GTP → cGMP → activates protein kinase G (PKG) → inhibits Ca\u00b2\u207a release from SR + stimulates Ca\u00b2\u207a reuptake → ↓intracellular Ca\u00b2\u207a → smooth muscle relaxation.\n\n2. IP₃ interference: Directly interferes with IP₃-mediated Ca\u00b2\u207a release from the SR, blocking the Gq/PLC downstream pathway without blocking the receptor itself.\n\n3. K\u207a channel opening: Opens KATP channels → K\u207a efflux → hyperpolarization → voltage-gated Ca\u00b2\u207a channels close → ↓Ca\u00b2\u207a entry.\n\n4. PDE inhibition: May inhibit phosphodiesterase (PDE), preventing cGMP degradation and prolonging the vasodilatory signal.\n\nCritical selectivity: Acts on ARTERIOLES >> veins. This means: ↓SVR and ↓afterload with minimal ↓preload. The preserved preload triggers robust REFLEX TACHYCARDIA and increased cardiac output via the baroreceptor reflex.",
  recPhys: "The arteriolar selectivity creates a distinctive hemodynamic profile:\n\nArteriolar vasodilation: Hydralazine's mechanisms (↑cGMP, IP₃ blockade, KATP opening) primarily affect arteriolar smooth muscle, which has higher resting tone and more dependence on IP₃-mediated Ca\u00b2\u207a cycling than venous smooth muscle.\n\nBaroreceptor reflex activation: ↓SVR → ↓MAP → ↓carotid/aortic baroreceptor stretch → ↓afferent firing to NTS → ↑sympathetic outflow + ↓vagal tone → reflex tachycardia + ↑contractility + ↑renin release.\n\nThis reflex sympathetic activation is why hydralazine is RARELY used as monotherapy. The compensatory response (tachycardia, ↑CO, RAAS activation, fluid retention) can offset the antihypertensive effect. In clinical practice, it is paired with a beta-blocker (controls tachycardia) and a diuretic (prevents fluid retention).\n\nPregnancy safety: Hydralazine does NOT affect uterine blood flow at therapeutic doses because uteroplacental circulation is already maximally dilated in pregnancy. The arteriolar vasodilation occurs in the systemic vascular bed while preserving uteroplacental perfusion. Combined with long safety track record, this makes it first-line for acute severe hypertension/preeclampsia (along with labetalol and nifedipine).",
  dosing: [
    { ind: "Hypertensive Emergency/Urgency", dose: "5–20 mg IV q20–30 min", notes: "Onset 5–20 min, peak 10–40 min. Unpredictable response — start low. Max 40 mg/dose.", clr: "ac" },
    { ind: "Preeclampsia / Eclampsia", dose: "5 mg IV, then 5–10 mg q20–30 min", notes: "First-line with labetalol for acute severe HTN in pregnancy. Target SBP <160, DBP <110.", clr: "wn" },
    { ind: "Chronic HTN (PO)", dose: "25–50 mg PO TID-QID", notes: "Max 300 mg/day. Doses >200 mg/day increase SLE-like syndrome risk. Usually with beta-blocker + diuretic.", clr: "pr" },
    { ind: "Heart Failure (with isosorbide dinitrate)", dose: "25–50 mg PO TID", notes: "Fixed-dose combo (BiDil). Reduces afterload + NO supplementation. Shown to benefit African American HF patients (A-HeFT trial).", clr: "pk" },
  ],
  kin: { onset: "IV: 5–20 min", onsetD: "Slower than most IV antihypertensives (compare nicardipine 1–5 min)", peak: "10–40 min IV", peakD: "Highly variable — unpredictable dosing", dur: "2–6 hours", durD: "Prolonged duration from active metabolite", vd: "1.5–4.5 L/kg", pb: "87%", hl: "2–8 hours (variable by acetylator phenotype)", csht: "N/A", cl: "Hepatic NAT2 acetylation", model: "Multi-compartment" },
  metab: "Hepatic metabolism via N-acetyltransferase 2 (NAT2) — the acetylation pathway. This is the source of critical pharmacogenomic variability:\n\nFast acetylators (~50% Caucasians, ~90% Japanese): Rapid hepatic metabolism → lower plasma levels, shorter half-life (2–4h), may need higher doses.\n\nSlow acetylators (~50% Caucasians, ~10% Japanese): Reduced NAT2 activity → higher plasma levels, longer half-life (4–8h), greater drug exposure, HIGHER RISK of SLE-like syndrome.\n\nThe SLE-like syndrome (drug-induced lupus): Hydralazine is metabolized to reactive intermediates that bind to nuclear proteins, creating neo-antigens. Anti-histone antibodies develop. Risk increases with: doses >200 mg/day, slow acetylator phenotype, female sex, HLA-DR4. Presents with arthralgias, myalgias, pleuritis, pericarditis. Resolves with drug discontinuation (unlike idiopathic SLE, which does not resolve).\n\nAdditional: CYP3A4 involvement (minor), renal excretion of metabolites.",
  warn: [
    { tp: "bb", ti: "SLE-Like Syndrome", tx: "Drug-induced lupus with anti-histone antibodies. Risk: >200 mg/day, slow acetylators, female, HLA-DR4. Arthralgias, serositis, rash. Reversible on discontinuation." },
    { tp: "ci", ti: "Aortic Dissection", tx: "CONTRAINDICATED. Reflex tachycardia ↑dP/dt (rate of pressure rise) → worsens aortic shear stress and propagation. Use esmolol or labetalol instead." },
    { tp: "ci", ti: "Severe Tachycardia/ACS", tx: "Reflex sympathetic activation ↑myocardial O₂ demand. Dangerous in unstable angina/MI." },
    { tp: "cau", ti: "Unpredictable Onset/Response", tx: "Variable onset (5–20 min) and acetylator-dependent metabolism make titration difficult. Less predictable than nicardipine or clevidipine." },
    { tp: "cau", ti: "Reflex Tachycardia", tx: "Robust baroreceptor-mediated sympathetic activation. Pair with beta-blocker. Avoid in aortic dissection, ACS, tachyarrhythmias." },
  ],
  ix: [
    { dr: "Beta-Blockers", ef: "Beneficial pairing: beta-blocker controls reflex tachycardia. Standard combination for chronic HTN.", sv: "mod" },
    { dr: "Diuretics", ef: "Prevents hydralazine-induced fluid retention from RAAS activation. Enhances antihypertensive effect.", sv: "mod" },
    { dr: "Isosorbide Dinitrate", ef: "Fixed-dose combo (BiDil). Synergistic: hydralazine ↓afterload + ISDN ↓preload + supplemental NO. A-HeFT trial: mortality benefit in African American HF patients.", sv: "mod" },
  ],
  pearls: [
    { ti: "Arteriolar > Venous", tx: "Unlike nitroprusside (arterial + venous), hydralazine is arteriolar selective. Minimal preload reduction → robust reflex tachycardia. Never use as monotherapy — pair with beta-blocker." },
    { ti: "Pregnancy First-Line", tx: "Along with labetalol and nifedipine. Safe in all trimesters. Does not reduce uteroplacental blood flow at therapeutic doses. ACOG recommended." },
    { ti: "Aortic Dissection = Contraindicated", tx: "Reflex tachycardia increases dP/dt (rate of aortic pressure rise) → worsens shear stress on dissection flap. Use esmolol or labetalol (reduce HR first, then MAP)." },
    { ti: "Slow vs Fast Acetylators", tx: "NAT2 polymorphism. Slow acetylators: more drug exposure, higher SLE risk, longer half-life. Fast: may need higher doses. This is a classic pharmacogenomics interview question." },
    { ti: "BiDil (Hydralazine + ISDN)", tx: "A-HeFT trial: 43% reduction in mortality in self-identified African American patients with HFrEF. Hydralazine prevents nitrate tolerance by scavenging superoxide." },
  ],
  intQs: [
    { q: "Pregnant patient at 34 weeks with BP 178/112. What's your approach?", a: "Acute severe hypertension in preeclampsia. IV hydralazine 5 mg or IV labetalol 20 mg. Target SBP <160, DBP <110. Also give magnesium sulfate for seizure prophylaxis. Hydralazine is safe in pregnancy — does not reduce uteroplacental blood flow at therapeutic doses." },
    { q: "Patient with acute aortic dissection. Can you use hydralazine?", a: "Absolutely NOT. Hydralazine causes reflex tachycardia which increases dP/dt (rate of aortic pressure rise). This worsens shear stress on the dissection flap and promotes propagation. Use IV esmolol or labetalol first to reduce HR to <60, THEN add vasodilator (nicardipine or nitroprusside) if MAP still elevated." },
    { q: "Patient develops joint pain and pleuritis on chronic hydralazine. What's happening?", a: "Drug-induced lupus (SLE-like syndrome). Check anti-histone antibodies (positive in >95% of cases). Risk factors: dose >200 mg/day, slow NAT2 acetylator, female, HLA-DR4. Treatment: discontinue hydralazine — symptoms resolve over weeks to months. Unlike idiopathic SLE, drug-induced lupus does NOT cause renal or CNS involvement and resolves on discontinuation." },
  ],
},{
  id: "labetalol", name: "Labetalol", brand: "Trandate / Normodyne",
  tags: ["Combined \u03b1/\u03b2 Blocker", "Non-Selective \u03b2 + \u03b11", "Antihypertensive", "Adrenergic Antagonist"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Combined non-selective \u03b2 + selective \u03b11 adrenergic antagonist", "Primary Targets": "\u03b21, \u03b22 (antagonist) + \u03b11 (antagonist)", "Action": "Dual blockade: \u03b2 >> \u03b1 (ratio 7:1 IV, 3:1 PO)", "G-Proteins": "Blocks \u03b21/\u03b22 (Gs) + \u03b11 (Gq) signaling", "Selectivity": "\u03b2:\u03b1 ratio = 7:1 IV, 3:1 oral", "Key Feature": "Reduces BP without reflex tachycardia (combined \u03b1+\u03b2 blockade)" },
  moa: "Labetalol provides dual adrenergic blockade at both alpha and beta receptors:\n\n\u03b21/\u03b22 Antagonism (primary): Blocks Gs-coupled receptors → ↓adenylyl cyclase activity → ↓cAMP → ↓PKA. At the heart: ↓chronotropy (HR), ↓inotropy (contractility), ↓dromotropy (AV conduction). At the kidney: ↓renin release. Net: ↓CO and ↓RAAS activation.\n\n\u03b11 Antagonism (secondary): Blocks Gq-coupled receptors → prevents PLC/IP₃/Ca\u00b2\u207a cascade → prevents vasoconstriction → ↓SVR. This peripheral vasodilation component is what distinguishes labetalol from pure beta-blockers.\n\nThe dual blockade ratio is 7:1 (\u03b2:\u03b1) IV and 3:1 PO. This means beta-blockade predominates, but the alpha component provides critical vasodilation that:\n(1) Prevents the reflex tachycardia seen with pure vasodilators (hydralazine)\n(2) Prevents the ↑SVR seen with pure beta-blockers (compensatory \u03b1 vasoconstriction when \u03b2 is blocked)\n\nNet hemodynamic effect: ↓BP (via ↓SVR + ↓CO) with PRESERVED cardiac output (the \u03b1 vasodilation offsets the \u03b2-mediated CO reduction). Heart rate decreases modestly or remains stable.",
  recPhys: "Understanding why labetalol preserves cardiac output despite beta-blockade:\n\nPure beta-blockers (metoprolol, esmolol): Block \u03b21 → ↓HR + ↓contractility → ↓CO. This triggers baroreceptor-mediated sympathetic activation → ↑NE release → unopposed \u03b11 stimulation → ↑SVR. Net: CO falls, SVR rises, BP may not decrease significantly.\n\nLabetalol adds \u03b11 blockade: The \u03b11 component blocks the compensatory vasoconstriction → SVR decreases. Reduced afterload means the ventricle ejects more easily despite reduced contractility. This afterload reduction partially compensates for the \u03b21-mediated CO reduction, preserving overall cardiac output.\n\nDual Gq + Gs blockade: \u03b11 blockade prevents PLC → IP₃ → Ca\u00b2\u207a → MLCK pathway in vascular smooth muscle. \u03b21 blockade prevents adenylyl cyclase → cAMP → PKA pathway in cardiomyocytes. Both signaling cascades are suppressed simultaneously.\n\nPregnancy considerations: Labetalol does not significantly reduce uteroplacental blood flow because the \u03b11 blockade prevents vasoconstriction in the uteroplacental bed. It is first-line (along with nifedipine and hydralazine) for both acute and chronic hypertension in pregnancy. \u03b21 blockade: potential fetal bradycardia/hypoglycemia at high doses, but clinically manageable.",
  dosing: [
    { ind: "Hypertensive Emergency (IV bolus)", dose: "10–20 mg IV over 2 min, then 20–80 mg q10 min", notes: "Escalating dose protocol. Max 300 mg total. Onset 2–5 min.", clr: "ac" },
    { ind: "Hypertensive Emergency (infusion)", dose: "0.5–2 mg/min IV", notes: "Continuous infusion. Titrate to target BP. Alternative to bolus dosing.", clr: "wn" },
    { ind: "Preeclampsia / Pregnancy HTN", dose: "20 mg IV, then 20–40 mg q10–15 min", notes: "First-line IV antihypertensive in pregnancy. Max 300 mg. Target SBP <160, DBP <110.", clr: "pr" },
    { ind: "Chronic HTN (PO)", dose: "100–400 mg PO BID", notes: "Oral ratio 3:1 (\u03b2:\u03b1). Max 2400 mg/day. Take with food.", clr: "pk" },
    { ind: "Aortic Dissection (adjunct)", dose: "20 mg IV, then infusion 1–2 mg/min", notes: "Reduces both HR and BP. Target HR <60 first, then MAP 60–70. Often combined with esmolol for faster HR control.", clr: "dg" },
  ],
  kin: { onset: "IV: 2–5 min", onsetD: "Rapid onset for hypertensive emergencies", peak: "5–15 min IV", peakD: "Predictable dose-response", dur: "2–12 hours IV (dose-dependent)", durD: "Prolonged duration allows q10 min bolus dosing", vd: "3–16 L/kg", pb: "~50%", hl: "5.5–8 hours", csht: "N/A", cl: "Hepatic glucuronidation + CYP2D6", model: "Multi-compartment" },
  metab: "Extensive hepatic metabolism via two primary pathways:\n\n1. Glucuronidation (primary): Direct conjugation → inactive glucuronide metabolites → renal excretion. First-pass metabolism is significant (~75%), explaining low oral bioavailability (25%).\n\n2. CYP2D6 (secondary): Oxidative metabolism. CYP2D6 poor metabolizers may have higher plasma levels and exaggerated effects.\n\nNo active metabolites.\n\n55–60% renally excreted (as metabolites), 12–27% biliary excretion.\n\nHalf-life 5.5–8 hours. Duration of action often exceeds half-life (receptor binding kinetics).\n\nHepatic impairment: significantly increased bioavailability and prolonged effect. Reduce dose.\n\nRenal impairment: metabolites accumulate but are inactive. Generally no dose adjustment needed.\n\nCYP2D6 polymorphism: poor metabolizers (~7% Caucasians) may have exaggerated hypotensive effect.",
  warn: [
    { tp: "bb", ti: "Severe Bradycardia/Heart Block", tx: "\u03b21 blockade can cause symptomatic bradycardia, 2nd/3rd degree AV block. Avoid in pre-existing high-degree block without pacemaker." },
    { tp: "ci", ti: "Decompensated Heart Failure", tx: "\u03b21 blockade + negative inotropy can worsen acute HF. Contraindicated in decompensated/acute HF (chronic stable HF: beta-blockers are beneficial)." },
    { tp: "ci", ti: "Severe Asthma/Bronchospasm", tx: "Non-selective \u03b22 blockade → bronchoconstriction. Contraindicated in severe reactive airway disease. Use cardioselective beta-blocker if needed (metoprolol, esmolol)." },
    { tp: "ci", ti: "Cocaine Intoxication", tx: "CONTROVERSIAL. Traditional teaching: beta-blockers cause 'unopposed alpha stimulation' → worsened HTN/coronary vasospasm. However, labetalol's \u03b11 blockade theoretically mitigates this. Most guidelines still recommend avoiding beta-blockers in acute cocaine toxicity — use benzodiazepines, phentolamine, or nicardipine." },
    { tp: "cau", ti: "Rebound Hypertension", tx: "Chronic beta-blocker therapy causes \u03b2-receptor upregulation. Abrupt discontinuation → increased receptor density + catecholamine surge → rebound tachycardia and hypertension. Taper over 1–2 weeks." },
    { tp: "cau", ti: "Hypoglycemia Masking", tx: "\u03b2 blockade blunts tachycardia and tremor responses to hypoglycemia. Diaphoresis (cholinergic) is preserved. Critical in diabetic patients on insulin." },
  ],
  ix: [
    { dr: "Calcium Channel Blockers (non-DHP)", ef: "Additive negative chronotropy/dromotropy with verapamil/diltiazem. Risk of severe bradycardia, heart block, cardiac arrest.", sv: "high" },
    { dr: "Clonidine", ef: "Additive bradycardia. If both discontinued simultaneously: rebound hypertensive crisis from unopposed sympathetic surge.", sv: "high" },
    { dr: "Insulin / Sulfonylureas", ef: "\u03b2 blockade masks hypoglycemia symptoms (tachycardia, tremor). Diaphoresis preserved. Monitor glucose closely.", sv: "mod" },
    { dr: "CYP2D6 Inhibitors", ef: "Fluoxetine, paroxetine, bupropion inhibit CYP2D6 → increased labetalol levels → exaggerated effect.", sv: "mod" },
  ],
  pearls: [
    { ti: "7:1 \u03b2:\u03b1 Ratio (IV)", tx: "Beta-blockade predominates. The \u03b11 component prevents reflex tachycardia (unlike pure \u03b2-blockers) and provides vasodilation without compensatory SVR increase. Oral ratio is 3:1." },
    { ti: "Preserves Cardiac Output", tx: "Unlike pure beta-blockers (↓CO from ↓HR/contractility), labetalol's \u03b11 vasodilation reduces afterload, partially compensating for \u03b21-mediated CO reduction. Net CO is relatively preserved." },
    { ti: "Pregnancy Safe", tx: "First-line for both acute and chronic HTN in pregnancy. Does not reduce uteroplacental blood flow. Potential fetal bradycardia at high doses but clinically manageable." },
    { ti: "Cocaine: Still Controversial", tx: "Traditional teaching says avoid all beta-blockers with cocaine (unopposed alpha). Labetalol has \u03b11 blockade, but most guidelines still recommend against it. Use benzos + phentolamine + nicardipine." },
    { ti: "Rebound Hypertension", tx: "Chronic \u03b2 blockade causes receptor upregulation. Abrupt stop → catecholamine surge hits increased receptor density → severe rebound HTN/tachycardia. Always taper over 1–2 weeks." },
    { ti: "Aortic Dissection Role", tx: "Reduces BOTH HR (dP/dt) and BP. Can be used alone or with esmolol. Target HR <60 first, then MAP. Superior to hydralazine which causes reflex tachycardia." },
  ],
  intQs: [
    { q: "BP 210/120, HR 95, no end-organ damage yet. First-line IV agent?", a: "IV labetalol 20 mg over 2 min. Provides rapid, predictable BP reduction via dual \u03b1+\u03b2 blockade without reflex tachycardia. Escalate to 40–80 mg q10 min or start infusion 0.5–2 mg/min. Max 300 mg. Alternative: nicardipine infusion." },
    { q: "Why is labetalol preferred over metoprolol for hypertensive emergencies?", a: "Metoprolol is pure \u03b21-selective → reduces CO but triggers compensatory ↑SVR (baroreceptor reflex + unopposed \u03b11). Net BP reduction is modest. Labetalol blocks both \u03b2 AND \u03b11 → reduces CO AND SVR simultaneously → more effective BP reduction without compensatory vasoconstriction or reflex tachycardia." },
    { q: "Patient with cocaine-induced HTN and chest pain. Can you give labetalol?", a: "CONTROVERSIAL but most guidelines say AVOID beta-blockers in acute cocaine toxicity. Traditional concern: \u03b2 blockade removes \u03b22 vasodilation → unopposed \u03b1 vasoconstriction → worsened HTN + coronary spasm. Labetalol's \u03b11 blockade theoretically mitigates this, but evidence is limited. First-line: benzodiazepines (reduce sympathetic surge), then phentolamine or nicardipine if BP remains elevated." },
    { q: "Patient on chronic labetalol stops taking it before surgery. What's the concern?", a: "Rebound hypertension and tachycardia. Chronic \u03b2 blockade causes \u03b2-receptor upregulation (increased receptor density). Abrupt withdrawal → endogenous catecholamines act on more receptors → exaggerated response → hypertensive crisis, tachycardia, potential myocardial ischemia. Continue beta-blockers perioperatively or taper over 1–2 weeks before elective surgery." },
  ],
},
{
  id: "ketamine", name: "Ketamine", brand: "Ketalar",
  tags: ["Dissociative Anesthetic", "NMDA Antagonist", "Phencyclidine Derivative", "Analgesic"],
  systems: ["neuro", "pharm"], type: "medication",
  ov: { "Drug Class": "Phencyclidine derivative — dissociative anesthetic", "Primary Target": "NMDA receptor (non-competitive antagonist)", "Action": "Open-channel block of NMDA Ca\u00b2\u207a/Na\u207a channel + opioid receptor modulation + monoamine reuptake inhibition", "Ion Channel": "Blocks NMDA Ca\u00b2\u207a/Na\u207a influx → dissociation", "Formulation": "10, 50, 100 mg/mL solutions", "Schedule": "DEA Schedule III" },
  moa: "Ketamine is a phencyclidine (PCP) derivative that produces dissociative anesthesia — a unique cataleptic state of profound analgesia and amnesia with preserved airway reflexes and spontaneous ventilation (at appropriate doses).\n\nPRIMARY MECHANISM — NMDA Receptor Antagonism:\nKetamine is a non-competitive, use-dependent antagonist of the NMDA (N-methyl-D-aspartate) glutamate receptor. The NMDA receptor is a ligand-gated ion channel permeable to Ca\u00b2\u207a and Na\u207a. Under normal conditions, glutamate + glycine binding opens the channel, but Mg\u00b2\u207a blocks the pore at resting membrane potential (voltage-dependent block). When the neuron depolarizes (by AMPA receptor activation), Mg\u00b2\u207a is expelled, and Ca\u00b2\u207a/Na\u207a flow in — driving excitatory neurotransmission.\n\nKetamine enters the OPEN channel and binds the PCP site inside the pore (between Mg\u00b2\u207a site and selectivity filter). This is USE-DEPENDENT: the channel must open before ketamine can block it. Once bound, ketamine physically occludes ion flow, preventing Ca\u00b2\u207a/Na\u207a influx even when glutamate is present.\n\nNMDA blockade in the thalamus and limbic system produces the dissociative state: functional disconnection between thalamocortical and limbic systems. The patient appears conscious (eyes open, nystagmus, purposeful movements) but is dissociated from sensory input.\n\nSECONDARY MECHANISMS:\n• Opioid receptor modulation: weak agonist at mu (\u03bc) and kappa (\u03ba) opioid receptors → contributes to analgesia\n• Monoamine reuptake inhibition: blocks reuptake of norepinephrine, dopamine, and serotonin → sympathomimetic effects (indirect)\n• Sodium channel blockade: weak local anesthetic effect at high concentrations\n• HCN1 channel interaction: may contribute to hypnotic effect\n• Anti-inflammatory: suppresses NF-\u03baB, reduces TNF-\u03b1 and IL-6 production",
  recPhys: "NMDA Receptor Physiology — The Coincidence Detector:\n\nThe NMDA receptor requires TWO simultaneous conditions to open (hence 'coincidence detector'):\n1. Ligand binding: Glutamate (agonist site) + Glycine/D-serine (co-agonist site required)\n2. Membrane depolarization: Expels Mg\u00b2\u207a from the channel pore (voltage-dependent block)\n\nWhen both conditions are met: the channel opens and conducts Ca\u00b2\u207a and Na\u207a inward. The Ca\u00b2\u207a influx is critical — it activates CaMKII (calcium-calmodulin kinase II), which triggers:\n• Long-term potentiation (LTP) — synaptic strengthening, learning, memory formation\n• Central sensitization — wind-up phenomenon in dorsal horn (pain amplification)\n• Excitotoxicity — excessive Ca\u00b2\u207a → mitochondrial damage → neuronal death (stroke, TBI)\n\nKetamine's Clinical Relevance at Each Level:\n\nAnalgesia: NMDA blockade in the dorsal horn prevents central sensitization and wind-up. This is why sub-anesthetic ketamine (0.1–0.3 mg/kg/hr) is effective for opioid-resistant pain and reduces opioid requirements by 30–50% (opioid-sparing effect).\n\nNeuroprotection: By blocking excessive Ca\u00b2\u207a influx through NMDA channels, ketamine may limit excitotoxic injury. Theoretical benefit in TBI, status epilepticus (late/refractory stages).\n\nAntidepressant effect: NMDA blockade triggers a cascade: ↑BDNF (brain-derived neurotrophic factor) → ↑mTOR signaling → rapid synaptogenesis in prefrontal cortex. This produces antidepressant effects within 2–4 hours (vs. weeks for SSRIs). Esketamine (Spravato) is FDA-approved for treatment-resistant depression.\n\nSympathomimetic profile: Ketamine's monoamine reuptake inhibition centrally stimulates the sympathetic nervous system → ↑HR, ↑BP, ↑SVR. This is why ketamine is the induction agent of choice in hemodynamically unstable patients (trauma, hemorrhagic shock, tamponade). However, in catecholamine-depleted patients (end-stage septic shock, prolonged critical illness), the indirect mechanism fails and ketamine's direct myocardial depressant effect is unmasked → cardiovascular collapse.",
  dosing: [
    { ind: "IV Induction", dose: "1–2 mg/kg IV", notes: "Onset 30–60 sec. Duration 10–20 min. Dissociative dose. Preserves airway reflexes and ventilation (usually).", clr: "ac" },
    { ind: "IM Induction / Sedation", dose: "4–10 mg/kg IM", notes: "Onset 3–5 min. Duration 20–30 min. Useful when no IV access (pediatric, combative patient, field).", clr: "wn" },
    { ind: "Analgesic (Sub-dissociative)", dose: "0.1–0.3 mg/kg IV bolus or 0.1–0.3 mg/kg/hr infusion", notes: "Low-dose. Opioid-sparing 30–50%. Adjunct for acute pain, burns, trauma. No dissociation at this dose.", clr: "pr" },
    { ind: "RSI (Hemodynamically Unstable)", dose: "1–2 mg/kg IV", notes: "Agent of choice in shock/trauma. Maintains HR, BP, SVR via sympathomimetic effect. NOT in catecholamine-depleted patients.", clr: "ac" },
    { ind: "Status Epilepticus (Refractory)", dose: "1–4.5 mg/kg IV bolus, then 0.5–5 mg/kg/hr infusion", notes: "Third/fourth-line. NMDA antagonism targets glutamate excitotoxicity when GABA agents fail (receptor internalization).", clr: "wn" },
    { ind: "Procedural Sedation (Peds)", dose: "1–2 mg/kg IV or 4–5 mg/kg IM", notes: "Excellent for painful procedures. Pair with glycopyrrolate 0.01 mg/kg (antisialagogue) and midazolam 0.05 mg/kg (emergence prophylaxis).", clr: "pk" },
  ],
  kin: { onset: "IV: 30–60 sec. IM: 3–5 min", onsetD: "Rapid lipophilicity → fast CNS distribution", peak: "1 min IV, 5–20 min IM", peakD: "Redistribution-limited duration", dur: "10–20 min IV, 20–30 min IM", durD: "Terminated by redistribution (like thiopental), NOT metabolism", vd: "3 L/kg", pb: "12–47% (alpha-1 acid glycoprotein)", hl: "2–3 hours", csht: "N/A (redistribution-dependent)", cl: "Hepatic CYP3A4, CYP2B6", model: "Three-compartment" },
  metab: "Hepatic metabolism via CYP3A4 (major) and CYP2B6:\n\nPrimary pathway: N-demethylation to NORKETAMINE (active metabolite).\nNorketamine has ~30% the potency of ketamine at the NMDA receptor.\nNorketamine is further hydroxylated then conjugated (glucuronidation) for renal excretion.\n\nTermination of single-dose effect: REDISTRIBUTION (like thiopental) — rapid movement from CNS to muscle/fat. NOT metabolism.\n\nHalf-life: 2–3 hours (parent compound). Context-sensitive: prolonged infusions accumulate norketamine.\n\nHepatically impaired: reduced clearance, prolonged effect. No dose adjustment formally recommended but use with caution.\n\nRenal excretion: 90% as metabolites, <5% unchanged.\n\nStereochemistry: Racemic mixture of S(+) and R(−) enantiomers. S-ketamine (esketamine): 3–4x more potent at NMDA receptor, faster clearance, fewer psychomimetic effects. Available as Spravato (nasal spray, depression) and IV formulation in some countries.",
  warn: [
    { tp: "cau", ti: "Emergence Delirium / Psychomimetic Effects", tx: "Vivid dreams, hallucinations, delirium on emergence. Risk: adults > children, females > males, high doses, rapid administration. Prophylaxis: midazolam 0.03–0.05 mg/kg co-administration reduces incidence by ~50%." },
    { tp: "cau", ti: "Hypersalivation", tx: "Stimulates salivary and tracheobronchial secretions (cholinomimetic-like effect). Pre-treat with glycopyrrolate 0.2 mg or atropine 0.01 mg/kg. Excessive secretions can cause laryngospasm, especially in children." },
    { tp: "ci", ti: "Elevated ICP (Historical — NOW DEBATED)", tx: "Traditional teaching: ketamine raises ICP via cerebral vasodilation. Current evidence: in ventilated patients, ketamine does NOT significantly raise ICP and may actually be neuroprotective. No longer absolutely contraindicated in TBI when used with controlled ventilation. Still avoid in patients with obstructive hydrocephalus or space-occupying lesions without ICP monitoring." },
    { tp: "cau", ti: "Catecholamine-Depleted Patients", tx: "In end-stage shock / prolonged critical illness, catecholamine stores are exhausted. Without NE/DA to release, ketamine's indirect sympathomimetic mechanism fails. The direct myocardial depressant effect is UNMASKED → hypotension, cardiovascular collapse. Use with extreme caution." },
    { tp: "cau", ti: "Increased Myocardial O₂ Demand", tx: "↑HR + ↑BP + ↑contractility = ↑MVO₂. Avoid in severe CAD, aortic stenosis, or decompensated HF where myocardial oxygen supply-demand balance is critical." },
  ],
  ix: [
    { dr: "Benzodiazepines", ef: "Blunt emergence delirium/psychomimetic effects. Midazolam 0.03–0.05 mg/kg standard co-administration. Also reduces ketamine-induced nystagmus.", sv: "high" },
    { dr: "Glycopyrrolate / Atropine", ef: "Antisialagogue pairing. Glycopyrrolate preferred (no BBB crossing). Reduces hypersalivation and laryngospasm risk.", sv: "high" },
    { dr: "Volatile Anesthetics", ef: "May prolong ketamine duration. Additive sympathomimetic effect → dysrhythmia risk (especially halothane, less with modern agents).", sv: "mod" },
    { dr: "Propofol / Ketofol", ef: "Complementary hemodynamic profiles: propofol ↓BP/HR + ketamine ↑BP/HR = hemodynamic stability. Popular for procedural sedation. Typical ratio 1:1.", sv: "mod" },
    { dr: "Non-depolarizing NMBAs", ef: "Ketamine may enhance the duration of non-depolarizing NMBAs. Monitor train-of-four closely.", sv: "low" },
    { dr: "Thyroid Hormones", ef: "Excess thyroid hormone + ketamine → exaggerated sympathomimetic response → severe hypertension, tachycardia. Caution in thyrotoxicosis.", sv: "mod" },
  ],
  pearls: [
    { ti: "The Hemodynamically Stable Induction Agent", tx: "Ketamine is the go-to for induction in trauma, hemorrhagic shock, tamponade, and hemodynamically unstable patients. It maintains HR, BP, and SVR via indirect sympathomimetic effects. EXCEPT in catecholamine-depleted patients (end-stage sepsis, prolonged shock) where the indirect mechanism fails." },
    { ti: "ICP: The Myth That Won't Die", tx: "Traditional teaching says ketamine is contraindicated in elevated ICP. Current evidence (Zeiler 2014, Cohen 2015): in mechanically ventilated patients with controlled PaCO₂, ketamine does NOT significantly increase ICP and may be neuroprotective (NMDA-mediated excitotoxicity reduction). Still avoid in unmonitored, spontaneously breathing patients where PaCO₂ may rise." },
    { ti: "Bronchodilator Properties", tx: "Ketamine is a potent bronchodilator via: (1) direct smooth muscle relaxation, (2) ↑catecholamine release → \u03b2₂ bronchodilation, (3) possible anticholinergic contribution. Makes it ideal for status asthmaticus induction and sedation." },
    { ti: "Why Sub-Anesthetic Works for Pain", tx: "At 0.1–0.3 mg/kg/hr, ketamine blocks dorsal horn NMDA receptors → prevents central sensitization and wind-up → opioid-sparing 30–50%. Does NOT produce dissociation at these doses. Increasingly used for acute pain, burns, sickle cell crises." },
    { ti: "Dissociative vs. Standard Anesthesia", tx: "Dissociative anesthesia is NOT unconsciousness. It's a functional disconnection of thalamo-cortical from limbic pathways. Eyes open, nystagmus, muscle tone preserved, swallow/cough reflexes present (usually), spontaneous ventilation maintained. This is fundamentally different from GABA-ergic agents." },
    { ti: "Ketofol: Best of Both Worlds", tx: "1:1 mix of ketamine:propofol. Propofol provides smooth sedation + antiemetic + ↓BP. Ketamine provides analgesia + ↑BP + airway maintenance. Hemodynamic effects offset each other. Excellent for procedural sedation." },
    { ti: "Stereochemistry Matters", tx: "S-ketamine (esketamine): 3–4x more potent NMDA antagonist, faster hepatic clearance, fewer psychomimetic effects, faster recovery. Available as Spravato (intranasal) for treatment-resistant depression. R-ketamine: weaker NMDA antagonism but possibly better antidepressant with fewer side effects (under investigation)." },
  ],
  intQs: [
    { q: "25-year-old motorcycle crash, GCS 8, BP 78/40, HR 128, needs intubation. What induction agent?", a: "Ketamine 1–2 mg/kg IV. Hemodynamically unstable trauma patient — ketamine maintains HR, BP, and SVR via indirect sympathomimetic effects (monoamine reuptake inhibition → ↑circulating catecholamines). Preserves spontaneous ventilation as backup. Provides analgesia. Note: the old contraindication for TBI/elevated ICP is largely debunked in ventilated patients with controlled PaCO₂. Alternatives: etomidate (hemodynamically neutral but adrenal suppression debate)." },
    { q: "How does ketamine work at the NMDA receptor?", a: "Non-competitive, use-dependent open-channel block. The NMDA receptor is a ligand-gated ion channel permeable to Ca\u00b2\u207a and Na\u207a, requiring both glutamate binding AND membrane depolarization (to expel Mg\u00b2\u207a block). Ketamine enters the OPEN channel and binds the PCP site inside the pore, physically occluding ion flow. 'Use-dependent' means the channel must first open before ketamine can access its binding site — more active neurons are blocked preferentially." },
    { q: "Why would ketamine be dangerous in a patient who's been in septic shock for 5 days on multiple vasopressors?", a: "Catecholamine depletion. Ketamine's hemodynamic stability depends on its INDIRECT sympathomimetic mechanism — it blocks reuptake of NE and dopamine, increasing synaptic catecholamine levels. After days of maximal sympathetic activation in refractory shock, presynaptic catecholamine stores are exhausted. With nothing to release or preserve, the indirect mechanism fails, and ketamine's DIRECT myocardial depressant effect is unmasked → hypotension, potential cardiovascular collapse." },
    { q: "You're using sub-anesthetic ketamine for a burn patient. How does this work and what dose?", a: "0.1–0.3 mg/kg bolus then 0.1–0.3 mg/kg/hr infusion. At sub-dissociative doses, ketamine blocks NMDA receptors in the dorsal horn of the spinal cord, preventing central sensitization (wind-up phenomenon) and glutamate-mediated pain amplification. This reduces opioid requirements by 30–50% without producing dissociation or significant hemodynamic changes. Additional benefit: anti-inflammatory properties (↓NF-\u03baB, ↓TNF-\u03b1)." },
    { q: "A 4-year-old needs a laceration repair but has no IV access. How do you sedate them?", a: "Ketamine 4–5 mg/kg IM. Onset 3–5 min, duration 20–30 min. Pre-treat with glycopyrrolate 0.01 mg/kg IM (antisialagogue — prevents hypersalivation/laryngospasm) and consider midazolam 0.05 mg/kg (reduces emergence delirium). Ketamine provides dissociative anesthesia with preserved airway reflexes, spontaneous ventilation, and profound analgesia — ideal for pediatric procedural sedation without IV access." },
  ],
},{
  id: "succinylcholine", name: "Succinylcholine", brand: "Anectine / Quelicin",
  tags: ["Depolarizing NMBA", "Nicotinic Agonist", "Ultrashort-Acting", "RSI Paralytic"],
  systems: ["neuro", "pharm"], type: "medication",
  ov: { "Drug Class": "Depolarizing neuromuscular blocking agent (diacetylcholine)", "Primary Target": "Nicotinic ACh receptor (NMJ) — \u03b1₂\u03b2\u03b4\u03b5 subunits", "Action": "Agonist — mimics ACh, produces sustained depolarization", "Ion Channel": "Non-selective cation channel (Na\u207a/K\u207a)", "Structure": "Two ACh molecules linked end-to-end (bis-quaternary ammonium)", "Key Feature": "Only depolarizing NMBA in clinical use; fastest onset of any paralytic" },
  moa: "Succinylcholine (SCh) is structurally two acetylcholine molecules joined end-to-end, creating a bis-quaternary ammonium compound. It binds to one or both \u03b1-subunits of the nicotinic ACh receptor at the neuromuscular junction, mimicking the action of acetylcholine.\n\nPhase I Block (Depolarizing): SCh binds the nicotinic receptor → channel opens → Na\u207a influx + K\u207a efflux → endplate depolarization → initial muscle contraction (FASCICULATIONS). Unlike ACh (hydrolyzed in <1 ms by acetylcholinesterase at the cleft), SCh is NOT degraded by AChE — it persists at the receptor. The sustained depolarization holds the motor endplate at approximately -55 mV. Adjacent voltage-gated Na\u207a channels undergo prolonged inactivation (inactivation gate closes), preventing generation of new action potentials. Result: brief excitation → fasciculations → flaccid paralysis.\n\nThe receptor stays in the open/desensitized conformation until SCh diffuses away from the NMJ and is hydrolyzed by plasma cholinesterase (pseudocholinesterase/butyrylcholinesterase) in the plasma.\n\nPhase II Block: With prolonged or repeated exposure, the receptor transitions from a depolarized to a desensitized state. The endplate repolarizes but the receptor is conformationally unresponsive to ACh. Clinically resembles a non-depolarizing block: fade on TOF, post-tetanic potentiation. This occurs with doses >5–7 mg/kg or prolonged infusions.",
  recPhys: "The nicotinic ACh receptor at the adult NMJ is a pentameric ligand-gated ion channel with subunit composition \u03b1₂\u03b2\u03b4\u03b5 (fetal: \u03b1₂\u03b2\u03b4\u03b3 — the \u03b3 subunit is replaced by \u03b5 postnatally). The receptor has two ACh binding sites located at the \u03b1-\u03b4 and \u03b1-\u03b5 interfaces. BOTH sites must be occupied for channel opening.\n\nStep 1 — SCh Binding: SCh binds the \u03b1-\u03b4 and/or \u03b1-\u03b5 interfaces. The quaternary ammonium group mimics the trimethylammonium head of ACh, fitting the anionic binding pocket on the \u03b1-subunit.\n\nStep 2 — Channel Opening: Conformational change rotates the M2 transmembrane helices of all five subunits, opening the central cation pore (~6.5 \u00c5 diameter). Non-selective: Na\u207a influx (dominant, driving depolarization) + K\u207a efflux + Ca\u00b2\u207a influx.\n\nStep 3 — Endplate Depolarization: Motor endplate depolarizes from -90 mV toward -55 mV. If threshold is reached, voltage-gated Na\u207a channels in the perijunctional zone fire → action potential propagates along muscle fiber → FASCICULATION.\n\nStep 4 — Sustained Depolarization + Na\u207a Channel Inactivation: SCh does not dissociate rapidly. Endplate remains depolarized. Surrounding voltage-gated Na\u207a channels enter the INACTIVATED state (inactivation gate closed). No new action potentials can be generated despite continued endplate depolarization. Result: FLACCID PARALYSIS.\n\nStep 5 — Desensitization (Phase II): With prolonged exposure, the nAChR itself undergoes conformational change to a desensitized state — channel closes despite agonist still bound. The endplate repolarizes, but the receptor is refractory. Block now behaves like non-depolarizing block.\n\nHYPERKALEMIA MECHANISM: Each channel opening allows K\u207a efflux. Normal: serum K\u207a rises 0.5–1.0 mEq/L. In denervation injuries, burns, immobility, or upper motor neuron lesions: upregulation of extrajunctional (fetal-type, \u03b3-containing) nAChRs across the entire muscle surface → massive simultaneous K\u207a efflux from channels everywhere on the fiber (not just the endplate) → life-threatening hyperkalemia (can exceed 10–13 mEq/L) → cardiac arrest.",
  dosing: [
    { ind: "RSI Intubation", dose: "1–1.5 mg/kg IV", notes: "Standard: 1 mg/kg. Most practitioners use 1.5 mg/kg for optimal conditions. Provides complete paralysis in 45–60 sec.", clr: "ac" },
    { ind: "Laryngospasm Rescue", dose: "0.5 mg/kg IV (or 4 mg/kg IM if no IV)", notes: "Lower dose sufficient to break spasm. IM onset ~3–4 min. Some use 0.1–0.2 mg/kg IV (subparalyzing) to relax cords.", clr: "wn" },
    { ind: "Continuous Infusion (rare)", dose: "2.5 mg/min (diluted to 1–2 mg/mL)", notes: "Rarely used. Phase II block risk with prolonged use. Requires TOF monitoring. Largely replaced by short-acting NDMBAs.", clr: "pr" },
  ],
  kin: { onset: "30–60 sec IV", onsetD: "Fastest onset of any NMBA — basis for RSI use", peak: "1 min", peakD: "Complete paralysis within 60 sec at intubating dose", dur: "8–15 min", durD: "Ultrashort — spontaneous recovery without reversal", vd: "Low (does not extensively distribute — hydrophilic)", pb: "Minimal", hl: "2–4 min (plasma cholinesterase hydrolysis)", csht: "N/A", cl: "Plasma cholinesterase (butyrylcholinesterase)", model: "Rapid hydrolysis — effect terminated by enzymatic degradation, not redistribution" },
  metab: "SCh is rapidly hydrolyzed by PLASMA CHOLINESTERASE (pseudocholinesterase / butyrylcholinesterase / BChE), which is synthesized in the liver and circulates in plasma. Importantly, plasma cholinesterase is NOT present at the neuromuscular junction — AChE at the NMJ does not degrade SCh. This means the drug effect ends only when SCh diffuses away from the NMJ back into plasma where it encounters BChE.\n\nHydrolysis pathway: Succinylcholine → succinylmonocholine (weak NMBA, 1/20th activity) + choline → succinic acid + choline. Rapid: 90–95% hydrolyzed before reaching the NMJ (only 5–10% of administered dose actually reaches receptors).\n\nATYPICAL PSEUDOCHOLINESTERASE: Genetic variants of BChE (BCHE gene) with reduced activity cause prolonged paralysis:\n• Dibucaine Number (DN): normal DN = 80 (80% inhibition of BChE by dibucaine). Heterozygous atypical: DN ~50 (moderate prolongation, 20–30 min). Homozygous atypical: DN ~20 (severe prolongation, 4–8 hours).\n• Prevalence: Homozygous atypical ~1:2,500. Heterozygous ~1:25–50.\n• Also: acquired pseudocholinesterase deficiency from liver disease, pregnancy, burns, organophosphate exposure, malnutrition, plasmapheresis.\n\nManagement of prolonged block: SUPPORTIVE — maintain sedation, mechanical ventilation, and monitor TOF until recovery. Neostigmine will NOT work (depolarizing block). Fresh frozen plasma (provides normal BChE) can accelerate recovery but is rarely needed.",
  warn: [
    { tp: "bb", ti: "Hyperkalemia → Cardiac Arrest", tx: "Absolute contraindication in: burns (>24h post-injury), denervation injuries, prolonged immobility (>72h), spinal cord injury, crush injuries, muscular dystrophies, stroke (>72h), severe sepsis with muscle wasting. Extrajunctional nAChR upregulation → massive K\u207a efflux → VFib arrest. Safe window for burns/denervation: first 24–72 hours only." },
    { tp: "bb", ti: "Malignant Hyperthermia", tx: "Known trigger agent. SCh + volatile anesthetics = highest risk combination. MH: genetic defect in ryanodine receptor (RyR1) → uncontrolled Ca\u00b2\u207a release from SR → sustained muscle contraction, hypermetabolism, ↑CO₂, hyperthermia, rhabdomyolysis, DIC. Treatment: dantrolene 2.5 mg/kg IV (inhibits RyR1), repeat up to 10 mg/kg." },
    { tp: "bb", ti: "Bradycardia / Asystole", tx: "SCh stimulates ALL cholinergic receptors, including cardiac muscarinic (M2). Can cause profound bradycardia, especially with repeat doses or in children. Pretreat with atropine 0.02 mg/kg in pediatrics. Adults: have atropine at bedside." },
    { tp: "ci", ti: "Pediatric Elective Use Restriction", tx: "FDA black box: do not use for elective intubation in children <8 years due to undiagnosed myopathy risk → hyperkalemic arrest. Reserve for EMERGENCY laryngospasm or situations requiring immediate securing of the airway." },
    { tp: "cau", ti: "Increased IOP/ICP", tx: "Transient ↑IOP (5–10 mmHg for 5–7 min) and ↑ICP from fasciculations. Controversial in open globe injury. ↑ICP from fasciculation-induced venous congestion. Consider defasciculating dose or rocuronium alternative." },
    { tp: "cau", ti: "Myalgias", tx: "Post-operative myalgias in 40–80% of patients (from fasciculations). More common in young ambulatory patients. Defasciculating dose (0.01 mg/kg non-depolarizer) may reduce but not eliminate." },
  ],
  ix: [
    { dr: "Anticholinesterases (neostigmine, organophosphates)", ef: "Inhibit plasma cholinesterase → prolonged SCh duration. Phase II block risk increases.", sv: "high" },
    { dr: "Anticonvulsants (phenytoin, carbamazepine)", ef: "May increase K\u207a release. Chronic use can alter NMJ receptor expression.", sv: "mod" },
    { dr: "Lithium", ef: "Prolongs neuromuscular block via unknown mechanism.", sv: "mod" },
    { dr: "Quinidine", ef: "Inhibits plasma cholinesterase → prolonged block.", sv: "mod" },
    { dr: "Non-depolarizing NMBAs (defasciculating dose)", ef: "Pre-treatment with 10% of intubating dose (e.g., rocuronium 0.06 mg/kg) reduces fasciculations but may increase SCh dose requirement.", sv: "low" },
  ],
  pearls: [
    { ti: "Why SCh for RSI?", tx: "Fastest onset (45–60 sec) and shortest duration (8–15 min) of any NMBA. If intubation fails, patient resumes spontaneous ventilation quickly. Rocuronium 1.2 mg/kg has comparable onset but 45–90 min duration (unless sugammadex available for immediate reversal)." },
    { ti: "Fasciculations = Depolarization", tx: "Visible fasciculations confirm the drug reached the NMJ and caused depolarization. Absence of fasciculations does NOT mean the drug didn't work — it may indicate denervation, prior non-depolarizer, or myopathy. Post-fasciculation, look for jaw relaxation and loss of TOF twitches." },
    { ti: "Phase I vs Phase II Block (TOF)", tx: "Phase I: decreased amplitude of all 4 twitches equally (no fade), no post-tetanic potentiation. Phase II: fade on TOF (T4/T1 ratio decreased), post-tetanic potentiation present — mimics non-depolarizing block." },
    { ti: "Dibucaine Number", tx: "Measures quality (not quantity) of pseudocholinesterase. DN 80 = normal enzyme. DN 20 = atypical homozygous (paralysis 4–8h). Always check DN when prolonged paralysis occurs after SCh." },
    { ti: "K\u207a Rise Timing After Injury", tx: "Extrajunctional receptor upregulation begins ~48–72h post-denervation and PERSISTS for months to years. SCh is safe in the first 24–48h after burn/spinal cord injury. After that window: absolute contraindication." },
    { ti: "MH Susceptibility", tx: "If family or personal history of MH, SCh is absolutely contraindicated. Use rocuronium 1.2 mg/kg + sugammadex as RSI alternative. Non-triggering anesthetic (TIVA with propofol/remifentanil)." },
  ],
  intQs: [
    { q: "Patient with 3-day-old C5 spinal cord injury needs emergent intubation. Can you use succinylcholine?", a: "Extremely cautious timing. Extrajunctional receptor upregulation typically begins 48–72h post-injury but timing varies. At exactly 72 hours, this is at the edge of the safe window. Given the life-threatening hyperkalemia risk, use rocuronium 1.2 mg/kg instead. If only SCh is available, have calcium chloride, insulin/dextrose, and bicarbonate drawn up." },
    { q: "You give SCh and the patient is still paralyzed after 45 minutes. What happened?", a: "Pseudocholinesterase deficiency — either genetic (atypical BChE) or acquired (liver disease, organophosphate exposure, pregnancy, plasmapheresis). Maintain sedation, mechanical ventilation, monitor TOF. Send dibucaine number. DO NOT give neostigmine (won't reverse depolarizing block, may worsen). Support until spontaneous recovery. FFP if prolonged." },
    { q: "Succinylcholine vs rocuronium for RSI — when do you choose each?", a: "SCh: fastest onset (45–60 sec), shortest duration (8–15 min) — ideal when rapid return of spontaneous ventilation is the priority (difficult airway without sugammadex). Rocuronium 1.2 mg/kg: comparable onset (~60 sec), longer duration (45–90 min) but immediately reversible with sugammadex 16 mg/kg. Rocuronium preferred when: MH risk, hyperkalemia risk, neuromuscular disease, burn/denervation, myopathy, or sugammadex is available." },
  ],
},{
  id: "rocuronium", name: "Rocuronium", brand: "Zemuron",
  tags: ["Non-Depolarizing NMBA", "Steroidal", "Aminosteroid", "Competitive Antagonist"],
  systems: ["neuro", "pharm"], type: "medication",
  ov: { "Drug Class": "Intermediate-acting steroidal (aminosteroid) non-depolarizing NMBA", "Primary Target": "Nicotinic ACh receptor (NMJ) — competitive antagonist", "Action": "Competitive antagonist at \u03b1-subunit binding sites", "Ion Channel": "Blocks nAChR opening → prevents Na\u207a influx", "Structure": "Aminosteroid (steroidal backbone with quaternary nitrogen)", "Key Feature": "Fastest onset of any non-depolarizing NMBA; reversible by sugammadex" },
  moa: "Rocuronium is a monoquaternary aminosteroid that produces skeletal muscle paralysis by competitively binding the \u03b1-subunits of the nicotinic acetylcholine receptor at the neuromuscular junction. It blocks ACh from binding, thereby preventing channel opening and subsequent endplate depolarization.\n\nUnlike succinylcholine (agonist → depolarization → then block), rocuronium NEVER causes depolarization. It simply occupies the binding site and prevents ACh access. Because the nAChR requires BOTH \u03b1-subunit sites to be occupied by ACh for channel opening, blocking even ONE site is sufficient to prevent channel opening.\n\nThe competitive nature means rocuronium's block can be overcome by increasing ACh concentration at the NMJ — the basis for reversal by acetylcholinesterase inhibitors (neostigmine). Additionally, rocuronium's steroidal structure allows direct encapsulation by sugammadex (modified \u03b3-cyclodextrin), providing a unique non-competitive reversal pathway.\n\nRocuronium has the fastest onset of any non-depolarizing NMBA (60–90 sec at 1.2 mg/kg RSI dose), attributed to its relatively low potency requiring higher molar doses → more molecules flooding the NMJ → faster receptor occupancy. This inverse relationship between potency and onset speed is a key pharmacological principle: ED95 of rocuronium (~0.3 mg/kg) is much higher than vecuronium (~0.05 mg/kg) or cisatracurium (~0.05 mg/kg), but this lower potency translates to faster onset.",
  recPhys: "Competitive antagonism at the nAChR follows these principles:\n\nStep 1 — Receptor Occupancy: Rocuronium binds the anionic subsite on the \u03b1-subunit at the \u03b1-\u03b4 and/or \u03b1-\u03b5 interface. The quaternary ammonium group mimics the ACh binding moiety. However, unlike ACh, rocuronium does NOT trigger the conformational change needed to open the channel. It is a competitive antagonist: occupies the site without activating it.\n\nStep 2 — Prevention of Depolarization: With rocuronium occupying one or both \u03b1-subunit sites, ACh released from the presynaptic motor neuron cannot bind → channel stays closed → no Na\u207a influx → no endplate depolarization → no muscle action potential → PARALYSIS.\n\nStep 3 — Safety Margin Erosion: Normally, ACh is released in ~5\u00d7 excess of what is needed for endplate depolarization (safety margin). Non-depolarizing NMBAs must occupy ~75% of receptors before any clinical weakness appears, and ~90–95% for complete block. This explains the gradual onset (progressive receptor occupancy) and the importance of TOF monitoring.\n\nStep 4 — Block Characteristics (Non-Depolarizing): TOF shows FADE (progressive decrease T1>T2>T3>T4) due to presynaptic nAChR blockade reducing ACh mobilization during repetitive stimulation. Post-tetanic potentiation is present (brief high-frequency stimulation transiently overcomes block). NO fasciculations (no depolarization occurs). TOF count is used to guide reversal timing.\n\nPotency-Onset Inverse Relationship: Low potency → requires large molar dose → high plasma concentration → steep concentration gradient from plasma to NMJ → rapid biophase equilibration → FAST ONSET. This is why rocuronium (low potency, ED95 0.3 mg/kg) has faster onset than vecuronium (high potency, ED95 0.05 mg/kg) or cisatracurium (high potency, ED95 0.05 mg/kg).",
  dosing: [
    { ind: "Standard Intubation", dose: "0.6 mg/kg IV", notes: "2\u00d7 ED95. Onset 60–90 sec. Duration 30–60 min. Good conditions by 90 sec.", clr: "ac" },
    { ind: "RSI (Modified)", dose: "1.2 mg/kg IV", notes: "4\u00d7 ED95. Onset 45–60 sec (comparable to SCh). Duration 45–90 min. Reversible with sugammadex 16 mg/kg.", clr: "wn" },
    { ind: "Maintenance Bolus", dose: "0.1–0.15 mg/kg IV PRN", notes: "Guided by TOF monitoring. Redose when T2 returns. Maintain 1–2 twitches on TOF.", clr: "pr" },
    { ind: "Continuous Infusion", dose: "10–12 mcg/kg/min", notes: "Range 5–16 mcg/kg/min. Titrate to TOF 1–2 twitches. Reduce rate with volatile anesthetics (potentiate block).", clr: "pk" },
  ],
  kin: { onset: "60–90 sec (0.6 mg/kg); 45–60 sec (1.2 mg/kg)", onsetD: "Fastest NDMBA — low potency = high molar dose = rapid NMJ flooding", peak: "1–3 min", peakD: "Complete block within 2 min at intubating dose", dur: "30–60 min (0.6 mg/kg); 45–90 min (1.2 mg/kg)", durD: "Duration is dose-dependent. Accumulates with repeated doses.", vd: "0.2–0.3 L/kg", pb: "~30%", hl: "60–120 min", csht: "Moderate accumulation with prolonged use", cl: "Hepatic uptake (primary) + renal (~30%)", model: "Two-compartment" },
  metab: "Rocuronium is primarily eliminated by HEPATIC UPTAKE and biliary excretion (60–70%). The liver actively transports rocuronium into hepatocytes via organic cation transporters. Approximately 30% is excreted unchanged in urine.\n\nMinimal metabolism occurs — rocuronium undergoes limited deacetylation to 17-desacetylrocuronium, which has ~5–10% the neuromuscular blocking activity of the parent compound. This metabolite contributes negligibly to clinical effect.\n\nNO Hofmann elimination (unlike cisatracurium). NO ester hydrolysis. Effect depends on organ function.\n\nHepatic impairment: significantly increased Vd and prolonged duration (up to 1.5–2\u00d7 normal). Reduced hepatic uptake and biliary clearance → slower offset.\n\nRenal impairment: modest prolongation (~20–30% increased duration) from reduced renal excretion of the unchanged drug.\n\nObesity: dose on IDEAL body weight (IBW) for intubation. Vd increases modestly with obesity but onset is delayed if dosed on total body weight due to increased Vd.\n\nElderly: reduced hepatic blood flow and clearance → prolonged duration. Reduce maintenance doses.",
  warn: [
    { tp: "ci", ti: "Hypersensitivity", tx: "Anaphylaxis risk. Aminosteroids (rocuronium, vecuronium, pancuronium) are the most common cause of NMBA-related anaphylaxis. Quaternary ammonium groups can cross-react with environmental allergens (cosmetics, household products)." },
    { tp: "cau", ti: "Hepatic Impairment", tx: "Primary hepatic elimination. Cirrhosis/hepatic failure: ↑Vd, ↓clearance → prolonged duration. Reduce dose, monitor TOF closely, and allow longer recovery time." },
    { tp: "cau", ti: "Cannot Intubate Conscious Patient", tx: "Non-depolarizing NMBAs produce paralysis WITHOUT amnesia, anxiolysis, or analgesia. ALWAYS ensure adequate anesthesia/sedation BEFORE administering any NMBA. Awareness under paralysis is a devastating complication." },
    { tp: "cau", ti: "Volatile Anesthetic Potentiation", tx: "Sevoflurane, desflurane, isoflurane potentiate non-depolarizing block (impair post-junctional nAChR function + reduce ACh release). Reduce maintenance NMBA dose by 25–40% with volatile agents." },
  ],
  ix: [
    { dr: "Volatile Anesthetics", ef: "Potentiate NM block. Sevoflurane/desflurane/isoflurane reduce ACh release and impair post-junctional receptor function. Reduce rocuronium dose 25–40%.", sv: "mod" },
    { dr: "Aminoglycosides", ef: "Potentiate block via presynaptic Ca\u00b2\u207a channel blockade (↓ACh release) and post-junctional receptor stabilization.", sv: "mod" },
    { dr: "Magnesium", ef: "Potentiates NM block: ↓presynaptic ACh release (↓Ca\u00b2\u207a entry) + ↓post-junctional receptor sensitivity. Reduce NMBA dose 25–50% in MgSO\u2084-treated patients (eclampsia).", sv: "high" },
    { dr: "Sugammadex", ef: "Direct encapsulation reversal. Dose-dependent: 2 mg/kg (moderate block, TOF ≥2), 4 mg/kg (deep block, PTC ≥1–2), 16 mg/kg (immediate reversal after RSI dose 1.2 mg/kg).", sv: "high" },
    { dr: "Succinylcholine", ef: "If SCh given first, delay rocuronium until patient recovers from SCh (avoid prolonged/unpredictable block from interaction at the receptor).", sv: "mod" },
  ],
  pearls: [
    { ti: "Potency-Onset Inverse Relationship", tx: "Rocuronium has the lowest potency (ED95 0.3 mg/kg) of intermediate-acting NDMBAs but the fastest onset. Low potency = need more molecules = higher plasma concentration = steeper concentration gradient to NMJ = faster biophase equilibration. Classic interview concept." },
    { ti: "RSI Alternative to SCh", tx: "Rocuronium 1.2 mg/kg (4\u00d7 ED95): onset 45–60 sec, comparable to SCh. Key advantage: no hyperkalemia risk, no MH trigger, no fasciculations. Key disadvantage: 45–90 min duration (vs 8–15 min for SCh) UNLESS sugammadex is available for immediate reversal (16 mg/kg)." },
    { ti: "Sugammadex Changed Everything", tx: "Sugammadex encapsulates rocuronium 1:1 in its cyclodextrin ring. Complete reversal at any depth of block, including immediately after RSI dose. This eliminated the primary advantage of SCh (ultrashort duration). Where sugammadex is available, rocuronium is increasingly the default RSI paralytic." },
    { ti: "Reversal: Sugammadex vs Neostigmine", tx: "Neostigmine: only works at shallow block (TOF ≥2 twitches), ceiling effect (max ~0.07 mg/kg), requires anticholinergic co-administration, 10–15 min for full reversal. Sugammadex: works at ANY depth, dose-dependent, no muscarinic side effects, reversal in 2–3 min." },
    { ti: "Anaphylaxis Risk", tx: "Aminosteroid NMBAs (rocuronium > vecuronium > pancuronium) are the #1 cause of perioperative anaphylaxis. IgE-mediated against quaternary ammonium epitope. Cross-reactivity possible with other NMBAs. If anaphylaxis occurs: epinephrine 10–20 mcg IV boluses, sugammadex (emerging evidence it may help by encapsulating the antigen)." },
  ],
  intQs: [
    { q: "Patient with personal history of MH needs emergent intubation. What paralytic?", a: "Rocuronium 1.2 mg/kg IV. SCh is absolutely contraindicated in MH. Rocuronium is NOT a triggering agent. Pair with non-triggering anesthetic (TIVA: propofol + remifentanil). Have dantrolene available. Have sugammadex available for reversal if needed." },
    { q: "Why does rocuronium have faster onset than cisatracurium?", a: "Inverse potency-onset relationship. Rocuronium ED95 is 0.3 mg/kg (low potency, many molecules needed). Cisatracurium ED95 is 0.05 mg/kg (high potency, few molecules). At equipotent intubating doses (2–4\u00d7 ED95), rocuronium delivers ~6\u00d7 more molecules to the NMJ, creating a steeper concentration gradient and faster biophase equilibration." },
    { q: "Patient is on magnesium for eclampsia prophylaxis. How do you adjust rocuronium?", a: "Reduce dose by 25–50%. Mg\u00b2\u207a decreases presynaptic ACh release (competes with Ca\u00b2\u207a at the nerve terminal) and reduces postsynaptic receptor sensitivity. Expect prolonged duration. Monitor TOF closely. Sugammadex reversal is unaffected by magnesium." },
  ],
},{
  id: "vecuronium", name: "Vecuronium", brand: "Norcuron",
  tags: ["Non-Depolarizing NMBA", "Steroidal", "Aminosteroid", "Competitive Antagonist"],
  systems: ["neuro", "pharm"], type: "medication",
  ov: { "Drug Class": "Intermediate-acting steroidal (aminosteroid) non-depolarizing NMBA", "Primary Target": "Nicotinic ACh receptor (NMJ) — competitive antagonist", "Action": "Competitive antagonist at \u03b1-subunit binding sites", "Ion Channel": "Blocks nAChR opening → prevents Na\u207a influx", "Structure": "Aminosteroid (bis-quaternary pancuronium analog with one less quaternary nitrogen)", "Key Feature": "Minimal cardiovascular effects; active 3-OH metabolite can accumulate" },
  moa: "Vecuronium is a monoquaternary aminosteroid NDMBA that competitively binds the \u03b1-subunits of the nicotinic ACh receptor at the NMJ, preventing ACh binding and subsequent channel opening. Identical competitive antagonism mechanism as rocuronium.\n\nVecuronium is a structural analog of pancuronium (long-acting) with one quaternary nitrogen removed, converting it from bis- to monoquaternary. This structural change eliminated pancuronium's vagolytic (M2 blockade) and sympathomimetic (norepinephrine reuptake inhibition) properties, producing a cardiovascular-neutral NMBA.\n\nMinimal cardiovascular effects: no histamine release, no vagolysis, no ganglionic blockade, no sympathetic stimulation. Heart rate, blood pressure, and cardiac output are essentially unchanged. This makes vecuronium an ideal choice in patients where hemodynamic stability is paramount (CAD, cardiac surgery, neurosurgical patients).\n\nHowever, vecuronium has two clinical limitations: (1) the active 3-desacetylvecuronium metabolite accumulates in hepatic and renal failure, producing prolonged paralysis; and (2) hypothermia significantly prolongs its effect.",
  recPhys: "Same competitive antagonism mechanism as rocuronium (see rocuronium recPhys for detailed NMJ physiology).\n\nKey pharmacological distinction from rocuronium:\n\nPotency: Vecuronium ED95 = 0.05 mg/kg (higher potency than rocuronium's 0.3 mg/kg). This means fewer molecules are needed for equipotent block, but onset is SLOWER (potency-onset inverse relationship). Onset at 2\u00d7 ED95 (0.1 mg/kg): 3–5 minutes, vs rocuronium 60–90 sec.\n\nCardiovascular neutrality explained: Vecuronium has extremely low affinity for muscarinic receptors (M2, M3) and ganglionic nicotinic receptors compared to pancuronium. It also does not inhibit neuronal norepinephrine reuptake. These absent off-target effects make it hemodynamically inert.\n\nHistamine: Does NOT release histamine (unlike atracurium/mivacurium). No bronchospasm, flushing, or hypotension from histamine-mediated mechanisms.\n\n3-Desacetylvecuronium: The 3-OH metabolite has 50–80% of the parent compound's neuromuscular blocking activity. In hepatic or renal failure, or with prolonged ICU infusions, this metabolite accumulates and can produce significantly prolonged paralysis even after stopping the drug.",
  dosing: [
    { ind: "Intubation", dose: "0.1 mg/kg IV", notes: "2\u00d7 ED95. Onset 3–5 min. Good conditions by 3–4 min. Duration 20–60 min.", clr: "ac" },
    { ind: "Maintenance Bolus", dose: "0.01–0.015 mg/kg IV", notes: "When first twitch recovery begins. Guided by TOF monitoring.", clr: "wn" },
    { ind: "Continuous Infusion", dose: "0.8–1.2 mcg/kg/min", notes: "Range 0.08–1.2 mcg/kg/min. Titrate to TOF 1–2 twitches. Monitor for accumulation in organ dysfunction.", clr: "pr" },
  ],
  kin: { onset: "3–5 min", onsetD: "Slower than rocuronium due to higher potency (fewer molecules → slower NMJ flooding)", peak: "3–5 min", peakD: "Complete block correlates with onset", dur: "20–60 min", durD: "Intermediate duration. Prolonged in hypothermia, hepatic/renal failure", vd: "0.3–0.4 L/kg", pb: "~30%", hl: "65–75 min", csht: "Accumulates modestly — active metabolite more concerning than parent", cl: "Hepatic (~60%) + renal (~40%)", model: "Two-compartment" },
  metab: "Primarily HEPATIC metabolism (~60%): deacetylation in the liver produces 3-desacetylvecuronium, the clinically significant active metabolite. 3-desacetylvecuronium retains 50–80% of the parent compound's neuromuscular blocking activity and is excreted primarily in BILE.\n\nRenal excretion: ~40% of parent compound excreted unchanged in urine.\n\nThe 3-OH metabolite is the clinical problem: in ICU patients with hepatic dysfunction, renal failure, or both, 3-desacetylvecuronium accumulates substantially. Reports of paralysis lasting 24–72+ hours after prolonged vecuronium infusions in ICU patients with multiorgan failure are well-documented.\n\nHypothermic patients: hepatic metabolism slows dramatically with temperature reduction. At 34\u00b0C (targeted temperature management after cardiac arrest), vecuronium duration may double or triple.\n\nReversal: Sugammadex encapsulates vecuronium (steroidal NMBA), though with ~10\u00d7 lower affinity than for rocuronium. Standard sugammadex dosing is effective but may need higher doses for deep vecuronium block.",
  warn: [
    { tp: "cau", ti: "Active Metabolite Accumulation", tx: "3-Desacetylvecuronium has 50–80% parent activity. Accumulates in hepatic and renal failure. Can cause prolonged paralysis (hours to days) in ICU patients with organ dysfunction. Monitor TOF, use drug holidays." },
    { tp: "cau", ti: "Hypothermia Prolongs Effect", tx: "At 34\u00b0C (post-arrest TTM): effect may double. Reduce dose, monitor TOF frequently. Common ICU pitfall." },
    { tp: "cau", ti: "Hypercarbia Enhances Block", tx: "Respiratory acidosis potentiates vecuronium effect. Ensure adequate ventilation. Relevant in patients with COPD or permissive hypercapnia." },
    { tp: "ci", ti: "Hypersensitivity", tx: "Same aminosteroid class as rocuronium/pancuronium. Cross-reactivity possible." },
    { tp: "cau", ti: "Do NOT Intubate Conscious Patient", tx: "Provides paralysis WITHOUT sedation, amnesia, or analgesia. Always ensure adequate anesthesia first." },
  ],
  ix: [
    { dr: "Volatile Anesthetics", ef: "Potentiate block by 25–40%. Reduce maintenance dose accordingly.", sv: "mod" },
    { dr: "Aminoglycosides", ef: "Potentiate NM block via ↓presynaptic Ca\u00b2\u207a entry and post-junctional receptor effects.", sv: "mod" },
    { dr: "Magnesium / Dantrolene", ef: "Both prolong vecuronium effect. Mg\u00b2\u207a: ↓ACh release + ↓receptor sensitivity. Dantrolene: ↓intracellular Ca\u00b2\u207a (excitation-contraction coupling impaired).", sv: "high" },
    { dr: "Succinylcholine", ef: "If SCh given first, delay vecuronium until SCh recovery. Giving vecuronium during SCh block can produce unpredictable prolonged paralysis.", sv: "mod" },
    { dr: "Sugammadex", ef: "Encapsulates vecuronium with lower affinity than rocuronium. Effective reversal but may need higher doses (4 mg/kg for deep block). Some protocols use 4 mg/kg for vecuronium where 2 mg/kg suffices for rocuronium.", sv: "high" },
  ],
  pearls: [
    { ti: "Cardiovascular Neutrality", tx: "No histamine release, no vagolysis, no sympathetic stimulation. HR/BP/CO unchanged. Ideal for CAD patients, cardiac surgery, and neurosurgery where hemodynamic perturbation is dangerous." },
    { ti: "ICU Paralysis Pitfall", tx: "Prolonged ICU infusions + hepatic/renal dysfunction = active metabolite accumulation. Patients can remain paralyzed for days after stopping infusion. Use daily drug holidays and TOF monitoring. Consider cisatracurium in organ failure (Hofmann elimination, organ-independent)." },
    { ti: "Reversal by Sugammadex", tx: "Sugammadex binds vecuronium with ~10\u00d7 lower affinity than rocuronium. Clinically effective at standard doses, but displacement is possible if rocuronium is administered later (re-curarization concern). Some institutions only stock rocuronium for this reason." },
    { ti: "Vecuronium vs Rocuronium", tx: "Both are aminosteroids with identical receptor mechanism. Vecuronium: more potent, slower onset, minimal CV effects, active metabolite risk. Rocuronium: less potent, faster onset, slight vagolytic effect at high doses, no active metabolites. Rocuronium dominates current practice due to speed and sugammadex compatibility." },
  ],
  intQs: [
    { q: "ICU patient on vecuronium drip develops AKI and elevated LFTs. What's the concern?", a: "Active metabolite accumulation. 3-Desacetylvecuronium (50–80% activity of parent) is cleared hepatically and renally. Dual organ dysfunction → massive accumulation → prolonged paralysis lasting days. Stop the drip, support ventilation, monitor TOF for recovery. Consider switching to cisatracurium, which undergoes Hofmann elimination (organ-independent)." },
    { q: "Why does vecuronium have minimal hemodynamic effects compared to pancuronium?", a: "Vecuronium is a monoquaternary analog of bis-quaternary pancuronium. Removing one quaternary nitrogen eliminated muscarinic M2 receptor blockade (which caused vagolytic tachycardia with pancuronium) and norepinephrine reuptake inhibition (which caused sympathomimetic effects). Vecuronium lacks these off-target interactions → cardiovascular neutrality." },
  ],
},{
  id: "cisatracurium", name: "Cisatracurium", brand: "Nimbex",
  tags: ["Non-Depolarizing NMBA", "Benzylisoquinoline", "Hofmann Elimination", "Organ-Independent"],
  systems: ["neuro", "pharm"], type: "medication",
  ov: { "Drug Class": "Intermediate-acting benzylisoquinoline non-depolarizing NMBA", "Primary Target": "Nicotinic ACh receptor (NMJ) — competitive antagonist", "Action": "Competitive antagonist at \u03b1-subunit binding sites", "Ion Channel": "Blocks nAChR opening → prevents Na\u207a influx", "Structure": "1R-cis, 1'R-cis isomer of atracurium (benzylisoquinoline)", "Key Feature": "Organ-independent Hofmann elimination; NO histamine release (unlike atracurium)" },
  moa: "Cisatracurium is the 1R-cis, 1'R-cis stereoisomer of atracurium, representing approximately 15% of the commercial atracurium mixture but ~4\u00d7 more potent. It competitively antagonizes the nicotinic ACh receptor at the NMJ, producing non-depolarizing neuromuscular blockade identical in mechanism to all competitive NMBAs.\n\nThe critical distinction is the elimination pathway: Hofmann elimination — a spontaneous, non-enzymatic, temperature- and pH-dependent chemical degradation that occurs in plasma and tissues regardless of hepatic or renal function. This makes cisatracurium the ideal NMBA for patients with organ dysfunction.\n\nUnlike its parent compound atracurium, cisatracurium does NOT release histamine at clinical doses. Atracurium's histamine release was attributed to the other stereoisomers in the mixture. By isolating the 1R-cis, 1'R-cis isomer, the histaminoid response is eliminated.\n\nCisatracurium forms laudanosine (a tertiary amine) as a metabolite. Laudanosine CROSSES the blood-brain barrier and has CNS excitatory (seizurogenic) potential at high concentrations. However, cisatracurium produces significantly LESS laudanosine than atracurium (~5\u00d7 less at equipotent doses due to the 4\u00d7 higher potency requiring lower total drug load).",
  recPhys: "Same competitive antagonism at the NMJ as all non-depolarizing NMBAs (see rocuronium recPhys).\n\nHOFMANN ELIMINATION explained:\n\nStep 1: Cisatracurium undergoes spontaneous chemical degradation in plasma via Hofmann elimination — a base-catalyzed, temperature-dependent E2 elimination reaction. The ester bonds in the molecule undergo non-enzymatic cleavage.\n\nStep 2: Products are laudanosine (tertiary amine) and a monoquaternary acrylate. Neither has neuromuscular blocking activity.\n\nStep 3: The monoquaternary acrylate undergoes further Hofmann elimination and ester hydrolysis (by non-specific plasma esterases) to additional inactive metabolites.\n\nKey properties of Hofmann elimination:\n• No enzymes required — purely chemical. No hepatic metabolism needed.\n• Temperature-dependent: SLOWER in hypothermia (important in TTM — effect prolonged at 34\u00b0C)\n• pH-dependent: SLOWER in acidosis (protonation stabilizes the molecule against elimination)\n• Organ-INDEPENDENT: identical degradation rate regardless of hepatic or renal function\n• Predictable pharmacokinetics even in multiorgan failure\n\nLaudanosine: Crosses BBB. In animal studies, high concentrations cause CNS excitation and seizures. Clinical significance at cisatracurium doses is minimal because plasma laudanosine levels remain well below the seizure threshold (unlike atracurium, where laudanosine accumulation was a genuine concern in ICU patients with renal failure).",
  dosing: [
    { ind: "Intubation", dose: "0.1–0.2 mg/kg IV", notes: "2–4\u00d7 ED95. Onset 3–5 min. Higher end provides faster onset but longer duration. Good conditions by 3 min at 0.15 mg/kg.", clr: "ac" },
    { ind: "Maintenance Bolus", dose: "0.02 mg/kg IV", notes: "When first twitch recovery begins on TOF. Provides additional 15–20 min of block.", clr: "wn" },
    { ind: "Continuous Infusion", dose: "1–3 mcg/kg/min", notes: "Start 1–2 mcg/kg/min. Titrate to TOF 1–2 twitches. Predictable and non-accumulating even with prolonged infusion.", clr: "pr" },
  ],
  kin: { onset: "3–5 min", onsetD: "Slower than rocuronium (high potency = low molar dose = slow NMJ equilibration)", peak: "5 min", peakD: "Complete block ~5 min at intubating dose", dur: "30–45 min", durD: "Intermediate. Non-accumulating on repeat dosing (Hofmann elimination)", vd: "0.16 L/kg", pb: "Low", hl: "~30 min", csht: "Minimal accumulation — Hofmann elimination prevents buildup", cl: "Hofmann elimination (77%) + ester hydrolysis (23%)", model: "Two-compartment" },
  metab: "Primary: HOFMANN ELIMINATION (77%) — spontaneous non-enzymatic degradation in plasma and tissues. Temperature-dependent (slower in hypothermia), pH-dependent (slower in acidosis), but completely ORGAN-INDEPENDENT.\n\nSecondary: Non-specific ester hydrolysis by plasma esterases (~23%). NOT dependent on pseudocholinesterase (unlike succinylcholine and mivacurium).\n\nMetabolites: Laudanosine (tertiary amine, crosses BBB, CNS excitatory at high concentrations) + monoquaternary acrylate (inactive). Laudanosine is further metabolized hepatically and renally excreted. In renal failure, laudanosine accumulates but at clinically insignificant levels with cisatracurium (unlike atracurium).\n\nNO CYP450 involvement. No active neuromuscular-blocking metabolites.\n\nOrgan failure: NO dose adjustment needed. Identical pharmacokinetics in hepatic failure, renal failure, and multiorgan dysfunction. This is the primary reason cisatracurium is the preferred NMBA for ICU paralysis in patients with organ dysfunction.\n\nHypothermia (34\u00b0C TTM): Hofmann degradation slows significantly. Duration may increase 30–50%. Monitor TOF, reduce infusion rate.\n\nAcidosis: pH <7.3 slows Hofmann elimination. Anticipate prolonged effect in acidotic patients.",
  warn: [
    { tp: "cau", ti: "Laudanosine (CNS Metabolite)", tx: "Crosses BBB. CNS excitatory at high concentrations. Cisatracurium produces ~5\u00d7 less laudanosine than atracurium. Clinically insignificant at standard doses. Theoretically more relevant in prolonged ICU use with renal failure (laudanosine accumulation). Caution in patients with seizure history." },
    { tp: "cau", ti: "Hypothermia/Acidosis Prolongs Effect", tx: "Hofmann elimination is temperature- and pH-dependent. At 34\u00b0C or pH <7.3, degradation rate decreases → prolonged block. Adjust infusion rate accordingly. Still more predictable than hepatically-metabolized NMBAs in these conditions." },
    { tp: "ci", ti: "Hypersensitivity", tx: "Benzylisoquinoline class. Cross-reactivity with atracurium possible. Lower anaphylaxis risk than aminosteroids overall." },
    { tp: "cau", ti: "NO Histamine Release", tx: "Unlike atracurium, cisatracurium does NOT cause histamine release at clinical doses. No bronchospasm, flushing, or hypotension from histamine. Confirmed safe for asthmatics and hemodynamically unstable patients." },
  ],
  ix: [
    { dr: "Volatile Anesthetics", ef: "Potentiate block 25–40%. Reduce infusion rate with sevoflurane/desflurane/isoflurane.", sv: "mod" },
    { dr: "Aminoglycosides / Polymyxins / Bacitracin", ef: "Potentiate NM block via ↓presynaptic ACh release and post-junctional effects. Enhanced block with aminoglycosides is a common clinical interaction.", sv: "mod" },
    { dr: "Magnesium", ef: "Potentiates block: ↓ACh release + ↓receptor sensitivity. Reduce cisatracurium dose 25–50%.", sv: "high" },
    { dr: "Phenytoin / Carbamazepine (chronic)", ef: "Chronic anticonvulsants upregulate nAChR expression → resistance to non-depolarizing NMBAs. May need higher doses. Acute anticonvulsant use may potentiate block.", sv: "mod" },
    { dr: "Lithium / Local Anesthetics / Procainamide / Quinidine", ef: "Various mechanisms of NM block potentiation. Monitor TOF and reduce NMBA dose.", sv: "mod" },
  ],
  pearls: [
    { ti: "Organ-Independent = ICU Workhorse", tx: "Hofmann elimination proceeds identically in hepatic failure, renal failure, and multiorgan dysfunction. No active metabolites with NM blocking activity. This is THE NMBA for ICU paralysis in patients with organ dysfunction — predictable offset regardless of organ function." },
    { ti: "Cisatracurium vs Atracurium", tx: "Cisatracurium is the purified 1R-cis,1'R-cis isomer (15% of atracurium mixture). 4\u00d7 more potent → lower total dose → 5\u00d7 less laudanosine production. NO histamine release. Same Hofmann elimination pathway but cleaner pharmacologic profile." },
    { ti: "Reversal: Neostigmine (NOT Sugammadex)", tx: "Cisatracurium is a benzylisoquinoline — sugammadex does NOT encapsulate it (sugammadex only works on steroidal NMBAs: rocuronium > vecuronium). Reversal: neostigmine 0.05–0.07 mg/kg + glycopyrrolate 0.01–0.02 mg/kg when TOF count ≥2." },
    { ti: "ACURASYS Trial (ARDS Paralysis)", tx: "ACURASYS (NEJM 2010): cisatracurium infusion for 48h in early ARDS improved 90-day survival and ventilator-free days. Led to widespread use of NMBAs in severe ARDS. ROSE trial (2019) did not confirm mortality benefit but used lighter sedation protocol." },
    { ti: "Slower Onset = Less Flexible", tx: "3–5 min onset makes cisatracurium unsuitable for RSI. For rapid intubation: rocuronium or SCh. Cisatracurium is best for maintenance paralysis, ICU use, and situations where hemodynamic stability and organ-independent metabolism are priorities." },
  ],
  intQs: [
    { q: "ICU patient with liver cirrhosis and AKI needs prolonged paralysis for ARDS. Which NMBA?", a: "Cisatracurium. Hofmann elimination is organ-independent — identical degradation rate regardless of hepatic or renal function. No active metabolites with NM blocking activity. Vecuronium would be dangerous here (3-desacetylvecuronium accumulation). Rocuronium would also have prolonged, unpredictable duration (hepatic uptake dependent)." },
    { q: "Why can't you use sugammadex to reverse cisatracurium?", a: "Sugammadex is a modified \u03b3-cyclodextrin that specifically encapsulates STEROIDAL NMBAs (aminosteroids). The hydrophobic cavity is sized and shaped for the steroidal backbone of rocuronium/vecuronium. Cisatracurium is a benzylisoquinoline — different molecular structure that doesn't fit in the cyclodextrin ring. Must use neostigmine for reversal." },
    { q: "Patient on cisatracurium drip is being cooled to 34\u00b0C post-arrest. What adjustment?", a: "Reduce infusion rate. Hofmann elimination is temperature-dependent — slows significantly at 34\u00b0C. Duration prolonged 30–50%. Monitor TOF frequently and titrate to 1–2 twitches. Even with prolonged effect, cisatracurium remains more predictable than vecuronium in hypothermia (which has both reduced hepatic metabolism AND temperature-dependent effects)." },
  ],
},{
  id: "neostigmine", name: "Neostigmine", brand: "Bloxiverz / Prostigmin",
  tags: ["Anticholinesterase", "NMB Reversal", "Quaternary Ammonium", "AChE Inhibitor"],
  systems: ["neuro", "pharm"], type: "medication",
  ov: { "Drug Class": "Reversible acetylcholinesterase inhibitor (quaternary ammonium carbamate)", "Primary Target": "Acetylcholinesterase (AChE) at the NMJ", "Action": "Competitive inhibitor of AChE → ↑ACh at NMJ", "Structure": "Quaternary ammonium → DOES NOT cross BBB", "Key Feature": "Standard reversal agent for non-depolarizing NMBAs; requires anticholinergic co-administration", "Pairing": "ALWAYS give with glycopyrrolate or atropine to block muscarinic side effects" },
  moa: "Neostigmine is a quaternary ammonium carbamate that reversibly inhibits acetylcholinesterase (AChE) at the neuromuscular junction. AChE normally hydrolyzes ACh within ~1 ms of release, terminating the signal. By inhibiting AChE, neostigmine allows ACh to accumulate in the synaptic cleft, increasing both the concentration and the duration of ACh at the nicotinic receptor.\n\nThe increased ACh concentration competitively displaces non-depolarizing NMBAs from the nicotinic receptor (competitive antagonism is overcome by mass action — flooding the receptor with more agonist). This is the basis for NDMBA reversal.\n\nMechanism of AChE inhibition: Neostigmine's carbamate group binds the esteratic site of AChE (serine hydroxyl at the active site), forming a carbamylated enzyme. Unlike the acetylated enzyme intermediate (formed by ACh, hydrolyzed in microseconds), the carbamylated enzyme is hydrolyzed slowly (~15–30 min). This means AChE is functionally inactivated for the duration of neostigmine's presence.\n\nCRITICAL LIMITATION — CEILING EFFECT: Neostigmine can only increase ACh concentration to a maximum level. Once all AChE at the NMJ is inhibited (100% enzyme occupancy), no further ACh accumulation occurs. If NDMBA receptor occupancy exceeds what this maximum ACh concentration can overcome (≥ deep block), neostigmine will be insufficient. This is why neostigmine requires a minimum TOF count of 2 (ideally 4) before administration — indicating the block has spontaneously recovered to a shallow enough level for competitive reversal.\n\nNon-selective AChE inhibition: Neostigmine inhibits AChE EVERYWHERE — not just the NMJ. This means ACh also accumulates at muscarinic receptors throughout the body (heart, GI, respiratory, salivary, sweat glands), producing unwanted muscarinic effects: bradycardia (M2), bronchospasm/↑secretions (M3), nausea/vomiting, salivation, miosis, increased GI motility. These MUST be blocked with concurrent anticholinergic administration.",
  recPhys: "AChE at the NMJ: A serine hydrolase anchored in the basal lamina of the synaptic cleft. Structure includes an anionic site (binds quaternary ammonium head of ACh) and an esteratic site (serine –OH that hydrolyzes the ester bond). AChE is one of the fastest enzymes in biology — turnover rate ~25,000 ACh molecules/second/enzyme.\n\nNeostigmine inhibition mechanism:\n\nStep 1: The quaternary ammonium group of neostigmine binds the anionic site of AChE (electrostatic attraction, same site ACh uses).\n\nStep 2: The carbamate group transfers to the esteratic site serine, forming a CARBAMYLATED enzyme intermediate.\n\nStep 3: The carbamylated enzyme hydrolyzes slowly (t\u00bd ~15–30 min vs microseconds for acetylated intermediate). AChE is functionally inhibited.\n\nResult: ACh accumulates in the synaptic cleft. At the NMJ nicotinic receptor, increased ACh competes with the non-depolarizing NMBA for the \u03b1-subunit binding sites. If enough ACh accumulates relative to the NMBA concentration, ACh wins the competition → channel opening → endplate depolarization → muscle contraction restored.\n\nMusacrinic effects (unwanted):\n• Heart (M2): ACh at cardiac muscarinic receptors → ↑vagal tone → ↓HR, ↓conduction velocity (AV block risk), ↓contractility. Can cause severe bradycardia or asystole.\n• Airways (M3): Bronchial smooth muscle contraction + ↑secretions → bronchospasm, wheezing, copious secretions.\n• GI (M3): ↑motility, ↑secretions → nausea, vomiting, diarrhea.\n• Eyes (M3): Miosis, ↑lacrimation.\n• Glands: Salivation, diaphoresis (SLUDGE/DUMBELS mnemonic).\n\nAnticholinergic pairing rationale: Glycopyrrolate (0.2 mg per 1 mg neostigmine) or atropine (0.015–0.02 mg/kg) blocks muscarinic receptors, preventing bradycardia and secretions WITHOUT affecting nicotinic reversal at the NMJ. Glycopyrrolate preferred: onset matches neostigmine (2–3 min), does not cross BBB, longer duration. Atropine onset is faster — may cause initial tachycardia before neostigmine's bradycardia effect.",
  dosing: [
    { ind: "NMB Reversal (Standard)", dose: "0.04–0.07 mg/kg IV (max 5 mg)", notes: "Give when TOF count ≥2 (ideally 4). Typical: 0.05 mg/kg. MUST pair with glycopyrrolate 0.2 mg per 1 mg neostigmine or atropine 0.015–0.02 mg/kg.", clr: "ac" },
    { ind: "NMB Reversal (Lower Dose)", dose: "0.03 mg/kg IV", notes: "When TOF ratio >0.4 (near full spontaneous recovery). Lower dose reduces muscarinic side effects.", clr: "dg" },
    { ind: "Myasthenia Gravis (Diagnostic)", dose: "0.04 mg/kg IV (max 2.5 mg)", notes: "Improvement in muscle strength supports diagnosis. Give with atropine 0.4 mg pretreatment.", clr: "pr" },
  ],
  kin: { onset: "1–3 min IV", onsetD: "Onset matches glycopyrrolate well; atropine is faster", peak: "7–10 min", peakD: "Full reversal effect by 7–10 min. If inadequate at 10 min, additional dose unlikely to help (ceiling effect)", dur: "40–60 min", durD: "Shorter than most NDMBAs → RECURARIZATION risk if NMBA has longer duration", vd: "0.7 L/kg", pb: "15–25%", hl: "24–80 min", csht: "N/A", cl: "Renal (50%) + plasma cholinesterase hydrolysis (50%)", model: "Renal elimination predominant" },
  metab: "Neostigmine undergoes dual elimination: approximately 50% is excreted UNCHANGED in urine (renal clearance) and approximately 50% is hydrolyzed by plasma cholinesterases and hepatic microsomal enzymes.\n\nThe quaternary ammonium structure means neostigmine DOES NOT cross the blood-brain barrier — no central nervous system effects (unlike physostigmine, a tertiary amine AChE inhibitor that crosses the BBB).\n\nRenal impairment: Significantly prolongs half-life and duration of action. However, this is rarely a clinical problem because renal impairment also prolongs NDMBA duration. The prolonged neostigmine effect helps match the prolonged NMBA effect. Net result: reversal is still usually adequate, though onset may be slower.\n\nMaximum dose: 5 mg (0.07 mg/kg). Beyond this dose, no additional NMJ reversal occurs (ceiling effect — all AChE already inhibited) but muscarinic side effects continue to increase.",
  warn: [
    { tp: "bb", ti: "Bradycardia / Asystole Without Anticholinergic", tx: "NEVER give neostigmine without concurrent anticholinergic. Unopposed muscarinic stimulation → severe bradycardia, AV block, or asystole. Glycopyrrolate 0.2 mg per 1 mg neostigmine (preferred) or atropine 0.015–0.02 mg/kg." },
    { tp: "ci", ti: "GI/GU Obstruction", tx: "Increased smooth muscle tone and motility. Contraindicated in mechanical GI or urinary obstruction." },
    { tp: "cau", ti: "Ceiling Effect", tx: "Max dose ~0.07 mg/kg (5 mg). Beyond this: no additional NMJ reversal but increasing muscarinic toxicity. If block not reversed at max dose, the block is too deep for neostigmine → consider sugammadex (for steroidal NMBAs) or wait for further spontaneous recovery." },
    { tp: "cau", ti: "Bronchospasm Risk", tx: "M3 stimulation in airways → bronchoconstriction + ↑secretions. Use with extreme caution in severe asthma/COPD. Glycopyrrolate co-administration helps but may not fully prevent." },
    { tp: "cau", ti: "Recurarization", tx: "Neostigmine duration (40–60 min) may be shorter than the NDMBA it's reversing (especially long-acting agents or high doses). If the NMBA outlasts neostigmine, the block can return. Monitor patients post-reversal." },
  ],
  ix: [
    { dr: "Glycopyrrolate", ef: "REQUIRED pairing. 0.2 mg per 1 mg neostigmine. Blocks muscarinic effects (bradycardia, secretions). Onset matches neostigmine.", sv: "high" },
    { dr: "Atropine", ef: "Alternative pairing. 0.015–0.02 mg/kg. Faster onset than neostigmine → may see initial tachycardia before neostigmine-induced bradycardia.", sv: "high" },
    { dr: "Succinylcholine", ef: "Neostigmine inhibits plasma cholinesterase → prolongs SCh duration if given together. Avoid SCh for 30+ min after neostigmine.", sv: "high" },
    { dr: "Beta-blockers", ef: "Potentiates bradycardia risk. Neostigmine's vagotonic effect added to beta-blocker's chronotropic depression. Monitor HR closely.", sv: "mod" },
    { dr: "Depolarizing NMBAs", ef: "Will NOT reverse depolarizing block (SCh). May potentiate Phase I block. Only reverses NON-depolarizing block.", sv: "high" },
  ],
  pearls: [
    { ti: "TOF ≥2 Before Giving", tx: "Neostigmine has a ceiling effect — it can only increase ACh so much. If the block is deep (TOF 0–1), there's too much NMBA for ACh to overcome. Wait until TOF ≥2 (ideally 4) before attempting reversal. Giving neostigmine too early wastes time and adds muscarinic side effects without benefit." },
    { ti: "Glycopyrrolate vs Atropine Pairing", tx: "Glycopyrrolate: onset 2–3 min (matches neostigmine), does NOT cross BBB, longer duration, less tachycardia. Atropine: faster onset (30–60 sec, causes brief tachycardia before neostigmine kicks in), crosses BBB (central effects), shorter duration. Standard practice: glycopyrrolate unless speed of anticholinergic needed." },
    { ti: "Neostigmine vs Sugammadex", tx: "Neostigmine: works on ALL NDMBAs (benzylisoquinoline + aminosteroid), cheap, requires TOF ≥2, ceiling effect, muscarinic side effects, 10–15 min reversal. Sugammadex: ONLY works on steroidal NMBAs (rocuronium/vecuronium), expensive, works at ANY depth, no ceiling, no muscarinic effects, 2–3 min reversal." },
    { ti: "Cannot Reverse SCh", tx: "Neostigmine inhibits AChE, increasing ACh at the NMJ. For a depolarizing block (SCh = ACh mimic), more ACh WORSENS the block. Neostigmine is contraindicated for depolarizing block reversal." },
    { ti: "Post-Op Residual Curarization (PORC)", tx: "Incomplete NMBA reversal is the #1 cause of post-operative respiratory failure related to NMBAs. Neostigmine's ceiling effect means it cannot guarantee full reversal. TOF ratio ≥0.9 (quantitative monitoring) is the standard for safe extubation. Subjective TOF assessment misses residual block in up to 40% of cases." },
  ],
  intQs: [
    { q: "Patient reversed with neostigmine but develops respiratory failure in PACU 30 minutes later. What happened?", a: "Recurarization. Neostigmine duration (40–60 min) may be shorter than the NDMBA being reversed. As neostigmine wears off, AChE activity returns → ACh levels drop → residual NMBA re-establishes block. Risk factors: deep block at reversal, long-acting NMBA, renal/hepatic dysfunction slowing NMBA elimination. Treatment: re-dose neostigmine with anticholinergic, or give sugammadex if steroidal NMBA was used." },
    { q: "TOF count is 0. Can you give neostigmine?", a: "No. Ceiling effect — neostigmine cannot overcome deep block (high receptor occupancy by NMBA). At TOF 0, >95% of receptors are blocked. Maximum ACh accumulation from neostigmine cannot compete. Wait for spontaneous recovery to TOF ≥2 (some say 4) before giving neostigmine. Alternative: sugammadex 4–16 mg/kg can reverse even deep rocuronium/vecuronium block." },
    { q: "Why do you pair neostigmine with glycopyrrolate instead of atropine?", a: "Onset matching. Glycopyrrolate onset (2–3 min) closely matches neostigmine onset (1–3 min), providing contemporaneous muscarinic protection. Atropine onset (30–60 sec) is faster → initial tachycardia before neostigmine's bradycardic effect begins, then potential bradycardia rebound as atropine wears off before neostigmine. Also: glycopyrrolate doesn't cross BBB (no central anticholinergic effects), longer duration of action." },
  ],
},{
  id: "sugammadex", name: "Sugammadex", brand: "Bridion",
  tags: ["NMBA Reversal", "\u03b3-Cyclodextrin", "Steroidal NMBA Encapsulation", "Rocuronium Reversal"],
  systems: ["neuro", "pharm"], type: "medication",
  ov: { "Drug Class": "Modified \u03b3-cyclodextrin selective relaxant binding agent (SRBA)", "Primary Target": "Steroidal NMBAs (rocuronium >> vecuronium >> pancuronium)", "Action": "Chemical encapsulation — traps NMBA molecules in cyclodextrin ring", "Structure": "Modified \u03b3-cyclodextrin with 8 side chains extending the hydrophobic cavity", "Key Feature": "Reverses NM block at ANY depth, including immediately after RSI dose; no muscarinic side effects" },
  moa: "Sugammadex is a modified \u03b3-cyclodextrin molecule — a ring of 8 glucose units forming a truncated cone with a hydrophobic interior cavity and hydrophilic exterior. The cavity is specifically sized and chemically modified to encapsulate steroidal NMBA molecules through a 1:1 host-guest molecular interaction.\n\nMechanism: Sugammadex administered IV rapidly distributes through plasma. Its hydrophobic cavity engulfs the steroidal NMBA molecule (rocuronium, vecuronium) through tight van der Waals forces, thermodynamic trapping, and electrostatic interactions with the negatively charged carboxyl side chains on sugammadex and the positively charged quaternary nitrogen on the NMBA. The resulting sugammadex-NMBA complex is extremely stable (binding affinity for rocuronium: Ka ~10\u2077 M\u207b\u00b9).\n\nThis encapsulation creates a steep concentration gradient: free NMBA in plasma drops precipitously as sugammadex binds it → NMBA molecules at the NMJ diffuse down their concentration gradient back into plasma → sugammadex captures them → more NMBA leaves the NMJ. This cascade rapidly depletes NMBA from the neuromuscular junction, restoring ACh access to nicotinic receptors.\n\nKey distinction from neostigmine: Sugammadex works by REMOVING the NMBA from the system entirely (chemical chelation), NOT by increasing ACh. This means no ceiling effect, no muscarinic side effects (no ACh manipulation), and effectiveness at ANY depth of block — including immediate reversal after RSI dose.\n\nSelectivity: Rocuronium > vecuronium >> pancuronium. Does NOT encapsulate benzylisoquinoline NMBAs (cisatracurium, atracurium) — wrong molecular shape for the cavity. Does NOT reverse succinylcholine (different structure, different mechanism).",
  recPhys: "Cyclodextrin encapsulation pharmacology:\n\nStep 1 — IV Administration: Sugammadex distributes rapidly in plasma (Vd = 0.07 L/kg, essentially plasma volume only — stays intravascular).\n\nStep 2 — Plasma Binding: Sugammadex encounters free rocuronium/vecuronium in plasma and encapsulates it within seconds. The association rate is extremely fast. Binding constant for rocuronium: Ka ~10\u2077 M\u207b\u00b9 (very tight). For vecuronium: Ka ~10\u2076 M\u207b\u00b9 (10\u00d7 lower affinity, still clinically effective).\n\nStep 3 — Concentration Gradient: Rapid removal of free NMBA from plasma creates a steep plasma-to-NMJ concentration gradient. NMBA molecules at the NMJ (bound to nicotinic receptors and free in the biophase) diffuse back into plasma along this gradient.\n\nStep 4 — NMJ Clearance: As NMBA leaves the NMJ, nicotinic receptor occupancy falls below the threshold for block (~75% occupancy needed for clinical weakness). ACh can now access unblocked receptors → endplate depolarization restored → muscle contraction returns.\n\nStep 5 — Renal Excretion: The sugammadex-rocuronium complex is highly water-soluble and is excreted intact by the kidneys via glomerular filtration. The complex does NOT dissociate under physiologic conditions. No hepatic metabolism required.\n\nWhy no muscarinic effects: Sugammadex does not interact with AChE, ACh, or any receptor system. It only binds the NMBA molecule itself. No ACh accumulation occurs, so no muscarinic stimulation. No anticholinergic co-administration needed.\n\nHormonal interaction: Sugammadex can bind steroidal hormones (progesterone, estradiol) with much lower affinity. Clinical significance: may reduce effectiveness of hormonal contraceptives for one cycle — counsel patients to use backup contraception.",
  dosing: [
    { ind: "Moderate Block (TOF ≥2)", dose: "2 mg/kg IV", notes: "Standard post-surgical reversal when TOF count ≥2 twitches. Full reversal in ~2 min.", clr: "ac" },
    { ind: "Deep Block (PTC ≥1–2)", dose: "4 mg/kg IV", notes: "Post-tetanic count 1–2 twitches (deep block, no TOF twitches). Full reversal in ~3 min.", clr: "wn" },
    { ind: "Immediate Reversal (post-RSI)", dose: "16 mg/kg IV", notes: "For immediate reversal after rocuronium 1.2 mg/kg RSI dose. Give 3 min after rocuronium. Full reversal in ~3 min. This is the 'rescue' dose.", clr: "pr" },
  ],
  kin: { onset: "1–3 min", onsetD: "Dose-dependent: 2 mg/kg reversal by ~2 min; 16 mg/kg by ~3 min", peak: "2–3 min", peakD: "TOF ratio ≥0.9 within 2–3 min at appropriate dose", dur: "Permanent encapsulation", durD: "Complex is stable and excreted intact. No re-curarization at proper dosing", vd: "0.07 L/kg (plasma volume)", pb: "Minimal", hl: "100–150 min", csht: "N/A — irreversible encapsulation", cl: "Renal (>90% excreted as intact sugammadex-NMBA complex)", model: "One-compartment (stays in plasma)" },
  metab: "Sugammadex undergoes virtually NO METABOLISM. It is not a substrate for CYP450 enzymes, plasma esterases, or any known metabolic pathway.\n\nThe sugammadex-rocuronium complex is excreted INTACT by glomerular filtration in the kidneys. >95% recovered unchanged in urine within 24 hours.\n\nRenal impairment: In severe renal failure (CrCl <30 mL/min), excretion of the sugammadex-NMBA complex is dramatically slowed. The complex remains in plasma for prolonged periods. However, the encapsulation is so tight that the NMBA does not dissociate → NMJ block does not return. The clinical effect (reversal) is maintained even though excretion is delayed.\n\nHemodialysis: Sugammadex-NMBA complex has a molecular weight ~2,000 Da. Standard high-flux dialysis can remove ~70% of the complex.\n\nHepatic impairment: No dose adjustment. Metabolism is not hepatic.",
  warn: [
    { tp: "cau", ti: "Hormonal Contraceptive Interaction", tx: "Sugammadex can bind steroidal hormones (progesterone, estradiol) with low affinity. May reduce effectiveness of hormonal contraceptives for the current cycle. Advise backup contraception for 7 days after administration." },
    { tp: "cau", ti: "Hypersensitivity / Anaphylaxis", tx: "Post-marketing reports of anaphylaxis (rare, ~0.3%). Can occur on first exposure (no prior sensitization needed — cyclodextrin-mediated). Have epinephrine available." },
    { tp: "cau", ti: "Severe Renal Impairment (CrCl <30)", tx: "Excretion of sugammadex-NMBA complex is significantly delayed. Clinical reversal still occurs but complex circulates longer. Monitor closely for ≥48h post-administration." },
    { tp: "cau", ti: "Bradycardia (Rare)", tx: "Isolated reports of marked bradycardia within minutes of administration. Mechanism unclear (possibly vagal response to rapid recovery of diaphragm/airway reflexes). Have atropine available." },
    { tp: "cau", ti: "Re-Administration of NMBA After Sugammadex", tx: "If re-intubation needed after sugammadex: wait 5 min and give rocuronium 1.2 mg/kg (higher dose to overcome residual sugammadex). OR use SCh (not affected by sugammadex). OR use benzylisoquinoline NMBA (cisatracurium)." },
  ],
  ix: [
    { dr: "Rocuronium", ef: "Primary target. Ka ~10\u2077 M\u207b\u00b9 (tight binding). 2 mg/kg reverses moderate block, 16 mg/kg provides immediate reversal post-RSI.", sv: "high" },
    { dr: "Vecuronium", ef: "Secondary target. Ka ~10\u2076 M\u207b\u00b9 (~10\u00d7 lower affinity). Standard dosing effective but may need higher doses for deep block.", sv: "high" },
    { dr: "Hormonal Contraceptives", ef: "Sugammadex can encapsulate steroidal hormones (progesterone, estrogen). May reduce contraceptive efficacy. Advise backup contraception \u00d77 days.", sv: "mod" },
    { dr: "Toremifene (SERM)", ef: "Higher affinity for sugammadex than most hormones. Theoretical displacement of NMBA from sugammadex → re-curarization. Clinical significance uncertain.", sv: "mod" },
    { dr: "Benzylisoquinoline NMBAs", ef: "NO interaction. Sugammadex does NOT encapsulate cisatracurium or atracurium. Wrong molecular shape.", sv: "low" },
  ],
  pearls: [
    { ti: "Dose by Depth of Block", tx: "2-4-16 rule: 2 mg/kg for moderate block (TOF ≥2), 4 mg/kg for deep block (PTC ≥1–2), 16 mg/kg for immediate reversal (3 min after RSI dose). Underdosing risks re-curarization." },
    { ti: "Changed the RSI Paradigm", tx: "Sugammadex 16 mg/kg can immediately reverse rocuronium 1.2 mg/kg. This eliminates SCh's main advantage (ultrashort duration). Where sugammadex is available, rocuronium + sugammadex is replacing SCh for RSI, avoiding hyperkalemia, MH, fasciculation, and cardiac risks." },
    { ti: "No Muscarinic Effects", tx: "Unlike neostigmine, sugammadex does not affect AChE or ACh levels. No bradycardia, bronchospasm, or secretions from the mechanism itself. No anticholinergic co-administration needed. Simpler, faster, cleaner reversal." },
    { ti: "Cost Consideration", tx: "Sugammadex is significantly more expensive than neostigmine (16 mg/kg dose for a 100 kg patient = 1600 mg = ~$200–400). Neostigmine + glycopyrrolate costs ~$5–10. Cost is the main reason neostigmine remains in use for routine shallow block reversal." },
    { ti: "Cannot Reverse Cisatracurium", tx: "Sugammadex only encapsulates STEROIDAL NMBAs. If using cisatracurium (benzylisoquinoline), reversal options are neostigmine (with anticholinergic) or waiting for Hofmann elimination. This is a key factor in NMBA selection." },
    { ti: "Rocuronium Re-Administration", tx: "After full-dose sugammadex, if you need to re-paralyze: wait ≥5 min, give rocuronium 1.2 mg/kg (extra dose overcomes residual sugammadex). OR give SCh or cisatracurium (unaffected by sugammadex). Some institutions wait 24h before standard-dose rocuronium." },
  ],
  intQs: [
    { q: "Can't intubate, can't oxygenate after rocuronium 1.2 mg/kg RSI. No surgical airway kit. Options?", a: "Sugammadex 16 mg/kg IV immediately. This is the rescue scenario sugammadex was designed for. Full reversal of rocuronium in ~3 minutes. Patient resumes spontaneous ventilation while you regroup. Without sugammadex, you would be committed to a paralyzed, unoxygenatable patient for 45–90 minutes — catastrophic." },
    { q: "Patient needs paralysis for ARDS but has liver and kidney failure. Your NMBA is cisatracurium. Surgeon needs immediate reversal for emergency surgery. Can you give sugammadex?", a: "No. Sugammadex does not reverse cisatracurium (benzylisoquinoline structure doesn't fit the cyclodextrin cavity). Options: give neostigmine 0.05–0.07 mg/kg + glycopyrrolate IF TOF ≥2. If still deeply blocked: support ventilation through surgery, allow Hofmann elimination to degrade cisatracurium (organ-independent, will proceed even in organ failure). This scenario illustrates why NMBA selection matters — if you anticipate needing immediate reversal capability, use rocuronium." },
    { q: "After sugammadex reversal, you need to re-intubate 20 minutes later. What paralytic?", a: "Three options: (1) SCh 1–1.5 mg/kg — unaffected by sugammadex, normal onset/duration. Best if no SCh contraindications. (2) Rocuronium 1.2 mg/kg — higher dose to saturate residual sugammadex first; the excess rocuronium provides paralysis. Wait ≥5 min after sugammadex. (3) Cisatracurium — unaffected by sugammadex. Option 1 or 3 are most reliable." },
  ],
},{
  id: "etomidate", name: "Etomidate", brand: "Amidate",
  tags: ["Sedative-Hypnotic", "GABA-A Agonist", "Induction Agent", "Hemodynamically Stable"],
  systems: ["neuro", "pharm"], type: "medication",
  ov: { "Drug Class": "Carboxylated imidazole sedative-hypnotic (GABA\u2090 receptor positive allosteric modulator)", "Primary Target": "GABA\u2090 receptor — \u03b1-\u03b2 subunit interface", "Action": "Positive allosteric modulator → enhances GABA-mediated Cl\u207b conductance", "Ion Channel": "GABA\u2090 Cl\u207b channel → ↑Cl\u207b influx → neuronal hyperpolarization", "Structure": "Carboxylated imidazole with chiral center (R(+) enantiomer is active)", "Key Feature": "Minimal hemodynamic depression; adrenal suppression limits use" },
  moa: "Etomidate is a carboxylated imidazole that produces hypnosis by enhancing GABA\u2090 receptor function in the central nervous system. It acts as a positive allosteric modulator at the GABA\u2090 receptor, binding at the \u03b1-\u03b2 subunit interface (a distinct site from the benzodiazepine binding site at the \u03b1-\u03b3 interface). At clinical concentrations, etomidate potentiates GABA-mediated chloride conductance. At higher concentrations, it can directly activate the GABA\u2090 receptor even in the absence of GABA.\n\nHEMODYNAMIC STABILITY: Etomidate's defining clinical feature is its minimal effect on cardiovascular function. Unlike propofol and thiopental, etomidate does not significantly reduce myocardial contractility, systemic vascular resistance, or baroreceptor reflex sensitivity. Blood pressure and cardiac output are maintained. This makes it the induction agent of choice for hemodynamically unstable patients.\n\nADRENAL SUPPRESSION: Etomidate's major limitation. It reversibly inhibits 11\u03b2-hydroxylase (CYP11B1), the enzyme that converts 11-deoxycortisol to cortisol in the adrenal cortex. Even a SINGLE INDUCTION DOSE (0.3 mg/kg) suppresses cortisol synthesis for 12–24 hours.",
  recPhys: "GABA\u2090 Receptor Physiology:\n\nThe GABA\u2090 receptor is a pentameric ligand-gated Cl\u207b channel, most commonly composed of 2\u03b1 + 2\u03b2 + 1\u03b3 subunits. The receptor has multiple allosteric binding sites for different drug classes:\n\n• GABA binding site: \u03b1-\u03b2 interface (orthosteric site)\n• Benzodiazepine site: \u03b1-\u03b3 interface\n• Etomidate/propofol site: \u03b1-\u03b2 interface (transmembrane domain, distinct from GABA site)\n• Barbiturate site: \u03b2-subunit transmembrane domain\n• Neurosteroid site: \u03b1-subunit transmembrane domain\n\nEtomidate binding at the \u03b1-\u03b2 interface:\n\nStep 1: Etomidate binds in the transmembrane domain at the interface between \u03b1 and \u03b2 subunits. Key residue: \u03b2N265 (asparagine at position 265 on the \u03b2 subunit) is critical for etomidate binding.\n\nStep 2: Allosteric modulation → conformational change increases the receptor's affinity for GABA and prolongs the open time of the Cl\u207b channel.\n\nStep 3: Enhanced Cl\u207b influx → membrane hyperpolarization from resting ~-65 mV toward ~-90 mV → decreased neuronal excitability → CNS depression → loss of consciousness.\n\nAdrenal cortisol synthesis pathway (where etomidate interferes):\nCholesterol → pregnenolone → 17-OH-pregnenolone → 11-deoxycortisol → [11\u03b2-HYDROXYLASE / CYP11B1] → CORTISOL\n\nEtomidate's imidazole ring binds the heme iron of CYP11B1, reversibly inhibiting the enzyme. This blocks the final step of cortisol synthesis. Duration: 12–24h after a single bolus, indefinite with infusion.",
  dosing: [
    { ind: "Induction of Anesthesia", dose: "0.2–0.3 mg/kg IV", notes: "Standard: 0.3 mg/kg. Loss of consciousness in 15–45 sec. Duration of hypnosis: 3–5 min.", clr: "ac" },
    { ind: "RSI (Hemodynamically Unstable)", dose: "0.3 mg/kg IV", notes: "Paired with rocuronium 1.2 mg/kg or SCh 1–1.5 mg/kg. Preferred induction agent in shock, cardiac tamponade, severe cardiac disease.", clr: "wn" },
  ],
  kin: { onset: "15–45 sec (one arm-brain circulation)", onsetD: "Rapid — highly lipophilic, crosses BBB quickly", peak: "1 min", peakD: "Peak brain concentration within 1 min", dur: "3–5 min (single dose)", durD: "Rapid redistribution from brain to peripheral tissues terminates effect", vd: "2.5–4.5 L/kg (large — highly lipophilic)", pb: "75%", hl: "2–5 hours (elimination half-life)", csht: "Short context-sensitive half-time — rapid awakening after single bolus", cl: "Hepatic ester hydrolysis (primary) + renal", model: "Three-compartment" },
  metab: "Primarily HEPATIC: ester hydrolysis by hepatic esterases converts etomidate to its carboxylic acid metabolite, which is pharmacologically INACTIVE.\n\nRapid redistribution (NOT metabolism) terminates the clinical effect after a single bolus. The drug redistributes from the highly perfused brain to less perfused tissues (muscle, fat).\n\nPropylene glycol vehicle: Some formulations use propylene glycol as solvent → PAIN ON INJECTION (30–40% of patients). Newer lipid emulsion formulations reduce injection pain.\n\nElderly: Reduce dose by ~25–50% (0.15–0.2 mg/kg). Reduced Vd and cardiac output → higher brain concentration per dose.",
  warn: [
    { tp: "bb", ti: "Adrenal Suppression (11\u03b2-Hydroxylase Inhibition)", tx: "Single induction dose suppresses cortisol synthesis for 12–24h. Continuous infusion: indefinite adrenal suppression → adrenal crisis. CONTRAINDICATED as continuous infusion for ICU sedation. In sepsis/septic shock: controversial — may worsen outcomes by suppressing stress cortisol response." },
    { tp: "cau", ti: "Myoclonus", tx: "Involuntary myoclonic movements in 30–60% of patients during induction. NOT seizures — subcortical disinhibition. EEG shows cortical depression, not epileptiform activity. Pretreatment with midazolam 1–2 mg or fentanyl 1–2 mcg/kg reduces incidence." },
    { tp: "cau", ti: "Pain on Injection", tx: "30–40% incidence with propylene glycol formulation. Lidocaine pretreatment or lipid emulsion formulation reduces pain." },
    { tp: "cau", ti: "Nausea and Vomiting", tx: "Higher incidence of PONV compared to propofol (which has antiemetic properties). Consider prophylactic antiemetic." },
    { tp: "ci", ti: "Continuous Infusion", tx: "NEVER use as continuous infusion. Prolonged adrenal suppression → Addisonian crisis. Historical mortality data from ICU sedation trials led to this absolute contraindication." },
  ],
  ix: [
    { dr: "Opioids (fentanyl, remifentanil)", ef: "Synergistic CNS depression. Reduce etomidate dose. Opioid pretreatment reduces myoclonus.", sv: "mod" },
    { dr: "Benzodiazepines", ef: "Additive/synergistic CNS depression (both enhance GABA\u2090). Midazolam pretreatment reduces myoclonus. Reduce etomidate dose.", sv: "mod" },
    { dr: "Corticosteroids", ef: "If adrenal suppression is a concern, some practitioners give stress-dose hydrocortisone (100 mg IV) after etomidate in septic patients. Evidence is mixed.", sv: "mod" },
  ],
  pearls: [
    { ti: "Hemodynamic Stability = Main Advantage", tx: "Blood pressure, heart rate, and cardiac output maintained. No histamine release, no sympatholytic effect, baroreceptor reflex intact. THE induction agent for hemorrhagic shock, cardiac tamponade, severe cardiomyopathy, aortic stenosis." },
    { ti: "Adrenal Suppression = Main Limitation", tx: "Even a single dose inhibits 11\u03b2-hydroxylase for 12–24h. In healthy surgical patients: clinically insignificant. In sepsis/critical illness: potentially harmful. CORTICUS sub-study suggested trend toward worse outcomes with etomidate in septic shock, but data is mixed." },
    { ti: "Myoclonus \u2260 Seizures", tx: "Involuntary movements during induction are subcortical disinhibition, NOT epileptiform activity. EEG shows burst suppression. Important to differentiate from actual seizure activity." },
    { ti: "Single Dose Only", tx: "Use ONLY for induction (single bolus). NEVER as infusion. Historical ICU sedation trials showed dramatically increased mortality from sustained adrenal suppression." },
    { ti: "Etomidate vs Ketamine in Shock", tx: "Both maintain hemodynamics. Ketamine: sympathomimetic, bronchodilator, analgesic, no adrenal suppression. Etomidate: more neutral hemodynamics, but adrenal suppression concern. Increasingly, ketamine is preferred in septic shock." },
    { ti: "The GABA\u2090 Binding Map", tx: "Interview pearl: Etomidate/propofol: \u03b1-\u03b2 interface (transmembrane). Benzodiazepines: \u03b1-\u03b3 interface. Barbiturates: \u03b2-subunit transmembrane. Neurosteroids: \u03b1-subunit. Volatile anesthetics: multiple sites. All enhance Cl\u207b conductance." },
  ],
  intQs: [
    { q: "Septic shock patient, MAP 55, needs emergent intubation. Do you use etomidate?", a: "Controversial. Etomidate preserves hemodynamics but suppresses adrenal cortisol synthesis for 12–24h via 11\u03b2-hydroxylase inhibition. Two approaches: (1) Use etomidate, then give stress-dose hydrocortisone (100 mg IV q8h). (2) Use ketamine 1–2 mg/kg instead — sympathomimetic, hemodynamically stable, no adrenal suppression. Increasingly, ketamine is the preferred choice in septic shock." },
    { q: "Patient develops involuntary jerking movements during etomidate induction. Is this a seizure?", a: "No — this is myoclonus (30–60% incidence), caused by subcortical disinhibition. EEG shows burst suppression, NOT epileptiform activity. Management: administer the NMBA (which you're giving anyway for intubation). Prevention: pretreatment with midazolam 1–2 mg or fentanyl 1–2 mcg/kg." },
    { q: "Why is etomidate contraindicated as a continuous infusion?", a: "Continuous etomidate infusion causes SUSTAINED 11\u03b2-hydroxylase (CYP11B1) inhibition → persistent adrenal suppression → no cortisol production → Addisonian crisis. In the 1980s, ICU sedation trials showed dramatically increased mortality. Single-dose use is acceptable because adrenal function recovers within 12–24 hours." },
  ],
}];

const PROTOS = [
  { id: "vfib", name: "VFib / Pulseless VT", cat: "Cardiac Arrest", clr: "#ef4444",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-CA-250527.pdf", ahaYear: 2025,
    sum: "Shockable rhythms — defibrillation is definitive. Every 2-min cycle: CPR → rhythm check → shock → resume CPR.",
    steps: [
      { a: "Confirm arrest", d: "Unresponsive, no pulse/breathing. Activate code. CPR immediately." },
      { a: "High-quality CPR", d: "100–120/min, ≥2 in depth, full recoil, minimize interruptions (<10 sec). 30:2 or continuous once advanced airway." },
      { a: "Defibrillate", d: "200J biphasic (360J mono). Resume CPR immediately after — do NOT pause to check rhythm." },
      { a: "2 min CPR → Rhythm check", d: "Still VF/pVT → shock again → immediate CPR." },
      { a: "Epinephrine 1 mg IV/IO", d: "After 2nd shock. Repeat q3–5 min." },
      { a: "3rd shock → Amiodarone", d: "300 mg IV bolus. May repeat 150 mg. Alt: Lidocaine 1–1.5 mg/kg." },
      { a: "Continue cycles", d: "CPR → check → shock → CPR. Epi q3–5 min. Treat H's and T's." },
      { a: "ROSC achieved", d: "→ Post-arrest care. 12-lead, TTM, hemodynamic optimization." },
    ],
    keys: ["Defib is #1 — every min without it ↓ survival 7–10%", "Epi AFTER 2nd shock, amio AFTER 3rd", "Biphasic stays 200J (no escalation unless manufacturer says)", "Refractory VF: consider double sequential defib, esmolol 500 mcg/kg"] },
  { id: "pea", name: "PEA / Asystole", cat: "Cardiac Arrest", clr: "#f59e0b",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-CA-250527.pdf", ahaYear: 2025,
    sum: "Non-shockable — NO defibrillation. CPR + epinephrine + aggressive H's and T's search.",
    steps: [
      { a: "Confirm non-shockable", d: "PEA: organized activity, no pulse. Asystole: flat line — confirm 2 leads, check gain/connections." },
      { a: "High-quality CPR", d: "Begin immediately. Same standards." },
      { a: "Epinephrine 1 mg ASAP", d: "Give immediately once IV/IO access. Repeat q3–5 min. Earlier epi improves outcomes in non-shockable." },
      { a: "Advanced airway", d: "ETT or SGA. Continuous compressions, ventilate q6 sec. Waveform capnography." },
      { a: "Treat reversible causes", d: "THE key step. PEA/asystole rarely converts without treating the cause." },
      { a: "2 min CPR → check", d: "Organized → pulse check. Still PEA/asystole → continue. Becomes VF → switch algorithm." },
    ],
    keys: ["NO shocks for PEA or asystole", "Narrow PEA → mechanical (tamponade, tension pneumo, PE)", "Wide PEA → metabolic (hyperK, Na channel blocker OD)", "Epi EARLIER in non-shockable vs shockable", "ETCO₂ <10 after 20 min = very poor prognosis"] },
  { id: "hsts", name: "H's and T's", cat: "Cardiac Arrest", clr: "#a855f7",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-CA-250527.pdf", ahaYear: 2025,
    sum: "Reversible causes — systematically evaluate during every arrest.",
    steps: [
      { a: "Hypovolemia", d: "Most common PEA cause. Flat neck veins. Volume, blood products, surgical control." },
      { a: "Hypoxia", d: "Confirm ETT with capnography. Bilateral breath sounds. FiO₂ 100%." },
      { a: "Hydrogen ion (Acidosis)", d: "pH <7.1 impairs contractility + vasopressor response. Bicarb 1 mEq/kg for known severe acidosis or hyperK." },
      { a: "Hypo/Hyperkalemia", d: "HyperK: peaked T → sine wave → VF. CaCl₂ 1g IV (3x more Ca²⁺ than gluconate), insulin/glucose, albuterol. HypoK: replete >3.5." },
      { a: "Hypothermia", d: "<30°C: refractory VF. Withhold vasopressors until >30°C. Rewarm: warm IVF, forced air, lavage, ECMO." },
      { a: "Tension Pneumothorax", d: "Absent BS, tracheal deviation, hard to ventilate. Needle decompression → chest tube." },
      { a: "Tamponade", d: "Beck's triad. Bedside echo: effusion + RV collapse. Pericardiocentesis or thoracotomy." },
      { a: "Toxins", d: "Opioid → naloxone. BB/CCB → glucagon, high-dose insulin. TCA → bicarb. LA toxicity → intralipid 20%." },
      { a: "Thrombosis — PE", d: "Sudden PEA, dilated RV, ↓ETCO₂. tPA 50 mg IV during CPR. Extend resuscitation 60–90 min post-lytic." },
      { a: "Thrombosis — Coronary", d: "STEMI → emergent cath post-ROSC." },
    ],
    keys: ["POCUS during CPR: tamponade, PE, hypovolemia, pneumo", "CaCl₂ first-line for hyperK arrest (NOT gluconate)", "tPA can be given DURING CPR for massive PE", "In TNICU: consider neurogenic causes (herniation, cord injury)"] },
  { id: "brady", name: "Bradycardia", cat: "Bradyarrhythmia", clr: "#3b82f6",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Bradycardia-250514.pdf", ahaYear: 2025,
    sum: "HR <50 with poor perfusion signs. Atropine for AV nodal blocks; pacing for infranodal.",
    steps: [
      { a: "Assess symptoms", d: "Hypotension, AMS, chest pain, acute HF, syncope. Asymptomatic + stable → monitor." },
      { a: "Atropine 1 mg IV", d: "First-line. Repeat q3–5 min, max 3 mg. Blocks M2 muscarinic at SA/AV nodes." },
      { a: "If atropine fails:", d: "Won't work in Mobitz II, 3rd degree block, or denervated hearts." },
      { a: "Transcutaneous pacing", d: "Rate 60–80, increase mA to capture. Sedate — pacing is painful." },
      { a: "Dopamine 2–20 mcg/kg/min", d: "β1 effects ↑ HR and contractility. Temporizing if pacing unavailable." },
      { a: "Epinephrine 2–10 mcg/min", d: "β1 chronotropy. Refractory cases." },
      { a: "Transvenous pacing", d: "Definitive temporary measure. Bridge to permanent pacemaker." },
    ],
    keys: ["Atropine works on AV NODE only — NOT infranodal", "Mobitz I (Wenckebach): AV nodal → may respond to atropine", "Mobitz II: infranodal → pace early", "3rd degree + wide QRS → pace immediately", "Atropine <0.5 mg can paradoxically worsen bradycardia", "BB/CCB OD: glucagon 3–5 mg IV, high-dose insulin"] },
  { id: "tachy", name: "Tachycardia", cat: "Tachyarrhythmia", clr: "#ec4899",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Tachycardia-250514.pdf", ahaYear: 2025,
    sum: "HR >150 with pulse. Branch: STABLE vs UNSTABLE, then NARROW vs WIDE. Unstable = cardiovert.",
    steps: [
      { a: "Assess stability", d: "UNSTABLE: hypotension, AMS, chest pain, acute HF caused by the rhythm → synchronized cardioversion." },
      { a: "Unstable → Cardiovert", d: "Narrow regular: 50–100J. AFib: 120–200J. Wide regular (VT): 100J. Polymorphic VT/Torsades: DEFIB 200J unsync." },
      { a: "Stable narrow regular (SVT)", d: "" },
      { a: "Vagal maneuvers", d: "Modified Valsalva, carotid massage (no bruit). Stimulates vagus → slows AV conduction." },
      { a: "Adenosine 6 mg rapid push", d: "Rapid push + 20 mL flush via stopcock. No conversion → 12 mg. Half-life <10 sec. Warn: chest pressure, flushing." },
      { a: "Stable narrow irregular (AFib)", d: "Diltiazem 0.25 mg/kg IV over 2 min → 5–15 mg/h. Alt: metoprolol 5 mg IV q5min x3. HFrEF: amiodarone." },
      { a: "Stable wide regular (VT)", d: "Amiodarone 150 mg over 10 min. Alt: procainamide 20–50 mg/min (max 17 mg/kg)." },
      { a: "Stable wide irregular", d: "AFib+WPW: AVOID AV nodal blockers → procainamide. Torsades: Mg 1–2g over 15 min." },
    ],
    keys: ["UNSTABLE = cardiovert. STABLE = think then medicate", "Sync cardioversion for all EXCEPT polymorphic VT and VFib → unsync defib", "Never give AV nodal blockers in WPW+AFib → preferential accessory conduction → VFib", "Adenosine: MUST be rapid push + flush. Warn about transient asystole", "In TNICU: consider sympathetic storming post-TBI/SCI"] },
  { id: "rosc", name: "Post-ROSC Care", cat: "Post-Resuscitation", clr: "#22c55e",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/PCAC-Algorithm-ACLS-PCAC-250527.pdf", ahaYear: 2025,
    sum: "After ROSC: optimize O₂/ventilation, hemodynamics, TTM, identify cause, neuroprognosticate ≥72h.",
    steps: [
      { a: "Airway & Ventilation", d: "SpO₂ 92–98% (avoid hyperoxia). PaCO₂ 35–45. Waveform capnography. ETCO₂ >40 = adequate CO." },
      { a: "Hemodynamics", d: "SBP >90 or MAP ≥65 (some target ≥80 for cerebral perfusion). IVF + NE or epi infusion." },
      { a: "12-lead ECG", d: "STEMI → emergent cath regardless of neuro status." },
      { a: "TTM", d: "Comatose patients: 32–36°C for ≥24h. Cold saline, cooling devices. Prevent shivering. Prevent hyperthermia ≥72h." },
      { a: "Glucose", d: "Target 144–180 mg/dL. Avoid hypoglycemia (<80)." },
      { a: "Seizures", d: "Continuous EEG. Treat aggressively (levetiracetam, BZDs, propofol)." },
      { a: "Neuroprognostication", d: "NEVER before 72h post-ROSC. Multimodal: exam, EEG, SSEPs, MRI, NSE." },
    ],
    keys: ["Hyperoxia is harmful — titrate FiO₂ DOWN", "Hypocarbia → cerebral vasoconstriction → worsens ischemia", "TTM for ALL comatose post-arrest (not just shockable)", "No single test is 100% — multimodal approach", "In TNICU: differentiate anoxic injury from underlying neuro pathology"] },
  { id: "pregca", name: "Cardiac Arrest in Pregnancy", cat: "Special Circumstances", clr: "#db2777",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-SC-ACLS-CA-in-Pregnancy-250620.pdf", ahaYear: 2025,
    sum: "Dual-patient emergency. Standard ACLS PLUS continuous lateral uterine displacement, IV above diaphragm, and perimortem cesarean delivery within 5 minutes if no ROSC.",
    steps: [
      { a: "Activate Teams", d: "Assemble maternal cardiac arrest team AND neonatal team simultaneously. Requires OB, anesthesia, neonatal, emergency, ICU, and code team collaboration." },
      { a: "High-Quality CPR", d: "Standard ACLS: CPR, defibrillation when indicated, epinephrine per algorithm. Chest compressions may need hand position slightly higher on sternum due to diaphragm elevation." },
      { a: "Lateral Uterine Displacement", d: "Continuous LEFT lateral uterine displacement to relieve aortocaval compression. Manual displacement preferred over left lateral tilt (maintains flat surface for CPR)." },
      { a: "Maternal Interventions", d: "Airway management by MOST EXPERIENCED provider (difficult airway common in pregnancy). 100% O₂, avoid excess ventilation. IV access ABOVE diaphragm. If on IV magnesium → STOP and give calcium chloride or gluconate." },
      { a: "Obstetric Interventions", d: "Detach fetal monitors. Prepare for perimortem cesarean delivery (PMCD)." },
      { a: "Perimortem Cesarean Delivery", d: "If no ROSC, complete PMCD ideally within 5 minutes of arrest onset. Goal: improve BOTH maternal and fetal outcomes. Delivery relieves aortocaval compression and may restore maternal circulation." },
    ],
    keys: ["ABCDEFGH mnemonic: Anesthetic, Bleeding, Cardiovascular, Drugs, Embolic, Fever, General (H's & T's), Hypertension", "Uterine displacement is IMMEDIATE — do not wait", "IV access ABOVE diaphragm (IVC compression below)", "Stop magnesium → give calcium if on Mg drip", "PMCD benefits MOTHER — not just fetus", "Difficult airway: smaller ETT (6.0–7.0), early video laryngoscopy"] },
  { id: "pals_ca", name: "PALS Cardiac Arrest", cat: "Pediatric", clr: "#f97316",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-CA-250123.pdf", ahaYear: 2025,
    sum: "Pediatric cardiac arrest — CPR ≥⅓ chest depth, 15:2 ratio. Defibrillation 2→4→≥4 J/kg. Epinephrine ASAP for non-shockable. Includes hypoglycemia in reversible causes.",
    steps: [
      { a: "Start CPR", d: "Bag-mask ventilation with oxygen. Attach monitor/defibrillator. Push hard (≥⅓ AP chest diameter), fast (100–120/min). 15:2 ratio without advanced airway." },
      { a: "Rhythm Check — Shockable?", d: "VF/pVT → Shock at 2 J/kg first, 4 J/kg second, ≥4 J/kg subsequent (max 10 J/kg or adult dose). CPR 2 min between shocks." },
      { a: "Epinephrine", d: "IV/IO: 0.01 mg/kg (0.1 mL/kg of 0.1 mg/mL). Max 1 mg. Every 3–5 min. ET dose: 0.1 mg/kg (0.1 mL/kg of 1 mg/mL). For PEA/Asystole: give ASAP. For VF/pVT: after 2nd shock." },
      { a: "Antiarrhythmics (Shockable)", d: "Amiodarone 5 mg/kg IV/IO bolus (may repeat up to 3 total doses) OR Lidocaine 1 mg/kg IV/IO loading dose." },
      { a: "Advanced Airway", d: "ETT or supraglottic airway. Confirm with waveform capnography. Once placed: continuous compressions + 1 breath every 2–3 seconds." },
      { a: "Reversible Causes", d: "Hypovolemia, Hypoxia, H⁺ (acidosis), Hypoglycemia, Hypo/hyperkalemia, Hypothermia + Tension pneumothorax, Tamponade, Toxins, Thrombosis (pulmonary & coronary)." },
    ],
    keys: ["Compression depth ≥⅓ AP diameter (different from adult)", "15:2 ratio in PALS (not 30:2)", "Defibrillation: 2→4→≥4 J/kg (max 10 J/kg)", "Epinephrine ASAP for non-shockable rhythms", "Hypoglycemia added to H's (unique to peds)", "ET epi dose is 10× the IV dose"] },
  { id: "pals_brady", name: "PALS Bradycardia", cat: "Pediatric", clr: "#0ea5e9",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-Bradycardia-250121.pdf", ahaYear: 2025,
    sum: "Pediatric bradycardia — HR <60 with poor perfusion = START CPR. Most common cause is hypoxia. Epinephrine + atropine (for vagal/AV block). CPR threshold different from adult.",
    steps: [
      { a: "Assessment", d: "Maintain patent airway. Positive pressure ventilation with oxygen. Cardiac monitor, pulse, BP, oximetry." },
      { a: "Pulse Check", d: "If no pulse → go to PALS Cardiac Arrest Algorithm." },
      { a: "Cardiopulmonary Compromise?", d: "Acutely altered mental status, signs of shock, or hypotension. If NO → support ABCs, oxygen, observe, 12-lead ECG, treat underlying causes." },
      { a: "Start CPR", d: "If HR <60/min despite adequate oxygenation and ventilation → START CPR." },
      { a: "Medications", d: "Epinephrine IV/IO: 0.01 mg/kg (0.1 mL/kg of 0.1 mg/mL). Repeat q3–5 min. ET: 0.1 mg/kg. Atropine IV/IO: 0.02 mg/kg (min 0.1 mg, max single dose 0.5 mg) — for increased vagal tone or primary AV block." },
      { a: "Consider Pacing", d: "Transthoracic or transvenous pacing if medications ineffective. Identify and treat underlying causes." },
    ],
    keys: ["HR <60 with poor perfusion = START CPR in peds", "Bradycardia in children is usually HYPOXIA — treat airway first", "Atropine min dose 0.1 mg (prevent paradoxical bradycardia)", "Atropine max single dose 0.5 mg in peds", "Possible causes: Hypothermia, Hypoxia, Medications", "Different from adult: CPR threshold is HR <60, not <50"] },
  { id: "pals_tachy", name: "PALS Tachycardia", cat: "Pediatric", clr: "#8b5cf6",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-Tachyarrhythmia-250117.pdf", ahaYear: 2025,
    sum: "Pediatric tachycardia with pulse. Differentiate sinus tach vs SVT by rate thresholds and P waves. Narrow vs wide QRS. Unstable = cardioversion 0.5–1 J/kg. Stable narrow = vagal + adenosine.",
    steps: [
      { a: "Initial Assessment", d: "Airway, oxygen, cardiac monitor, pulse/BP/SpO₂, IV/IO access, 12-lead ECG if available." },
      { a: "Evaluate QRS Duration", d: "Narrow (≤0.09 sec) vs Wide (>0.09 sec). Differentiate sinus tach from SVT: P waves present/normal + variable RR = sinus. P waves absent/abnormal + fixed RR + abrupt onset = SVT." },
      { a: "Heart Rate Thresholds", d: "Sinus tach: Infant usually <220, Child usually <180. SVT: Infant usually ≥220, Child usually ≥180." },
      { a: "Unstable (CP Compromise)", d: "Synchronized cardioversion: 0.5–1 J/kg first, increase to 2 J/kg if ineffective. Sedate if possible but DON'T delay cardioversion. If regular narrow complex, consider adenosine." },
      { a: "Stable — Narrow QRS", d: "Vagal maneuvers (ice to face in infants). Adenosine: 1st dose 0.1 mg/kg rapid bolus (max 6 mg), 2nd dose 0.2 mg/kg (max 12 mg)." },
      { a: "Stable — Wide QRS", d: "Possible VT. Expert consultation advised. If regular and monomorphic, consider adenosine. Synchronized cardioversion if hemodynamically unstable." },
    ],
    keys: ["SVT is the most common symptomatic tachyarrhythmia in peds", "Ice to face = vagal maneuver for infants (do NOT use carotid massage)", "Adenosine: rapid push + immediate NS flush", "Cardioversion energy lower than adult: 0.5–1 → 2 J/kg", "Sinus tach: treat the CAUSE, not the rhythm", "Wide complex in kids: assume VT until proven otherwise"] },
];

const QUIZZES = {
  vasopressors: { label: "Vasopressor Dosing", icon: "Q", items: [
    { q: "78 kg septic shock, MAP 58 despite 2L crystalloid. Vasopressor, dose, target?", a: "Norepinephrine 0.1–0.2 mcg/kg/min. Target MAP ≥65. First-line per SSC: α1 vasoconstriction + moderate β1 inotropy.", c: "Vasopressor Dosing" },
    { q: "On NE 0.5 mcg/kg/min, MAP still 60. Next?", a: "Vasopressin 0.04 units/min (fixed). V1 agonist — non-catecholamine. SSC second-line.", c: "Vasopressor Dosing" },
    { q: "Decompensated HF: CI 1.8, PCWP 28, SVR 1800. Inotrope?", a: "Dobutamine 2.5–10 mcg/kg/min. β1↑contractility, mild β2↓SVR. Alt: milrinone if on β-blockers.", c: "Vasopressor Dosing" },
    { q: "Max phenylephrine infusion and receptor?", a: "0.5–5 mcg/kg/min (up to 10). Pure α1. Watch reflex bradycardia.", c: "Vasopressor Dosing" },
    { q: "Ephedrine vs phenylephrine at receptor level?", a: "Ephedrine: indirect sympathomimetic (releases NE) → mixed α1+β1/β2. Maintains HR/CO+SVR. Tachyphylaxis. PE: direct pure α1.", c: "Vasopressor Dosing" },
  ]},
  acls: { label: "ACLS Algorithms", icon: "Q", items: [
    { q: "VFib witnessed. Walk through the first 2 cycles.", a: "Call code → CPR (100–120/min, 2+in) → defib pads → 2 min check → shock 200J → CPR → IV/IO → after 2nd shock: epi 1mg q3–5min → after 3rd: amio 300mg.", c: "ACLS" },
    { q: "PEA, HR 40 on monitor, no pulse. Priorities?", a: "CPR (NO shocks). Epi 1mg ASAP q3–5min. H's and T's aggressively. Narrow PEA→mechanical. Wide PEA→metabolic.", c: "ACLS" },
    { q: "Wide-complex tachy 180, alert, BP 108/72. Management?", a: "Stable → amiodarone 150mg over 10min. Alt: procainamide. Polymorphic+long QTc → Mg 1–2g. Unstable → sync cardioversion 100J.", c: "ACLS" },
    { q: "Post-ROSC, comatose, temp 37.8°C. TTM protocol?", a: "32–36°C ≥24h. Cool with saline/devices. Treat shivering. Prevent hyperthermia ≥72h. Neuroprognosticate ≥72h.", c: "ACLS" },
    { q: "Name all H's and T's.", a: "H's: Hypovolemia, Hypoxia, H+ (acidosis), Hypo/HyperK, Hypothermia. T's: Tension pneumo, Tamponade, Toxins, Thrombosis (PE + coronary).", c: "ACLS" },
  ]},
};

const SYS = {
  cardio: { n: "Cardiovascular", i: "", c: "#ef4444" },
  neuro: { n: "Neurological", i: "", c: "#a855f7" },
  respiratory: { n: "Respiratory", i: "", c: "#3b82f6" },
  renal: { n: "Renal", i: "", c: "#f59e0b" },
  pharm: { n: "Pharmacology", i: "", c: "#2dd4bf" },
};


const RECEPTORS = [
  {
    id: "lgic",
    name: "Ligand-Gated Ion Channels",
    short: "Ionotropic Receptors",
    speed: "Milliseconds",
    location: "Cell membrane",
    structure: "Pentameric channel",
    mechanism: "Direct ion flux",
    amplification: "None (1:1 ion flow)",
    examples: "GABA-A, nACh, NMDA, Glycine, 5-HT3",
    prototypeDrug: "Propofol, Succinylcholine",
    color: "#3b82f6",
    linkedMeds: [{ id: "propofol", name: "Propofol", note: "GABA-A potentiator" },{ id: "etomidate", name: "Etomidate", note: "GABA-A modulator (α-β interface)" },{ id: "succinylcholine", name: "Succinylcholine", note: "nAChR agonist (depolarizing)" },{ id: "rocuronium", name: "Rocuronium", note: "nAChR antagonist (competitive)" },{ id: "vecuronium", name: "Vecuronium", note: "nAChR antagonist (competitive)" },{ id: "cisatracurium", name: "Cisatracurium", note: "nAChR antagonist (competitive)" }],
    futureMeds: "Ketamine, Midazolam",
    overview: [
      "Ligand-gated ion channels (LGICs) are transmembrane protein complexes that function as both receptor AND ion channel in a single macromolecule. Binding the ligand directly opens or closes the channel with no intermediary signaling molecules, making them the fastest-acting receptor class.",
      "The general structure consists of 4-5 protein subunits arranged around a central ion-conducting pore. Each subunit has an extracellular domain (ligand binding), transmembrane domains (forming the pore), and intracellular domains. This pentameric arrangement is characteristic of the Cys-loop superfamily, which includes GABA-A, nicotinic ACh, glycine, and 5-HT3 receptors.",
      "The key characteristic is speed: signal transduction occurs on a millisecond timescale. This is why LGICs mediate rapid neurotransmission, synaptic signaling, and muscle contraction -- processes that cannot wait for second messenger cascades.",
      "LGICs fall into two functional categories. Excitatory channels permit Na+ and/or Ca2+ influx, producing depolarization (examples: nicotinic ACh receptor at the NMJ, NMDA and AMPA glutamate receptors). Inhibitory channels permit Cl- influx, producing hyperpolarization (examples: GABA-A and glycine receptors).",
      "A critical distinction for anesthesia practice is allosteric modulation vs. direct agonism. Propofol, benzodiazepines, and barbiturates all act at the GABA-A receptor, but at different binding sites with different clinical profiles. Benzodiazepines bind the alpha-gamma interface and increase channel opening frequency. Barbiturates and propofol bind the beta subunit and increase channel opening duration. At high concentrations, propofol and barbiturates can directly open the channel even without GABA -- benzodiazepines cannot, which is why they have a ceiling effect and greater safety margin."
    ],
    cascade: [
      "The signaling cascade of LGICs is elegantly simple compared to other receptor types: ligand binds --> conformational change --> pore opens --> ions flow down their electrochemical gradient --> immediate change in membrane potential. There are no second messengers, no enzymatic amplification, and no intermediate signaling proteins.",
      "Ion selectivity is determined by the amino acid residues lining the channel pore. Negatively charged residues (glutamate, aspartate) attract cations (Na+, Ca2+, K+) and repel anions. Positively charged or neutral residues allow anion (Cl-) passage. The pore diameter and charge distribution together create a selective filter.",
      "For GABA-A receptors specifically: GABA binding at the alpha-beta subunit interface triggers a conformational change that rotates the M2 transmembrane helices, opening the central pore. Cl- ions flow inward (down their concentration gradient), driving the membrane potential more negative (hyperpolarization). This makes the postsynaptic neuron less likely to fire an action potential -- the basis of neural inhibition.",
      "Desensitization is a clinically important phenomenon: prolonged agonist exposure causes the receptor to enter a desensitized state -- the channel is closed despite the agonist still being bound. This is directly relevant to succinylcholine's Phase II block, where sustained depolarization at the NMJ leads to receptor desensitization and a clinical picture resembling non-depolarizing blockade."
    ],
    clinical: [
      { name: "GABA-A", subunits: "alpha(1-6), beta(1-3), gamma(1-3) -- most common: alpha1-beta2-gamma2", ions: "Cl- influx", drugs: "Propofol (beta subunit), Benzodiazepines (alpha-gamma interface), Barbiturates (beta subunit), Etomidate (alpha-beta interface), Volatile anesthetics", significance: "Primary target of most IV and inhaled anesthetics. Allosteric modulation increases Cl- conductance --> CNS depression." },
      { name: "Nicotinic ACh (NMJ)", subunits: "alpha2-beta-delta-epsilon (adult) or alpha2-beta-delta-gamma (fetal)", ions: "Na+/K+ (nonselective cation)", drugs: "Succinylcholine (depolarizing agonist), Rocuronium/Vecuronium/Cisatracurium (non-depolarizing antagonists)", significance: "ACh binds at alpha-delta and alpha-epsilon interfaces. Both sites must be occupied for channel opening. NMBAs block one or both sites." },
      { name: "Nicotinic ACh (Ganglionic)", subunits: "alpha3-beta4 (predominant)", ions: "Na+/K+ (nonselective cation)", drugs: "Trimethaphan (historical), Hexamethonium (historical)", significance: "Mediates fast synaptic transmission at autonomic ganglia. High-dose NMBAs can produce ganglionic blockade (e.g., tubocurarine --> histamine release + ganglionic block --> hypotension)." },
      { name: "NMDA Glutamate", subunits: "NR1 (obligatory) + NR2A-D", ions: "Ca2+, Na+ influx; K+ efflux", drugs: "Ketamine (channel pore blocker), Nitrous oxide, Magnesium (physiologic blocker)", significance: "Voltage-dependent Mg2+ block at resting potential. Requires both glutamate + glycine (co-agonist) for activation. Ketamine binds the PCP site inside the open channel pore." },
      { name: "5-HT3 (Serotonin)", subunits: "Homomeric (5-HT3A) or heteromeric (5-HT3A/B)", ions: "Na+/K+ (nonselective cation)", drugs: "Ondansetron, Granisetron, Palonosetron (antagonists)", significance: "Located in CTZ and vagal afferents. Antagonism is the primary mechanism of serotonin-receptor-targeted antiemetics for PONV." },
      { name: "Glycine", subunits: "alpha1-3, beta -- pentameric (alpha3-beta2)", ions: "Cl- influx", drugs: "Strychnine (antagonist -- convulsant poison), Volatile anesthetics (potentiators)", significance: "Major inhibitory receptor in spinal cord and brainstem. Mediates reciprocal inhibition of motor neurons. Also serves as co-agonist at NMDA receptors." },
      { name: "AMPA Glutamate", subunits: "GluA1-4 (tetrameric)", ions: "Na+/K+ (most subtypes exclude Ca2+)", drugs: "Perampanel (antagonist -- antiepileptic), volatile anesthetics (mild inhibition)", significance: "Mediates fast excitatory synaptic transmission throughout the CNS. Unlike NMDA receptors, AMPA channels open rapidly without requiring membrane depolarization or co-agonist binding. AMPA receptor activation provides the initial depolarization needed to relieve the Mg2+ block on NMDA receptors -- the two work in sequence during excitatory transmission." }
    ]
  },
  {
    id: "gpcr",
    name: "G-Protein Coupled Receptors",
    short: "GPCRs / Metabotropic Receptors",
    speed: "Seconds-minutes",
    location: "Cell membrane",
    structure: "7TM + G-protein",
    mechanism: "G-protein --> second messengers",
    amplification: "High (cascade)",
    examples: "alpha/beta adrenergic, opioid, V1/V2",
    prototypeDrug: "Norepinephrine, Morphine",
    color: "#2dd4bf",
    linkedMeds: [
      { id: "norepinephrine", name: "Norepinephrine", note: "alpha-1/beta-1 agonist" },
      { id: "vasopressin", name: "Vasopressin", note: "V1a/V2 agonist" },
      { id: "epinephrine", name: "Epinephrine", note: "Non-selective alpha+beta agonist" },
      { id: "phenylephrine", name: "Phenylephrine", note: "Pure alpha-1 agonist" },
      { id: "ephedrine", name: "Ephedrine", note: "Indirect NE release + direct alpha/beta" },
      { id: "atropine", name: "Atropine", note: "M2 muscarinic antagonist" },
      { id: "glycopyrrolate", name: "Glycopyrrolate", note: "M1/M2/M3 antagonist" },
      { id: "labetalol", name: "Labetalol", note: "alpha-1 + beta antagonist" },
      { id: "hydralazine", name: "Hydralazine", note: "NO/cGMP pathway vasodilator" }
    ],
    futureMeds: "Epinephrine, Phenylephrine, Dobutamine, Atropine, Glycopyrrolate, Fentanyl/Morphine, Albuterol",
    overview: [
      "G-Protein Coupled Receptors (GPCRs) are the largest and most therapeutically targeted receptor superfamily, with over 800 encoded in the human genome. An estimated 34% of all FDA-approved drugs act on GPCRs, making this the single most important receptor class for clinical pharmacology.",
      "The signature structure is seven transmembrane alpha-helical domains (7TM), with an extracellular N-terminus for ligand binding and an intracellular C-terminus for G-protein coupling. The transmembrane helices create a ligand-binding pocket within the membrane plane.",
      "The tripartite signaling unit is: Receptor --> G-protein --> Effector. The receptor itself has no enzymatic or channel activity. It acts as a molecular switch that activates a heterotrimeric G-protein (alpha, beta, gamma subunits) on the intracellular side.",
      "The G-protein cycle: (1) Inactive state: G-alpha bound to GDP, associated with G-beta-gamma complex. (2) Ligand binding triggers receptor conformational change, causing G-alpha to exchange GDP for GTP and dissociate from G-beta-gamma. (3) Both G-alpha-GTP and free G-beta-gamma activate downstream effectors. (4) G-alpha has intrinsic GTPase activity that hydrolyzes GTP back to GDP, causing reassociation with G-beta-gamma and resetting the cycle.",
      "The key characteristic is amplification: one activated receptor can activate many G-proteins, and each G-protein can activate many effector molecules. Signal is amplified at every step -- a single activated adenylyl cyclase can synthesize thousands of cAMP molecules. This is why small amounts of circulating catecholamines produce large physiologic responses. Timescale: seconds to minutes.",
      "There are four major G-protein families: Gs (stimulatory -- activates adenylyl cyclase), Gi (inhibitory -- inhibits adenylyl cyclase), Gq (activates phospholipase C), and G12/13 (activates Rho-GEF for cytoskeletal changes). Understanding which G-protein a receptor couples to is the single most important concept for predicting the clinical effect of any drug acting at GPCRs. Interview pearl: cholera toxin permanently activates Gs (locks it in GTP-bound state causing persistent cAMP production and secretory diarrhea), while pertussis toxin inactivates Gi (prevents GDP-GTP exchange, removing the inhibitory brake on adenylyl cyclase)."
    ],
    cascade: [
      "Gq-coupled receptors (alpha-1 adrenergic, V1a vasopressin, M1/M3 muscarinic): G-alpha-q activates phospholipase C (PLC), which cleaves PIP2 into IP3 + DAG. IP3 binds IP3 receptors on the sarcoplasmic/endoplasmic reticulum, triggering Ca2+ release from intracellular stores. Ca2+ binds calmodulin, which activates MLCK (myosin light chain kinase), leading to myosin light chain phosphorylation and smooth muscle contraction/vasoconstriction. DAG simultaneously activates PKC for additional phosphorylation events.",
      "Gs-coupled receptors (beta-1, beta-2 adrenergic, V2 vasopressin, D1 dopamine): G-alpha-s activates adenylyl cyclase, increasing cAMP production, which activates PKA. In the heart (beta-1): PKA phosphorylates L-type Ca2+ channels (increased Ca2+ influx --> increased contractility), phospholamban (increased SR Ca2+ reuptake --> increased lusitropy), troponin I, and HCN channels (increased chronotropy). In vascular smooth muscle (beta-2): PKA phosphorylates MLCK (inactivating it), producing vasodilation and bronchodilation. At V2 receptors: PKA triggers aquaporin-2 insertion into the collecting duct for water reabsorption.",
      "Gi-coupled receptors (alpha-2 adrenergic, M2 muscarinic, mu/delta/kappa opioid, D2 dopamine): G-alpha-i inhibits adenylyl cyclase, reducing cAMP and PKA activity. Additionally, the G-beta-gamma subunits directly activate GIRK channels (G-protein-gated inwardly rectifying K+ channels), producing K+ efflux, hyperpolarization, and reduced neuronal firing or heart rate (vagal M2). This is the mechanism behind opioid receptor signaling, alpha-2 presynaptic autoreceptor feedback, and dexmedetomidine's sedative/analgesic effect.",
      "G12/13-coupled receptors (thromboxane A2, thrombin/PAR-1): G-alpha-12/13 activates Rho-GEF, which activates the small GTPase RhoA. RhoA activates Rho kinase (ROCK), which promotes cytoskeletal rearrangement, stress fiber formation, and smooth muscle contraction. This pathway is particularly important for platelet shape change during aggregation and for certain vascular smooth muscle contraction mechanisms independent of the Ca2+/MLCK pathway.",
      "Signal termination -- Phosphodiesterases (PDEs): Both cAMP and cGMP are degraded by phosphodiesterases. PDE breaks cAMP into inactive AMP, and cGMP into GMP, terminating the signal. This is a critical drug target: milrinone (PDE3 inhibitor) prevents cAMP breakdown in cardiomyocytes, producing inotropy and lusitropy WITHOUT requiring beta-receptor activation -- this is why it works in beta-receptor-downregulated heart failure when dobutamine fails. Sildenafil (PDE5 inhibitor) prevents cGMP breakdown in pulmonary vascular smooth muscle, producing pulmonary vasodilation for pulmonary hypertension. Roflumilast (PDE4 inhibitor) is used in COPD.",
      "The nitric oxide (NO) / cGMP pathway: In endothelial cells, eNOS (endothelial nitric oxide synthase) converts L-arginine + O2 into citrulline + NO, stimulated by shear stress, increased intracellular Ca2+, and neurotransmitters (acetylcholine, bradykinin, histamine, substance P). NO is a volatile gas with a half-life of only 2-30 seconds that freely diffuses across cell membranes into adjacent smooth muscle cells. There, NO activates soluble guanylate cyclase (sGC), converting GTP to cGMP. cGMP activates protein kinase G (PKG), which inhibits Ca2+ release from the SR, decreasing intracellular Ca2+ and producing smooth muscle relaxation and vasodilation. Nitroglycerin and nitroprusside work by generating NO, which explains their rapid vasodilatory effects on coronary arteries, pulmonary arteries, and peripheral veins (decreased preload)."
    ],
    gTable: [
      { gType: "Gq", receptors: "alpha-1, V1a, M1/M3, H1, AT1", effector: "PLC", messengers: "IP3, DAG, Ca2+", kinase: "PKC, CaM kinase", effect: "Vasoconstriction, bronchoconstriction, secretion" },
      { gType: "Gs", receptors: "beta-1, beta-2, beta-3, V2, D1, H2, 5-HT4", effector: "Adenylyl cyclase (activate)", messengers: "cAMP (increase)", kinase: "PKA", effect: "Increased HR/contractility, vasodilation, bronchodilation" },
      { gType: "Gi", receptors: "alpha-2, M2, mu/delta/kappa opioid, D2, GABA-B, 5-HT1", effector: "Adenylyl cyclase (inhibit)", messengers: "cAMP (decrease)", kinase: "PKA (decrease)", effect: "Bradycardia, sedation, analgesia, decreased NE release" }
    ],
    clinical: [
      { system: "Heart", receptors: "beta-1 (Gs) -- chronotropy, inotropy, dromotropy. M2 (Gi) -- vagal slowing via GIRK channel K+ efflux." },
      { system: "Vasculature", receptors: "alpha-1 (Gq) -- vasoconstriction via Ca2+/MLCK. beta-2 (Gs) -- vasodilation via cAMP/PKA inactivating MLCK." },
      { system: "Lungs", receptors: "beta-2 (Gs) -- bronchodilation (albuterol target). M3 (Gq) -- bronchoconstriction." },
      { system: "Kidney", receptors: "V2 (Gs) -- aquaporin-2 insertion, water reabsorption. D1 (Gs) -- renal vasodilation (fenoldopam, low-dose dopamine)." },
      { system: "CNS", receptors: "mu-opioid (Gi) -- analgesia, sedation, respiratory depression. alpha-2 (Gi) -- sedation, sympatholysis (dexmedetomidine)." }
    ],
    receptorEffects: [
      { category: "Sympathetic alpha", gq: "alpha-1", gs: "N/A", gi: "alpha-2", effects: "alpha-1: contraction of vascular smooth muscle, pupillary dilator (mydriasis), bladder/intestinal sphincters. alpha-2: inhibits NE release (presynaptic autoreceptor), inhibits insulin release, inhibits lipolysis, induces platelet aggregation." },
      { category: "Sympathetic beta", gq: "N/A", gs: "beta-1, beta-2, beta-3", gi: "N/A", effects: "beta-1: increased HR (chronotropy), contractility (inotropy), conduction (dromotropy), renin secretion. beta-2: vasodilation, bronchodilation, uterine relaxation (tocolysis), insulin secretion, glycogenolysis, hypokalemia (increased cellular K+ uptake). beta-3: lipolysis, thermogenesis in skeletal muscle, bladder smooth muscle relaxation (mirabegron)." },
      { category: "Parasympathetic muscarinic", gq: "M1, M3", gs: "N/A", gi: "M2", effects: "M1: cognitive function, enteric nervous system. M2: decreased HR, decreased atrial contraction strength. M3: contraction of bladder, bronchi, pupillary sphincter (miosis), ciliary body (accommodation); increases secretions (lacrimal, sweat, salivary, gastric acid); intestinal peristalsis; endothelium-mediated vasodilation (via NO release)." },
      { category: "Histamine", gq: "H1", gs: "H2", gi: "N/A", effects: "H1 (Gq): bronchoconstriction, increased vascular permeability, mucus production, pruritus, pain. H2 (Gs): increased gastric acid secretion." },
      { category: "Dopamine", gq: "N/A", gs: "D1", gi: "D2", effects: "D1 (Gs): renal vasculature vasodilation, activation of striatum direct pathway. D2 (Gi): regulates cerebral neurotransmitter release, inhibits striatum indirect pathway." },
      { category: "Vasopressin", gq: "V1", gs: "V2", gi: "N/A", effects: "V1 (Gq): vascular smooth muscle contraction (vasoconstriction). V2 (Gs): aquaporin-2 insertion in renal collecting tubules (water reabsorption), increased vWF release." }
    ]
  },
  {
    id: "rtk",
    name: "Enzyme-Linked Receptors",
    short: "Receptor Tyrosine Kinases & Related",
    speed: "Minutes-hours",
    location: "Cell membrane",
    structure: "Single TM + kinase domain",
    mechanism: "Phosphorylation cascades",
    amplification: "Moderate",
    examples: "Insulin-R, EGFR, ANP-R, JAK-STAT",
    prototypeDrug: "Insulin",
    color: "#a855f7",
    linkedMeds: [],
    futureMeds: "Insulin, Heparin (indirect), Protamine",
    overview: [
      "Enzyme-linked receptors have a single transmembrane domain with an extracellular ligand-binding domain and an intracellular catalytic (enzymatic) domain. The receptor IS the enzyme -- ligand binding directly activates intracellular kinase activity without requiring G-proteins or ion flux.",
      "The most clinically relevant subtype is the receptor tyrosine kinase (RTK): ligand binding triggers receptor dimerization, followed by cross-phosphorylation of tyrosine residues on the intracellular domain. These phosphorylated tyrosines serve as docking sites for intracellular signaling proteins containing SH2 domains.",
      "The timescale is minutes to hours. These receptors primarily regulate growth, differentiation, metabolism, and cell survival rather than moment-to-moment physiology. This is why they are less commonly targeted by acute ICU medications but are critical for understanding insulin signaling, growth factors, and many chemotherapeutic agents (tyrosine kinase inhibitors like imatinib).",
      "Key subtypes include: Receptor tyrosine kinases (RTKs) such as insulin receptor, EGF receptor, VEGF receptor, and PDGF receptor. Receptor serine/threonine kinases: the TGF-beta receptor phosphorylates SMAD proteins on serine/threonine residues rather than tyrosine -- SMADs then dimerize and translocate to the nucleus to regulate gene expression controlling fibrosis, immune regulation, and wound healing. Receptor guanylyl cyclases: the ANP/BNP receptor directly catalyzes GTP to cGMP upon ligand binding (membrane-bound guanylate cyclase, distinct from the soluble guanylate cyclase activated by NO). And tyrosine kinase-associated receptors (JAK-STAT pathway): cytokine receptors (IL-2, IL-6, IFN, EPO, TPO, G-CSF, GH, prolactin) lack intrinsic kinase activity but associate with JAK kinases upon ligand binding -- JAK phosphorylation activates STAT proteins which dimerize and translocate to the nucleus for gene transcription."
    ],
    cascade: [
      "The RTK activation sequence using the insulin receptor as the primary example: (1) Insulin binds the extracellular alpha subunits, triggering a conformational change. (2) Intracellular beta subunits cross-phosphorylate each other on specific tyrosine residues (autophosphorylation). (3) Phosphotyrosines recruit IRS-1 (insulin receptor substrate) via SH2 domains. (4) IRS-1 activates PI3K, which converts PIP2 to PIP3. (5) PIP3 activates Akt/PKB. (6) Akt triggers GLUT4 transporter translocation to the cell membrane, enabling glucose uptake.",
      "Akt also activates glycogen synthase (promoting glycogen storage), inhibits gluconeogenesis, and promotes protein synthesis through the mTOR pathway.",
      "ICU/anesthesia relevance: insulin resistance in critical illness is driven by stress hormones (cortisol, epinephrine, glucagon) that antagonize insulin signaling at multiple points. Epinephrine directly suppresses insulin secretion (via alpha-2 receptors on beta cells) AND impairs downstream insulin signaling. This is why patients on vasopressor infusions, particularly epinephrine, often develop severe hyperglycemia requiring insulin drips. Understanding this cascade informs tight glycemic control protocols in the ICU."
    ],
    clinical: [
      { target: "Insulin Receptor", relevance: "Glucose management perioperatively, insulin drip protocols in ICU, stress hyperglycemia pathophysiology, tight glycemic control debates (NICE-SUGAR trial)." },
      { target: "ANP/BNP Receptor", relevance: "Natriuretic peptide system, nesiritide (recombinant BNP), BNP/NT-proBNP as heart failure biomarkers, cGMP-mediated vasodilation." },
      { target: "Tyrosine Kinase Inhibitors", relevance: "Perioperative considerations for oncology patients: drug interactions, impaired wound healing, bleeding risk, QTc prolongation (sunitinib), hypertension (bevacizumab/VEGF pathway)." },
      { target: "JAK-STAT Pathway", relevance: "Cytokine storm in sepsis, understanding IL-6/TNF-alpha signaling, newer immunomodulatory agents (tofacitinib, baricitinib), rationale for tocilizumab in severe COVID/cytokine storm." }
    ]
  },
  {
    id: "nuclear",
    name: "Intracellular (Nuclear) Receptors",
    short: "Transcription Factor Receptors",
    speed: "Hours-days",
    location: "Cytoplasm / Nucleus",
    structure: "Transcription factor",
    mechanism: "Gene transcription",
    amplification: "High (gene products)",
    examples: "Glucocorticoid-R, Thyroid-R, PPAR",
    prototypeDrug: "Dexamethasone",
    color: "#f59e0b",
    linkedMeds: [],
    futureMeds: "Hydrocortisone, Dexamethasone, Methylprednisolone, Levothyroxine",
    overview: [
      "Intracellular receptors are located inside the cell -- either in the cytoplasm or the nucleus -- NOT on the cell membrane. The ligand must be lipophilic enough to cross the plasma membrane to reach its receptor. This includes steroid hormones, thyroid hormones, vitamin D, and retinoids.",
      "The general mechanism: a lipophilic ligand diffuses through the membrane and binds to an intracellular receptor protein. The ligand-receptor complex acts as a transcription factor, binding to specific DNA response elements in the nucleus to activate or repress gene transcription. This leads to altered mRNA production and ultimately altered protein synthesis.",
      "The key characteristic is the slowest onset of all receptor types -- hours to days for full effect, because the mechanism involves gene transcription and new protein synthesis. This is why a single dose of IV dexamethasone doesn't produce its full anti-inflammatory effect for 4-6 hours.",
      "Type I receptors (cytoplasmic) normally reside in the cytoplasm bound to heat shock proteins (HSP90). Ligand binding causes HSP90 to dissociate. The receptor-ligand complex then translocates to the nucleus, dimerizes, and binds DNA hormone response elements (HREs). Examples: glucocorticoid receptor (GR), mineralocorticoid receptor (MR), estrogen receptor (ER).",
      "Type II receptors (nuclear) are already in the nucleus, typically bound to DNA as a heterodimer with RXR (retinoid X receptor), in a repressed state. Ligand binding causes a conformational change that releases corepressors and recruits coactivators, activating gene transcription. Examples: thyroid hormone receptor (TR), vitamin D receptor (VDR), PPAR receptors.",
      "Mnemonic for cytoplasmic (Type I) steroid receptor ligands -- PETCA: Progesterone, Estrogen, Testosterone, Cortisol, Aldosterone. Nuclear (Type II) receptors bind thyroid hormones (T3/T4) and calcitriol (vitamin D). A key structural detail: all nuclear receptors share a common domain architecture with a zinc-finger DNA-binding domain, a ligand-binding domain, and a transactivation domain."
    ],
    cascade: [
      "The glucocorticoid receptor pathway (most relevant for ICU/anesthesia): (1) Cortisol (or hydrocortisone/dexamethasone) crosses the cell membrane due to lipophilicity. (2) Binds the glucocorticoid receptor (GR) in the cytoplasm, causing HSP90 to dissociate. (3) The GR-cortisol complex dimerizes and translocates to the nucleus through nuclear pores. (4) Binds glucocorticoid response elements (GREs) on DNA.",
      "Transactivation: the GR-ligand complex upregulates anti-inflammatory proteins including lipocortin-1/annexin A1 (inhibits phospholipase A2, blocking arachidonic acid release), IkB-alpha (sequesters NF-kB in cytoplasm), and IL-10 (anti-inflammatory cytokine).",
      "Transrepression: the GR-ligand complex directly inhibits NF-kB and AP-1 transcription factors, suppressing production of pro-inflammatory cytokines (TNF-alpha, IL-1, IL-6), COX-2, iNOS, and adhesion molecules. This dual mechanism -- turning on anti-inflammatory genes AND turning off pro-inflammatory genes -- produces the potent anti-inflammatory and immunosuppressive effects.",
      "The net clinical effect also includes a permissive effect on catecholamine sensitivity: glucocorticoids upregulate adrenergic receptor expression. This is why hydrocortisone in refractory septic shock (ADRENAL, APROCCHSS trials) works not through direct vasoconstriction but by restoring adrenergic receptor responsiveness and suppressing the inflammatory cascade. The delayed onset of these gene-transcription-dependent effects explains why stress-dose steroids take hours to show benefit."
    ],
    clinical: [
      { target: "Glucocorticoid Receptor", relevance: "Stress-dose steroids in refractory septic shock (hydrocortisone 50mg q6h), perioperative steroid coverage for chronic steroid use/adrenal insufficiency, dexamethasone for PONV (4mg IV) and airway edema, methylprednisolone for spinal cord injury (NASCIS controversy -- largely abandoned). Cortisol's role in the physiologic stress response." },
      { target: "Mineralocorticoid Receptor", relevance: "Aldosterone's role in Na+/K+ balance via ENaC channels in the collecting duct. Fludrocortisone as adjunct in septic shock. Spironolactone/eplerenone in heart failure (RALES, EMPHASIS-HF trials)." },
      { target: "Thyroid Hormone Receptor", relevance: "Thyroid storm perioperative management (beta-blockade + thionamide + iodine + steroids), myxedema coma (IV levothyroxine + hydrocortisone), amiodarone-induced thyroid dysfunction (Type I: excess iodine; Type II: thyroiditis)." },
      { target: "PPAR Receptors", relevance: "Thiazolidinediones (pioglitazone) for diabetes via PPAR-gamma activation. Emerging relevance in critical illness metabolism and fibrates (PPAR-alpha) in dyslipidemia." }
    ]
  }
];

// Small Components
const SL = ({ t, icon, title, count, color, collapsed, onToggle }) => (
  <div onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", marginTop: "12px", cursor: onToggle ? "pointer" : "default", userSelect: "none" }}>
    {onToggle && <span style={{ fontSize: "11px", color: color || t.tM, transition: "transform 0.2s", transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", display: "inline-block" }}>{"\u25BC"}</span>}
    <span style={{ fontSize: "16px" }}>{icon}</span>
    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: color || t.tx }}>{title}</h3>
    <span style={{ background: t.bgS, color: t.tM, padding: "2px 9px", borderRadius: "10px", fontSize: "11px", fontWeight: 500 }}>{count}</span>
  </div>
);

const Stat = ({ t, label, value, icon, accent, onClick }) => (
  <div onClick={onClick} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, display: "flex", alignItems: "center", gap: "14px", cursor: onClick ? "pointer" : "default", transition: "border-color 0.15s, box-shadow 0.15s" }}
    onMouseEnter={e => { if (onClick) { e.currentTarget.style.borderColor = accent || t.ac; e.currentTarget.style.boxShadow = `0 0 0 1px ${accent || t.ac}30`; } }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = t.bd; e.currentTarget.style.boxShadow = "none"; }}>
    <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: accent ? `${accent}15` : t.aD, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>{icon}</div>
    <div><div style={{ fontSize: "11px", color: t.tM, fontWeight: 500 }}>{label}</div><div style={{ fontSize: "22px", fontWeight: 700 }}>{value}</div></div>
    {onClick && <div style={{ marginLeft: "auto", color: t.tM, fontSize: "14px" }}>›</div>}
  </div>
);

const PH = ({ t, text }) => (
  <div style={{ padding: "24px", background: t.bgS, borderRadius: "10px", border: `1px dashed ${t.bd}`, display: "flex", alignItems: "center", justifyContent: "center", color: t.tM, fontSize: "13px", minHeight: "80px" }}>{text}</div>
);

const Pill = ({ t, text, active, onClick }) => (
  <button onClick={onClick} style={{ padding: "5px 14px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600, background: active ? t.ac : "transparent", color: active ? t.acTx : t.t2, transition: "all 0.15s" }}>{text}</button>
);

const Stars = ({ value, onChange, t }) => (
  <div style={{ display: "flex", gap: "3px" }}>
    {[1, 2, 3, 4, 5].map(n => (
      <button key={n} onClick={() => onChange(n)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: n <= value ? t.wn : t.tM, transition: "color 0.15s", padding: "0 1px" }}>{n <= value ? "\u2605" : "\u2606"}</button>
    ))}
  </div>
);

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
              ← Back
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


// CARD COMPONENTS
function ItemCard({ item, t, conf, onConf, onOpen }) {
  return (
    <div onClick={onOpen} style={{ padding: "14px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div><div style={{ fontSize: "15px", fontWeight: 600 }}>{item.name}</div><div style={{ fontSize: "11px", color: t.tM }}>{item.brand}</div></div>
        <div onClick={e => e.stopPropagation()}><Stars value={conf || 0} onChange={onConf} t={t} /></div>
      </div>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "8px" }}>
        {item.tags.slice(0, 2).map(tg => <span key={tg} style={{ background: t.aD, color: t.ac, padding: "2px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: 500 }}>{tg}</span>)}
      </div>
    </div>
  );
}

function ProtoCard({ p, t, conf, onConf, onOpen }) {
  return (
    <div onClick={onOpen} style={{ padding: "14px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, borderLeft: `4px solid ${p.clr}`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
        <div><div style={{ fontSize: "15px", fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: "11px", color: t.tM }}>{p.cat}</div></div>
        <div onClick={e => e.stopPropagation()}><Stars value={conf || 0} onChange={onConf} t={t} /></div>
      </div>
      <div style={{ fontSize: "12px", color: t.t2, marginTop: "6px", lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.sum}</div>
      {p.ahaPdf && <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "8px", background: "#c8102e15", border: "1px solid #c8102e30", borderRadius: "4px", padding: "2px 8px", fontSize: "10px", fontWeight: 700, color: "#c8102e" }}>AHA {p.ahaYear} PDF</div>}
    </div>
  );
}

function SearchRow({ icon, title, sub, stars, onClick, t }) {
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "9px 12px", background: "none", border: "none", borderRadius: "6px", cursor: "pointer", color: t.tx, textAlign: "left" }} onMouseEnter={e => e.currentTarget.style.background = t.bgS} onMouseLeave={e => e.currentTarget.style.background = "none"}>
      <span style={{ fontSize: "16px" }}>{icon}</span>
      <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: "13px" }}>{title}</div><div style={{ fontSize: "11px", color: t.tM }}>{sub}</div></div>
      {stars > 0 && <span style={{ color: t.wn, fontSize: "11px" }}>{"\u2605".repeat(stars)}</span>}
    </button>
  );
}


// ── Medication Interactive Diagrams ──────────────────────────────────────────

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
    s.push({ t: "Warnings", c: item.warn.map(w => `<div class="bx ${w.tp === "bb" ? "bxd" : w.tp === "cau" ? "bxw" : ""}">${w.tp === "bb" ? "<strong>BLACK BOX — " : "<strong>"}${w.ti}</strong><br/>${w.tx}</div>`).join("") });
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
          <h4 style={{ color: w.tp === "bb" ? t.dg : w.tp === "cau" ? t.wn : t.tx, margin: "0 0 4px", fontSize: "14px" }}>{w.tp === "bb" ? "BLACK BOX — " : w.tp === "cau" ? " " : " "}{w.ti}</h4>
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

          {/* ── EXTRACELLULAR SPACE ── */}
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

          {/* ── NORMAL STATE (Left) ── */}
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

          {/* ── KETAMINE BLOCKED STATE (Right) ── */}
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

          {/* ── CLINICAL EFFECTS BOX ── */}
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

// PROTOCOL DETAIL
function ProtoDetail({ p, t, theme, conf, setConf, notes, setNotes }) {
  const makePDF = () => {
    const s = [];
    s.push({ t: "Overview", c: `<div>${p.sum}</div>` });
    s.push({ t: "Algorithm Steps", c: p.steps.map((st, i) => `<div class="step"><span class="sn">${i + 1}</span><strong>${st.a}</strong><br/>${st.d}</div>`).join("") });
    s.push({ t: "Key Points", c: p.keys.map(k => `<div class="bx">&bull; ${k}</div>`).join("") });
    if (notes) s.push({ t: "My Notes", c: `<div style="white-space:pre-line">${notes}</div>` });
    dlPDF(`ACLS: ${p.name}`, s);
  };

  return <div>
    <div style={{ background: t.hd, borderBottom: `3px solid ${p.clr}`, padding: "20px 16px 14px" }}>
      <div style={{ maxWidth: "920px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <div style={{ fontSize: "12px", color: p.clr, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>{p.cat}</div>
            <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 700 }}>{p.name}</h1>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <Stars value={conf} onChange={setConf} t={t} />
            {p.ahaPdf && <a href={p.ahaPdf} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "5px", background: "#c8102e", borderRadius: "6px", padding: "5px 10px", color: "#fff", fontSize: "11px", fontWeight: 700, textDecoration: "none", letterSpacing: "0.3px" }}>AHA {p.ahaYear} PDF ↗</a>}
            <button onClick={makePDF} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "8px", padding: "7px 14px", cursor: "pointer", color: t.t2, fontSize: "12px", fontWeight: 600 }}> PDF</button>
          </div>
        </div>
      </div>
    </div>

    <div style={{ maxWidth: "920px", margin: "0 auto", padding: "20px 16px" }}>
      <div style={{ padding: "14px", background: t.aD, borderRadius: "8px", border: `1px solid ${t.aB}`, marginBottom: "20px" }}>
        <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.7, color: t.tx }}>{p.sum}</p>
      </div>

      <h3 style={{ color: t.ac, fontSize: "17px", margin: "0 0 12px" }}>Algorithm Steps</h3>
      {p.steps.map((st, i) => (
        <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "8px" }}>
          <div style={{ minWidth: "28px", height: "28px", borderRadius: "50%", background: `${p.clr}18`, border: `2px solid ${p.clr}`, display: "flex", alignItems: "center", justifyContent: "center", color: p.clr, fontWeight: 700, fontSize: "12px", flexShrink: 0, marginTop: "2px" }}>{i + 1}</div>
          <div style={{ padding: "10px 14px", background: t.bgS, borderRadius: "8px", border: `1px solid ${t.bd}`, flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: st.d ? "3px" : 0 }}>{st.a}</div>
            {st.d && <div style={{ fontSize: "13px", color: t.t2, lineHeight: 1.7 }}>{st.d}</div>}
          </div>
        </div>
      ))}

      <h3 style={{ color: t.ac, fontSize: "17px", margin: "24px 0 12px" }}> Key Points</h3>
      {p.keys.map((k, i) => (
        <div key={i} style={{ padding: "10px 12px", background: t.bgS, borderRadius: "7px", border: `1px solid ${t.bd}`, marginBottom: "6px", fontSize: "13px", lineHeight: 1.7, color: t.t2 }}>
          <span style={{ color: p.clr, fontWeight: 700, marginRight: "8px" }}>•</span>{k}
        </div>
      ))}

      {/* AHA OFFICIAL PDF SECTION */}
      {p.ahaPdf && <div style={{ marginTop: "28px" }}>
        <h3 style={{ color: t.ac, fontSize: "17px", margin: "0 0 12px" }}> Official AHA Algorithm</h3>
        <div style={{ background: theme === "dark" ? "#0c1a2e" : "#f0f9ff", border: `1px solid ${theme === "dark" ? "#1e3a5f" : "#bae6fd"}`, borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#c8102e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "15px", fontWeight: 800, lineHeight: 1.1, textAlign: "center" }}>AHA</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>{p.name}</div>
            <div style={{ fontSize: "12px", color: t.tM }}>© {p.ahaYear} American Heart Association — Official Algorithm PDF</div>
            <div style={{ fontSize: "11px", color: t.tM, marginTop: "2px" }}>Source: cpr.heart.org • {p.ahaYear} AHA Guidelines for CPR & ECC</div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <a href={p.ahaPdf} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", background: theme === "dark" ? "#1e3a5f" : "#e0f2fe", border: `1px solid ${theme === "dark" ? "#2d5a8e" : "#7dd3fc"}`, borderRadius: "8px", padding: "10px 20px", cursor: "pointer", color: t.tx, fontSize: "13px", fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}>
               View Algorithm
            </a>
            <a href={p.ahaPdf} download style={{ display: "flex", alignItems: "center", gap: "6px", background: "#c8102e", border: "1px solid #c8102e", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", color: "#fff", fontSize: "13px", fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}>
              Download PDF
            </a>
          </div>
        </div>
      </div>}

      <NotesBox notes={notes} setNotes={setNotes} t={t} />
    </div>
  </div>;
}



// ── LGIC Interactive Diagram ──────────────────────────────────────────────────
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
function NotesBox({ notes, setNotes, t }) {
  const [open, setOpen] = useState(!!notes);
  return (
    <div style={{ marginTop: "24px" }}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: t.ac, fontSize: "13px", fontWeight: 600, padding: 0, display: "flex", alignItems: "center", gap: "6px" }}>
        {open ? "▾" : "▸"} My Notes
      </button>
      {open && <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add your own notes here..." style={{ width: "100%", minHeight: "100px", marginTop: "8px", padding: "12px", background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "8px", color: t.tx, fontSize: "13px", lineHeight: 1.7, resize: "vertical", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />}
    </div>
  );
}

// ───────────────────────────────────────────────────
// CRRT DEVICE PAGE
// ───────────────────────────────────────────────────
function CRRTDevice({ t, theme }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [dm, setDm] = useState("CVVHDF");
  const [hc, setHc] = useState(null);
  const [fl, setFl] = useState(true);
  const tabs=[{id:"overview",label:"Overview & Principles"},{id:"modalities",label:"CRRT Modalities"},{id:"circuit",label:"Interactive Circuit"},{id:"prescriptions",label:"Prescriptions & Dosing"},{id:"troubleshooting",label:"Troubleshooting"},{id:"pearls",label:"Clinical Pearls"},{id:"interview",label:"Interview Angles"}];
  const ci={
    access:{title:"Vascular Access Catheter",detail:"Large-bore dual-lumen dialysis catheter (11.5–13.5 Fr) in IJ (preferred), femoral, or subclavian. Right IJ ideal — straight path to SVC, low recirculation (~5%). Femoral: higher recirculation (10–15%) and infection risk. Subclavian: stenosis risk — avoid if future AV fistula needed.",color:"#ef4444"},
    bloodpump:{title:"Blood Pump (Peristaltic Roller)",detail:"Peristaltic roller pump at 150–300 mL/min (typical 200). Compresses tubing against raceway — no direct pump-blood contact, reducing hemolysis. Higher flow improves convective clearance but increases TMP and hemolysis risk.",color:"#3b82f6"},
    prefilter:{title:"Pre-Filter Replacement Fluid",detail:"Predilution: sterile bicarbonate-buffered fluid infused BEFORE the hemofilter. Dilutes blood → reduces hematocrit in fibers → extends filter life. Trade-off: clearance drops ~15–20%. Compensate with increased volume. Preferred in most ICUs for filter longevity.",color:"#8b5cf6"},
    hemofilter:{title:"Hemofilter (Dialyzer)",detail:"Hollow-fiber membrane cartridge (polysulfone or AN69, MWCO ~20–50 kDa). Blood inside fibers; dialysate countercurrent outside. DIFFUSION: concentration gradient for small solutes. CONVECTION: solvent drag for medium molecules up to ~50 kDa. Surface area 0.6–2.15 m². AN69 can adsorb cytokines but causes bradykinin release with ACE inhibitors.",color:"#f59e0b"},
    dialysate:{title:"Dialysate Fluid",detail:"Countercurrent flow in CVVHD/CVVHDF. Na⁺ ~140, K⁺ 0–4, Ca²⁺ 0–3, HCO₃⁻ 22–35. Flow: 1,000–2,000 mL/hr. K⁺ 0 for severe hyperkalemia; K⁺ 2–4 to prevent overcorrection.",color:"#06b6d4"},
    effluent:{title:"Effluent (Ultrafiltrate)",detail:"Collects UF + spent dialysate + replacement fluid. Total rate = replacement + dialysate + net UF. Blood-tinged = membrane rupture. Decreasing rate = clotting. KDIGO target: 20–25 mL/kg/hr.",color:"#10b981"},
    postfilter:{title:"Post-Filter Replacement Fluid",detail:"Postdilution: fluid AFTER hemofilter. Undiluted blood = maximal clearance but higher hematocrit in fibers → accelerated clotting. Keep FF <20–25%. Many protocols: 2/3 pre + 1/3 post.",color:"#ec4899"},
    anticoag:{title:"Anticoagulation",detail:"Regional citrate preferred (KDIGO). Trisodium citrate 4% pre-filter chelates iCa²⁺ (needed for Factors II, VII, IX, X). Circuit iCa²⁺ target <0.35. CaCl₂ infused systemically to restore iCa²⁺ 1.0–1.2. Alt: heparin 500–1000 U/hr, aPTT 40–45s.",color:"#f97316"},
    bubbletrap:{title:"Air Detector & Bubble Trap",detail:"Ultrasonic detector on return line. Air >0.1 mL → alarm + auto-clamp. Gravity separation traps air; de-aired blood exits bottom.",color:"#a855f7"},
    pressures:{title:"Pressure Monitoring",detail:"(1) ACCESS: negative (−50 to −200; more negative = catheter dysfunction). (2) PRE-FILTER: rising = clotting. (3) EFFLUENT: filtrate side. (4) RETURN: +50 to +250; elevated = occlusion. TMP = [(P_pre+P_ret)/2]−P_eff. TMP >250 = significant clotting.",color:"#64748b"}
  };
  const sC=dm!=="CVVHD",sD=dm!=="CVVH";
  const H=({title})=><h2 style={{color:t.tx,fontSize:"22px",fontWeight:600,marginTop:"32px",marginBottom:"16px",paddingBottom:"8px",borderBottom:`1px solid ${t.bd}`}}>{title}</h2>;
  const B=({children})=><div style={{lineHeight:1.8,fontSize:"15px",color:t.t2}}>{children}</div>;
  const HL=({children})=><span style={{color:t.ac,fontWeight:600}}>{children}</span>;
  const Pl=({number,title,children})=><div style={{padding:"20px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`,marginBottom:"12px"}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}><span style={{background:t.aD,color:t.ac,padding:"2px 10px",borderRadius:"12px",fontSize:"12px",fontWeight:600}}>Pearl #{number}</span><span style={{color:t.tx,fontWeight:600,fontSize:"15px"}}>{title}</span></div><p style={{color:t.t2,fontSize:"14px",lineHeight:1.7,margin:0}}>{children}</p></div>;

  return (<div style={{maxWidth:"1100px",margin:"0 auto",padding:"24px 16px"}}>
    <div style={{background:t.hd,borderBottom:`2px solid ${t.ac}`,padding:"32px 28px 24px",borderRadius:"12px 12px 0 0"}}>
      <div style={{display:"flex",alignItems:"baseline",gap:"16px",marginBottom:"8px",flexWrap:"wrap"}}>
        <h1 style={{margin:0,fontSize:"32px",fontWeight:700,color:t.tx}}>Continuous Renal Replacement Therapy</h1>
        <span style={{fontSize:"16px",color:t.tM}}>(CRRT)</span>
      </div>
      <div style={{display:"flex",gap:"10px",flexWrap:"wrap",marginTop:"12px"}}>
        {["Renal Replacement","Extracorporeal Circuit","Hemofiltration / Hemodialysis","ICU Device"].map(tg=><span key={tg} style={{background:t.aD,border:`1px solid ${t.aB}`,color:t.ac,padding:"4px 14px",borderRadius:"20px",fontSize:"13px",fontWeight:500}}>{tg}</span>)}
      </div>
    </div>
    <div style={{display:"flex",gap:"2px",padding:"0 8px",background:t.bgH,borderBottom:`1px solid ${t.bd}`,overflowX:"auto"}}>
      {tabs.map(tb=><button key={tb.id} onClick={()=>setActiveTab(tb.id)} style={{padding:"14px 18px",background:activeTab===tb.id?t.bgC:"transparent",color:activeTab===tb.id?t.ac:t.tM,border:"none",borderBottom:activeTab===tb.id?`2px solid ${t.ac}`:"2px solid transparent",cursor:"pointer",fontSize:"13px",fontWeight:activeTab===tb.id?600:400,whiteSpace:"nowrap",transition:"all 0.2s"}}>{tb.label}</button>)}
    </div>
    <div style={{padding:"24px 0"}}>

    {activeTab==="overview"&&<div>
      <H title="What Is CRRT?" />
      <B><p>Continuous Renal Replacement Therapy (CRRT) is a slow, continuous extracorporeal blood purification technique used in hemodynamically unstable ICU patients who cannot tolerate conventional intermittent hemodialysis (IHD). Unlike IHD &mdash; which removes solutes and fluid over 3&ndash;4 hours causing rapid osmotic and volume shifts &mdash; CRRT operates 24 hours/day at low blood flow rates (150&ndash;300 mL/min vs. 300&ndash;500 mL/min for IHD), providing <HL>gradual, hemodynamically stable solute and fluid removal</HL>.</p>
      <p style={{marginTop:"16px"}}>CRRT is preferred for AKI complicated by hemodynamic instability, refractory fluid overload, severe electrolyte derangements (hyperkalemia, metabolic acidosis), or uremia with encephalopathy. KDIGO recommends initiating RRT when life-threatening changes in fluid, electrolyte, or acid-base balance exist &mdash; but there is no single creatinine or BUN threshold that mandates initiation.</p></B>
      <H title="The Two Clearance Mechanisms" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",margin:"12px 0"}}>
        <div style={{padding:"24px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.bl}`}}>
          <div style={{fontSize:"16px",color:t.bl,fontWeight:700,marginBottom:"10px"}}>Diffusion</div>
          <div style={{fontSize:"14px",color:t.t2,lineHeight:1.8}}>Solutes move across a semipermeable membrane <strong style={{color:t.tx}}>down their concentration gradient</strong> (Fick&rsquo;s Law). Highly effective for <strong style={{color:t.tx}}>small molecules (&lt;500 Da)</strong> &mdash; urea, creatinine, K&#8314;. Clearance depends on membrane surface area, concentration gradient, thickness, and molecular weight.</div>
        </div>
        <div style={{padding:"24px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.wn}`}}>
          <div style={{fontSize:"16px",color:t.wn,fontWeight:700,marginBottom:"10px"}}>Convection (Solvent Drag)</div>
          <div style={{fontSize:"14px",color:t.t2,lineHeight:1.8}}>Water pushed across membrane by <strong style={{color:t.tx}}>hydrostatic pressure</strong> (TMP) carries dissolved solutes. Independent of concentration gradients. Superior for <strong style={{color:t.tx}}>medium molecules (500&ndash;50,000 Da)</strong> &mdash; cytokines, &#946;&#8322;-microglobulin, myoglobin. Sieving coefficient: 1.0 = freely filtered.</div>
        </div>
      </div>
      <H title="Key Physics" />
      <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.bd}`,textAlign:"center"}}>
        <div style={{fontSize:"18px",color:t.ac,fontWeight:700,fontFamily:"monospace",marginBottom:"12px"}}>Jv = Kuf &times; TMP</div>
        <div style={{fontSize:"14px",color:t.t2}}>Jv = ultrafiltration rate (mL/hr) | Kuf = membrane coefficient | TMP = transmembrane pressure</div>
        <div style={{fontSize:"16px",color:t.wn,fontWeight:600,fontFamily:"monospace",marginTop:"16px"}}>TMP = [(P_in + P_out) / 2] &minus; P_effluent</div>
        <div style={{fontSize:"13px",color:t.tM,marginTop:"8px"}}>Rising TMP = filter clotting. TMP &gt;250&ndash;300 mmHg = filter nearing failure</div>
      </div>
      <H title="CRRT vs. IHD" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
        {[{label:"Hemodynamic Stability",crrt:"Minimal fluid shifts &mdash; tolerated in shock",ihd:"Rapid ultrafiltration causes hypotension"},{label:"Duration",crrt:"Continuous (24 hr/day)",ihd:"Intermittent (3&ndash;4 hr sessions)"},{label:"Blood Flow",crrt:"150&ndash;300 mL/min",ihd:"300&ndash;500 mL/min"},{label:"Fluid Removal",crrt:"Precise, programmable (mL/hr)",ihd:"Large volumes removed quickly"},{label:"Best For",crrt:"Unstable, cerebral edema, liver failure",ihd:"Stable patients, outpatient"},{label:"Drug Clearance",crrt:"Continuous &mdash; adjust doses x24hr",ihd:"Intermittent &mdash; dose after sessions"}].map((r,i)=>(
          <div key={i} style={{padding:"14px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`}}>
            <div style={{fontSize:"11px",color:t.tM,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"8px"}}>{r.label}</div>
            <div style={{fontSize:"13px",marginBottom:"4px"}}><span style={{color:t.ac,fontWeight:600}}>CRRT:</span> <span style={{color:t.tx}}>{r.crrt}</span></div>
            <div style={{fontSize:"13px"}}><span style={{color:t.wn,fontWeight:600}}>IHD:</span> <span style={{color:t.t2}}>{r.ihd}</span></div>
          </div>))}
      </div>
    </div>}

    {activeTab==="modalities"&&<div>
      <H title="CRRT Modalities" />
      <B><p>Naming: <strong style={{color:t.tx}}>C</strong>=Continuous, <strong style={{color:t.tx}}>VV</strong>=Veno-Venous, then the clearance method.</p></B>
      <div style={{display:"grid",gap:"20px",marginTop:"20px"}}>
        {[{tag:"CVVH",name:"Continuous VV Hemofiltration",color:t.wn,mech:"Convection only. No dialysate. Hydrostatic pressure drives plasma water + solutes across membrane (solvent drag). Large UF volumes replaced with sterile fluid.",best:"Medium molecules (cytokines, myoglobin, beta-2-microglobulin). Rhabdomyolysis.",limit:"Less efficient for small molecules. Higher replacement volumes."},{tag:"CVVHD",name:"Continuous VV Hemodialysis",color:t.bl,mech:"Diffusion only. Dialysate countercurrent. Solutes move down concentration gradients. No replacement fluid needed.",best:"Small molecules &mdash; urea, creatinine, K+, phosphorus. Uremia, hyperkalemia. Simpler setup.",limit:"Poor medium/large molecule clearance."},{tag:"CVVHDF",name:"Continuous VV Hemodiafiltration",color:t.ac,mech:"Diffusion + Convection. Most common. Combines dialysate with replacement fluid + UF. Broadest clearance spectrum.",best:"Most ICU AKI patients. Comprehensive small + medium molecule clearance. Default modality.",limit:"Complex &mdash; needs both dialysate and replacement fluid. Higher cost."}].map((m,i)=>(
          <div key={i} style={{padding:"24px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${m.color}`}}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"12px"}}>
              <span style={{background:`${m.color}20`,color:m.color,padding:"4px 14px",borderRadius:"20px",fontSize:"14px",fontWeight:700}}>{m.tag}</span>
              <span style={{color:t.tx,fontSize:"17px",fontWeight:600}}>{m.name}</span>
            </div>
            <div style={{color:t.t2,fontSize:"14px",lineHeight:1.8}}>
              <p><strong style={{color:m.color}}>Mechanism:</strong> {m.mech}</p>
              <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Best for:</strong> {m.best}</p>
              <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Limitation:</strong> {m.limit}</p>
            </div>
          </div>))}
      </div>
      <H title="SCUF" />
      <B><p>Slow Continuous Ultrafiltration: convection only at very low rates (100&ndash;300 mL/hr), no replacement, no dialysate. Sole purpose: fluid removal in diuretic-resistant CHF. Negligible solute clearance.</p></B>
    </div>}

    {activeTab==="circuit"&&<div>
      <H title="CRRT Extracorporeal Circuit" />
      <B><p>Click any component for detailed information. Toggle modalities to see circuit changes.</p></B>
      <div style={{display:"flex",gap:"8px",margin:"16px 0 24px",flexWrap:"wrap"}}>
        {["CVVHDF","CVVH","CVVHD"].map(mode=><button key={mode} onClick={()=>setDm(mode)} style={{padding:"10px 24px",background:dm===mode?t.ac:t.bgS,color:dm===mode?t.acTx:t.t2,border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600}}>{mode}</button>)}
        <button onClick={()=>setFl(!fl)} style={{padding:"10px 20px",background:fl?t.aD:t.bgS,color:fl?t.ac:t.tM,border:`1px solid ${fl?t.ac:t.bd}`,borderRadius:"8px",cursor:"pointer",fontSize:"13px",marginLeft:"auto"}}>{fl?"Flow On":"Flow Off"}</button>
      </div>
      <div style={{background:theme==="dark"?"#0d1117":"#f8fafc",borderRadius:"16px",border:`1px solid ${t.bd}`,padding:"16px",overflow:"auto"}}>
        <svg viewBox="0 0 1020 660" style={{width:"100%",height:"auto",minHeight:"450px"}}>
          <defs>
            <marker id="cR" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#ef4444"/></marker>
            <marker id="cB" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#3b82f6"/></marker>
            <marker id="cG" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#10b981"/></marker>
            <marker id="cP" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#8b5cf6"/></marker>
            <marker id="cC" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#06b6d4"/></marker>
            <marker id="cO" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#f97316"/></marker>
            <marker id="cPk" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#ec4899"/></marker>
            {fl&&<style>{`@keyframes cff{to{stroke-dashoffset:-40}}@keyframes cfr{to{stroke-dashoffset:40}}.cff{stroke-dasharray:12 8;animation:cff 1.5s linear infinite}.cfr{stroke-dasharray:12 8;animation:cfr 1.5s linear infinite}`}</style>}
          </defs>
          <text x="510" y="30" textAnchor="middle" fill={t.tM} fontSize="14" fontWeight="600">{dm} Circuit Diagram</text>
          <g onClick={()=>setHc("access")} style={{cursor:"pointer"}}><rect x="30" y="270" width="130" height="110" rx="16" fill={t.bgC} stroke="#ef4444" strokeWidth={hc==="access"?3:2}/><text x="95" y="305" textAnchor="middle" fill="#ef4444" fontSize="15" fontWeight="700">PATIENT</text><text x="95" y="325" textAnchor="middle" fill={t.t2} fontSize="11">Dual-Lumen Catheter</text><text x="95" y="345" textAnchor="middle" fill={t.tM} fontSize="10">(R IJ preferred)</text><text x="95" y="365" textAnchor="middle" fill={t.tM} fontSize="9">11.5&ndash;13.5 Fr</text></g>
          <line x1="160" y1="300" x2="240" y2="300" stroke="#ef4444" strokeWidth="3" markerEnd="url(#cR)" className={fl?"cff":""}/>
          <text x="200" y="290" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="600">&ldquo;Arterial&rdquo;</text>
          <g onClick={()=>setHc("pressures")} style={{cursor:"pointer"}}><rect x="210" y="245" width="50" height="24" rx="4" fill={t.bgS} stroke={t.tM} strokeWidth="1"/><text x="235" y="261" textAnchor="middle" fill={t.tM} fontSize="9" fontWeight="600">P_acc</text></g>
          <g onClick={()=>setHc("bloodpump")} style={{cursor:"pointer"}}><circle cx="290" cy="300" r="35" fill={t.bgC} stroke="#3b82f6" strokeWidth={hc==="bloodpump"?3:2}/><text x="290" y="295" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="700">BLOOD</text><text x="290" y="310" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="700">PUMP</text><text x="290" y="345" textAnchor="middle" fill={t.tM} fontSize="9">150&ndash;300 mL/min</text></g>
          <line x1="325" y1="300" x2="400" y2="300" stroke="#ef4444" strokeWidth="3" markerEnd="url(#cR)" className={fl?"cff":""}/>
          <g onClick={()=>setHc("anticoag")} style={{cursor:"pointer"}}><rect x="340" y="185" width="120" height="60" rx="10" fill={t.bgC} stroke="#f97316" strokeWidth={hc==="anticoag"?3:2}/><text x="400" y="210" textAnchor="middle" fill="#f97316" fontSize="12" fontWeight="700">CITRATE</text><text x="400" y="228" textAnchor="middle" fill="#f97316" fontSize="10">Anticoagulation</text><line x1="400" y1="245" x2="400" y2="290" stroke="#f97316" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#cO)"/></g>
          {sC&&<g onClick={()=>setHc("prefilter")} style={{cursor:"pointer"}}><rect x="445" y="170" width="130" height="65" rx="10" fill={t.bgC} stroke="#8b5cf6" strokeWidth={hc==="prefilter"?3:2}/><text x="510" y="195" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="700">PRE-FILTER</text><text x="510" y="211" textAnchor="middle" fill="#8b5cf6" fontSize="10">Replacement Fluid</text><text x="510" y="228" textAnchor="middle" fill={t.tM} fontSize="9">Predilution</text><line x1="510" y1="235" x2="510" y2="290" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#cP)"/></g>}
          <g onClick={()=>setHc("pressures")} style={{cursor:"pointer"}}><rect x="420" y="315" width="50" height="24" rx="4" fill={t.bgS} stroke={t.tM} strokeWidth="1"/><text x="445" y="331" textAnchor="middle" fill={t.tM} fontSize="9" fontWeight="600">P_pre</text></g>
          <g onClick={()=>setHc("hemofilter")} style={{cursor:"pointer"}}><rect x="490" y="275" width="200" height="120" rx="14" fill={t.bgC} stroke="#f59e0b" strokeWidth={hc==="hemofilter"?3:2}/>{[295,310,325,340,355,370,385].map((y,i)=><line key={i} x1="510" y1={y} x2="670" y2={y} stroke="#f59e0b" strokeWidth="0.5" opacity="0.2"/>)}<text x="590" y="308" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="700">HEMOFILTER</text><text x="590" y="328" textAnchor="middle" fill={t.t2} fontSize="11">Hollow-Fiber Membrane</text><text x="590" y="345" textAnchor="middle" fill={t.tM} fontSize="10">MWCO: 20&ndash;50 kDa</text><text x="590" y="360" textAnchor="middle" fill={t.tM} fontSize="9">0.6&ndash;2.15 m&sup2;</text>{sC&&<text x="590" y="378" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">Convection</text>}{sD&&<text x="590" y={sC?"388":"378"} textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="600">Diffusion</text>}</g>
          <line x1="460" y1="300" x2="490" y2="300" stroke="#ef4444" strokeWidth="3" className={fl?"cff":""}/>
          <line x1="690" y1="300" x2="740" y2="300" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#cB)" className={fl?"cff":""}/>
          {sD&&<g onClick={()=>setHc("dialysate")} style={{cursor:"pointer"}}><rect x="510" y="425" width="160" height="65" rx="10" fill={t.bgC} stroke="#06b6d4" strokeWidth={hc==="dialysate"?3:2}/><text x="590" y="448" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="700">DIALYSATE</text><text x="590" y="465" textAnchor="middle" fill="#06b6d4" fontSize="10">Countercurrent Flow</text><text x="590" y="482" textAnchor="middle" fill={t.tM} fontSize="9">1,000&ndash;2,000 mL/hr</text><line x1="590" y1="425" x2="590" y2="400" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#cC)" className={fl?"cfr":""}/></g>}
          <g onClick={()=>setHc("effluent")} style={{cursor:"pointer"}}><rect x="700" y="425" width="140" height="65" rx="10" fill={t.bgC} stroke="#10b981" strokeWidth={hc==="effluent"?3:2}/><text x="770" y="448" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="700">EFFLUENT</text><text x="770" y="465" textAnchor="middle" fill="#10b981" fontSize="10">Ultrafiltrate + Waste</text><text x="770" y="482" textAnchor="middle" fill={t.tM} fontSize="9">20&ndash;25 mL/kg/hr</text><line x1="670" y1="395" x2="710" y2="435" stroke="#10b981" strokeWidth="2" markerEnd="url(#cG)" className={fl?"cff":""}/></g>
          <g onClick={()=>setHc("pressures")} style={{cursor:"pointer"}}><rect x="700" y="398" width="50" height="24" rx="4" fill={t.bgS} stroke={t.tM} strokeWidth="1"/><text x="725" y="414" textAnchor="middle" fill={t.tM} fontSize="9" fontWeight="600">P_eff</text></g>
          {sC&&<g onClick={()=>setHc("postfilter")} style={{cursor:"pointer"}}><rect x="720" y="185" width="130" height="60" rx="10" fill={t.bgC} stroke="#ec4899" strokeWidth={hc==="postfilter"?3:2}/><text x="785" y="210" textAnchor="middle" fill="#ec4899" fontSize="12" fontWeight="700">POST-FILTER</text><text x="785" y="226" textAnchor="middle" fill="#ec4899" fontSize="10">Replacement Fluid</text><text x="785" y="240" textAnchor="middle" fill={t.tM} fontSize="9">Postdilution</text><line x1="760" y1="245" x2="760" y2="290" stroke="#ec4899" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#cPk)"/></g>}
          <g onClick={()=>setHc("bubbletrap")} style={{cursor:"pointer"}}><rect x="790" y="270" width="110" height="55" rx="10" fill={t.bgC} stroke="#a855f7" strokeWidth={hc==="bubbletrap"?3:2}/><text x="845" y="293" textAnchor="middle" fill="#a855f7" fontSize="11" fontWeight="700">AIR DETECTOR</text><text x="845" y="308" textAnchor="middle" fill="#a855f7" fontSize="10">&amp; Bubble Trap</text></g>
          <g onClick={()=>setHc("pressures")} style={{cursor:"pointer"}}><rect x="910" y="280" width="50" height="24" rx="4" fill={t.bgS} stroke={t.tM} strokeWidth="1"/><text x="935" y="296" textAnchor="middle" fill={t.tM} fontSize="9" fontWeight="600">P_ret</text></g>
          <line x1="900" y1="300" x2="930" y2="300" stroke="#3b82f6" strokeWidth="2" className={fl?"cff":""}/>
          <polyline points="945,305 960,305 960,540 60,540 60,385" stroke="#3b82f6" strokeWidth="3" fill="none" markerEnd="url(#cB)" className={fl?"cff":""}/>
          <text x="510" y="558" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="600">Return Line &rarr; Patient</text>
          <g onClick={()=>setHc("anticoag")} style={{cursor:"pointer"}}><rect x="860" y="350" width="120" height="48" rx="8" fill={t.bgC} stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,3"/><text x="920" y="370" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="600">Ca&sup2;&#8314; REPLACEMENT</text><text x="920" y="386" textAnchor="middle" fill={t.tM} fontSize="9">iCa&sup2;&#8314; &rarr; 1.0&ndash;1.2</text></g>
          <rect x="780" y="42" width="220" height="55" rx="8" fill={t.bgC} stroke={t.bd} strokeWidth="1"/><text x="890" y="62" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="700">TMP = (P_pre + P_ret)/2 &minus; P_eff</text><text x="890" y="78" textAnchor="middle" fill={t.tM} fontSize="9">Normal: 100&ndash;250 mmHg</text><text x="890" y="91" textAnchor="middle" fill="#ef4444" fontSize="9">&gt;250 = filter clotting</text>
          <rect x="30" y="580" width="960" height="60" rx="8" fill={t.bgH} stroke={t.bd} strokeWidth="1"/>
          <text x="50" y="600" fill={t.tM} fontSize="11" fontWeight="600">LEGEND:</text>
          {[{c:"#ef4444",l:"Blood (withdraw)"},{c:"#3b82f6",l:"Blood (return)"},{c:"#f59e0b",l:"Hemofilter"},{c:"#8b5cf6",l:"Pre-dilution"},{c:"#ec4899",l:"Post-dilution"},{c:"#06b6d4",l:"Dialysate"},{c:"#10b981",l:"Effluent"},{c:"#f97316",l:"Anticoag"}].map((item,i)=><g key={i}><rect x={50+i*118} y={612} width="12" height="12" rx="2" fill={item.c}/><text x={67+i*118} y={623} fill={t.t2} fontSize="10">{item.l}</text></g>)}
        </svg>
      </div>
      {hc&&ci[hc]&&<div style={{marginTop:"20px",padding:"24px",background:t.bgC,borderRadius:"12px",borderLeft:`4px solid ${ci[hc].color}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><h3 style={{color:ci[hc].color,fontSize:"18px",fontWeight:700,margin:"0 0 12px"}}>{ci[hc].title}</h3><button onClick={()=>setHc(null)} style={{background:t.bgS,border:"none",color:t.tM,cursor:"pointer",padding:"4px 10px",borderRadius:"4px",fontSize:"12px"}}>&#10005;</button></div>
        <p style={{color:t.t2,fontSize:"14px",lineHeight:1.8,margin:0}}>{ci[hc].detail}</p>
      </div>}
      <div style={{marginTop:"20px",padding:"20px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.wn}40`}}>
        <div style={{color:t.wn,fontWeight:700,fontSize:"15px",marginBottom:"8px"}}>Filtration Fraction (FF)</div>
        <div style={{fontFamily:"monospace",color:t.ac,fontSize:"15px",margin:"8px 0 12px",padding:"12px",background:t.bgH,borderRadius:"8px",textAlign:"center"}}>FF = UF Rate / Plasma Flow Rate &nbsp;|&nbsp; Plasma Flow = Blood Flow &times; (1 &minus; Hct)</div>
        <p style={{color:t.t2,fontSize:"14px",lineHeight:1.7}}>Keep FF <strong>&lt;20&ndash;25%</strong>. Higher fractions cause hemoconcentration, protein aggregation, and accelerated clotting. Predilution lowers FF by diluting blood before the filter.</p>
      </div>
    </div>}

    {activeTab==="prescriptions"&&<div>
      <H title="CRRT Prescription Components" />
      <div style={{display:"grid",gap:"16px",marginTop:"16px"}}>
        {[{t:"Modality",v:"CVVHDF (most common)",d:"CVVH for medium molecules, CVVHD for uremia/K+, CVVHDF for comprehensive clearance"},{t:"Blood Flow (Qb)",v:"150–250 mL/min",d:"Higher flow increases clearance but also hemolysis. Start 150–200"},{t:"Dialysate Rate (Qd)",v:"1,000–2,000 mL/hr",d:"CVVHD/CVVHDF only. Total effluent target: 20–25 mL/kg/hr"},{t:"Replacement Fluid (Qr)",v:"1,000–3,000 mL/hr",d:"CVVH/CVVHDF. Typical: 2/3 pre, 1/3 post"},{t:"Net Ultrafiltration",v:"50–200 mL/hr",d:"NET fluid removed. Aggressive UF in shock worsens hemodynamics"},{t:"Effluent Dose (KDIGO)",v:"20–25 mL/kg/hr",d:"ATN + RENAL trials: NO benefit to higher-intensity (35–40 mL/kg/hr)"},{t:"Anticoagulation",v:"Regional citrate (preferred)",d:"Citrate pre-filter + Ca²⁺ systemically. Alt: heparin 500–1000 U/hr"}].map((item,i)=>(
          <div key={i} style={{padding:"18px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.ac}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"6px",flexWrap:"wrap",gap:"8px"}}><div style={{fontSize:"14px",color:t.ac,fontWeight:600}}>{item.t}</div><div style={{fontSize:"15px",color:t.tx,fontWeight:700}}>{item.v}</div></div>
            <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>{item.d}</div>
          </div>))}
      </div>
      <H title="Landmark Trials" />
      <div style={{display:"grid",gap:"12px"}}>
        {[{trial:"ATN Trial (2008)",j:"NEJM",finding:"Intensive dosing (35 mL/kg/hr) NO mortality benefit over standard (20 mL/kg/hr).",take:"More is not better. Dose 20–25 mL/kg/hr."},{trial:"RENAL Trial (2009)",j:"NEJM",finding:"Confirmed ATN internationally. Higher-intensity CRRT did not reduce 90-day mortality.",take:"International validation of standard dosing."},{trial:"STARRT-AKI (2020)",j:"NEJM",finding:"Early RRT did NOT reduce 90-day mortality. More adverse events in early group.",take:"Don\u2019t rush — wait for clear clinical indication."},{trial:"AKIKI (2016)",j:"NEJM",finding:"Delayed RRT non-inferior. ~49% of delayed group never needed RRT at all.",take:"Patience — nearly half avoided dialysis entirely."}].map((tr,i)=>(
          <div key={i} style={{padding:"16px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}><span style={{background:t.aD,color:t.ac,padding:"2px 10px",borderRadius:"12px",fontSize:"12px",fontWeight:600}}>{tr.trial}</span><span style={{color:t.tM,fontSize:"12px"}}>{tr.j}</span></div>
            <p style={{color:t.t2,fontSize:"13px",lineHeight:1.7,margin:"0 0 6px"}}>{tr.finding}</p>
            <p style={{color:t.wn,fontSize:"12px",fontWeight:600,margin:0}}>Takeaway: {tr.take}</p>
          </div>))}
      </div>
      <H title="Drug Dosing During CRRT" />
      <div style={{padding:"20px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`}}>
        <p style={{margin:"0 0 12px",color:t.t2,fontSize:"14px",lineHeight:1.7}}><strong style={{color:t.ac}}>Significantly cleared:</strong> Vancomycin (reload after filter changes), pip-tazo, meropenem, cefepime, aminoglycosides, fluconazole &mdash; small molecules, low protein binding, low Vd.</p>
        <p style={{margin:0,color:t.t2,fontSize:"14px",lineHeight:1.7}}><strong style={{color:t.wn}}>Minimally affected:</strong> Warfarin (~99% bound), phenytoin (~90%), amiodarone (Vd ~60 L/kg). Sieving coefficient &asymp; 1 &minus; fraction protein bound.</p>
      </div>
    </div>}

    {activeTab==="troubleshooting"&&<div>
      <H title="CRRT Alarm Troubleshooting" />
      <div style={{display:"grid",gap:"16px",marginTop:"16px"}}>
        {[{alarm:"High Access Pressure (very negative)",meaning:"Blood pump struggling to withdraw",causes:"Catheter kink/malposition, against vessel wall, intraluminal clot, hypovolemia",actions:"Reposition patient, flush access lumen, check kinks, CXR position, consider reversing lumens (+10–20% recirculation)",color:"#ef4444"},{alarm:"High Return Pressure",meaning:"Resistance to blood returning",causes:"Return lumen clot, kink, catheter malposition",actions:"Check kinks, flush return lumen, tPA lock (2 mg/2 mL x 30–60 min). Catheter exchange if P_ret >300",color:"#3b82f6"},{alarm:"Rising TMP",meaning:"Filter clotting",causes:"Insufficient anticoagulation, high FF (>25%), low blood flow, inadequate predilution",actions:"Check citrate + circuit iCa2+, verify FF <20%, increase predilution/blood flow. Filter change if TMP >300",color:"#f59e0b"},{alarm:"Air Detected",meaning:"Air in return line — auto-clamp",causes:"Loose connection, cracked port, empty fluid bag",actions:"DO NOT override. Check all connections. De-air before resuming",color:"#a855f7"},{alarm:"Blood Leak",meaning:"Membrane rupture",causes:"Physical damage, excessive TMP, defective filter",actions:"STOP CRRT. Clamp lines. Discard filter — do NOT return blood. Replace circuit. Check hemolysis labs",color:"#dc2626"},{alarm:"Effluent Flow Low",meaning:"Less ultrafiltrate than prescribed",causes:"Filter clotting, effluent line kink/clot, dialysate bag empty",actions:"Check TMP trend. High TMP + low effluent = filter replacement",color:"#10b981"}].map((a,i)=>(
          <div key={i} style={{padding:"20px",background:t.bgC,borderRadius:"12px",borderLeft:`4px solid ${a.color}`}}>
            <div style={{color:a.color,fontSize:"15px",fontWeight:700,marginBottom:"4px"}}>{a.alarm}</div>
            <div style={{color:t.tx,fontSize:"13px",fontStyle:"italic",marginBottom:"10px"}}>{a.meaning}</div>
            <div style={{marginBottom:"8px"}}><span style={{color:t.tM,fontSize:"11px",textTransform:"uppercase"}}>Causes</span><p style={{color:t.t2,fontSize:"13px",lineHeight:1.7,margin:"4px 0 0"}}>{a.causes}</p></div>
            <div><span style={{color:t.tM,fontSize:"11px",textTransform:"uppercase"}}>Actions</span><p style={{color:t.t2,fontSize:"13px",lineHeight:1.7,margin:"4px 0 0"}}>{a.actions}</p></div>
          </div>))}
      </div>
      <H title="Citrate Toxicity" />
      <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",border:`2px solid ${t.wn}`}}>
        <div style={{color:t.wn,fontSize:"16px",fontWeight:700,marginBottom:"12px"}}>Citrate Accumulation Syndrome</div>
        <div style={{color:t.t2,fontSize:"14px",lineHeight:1.8}}>
          <p>In hepatic dysfunction/shock, citrate cannot be metabolized and accumulates.</p>
          <div style={{padding:"14px",background:t.bgH,borderRadius:"8px",margin:"12px 0"}}>
            <p style={{margin:"0 0 6px"}}><strong style={{color:"#ef4444"}}>1. Rising total Ca&sup2;&#8314; with LOW ionized Ca&sup2;&#8314;</strong> &mdash; sequestered in citrate complexes</p>
            <p style={{margin:"0 0 6px"}}><strong style={{color:"#ef4444"}}>2. Metabolic alkalosis</strong> &mdash; each citrate &rarr; 3 HCO&#8323;&sup2;</p>
            <p style={{margin:0}}><strong style={{color:"#ef4444"}}>3. Total Ca&sup2;&#8314; / iCa&sup2;&#8314; ratio &gt;2.5</strong> &mdash; most specific marker</p>
          </div>
          <p><strong style={{color:t.tx}}>Manage:</strong> Stop citrate, switch to heparin, replace iCa&sup2;&#8314;, assess hepatic function. Monitor ratio q4&ndash;6hr.</p>
        </div>
      </div>
    </div>}

    {activeTab==="pearls"&&<div>
      <H title="CRRT Clinical Pearls" />
      <Pl number={1} title="Filter Life Is Your Quality Metric">Target 40&ndash;72 hours. Filters &lt;24 hr = inadequate anticoagulation, excessive FF, or circuit issues. Predilution extends life at ~15&ndash;20% clearance cost &mdash; worth it because downtime kills clearance.</Pl>
      <Pl number={2} title="Downtime Destroys Your Dose">25 mL/kg/hr prescribed but 18 hr/day runtime = effective dose ~19 mL/kg/hr (below KDIGO). Prescribe 25&ndash;30% above target. ATN + RENAL: delivered doses were 15&ndash;20% lower than prescribed.</Pl>
      <Pl number={3} title="Thermoregulation">CRRT removes body heat continuously. Hypothermia masks fever (missing sepsis), causes coagulopathy, left-shifts O2-Hb curve. Activate blood warmer. Monitor core temp.</Pl>
      <Pl number={4} title="Electrolyte Shifts">Hypophosphatemia is #1 complication &mdash; PO4 (97 Da) freely filtered. Severe (&lt;1.0): respiratory muscle weakness, cardiac dysfunction, hemolysis. Check q6hr, replace aggressively.</Pl>
      <Pl number={5} title="Nutrition During CRRT">Protein losses 10&ndash;15 g/day. Increase to 1.5&ndash;2.5 g/kg/day. Replace water-soluble vitamins + trace elements. Do NOT restrict protein.</Pl>
      <Pl number={6} title="Antibiotic Dosing">Hydrophilic, low protein-binding drugs (vancomycin, beta-lactams, carbapenems) significantly cleared. Dose to PK targets, not eGFR nomograms.</Pl>
      <Pl number={7} title="When to Stop">UOP &gt;400&ndash;500 mL/day without diuretics. Measure timed CrCl from native urine while CRRT runs. Some centers trial off 12&ndash;24 hr monitoring Cr, K+, volume.</Pl>
    </div>}

    {activeTab==="interview"&&<div>
      <H title="Interview Angles" />
      <B><p>Expect scenario-based questions testing clinical reasoning.</p></B>
      <div style={{display:"grid",gap:"16px",marginTop:"16px"}}>
        {[{q:"Patient in septic shock on 3 pressors, Cr 6.2, K+ 6.8. Why CRRT over IHD?",a:"Hemodynamic instability — IHD\u2019s rapid fluid shifts (300–500 mL/min, 3–4hr) cause hypotension in a patient on 3 pressors. CRRT runs continuously at 150–200 mL/min with titrated UF of 50–100 mL/hr. For hyperkalemia: CVVHDF with K+-free dialysate for efficient diffusive K+ clearance while maintaining CV stability.",f:"How do you manage norepinephrine during CRRT? Vancomycin dosing?"},{q:"Explain diffusion vs. convection clinically.",a:"Diffusion: concentration gradient → small molecules (urea 60 Da, Cr 113 Da, K+ 39 Da). Convection: solvent drag → medium molecules (IL-6 21 kDa, myoglobin 17 kDa). CVVH preferred in rhabdo because myoglobin needs convective clearance — too large for efficient diffusion.",f:"Vancomycin (1,450 Da) — diffusion, convection, or both?"},{q:"Filter clotting every 8–12 hours. Troubleshoot.",a:"Systematic: (1) Anticoagulation — circuit iCa2+? Citrate rate? (2) FF >25%? Increase predilution/reduce UF. (3) Blood flow <150? Stagnation. (4) Catheter dysfunction? (5) Patient hypercoagulable? (6) Downtime → stasis.",f:"FF calculation? How does predilution change it?"},{q:"Total Ca 12.2 but iCa 0.8 on citrate. What\u2019s happening?",a:"Citrate accumulation. Ratio >2.5 is the hallmark. Impaired hepatic metabolism → citrate chelates systemic iCa2+ while citrate-Ca complexes raise total Ca2+. Stop citrate, switch to heparin, replace iCa2+ with CaCl2, expect metabolic alkalosis.",f:"How do you monitor proactively?"},{q:"STARRT-AKI showed early RRT didn\u2019t help. Clinical impact?",a:"STARRT-AKI (2020) + AKIKI (2016): watchful waiting. No mortality benefit from early initiation, more adverse events, and 49% of AKIKI delayed group never needed RRT. Initiate for: refractory hyperkalemia, pH <7.15, uremic complications, fluid overload unresponsive to diuretics.",f:"Specific indications for immediate RRT?"}].map((item,i)=>(
          <div key={i} style={{padding:"22px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.bd}`}}>
            <div style={{fontSize:"15px",color:t.tx,fontWeight:600,marginBottom:"14px",lineHeight:1.6}}><span style={{color:t.wn,marginRight:"8px"}}>Q{i+1}:</span>{item.q}</div>
            <div style={{marginBottom:"14px"}}><span style={{display:"inline-block",background:t.aD,color:t.ac,padding:"2px 10px",borderRadius:"12px",fontSize:"11px",fontWeight:600,marginBottom:"8px"}}>Strong Answer</span><p style={{color:t.t2,fontSize:"14px",lineHeight:1.8,margin:0}}>{item.a}</p></div>
            <div style={{padding:"10px 14px",background:t.bgH,borderRadius:"8px",borderLeft:`3px solid ${t.wn}`}}><span style={{color:t.wn,fontSize:"12px",fontWeight:600}}>Follow-up: </span><span style={{color:t.t2,fontSize:"13px"}}>{item.f}</span></div>
          </div>))}
      </div>
    </div>}

    </div>
  </div>);
}

// ───────────────────────────────────────────────────
// VENTILATOR MODES & MANAGEMENT
// ───────────────────────────────────────────────────
// ── Vent Waveform Helpers ─────────────────────────────────────────────────────

function generateVentWaveformData(modeKey, params, N) {
  const pressure = [], flow = [];
  const cycles = 3;
  for (let i = 0; i < N; i++) {
    const tg = (i / N) * cycles;
    const ph = tg % 1;
    const cn = Math.floor(tg);
    let p = 0.15, f = 0;
    const peep = (params.peep || 5) / 45;
    if (modeKey === 'acvc') {
      const ie = 0.27;
      const ppk = peep + (params.flow || 50) / 680 + (params.vt || 500) / 22000;
      const ppl = peep + (params.vt || 500) / 22000;
      if (ph < ie) { p = peep + (ppk - peep) * (ph / ie); f = 0.88; }
      else { const ep = (ph - ie) / (1 - ie); p = peep + (ppl - peep) * Math.exp(-ep * 3.5); f = -0.58 * Math.exp(-ep * 2.5); }
    } else if (modeKey === 'acpc') {
      const ti = params.ti || 0.9, rr = params.rr || 14;
      const ie = Math.min(0.44, ti * rr / 60);
      const pset = peep + (params.pinsp || 20) / 45;
      if (ph < ie) { p = pset; f = 0.87 * Math.exp(-(ph / ie) * 1.9); }
      else { const ep = (ph - ie) / (1 - ie); p = peep + (pset - peep) * Math.exp(-ep * 3.5); f = -0.46 * Math.exp(-ep * 2.5); }
    } else if (modeKey === 'simv') {
      const isMand = cn % 2 === 0;
      if (isMand) {
        const ppk = peep + 18 / 45, ppl = peep + 12 / 45, ie = 0.27;
        if (ph < ie) { p = peep + (ppk - peep) * (ph / ie); f = 0.85; }
        else { const ep = (ph - ie) / (1 - ie); p = peep + (ppl - peep) * Math.exp(-ep * 3.5); f = -0.55 * Math.exp(-ep * 2.5); }
      } else {
        const psp = peep + (params.ps || 10) / 45, ie = 0.26;
        if (ph < ie) { p = psp; f = 0.58 * Math.exp(-(ph / ie) * 1.8); }
        else { const ep = (ph - ie) / (1 - ie); p = peep + (psp - peep) * Math.exp(-ep * 3); f = -0.3 * Math.exp(-ep * 2.5); }
      }
    } else if (modeKey === 'psv') {
      const vari = [0, 0.03, -0.04][cn % 3];
      const adj = Math.max(0, Math.min(1, ph + vari)), ie = 0.28;
      const psp = peep + (params.ps || 12) / 45;
      if (adj < ie) { p = psp; f = 0.78 * Math.exp(-(adj / ie) * 1.8); }
      else { const ep = (adj - ie) / (1 - ie); p = peep + (psp - peep) * Math.exp(-ep * 3); f = -0.4 * Math.exp(-ep * 2.5); }
    } else if (modeKey === 'prvc') {
      const ie = 0.30, padj = peep + 18 / 45;
      if (ph < ie) { p = padj; f = 0.87 * Math.exp(-(ph / ie) * 1.9); }
      else { const ep = (ph - ie) / (1 - ie); p = peep + (padj - peep) * Math.exp(-ep * 3.5); f = -0.45 * Math.exp(-ep * 2.5); }
    } else if (modeKey === 'aprv') {
      const ph2 = (params.phigh || 25) / 45, pl2 = (params.plow || 0) / 45;
      const th = params.thigh || 5.0, tl = params.tlow || 0.5;
      const hfrac = th / (th + tl);
      if (ph < hfrac) { const rip = Math.sin((ph / hfrac) * Math.PI * 8) * 0.017; p = ph2 + rip; f = Math.sin((ph / hfrac) * Math.PI * 8) * 0.22; }
      else { const ep = (ph - hfrac) / (1 - hfrac); p = pl2 + (ph2 - pl2) * Math.exp(-ep * 7); f = -0.95 * Math.exp(-ep * 5.5); }
    } else if (modeKey === 'hfov') {
      const hz = params.hz || 6, amp = (params.amplitude || 60) / 100;
      const mpaw = (params.mpaw || 24) / 45, osc = Math.sin(ph * Math.PI * 2 * (hz * 2));
      p = mpaw + osc * amp * 0.13; f = Math.cos(ph * Math.PI * 2 * (hz * 2)) * 0.5;
    }
    pressure.push(Math.max(0.01, Math.min(0.99, p)));
    flow.push(Math.max(-1, Math.min(1, f)));
  }
  return { pressurePts: pressure, flowPts: flow };
}

function getVentSliderConfig(modeKey) {
  const c = {
    acvc: [{key:'peep',label:'PEEP',min:3,max:18,step:1,unit:' cmH₂O'},{key:'vt',label:'Tidal Volume',min:300,max:700,step:50,unit:' mL'},{key:'flow',label:'Flow Rate',min:30,max:80,step:5,unit:' L/min'}],
    acpc: [{key:'peep',label:'PEEP',min:3,max:18,step:1,unit:' cmH₂O'},{key:'pinsp',label:'\u0394 Pressure',min:5,max:30,step:1,unit:' cmH₂O'},{key:'ti',label:'I-Time',min:0.5,max:1.5,step:0.1,unit:' s'},{key:'rr',label:'Rate',min:8,max:24,step:1,unit:' bpm'}],
    simv: [{key:'peep',label:'PEEP',min:3,max:15,step:1,unit:' cmH₂O'},{key:'vt',label:'Mand. Vt',min:300,max:700,step:50,unit:' mL'},{key:'ps',label:'Spont. PS',min:0,max:20,step:1,unit:' cmH₂O'}],
    psv: [{key:'peep',label:'PEEP',min:3,max:15,step:1,unit:' cmH₂O'},{key:'ps',label:'Pressure Support',min:5,max:20,step:1,unit:' cmH₂O'}],
    prvc: [{key:'peep',label:'PEEP',min:3,max:18,step:1,unit:' cmH₂O'},{key:'targetVt',label:'Target Vt',min:300,max:700,step:50,unit:' mL'},{key:'rr',label:'Rate',min:8,max:24,step:1,unit:' bpm'}],
    aprv: [{key:'phigh',label:'P_high',min:15,max:35,step:1,unit:' cmH₂O'},{key:'plow',label:'P_low',min:0,max:5,step:1,unit:' cmH₂O'},{key:'thigh',label:'T_high',min:3,max:7,step:0.5,unit:' s'},{key:'tlow',label:'T_low',min:0.3,max:0.8,step:0.05,unit:' s'}],
    hfov: [{key:'mpaw',label:'mPaw',min:18,max:35,step:1,unit:' cmH₂O'},{key:'amplitude',label:'Amplitude',min:30,max:90,step:5,unit:''},{key:'hz',label:'Frequency',min:3,max:12,step:1,unit:' Hz'}],
  };
  return c[modeKey] || [];
}

function VentModeWaveform({ modeKey, modeColor, t }) {
  const defaults = {
    acvc:{peep:5,rr:14,flow:50,vt:500}, acpc:{peep:5,rr:14,pinsp:20,ti:0.9},
    simv:{peep:5,rr:10,vt:500,ps:10}, psv:{peep:5,ps:12}, prvc:{peep:5,rr:14,targetVt:500},
    aprv:{phigh:25,plow:0,thigh:5.0,tlow:0.5}, hfov:{mpaw:24,amplitude:60,hz:6},
  };
  const [params, setParams] = useState(defaults[modeKey] || defaults.acvc);
  const [cursor, setCursor] = useState(0);
  const N = 400;
  useEffect(() => { setParams(defaults[modeKey] || defaults.acvc); }, [modeKey]);
  useEffect(() => { const id = setInterval(() => setCursor(c => (c + 1) % N), 42); return () => clearInterval(id); }, []);

  const { pressurePts, flowPts } = useMemo(() => generateVentWaveformData(modeKey, params, N), [modeKey, params]);
  const sliders = getVentSliderConfig(modeKey);

  const LW = 52, CW = 700, SVG_W = LW + CW + 12;
  const PY0 = 24, PH = 108, FY0 = 162, FH = 90, TOTAL_H = 274;
  const peep_n = (params.peep || (modeKey === 'aprv' ? (params.plow || 0) : 5)) / 45;
  const peepY = PY0 + PH - peep_n * PH;
  const zeroFlowY = FY0 + FH / 2;

  const pPts = pressurePts.map((v, i) => `${(LW + (i / N) * CW).toFixed(1)},${(PY0 + PH - v * PH).toFixed(1)}`).join(' ');
  const fPts = flowPts.map((v, i) => `${(LW + (i / N) * CW).toFixed(1)},${(zeroFlowY - v * (FH / 2)).toFixed(1)}`).join(' ');
  const cX = (LW + (cursor / N) * CW).toFixed(1);

  const modeAnnotations = {
    acvc: [{x:0.09,yOff:-14,pChart:true,text:"Ppeak",fill:modeColor},{x:0.26,yOff:-14,pChart:true,text:"Pplat",fill:"#8b5cf6"},{x:0.14,yOff:12,fChart:true,text:"Constant Flow",fill:modeColor}],
    acpc: [{x:0.15,yOff:-12,pChart:true,text:"Set Pressure",fill:modeColor},{x:0.12,yOff:-14,fChart:true,text:"Decelerating",fill:"#f59e0b"}],
    psv: [{x:0.15,yOff:-12,pChart:true,text:"PS Level",fill:modeColor},{x:0.12,yOff:-14,fChart:true,text:"Flow-cycled",fill:"#10b981"}],
    simv: [{x:0.1,yOff:-12,pChart:true,text:"Mandatory",fill:modeColor},{x:0.44,yOff:-12,pChart:true,text:"Spontaneous",fill:"#f59e0b"}],
    prvc: [{x:0.14,yOff:-12,pChart:true,text:"Auto-adjusted P",fill:modeColor},{x:0.12,yOff:-14,fChart:true,text:"Decelerating",fill:"#ec4899"}],
    aprv: [{x:0.12,yOff:-12,pChart:true,text:"P_high",fill:modeColor},{x:0.88,yOff:14,pChart:true,text:"P_low",fill:"#64748b"},{x:0.86,yOff:-14,fChart:true,text:"Release Flow",fill:"#ef4444"}],
    hfov: [{x:0.5,yOff:-12,pChart:true,text:"mPaw (mean)",fill:modeColor}],
  };
  const annots = modeAnnotations[modeKey] || [];

  return (
    <div style={{marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:`1px solid ${modeColor}40`}}>
      <div style={{background:t.bgH,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${t.bd}`}}>
        <span style={{fontSize:"12px",color:modeColor,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>&#9654; Live Waveform Diagram</span>
        <span style={{fontSize:"11px",color:t.tM}}>Adjust parameters below &#8594; waveform updates in real time</span>
      </div>
      <div style={{background:t.bgH,overflowX:"auto"}}>
        <svg viewBox={`0 0 ${SVG_W} ${TOTAL_H}`} width="100%" style={{minWidth:"460px",display:"block"}}>
          {/* Chart backgrounds */}
          <rect x={LW} y={PY0} width={CW} height={PH} fill={t.bgC} rx="2"/>
          <rect x={LW} y={FY0} width={CW} height={FH} fill={t.bgC} rx="2"/>
          {/* Grid verticals (breath dividers) */}
          {[0,1/3,2/3,1].map((fr,i)=><line key={i} x1={LW+fr*CW} y1={PY0} x2={LW+fr*CW} y2={FY0+FH} stroke={t.bd} strokeWidth="1" strokeDasharray="3,3"/>)}
          {/* Grid horizontals - pressure */}
          {[0,0.33,0.67,1].map((fr,i)=><line key={i} x1={LW} y1={PY0+fr*PH} x2={LW+CW} y2={PY0+fr*PH} stroke={t.bd} strokeWidth="0.5"/>)}
          {/* Grid horizontals - flow */}
          {[0,0.5,1].map((fr,i)=><line key={i} x1={LW} y1={FY0+fr*FH} x2={LW+CW} y2={FY0+fr*FH} stroke={t.bd} strokeWidth="0.5"/>)}
          {/* PEEP line */}
          <line x1={LW} y1={peepY} x2={LW+CW} y2={peepY} stroke={t.tM} strokeWidth="1" strokeDasharray="5,3" opacity="0.7"/>
          <text x={LW-4} y={peepY+3} fill={t.tM} fontSize="8" textAnchor="end">PEEP</text>
          {/* Zero flow line */}
          <line x1={LW} y1={zeroFlowY} x2={LW+CW} y2={zeroFlowY} stroke={t.bd} strokeWidth="1" strokeDasharray="3,2"/>
          {/* Section labels */}
          <text x={LW+6} y={PY0+10} fill={modeColor} fontSize="10" fontWeight="700">PRESSURE (cmH&#8322;O)</text>
          <text x={LW+6} y={FY0+10} fill="#f59e0b" fontSize="10" fontWeight="700">FLOW (L/min)</text>
          {/* Axes Y labels */}
          <text x={LW-4} y={PY0+5} fill={t.tM} fontSize="7" textAnchor="end">~40</text>
          <text x={LW-4} y={PY0+PH} fill={t.tM} fontSize="7" textAnchor="end">0</text>
          <text x={LW-4} y={FY0+8} fill={t.tM} fontSize="7" textAnchor="end">+</text>
          <text x={LW-4} y={FY0+FH} fill={t.tM} fontSize="7" textAnchor="end">-</text>
          {/* Cycle labels */}
          {[0,1,2,3].map(n=><text key={n} x={LW+n*CW/3} y={TOTAL_H-3} fill={t.tM} fontSize="9" textAnchor="middle">{n===0?"0 s":n===1?"Cycle 1":n===2?"Cycle 2":"Cycle 3"}</text>)}
          {/* Pressure waveform */}
          <polyline points={pPts} fill="none" stroke={modeColor} strokeWidth="2.5" strokeLinejoin="round"/>
          {/* Flow waveform */}
          <polyline points={fPts} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round"/>
          {/* Cursor */}
          <line x1={cX} y1={PY0} x2={cX} y2={FY0+FH} stroke={t.ac} strokeWidth="1.5" opacity="0.6"/>
          <circle cx={cX} cy={PY0+PH-pressurePts[cursor]*PH} r="3" fill={modeColor} opacity="0.85"/>
          <circle cx={cX} cy={zeroFlowY-flowPts[cursor]*(FH/2)} r="3" fill="#f59e0b" opacity="0.85"/>
          {/* Annotations */}
          {annots.map((a,i)=>{
            const ax = LW + a.x * CW;
            const ay = a.pChart ? (PY0 + PH * 0.3 + a.yOff) : (FY0 + FH * 0.25 + a.yOff);
            return <g key={i}><text x={ax} y={ay} fill={a.fill} fontSize="10" fontWeight="600" textAnchor="middle" style={{pointerEvents:"none"}}>{a.text}</text></g>;
          })}
        </svg>
      </div>
      {/* Sliders */}
      {sliders.length > 0 && <div style={{padding:"14px 16px",borderTop:`1px solid ${t.bd}`,background:t.bgC}}>
        <div style={{fontSize:"11px",color:t.tM,marginBottom:"10px",textTransform:"uppercase",letterSpacing:"0.5px",fontWeight:600}}>Adjust Parameters</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"14px"}}>
          {sliders.map(s=>(
            <div key={s.key}>
              <div style={{fontSize:"11px",color:t.t2,marginBottom:"4px",display:"flex",justifyContent:"space-between"}}>
                <span>{s.label}</span>
                <span style={{color:modeColor,fontWeight:700}}>{typeof params[s.key]==='number'?params[s.key].toFixed(s.step<1?1:0):params[s.key]}{s.unit}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={params[s.key]||s.min}
                onChange={e=>setParams(pr=>({...pr,[s.key]:parseFloat(e.target.value)}))}
                style={{width:"100%",accentColor:modeColor,height:"4px"}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"9px",color:t.tM}}>
                <span>{s.min}{s.unit}</span><span>{s.max}{s.unit}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:"12px",padding:"8px 12px",background:t.bgH,borderRadius:"6px",border:`1px solid ${t.bd}`}}>
          {modeKey==='acvc'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}><span style={{color:modeColor,fontWeight:600}}>Watch:</span> Increasing <b>Flow Rate</b> raises Ppeak (more resistive pressure) without changing Pplat. Increasing <b>Tidal Volume</b> raises both Ppeak and Pplat (compliance-driven). The gap between Ppeak and Pplat = Raw \xd7 Flow.</p>}
          {modeKey==='acpc'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}><span style={{color:modeColor,fontWeight:600}}>Watch:</span> Increasing \u0394Pressure raises the pressure plateau and delivered Vt. Shorter I-Time truncates the decelerating flow earlier. If compliance drops, <b>same pressure delivers less volume</b> — must monitor exhaled Vt closely.</p>}
          {modeKey==='psv'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}><span style={{color:modeColor,fontWeight:600}}>Watch:</span> Each breath is <b>patient-triggered</b> and <b>flow-cycled</b>. Increasing PS raises the pressure support level and delivered Vt. For SBT: target PS 5–8 + PEEP 5 for 30–120 min.</p>}
          {modeKey==='simv'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}><span style={{color:modeColor,fontWeight:600}}>Watch:</span> Mandatory breaths (cycles 1, 3) deliver full VC breath. Spontaneous breaths (cycles 2) show PS-augmented pattern with smaller amplitude and variable Vt. The difference illustrates why SIMV can increase WOB.</p>}
          {modeKey==='prvc'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}><span style={{color:modeColor,fontWeight:600}}>Watch:</span> Decelerating flow pattern like AC/PC, but <b>volume is guaranteed</b>. Ventilator auto-adjusts inspiratory pressure breath-by-breath to hit Target Vt. If patient takes bigger breaths, support decreases automatically.</p>}
          {modeKey==='aprv'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}><span style={{color:modeColor,fontWeight:600}}>Watch:</span> Long P_high plateau with small spontaneous breath ripples. The brief T_low release generates the large expiratory flow spike that clears CO₂. Shorten T_high or lengthen T_low to improve CO₂ clearance.</p>}
          {modeKey==='hfov'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}><span style={{color:modeColor,fontWeight:600}}>Watch:</span> Rapid oscillations around mPaw. Lower Hz = larger Vt per oscillation = better CO₂ clearance. Higher Amplitude = larger pressure swing. Oxygenation set by mPaw and FiO₂; ventilation by Amplitude and Hz.</p>}
        </div>
      </div>}
    </div>
  );
}

// ── Extra Vent Page Diagrams ──────────────────────────────────────────────────

function genWaveformScenarioData(scenId) {
  const N=300,P=[],F=[],V=[],cycles=2;
  for(let i=0;i<N;i++){
    const tg=(i/N)*cycles,ph=tg%1;
    let p=0.1,f=0,v=0;
    switch(scenId){
      case 'vc_normal':{const ie=0.27,vt=0.55,peep=0.1,ppk=0.70,ppl=0.55;if(ph<ie){p=peep+(ppk-peep)*(ph/ie);f=0.9;v=ph/ie*vt;}else{const ep=(ph-ie)/(1-ie);p=peep+(ppl-peep)*Math.exp(-ep*4);f=-0.50*Math.exp(-ep*2.5);v=vt*(1-ep*0.97);}break;}
      case 'pc_normal':{const ie=0.30,vt=0.55,peep=0.1,pset=0.65;if(ph<ie){p=pset;f=0.85*Math.exp(-(ph/ie)*2);v=vt*(1-Math.exp(-(ph/ie)*3));}else{const ep=(ph-ie)/(1-ie);p=peep+(pset-peep)*Math.exp(-ep*3.5);f=-0.45*Math.exp(-ep*2.5);v=vt*(1-ep);}break;}
      case 'auto_peep':{const ie=0.35,vt=0.55,peep=0.1,ppk=0.76,ppl=0.62,iP=0.14;if(ph<ie){p=peep+iP+(ppk-peep)*(ph/ie);f=0.9;v=ph/ie*vt;}else{const ep=(ph-ie)/(1-ie);f=-0.55*Math.exp(-ep*1.8)+0.12;p=peep+iP+(ppl-peep)*Math.exp(-ep*2.5);v=Math.max(0,vt*(1-ep*0.85));}break;}
      case 'bronchospasm':{const ie=0.27,vt=0.55,peep=0.1,ppk=0.88,ppl=0.57;if(ph<ie){p=peep+(ppk-peep)*(ph/ie);f=0.9;v=ph/ie*vt;}else{const ep=(ph-ie)/(1-ie);f=-0.55*Math.pow(ep,0.4)*Math.exp(-ep*0.8);p=peep+(ppl-peep)*Math.exp(-ep*4);v=vt*Math.exp(-ep*1.2);}break;}
      case 'compliance':{const ie=0.27,vt=0.50,peep=0.1,ppk=0.90,ppl=0.84;if(ph<ie){p=peep+(ppk-peep)*(ph/ie);f=0.9;v=ph/ie*vt;}else{const ep=(ph-ie)/(1-ie);p=peep+(ppl-peep)*Math.exp(-ep*4);f=-0.5*Math.exp(-ep*2.5);v=vt*(1-ep);}break;}
      case 'cuff_leak':{const ie=0.27,peep=0.1,ppk=0.65,ppl=0.50;if(ph<ie){p=peep+(ppk-peep)*(ph/ie);f=0.9;v=ph/ie*0.55;}else{const ep=(ph-ie)/(1-ie);p=peep+(ppl-peep)*Math.exp(-ep*4);f=-0.35*Math.exp(-ep*2.5);v=Math.max(0,0.55-ep*0.55*0.65);}break;}
      default:break;
    }
    P.push(Math.max(0.01,Math.min(0.99,p)));
    F.push(Math.max(-1,Math.min(1,f)));
    V.push(Math.max(0,Math.min(0.99,v)));
  }
  return {P,F,V};
}

function genPVLoopPts(scenId) {
  const pts=[],N=80;
  for(let i=0;i<=N;i++){
    const t2=i/N;let p,v;
    if(scenId==='normal'){
      if(t2<=0.5){const r=t2*2;p=5+r*20;v=r*r*510;}
      else{const r=1-(t2-0.5)*2;p=5+r*20;v=r*510*(1-0.09*(1-r));}
    }else if(scenId==='ards'){
      if(t2<=0.5){const r=t2*2;p=5+r*30;v=r<0.17?r*105:r<0.83?18+(r-0.17)*630:410+(r-0.83)*60;}
      else{const r=1-(t2-0.5)*2;p=5+r*30;v=Math.max(0,r<0.17?r*90:r*420);}
    }else{
      if(t2<=0.5){const r=t2*2;p=8+r*17;v=r*530;}
      else{const r=1-(t2-0.5)*2;p=8+r*17;v=r*530*(1-0.07*(1-r));}
    }
    pts.push({p:Math.min(40,Math.max(0,p)),v:Math.min(600,Math.max(0,v))});
  }
  return pts;
}

function CircleSystemDiagram({t}) {
  const [tick,setTick]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setTick(v=>(v+1)%240),45);return()=>clearInterval(id);},[]);
  const W=580,H=330;
  const wpts=[{x:290,y:50},{x:450,y:95},{x:505,y:185},{x:440,y:278},{x:290,y:300},{x:148,y:278},{x:82,y:185},{x:145,y:95},{x:290,y:50}];
  const getPos=(prog)=>{
    const seg=wpts.length-1,t2=((prog%1)+1)%1*seg,i=Math.floor(t2),fr=t2-i;
    const a=wpts[Math.min(i,seg-1)],b=wpts[Math.min(i+1,seg)];
    return {x:a.x+(b.x-a.x)*fr,y:a.y+(b.y-a.y)*fr};
  };
  const dots=Array.from({length:10},(_,i)=>{
    const prog=((tick/240)+(i/10))%1,pos=getPos(prog);
    const col=prog<0.12||prog>0.88?t.ac:prog<0.5?'#f59e0b':'#3b82f6';
    return {...pos,color:col};
  });
  const comps=[
    {x:290,y:50,label:'PATIENT',sub:'ETT / Mask',color:t.ac,isCircle:true,r:26},
    {x:450,y:95,label:'EXP VALVE',sub:'Unidirectional',color:'#f59e0b',w:84,h:34},
    {x:505,y:185,label:'CO₂ ABSORBER',sub:'Soda Lime',color:'#94a3b8',w:88,h:38},
    {x:290,y:300,label:'BELLOWS / FGF',sub:'O₂ + Volatile Agent',color:'#22c55e',w:102,h:34},
    {x:148,y:278,label:'APL VALVE',sub:'Pressure relief',color:'#a855f7',w:82,h:34},
    {x:82,y:185,label:'INSP VALVE',sub:'Unidirectional',color:'#3b82f6',w:84,h:34},
  ];
  return(
    <div style={{marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:`1px solid ${t.ac}40`}}>
      <div style={{background:t.bgH,padding:"10px 14px",borderBottom:`1px solid ${t.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
        <span style={{fontSize:"12px",color:t.ac,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>&#9654; Anesthesia Circle System &mdash; Animated Gas Flow</span>
        <div style={{display:"flex",gap:"14px",fontSize:"11px",color:t.tM}}>
          <span><span style={{color:'#f59e0b'}}>&#9679;</span> Expired (CO&#8322;-laden)</span>
          <span><span style={{color:'#3b82f6'}}>&#9679;</span> Inspired (fresh gas)</span>
        </div>
      </div>
      <div style={{background:t.bgH}}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block",minWidth:"380px"}}>
          <polyline points={`${wpts[0].x},${wpts[0].y} ${wpts[1].x},${wpts[1].y} ${wpts[2].x},${wpts[2].y} ${wpts[3].x},${wpts[3].y} ${wpts[4].x},${wpts[4].y}`} fill="none" stroke="#f59e0b" strokeWidth="7" strokeOpacity="0.18" strokeLinejoin="round"/>
          <polyline points={`${wpts[4].x},${wpts[4].y} ${wpts[5].x},${wpts[5].y} ${wpts[6].x},${wpts[6].y} ${wpts[7].x},${wpts[7].y} ${wpts[8].x},${wpts[8].y}`} fill="none" stroke="#3b82f6" strokeWidth="7" strokeOpacity="0.18" strokeLinejoin="round"/>
          <text x={510} y={152} fill="#f59e0b" fontSize="16" opacity="0.6">&#8595;</text>
          <text x={68} y={222} fill="#3b82f6" fontSize="16" opacity="0.6">&#8593;</text>
          <text x={362} y={72} fill="#f59e0b" fontSize="14" opacity="0.6">&#8594;</text>
          <text x={200} y={72} fill="#3b82f6" fontSize="14" opacity="0.6">&#8592;</text>
          {dots.map((d,i)=><circle key={i} cx={d.x} cy={d.y} r="5" fill={d.color} opacity="0.9"/>)}
          {comps.map((c,i)=>c.isCircle
            ?<g key={i}><circle cx={c.x} cy={c.y} r={c.r} fill={t.bgC} stroke={c.color} strokeWidth="2.5"/><text x={c.x} y={c.y-3} fill={c.color} fontSize="8" textAnchor="middle" fontWeight="700">{c.label}</text><text x={c.x} y={c.y+9} fill={t.tM} fontSize="7" textAnchor="middle">{c.sub}</text></g>
            :<g key={i}><rect x={c.x-c.w/2} y={c.y-c.h/2} width={c.w} height={c.h} rx="5" fill={t.bgC} stroke={c.color} strokeWidth="1.5"/><text x={c.x} y={c.y-3} fill={c.color} fontSize="8" textAnchor="middle" fontWeight="700">{c.label}</text><text x={c.x} y={c.y+9} fill={t.tM} fontSize="7" textAnchor="middle">{c.sub}</text></g>
          )}
        </svg>
      </div>
      <div style={{padding:"10px 16px",background:t.bgC,borderTop:`1px solid ${t.bd}`}}>
        <p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}>Gas flows <strong style={{color:'#f59e0b'}}>unidirectionally</strong>: expired gas traverses the CO&#8322; absorber (CO&#8322; &#8594; CaCO&#8323;) before returning as inspired gas. FGF replaces consumed O&#8322; and washed-out volatile agent. APL valve prevents over-pressurization. Low-flow anesthesia (&le;1 L/min) conserves heat and agent but demands reliable CO&#8322; monitoring.</p>
      </div>
    </div>
  );
}

function OLVDiagram({t}) {
  const [mode,setMode]=useState('twol');
  const modes=[{id:'twol',label:'Two-Lung Ventilation',color:t.bl},{id:'olv',label:'OLV Initiated',color:t.wn},{id:'hpv',label:'HPV Response',color:t.ok},{id:'cpap',label:'CPAP Rescue',color:t.ac}];
  const W=480,H=280;
  const lRx=mode==='twol'?65:72,lRy=mode==='twol'?90:100;
  const rRx=mode==='twol'?60:mode==='cpap'?50:38,rRy=mode==='twol'?88:mode==='cpap'?70:52;
  const lFill=`#3b82f6${mode==='twol'?'18':'22'}`;
  const rFill=mode==='twol'?'#3b82f618':mode==='cpap'?`${t.ac}18`:'#64748b14';
  const rStroke=mode==='twol'?'#3b82f6':mode==='cpap'?t.ac:'#64748b';
  const showHPV=mode==='hpv'||mode==='cpap';
  return(
    <div style={{marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:`1px solid ${t.pr}40`}}>
      <div style={{background:t.bgH,padding:"10px 14px",borderBottom:`1px solid ${t.bd}`}}>
        <span style={{fontSize:"12px",color:t.pr,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>One-Lung Ventilation (OLV) &mdash; Step Through</span>
      </div>
      <div style={{display:"flex",gap:"6px",padding:"10px 14px",background:t.bgH,borderBottom:`1px solid ${t.bd}`,flexWrap:"wrap"}}>
        {modes.map(m=><button key={m.id} onClick={()=>setMode(m.id)} style={{padding:"5px 12px",borderRadius:"6px",border:`1px solid ${mode===m.id?m.color:t.bd}`,background:mode===m.id?`${m.color}18`:t.bgC,color:mode===m.id?m.color:t.tM,fontSize:"11px",fontWeight:mode===m.id?700:400,cursor:"pointer"}}>{m.label}</button>)}
      </div>
      <div style={{background:t.bgH}}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block",minWidth:"300px"}}>
          <rect x="30" y="16" width="420" height="240" rx="18" fill={t.bgC} stroke={t.bd} strokeWidth="1"/>
          <rect x="222" y="24" width="28" height="208" rx="3" fill={t.bgH} stroke={t.bd} strokeWidth="1"/>
          <text x="236" y="132" fill={t.tM} fontSize="7" textAnchor="middle">MED</text>
          <ellipse cx="128" cy="128" rx={lRx} ry={lRy} fill={lFill} stroke="#3b82f6" strokeWidth="2"/>
          <text x="128" y="120" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="700">{mode==='twol'?'L. LUNG':'DEPENDENT'}</text>
          <text x="128" y="132" fill="#3b82f6" fontSize="8" textAnchor="middle">Ventilated</text>
          {mode!=='twol'&&<text x="128" y="144" fill="#3b82f6" fontSize="8" textAnchor="middle">PEEP 5&ndash;10</text>}
          <ellipse cx="353" cy="128" rx={rRx} ry={rRy} fill={rFill} stroke={rStroke} strokeWidth={mode==='twol'?2:1.5} strokeDasharray={mode!=='twol'?'5,2':'none'}/>
          <text x="353" y="120" fill={rStroke} fontSize="10" textAnchor="middle" fontWeight="700">{mode==='twol'?'R. LUNG':'OPERATIVE'}</text>
          <text x="353" y="132" fill={rStroke} fontSize="8" textAnchor="middle">{mode==='twol'?'Ventilated':mode==='cpap'?'CPAP 5-10':'Collapsed'}</text>
          {mode==='olv'&&<text x="353" y="146" fill="#f59e0b" fontSize="8" textAnchor="middle">Surgical access</text>}
          <rect x="208" y="10" width="44" height="18" rx="3" fill={t.bgC} stroke={t.ac} strokeWidth="1.5"/>
          <text x="230" y="22" fill={t.ac} fontSize="8" textAnchor="middle" fontWeight="700">{mode==='twol'?'ETT':'DLT'}</text>
          <line x1="208" y1="19" x2="128" y2="50" stroke="#3b82f6" strokeWidth="2"/>
          {mode!=='twol'&&<line x1="252" y1="19" x2="353" y2="50" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,2"/>}
          {showHPV&&<g>
            <defs><marker id="arrowR2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 Z" fill="#ef4444"/></marker></defs>
            <path d="M338,172 C290,168 258,162 200,158 C178,156 156,157 142,158" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowR2)"/>
            <text x="250" y="152" fill="#ef4444" fontSize="8" textAnchor="middle" fontWeight="600">HPV redirects blood &#8594;</text>
          </g>}
          {mode!=='twol'&&<g><rect x="308" y="12" width="112" height="14" rx="3" fill="#ef444420" stroke="#ef4444" strokeWidth="1"/><text x="364" y="22" fill="#ef4444" fontSize="8" textAnchor="middle" fontWeight="700">SURGICAL FIELD</text></g>}
          <text x="128" y="258" fill={t.tM} fontSize="8" textAnchor="middle">Left (Dependent)</text>
          <text x="353" y="258" fill={t.tM} fontSize="8" textAnchor="middle">Right (Operative)</text>
        </svg>
      </div>
      <div style={{padding:"10px 16px",background:t.bgC,borderTop:`1px solid ${t.bd}`}}>
        {mode==='twol'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}>Standard two-lung ventilation via single-lumen ETT.</p>}
        {mode==='olv'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:t.wn,fontWeight:600}}>DLT isolates operative lung.</span> Reduce Vt to 4&ndash;6 mL/kg IBW (one lung receives the full breath). FiO&#8322; to 1.0 initially. PEEP 5&ndash;10 to dependent lung.</p>}
        {mode==='hpv'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:t.ok,fontWeight:600}}>HPV:</span> Non-ventilated alveoli sense low PAO&#8322; &#8594; local pulmonary arteriolar constriction &#8594; diverts blood to ventilated lung, reducing shunt. Volatile anesthetics inhibit HPV dose-dependently (&gt;1 MAC). TIVA preserves HPV.</p>}
        {mode==='cpap'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:t.ac,fontWeight:600}}>Rescue:</span> CPAP 5&ndash;10 to operative lung &mdash; maintains alveolar O&#8322; while keeping lung decompressed enough for surgery. First-line for OLV hypoxemia. If inadequate: partial ventilation, surgeon PA clamp.</p>}
      </div>
    </div>
  );
}

function WaveformPatternSelector({t}) {
  const [scenario,setScenario]=useState('vc_normal');
  const scenarios=[{id:'vc_normal',label:'Normal VC',color:'#3b82f6'},{id:'pc_normal',label:'Normal PC',color:'#8b5cf6'},{id:'auto_peep',label:'Auto-PEEP',color:'#ef4444'},{id:'bronchospasm',label:'Bronchospasm',color:'#f59e0b'},{id:'compliance',label:'Low Compliance',color:'#ec4899'},{id:'cuff_leak',label:'Cuff Leak',color:'#64748b'}];
  const data=useMemo(()=>genWaveformScenarioData(scenario),[scenario]);
  const sc=scenarios.find(s=>s.id===scenario);
  const N=300,LW=48,CW=490,ROW_H=72,GAP=14;
  const pY=14,fY=pY+ROW_H+GAP,vY=fY+ROW_H+GAP;
  const W=LW+CW+10,totalH=vY+ROW_H+22;
  const fZero=fY+ROW_H/2;
  const mkLine=(pts,yBase,rH,color,sw=2)=>{
    const points=pts.map((v,i)=>`${(LW+(i/N)*CW).toFixed(1)},${(yBase+rH-v*rH).toFixed(1)}`).join(' ');
    return <polyline key={color+yBase} points={points} fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round"/>;
  };
  const annotations={
    vc_normal:[{chart:'p',x:0.09,y:0.84,label:'Ppeak',color:'#3b82f6'},{chart:'p',x:0.22,y:0.68,label:'Pplat',color:'#22c55e'},{chart:'f',x:0.08,y:0.88,label:'Const. flow',color:'#3b82f6'}],
    auto_peep:[{chart:'f',x:0.42,y:0.35,label:'Flow\u22600 at end',color:'#ef4444'},{chart:'p',x:0.09,y:0.90,label:'Elevated base',color:'#ef4444'}],
    bronchospasm:[{chart:'p',x:0.08,y:0.94,label:'High Ppeak',color:'#f59e0b'},{chart:'p',x:0.21,y:0.65,label:'Norm Pplat',color:'#22c55e'},{chart:'f',x:0.55,y:0.18,label:'Scooped exp',color:'#f59e0b'}],
    compliance:[{chart:'p',x:0.08,y:0.94,label:'High Ppeak',color:'#ec4899'},{chart:'p',x:0.21,y:0.88,label:'High Pplat &gt;30',color:'#ef4444'}],
    cuff_leak:[{chart:'v',x:0.22,y:0.80,label:'Inspired Vt',color:'#3b82f6'},{chart:'v',x:0.65,y:0.28,label:'Exhaled (less)',color:'#ef4444'}],
  };
  const annots=annotations[scenario]||[];
  const getAP=(a)=>({x:LW+a.x*CW,y:{p:pY,f:fY,v:vY}[a.chart]+(1-a.y)*ROW_H});
  return(
    <div style={{marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:`1px solid ${t.bl}40`}}>
      <div style={{background:t.bgH,padding:"10px 14px",borderBottom:`1px solid ${t.bd}`}}>
        <span style={{fontSize:"12px",color:t.bl,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>&#9654; Waveform Pattern Recognition</span>
      </div>
      <div style={{display:"flex",gap:"6px",padding:"10px 14px",background:t.bgH,borderBottom:`1px solid ${t.bd}`,flexWrap:"wrap"}}>
        {scenarios.map(s=><button key={s.id} onClick={()=>setScenario(s.id)} style={{padding:"5px 12px",borderRadius:"6px",border:`1px solid ${scenario===s.id?s.color:t.bd}`,background:scenario===s.id?`${s.color}18`:t.bgC,color:scenario===s.id?s.color:t.tM,fontSize:"11px",fontWeight:scenario===s.id?700:400,cursor:"pointer"}}>{s.label}</button>)}
      </div>
      <div style={{background:t.bgH,overflowX:"auto"}}>
        <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{display:"block",minWidth:"420px"}}>
          {[pY,fY,vY].map((yo,ri)=><rect key={ri} x={LW} y={yo} width={CW} height={ROW_H} fill={t.bgC} rx="2"/>)}
          {[pY,fY,vY].flatMap((yo,ri)=>[0,0.5,1].map(fr=><line key={`g${ri}${fr}`} x1={LW} y1={yo+fr*ROW_H} x2={LW+CW} y2={yo+fr*ROW_H} stroke={t.bd} strokeWidth="0.5"/>))}
          {[0,0.5,1].map((fr,i)=><line key={i} x1={LW+fr*CW} y1={pY} x2={LW+fr*CW} y2={vY+ROW_H} stroke={t.bd} strokeWidth="1" strokeDasharray="3,3"/>)}
          <line x1={LW} y1={fZero} x2={LW+CW} y2={fZero} stroke={t.bd} strokeWidth="1.5" strokeDasharray="3,2"/>
          <text x={LW-4} y={pY+12} fill={sc.color} fontSize="9" textAnchor="end" fontWeight="700">PRESSURE</text>
          <text x={LW-4} y={fY+12} fill="#f59e0b" fontSize="9" textAnchor="end" fontWeight="700">FLOW</text>
          <text x={LW-4} y={vY+12} fill="#22c55e" fontSize="9" textAnchor="end" fontWeight="700">VOLUME</text>
          {mkLine(data.P,pY,ROW_H,sc.color,2)}
          {(()=>{const fp=data.F.map((v,i)=>`${(LW+(i/N)*CW).toFixed(1)},${(fZero-v*(ROW_H*0.42)).toFixed(1)}`).join(' ');return <polyline key="flow" points={fp} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round"/>;})()}
          {mkLine(data.V,vY,ROW_H,'#22c55e',2)}
          {annots.map((a,i)=>{const pos=getAP(a);return <g key={i}><rect x={pos.x-2} y={pos.y-11} width={a.label.length*5.5+4} height="13" rx="2" fill={t.bgH} opacity="0.85"/><text x={pos.x} y={pos.y} fill={a.color} fontSize="9" fontWeight="600">{a.label}</text></g>;})}
          <text x={LW+CW*0.125} y={totalH-4} fill={t.tM} fontSize="8" textAnchor="middle">Breath 1</text>
          <text x={LW+CW*0.625} y={totalH-4} fill={t.tM} fontSize="8" textAnchor="middle">Breath 2</text>
        </svg>
      </div>
      <div style={{padding:"10px 16px",background:t.bgC,borderTop:`1px solid ${t.bd}`}}>
        {scenario==='vc_normal'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:sc.color,fontWeight:600}}>VC pattern:</span> Constant (square) flow &#8594; rising pressure. Ppeak &minus; Pplat = resistive pressure. Inspiratory hold reveals Pplat (elastic only). Normal Pplat &lt;30 cmH&#8322;O.</p>}
        {scenario==='pc_normal'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:sc.color,fontWeight:600}}>PC pattern:</span> Square pressure plateau, decelerating flow. More physiologic. Volume varies with compliance &mdash; monitor exhaled Vt closely.</p>}
        {scenario==='auto_peep'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:sc.color,fontWeight:600}}>Auto-PEEP:</span> Expiratory flow does NOT reach zero before next breath. Perform expiratory hold to quantify. Treat: decrease RR, lengthen expiratory time, bronchodilators.</p>}
        {scenario==='bronchospasm'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:sc.color,fontWeight:600}}>Bronchospasm:</span> High Ppeak, normal Pplat (resistance problem). Ppeak &minus; Pplat &gt;10. Scooped (shark-fin) expiratory flow = slow obstructed emptying.</p>}
        {scenario==='compliance'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:sc.color,fontWeight:600}}>Low compliance:</span> Both Ppeak AND Pplat elevated. Pplat &gt;30 = ARDSNet violation. Reduce Vt, check for PTX, mainstem intubation, pulmonary edema.</p>}
        {scenario==='cuff_leak'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:sc.color,fontWeight:600}}>Cuff leak:</span> Inspired Vt exceeds exhaled Vt on volume trace. Causes: cuff leak, circuit disconnect, bronchopleural fistula. Check cuff pressure and circuit integrity.</p>}
      </div>
    </div>
  );
}

function PVLoopDiagram({t}) {
  const [scenario,setScenario]=useState('normal');
  const [animStep,setAnimStep]=useState(0);
  const [running,setRunning]=useState(true);
  useEffect(()=>{if(!running)return;const id=setInterval(()=>setAnimStep(s=>(s+1)%100),40);return()=>clearInterval(id);},[running]);
  const W=380,H=290,ml={l:52,r:16,t:16,b:36};
  const cW=W-ml.l-ml.r,cH=H-ml.t-ml.b;
  const toSVG=(p,v)=>({x:ml.l+(p/40)*cW,y:ml.t+cH-(v/600)*cH});
  const loops=useMemo(()=>({normal:genPVLoopPts('normal'),ards:genPVLoopPts('ards'),recruited:genPVLoopPts('recruited')}),[]);
  const lp=loops[scenario]||[];
  const toPath=(pts)=>pts.map((p,i)=>`${i===0?'M':'L'}${toSVG(p.p,p.v).x.toFixed(1)},${toSVG(p.p,p.v).y.toFixed(1)}`).join(' ');
  const fullPath=toPath(lp);
  const animIdx=Math.floor(animStep/100*lp.length);
  const tracePath=lp.length>1?toPath(lp.slice(0,Math.max(2,animIdx))):'';
  const scColor=scenario==='normal'?'#22c55e':scenario==='ards'?'#ef4444':t.ac;
  const LIP=toSVG(10,65),UIP=toSVG(33,420);
  return(
    <div style={{marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:`1px solid ${t.wn}40`}}>
      <div style={{background:t.bgH,padding:"10px 14px",borderBottom:`1px solid ${t.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
        <span style={{fontSize:"12px",color:t.wn,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>&#9654; Pressure-Volume Loop</span>
        <button onClick={()=>{setRunning(r=>!r);setAnimStep(0);}} style={{fontSize:"11px",color:t.ac,background:t.aD,border:`1px solid ${t.aB}`,borderRadius:"4px",padding:"3px 10px",cursor:"pointer"}}>{running?'Pause':'Replay'}</button>
      </div>
      <div style={{display:"flex",gap:"6px",padding:"10px 14px",background:t.bgH,borderBottom:`1px solid ${t.bd}`,flexWrap:"wrap"}}>
        {[{id:'normal',label:'Normal',color:'#22c55e'},{id:'ards',label:'ARDS (pre-recruit)',color:'#ef4444'},{id:'recruited',label:'Post-Recruitment',color:t.ac}].map(s=><button key={s.id} onClick={()=>{setScenario(s.id);setAnimStep(0);}} style={{padding:"5px 12px",borderRadius:"6px",border:`1px solid ${scenario===s.id?s.color:t.bd}`,background:scenario===s.id?`${s.color}18`:t.bgC,color:scenario===s.id?s.color:t.tM,fontSize:"11px",fontWeight:scenario===s.id?700:400,cursor:"pointer"}}>{s.label}</button>)}
      </div>
      <div style={{background:t.bgH,display:"flex",justifyContent:"center"}}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block",maxWidth:"460px"}}>
          <rect x={ml.l} y={ml.t} width={cW} height={cH} fill={t.bgC} rx="2"/>
          {[0,10,20,30,40].map(p=><g key={p}><line x1={ml.l+(p/40)*cW} y1={ml.t} x2={ml.l+(p/40)*cW} y2={ml.t+cH} stroke={t.bd} strokeWidth="0.5"/><text x={ml.l+(p/40)*cW} y={ml.t+cH+12} fill={t.tM} fontSize="8" textAnchor="middle">{p}</text></g>)}
          {[0,100,200,300,400,500,600].map(v=><g key={v}><line x1={ml.l} y1={ml.t+cH-(v/600)*cH} x2={ml.l+cW} y2={ml.t+cH-(v/600)*cH} stroke={t.bd} strokeWidth="0.5"/><text x={ml.l-4} y={ml.t+cH-(v/600)*cH+3} fill={t.tM} fontSize="8" textAnchor="end">{v}</text></g>)}
          <text x={ml.l+cW/2} y={H-4} fill={t.t2} fontSize="9" textAnchor="middle">Pressure (cmH&#8322;O)</text>
          <text x={8} y={ml.t+cH/2+4} fill={t.t2} fontSize="9" textAnchor="middle" transform={`rotate(-90,8,${ml.t+cH/2})`}>Volume (mL)</text>
          {scenario==='ards'&&<g>
            <circle cx={LIP.x} cy={LIP.y} r="5" fill="#22c55e" opacity="0.9"/>
            <text x={LIP.x+8} y={LIP.y+4} fill="#22c55e" fontSize="9" fontWeight="700">LIP</text>
            <line x1={ml.l} y1={LIP.y} x2={ml.l+cW} y2={LIP.y} stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2" opacity="0.5"/>
            <text x={ml.l+6} y={LIP.y-3} fill="#22c55e" fontSize="8">Set PEEP above LIP</text>
            <circle cx={UIP.x} cy={UIP.y} r="5" fill="#ef4444" opacity="0.9"/>
            <text x={UIP.x-8} y={UIP.y-6} fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="end">UIP</text>
          </g>}
          <path d={fullPath} fill="none" stroke={scColor} strokeWidth="1" opacity="0.18"/>
          {tracePath&&<path d={tracePath} fill="none" stroke={scColor} strokeWidth="2.5" strokeLinejoin="round"/>}
          <text x={ml.l+cW*0.22} y={ml.t+cH*0.18} fill={t.tM} fontSize="9">&#8593; Inflation</text>
          <text x={ml.l+cW*0.55} y={ml.t+cH*0.82} fill={t.tM} fontSize="9">&#8595; Deflation</text>
          <text x={ml.l+cW*0.5} y={ml.t+cH*0.5} fill={t.tM} fontSize="9" textAnchor="middle" opacity="0.45">Hysteresis</text>
        </svg>
      </div>
      <div style={{padding:"10px 16px",background:t.bgC,borderTop:`1px solid ${t.bd}`}}>
        {scenario==='normal'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}>Normal counterclockwise loop. Inflation limb (left) vs. deflation limb (right) &mdash; the gap between them is <strong>hysteresis</strong>: lungs require less pressure to stay open than to open. Area inside loop = work of breathing.</p>}
        {scenario==='ards'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:'#ef4444',fontWeight:600}}>ARDS:</span> S-shaped inflation curve. <span style={{color:'#22c55e',fontWeight:600}}>LIP</span> = alveolar recruitment begins &mdash; set PEEP above LIP to prevent atelectrauma. <span style={{color:'#ef4444',fontWeight:600}}>UIP</span> = overdistension begins &mdash; keep Pplat below UIP to prevent volutrauma.</p>}
        {scenario==='recruited'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:t.ac,fontWeight:600}}>Post-recruitment:</span> Steeper slope = improved compliance. Hysteresis means alveoli stay open at lower PEEP once recruited at high pressure. This is the physiology behind recruitment maneuvers.</p>}
      </div>
    </div>
  );
}

function IBWCalculator({t}) {
  const [sex,setSex]=useState('male');
  const [ft,setFt]=useState(5);
  const [inch,setInch]=useState(10);
  const [actualWt,setActualWt]=useState('');
  const totalIn=ft*12+inch;
  const ibw=Math.max(0,sex==='male'?50+2.3*(totalIn-60):45.5+2.3*(totalIn-60));
  const ibwR=Math.round(ibw*10)/10;
  const actN=parseFloat(actualWt);
  const showCmp=!isNaN(actN)&&actN>30;
  const diff=showCmp?Math.round(actN*6)-Math.round(ibwR*6):0;
  return(
    <div style={{marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:`2px solid ${t.wn}`}}>
      <div style={{background:t.bgH,padding:"10px 14px",borderBottom:`1px solid ${t.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
        <span style={{fontSize:"12px",color:t.wn,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>IBW Calculator &mdash; Vt Targeting</span>
        <span style={{fontSize:"11px",color:t.tM}}>Always IBW, never actual body weight</span>
      </div>
      <div style={{padding:"16px",background:t.bgC}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:"14px",marginBottom:"16px"}}>
          <div>
            <div style={{fontSize:"11px",color:t.tM,marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Sex</div>
            <div style={{display:"flex",gap:"8px"}}>
              {['male','female'].map(s=><button key={s} onClick={()=>setSex(s)} style={{flex:1,padding:"7px",borderRadius:"6px",border:`1px solid ${sex===s?t.ac:t.bd}`,background:sex===s?t.aD:t.bgH,color:sex===s?t.ac:t.tM,fontSize:"12px",fontWeight:sex===s?700:400,cursor:"pointer",textTransform:"capitalize"}}>{s}</button>)}
            </div>
          </div>
          <div>
            <div style={{fontSize:"11px",color:t.tM,marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Height</div>
            <div style={{display:"flex",gap:"8px"}}>
              <select value={ft} onChange={e=>setFt(parseInt(e.target.value))} style={{flex:1,padding:"6px",borderRadius:"6px",border:`1px solid ${t.bd}`,background:t.bgH,color:t.tx,fontSize:"13px"}}>
                {[4,5,6,7].map(f=><option key={f} value={f}>{f} ft</option>)}
              </select>
              <select value={inch} onChange={e=>setInch(parseInt(e.target.value))} style={{flex:1,padding:"6px",borderRadius:"6px",border:`1px solid ${t.bd}`,background:t.bgH,color:t.tx,fontSize:"13px"}}>
                {[0,1,2,3,4,5,6,7,8,9,10,11].map(i2=><option key={i2} value={i2}>{i2} in</option>)}
              </select>
            </div>
          </div>
          <div>
            <div style={{fontSize:"11px",color:t.tM,marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Actual Wt (optional)</div>
            <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
              <input type="number" value={actualWt} onChange={e=>setActualWt(e.target.value)} placeholder="kg" min="30" max="300" style={{width:"80px",padding:"6px 8px",borderRadius:"6px",border:`1px solid ${t.bd}`,background:t.bgH,color:t.tx,fontSize:"13px"}}/>
              <span style={{fontSize:"12px",color:t.tM}}>kg</span>
            </div>
          </div>
        </div>
        <div style={{padding:"12px 16px",background:t.aD,borderRadius:"8px",border:`1px solid ${t.aB}`,marginBottom:"14px"}}>
          <div style={{fontSize:"10px",color:t.tM,marginBottom:"2px",textTransform:"uppercase"}}>Ideal Body Weight</div>
          <div style={{fontSize:"28px",fontWeight:700,color:t.ac}}>{ibwR} <span style={{fontSize:"16px"}}>kg</span></div>
          <div style={{fontSize:"10px",color:t.tM}}>{sex==='male'?`50 + 2.3 \u00d7 (${totalIn} − 60)`:`45.5 + 2.3 \u00d7 (${totalIn} − 60)`}</div>
        </div>
        <div style={{marginBottom:"14px"}}>
          <div style={{fontSize:"11px",color:t.tM,marginBottom:"8px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Tidal Volume Targets</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>
            {[4,6,8].map(v=><div key={v} style={{padding:"10px",background:v===6?t.aD:t.bgH,borderRadius:"8px",border:`1px solid ${v===6?t.aB:t.bd}`,textAlign:"center"}}>
              <div style={{fontSize:"10px",color:v===6?t.ac:t.tM,marginBottom:"2px"}}>{v} mL/kg{v===4?' (ARDS min)':v===6?' (Target)':' (Max)'}</div>
              <div style={{fontSize:"22px",fontWeight:700,color:v===6?t.ac:t.tx}}>{Math.round(ibwR*v)} <span style={{fontSize:"11px"}}>mL</span></div>
            </div>)}
          </div>
        </div>
        {showCmp&&<div style={{padding:"12px 16px",background:diff>100?'#ef444412':'#22c55e10',borderRadius:"8px",border:`1px solid ${diff>100?t.dg:t.ok}`}}>
          <div style={{fontSize:"12px",fontWeight:700,color:diff>100?t.dg:t.ok,marginBottom:"4px"}}>{diff>100?'\u26a0 Obese — DO NOT use actual weight':'\u2713 Actual weight close to IBW'}</div>
          {diff>100&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}>6 mL/kg <strong>IBW</strong> = <span style={{color:t.ac,fontWeight:700}}>{Math.round(ibwR*6)} mL</span> vs. actual weight ({actN} kg) = <span style={{color:t.dg,fontWeight:700}}>{Math.round(actN*6)} mL</span> &mdash; <span style={{color:t.dg,fontWeight:700}}>{diff} mL</span> over target ({Math.round((diff/Math.round(ibwR*6))*100)}% excess).</p>}
        </div>}
      </div>
    </div>
  );
}

function PressureTroubleshooter({t}) {
  const [peak,setPeak]=useState('');
  const [plat,setPlat]=useState('');
  const pkN=parseFloat(peak),plN=parseFloat(plat);
  const valid=!isNaN(pkN)&&!isNaN(plN)&&pkN>0&&plN>0&&pkN>=plN;
  const gap=valid?pkN-plN:0;
  const dx=valid?(plN>30?'compliance':gap>10?'resistance':pkN<=35&&plN<=28?'normal':'borderline'):null;
  return(
    <div style={{marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:`1px solid ${t.dg}40`}}>
      <div style={{background:t.bgH,padding:"10px 14px",borderBottom:`1px solid ${t.bd}`}}>
        <span style={{fontSize:"12px",color:t.dg,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Pressure Troubleshooter</span>
      </div>
      <div style={{padding:"16px",background:t.bgC}}>
        <p style={{margin:"0 0 14px",fontSize:"13px",color:t.t2}}>Enter Ppeak and Pplat (from inspiratory hold) to get a guided differential.</p>
        <div style={{display:"flex",gap:"16px",flexWrap:"wrap",marginBottom:"16px",alignItems:"flex-end"}}>
          <div>
            <div style={{fontSize:"11px",color:t.tM,marginBottom:"4px",textTransform:"uppercase"}}>Ppeak (cmH&#8322;O)</div>
            <input type="number" value={peak} onChange={e=>setPeak(e.target.value)} placeholder="e.g. 42" min="5" max="80" style={{width:"100px",padding:"8px 10px",borderRadius:"6px",border:`1px solid ${t.bd}`,background:t.bgH,color:t.tx,fontSize:"15px",fontWeight:600}}/>
          </div>
          <div>
            <div style={{fontSize:"11px",color:t.tM,marginBottom:"4px",textTransform:"uppercase"}}>Pplat (cmH&#8322;O)</div>
            <input type="number" value={plat} onChange={e=>setPlat(e.target.value)} placeholder="e.g. 28" min="5" max="60" style={{width:"100px",padding:"8px 10px",borderRadius:"6px",border:`1px solid ${t.bd}`,background:t.bgH,color:t.tx,fontSize:"15px",fontWeight:600}}/>
            <div style={{fontSize:"10px",color:t.tM,marginTop:"2px"}}>From inspiratory hold</div>
          </div>
          {valid&&<div style={{padding:"10px 16px",background:t.bgH,borderRadius:"8px",textAlign:"center"}}>
            <div style={{fontSize:"10px",color:t.tM}}>Ppeak &minus; Pplat</div>
            <div style={{fontSize:"22px",fontWeight:700,color:gap>10?t.wn:t.ok}}>{gap.toFixed(0)} cmH&#8322;O</div>
            <div style={{fontSize:"10px",color:t.tM}}>Resistance component</div>
          </div>}
        </div>
        {dx==='normal'&&<div style={{padding:"14px 16px",background:'#22c55e10',borderRadius:"10px",border:`2px solid #22c55e`}}>
          <div style={{fontSize:"15px",fontWeight:700,color:'#22c55e',marginBottom:"6px"}}>&#10003; Pressures Within Target</div>
          <p style={{margin:0,fontSize:"13px",color:t.t2,lineHeight:1.7}}>Ppeak &lt;35, Pplat &lt;30, resistance component &lt;10 cmH&#8322;O. Lung-protective ventilation maintained.</p>
        </div>}
        {dx==='resistance'&&<div style={{padding:"14px 16px",background:'#f59e0b10',borderRadius:"10px",border:`2px solid ${t.wn}`}}>
          <div style={{fontSize:"15px",fontWeight:700,color:t.wn,marginBottom:"8px"}}>&#9888; Airway Resistance Problem</div>
          <p style={{fontSize:"13px",color:t.t2,marginBottom:"10px",lineHeight:1.7,margin:"0 0 10px"}}>Ppeak &minus; Pplat = <strong>{gap.toFixed(0)} cmH&#8322;O &gt;10</strong> &#8594; Resistance elevated; elastic component (Pplat) normal.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",fontSize:"12px"}}>
            <div><div style={{color:t.tx,fontWeight:600,marginBottom:"5px"}}>Causes</div><div style={{color:t.t2,lineHeight:1.9}}>Bronchospasm<br/>Secretions / mucus plug<br/>Kinked or bitten ETT<br/>Small ETT diameter<br/>Circuit obstruction</div></div>
            <div><div style={{color:t.tx,fontWeight:600,marginBottom:"5px"}}>Treatment</div><div style={{color:t.t2,lineHeight:1.9}}>Suction ETT<br/>Albuterol / bronchodilator<br/>Check circuit + ETT<br/>Add bite block<br/>Consider larger ETT</div></div>
          </div>
        </div>}
        {dx==='compliance'&&<div style={{padding:"14px 16px",background:'#ef444412',borderRadius:"10px",border:`2px solid ${t.dg}`}}>
          <div style={{fontSize:"15px",fontWeight:700,color:t.dg,marginBottom:"8px"}}>&#9888; Compliance Problem &mdash; ARDSNet Violation</div>
          <p style={{fontSize:"13px",color:t.t2,marginBottom:"10px",lineHeight:1.7,margin:"0 0 10px"}}>Pplat = <strong>{plN} cmH&#8322;O &gt;30</strong> &#8594; Stiff lungs. Immediate action required.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",fontSize:"12px"}}>
            <div><div style={{color:t.tx,fontWeight:600,marginBottom:"5px"}}>Causes</div><div style={{color:t.t2,lineHeight:1.9}}>ARDS / pulmonary edema<br/>Tension pneumothorax<br/>Mainstem intubation<br/>Atelectasis<br/>Obesity / abdominal HTN<br/>Chest wall rigidity</div></div>
            <div><div style={{color:t.tx,fontWeight:600,marginBottom:"5px"}}>Treatment</div><div style={{color:t.t2,lineHeight:1.9}}>&#8595; Vt to 5 then 4 mL/kg IBW<br/>Treat underlying cause<br/>CXR / assess for PTX<br/>Verify ETT position<br/>Permissive hypercapnia<br/>Consider PC mode</div></div>
          </div>
        </div>}
        {dx==='borderline'&&<div style={{padding:"14px 16px",background:t.bgH,borderRadius:"10px",border:`1px solid ${t.bd}`}}>
          <p style={{margin:0,fontSize:"13px",color:t.t2}}>Borderline pressures. Monitor closely. Ensure Vt is 6 mL/kg IBW and PEEP is optimized.</p>
        </div>}
        {!dx&&<div style={{padding:"24px",textAlign:"center",color:t.tM,background:t.bgH,borderRadius:"8px",border:`1px dashed ${t.bd}`,fontSize:"13px"}}>Enter Ppeak and Pplat values above to generate differential</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function VentDevice({ t, theme }) {
  const [activeTab, setActiveTab] = useState("foundations");
  const [selMode, setSelMode] = useState(null);
  const tabs=[{id:"foundations",label:"Oxygenation vs Ventilation"},{id:"modes",label:"Vent Modes"},{id:"anesthesia",label:"Anesthesia Ventilation"},{id:"waveforms",label:"Waveforms & Graphics"},{id:"management",label:"Management & Troubleshooting"},{id:"pearls",label:"Clinical Pearls"},{id:"interview",label:"Interview Angles"}];

  const modes = {
    acvc:{name:"AC/VC (Volume Control)",full:"Assist-Control / Volume-Cycled",color:"#3b82f6",
      how:"Clinician sets: Vt, RR, FiO2, PEEP, flow rate, I:E ratio. Every breath (mandatory + triggered) delivers the SAME preset tidal volume. Breath cycles off when Vt delivered.",
      trigger:"Time-triggered (mandatory) or patient-triggered (flow/pressure sensor). If patient triggers, they still get the full preset Vt.",
      control:"Volume is guaranteed. Pressure is variable — depends on compliance and resistance. Rising Ppeak with stable Pplat = increased airway resistance. Rising both = decreased compliance.",
      advantage:"Guaranteed minute ventilation (Vt × RR). Predictable delivery. Best for paralyzed patients, ARDS (lung-protective strategy).",
      risk:"Pressure is NOT limited — can cause barotrauma if compliance drops. Breath stacking if patient\u2019s RR exceeds set rate with inadequate expiratory time. Patient-ventilator dyssynchrony if flow doesn\u2019t match demand.",
      settings:"Vt: 6–8 mL/kg IBW (ARDS: 6 mL/kg). RR: 12–20. FiO2: titrate to SpO2 >92%. PEEP: 5–20 cmH2O. Flow: 40–60 L/min. I:E typically 1:2–1:3."},
    acpc:{name:"AC/PC (Pressure Control)",full:"Assist-Control / Pressure-Cycled",color:"#8b5cf6",
      how:"Clinician sets: Inspiratory Pressure (above PEEP), RR, Ti (inspiratory time), FiO2, PEEP. Ventilator delivers flow until target pressure reached, then maintains it for set Ti. Volume delivered depends on compliance and resistance.",
      trigger:"Time or patient-triggered. Every breath gets the same pressure target.",
      control:"Pressure is guaranteed and limited. Volume varies with compliance changes — if compliance drops, Vt drops. Decelerating flow pattern = more even gas distribution.",
      advantage:"Pressure-limited = lower barotrauma risk. Better gas distribution (decelerating flow). More comfortable for breathing patients. Useful when Ppeak is dangerously high in VC.",
      risk:"Volume NOT guaranteed — must monitor Vt closely. If compliance improves suddenly, may over-ventilate. Need alarm for low Vt.",
      settings:"Driving pressure (Pinsp): 10–25 cmH2O above PEEP. Total pressure = PEEP + Pinsp. Ti: 0.8–1.2 sec. Target Vt: 6–8 mL/kg IBW. Monitor exhaled Vt every hour."},
    simv:{name:"SIMV",full:"Synchronized Intermittent Mandatory Ventilation",color:"#f59e0b",
      how:"Delivers a set number of mandatory breaths (VC or PC). Between mandatory breaths, patient can take spontaneous breaths at their own Vt (unsupported, or with PS). Mandatory breaths are synchronized to patient effort.",
      trigger:"Mandatory breaths: time-triggered, synchronized to patient effort within a timing window. Spontaneous breaths: patient-triggered.",
      control:"Mandatory breaths: volume or pressure controlled (SIMV-VC or SIMV-PC). Spontaneous breaths: patient determines Vt (may add Pressure Support).",
      advantage:"Allows partial ventilatory support. Can be used for weaning by gradually reducing mandatory rate. Maintains respiratory muscle conditioning.",
      risk:"Without PS, spontaneous breaths through the ETT increase WOB significantly. Increased WOB can cause fatigue and delayed weaning. Largely fallen out of favor for weaning vs. PS alone.",
      settings:"Mandatory RR: 4–12. Vt (if VC): 6–8 mL/kg IBW. PS for spontaneous breaths: 5–15 cmH2O. PEEP: 5+. FiO2: titrate."},
    psv:{name:"PSV (Pressure Support)",full:"Pressure Support Ventilation",color:"#10b981",
      how:"EVERY breath is patient-triggered. Ventilator augments each breath with a set pressure above PEEP. Patient controls their own RR, Ti, and Vt. Breath terminates when inspiratory flow drops to ~25% of peak (flow-cycled).",
      trigger:"100% patient-triggered. No mandatory breaths. Requires intact respiratory drive. APNEA BACKUP required.",
      control:"Pressure is set, volume varies. Patient has full control of timing and depth. Most comfortable mode for spontaneous breathing.",
      advantage:"Most physiologic and comfortable mode. Reduces WOB through ETT. Ideal for weaning and SBTs. Reduces sedation needs. Promotes diaphragm conditioning.",
      risk:"No guaranteed minute ventilation — apnea backup essential. Unreliable in patients with weak/absent respiratory drive, heavy sedation, or neuromuscular disease. Over-support (high PS) can cause over-ventilation and respiratory alkalosis.",
      settings:"PS: 5–20 cmH2O (start 10–15, wean to 5–8 for SBT). PEEP: 5. FiO2: titrate. SBT trial: PS 5–8 / PEEP 5 for 30–120 min."},
    prvc:{name:"PRVC",full:"Pressure-Regulated Volume Control",color:"#ec4899",
      how:"Dual-control mode. Clinician sets a TARGET Vt, and the ventilator automatically adjusts inspiratory pressure breath-by-breath to deliver that volume. Uses decelerating flow (like PC) but guarantees volume (like VC).",
      trigger:"Time or patient-triggered.",
      control:"Ventilator tests compliance with an initial breath, then adjusts pressure up/down (max \u00B13 cmH2O per breath) to hit target Vt. Combines pressure-limited delivery with volume guarantee.",
      advantage:"Best of both worlds: volume guarantee + pressure limitation + decelerating flow. Auto-adapts to changing compliance. Popular in ICU and anesthesia.",
      risk:"May under-ventilate if pressure ceiling is hit. Can \u201Cchase\u201D patient effort — if patient takes large breaths, vent decreases support (reverse-triggering problem). False sense of security.",
      settings:"Target Vt: 6–8 mL/kg IBW. RR: 12–20. Pressure limit: usually auto, monitor Pinsp trend. PEEP: 5–20. FiO2: titrate."},
    aprv:{name:"APRV",full:"Airway Pressure Release Ventilation",color:"#ef4444",
      how:"Maintains a high CPAP level (P_high) for a prolonged time (T_high, ~4–6 sec), then briefly releases to a low pressure (P_low) for a short time (T_low, ~0.4–0.8 sec). The release creates expiratory flow that clears CO2. Patient breathes spontaneously at both pressure levels.",
      trigger:"Time-cycled releases. Spontaneous breathing occurs throughout.",
      control:"Inverse I:E ratio (typically 4:1 to 10:1). P_high provides continuous recruitment. Brief T_low creates \u201Cautocycling\u201D ventilation. Spontaneous breathing maintained.",
      advantage:"Continuous alveolar recruitment — open lung strategy. Preserves spontaneous breathing (less diaphragm atrophy, less sedation). May improve V/Q matching. Used in refractory ARDS.",
      risk:"Requires spontaneous breathing — difficult with paralysis. Complex to set and monitor. Auto-PEEP from short T_low. Risk of hemodynamic compromise from sustained high intrathoracic pressure. Not well-studied vs. conventional low-Vt ventilation.",
      settings:"P_high: ~20–30 cmH2O (set at previous Pplat). P_low: 0 cmH2O. T_high: 4–6 sec. T_low: 0.4–0.8 sec (set so expiratory flow drops to ~75% of peak). FiO2: titrate."},
    hfov:{name:"HFOV",full:"High-Frequency Oscillatory Ventilation",color:"#64748b",
      how:"Delivers very small tidal volumes (1–3 mL/kg) at extremely high frequencies (3–15 Hz = 180–900 breaths/min). Continuous distending pressure (mPaw) keeps lungs recruited. Oscillations create gas mixing via multiple mechanisms (not bulk flow).",
      trigger:"Not patient-triggered. Continuous oscillation.",
      control:"Set: mPaw (mean airway pressure), frequency (Hz), amplitude (\u0394P), FiO2, I:E (typically 1:2). Oxygenation: adjust mPaw and FiO2. Ventilation: adjust amplitude and frequency (lower Hz = more CO2 clearance).",
      advantage:"Ultra-protective — tiny Vt avoids volutrauma. Continuous recruitment avoids atelectrauma. Theoretical ideal for ARDS.",
      risk:"OSCAR and OSCILLATE trials (2013): no benefit, possible harm in adults. Largely abandoned in adult ICU. Still used in neonatal/pediatric. Hemodynamic compromise from high mPaw. Difficult to monitor. Requires specialized circuit.",
      settings:"mPaw: 5 cmH2O above conventional. Frequency: 5–8 Hz (adults). Amplitude: until visible chest wiggle. FiO2: start 1.0, wean. Rarely used in adult practice after 2013 trials."}
  };

  const H=({title})=><h2 style={{color:t.tx,fontSize:"22px",fontWeight:600,marginTop:"32px",marginBottom:"16px",paddingBottom:"8px",borderBottom:`1px solid ${t.bd}`}}>{title}</h2>;
  const B=({children})=><div style={{lineHeight:1.8,fontSize:"15px",color:t.t2}}>{children}</div>;
  const HL=({children})=><span style={{color:t.ac,fontWeight:600}}>{children}</span>;
  const Pl=({number,title,children})=><div style={{padding:"20px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`,marginBottom:"12px"}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}><span style={{background:t.aD,color:t.ac,padding:"2px 10px",borderRadius:"12px",fontSize:"12px",fontWeight:600}}>Pearl #{number}</span><span style={{color:t.tx,fontWeight:600,fontSize:"15px"}}>{title}</span></div><p style={{color:t.t2,fontSize:"14px",lineHeight:1.7,margin:0}}>{children}</p></div>;

  return (<div style={{maxWidth:"1100px",margin:"0 auto",padding:"16px"}}>
    <div style={{background:t.hd,borderBottom:`2px solid ${t.ac}`,padding:"16px 20px 14px",borderRadius:"12px 12px 0 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"8px",flexWrap:"wrap"}}>
        <h1 style={{margin:0,fontSize:"22px",fontWeight:700,color:t.tx,lineHeight:1.2}}>Ventilator Modes &amp; Management</h1>
      </div>
      <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
        {["Mechanical Ventilation","Oxygenation &amp; Ventilation","Anesthesia Specific","Waveform Analysis"].map(tg=><span key={tg} style={{background:t.aD,border:`1px solid ${t.aB}`,color:t.ac,padding:"2px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500}}>{tg}</span>)}
      </div>
    </div>
    <div style={{display:"flex",gap:"2px",padding:"0 4px",background:t.bgH,borderBottom:`1px solid ${t.bd}`,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      {tabs.map(tb=><button key={tb.id} onClick={()=>setActiveTab(tb.id)} style={{padding:"10px 14px",background:activeTab===tb.id?t.bgC:"transparent",color:activeTab===tb.id?t.ac:t.tM,border:"none",borderBottom:activeTab===tb.id?`2px solid ${t.ac}`:"2px solid transparent",cursor:"pointer",fontSize:"12px",fontWeight:activeTab===tb.id?600:400,whiteSpace:"nowrap",transition:"all 0.2s",flexShrink:0}}>{tb.label}</button>)}
    </div>
    <div style={{padding:"24px 0"}}>

    {activeTab==="foundations"&&<div>
      <H title="The Critical Distinction" />
      <B><p>Understanding the difference between <HL>oxygenation</HL> and <HL>ventilation</HL> is fundamental to managing any ventilator and the most commonly tested concept in CRNA interviews. They are two completely separate physiologic processes with different determinants, different problems, and different interventions.</p></B>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",margin:"20px 0"}}>
        <div style={{padding:"28px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${t.bl}`}}>
          <div style={{fontSize:"20px",color:t.bl,fontWeight:700,marginBottom:"6px"}}>Oxygenation</div>
          <div style={{fontSize:"13px",color:t.tM,marginBottom:"14px"}}>Getting O&#8322; INTO the blood</div>
          <div style={{fontSize:"14px",color:t.t2,lineHeight:1.8}}>
            <p><strong style={{color:t.tx}}>Measured by:</strong> PaO&#8322;, SpO&#8322;, P/F ratio</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Determinants:</strong> FiO&#8322;, PEEP (alveolar recruitment), mean airway pressure, V/Q matching, diffusion capacity, shunt fraction</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Fix hypoxemia:</strong> Increase FiO&#8322; and/or PEEP. Optimize V/Q matching. Treat shunt (recruit collapsed alveoli). Prone positioning.</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Key equation:</strong></p>
            <div style={{fontFamily:"monospace",fontSize:"13px",color:t.ac,background:t.bgH,padding:"10px",borderRadius:"6px",marginTop:"6px"}}>PAO&#8322; = FiO&#8322;(P_atm &minus; P_H2O) &minus; (PaCO&#8322;/RQ)</div>
            <div style={{fontSize:"12px",color:t.tM,marginTop:"4px"}}>Alveolar Gas Equation &mdash; predicts maximum PaO&#8322;</div>
          </div>
        </div>
        <div style={{padding:"28px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${t.wn}`}}>
          <div style={{fontSize:"20px",color:t.wn,fontWeight:700,marginBottom:"6px"}}>Ventilation</div>
          <div style={{fontSize:"13px",color:t.tM,marginBottom:"14px"}}>Getting CO&#8322; OUT of the blood</div>
          <div style={{fontSize:"14px",color:t.t2,lineHeight:1.8}}>
            <p><strong style={{color:t.tx}}>Measured by:</strong> PaCO&#8322;, EtCO&#8322;</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Determinants:</strong> Minute ventilation (V&#7431; = Vt &times; RR), dead space fraction (Vd/Vt), alveolar ventilation = (Vt &minus; Vd) &times; RR</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Fix hypercarbia:</strong> Increase Vt or RR (increase minute ventilation). Decrease dead space. Note: PEEP does NOT directly improve ventilation.</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Key equation:</strong></p>
            <div style={{fontFamily:"monospace",fontSize:"13px",color:t.ac,background:t.bgH,padding:"10px",borderRadius:"6px",marginTop:"6px"}}>PaCO&#8322; = (VCO&#8322; &times; 0.863) / V&#7431;</div>
            <div style={{fontSize:"12px",color:t.tM,marginTop:"4px"}}>PaCO&#8322; is inversely proportional to alveolar ventilation</div>
          </div>
        </div>
      </div>

      <H title="P/F Ratio &mdash; Quantifying Oxygenation Failure" />
      <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.bd}`}}>
        <div style={{fontFamily:"monospace",fontSize:"18px",color:t.ac,fontWeight:700,textAlign:"center",marginBottom:"16px"}}>P/F = PaO&#8322; / FiO&#8322;</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px"}}>
          {[{label:"Normal",range:">400",color:t.ok,desc:"PaO2 80+ on RA"},{label:"Mild ARDS",range:"200–300",color:t.wn,desc:"Berlin criteria"},{label:"Moderate ARDS",range:"100–200",color:"#f97316",desc:"Consider prone"},{label:"Severe ARDS",range:"<100",color:t.dg,desc:"Prone, consider ECMO"}].map((pf,i)=>(
            <div key={i} style={{padding:"14px",background:t.bgH,borderRadius:"8px",textAlign:"center",borderTop:`3px solid ${pf.color}`}}>
              <div style={{fontSize:"12px",color:pf.color,fontWeight:600,marginBottom:"4px"}}>{pf.label}</div>
              <div style={{fontSize:"18px",color:t.tx,fontWeight:700}}>{pf.range}</div>
              <div style={{fontSize:"11px",color:t.tM,marginTop:"4px"}}>{pf.desc}</div>
            </div>))}
        </div>
      </div>

      <H title="Compliance & Resistance" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
        <div style={{padding:"20px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`}}>
          <div style={{color:t.ac,fontWeight:700,fontSize:"15px",marginBottom:"10px"}}>Static Compliance (Cstat)</div>
          <div style={{fontFamily:"monospace",color:t.ac,fontSize:"14px",background:t.bgH,padding:"8px",borderRadius:"6px",textAlign:"center",marginBottom:"10px"}}>Cstat = Vt / (Pplat &minus; PEEP)</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>Normal: 60&ndash;100 mL/cmH2O. Measures lung + chest wall elastic recoil. Decreased in: ARDS, pulmonary fibrosis, atelectasis, pneumothorax, chest wall rigidity, abdominal compartment syndrome.</div>
        </div>
        <div style={{padding:"20px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`}}>
          <div style={{color:t.wn,fontWeight:700,fontSize:"15px",marginBottom:"10px"}}>Dynamic Compliance (Cdyn)</div>
          <div style={{fontFamily:"monospace",color:t.wn,fontSize:"14px",background:t.bgH,padding:"8px",borderRadius:"6px",textAlign:"center",marginBottom:"10px"}}>Cdyn = Vt / (Ppeak &minus; PEEP)</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>Includes airway resistance component. Ppeak &minus; Pplat = resistive pressure (from ETT, bronchospasm, secretions). If Ppeak rises but Pplat stable: airway resistance problem. If both rise: compliance problem.</div>
        </div>
      </div>

      <H title="Dead Space vs. Shunt" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
        <div style={{padding:"20px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.wn}`}}>
          <div style={{color:t.wn,fontWeight:700,fontSize:"15px",marginBottom:"8px"}}>Dead Space (V/Q &rarr; &infin;)</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>Ventilated but NOT perfused. Wasted ventilation. CO2 elimination impaired. Causes: PE, low CO, overdistension, high PEEP. Anatomic (conducting airways ~150 mL) + alveolar (pathologic). Measured by Bohr equation. EtCO2-PaCO2 gradient widens.</div>
        </div>
        <div style={{padding:"20px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.bl}`}}>
          <div style={{color:t.bl,fontWeight:700,fontSize:"15px",marginBottom:"8px"}}>Shunt (V/Q &rarr; 0)</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>Perfused but NOT ventilated. Blood bypasses gas exchange. Oxygenation impaired. Does NOT respond to supplemental O2 (key distinction). Causes: atelectasis, consolidation, ARDS, intracardiac R-to-L shunt. Treatment: PEEP/recruitment, not FiO2.</div>
        </div>
      </div>
    </div>}

    {activeTab==="modes"&&<div>
      <H title="Ventilator Modes" />
      <B><p>Select a mode to see detailed settings, advantages, risks, and clinical application.</p></B>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"10px",margin:"16px 0 24px"}}>
        {Object.entries(modes).map(([k,m])=>(
          <button key={k} onClick={()=>setSelMode(selMode===k?null:k)} style={{padding:"16px",background:selMode===k?`${m.color}15`:t.bgC,borderRadius:"10px",border:selMode===k?`2px solid ${m.color}`:`1px solid ${t.bd}`,cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}>
            <div style={{fontSize:"14px",fontWeight:700,color:selMode===k?m.color:t.tx,marginBottom:"4px"}}>{m.name}</div>
            <div style={{fontSize:"11px",color:t.tM}}>{m.full}</div>
          </button>))}
      </div>
      {selMode&&modes[selMode]&&(()=>{const m=modes[selMode];return(
        <div style={{padding:"28px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${m.color}`,marginBottom:"20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px"}}>
            <div><div style={{fontSize:"20px",fontWeight:700,color:m.color}}>{m.name}</div><div style={{fontSize:"13px",color:t.tM}}>{m.full}</div></div>
            <button onClick={()=>setSelMode(null)} style={{background:t.bgS,border:"none",color:t.tM,cursor:"pointer",padding:"4px 10px",borderRadius:"4px",fontSize:"12px"}}>&#10005;</button>
          </div>
          {[{label:"How It Works",text:m.how,color:m.color},{label:"Trigger / Cycling",text:m.trigger,color:t.ac},{label:"Control Variable",text:m.control,color:t.bl},{label:"Advantages",text:m.advantage,color:t.ok},{label:"Risks / Limitations",text:m.risk,color:t.dg},{label:"Typical Settings",text:m.settings,color:t.wn}].map((s,i)=>(
            <div key={i} style={{marginBottom:"14px"}}>
              <div style={{fontSize:"12px",color:s.color,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"4px"}}>{s.label}</div>
              <p style={{color:t.t2,fontSize:"14px",lineHeight:1.8,margin:0}}>{s.text}</p>
            </div>))}
          <VentModeWaveform modeKey={selMode} modeColor={m.color} t={t} />
        </div>);})()}
      {!selMode&&<div style={{padding:"40px",textAlign:"center",color:t.tM,background:t.bgC,borderRadius:"12px",border:`1px dashed ${t.bd}`}}>Select a mode above to see detailed information</div>}
    </div>}

    {activeTab==="anesthesia"&&<div>
      <H title="Anesthesia Ventilation" />
      <B><p>Anesthesia circuits and ventilators differ significantly from ICU ventilators. Understanding these differences is high-yield for CRNA interviews.</p></B>

      <div style={{display:"grid",gap:"16px",marginTop:"20px"}}>
        <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${t.ac}`}}>
          <div style={{color:t.ac,fontSize:"17px",fontWeight:700,marginBottom:"12px"}}>Anesthesia Circle System</div>
          <div style={{color:t.t2,fontSize:"14px",lineHeight:1.8}}>
            <p>Closed/semi-closed circuit with CO2 absorber (soda lime). Unidirectional valves ensure gas flows: patient &rarr; expiratory limb &rarr; absorber &rarr; fresh gas &rarr; inspiratory limb &rarr; patient. Fresh gas flow (FGF) replaces consumed O2 and washed-out anesthetic. Low-flow anesthesia (FGF 0.5&ndash;1 L/min) conserves volatile agent and humidity but requires reliable agent monitoring.</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Soda lime exhaustion signs:</strong> Color change (indicator dye), rising inspired CO2 on capnography, tachycardia, hypertension, flushing. Compound A production with sevoflurane at low flows (clinically insignificant at FGF &ge;1 L/min).</p>
          </div>
        </div>
        <CircleSystemDiagram t={t} />

        <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${t.wn}`}}>
          <div style={{color:t.wn,fontSize:"17px",fontWeight:700,marginBottom:"12px"}}>Anesthesia vs. ICU Ventilator</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginTop:"12px"}}>
            {[{param:"Circuit",anes:"Circle system with CO2 absorber",icu:"Open circuit, no rebreathing"},{param:"FGF Dependency",anes:"Delivered Vt affected by FGF and circuit compliance",icu:"No FGF interaction"},{param:"Modes Available",anes:"VC, PC, PSV, PRVC (modern). Older: bellows only",icu:"Full spectrum including APRV, HFOV, NAVA"},{param:"PEEP",anes:"APL valve or electronic PEEP",icu:"Electronic PEEP with full range"},{param:"Monitoring",anes:"Agent analyzer, circle pressure, bellows movement",icu:"Advanced graphics, loops, esophageal manometry"},{param:"Humidification",anes:"Circle + low flow preserves humidity, HME",icu:"Active heated humidifier or HME"}].map((r,i)=>(
              <div key={i} style={{padding:"12px",background:t.bgH,borderRadius:"8px"}}>
                <div style={{fontSize:"11px",color:t.tM,textTransform:"uppercase",marginBottom:"6px"}}>{r.param}</div>
                <div style={{fontSize:"12px",marginBottom:"4px"}}><span style={{color:t.ac,fontWeight:600}}>Anesthesia:</span> <span style={{color:t.tx}}>{r.anes}</span></div>
                <div style={{fontSize:"12px"}}><span style={{color:t.wn,fontWeight:600}}>ICU:</span> <span style={{color:t.t2}}>{r.icu}</span></div>
              </div>))}
          </div>
        </div>

        <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${t.bl}`}}>
          <div style={{color:t.bl,fontSize:"17px",fontWeight:700,marginBottom:"12px"}}>Intraoperative Ventilation Strategy</div>
          <div style={{color:t.t2,fontSize:"14px",lineHeight:1.8}}>
            <p><strong style={{color:t.tx}}>Lung-protective ventilation in the OR</strong> is now standard of care, not just for ARDS patients. The IMPROVE trial (2013) and iPROVE network demonstrated that intraoperative protective ventilation reduces postoperative pulmonary complications.</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.ac}}>Standard OR settings:</strong> Vt 6&ndash;8 mL/kg IBW, PEEP 5&ndash;8 cmH2O, recruitment maneuvers q30&ndash;60 min (sustained inflation 30 cmH2O &times; 30 sec), FiO2 titrated to SpO2 (avoid unnecessary hyperoxia). Plateau pressure &lt;30 cmH2O. Driving pressure &lt;15 cmH2O.</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.wn}}>Driving pressure</strong> = Pplat &minus; PEEP. Emerging as the strongest predictor of postoperative pulmonary complications. Target &lt;15 cmH2O. Reflects the strain applied to functional lung tissue.</p>
          </div>
        </div>

        <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${t.pr}`}}>
          <div style={{color:t.pr,fontSize:"17px",fontWeight:700,marginBottom:"12px"}}>One-Lung Ventilation (OLV)</div>
          <div style={{color:t.t2,fontSize:"14px",lineHeight:1.8}}>
            <p>Used for thoracic surgery via double-lumen ETT (DLT) or bronchial blocker. Non-ventilated lung collapses for surgical access. Ventilated lung receives entire cardiac output worth of V/Q matching demand.</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>OLV management:</strong> Vt 4&ndash;6 mL/kg IBW (one lung!), RR titrate to PaCO2, PEEP 5&ndash;10 cmH2O to ventilated lung, FiO2 1.0 initially then titrate. Permissive hypercapnia acceptable. If SpO2 drops: CPAP 5&ndash;10 to operative lung, recruitment of dependent lung, partial ventilation of operative lung.</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.wn}}>Hypoxic Pulmonary Vasoconstriction (HPV):</strong> Intrinsic protective mechanism. Non-ventilated alveoli sense low PAO2 &rarr; local arteriolar constriction &rarr; diverts blood away from collapsed lung toward ventilated lung. Volatile anesthetics inhibit HPV in a dose-dependent manner (&gt;1 MAC). IV anesthesia (TIVA) preserves HPV.</p>
          </div>
        </div>
        <OLVDiagram t={t} />
      </div>
    </div>}

    {activeTab==="waveforms"&&<div>
      <H title="Ventilator Waveform Analysis" />
      <B><p>Waveform interpretation is a core ICU and anesthesia competency. The three primary waveforms are pressure-time, flow-time, and volume-time.</p></B>

      <div style={{display:"grid",gap:"16px",marginTop:"20px"}}>
        {[{title:"Pressure-Time Waveform",color:t.ac,content:[
          {label:"Volume Control",desc:"Square flow pattern creates a rising, linear pressure waveform. Ppeak reflects total inspiratory pressure (elastic + resistive). Inspiratory pause reveals Pplat (elastic only). Gap between Ppeak and Pplat = resistive pressure from ETT/airways."},
          {label:"Pressure Control",desc:"Square pressure waveform (constant pressure throughout inspiration). Decelerating flow as alveoli fill. Better gas distribution. Ppeak = set pressure + PEEP."},
          {label:"Auto-PEEP Detection",desc:"If expiratory flow doesn\u2019t return to zero before next breath, auto-PEEP (intrinsic PEEP) is present. Perform expiratory hold — total PEEP displayed. Auto-PEEP = total PEEP − set PEEP. Causes: high RR, long Ti, bronchospasm, secretions."}
        ]},{title:"Flow-Time Waveform",color:t.bl,content:[
          {label:"VC Pattern",desc:"Constant (square) inspiratory flow. Expiratory flow is passive and decelerating. Flow returns to baseline before next breath (no auto-PEEP) or doesn\u2019t (auto-PEEP present)."},
          {label:"PC Pattern",desc:"Decelerating inspiratory flow (high initial, tapers as pressure equilibrates). More physiologic gas distribution. Expiratory flow similar to VC."},
          {label:"Bronchospasm",desc:"Expiratory flow shows \u201Cscooped\u201D or concave pattern (slow emptying). Prolonged expiratory time. May not return to baseline before next breath → air trapping."}
        ]},{title:"Volume-Time Waveform",color:t.wn,content:[
          {label:"Normal",desc:"Linear rise during inspiration (constant flow) or curved rise (decelerating flow). Rapid drop during expiration. Exhaled Vt should equal inspired Vt — a leak shows as a gap."},
          {label:"Leak Detection",desc:"Inspired > expired volume. Causes: cuff leak, circuit disconnect, chest tube with bronchopleural fistula."}
        ]}].map((w,i)=>(
          <div key={i} style={{padding:"24px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${w.color}`}}>
            <div style={{color:w.color,fontSize:"17px",fontWeight:700,marginBottom:"16px"}}>{w.title}</div>
            {w.content.map((c,j)=>(
              <div key={j} style={{marginBottom:j<w.content.length-1?"14px":"0"}}>
                <div style={{fontSize:"13px",color:t.tx,fontWeight:600,marginBottom:"4px"}}>{c.label}</div>
                <p style={{color:t.t2,fontSize:"13px",lineHeight:1.7,margin:0}}>{c.desc}</p>
              </div>))}
          </div>))}
      </div>

      <H title="Pressure-Volume Loops" />
      <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.bd}`}}>
        <div style={{color:t.t2,fontSize:"14px",lineHeight:1.8}}>
          <p><strong style={{color:t.ac}}>Lower inflection point (LIP):</strong> Pressure at which alveolar recruitment begins. Set PEEP at or above LIP to prevent cyclic collapse (atelectrauma).</p>
          <p style={{marginTop:"10px"}}><strong style={{color:t.dg}}>Upper inflection point (UIP):</strong> Pressure at which overdistension begins. Keep Pplat below UIP to prevent volutrauma. Typically &lt;30 cmH2O.</p>
          <p style={{marginTop:"10px"}}><strong style={{color:t.wn}}>Hysteresis:</strong> Inflation and deflation limbs don\u2019t overlap — the lung requires less pressure to stay open than to open. This is why recruitment maneuvers work: once recruited at high pressure, alveoli stay open at lower PEEP.</p>
        </div>
      </div>
      <WaveformPatternSelector t={t} />
      <PVLoopDiagram t={t} />
    </div>}

    {activeTab==="management"&&<div>
      <H title="Initial Ventilator Settings" />
      <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.bd}`}}>
        <div style={{display:"grid",gap:"12px"}}>
          {[{param:"Mode",val:"AC/VC or AC/PC",note:"VC for guaranteed ventilation. PC if Ppeak >35 cmH2O"},{param:"Vt",val:"6–8 mL/kg IBW",note:"Use IDEAL body weight, not actual. IBW based on height and sex"},{param:"RR",val:"12–20 breaths/min",note:"Adjust to target PaCO2 35–45. Higher in metabolic acidosis"},{param:"FiO2",val:"Start 1.0, wean to <0.6",note:"O2 toxicity risk >0.6 for >24hr. Target SpO2 92–96%"},{param:"PEEP",val:"5 cmH2O minimum",note:"ARDS: use ARDSNet PEEP/FiO2 tables. Never 0 in intubated patients"},{param:"Flow Rate",val:"40–60 L/min (VC)",note:"Increase if flow-starved (concave pressure waveform)"},{param:"I:E Ratio",val:"1:2 to 1:3",note:"Longer expiration for obstructive disease. Inverse ratio for severe ARDS only"}].map((s,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"140px 180px 1fr",gap:"12px",padding:"10px",background:i%2===0?t.bgH:"transparent",borderRadius:"6px",alignItems:"center"}}>
              <div style={{fontSize:"14px",color:t.ac,fontWeight:600}}>{s.param}</div>
              <div style={{fontSize:"14px",color:t.tx,fontWeight:700}}>{s.val}</div>
              <div style={{fontSize:"12px",color:t.t2}}>{s.note}</div>
            </div>))}
        </div>
      </div>

      <H title="IBW Calculation" />
      <div style={{padding:"20px",background:t.bgC,borderRadius:"12px",border:`2px solid ${t.wn}`}}>
        <div style={{color:t.wn,fontWeight:700,marginBottom:"10px"}}>ALWAYS use Ideal Body Weight for Vt calculation</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
          <div style={{fontFamily:"monospace",fontSize:"14px",color:t.ac,background:t.bgH,padding:"12px",borderRadius:"8px"}}>Male IBW = 50 + 2.3 &times; (height_in &minus; 60)</div>
          <div style={{fontFamily:"monospace",fontSize:"14px",color:t.ac,background:t.bgH,padding:"12px",borderRadius:"8px"}}>Female IBW = 45.5 + 2.3 &times; (height_in &minus; 60)</div>
        </div>
        <p style={{color:t.t2,fontSize:"13px",marginTop:"10px"}}>A 5&rsquo;4&rdquo; female: IBW = 45.5 + 2.3(64&minus;60) = 54.7 kg. Vt at 6 mL/kg = 328 mL. A common error: using actual weight of 95 kg &rarr; Vt 570 mL = volutrauma.</p>
      </div>
      <IBWCalculator t={t} />

      <H title="Troubleshooting High Pressures" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginTop:"16px"}}>
        <div style={{padding:"20px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.dg}`}}>
          <div style={{color:t.dg,fontWeight:700,fontSize:"15px",marginBottom:"10px"}}>High Ppeak + Normal Pplat</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>= Airway RESISTANCE problem. Ppeak &minus; Pplat &gt;10 cmH2O.</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7,marginTop:"8px"}}>Causes: bronchospasm, secretions, mucus plug, kinked ETT, biting ETT, small ETT, circuit obstruction. Treatment: suction, bronchodilators, check circuit, bite block.</div>
        </div>
        <div style={{padding:"20px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.wn}`}}>
          <div style={{color:t.wn,fontWeight:700,fontSize:"15px",marginBottom:"10px"}}>High Ppeak + High Pplat</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>= COMPLIANCE problem. Pplat &gt;30 cmH2O.</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7,marginTop:"8px"}}>Causes: ARDS, pneumothorax, mainstem intubation, pulmonary edema, atelectasis, abdominal distension, chest wall rigidity, obesity. Treatment: reduce Vt, treat underlying cause, consider PC mode.</div>
        </div>
      </div>
      <PressureTroubleshooter t={t} />

      <H title="ARDSNet Protocol" />
      <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.bd}`}}>
        <div style={{color:t.ac,fontWeight:700,fontSize:"16px",marginBottom:"12px"}}>Low Tidal Volume Ventilation (LTVV)</div>
        <div style={{color:t.t2,fontSize:"14px",lineHeight:1.8}}>
          <p>The ARMA trial (2000, NEJM) showed 22% mortality reduction with 6 mL/kg IBW vs. 12 mL/kg. This is one of the most important ventilator trials ever conducted and is expected knowledge for CRNA interviews.</p>
          <div style={{padding:"14px",background:t.bgH,borderRadius:"8px",margin:"12px 0"}}>
            <p style={{margin:"0 0 6px"}}><strong style={{color:t.ac}}>Vt:</strong> 6 mL/kg IBW (range 4&ndash;8)</p>
            <p style={{margin:"0 0 6px"}}><strong style={{color:t.ac}}>Pplat target:</strong> &le;30 cmH2O. If &gt;30, decrease Vt to 5 then 4 mL/kg</p>
            <p style={{margin:"0 0 6px"}}><strong style={{color:t.ac}}>pH target:</strong> 7.30&ndash;7.45. Permissive hypercapnia acceptable</p>
            <p style={{margin:"0 0 6px"}}><strong style={{color:t.ac}}>SpO2 target:</strong> 88&ndash;95%</p>
            <p style={{margin:0}}><strong style={{color:t.ac}}>PEEP/FiO2:</strong> Use ARDSNet tables (low or high PEEP strategy)</p>
          </div>
        </div>
      </div>
    </div>}

    {activeTab==="pearls"&&<div>
      <H title="Ventilator Clinical Pearls" />
      <Pl number={1} title="Ppeak vs. Pplat Is THE Bedside Diagnostic">Ppeak = resistive + elastic pressure. Pplat = elastic only (measured during inspiratory hold with zero flow). The gap between them IS the airway resistance component. This single maneuver guides your differential: bronchospasm vs. ARDS vs. pneumothorax.</Pl>
      <Pl number={2} title="PEEP Fixes Oxygenation, Not Ventilation">PEEP recruits collapsed alveoli, increases FRC, improves V/Q matching, and shifts the P-V curve left. It does NOT directly improve CO2 clearance. If PaCO2 is high, increase RR or Vt &mdash; not PEEP. PEEP can actually INCREASE dead space if overdistension occurs.</Pl>
      <Pl number={3} title="Driving Pressure May Be the Best Predictor">Driving pressure = Pplat &minus; PEEP. Reflects strain on functional lung. Amato (2015, NEJM): driving pressure was the ventilation variable most strongly associated with survival in ARDS. Target &lt;15 cmH2O. This may be more important than Vt or PEEP individually.</Pl>
      <Pl number={4} title="Auto-PEEP Is Silent and Dangerous">Unrecognized auto-PEEP causes hemodynamic compromise (decreased venous return), increased WOB, patient-ventilator dyssynchrony, and inaccurate compliance calculations. Diagnose: expiratory hold maneuver, flow-time waveform (flow doesn&rsquo;t reach zero). Treat: decrease RR, decrease I:E ratio, bronchodilators, increase expiratory time.</Pl>
      <Pl number={5} title="IBW Errors Kill People">A 5&rsquo;2&rdquo; patient weighing 120 kg has an IBW of ~50 kg. Vt at 6 mL/kg IBW = 300 mL. Using actual weight gives 720 mL = guaranteed volutrauma. Always calculate IBW from HEIGHT, not weight. This is the most common and most dangerous ventilator error.</Pl>
      <Pl number={6} title="SBT Criteria">Ready for spontaneous breathing trial when: FiO2 &le;0.4, PEEP &le;8, patient triggers breaths, adequate cough/gag, hemodynamically stable, no high-dose vasopressors, minimal sedation. SBT: PS 5&ndash;8 / PEEP 5 for 30&ndash;120 min. RSBI = RR/Vt(L) &lt;105 predicts successful extubation.</Pl>
      <Pl number={7} title="Volatile Agents and HPV">All volatile anesthetics inhibit hypoxic pulmonary vasoconstriction dose-dependently. At 1 MAC, inhibition is ~20%. At 2 MAC, significant. This matters during OLV &mdash; higher volatile concentrations worsen shunt. TIVA preserves HPV. IV agents (propofol, opioids, ketamine) do not inhibit HPV.</Pl>
    </div>}

    {activeTab==="interview"&&<div>
      <H title="Interview Angles" />
      <div style={{display:"grid",gap:"16px",marginTop:"16px"}}>
        {[{q:"Patient intubated for ARDS, Ppeak 42, Pplat 34. What do you do?",a:"Both pressures are elevated, so this is a compliance problem (not resistance). Pplat >30 violates ARDSNet protocol. Reduce Vt to 5 then 4 mL/kg IBW until Pplat ≤30. Accept permissive hypercapnia (pH >7.25). Optimize PEEP using ARDSNet table or driving pressure approach. If Pplat was normal with high Ppeak, that\u2019s resistance — suction, bronchodilators, check ETT.",f:"What if pH drops to 7.18 with low Vt? How do you calculate driving pressure?"},{q:"Explain the difference between oxygenation and ventilation.",a:"Oxygenation = getting O2 into blood. Measured by PaO2/SpO2. Determined by FiO2, PEEP, mean airway pressure, V/Q matching, shunt. Fix with FiO2 and PEEP. Ventilation = removing CO2. Measured by PaCO2/EtCO2. Determined by minute ventilation (Vt × RR) and dead space. Fix with RR and Vt. They are independent — a patient can be well-oxygenated but hypoventilating, or vice versa.",f:"Shunt vs. dead space — which responds to supplemental O2?"},{q:"You\u2019re doing a right thoracotomy. SpO2 drops to 88% during OLV. Management?",a:"Systematic approach: (1) Confirm DLT position with fiberoptic bronchoscopy. (2) Increase FiO2 to 1.0. (3) Recruitment maneuver to dependent lung. (4) Apply CPAP 5–10 to operative lung. (5) Ensure adequate Vt (4–6 mL/kg) and PEEP (5–10) to dependent lung. (6) Consider TIVA — volatile agents inhibit HPV dose-dependently. (7) If persistent, intermittent two-lung ventilation or surgeon clamps PA.",f:"How do volatile agents affect HPV? Why is TIVA preferred?"},{q:"Your patient is on AC/VC 500/16. They\u2019re uncomfortable, fighting the vent. What\u2019s happening?",a:"Likely patient-ventilator dyssynchrony. Common in VC when set flow rate doesn\u2019t match patient demand (flow starvation — look for concave pressure waveform). Options: (1) Increase flow rate. (2) Switch to PC mode (decelerating flow matches patient demand). (3) Assess for auto-PEEP (check expiratory flow). (4) Evaluate sedation/pain. (5) Rule out new pathology: pneumothorax, mucus plug, agitation.",f:"How would you differentiate flow starvation from auto-PEEP on waveforms?"},{q:"How do you set up lung-protective ventilation in the OR?",a:"IMPROVE trial framework: Vt 6–8 mL/kg IBW (always ideal body weight from height), PEEP 5–8 cmH2O, recruitment maneuvers q30–60 min (30 cmH2O × 30 sec), FiO2 titrated to avoid hyperoxia, keep driving pressure <15 cmH2O and Pplat <30. This reduces postoperative pulmonary complications by ~50%. Same principles as ICU but often underutilized in OR.",f:"What is driving pressure and why might it matter more than Vt?"}].map((item,i)=>(
          <div key={i} style={{padding:"22px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.bd}`}}>
            <div style={{fontSize:"15px",color:t.tx,fontWeight:600,marginBottom:"14px",lineHeight:1.6}}><span style={{color:t.wn,marginRight:"8px"}}>Q{i+1}:</span>{item.q}</div>
            <div style={{marginBottom:"14px"}}><span style={{display:"inline-block",background:t.aD,color:t.ac,padding:"2px 10px",borderRadius:"12px",fontSize:"11px",fontWeight:600,marginBottom:"8px"}}>Strong Answer</span><p style={{color:t.t2,fontSize:"14px",lineHeight:1.8,margin:0}}>{item.a}</p></div>
            <div style={{padding:"10px 14px",background:t.bgH,borderRadius:"8px",borderLeft:`3px solid ${t.wn}`}}><span style={{color:t.wn,fontSize:"12px",fontWeight:600}}>Follow-up: </span><span style={{color:t.t2,fontSize:"13px"}}>{item.f}</span></div>
          </div>))}
      </div>
    </div>}

    </div>
  </div>);
}
