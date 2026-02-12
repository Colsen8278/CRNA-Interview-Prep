import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// â”€â”€ THEMES â”€â”€
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

// â”€â”€ DOWNLOAD: PDF â”€â”€
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
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title} â€” CRNA Prep</title><style>${css}</style></head><body>
<h1>${title}</h1><div class="sub">CRNA Interview Prep Study Sheet &bull; ${new Date().toLocaleDateString()}</div>
${sections.map(s => `<h2>${s.t}</h2><div>${s.c}</div>`).join("")}
<div class="ft">Generated from CRNA Prep Study Platform &bull; Open this file in a browser and use Print â†’ Save as PDF</div>
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

// â”€â”€ DOWNLOAD: Diagram Image â”€â”€
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

// â”€â”€ STUDY DATA â”€â”€
const MEDS = [{
  id: "propofol", name: "Propofol", brand: "Diprivan",
  tags: ["Sedative-Hypnotic", "GABA-A Agonist", "Alkylphenol", "IV Anesthetic"],
  systems: ["neuro", "pharm"], type: "medication",
  ov: { "Drug Class": "Alkylphenol sedative-hypnotic", "Primary Target": "GABA-A receptor (Î²-subunit)", "Action": "Positive allosteric modulator + direct agonist", "Ion Channel": "Clâ» channel â†’ hyperpolarization", "Formulation": "1% lipid emulsion (10 mg/mL)", "Schedule": "Not federally scheduled" },
  moa: `Propofol (2,6-diisopropylphenol) acts primarily through positive allosteric modulation of the GABA-A receptor â€” the major inhibitory ligand-gated chloride ion channel in the CNS. It binds to the Î²-subunit at the TM2/TM3 transmembrane domains, distinct from the GABA binding site (Î±-Î² interface).

At lower concentrations, propofol potentiates endogenous GABA by increasing the duration of chloride channel opening â€” prolonged Clâ» influx produces greater postsynaptic hyperpolarization.

At higher (induction) concentrations, propofol directly gates the GABA-A chloride channel even without GABA â€” forcing the channel open independently for rapid, profound CNS depression.

Net effect: widespread neuronal hyperpolarization (âˆ’70 mV â†’ âˆ’85 mV), making neurons far less likely to fire. This produces sedation, amnesia, anxiolysis, and general anesthesia.

Secondary mechanisms: NMDA receptor inhibition, voltage-gated Naâº channel modulation, slow CaÂ²âº channel inhibition â€” contributing to neuroprotection, reduced CMROâ‚‚, and decreased ICP.`,
  recPhys: `The GABA-A receptor is a pentameric ligand-gated ion channel (ionotropic) â€” five subunits (2Î±, 2Î², 1Î³) around a central Clâ» pore. Ionotropic = direct coupling of binding to ion flow (no second messengers) = rapid onset.

Step 1 â€” Drug Binding: Propofol binds hydrophobic pockets in Î²-subunit TM2/TM3. Extreme lipophilicity (oil:water ~4500:1) enables rapid BBB crossing.

Step 2 â€” Conformational Change: Stabilizes channel open state. Allosteric: â†‘ mean open time when GABA binds. Direct-gating: opens pore without GABA.

Step 3 â€” Clâ» Influx: Clâ» flows inward down electrochemical gradient, driving membrane potential from âˆ’70 mV toward âˆ’80 to âˆ’90 mV.

Step 4 â€” Hyperpolarization: Neuron needs substantially larger excitatory input to reach threshold (âˆ’55 mV). Billions of neurons simultaneously = global CNS depression.

KEY DISTINCTION: Propofol/barbiturates â†‘ Clâ» channel open DURATION + can directly gate. Benzodiazepines â†‘ opening FREQUENCY + require GABA (no direct gating). Classic interview question.`,
  dosing: [
    { ind: "Induction", dose: "1.5â€“2.5 mg/kg IV", notes: "Over 20â€“30 sec. Reduce 25â€“50% in elderly/unstable/ASA IIIâ€“IV.", clr: "ac" },
    { ind: "ICU Sedation", dose: "5â€“50 mcg/kg/min", notes: "Start 5â€“10, titrate to RASS. Trigs q48h. PRIS risk >70 mcg/kg/min or >48h.", clr: "wn" },
    { ind: "Procedural Sedation", dose: "0.5â€“1.0 mg/kg â†’ 25â€“75 mcg/kg/min", notes: "Titrate 10â€“20 mg q30â€“60 sec. Airway equipment ready.", clr: "pr" },
    { ind: "TIVA", dose: "100â€“200 mcg/kg/min", notes: "With remifentanil. Favorable context-sensitive half-time.", clr: "pk" },
  ],
  kin: { onset: "15â€“30 sec", onsetD: "One arm-brain circulation time", peak: "1â€“2 min", peakD: "Full effect within 90 sec", dur: "5â€“10 min (bolus)", durD: "Redistribution, NOT metabolism", vd: "2â€“10 L/kg", pb: "97â€“99%", hl: "4â€“12h terminal", csht: "~25 min (3h infusion)", cl: "20â€“30 mL/kg/min", model: "Three-compartment" },
  metab: `Primary: hepatic conjugation (glucuronidation/sulfation) via UGT1A9 and CYP2B6. All metabolites inactive, renally excreted.

Critical: clearance (20â€“30 mL/kg/min) EXCEEDS hepatic blood flow (~21 mL/kg/min) â†’ extrahepatic metabolism (lungs ~30%, kidneys). Clearance preserved in hepatic dysfunction.

88% excreted in urine as metabolites within 5 days. <0.3% unchanged.

Elderly: â†“Vd, â†“clearance, â†‘sensitivity â†’ reduce 25â€“50%. Hepatic impairment: modest effect. Renal: no adjustment. Pediatrics: higher Vd/clearance per-kg, higher PRIS risk.`,
  warn: [
    { tp: "bb", ti: "Propofol Infusion Syndrome (PRIS)", tx: "Prolonged (>48h) high-dose (>70 mcg/kg/min): metabolic acidosis, rhabdomyolysis, hyperK, cardiac failure â†’ asystole. Impaired mitochondrial fatty acid oxidation. Mortality 30â€“80%." },
    { tp: "bb", ti: "Pediatric ICU Sedation", tx: "Not FDA-approved. Multiple pediatric deaths reported." },
    { tp: "ci", ti: "Absolute Contraindications", tx: "Hypersensitivity to propofol, eggs, soybeans." },
    { tp: "cau", ti: "Hemodynamic Depression", tx: "â†“SVR 15â€“40% + myocardial depression. Blunted baroreflex." },
    { tp: "cau", ti: "Respiratory Depression", tx: "Apnea 30â€“90 sec at induction. â†“ response to hypoxia and hypercarbia." },
  ],
  ix: [
    { dr: "Opioids", ef: "Synergistic respiratory depression + hypotension. Reduce propofol 25â€“50%.", sv: "high" },
    { dr: "Benzodiazepines", ef: "Additive CNS/respiratory depression.", sv: "high" },
    { dr: "Vasopressors", ef: "May need â†‘ support for vasodilation.", sv: "mod" },
  ],
  pearls: [
    { ti: "Why propofol?", tx: "Best recovery profile â€” rapid, clear-headed, antiemetic. â†“ICP/CMROâ‚‚. Trade-off: hemodynamic depression." },
    { ti: "Antiemetic", tx: "Active at subhypnotic doses (10â€“20 mg). D2 antagonism in CTZ. TIVA < PONV vs. volatiles." },
    { ti: "ICP effects", tx: "â†“CMROâ‚‚/CBF/ICP via flow-metabolism coupling. Watch CPP = MAPâˆ’ICP." },
    { ti: "Injection pain", tx: "28â€“90%. Mitigate: large vein, lidocaine 20â€“40 mg pretreat or mix 20 mg/200 mg propofol." },
    { ti: "No analgesia", tx: "Zero. Always pair with analgesics (eCASH/PADIS)." },
    { ti: "Green urine", tx: "Quinol metabolites â€” benign. Reassurance, not workup." },
  ],
  intQs: [
    { q: "MAP drops to 52 after induction?", a: "Phenylephrine 100â€“200 mcg IV. Volume. Ephedrine 5â€“10 mg if HR low." },
    { q: "Propofol vs etomidate in trauma?", a: "Etomidate: hemodynamically neutral. Trade-off: adrenal suppression (11Î²-hydroxylase)." },
    { q: "ICU patient: unexplained acidosis + rising CK?", a: "PRIS. Stop propofol, switch sedative, check trigs/lactate/CK." },
  ],
},{
  id: "norepinephrine", name: "Norepinephrine", brand: "Levophed",
  tags: ["Vasopressor", "Catecholamine", "Î±â‚/Î²â‚ Agonist", "Sympathomimetic"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Endogenous catecholamine / direct-acting sympathomimetic", "Primary Targets": "Î±â‚ > Î±â‚‚ > Î²â‚ >> Î²â‚‚ adrenergic receptors", "Action": "Full agonist at Î±â‚ and Î²â‚; negligible Î²â‚‚", "Net Effect": "â†‘SVR (vasoconstriction) + preserved CO (inotropy) Â± reflex â†“HR", "Formulation": "4 mg/4 mL concentrate â†’ dilute in D5W", "First-Line": "Septic shock (SSC 2021 â€” strong recommendation)" },
  moa: `Norepinephrine is an endogenous catecholamine and direct-acting sympathomimetic with the receptor affinity hierarchy Î±â‚‚ > Î±â‚ > Î²â‚ >> Î²â‚‚. This profile delivers potent vasoconstriction with cardiac output preservation â€” the ideal hemodynamic response for distributive shock.

At the Î±â‚ receptor (Gq-coupled), NE activates PLC â†’ IPâ‚ƒ + DAG â†’ intracellular CaÂ²âº release from SR + PKC activation â†’ MLCK-mediated smooth muscle contraction â†’ vasoconstriction. Vascular beds most affected: splanchnic > cutaneous > renal > skeletal muscle. Cerebral circulation is relatively protected by autoregulation.

At the Î²â‚ receptor (Gs-coupled), NE activates adenylyl cyclase â†’ â†‘cAMP â†’ PKA â†’ phosphorylation of L-type CaÂ²âº channels (â†‘CaÂ²âº influx = inotropy), RyR2 (enhanced CICR), and phospholamban (faster relaxation = lusitropy). Direct chronotropic effect via If/HCN channels in SA node.

THE BARORECEPTOR PARADOX: NE's dominant Î±â‚ effect raises MAP â†’ carotid/aortic baroreceptors â†’ â†‘vagal tone â†’ REFLEX BRADYCARDIA offsets the direct Î²â‚ chronotropic effect. Net HR often stays the same or decreases. This fundamentally distinguishes NE from epinephrine and dobutamine, which reliably increase HR.

NE has ~10-fold selectivity for Î²â‚ over Î²â‚‚ (Xu et al., Cell Research 2021). The structural basis: identical orthosteric binding pockets but different extracellular vestibule entry pathways â€” NE (lacking epinephrine's N-methyl group) enters Î²â‚ 30â€“60Ã— faster than Î²â‚‚.`,
  recPhys: `Î±â‚ PATHWAY (Gq â†’ PLC â†’ IPâ‚ƒ/DAG):
Step 1 â€” NE binds postsynaptic Î±â‚ receptor â†’ Gq/Gâ‚â‚ protein activates phospholipase C (PLC).
Step 2 â€” PLC cleaves PIPâ‚‚ â†’ IPâ‚ƒ + DAG. IPâ‚ƒ binds SR receptors â†’ CaÂ²âº floods cytoplasm.
Step 3 â€” DAG activates PKC â†’ sensitizes contractile apparatus to CaÂ²âº, inhibits KATP channels â†’ depolarization â†’ additional CaÂ²âº entry via L-type channels.
Step 4 â€” CaÂ²âº-calmodulin â†’ MLCK â†’ phosphorylates myosin light chains â†’ smooth muscle contraction â†’ VASOCONSTRICTION.

Î²â‚ PATHWAY (Gs â†’ adenylyl cyclase â†’ cAMP):
Step 1 â€” NE binds cardiac Î²â‚ â†’ Gs activates adenylyl cyclase â†’ â†‘cAMP â†’ PKA.
Step 2 â€” PKA phosphorylates: (a) L-type CaÂ²âº channels â†’ â†‘CaÂ²âº influx = INOTROPY; (b) RyR2 â†’ enhanced CaÂ²âº-induced CaÂ²âº release; (c) phospholamban â†’ disinhibits SERCA2a â†’ faster CaÂ²âº reuptake = LUSITROPY; (d) If/HCN channels â†’ faster phase 4 depolarization = CHRONOTROPY.

Î±â‚‚ PRESYNAPTIC BRAKE (Gi â†’ â†“cAMP):
NE simultaneously activates Î±â‚‚ autoreceptors on presynaptic nerve terminals â†’ Gi inhibits adenylyl cyclase â†’ â†“cAMP â†’ GÎ²Î³ opens GIRK Kâº channels â†’ hyperpolarization â†’ NEGATIVE FEEDBACK limiting further NE release. This self-limiting mechanism prevents runaway sympathetic activation. Same target as clonidine/dexmedetomidine.

KEY COMPARISONS:
â€¢ vs. EPINEPHRINE: Epi has equipotent Î²â‚‚ â†’ dose-dependent vasodilation (low dose), bronchodilation, more tachycardia/arrhythmias, lactic acidosis. NE has no biphasic behavior.
â€¢ vs. VASOPRESSIN: Non-adrenergic (Vâ‚a/Gq pathway). Maintains function in acidosis. No inotropy/chronotropy. Preferential EFFERENT arteriolar constriction (may preserve GFR). Also inhibits KATP channels directly.
â€¢ vs. PHENYLEPHRINE: Pure Î±â‚ only â€” raises SVR but may â†“CO (no Î²â‚ support). Reflex bradycardia without compensatory inotropy.`,
  dosing: [
    { ind: "Septic Shock (1st-line)", dose: "0.05â€“0.1 mcg/kg/min start â†’ titrate to MAP â‰¥65", notes: "FDA label: 8â€“12 mcg/min start. Titrate q5-15 min by 0.05â€“0.1 mcg/kg/min. Add vasopressin at 0.25â€“0.5 mcg/kg/min.", clr: "ac" },
    { ind: "Maintenance Range", dose: "0.01â€“0.3 mcg/kg/min", notes: "High-dose/refractory: up to 1 mcg/kg/min. Max reported ~3 mcg/kg/min (rare).", clr: "bl" },
    { ind: "Cardiogenic Shock", dose: "0.01â€“0.3 mcg/kg/min", notes: "Lower doses. Combine with inotrope (dobutamine 2â€“20 mcg/kg/min). Avoid escalating NE alone â€” worsens afterload.", clr: "wn" },
    { ind: "Intraoperative (EPON protocol)", dose: "0.02â€“0.1 mcg/kg/min", notes: "Prophylactic from induction. EPON trial: â†“complications 44% vs 58% (P=0.004).", clr: "pr" },
    { ind: "Spinal Hypotension (OB)", dose: "0.05 mcg/kg/min infusion", notes: "Bolus: 4â€“8 mcg (ED90 â‰ˆ 6 mcg). 1 mcg NE â‰ˆ 10â€“12.5 mcg phenylephrine.", clr: "pk" },
  ],
  kin: { onset: "1â€“2 min", onsetD: "Rapid â€” ideal for acute hemodynamic rescue", peak: "1â€“2 min", peakD: "Steady-state plasma level ~5 min", dur: "1â€“2 min after stopping", durD: "Context-INSENSITIVE â€” offset independent of infusion duration", vd: "Not applicable (continuous infusion only)", pb: "~25%", hl: "2.4 min", csht: "N/A â€” does not accumulate", cl: "Enzymatic (COMT/MAO) + neuronal reuptake", model: "Rapid clearance, no redistribution" },
  metab: `Primary termination: NEURONAL REUPTAKE (Uptake-1) into sympathetic nerve terminals â€” the dominant mechanism. This is the target blocked by TCAs and cocaine.

Enzymatic metabolism:
(1) COMT (catechol-O-methyltransferase) â†’ normetanephrine (in liver, kidneys, extraneuronal tissue)
(2) MAO-A (monoamine oxidase) â†’ DHPG (on mitochondrial membranes within nerve terminals)
Both pathways converge â†’ VMA (vanillylmandelic acid) â†’ renally excreted as sulfate/glucuronide conjugates. VMA = the metabolite measured in pheochromocytoma screening.

ZERO CYP450 involvement â€” three clinical implications:
(1) No CYP-mediated drug interactions (unaffected by inhibitors/inducers)
(2) Predictable PK even in polypharmacy
(3) NO dose adjustment for hepatic or renal impairment

In multi-organ dysfunction, NE pharmacokinetics remain remarkably reliable because metabolism is distributed across multiple organ systems via non-CYP enzymes.`,
  warn: [
    { tp: "bb", ti: "Extravasation â†’ Tissue Necrosis", tx: "Intense Î±â‚ vasoconstriction â†’ ischemia â†’ necrosis â†’ gangrene. RESCUE: Phentolamine 5â€“10 mg in 10â€“15 mL NS, infiltrate SC with 25G needle throughout ischemic area. Most effective within 12h. May repeat. Warm compresses (NOT cold)." },
    { tp: "ci", ti: "Mesenteric/Peripheral Vascular Disease", tx: "Use with extreme caution â€” â†‘risk digital ischemia, bowel ischemia. Monitor lactate, abdominal exam, extremity perfusion." },
    { tp: "cau", ti: "MAOI Interaction (CRITICAL)", tx: "MAOIs (phenelzine, tranylcypromine, LINEZOLID) block MAO â†’ impaired NE degradation â†’ SEVERE prolonged hypertensive crisis. Most dangerous interaction." },
    { tp: "cau", ti: "TCA Interaction", tx: "Block norepinephrine transporter (NET) â€” primary termination mechanism. Dramatically amplifies/prolongs NE effect â†’ severe sustained hypertension." },
    { tp: "cau", ti: "Dilution Requirement", tx: "Must dilute in D5W (dextrose-containing solutions). NE undergoes oxidation in saline-only solutions per FDA labeling." },
  ],
  ix: [
    { dr: "MAOIs / Linezolid", ef: "Blocked MAO degradation â†’ severe prolonged hypertensive crisis. Most dangerous interaction.", sv: "high" },
    { dr: "TCAs", ef: "Block neuronal reuptake (Uptake-1) â†’ amplified/prolonged pressor response.", sv: "high" },
    { dr: "Non-selective Î²-blockers", ef: "Propranolol blocks Î²â‚ compensation â†’ unopposed Î±â‚ â†’ severe HTN + reflex bradycardia.", sv: "high" },
    { dr: "Halogenated Anesthetics", ef: "Myocardial sensitization to catecholamines. Lower risk with modern agents (sevo/des/iso) vs halothane.", sv: "mod" },
    { dr: "Vasopressin", ef: "Synergistic vasopression. Allows NE dose reduction (catecholamine-sparing). SSC 2021: add at NE 0.25â€“0.5 mcg/kg/min.", sv: "low" },
  ],
  pearls: [
    { ti: "Why NE over dopamine?", tx: "SOAP II (NEJM 2010, n=1679): Dopamine â†’ 2Ã— arrhythmia rate (24% vs 12%). Higher mortality in cardiogenic shock subgroup. NE is safer across all shock subtypes." },
    { ti: "NE + Vasopressin (VASST/VANISH)", tx: "VASST: add VP at NE â‰¥5 mcg/min â†’ NE-sparing, possible benefit in less severe shock. VANISH: VP â†“ need for RRT (25% vs 35%). VP works in acidosis when adrenergic receptors fail." },
    { ti: "MAP target (SEPSISPAM)", tx: "65â€“70 mmHg standard. Chronic HTN patients: 80â€“85 â†’ â†“RRT need (32% vs 42%) but â†‘afib. Individualize." },
    { ti: "Peripheral IV is safe", tx: "Yerke et al. (CHEST 2024, n=635): extravasation 5.5%, zero surgical interventions. 51.6% never needed CVC. Use â‰¥18G in antecubital fossa or above." },
    { ti: "Intraoperative paradigm shift", tx: "EPON trial (2025): prophylactic NE from induction â†’ 44% vs 58% complications. NE maintains CO better than phenylephrine (pure Î±â‚)." },
    { ti: "SSC 2021 Vasopressor Hierarchy", tx: "1) NE first-line â†’ 2) Add vasopressin at 0.25â€“0.5 mcg/kg/min â†’ 3) Add epinephrine â†’ 4) Dobutamine for cardiac dysfunction â†’ 5) Hydrocortisone if NE â‰¥0.25 for â‰¥4h." },
  ],
  intQs: [
    { q: "Septic shock, MAP 52 on 30L crystalloid. Next step?", a: "Start NE 0.05â€“0.1 mcg/kg/min. Titrate q5-15 min to MAP â‰¥65. Don't delay pressors for more fluid." },
    { q: "Patient on NE 0.4 mcg/kg/min, still MAP 58?", a: "Add vasopressin 0.03â€“0.04 U/min (SSC 2021 threshold: 0.25â€“0.5 mcg/kg/min). Consider hydrocortisone 200 mg/day." },
    { q: "NE extravasates into forearm. What do you do?", a: "Stop infusion. Infiltrate phentolamine 5â€“10 mg in 10â€“15 mL NS subcutaneously throughout ischemic area with 25G needle within 12h. Warm compresses. Restart NE at new proximal site." },
    { q: "Why NE over phenylephrine intraop?", a: "Phenylephrine (pure Î±â‚) raises SVR but â†“CO via reflex bradycardia without Î²â‚ compensation. NE's Î²â‚ activity preserves CO while supporting BP. EPON trial and POQI 2024 consensus support NE." },
  ],
},{
  id: "vasopressin", name: "Vasopressin (AVP)", brand: "Vasostrict",
  tags: ["Vasopressor", "Non-Catecholamine", "Vâ‚/Vâ‚‚ Agonist", "Antidiuretic Hormone"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Endogenous nonapeptide / non-catecholamine vasopressor", "Primary Targets": "Vâ‚a (vascular) > Vâ‚b (pituitary) > Vâ‚‚ (renal)", "Action": "Full agonist â€” non-adrenergic vasoconstriction + antidiuresis", "Net Effect": "â†‘SVR (adrenergic-independent) + preserved renal perfusion + NO Î²-adrenergic effects", "Formulation": "20 units/mL â€” dilute prior to infusion", "Role": "2nd-line vasopressor in septic shock (SSC 2021); catecholamine-sparing" },
  moa: `Vasopressin (arginine vasopressin, AVP, ADH) is an endogenous nonapeptide hormone synthesized in the supraoptic and paraventricular nuclei of the hypothalamus, stored in the posterior pituitary, and released in response to hyperosmolality, hypovolemia, and hypotension.

It acts on three distinct G-protein coupled receptor subtypes â€” Vâ‚a, Vâ‚b, and Vâ‚‚ â€” each mediating different physiologic effects through different G-protein cascades. Critically, vasopressin's vasoconstrictor mechanism is COMPLETELY INDEPENDENT of adrenergic receptors. This is the key clinical advantage: it works when catecholamines fail.

In vasodilatory shock, vasopressin restores vascular tone through FOUR mechanisms:

1. Vâ‚a receptor activation (Gq â†’ PLC â†’ IPâ‚ƒ/DAG â†’ â†‘CaÂ²âº â†’ smooth muscle contraction) â€” the primary vasoconstrictor pathway. Identical downstream cascade to Î±â‚ but via a different receptor.

2. KATP channel closure â€” In septic shock, hypoxia and acidosis activate ATP-sensitive Kâº channels (KATP) â†’ Kâº efflux â†’ hyperpolarization â†’ voltage-gated CaÂ²âº channels remain closed â†’ vasoplegia (catecholamine resistance). Vasopressin closes KATP channels via PKC, restoring the ability of CaÂ²âº channels to open. This directly explains why vasopressin works in acidotic, catecholamine-resistant shock.

3. NO modulation â€” Vasopressin inhibits inducible nitric oxide synthase (iNOS) expression, reducing pathologic NO-mediated vasodilation in sepsis.

4. Potentiation of endogenous vasoconstrictors â€” Sensitizes vascular smooth muscle to catecholamines, enhancing NE effect at lower doses (catecholamine-sparing).

VASOPRESSIN DEFICIENCY IN SEPSIS: Endogenous AVP stores deplete within 24â€“48h of sustained shock due to exhaustion of posterior pituitary reserves. Serum levels paradoxically DROP to inappropriately low levels. Exogenous vasopressin replaces this deficit â€” it is "hormone replacement" as much as vasopressor therapy.`,
  recPhys: `Vâ‚a PATHWAY â€” Vascular Smooth Muscle (Gq â†’ PLC â†’ IPâ‚ƒ/DAG):
Step 1 â€” AVP binds Vâ‚a receptor (7-TM GPCR) on vascular smooth muscle â†’ Gq/Gâ‚â‚ protein activates phospholipase C (PLC).
Step 2 â€” PLC cleaves PIPâ‚‚ â†’ IPâ‚ƒ + DAG. IPâ‚ƒ binds SR receptors â†’ CaÂ²âº release into cytoplasm.
Step 3 â€” DAG activates PKC â†’ (a) directly opens voltage-gated CaÂ²âº channels (VGCCs) via depolarization; (b) CLOSES KATP channels (Kir6.1/SUR2B) â†’ prevents Kâº efflux â†’ maintains depolarization â†’ CaÂ²âº entry.
Step 4 â€” CaÂ²âº-calmodulin â†’ MLCK â†’ phosphorylates myosin light chains â†’ VASOCONSTRICTION.
Location: highest Vâ‚a density in splanchnic, skin, skeletal muscle vasculature. Notably ABSENT in pulmonary vasculature â€” vasopressin does NOT increase PVR. Preferentially constricts EFFERENT > afferent renal arterioles â†’ â†‘GFP â†’ paradoxical increase in urine output despite being "antidiuretic hormone."

Vâ‚‚ PATHWAY â€” Renal Collecting Duct (Gs â†’ adenylyl cyclase â†’ cAMP):
Step 1 â€” AVP binds Vâ‚‚ receptor (basolateral membrane of principal cells) â†’ Gs activates adenylyl cyclase â†’ â†‘cAMP â†’ PKA.
Step 2 â€” PKA phosphorylates AQP2 vesicles â†’ AQP2 water channels translocate to apical membrane.
Step 3 â€” Water reabsorbed from tubular lumen â†’ concentrated urine, free water retention.
Also: Vâ‚‚ activation on vascular endothelium â†’ release of von Willebrand factor (vWF) + Factor VIII â†’ procoagulant effect (basis for desmopressin/DDAVP use in bleeding).

Vâ‚b PATHWAY â€” Anterior Pituitary (Gq â†’ PLC â†’ IPâ‚ƒ/DAG):
AVP binds Vâ‚b receptors on corticotroph cells â†’ same Gq cascade â†’ ACTH secretion â†’ cortisol release. This pathway links vasopressin to the stress response and explains the synergy between vasopressin and corticosteroids in septic shock.

KATP CHANNEL MECHANISM (Why vasopressin works when catecholamines fail):
In septic shock: â†“ATP + â†‘Hâº + â†‘lactate + â†‘NO â†’ KATP channels OPEN â†’ Kâº efflux â†’ smooth muscle hyperpolarization â†’ VGCCs cannot open â†’ NO CaÂ²âº entry â†’ vasoplegia. Catecholamines cannot overcome this because Î±â‚ signaling requires intact depolarization to open VGCCs. Vasopressin bypasses this entirely: Vâ‚a/PKC directly CLOSES KATP channels â†’ restores depolarization â†’ VGCCs can open again â†’ CaÂ²âº entry â†’ contraction restored.

ACID RESISTANCE: Unlike catecholamine receptors (Î±â‚, Î²â‚) which lose affinity in acidotic environments, Vâ‚a receptors maintain full binding affinity regardless of pH. Classic interview point.

KEY COMPARISONS:
â€¢ vs. NOREPINEPHRINE: NE is adrenergic-dependent (fails in acidosis/vasoplegia). NE has Î²â‚ inotropy. NE causes tachycardia risk. VP is non-adrenergic, no inotropy, no chronotropy, spares pulmonary circulation.
â€¢ vs. PHENYLEPHRINE: Both lack inotropy. But VP closes KATP channels (works in vasoplegia), PE does not. VP spares pulmonary circulation, PE does not.
â€¢ vs. EPINEPHRINE: Epi has Î²â‚/Î²â‚‚ â†’ tachycardia, arrhythmia, lactic acidosis. VP has zero adrenergic effects.`,
  dosing: [
    { ind: "Septic Shock (2nd-line, SSC 2021)", dose: "0.03â€“0.04 U/min (FIXED, non-weight-based)", notes: "Add when NE 0.25â€“0.5 mcg/kg/min. Do NOT titrate above 0.04 U/min â€” higher doses â†‘ischemic risk. Not a standalone vasopressor â€” always WITH norepinephrine.", clr: "ac" },
    { ind: "Post-Cardiotomy Vasoplegia", dose: "0.01â€“0.04 U/min", notes: "Start low. Common after CPB due to vasopressin depletion. VANCS trial validated benefit.", clr: "bl" },
    { ind: "Hepatorenal Syndrome", dose: "Terlipressin preferred (Vâ‚a-selective analog)", notes: "Terlipressin 1â€“2 mg IV q4-6h (not yet FDA-approved in US as of 2025). VP 0.01â€“0.04 U/min if terlipressin unavailable.", clr: "wn" },
    { ind: "Diabetes Insipidus (central)", dose: "Desmopressin (DDAVP) preferred", notes: "DDAVP 1â€“4 mcg IV q12h (selective Vâ‚‚ agonist). AVP 2.5â€“10 U IM/SC q4-6h rarely used (short duration, Vâ‚a side effects).", clr: "pr" },
    { ind: "GI Variceal Hemorrhage", dose: "0.2â€“0.4 U/min IV", notes: "Splanchnic vasoconstriction â†“ portal pressure. Max 0.8 U/min. Co-administer with nitroglycerin to prevent coronary vasoconstriction. Octreotide/terlipressin preferred.", clr: "pk" },
  ],
  kin: { onset: "1â€“2 min IV", onsetD: "Rapid onset â€” comparable to catecholamines", peak: "5â€“15 min", peakD: "Steady-state with continuous infusion", dur: "30â€“60 min after stopping", durD: "Longer than catecholamines (NE offset 1â€“2 min)", vd: "140 mL/kg", pb: "~1% (minimal)", hl: "10â€“20 min", csht: "N/A â€” fixed-dose infusion", cl: "Hepatic + renal peptidase cleavage", model: "Rapid enzymatic degradation" },
  metab: `Vasopressin is a 9-amino-acid cyclic peptide (Cys-Tyr-Phe-Gln-Asn-Cys-Pro-Arg-Gly-NHâ‚‚) with a disulfide bridge between CysÂ¹ and Cysâ¶.

Metabolism: Enzymatic cleavage by peptidases â€” primarily hepatic and renal serine proteases, carboxypeptidases, and disulfide oxidoreductases. Metabolites are pharmacologically inactive. Half-life 10â€“20 minutes (shorter in shock states due to increased clearance).

ZERO CYP450 involvement â€” same advantage as norepinephrine: no hepatic drug interactions, no dose adjustment needed for hepatic/renal impairment.

Pregnancy: OXYTOCINASE (a circulating aminopeptidase produced by the placenta from early pregnancy) rapidly degrades vasopressin. This increases clearance substantially in pregnant patients and is a reason some practitioners increase dose or prefer synthetic analogs. Desmopressin (DDAVP) is resistant to oxytocinase degradation.

Excretion: ~5â€“15% unchanged in urine. Remainder cleared by enzymatic degradation.

CRITICAL DISTINCTION from catecholamines: Vasopressin is NOT taken up by neuronal Uptake-1 (NE transporter) and is NOT degraded by COMT or MAO. Completely independent metabolic pathway â€” this is why it works when catecholamine metabolism is overwhelmed.`,
  warn: [
    { tp: "bb", ti: "Tissue Ischemia (Dose-Dependent)", tx: "Potent vasoconstriction can cause: mesenteric ischemia (splanchnic Vâ‚a density is HIGH), digital ischemia/gangrene, skin necrosis, coronary vasoconstriction â†’ demand ischemia. Risk increases sharply above 0.04 U/min. Do NOT titrate as sole vasopressor." },
    { tp: "ci", ti: "Coronary Artery Disease", tx: "Vâ‚a-mediated coronary vasoconstriction can precipitate ischemia. VASST excluded unstable coronary patients. Use with extreme caution â€” if used, keep â‰¤0.03 U/min and monitor troponin." },
    { tp: "cau", ti: "Hyponatremia Risk", tx: "Vâ‚‚ activation â†’ free water retention â†’ dilutional hyponatremia. Monitor serum Naâº. Risk higher with prolonged infusion. Can complicate neuro patients where Naâº targets matter." },
    { tp: "cau", ti: "Mesenteric Ischemia", tx: "Splanchnic bed has highest Vâ‚a receptor density. Monitor lactate and abdominal exam. VASST excluded patients with suspected mesenteric ischemia." },
    { tp: "cau", ti: "Not a Standalone Vasopressor", tx: "Must be used WITH norepinephrine in septic shock â€” not as replacement. Fixed dose, not titrated. Does not provide Î²â‚ inotropy â€” cardiac output not supported." },
  ],
  ix: [
    { dr: "Norepinephrine", ef: "Synergistic vasopression (different receptor pathways). VP allows NE dose reduction (catecholamine-sparing). SSC 2021 standard combination.", sv: "low" },
    { dr: "Corticosteroids", ef: "VP + hydrocortisone may have synergistic benefit. Vâ‚bâ†’ACTHâ†’cortisol pathway. VANISH showed trend toward benefit with hydrocortisone + VP.", sv: "low" },
    { dr: "Indomethacin/NSAIDs", ef: "Potentiate antidiuretic effect by inhibiting prostaglandin-mediated antagonism of Vâ‚‚ action â†’ enhanced water retention.", sv: "mod" },
    { dr: "Carbamazepine/SSRIs", ef: "Potentiate ADH effect â†’ â†‘risk SIADH-like hyponatremia when combined with VP.", sv: "mod" },
    { dr: "Lithium/Demeclocycline", ef: "Vâ‚‚ receptor antagonism â†’ blunts antidiuretic effect. May counteract VP-mediated water retention.", sv: "mod" },
    { dr: "Halogenated Anesthetics", ef: "Volatiles may impair vasopressin release from posterior pituitary. May need higher exogenous doses under GA.", sv: "low" },
  ],
  pearls: [
    { ti: "Why VP works when NE fails", tx: "In severe sepsis: acidosis + â†‘NO + â†“ATP â†’ KATP channels open â†’ catecholamine-resistant vasoplegia. VP bypasses adrenergic receptors entirely, closes KATP channels via PKC, and Vâ‚a receptors maintain affinity in acidosis. Non-adrenergic rescue." },
    { ti: "VASST (NEJM 2008, n=778)", tx: "VP 0.03 U/min + NE vs NE alone. No mortality difference overall (35.4% vs 39.3%). SUBGROUP: less severe shock (NE 5â€“14 mcg/min) â†’ mortality 26.5% vs 35.7% (P=0.05). Established safety of VP â‰¤0.03 U/min." },
    { ti: "VANISH (JAMA 2016, n=409)", tx: "Early VP vs NE as first-line. No difference in kidney failure-free days (primary). BUT: VP group had â†“RRT need (25.4% vs 35.3%, absolute difference âˆ’9.9%). Renal-sparing signal â€” likely from preferential efferent arteriolar constriction." },
    { ti: "Efferent > Afferent", tx: "VP constricts EFFERENT arterioles >> afferent (unlike NE/PE which constrict both equally). This â†‘glomerular filtration pressure â†’ paradoxically â†‘urine output despite being 'antidiuretic hormone.' Classic interview question." },
    { ti: "Pulmonary-sparing", tx: "VP does NOT constrict pulmonary vasculature â€” may even vasodilate (NO-mediated). Preferred over catecholamines in patients with RV failure or pulmonary hypertension." },
    { ti: "Removed from ACLS (2015/2025)", tx: "40 U IV single-dose was equivalent to epinephrine 1 mg â€” no added benefit. AHA 2025: 'Do not substitute vasopressin alone or with epinephrine for epinephrine' (Class 3: No Benefit). Removed to simplify algorithm, not because it's harmful." },
    { ti: "SSC 2021 Vasopressor Hierarchy", tx: "1) NE first-line â†’ 2) Add VP 0.03 U/min at NE 0.25â€“0.5 mcg/kg/min (weak recommendation) â†’ 3) Add epinephrine â†’ 4) Dobutamine for cardiac dysfunction â†’ 5) Hydrocortisone if NE â‰¥0.25 for â‰¥4h." },
    { ti: "Decatecholaminization trend", tx: "2024â€“2025 literature supports earlier VP addition to reduce catecholamine exposure. High-dose catecholamines â†’ myocardial toxicity, arrhythmias, metabolic derangement. VP spares catecholamine dose." },
  ],
  intQs: [
    { q: "Patient on NE 0.5 mcg/kg/min, MAP 56, pH 7.18. What's happening and what do you add?", a: "Catecholamine-resistant vasoplegia. Acidosis opens KATP channels â†’ hyperpolarization â†’ Î±â‚ receptors can't transduce signal. Add VP 0.03 U/min â€” non-adrenergic, closes KATP channels via PKC, Vâ‚a receptors maintain affinity in acidosis. Also give bicarb if pH <7.15 and consider hydrocortisone." },
    { q: "Why does urine output increase when you start vasopressin?", a: "Vâ‚a receptors preferentially constrict EFFERENT arterioles >> afferent. This â†‘glomerular filtration pressure â†’ â†‘GFR â†’ â†‘UOP. Despite Vâ‚‚-mediated water reabsorption, the net effect at low doses is increased filtration." },
    { q: "VP was removed from ACLS. Does that mean it doesn't work?", a: "It was equivalent to epinephrine â€” removed to simplify, not for harm. AHA 2025 classifies it Class 3: No Benefit (not Class 3: Harm). In cardiac arrest, epinephrine's Î±â‚ + Î²â‚ effects on coronary perfusion are sufficient. VP's role is in SHOCK, not arrest." },
    { q: "Cardiogenic shock patient on NE + dobutamine. Can you add VP?", a: "Use cautiously. VP has NO Î²â‚ inotropy and increases afterload (â†‘SVR). In cardiogenic shock with â†“CO, â†‘afterload without â†‘contractility worsens output. VP better suited for distributive/vasodilatory shock where the problem is low SVR, not low CO." },
  ],
}];

const PROTOS = [
  { id: "vfib", name: "VFib / Pulseless VT", cat: "Cardiac Arrest", clr: "#ef4444",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-CA-250527.pdf", ahaYear: 2025,
    sum: "Shockable rhythms â€” defibrillation is definitive. Every 2-min cycle: CPR â†’ rhythm check â†’ shock â†’ resume CPR.",
    steps: [
      { a: "Confirm arrest", d: "Unresponsive, no pulse/breathing. Activate code. CPR immediately." },
      { a: "High-quality CPR", d: "100â€“120/min, â‰¥2 in depth, full recoil, minimize interruptions (<10 sec). 30:2 or continuous once advanced airway." },
      { a: "Defibrillate", d: "200J biphasic (360J mono). Resume CPR immediately after â€” do NOT pause to check rhythm." },
      { a: "2 min CPR â†’ Rhythm check", d: "Still VF/pVT â†’ shock again â†’ immediate CPR." },
      { a: "Epinephrine 1 mg IV/IO", d: "After 2nd shock. Repeat q3â€“5 min." },
      { a: "3rd shock â†’ Amiodarone", d: "300 mg IV bolus. May repeat 150 mg. Alt: Lidocaine 1â€“1.5 mg/kg." },
      { a: "Continue cycles", d: "CPR â†’ check â†’ shock â†’ CPR. Epi q3â€“5 min. Treat H's and T's." },
      { a: "ROSC achieved", d: "â†’ Post-arrest care. 12-lead, TTM, hemodynamic optimization." },
    ],
    keys: ["Defib is #1 â€” every min without it â†“ survival 7â€“10%", "Epi AFTER 2nd shock, amio AFTER 3rd", "Biphasic stays 200J (no escalation unless manufacturer says)", "Refractory VF: consider double sequential defib, esmolol 500 mcg/kg"] },
  { id: "pea", name: "PEA / Asystole", cat: "Cardiac Arrest", clr: "#f59e0b",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-CA-250527.pdf", ahaYear: 2025,
    sum: "Non-shockable â€” NO defibrillation. CPR + epinephrine + aggressive H's and T's search.",
    steps: [
      { a: "Confirm non-shockable", d: "PEA: organized activity, no pulse. Asystole: flat line â€” confirm 2 leads, check gain/connections." },
      { a: "High-quality CPR", d: "Begin immediately. Same standards." },
      { a: "Epinephrine 1 mg ASAP", d: "Give immediately once IV/IO access. Repeat q3â€“5 min. Earlier epi improves outcomes in non-shockable." },
      { a: "Advanced airway", d: "ETT or SGA. Continuous compressions, ventilate q6 sec. Waveform capnography." },
      { a: "Treat reversible causes", d: "THE key step. PEA/asystole rarely converts without treating the cause." },
      { a: "2 min CPR â†’ check", d: "Organized â†’ pulse check. Still PEA/asystole â†’ continue. Becomes VF â†’ switch algorithm." },
    ],
    keys: ["NO shocks for PEA or asystole", "Narrow PEA â†’ mechanical (tamponade, tension pneumo, PE)", "Wide PEA â†’ metabolic (hyperK, Na channel blocker OD)", "Epi EARLIER in non-shockable vs shockable", "ETCOâ‚‚ <10 after 20 min = very poor prognosis"] },
  { id: "hsts", name: "H's and T's", cat: "Cardiac Arrest", clr: "#a855f7",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-CA-250527.pdf", ahaYear: 2025,
    sum: "Reversible causes â€” systematically evaluate during every arrest.",
    steps: [
      { a: "Hypovolemia", d: "Most common PEA cause. Flat neck veins. Volume, blood products, surgical control." },
      { a: "Hypoxia", d: "Confirm ETT with capnography. Bilateral breath sounds. FiOâ‚‚ 100%." },
      { a: "Hydrogen ion (Acidosis)", d: "pH <7.1 impairs contractility + vasopressor response. Bicarb 1 mEq/kg for known severe acidosis or hyperK." },
      { a: "Hypo/Hyperkalemia", d: "HyperK: peaked T â†’ sine wave â†’ VF. CaClâ‚‚ 1g IV (3x more CaÂ²âº than gluconate), insulin/glucose, albuterol. HypoK: replete >3.5." },
      { a: "Hypothermia", d: "<30Â°C: refractory VF. Withhold vasopressors until >30Â°C. Rewarm: warm IVF, forced air, lavage, ECMO." },
      { a: "Tension Pneumothorax", d: "Absent BS, tracheal deviation, hard to ventilate. Needle decompression â†’ chest tube." },
      { a: "Tamponade", d: "Beck's triad. Bedside echo: effusion + RV collapse. Pericardiocentesis or thoracotomy." },
      { a: "Toxins", d: "Opioid â†’ naloxone. BB/CCB â†’ glucagon, high-dose insulin. TCA â†’ bicarb. LA toxicity â†’ intralipid 20%." },
      { a: "Thrombosis â€” PE", d: "Sudden PEA, dilated RV, â†“ETCOâ‚‚. tPA 50 mg IV during CPR. Extend resuscitation 60â€“90 min post-lytic." },
      { a: "Thrombosis â€” Coronary", d: "STEMI â†’ emergent cath post-ROSC." },
    ],
    keys: ["POCUS during CPR: tamponade, PE, hypovolemia, pneumo", "CaClâ‚‚ first-line for hyperK arrest (NOT gluconate)", "tPA can be given DURING CPR for massive PE", "In TNICU: consider neurogenic causes (herniation, cord injury)"] },
  { id: "brady", name: "Bradycardia", cat: "Bradyarrhythmia", clr: "#3b82f6",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Bradycardia-250514.pdf", ahaYear: 2025,
    sum: "HR <50 with poor perfusion signs. Atropine for AV nodal blocks; pacing for infranodal.",
    steps: [
      { a: "Assess symptoms", d: "Hypotension, AMS, chest pain, acute HF, syncope. Asymptomatic + stable â†’ monitor." },
      { a: "Atropine 1 mg IV", d: "First-line. Repeat q3â€“5 min, max 3 mg. Blocks M2 muscarinic at SA/AV nodes." },
      { a: "If atropine fails:", d: "Won't work in Mobitz II, 3rd degree block, or denervated hearts." },
      { a: "Transcutaneous pacing", d: "Rate 60â€“80, increase mA to capture. Sedate â€” pacing is painful." },
      { a: "Dopamine 2â€“20 mcg/kg/min", d: "Î²1 effects â†‘ HR and contractility. Temporizing if pacing unavailable." },
      { a: "Epinephrine 2â€“10 mcg/min", d: "Î²1 chronotropy. Refractory cases." },
      { a: "Transvenous pacing", d: "Definitive temporary measure. Bridge to permanent pacemaker." },
    ],
    keys: ["Atropine works on AV NODE only â€” NOT infranodal", "Mobitz I (Wenckebach): AV nodal â†’ may respond to atropine", "Mobitz II: infranodal â†’ pace early", "3rd degree + wide QRS â†’ pace immediately", "Atropine <0.5 mg can paradoxically worsen bradycardia", "BB/CCB OD: glucagon 3â€“5 mg IV, high-dose insulin"] },
  { id: "tachy", name: "Tachycardia", cat: "Tachyarrhythmia", clr: "#ec4899",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-ACLS-Tachycardia-250514.pdf", ahaYear: 2025,
    sum: "HR >150 with pulse. Branch: STABLE vs UNSTABLE, then NARROW vs WIDE. Unstable = cardiovert.",
    steps: [
      { a: "Assess stability", d: "UNSTABLE: hypotension, AMS, chest pain, acute HF caused by the rhythm â†’ synchronized cardioversion." },
      { a: "Unstable â†’ Cardiovert", d: "Narrow regular: 50â€“100J. AFib: 120â€“200J. Wide regular (VT): 100J. Polymorphic VT/Torsades: DEFIB 200J unsync." },
      { a: "Stable narrow regular (SVT)", d: "" },
      { a: "Vagal maneuvers", d: "Modified Valsalva, carotid massage (no bruit). Stimulates vagus â†’ slows AV conduction." },
      { a: "Adenosine 6 mg rapid push", d: "Rapid push + 20 mL flush via stopcock. No conversion â†’ 12 mg. Half-life <10 sec. Warn: chest pressure, flushing." },
      { a: "Stable narrow irregular (AFib)", d: "Diltiazem 0.25 mg/kg IV over 2 min â†’ 5â€“15 mg/h. Alt: metoprolol 5 mg IV q5min x3. HFrEF: amiodarone." },
      { a: "Stable wide regular (VT)", d: "Amiodarone 150 mg over 10 min. Alt: procainamide 20â€“50 mg/min (max 17 mg/kg)." },
      { a: "Stable wide irregular", d: "AFib+WPW: AVOID AV nodal blockers â†’ procainamide. Torsades: Mg 1â€“2g over 15 min." },
    ],
    keys: ["UNSTABLE = cardiovert. STABLE = think then medicate", "Sync cardioversion for all EXCEPT polymorphic VT and VFib â†’ unsync defib", "Never give AV nodal blockers in WPW+AFib â†’ preferential accessory conduction â†’ VFib", "Adenosine: MUST be rapid push + flush. Warn about transient asystole", "In TNICU: consider sympathetic storming post-TBI/SCI"] },
  { id: "rosc", name: "Post-ROSC Care", cat: "Post-Resuscitation", clr: "#22c55e",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/PCAC-Algorithm-ACLS-PCAC-250527.pdf", ahaYear: 2025,
    sum: "After ROSC: optimize Oâ‚‚/ventilation, hemodynamics, TTM, identify cause, neuroprognosticate â‰¥72h.",
    steps: [
      { a: "Airway & Ventilation", d: "SpOâ‚‚ 92â€“98% (avoid hyperoxia). PaCOâ‚‚ 35â€“45. Waveform capnography. ETCOâ‚‚ >40 = adequate CO." },
      { a: "Hemodynamics", d: "SBP >90 or MAP â‰¥65 (some target â‰¥80 for cerebral perfusion). IVF + NE or epi infusion." },
      { a: "12-lead ECG", d: "STEMI â†’ emergent cath regardless of neuro status." },
      { a: "TTM", d: "Comatose patients: 32â€“36Â°C for â‰¥24h. Cold saline, cooling devices. Prevent shivering. Prevent hyperthermia â‰¥72h." },
      { a: "Glucose", d: "Target 144â€“180 mg/dL. Avoid hypoglycemia (<80)." },
      { a: "Seizures", d: "Continuous EEG. Treat aggressively (levetiracetam, BZDs, propofol)." },
      { a: "Neuroprognostication", d: "NEVER before 72h post-ROSC. Multimodal: exam, EEG, SSEPs, MRI, NSE." },
    ],
    keys: ["Hyperoxia is harmful â€” titrate FiOâ‚‚ DOWN", "Hypocarbia â†’ cerebral vasoconstriction â†’ worsens ischemia", "TTM for ALL comatose post-arrest (not just shockable)", "No single test is 100% â€” multimodal approach", "In TNICU: differentiate anoxic injury from underlying neuro pathology"] },
  { id: "pregca", name: "Cardiac Arrest in Pregnancy", cat: "Special Circumstances", clr: "#db2777",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-SC-ACLS-CA-in-Pregnancy-250620.pdf", ahaYear: 2025,
    sum: "Dual-patient emergency. Standard ACLS PLUS continuous lateral uterine displacement, IV above diaphragm, and perimortem cesarean delivery within 5 minutes if no ROSC.",
    steps: [
      { a: "Activate Teams", d: "Assemble maternal cardiac arrest team AND neonatal team simultaneously. Requires OB, anesthesia, neonatal, emergency, ICU, and code team collaboration." },
      { a: "High-Quality CPR", d: "Standard ACLS: CPR, defibrillation when indicated, epinephrine per algorithm. Chest compressions may need hand position slightly higher on sternum due to diaphragm elevation." },
      { a: "Lateral Uterine Displacement", d: "Continuous LEFT lateral uterine displacement to relieve aortocaval compression. Manual displacement preferred over left lateral tilt (maintains flat surface for CPR)." },
      { a: "Maternal Interventions", d: "Airway management by MOST EXPERIENCED provider (difficult airway common in pregnancy). 100% Oâ‚‚, avoid excess ventilation. IV access ABOVE diaphragm. If on IV magnesium â†’ STOP and give calcium chloride or gluconate." },
      { a: "Obstetric Interventions", d: "Detach fetal monitors. Prepare for perimortem cesarean delivery (PMCD)." },
      { a: "Perimortem Cesarean Delivery", d: "If no ROSC, complete PMCD ideally within 5 minutes of arrest onset. Goal: improve BOTH maternal and fetal outcomes. Delivery relieves aortocaval compression and may restore maternal circulation." },
    ],
    keys: ["ABCDEFGH mnemonic: Anesthetic, Bleeding, Cardiovascular, Drugs, Embolic, Fever, General (H's & T's), Hypertension", "Uterine displacement is IMMEDIATE â€” do not wait", "IV access ABOVE diaphragm (IVC compression below)", "Stop magnesium â†’ give calcium if on Mg drip", "PMCD benefits MOTHER â€” not just fetus", "Difficult airway: smaller ETT (6.0â€“7.0), early video laryngoscopy"] },
  { id: "pals_ca", name: "PALS Cardiac Arrest", cat: "Pediatric", clr: "#f97316",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-CA-250123.pdf", ahaYear: 2025,
    sum: "Pediatric cardiac arrest â€” CPR â‰¥â…“ chest depth, 15:2 ratio. Defibrillation 2â†’4â†’â‰¥4 J/kg. Epinephrine ASAP for non-shockable. Includes hypoglycemia in reversible causes.",
    steps: [
      { a: "Start CPR", d: "Bag-mask ventilation with oxygen. Attach monitor/defibrillator. Push hard (â‰¥â…“ AP chest diameter), fast (100â€“120/min). 15:2 ratio without advanced airway." },
      { a: "Rhythm Check â€” Shockable?", d: "VF/pVT â†’ Shock at 2 J/kg first, 4 J/kg second, â‰¥4 J/kg subsequent (max 10 J/kg or adult dose). CPR 2 min between shocks." },
      { a: "Epinephrine", d: "IV/IO: 0.01 mg/kg (0.1 mL/kg of 0.1 mg/mL). Max 1 mg. Every 3â€“5 min. ET dose: 0.1 mg/kg (0.1 mL/kg of 1 mg/mL). For PEA/Asystole: give ASAP. For VF/pVT: after 2nd shock." },
      { a: "Antiarrhythmics (Shockable)", d: "Amiodarone 5 mg/kg IV/IO bolus (may repeat up to 3 total doses) OR Lidocaine 1 mg/kg IV/IO loading dose." },
      { a: "Advanced Airway", d: "ETT or supraglottic airway. Confirm with waveform capnography. Once placed: continuous compressions + 1 breath every 2â€“3 seconds." },
      { a: "Reversible Causes", d: "Hypovolemia, Hypoxia, Hâº (acidosis), Hypoglycemia, Hypo/hyperkalemia, Hypothermia + Tension pneumothorax, Tamponade, Toxins, Thrombosis (pulmonary & coronary)." },
    ],
    keys: ["Compression depth â‰¥â…“ AP diameter (different from adult)", "15:2 ratio in PALS (not 30:2)", "Defibrillation: 2â†’4â†’â‰¥4 J/kg (max 10 J/kg)", "Epinephrine ASAP for non-shockable rhythms", "Hypoglycemia added to H's (unique to peds)", "ET epi dose is 10Ã— the IV dose"] },
  { id: "pals_brady", name: "PALS Bradycardia", cat: "Pediatric", clr: "#0ea5e9",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-Bradycardia-250121.pdf", ahaYear: 2025,
    sum: "Pediatric bradycardia â€” HR <60 with poor perfusion = START CPR. Most common cause is hypoxia. Epinephrine + atropine (for vagal/AV block). CPR threshold different from adult.",
    steps: [
      { a: "Assessment", d: "Maintain patent airway. Positive pressure ventilation with oxygen. Cardiac monitor, pulse, BP, oximetry." },
      { a: "Pulse Check", d: "If no pulse â†’ go to PALS Cardiac Arrest Algorithm." },
      { a: "Cardiopulmonary Compromise?", d: "Acutely altered mental status, signs of shock, or hypotension. If NO â†’ support ABCs, oxygen, observe, 12-lead ECG, treat underlying causes." },
      { a: "Start CPR", d: "If HR <60/min despite adequate oxygenation and ventilation â†’ START CPR." },
      { a: "Medications", d: "Epinephrine IV/IO: 0.01 mg/kg (0.1 mL/kg of 0.1 mg/mL). Repeat q3â€“5 min. ET: 0.1 mg/kg. Atropine IV/IO: 0.02 mg/kg (min 0.1 mg, max single dose 0.5 mg) â€” for increased vagal tone or primary AV block." },
      { a: "Consider Pacing", d: "Transthoracic or transvenous pacing if medications ineffective. Identify and treat underlying causes." },
    ],
    keys: ["HR <60 with poor perfusion = START CPR in peds", "Bradycardia in children is usually HYPOXIA â€” treat airway first", "Atropine min dose 0.1 mg (prevent paradoxical bradycardia)", "Atropine max single dose 0.5 mg in peds", "Possible causes: Hypothermia, Hypoxia, Medications", "Different from adult: CPR threshold is HR <60, not <50"] },
  { id: "pals_tachy", name: "PALS Tachycardia", cat: "Pediatric", clr: "#8b5cf6",
    ahaPdf: "https://cpr.heart.org/-/media/CPR-Files/CPR-Guidelines-Files/2025-Algorithms/Algorithm-PALS-Tachyarrhythmia-250117.pdf", ahaYear: 2025,
    sum: "Pediatric tachycardia with pulse. Differentiate sinus tach vs SVT by rate thresholds and P waves. Narrow vs wide QRS. Unstable = cardioversion 0.5â€“1 J/kg. Stable narrow = vagal + adenosine.",
    steps: [
      { a: "Initial Assessment", d: "Airway, oxygen, cardiac monitor, pulse/BP/SpOâ‚‚, IV/IO access, 12-lead ECG if available." },
      { a: "Evaluate QRS Duration", d: "Narrow (â‰¤0.09 sec) vs Wide (>0.09 sec). Differentiate sinus tach from SVT: P waves present/normal + variable RR = sinus. P waves absent/abnormal + fixed RR + abrupt onset = SVT." },
      { a: "Heart Rate Thresholds", d: "Sinus tach: Infant usually <220, Child usually <180. SVT: Infant usually â‰¥220, Child usually â‰¥180." },
      { a: "Unstable (CP Compromise)", d: "Synchronized cardioversion: 0.5â€“1 J/kg first, increase to 2 J/kg if ineffective. Sedate if possible but DON'T delay cardioversion. If regular narrow complex, consider adenosine." },
      { a: "Stable â€” Narrow QRS", d: "Vagal maneuvers (ice to face in infants). Adenosine: 1st dose 0.1 mg/kg rapid bolus (max 6 mg), 2nd dose 0.2 mg/kg (max 12 mg)." },
      { a: "Stable â€” Wide QRS", d: "Possible VT. Expert consultation advised. If regular and monomorphic, consider adenosine. Synchronized cardioversion if hemodynamically unstable." },
    ],
    keys: ["SVT is the most common symptomatic tachyarrhythmia in peds", "Ice to face = vagal maneuver for infants (do NOT use carotid massage)", "Adenosine: rapid push + immediate NS flush", "Cardioversion energy lower than adult: 0.5â€“1 â†’ 2 J/kg", "Sinus tach: treat the CAUSE, not the rhythm", "Wide complex in kids: assume VT until proven otherwise"] },
];

const QUIZZES = {
  vasopressors: { label: "Vasopressor Dosing", icon: "ðŸ’Š", items: [
    { q: "78 kg septic shock, MAP 58 despite 2L crystalloid. Vasopressor, dose, target?", a: "Norepinephrine 0.1â€“0.2 mcg/kg/min. Target MAP â‰¥65. First-line per SSC: Î±1 vasoconstriction + moderate Î²1 inotropy.", c: "Vasopressor Dosing" },
    { q: "On NE 0.5 mcg/kg/min, MAP still 60. Next?", a: "Vasopressin 0.04 units/min (fixed). V1 agonist â€” non-catecholamine. SSC second-line.", c: "Vasopressor Dosing" },
    { q: "Decompensated HF: CI 1.8, PCWP 28, SVR 1800. Inotrope?", a: "Dobutamine 2.5â€“10 mcg/kg/min. Î²1â†‘contractility, mild Î²2â†“SVR. Alt: milrinone if on Î²-blockers.", c: "Vasopressor Dosing" },
    { q: "Max phenylephrine infusion and receptor?", a: "0.5â€“5 mcg/kg/min (up to 10). Pure Î±1. Watch reflex bradycardia.", c: "Vasopressor Dosing" },
    { q: "Ephedrine vs phenylephrine at receptor level?", a: "Ephedrine: indirect sympathomimetic (releases NE) â†’ mixed Î±1+Î²1/Î²2. Maintains HR/CO+SVR. Tachyphylaxis. PE: direct pure Î±1.", c: "Vasopressor Dosing" },
  ]},
  acls: { label: "ACLS Algorithms", icon: "â¤ï¸â€ðŸ”¥", items: [
    { q: "VFib witnessed. Walk through the first 2 cycles.", a: "Call code â†’ CPR (100â€“120/min, 2+in) â†’ defib pads â†’ 2 min check â†’ shock 200J â†’ CPR â†’ IV/IO â†’ after 2nd shock: epi 1mg q3â€“5min â†’ after 3rd: amio 300mg.", c: "ACLS" },
    { q: "PEA, HR 40 on monitor, no pulse. Priorities?", a: "CPR (NO shocks). Epi 1mg ASAP q3â€“5min. H's and T's aggressively. Narrow PEAâ†’mechanical. Wide PEAâ†’metabolic.", c: "ACLS" },
    { q: "Wide-complex tachy 180, alert, BP 108/72. Management?", a: "Stable â†’ amiodarone 150mg over 10min. Alt: procainamide. Polymorphic+long QTc â†’ Mg 1â€“2g. Unstable â†’ sync cardioversion 100J.", c: "ACLS" },
    { q: "Post-ROSC, comatose, temp 37.8Â°C. TTM protocol?", a: "32â€“36Â°C â‰¥24h. Cool with saline/devices. Treat shivering. Prevent hyperthermia â‰¥72h. Neuroprognosticate â‰¥72h.", c: "ACLS" },
    { q: "Name all H's and T's.", a: "H's: Hypovolemia, Hypoxia, H+ (acidosis), Hypo/HyperK, Hypothermia. T's: Tension pneumo, Tamponade, Toxins, Thrombosis (PE + coronary).", c: "ACLS" },
  ]},
};

const SYS = {
  cardio: { n: "Cardiovascular", i: "â™¥", c: "#ef4444" },
  neuro: { n: "Neurological", i: "ðŸ§ ", c: "#a855f7" },
  respiratory: { n: "Respiratory", i: "ðŸ«", c: "#3b82f6" },
  renal: { n: "Renal", i: "ðŸ«˜", c: "#f59e0b" },
  pharm: { n: "Pharmacology", i: "ðŸ’Š", c: "#2dd4bf" },
};

// â”€â”€ Small Components â”€â”€
const SL = ({ t, icon, title, count, color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", marginTop: "12px" }}>
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
    {onClick && <div style={{ marginLeft: "auto", color: t.tM, fontSize: "14px" }}>â€º</div>}
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
      <button key={n} onClick={() => onChange(n)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: n <= value ? t.wn : t.tM, transition: "color 0.15s", padding: "0 1px" }}>{n <= value ? "â˜…" : "â˜†"}</button>
    ))}
  </div>
);

