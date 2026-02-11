export const MEDS = [{
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
  tags: ["Vasopressor", "Catecholamine", "α₁/β₁ Agonist", "Sympathomimetic"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Endogenous catecholamine / direct-acting sympathomimetic", "Primary Targets": "α₁ > α₂ > β₁ >> β₂ adrenergic receptors", "Action": "Full agonist at α₁ and β₁; negligible β₂", "Net Effect": "↑SVR (vasoconstriction) + preserved CO (inotropy) ± reflex ↓HR", "Formulation": "4 mg/4 mL concentrate → dilute in D5W", "First-Line": "Septic shock (SSC 2021 — strong recommendation)" },
  moa: `Norepinephrine is an endogenous catecholamine and direct-acting sympathomimetic with the receptor affinity hierarchy α₂ > α₁ > β₁ >> β₂. This profile delivers potent vasoconstriction with cardiac output preservation — the ideal hemodynamic response for distributive shock.

At the α₁ receptor (Gq-coupled), NE activates PLC → IP₃ + DAG → intracellular Ca²⁺ release from SR + PKC activation → MLCK-mediated smooth muscle contraction → vasoconstriction. Vascular beds most affected: splanchnic > cutaneous > renal > skeletal muscle. Cerebral circulation is relatively protected by autoregulation.

At the β₁ receptor (Gs-coupled), NE activates adenylyl cyclase → ↑cAMP → PKA → phosphorylation of L-type Ca²⁺ channels (↑Ca²⁺ influx = inotropy), RyR2 (enhanced CICR), and phospholamban (faster relaxation = lusitropy). Direct chronotropic effect via If/HCN channels in SA node.

THE BARORECEPTOR PARADOX: NE's dominant α₁ effect raises MAP → carotid/aortic baroreceptors → ↑vagal tone → REFLEX BRADYCARDIA offsets the direct β₁ chronotropic effect. Net HR often stays the same or decreases. This fundamentally distinguishes NE from epinephrine and dobutamine, which reliably increase HR.

NE has ~10-fold selectivity for β₁ over β₂ (Xu et al., Cell Research 2021). The structural basis: identical orthosteric binding pockets but different extracellular vestibule entry pathways — NE (lacking epinephrine's N-methyl group) enters β₁ 30–60× faster than β₂.`,
  recPhys: `α₁ PATHWAY (Gq → PLC → IP₃/DAG):
Step 1 — NE binds postsynaptic α₁ receptor → Gq/G₁₁ protein activates phospholipase C (PLC).
Step 2 — PLC cleaves PIP₂ → IP₃ + DAG. IP₃ binds SR receptors → Ca²⁺ floods cytoplasm.
Step 3 — DAG activates PKC → sensitizes contractile apparatus to Ca²⁺, inhibits KATP channels → depolarization → additional Ca²⁺ entry via L-type channels.
Step 4 — Ca²⁺-calmodulin → MLCK → phosphorylates myosin light chains → smooth muscle contraction → VASOCONSTRICTION.

β₁ PATHWAY (Gs → adenylyl cyclase → cAMP):
Step 1 — NE binds cardiac β₁ → Gs activates adenylyl cyclase → ↑cAMP → PKA.
Step 2 — PKA phosphorylates: (a) L-type Ca²⁺ channels → ↑Ca²⁺ influx = INOTROPY; (b) RyR2 → enhanced Ca²⁺-induced Ca²⁺ release; (c) phospholamban → disinhibits SERCA2a → faster Ca²⁺ reuptake = LUSITROPY; (d) If/HCN channels → faster phase 4 depolarization = CHRONOTROPY.

α₂ PRESYNAPTIC BRAKE (Gi → ↓cAMP):
NE simultaneously activates α₂ autoreceptors on presynaptic nerve terminals → Gi inhibits adenylyl cyclase → ↓cAMP → Gβγ opens GIRK K⁺ channels → hyperpolarization → NEGATIVE FEEDBACK limiting further NE release. This self-limiting mechanism prevents runaway sympathetic activation. Same target as clonidine/dexmedetomidine.

KEY COMPARISONS:
• vs. EPINEPHRINE: Epi has equipotent β₂ → dose-dependent vasodilation (low dose), bronchodilation, more tachycardia/arrhythmias, lactic acidosis. NE has no biphasic behavior.
• vs. VASOPRESSIN: Non-adrenergic (V₁a/Gq pathway). Maintains function in acidosis. No inotropy/chronotropy. Preferential EFFERENT arteriolar constriction (may preserve GFR). Also inhibits KATP channels directly.
• vs. PHENYLEPHRINE: Pure α₁ only — raises SVR but may ↓CO (no β₁ support). Reflex bradycardia without compensatory inotropy.`,
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
    { tp: "bb", ti: "Extravasation → Tissue Necrosis", tx: "Intense α₁ vasoconstriction → ischemia → necrosis → gangrene. RESCUE: Phentolamine 5–10 mg in 10–15 mL NS, infiltrate SC with 25G needle throughout ischemic area. Most effective within 12h. May repeat. Warm compresses (NOT cold)." },
    { tp: "ci", ti: "Mesenteric/Peripheral Vascular Disease", tx: "Use with extreme caution — ↑risk digital ischemia, bowel ischemia. Monitor lactate, abdominal exam, extremity perfusion." },
    { tp: "cau", ti: "MAOI Interaction (CRITICAL)", tx: "MAOIs (phenelzine, tranylcypromine, LINEZOLID) block MAO → impaired NE degradation → SEVERE prolonged hypertensive crisis. Most dangerous interaction." },
    { tp: "cau", ti: "TCA Interaction", tx: "Block norepinephrine transporter (NET) — primary termination mechanism. Dramatically amplifies/prolongs NE effect → severe sustained hypertension." },
    { tp: "cau", ti: "Dilution Requirement", tx: "Must dilute in D5W (dextrose-containing solutions). NE undergoes oxidation in saline-only solutions per FDA labeling." },
  ],
  ix: [
    { dr: "MAOIs / Linezolid", ef: "Blocked MAO degradation → severe prolonged hypertensive crisis. Most dangerous interaction.", sv: "high" },
    { dr: "TCAs", ef: "Block neuronal reuptake (Uptake-1) → amplified/prolonged pressor response.", sv: "high" },
    { dr: "Non-selective β-blockers", ef: "Propranolol blocks β₁ compensation → unopposed α₁ → severe HTN + reflex bradycardia.", sv: "high" },
    { dr: "Halogenated Anesthetics", ef: "Myocardial sensitization to catecholamines. Lower risk with modern agents (sevo/des/iso) vs halothane.", sv: "mod" },
    { dr: "Vasopressin", ef: "Synergistic vasopression. Allows NE dose reduction (catecholamine-sparing). SSC 2021: add at NE 0.25–0.5 mcg/kg/min.", sv: "low" },
  ],
  pearls: [
    { ti: "Why NE over dopamine?", tx: "SOAP II (NEJM 2010, n=1679): Dopamine → 2× arrhythmia rate (24% vs 12%). Higher mortality in cardiogenic shock subgroup. NE is safer across all shock subtypes." },
    { ti: "NE + Vasopressin (VASST/VANISH)", tx: "VASST: add VP at NE ≥5 mcg/min → NE-sparing, possible benefit in less severe shock. VANISH: VP ↓ need for RRT (25% vs 35%). VP works in acidosis when adrenergic receptors fail." },
    { ti: "MAP target (SEPSISPAM)", tx: "65–70 mmHg standard. Chronic HTN patients: 80–85 → ↓RRT need (32% vs 42%) but ↑afib. Individualize." },
    { ti: "Peripheral IV is safe", tx: "Yerke et al. (CHEST 2024, n=635): extravasation 5.5%, zero surgical interventions. 51.6% never needed CVC. Use ≥18G in antecubital fossa or above." },
    { ti: "Intraoperative paradigm shift", tx: "EPON trial (2025): prophylactic NE from induction → 44% vs 58% complications. NE maintains CO better than phenylephrine (pure α₁)." },
    { ti: "SSC 2021 Vasopressor Hierarchy", tx: "1) NE first-line → 2) Add vasopressin at 0.25–0.5 mcg/kg/min → 3) Add epinephrine → 4) Dobutamine for cardiac dysfunction → 5) Hydrocortisone if NE ≥0.25 for ≥4h." },
  ],
  intQs: [
    { q: "Septic shock, MAP 52 on 30L crystalloid. Next step?", a: "Start NE 0.05–0.1 mcg/kg/min. Titrate q5-15 min to MAP ≥65. Don't delay pressors for more fluid." },
    { q: "Patient on NE 0.4 mcg/kg/min, still MAP 58?", a: "Add vasopressin 0.03–0.04 U/min (SSC 2021 threshold: 0.25–0.5 mcg/kg/min). Consider hydrocortisone 200 mg/day." },
    { q: "NE extravasates into forearm. What do you do?", a: "Stop infusion. Infiltrate phentolamine 5–10 mg in 10–15 mL NS subcutaneously throughout ischemic area with 25G needle within 12h. Warm compresses. Restart NE at new proximal site." },
    { q: "Why NE over phenylephrine intraop?", a: "Phenylephrine (pure α₁) raises SVR but ↓CO via reflex bradycardia without β₁ compensation. NE's β₁ activity preserves CO while supporting BP. EPON trial and POQI 2024 consensus support NE." },
  ],
},{
  id: "etomidate", name: "Etomidate", brand: "Amidate",
  tags: ["Sedative-Hypnotic", "GABA-A Agonist", "Carboxylated Imidazole Derivative", "IV Induction Agent"],
  systems: ["neuro", "pharm"], type: "medication",
  ov: { "Drug Class": "Carboxylated imidazole sedative-hypnotic", "Primary Target": "GABA-A receptor (β₂/β₃ subunits)", "Action": "Positive allosteric modulator + direct agonist", "Ion Channel": "Cl⁻ channel → hyperpolarization", "Formulation": "2 mg/mL in 35% propylene glycol", "DEA Schedule": "Not a controlled substance" },
  moa: `Etomidate is a carboxylated imidazole derivative used exclusively as an intravenous induction agent. Its primary mechanism is positive allosteric modulation and direct agonism of the GABA-A receptor, the major inhibitory ligand-gated chloride ion channel in the CNS. It binds to the β₂ and β₃ subunits at the transmembrane domain with particular selectivity for β₂-containing receptors.

At lower (clinical) concentrations, etomidate enhances endogenous GABA affinity for the GABA-A receptor, increasing frequency and duration of Cl⁻ channel opening, producing sedation and hypnosis with minimal cardiovascular effects.

At higher (induction) concentrations, etomidate directly activates the GABA-A receptor Cl⁻ channel independent of GABA binding (direct gating), driving rapid, profound CNS depression sufficient for loss of consciousness and anesthetic induction.

The net result is enhanced Cl⁻ influx causing neuronal hyperpolarization, moving the membrane potential from approximately −70 mV toward −80 to −90 mV, suppressing action potential generation across cortical and subcortical structures.

What distinguishes etomidate from propofol is its minimal effect on the cardiovascular system. Etomidate does not significantly inhibit sympathetic outflow, does not directly vasodilate, and does not depress myocardial contractility at induction doses.

However, etomidate carries a critical trade-off: it inhibits 11β-hydroxylase, the adrenal enzyme responsible for the final step in cortisol synthesis (converting 11-deoxycortisol to cortisol). Even a single induction dose produces measurable adrenocortical suppression lasting 24–72 hours.`,
  recPhys: `Etomidate acts on the same GABA-A receptor as propofol — a pentameric ligand-gated chloride ion channel with the standard 2α, 2β, 1γ configuration. However, etomidate has important subunit selectivity that differs from propofol and affects both its clinical profile and side-effect signature.

Etomidate binds to the transmembrane domain (TM2) at the interface between the β and α subunits, with strong selectivity for β₂- and β₃-containing GABA-A receptors. This is critically important — β₃-containing receptors are concentrated in the cortex, thalamus, and reticular activating system (mediating the hypnotic effect), while β₂-containing receptors are abundant in the spinal cord and subcortical structures. Etomidate's selectivity for these subtypes over β₁-containing receptors contributes to its relatively clean hypnotic profile with minimal respiratory depression compared to barbiturates.

Like propofol, etomidate acts on an ionotropic receptor — no G-protein intermediaries, no second messenger cascades. Drug binding directly opens the ion channel, which is why onset is measured in seconds rather than minutes.

Step 1 — Drug Binding: Etomidate binds to the β₂/β₃ subunit at the TM2 transmembrane interface. The imidazole ring and ester moiety occupy a hydrophobic pocket in the β-α subunit interface. Etomidate's binding orientation is stereospecific — only the R(+) enantiomer is pharmacologically active (approximately 10× more potent than the S(−) form). Commercial etomidate is supplied as the R(+) isomer.

Step 2 — Conformational Change: Binding stabilizes the open configuration of the Cl⁻ pore. At allosteric (lower) concentrations, this enhances GABA's affinity and efficacy at the receptor, prolonging channel open time. At direct-gating (higher) concentrations, the conformational change is sufficient to open the pore without GABA present.

Step 3 — Chloride Influx: Cl⁻ ions flow into the neuron down their electrochemical gradient. This influx of negative charge shifts the resting membrane potential from approximately −70 mV toward −80 to −90 mV, producing hyperpolarization.

Step 4 — Neuronal Hyperpolarization & CNS Depression: The hyperpolarized neuron requires substantially greater excitatory input to reach firing threshold (−55 mV). Global CNS inhibition produces loss of consciousness, amnesia, and suppression of motor responses. Importantly, brainstem cardiovascular centers are relatively spared compared to propofol, which is why hemodynamic stability is maintained.

The key to hemodynamic stability is multifactorial: (1) Etomidate has minimal effect on sympathetic outflow — it does not blunt the baroreflex the way propofol does, so compensatory heart rate and vascular tone adjustments remain intact. (2) Etomidate does not directly relax vascular smooth muscle — unlike propofol, which decreases SVR by 15–40%, etomidate produces negligible changes in SVR. (3) Etomidate does not depress myocardial contractility at clinical doses — cardiac output, stroke volume, and ejection fraction remain essentially unchanged. (4) The β-subunit selectivity profile may contribute — etomidate's preferential action on β₂/β₃ over β₁ subunits means less disruption of brainstem autonomic circuits.

The net result: HR, MAP, CO, SVR, and PVR remain essentially unchanged at induction doses. This is unique among IV induction agents.

Etomidate vs. propofol: both are GABA-A positive allosteric modulators with direct gating at high doses. Both bind β-subunits. Etomidate has stereospecific activity (R(+) enantiomer only); propofol does not (achiral molecule). Etomidate preserves hemodynamics; propofol causes vasodilation and myocardial depression. Etomidate inhibits 11β-hydroxylase; propofol does not. Know also that benzodiazepines increase frequency of Cl⁻ channel opening (require GABA), while etomidate/propofol/barbiturates increase duration and can directly gate the channel at high doses.`,
  dosing: [
    { ind: "Induction of General Anesthesia / RSI", dose: "0.2–0.6 mg/kg IV", notes: "Standard induction: 0.3 mg/kg IV push over 30–60 seconds. For RSI in hemodynamically unstable patients, 0.2–0.3 mg/kg is typical. Produces loss of consciousness in one arm-brain circulation time. No significant dose reduction needed for elderly or hemodynamically compromised patients.", clr: "ac" },
    { ind: "Hemodynamically Neutral Dose Range", dose: "0.2–0.3 mg/kg IV", notes: "At this range, HR, MAP, CO, SVR, and PAP remain essentially unchanged. This is the dose range that maintains etomidate's hemodynamic advantage. Higher doses (0.4–0.6 mg/kg) may still be used but offer no additional benefit for induction.", clr: "wn" },
    { ind: "Procedural Sedation", dose: "0.1–0.15 mg/kg IV", notes: "Lower doses for brief procedures. Can supplement with 0.05 mg/kg increments q3–5 min. Less commonly used for procedural sedation due to lack of analgesia and myoclonus. Not recommended for repeated dosing or continuous infusion due to adrenocortical suppression.", clr: "pr" },
  ],
  kin: { onset: "15–30 sec", onsetD: "One arm-brain circulation time. Rapid onset due to high lipid solubility at physiologic pH", peak: "~1 min", peakD: "Full induction effect within 60 seconds of IV push", dur: "3–12 min (bolus)", durD: "Duration of hypnosis is dose-dependent; at 0.3 mg/kg, expect 3–5 minutes. Recovery via redistribution", vd: "2.5–4.5 L/kg", pb: "76%", hl: "3–5 hours", csht: "Not applicable (single bolus use only)", cl: "18–25 mL/kg/min", model: "Three-compartment" },
  metab: `Etomidate undergoes rapid hepatic metabolism primarily via ester hydrolysis — the ester bond in the carboxylated imidazole structure is cleaved by hepatic esterases (and to a lesser extent, plasma esterases). The primary metabolic pathway is hydrolysis of the ethyl ester group to its corresponding carboxylic acid metabolite, which is pharmacologically inactive and water-soluble. A secondary pathway involves N-dealkylation via hepatic microsomal enzymes (CYP-mediated), but this is a minor contributor to total clearance.

Unlike propofol, etomidate's clearance does NOT exceed hepatic blood flow, meaning there is no significant extrahepatic metabolism. The liver is the primary organ of clearance, which has clinical implications for patients with severe hepatic dysfunction — expect prolonged effect and slower recovery in end-stage liver disease.

Approximately 85% of etomidate metabolites are excreted renally, with 13% eliminated via biliary excretion. Only about 2% of the administered dose is excreted unchanged in urine. The terminal elimination half-life of 3–5 hours is clinically academic for a single-bolus induction agent, since clinical recovery is governed by redistribution (3–12 minutes), not metabolism.

CRITICAL: Etomidate inhibits 11β-hydroxylase (CYP11B1), the mitochondrial enzyme in the adrenal cortex zona fasciculata that catalyzes the final step in cortisol biosynthesis: conversion of 11-deoxycortisol → cortisol. This inhibition is dose-dependent and reversible, but even a single 0.3 mg/kg induction dose measurably suppresses cortisol production for 24–72 hours. The adrenal gland cannot mount an appropriate cortisol stress response during this window.

Etomidate also inhibits 17α-hydroxylase and cholesterol side-chain cleavage enzyme (CYP11A1 / P450scc) to a lesser degree, further suppressing mineralocorticoid (aldosterone) synthesis. This dual glucocorticoid-mineralocorticoid suppression is why etomidate was abandoned for continuous ICU sedation after the Ledingham & Watt study (1983) demonstrated increased mortality.

Special Populations:
Elderly: No significant dose reduction required for hemodynamic purposes. However, elderly patients may be more sensitive to CNS effects — consider using the lower end of the induction range (0.2 mg/kg).
Hepatic impairment: Clearance is reduced because etomidate is primarily hepatically metabolized. Expect prolonged duration and slower recovery in severe hepatic dysfunction.
Renal impairment: Metabolites are inactive and renally cleared. Minimal dose adjustment needed, though accumulation of propylene glycol solvent is a theoretical concern with repeated dosing.
Sepsis/Critical illness: Etomidate's hemodynamic stability makes it attractive for RSI in septic shock, but adrenal suppression may worsen outcomes in patients with relative adrenal insufficiency. The CORTICUS substudy, KETASED trial, and ongoing debate shape practice.`,
  warn: [
    { tp: "bb", ti: "Adrenocortical Suppression", tx: "Even a single induction dose of etomidate (0.3 mg/kg) inhibits 11β-hydroxylase for 24–72 hours, suppressing cortisol synthesis. In critically ill patients with septic shock, this adrenal suppression may impair the stress response and has been associated with increased vasopressor requirements, longer ICU stays, and potentially increased mortality. NEVER use as continuous infusion or repeated bolus dosing." },
    { tp: "bb", ti: "Myoclonus", tx: "Etomidate produces myoclonic movements (involuntary skeletal muscle jerking) in up to 30–60% of patients during induction. This is NOT seizure activity — it results from subcortical disinhibition. Can complicate intubation, increase oxygen consumption, and raise intragastric pressure. Mitigation: pre-treat with benzodiazepine (midazolam 1–2 mg), opioid (fentanyl 1–2 mcg/kg), or non-depolarizing NMBA (rocuronium 0.06 mg/kg)." },
    { tp: "ci", ti: "Known Hypersensitivity", tx: "Absolute contraindication to etomidate or any component." },
    { tp: "ci", ti: "Known Adrenal Insufficiency", tx: "Primary or secondary adrenal insufficiency — etomidate will worsen an already compromised HPA axis." },
    { tp: "cau", ti: "Active Seizure Disorder", tx: "While etomidate itself does not cause true seizures, it increases EEG epileptiform activity and lowers seizure threshold in patients with seizure history." },
    { tp: "cau", ti: "Septic Shock (Debated)", tx: "Adrenal suppression in the context of relative adrenal insufficiency. Major debate in emergency medicine — some institutions favor ketamine for RSI in sepsis instead." },
    { tp: "cau", ti: "Coronary Artery Disease", tx: "Not because of hemodynamic instability, but because myoclonus increases myocardial oxygen demand." },
  ],
  ix: [
    { dr: "Non-depolarizing neuromuscular blockers", ef: "Etomidate enhances and prolongs the effect of NDNMBs. Likely mechanism: inhibition of plasma cholinesterase. May need to reduce NDNMB dose.", sv: "mod" },
    { dr: "Opioids (fentanyl, remifentanil)", ef: "Synergistic CNS and respiratory depression. Reduces etomidate dose requirement. Opioid pretreatment also reduces myoclonus incidence.", sv: "mod" },
    { dr: "Corticosteroids", ef: "Patients on chronic corticosteroids already have suppressed HPA axis. Etomidate further inhibits endogenous cortisol production. Consider stress-dose hydrocortisone if using etomidate.", sv: "high" },
    { dr: "Benzodiazepines (midazolam)", ef: "Additive CNS depression. Pretreatment with midazolam 1–2 mg reduces myoclonus but deepens sedation. Adjust etomidate dose accordingly.", sv: "mod" },
  ],
  pearls: [
    { ti: "Hemodynamically neutral induction agent", tx: "HR, MAP, CO, SVR, PAP, and PVR remain essentially unchanged at induction doses. This makes it the agent of choice for induction in hemodynamically compromised patients: cardiogenic shock, undifferentiated shock, severe aortic stenosis, cardiac tamponade, massive hemorrhage, and septic shock (with adrenal caveat). When an interviewer asks about a trauma patient with BP 82/50, the answer is etomidate or ketamine, not propofol." },
    { ti: "The adrenal suppression debate — know both sides", tx: "Anti-etomidate camp: CORTICUS substudy (etomidate use associated with higher 28-day mortality) and Albert et al. meta-analysis. Pro-etomidate camp: these are observational/retrospective data, hemodynamic instability from propofol may cause more harm than transient cortisol suppression, single dose can be 'covered' with stress-dose hydrocortisone 100 mg IV. Your interview answer should present both perspectives." },
    { ti: "Etomidate and ICP — neuro-ICU perspective", tx: "Like propofol and thiopental, etomidate reduces CMRO₂, CBF, and ICP via cerebral vasoconstriction (flow-metabolism coupling). CPP is typically maintained because MAP doesn't drop. This makes etomidate ideal for intubation of the brain-injured patient — you get ICP reduction without the MAP penalty." },
    { ti: "Myoclonus ≠ Seizures", tx: "Etomidate-induced myoclonus is subcortical in origin (disinhibition of deep nuclei). EEG during myoclonus shows NO epileptiform activity. However, etomidate paradoxically increases EEG epileptiform activity in patients with known seizure foci — used diagnostically during epilepsy surgery. Avoid in patients with active seizure disorders." },
    { ti: "Etomidate vs. Ketamine for RSI in shock", tx: "Ketamine increasingly preferred because: (1) no adrenal suppression, (2) sympathomimetic properties (releases catecholamines, supports BP), (3) bronchodilator effects in reactive airway disease, (4) analgesic properties. Counterargument for etomidate: ketamine's sympathomimetic effect depends on endogenous catecholamine stores — in catecholamine-depleted patients, ketamine can paradoxically cause direct myocardial depression and hypotension." },
    { ti: "No analgesic properties", tx: "Like propofol, etomidate provides zero analgesia. It is a pure hypnotic. A patient induced with etomidate alone has no pain control. Induction for intubation typically includes an opioid (fentanyl 1–3 mcg/kg) and a neuromuscular blocker, not just the induction agent." },
    { ti: "The propylene glycol vehicle", tx: "Etomidate is formulated in 35% propylene glycol (poorly water-soluble). This vehicle causes high incidence of injection site pain and venous irritation. Osmolality extremely high (4640 mOsm/L). Newer lipid emulsion formulations have been developed to reduce injection pain and venous irritation." },
    { ti: "Landmark studies to know", tx: "Ledingham & Watt (1983): Etomidate continuous infusion for ICU sedation → increased mortality. CORTICUS substudy (Sprung et al., 2008): etomidate use associated with worse outcomes in septic shock. Albert et al. (2011): Meta-analysis suggesting increased mortality with etomidate in sepsis. Bruder et al. (2015) / KETASED trial: Single-dose etomidate before emergent intubation — no difference in organ failure or mortality vs. ketamine." },
  ],
  intQs: [
    { q: "Septic patient needs emergent intubation. MAP is 62 on levophed. Etomidate or ketamine?", a: "Either defensible. For etomidate: 'It maintains hemodynamics; I'll follow with stress-dose hydrocortisone 100 mg IV.' For ketamine: 'Avoids adrenal suppression, provides sympathomimetic support, has analgesic properties. 1.5 mg/kg IV.' State your preference and acknowledge the counter-argument." },
    { q: "Surgeon says patient is having a seizure during etomidate induction. What do you tell them?", a: "Educate that etomidate-induced myoclonus is subcortical disinhibition, not epileptiform activity. It's self-limited and resolves as the drug takes full effect. No anticonvulsant treatment needed." },
    { q: "Patient induced with etomidate 8 hours ago has cortisol level of 8 mcg/dL. Is this expected?", a: "Yes. Single-dose etomidate suppresses cortisol for 24–72 hours. This reflects etomidate-induced 11β-hydroxylase inhibition. If hemodynamically unstable, treat empirically with stress-dose hydrocortisone 100 mg IV q8h. Cosyntropin testing unreliable during this window." },
  ],
},{
  id: "vasopressin", name: "Vasopressin (AVP)", brand: "Vasostrict",
  tags: ["Vasopressor", "Non-Catecholamine", "V₁/V₂ Agonist", "Antidiuretic Hormone"],
  systems: ["cardio", "pharm"], type: "medication",
  ov: { "Drug Class": "Endogenous nonapeptide / non-catecholamine vasopressor", "Primary Targets": "V₁a (vascular) > V₁b (pituitary) > V₂ (renal)", "Action": "Full agonist — non-adrenergic vasoconstriction + antidiuresis", "Net Effect": "↑SVR (adrenergic-independent) + preserved renal perfusion + NO β-adrenergic effects", "Formulation": "20 units/mL — dilute prior to infusion", "Role": "2nd-line vasopressor in septic shock (SSC 2021); catecholamine-sparing" },
  moa: `Vasopressin (arginine vasopressin, AVP, ADH) is an endogenous nonapeptide hormone synthesized in the supraoptic and paraventricular nuclei of the hypothalamus, stored in the posterior pituitary, and released in response to hyperosmolality, hypovolemia, and hypotension.

It acts on three distinct G-protein coupled receptor subtypes — V₁a, V₁b, and V₂ — each mediating different physiologic effects through different G-protein cascades. Critically, vasopressin's vasoconstrictor mechanism is COMPLETELY INDEPENDENT of adrenergic receptors. This is the key clinical advantage: it works when catecholamines fail.

In vasodilatory shock, vasopressin restores vascular tone through FOUR mechanisms:

1. V₁a receptor activation (Gq → PLC → IP₃/DAG → ↑Ca²⁺ → smooth muscle contraction) — the primary vasoconstrictor pathway. Identical downstream cascade to α₁ but via a different receptor.

2. KATP channel closure — In septic shock, hypoxia and acidosis activate ATP-sensitive K⁺ channels (KATP) → K⁺ efflux → hyperpolarization → voltage-gated Ca²⁺ channels remain closed → vasoplegia (catecholamine resistance). Vasopressin closes KATP channels via PKC, restoring the ability of Ca²⁺ channels to open. This directly explains why vasopressin works in acidotic, catecholamine-resistant shock.

3. NO modulation — Vasopressin inhibits inducible nitric oxide synthase (iNOS) expression, reducing pathologic NO-mediated vasodilation in sepsis.

4. Potentiation of endogenous vasoconstrictors — Sensitizes vascular smooth muscle to catecholamines, enhancing NE effect at lower doses (catecholamine-sparing).

VASOPRESSIN DEFICIENCY IN SEPSIS: Endogenous AVP stores deplete within 24–48h of sustained shock due to exhaustion of posterior pituitary reserves. Serum levels paradoxically DROP to inappropriately low levels. Exogenous vasopressin replaces this deficit — it is "hormone replacement" as much as vasopressor therapy.`,
  recPhys: `V₁a PATHWAY — Vascular Smooth Muscle (Gq → PLC → IP₃/DAG):
Step 1 — AVP binds V₁a receptor (7-TM GPCR) on vascular smooth muscle → Gq/G₁₁ protein activates phospholipase C (PLC).
Step 2 — PLC cleaves PIP₂ → IP₃ + DAG. IP₃ binds SR receptors → Ca²⁺ release into cytoplasm.
Step 3 — DAG activates PKC → (a) directly opens voltage-gated Ca²⁺ channels (VGCCs) via depolarization; (b) CLOSES KATP channels (Kir6.1/SUR2B) → prevents K⁺ efflux → maintains depolarization → Ca²⁺ entry.
Step 4 — Ca²⁺-calmodulin → MLCK → phosphorylates myosin light chains → VASOCONSTRICTION.
Location: highest V₁a density in splanchnic, skin, skeletal muscle vasculature. Notably ABSENT in pulmonary vasculature — vasopressin does NOT increase PVR. Preferentially constricts EFFERENT > afferent renal arterioles → ↑GFP → paradoxical increase in urine output despite being "antidiuretic hormone."

V₂ PATHWAY — Renal Collecting Duct (Gs → adenylyl cyclase → cAMP):
Step 1 — AVP binds V₂ receptor (basolateral membrane of principal cells) → Gs activates adenylyl cyclase → ↑cAMP → PKA.
Step 2 — PKA phosphorylates AQP2 vesicles → AQP2 water channels translocate to apical membrane.
Step 3 — Water reabsorbed from tubular lumen → concentrated urine, free water retention.
Also: V₂ activation on vascular endothelium → release of von Willebrand factor (vWF) + Factor VIII → procoagulant effect (basis for desmopressin/DDAVP use in bleeding).

V₁b PATHWAY — Anterior Pituitary (Gq → PLC → IP₃/DAG):
AVP binds V₁b receptors on corticotroph cells → same Gq cascade → ACTH secretion → cortisol release. This pathway links vasopressin to the stress response and explains the synergy between vasopressin and corticosteroids in septic shock.

KATP CHANNEL MECHANISM (Why vasopressin works when catecholamines fail):
In septic shock: ↓ATP + ↑H⁺ + ↑lactate + ↑NO → KATP channels OPEN → K⁺ efflux → smooth muscle hyperpolarization → VGCCs cannot open → NO Ca²⁺ entry → vasoplegia. Catecholamines cannot overcome this because α₁ signaling requires intact depolarization to open VGCCs. Vasopressin bypasses this entirely: V₁a/PKC directly CLOSES KATP channels → restores depolarization → VGCCs can open again → Ca²⁺ entry → contraction restored.

ACID RESISTANCE: Unlike catecholamine receptors (α₁, β₁) which lose affinity in acidotic environments, V₁a receptors maintain full binding affinity regardless of pH. Classic interview point.

KEY COMPARISONS:
• vs. NOREPINEPHRINE: NE is adrenergic-dependent (fails in acidosis/vasoplegia). NE has β₁ inotropy. NE causes tachycardia risk. VP is non-adrenergic, no inotropy, no chronotropy, spares pulmonary circulation.
• vs. PHENYLEPHRINE: Both lack inotropy. But VP closes KATP channels (works in vasoplegia), PE does not. VP spares pulmonary circulation, PE does not.
• vs. EPINEPHRINE: Epi has β₁/β₂ → tachycardia, arrhythmia, lactic acidosis. VP has zero adrenergic effects.`,
  dosing: [
    { ind: "Septic Shock (2nd-line, SSC 2021)", dose: "0.03–0.04 U/min (FIXED, non-weight-based)", notes: "Add when NE 0.25–0.5 mcg/kg/min. Do NOT titrate above 0.04 U/min — higher doses ↑ischemic risk. Not a standalone vasopressor — always WITH norepinephrine.", clr: "ac" },
    { ind: "Post-Cardiotomy Vasoplegia", dose: "0.01–0.04 U/min", notes: "Start low. Common after CPB due to vasopressin depletion. VANCS trial validated benefit.", clr: "bl" },
    { ind: "Hepatorenal Syndrome", dose: "Terlipressin preferred (V₁a-selective analog)", notes: "Terlipressin 1–2 mg IV q4-6h (not yet FDA-approved in US as of 2025). VP 0.01–0.04 U/min if terlipressin unavailable.", clr: "wn" },
    { ind: "Diabetes Insipidus (central)", dose: "Desmopressin (DDAVP) preferred", notes: "DDAVP 1–4 mcg IV q12h (selective V₂ agonist). AVP 2.5–10 U IM/SC q4-6h rarely used (short duration, V₁a side effects).", clr: "pr" },
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
    { tp: "bb", ti: "Tissue Ischemia (Dose-Dependent)", tx: "Potent vasoconstriction can cause: mesenteric ischemia (splanchnic V₁a density is HIGH), digital ischemia/gangrene, skin necrosis, coronary vasoconstriction → demand ischemia. Risk increases sharply above 0.04 U/min. Do NOT titrate as sole vasopressor." },
    { tp: "ci", ti: "Coronary Artery Disease", tx: "V₁a-mediated coronary vasoconstriction can precipitate ischemia. VASST excluded unstable coronary patients. Use with extreme caution — if used, keep ≤0.03 U/min and monitor troponin." },
    { tp: "cau", ti: "Hyponatremia Risk", tx: "V₂ activation → free water retention → dilutional hyponatremia. Monitor serum Na⁺. Risk higher with prolonged infusion. Can complicate neuro patients where Na⁺ targets matter." },
    { tp: "cau", ti: "Mesenteric Ischemia", tx: "Splanchnic bed has highest V₁a receptor density. Monitor lactate and abdominal exam. VASST excluded patients with suspected mesenteric ischemia." },
    { tp: "cau", ti: "Not a Standalone Vasopressor", tx: "Must be used WITH norepinephrine in septic shock — not as replacement. Fixed dose, not titrated. Does not provide β₁ inotropy — cardiac output not supported." },
  ],
  ix: [
    { dr: "Norepinephrine", ef: "Synergistic vasopression (different receptor pathways). VP allows NE dose reduction (catecholamine-sparing). SSC 2021 standard combination.", sv: "low" },
    { dr: "Corticosteroids", ef: "VP + hydrocortisone may have synergistic benefit. V₁b→ACTH→cortisol pathway. VANISH showed trend toward benefit with hydrocortisone + VP.", sv: "low" },
    { dr: "Indomethacin/NSAIDs", ef: "Potentiate antidiuretic effect by inhibiting prostaglandin-mediated antagonism of V₂ action → enhanced water retention.", sv: "mod" },
    { dr: "Carbamazepine/SSRIs", ef: "Potentiate ADH effect → ↑risk SIADH-like hyponatremia when combined with VP.", sv: "mod" },
    { dr: "Lithium/Demeclocycline", ef: "V₂ receptor antagonism → blunts antidiuretic effect. May counteract VP-mediated water retention.", sv: "mod" },
    { dr: "Halogenated Anesthetics", ef: "Volatiles may impair vasopressin release from posterior pituitary. May need higher exogenous doses under GA.", sv: "low" },
  ],
  pearls: [
    { ti: "Why VP works when NE fails", tx: "In severe sepsis: acidosis + ↑NO + ↓ATP → KATP channels open → catecholamine-resistant vasoplegia. VP bypasses adrenergic receptors entirely, closes KATP channels via PKC, and V₁a receptors maintain affinity in acidosis. Non-adrenergic rescue." },
    { ti: "VASST (NEJM 2008, n=778)", tx: "VP 0.03 U/min + NE vs NE alone. No mortality difference overall (35.4% vs 39.3%). SUBGROUP: less severe shock (NE 5–14 mcg/min) → mortality 26.5% vs 35.7% (P=0.05). Established safety of VP ≤0.03 U/min." },
    { ti: "VANISH (JAMA 2016, n=409)", tx: "Early VP vs NE as first-line. No difference in kidney failure-free days (primary). BUT: VP group had ↓RRT need (25.4% vs 35.3%, absolute difference −9.9%). Renal-sparing signal — likely from preferential efferent arteriolar constriction." },
    { ti: "Efferent > Afferent", tx: "VP constricts EFFERENT arterioles >> afferent (unlike NE/PE which constrict both equally). This ↑glomerular filtration pressure → paradoxically ↑urine output despite being 'antidiuretic hormone.' Classic interview question." },
    { ti: "Pulmonary-sparing", tx: "VP does NOT constrict pulmonary vasculature — may even vasodilate (NO-mediated). Preferred over catecholamines in patients with RV failure or pulmonary hypertension." },
    { ti: "Removed from ACLS (2015/2025)", tx: "40 U IV single-dose was equivalent to epinephrine 1 mg — no added benefit. AHA 2025: 'Do not substitute vasopressin alone or with epinephrine for epinephrine' (Class 3: No Benefit). Removed to simplify algorithm, not because it's harmful." },
    { ti: "SSC 2021 Vasopressor Hierarchy", tx: "1) NE first-line → 2) Add VP 0.03 U/min at NE 0.25–0.5 mcg/kg/min (weak recommendation) → 3) Add epinephrine → 4) Dobutamine for cardiac dysfunction → 5) Hydrocortisone if NE ≥0.25 for ≥4h." },
    { ti: "Decatecholaminization trend", tx: "2024–2025 literature supports earlier VP addition to reduce catecholamine exposure. High-dose catecholamines → myocardial toxicity, arrhythmias, metabolic derangement. VP spares catecholamine dose." },
  ],
  intQs: [
    { q: "Patient on NE 0.5 mcg/kg/min, MAP 56, pH 7.18. What's happening and what do you add?", a: "Catecholamine-resistant vasoplegia. Acidosis opens KATP channels → hyperpolarization → α₁ receptors can't transduce signal. Add VP 0.03 U/min — non-adrenergic, closes KATP channels via PKC, V₁a receptors maintain affinity in acidosis. Also give bicarb if pH <7.15 and consider hydrocortisone." },
    { q: "Why does urine output increase when you start vasopressin?", a: "V₁a receptors preferentially constrict EFFERENT arterioles >> afferent. This ↑glomerular filtration pressure → ↑GFR → ↑UOP. Despite V₂-mediated water reabsorption, the net effect at low doses is increased filtration." },
    { q: "VP was removed from ACLS. Does that mean it doesn't work?", a: "It was equivalent to epinephrine — removed to simplify, not for harm. AHA 2025 classifies it Class 3: No Benefit (not Class 3: Harm). In cardiac arrest, epinephrine's α₁ + β₁ effects on coronary perfusion are sufficient. VP's role is in SHOCK, not arrest." },
    { q: "Cardiogenic shock patient on NE + dobutamine. Can you add VP?", a: "Use cautiously. VP has NO β₁ inotropy and increases afterload (↑SVR). In cardiogenic shock with ↓CO, ↑afterload without ↑contractility worsens output. VP better suited for distributive/vasodilatory shock where the problem is low SVR, not low CO." },
  ],
}];
