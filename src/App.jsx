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
  tags: ["Vasopressor", "Catecholamine", "Î± Agonist", "Sympathomimetic"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Endogenous catecholamine / direct-acting sympathomimetic", "Primary Targets": "Î± > Î±â‚‚ > Î² >> Î²â‚‚ adrenergic receptors", "Action": "Full agonist at Î± and Î² negligible Î²â‚‚", "Net Effect": "â†‘SVR (vasoconstriction) + preserved CO (inotropy) Â± reflex â†“HR", "Formulation": "4 mg/4 mL concentrate â†’ dilute in D5W", "First-Line": "Septic shock (SSC 2021 â€” strong recommendation)" },
  moa: `Norepinephrine is an endogenous catecholamine and direct-acting sympathomimetic with the receptor affinity hierarchy Î±â‚‚ > Î± > Î² >> Î²â‚‚. This profile delivers potent vasoconstriction with cardiac output preservation â€” the ideal hemodynamic response for distributive shock.

At the Î± receptor (Gq-coupled), NE activates PLC â†’ IPâ‚ƒ + DAG â†’ intracellular CaÂ²âº release from SR + PKC activation â†’ MLCK-mediated smooth muscle contraction â†’ vasoconstriction. Vascular beds most affected: splanchnic > cutaneous > renal > skeletal muscle. Cerebral circulation is relatively protected by autoregulation.

At the Î² receptor (Gs-coupled), NE activates adenylyl cyclase â†’ â†‘cAMP â†’ PKA â†’ phosphorylation of L-type CaÂ²âº channels (â†‘CaÂ²âº influx = inotropy), RyR2 (enhanced CICR), and phospholamban (faster relaxation = lusitropy). Direct chronotropic effect via If/HCN channels in SA node.

THE BARORECEPTOR PARADOX: NE's dominant Î± effect raises MAP â†’ carotid/aortic baroreceptors â†’ â†‘vagal tone â†’ REFLEX BRADYCARDIA offsets the direct Î² chronotropic effect. Net HR often stays the same or decreases. This fundamentally distinguishes NE from epinephrine and dobutamine, which reliably increase HR.

NE has ~10-fold selectivity for Î² over Î²â‚‚ (Xu et al., Cell Research 2021). The structural basis: identical orthosteric binding pockets but different extracellular vestibule entry pathways â€” NE (lacking epinephrine's N-methyl group) enters Î² 30â€“60Ã— faster than Î²â‚‚.`,
  recPhys: `Î± PATHWAY (Gq â†’ PLC â†’ IPâ‚ƒ/DAG):
Step 1 â€” NE binds postsynaptic Î± receptor â†’ Gq/G protein activates phospholipase C (PLC).
Step 2 â€” PLC cleaves PIPâ‚‚ â†’ IPâ‚ƒ + DAG. IPâ‚ƒ binds SR receptors â†’ CaÂ²âº floods cytoplasm.
Step 3 â€” DAG activates PKC â†’ sensitizes contractile apparatus to CaÂ²âº, inhibits KATP channels â†’ depolarization â†’ additional CaÂ²âº entry via L-type channels.
Step 4 â€” CaÂ²âº-calmodulin â†’ MLCK â†’ phosphorylates myosin light chains â†’ smooth muscle contraction â†’ VASOCONSTRICTION.

Î² PATHWAY (Gs â†’ adenylyl cyclase â†’ cAMP):
Step 1 â€” NE binds cardiac Î² â†’ Gs activates adenylyl cyclase â†’ â†‘cAMP â†’ PKA.
Step 2 â€” PKA phosphorylates: (a) L-type CaÂ²âº channels â†’ â†‘CaÂ²âº influx = INOTROPY; (b) RyR2 â†’ enhanced CaÂ²âº-induced CaÂ²âº release; (c) phospholamban â†’ disinhibits SERCA2a â†’ faster CaÂ²âº reuptake = LUSITROPY; (d) If/HCN channels â†’ faster phase 4 depolarization = CHRONOTROPY.

Î±â‚‚ PRESYNAPTIC BRAKE (Gi â†’ â†“cAMP):
NE simultaneously activates Î±â‚‚ autoreceptors on presynaptic nerve terminals â†’ Gi inhibits adenylyl cyclase â†’ â†“cAMP â†’ GÎ²Î³ opens GIRK Kâº channels â†’ hyperpolarization â†’ NEGATIVE FEEDBACK limiting further NE release. This self-limiting mechanism prevents runaway sympathetic activation. Same target as clonidine/dexmedetomidine.

KEY COMPARISONS:
â€¢ vs. EPINEPHRINE: Epi has equipotent Î²â‚‚ â†’ dose-dependent vasodilation (low dose), bronchodilation, more tachycardia/arrhythmias, lactic acidosis. NE has no biphasic behavior.
â€¢ vs. VASOPRESSIN: Non-adrenergic (V pathway). Maintains function in acidosis. No inotropy/chronotropy. Preferential EFFERENT arteriolar constriction (may preserve GFR). Also inhibits KATP channels directly.
â€¢ vs. PHENYLEPHRINE: Pure Î± only â€” raises SVR but may â†“CO (no Î² support). Reflex bradycardia without compensatory inotropy.`,
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
    { tp: "bb", ti: "Extravasation â†’ Tissue Necrosis", tx: "Intense Î± vasoconstriction â†’ ischemia â†’ necrosis â†’ gangrene. RESCUE: Phentolamine 5â€“10 mg in 10â€“15 mL NS, infiltrate SC with 25G needle throughout ischemic area. Most effective within 12h. May repeat. Warm compresses (NOT cold)." },
    { tp: "ci", ti: "Mesenteric/Peripheral Vascular Disease", tx: "Use with extreme caution â€” â†‘risk digital ischemia, bowel ischemia. Monitor lactate, abdominal exam, extremity perfusion." },
    { tp: "cau", ti: "MAOI Interaction (CRITICAL)", tx: "MAOIs (phenelzine, tranylcypromine, LINEZOLID) block MAO â†’ impaired NE degradation â†’ SEVERE prolonged hypertensive crisis. Most dangerous interaction." },
    { tp: "cau", ti: "TCA Interaction", tx: "Block norepinephrine transporter (NET) â€” primary termination mechanism. Dramatically amplifies/prolongs NE effect â†’ severe sustained hypertension." },
    { tp: "cau", ti: "Dilution Requirement", tx: "Must dilute in D5W (dextrose-containing solutions). NE undergoes oxidation in saline-only solutions per FDA labeling." },
  ],
  ix: [
    { dr: "MAOIs / Linezolid", ef: "Blocked MAO degradation â†’ severe prolonged hypertensive crisis. Most dangerous interaction.", sv: "high" },
    { dr: "TCAs", ef: "Block neuronal reuptake (Uptake-1) â†’ amplified/prolonged pressor response.", sv: "high" },
    { dr: "Non-selective Î²-blockers", ef: "Propranolol blocks Î² compensation â†’ unopposed Î± â†’ severe HTN + reflex bradycardia.", sv: "high" },
    { dr: "Halogenated Anesthetics", ef: "Myocardial sensitization to catecholamines. Lower risk with modern agents (sevo/des/iso) vs halothane.", sv: "mod" },
    { dr: "Vasopressin", ef: "Synergistic vasopression. Allows NE dose reduction (catecholamine-sparing). SSC 2021: add at NE 0.25â€“0.5 mcg/kg/min.", sv: "low" },
  ],
  pearls: [
    { ti: "Why NE over dopamine?", tx: "SOAP II (NEJM 2010, n=1679): Dopamine â†’ 2Ã— arrhythmia rate (24% vs 12%). Higher mortality in cardiogenic shock subgroup. NE is safer across all shock subtypes." },
    { ti: "NE + Vasopressin (VASST/VANISH)", tx: "VASST: add VP at NE â‰¥5 mcg/min â†’ NE-sparing, possible benefit in less severe shock. VANISH: VP â†“ need for RRT (25% vs 35%). VP works in acidosis when adrenergic receptors fail." },
    { ti: "MAP target (SEPSISPAM)", tx: "65â€“70 mmHg standard. Chronic HTN patients: 80â€“85 â†’ â†“RRT need (32% vs 42%) but â†‘afib. Individualize." },
    { ti: "Peripheral IV is safe", tx: "Yerke et al. (CHEST 2024, n=635): extravasation 5.5%, zero surgical interventions. 51.6% never needed CVC. Use â‰¥18G in antecubital fossa or above." },
    { ti: "Intraoperative paradigm shift", tx: "EPON trial (2025): prophylactic NE from induction â†’ 44% vs 58% complications. NE maintains CO better than phenylephrine (pure alpha-1) due to beta-1 inotropy." },
    { ti: "SSC 2021 Vasopressor Hierarchy", tx: "1) NE first-line â†’ 2) Add vasopressin at 0.25â€“0.5 mcg/kg/min â†’ 3) Add epinephrine â†’ 4) Dobutamine for cardiac dysfunction â†’ 5) Hydrocortisone if NE â‰¥0.25 for â‰¥4h." },
  ],
  intQs: [
    { q: "Septic shock, MAP 52 on 30L crystalloid. Next step?", a: "Start NE 0.05â€“0.1 mcg/kg/min. Titrate q5-15 min to MAP â‰¥65. Don't delay pressors for more fluid." },
    { q: "Patient on NE 0.4 mcg/kg/min, still MAP 58?", a: "Add vasopressin 0.03â€“0.04 U/min (SSC 2021 threshold: 0.25â€“0.5 mcg/kg/min). Consider hydrocortisone 200 mg/day." },
    { q: "NE extravasates into forearm. What do you do?", a: "Stop infusion. Infiltrate phentolamine 5â€“10 mg in 10â€“15 mL NS subcutaneously throughout ischemic area with 25G needle within 12h. Warm compresses. Restart NE at new proximal site." },
    { q: "Why NE over phenylephrine intraop?", a: "Phenylephrine (pure Î± raises SVR but â†“CO via reflex bradycardia without Î² compensation. NE's Î² activity preserves CO while supporting BP. EPON trial and POQI 2024 consensus support NE." },
  ],
},{
  id: "vasopressin", name: "Vasopressin (AVP)", brand: "Vasostrict",
  tags: ["Vasopressor", "Non-Catecholamine", "V Agonist", "Antidiuretic Hormone"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Endogenous nonapeptide / non-catecholamine vasopressor", "Primary Targets": "V (vascular) > V (pituitary) > Vâ‚‚ (renal)", "Action": "Full agonist â€” non-adrenergic vasoconstriction + antidiuresis", "Net Effect": "â†‘SVR (adrenergic-independent) + preserved renal perfusion + NO Î²-adrenergic effects", "Formulation": "20 units/mL â€” dilute prior to infusion", "Role": "2nd-line vasopressor in septic shock (SSC 2021); catecholamine-sparing" },
  moa: `Vasopressin (arginine vasopressin, AVP, ADH) is an endogenous nonapeptide hormone synthesized in the supraoptic and paraventricular nuclei of the hypothalamus, stored in the posterior pituitary, and released in response to hyperosmolality, hypovolemia, and hypotension.

It acts on three distinct G-protein coupled receptor subtypes â€” V V and Vâ‚‚ â€” each mediating different physiologic effects through different G-protein cascades. Critically, vasopressin's vasoconstrictor mechanism is COMPLETELY INDEPENDENT of adrenergic receptors. This is the key clinical advantage: it works when catecholamines fail.

In vasodilatory shock, vasopressin restores vascular tone through FOUR mechanisms:

1. V receptor activation (Gq â†’ PLC â†’ IPâ‚ƒ/DAG â†’ â†‘CaÂ²âº â†’ smooth muscle contraction) â€” the primary vasoconstrictor pathway. Identical downstream cascade to Î± but via a different receptor.

2. KATP channel closure â€” In septic shock, hypoxia and acidosis activate ATP-sensitive Kâº channels (KATP) â†’ Kâº efflux â†’ hyperpolarization â†’ voltage-gated CaÂ²âº channels remain closed â†’ vasoplegia (catecholamine resistance). Vasopressin closes KATP channels via PKC, restoring the ability of CaÂ²âº channels to open. This directly explains why vasopressin works in acidotic, catecholamine-resistant shock.

3. NO modulation â€” Vasopressin inhibits inducible nitric oxide synthase (iNOS) expression, reducing pathologic NO-mediated vasodilation in sepsis.

4. Potentiation of endogenous vasoconstrictors â€” Sensitizes vascular smooth muscle to catecholamines, enhancing NE effect at lower doses (catecholamine-sparing).

VASOPRESSIN DEFICIENCY IN SEPSIS: Endogenous AVP stores deplete within 24â€“48h of sustained shock due to exhaustion of posterior pituitary reserves. Serum levels paradoxically DROP to inappropriately low levels. Exogenous vasopressin replaces this deficit â€” it is "hormone replacement" as much as vasopressor therapy.`,
  recPhys: `V PATHWAY â€” Vascular Smooth Muscle (Gq â†’ PLC â†’ IPâ‚ƒ/DAG):
Step 1 â€” AVP binds V receptor (7-TM GPCR) on vascular smooth muscle â†’ Gq/G protein activates phospholipase C (PLC).
Step 2 â€” PLC cleaves PIPâ‚‚ â†’ IPâ‚ƒ + DAG. IPâ‚ƒ binds SR receptors â†’ CaÂ²âº release into cytoplasm.
Step 3 â€” DAG activates PKC â†’ (a) directly opens voltage-gated CaÂ²âº channels (VGCCs) via depolarization; (b) CLOSES KATP channels (Kir6.1/SUR2B) â†’ prevents Kâº efflux â†’ maintains depolarization â†’ CaÂ²âº entry.
Step 4 â€” CaÂ²âº-calmodulin â†’ MLCK â†’ phosphorylates myosin light chains â†’ VASOCONSTRICTION.
Location: highest V density in splanchnic, skin, skeletal muscle vasculature. Notably ABSENT in pulmonary vasculature â€” vasopressin does NOT increase PVR. Preferentially constricts EFFERENT > afferent renal arterioles â†’ â†‘GFP â†’ paradoxical increase in urine output despite being "antidiuretic hormone."

Vâ‚‚ PATHWAY â€” Renal Collecting Duct (Gs â†’ adenylyl cyclase â†’ cAMP):
Step 1 â€” AVP binds Vâ‚‚ receptor (basolateral membrane of principal cells) â†’ Gs activates adenylyl cyclase â†’ â†‘cAMP â†’ PKA.
Step 2 â€” PKA phosphorylates AQP2 vesicles â†’ AQP2 water channels translocate to apical membrane.
Step 3 â€” Water reabsorbed from tubular lumen â†’ concentrated urine, free water retention.
Also: Vâ‚‚ activation on vascular endothelium â†’ release of von Willebrand factor (vWF) + Factor VIII â†’ procoagulant effect (basis for desmopressin/DDAVP use in bleeding).

V PATHWAY â€” Anterior Pituitary (Gq â†’ PLC â†’ IPâ‚ƒ/DAG):
AVP binds V receptors on corticotroph cells â†’ same Gq cascade â†’ ACTH secretion â†’ cortisol release. This pathway links vasopressin to the stress response and explains the synergy between vasopressin and corticosteroids in septic shock.

KATP CHANNEL MECHANISM (Why vasopressin works when catecholamines fail):
In septic shock: â†“ATP + â†‘Hâº + â†‘lactate + â†‘NO â†’ KATP channels OPEN â†’ Kâº efflux â†’ smooth muscle hyperpolarization â†’ VGCCs cannot open â†’ NO CaÂ²âº entry â†’ vasoplegia. Catecholamines cannot overcome this because Î± signaling requires intact depolarization to open VGCCs. Vasopressin bypasses this entirely: V directly CLOSES KATP channels â†’ restores depolarization â†’ VGCCs can open again â†’ CaÂ²âº entry â†’ contraction restored.

ACID RESISTANCE: Unlike catecholamine receptors (Î± Î² which lose affinity in acidotic environments, V receptors maintain full binding affinity regardless of pH. Classic interview point.

KEY COMPARISONS:
â€¢ vs. NOREPINEPHRINE: NE is adrenergic-dependent (fails in acidosis/vasoplegia). NE has Î² inotropy. NE causes tachycardia risk. VP is non-adrenergic, no inotropy, no chronotropy, spares pulmonary circulation.
â€¢ vs. PHENYLEPHRINE: Both lack inotropy. But VP closes KATP channels (works in vasoplegia), PE does not. VP spares pulmonary circulation, PE does not.
â€¢ vs. EPINEPHRINE: Epi has Î² â†’ tachycardia, arrhythmia, lactic acidosis. VP has zero adrenergic effects.`,
  dosing: [
    { ind: "Septic Shock (2nd-line, SSC 2021)", dose: "0.03â€“0.04 U/min (FIXED, non-weight-based)", notes: "Add when NE 0.25â€“0.5 mcg/kg/min. Do NOT titrate above 0.04 U/min â€” higher doses â†‘ischemic risk. Not a standalone vasopressor â€” always WITH norepinephrine.", clr: "ac" },
    { ind: "Post-Cardiotomy Vasoplegia", dose: "0.01â€“0.04 U/min", notes: "Start low. Common after CPB due to vasopressin depletion. VANCS trial validated benefit.", clr: "bl" },
    { ind: "Hepatorenal Syndrome", dose: "Terlipressin preferred (V analog)", notes: "Terlipressin 1â€“2 mg IV q4-6h (not yet FDA-approved in US as of 2025). VP 0.01â€“0.04 U/min if terlipressin unavailable.", clr: "wn" },
    { ind: "Diabetes Insipidus (central)", dose: "Desmopressin (DDAVP) preferred", notes: "DDAVP 1â€“4 mcg IV q12h (selective Vâ‚‚ agonist). AVP 2.5â€“10 U IM/SC q4-6h rarely used (short duration, V side effects).", clr: "pr" },
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
    { tp: "bb", ti: "Tissue Ischemia (Dose-Dependent)", tx: "Potent vasoconstriction can cause: mesenteric ischemia (splanchnic V density is HIGH), digital ischemia/gangrene, skin necrosis, coronary vasoconstriction â†’ demand ischemia. Risk increases sharply above 0.04 U/min. Do NOT titrate as sole vasopressor." },
    { tp: "ci", ti: "Coronary Artery Disease", tx: "V coronary vasoconstriction can precipitate ischemia. VASST excluded unstable coronary patients. Use with extreme caution â€” if used, keep â‰¤0.03 U/min and monitor troponin." },
    { tp: "cau", ti: "Hyponatremia Risk", tx: "Vâ‚‚ activation â†’ free water retention â†’ dilutional hyponatremia. Monitor serum Naâº. Risk higher with prolonged infusion. Can complicate neuro patients where Naâº targets matter." },
    { tp: "cau", ti: "Mesenteric Ischemia", tx: "Splanchnic bed has highest V receptor density. Monitor lactate and abdominal exam. VASST excluded patients with suspected mesenteric ischemia." },
    { tp: "cau", ti: "Not a Standalone Vasopressor", tx: "Must be used WITH norepinephrine in septic shock â€” not as replacement. Fixed dose, not titrated. Does not provide Î² inotropy â€” cardiac output not supported." },
  ],
  ix: [
    { dr: "Norepinephrine", ef: "Synergistic vasopression (different receptor pathways). VP allows NE dose reduction (catecholamine-sparing). SSC 2021 standard combination.", sv: "low" },
    { dr: "Corticosteroids", ef: "VP + hydrocortisone may have synergistic benefit. V pathway. VANISH showed trend toward benefit with hydrocortisone + VP.", sv: "low" },
    { dr: "Indomethacin/NSAIDs", ef: "Potentiate antidiuretic effect by inhibiting prostaglandin-mediated antagonism of Vâ‚‚ action â†’ enhanced water retention.", sv: "mod" },
    { dr: "Carbamazepine/SSRIs", ef: "Potentiate ADH effect â†’ â†‘risk SIADH-like hyponatremia when combined with VP.", sv: "mod" },
    { dr: "Lithium/Demeclocycline", ef: "Vâ‚‚ receptor antagonism â†’ blunts antidiuretic effect. May counteract VP-mediated water retention.", sv: "mod" },
    { dr: "Halogenated Anesthetics", ef: "Volatiles may impair vasopressin release from posterior pituitary. May need higher exogenous doses under GA.", sv: "low" },
  ],
  pearls: [
    { ti: "Why VP works when NE fails", tx: "In severe sepsis: acidosis + â†‘NO + â†“ATP â†’ KATP channels open â†’ catecholamine-resistant vasoplegia. VP bypasses adrenergic receptors entirely, closes KATP channels via PKC, and V receptors maintain affinity in acidosis. Non-adrenergic rescue." },
    { ti: "VASST (NEJM 2008, n=778)", tx: "VP 0.03 U/min + NE vs NE alone. No mortality difference overall (35.4% vs 39.3%). SUBGROUP: less severe shock (NE 5â€“14 mcg/min) â†’ mortality 26.5% vs 35.7% (P=0.05). Established safety of VP â‰¤0.03 U/min." },
    { ti: "VANISH (JAMA 2016, n=409)", tx: "Early VP vs NE as first-line. No difference in kidney failure-free days (primary). BUT: VP group had â†“RRT need (25.4% vs 35.3%, absolute difference âˆ’9.9%). Renal-sparing signal â€” likely from preferential efferent arteriolar constriction." },
    { ti: "Efferent > Afferent", tx: "VP constricts EFFERENT arterioles >> afferent (unlike NE/PE which constrict both equally). This â†‘glomerular filtration pressure â†’ paradoxically â†‘urine output despite being 'antidiuretic hormone.' Classic interview question." },
    { ti: "Pulmonary-sparing", tx: "VP does NOT constrict pulmonary vasculature â€” may even vasodilate (NO-mediated). Preferred over catecholamines in patients with RV failure or pulmonary hypertension." },
    { ti: "Removed from ACLS (2015/2025)", tx: "40 U IV single-dose was equivalent to epinephrine 1 mg â€” no added benefit. AHA 2025: 'Do not substitute vasopressin alone or with epinephrine for epinephrine' (Class 3: No Benefit). Removed to simplify algorithm, not because it's harmful." },
    { ti: "SSC 2021 Vasopressor Hierarchy", tx: "1) NE first-line â†’ 2) Add VP 0.03 U/min at NE 0.25â€“0.5 mcg/kg/min (weak recommendation) â†’ 3) Add epinephrine â†’ 4) Dobutamine for cardiac dysfunction â†’ 5) Hydrocortisone if NE â‰¥0.25 for â‰¥4h." },
    { ti: "Decatecholaminization trend", tx: "2024â€“2025 literature supports earlier VP addition to reduce catecholamine exposure. High-dose catecholamines â†’ myocardial toxicity, arrhythmias, metabolic derangement. VP spares catecholamine dose." },
  ],
  intQs: [
    { q: "Patient on NE 0.5 mcg/kg/min, MAP 56, pH 7.18. What's happening and what do you add?", a: "Catecholamine-resistant vasoplegia. Acidosis opens KATP channels â†’ hyperpolarization â†’ Î± receptors can't transduce signal. Add VP 0.03 U/min â€” non-adrenergic, closes KATP channels via PKC, V receptors maintain affinity in acidosis. Also give bicarb if pH <7.15 and consider hydrocortisone." },
    { q: "Why does urine output increase when you start vasopressin?", a: "V receptors preferentially constrict EFFERENT arterioles >> afferent. This â†‘glomerular filtration pressure â†’ â†‘GFR â†’ â†‘UOP. Despite Vâ‚‚-mediated water reabsorption, the net effect at low doses is increased filtration." },
    { q: "VP was removed from ACLS. Does that mean it doesn't work?", a: "It was equivalent to epinephrine â€” removed to simplify, not for harm. AHA 2025 classifies it Class 3: No Benefit (not Class 3: Harm). In cardiac arrest, epinephrine's Î± + Î² effects on coronary perfusion are sufficient. VP's role is in SHOCK, not arrest." },
    { q: "Cardiogenic shock patient on NE + dobutamine. Can you add VP?", a: "Use cautiously. VP has NO Î² inotropy and increases afterload (â†‘SVR). In cardiogenic shock with â†“CO, â†‘afterload without â†‘contractility worsens output. VP better suited for distributive/vasodilatory shock where the problem is low SVR, not low CO." },
  ],
},{
  id: "atropine", name: "Atropine", brand: "AtroPen",
  tags: ["Anticholinergic", "Muscarinic Antagonist", "Parasympatholytic", "Tertiary Amine"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Naturally-occurring belladonna alkaloid / non-selective muscarinic antagonist", "Primary Target": "M1, M2, M3, M4, M5 muscarinic receptors (competitive antagonist)", "Action": "Blocks ACh at all muscarinic subtypes \u2014 no nicotinic activity", "G-Proteins": "Blocks M2 (Gi) and M1/M3 (Gq) signaling", "Structure": "Tertiary amine \u2192 crosses BBB (CNS effects)", "Key Feature": "Vagolytic: removes parasympathetic brake on heart" },
  moa: "Atropine is a competitive antagonist at all five muscarinic receptor subtypes (M1\u2013M5). Its primary clinical effect is vagolysis \u2014 blocking M2 receptors on the SA node.\n\nM2 blockade (Gi pathway): Normally, vagal ACh activates M2 \u2192 Gi \u2192 \u2193cAMP + G\u03b2\u03b3 opens GIRK channels \u2192 K\u207a efflux \u2192 hyperpolarization \u2192 slowed HR. Atropine blocks this entire cascade, removing the parasympathetic brake and allowing intrinsic sympathetic tone to predominate \u2192 \u2191HR.\n\nM3 blockade (Gq pathway): Normally M3 \u2192 Gq \u2192 PLC \u2192 IP\u2083/DAG \u2192 Ca\u00b2\u207a \u2192 smooth muscle contraction + glandular secretion. Atropine blocks this \u2192 bronchodilation, \u2193secretions, mydriasis, cycloplegia, \u2193GI motility, urinary retention.\n\nM1 blockade: Blocks CNS cholinergic transmission (crosses BBB as tertiary amine) \u2192 central anticholinergic effects at high doses (confusion, agitation, hallucinations).\n\nCritical dose-response paradox: At doses <0.5 mg, atropine can cause PARADOXICAL BRADYCARDIA. This occurs because low doses preferentially block presynaptic M1 autoreceptors on vagal nerve terminals (which normally inhibit ACh release), resulting in increased ACh release that overwhelms the partial postsynaptic M2 blockade. This is why the minimum effective dose is 0.5 mg IV.",
  recPhys: "The M2 muscarinic receptor is a GPCR coupled to Gi proteins. The vagolytic mechanism at the SA node proceeds as follows:\n\nNormal vagal tone: Vagus nerve releases ACh \u2192 binds M2 on SA node \u2192 activates Gi \u2192 two effects: (1) G\u03b1i inhibits adenylyl cyclase \u2192 \u2193cAMP \u2192 \u2193If (funny current) \u2192 slower Phase 4 depolarization. (2) G\u03b2\u03b3 directly opens GIRK channels (Kir3.1/3.4) \u2192 K\u207a efflux \u2192 hyperpolarization \u2192 more negative maximum diastolic potential. Combined: slower firing rate = bradycardia.\n\nAtropine effect: Competitively blocks ACh at M2 \u2192 removes BOTH mechanisms \u2192 cAMP rises (If increases), GIRK channels close (less hyperpolarization) \u2192 SA node firing rate increases \u2192 tachycardia.\n\nThe M3 receptor couples to Gq \u2192 PLC \u2192 IP\u2083/DAG \u2192 Ca\u00b2\u207a release from SR \u2192 smooth muscle contraction + secretion. Atropine blocks this in bronchial smooth muscle (bronchodilation), GI smooth muscle (\u2193motility), salivary/sweat glands (\u2193secretions), and pupillary sphincter (mydriasis).\n\nKey structural point: Atropine is a TERTIARY amine (lipophilic, crosses BBB) vs glycopyrrolate which is QUATERNARY (charged, cannot cross BBB). This is the single most important distinction for interview purposes.",
  dosing: [
    { ind: "Symptomatic Bradycardia", dose: "0.5 mg IV q3\u20135 min", notes: "Max 3 mg total. NEVER give <0.5 mg (paradoxical bradycardia). ACLS first-line for bradycardia.", clr: "ac" },
    { ind: "Cardiac Arrest (PEA/Asystole)", dose: "1 mg IV q3\u20135 min", notes: "Max 3 mg (full vagolysis). No longer in AHA 2020 ACLS for arrest \u2014 removed but not harmful.", clr: "wn" },
    { ind: "Organophosphate Poisoning", dose: "2\u20136 mg IV, then double q5\u201310 min", notes: "Titrate to dry secretions. May need massive doses (100+ mg). Pralidoxime as adjunct.", clr: "pr" },
    { ind: "Premedication (antisialagogue)", dose: "0.01\u20130.02 mg/kg IV/IM", notes: "Given before ketamine to reduce hypersalivation. Glycopyrrolate preferred (fewer CNS effects).", clr: "pk" },
    { ind: "NMB Reversal Adjunct", dose: "0.015\u20130.02 mg/kg IV", notes: "Given with neostigmine to counter muscarinic side effects. Match onset: atropine (fast) with neostigmine.", clr: "dg" },
  ],
  kin: { onset: "IV: 30\u201360 sec", onsetD: "Rapid absorption, high lipophilicity", peak: "2\u20134 min", peakD: "Peak vagolytic effect", dur: "60\u2013120 min", durD: "Varies by dose and target organ", vd: "1\u20136 L/kg", pb: "14\u201322%", hl: "2\u20133 hours", csht: "N/A (bolus dosing)", cl: "Hepatic", model: "Two-compartment" },
  metab: "Primary: hepatic hydrolysis by esterases and CYP-mediated oxidation. Approximately 50% hepatic metabolism, 50% renal excretion unchanged.\n\nActive metabolites: noratropine (minor activity), tropine, tropic acid \u2014 all significantly less active than parent compound.\n\nRenal excretion: 30\u201350% unchanged drug in urine. Half-life 2\u20133 hours in adults, prolonged in elderly and renal impairment.\n\nNo significant CYP450 interactions. Not removed by dialysis effectively.\n\nPediatric: faster metabolism, may need higher weight-based doses. Elderly: increased sensitivity to CNS effects (delirium), prolonged duration.",
  warn: [
    { tp: "bb", ti: "Paradoxical Bradycardia", tx: "Doses <0.5 mg can WORSEN bradycardia via preferential presynaptic M1 blockade \u2192 increased ACh release. NEVER give less than 0.5 mg IV." },
    { tp: "ci", ti: "Narrow-Angle Glaucoma", tx: "Mydriasis blocks aqueous humor drainage \u2192 acute \u2191IOP. Relative contraindication." },
    { tp: "ci", ti: "Obstructive Uropathy", tx: "Urinary retention from detrusor relaxation. Caution in BPH." },
    { tp: "cau", ti: "Tachyarrhythmia Risk", tx: "Full vagolysis can unmask or worsen SVT, AFib with RVR. Use cautiously in ACS (increased myocardial O2 demand)." },
    { tp: "cau", ti: "Denervated Heart", tx: "Atropine INEFFECTIVE in transplant patients \u2014 no vagal innervation to block. Use direct agonists (isoproterenol, epinephrine) or pacing." },
    { tp: "cau", ti: "CNS Effects (Tertiary Amine)", tx: "Crosses BBB: agitation, confusion, hallucinations, hyperthermia at high doses. Central anticholinergic syndrome treated with physostigmine." },
  ],
  ix: [
    { dr: "Neostigmine/Pyridostigmine", ef: "Atropine counters muscarinic effects of AChE inhibitors. Standard pairing for NMB reversal.", sv: "high" },
    { dr: "Other Anticholinergics", ef: "Additive: \u2191tachycardia, urinary retention, ileus, hyperthermia. Watch polypharmacy in elderly.", sv: "mod" },
    { dr: "Potassium (hyperkalemia)", ef: "Atropine ineffective for bradycardia caused by hyperkalemia \u2014 treat K\u207a directly.", sv: "high" },
  ],
  pearls: [
    { ti: "Minimum Dose Rule", tx: "NEVER give <0.5 mg IV. Paradoxical bradycardia from low-dose preferential presynaptic M1 blockade is a classic interview trap." },
    { ti: "Transplant Heart = Atropine Failure", tx: "Denervated hearts lack vagal innervation. Atropine has nothing to block. Use isoproterenol (direct \u03b21), epinephrine, or pacing." },
    { ti: "Atropine vs Glycopyrrolate", tx: "Atropine: tertiary amine, crosses BBB, faster onset (30\u201360s vs 2\u20133 min), more tachycardia, antisialagogue + bronchodilation. Glycopyrrolate: quaternary, no BBB crossing, no CNS effects, better antisialagogue, less tachycardia." },
    { ti: "Organophosphate Toxicity", tx: "Competitive antagonism at muscarinic receptors counters SLUDGE/DUMBELS symptoms. Does NOT reverse nicotinic effects (fasciculations, paralysis) \u2014 need pralidoxime for that." },
    { ti: "Paired with Neostigmine", tx: "Standard NMB reversal: neostigmine 0.04\u20130.07 mg/kg + atropine 0.015\u20130.02 mg/kg. Or glycopyrrolate 0.2 mg per 1 mg neostigmine. Atropine onset matches neostigmine better." },
  ],
  intQs: [
    { q: "Patient develops HR 35 intraop. You give 0.3 mg atropine IV but HR drops to 28. Why?", a: "Paradoxical bradycardia from inadequate dose. At <0.5 mg, central vagal stimulation and presynaptic M1 blockade overwhelm peripheral M2 blockade. Give 0.5\u20131 mg IV immediately for full SA node blockade." },
    { q: "Why choose atropine over glycopyrrolate in airway emergency with bradycardia?", a: "Two advantages: (1) Faster onset (30\u201360s vs 2\u20133 min). (2) M3 blockade provides bronchodilation \u2014 glycopyrrolate lacks meaningful bronchodilation in emergency timeframes. Atropine addresses both problems simultaneously." },
    { q: "Heart transplant patient becomes bradycardic. What do you do?", a: "Atropine will NOT work \u2014 denervated heart has no vagal innervation to block. Use isoproterenol (direct \u03b21 agonist), epinephrine, or transcutaneous/transvenous pacing." },
  ],
},{
  id: "epinephrine", name: "Epinephrine", brand: "Adrenalin",
  tags: ["Endogenous Catecholamine", "Non-Selective Agonist", "\u03b1+\u03b2 Agonist", "Sympathomimetic"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Endogenous catecholamine / non-selective adrenergic agonist", "Primary Targets": "\u03b11, \u03b12, \u03b21, \u03b22, \u03b23 adrenergic receptors (all subtypes)", "Action": "Full agonist at all adrenergic receptors \u2014 dose-dependent selectivity", "G-Proteins": "\u03b11=Gq, \u03b12=Gi, \u03b21/\u03b22=Gs", "Formulation": "1:1,000 (1 mg/mL) and 1:10,000 (0.1 mg/mL)", "Key Feature": "Dose-dependent receptor profile: low=\u03b22, mid=\u03b21, high=\u03b1" },
  moa: "Epinephrine activates all five adrenergic receptor subtypes through GPCR mechanisms with dose-dependent selectivity:\n\n\u03b11-adrenergic (Gq): PLC \u2192 IP\u2083/DAG \u2192 \u2191Ca\u00b2\u207a \u2192 vasoconstriction, \u2191SVR, \u2191BP. Predominates at HIGH doses (>10 mcg/min).\n\n\u03b12-adrenergic (Gi): \u2193adenylyl cyclase \u2192 presynaptic inhibition \u2192 negative feedback on NE release. Significant only at very high doses.\n\n\u03b21-adrenergic (Gs): adenylyl cyclase \u2192 \u2191cAMP \u2192 PKA \u2192 phosphorylates L-type Ca\u00b2\u207a channels (\u2191inotropy), RyR2 (\u2191CICR), phospholamban (\u2191lusitropy), HCN/If channels (\u2191chronotropy). Predominates at INTERMEDIATE doses (4\u20135 mcg/min).\n\n\u03b22-adrenergic (Gs): \u2191cAMP in smooth muscle \u2192 PKA \u2192 MLCK inhibition \u2192 smooth muscle relaxation \u2192 bronchodilation + peripheral vasodilation. Predominates at LOW doses (1\u20132 mcg/min).\n\nClassic BP pattern: SBP \u2191\u2191, DBP \u2193 or unchanged, widened pulse pressure.",
  recPhys: "Dose-dependent receptor selectivity is the defining pharmacologic principle of epinephrine:\n\nLow dose (\u22642 mcg/min): \u03b22 effects dominate. \u03b22 has higher affinity for epinephrine than \u03b21 or \u03b11. Gs \u2192 \u2191cAMP \u2192 PKA \u2192 MLCK inactivation \u2192 vascular smooth muscle relaxation + bronchial smooth muscle relaxation. Clinically: \u2193SVR, \u2193DBP, bronchodilation.\n\nModerate dose (2\u201310 mcg/min): \u03b21 effects emerge. Gs \u2192 \u2191cAMP \u2192 PKA phosphorylates: L-type Ca\u00b2\u207a channels (\u2191Ca\u00b2\u207a entry = \u2191inotropy), phospholamban (relieves SERCA inhibition = \u2191lusitropy), HCN channels (\u2191If = \u2191chronotropy), RyR2 (\u2191Ca\u00b2\u207a-induced Ca\u00b2\u207a release). Clinically: \u2191HR, \u2191contractility, \u2191CO.\n\nHigh dose (>10 mcg/min): \u03b11 effects predominate. Gq \u2192 PLC \u2192 IP\u2083/DAG \u2192 \u2191intracellular Ca\u00b2\u207a \u2192 calmodulin-MLCK activation \u2192 vascular smooth muscle contraction. Clinically: \u2191SVR, \u2191MAP, reflex bradycardia possible.\n\nACLS dose (1 mg IV push): Massive \u03b11 effect. The purpose is NOT cardiac stimulation \u2014 it is to increase aortic root diastolic pressure to maximize coronary perfusion pressure (CPP = AoDBP \u2013 LVEDP) during chest compressions.",
  dosing: [
    { ind: "Cardiac Arrest", dose: "1 mg IV/IO q3\u20135 min", notes: "1:10,000 (0.1 mg/mL). Shockable rhythms: after 2nd shock. PEA/Asystole: ASAP.", clr: "ac" },
    { ind: "Anaphylaxis", dose: "0.3\u20130.5 mg IM (1:1,000)", notes: "Anterolateral thigh. Repeat q5\u201315 min PRN. IV only for refractory/cardiovascular collapse.", clr: "wn" },
    { ind: "Vasopressor Infusion", dose: "1\u201340 mcg/min", notes: "Titrate to MAP. Low dose (\u22645): \u03b2 predominant. High dose (>10): \u03b1 predominant.", clr: "pr" },
    { ind: "Bradycardia (refractory)", dose: "2\u201310 mcg/min infusion", notes: "After atropine failure. Alternative to pacing. Direct \u03b21 chronotropy.", clr: "pk" },
    { ind: "Bronchospasm", dose: "0.1\u20130.3 mg IV (1:10,000) or nebulized 2.25% racemic", notes: "\u03b22-mediated bronchodilation. Racemic epi for croup/post-extubation stridor.", clr: "dg" },
  ],
  kin: { onset: "IV: immediate (15\u201330 sec). IM: 5\u201310 min", onsetD: "Most rapid of all catecholamines IV", peak: "IV: 1\u20132 min. IM: 20\u201330 min", peakD: "SC absorption is erratic \u2014 avoid in anaphylaxis", dur: "5\u201310 min (bolus)", durD: "Rapid enzymatic degradation", vd: "Large (distributes widely)", pb: "~50%", hl: "2\u20133 min", csht: "N/A", cl: "MAO + COMT (extremely rapid)", model: "Rapid redistribution" },
  metab: "Metabolism is extremely rapid via two enzyme systems:\n\n1. COMT (catechol-O-methyltransferase): Methylates the catechol hydroxyl groups. Present in liver, kidney, and virtually all tissues. Produces metanephrine (primary metabolite).\n\n2. MAO (monoamine oxidase): Oxidative deamination. MAO-A and MAO-B in gut, liver, nerve terminals. Produces 3,4-dihydroxymandelic acid.\n\nFinal common metabolite: Vanillylmandelic acid (VMA) \u2014 excreted renally. 24-hour urine VMA/metanephrines used to diagnose pheochromocytoma.\n\nHalf-life only 2\u20133 minutes explains need for continuous infusion and q3\u20135 min repeat dosing in ACLS.\n\nDrug interactions: MAOIs block degradation \u2192 dramatically potentiated effect \u2192 hypertensive crisis. TCAs block neuronal reuptake \u2192 potentiated effect. Beta-blockers shift receptor balance toward unopposed \u03b1 \u2192 severe hypertension + reflex bradycardia.",
  warn: [
    { tp: "bb", ti: "Extravasation Injury", tx: "\u03b11 vasoconstriction causes tissue ischemia/necrosis. Treat with phentolamine (\u03b1-blocker) 5\u201310 mg in 10 mL NS injected locally. Central line preferred for infusions." },
    { tp: "ci", ti: "Halogenated Anesthetics", tx: "Sensitize myocardium to catecholamines \u2192 VFib/VT risk. Halothane worst. Limit epi to 1\u20131.5 mcg/kg in 10 min with sevoflurane." },
    { tp: "cau", ti: "Tachyarrhythmias", tx: "Dose-dependent \u03b21 stimulation: sinus tach, SVT, VT, VFib. Worse with hypokalemia, hypomagnesemia, digitalis toxicity." },
    { tp: "cau", ti: "Metabolic Effects", tx: "\u03b22 glycogenolysis \u2192 hyperglycemia. \u03b22 cellular K\u207a uptake \u2192 hypokalemia. Lactate elevation (aerobic glycolysis, NOT tissue hypoperfusion)." },
    { tp: "cau", ti: "MAOI Interaction", tx: "Blocks MAO degradation pathway \u2192 massively potentiated catecholamine effect. Contraindicated or use extreme caution with dose reduction." },
  ],
  ix: [
    { dr: "MAOIs", ef: "Block MAO degradation \u2192 10\u201320x potentiation. Hypertensive crisis, arrhythmias. Contraindicated or use 1/10th dose.", sv: "high" },
    { dr: "Beta-Blockers", ef: "Unopposed \u03b1 stimulation \u2192 severe HTN + reflex bradycardia. Especially dangerous with non-selective (propranolol).", sv: "high" },
    { dr: "TCAs", ef: "Block neuronal NE reuptake \u2192 potentiated adrenergic effect. Exaggerated pressor response.", sv: "mod" },
    { dr: "Volatile Anesthetics", ef: "Myocardial sensitization to catecholamines. VT/VFib risk. Halothane > isoflurane > sevoflurane > desflurane.", sv: "high" },
  ],
  pearls: [
    { ti: "Dose-Dependent Selectivity", tx: "LOW (\u22642 mcg/min): \u03b22 = vasodilation + bronchodilation. MID (3\u201310): \u03b21 = \u2191HR/contractility. HIGH (>10): \u03b11 = vasoconstriction. Memorize this gradient." },
    { ti: "Epi-Induced Lactate", tx: "\u03b22-mediated aerobic glycogenolysis produces lactate directly. This is PHARMACOLOGIC, not from tissue hypoperfusion. Don't chase this lactate with fluids \u2014 common ICU pitfall." },
    { ti: "NE Preferred Over Epi in Sepsis", tx: "Epi causes more tachycardia, dysrhythmias, and metabolic derangement vs NE. SSC 2021: NE first-line, epi reserved for inadequate response to NE + VP." },
    { ti: "ACLS: After 2nd Shock", tx: "In shockable rhythms (VFib/pVT): epi 1 mg after 2nd shock, then q3\u20135 min. In non-shockable (PEA/asystole): epi ASAP \u2014 earlier epi improves outcomes." },
    { ti: "Anaphylaxis: IM Not IV", tx: "IM 0.3\u20130.5 mg into anterolateral thigh. IV epinephrine reserved for cardiovascular collapse only. SC is unreliable \u2014 vasoconstriction limits its own absorption." },
  ],
  intQs: [
    { q: "Patient in anaphylaxis, BP 60/40, diffuse urticaria. Walk me through management.", a: "IM epinephrine 0.3\u20130.5 mg anterolateral thigh IMMEDIATELY. Remove trigger. Large-bore IV, aggressive fluid resuscitation. If no response in 5 min, repeat IM epi. If cardiovascular collapse, IV epi 0.1\u20130.2 mg slow push or infusion 1\u201310 mcg/min. Adjuncts: diphenhydramine, famotidine, methylprednisolone, albuterol for bronchospasm." },
    { q: "Why does epinephrine cause lactic acidosis?", a: "\u03b22-mediated glycogenolysis \u2192 pyruvate overwhelms mitochondrial capacity \u2192 shunted to anaerobic glycolysis \u2192 lactate production. This is a DIRECT pharmacologic effect, not tissue hypoperfusion. Critical distinction \u2014 don't treat epi-induced lactate with more fluids." },
    { q: "Epi vs NE in septic shock \u2014 which and why?", a: "NE first-line (SSC 2021). NE has favorable \u03b11>\u03b21 profile: vasoconstriction + preserved CO without excessive tachycardia/dysrhythmias. Epi causes more \u03b21/\u03b22 effects: tachycardia, dysrhythmias, lactate elevation, metabolic derangement. Epi reserved for refractory shock after NE + VP." },
  ],
},{
  id: "phenylephrine", name: "Phenylephrine", brand: "Neo-Synephrine / Vazculep",
  tags: ["Non-Catecholamine", "Pure \u03b11 Agonist", "Direct-Acting", "IV Vasopressor"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Synthetic non-catecholamine vasopressor", "Primary Target": "\u03b11-adrenergic receptor (pure, selective)", "Action": "Direct \u03b11 agonist \u2014 zero \u03b2 activity", "G-Protein": "Gq \u2192 PLC \u2192 IP\u2083/DAG \u2192 Ca\u00b2\u207a \u2192 vasoconstriction", "Structure": "Non-catecholamine (single hydroxyl \u2192 no COMT metabolism)", "Net Effect": "\u2191SVR/MAP + reflex \u2193HR + \u2193CO" },
  moa: "Phenylephrine is a selective \u03b11-adrenergic receptor agonist with ZERO \u03b2-receptor activity.\n\n\u03b11 activation (Gq): PLC cleaves PIP\u2082 \u2192 IP\u2083 + DAG. IP\u2083 binds IP\u2083 receptors on SR \u2192 Ca\u00b2\u207a release. DAG activates PKC. Ca\u00b2\u207a binds calmodulin \u2192 activates MLCK \u2192 myosin light chain phosphorylation \u2192 actin-myosin cross-bridging \u2192 vascular smooth muscle contraction \u2192 \u2191SVR.\n\nThis is pure afterload increase without ANY direct cardiac stimulation.\n\nThe resulting \u2191MAP triggers the baroreceptor reflex: carotid/aortic arch baroreceptors detect \u2191stretch \u2192 \u2191afferent firing to NTS in medulla \u2192 \u2191vagal (parasympathetic) output + \u2193sympathetic output \u2192 REFLEX BRADYCARDIA.\n\nNet hemodynamic profile: \u2191SVR, \u2191MAP, \u2193HR (reflex), \u2193CO (reduced HR + increased afterload). This is the opposite of ephedrine's profile and a critical interview distinction.",
  recPhys: "The \u03b11-adrenergic receptor is a GPCR coupled exclusively to Gq. The vasoconstriction pathway:\n\nStep 1 \u2014 Receptor activation: Phenylephrine binds \u03b11 \u2192 conformational change \u2192 Gq activation \u2192 G\u03b1q-GTP dissociates from G\u03b2\u03b3.\n\nStep 2 \u2014 PLC activation: G\u03b1q activates phospholipase C (PLC-\u03b2) on the inner membrane leaflet.\n\nStep 3 \u2014 PIP\u2082 hydrolysis: PLC cleaves membrane phospholipid PIP\u2082 into two second messengers: IP\u2083 (soluble, diffuses into cytoplasm) and DAG (remains membrane-bound).\n\nStep 4 \u2014 Ca\u00b2\u207a release: IP\u2083 binds IP\u2083 receptors on SR \u2192 Ca\u00b2\u207a floods into cytoplasm.\n\nStep 5 \u2014 MLCK activation: Ca\u00b2\u207a binds calmodulin (4 Ca\u00b2\u207a per calmodulin) \u2192 Ca\u00b2\u207a-calmodulin complex activates myosin light chain kinase (MLCK).\n\nStep 6 \u2014 Contraction: MLCK phosphorylates myosin light chains \u2192 myosin ATPase activated \u2192 actin-myosin cross-bridge cycling \u2192 sustained vascular smooth muscle contraction.\n\nSimultaneously, DAG activates PKC, which sustains contraction via Rho kinase-mediated calcium sensitization (inhibits myosin light chain phosphatase, maintaining phosphorylation even as Ca\u00b2\u207a falls). This is why \u03b11 vasoconstriction is sustained.\n\nBaroreceptor reflex: \u2191MAP \u2192 \u2191carotid sinus stretch \u2192 \u2191CN IX (glossopharyngeal) afferent firing \u2192 NTS \u2192 \u2191CN X (vagus) efferent \u2192 M2 activation on SA node \u2192 GIRK channel opening \u2192 K\u207a efflux \u2192 bradycardia. This is physiologic, not toxic.",
  dosing: [
    { ind: "Hypotension Bolus", dose: "50\u2013200 mcg IV", notes: "Push dose. Onset 30\u201360 sec. Repeat q1\u20132 min PRN. Common in OR and procedural settings.", clr: "ac" },
    { ind: "Vasopressor Infusion", dose: "40\u2013360 mcg/min", notes: "Titrate to MAP \u226565. Pure afterload agent. No direct cardiac stimulation.", clr: "wn" },
    { ind: "Spinal Hypotension (OB)", dose: "100\u2013200 mcg bolus, then 25\u201350 mcg/min", notes: "First-line vasopressor in obstetric spinal anesthesia. Preserves uterine blood flow better than ephedrine.", clr: "pr" },
    { ind: "Nasal Decongestant", dose: "0.25\u20131% topical", notes: "Mucosal vasoconstriction. Before nasotracheal intubation (combined with lidocaine).", clr: "pk" },
  ],
  kin: { onset: "IV: 30\u201360 sec", onsetD: "Rapid direct receptor binding", peak: "1\u20132 min", peakD: "Peak vasoconstriction", dur: "15\u201320 min (bolus)", durD: "Longer than catecholamines (no COMT metabolism)", vd: "Moderate", pb: "~95%", hl: "2.5\u20133 hours", csht: "N/A", cl: "Hepatic MAO", model: "Two-compartment" },
  metab: "Critical structural difference from catecholamines: phenylephrine has only ONE hydroxyl group on its benzene ring (meta position) vs two for catecholamines (catechol ring = 3,4-dihydroxy). This means NO COMT metabolism.\n\nPrimary: MAO (monoamine oxidase) in the liver and GI tract. Intestinal MAO causes extensive first-pass metabolism (oral bioavailability only ~38%).\n\nSecondary: hepatic sulfotransferases (conjugation).\n\nThis single-hydroxyl structure gives phenylephrine a longer duration of action (15\u201320 min) compared to catecholamines like NE (1\u20132 min), which are rapidly degraded by BOTH MAO and COMT.\n\nNo active metabolites. Renal excretion of metabolites.\n\nMAOI interaction: blocks primary degradation pathway \u2192 dramatically prolonged and potentiated pressor effect \u2192 hypertensive crisis. Use vasopressin instead.",
  warn: [
    { tp: "bb", ti: "Reflex Bradycardia", tx: "Expected baroreceptor response to \u2191SVR. Clinically significant if HR drops below 50. Can worsen cardiac output in patients dependent on rate." },
    { tp: "ci", ti: "Severe Aortic Stenosis", tx: "These patients are preload-dependent and afterload-sensitive. Acute \u2191SVR may precipitate decompensation, though moderate PE use is sometimes necessary." },
    { tp: "cau", ti: "MAOI Interaction", tx: "MAO is the PRIMARY metabolic pathway. MAOIs \u2192 severely potentiated and prolonged effect. Contraindicated or use with extreme caution." },
    { tp: "cau", ti: "Decreased Cardiac Output", tx: "Pure afterload increase + reflex bradycardia \u2192 \u2193CO. Problematic in patients with poor contractile reserve (cardiogenic shock, severe HF)." },
    { tp: "cau", ti: "Uterine Artery Constriction", tx: "High doses can \u2193uteroplacental blood flow. Use lowest effective dose in OB. Despite this concern, PE is still preferred over ephedrine for OB spinal hypotension." },
  ],
  ix: [
    { dr: "MAOIs", ef: "Block primary metabolic pathway \u2192 dramatically potentiated/prolonged effect. Hypertensive crisis. Avoid or use vasopressin.", sv: "high" },
    { dr: "Oxytocin", ef: "Additive hypotension when oxytocin given (vasodilation) \u2192 may need increased PE dose. Common OB interaction.", sv: "mod" },
    { dr: "Beta-Blockers", ef: "Exaggerated reflex bradycardia + enhanced hypertension (unopposed \u03b11 effect amplified).", sv: "mod" },
  ],
  pearls: [
    { ti: "Pure \u03b11 = Pure Afterload", tx: "No \u03b2 activity means no inotropy, no chronotropy. \u2191SVR + reflex \u2193HR = can \u2193CO. Use when you want MAP without cardiac stimulation." },
    { ti: "OB Spinal: PE > Ephedrine", tx: "PE is first-line for spinal hypotension in C-section. Ephedrine crosses placenta more \u2192 fetal tachycardia + acidosis. PE preserves fetal pH better." },
    { ti: "Structure Determines Metabolism", tx: "One hydroxyl (non-catecholamine) = no COMT = longer duration (15\u201320 min vs 1\u20132 min for NE). Interview: 'Why does phenylephrine last longer than norepinephrine?'" },
    { ti: "Push-Dose Pressor", tx: "Phenylephrine 100 mcg IV is the classic push-dose pressor for acute hypotension (induction, spinal). Onset 30\u201360s, duration 15 min. Know how to make it from a 10 mg/mL vial." },
    { ti: "Baroreceptor Reflex Demonstration", tx: "The reflex bradycardia from PE is the cleanest demonstration of the baroreceptor reflex in clinical practice. Interviewers love asking about this pathway." },
  ],
  intQs: [
    { q: "BP drops to 75/40 after spinal for C-section. What's your first vasopressor?", a: "Phenylephrine 100\u2013200 mcg IV bolus. PE is first-line over ephedrine for OB spinal hypotension. Better fetal acid-base status, less placental transfer, and the \u2191SVR directly counters the sympathectomy-induced vasodilation." },
    { q: "Why does phenylephrine decrease cardiac output?", a: "Two mechanisms: (1) Pure \u03b11 \u2192 \u2191afterload without \u2191contractility = \u2191resistance against which the LV must eject. (2) Baroreceptor-mediated reflex bradycardia \u2192 \u2193HR. CO = HR \u00d7 SV, and both components decrease. This is expected pharmacology, not toxicity." },
    { q: "Patient on phenelzine (MAOI) needs a vasopressor. Can you use phenylephrine?", a: "NO \u2014 contraindicated. MAOIs block MAO, the primary metabolic pathway for PE. PE accumulates \u2192 severe hypertensive crisis. Use vasopressin instead (non-adrenergic pathway, not metabolized by MAO or COMT)." },
  ],
},{
  id: "ephedrine", name: "Ephedrine", brand: "Generic",
  tags: ["Mixed-Acting Sympathomimetic", "Non-Catecholamine", "\u03b1+\u03b2 Agonist", "Indirect + Direct"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Mixed-acting sympathomimetic (direct + indirect)", "Primary Targets": "\u03b11, \u03b21, \u03b22 (direct agonist) + presynaptic NE release (indirect)", "Action": "Direct receptor agonist AND indirect NE-releasing agent", "G-Proteins": "\u03b11=Gq, \u03b21/\u03b22=Gs", "Structure": "Non-catecholamine (no COMT metabolism, oral bioavailability)", "Key Feature": "Dual mechanism: 25% direct + 75% indirect (NE release via VMAT2 reversal)" },
  moa: "Ephedrine has a unique dual mechanism of action:\n\n1. INDIRECT (75% of effect): Enters presynaptic nerve terminal via uptake-1 (NET) \u2192 displaces norepinephrine from storage vesicles by reversing VMAT2 (vesicular monoamine transporter 2) \u2192 NE floods into synaptic cleft \u2192 activates postsynaptic \u03b1 and \u03b2 receptors.\n\n2. DIRECT (25% of effect): Directly binds and activates \u03b11, \u03b21, and \u03b22 adrenergic receptors (weak partial agonist activity).\n\nHemodynamic profile: \u2191HR (\u03b21 + NE-mediated), \u2191contractility (\u03b21), \u2191SVR (\u03b11), \u2191MAP. Preserves cardiac output better than pure \u03b11 agonists.\n\nTACHYPHYLAXIS: Repeated doses cause diminished response because:\n(1) Presynaptic NE stores become depleted (primary mechanism) \u2014 if you've released all stored NE, there's nothing left to displace.\n(2) Receptor desensitization (minor contributor).\nThis is why ephedrine becomes ineffective after 3\u20134 boluses and you should switch to phenylephrine or epinephrine.",
  recPhys: "The indirect NE-releasing mechanism makes ephedrine fundamentally different from direct-acting agents:\n\nStep 1 \u2014 Neuronal uptake: Ephedrine enters the presynaptic adrenergic nerve terminal via NET (norepinephrine transporter / uptake-1). This is the same transporter that recycles released NE back into the terminal.\n\nStep 2 \u2014 VMAT2 reversal: Inside the terminal, ephedrine interacts with VMAT2 (vesicular monoamine transporter 2), which normally packages NE into vesicles. Ephedrine reverses this transporter, causing NE to flood out of vesicles into the cytoplasm.\n\nStep 3 \u2014 NE efflux: Elevated cytoplasmic NE reverses NET itself \u2192 NE flows OUT of the terminal into the synaptic cleft (non-exocytic release, NOT calcium-dependent vesicle fusion).\n\nStep 4 \u2014 Receptor activation: Released NE + direct ephedrine binding activates post-synaptic receptors: \u03b11-Gq (\u2191SVR), \u03b21-Gs (\u2191HR, \u2191contractility), \u03b22-Gs (\u2191bronchodilation).\n\nCritical implications:\n\u2022 TCAs/cocaine block NET \u2192 ephedrine cannot enter the terminal \u2192 indirect mechanism abolished \u2192 markedly reduced effect\n\u2022 Reserpine depletes vesicular NE stores \u2192 nothing to release \u2192 ephedrine ineffective\n\u2022 MAOIs increase cytoplasmic NE \u2192 more available for release \u2192 exaggerated hypertensive response\n\u2022 Repeated dosing depletes NE stores \u2192 tachyphylaxis (classic interview question)",
  dosing: [
    { ind: "Acute Hypotension", dose: "5\u201310 mg IV bolus", notes: "Onset 1\u20132 min. Repeat q3\u20135 min PRN. Max ~50 mg before switching agents (tachyphylaxis).", clr: "ac" },
    { ind: "Spinal Hypotension", dose: "5\u201310 mg IV", notes: "Second-line to phenylephrine in OB. Preserves HR/CO but crosses placenta \u2192 fetal tachycardia/acidosis.", clr: "wn" },
    { ind: "Bronchospasm (oral)", dose: "25\u201350 mg PO q4\u20136h", notes: "Non-catecholamine \u2192 oral bioavailability. Largely replaced by selective \u03b22 agonists.", clr: "pr" },
  ],
  kin: { onset: "IV: 1\u20132 min. IM: 10\u201320 min", onsetD: "Indirect mechanism requires neuronal uptake + NE displacement", peak: "2\u20135 min IV", peakD: "Time to achieve maximal NE release", dur: "10\u201315 min (bolus)", durD: "Longer than catecholamines (non-catecholamine structure)", vd: "3\u20136 L/kg", pb: "Low", hl: "3\u20136 hours", csht: "N/A", cl: "Hepatic MAO + renal unchanged", model: "Two-compartment" },
  metab: "Non-catecholamine structure (no catechol ring = no COMT metabolism), explaining oral bioavailability and longer duration.\n\nPrimary: hepatic MAO oxidative deamination + N-demethylation.\nSecondary: 40\u201370% excreted unchanged in urine (pH-dependent: acidic urine increases excretion).\n\nNo active metabolites.\n\nHalf-life 3\u20136 hours \u2014 significantly longer than catecholamines (minutes).\n\nKey drug interaction: MAOIs block MAO degradation of both ephedrine AND the released NE \u2192 severe hypertensive crisis from dual potentiation. Wait 2\u20133 weeks after MAOI discontinuation.",
  warn: [
    { tp: "bb", ti: "Tachyphylaxis", tx: "Repeated doses deplete presynaptic NE stores. Effect diminishes after 3\u20134 boluses. Switch to direct-acting agents (phenylephrine, epinephrine) if this occurs." },
    { tp: "ci", ti: "MAOI Interaction", tx: "Dangerous potentiation. MAOIs block degradation of displaced NE + block ephedrine metabolism. Can cause severe hypertensive crisis, ICH, death." },
    { tp: "cau", ti: "Cocaine/TCA Interaction", tx: "Block NET (uptake-1) \u2192 ephedrine cannot enter nerve terminal \u2192 indirect mechanism abolished. Effect markedly reduced. Switch to direct-acting agents." },
    { tp: "cau", ti: "Fetal Effects (OB)", tx: "Crosses placenta more readily than phenylephrine \u2192 fetal \u03b2 stimulation \u2192 tachycardia + metabolic acidosis. PE preferred in OB spinal hypotension." },
  ],
  ix: [
    { dr: "MAOIs", ef: "Dangerous dual potentiation: blocks degradation of both ephedrine and displaced NE. Hypertensive crisis.", sv: "high" },
    { dr: "TCAs / Cocaine", ef: "Block NET \u2192 indirect mechanism abolished \u2192 markedly reduced effect. Use direct-acting agents instead.", sv: "high" },
    { dr: "Reserpine", ef: "Depletes vesicular NE stores \u2192 nothing to release \u2192 ephedrine ineffective.", sv: "mod" },
    { dr: "Volatile Anesthetics", ef: "Catecholamine sensitization (from released NE) \u2192 dysrhythmia risk, though less than with exogenous catecholamines.", sv: "mod" },
  ],
  pearls: [
    { ti: "75% Indirect / 25% Direct", tx: "Most of ephedrine's effect comes from releasing stored NE, not direct receptor binding. This explains tachyphylaxis (NE depletion) and drug interactions (NET blockers)." },
    { ti: "Tachyphylaxis Mechanism", tx: "After 3\u20134 boluses, NE stores are depleted. No NE to release = no indirect effect. Switch to phenylephrine (pure direct) or epinephrine (direct agonist)." },
    { ti: "PE vs Ephedrine in OB", tx: "PE: first-line. Less placental transfer, better fetal pH. Ephedrine: preserves CO/HR (useful if bradycardia present) but fetal tachycardia/acidosis risk." },
    { ti: "Why NET Blockers Matter", tx: "TCAs and cocaine block the uptake-1 transporter that ephedrine needs to enter the nerve terminal. No entry = no NE release = minimal effect. Classic pharmacology concept." },
  ],
  intQs: [
    { q: "You give ephedrine 10 mg x3 for post-spinal hypotension and the patient stops responding. Why?", a: "Tachyphylaxis from NE store depletion. Ephedrine's primary mechanism (75%) is indirect NE release via VMAT2 reversal. After 3\u20134 doses, presynaptic vesicular NE is exhausted. Switch to phenylephrine (direct \u03b11) or epinephrine (direct \u03b1+\u03b2)." },
    { q: "Patient on amitriptyline (TCA) needs a vasopressor. Can you use ephedrine?", a: "Ephedrine will be markedly less effective. TCAs block NET, preventing ephedrine from entering nerve terminals and displacing NE. Use phenylephrine (direct \u03b11 agonist) or norepinephrine (direct-acting, doesn't require NET for its agonist effect)." },
    { q: "Ephedrine vs phenylephrine \u2014 when do you choose each?", a: "Ephedrine: when you want \u2191MAP + \u2191HR + preserved CO (first few doses before tachyphylaxis). PE: when you want pure \u2191SVR and can tolerate reflex bradycardia and \u2193CO. In OB: PE first-line (better fetal outcomes). In bradycardic hypotension: ephedrine may be preferred (maintains HR)." },
  ],
},{
  id: "glycopyrrolate", name: "Glycopyrrolate", brand: "Robinul",
  tags: ["Anticholinergic", "Muscarinic Antagonist", "Quaternary Amine", "Parasympatholytic"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Synthetic quaternary ammonium antimuscarinic", "Primary Target": "M1, M2, M3 muscarinic receptors (competitive antagonist)", "Action": "Blocks ACh at muscarinic receptors \u2014 preferential M1/M3 selectivity", "G-Proteins": "Blocks M2 (Gi) and M1/M3 (Gq) signaling", "Structure": "Quaternary ammonium \u2192 CANNOT cross BBB (no CNS effects)", "Key Feature": "Peripheral anticholinergic without central side effects" },
  moa: "Glycopyrrolate is a synthetic quaternary ammonium antimuscarinic agent. It competitively antagonizes acetylcholine at muscarinic receptors with preferential affinity for M1 and M3 subtypes.\n\nM2 blockade (SA node): Same vagolytic mechanism as atropine \u2014 blocks Gi signaling, removes GIRK channel K\u207a efflux, restores cAMP/If \u2192 \u2191HR. However, glycopyrrolate produces LESS tachycardia than atropine because it has relatively lower M2 affinity and slower onset at the SA node.\n\nM3 blockade (glands/smooth muscle): Blocks Gq/PLC/IP\u2083 pathway \u2192 potent antisialagogue (reduces salivary, bronchial, gastric secretions), reduces GI motility, bronchodilation.\n\nThe CRITICAL structural difference: quaternary nitrogen bears a permanent positive charge \u2192 cannot cross lipid bilayer membranes \u2192 CANNOT cross the blood-brain barrier. This eliminates ALL central anticholinergic effects (confusion, agitation, sedation, hallucinations, central fever). This is the single most important distinction from atropine for interview purposes.",
  recPhys: "The quaternary ammonium structure defines glycopyrrolate's pharmacology:\n\nStructure: The nitrogen atom has four carbon substituents, creating a permanent positive charge (quaternary amine). Atropine, in contrast, has three substituents (tertiary amine) and can exist in uncharged form at physiologic pH \u2192 crosses BBB.\n\nPeripheral M2 (SA node, Gi-coupled): Glycopyrrolate blocks vagal input but with slower onset (2\u20133 min vs 30\u201360 sec for atropine) and produces a more gradual, moderate heart rate increase. The vagolytic effect is present but less dramatic.\n\nPeripheral M3 (glands, Gq-coupled): Glycopyrrolate is actually a MORE POTENT antisialagogue than atropine. It reduces salivary secretion volume by ~80%, making it the preferred agent for reducing secretions before intubation, with fiberoptic procedures, and with ketamine administration.\n\nGastric acid: M3/M1 blockade on parietal cells \u2192 \u2193acid secretion + \u2193volume. M1 blockade on enterochromaffin cells \u2192 \u2193histamine release. This is why glycopyrrolate was originally developed as an anti-ulcer medication.\n\nNo CNS effects: Cannot produce central anticholinergic syndrome (confusion, agitation, hallucinations, hyperthermia). If a patient develops central anticholinergic toxicity, physostigmine is the treatment (tertiary amine AChE inhibitor that crosses BBB).",
  dosing: [
    { ind: "Antisialagogue", dose: "0.2 mg IV", notes: "Standard perioperative dose. Give 15\u201330 min before induction for optimal drying effect.", clr: "ac" },
    { ind: "NMB Reversal Adjunct", dose: "0.2 mg per 1 mg neostigmine", notes: "0.2 mg glyco per 1 mg neostigmine. Onset matches neostigmine better than atropine for sustained effect.", clr: "wn" },
    { ind: "Bradycardia", dose: "0.1\u20130.2 mg IV", notes: "Slower onset than atropine (2\u20133 min vs 30\u201360 sec). Less tachycardia. Use when moderate vagolysis is adequate.", clr: "pr" },
    { ind: "Chronic Drooling/Secretions", dose: "1\u20132 mg PO TID", notes: "Off-label. Quaternary structure limits GI absorption (~10% bioavailability) but adequate for local GI/salivary effects.", clr: "pk" },
  ],
  kin: { onset: "IV: 2\u20133 min", onsetD: "Slower than atropine (30\u201360 sec)", peak: "5\u201310 min", peakD: "Gradual vagolytic effect", dur: "2\u20134 hours", durD: "Longer than atropine (60\u2013120 min)", vd: "0.42 L/kg", pb: "Low", hl: "0.6\u20131.2 hours", csht: "N/A", cl: "Primarily renal unchanged", model: "Multi-compartment" },
  metab: "Minimal hepatic metabolism \u2014 this is the key pharmacokinetic distinction.\n\n80% excreted UNCHANGED in urine via glomerular filtration + tubular secretion.\n10\u201320% biliary excretion.\nMinimal CYP450 involvement.\n\nNo active metabolites.\n\nRenal impairment: significant accumulation since primary excretion is renal unchanged. Dose reduction required in CKD/AKI. Atropine may be preferred in severe renal failure (50/50 hepatic/renal).\n\nNot removed by hemodialysis (too large, charged molecule).\n\nDuration is LONGER than atropine (2\u20134h vs 1\u20132h) despite shorter elimination half-life, because glycopyrrolate's effect at the receptor outlasts its plasma concentration (slow receptor dissociation).",
  warn: [
    { tp: "cau", ti: "Renal Dosing Required", tx: "80% renal excretion unchanged. Accumulates in CKD/AKI \u2192 prolonged anticholinergic effects. Reduce dose or use atropine (50% hepatic metabolism)." },
    { tp: "cau", ti: "Urinary Retention", tx: "M3 blockade relaxes detrusor \u2192 retention risk. Caution in BPH, neurogenic bladder." },
    { tp: "cau", ti: "Narrow-Angle Glaucoma", tx: "Mydriasis from M3 blockade \u2192 \u2191IOP risk. Relative contraindication (same as atropine)." },
    { tp: "cau", ti: "GI Ileus", tx: "\u2193GI motility from M3 blockade. Caution in patients with existing ileus or bowel obstruction." },
  ],
  ix: [
    { dr: "Neostigmine", ef: "Standard pairing: glyco 0.2 mg per neostigmine 1 mg. Counters muscarinic side effects of AChE inhibition.", sv: "high" },
    { dr: "Other Anticholinergics", ef: "Additive peripheral effects: tachycardia, urinary retention, ileus, \u2193secretions. Watch total anticholinergic burden.", sv: "mod" },
    { dr: "Potassium Chloride (oral)", ef: "Slowed GI transit from glycopyrrolate \u2192 prolonged KCl contact with mucosa \u2192 ulceration risk.", sv: "mod" },
  ],
  pearls: [
    { ti: "Quaternary = No BBB Crossing", tx: "Permanent positive charge cannot cross lipid bilayer. Zero CNS effects (no confusion, agitation, hallucinations). This is the #1 reason to choose glycopyrrolate over atropine when CNS effects are undesirable." },
    { ti: "Better Antisialagogue Than Atropine", tx: "Glycopyrrolate is a more potent drying agent despite being less potent as a vagolytic. Preferred for: fiberoptic intubation prep, ketamine premedication, excessive secretions." },
    { ti: "Glyco vs Atropine: The Interview Table", tx: "Onset: Glyco 2\u20133 min vs Atropine 30\u201360 sec. BBB: Glyco NO vs Atropine YES. Tachycardia: Glyco less vs Atropine more. Duration: Glyco longer. Antisialagogue: Glyco better. Renal: Glyco 80% unchanged vs Atropine 50%." },
    { ti: "Neostigmine Pairing", tx: "0.2 mg glyco per 1 mg neostigmine. Glycopyrrolate's onset (2\u20133 min) better matches neostigmine's onset than atropine's faster onset, providing more sustained protection against muscarinic effects." },
    { ti: "Renal Failure Consideration", tx: "80% excreted unchanged in urine. In CKD/ESRD: accumulates \u2192 prolonged effect. Switch to atropine (50% hepatic) or reduce dose significantly." },
  ],
  intQs: [
    { q: "Patient needs antisialagogue before fiberoptic intubation. Atropine or glycopyrrolate?", a: "Glycopyrrolate. Superior antisialagogue effect (more potent M3 blockade at glands). No CNS effects (quaternary amine, no BBB crossing). Less tachycardia. Longer duration. Give 0.2 mg IV 15\u201330 min before procedure." },
    { q: "Why can't glycopyrrolate cross the blood-brain barrier?", a: "Quaternary ammonium structure: the nitrogen has 4 carbon substituents creating a permanent positive charge at any pH. Charged molecules cannot cross lipid bilayer membranes. Atropine is tertiary (3 substituents), can be uncharged at physiologic pH, and freely crosses the BBB." },
    { q: "Patient in renal failure needs an anticholinergic. What's your concern with glycopyrrolate?", a: "80% is excreted unchanged in urine. Renal failure \u2192 drug accumulation \u2192 prolonged anticholinergic effects (tachycardia, urinary retention, ileus). Consider atropine instead (50% hepatic metabolism, 50% renal) or significantly reduce glycopyrrolate dose." },
  ],
},{
  id: "hydralazine", name: "Hydralazine", brand: "Apresoline",
  tags: ["Direct Vasodilator", "Arteriolar Selective", "Non-Adrenergic", "Hydrazinophthalazine"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Direct-acting arteriolar vasodilator (hydrazinophthalazine)", "Primary Target": "Vascular smooth muscle \u2014 arteriolar > venous", "Action": "Multiple mechanisms: \u2191NO/cGMP, interference with IP\u2083-mediated Ca\u00b2\u207a release, K\u207a channel opening", "G-Protein": "Non-receptor mechanism (downstream of GPCR signaling)", "Selectivity": "Arteriolar >> venous (minimal preload reduction)", "Key Feature": "Arteriolar selectivity + reflex tachycardia + pregnancy safe" },
  moa: "Hydralazine produces arteriolar vasodilation through multiple interconnected mechanisms that converge on reducing intracellular calcium in vascular smooth muscle:\n\n1. NO/cGMP pathway: Stimulates endothelial NO release \u2192 NO diffuses into vascular smooth muscle \u2192 activates soluble guanylate cyclase (sGC) \u2192 GTP \u2192 cGMP \u2192 activates protein kinase G (PKG) \u2192 inhibits Ca\u00b2\u207a release from SR + stimulates Ca\u00b2\u207a reuptake \u2192 \u2193intracellular Ca\u00b2\u207a \u2192 smooth muscle relaxation.\n\n2. IP\u2083 interference: Directly interferes with IP\u2083-mediated Ca\u00b2\u207a release from the SR, blocking the Gq/PLC downstream pathway without blocking the receptor itself.\n\n3. K\u207a channel opening: Opens KATP channels \u2192 K\u207a efflux \u2192 hyperpolarization \u2192 voltage-gated Ca\u00b2\u207a channels close \u2192 \u2193Ca\u00b2\u207a entry.\n\n4. PDE inhibition: May inhibit phosphodiesterase (PDE), preventing cGMP degradation and prolonging the vasodilatory signal.\n\nCritical selectivity: Acts on ARTERIOLES >> veins. This means: \u2193SVR and \u2193afterload with minimal \u2193preload. The preserved preload triggers robust REFLEX TACHYCARDIA and increased cardiac output via the baroreceptor reflex.",
  recPhys: "The arteriolar selectivity creates a distinctive hemodynamic profile:\n\nArteriolar vasodilation: Hydralazine's mechanisms (\u2191cGMP, IP\u2083 blockade, KATP opening) primarily affect arteriolar smooth muscle, which has higher resting tone and more dependence on IP\u2083-mediated Ca\u00b2\u207a cycling than venous smooth muscle.\n\nBaroreceptor reflex activation: \u2193SVR \u2192 \u2193MAP \u2192 \u2193carotid/aortic baroreceptor stretch \u2192 \u2193afferent firing to NTS \u2192 \u2191sympathetic outflow + \u2193vagal tone \u2192 reflex tachycardia + \u2191contractility + \u2191renin release.\n\nThis reflex sympathetic activation is why hydralazine is RARELY used as monotherapy. The compensatory response (tachycardia, \u2191CO, RAAS activation, fluid retention) can offset the antihypertensive effect. In clinical practice, it is paired with a beta-blocker (controls tachycardia) and a diuretic (prevents fluid retention).\n\nPregnancy safety: Hydralazine does NOT affect uterine blood flow at therapeutic doses because uteroplacental circulation is already maximally dilated in pregnancy. The arteriolar vasodilation occurs in the systemic vascular bed while preserving uteroplacental perfusion. Combined with long safety track record, this makes it first-line for acute severe hypertension/preeclampsia (along with labetalol and nifedipine).",
  dosing: [
    { ind: "Hypertensive Emergency/Urgency", dose: "5\u201320 mg IV q20\u201330 min", notes: "Onset 5\u201320 min, peak 10\u201340 min. Unpredictable response \u2014 start low. Max 40 mg/dose.", clr: "ac" },
    { ind: "Preeclampsia / Eclampsia", dose: "5 mg IV, then 5\u201310 mg q20\u201330 min", notes: "First-line with labetalol for acute severe HTN in pregnancy. Target SBP <160, DBP <110.", clr: "wn" },
    { ind: "Chronic HTN (PO)", dose: "25\u201350 mg PO TID-QID", notes: "Max 300 mg/day. Doses >200 mg/day increase SLE-like syndrome risk. Usually with beta-blocker + diuretic.", clr: "pr" },
    { ind: "Heart Failure (with isosorbide dinitrate)", dose: "25\u201350 mg PO TID", notes: "Fixed-dose combo (BiDil). Reduces afterload + NO supplementation. Shown to benefit African American HF patients (A-HeFT trial).", clr: "pk" },
  ],
  kin: { onset: "IV: 5\u201320 min", onsetD: "Slower than most IV antihypertensives (compare nicardipine 1\u20135 min)", peak: "10\u201340 min IV", peakD: "Highly variable \u2014 unpredictable dosing", dur: "2\u20136 hours", durD: "Prolonged duration from active metabolite", vd: "1.5\u20134.5 L/kg", pb: "87%", hl: "2\u20138 hours (variable by acetylator phenotype)", csht: "N/A", cl: "Hepatic NAT2 acetylation", model: "Multi-compartment" },
  metab: "Hepatic metabolism via N-acetyltransferase 2 (NAT2) \u2014 the acetylation pathway. This is the source of critical pharmacogenomic variability:\n\nFast acetylators (~50% Caucasians, ~90% Japanese): Rapid hepatic metabolism \u2192 lower plasma levels, shorter half-life (2\u20134h), may need higher doses.\n\nSlow acetylators (~50% Caucasians, ~10% Japanese): Reduced NAT2 activity \u2192 higher plasma levels, longer half-life (4\u20138h), greater drug exposure, HIGHER RISK of SLE-like syndrome.\n\nThe SLE-like syndrome (drug-induced lupus): Hydralazine is metabolized to reactive intermediates that bind to nuclear proteins, creating neo-antigens. Anti-histone antibodies develop. Risk increases with: doses >200 mg/day, slow acetylator phenotype, female sex, HLA-DR4. Presents with arthralgias, myalgias, pleuritis, pericarditis. Resolves with drug discontinuation (unlike idiopathic SLE, which does not resolve).\n\nAdditional: CYP3A4 involvement (minor), renal excretion of metabolites.",
  warn: [
    { tp: "bb", ti: "SLE-Like Syndrome", tx: "Drug-induced lupus with anti-histone antibodies. Risk: >200 mg/day, slow acetylators, female, HLA-DR4. Arthralgias, serositis, rash. Reversible on discontinuation." },
    { tp: "ci", ti: "Aortic Dissection", tx: "CONTRAINDICATED. Reflex tachycardia \u2191dP/dt (rate of pressure rise) \u2192 worsens aortic shear stress and propagation. Use esmolol or labetalol instead." },
    { tp: "ci", ti: "Severe Tachycardia/ACS", tx: "Reflex sympathetic activation \u2191myocardial O\u2082 demand. Dangerous in unstable angina/MI." },
    { tp: "cau", ti: "Unpredictable Onset/Response", tx: "Variable onset (5\u201320 min) and acetylator-dependent metabolism make titration difficult. Less predictable than nicardipine or clevidipine." },
    { tp: "cau", ti: "Reflex Tachycardia", tx: "Robust baroreceptor-mediated sympathetic activation. Pair with beta-blocker. Avoid in aortic dissection, ACS, tachyarrhythmias." },
  ],
  ix: [
    { dr: "Beta-Blockers", ef: "Beneficial pairing: beta-blocker controls reflex tachycardia. Standard combination for chronic HTN.", sv: "mod" },
    { dr: "Diuretics", ef: "Prevents hydralazine-induced fluid retention from RAAS activation. Enhances antihypertensive effect.", sv: "mod" },
    { dr: "Isosorbide Dinitrate", ef: "Fixed-dose combo (BiDil). Synergistic: hydralazine \u2193afterload + ISDN \u2193preload + supplemental NO. A-HeFT trial: mortality benefit in African American HF patients.", sv: "mod" },
  ],
  pearls: [
    { ti: "Arteriolar > Venous", tx: "Unlike nitroprusside (arterial + venous), hydralazine is arteriolar selective. Minimal preload reduction \u2192 robust reflex tachycardia. Never use as monotherapy \u2014 pair with beta-blocker." },
    { ti: "Pregnancy First-Line", tx: "Along with labetalol and nifedipine. Safe in all trimesters. Does not reduce uteroplacental blood flow at therapeutic doses. ACOG recommended." },
    { ti: "Aortic Dissection = Contraindicated", tx: "Reflex tachycardia increases dP/dt (rate of aortic pressure rise) \u2192 worsens shear stress on dissection flap. Use esmolol or labetalol (reduce HR first, then MAP)." },
    { ti: "Slow vs Fast Acetylators", tx: "NAT2 polymorphism. Slow acetylators: more drug exposure, higher SLE risk, longer half-life. Fast: may need higher doses. This is a classic pharmacogenomics interview question." },
    { ti: "BiDil (Hydralazine + ISDN)", tx: "A-HeFT trial: 43% reduction in mortality in self-identified African American patients with HFrEF. Hydralazine prevents nitrate tolerance by scavenging superoxide." },
  ],
  intQs: [
    { q: "Pregnant patient at 34 weeks with BP 178/112. What's your approach?", a: "Acute severe hypertension in preeclampsia. IV hydralazine 5 mg or IV labetalol 20 mg. Target SBP <160, DBP <110. Also give magnesium sulfate for seizure prophylaxis. Hydralazine is safe in pregnancy \u2014 does not reduce uteroplacental blood flow at therapeutic doses." },
    { q: "Patient with acute aortic dissection. Can you use hydralazine?", a: "Absolutely NOT. Hydralazine causes reflex tachycardia which increases dP/dt (rate of aortic pressure rise). This worsens shear stress on the dissection flap and promotes propagation. Use IV esmolol or labetalol first to reduce HR to <60, THEN add vasodilator (nicardipine or nitroprusside) if MAP still elevated." },
    { q: "Patient develops joint pain and pleuritis on chronic hydralazine. What's happening?", a: "Drug-induced lupus (SLE-like syndrome). Check anti-histone antibodies (positive in >95% of cases). Risk factors: dose >200 mg/day, slow NAT2 acetylator, female, HLA-DR4. Treatment: discontinue hydralazine \u2014 symptoms resolve over weeks to months. Unlike idiopathic SLE, drug-induced lupus does NOT cause renal or CNS involvement and resolves on discontinuation." },
  ],
},{
  id: "labetalol", name: "Labetalol", brand: "Trandate / Normodyne",
  tags: ["Combined \u03b1/\u03b2 Blocker", "Non-Selective \u03b2 + \u03b11", "Antihypertensive", "Adrenergic Antagonist"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Combined non-selective \u03b2 + selective \u03b11 adrenergic antagonist", "Primary Targets": "\u03b21, \u03b22 (antagonist) + \u03b11 (antagonist)", "Action": "Dual blockade: \u03b2 >> \u03b1 (ratio 7:1 IV, 3:1 PO)", "G-Proteins": "Blocks \u03b21/\u03b22 (Gs) + \u03b11 (Gq) signaling", "Selectivity": "\u03b2:\u03b1 ratio = 7:1 IV, 3:1 oral", "Key Feature": "Reduces BP without reflex tachycardia (combined \u03b1+\u03b2 blockade)" },
  moa: "Labetalol provides dual adrenergic blockade at both alpha and beta receptors:\n\n\u03b21/\u03b22 Antagonism (primary): Blocks Gs-coupled receptors \u2192 \u2193adenylyl cyclase activity \u2192 \u2193cAMP \u2192 \u2193PKA. At the heart: \u2193chronotropy (HR), \u2193inotropy (contractility), \u2193dromotropy (AV conduction). At the kidney: \u2193renin release. Net: \u2193CO and \u2193RAAS activation.\n\n\u03b11 Antagonism (secondary): Blocks Gq-coupled receptors \u2192 prevents PLC/IP\u2083/Ca\u00b2\u207a cascade \u2192 prevents vasoconstriction \u2192 \u2193SVR. This peripheral vasodilation component is what distinguishes labetalol from pure beta-blockers.\n\nThe dual blockade ratio is 7:1 (\u03b2:\u03b1) IV and 3:1 PO. This means beta-blockade predominates, but the alpha component provides critical vasodilation that:\n(1) Prevents the reflex tachycardia seen with pure vasodilators (hydralazine)\n(2) Prevents the \u2191SVR seen with pure beta-blockers (compensatory \u03b1 vasoconstriction when \u03b2 is blocked)\n\nNet hemodynamic effect: \u2193BP (via \u2193SVR + \u2193CO) with PRESERVED cardiac output (the \u03b1 vasodilation offsets the \u03b2-mediated CO reduction). Heart rate decreases modestly or remains stable.",
  recPhys: "Understanding why labetalol preserves cardiac output despite beta-blockade:\n\nPure beta-blockers (metoprolol, esmolol): Block \u03b21 \u2192 \u2193HR + \u2193contractility \u2192 \u2193CO. This triggers baroreceptor-mediated sympathetic activation \u2192 \u2191NE release \u2192 unopposed \u03b11 stimulation \u2192 \u2191SVR. Net: CO falls, SVR rises, BP may not decrease significantly.\n\nLabetalol adds \u03b11 blockade: The \u03b11 component blocks the compensatory vasoconstriction \u2192 SVR decreases. Reduced afterload means the ventricle ejects more easily despite reduced contractility. This afterload reduction partially compensates for the \u03b21-mediated CO reduction, preserving overall cardiac output.\n\nDual Gq + Gs blockade: \u03b11 blockade prevents PLC \u2192 IP\u2083 \u2192 Ca\u00b2\u207a \u2192 MLCK pathway in vascular smooth muscle. \u03b21 blockade prevents adenylyl cyclase \u2192 cAMP \u2192 PKA pathway in cardiomyocytes. Both signaling cascades are suppressed simultaneously.\n\nPregnancy considerations: Labetalol does not significantly reduce uteroplacental blood flow because the \u03b11 blockade prevents vasoconstriction in the uteroplacental bed. It is first-line (along with nifedipine and hydralazine) for both acute and chronic hypertension in pregnancy. \u03b21 blockade: potential fetal bradycardia/hypoglycemia at high doses, but clinically manageable.",
  dosing: [
    { ind: "Hypertensive Emergency (IV bolus)", dose: "10\u201320 mg IV over 2 min, then 20\u201380 mg q10 min", notes: "Escalating dose protocol. Max 300 mg total. Onset 2\u20135 min.", clr: "ac" },
    { ind: "Hypertensive Emergency (infusion)", dose: "0.5\u20132 mg/min IV", notes: "Continuous infusion. Titrate to target BP. Alternative to bolus dosing.", clr: "wn" },
    { ind: "Preeclampsia / Pregnancy HTN", dose: "20 mg IV, then 20\u201340 mg q10\u201315 min", notes: "First-line IV antihypertensive in pregnancy. Max 300 mg. Target SBP <160, DBP <110.", clr: "pr" },
    { ind: "Chronic HTN (PO)", dose: "100\u2013400 mg PO BID", notes: "Oral ratio 3:1 (\u03b2:\u03b1). Max 2400 mg/day. Take with food.", clr: "pk" },
    { ind: "Aortic Dissection (adjunct)", dose: "20 mg IV, then infusion 1\u20132 mg/min", notes: "Reduces both HR and BP. Target HR <60 first, then MAP 60\u201370. Often combined with esmolol for faster HR control.", clr: "dg" },
  ],
  kin: { onset: "IV: 2\u20135 min", onsetD: "Rapid onset for hypertensive emergencies", peak: "5\u201315 min IV", peakD: "Predictable dose-response", dur: "2\u201312 hours IV (dose-dependent)", durD: "Prolonged duration allows q10 min bolus dosing", vd: "3\u201316 L/kg", pb: "~50%", hl: "5.5\u20138 hours", csht: "N/A", cl: "Hepatic glucuronidation + CYP2D6", model: "Multi-compartment" },
  metab: "Extensive hepatic metabolism via two primary pathways:\n\n1. Glucuronidation (primary): Direct conjugation \u2192 inactive glucuronide metabolites \u2192 renal excretion. First-pass metabolism is significant (~75%), explaining low oral bioavailability (25%).\n\n2. CYP2D6 (secondary): Oxidative metabolism. CYP2D6 poor metabolizers may have higher plasma levels and exaggerated effects.\n\nNo active metabolites.\n\n55\u201360% renally excreted (as metabolites), 12\u201327% biliary excretion.\n\nHalf-life 5.5\u20138 hours. Duration of action often exceeds half-life (receptor binding kinetics).\n\nHepatic impairment: significantly increased bioavailability and prolonged effect. Reduce dose.\n\nRenal impairment: metabolites accumulate but are inactive. Generally no dose adjustment needed.\n\nCYP2D6 polymorphism: poor metabolizers (~7% Caucasians) may have exaggerated hypotensive effect.",
  warn: [
    { tp: "bb", ti: "Severe Bradycardia/Heart Block", tx: "\u03b21 blockade can cause symptomatic bradycardia, 2nd/3rd degree AV block. Avoid in pre-existing high-degree block without pacemaker." },
    { tp: "ci", ti: "Decompensated Heart Failure", tx: "\u03b21 blockade + negative inotropy can worsen acute HF. Contraindicated in decompensated/acute HF (chronic stable HF: beta-blockers are beneficial)." },
    { tp: "ci", ti: "Severe Asthma/Bronchospasm", tx: "Non-selective \u03b22 blockade \u2192 bronchoconstriction. Contraindicated in severe reactive airway disease. Use cardioselective beta-blocker if needed (metoprolol, esmolol)." },
    { tp: "ci", ti: "Cocaine Intoxication", tx: "CONTROVERSIAL. Traditional teaching: beta-blockers cause 'unopposed alpha stimulation' \u2192 worsened HTN/coronary vasospasm. However, labetalol's \u03b11 blockade theoretically mitigates this. Most guidelines still recommend avoiding beta-blockers in acute cocaine toxicity \u2014 use benzodiazepines, phentolamine, or nicardipine." },
    { tp: "cau", ti: "Rebound Hypertension", tx: "Chronic beta-blocker therapy causes \u03b2-receptor upregulation. Abrupt discontinuation \u2192 increased receptor density + catecholamine surge \u2192 rebound tachycardia and hypertension. Taper over 1\u20132 weeks." },
    { tp: "cau", ti: "Hypoglycemia Masking", tx: "\u03b2 blockade blunts tachycardia and tremor responses to hypoglycemia. Diaphoresis (cholinergic) is preserved. Critical in diabetic patients on insulin." },
  ],
  ix: [
    { dr: "Calcium Channel Blockers (non-DHP)", ef: "Additive negative chronotropy/dromotropy with verapamil/diltiazem. Risk of severe bradycardia, heart block, cardiac arrest.", sv: "high" },
    { dr: "Clonidine", ef: "Additive bradycardia. If both discontinued simultaneously: rebound hypertensive crisis from unopposed sympathetic surge.", sv: "high" },
    { dr: "Insulin / Sulfonylureas", ef: "\u03b2 blockade masks hypoglycemia symptoms (tachycardia, tremor). Diaphoresis preserved. Monitor glucose closely.", sv: "mod" },
    { dr: "CYP2D6 Inhibitors", ef: "Fluoxetine, paroxetine, bupropion inhibit CYP2D6 \u2192 increased labetalol levels \u2192 exaggerated effect.", sv: "mod" },
  ],
  pearls: [
    { ti: "7:1 \u03b2:\u03b1 Ratio (IV)", tx: "Beta-blockade predominates. The \u03b11 component prevents reflex tachycardia (unlike pure \u03b2-blockers) and provides vasodilation without compensatory SVR increase. Oral ratio is 3:1." },
    { ti: "Preserves Cardiac Output", tx: "Unlike pure beta-blockers (\u2193CO from \u2193HR/contractility), labetalol's \u03b11 vasodilation reduces afterload, partially compensating for \u03b21-mediated CO reduction. Net CO is relatively preserved." },
    { ti: "Pregnancy Safe", tx: "First-line for both acute and chronic HTN in pregnancy. Does not reduce uteroplacental blood flow. Potential fetal bradycardia at high doses but clinically manageable." },
    { ti: "Cocaine: Still Controversial", tx: "Traditional teaching says avoid all beta-blockers with cocaine (unopposed alpha). Labetalol has \u03b11 blockade, but most guidelines still recommend against it. Use benzos + phentolamine + nicardipine." },
    { ti: "Rebound Hypertension", tx: "Chronic \u03b2 blockade causes receptor upregulation. Abrupt stop \u2192 catecholamine surge hits increased receptor density \u2192 severe rebound HTN/tachycardia. Always taper over 1\u20132 weeks." },
    { ti: "Aortic Dissection Role", tx: "Reduces BOTH HR (dP/dt) and BP. Can be used alone or with esmolol. Target HR <60 first, then MAP. Superior to hydralazine which causes reflex tachycardia." },
  ],
  intQs: [
    { q: "BP 210/120, HR 95, no end-organ damage yet. First-line IV agent?", a: "IV labetalol 20 mg over 2 min. Provides rapid, predictable BP reduction via dual \u03b1+\u03b2 blockade without reflex tachycardia. Escalate to 40\u201380 mg q10 min or start infusion 0.5\u20132 mg/min. Max 300 mg. Alternative: nicardipine infusion." },
    { q: "Why is labetalol preferred over metoprolol for hypertensive emergencies?", a: "Metoprolol is pure \u03b21-selective \u2192 reduces CO but triggers compensatory \u2191SVR (baroreceptor reflex + unopposed \u03b11). Net BP reduction is modest. Labetalol blocks both \u03b2 AND \u03b11 \u2192 reduces CO AND SVR simultaneously \u2192 more effective BP reduction without compensatory vasoconstriction or reflex tachycardia." },
    { q: "Patient with cocaine-induced HTN and chest pain. Can you give labetalol?", a: "CONTROVERSIAL but most guidelines say AVOID beta-blockers in acute cocaine toxicity. Traditional concern: \u03b2 blockade removes \u03b22 vasodilation \u2192 unopposed \u03b1 vasoconstriction \u2192 worsened HTN + coronary spasm. Labetalol's \u03b11 blockade theoretically mitigates this, but evidence is limited. First-line: benzodiazepines (reduce sympathetic surge), then phentolamine or nicardipine if BP remains elevated." },
    { q: "Patient on chronic labetalol stops taking it before surgery. What's the concern?", a: "Rebound hypertension and tachycardia. Chronic \u03b2 blockade causes \u03b2-receptor upregulation (increased receptor density). Abrupt withdrawal \u2192 endogenous catecholamines act on more receptors \u2192 exaggerated response \u2192 hypertensive crisis, tachycardia, potential myocardial ischemia. Continue beta-blockers perioperatively or taper over 1\u20132 weeks before elective surgery." },
  ],
},
{
  id: "ketamine", name: "Ketamine", brand: "Ketalar",
  tags: ["Dissociative Anesthetic", "NMDA Antagonist", "Phencyclidine Derivative", "Analgesic"],
  systems: ["neuro", "pharm"], type: "medication",
  ov: { "Drug Class": "Phencyclidine derivative \u2014 dissociative anesthetic", "Primary Target": "NMDA receptor (non-competitive antagonist)", "Action": "Open-channel block of NMDA Ca\u00b2\u207a/Na\u207a channel + opioid receptor modulation + monoamine reuptake inhibition", "Ion Channel": "Blocks NMDA Ca\u00b2\u207a/Na\u207a influx \u2192 dissociation", "Formulation": "10, 50, 100 mg/mL solutions", "Schedule": "DEA Schedule III" },
  moa: "Ketamine is a phencyclidine (PCP) derivative that produces dissociative anesthesia \u2014 a unique cataleptic state of profound analgesia and amnesia with preserved airway reflexes and spontaneous ventilation (at appropriate doses).\n\nPRIMARY MECHANISM \u2014 NMDA Receptor Antagonism:\nKetamine is a non-competitive, use-dependent antagonist of the NMDA (N-methyl-D-aspartate) glutamate receptor. The NMDA receptor is a ligand-gated ion channel permeable to Ca\u00b2\u207a and Na\u207a. Under normal conditions, glutamate + glycine binding opens the channel, but Mg\u00b2\u207a blocks the pore at resting membrane potential (voltage-dependent block). When the neuron depolarizes (by AMPA receptor activation), Mg\u00b2\u207a is expelled, and Ca\u00b2\u207a/Na\u207a flow in \u2014 driving excitatory neurotransmission.\n\nKetamine enters the OPEN channel and binds the PCP site inside the pore (between Mg\u00b2\u207a site and selectivity filter). This is USE-DEPENDENT: the channel must open before ketamine can block it. Once bound, ketamine physically occludes ion flow, preventing Ca\u00b2\u207a/Na\u207a influx even when glutamate is present.\n\nNMDA blockade in the thalamus and limbic system produces the dissociative state: functional disconnection between thalamocortical and limbic systems. The patient appears conscious (eyes open, nystagmus, purposeful movements) but is dissociated from sensory input.\n\nSECONDARY MECHANISMS:\n\u2022 Opioid receptor modulation: weak agonist at mu (\u03bc) and kappa (\u03ba) opioid receptors \u2192 contributes to analgesia\n\u2022 Monoamine reuptake inhibition: blocks reuptake of norepinephrine, dopamine, and serotonin \u2192 sympathomimetic effects (indirect)\n\u2022 Sodium channel blockade: weak local anesthetic effect at high concentrations\n\u2022 HCN1 channel interaction: may contribute to hypnotic effect\n\u2022 Anti-inflammatory: suppresses NF-\u03baB, reduces TNF-\u03b1 and IL-6 production",
  recPhys: "NMDA Receptor Physiology \u2014 The Coincidence Detector:\n\nThe NMDA receptor requires TWO simultaneous conditions to open (hence 'coincidence detector'):\n1. Ligand binding: Glutamate (agonist site) + Glycine/D-serine (co-agonist site required)\n2. Membrane depolarization: Expels Mg\u00b2\u207a from the channel pore (voltage-dependent block)\n\nWhen both conditions are met: the channel opens and conducts Ca\u00b2\u207a and Na\u207a inward. The Ca\u00b2\u207a influx is critical \u2014 it activates CaMKII (calcium-calmodulin kinase II), which triggers:\n\u2022 Long-term potentiation (LTP) \u2014 synaptic strengthening, learning, memory formation\n\u2022 Central sensitization \u2014 wind-up phenomenon in dorsal horn (pain amplification)\n\u2022 Excitotoxicity \u2014 excessive Ca\u00b2\u207a \u2192 mitochondrial damage \u2192 neuronal death (stroke, TBI)\n\nKetamine's Clinical Relevance at Each Level:\n\nAnalgesia: NMDA blockade in the dorsal horn prevents central sensitization and wind-up. This is why sub-anesthetic ketamine (0.1\u20130.3 mg/kg/hr) is effective for opioid-resistant pain and reduces opioid requirements by 30\u201350% (opioid-sparing effect).\n\nNeuroprotection: By blocking excessive Ca\u00b2\u207a influx through NMDA channels, ketamine may limit excitotoxic injury. Theoretical benefit in TBI, status epilepticus (late/refractory stages).\n\nAntidepressant effect: NMDA blockade triggers a cascade: \u2191BDNF (brain-derived neurotrophic factor) \u2192 \u2191mTOR signaling \u2192 rapid synaptogenesis in prefrontal cortex. This produces antidepressant effects within 2\u20134 hours (vs. weeks for SSRIs). Esketamine (Spravato) is FDA-approved for treatment-resistant depression.\n\nSympathomimetic profile: Ketamine's monoamine reuptake inhibition centrally stimulates the sympathetic nervous system \u2192 \u2191HR, \u2191BP, \u2191SVR. This is why ketamine is the induction agent of choice in hemodynamically unstable patients (trauma, hemorrhagic shock, tamponade). However, in catecholamine-depleted patients (end-stage septic shock, prolonged critical illness), the indirect mechanism fails and ketamine's direct myocardial depressant effect is unmasked \u2192 cardiovascular collapse.",
  dosing: [
    { ind: "IV Induction", dose: "1\u20132 mg/kg IV", notes: "Onset 30\u201360 sec. Duration 10\u201320 min. Dissociative dose. Preserves airway reflexes and ventilation (usually).", clr: "ac" },
    { ind: "IM Induction / Sedation", dose: "4\u201310 mg/kg IM", notes: "Onset 3\u20135 min. Duration 20\u201330 min. Useful when no IV access (pediatric, combative patient, field).", clr: "wn" },
    { ind: "Analgesic (Sub-dissociative)", dose: "0.1\u20130.3 mg/kg IV bolus or 0.1\u20130.3 mg/kg/hr infusion", notes: "Low-dose. Opioid-sparing 30\u201350%. Adjunct for acute pain, burns, trauma. No dissociation at this dose.", clr: "pr" },
    { ind: "RSI (Hemodynamically Unstable)", dose: "1\u20132 mg/kg IV", notes: "Agent of choice in shock/trauma. Maintains HR, BP, SVR via sympathomimetic effect. NOT in catecholamine-depleted patients.", clr: "ac" },
    { ind: "Status Epilepticus (Refractory)", dose: "1\u20134.5 mg/kg IV bolus, then 0.5\u20135 mg/kg/hr infusion", notes: "Third/fourth-line. NMDA antagonism targets glutamate excitotoxicity when GABA agents fail (receptor internalization).", clr: "wn" },
    { ind: "Procedural Sedation (Peds)", dose: "1\u20132 mg/kg IV or 4\u20135 mg/kg IM", notes: "Excellent for painful procedures. Pair with glycopyrrolate 0.01 mg/kg (antisialagogue) and midazolam 0.05 mg/kg (emergence prophylaxis).", clr: "pk" },
  ],
  kin: { onset: "IV: 30\u201360 sec. IM: 3\u20135 min", onsetD: "Rapid lipophilicity \u2192 fast CNS distribution", peak: "1 min IV, 5\u201320 min IM", peakD: "Redistribution-limited duration", dur: "10\u201320 min IV, 20\u201330 min IM", durD: "Terminated by redistribution (like thiopental), NOT metabolism", vd: "3 L/kg", pb: "12\u201347% (alpha-1 acid glycoprotein)", hl: "2\u20133 hours", csht: "N/A (redistribution-dependent)", cl: "Hepatic CYP3A4, CYP2B6", model: "Three-compartment" },
  metab: "Hepatic metabolism via CYP3A4 (major) and CYP2B6:\n\nPrimary pathway: N-demethylation to NORKETAMINE (active metabolite).\nNorketamine has ~30% the potency of ketamine at the NMDA receptor.\nNorketamine is further hydroxylated then conjugated (glucuronidation) for renal excretion.\n\nTermination of single-dose effect: REDISTRIBUTION (like thiopental) \u2014 rapid movement from CNS to muscle/fat. NOT metabolism.\n\nHalf-life: 2\u20133 hours (parent compound). Context-sensitive: prolonged infusions accumulate norketamine.\n\nHepatically impaired: reduced clearance, prolonged effect. No dose adjustment formally recommended but use with caution.\n\nRenal excretion: 90% as metabolites, <5% unchanged.\n\nStereochemistry: Racemic mixture of S(+) and R(\u2212) enantiomers. S-ketamine (esketamine): 3\u20134x more potent at NMDA receptor, faster clearance, fewer psychomimetic effects. Available as Spravato (nasal spray, depression) and IV formulation in some countries.",
  warn: [
    { tp: "cau", ti: "Emergence Delirium / Psychomimetic Effects", tx: "Vivid dreams, hallucinations, delirium on emergence. Risk: adults > children, females > males, high doses, rapid administration. Prophylaxis: midazolam 0.03\u20130.05 mg/kg co-administration reduces incidence by ~50%." },
    { tp: "cau", ti: "Hypersalivation", tx: "Stimulates salivary and tracheobronchial secretions (cholinomimetic-like effect). Pre-treat with glycopyrrolate 0.2 mg or atropine 0.01 mg/kg. Excessive secretions can cause laryngospasm, especially in children." },
    { tp: "ci", ti: "Elevated ICP (Historical \u2014 NOW DEBATED)", tx: "Traditional teaching: ketamine raises ICP via cerebral vasodilation. Current evidence: in ventilated patients, ketamine does NOT significantly raise ICP and may actually be neuroprotective. No longer absolutely contraindicated in TBI when used with controlled ventilation. Still avoid in patients with obstructive hydrocephalus or space-occupying lesions without ICP monitoring." },
    { tp: "cau", ti: "Catecholamine-Depleted Patients", tx: "In end-stage shock / prolonged critical illness, catecholamine stores are exhausted. Without NE/DA to release, ketamine's indirect sympathomimetic mechanism fails. The direct myocardial depressant effect is UNMASKED \u2192 hypotension, cardiovascular collapse. Use with extreme caution." },
    { tp: "cau", ti: "Increased Myocardial O\u2082 Demand", tx: "\u2191HR + \u2191BP + \u2191contractility = \u2191MVO\u2082. Avoid in severe CAD, aortic stenosis, or decompensated HF where myocardial oxygen supply-demand balance is critical." },
  ],
  ix: [
    { dr: "Benzodiazepines", ef: "Blunt emergence delirium/psychomimetic effects. Midazolam 0.03\u20130.05 mg/kg standard co-administration. Also reduces ketamine-induced nystagmus.", sv: "high" },
    { dr: "Glycopyrrolate / Atropine", ef: "Antisialagogue pairing. Glycopyrrolate preferred (no BBB crossing). Reduces hypersalivation and laryngospasm risk.", sv: "high" },
    { dr: "Volatile Anesthetics", ef: "May prolong ketamine duration. Additive sympathomimetic effect \u2192 dysrhythmia risk (especially halothane, less with modern agents).", sv: "mod" },
    { dr: "Propofol / Ketofol", ef: "Complementary hemodynamic profiles: propofol \u2193BP/HR + ketamine \u2191BP/HR = hemodynamic stability. Popular for procedural sedation. Typical ratio 1:1.", sv: "mod" },
    { dr: "Non-depolarizing NMBAs", ef: "Ketamine may enhance the duration of non-depolarizing NMBAs. Monitor train-of-four closely.", sv: "low" },
    { dr: "Thyroid Hormones", ef: "Excess thyroid hormone + ketamine \u2192 exaggerated sympathomimetic response \u2192 severe hypertension, tachycardia. Caution in thyrotoxicosis.", sv: "mod" },
  ],
  pearls: [
    { ti: "The Hemodynamically Stable Induction Agent", tx: "Ketamine is the go-to for induction in trauma, hemorrhagic shock, tamponade, and hemodynamically unstable patients. It maintains HR, BP, and SVR via indirect sympathomimetic effects. EXCEPT in catecholamine-depleted patients (end-stage sepsis, prolonged shock) where the indirect mechanism fails." },
    { ti: "ICP: The Myth That Won't Die", tx: "Traditional teaching says ketamine is contraindicated in elevated ICP. Current evidence (Zeiler 2014, Cohen 2015): in mechanically ventilated patients with controlled PaCO\u2082, ketamine does NOT significantly increase ICP and may be neuroprotective (NMDA-mediated excitotoxicity reduction). Still avoid in unmonitored, spontaneously breathing patients where PaCO\u2082 may rise." },
    { ti: "Bronchodilator Properties", tx: "Ketamine is a potent bronchodilator via: (1) direct smooth muscle relaxation, (2) \u2191catecholamine release \u2192 \u03b2\u2082 bronchodilation, (3) possible anticholinergic contribution. Makes it ideal for status asthmaticus induction and sedation." },
    { ti: "Why Sub-Anesthetic Works for Pain", tx: "At 0.1\u20130.3 mg/kg/hr, ketamine blocks dorsal horn NMDA receptors \u2192 prevents central sensitization and wind-up \u2192 opioid-sparing 30\u201350%. Does NOT produce dissociation at these doses. Increasingly used for acute pain, burns, sickle cell crises." },
    { ti: "Dissociative vs. Standard Anesthesia", tx: "Dissociative anesthesia is NOT unconsciousness. It's a functional disconnection of thalamo-cortical from limbic pathways. Eyes open, nystagmus, muscle tone preserved, swallow/cough reflexes present (usually), spontaneous ventilation maintained. This is fundamentally different from GABA-ergic agents." },
    { ti: "Ketofol: Best of Both Worlds", tx: "1:1 mix of ketamine:propofol. Propofol provides smooth sedation + antiemetic + \u2193BP. Ketamine provides analgesia + \u2191BP + airway maintenance. Hemodynamic effects offset each other. Excellent for procedural sedation." },
    { ti: "Stereochemistry Matters", tx: "S-ketamine (esketamine): 3\u20134x more potent NMDA antagonist, faster hepatic clearance, fewer psychomimetic effects, faster recovery. Available as Spravato (intranasal) for treatment-resistant depression. R-ketamine: weaker NMDA antagonism but possibly better antidepressant with fewer side effects (under investigation)." },
  ],
  intQs: [
    { q: "25-year-old motorcycle crash, GCS 8, BP 78/40, HR 128, needs intubation. What induction agent?", a: "Ketamine 1\u20132 mg/kg IV. Hemodynamically unstable trauma patient \u2014 ketamine maintains HR, BP, and SVR via indirect sympathomimetic effects (monoamine reuptake inhibition \u2192 \u2191circulating catecholamines). Preserves spontaneous ventilation as backup. Provides analgesia. Note: the old contraindication for TBI/elevated ICP is largely debunked in ventilated patients with controlled PaCO\u2082. Alternatives: etomidate (hemodynamically neutral but adrenal suppression debate)." },
    { q: "How does ketamine work at the NMDA receptor?", a: "Non-competitive, use-dependent open-channel block. The NMDA receptor is a ligand-gated ion channel permeable to Ca\u00b2\u207a and Na\u207a, requiring both glutamate binding AND membrane depolarization (to expel Mg\u00b2\u207a block). Ketamine enters the OPEN channel and binds the PCP site inside the pore, physically occluding ion flow. 'Use-dependent' means the channel must first open before ketamine can access its binding site \u2014 more active neurons are blocked preferentially." },
    { q: "Why would ketamine be dangerous in a patient who's been in septic shock for 5 days on multiple vasopressors?", a: "Catecholamine depletion. Ketamine's hemodynamic stability depends on its INDIRECT sympathomimetic mechanism \u2014 it blocks reuptake of NE and dopamine, increasing synaptic catecholamine levels. After days of maximal sympathetic activation in refractory shock, presynaptic catecholamine stores are exhausted. With nothing to release or preserve, the indirect mechanism fails, and ketamine's DIRECT myocardial depressant effect is unmasked \u2192 hypotension, potential cardiovascular collapse." },
    { q: "You're using sub-anesthetic ketamine for a burn patient. How does this work and what dose?", a: "0.1\u20130.3 mg/kg bolus then 0.1\u20130.3 mg/kg/hr infusion. At sub-dissociative doses, ketamine blocks NMDA receptors in the dorsal horn of the spinal cord, preventing central sensitization (wind-up phenomenon) and glutamate-mediated pain amplification. This reduces opioid requirements by 30\u201350% without producing dissociation or significant hemodynamic changes. Additional benefit: anti-inflammatory properties (\u2193NF-\u03baB, \u2193TNF-\u03b1)." },
    { q: "A 4-year-old needs a laceration repair but has no IV access. How do you sedate them?", a: "Ketamine 4\u20135 mg/kg IM. Onset 3\u20135 min, duration 20\u201330 min. Pre-treat with glycopyrrolate 0.01 mg/kg IM (antisialagogue \u2014 prevents hypersalivation/laryngospasm) and consider midazolam 0.05 mg/kg (reduces emergence delirium). Ketamine provides dissociative anesthesia with preserved airway reflexes, spontaneous ventilation, and profound analgesia \u2014 ideal for pediatric procedural sedation without IV access." },
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
  vasopressors: { label: "Vasopressor Dosing", icon: "Q", items: [
    { q: "78 kg septic shock, MAP 58 despite 2L crystalloid. Vasopressor, dose, target?", a: "Norepinephrine 0.1â€“0.2 mcg/kg/min. Target MAP â‰¥65. First-line per SSC: Î±1 vasoconstriction + moderate Î²1 inotropy.", c: "Vasopressor Dosing" },
    { q: "On NE 0.5 mcg/kg/min, MAP still 60. Next?", a: "Vasopressin 0.04 units/min (fixed). V1 agonist â€” non-catecholamine. SSC second-line.", c: "Vasopressor Dosing" },
    { q: "Decompensated HF: CI 1.8, PCWP 28, SVR 1800. Inotrope?", a: "Dobutamine 2.5â€“10 mcg/kg/min. Î²1â†‘contractility, mild Î²2â†“SVR. Alt: milrinone if on Î²-blockers.", c: "Vasopressor Dosing" },
    { q: "Max phenylephrine infusion and receptor?", a: "0.5â€“5 mcg/kg/min (up to 10). Pure Î±1. Watch reflex bradycardia.", c: "Vasopressor Dosing" },
    { q: "Ephedrine vs phenylephrine at receptor level?", a: "Ephedrine: indirect sympathomimetic (releases NE) â†’ mixed Î±1+Î²1/Î²2. Maintains HR/CO+SVR. Tachyphylaxis. PE: direct pure Î±1.", c: "Vasopressor Dosing" },
  ]},
  acls: { label: "ACLS Algorithms", icon: "Q", items: [
    { q: "VFib witnessed. Walk through the first 2 cycles.", a: "Call code â†’ CPR (100â€“120/min, 2+in) â†’ defib pads â†’ 2 min check â†’ shock 200J â†’ CPR â†’ IV/IO â†’ after 2nd shock: epi 1mg q3â€“5min â†’ after 3rd: amio 300mg.", c: "ACLS" },
    { q: "PEA, HR 40 on monitor, no pulse. Priorities?", a: "CPR (NO shocks). Epi 1mg ASAP q3â€“5min. H's and T's aggressively. Narrow PEAâ†’mechanical. Wide PEAâ†’metabolic.", c: "ACLS" },
    { q: "Wide-complex tachy 180, alert, BP 108/72. Management?", a: "Stable â†’ amiodarone 150mg over 10min. Alt: procainamide. Polymorphic+long QTc â†’ Mg 1â€“2g. Unstable â†’ sync cardioversion 100J.", c: "ACLS" },
    { q: "Post-ROSC, comatose, temp 37.8Â°C. TTM protocol?", a: "32â€“36Â°C â‰¥24h. Cool with saline/devices. Treat shivering. Prevent hyperthermia â‰¥72h. Neuroprognosticate â‰¥72h.", c: "ACLS" },
    { q: "Name all H's and T's.", a: "H's: Hypovolemia, Hypoxia, H+ (acidosis), Hypo/HyperK, Hypothermia. T's: Tension pneumo, Tamponade, Toxins, Thrombosis (PE + coronary).", c: "ACLS" },
  ]},
};

const SYS = {
  cardio: { n: "Cardiovascular", i: "", c: "#ef4444" },
  neuro: { n: "Neurological", i: "", c: "#a855f7" },
  respiratory: { n: "Respiratory", i: "Å¸Â«Â", c: "#3b82f6" },
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
    linkedMeds: [{ id: "propofol", name: "Propofol", note: "GABA-A potentiator" }],
    futureMeds: "Succinylcholine, Rocuronium, Ketamine, Midazolam",
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
      <button key={n} onClick={() => onChange(n)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: n <= value ? t.wn : t.tM, transition: "color 0.15s", padding: "0 1px" }}>{n <= value ? "" : ""}</button>
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
  const [deviceView, setDeviceView] = useState(null);
  const [qCat, setQCat] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [qRev, setQRev] = useState(false);
  const [qSc, setQSc] = useState({ c: 0, t: 0 });
  const [conf, setConf] = useState({});
  const [notes, setNotes] = useState({});
  const [qHist, setQHist] = useState([]);
  const [timer, setTimer] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [sbOpen, setSbOpen] = useState(true);
  const [recSel, setRecSel] = useState(null);
  const [recTab, setRecTab] = useState("overview");
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

      {/* â”€â”€ SIDEBAR â”€â”€ */}
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

      {/* â”€â”€ MAIN CONTENT AREA â”€â”€ */}
      <div style={{ marginLeft: sbOpen ? "220px" : "56px", flex: 1, minHeight: "100vh", transition: "margin-left 0.2s ease", display: "flex", flexDirection: "column" }}>

        {/* â”€â”€ TOP BAR â”€â”€ */}
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "8px 16px", borderBottom: `1px solid ${t.bd}`, background: t.bgC, position: "sticky", top: 0, zIndex: 100, gap: "8px" }}>
          {(pg === "detail" || pg === "proto" || pg === "receptor" || pg === "device") && (
            <button onClick={() => { if (pg === "receptor") { setPg("pg-recep"); setRecSel(null); } else { setPg("dash"); setSel(null); setProto(null); setDeviceView(null); } }} style={{ marginRight: "auto", background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "6px", padding: "5px 12px", color: t.t2, cursor: "pointer", fontSize: "12px", fontWeight: 500 }}>
              \u2190 Back
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto" }}>
            {/* Study Timer */}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", background: t.bgS, borderRadius: "7px", padding: "4px 10px", border: `1px solid ${t.bd}` }}>
              <button onClick={() => setTimerOn(!timerOn)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px", padding: 0, color: t.t2 }}>{timerOn ? "||" : ">"}</button>
              <span style={{ fontSize: "12px", fontFamily: "monospace", color: t.t2, minWidth: "58px" }}>{fmtTime(timer)}</span>
              {timer > 0 && <button onClick={() => { setTimer(0); setTimerOn(false); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "10px", color: t.tM, padding: 0 }}>x</button>}
            </div>
            <button onClick={() => setSo(true)} style={{ display: "flex", alignItems: "center", gap: "6px", background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "7px", padding: "5px 10px", color: t.tM, cursor: "pointer", fontSize: "12px" }}>
              Search<span style={{ background: t.bgC, padding: "1px 5px", borderRadius: "3px", fontSize: "10px", border: `1px solid ${t.bd}`, marginLeft: "4px" }}>\u2318K</span>
            </button>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "7px", width: "32px", height: "32px", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", color: t.t2 }}>{theme === "dark" ? "SUN" : "MOON"}</button>
          </div>
        </nav>

        {/* SEARCH MODAL */}
        {so && <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", justifyContent: "center", paddingTop: "10vh" }} onClick={() => setSo(false)}>
          <div style={{ background: t.bgC, borderRadius: "14px", width: "92%", maxWidth: "520px", maxHeight: "440px", overflow: "hidden", border: `1px solid ${t.bd}`, boxShadow: t.sh }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderBottom: `1px solid ${t.bd}` }}>
              <span style={{ color: t.tM }}>Search</span>
              <input ref={sRef} value={sq} onChange={e => setSq(e.target.value)} placeholder="Search meds, protocols, quizzes..." style={{ flex: 1, background: "none", border: "none", outline: "none", color: t.tx, fontSize: "14px" }} />
              <button onClick={() => setSo(false)} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "5px", padding: "2px 7px", color: t.tM, cursor: "pointer", fontSize: "10px" }}>ESC</button>
            </div>
            <div style={{ maxHeight: "380px", overflowY: "auto", padding: "4px" }}>
              {fs.items.map(i => <SearchRow key={i.id} icon="" title={i.name} sub={i.tags.slice(0, 2).join(" Â· ")} stars={conf[i.id]} onClick={() => nav(i)} t={t} />)}
              {fs.protos.map(p => <SearchRow key={p.id} icon="" title={p.name} sub={p.cat} stars={conf[p.id]} onClick={() => oPro(p)} t={t} />)}
              {Object.entries(QUIZZES).map(([k, v]) => <SearchRow key={k} icon={v.icon} title={`${v.label} Quiz`} sub={`${v.items.length} questions`} onClick={() => sQuiz(k)} t={t} />)}
              {RECEPTORS.filter(r => !sq || r.name.toLowerCase().includes(sq.toLowerCase()) || r.short.toLowerCase().includes(sq.toLowerCase())).map(r => <SearchRow key={r.id} icon="" title={r.name} sub={r.short} onClick={() => oRec(r)} t={t} />)}
              {fs.items.length === 0 && fs.protos.length === 0 && sq && <div style={{ padding: "32px", textAlign: "center", color: t.tM }}>No results</div>}
            </div>
          </div>
        </div>}

        {/* â”€â”€ PAGE CONTENT â”€â”€ */}
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
            <SL t={t} icon="Rx" title="Medications" count={MEDS.length} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
              {MEDS.map(i => <ItemCard key={i.id} item={i} t={t} conf={conf[i.id]} onConf={v => setConf(p => ({ ...p, [i.id]: v }))} onOpen={() => nav(i)} />)}
              <PH t={t} text="More medications coming..." />
            </div>

            <SL t={t} icon="ALS" title="ACLS & PALS Protocols" count={PROTOS.length} color="#ef4444" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
              {PROTOS.map(p => <ProtoCard key={p.id} p={p} t={t} conf={conf[p.id]} onConf={v => setConf(prev => ({ ...prev, [p.id]: v }))} onOpen={() => oPro(p)} />)}
            </div>

            <SL t={t} icon="DEV" title="Devices" count={2} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>
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
            <SL t={t} icon="PHY" title="Physiology Concepts" count={0} />
            <div style={{ marginBottom: "20px" }}><PH t={t} text="Ask about Frank-Starling, MAC, O2-Hb curve..." /></div>

            <SL t={t} icon="Q" title="Quizzes" count={Object.keys(QUIZZES).length} />
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

        {/* â”€â”€ STUDY SHEETS PAGE â”€â”€ */}
        {pg === "pg-meds" && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>Study Sheets</h2>
            <p style={{ margin: "2px 0 0", color: t.tM, fontSize: "13px" }}>{allItems.length} medication{allItems.length !== 1 ? "s" : ""} loaded</p>
          </div>
          <SL t={t} icon="Rx" title="Medications" count={MEDS.length} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "24px" }}>
            {MEDS.map(i => <ItemCard key={i.id} item={i} t={t} conf={conf[i.id]} onConf={v => setConf(p => ({ ...p, [i.id]: v }))} onOpen={() => nav(i)} />)}
            <PH t={t} text="More medications coming..." />
          </div>
          <SL t={t} icon="DEV" title="Devices" count={2} />
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
          <SL t={t} icon="PHY" title="Physiology Concepts" count={0} />
          <div style={{ marginBottom: "24px" }}><PH t={t} text="Ask about Frank-Starling, MAC, O2-Hb curve..." /></div>
        </div>}

        {/* â”€â”€ ACLS PROTOCOLS PAGE â”€â”€ */}
        {pg === "pg-acls" && <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>ACLS & PALS Protocols</h2>
            <p style={{ margin: "2px 0 0", color: t.tM, fontSize: "13px" }}>{PROTOS.length} algorithm{PROTOS.length !== 1 ? "s" : ""} loaded</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "12px" }}>
            {PROTOS.map(p => <ProtoCard key={p.id} p={p} t={t} conf={conf[p.id]} onConf={v => setConf(prev => ({ ...prev, [p.id]: v }))} onOpen={() => oPro(p)} />)}
          </div>
        </div>}

        {/* â”€â”€ PLACEHOLDER PAGES â”€â”€ */}
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

        {/* â”€â”€ RECEPTOR PHARMACOLOGY HUB â”€â”€ */}
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

        {/* â”€â”€ RECEPTOR DETAIL PAGE â”€â”€ */}
        {pg === "receptor" && recSel && <ReceptorDetail r={recSel} t={t} theme={theme} onMedClick={recMedClick} tab={recTab} setTab={setRecTab} />}

        {/* â”€â”€ QUIZZES PAGE â”€â”€ */}
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
      {stars > 0 && <span style={{ color: t.wn, fontSize: "11px" }}>{"".repeat(stars)}</span>}
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
          <h4 style={{ color: w.tp === "bb" ? t.dg : w.tp === "cau" ? t.wn : t.tx, margin: "0 0 4px", fontSize: "14px" }}>{w.tp === "bb" ? "â¬› BLACK BOX â€” " : w.tp === "cau" ? "Ã¯Â¸Â " : " "}{w.ti}</h4>
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
          <div><h3 style={{ color: t.ac, fontSize: "17px", margin: "0 0 3px" }}>{item.id === "norepinephrine" ? "Î± Adrenergic Receptor Pathways" : item.id === "vasopressin" ? "V / Vâ‚‚ / KATP Channel Pathways" : "GABA-A Receptor Diagram"}</h3>
            <p style={{ color: t.tM, margin: 0, fontSize: "12px" }}>{item.id === "norepinephrine" ? "NE binding â†’ Gq/Gs/Gi cascades â†’ vasoconstriction + inotropy + autoregulation" : item.id === "vasopressin" ? "AVP binding â†’ V vasoconstriction + KATP closure + Vâ‚‚/Gs antidiuresis" : "Propofol binding â†’ Clâ» influx â†’ hyperpolarization"}</p></div>
          <div style={{ display: "flex", gap: "6px" }}>
            <button onClick={() => dlDiagram(svgRef, item.name, "jpeg")} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "7px", padding: "6px 12px", cursor: "pointer", color: t.t2, fontSize: "12px", fontWeight: 600 }}> JPEG</button>
            <button onClick={() => dlDiagram(svgRef, item.name, "png")} style={{ background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "7px", padding: "6px 12px", cursor: "pointer", color: t.t2, fontSize: "12px", fontWeight: 600 }}>Ã¯Â¸Â PNG</button>
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
          <text x="400" y="44" textAnchor="middle" fill={t.tM} fontSize="10">Receptor affinity: Î±â‚‚ {">"} Î± {">"} Î² {">>>"} Î²â‚‚ â€” Three parallel G-protein cascades</text>

          {/*  COLUMN 1: Î± / Gq PATHWAY (x center ~155)  */}
          <text x="155" y="72" textAnchor="middle" fill="#ef4444" fontSize="13" fontWeight="700">Î± Receptor</text>
          <text x="155" y="86" textAnchor="middle" fill={t.tM} fontSize="9">Vascular Smooth Muscle</text>

          {/* Cell membrane band */}
          <rect x="55" y="92" width="200" height="24" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />
          <text x="60" y="108" fill={theme === "dark" ? "#b8956a" : "#8b6914"} fontSize="7" fontWeight="500">MEMBRANE</text>

          {/* Î± 7-TM receptor */}
          <rect x="120" y="88" width="70" height="32" rx="6" fill={theme === "dark" ? "#3b1111" : "#fee2e2"} stroke="#ef4444" strokeWidth="1.5" />
          <text x="155" y="108" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="700">Î± (7-TM)</text>

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


          {/*  COLUMN 2: Î² / Gs PATHWAY (x center ~430)  */}
          <text x="430" y="72" textAnchor="middle" fill="#3b82f6" fontSize="13" fontWeight="700">Î² Receptor</text>
          <text x="430" y="86" textAnchor="middle" fill={t.tM} fontSize="9">Cardiac Myocyte</text>

          {/* Cell membrane band */}
          <rect x="330" y="92" width="200" height="24" rx="4" fill={theme === "dark" ? "#2a2318" : "#e8ddd0"} opacity="0.4" />

          {/* Î² 7-TM receptor */}
          <rect x="395" y="88" width="70" height="32" rx="6" fill={theme === "dark" ? "#0c1a33" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1.5" />
          <text x="430" y="108" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="700">Î² (7-TM)</text>

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


          {/*  COLUMN 3: Î±â‚‚ / Gi PATHWAY (x center ~680)  */}
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


          {/*  BARORECEPTOR REFLEX ARC (bottom)  */}
          <rect x="55" y="450" width="690" height="100" rx="10" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1.5" />
          <text x="400" y="468" textAnchor="middle" fill={t.tx} fontSize="12" fontWeight="700">BARORECEPTOR REFLEX â€” The Clinical Paradox</text>

          {/* Flow: â†‘MAP â†’ Baroreceptors â†’ â†‘CN IX/X â†’ NTS â†’ â†‘Vagal â†’ â†“HR */}
          <rect x="72" y="482" width="65" height="28" rx="5" fill={theme === "dark" ? "#7f1d1d" : "#fecaca"} stroke="#ef4444" strokeWidth="1.2" />
          <text x="104" y="497" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="8" fontWeight="600">â†‘MAP</text>
          <text x="104" y="507" textAnchor="middle" fill={theme === "dark" ? "#fca5a5" : "#dc2626"} fontSize="6">(from alpha-1)</text>

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
          <text x="644" y="508" textAnchor="middle" fill="#10b981" fontSize="7" fontWeight="500">Offsets Î² chronotropy â†’ NET HR â‰ˆ unchanged</text>

          {/* Key distinction callout */}
          <text x="400" y="540" textAnchor="middle" fill={t.tM} fontSize="8" fontWeight="500" fontStyle="italic">This reflex is WHY NE â‰  epinephrine. Epi's Î²â‚‚ vasodilation prevents the MAP spike â†’ no baroreceptor trigger â†’ tachycardia dominates.</text>


          {/*  NET HEMODYNAMIC EFFECT  */}
          <rect x="170" y="564" width="460" height="50" rx="10" fill={theme === "dark" ? "#052e16" : "#d1fae5"} stroke="#10b981" strokeWidth="2" />
          <text x="400" y="584" textAnchor="middle" fill="#10b981" fontSize="13" fontWeight="700">NET EFFECT: â†‘MAP + â†‘CO + â†”/â†“HR</text>
          <text x="400" y="600" textAnchor="middle" fill={theme === "dark" ? "#6ee7b7" : "#047857"} fontSize="9">Ideal vasopressor profile â€” vasoconstriction WITH cardiac output preservation</text>

          {/* Metabolism note */}
          <rect x="100" y="626" width="600" height="32" rx="6" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="400" y="641" textAnchor="middle" fill={t.tx} fontSize="9" fontWeight="600">Termination: Uptake-1 (neuronal reuptake) â†’ COMT/MAO â†’ normetanephrine â†’ VMA | tÂ½ = 2.4 min | Zero CYP450</text>
          <text x="400" y="653" textAnchor="middle" fill={t.tM} fontSize="8">Context-INSENSITIVE offset â€” no accumulation regardless of infusion duration</text>

          {/*  LEGEND  */}
          <rect x="55" y="672" width="690" height="76" rx="8" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="80" y="690" fill={t.tx} fontSize="9" fontWeight="600">LEGEND</text>
          <line x1="80" y1="694" x2="730" y2="694" stroke={t.bd} strokeWidth="0.5" />

          <circle cx="80" cy="710" r="5" fill="#10b981" /><text x="90" y="714" fill={t.tM} fontSize="8">Norepinephrine</text>
          <rect x="175" y="705" width="10" height="10" rx="2" fill={theme === "dark" ? "#fee2e2" : "#fee2e2"} stroke="#ef4444" strokeWidth="1" /><text x="190" y="714" fill={t.tM} fontSize="8">Î± receptors / inhibition</text>
          <rect x="310" y="705" width="10" height="10" rx="2" fill={theme === "dark" ? "#dbeafe" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1" /><text x="325" y="714" fill={t.tM} fontSize="8">Î² / ions (CaÂ²âº)</text>
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
          <text x="400" y="44" textAnchor="middle" fill={t.tM} fontSize="10">Three receptor subtypes: V (Gq) â†’ vasoconstriction | Vâ‚‚ (Gs) â†’ antidiuresis | V (Gq) â†’ ACTH release</text>

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
          <text x="270" y="272" fill="#ef4444" fontSize="7" fontWeight="600">KATP </text>

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


          {/*  COLUMN 2: Vâ‚‚ / Gs PATHWAY (x ~440)  */}
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


          {/*  KATP CHANNEL MECHANISM BOX (bottom-right)  */}
          <rect x="560" y="300" width="215" height="112" rx="8" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1.5" />
          <text x="667" y="318" textAnchor="middle" fill={t.tx} fontSize="10" fontWeight="700">KATP Channel Mechanism</text>
          <line x1="575" y1="324" x2="760" y2="324" stroke={t.bd} strokeWidth="0.5" />
          <text x="575" y="340" fill="#ef4444" fontSize="8" fontWeight="600">In Septic Shock:</text>
          <text x="575" y="352" fill={t.tM} fontSize="7">â†“ATP + â†‘Hâº + â†‘NO â†’ KATP OPEN</text>
          <text x="575" y="364" fill={t.tM} fontSize="7">â†’ Kâº efflux â†’ hyperpolarization</text>
          <text x="575" y="376" fill={t.tM} fontSize="7">â†’ VGCCs stuck closed â†’ vasoplegia</text>
          <text x="575" y="392" fill="#10b981" fontSize="8" fontWeight="600">Vasopressin Rescue:</text>
          <text x="575" y="404" fill="#10b981" fontSize="7">V â†’ PKC â†’ CLOSES KATP â†’ restores</text>
          <text x="704" y="404" fill="#10b981" fontSize="7">CaÂ²âº entry</text>


          {/*  NET EFFECT  */}
          <rect x="55" y="440" width="690" height="55" rx="10" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1.5" />
          <text x="400" y="460" textAnchor="middle" fill={t.tx} fontSize="12" fontWeight="700">WHY VASOPRESSIN WORKS WHEN CATECHOLAMINES FAIL</text>
          <text x="400" y="478" textAnchor="middle" fill={t.tM} fontSize="9">Non-adrenergic pathway | V receptors maintain affinity in acidosis | Closes KATP channels directly via PKC</text>
          <text x="400" y="490" textAnchor="middle" fill={t.tM} fontSize="9">No pulmonary vasoconstriction | Efferent {">"} Afferent renal vasoconstriction â†’ preserves GFR | Inhibits iNOS</text>

          {/*  NET HEMODYNAMIC  */}
          <rect x="170" y="510" width="460" height="50" rx="10" fill={theme === "dark" ? "#1e1b4b" : "#e0e7ff"} stroke="#8b5cf6" strokeWidth="2" />
          <text x="400" y="530" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="700">NET: â†‘MAP + â†”CO + â†”HR + â†‘UOP</text>
          <text x="400" y="546" textAnchor="middle" fill={theme === "dark" ? "#c4b5fd" : "#6d28d9"} fontSize="9">Non-adrenergic vasopressor â€” catecholamine-sparing â€” pulmonary-sparing</text>

          {/* Metabolism note */}
          <rect x="100" y="574" width="600" height="28" rx="6" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="400" y="589" textAnchor="middle" fill={t.tx} fontSize="9" fontWeight="600">Metabolism: Hepatic/renal peptidases (serine protease, carboxypeptidase) | tÂ½ = 10â€“20 min | Zero CYP450 | Not COMT/MAO</text>
          <text x="400" y="599" textAnchor="middle" fill={t.tM} fontSize="8">Deficiency in sepsis: posterior pituitary stores deplete within 24â€“48h â†’ exogenous VP = hormone replacement</text>

          {/*  LEGEND  */}
          <rect x="55" y="618" width="690" height="68" rx="8" fill={theme === "dark" ? "#111827" : "#f1f5f9"} stroke={t.bd} strokeWidth="1" />
          <text x="80" y="636" fill={t.tx} fontSize="9" fontWeight="600">LEGEND</text>
          <line x1="80" y1="640" x2="730" y2="640" stroke={t.bd} strokeWidth="0.5" />

          <circle cx="80" cy="656" r="5" fill="#8b5cf6" /><text x="90" y="660" fill={t.tM} fontSize="8">Vasopressin (AVP)</text>
          <rect x="185" y="651" width="10" height="10" rx="2" fill={theme === "dark" ? "#fee2e2" : "#fee2e2"} stroke="#ef4444" strokeWidth="1" /><text x="200" y="660" fill={t.tM} fontSize="8">V (vasoconstriction)</text>
          <rect x="320" y="651" width="10" height="10" rx="2" fill={theme === "dark" ? "#dbeafe" : "#dbeafe"} stroke="#3b82f6" strokeWidth="1" /><text x="335" y="660" fill={t.tM} fontSize="8">Vâ‚‚ (antidiuresis)</text>
          <rect x="445" y="651" width="10" height="10" rx="2" fill={theme === "dark" ? "#ede9fe" : "#ede9fe"} stroke="#a855f7" strokeWidth="1" /><text x="460" y="660" fill={t.tM} fontSize="8">V / G-proteins</text>
          <rect x="570" y="651" width="10" height="10" rx="2" fill={theme === "dark" ? "#fef3c7" : "#fef3c7"} stroke="#f59e0b" strokeWidth="1" /><text x="585" y="660" fill={t.tM} fontSize="8">2nd messengers</text>

          <text x="80" y="678" fill={t.tM} fontSize="8">7-TM = GPCR | PLC = phospholipase C | IPâ‚ƒ/DAG = 2nd messengers | PKC/PKA = protein kinases | AQP2 = aquaporin-2 | KATP = ATP-sensitive Kâº channel | vWF = von Willebrand factor</text>
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
          <text x="530" y="356" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="700">✗</text>
          <line x1="640" y1="315" x2="640" y2="340" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4,3" />
          <text x="640" y="356" textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="700">✗</text>

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
          <span style={{ color: p.clr, fontWeight: 700, marginRight: "8px" }}>â€¢</span>{k}
        </div>
      ))}

      {/* â”€â”€ AHA OFFICIAL PDF SECTION â”€â”€ */}
      {p.ahaPdf && <div style={{ marginTop: "28px" }}>
        <h3 style={{ color: t.ac, fontSize: "17px", margin: "0 0 12px" }}> Official AHA Algorithm</h3>
        <div style={{ background: theme === "dark" ? "#0c1a2e" : "#f0f9ff", border: `1px solid ${theme === "dark" ? "#1e3a5f" : "#bae6fd"}`, borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#c8102e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "15px", fontWeight: 800, lineHeight: 1.1, textAlign: "center" }}>AHA</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>{p.name}</div>
            <div style={{ fontSize: "12px", color: t.tM }}>Â© {p.ahaYear} American Heart Association â€” Official Algorithm PDF</div>
            <div style={{ fontSize: "11px", color: t.tM, marginTop: "2px" }}>Source: cpr.heart.org â€¢ {p.ahaYear} AHA Guidelines for CPR & ECC</div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <a href={p.ahaPdf} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", background: theme === "dark" ? "#1e3a5f" : "#e0f2fe", border: `1px solid ${theme === "dark" ? "#2d5a8e" : "#7dd3fc"}`, borderRadius: "8px", padding: "10px 20px", cursor: "pointer", color: t.tx, fontSize: "13px", fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}>
               View Algorithm
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


// â”€â”€ RECEPTOR DETAIL â”€â”€
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

      {/* â”€â”€ OVERVIEW TAB â”€â”€ */}
      {tab === "overview" && <div>
        {r.overview.map((p, i) => <p key={i} style={{ fontSize: "14px", lineHeight: 1.8, color: t.t2, marginBottom: "14px" }}>{p}</p>)}
      </div>}

      {/* â”€â”€ CASCADE TAB â”€â”€ */}
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

      {/* â”€â”€ CLINICAL TAB â”€â”€ */}
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

      {/* â”€â”€ DIAGRAM TAB â”€â”€ */}
      {tab === "diagram" && <div style={{ padding: "24px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
        <p style={{ color: t.tM, fontSize: "13px", fontStyle: "italic" }}>Interactive diagram for {r.name} -- coming in next build iteration.</p>
        <p style={{ color: t.tM, fontSize: "12px" }}>Will show: {r.id === "lgic" ? "pentameric channel cross-section with ion flow" : r.id === "gpcr" ? "7TM receptor with Gq/Gs/Gi branching pathways" : r.id === "rtk" ? "RTK dimerization and PI3K-Akt cascade" : "cytoplasmic receptor with nuclear translocation"}</p>
      </div>}
    </div>
  );
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

// ═══════════════════════════════════════════════════
// CRRT DEVICE PAGE
// ═══════════════════════════════════════════════════
function CRRTDevice({ t, theme }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [dm, setDm] = useState("CVVHDF");
  const [hc, setHc] = useState(null);
  const [fl, setFl] = useState(true);
  const tabs=[{id:"overview",label:"Overview & Principles"},{id:"modalities",label:"CRRT Modalities"},{id:"circuit",label:"Interactive Circuit"},{id:"prescriptions",label:"Prescriptions & Dosing"},{id:"troubleshooting",label:"Troubleshooting"},{id:"pearls",label:"Clinical Pearls"},{id:"interview",label:"Interview Angles"}];
  const ci={
    access:{title:"Vascular Access Catheter",detail:"Large-bore dual-lumen dialysis catheter (11.5\u201313.5 Fr) in IJ (preferred), femoral, or subclavian. Right IJ ideal \u2014 straight path to SVC, low recirculation (~5%). Femoral: higher recirculation (10\u201315%) and infection risk. Subclavian: stenosis risk \u2014 avoid if future AV fistula needed.",color:"#ef4444"},
    bloodpump:{title:"Blood Pump (Peristaltic Roller)",detail:"Peristaltic roller pump at 150\u2013300 mL/min (typical 200). Compresses tubing against raceway \u2014 no direct pump-blood contact, reducing hemolysis. Higher flow improves convective clearance but increases TMP and hemolysis risk.",color:"#3b82f6"},
    prefilter:{title:"Pre-Filter Replacement Fluid",detail:"Predilution: sterile bicarbonate-buffered fluid infused BEFORE the hemofilter. Dilutes blood \u2192 reduces hematocrit in fibers \u2192 extends filter life. Trade-off: clearance drops ~15\u201320%. Compensate with increased volume. Preferred in most ICUs for filter longevity.",color:"#8b5cf6"},
    hemofilter:{title:"Hemofilter (Dialyzer)",detail:"Hollow-fiber membrane cartridge (polysulfone or AN69, MWCO ~20\u201350 kDa). Blood inside fibers; dialysate countercurrent outside. DIFFUSION: concentration gradient for small solutes. CONVECTION: solvent drag for medium molecules up to ~50 kDa. Surface area 0.6\u20132.15 m\u00B2. AN69 can adsorb cytokines but causes bradykinin release with ACE inhibitors.",color:"#f59e0b"},
    dialysate:{title:"Dialysate Fluid",detail:"Countercurrent flow in CVVHD/CVVHDF. Na\u207A ~140, K\u207A 0\u20134, Ca\u00B2\u207A 0\u20133, HCO\u2083\u207B 22\u201335. Flow: 1,000\u20132,000 mL/hr. K\u207A 0 for severe hyperkalemia; K\u207A 2\u20134 to prevent overcorrection.",color:"#06b6d4"},
    effluent:{title:"Effluent (Ultrafiltrate)",detail:"Collects UF + spent dialysate + replacement fluid. Total rate = replacement + dialysate + net UF. Blood-tinged = membrane rupture. Decreasing rate = clotting. KDIGO target: 20\u201325 mL/kg/hr.",color:"#10b981"},
    postfilter:{title:"Post-Filter Replacement Fluid",detail:"Postdilution: fluid AFTER hemofilter. Undiluted blood = maximal clearance but higher hematocrit in fibers \u2192 accelerated clotting. Keep FF <20\u201325%. Many protocols: 2/3 pre + 1/3 post.",color:"#ec4899"},
    anticoag:{title:"Anticoagulation",detail:"Regional citrate preferred (KDIGO). Trisodium citrate 4% pre-filter chelates iCa\u00B2\u207A (needed for Factors II, VII, IX, X). Circuit iCa\u00B2\u207A target <0.35. CaCl\u2082 infused systemically to restore iCa\u00B2\u207A 1.0\u20131.2. Alt: heparin 500\u20131000 U/hr, aPTT 40\u201345s.",color:"#f97316"},
    bubbletrap:{title:"Air Detector & Bubble Trap",detail:"Ultrasonic detector on return line. Air >0.1 mL \u2192 alarm + auto-clamp. Gravity separation traps air; de-aired blood exits bottom.",color:"#a855f7"},
    pressures:{title:"Pressure Monitoring",detail:"(1) ACCESS: negative (\u221250 to \u2212200; more negative = catheter dysfunction). (2) PRE-FILTER: rising = clotting. (3) EFFLUENT: filtrate side. (4) RETURN: +50 to +250; elevated = occlusion. TMP = [(P_pre+P_ret)/2]\u2212P_eff. TMP >250 = significant clotting.",color:"#64748b"}
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
        {[{t:"Modality",v:"CVVHDF (most common)",d:"CVVH for medium molecules, CVVHD for uremia/K+, CVVHDF for comprehensive clearance"},{t:"Blood Flow (Qb)",v:"150\u2013250 mL/min",d:"Higher flow increases clearance but also hemolysis. Start 150\u2013200"},{t:"Dialysate Rate (Qd)",v:"1,000\u20132,000 mL/hr",d:"CVVHD/CVVHDF only. Total effluent target: 20\u201325 mL/kg/hr"},{t:"Replacement Fluid (Qr)",v:"1,000\u20133,000 mL/hr",d:"CVVH/CVVHDF. Typical: 2/3 pre, 1/3 post"},{t:"Net Ultrafiltration",v:"50\u2013200 mL/hr",d:"NET fluid removed. Aggressive UF in shock worsens hemodynamics"},{t:"Effluent Dose (KDIGO)",v:"20\u201325 mL/kg/hr",d:"ATN + RENAL trials: NO benefit to higher-intensity (35\u201340 mL/kg/hr)"},{t:"Anticoagulation",v:"Regional citrate (preferred)",d:"Citrate pre-filter + Ca\u00B2\u207A systemically. Alt: heparin 500\u20131000 U/hr"}].map((item,i)=>(
          <div key={i} style={{padding:"18px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.ac}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"6px",flexWrap:"wrap",gap:"8px"}}><div style={{fontSize:"14px",color:t.ac,fontWeight:600}}>{item.t}</div><div style={{fontSize:"15px",color:t.tx,fontWeight:700}}>{item.v}</div></div>
            <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>{item.d}</div>
          </div>))}
      </div>
      <H title="Landmark Trials" />
      <div style={{display:"grid",gap:"12px"}}>
        {[{trial:"ATN Trial (2008)",j:"NEJM",finding:"Intensive dosing (35 mL/kg/hr) NO mortality benefit over standard (20 mL/kg/hr).",take:"More is not better. Dose 20\u201325 mL/kg/hr."},{trial:"RENAL Trial (2009)",j:"NEJM",finding:"Confirmed ATN internationally. Higher-intensity CRRT did not reduce 90-day mortality.",take:"International validation of standard dosing."},{trial:"STARRT-AKI (2020)",j:"NEJM",finding:"Early RRT did NOT reduce 90-day mortality. More adverse events in early group.",take:"Don\u2019t rush \u2014 wait for clear clinical indication."},{trial:"AKIKI (2016)",j:"NEJM",finding:"Delayed RRT non-inferior. ~49% of delayed group never needed RRT at all.",take:"Patience \u2014 nearly half avoided dialysis entirely."}].map((tr,i)=>(
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
        {[{alarm:"High Access Pressure (very negative)",meaning:"Blood pump struggling to withdraw",causes:"Catheter kink/malposition, against vessel wall, intraluminal clot, hypovolemia",actions:"Reposition patient, flush access lumen, check kinks, CXR position, consider reversing lumens (+10\u201320% recirculation)",color:"#ef4444"},{alarm:"High Return Pressure",meaning:"Resistance to blood returning",causes:"Return lumen clot, kink, catheter malposition",actions:"Check kinks, flush return lumen, tPA lock (2 mg/2 mL x 30\u201360 min). Catheter exchange if P_ret >300",color:"#3b82f6"},{alarm:"Rising TMP",meaning:"Filter clotting",causes:"Insufficient anticoagulation, high FF (>25%), low blood flow, inadequate predilution",actions:"Check citrate + circuit iCa2+, verify FF <20%, increase predilution/blood flow. Filter change if TMP >300",color:"#f59e0b"},{alarm:"Air Detected",meaning:"Air in return line \u2014 auto-clamp",causes:"Loose connection, cracked port, empty fluid bag",actions:"DO NOT override. Check all connections. De-air before resuming",color:"#a855f7"},{alarm:"Blood Leak",meaning:"Membrane rupture",causes:"Physical damage, excessive TMP, defective filter",actions:"STOP CRRT. Clamp lines. Discard filter \u2014 do NOT return blood. Replace circuit. Check hemolysis labs",color:"#dc2626"},{alarm:"Effluent Flow Low",meaning:"Less ultrafiltrate than prescribed",causes:"Filter clotting, effluent line kink/clot, dialysate bag empty",actions:"Check TMP trend. High TMP + low effluent = filter replacement",color:"#10b981"}].map((a,i)=>(
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
        {[{q:"Patient in septic shock on 3 pressors, Cr 6.2, K+ 6.8. Why CRRT over IHD?",a:"Hemodynamic instability \u2014 IHD\u2019s rapid fluid shifts (300\u2013500 mL/min, 3\u20134hr) cause hypotension in a patient on 3 pressors. CRRT runs continuously at 150\u2013200 mL/min with titrated UF of 50\u2013100 mL/hr. For hyperkalemia: CVVHDF with K+-free dialysate for efficient diffusive K+ clearance while maintaining CV stability.",f:"How do you manage norepinephrine during CRRT? Vancomycin dosing?"},{q:"Explain diffusion vs. convection clinically.",a:"Diffusion: concentration gradient \u2192 small molecules (urea 60 Da, Cr 113 Da, K+ 39 Da). Convection: solvent drag \u2192 medium molecules (IL-6 21 kDa, myoglobin 17 kDa). CVVH preferred in rhabdo because myoglobin needs convective clearance \u2014 too large for efficient diffusion.",f:"Vancomycin (1,450 Da) \u2014 diffusion, convection, or both?"},{q:"Filter clotting every 8\u201312 hours. Troubleshoot.",a:"Systematic: (1) Anticoagulation \u2014 circuit iCa2+? Citrate rate? (2) FF >25%? Increase predilution/reduce UF. (3) Blood flow <150? Stagnation. (4) Catheter dysfunction? (5) Patient hypercoagulable? (6) Downtime \u2192 stasis.",f:"FF calculation? How does predilution change it?"},{q:"Total Ca 12.2 but iCa 0.8 on citrate. What\u2019s happening?",a:"Citrate accumulation. Ratio >2.5 is the hallmark. Impaired hepatic metabolism \u2192 citrate chelates systemic iCa2+ while citrate-Ca complexes raise total Ca2+. Stop citrate, switch to heparin, replace iCa2+ with CaCl2, expect metabolic alkalosis.",f:"How do you monitor proactively?"},{q:"STARRT-AKI showed early RRT didn\u2019t help. Clinical impact?",a:"STARRT-AKI (2020) + AKIKI (2016): watchful waiting. No mortality benefit from early initiation, more adverse events, and 49% of AKIKI delayed group never needed RRT. Initiate for: refractory hyperkalemia, pH <7.15, uremic complications, fluid overload unresponsive to diuretics.",f:"Specific indications for immediate RRT?"}].map((item,i)=>(
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

// ═══════════════════════════════════════════════════
// VENTILATOR MODES & MANAGEMENT
// ═══════════════════════════════════════════════════
function VentDevice({ t, theme }) {
  const [activeTab, setActiveTab] = useState("foundations");
  const [selMode, setSelMode] = useState(null);
  const tabs=[{id:"foundations",label:"Oxygenation vs Ventilation"},{id:"modes",label:"Vent Modes"},{id:"anesthesia",label:"Anesthesia Ventilation"},{id:"waveforms",label:"Waveforms & Graphics"},{id:"management",label:"Management & Troubleshooting"},{id:"pearls",label:"Clinical Pearls"},{id:"interview",label:"Interview Angles"}];

  const modes = {
    acvc:{name:"AC/VC (Volume Control)",full:"Assist-Control / Volume-Cycled",color:"#3b82f6",
      how:"Clinician sets: Vt, RR, FiO2, PEEP, flow rate, I:E ratio. Every breath (mandatory + triggered) delivers the SAME preset tidal volume. Breath cycles off when Vt delivered.",
      trigger:"Time-triggered (mandatory) or patient-triggered (flow/pressure sensor). If patient triggers, they still get the full preset Vt.",
      control:"Volume is guaranteed. Pressure is variable \u2014 depends on compliance and resistance. Rising Ppeak with stable Pplat = increased airway resistance. Rising both = decreased compliance.",
      advantage:"Guaranteed minute ventilation (Vt \u00D7 RR). Predictable delivery. Best for paralyzed patients, ARDS (lung-protective strategy).",
      risk:"Pressure is NOT limited \u2014 can cause barotrauma if compliance drops. Breath stacking if patient\u2019s RR exceeds set rate with inadequate expiratory time. Patient-ventilator dyssynchrony if flow doesn\u2019t match demand.",
      settings:"Vt: 6\u20138 mL/kg IBW (ARDS: 6 mL/kg). RR: 12\u201320. FiO2: titrate to SpO2 >92%. PEEP: 5\u201320 cmH2O. Flow: 40\u201360 L/min. I:E typically 1:2\u20131:3."},
    acpc:{name:"AC/PC (Pressure Control)",full:"Assist-Control / Pressure-Cycled",color:"#8b5cf6",
      how:"Clinician sets: Inspiratory Pressure (above PEEP), RR, Ti (inspiratory time), FiO2, PEEP. Ventilator delivers flow until target pressure reached, then maintains it for set Ti. Volume delivered depends on compliance and resistance.",
      trigger:"Time or patient-triggered. Every breath gets the same pressure target.",
      control:"Pressure is guaranteed and limited. Volume varies with compliance changes \u2014 if compliance drops, Vt drops. Decelerating flow pattern = more even gas distribution.",
      advantage:"Pressure-limited = lower barotrauma risk. Better gas distribution (decelerating flow). More comfortable for breathing patients. Useful when Ppeak is dangerously high in VC.",
      risk:"Volume NOT guaranteed \u2014 must monitor Vt closely. If compliance improves suddenly, may over-ventilate. Need alarm for low Vt.",
      settings:"Driving pressure (Pinsp): 10\u201325 cmH2O above PEEP. Total pressure = PEEP + Pinsp. Ti: 0.8\u20131.2 sec. Target Vt: 6\u20138 mL/kg IBW. Monitor exhaled Vt every hour."},
    simv:{name:"SIMV",full:"Synchronized Intermittent Mandatory Ventilation",color:"#f59e0b",
      how:"Delivers a set number of mandatory breaths (VC or PC). Between mandatory breaths, patient can take spontaneous breaths at their own Vt (unsupported, or with PS). Mandatory breaths are synchronized to patient effort.",
      trigger:"Mandatory breaths: time-triggered, synchronized to patient effort within a timing window. Spontaneous breaths: patient-triggered.",
      control:"Mandatory breaths: volume or pressure controlled (SIMV-VC or SIMV-PC). Spontaneous breaths: patient determines Vt (may add Pressure Support).",
      advantage:"Allows partial ventilatory support. Can be used for weaning by gradually reducing mandatory rate. Maintains respiratory muscle conditioning.",
      risk:"Without PS, spontaneous breaths through the ETT increase WOB significantly. Increased WOB can cause fatigue and delayed weaning. Largely fallen out of favor for weaning vs. PS alone.",
      settings:"Mandatory RR: 4\u201312. Vt (if VC): 6\u20138 mL/kg IBW. PS for spontaneous breaths: 5\u201315 cmH2O. PEEP: 5+. FiO2: titrate."},
    psv:{name:"PSV (Pressure Support)",full:"Pressure Support Ventilation",color:"#10b981",
      how:"EVERY breath is patient-triggered. Ventilator augments each breath with a set pressure above PEEP. Patient controls their own RR, Ti, and Vt. Breath terminates when inspiratory flow drops to ~25% of peak (flow-cycled).",
      trigger:"100% patient-triggered. No mandatory breaths. Requires intact respiratory drive. APNEA BACKUP required.",
      control:"Pressure is set, volume varies. Patient has full control of timing and depth. Most comfortable mode for spontaneous breathing.",
      advantage:"Most physiologic and comfortable mode. Reduces WOB through ETT. Ideal for weaning and SBTs. Reduces sedation needs. Promotes diaphragm conditioning.",
      risk:"No guaranteed minute ventilation \u2014 apnea backup essential. Unreliable in patients with weak/absent respiratory drive, heavy sedation, or neuromuscular disease. Over-support (high PS) can cause over-ventilation and respiratory alkalosis.",
      settings:"PS: 5\u201320 cmH2O (start 10\u201315, wean to 5\u20138 for SBT). PEEP: 5. FiO2: titrate. SBT trial: PS 5\u20138 / PEEP 5 for 30\u2013120 min."},
    prvc:{name:"PRVC",full:"Pressure-Regulated Volume Control",color:"#ec4899",
      how:"Dual-control mode. Clinician sets a TARGET Vt, and the ventilator automatically adjusts inspiratory pressure breath-by-breath to deliver that volume. Uses decelerating flow (like PC) but guarantees volume (like VC).",
      trigger:"Time or patient-triggered.",
      control:"Ventilator tests compliance with an initial breath, then adjusts pressure up/down (max \u00B13 cmH2O per breath) to hit target Vt. Combines pressure-limited delivery with volume guarantee.",
      advantage:"Best of both worlds: volume guarantee + pressure limitation + decelerating flow. Auto-adapts to changing compliance. Popular in ICU and anesthesia.",
      risk:"May under-ventilate if pressure ceiling is hit. Can \u201Cchase\u201D patient effort \u2014 if patient takes large breaths, vent decreases support (reverse-triggering problem). False sense of security.",
      settings:"Target Vt: 6\u20138 mL/kg IBW. RR: 12\u201320. Pressure limit: usually auto, monitor Pinsp trend. PEEP: 5\u201320. FiO2: titrate."},
    aprv:{name:"APRV",full:"Airway Pressure Release Ventilation",color:"#ef4444",
      how:"Maintains a high CPAP level (P_high) for a prolonged time (T_high, ~4\u20136 sec), then briefly releases to a low pressure (P_low) for a short time (T_low, ~0.4\u20130.8 sec). The release creates expiratory flow that clears CO2. Patient breathes spontaneously at both pressure levels.",
      trigger:"Time-cycled releases. Spontaneous breathing occurs throughout.",
      control:"Inverse I:E ratio (typically 4:1 to 10:1). P_high provides continuous recruitment. Brief T_low creates \u201Cautocycling\u201D ventilation. Spontaneous breathing maintained.",
      advantage:"Continuous alveolar recruitment \u2014 open lung strategy. Preserves spontaneous breathing (less diaphragm atrophy, less sedation). May improve V/Q matching. Used in refractory ARDS.",
      risk:"Requires spontaneous breathing \u2014 difficult with paralysis. Complex to set and monitor. Auto-PEEP from short T_low. Risk of hemodynamic compromise from sustained high intrathoracic pressure. Not well-studied vs. conventional low-Vt ventilation.",
      settings:"P_high: ~20\u201330 cmH2O (set at previous Pplat). P_low: 0 cmH2O. T_high: 4\u20136 sec. T_low: 0.4\u20130.8 sec (set so expiratory flow drops to ~75% of peak). FiO2: titrate."},
    hfov:{name:"HFOV",full:"High-Frequency Oscillatory Ventilation",color:"#64748b",
      how:"Delivers very small tidal volumes (1\u20133 mL/kg) at extremely high frequencies (3\u201315 Hz = 180\u2013900 breaths/min). Continuous distending pressure (mPaw) keeps lungs recruited. Oscillations create gas mixing via multiple mechanisms (not bulk flow).",
      trigger:"Not patient-triggered. Continuous oscillation.",
      control:"Set: mPaw (mean airway pressure), frequency (Hz), amplitude (\u0394P), FiO2, I:E (typically 1:2). Oxygenation: adjust mPaw and FiO2. Ventilation: adjust amplitude and frequency (lower Hz = more CO2 clearance).",
      advantage:"Ultra-protective \u2014 tiny Vt avoids volutrauma. Continuous recruitment avoids atelectrauma. Theoretical ideal for ARDS.",
      risk:"OSCAR and OSCILLATE trials (2013): no benefit, possible harm in adults. Largely abandoned in adult ICU. Still used in neonatal/pediatric. Hemodynamic compromise from high mPaw. Difficult to monitor. Requires specialized circuit.",
      settings:"mPaw: 5 cmH2O above conventional. Frequency: 5\u20138 Hz (adults). Amplitude: until visible chest wiggle. FiO2: start 1.0, wean. Rarely used in adult practice after 2013 trials."}
  };

  const H=({title})=><h2 style={{color:t.tx,fontSize:"22px",fontWeight:600,marginTop:"32px",marginBottom:"16px",paddingBottom:"8px",borderBottom:`1px solid ${t.bd}`}}>{title}</h2>;
  const B=({children})=><div style={{lineHeight:1.8,fontSize:"15px",color:t.t2}}>{children}</div>;
  const HL=({children})=><span style={{color:t.ac,fontWeight:600}}>{children}</span>;
  const Pl=({number,title,children})=><div style={{padding:"20px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`,marginBottom:"12px"}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}><span style={{background:t.aD,color:t.ac,padding:"2px 10px",borderRadius:"12px",fontSize:"12px",fontWeight:600}}>Pearl #{number}</span><span style={{color:t.tx,fontWeight:600,fontSize:"15px"}}>{title}</span></div><p style={{color:t.t2,fontSize:"14px",lineHeight:1.7,margin:0}}>{children}</p></div>;

  return (<div style={{maxWidth:"1100px",margin:"0 auto",padding:"24px 16px"}}>
    <div style={{background:t.hd,borderBottom:`2px solid ${t.ac}`,padding:"32px 28px 24px",borderRadius:"12px 12px 0 0"}}>
      <div style={{display:"flex",alignItems:"baseline",gap:"16px",marginBottom:"8px",flexWrap:"wrap"}}>
        <h1 style={{margin:0,fontSize:"32px",fontWeight:700,color:t.tx}}>Ventilator Modes & Management</h1>
      </div>
      <div style={{display:"flex",gap:"10px",flexWrap:"wrap",marginTop:"12px"}}>
        {["Mechanical Ventilation","Oxygenation & Ventilation","Anesthesia Specific","Waveform Analysis"].map(tg=><span key={tg} style={{background:t.aD,border:`1px solid ${t.aB}`,color:t.ac,padding:"4px 14px",borderRadius:"20px",fontSize:"13px",fontWeight:500}}>{tg}</span>)}
      </div>
    </div>
    <div style={{display:"flex",gap:"2px",padding:"0 8px",background:t.bgH,borderBottom:`1px solid ${t.bd}`,overflowX:"auto"}}>
      {tabs.map(tb=><button key={tb.id} onClick={()=>setActiveTab(tb.id)} style={{padding:"14px 18px",background:activeTab===tb.id?t.bgC:"transparent",color:activeTab===tb.id?t.ac:t.tM,border:"none",borderBottom:activeTab===tb.id?`2px solid ${t.ac}`:"2px solid transparent",cursor:"pointer",fontSize:"13px",fontWeight:activeTab===tb.id?600:400,whiteSpace:"nowrap",transition:"all 0.2s"}}>{tb.label}</button>)}
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
          {[{label:"Normal",range:">400",color:t.ok,desc:"PaO2 80+ on RA"},{label:"Mild ARDS",range:"200\u2013300",color:t.wn,desc:"Berlin criteria"},{label:"Moderate ARDS",range:"100\u2013200",color:"#f97316",desc:"Consider prone"},{label:"Severe ARDS",range:"<100",color:t.dg,desc:"Prone, consider ECMO"}].map((pf,i)=>(
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
            <p style={{marginTop:"10px"}}><strong style={{color:t.wn}}>Hypoxic Pulmonary Vasoconstriction (HPV):</strong> Intrinsic protective mechanism. Non-ventilated alveoli sense low PAO2 &rarr; local arteriolar constriction &rarr; diverts blood away from collapsed lung toward ventilated lung. Volatile anesthetics inhibit HPV in a dose-dependent manner (>1 MAC). IV anesthesia (TIVA) preserves HPV.</p>
          </div>
        </div>
      </div>
    </div>}

    {activeTab==="waveforms"&&<div>
      <H title="Ventilator Waveform Analysis" />
      <B><p>Waveform interpretation is a core ICU and anesthesia competency. The three primary waveforms are pressure-time, flow-time, and volume-time.</p></B>

      <div style={{display:"grid",gap:"16px",marginTop:"20px"}}>
        {[{title:"Pressure-Time Waveform",color:t.ac,content:[
          {label:"Volume Control",desc:"Square flow pattern creates a rising, linear pressure waveform. Ppeak reflects total inspiratory pressure (elastic + resistive). Inspiratory pause reveals Pplat (elastic only). Gap between Ppeak and Pplat = resistive pressure from ETT/airways."},
          {label:"Pressure Control",desc:"Square pressure waveform (constant pressure throughout inspiration). Decelerating flow as alveoli fill. Better gas distribution. Ppeak = set pressure + PEEP."},
          {label:"Auto-PEEP Detection",desc:"If expiratory flow doesn\u2019t return to zero before next breath, auto-PEEP (intrinsic PEEP) is present. Perform expiratory hold \u2014 total PEEP displayed. Auto-PEEP = total PEEP \u2212 set PEEP. Causes: high RR, long Ti, bronchospasm, secretions."}
        ]},{title:"Flow-Time Waveform",color:t.bl,content:[
          {label:"VC Pattern",desc:"Constant (square) inspiratory flow. Expiratory flow is passive and decelerating. Flow returns to baseline before next breath (no auto-PEEP) or doesn\u2019t (auto-PEEP present)."},
          {label:"PC Pattern",desc:"Decelerating inspiratory flow (high initial, tapers as pressure equilibrates). More physiologic gas distribution. Expiratory flow similar to VC."},
          {label:"Bronchospasm",desc:"Expiratory flow shows \u201Cscooped\u201D or concave pattern (slow emptying). Prolonged expiratory time. May not return to baseline before next breath \u2192 air trapping."}
        ]},{title:"Volume-Time Waveform",color:t.wn,content:[
          {label:"Normal",desc:"Linear rise during inspiration (constant flow) or curved rise (decelerating flow). Rapid drop during expiration. Exhaled Vt should equal inspired Vt \u2014 a leak shows as a gap."},
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
          <p style={{marginTop:"10px"}}><strong style={{color:t.wn}}>Hysteresis:</strong> Inflation and deflation limbs don\u2019t overlap \u2014 the lung requires less pressure to stay open than to open. This is why recruitment maneuvers work: once recruited at high pressure, alveoli stay open at lower PEEP.</p>
        </div>
      </div>
    </div>}

    {activeTab==="management"&&<div>
      <H title="Initial Ventilator Settings" />
      <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.bd}`}}>
        <div style={{display:"grid",gap:"12px"}}>
          {[{param:"Mode",val:"AC/VC or AC/PC",note:"VC for guaranteed ventilation. PC if Ppeak >35 cmH2O"},{param:"Vt",val:"6\u20138 mL/kg IBW",note:"Use IDEAL body weight, not actual. IBW based on height and sex"},{param:"RR",val:"12\u201320 breaths/min",note:"Adjust to target PaCO2 35\u201345. Higher in metabolic acidosis"},{param:"FiO2",val:"Start 1.0, wean to <0.6",note:"O2 toxicity risk >0.6 for >24hr. Target SpO2 92\u201396%"},{param:"PEEP",val:"5 cmH2O minimum",note:"ARDS: use ARDSNet PEEP/FiO2 tables. Never 0 in intubated patients"},{param:"Flow Rate",val:"40\u201360 L/min (VC)",note:"Increase if flow-starved (concave pressure waveform)"},{param:"I:E Ratio",val:"1:2 to 1:3",note:"Longer expiration for obstructive disease. Inverse ratio for severe ARDS only"}].map((s,i)=>(
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
        {[{q:"Patient intubated for ARDS, Ppeak 42, Pplat 34. What do you do?",a:"Both pressures are elevated, so this is a compliance problem (not resistance). Pplat >30 violates ARDSNet protocol. Reduce Vt to 5 then 4 mL/kg IBW until Pplat \u226430. Accept permissive hypercapnia (pH >7.25). Optimize PEEP using ARDSNet table or driving pressure approach. If Pplat was normal with high Ppeak, that\u2019s resistance \u2014 suction, bronchodilators, check ETT.",f:"What if pH drops to 7.18 with low Vt? How do you calculate driving pressure?"},{q:"Explain the difference between oxygenation and ventilation.",a:"Oxygenation = getting O2 into blood. Measured by PaO2/SpO2. Determined by FiO2, PEEP, mean airway pressure, V/Q matching, shunt. Fix with FiO2 and PEEP. Ventilation = removing CO2. Measured by PaCO2/EtCO2. Determined by minute ventilation (Vt \u00D7 RR) and dead space. Fix with RR and Vt. They are independent \u2014 a patient can be well-oxygenated but hypoventilating, or vice versa.",f:"Shunt vs. dead space \u2014 which responds to supplemental O2?"},{q:"You\u2019re doing a right thoracotomy. SpO2 drops to 88% during OLV. Management?",a:"Systematic approach: (1) Confirm DLT position with fiberoptic bronchoscopy. (2) Increase FiO2 to 1.0. (3) Recruitment maneuver to dependent lung. (4) Apply CPAP 5\u201310 to operative lung. (5) Ensure adequate Vt (4\u20136 mL/kg) and PEEP (5\u201310) to dependent lung. (6) Consider TIVA \u2014 volatile agents inhibit HPV dose-dependently. (7) If persistent, intermittent two-lung ventilation or surgeon clamps PA.",f:"How do volatile agents affect HPV? Why is TIVA preferred?"},{q:"Your patient is on AC/VC 500/16. They\u2019re uncomfortable, fighting the vent. What\u2019s happening?",a:"Likely patient-ventilator dyssynchrony. Common in VC when set flow rate doesn\u2019t match patient demand (flow starvation \u2014 look for concave pressure waveform). Options: (1) Increase flow rate. (2) Switch to PC mode (decelerating flow matches patient demand). (3) Assess for auto-PEEP (check expiratory flow). (4) Evaluate sedation/pain. (5) Rule out new pathology: pneumothorax, mucus plug, agitation.",f:"How would you differentiate flow starvation from auto-PEEP on waveforms?"},{q:"How do you set up lung-protective ventilation in the OR?",a:"IMPROVE trial framework: Vt 6\u20138 mL/kg IBW (always ideal body weight from height), PEEP 5\u20138 cmH2O, recruitment maneuvers q30\u201360 min (30 cmH2O \u00D7 30 sec), FiO2 titrated to avoid hyperoxia, keep driving pressure <15 cmH2O and Pplat <30. This reduces postoperative pulmonary complications by ~50%. Same principles as ICU but often underutilized in OR.",f:"What is driving pressure and why might it matter more than Vt?"}].map((item,i)=>(
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