// â”€â”€ MAIN APP â”€â”€
export default function App() {
  const [theme, setTheme] = useState("light");
  const [pg, setPg] = useState("dash");
  const [vm, setVm] = useState("type");
  const [sq, setSq] = useState("");
  const [so, setSo] = useState(false);
  const [sel, setSel] = useState(null);
  const [tab, setTab] = useState("overview");
  const [proto, setProto] = useState(null);
  const [qCat, setQCat] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [qRev, setQRev] = useState(false);
  const [qSc, setQSc] = useState({ c: 0, t: 0 });
  const [conf, setConf] = useState({});
  const [notes, setNotes] = useState({});
  const [qHist, setQHist] = useState([]);
  const [timer, setTimer] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const sRef = useRef(null);
  const t = TH[theme];

  // Timer
  useEffect(() => {
    let iv;
    if (timerOn) iv = setInterval(() => setTimer(p => p + 1), 1000);
    return () => clearInterval(iv);
  }, [timerOn]);
  const fmtTime = (s) => `${Math.floor(s / 3600).toString().padStart(2, "0")}:${Math.floor((s % 3600) / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

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
  const sQuiz = (c) => { setQCat(c); setQIdx(0); setQRev(false); setQSc({ c: 0, t: 0 }); setPg("quiz"); };
  const nxtQ = (ok) => {
    const s = { c: qSc.c + (ok ? 1 : 0), t: qSc.t + 1 }; setQSc(s);
    if (qIdx + 1 >= QUIZZES[qCat].items.length) { setQHist(p => [...p, { cat: qCat, label: QUIZZES[qCat].label, ...s, d: new Date().toLocaleDateString() }]); setPg("qres"); }
    else { setQIdx(qIdx + 1); setQRev(false); }
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Helvetica Neue',sans-serif", background: t.bg, color: t.tx, minHeight: "100vh", transition: "all 0.3s" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", borderBottom: `1px solid ${t.bd}`, background: t.bgC, position: "sticky", top: 0, zIndex: 100, gap: "8px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={() => { setPg("dash"); setSel(null); setProto(null); }} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", padding: 0 }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: `linear-gradient(135deg,${t.ac},${t.bl})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>ðŸ©º</div>
            <span style={{ fontSize: "16px", fontWeight: 700, color: t.tx }}>CRNA Prep</span>
          </button>
          {pg !== "dash" && <button onClick={() => { setPg("dash"); setSel(null); setProto(null); }} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "6px", padding: "4px 10px", color: t.t2, cursor: "pointer", fontSize: "12px", fontWeight: 500 }}>â† {pg === "detail" || pg === "proto" ? "Back" : "Dashboard"}</button>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {/* Study Timer */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px", background: t.bgS, borderRadius: "7px", padding: "4px 10px", border: `1px solid ${t.bd}` }}>
            <button onClick={() => setTimerOn(!timerOn)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", padding: 0 }}>{timerOn ? "â¸" : "â–¶"}</button>
            <span style={{ fontSize: "12px", fontFamily: "monospace", color: t.t2, minWidth: "58px" }}>{fmtTime(timer)}</span>
            {timer > 0 && <button onClick={() => { setTimer(0); setTimerOn(false); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "10px", color: t.tM, padding: 0 }}>â†º</button>}
          </div>
          <button onClick={() => setSo(true)} style={{ display: "flex", alignItems: "center", gap: "6px", background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "7px", padding: "5px 10px", color: t.tM, cursor: "pointer", fontSize: "12px" }}>
            ðŸ” <span style={{ display: "none" }}>{/* mobile hide text */}</span><span style={{ background: t.bgC, padding: "1px 5px", borderRadius: "3px", fontSize: "10px", border: `1px solid ${t.bd}` }}>âŒ˜K</span>
          </button>
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "7px", width: "32px", height: "32px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>{theme === "dark" ? "â˜€ï¸" : "ðŸŒ™"}</button>
        </div>
      </nav>

      {/* SEARCH MODAL */}
      {so && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", justifyContent: "center", paddingTop: "10vh" }} onClick={() => setSo(false)}>
        <div style={{ background: t.bgC, borderRadius: "14px", width: "92%", maxWidth: "520px", maxHeight: "440px", overflow: "hidden", border: `1px solid ${t.bd}`, boxShadow: t.sh }} onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: `1px solid ${t.bd}` }}>
            <span>ðŸ”</span>
            <input ref={sRef} value={sq} onChange={e => setSq(e.target.value)} placeholder="Search meds, protocols, quizzes..." style={{ flex: 1, background: "none", border: "none", outline: "none", color: t.tx, fontSize: "14px" }} />
            <button onClick={() => setSo(false)} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "5px", padding: "2px 7px", color: t.tM, cursor: "pointer", fontSize: "10px" }}>ESC</button>
          </div>
          <div style={{ maxHeight: "380px", overflowY: "auto", padding: "4px" }}>
            {fs.items.map(i => <SearchRow key={i.id} icon="ðŸ’Š" title={i.name} sub={i.tags.slice(0, 2).join(" Â· ")} stars={conf[i.id]} onClick={() => nav(i)} t={t} />)}
            {fs.protos.map(p => <SearchRow key={p.id} icon="â¤ï¸â€ðŸ”¥" title={p.name} sub={p.cat} stars={conf[p.id]} onClick={() => oPro(p)} t={t} />)}
            {Object.entries(QUIZZES).map(([k, v]) => <SearchRow key={k} icon={v.icon} title={`${v.label} Quiz`} sub={`${v.items.length} questions`} onClick={() => sQuiz(k)} t={t} />)}
            {fs.items.length === 0 && fs.protos.length === 0 && sq && <div style={{ padding: "32px", textAlign: "center", color: t.tM }}>No results</div>}
          </div>
        </div>
      </div>}

      {/* DASHBOARD */}
      {pg === "dash" && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "10px", marginBottom: "20px" }}>
          <Stat t={t} label="Study Sheets" value={allItems.length} icon="ðŸ“‹" accent={t.ac} onClick={() => setPg("pg-meds")} />
          <Stat t={t} label="ACLS/PALS Protocols" value={PROTOS.length} icon="â¤ï¸â€ðŸ”¥" accent="#ef4444" onClick={() => setPg("pg-acls")} />
          <Stat t={t} label="Quizzes" value={Object.keys(QUIZZES).length} icon="â“" accent={t.pr} onClick={() => setPg("pg-quiz")} />
          <div style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}><span style={{ fontSize: "11px", color: t.tM, fontWeight: 500 }}>Mastery (â‰¥3â˜…)</span><span style={{ fontSize: "16px", fontWeight: 700, color: t.ac }}>{prog}%</span></div>
            <div style={{ height: "5px", background: t.bgS, borderRadius: "3px" }}><div style={{ height: "100%", width: `${prog}%`, background: `linear-gradient(90deg,${t.ac},${t.bl})`, borderRadius: "3px", transition: "width 0.5s" }} /></div>
          </div>
        </div>

        {/* Weak Areas */}
        {weakAreas.length > 0 && <div style={{ marginBottom: "20px", padding: "14px 16px", background: `${t.wn}08`, borderRadius: "10px", border: `1px solid ${t.wn}30` }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: t.wn, marginBottom: "8px" }}>âš¡ Focus Areas (rated â‰¤ 2â˜…)</div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {weakAreas.map(w => <button key={w.id} onClick={() => w.type === "med" ? nav(MEDS.find(m => m.id === w.id)) : oPro(PROTOS.find(p => p.id === w.id))} style={{ background: t.bgC, border: `1px solid ${t.wn}40`, borderRadius: "7px", padding: "5px 12px", cursor: "pointer", fontSize: "12px", color: t.tx, fontWeight: 500 }}>
              {w.name} <span style={{ color: t.wn }}>{"â˜…".repeat(w.stars)}</span>
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
          {/* Medications */}
          <SL t={t} icon="ðŸ’Š" title="Medications" count={MEDS.length} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
            {MEDS.map(i => <ItemCard key={i.id} item={i} t={t} conf={conf[i.id]} onConf={v => setConf(p => ({ ...p, [i.id]: v }))} onOpen={() => nav(i)} />)}
            <PH t={t} text="More medications coming..." />
          </div>

          {/* ACLS Protocols â€” OWN SECTION */}
          <SL t={t} icon="â¤ï¸â€ðŸ”¥" title="ACLS & PALS Protocols" count={PROTOS.length} color="#ef4444" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
            {PROTOS.map(p => <ProtoCard key={p.id} p={p} t={t} conf={conf[p.id]} onConf={v => setConf(prev => ({ ...prev, [p.id]: v }))} onOpen={() => oPro(p)} />)}
          </div>

          {/* Devices & Physiology (placeholder) */}
          <SL t={t} icon="ðŸ”§" title="Devices" count={0} />
          <div style={{ marginBottom: "20px" }}><PH t={t} text="Ask about arterial lines, vents, EVDs..." /></div>
          <SL t={t} icon="ðŸ“–" title="Physiology Concepts" count={0} />
          <div style={{ marginBottom: "20px" }}><PH t={t} text="Ask about Frank-Starling, MAC, Oâ‚‚-Hb curve..." /></div>

          {/* Quizzes */}
          <SL t={t} icon="â“" title="Quizzes" count={Object.keys(QUIZZES).length} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
            {Object.entries(QUIZZES).map(([k, v]) => (
              <div key={k} onClick={() => sQuiz(k)} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}><span style={{ fontSize: "18px" }}>{v.icon}</span><span style={{ fontSize: "15px", fontWeight: 600 }}>{v.label}</span></div>
                <div style={{ fontSize: "12px", color: t.tM, marginBottom: "10px" }}>{v.items.length} questions</div>
                <div style={{ background: t.ac, color: t.acTx, padding: "7px 14px", borderRadius: "7px", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>Start Quiz</div>
              </div>
            ))}
          </div>
        </>}

        {/* SYSTEM VIEW â€” ACLS has its own row, NOT under Cardio */}
        {vm === "system" && <>
          {/* ACLS â€” standalone system row */}
          <SL t={t} icon="â¤ï¸â€ðŸ”¥" title="ACLS & PALS Protocols" count={PROTOS.length} color="#ef4444" />
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

        {/* Quiz History */}
        {qHist.length > 0 && <div style={{ marginTop: "8px" }}>
          <SL t={t} icon="ðŸ“Š" title="Quiz History" count={qHist.length} />
          {qHist.slice(-5).reverse().map((h, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", background: t.bgC, borderRadius: "7px", border: `1px solid ${t.bd}`, marginBottom: "5px", fontSize: "12px" }}>
              <span>{h.label} <span style={{ color: t.tM, marginLeft: "6px" }}>{h.d}</span></span>
              <span style={{ fontWeight: 700, color: h.c / h.t >= 0.8 ? t.ok : t.wn }}>{h.c}/{h.t}</span>
            </div>
          ))}
        </div>}
      </div>}

      {/* â”€â”€ STUDY SHEETS PAGE â”€â”€ */}
      {pg === "pg-meds" && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <span style={{ fontSize: "24px" }}>ðŸ“‹</span>
          <div><h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>Study Sheets</h2><p style={{ margin: "2px 0 0", color: t.tM, fontSize: "13px" }}>{allItems.length} medication{allItems.length !== 1 ? "s" : ""} loaded</p></div>
        </div>
        <SL t={t} icon="ðŸ’Š" title="Medications" count={MEDS.length} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "24px" }}>
          {MEDS.map(i => <ItemCard key={i.id} item={i} t={t} conf={conf[i.id]} onConf={v => setConf(p => ({ ...p, [i.id]: v }))} onOpen={() => nav(i)} />)}
          <PH t={t} text="More medications coming..." />
        </div>
        <SL t={t} icon="ðŸ”§" title="Devices" count={0} />
        <div style={{ marginBottom: "24px" }}><PH t={t} text="Ask about arterial lines, vents, EVDs..." /></div>
        <SL t={t} icon="ðŸ“–" title="Physiology Concepts" count={0} />
        <div style={{ marginBottom: "24px" }}><PH t={t} text="Ask about Frank-Starling, MAC, Oâ‚‚-Hb curve..." /></div>
      </div>}

      {/* â”€â”€ ACLS PROTOCOLS PAGE â”€â”€ */}
      {pg === "pg-acls" && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <span style={{ fontSize: "24px" }}>â¤ï¸â€ðŸ”¥</span>
          <div><h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>ACLS & PALS Protocols</h2><p style={{ margin: "2px 0 0", color: t.tM, fontSize: "13px" }}>{PROTOS.length} algorithm{PROTOS.length !== 1 ? "s" : ""} loaded â€” ACLS, PALS, & Special Circumstances</p></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "12px" }}>
          {PROTOS.map(p => <ProtoCard key={p.id} p={p} t={t} conf={conf[p.id]} onConf={v => setConf(prev => ({ ...prev, [p.id]: v }))} onOpen={() => oPro(p)} />)}
        </div>
      </div>}

      {/* â”€â”€ QUIZZES PAGE â”€â”€ */}
      {pg === "pg-quiz" && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <span style={{ fontSize: "24px" }}>â“</span>
          <div><h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>Quizzes</h2><p style={{ margin: "2px 0 0", color: t.tM, fontSize: "13px" }}>{Object.keys(QUIZZES).length} quiz bank{Object.keys(QUIZZES).length !== 1 ? "s" : ""} available</p></div>
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
          <SL t={t} icon="ðŸ“Š" title="Quiz History" count={qHist.length} />
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
          {!qRev ? <button onClick={() => setQRev(true)} style={{ background: t.ac, color: t.acTx, border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Reveal Answer <span style={{ opacity: 0.6, fontSize: "11px" }}>(Space)</span></button>
            : <>
              <div style={{ padding: "14px", background: t.bgS, borderRadius: "8px", border: `1px solid ${t.bd}`, marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: t.ac, fontWeight: 600, marginBottom: "4px", textTransform: "uppercase" }}>Answer</div>
                <p style={{ fontSize: "13px", lineHeight: 1.8, margin: 0 }}>{QUIZZES[qCat].items[qIdx].a}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => nxtQ(true)} style={{ flex: 1, background: `${t.ok}10`, border: `2px solid ${t.ok}`, borderRadius: "8px", padding: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: t.ok }}>âœ“ Got it</button>
                <button onClick={() => nxtQ(false)} style={{ flex: 1, background: `${t.dg}08`, border: `2px solid ${t.dg}`, borderRadius: "8px", padding: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: t.dg }}>âœ— Review</button>
              </div>
            </>}
        </div>
        <div style={{ textAlign: "center", marginTop: "10px", color: t.tM, fontSize: "11px" }}>Score: {qSc.c}/{qSc.t}</div>
      </div>}

      {/* QUIZ RESULTS */}
      {pg === "qres" && <div style={{ maxWidth: "420px", margin: "0 auto", padding: "56px 16px", textAlign: "center" }}>
        <div style={{ fontSize: "44px", marginBottom: "12px" }}>{qSc.c / qSc.t >= 0.8 ? "ðŸŽ‰" : "ðŸ“š"}</div>
        <h2 style={{ margin: "0 0 20px", fontSize: "22px" }}>Quiz Complete</h2>
        <div style={{ fontSize: "48px", fontWeight: 700, color: qSc.c / qSc.t >= 0.8 ? t.ok : t.wn }}>{qSc.c}/{qSc.t}</div>
        <p style={{ color: t.tM, margin: "6px 0 28px" }}>{Math.round(qSc.c / qSc.t * 100)}% correct</p>
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <button onClick={() => sQuiz(qCat)} style={{ background: t.ac, color: t.acTx, border: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}>Retry</button>
          <button onClick={() => setPg("dash")} style={{ background: t.bgS, color: t.tx, border: `1px solid ${t.bd}`, borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}>Dashboard</button>
        </div>
      </div>}
    </div>
  );
}

// â”€â”€ CARD COMPONENTS â”€â”€
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
      {stars > 0 && <span style={{ color: t.wn, fontSize: "11px" }}>{"â˜…".repeat(stars)}</span>}
    </button>
  );
}

// â”€â”€ MED DETAIL â”€â”€
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
    s.push({ t: "Warnings", c: item.warn.map(w => `<div class="bx ${w.tp === "bb" ? "bxd" : w.tp === "cau" ? "bxw" : ""}">${w.tp === "bb" ? "<strong>â¬› BLACK BOX â€” " : "<strong>"}${w.ti}</strong><br/>${w.tx}</div>`).join("") });
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
            <button onClick={makePDF} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "8px", padding: "7px 14px", cursor: "pointer", color: t.t2, fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>ðŸ“„ PDF</button>
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
          <h4 style={{ color: w.tp === "bb" ? t.dg : w.tp === "cau" ? t.wn : t.tx, margin: "0 0 4px", fontSize: "14px" }}>{w.tp === "bb" ? "â¬› BLACK BOX â€” " : w.tp === "cau" ? "âš ï¸ " : "ðŸš« "}{w.ti}</h4>
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
          <h4 style={{ color: t.ac, margin: "0 0 10px", fontSize: "14px" }}>ðŸŽ¯ Interview Follow-Ups</h4>
          {item.intQs.map((q, i) => <div key={i} style={{ marginBottom: i < item.intQs.length - 1 ? "10px" : 0 }}>
            <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: "13px", lineHeight: 1.6 }}>"{q.q}"</p>
            <p style={{ margin: 0, color: t.tM, fontSize: "13px", lineHeight: 1.6 }}>{q.a}</p>
          </div>)}
        </div>
      </div>}

      {tab === "diagram" && <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "14px" }}>
          <div><h3 style={{ color: t.ac, fontSize: "17px", margin: "0 0 3px" }}>{item.id === "norepinephrine" ? "Î±â‚/Î²â‚/Î±â‚‚ Adrenergic Receptor Pathways" : item.id === "vasopressin" ? "Vâ‚a / Vâ‚‚ / KATP Channel Pathways" : "GABA-A Receptor Diagram"}</h3>
            <p style={{ color: t.tM, margin: 0, fontSize: "12px" }}>{item.id === "norepinephrine" ? "NE binding â†’ Gq/Gs/Gi cascades â†’ vasoconstriction + inotropy + autoregulation" : item.id === "vasopressin" ? "AVP binding â†’ Vâ‚a/Gq vasoconstriction + KATP closure + Vâ‚‚/Gs antidiuresis" : "Propofol binding â†’ Clâ» influx â†’ hyperpolarization"}</p></div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={() => dlDiagram(svgRef, item.name, "jpeg")} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "7px", padding: "6px 12px", cursor: "pointer", color: t.t2, fontSize: "12px", fontWeight: 600 }}>ðŸ“· JPEG</button>
            <button onClick={() => dlDiagram(svgRef, item.name, "png")} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "7px", padding: "6px 12px", cursor: "pointer", color: t.t2, fontSize: "12px", fontWeight: 600 }}>ðŸ–¼ï¸ PNG</button>
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
          <text x="400" y="26" textAnchor="middle" fill={t.tx} fontSize="15" fontWeight="700">Norepinephrine â€” Adrenergic Receptor Signal Transduction</text>
          <text x="400" y="44" textAnchor="middle" fill={t.tM} fontSize="10">Receptor affinity: Î±â‚‚ {">"} Î±â‚ {">"} Î²â‚ {">>>"} Î²â‚‚ â€” Three parallel G-protein cascades</text>

          {/* â•â•â• COLUMN 1: Î±â‚ / Gq PATHWAY (x center ~155) â•â•â• */}
          <text x="155" y="72" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="700">Î±â‚ Receptor</text>
          <text x="155" y="86" textAnchor="middle" fill={t.tM} fontSize="9">Vascular Smooth Muscle</text>

          {/* Cell membrane band */}
          <rect x="55" y="92" width="200" height="24" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />
          <text x="60" y="108" fill={theme === "dark" ? "#b8956a" : "#8b6914"} fontSize="7" fontWeight="500">MEMBRANE</text>

          {/* Î±â‚ 7-TM receptor */}
          <rect x="120" y="88" width="70" height="32" rx="6" fill={theme === "dark" ? "#3b1111" : "#fee2e2"} stroke="#ef4444" strokeWidth="1.5" />
          <text x="155" y="108" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">Î±â‚ (7-TM)</text>

          {/* NE molecule binding */}
          <circle cx="110" cy="76" r="11" fill="#10b981" stroke="#34d399" strokeWidth="2" />
          <text x="110" y="80" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">NE</text>
          <line x1="118" y1="83" x2="125" y2="90" stroke="#34d399" strokeWidth="2" strokeDasharray="3,2" />

          {/* Gq protein */}
          <line x1="155" y1="120" x2="155" y2="135" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#arP)" />
          <rect x="120" y="136" width="70" height="22" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="155" y="151" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">Gq / Gâ‚â‚</text>

          {/* PLC */}
          <line x1="155" y1="158" x2="155" y2="172" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arO)" />
          <rect x="125" y="173" width="60" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="155" y="187" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="700">PLC</text>

          {/* PIPâ‚‚ cleavage label */}
          <text x="200" y="185" fill={t.tM} fontSize="7" fontStyle="italic">PIPâ‚‚ â†’</text>

          {/* IPâ‚ƒ and DAG split */}
          <line x1="140" y1="193" x2="115" y2="215" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arO)" />
          <line x1="170" y1="193" x2="195" y2="215" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arO)" />

          <rect x="85" y="216" width="55" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="112" y="230" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">IPâ‚ƒ</text>

          <rect x="170" y="216" width="55" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="197" y="230" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">DAG</text>

          {/* IPâ‚ƒ â†’ SR CaÂ²âº release */}
          <line x1="112" y1="236" x2="112" y2="255" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#arB)" />
          <rect x="72" y="256" width="80" height="28" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="112" y="270" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="700">SR â†’ CaÂ²âº</text>
          <text x="112" y="280" textAnchor="middle" fill="#3b82f6" fontSize="7">release to cytoplasm</text>

          {/* DAG â†’ PKC */}
          <line x1="197" y1="236" x2="197" y2="255" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arO)" />
          <rect x="172" y="256" width="50" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="197" y="270" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">PKC</text>

          {/* Converge to CaÂ²âº-Calmodulin */}
          <line x1="112" y1="284" x2="145" y2="306" stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#arB)" />
          <line x1="197" y1="276" x2="170" y2="306" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#arO)" />
          <rect x="110" y="307" width="90" height="22" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="155" y="322" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="600">CaÂ²âº-Calmodulin</text>

          {/* MLCK */}
          <line x1="155" y1="329" x2="155" y2="348" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arT)" />
          <rect x="120" y="349" width="70" height="20" rx="4" fill={theme === "dark" ? "#083344" : "#cffafe"} stroke="#06b6d4" strokeWidth="1.5" />
          <text x="155" y="363" textAnchor="middle" fill="#06b6d4" fontSize="9" fontWeight="700">MLCK</text>

          {/* Final effect: Vasoconstriction */}
          <line x1="155" y1="369" x2="155" y2="390" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arT)" />
          <rect x="85" y="391" width="140" height="32" rx="8" fill={theme === "dark" ? "#7f1d1d" : "#fecaca"} stroke="#ef4444" strokeWidth="2" />
          <text x="155" y="407" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="10" fontWeight="700">VASOCONSTRICTION</text>
          <text x="155" y="419" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="7">â†‘SVR â†’ â†‘MAP</text>


          {/* â•â•â• COLUMN 2: Î²â‚ / Gs PATHWAY (x center ~430) â•â•â• */}
          <text x="430" y="72" textAnchor="middle" fill="#3b82f6" fontSize="13" fontWeight="700">Î²â‚ Receptor</text>
          <text x="430" y="86" textAnchor="middle" fill={t.tM} fontSize="9">Cardiac Myocyte</text>

          {/* Cell membrane band */}
          <rect x="330" y="92" width="200" height="24" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />

          {/* Î²â‚ 7-TM receptor */}
          <rect x="395" y="88" width="70" height="32" rx="6" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="430" y="108" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="700">Î²â‚ (7-TM)</text>

          {/* NE molecule */}
          <circle cx="385" cy="76" r="11" fill="#10b981" stroke="#34d399" strokeWidth="2" />
          <text x="385" y="80" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">NE</text>
          <line x1="393" y1="83" x2="400" y2="90" stroke="#34d399" strokeWidth="2" strokeDasharray="3,2" />

          {/* Gs protein */}
          <line x1="430" y1="120" x2="430" y2="135" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#arP)" />
          <rect x="400" y="136" width="60" height="22" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="430" y="151" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">GsÎ±</text>

          {/* Adenylyl cyclase */}
          <line x1="430" y1="158" x2="430" y2="172" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arO)" />
          <rect x="395" y="173" width="70" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="430" y="187" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="700">Adenylyl Cyclase</text>

          {/* ATP â†’ cAMP */}
          <text x="380" y="200" fill={t.tM} fontSize="7" fontStyle="italic">ATP â†’</text>
          <line x1="430" y1="193" x2="430" y2="210" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arO)" />
          <rect x="402" y="211" width="56" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="430" y="225" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">â†‘cAMP</text>

          {/* PKA */}
          <line x1="430" y1="231" x2="430" y2="248" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#arO)" />
          <rect x="405" y="249" width="50" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="430" y="263" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">PKA</text>

          {/* PKA targets fan out */}
          <line x1="415" y1="269" x2="365" y2="295" stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#arB)" />
          <line x1="430" y1="269" x2="430" y2="295" stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#arB)" />
          <line x1="445" y1="269" x2="495" y2="295" stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#arB)" />

          {/* L-type CaÂ²âº */}
          <rect x="325" y="296" width="80" height="28" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.2" />
          <text x="365" y="310" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="600">L-type CaÂ²âº</text>
          <text x="365" y="320" textAnchor="middle" fill="#3b82f6" fontSize="7">â†‘CaÂ²âº influx</text>

          {/* RyR2 */}
          <rect x="398" y="296" width="64" height="28" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.2" />
          <text x="430" y="310" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="600">RyR2</text>
          <text x="430" y="320" textAnchor="middle" fill="#3b82f6" fontSize="7">â†‘CICR</text>

          {/* Phospholamban */}
          <rect x="470" y="296" width="75" height="28" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.2" />
          <text x="507" y="310" textAnchor="middle" fill="#3b82f6" fontSize="7" fontWeight="600">Phospholamban</text>
          <text x="507" y="320" textAnchor="middle" fill="#3b82f6" fontSize="7">â†‘SERCA2a</text>

          {/* Converge to effects */}
          <line x1="365" y1="324" x2="400" y2="350" stroke="#06b6d4" strokeWidth="1.2" markerEnd="url(#arT)" />
          <line x1="430" y1="324" x2="430" y2="350" stroke="#06b6d4" strokeWidth="1.2" markerEnd="url(#arT)" />
          <line x1="507" y1="324" x2="470" y2="350" stroke="#06b6d4" strokeWidth="1.2" markerEnd="url(#arT)" />

          {/* Inotropy + Lusitropy + Chronotropy */}
          <rect x="355" y="351" width="150" height="22" rx="5" fill={theme === "dark" ? "#083344" : "#cffafe"} stroke="#06b6d4" strokeWidth="1.5" />
          <text x="430" y="366" textAnchor="middle" fill="#06b6d4" fontSize="9" fontWeight="600">â†‘CaÂ²âº Transient Amplitude</text>

          {/* Final cardiac effects */}
          <line x1="430" y1="373" x2="430" y2="390" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#arT)" />
          <rect x="345" y="391" width="170" height="32" rx="8" fill={theme === "dark" ? "#0c2d48" : "#bfdbfe"} stroke="#3b82f6" strokeWidth="2" />
          <text x="430" y="406" textAnchor="middle" fill={theme === "dark" ? "#93c5fd" : "#1d4ed8"} fontSize="9" fontWeight="700">INOTROPY + LUSITROPY</text>
          <text x="430" y="418" textAnchor="middle" fill={theme === "dark" ? "#93c5fd" : "#1d4ed8"} fontSize="7">â†‘Contractility + â†‘Relaxation Rate</text>

          {/* If/HCN chronotropy note */}
          <line x1="455" y1="262" x2="530" y2="262" stroke={t.tM} strokeWidth="1" strokeDasharray="3,2" />
          <text x="535" y="258" fill={t.tM} fontSize="7" fontStyle="italic">Also: If/HCN channels</text>
          <text x="535" y="268" fill={t.tM} fontSize="7" fontStyle="italic">â†’ â†‘Phase 4 slope â†’ Chronotropy</text>


          {/* â•â•â• COLUMN 3: Î±â‚‚ / Gi PATHWAY (x center ~680) â•â•â• */}
          <text x="680" y="72" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="700">Î±â‚‚ Receptor</text>
          <text x="680" y="86" textAnchor="middle" fill={t.tM} fontSize="9">Presynaptic Terminal</text>

          {/* Membrane band */}
          <rect x="590" y="92" width="180" height="24" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />

          {/* Î±â‚‚ receptor */}
          <rect x="645" y="88" width="70" height="32" rx="6" fill={theme === "dark" ? "#3b1111" : "#fee2e2"} stroke="#ef4444" strokeWidth="1.5" />
          <text x="680" y="108" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">Î±â‚‚ (7-TM)</text>

          {/* NE molecule */}
          <circle cx="635" cy="76" r="11" fill="#10b981" stroke="#34d399" strokeWidth="2" />
          <text x="635" y="80" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">NE</text>
          <line x1="643" y1="83" x2="650" y2="90" stroke="#34d399" strokeWidth="2" strokeDasharray="3,2" />

          {/* Gi protein */}
          <line x1="680" y1="120" x2="680" y2="135" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#arP)" />
          <rect x="650" y="136" width="60" height="22" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="680" y="151" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">GiÎ±</text>

          {/* Inhibit AC */}
          <line x1="680" y1="158" x2="680" y2="175" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arR)" />
          <rect x="640" y="176" width="80" height="20" rx="4" fill={theme === "dark" ? "#1c0505" : "#fee2e2"} stroke="#ef4444" strokeWidth="1.2" />
          <text x="680" y="190" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="700">âŠ˜ Adenylyl Cyclase</text>

          {/* â†“cAMP */}
          <line x1="680" y1="196" x2="680" y2="213" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arR)" />
          <rect x="652" y="214" width="56" height="20" rx="4" fill={theme === "dark" ? "#1c0505" : "#fee2e2"} stroke="#ef4444" strokeWidth="1.2" />
          <text x="680" y="228" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">â†“cAMP</text>

          {/* GÎ²Î³ â†’ GIRK */}
          <line x1="710" y1="148" x2="740" y2="148" stroke={t.tM} strokeWidth="1" strokeDasharray="3,2" />
          <text x="745" y="144" fill={t.tM} fontSize="7" fontStyle="italic">GÎ²Î³ â†’ GIRK Kâº</text>
          <text x="745" y="154" fill={t.tM} fontSize="7" fontStyle="italic">â†’ hyperpolarization</text>

          {/* Negative feedback */}
          <line x1="680" y1="234" x2="680" y2="260" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arR)" />
          <rect x="610" y="261" width="140" height="32" rx="8" fill={theme === "dark" ? "#450a0a" : "#fecaca"} stroke="#ef4444" strokeWidth="2" />
          <text x="680" y="277" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="9" fontWeight="700">NEGATIVE FEEDBACK</text>
          <text x="680" y="289" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="7">â†“NE release from terminal</text>

          {/* Same target note */}
          <rect x="618" y="302" width="125" height="18" rx="4" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="680" y="314" textAnchor="middle" fill={t.tM} fontSize="7" fontStyle="italic">Same target as clonidine/dexmed</text>


          {/* â•â•â• BARORECEPTOR REFLEX ARC (bottom) â•â•â• */}
          <rect x="55" y="450" width="690" height="100" rx="10" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1.5" />
          <text x="400" y="468" textAnchor="middle" fill={t.tx} fontSize="12" fontWeight="700">BARORECEPTOR REFLEX â€” The Clinical Paradox</text>

          {/* Flow: â†‘MAP â†’ Baroreceptors â†’ â†‘CN IX/X â†’ NTS â†’ â†‘Vagal â†’ â†“HR */}
          <rect x="72" y="482" width="65" height="28" rx="5" fill={theme === "dark" ? "#7f1d1d" : "#fecaca"} stroke="#ef4444" strokeWidth="1.2" />
          <text x="104" y="497" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="8" fontWeight="600">â†‘MAP</text>
          <text x="104" y="507" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="6">(from Î±â‚)</text>

          <line x1="137" y1="496" x2="162" y2="496" stroke={t.tM} strokeWidth="1.5" markerEnd="url(#arGr)" />

          <rect x="163" y="482" width="90" height="28" rx="5" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="208" y="497" textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="600">Carotid / Aortic</text>
          <text x="208" y="506" textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="600">Baroreceptors</text>

          <line x1="253" y1="496" x2="278" y2="496" stroke={t.tM} strokeWidth="1.5" markerEnd="url(#arGr)" />

          <rect x="279" y="482" width="72" height="28" rx="5" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="315" y="497" textAnchor="middle" fill="#f59e0b" fontSize="7" fontWeight="600">â†‘CN IX / X</text>
          <text x="315" y="506" textAnchor="middle" fill="#f59e0b" fontSize="7">afferents</text>

          <line x1="351" y1="496" x2="376" y2="496" stroke={t.tM} strokeWidth="1.5" markerEnd="url(#arGr)" />

          <rect x="377" y="482" width="55" height="28" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.2" />
          <text x="404" y="500" textAnchor="middle" fill="#a855f7" fontSize="8" fontWeight="600">NTS</text>

          <line x1="432" y1="496" x2="457" y2="496" stroke={t.tM} strokeWidth="1.5" markerEnd="url(#arGr)" />

          <rect x="458" y="482" width="75" height="28" rx="5" fill={theme === "dark" ? "#0c2d48" : "#bfdbfe"} stroke="#3b82f6" strokeWidth="1.2" />
          <text x="495" y="497" textAnchor="middle" fill="#3b82f6" fontSize="7" fontWeight="600">â†‘Vagal Tone</text>
          <text x="495" y="506" textAnchor="middle" fill="#3b82f6" fontSize="7">(parasympathetic)</text>

          <line x1="533" y1="496" x2="558" y2="496" stroke={t.tM} strokeWidth="1.5" markerEnd="url(#arGr)" />

          <rect x="559" y="478" width="170" height="36" rx="8" fill={theme === "dark" ? "#14532d" : "#dcfce7"} stroke="#10b981" strokeWidth="2" />
          <text x="644" y="496" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="700">REFLEX BRADYCARDIA</text>
          <text x="644" y="508" textAnchor="middle" fill="#10b981" fontSize="7" fontWeight="500">Offsets Î²â‚ chronotropy â†’ NET HR â‰ˆ unchanged</text>

          {/* Key distinction callout */}
          <text x="400" y="540" textAnchor="middle" fill={t.tM} fontSize="8" fontWeight="500" fontStyle="italic">This reflex is WHY NE â‰  epinephrine. Epi's Î²â‚‚ vasodilation prevents the MAP spike â†’ no baroreceptor trigger â†’ tachycardia dominates.</text>


          {/* â•â•â• NET HEMODYNAMIC EFFECT â•â•â• */}
          <rect x="170" y="564" width="460" height="50" rx="10" fill={theme === "dark" ? "#052e16" : "#d1fae5"} stroke="#10b981" strokeWidth="2" />
          <text x="400" y="584" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="700">NET EFFECT: â†‘MAP + â†‘CO + â†”/â†“HR</text>
          <text x="400" y="600" textAnchor="middle" fill={theme === "dark" ? "#6ee7b7" : "#047857"} fontSize="9">Ideal vasopressor profile â€” vasoconstriction WITH cardiac output preservation</text>

          {/* Metabolism note */}
          <rect x="100" y="626" width="600" height="32" rx="6" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="400" y="641" textAnchor="middle" fill={t.tx} fontSize="9" fontWeight="600">Termination: Uptake-1 (neuronal reuptake) â†’ COMT/MAO â†’ normetanephrine â†’ VMA | tÂ½ = 2.4 min | Zero CYP450</text>
          <text x="400" y="653" textAnchor="middle" fill={t.tM} fontSize="8">Context-INSENSITIVE offset â€” no accumulation regardless of infusion duration</text>

          {/* â•â•â• LEGEND â•â•â• */}
          <rect x="55" y="672" width="690" height="76" rx="8" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="80" y="690" fill={t.tx} fontSize="9" fontWeight="600">LEGEND</text>
          <line x1="80" y1="694" x2="730" y2="694" stroke={t.bd} strokeWidth="0.5" />

          <circle cx="80" cy="710" r="5" fill="#10b981" /><text x="90" y="714" fill={t.tM} fontSize="8">Norepinephrine</text>
          <rect x="175" y="705" width="10" height="10" rx="2" fill={theme === "dark" ? "#fee2e2" : "#fee2e2"} stroke="#ef4444" strokeWidth="1" /><text x="190" y="714" fill={t.tM} fontSize="8">Î± receptors / inhibition</text>
          <rect x="310" y="705" width="10" height="10" rx="2" fill={theme === "dark" ? "#dbeafe" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1" /><text x="325" y="714" fill={t.tM} fontSize="8">Î²â‚ / ions (CaÂ²âº)</text>
          <rect x="420" y="705" width="10" height="10" rx="2" fill={theme === "dark" ? "#ede9fe" : "#ede9fe"} stroke="#a855f7" strokeWidth="1" /><text x="435" y="714" fill={t.tM} fontSize="8">G-proteins</text>
          <rect x="520" y="705" width="10" height="10" rx="2" fill={theme === "dark" ? "#fef3c7" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1" /><text x="535" y="714" fill={t.tM} fontSize="8">Second messengers</text>
          <rect x="650" y="705" width="10" height="10" rx="2" fill={theme === "dark" ? "#cffafe" : "#cffafe"} stroke="#06b6d4" strokeWidth="1" /><text x="665" y="714" fill={t.tM} fontSize="8">Effectors</text>

          <text x="80" y="736" fill={t.tM} fontSize="8">7-TM = seven-transmembrane (GPCR) | PLC = phospholipase C | IPâ‚ƒ = inositol trisphosphate | DAG = diacylglycerol | PKC/PKA = protein kinase C/A</text>
          <text x="80" y="746" fill={t.tM} fontSize="8">MLCK = myosin light chain kinase | SR = sarcoplasmic reticulum | CICR = CaÂ²âº-induced CaÂ²âº release | GIRK = G-protein inwardly rectifying Kâº channel</text>
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
          <text x="400" y="26" textAnchor="middle" fill={t.tx} fontSize="15" fontWeight="700">Vasopressin (AVP) â€” Non-Adrenergic Signal Transduction</text>
          <text x="400" y="44" textAnchor="middle" fill={t.tM} fontSize="10">Three receptor subtypes: Vâ‚a (Gq) â†’ vasoconstriction | Vâ‚‚ (Gs) â†’ antidiuresis | Vâ‚b (Gq) â†’ ACTH release</text>

          {/* â•â•â• COLUMN 1: Vâ‚a / Gq PATHWAY (x ~165) â•â•â• */}
          <text x="165" y="72" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="700">Vâ‚a Receptor</text>
          <text x="165" y="86" textAnchor="middle" fill={t.tM} fontSize="9">Vascular Smooth Muscle</text>

          {/* Membrane */}
          <rect x="55" y="92" width="220" height="24" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />
          <text x="60" y="108" fill={theme === "dark" ? "#b8956a" : "#8b6914"} fontSize="7" fontWeight="500">MEMBRANE</text>

          {/* Vâ‚a receptor */}
          <rect x="130" y="88" width="70" height="32" rx="6" fill={theme === "dark" ? "#3b1111" : "#fee2e2"} stroke="#ef4444" strokeWidth="1.5" />
          <text x="165" y="108" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">Vâ‚a (7-TM)</text>

          {/* AVP molecule */}
          <circle cx="120" cy="76" r="11" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="2" />
          <text x="120" y="80" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">AVP</text>
          <line x1="128" y1="83" x2="135" y2="90" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3,2" />

          {/* Gq */}
          <line x1="165" y1="120" x2="165" y2="135" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#avP)" />
          <rect x="130" y="136" width="70" height="22" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="165" y="151" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">Gq / Gâ‚â‚</text>

          {/* PLC */}
          <line x1="165" y1="158" x2="165" y2="172" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#avO)" />
          <rect x="135" y="173" width="60" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="165" y="187" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="700">PLC</text>

          {/* IPâ‚ƒ and DAG */}
          <line x1="150" y1="193" x2="110" y2="215" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#avO)" />
          <line x1="180" y1="193" x2="220" y2="215" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#avO)" />

          <rect x="78" y="216" width="60" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="108" y="230" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">IPâ‚ƒ</text>

          <rect x="195" y="216" width="55" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="222" y="230" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">DAG</text>

          {/* IPâ‚ƒ â†’ SR CaÂ²âº */}
          <line x1="108" y1="236" x2="108" y2="255" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#avB)" />
          <rect x="70" y="256" width="78" height="28" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="109" y="270" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="700">SR â†’ CaÂ²âº</text>
          <text x="109" y="280" textAnchor="middle" fill="#3b82f6" fontSize="7">cytoplasmic release</text>

          {/* DAG â†’ PKC */}
          <line x1="222" y1="236" x2="222" y2="255" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#avO)" />
          <rect x="197" y="256" width="50" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="222" y="270" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">PKC</text>

          {/* PKC â†’ closes KATP (branching right) */}
          <line x1="247" y1="266" x2="265" y2="266" stroke="#ef4444" strokeWidth="1.2" strokeDasharray="3,2" />
          <text x="270" y="262" fill="#ef4444" fontSize="7" fontWeight="600">CLOSES</text>
          <text x="270" y="272" fill="#ef4444" fontSize="7" fontWeight="600">KATP âœ•</text>

          {/* Converge â†’ CaÂ²âº-CaM â†’ MLCK */}
          <line x1="109" y1="284" x2="150" y2="305" stroke="#3b82f6" strokeWidth="1.2" markerEnd="url(#avB)" />
          <line x1="222" y1="276" x2="180" y2="305" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#avO)" />
          <rect x="115" y="306" width="100" height="22" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="165" y="321" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="600">CaÂ²âº-CaM â†’ MLCK</text>

          {/* Vasoconstriction */}
          <line x1="165" y1="328" x2="165" y2="348" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#avT)" />
          <rect x="90" y="349" width="150" height="34" rx="8" fill={theme === "dark" ? "#7f1d1d" : "#fecaca"} stroke="#ef4444" strokeWidth="2" />
          <text x="165" y="366" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="10" fontWeight="700">VASOCONSTRICTION</text>
          <text x="165" y="378" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="7">â†‘SVR â†’ â†‘MAP (non-adrenergic)</text>

          {/* Efferent > Afferent note */}
          <rect x="65" y="392" width="200" height="20" rx="4" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="165" y="406" textAnchor="middle" fill={t.tM} fontSize="7" fontStyle="italic">Efferent arteriole {">"}{">>"} Afferent â†’ â†‘GFP â†’ â†‘UOP</text>


          {/* â•â•â• COLUMN 2: Vâ‚‚ / Gs PATHWAY (x ~440) â•â•â• */}
          <text x="440" y="72" textAnchor="middle" fill="#3b82f6" fontSize="13" fontWeight="700">Vâ‚‚ Receptor</text>
          <text x="440" y="86" textAnchor="middle" fill={t.tM} fontSize="9">Renal Collecting Duct</text>

          {/* Membrane */}
          <rect x="340" y="92" width="200" height="24" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />

          {/* Vâ‚‚ receptor */}
          <rect x="405" y="88" width="70" height="32" rx="6" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="440" y="108" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="700">Vâ‚‚ (7-TM)</text>

          {/* AVP */}
          <circle cx="395" cy="76" r="11" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="2" />
          <text x="395" y="80" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">AVP</text>
          <line x1="403" y1="83" x2="410" y2="90" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3,2" />

          {/* Gs */}
          <line x1="440" y1="120" x2="440" y2="135" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#avP)" />
          <rect x="410" y="136" width="60" height="22" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="440" y="151" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">GsÎ±</text>

          {/* AC â†’ cAMP */}
          <line x1="440" y1="158" x2="440" y2="172" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#avO)" />
          <rect x="405" y="173" width="70" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="440" y="187" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="700">Adenylyl Cyclase</text>

          <line x1="440" y1="193" x2="440" y2="210" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#avO)" />
          <rect x="412" y="211" width="56" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.5" />
          <text x="440" y="225" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">â†‘cAMP</text>

          {/* PKA */}
          <line x1="440" y1="231" x2="440" y2="248" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#avO)" />
          <rect x="415" y="249" width="50" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1.2" />
          <text x="440" y="263" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">PKA</text>

          {/* AQP2 translocation */}
          <line x1="440" y1="269" x2="440" y2="295" stroke="#3b82f6" strokeWidth="1.5" markerEnd="url(#avB)" />
          <rect x="390" y="296" width="100" height="30" rx="5" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="440" y="311" textAnchor="middle" fill="#3b82f6" fontSize="8" fontWeight="700">AQP2 â†’ Apical</text>
          <text x="440" y="322" textAnchor="middle" fill="#3b82f6" fontSize="7">Membrane Insertion</text>

          {/* Water reabsorption */}
          <line x1="440" y1="326" x2="440" y2="348" stroke="#06b6d4" strokeWidth="1.5" markerEnd="url(#avT)" />
          <rect x="365" y="349" width="150" height="34" rx="8" fill={theme === "dark" ? "#0c2d48" : "#bfdbfe"} stroke="#3b82f6" strokeWidth="2" />
          <text x="440" y="366" textAnchor="middle" fill={theme === "dark" ? "#93c5fd" : "#1d4ed8"} fontSize="10" fontWeight="700">WATER REABSORPTION</text>
          <text x="440" y="378" textAnchor="middle" fill={theme === "dark" ? "#93c5fd" : "#1d4ed8"} fontSize="7">â†‘Urine concentration + â†“Free water excretion</text>

          {/* vWF / Factor VIII note */}
          <rect x="365" y="392" width="150" height="20" rx="4" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="440" y="406" textAnchor="middle" fill={t.tM} fontSize="7" fontStyle="italic">Endothelial Vâ‚‚: â†‘vWF + Factor VIII (DDAVP basis)</text>


          {/* â•â•â• COLUMN 3: Vâ‚b (small) + KATP detail (x ~680) â•â•â• */}
          <text x="680" y="72" textAnchor="middle" fill="#a855f7" fontSize="13" fontWeight="700">Vâ‚b Receptor</text>
          <text x="680" y="86" textAnchor="middle" fill={t.tM} fontSize="9">Anterior Pituitary</text>

          {/* Membrane */}
          <rect x="590" y="92" width="180" height="24" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />

          {/* Vâ‚b receptor */}
          <rect x="645" y="88" width="70" height="32" rx="6" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="680" y="108" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">Vâ‚b (7-TM)</text>

          {/* AVP */}
          <circle cx="635" cy="76" r="11" fill="#8b5cf6" stroke="#a78bfa" strokeWidth="2" />
          <text x="635" y="80" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700">AVP</text>
          <line x1="643" y1="83" x2="650" y2="90" stroke="#a78bfa" strokeWidth="2" strokeDasharray="3,2" />

          {/* Gq â†’ ACTH */}
          <line x1="680" y1="120" x2="680" y2="135" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#avP)" />
          <rect x="650" y="136" width="60" height="22" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="680" y="151" textAnchor="middle" fill="#a855f7" fontSize="10" fontWeight="700">Gq</text>

          <line x1="680" y1="158" x2="680" y2="176" stroke="#a855f7" strokeWidth="1.5" markerEnd="url(#avP)" />
          <rect x="640" y="177" width="80" height="22" rx="5" fill={theme === "dark" ? "#2e1065" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="680" y="192" textAnchor="middle" fill="#a855f7" fontSize="9" fontWeight="600">PLC â†’ CaÂ²âº</text>

          <line x1="680" y1="199" x2="680" y2="218" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#avO)" />
          <rect x="625" y="219" width="110" height="32" rx="8" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke="#f59e0b" strokeWidth="2" />
          <text x="680" y="236" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="700">ACTH Secretion</text>
          <text x="680" y="247" textAnchor="middle" fill="#f59e0b" fontSize="7">â†’ Cortisol from adrenals</text>

          {/* Stress response note */}
          <rect x="618" y="260" width="125" height="18" rx="4" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="680" y="272" textAnchor="middle" fill={t.tM} fontSize="7" fontStyle="italic">Links VP to HPA axis / stress response</text>


          {/* â•â•â• KATP CHANNEL MECHANISM BOX (bottom-right) â•â•â• */}
          <rect x="560" y="300" width="215" height="112" rx="8" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1.5" />
          <text x="667" y="318" textAnchor="middle" fill={t.tx} fontSize="10" fontWeight="700">KATP Channel Mechanism</text>
          <line x1="575" y1="324" x2="760" y2="324" stroke={t.bd} strokeWidth="0.5" />
          <text x="575" y="340" fill="#ef4444" fontSize="8" fontWeight="600">In Septic Shock:</text>
          <text x="575" y="352" fill={t.tM} fontSize="7">â†“ATP + â†‘Hâº + â†‘NO â†’ KATP OPEN</text>
          <text x="575" y="364" fill={t.tM} fontSize="7">â†’ Kâº efflux â†’ hyperpolarization</text>
          <text x="575" y="376" fill={t.tM} fontSize="7">â†’ VGCCs stuck closed â†’ vasoplegia</text>
          <text x="575" y="392" fill="#10b981" fontSize="8" fontWeight="600">Vasopressin Rescue:</text>
          <text x="575" y="404" fill="#10b981" fontSize="7">Vâ‚a â†’ PKC â†’ CLOSES KATP â†’ restores</text>
          <text x="704" y="404" fill="#10b981" fontSize="7">CaÂ²âº entry</text>


          {/* â•â•â• NET EFFECT â•â•â• */}
          <rect x="55" y="440" width="690" height="55" rx="10" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1.5" />
          <text x="400" y="460" textAnchor="middle" fill={t.tx} fontSize="12" fontWeight="700">WHY VASOPRESSIN WORKS WHEN CATECHOLAMINES FAIL</text>
          <text x="400" y="478" textAnchor="middle" fill={t.tM} fontSize="9">Non-adrenergic pathway | Vâ‚a receptors maintain affinity in acidosis | Closes KATP channels directly via PKC</text>
          <text x="400" y="490" textAnchor="middle" fill={t.tM} fontSize="9">No pulmonary vasoconstriction | Efferent {">"} Afferent renal vasoconstriction â†’ preserves GFR | Inhibits iNOS</text>

          {/* â•â•â• NET HEMODYNAMIC â•â•â• */}
          <rect x="170" y="510" width="460" height="50" rx="10" fill={theme === "dark" ? "#1e1b4b" : "#e0e7ff"} stroke="#8b5cf6" strokeWidth="2" />
          <text x="400" y="530" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="700">NET: â†‘MAP + â†”CO + â†”HR + â†‘UOP</text>
          <text x="400" y="546" textAnchor="middle" fill={theme === "dark" ? "#c4b5fd" : "#6d28d9"} fontSize="9">Non-adrenergic vasopressor â€” catecholamine-sparing â€” pulmonary-sparing</text>

          {/* Metabolism note */}
          <rect x="100" y="574" width="600" height="28" rx="6" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="400" y="589" textAnchor="middle" fill={t.tx} fontSize="9" fontWeight="600">Metabolism: Hepatic/renal peptidases (serine protease, carboxypeptidase) | tÂ½ = 10â€“20 min | Zero CYP450 | Not COMT/MAO</text>
          <text x="400" y="599" textAnchor="middle" fill={t.tM} fontSize="8">Deficiency in sepsis: posterior pituitary stores deplete within 24â€“48h â†’ exogenous VP = hormone replacement</text>

          {/* â•â•â• LEGEND â•â•â• */}
          <rect x="55" y="618" width="690" height="68" rx="8" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="80" y="636" fill={t.tx} fontSize="9" fontWeight="600">LEGEND</text>
          <line x1="80" y1="640" x2="730" y2="640" stroke={t.bd} strokeWidth="0.5" />

          <circle cx="80" cy="656" r="5" fill="#8b5cf6" /><text x="90" y="660" fill={t.tM} fontSize="8">Vasopressin (AVP)</text>
          <rect x="185" y="651" width="10" height="10" rx="2" fill={theme === "dark" ? "#fee2e2" : "#fee2e2"} stroke="#ef4444" strokeWidth="1" /><text x="200" y="660" fill={t.tM} fontSize="8">Vâ‚a (vasoconstriction)</text>
          <rect x="320" y="651" width="10" height="10" rx="2" fill={theme === "dark" ? "#dbeafe" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1" /><text x="335" y="660" fill={t.tM} fontSize="8">Vâ‚‚ (antidiuresis)</text>
          <rect x="445" y="651" width="10" height="10" rx="2" fill={theme === "dark" ? "#ede9fe" : "#ede9fe"} stroke="#a855f7" strokeWidth="1" /><text x="460" y="660" fill={t.tM} fontSize="8">Vâ‚b / G-proteins</text>
          <rect x="570" y="651" width="10" height="10" rx="2" fill={theme === "dark" ? "#fef3c7" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1" /><text x="585" y="660" fill={t.tM} fontSize="8">2nd messengers</text>

          <text x="80" y="678" fill={t.tM} fontSize="8">7-TM = GPCR | PLC = phospholipase C | IPâ‚ƒ/DAG = 2nd messengers | PKC/PKA = protein kinases | AQP2 = aquaporin-2 | KATP = ATP-sensitive Kâº channel | vWF = von Willebrand factor</text>
        </svg>
        ) : (
        <svg ref={svgRef} viewBox="0 0 800 580" style={{ width: "100%", maxWidth: "800px", background: theme === "dark" ? "#0d1117" : "#f8fafc", borderRadius: "10px", border: `1px solid ${t.bd}` }}>
          <text x="400" y="30" textAnchor="middle" fill={t.tx} fontSize="15" fontWeight="600">Propofol at GABA-A Receptor</text>
          <rect x="50" y="200" width="700" height="70" rx="6" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.5" />
          <text x="65" y="238" fill={theme === "dark" ? "#b8956a" : "#8b6914"} fontSize="10">CELL MEMBRANE</text>
          <text x="680" y="192" fill={t.tM} fontSize="10" fontStyle="italic">Extracellular</text>
          <text x="680" y="288" fill={t.tM} fontSize="10" fontStyle="italic">Intracellular</text>
          <rect x="340" y="188" width="60" height="96" rx="4" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke={t.bl} strokeWidth="1.5" />
          <text x="370" y="242" textAnchor="middle" fill={t.bl} fontSize="9" fontWeight="500">Clâ» PORE</text>
          <rect x="268" y="198" width="76" height="76" rx="38" fill={theme === "dark" ? "#122040" : "#dbeafe"} stroke="#60a5fa" strokeWidth="1.5" />
          <text x="306" y="240" textAnchor="middle" fill="#60a5fa" fontSize="14" fontWeight="700">Î±</text>
          <rect x="295" y="152" width="66" height="52" rx="26" fill={theme === "dark" ? "#231530" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="328" y="182" textAnchor="middle" fill="#a855f7" fontSize="14" fontWeight="700">Î²</text>
          <rect x="365" y="146" width="50" height="46" rx="23" fill={theme === "dark" ? "#0f2918" : "#dcfce7"} stroke="#4ade80" strokeWidth="1.5" />
          <text x="390" y="174" textAnchor="middle" fill="#4ade80" fontSize="14" fontWeight="700">Î³</text>
          <rect x="405" y="152" width="66" height="52" rx="26" fill={theme === "dark" ? "#231530" : "#ede9fe"} stroke="#a855f7" strokeWidth="1.5" />
          <text x="438" y="182" textAnchor="middle" fill="#a855f7" fontSize="14" fontWeight="700">Î²</text>
          <rect x="404" y="198" width="76" height="76" rx="38" fill={theme === "dark" ? "#122040" : "#dbeafe"} stroke="#60a5fa" strokeWidth="1.5" />
          <text x="442" y="240" textAnchor="middle" fill="#60a5fa" fontSize="14" fontWeight="700">Î±</text>
          <circle cx="280" cy="155" r="14" fill="#10b981" stroke="#34d399" strokeWidth="2" /><text x="280" y="159" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">PROP</text>
          <line x1="288" y1="165" x2="302" y2="170" stroke="#34d399" strokeWidth="2" strokeDasharray="4,3" />
          <circle cx="480" cy="155" r="14" fill="#10b981" stroke="#34d399" strokeWidth="2" /><text x="480" y="159" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="700">PROP</text>
          <line x1="472" y1="165" x2="458" y2="170" stroke="#34d399" strokeWidth="2" strokeDasharray="4,3" />
          <line x1="260" y1="218" x2="210" y2="120" stroke={t.wn} strokeWidth="1" strokeDasharray="3,3" />
          <rect x="130" y="107" width="82" height="20" rx="4" fill={theme === "dark" ? "#422006" : "#fef3c7"} stroke={t.wn} strokeWidth="1" /><text x="171" y="121" textAnchor="middle" fill={t.wn} fontSize="9" fontWeight="500">GABA site (Î±-Î²)</text>
          <line x1="280" y1="141" x2="190" y2="80" stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />
          <rect x="95" y="67" width="100" height="20" rx="4" fill={theme === "dark" ? "#052e16" : "#dcfce7"} stroke="#10b981" strokeWidth="1" /><text x="145" y="81" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="500">Propofol (Î² TM2/3)</text>
          <defs><marker id="ar" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill={t.bl} /></marker></defs>
          <circle cx="362" cy="118" r="7" fill="none" stroke={t.bl} strokeWidth="1.5" /><text x="362" y="122" textAnchor="middle" fill={t.bl} fontSize="7" fontWeight="600">Clâ»</text>
          <line x1="370" y1="130" x2="370" y2="305" stroke={t.bl} strokeWidth="2" markerEnd="url(#ar)" />
          <circle cx="358" cy="320" r="7" fill="none" stroke={t.bl} strokeWidth="1.5" /><text x="358" y="324" textAnchor="middle" fill={t.bl} fontSize="7" fontWeight="600">Clâ»</text>
          <rect x="260" y="360" width="220" height="65" rx="8" fill={theme === "dark" ? "#0c1a30" : "#eff6ff"} stroke={t.bl} strokeWidth="1.5" />
          <text x="370" y="382" textAnchor="middle" fill={t.bl} fontSize="12" fontWeight="600">HYPERPOLARIZATION</text>
          <text x="370" y="398" textAnchor="middle" fill={t.t2} fontSize="10">âˆ’70 mV â†’ âˆ’85 mV</text>
          <text x="370" y="414" textAnchor="middle" fill={t.dg} fontSize="10" fontWeight="500">Action potential blocked</text>
          <line x1="370" y1="425" x2="370" y2="450" stroke={t.tM} strokeWidth="1" strokeDasharray="4,3" />
          <rect x="250" y="450" width="240" height="35" rx="8" fill={theme === "dark" ? "#14532d" : "#dcfce7"} stroke={t.ok} strokeWidth="1.5" />
          <text x="370" y="472" textAnchor="middle" fill={t.ok} fontSize="10" fontWeight="600">Sedation â†’ Amnesia â†’ LOC</text>
          <rect x="555" y="340" width="185" height="90" rx="8" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="647" y="358" textAnchor="middle" fill={t.tx} fontSize="10" fontWeight="600">Clâ» Channel Modulation</text>
          <line x1="570" y1="365" x2="725" y2="365" stroke={t.bd} strokeWidth="1" />
          <text x="570" y="382" fill="#10b981" fontSize="9">Propofol: â†‘ duration + direct gate</text>
          <text x="570" y="398" fill="#10b981" fontSize="9">Barbs: â†‘ duration + direct gate</text>
          <text x="570" y="414" fill={t.wn} fontSize="9">BZDs: â†‘ frequency, NO direct gate</text>
          <rect x="50" y="520" width="700" height="38" rx="6" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <circle cx="80" cy="539" r="5" fill="#10b981" /><text x="90" y="543" fill={t.tM} fontSize="9">Propofol</text>
          <circle cx="165" cy="539" r="5" fill="none" stroke={t.bl} strokeWidth="1.5" /><text x="175" y="543" fill={t.tM} fontSize="9">Clâ»</text>
          <rect x="225" y="534" width="10" height="10" rx="5" fill="none" stroke="#60a5fa" strokeWidth="1" /><text x="240" y="543" fill={t.tM} fontSize="9">Î± subunit</text>
          <rect x="305" y="534" width="10" height="10" rx="5" fill="none" stroke="#a855f7" strokeWidth="1" /><text x="320" y="543" fill={t.tM} fontSize="9">Î² subunit</text>
          <rect x="395" y="534" width="10" height="10" rx="5" fill="none" stroke="#4ade80" strokeWidth="1" /><text x="410" y="543" fill={t.tM} fontSize="9">Î³ subunit</text>
        </svg>
        )}
      </div>}
    </div>
  </div>;
}

// â”€â”€ PROTOCOL DETAIL â”€â”€
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
            {p.ahaPdf && <a href={p.ahaPdf} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "5px", background: "#c8102e", borderRadius: "6px", padding: "5px 10px", color: "#fff", fontSize: "11px", fontWeight: 700, textDecoration: "none", letterSpacing: "0.3px" }}>AHA {p.ahaYear} PDF â†—</a>}
            <button onClick={makePDF} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "8px", padding: "7px 14px", cursor: "pointer", color: t.t2, fontSize: "12px", fontWeight: 600 }}>ðŸ“„ PDF</button>
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

      <h3 style={{ color: t.ac, fontSize: "17px", margin: "24px 0 12px" }}>ðŸŽ¯ Key Points</h3>
      {p.keys.map((k, i) => (
        <div key={i} style={{ padding: "10px 12px", background: t.bgS, borderRadius: "7px", border: `1px solid ${t.bd}`, marginBottom: "6px", fontSize: "13px", lineHeight: 1.7, color: t.t2 }}>
          <span style={{ color: p.clr, fontWeight: 700, marginRight: "8px" }}>â€¢</span>{k}
        </div>
      ))}

      {/* â”€â”€ AHA OFFICIAL PDF SECTION â”€â”€ */}
      {p.ahaPdf && <div style={{ marginTop: "28px" }}>
        <h3 style={{ color: t.ac, fontSize: "17px", margin: "0 0 12px" }}>ðŸ“‹ Official AHA Algorithm</h3>
        <div style={{ background: theme === "dark" ? "#0c1a2e" : "#f0f9ff", border: `1px solid ${theme === "dark" ? "#1e3a5f" : "#bae6fd"}`, borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#c8102e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "15px", fontWeight: 800, lineHeight: 1.1, textAlign: "center" }}>AHA</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>{p.name}</div>
            <div style={{ fontSize: "12px", color: t.tM }}>Â© {p.ahaYear} American Heart Association â€” Official Algorithm PDF</div>
            <div style={{ fontSize: "11px", color: t.tM, marginTop: "2px" }}>Source: cpr.heart.org â€¢ {p.ahaYear} AHA Guidelines for CPR & ECC</div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <a href={p.ahaPdf} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", background: theme === "dark" ? "#1e3a5f" : "#e0f2fe", border: `1px solid ${theme === "dark" ? "#2d5a8e" : "#7dd3fc"}`, borderRadius: "8px", padding: "10px 20px", cursor: "pointer", color: t.tx, fontSize: "13px", fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}>
              ðŸ”— View Algorithm
            </a>
            <a href={p.ahaPdf} download style={{ display: "flex", alignItems: "center", gap: "6px", background: "#c8102e", border: "1px solid #c8102e", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", color: "#fff", fontSize: "13px", fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}>
              â¬‡ Download PDF
            </a>
          </div>
        </div>
      </div>}

      <NotesBox notes={notes} setNotes={setNotes} t={t} />
    </div>
  </div>;
}

// â”€â”€ NOTES COMPONENT â”€â”€
function NotesBox({ notes, setNotes, t }) {
  const [open, setOpen] = useState(!!notes);
  return (
    <div style={{ marginTop: "24px" }}>
      <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: t.ac, fontSize: "13px", fontWeight: 600, padding: 0, display: "flex", alignItems: "center", gap: "6px" }}>
        {open ? "â–¾" : "â–¸"} My Notes
      </button>
      {open && <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add your own notes here..." style={{ width: "100%", minHeight: "100px", marginTop: "8px", padding: "12px", background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "8px", color: t.tx, fontSize: "13px", lineHeight: 1.7, resize: "vertical", fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} />}
    </div>
  );
}
