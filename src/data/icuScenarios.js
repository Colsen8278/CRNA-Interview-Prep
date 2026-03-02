// ICU Clinical Scenarios — High-yield CRNA interview content
// Each scenario includes pathophysiology, management framework, key meds, monitoring, interview Qs, and clinical pearls

export const ICU_SCENARIOS = [
  {
    id: "sepsis",
    title: "Sepsis & Septic Shock",
    icon: "\u{1F9AB}",
    color: "#ef4444",
    tagline: "Distributive shock with systemic inflammatory response",
    acuity: "Critical",
    frequency: "Very High",
    overview: "Sepsis is a life-threatening organ dysfunction caused by a dysregulated host response to infection. Septic shock is the subset with profound circulatory, cellular, and metabolic abnormalities — defined by vasopressor requirement to maintain MAP \u226565 mmHg AND lactate >2 mmol/L despite adequate fluid resuscitation. This is the #1 most commonly tested ICU scenario in CRNA interviews.",
    pathophysiology: [
      { title: "Initiating Event", detail: "Pathogen-associated molecular patterns (PAMPs) — endotoxin (gram-negative LPS), lipoteichoic acid (gram-positive) — activate innate immune cells via Toll-like receptors (TLR-4, TLR-2)." },
      { title: "Cytokine Storm", detail: "Macrophages/monocytes release TNF-\u03b1, IL-1\u03b2, IL-6 \u2192 massive NF-\u03baB pathway activation. Pro-inflammatory cascade overwhelms counter-regulatory mechanisms (IL-10, IL-4). This is NOT a controlled immune response — it's a runaway amplification loop." },
      { title: "Endothelial Injury", detail: "Cytokines damage vascular endothelium \u2192 increased capillary permeability (third-spacing), glycocalyx degradation, loss of vasomotor tone. iNOS upregulation produces excessive nitric oxide \u2192 profound vasodilation (SVR drops to 400\u2013600 dyn\u00b7s/cm\u2075)." },
      { title: "Hemodynamic Profile", detail: "Classic warm shock: HIGH cardiac output, LOW SVR, LOW MAP. Compensatory tachycardia initially maintains CO. As myocardial depression develops (septic cardiomyopathy from TNF-\u03b1/IL-1\u03b2), CO falls \u2192 cold shock = decompensated = very high mortality." },
      { title: "Tissue Hypoperfusion", detail: "Despite adequate O\u2082 delivery, mitochondrial dysfunction (cytopathic hypoxia) impairs cellular oxygen utilization. Pyruvate cannot enter TCA cycle \u2192 shunted to lactate. Elevated lactate in sepsis = both supply AND demand mismatch." },
      { title: "Coagulation Cascade", detail: "DIC develops: tissue factor release activates extrinsic pathway, protein C/S consumption, antithrombin III depletion. Microvascular thrombosis \u2192 organ ischemia. Simultaneously, clotting factor consumption \u2192 bleeding. This dual pathology is why DIC is devastating." },
    ],
    management: [
      { step: 1, title: "Hour-1 Bundle (Surviving Sepsis 2021)", items: [
        "Measure lactate — if >2, remeasure within 2\u20134 hours to assess trend",
        "Obtain blood cultures BEFORE antibiotics (2 sets, different sites) — but do NOT delay antibiotics for cultures",
        "Administer broad-spectrum antibiotics within 1 hour of recognition",
        "Begin 30 mL/kg crystalloid for hypotension or lactate \u22654 — use balanced crystalloid (LR preferred over NS to avoid hyperchloremic metabolic acidosis)",
        "Start vasopressors if MAP <65 during or after fluid resuscitation — do NOT wait until 30 mL/kg is complete"
      ]},
      { step: 2, title: "Vasopressor Selection", items: [
        "1st line: Norepinephrine 0.01\u20130.5 mcg/kg/min (\u03b11 dominant + mild \u03b21) — raises MAP via vasoconstriction while preserving CO",
        "2nd line: Vasopressin 0.03\u20130.04 units/min (fixed dose, NOT titrated) — V1 receptor, catecholamine-independent vasoconstriction. Add when NE reaches 0.25\u20130.5 mcg/kg/min",
        "3rd line: Epinephrine 0.01\u20130.5 mcg/kg/min — if cardiac output augmentation needed (septic cardiomyopathy). WARNING: drives lactate via \u03b22 stimulation of glycolysis (false lactate elevation)",
        "Phenylephrine: AVOID in septic shock — pure \u03b11 increases SVR but may decrease CO and splanchnic perfusion",
        "Dopamine: NOT recommended — higher dysrhythmia risk vs norepinephrine (SOAP II trial)"
      ]},
      { step: 3, title: "Refractory Shock Adjuncts", items: [
        "Stress-dose hydrocortisone 200 mg/day (50 mg IV q6h or 200 mg continuous) — only if shock refractory to fluids + vasopressors (ADRENAL/APROCCHSS trials)",
        "Do NOT perform cosyntropin stimulation test to guide steroid decision — treat empirically",
        "Consider angiotensin II (Giapreza) 20 ng/kg/min for vasoplegia refractory to catecholamines + vasopressin (ATHOS-3 trial)",
        "Methylene blue 1\u20132 mg/kg — inhibits guanylyl cyclase/NO synthase, reduces cGMP-mediated vasodilation. Salvage therapy for refractory vasoplegia"
      ]},
      { step: 4, title: "Source Control & Antibiotics", items: [
        "Source control within 6\u201312 hours — drain abscesses, debride necrotic tissue, remove infected devices",
        "Narrow antibiotics once culture/sensitivity available (de-escalation within 48\u201372 hrs)",
        "Typical empiric coverage: vancomycin + piperacillin-tazobactam or meropenem (covers MRSA + gram-negatives + anaerobes)"
      ]},
      { step: 5, title: "Organ Support", items: [
        "Lung: target SpO\u2082 \u226594%, avoid hyperoxia. Intubate if work of breathing unsustainable — use hemodynamically neutral induction (etomidate 0.3 mg/kg or ketamine 1\u20132 mg/kg, NOT propofol in unstable shock)",
        "Renal: AKI common — initiate CRRT if refractory hyperkalemia, acidosis, fluid overload, or uremia. CVVH/CVVHDF preferred in hemodynamic instability",
        "Glucose: target 140\u2013180 mg/dL (NICE-SUGAR trial) — tight glycemic control (80\u2013110) increases hypoglycemia and mortality"
      ]}
    ],
    monitoring: [
      { param: "MAP", target: "\u226565 mmHg", note: "Primary resuscitation target. Some patients (chronic HTN) may need higher targets" },
      { param: "Lactate", target: "<2 mmol/L or \u226520% clearance q2\u20134h", note: "Lactate clearance is a dynamic marker of resuscitation adequacy" },
      { param: "CVP", target: "8\u201312 mmHg (if monitored)", note: "Poor predictor of fluid responsiveness. Trend is more useful than absolute value" },
      { param: "ScvO\u2082", target: "\u226570%", note: "Low ScvO\u2082 = inadequate O\u2082 delivery or excessive extraction. >70% doesn't guarantee adequate perfusion (cytopathic hypoxia)" },
      { param: "Urine Output", target: "\u22650.5 mL/kg/hr", note: "End-organ perfusion marker. Oliguria may persist despite adequate resuscitation if AKI develops" },
      { param: "Capillary Refill", target: "<3 seconds", note: "ANDROMEDA-SHOCK: capillary refill-guided resuscitation non-inferior to lactate-guided" },
    ],
    interviewQs: [
      { q: "Your patient in septic shock has MAP 58 despite 2L crystalloid. Norepinephrine is at 0.4 mcg/kg/min. What's your next move?", a: "Add vasopressin 0.03\u20130.04 units/min (fixed dose). Vasopressin acts on V1 receptors — catecholamine-independent vasoconstriction that's preserved even in catecholamine-refractory shock. It's synergistic with norepinephrine and may allow you to wean NE dose. If still refractory after vasopressin: start stress-dose hydrocortisone 50 mg IV q6h and assess for septic cardiomyopathy (bedside echo — look at EF, cardiac output). If CO is low, consider adding epinephrine for inotropy." },
      { q: "Why norepinephrine over dopamine as first-line in septic shock?", a: "The SOAP II trial (De Backer, 2010) showed dopamine was associated with significantly more arrhythmic events (24.1% vs 12.4%) and a trend toward higher mortality compared to norepinephrine. Norepinephrine provides more predictable \u03b11-mediated vasoconstriction with mild \u03b21 inotropy. Dopamine's dose-dependent receptor activity (D1 \u2192 \u03b21 \u2192 \u03b11) is unpredictable and the concept of 'renal-dose dopamine' has been debunked — it does not protect against AKI." },
      { q: "A septic patient's lactate is rising despite MAP >65. What does this tell you?", a: "Lactate >2 despite adequate MAP suggests either ongoing tissue hypoperfusion not reflected by MAP alone (microcirculatory failure, regional malperfusion) or mitochondrial dysfunction / cytopathic hypoxia where cells cannot utilize delivered oxygen. Also consider: mesenteric ischemia, limb ischemia, ongoing septic source, or epinephrine-driven lactate (\u03b22-stimulated aerobic glycolysis producing 'type B' lactic acidosis). Assess ScvO\u2082: if >70% with rising lactate, mitochondrial dysfunction is likely. If <70%, O\u2082 delivery is inadequate — check Hgb, CO, and consider dobutamine or transfusion." },
      { q: "Balanced crystalloid vs normal saline — does it matter?", a: "Yes. The SMART trial (Vanderbilt, 2018) showed balanced crystalloids (LR, Plasmalyte) reduced the composite outcome of death, new renal replacement therapy, or persistent renal dysfunction compared to normal saline (0.9% NaCl). Large-volume NS causes hyperchloremic metabolic acidosis and renal afferent arteriole vasoconstriction \u2192 decreased GFR. For sepsis resuscitation, LR or Plasmalyte is preferred. One caveat: avoid LR in patients with hyperkalemia (LR contains 4 mEq/L K+, though this is rarely clinically significant in the resuscitation setting)." },
    ],
    pearls: [
      "Lactate >4 mmol/L carries ~30\u201340% mortality in septic shock — it's a prognostic marker, not just a resuscitation endpoint",
      "Procalcitonin trends (not single values) guide antibiotic de-escalation — a drop of >80% from peak suggests resolving bacterial infection",
      "qSOFA (2 of 3: RR \u226522, GCS <15, SBP \u2264100) is a screening tool, NOT a diagnostic criterion — use SOFA score for diagnosis",
      "The 30 mL/kg fluid bolus is a guideline, not a mandate — in patients with heart failure or ESRD, give smaller volumes and reassess frequently with passive leg raise or pulse pressure variation",
      "Septic cardiomyopathy occurs in ~40% of septic shock patients — reversible LV dysfunction (EF may drop to 20\u201330%) that typically recovers in 7\u201310 days if patient survives",
      "NEVER delay antibiotics for any reason — each hour of delay increases mortality by approximately 7.6% (Kumar 2006)"
    ]
  },

  {
    id: "ards",
    title: "ARDS & Respiratory Failure",
    icon: "\u{1FAC1}",
    color: "#3b82f6",
    tagline: "Non-cardiogenic pulmonary edema with refractory hypoxemia",
    acuity: "Critical",
    frequency: "Very High",
    overview: "Acute Respiratory Distress Syndrome (ARDS) is a clinical syndrome of acute-onset, diffuse, inflammatory lung injury causing non-cardiogenic pulmonary edema and refractory hypoxemia. Defined by the Berlin Criteria (2012). Understanding lung-protective ventilation and the physiological rationale behind each intervention is essential for CRNA interviews.",
    pathophysiology: [
      { title: "Initiating Insult", detail: "Direct (pneumonia, aspiration, pulmonary contusion, inhalation injury) or indirect (sepsis, pancreatitis, massive transfusion, burns). Both pathways converge on diffuse alveolar damage (DAD)." },
      { title: "Exudative Phase (Days 1\u20137)", detail: "Neutrophil infiltration \u2192 release of proteases, reactive oxygen species, and pro-inflammatory cytokines \u2192 destruction of alveolar-capillary membrane. Type I pneumocytes (gas exchange cells, 95% of alveolar surface) are destroyed. Protein-rich edema fluid floods alveoli, inactivating surfactant and causing alveolar collapse." },
      { title: "Surfactant Dysfunction", detail: "Normal surfactant (dipalmitoylphosphatidylcholine from Type II cells) reduces surface tension, preventing alveolar collapse at end-expiration (LaPlace's law: P = 2T/r). Surfactant destruction + edema \u2192 atelectasis \u2192 intrapulmonary shunt (perfusion without ventilation) \u2192 refractory hypoxemia unresponsive to supplemental O\u2082 alone." },
      { title: "V/Q Mismatch \u2192 Shunt", detail: "Collapsed/flooded alveoli are perfused but not ventilated (shunt fraction Qs/Qt increases to 20\u201350%). Unlike V/Q mismatch, true shunt does NOT improve with supplemental O\u2082 — this is why ARDS patients remain hypoxemic on 100% FiO\u2082. PEEP recruits collapsed alveoli, converting shunt back to functional gas exchange units." },
      { title: "Baby Lung Concept", detail: "CT imaging reveals ARDS is heterogeneous: dependent regions are consolidated/atelectatic (non-aerated), while non-dependent regions remain aerated. The functional 'baby lung' may be only 200\u2013500 mL (vs normal ~4000 mL FRC). Delivering normal tidal volumes to this tiny lung causes volutrauma/barotrauma. This concept drives lung-protective ventilation strategy." },
      { title: "Proliferative & Fibrotic Phases", detail: "If patient survives exudative phase: Type II pneumocytes proliferate to replace destroyed Type I cells (proliferative phase, days 7\u201321). Some patients develop fibroproliferative ARDS with irreversible fibrosis, poor compliance, and chronic ventilator dependence." },
    ],
    management: [
      { step: 1, title: "Berlin Criteria Diagnosis", items: [
        "Timing: acute onset within 1 week of known insult or new/worsening respiratory symptoms",
        "Imaging: bilateral opacities not fully explained by effusions, lobar collapse, or nodules",
        "Origin: respiratory failure NOT fully explained by cardiac failure or fluid overload (may need echo to exclude cardiogenic edema)",
        "Severity by PaO\u2082/FiO\u2082 ratio on PEEP \u22655: Mild 200\u2013300, Moderate 100\u2013200, Severe <100"
      ]},
      { step: 2, title: "Lung-Protective Ventilation (ARDSNet)", items: [
        "Tidal Volume: 6 mL/kg IDEAL body weight (IBW), not actual weight. IBW: Males = 50 + 2.3(height in inches \u2212 60); Females = 45.5 + 2.3(height in inches \u2212 60)",
        "Plateau Pressure: keep \u226430 cmH\u2082O — represents alveolar distending pressure. >30 = overdistension = volutrauma",
        "PEEP: use ARDSNet PEEP/FiO\u2082 tables (low or high PEEP strategy). Higher PEEP in moderate-severe ARDS recruits atelectatic alveoli",
        "Driving Pressure: Pplat \u2212 PEEP, target <15 cmH\u2082O. Strongest ventilator variable associated with survival (Amato 2015)",
        "Permissive hypercapnia: accept PaCO\u2082 up to 60\u201380 mmHg and pH \u22657.20 to maintain lung-protective volumes. CO\u2082 is less harmful than ventilator-induced lung injury (VILI)",
        "Rate: 20\u201335 breaths/min to compensate for low Vt. Adjust to maintain pH >7.20"
      ]},
      { step: 3, title: "Prone Positioning", items: [
        "Indicated for P/F <150 despite optimal ventilation — prone for \u226516 hours/day (PROSEVA trial: 28-day mortality 16% vs 32.8%)",
        "Mechanism: redistributes ventilation to previously dependent (consolidated) lung regions, improves V/Q matching, offloads cardiac compression of left lower lobe, promotes secretion drainage",
        "Initiate early (within 12\u201324 hours of moderate-severe ARDS) — don't wait for 'rescue'",
        "Complications to monitor: pressure injuries (face, chest), ETT displacement, hemodynamic changes, enteral feeding intolerance"
      ]},
      { step: 4, title: "Refractory Hypoxemia Rescue", items: [
        "Neuromuscular blockade: cisatracurium 48-hour infusion in early severe ARDS may improve oxygenation by eliminating patient-ventilator dyssynchrony and reducing O\u2082 consumption (ACURASYS trial showed mortality benefit; ROSE trial did not — remains controversial)",
        "Inhaled epoprostenol or nitric oxide: selective pulmonary vasodilators \u2192 improve V/Q matching by dilating vessels adjacent to ventilated alveoli. Temporary oxygenation bridge, no mortality benefit",
        "ECMO (VV-ECMO): consider for severe ARDS with P/F <80 despite prone + optimal vent settings (EOLIA trial). Bridge to recovery or transplant"
      ]},
      { step: 5, title: "Fluid Management", items: [
        "Conservative fluid strategy after initial resuscitation (FACTT trial) — target even to slightly negative fluid balance",
        "Reduces pulmonary edema, improves oxygenation, more ventilator-free days",
        "Furosemide to target CVP 4\u20138 or achieve negative fluid balance",
        "Do NOT under-resuscitate in early sepsis-induced ARDS — fluid restriction applies AFTER hemodynamic stability"
      ]}
    ],
    monitoring: [
      { param: "P/F Ratio", target: "Trend improvement", note: "PaO\u2082 / FiO\u2082 on current PEEP. Defines severity and guides interventions" },
      { param: "Plateau Pressure", target: "\u226430 cmH\u2082O", note: "Measure with inspiratory hold. Reflects alveolar distending pressure" },
      { param: "Driving Pressure", target: "<15 cmH\u2082O", note: "Pplat \u2212 PEEP. Best predictor of mortality among ventilator parameters" },
      { param: "SpO\u2082", target: "88\u201395%", note: "Permissive hypoxemia is acceptable. Hyperoxia (PaO\u2082 >100) may worsen lung injury via O\u2082 free radicals" },
      { param: "Static Compliance", target: "Monitor trend", note: "Vt / (Pplat \u2212 PEEP). Normal ~60\u201380. ARDS often 20\u201340 mL/cmH\u2082O. Improvement = resolving disease" },
      { param: "Fluid Balance", target: "Even to negative", note: "Daily I&O, daily weights. Conservative strategy after resuscitation phase" },
    ],
    interviewQs: [
      { q: "Your ARDS patient's PaO\u2082 is 55 on 100% FiO\u2082 and PEEP 14. Plateau pressure is 28. What do you do?", a: "This is severe ARDS (P/F = 55). First, confirm ETT position and rule out pneumothorax. This patient meets criteria for prone positioning (\u226516 hrs/day) — initiate immediately. Ensure Vt is 6 mL/kg IBW. Consider increasing PEEP (with high PEEP table) as long as Pplat stays \u226430 and driving pressure <15. If still refractory after prone + optimal PEEP: trial inhaled epoprostenol for acute oxygenation improvement, and consider neuromuscular blockade if dyssynchrony is contributing. If P/F remains <80 despite all interventions, initiate ECMO consultation." },
      { q: "Why do we use ideal body weight for tidal volume and not actual weight?", a: "Lung size correlates with height and sex, not actual body weight. A 5'4\" woman weighing 120 kg has the same lung volume as a 5'4\" woman weighing 55 kg — their alveolar capacity is determined by thoracic cage size, which scales with height. Using actual weight in an obese patient would deliver massive, injurious tidal volumes to a normal-sized (or in ARDS, reduced-sized 'baby') lung. IBW calculation: Males = 50 + 2.3(inches over 60), Females = 45.5 + 2.3(inches over 60). This is a classic interview question." },
      { q: "Explain the difference between PEEP, plateau pressure, and driving pressure.", a: "PEEP (Positive End-Expiratory Pressure) is the baseline pressure maintained at end-expiration — it prevents alveolar collapse and recruits atelectatic units. Plateau pressure (Pplat) is the pressure measured during an inspiratory hold — it reflects total alveolar distending pressure and should stay \u226430 cmH\u2082O to prevent barotrauma. Driving pressure = Pplat \u2212 PEEP — it represents the cyclical stretch imposed on alveoli with each breath. Driving pressure <15 cmH\u2082O is the strongest ventilator-derived predictor of mortality in ARDS (Amato 2015). Think of it this way: PEEP holds the lung open, driving pressure stretches it, and plateau pressure is the sum of both." },
      { q: "Why does supplemental oxygen alone not fix hypoxemia in ARDS?", a: "Because the dominant physiology in ARDS is true intrapulmonary shunt, not simple V/Q mismatch. When alveoli are flooded or collapsed, blood passes through pulmonary capillaries without participating in gas exchange — this is shunt. Increasing FiO\u2082 only helps alveoli that are ventilated. Blood flowing through non-ventilated units mixes as deoxygenated blood with oxygenated blood (venous admixture), dragging PaO\u2082 down. PEEP is the treatment for shunt because it recruits collapsed alveoli back into functional gas exchange units, converting shunt to normal V/Q." },
    ],
    pearls: [
      "The ARDSNet trial (ARMA, 2000) showed 6 mL/kg IBW reduced mortality from 39.8% to 31% compared to 12 mL/kg — this is one of the most important trials in critical care",
      "PROSEVA trial: prone positioning in severe ARDS (P/F <150) for \u226516 hrs reduced 28-day mortality from 32.8% to 16% — NNT of 6",
      "Driving pressure (Pplat \u2212 PEEP) <15 cmH\u2082O is more strongly associated with survival than either Pplat or PEEP alone",
      "Common interview trap: a patient with pneumonia has bilateral infiltrates and P/F 180 — is this ARDS? Confirm it's NOT cardiogenic edema first (check BNP, echo, PCWP if Swan is in). Berlin criteria require exclusion of hydrostatic edema",
      "Auto-PEEP (intrinsic PEEP) can develop with high respiratory rates in ARDS — check with expiratory hold. If present, reduce rate and lengthen expiratory time",
      "FiO\u2082 >0.60 for prolonged periods causes absorption atelectasis and oxygen toxicity (free radical damage). Wean FiO\u2082 as quickly as possible, using PEEP as the primary oxygenation tool"
    ]
  },

  {
    id: "tbi",
    title: "Traumatic Brain Injury",
    icon: "\u{1F9E0}",
    color: "#a855f7",
    tagline: "ICP management, herniation prevention, and neuroprotection",
    acuity: "Critical",
    frequency: "Very High",
    overview: "Traumatic brain injury management in the ICU centers on preventing secondary brain injury by optimizing cerebral perfusion pressure (CPP), controlling intracranial pressure (ICP), and avoiding systemic insults. With your TNICU background, this is a scenario interviewers WILL ask about in depth — they'll expect you to own this topic.",
    pathophysiology: [
      { title: "Monro-Kellie Doctrine", detail: "The cranial vault is a fixed-volume compartment containing three components: brain parenchyma (~80%), CSF (~10%), and blood (~10%). An increase in any one component must be offset by a decrease in another, or ICP rises. Initial compensation: CSF displacement into the spinal canal and venous blood compression. Once compensatory mechanisms are exhausted, small volume increases cause exponential ICP elevation (the steep portion of the compliance curve)." },
      { title: "Primary vs Secondary Injury", detail: "Primary injury occurs at impact (contusion, DAI, hemorrhage) — irreversible, not treatable. All ICU management targets secondary injury prevention: ischemia from hypotension (SBP <90 doubles mortality), hypoxia (PaO\u2082 <60), hyperthermia, hyperglycemia, seizures, and elevated ICP causing herniation. A single episode of hypotension in severe TBI increases mortality by 150%." },
      { title: "Cerebral Perfusion Pressure", detail: "CPP = MAP \u2212 ICP. Target CPP 60\u201370 mmHg (BTF Guidelines 4th Ed). Below 60: ischemia risk. Above 70: may drive cerebral edema if autoregulation is impaired. Normal ICP: 5\u201315 mmHg. Treat ICP >20\u201322 mmHg. The goal is to optimize CPP by BOTH raising MAP (vasopressors) AND lowering ICP (osmotherapy, CSF drainage, surgery)." },
      { title: "Cerebral Autoregulation", detail: "Normally, cerebral blood flow (CBF) is maintained constant between MAP 50\u2013150 mmHg via myogenic and metabolic autoregulation. In severe TBI, autoregulation is frequently disrupted \u2014 CBF becomes pressure-passive (linearly dependent on MAP). This means hypotension directly reduces CBF and causes ischemia, while hypertension may worsen edema. Monitoring autoregulation status (PRx index) guides individualized CPP targets." },
      { title: "ICP Waveforms", detail: "P1 (percussion wave): arterial pulsation transmitted through choroid plexus. P2 (tidal wave): brain compliance/rebound. P3 (dicrotic wave): aortic valve closure. Normal: P1 > P2 > P3 (descending staircase). Pathologic: P2 > P1 = decreased intracranial compliance (the brain is 'stiff') — impending decompensation. Lundberg A waves (plateau waves): sustained ICP >50 for 5\u201320 min = imminent herniation." },
      { title: "Herniation Syndromes", detail: "Uncal (transtentorial): ipsilateral CN III palsy (fixed, dilated pupil), contralateral hemiparesis, then bilateral posturing. Subfalcine (cingulate): ACA compression, contralateral leg weakness. Tonsillar (cerebellar): brainstem compression \u2192 Cushing's triad (HTN, bradycardia, irregular respirations) \u2192 cardiorespiratory arrest. Cushing's triad is a LATE sign — don't wait for it." },
    ],
    management: [
      { step: 1, title: "Tier 0: Prevention & Monitoring", items: [
        "ICP monitoring: EVD (gold standard \u2014 measures AND treats via CSF drainage) or intraparenchymal bolt (measures only)",
        "HOB 30\u00b0, midline head position (optimizes jugular venous drainage)",
        "Avoid neck flexion, tight c-collar, or anything compressing jugular veins",
        "Temperature control: target normothermia (36\u201337\u00b0C). Fever increases CMRO\u2082 by 5\u20137% per \u00b0C \u2192 worsens secondary injury",
        "Seizure prophylaxis: levetiracetam 500\u20131000 mg q12h or phenytoin x7 days for early post-traumatic seizure prevention (not late seizures)"
      ]},
      { step: 2, title: "Tier 1: ICP 20\u201325 mmHg", items: [
        "CSF drainage via EVD: open drain, remove 5\u201310 mL, reassess. Most immediate ICP reduction",
        "Sedation/analgesia: propofol or midazolam + fentanyl. Reduce CMRO\u2082, decrease ICP, improve ventilator synchrony",
        "Osmotherapy \u2014 Mannitol 20%: 0.25\u20131.0 g/kg IV bolus (NOT drip). Works via plasma expansion (immediate) and osmotic gradient (15\u201330 min). Hold if serum osm >320 or osmolar gap >20",
        "Osmotherapy \u2014 Hypertonic saline 23.4%: 30 mL IV bolus via central line (or 3% NaCl 250 mL bolus). Target serum Na\u207a 145\u2013155 mEq/L. No ceiling effect like mannitol. Preferred in hypovolemic patients",
        "Optimize CPP: if MAP is low, start norepinephrine or phenylephrine to push MAP up. Target CPP 60\u201370"
      ]},
      { step: 3, title: "Tier 2: ICP >25 or Refractory", items: [
        "Neuromuscular blockade: cisatracurium/rocuronium \u2014 eliminates coughing, straining, ventilator dyssynchrony that spike ICP",
        "Moderate hyperventilation: target PaCO\u2082 30\u201335 mmHg (TEMPORARY, <6\u201312 hrs). CO\u2082 causes cerebral vasoconstriction \u2192 reduces CBV \u2192 lowers ICP. Risk: excessive vasoconstriction \u2192 ischemia. Never hyperventilate below PaCO\u2082 25",
        "Barbiturate coma: pentobarbital 5\u201310 mg/kg load, then 1\u20133 mg/kg/hr infusion. Titrate to burst suppression on continuous EEG. Maximally reduces CMRO\u2082. Major risks: hypotension, ileus, immunosuppression"
      ]},
      { step: 4, title: "Tier 3: Surgical", items: [
        "Decompressive craniectomy: removes bone flap to allow brain to expand externally rather than herniating internally (DECRA, RESCUEicp trials)",
        "Surgical evacuation of space-occupying lesion: epidural hematoma (lens-shaped, middle meningeal artery), subdural hematoma (crescent-shaped, bridging veins), or large contusion",
        "RESCUEicp trial: craniectomy in refractory ICP >25 reduced mortality but increased rates of severe disability \u2014 a nuanced risk-benefit discussion"
      ]}
    ],
    monitoring: [
      { param: "ICP", target: "<20\u201322 mmHg", note: "Sustained >20 requires treatment. EVD is gold standard (measures + drains)" },
      { param: "CPP", target: "60\u201370 mmHg", note: "CPP = MAP \u2212 ICP. Ensure arterial line transducer is zeroed at tragus (level of foramen of Monro)" },
      { param: "PaCO\u2082", target: "35\u201345 mmHg (normocapnia)", note: "Hyperventilation is TEMPORARY rescue only. Hypocapnia <25 causes cerebral ischemia" },
      { param: "Serum Na\u207a", target: "145\u2013155 (with HTS)", note: "Monitor q4\u20136h with hypertonic saline. Rapid correction risks CPM; rapid drop risks rebound edema" },
      { param: "Serum Osmolality", target: "<320 (with mannitol)", note: "Osmolar gap >20 = mannitol accumulation, hold dose" },
      { param: "PbtO\u2082", target: ">20 mmHg", note: "Brain tissue oxygenation monitor — direct measurement of O\u2082 in brain parenchyma. <20 = cerebral ischemia" },
    ],
    interviewQs: [
      { q: "Your TBI patient's ICP is 28 and CPP is 55. Walk me through your management.", a: "ICP 28 and CPP 55 is a crisis — ICP is above threshold and CPP is below target. Simultaneously: (1) drain CSF if EVD is in place \u2014 most immediate ICP reduction. (2) Bolus hypertonic saline 23.4% 30 mL or mannitol 1 g/kg IV. (3) Optimize MAP with norepinephrine to push CPP toward 60\u201370. (4) Ensure HOB 30\u00b0, head midline, no jugular compression. (5) Deepen sedation (propofol or fentanyl bolus) to reduce CMRO\u2082 and agitation-driven ICP spikes. (6) Check for new pathology \u2014 stat CT to rule out new hemorrhage or expanding mass lesion requiring surgical evacuation. (7) If refractory: temporary hyperventilation to PaCO\u2082 30\u201335 as a bridge while CT is obtained." },
      { q: "Why is hypotension so dangerous in TBI?", a: "A single episode of SBP <90 mmHg in severe TBI doubles mortality (from ~27% to ~55%, Chesnut 1993). With disrupted autoregulation, CBF becomes pressure-passive — meaning any drop in MAP directly reduces cerebral perfusion. The injured brain has increased metabolic demands (CMRO\u2082 may actually increase in penumbral zones) and zero tolerance for ischemia. This is why the BTF guidelines mandate SBP \u2265100 (age 50\u201369) or \u2265110 (age 15\u201349). In the OR, this has direct anesthesia implications: avoid propofol-induced hypotension in TBI patients — etomidate or ketamine are hemodynamically safer induction agents." },
      { q: "Explain Cushing's triad and what it means.", a: "Cushing's triad: hypertension, bradycardia, and irregular respirations. It's the brain's last-ditch reflex response to brainstem compression from critically elevated ICP. Mechanism: rising ICP compresses the brainstem, specifically the medullary vasomotor center. The brain initiates massive sympathetic discharge to raise MAP and maintain cerebral perfusion (Cushing response \u2192 hypertension). The baroreceptors in the carotid sinus/aortic arch sense the hypertension and trigger a vagal (parasympathetic) reflex \u2192 bradycardia. As brainstem herniation progresses, the respiratory centers are compressed \u2192 irregular respirations (Cheyne-Stokes, ataxic breathing, then apnea). Critical point: Cushing's triad is a LATE and ominous sign — by the time you see it, herniation is actively occurring. Don't wait for it. Treat elevated ICP aggressively before you ever see this triad." },
    ],
    pearls: [
      "Transduce the arterial line at the tragus (external auditory meatus) for TBI patients — this approximates the foramen of Monro and gives you the most accurate CPP calculation. Transducing at the heart overestimates MAP at the brain level by ~15 mmHg when HOB is at 30\u00b0",
      "Mannitol works by TWO mechanisms: immediate plasma expansion (reduces blood viscosity \u2192 reflex vasoconstriction) and delayed osmotic gradient (15\u201330 min, pulls water from brain parenchyma). Give as bolus, never a drip",
      "Hypertonic saline 23.4% is preferred over mannitol in hypovolemic patients because mannitol is an osmotic diuretic (worsens hypovolemia) while HTS expands intravascular volume",
      "Never hyperventilate below PaCO\u2082 25 — below this threshold, cerebral vasoconstriction causes ischemia that worsens outcomes. Hyperventilation is a BRIDGE, not a definitive treatment",
      "Ketamine is no longer contraindicated in TBI — recent evidence shows it does NOT increase ICP and may actually decrease it through its sympathomimetic effect on MAP \u2192 improved CPP. It's now considered safe for intubation and procedural sedation in TBI",
      "Post-traumatic seizures increase CMRO\u2082 by up to 300% and spike ICP — prophylaxis with levetiracetam is standard for 7 days. Levetiracetam preferred over phenytoin: no hepatic enzyme induction, no drug interactions, no need for level monitoring"
    ]
  },

  {
    id: "ami-cs",
    title: "Acute MI & Cardiogenic Shock",
    icon: "\u{2764}\u{FE0F}\u{200D}\u{1F525}",
    color: "#dc2626",
    tagline: "Pump failure, coronary reperfusion, and mechanical support",
    acuity: "Critical",
    frequency: "High",
    overview: "Cardiogenic shock (CS) complicates 5\u201310% of acute MIs and carries 40\u201350% in-hospital mortality. It is defined by persistent hypotension (SBP <90 for \u226530 min) with evidence of end-organ hypoperfusion AND cardiac index <2.2 L/min/m\u00b2 with PCWP >15 mmHg. Understanding the hemodynamic profile and the role of mechanical circulatory support is critical for CRNA interviews.",
    pathophysiology: [
      { title: "Ischemic Cascade", detail: "Coronary occlusion (usually LAD or LCx) \u2192 myocardial ischemia within seconds \u2192 diastolic dysfunction (impaired relaxation) within minutes \u2192 systolic dysfunction (reduced contractility) \u2192 wall motion abnormality \u2192 EKG changes \u2192 chest pain. This sequence is the ischemic cascade — diastolic dysfunction precedes systolic, which precedes EKG changes, which precede symptoms." },
      { title: "Shock Spiral", detail: "Reduced CO from LV failure \u2192 hypotension \u2192 decreased coronary perfusion (remember: coronary fill in DIASTOLE, CPP = AoDBP \u2212 LVEDP) \u2192 more ischemia \u2192 more LV dysfunction \u2192 further CO reduction. This vicious cycle is self-perpetuating. The only way to break it: restore coronary flow (PCI/CABG) and/or mechanically support the circulation." },
      { title: "Hemodynamic Profile", detail: "Classic CS: LOW CO (CI <2.2), HIGH SVR (compensatory vasoconstriction \u2192 cold extremities), HIGH filling pressures (PCWP >15\u201318, CVP elevated). This is the opposite of septic shock. Mixed shock (AMI + sepsis) is increasingly recognized and has the worst prognosis." },
      { title: "RV Infarction", detail: "Inferior MI (RCA occlusion) can extend to involve the RV. RV failure \u2192 decreased LV preload \u2192 hypotension. KEY: these patients are preload-dependent. Volume loading (500 mL\u20131L boluses) is first-line, NOT vasopressors. Nitroglycerin and diuretics are CONTRAINDICATED (reduce preload further). Check right-sided EKG leads (V4R) for ST elevation. RV involvement changes management entirely." },
      { title: "Mechanical Complications", detail: "Free wall rupture (sudden PEA arrest, pericardial tamponade), VSD (new holosystolic murmur + step-up in O\u2082 sat from RA to PA), papillary muscle rupture (acute severe MR, flash pulmonary edema) — all typically occur 3\u20135 days post-MI during the necrotic remodeling phase." },
    ],
    management: [
      { step: 1, title: "STEMI Recognition & Activation", items: [
        "12-lead EKG: ST elevation \u22651 mm in \u22652 contiguous leads (or \u22652 mm in V1\u2013V3)",
        "Activate cath lab: door-to-balloon target <90 min (primary PCI is gold standard)",
        "If no PCI capability: fibrinolytics within 30 min (alteplase, tenecteplase) \u2014 only if onset <12 hours",
        "Antiplatelet: aspirin 325 mg (chewed) + P2Y12 inhibitor (ticagrelor 180 mg or clopidogrel 600 mg)",
        "Anticoagulation: heparin bolus per protocol (UFH 60 U/kg, max 4000 U)"
      ]},
      { step: 2, title: "Cardiogenic Shock Stabilization", items: [
        "Avoid fluids unless RV infarction suspected \u2014 high filling pressures = fluid will worsen pulmonary edema",
        "Inotropes: dobutamine 2\u201320 mcg/kg/min (\u03b21 agonist \u2192 increased contractility and CO) or milrinone 0.375\u20130.75 mcg/kg/min (PDE-3 inhibitor \u2192 inodilator, useful if on \u03b2-blockers)",
        "Vasopressors: norepinephrine preferred over dopamine (SOAP II trial subgroup: lower mortality in cardiogenic shock). Use if MAP persistently <65 despite inotropes",
        "AVOID phenylephrine in CS \u2014 pure \u03b11 increases afterload on a failing LV, worsening forward flow",
        "PA catheter consideration: guides therapy in complex shock (CI, PCWP, SVR measurements)"
      ]},
      { step: 3, title: "Mechanical Circulatory Support", items: [
        "Intra-Aortic Balloon Pump (IABP): inflates in diastole (augments coronary perfusion + afterload reduction in systole via counterpulsation). Modest hemodynamic support. IABP-SHOCK II trial: no mortality benefit. Declining use as first-line",
        "Impella: percutaneous axial flow pump (Impella CP: 3\u20134 L/min support). Placed across aortic valve, actively unloads LV. More potent than IABP",
        "ECMO (VA-ECMO): provides full cardiopulmonary bypass support. Used in refractory CS or cardiac arrest. Complication: LV distension (may need Impella or atrial septostomy to vent LV)",
        "Decision to escalate: if shock persists despite inotropes + vasopressors + single device, consider combined support (Impella + VA-ECMO = 'ECPELLA'). Multidisciplinary shock team approach"
      ]},
      { step: 4, title: "Post-PCI Management", items: [
        "Dual antiplatelet therapy (DAPT): aspirin + P2Y12 inhibitor \u2265 12 months",
        "Beta-blocker once hemodynamically stable (do NOT give in acute CS \u2014 reduces contractility)",
        "ACE inhibitor/ARB within 24 hours if stable, no contraindications",
        "High-intensity statin: atorvastatin 80 mg",
        "Cardiac rehab referral"
      ]}
    ],
    monitoring: [
      { param: "Cardiac Index", target: ">2.2 L/min/m\u00b2", note: "PA catheter derived. CI <1.8 = severe shock" },
      { param: "PCWP", target: "15\u201318 mmHg optimal", note: "High PCWP = volume overload. Low PCWP in RV infarct = need fluids" },
      { param: "SVR", target: "800\u20131200 dyn\u00b7s/cm\u2075", note: "HIGH in pure CS (compensatory vasoconstriction). If LOW, consider mixed/vasodilatory component" },
      { param: "Mixed Venous O\u2082", target: "SvO\u2082 >65%", note: "Low SvO\u2082 = poor CO and increased O\u2082 extraction. Trend guides response to therapy" },
      { param: "Lactate", target: "<2 mmol/L, trending down", note: "Reflects adequacy of systemic perfusion. Rising lactate = worsening shock" },
      { param: "Urine Output", target: "\u22650.5 mL/kg/hr", note: "Renal perfusion marker. Cardiorenal syndrome common in CS" },
    ],
    interviewQs: [
      { q: "Patient in the cath lab has an inferior STEMI. Post-PCI, BP drops to 72/40 with clear lungs and JVD. What's happening?", a: "This is RV infarction until proven otherwise. Inferior STEMI (RCA territory) extends to the RV in ~30\u201350% of cases. The hemodynamic picture: hypotension + clear lungs (no LV failure) + elevated JVP (RV failure \u2192 backed-up venous system). Management: volume loading \u2014 give 250\u2013500 mL NS boluses to optimize RV preload. AVOID nitroglycerin, morphine, and diuretics (all reduce preload and will worsen hypotension). If fluids fail, start dobutamine for RV inotropy. Confirm with right-sided EKG: ST elevation in V4R is most sensitive for RV involvement." },
      { q: "How does an IABP work?", a: "The IABP uses the principle of counterpulsation. A 30\u201350 mL balloon sits in the descending thoracic aorta, inflating in DIASTOLE and deflating in SYSTOLE, timed to the EKG or arterial waveform. Diastolic inflation: increases aortic diastolic pressure \u2192 augments coronary perfusion (coronaries fill in diastole) and improves end-organ perfusion. Systolic deflation: creates a vacuum effect (reduced afterload) just before the LV ejects \u2192 LV works against lower resistance \u2192 increased stroke volume and decreased myocardial oxygen demand. Net effect: improved myocardial O\u2082 supply (diastolic augmentation) and reduced O\u2082 demand (afterload reduction). It provides ~0.5 L/min of additional CO \u2014 modest compared to Impella or ECMO." },
      { q: "Why do we say coronary arteries fill in diastole?", a: "During systole, the contracting myocardium compresses the intramyocardial coronary vessels, especially in the subendocardium (highest wall stress). This creates 'extravascular compression' that actually REVERSES coronary flow momentarily. Blood flows into the coronaries predominantly during diastole when the myocardium is relaxed and compression is released. This is why diastolic blood pressure is the critical determinant of coronary perfusion: Coronary Perfusion Pressure = Aortic Diastolic BP \u2212 LVEDP. Tachycardia is dangerous in ischemia because it shortens diastolic time \u2192 less time for coronary filling. Aortic regurgitation reduces diastolic pressure \u2192 decreased coronary perfusion. Understanding this explains why IABP diastolic augmentation works." },
    ],
    pearls: [
      "Coronary Perfusion Pressure = Aortic DBP \u2212 LVEDP. This is why diastolic pressure matters more than systolic for myocardial perfusion. Tachycardia shortens diastole \u2192 less coronary filling time \u2192 worse ischemia",
      "In RV infarction: volume load, avoid nitrates/diuretics/morphine. The LV depends on RV output for preload — you cannot fill the LV if the RV is failing. Think of it as a series circuit",
      "The ischemic cascade order: diastolic dysfunction \u2192 systolic dysfunction \u2192 EKG changes \u2192 symptoms. Wall motion abnormalities on echo precede ST changes — echo is more sensitive than EKG for detecting ischemia",
      "SCAI shock classification (A\u2013E) standardizes communication about CS severity: A = at-risk, B = beginning, C = classic CS, D = deteriorating, E = extremis (cardiac arrest/refractory)",
      "Door-to-balloon <90 min is the standard, but in cardiogenic shock, the benefit of PCI persists even beyond 12 hours — get the patient to the cath lab regardless of time from symptom onset"
    ]
  },

  {
    id: "status-epilepticus",
    title: "Status Epilepticus",
    icon: "\u26A1",
    color: "#f59e0b",
    tagline: "Prolonged seizure requiring emergent pharmacologic intervention",
    acuity: "Critical",
    frequency: "High",
    overview: "Status epilepticus (SE) is defined as \u22655 minutes of continuous seizure activity OR \u22652 discrete seizures without return to baseline between them. It is a neurologic emergency — prolonged seizures cause excitotoxic neuronal death, and mortality increases with duration. The pharmacologic escalation algorithm is extremely high-yield for interviews.",
    pathophysiology: [
      { title: "Excitotoxicity", detail: "Sustained seizures \u2192 excessive glutamate release at NMDA/AMPA receptors \u2192 massive Ca\u00b2\u207a influx into neurons \u2192 activation of proteases, lipases, endonucleases \u2192 mitochondrial failure \u2192 neuronal death. This excitotoxic cascade is time-dependent — neuronal injury begins within 20\u201330 minutes of continuous seizure activity." },
      { title: "GABA Receptor Internalization", detail: "The critical concept: as seizures persist, GABA-A receptors are internalized (endocytosed from the postsynaptic membrane). Fewer surface GABA-A receptors = benzodiazepines become progressively LESS effective. Simultaneously, NMDA receptors are trafficked TO the surface \u2192 more excitation, less inhibition. This receptor trafficking explains why early benzodiazepine administration is critical \u2014 the longer you wait, the harder it is to terminate." },
      { title: "Systemic Complications", detail: "Phase 1 (0\u201330 min): sympathetic surge \u2192 hypertension, tachycardia, hyperglycemia, hyperthermia, lactic acidosis from sustained muscle contraction. Phase 2 (>30 min): sympathetic exhaustion \u2192 hypotension, hypoglycemia, rhabdomyolysis (CK may exceed 100,000), hyperkalemia, DIC, pulmonary edema, respiratory failure." },
    ],
    management: [
      { step: 1, title: "Stabilization Phase (0\u20135 min)", items: [
        "ABCs: suction, lateral position, O\u2082, IV access (or IO if no IV)",
        "Fingerstick glucose — hypoglycemia is a reversible cause. If low: dextrose 50% 25\u201350 mL IV (adults)",
        "Thiamine 100 mg IV BEFORE dextrose if alcohol use disorder or malnutrition suspected (prevent Wernicke\u2019s)",
        "Labs: BMP, Mg\u00b2\u207a, Ca\u00b2\u207a, CBC, LFTs, AED levels, UDS, lactate, blood gas"
      ]},
      { step: 2, title: "First-Line: Benzodiazepines (5\u201320 min)", items: [
        "IV access: Lorazepam 0.1 mg/kg IV (max 4 mg/dose, may repeat x1 in 5 min) — preferred IV benzo for SE (longer CNS duration than diazepam due to lower lipophilicity)",
        "No IV access: Midazolam 10 mg IM (RAMPART trial: IM midazolam non-inferior to IV lorazepam, faster administration in field)",
        "Alternative: Diazepam 0.15\u20130.2 mg/kg IV (max 10 mg/dose). Faster onset than lorazepam but redistributes quickly \u2192 shorter clinical effect",
        "Benzodiazepines work by: positive allosteric modulation of GABA-A \u2192 increased Cl\u207b channel opening FREQUENCY \u2192 hyperpolarization. They require GABA to work (unlike propofol/barbiturates which can directly gate the channel)"
      ]},
      { step: 3, title: "Second-Line: IV Antiepileptics (20\u201340 min)", items: [
        "If seizures persist after 2 doses of benzodiazepines:",
        "Levetiracetam 60 mg/kg IV (max 4500 mg) over 15 min — best side-effect profile, no cardiac toxicity, no drug interactions. Mechanism: binds SV2A protein on synaptic vesicles, reduces neurotransmitter release",
        "Fosphenytoin 20 mg PE/kg IV at 150 mg PE/min — Na\u207a channel blocker. Monitor for hypotension and cardiac arrhythmias. Requires cardiac monitoring. Contraindicated in heart block",
        "Valproic acid 40 mg/kg IV (max 3000 mg) over 10 min — multiple mechanisms: GABA enhancement, Na\u207a/Ca\u00b2\u207a channel blockade, glutamate reduction. Avoid in liver disease, pregnancy, mitochondrial disorders",
        "ESETT trial: levetiracetam, fosphenytoin, and valproate were equally effective as second-line agents (~45\u201350% seizure cessation each)"
      ]},
      { step: 4, title: "Third-Line: Refractory SE (>40 min)", items: [
        "Intubate for airway protection. Now treating REFRACTORY status epilepticus (RSE)",
        "Continuous IV anesthetic infusion titrated to EEG burst suppression:",
        "Propofol: 2 mg/kg bolus, then 30\u2013200 mcg/kg/min infusion. Fast onset/offset. Risk: PRIS with prolonged use. Enhances GABA-A + directly gates Cl\u207b channel",
        "Midazolam: 0.2 mg/kg bolus, then 0.05\u20132 mg/kg/hr infusion. May develop tachyphylaxis. GABA-A modulator",
        "Pentobarbital: 5\u201315 mg/kg load, then 0.5\u20135 mg/kg/hr. Most potent but most hemodynamically destabilizing. Prolongs GABA-A Cl\u207b channel DURATION + directly gates at high doses",
        "Ketamine: increasingly used as add-on for super-refractory SE — NMDA antagonist that targets the glutamatergic excitation pathway (different mechanism than all GABA-ergic agents)"
      ]}
    ],
    monitoring: [
      { param: "Continuous EEG", target: "Burst suppression", note: "Required in RSE to titrate anesthetic infusion. Goal: bursts of 1\u20132 per page (burst-suppression ratio)" },
      { param: "Glucose", target: "140\u2013180 mg/dL", note: "Check q1h initially. Hypo- and hyperglycemia both worsen neuronal injury" },
      { param: "Temperature", target: "<38\u00b0C", note: "Seizures are thermogenic. Hyperthermia worsens excitotoxicity. Active cooling if needed" },
      { param: "CK / Myoglobin", target: "Trend", note: "Rhabdomyolysis from sustained convulsions. IVF resuscitation, target UOP >1 mL/kg/hr" },
      { param: "ABG / Lactate", target: "Resolving acidosis", note: "Lactic acidosis from muscle contraction. Should resolve with seizure termination" },
    ],
    interviewQs: [
      { q: "Why do benzodiazepines become less effective the longer a seizure continues?", a: "GABA-A receptor internalization. During sustained seizure activity, the GABA-A receptors are endocytosed — physically removed from the postsynaptic membrane into intracellular vesicles. Since benzodiazepines work as positive allosteric modulators that REQUIRE GABA-A receptors on the surface to function, fewer surface receptors = less drug effect. Simultaneously, NMDA glutamate receptors are trafficked TO the surface, increasing excitatory tone. This is the pharmacologic rationale for rapid benzodiazepine administration — at 5 minutes, most receptors are still on the surface and benzos are highly effective (~65\u201380% seizure cessation). By 30 minutes, a significant proportion have internalized. This also explains why refractory SE requires agents that act via different mechanisms: propofol/barbiturates (direct GABA-A gating, don't just need surface receptors but also provide direct channel opening) or ketamine (NMDA antagonism — targets the excitatory side)." },
      { q: "A seizing patient has no IV access. What do you do?", a: "IM midazolam 10 mg immediately. The RAMPART trial (Silbergleit 2012) demonstrated that IM midazolam was non-inferior to IV lorazepam for prehospital SE — and was actually FASTER because it eliminates IV access delays. Midazolam is the only benzodiazepine with reliable IM absorption (water-soluble at acidic pH, becomes lipophilic at physiologic pH after injection). Alternatives if IM not available: intranasal midazolam, rectal diazepam (0.2 mg/kg), or buccal midazolam. While giving IM midazolam, simultaneously work on IV/IO access for second-line agents." },
    ],
    pearls: [
      "Time is brain: benzodiazepine efficacy drops from ~80% at 5 min to ~30\u201340% at 30 min due to GABA-A receptor internalization. Give benzos EARLY and at FULL dose",
      "The RAMPART trial made IM midazolam the prehospital standard — faster time to administration outweighs IV lorazepam\u2019s slightly faster onset once injected",
      "ESETT trial: levetiracetam = fosphenytoin = valproate for second-line efficacy (~45\u201350% each). Choice often based on side-effect profile and patient-specific factors",
      "Non-convulsive status epilepticus (NCSE) accounts for up to 50% of SE in ICU patients — altered mental status without visible convulsions. Only diagnosed by continuous EEG. Always consider NCSE in unexplained altered consciousness",
      "Propofol infusion syndrome (PRIS) risk increases with doses >70 mcg/kg/min for >48 hours — monitor triglycerides, CK, and lactate. Consider rotating agents for prolonged RSE treatment"
    ]
  },

  {
    id: "mtp",
    title: "Massive Transfusion Protocol",
    icon: "\u{1FA78}",
    color: "#dc2626",
    tagline: "Hemorrhagic shock resuscitation with balanced blood products",
    acuity: "Critical",
    frequency: "High",
    overview: "Massive transfusion is defined as \u226510 units pRBC in 24 hours, OR >4 units in 1 hour with ongoing hemorrhage anticipated. Modern MTP emphasizes balanced resuscitation with a 1:1:1 ratio of pRBC:FFP:platelets, damage-control resuscitation principles, and early coagulation-guided therapy. This is a high-yield topic for surgical/trauma ICU nurses interviewing for CRNA programs.",
    pathophysiology: [
      { title: "Lethal Triad of Trauma", detail: "Hypothermia + Acidosis + Coagulopathy = self-perpetuating death spiral. Hypothermia: impairs clotting enzyme function (enzymatic reactions are temperature-dependent). Acidosis: inhibits clotting factor activity (factor VIIa activity drops 90% at pH 7.0 vs 7.4) and impairs platelet aggregation. Coagulopathy: consumption of factors + dilution from crystalloid + fibrinolysis. Each element worsens the other two." },
      { title: "Acute Traumatic Coagulopathy", detail: "Distinct from dilutional coagulopathy — occurs within minutes of injury BEFORE any fluid resuscitation. Mechanism: tissue injury + hypoperfusion activate protein C \u2192 inhibits factors Va/VIIIa and causes hyperfibrinolysis via tPA release. This endogenous coagulopathy affects ~25% of severe trauma patients on arrival and independently doubles mortality." },
      { title: "Dilutional Coagulopathy", detail: "Large-volume crystalloid resuscitation dilutes clotting factors and platelets. Historically, trauma patients received massive crystalloid first, then blood products — creating severe hemodilution. Modern damage-control resuscitation reverses this: minimize crystalloid, early balanced blood products." },
      { title: "Citrate Toxicity", detail: "Blood products are stored in citrate anticoagulant. Massive transfusion overwhelms the liver's ability to metabolize citrate. Citrate chelates ionized Ca\u00b2\u207a \u2192 hypocalcemia. Effects: decreased myocardial contractility, hypotension, QT prolongation, coagulopathy (Ca\u00b2\u207a is factor IV, required for multiple coagulation steps). Empirically replace calcium with CaCl\u2082 1g IV per 4\u20136 units of blood." },
      { title: "Hyperkalemia", detail: "Stored pRBCs leak K\u207a during storage (older units have K\u207a concentrations up to 40\u201350 mEq/L). Rapid transfusion of multiple units can cause acute hyperkalemia \u2192 cardiac arrhythmias. Irradiated blood has even higher K\u207a. Monitor K\u207a q30\u201360 min during massive transfusion." },
    ],
    management: [
      { step: 1, title: "Activate MTP & Damage-Control Resuscitation", items: [
        "Activate MTP per institutional protocol — goal: blood products at bedside within 15 minutes",
        "Initial resuscitation ratio: 1:1:1 (pRBC : FFP : Platelets) — based on PROPPR trial",
        "Minimize crystalloid — use blood products as primary resuscitation fluid",
        "Permissive hypotension: target SBP 80\u201390 mmHg in penetrating trauma (avoid 'popping the clot' with aggressive crystalloid)",
        "Exception: TBI patients need SBP \u2265100\u2013110 (do NOT allow permissive hypotension in TBI)"
      ]},
      { step: 2, title: "Tranexamic Acid (TXA)", items: [
        "TXA 1g IV over 10 min within 3 HOURS of injury, then 1g over 8 hours (CRASH-2 protocol)",
        "Mechanism: lysine analog that blocks plasminogen \u2192 plasmin conversion \u2192 inhibits fibrinolysis",
        "CRASH-2 trial: reduced all-cause mortality in bleeding trauma patients when given within 3 hours",
        "After 3 hours: TXA may INCREASE mortality (possible pro-thrombotic effect in stabilized patients)",
        "Do NOT wait for labs — give empirically in suspected massive hemorrhage"
      ]},
      { step: 3, title: "Lab-Guided Correction", items: [
        "Viscoelastic testing (TEG/ROTEM) preferred over conventional labs for real-time coagulation assessment",
        "Fibrinogen <150\u2013200 mg/dL: cryoprecipitate 10 units or fibrinogen concentrate 2\u20134g",
        "INR >1.5: FFP 15 mL/kg or PCC (prothrombin complex concentrate) for faster correction",
        "Platelets <50,000 (or <100,000 with TBI or ongoing bleeding): transfuse platelets (1 apheresis unit or 6-pack)",
        "iCa\u00b2\u207a <1.0 mmol/L: CaCl\u2082 1g IV (10 mL of 10%) — keep iCa\u00b2\u207a >1.0. Calcium gluconate is an alternative but delivers ~3x less elemental calcium per gram"
      ]},
      { step: 4, title: "Address the Lethal Triad", items: [
        "Temperature: actively warm — forced-air warmer, fluid warmer (Level 1/Belmont), warm blankets, increase room temp. Target \u226536\u00b0C",
        "Acidosis: correct with perfusion (blood products and source control), not sodium bicarbonate. Bicarb only if pH <7.1 and refractory",
        "Coagulopathy: balanced products, fibrinogen replacement, TXA, calcium, and rewarming. Coagulopathy corrects when hypothermia and acidosis are corrected",
        "Surgical source control: the surgeon controls the bleeding — no amount of blood products will save a patient who is actively exsanguinating from a surgical source. Damage-control surgery: pack and close, stabilize in ICU, return for definitive repair"
      ]}
    ],
    monitoring: [
      { param: "iCa\u00b2\u207a", target: ">1.0 mmol/L", note: "Check q30\u201360 min. Citrate toxicity is the #1 metabolic complication. Give CaCl\u2082 1g per ~4 units blood" },
      { param: "Fibrinogen", target: ">150\u2013200 mg/dL", note: "First factor to become critically low in massive hemorrhage. Cryo or fibrinogen concentrate" },
      { param: "K\u207a", target: "<5.5 mEq/L", note: "Rises with stored blood, worsens with acidosis. Treat with calcium, insulin/D50, bicarb if critical" },
      { param: "Temperature", target: "\u226536\u00b0C", note: "Coagulation enzymes are temperature-dependent. Below 34\u00b0C, clotting factor activity drops precipitously" },
      { param: "TEG/ROTEM", target: "Guide product therapy", note: "R-time/CT \u2192 factor deficiency (give FFP). MA/MCF \u2192 platelet/fibrinogen function. LY30/ML \u2192 fibrinolysis (give TXA)" },
      { param: "Lactate / Base Deficit", target: "Improving trend", note: "Base deficit >6 suggests significant hemorrhagic shock. Trend improvement = adequate resuscitation" },
    ],
    interviewQs: [
      { q: "You're in the trauma bay. Patient with penetrating abdominal trauma, HR 130, BP 74/40. Explain your resuscitation strategy.", a: "Activate MTP immediately. Damage-control resuscitation principles: (1) Permissive hypotension — target SBP 80\u201390 until surgical control (do NOT chase a normal BP with crystalloid, which dilutes factors and disrupts clot). (2) Minimize crystalloid — blood products are the resuscitation fluid. Start with uncrossmatched O-negative pRBCs while type-specific blood is being prepared. (3) Give TXA 1g IV over 10 min NOW (CRASH-2 protocol). (4) 1:1:1 ratio of pRBC:FFP:platelets. (5) CaCl\u2082 1g IV empirically after first 4 units. (6) Active warming — every line through a fluid warmer. (7) Send TEG/ROTEM and standard labs including fibrinogen. (8) The #1 priority is getting this patient to the OR for surgical hemorrhage control — no amount of blood products fixes an uncontrolled surgical bleeder." },
      { q: "Why do we give calcium during massive transfusion?", a: "Stored blood products contain citrate as an anticoagulant. Citrate chelates (binds) ionized calcium, removing it from circulation. During massive transfusion, the volume of citrate overwhelms the liver's capacity to metabolize it (citrate is normally metabolized in the Krebs cycle). Ionized Ca\u00b2\u207a drops below functional levels. The consequences: (1) Decreased myocardial contractility (Ca\u00b2\u207a is essential for excitation-contraction coupling), (2) Hypotension (vascular smooth muscle relaxation), (3) Coagulopathy (Ca\u00b2\u207a is Factor IV, required at multiple points in the coagulation cascade), (4) QT prolongation and potential arrhythmias. Empiric dosing: CaCl\u2082 1g IV (via central line ideally — peripheral CaCl\u2082 causes tissue necrosis if it extravasates) per every 4\u20136 units of blood, guided by iCa\u00b2\u207a levels targeting >1.0 mmol/L." },
    ],
    pearls: [
      "PROPPR trial (2015): 1:1:1 ratio (pRBC:FFP:PLT) achieved hemostasis in more patients and trended toward lower 24-hour mortality compared to 1:1:2 ratio",
      "TXA must be given within 3 hours of injury — after 3 hours, CRASH-2 data shows it may INCREASE mortality. Don't wait for labs, give empirically",
      "The lethal triad is a vicious cycle: hypothermia impairs enzymes, acidosis inhibits factor activity, coagulopathy causes more bleeding \u2192 more hypothermia from blood loss and cold products. Breaking any one element helps break the cycle",
      "Whole blood (if available) is increasingly used in military and some civilian trauma — provides all components in physiologic ratios, eliminates the storage lesion of component therapy",
      "CaCl\u2082 delivers 3x more elemental calcium per gram than calcium gluconate. In arrest or severe shock, CaCl\u2082 is preferred. Calcium gluconate requires hepatic metabolism to release ionized Ca\u00b2\u207a — in shock/liver dysfunction, conversion is impaired"
    ]
  },

  {
    id: "dka",
    title: "DKA & Hyperglycemic Crisis",
    icon: "\u{1F4C9}",
    color: "#22c55e",
    tagline: "Insulin deficiency cascade with anion gap metabolic acidosis",
    acuity: "High",
    frequency: "High",
    overview: "Diabetic Ketoacidosis (DKA) is a metabolic emergency characterized by hyperglycemia (usually >250 mg/dL), anion gap metabolic acidosis (pH <7.30, bicarb <18), and ketonemia/ketonuria. Hyperosmolar Hyperglycemic State (HHS) presents with extreme hyperglycemia (often >600 mg/dL), hyperosmolality (>320 mOsm/kg), and minimal ketosis. Both require aggressive fluid resuscitation, insulin, and electrolyte management. The electrolyte physiology — especially potassium dynamics — is a favorite CRNA interview topic.",
    pathophysiology: [
      { title: "Insulin Deficiency", detail: "Absolute (DKA in Type 1) or relative (HHS in Type 2) insulin deficiency \u2192 cells cannot uptake glucose despite hyperglycemia. Counter-regulatory hormones surge: glucagon, cortisol, catecholamines, growth hormone \u2192 amplify hepatic gluconeogenesis and glycogenolysis, worsening hyperglycemia." },
      { title: "Ketogenesis (DKA)", detail: "Without insulin, lipolysis is uninhibited \u2192 massive free fatty acid (FFA) release from adipose tissue. FFAs undergo \u03b2-oxidation in hepatic mitochondria to acetyl-CoA, which overwhelms the TCA cycle. Excess acetyl-CoA is shunted to ketone body synthesis: acetoacetate, \u03b2-hydroxybutyrate (BHB), and acetone. BHB and acetoacetate are strong acids \u2192 anion gap metabolic acidosis." },
      { title: "Osmotic Diuresis", detail: "Glucose above the renal threshold (~180 mg/dL) spills into urine. Glucose in the tubule creates an osmotic gradient that drags water, Na\u207a, K\u207a, Cl\u207b, PO\u2084\u00b3\u207b, and Mg\u00b2\u207a into the urine \u2192 profound dehydration (average deficit 5\u20139L in DKA, 8\u201312L in HHS). Total body K\u207a is depleted even when serum K\u207a appears normal or elevated (see below)." },
      { title: "The Potassium Trap", detail: "CRITICAL CONCEPT: Total body K\u207a is always DEPLETED in DKA (average deficit 3\u20135 mEq/kg). But serum K\u207a may be normal or HIGH on presentation because: acidosis causes H\u207a/K\u207a exchange (H\u207a enters cells, K\u207a exits), insulin deficiency prevents K\u207a cellular uptake, and dehydration concentrates serum K\u207a. When you give insulin and correct acidosis, K\u207a rapidly shifts intracellularly \u2192 serum K\u207a plummets. NEVER start insulin if K\u207a <3.3 mEq/L \u2014 replace K\u207a first or risk fatal hypokalemia." },
      { title: "Cerebral Edema Risk", detail: "Rapid correction of hyperosmolality (aggressive fluid replacement + insulin dropping glucose too fast) creates an osmotic gradient that pulls water INTO brain cells \u2192 cerebral edema. More common in pediatric DKA but occurs in adults. Target glucose reduction: 50\u201375 mg/dL per hour, no faster. When glucose reaches 200\u2013250 in DKA (or 250\u2013300 in HHS), add dextrose to fluids and reduce insulin rate rather than stopping insulin entirely (need insulin to clear ketones, not just glucose)." },
    ],
    management: [
      { step: 1, title: "Fluid Resuscitation", items: [
        "NS (0.9% NaCl) 1\u20131.5 L/hr for first 1\u20132 hours (or 15\u201320 mL/kg/hr)",
        "After initial bolus: assess corrected serum Na\u207a. If low/normal: continue NS. If high: switch to 0.45% NS at 250\u2013500 mL/hr",
        "Corrected Na\u207a formula: add 1.6 mEq/L to measured Na\u207a for every 100 mg/dL glucose above 100",
        "Average fluid deficit: 5\u20139L (DKA), 8\u201312L (HHS). Replace ~50% in first 12 hours, remainder over next 24\u201336 hours",
        "When glucose reaches 200\u2013250 mg/dL: switch to D5 0.45% NS to prevent hypoglycemia while continuing insulin for ketone clearance"
      ]},
      { step: 2, title: "Insulin Therapy", items: [
        "Regular insulin IV infusion: 0.14 units/kg/hr (no bolus) OR 0.1 units/kg bolus then 0.1 units/kg/hr infusion",
        "PRE-INSULIN CHECK: K\u207a must be \u22653.3 mEq/L before starting insulin. If <3.3: hold insulin, replace K\u207a first",
        "Target glucose decrease: 50\u201375 mg/dL per hour. If not achieved, double insulin rate",
        "When glucose reaches 200\u2013250: reduce insulin to 0.02\u20130.05 units/kg/hr AND add D5 to IVF",
        "Do NOT stop insulin until AG closes: pH >7.30, bicarb >18, AG <12. Glucose normalizes before ketosis resolves — this is why you add dextrose and keep insulin running"
      ]},
      { step: 3, title: "Potassium Replacement", items: [
        "K\u207a <3.3 mEq/L: HOLD insulin, give 20\u201340 mEq/hr KCl IV until K\u207a \u22653.3, THEN start insulin",
        "K\u207a 3.3\u20135.3 mEq/L: add 20\u201340 mEq KCl per liter of IV fluid, recheck q2h",
        "K\u207a >5.3 mEq/L: do NOT supplement K\u207a, recheck in 2 hours. K\u207a will drop rapidly once insulin is started",
        "Goal: maintain K\u207a 4.0\u20135.0 mEq/L throughout treatment. Hypokalemia is the #1 cause of death during DKA treatment"
      ]},
      { step: 4, title: "Other Electrolyte & Acid-Base Management", items: [
        "Phosphate: replace if <1.0 mg/dL (use KPhos to simultaneously replace K\u207a and PO\u2084). Severe hypophosphatemia impairs O\u2082 delivery (decreased 2,3-DPG) and causes respiratory muscle weakness",
        "Bicarbonate: controversial. Only consider if pH <6.9 (give NaHCO\u2083 100 mEq in 400 mL water + 20 mEq KCl over 2 hours). Bicarb worsens intracellular acidosis (paradoxical CNS acidosis) and may worsen hypokalemia",
        "Magnesium: replace if <1.5 mg/dL. Commonly depleted from osmotic diuresis"
      ]}
    ],
    monitoring: [
      { param: "BMP + Glucose", target: "q1\u20132h", note: "Monitor glucose, K\u207a, Na\u207a, bicarb, BUN/Cr. Calculate AG = Na \u2212 (Cl + HCO\u2083)" },
      { param: "Anion Gap", target: "<12 (closing)", note: "AG closure = DKA resolution. Continue insulin until AG closes, not just until glucose normalizes" },
      { param: "Potassium", target: "4.0\u20135.0 mEq/L", note: "Check q1\u20132h. K\u207a shifts rapidly with insulin and pH correction. Anticipate dropping K\u207a" },
      { param: "Glucose Trend", target: "\u221250\u201375 mg/dL per hour", note: "Too fast risks cerebral edema. Too slow = inadequate insulin dose" },
      { param: "Venous pH", target: ">7.30 (resolving)", note: "Venous pH is adequate for monitoring (within 0.03 of arterial). Save ABGs for respiratory status" },
      { param: "Volume Status", target: "Strict I&O", note: "Massive fluid shifts during treatment. Monitor for fluid overload in elderly/cardiac patients" },
    ],
    interviewQs: [
      { q: "Your DKA patient's glucose is 185 but pH is still 7.18 and AG is 24. Do you stop the insulin?", a: "Absolutely NOT. Glucose normalizes before ketoacidosis resolves because insulin clears glucose faster than ketone bodies. If you stop insulin, ketogenesis resumes immediately and the patient deteriorates. Management: reduce insulin rate to 0.02\u20130.05 units/kg/hr AND switch IV fluids to D5 0.45% NS. The dextrose prevents hypoglycemia while insulin continues to suppress lipolysis and clear ketones. Continue until: pH >7.30, bicarb >18, AG <12. Only then transition to subcutaneous insulin (overlap IV and subQ by 1\u20132 hours to prevent rebound DKA)." },
      { q: "A patient presents with DKA, glucose 450, K\u207a 3.0. What do you do first?", a: "Replace potassium FIRST, BEFORE starting insulin. K\u207a 3.0 is critically low in the context of DKA. Despite a serum K\u207a of 3.0, total body K\u207a is profoundly depleted (perhaps 200\u2013400 mEq total deficit). The measured 3.0 is falsely elevated by acidosis (H\u207a/K\u207a exchange) and insulin deficiency. If you give insulin now, K\u207a will shift intracellularly and serum K\u207a will crash into the lethal range (<2.5 mEq/L), risking cardiac arrest from fatal arrhythmias (U waves, peaked T \u2192 flat T \u2192 VFib). Management: aggressive K\u207a replacement (40 mEq/hr IV via central line with cardiac monitoring) until K\u207a \u22653.3. Then start insulin with ongoing K\u207a supplementation. Start fluids immediately — volume resuscitation can proceed while correcting K\u207a." },
    ],
    pearls: [
      "The #1 killer during DKA treatment is HYPOKALEMIA, not hyperglycemia or acidosis. Always check K\u207a before starting insulin",
      "Glucose normalizes before ketoacidosis resolves — never stop insulin based on glucose alone. Add dextrose, keep insulin running until the anion gap closes",
      "Corrected Na\u207a formula: add 1.6 mEq/L for every 100 mg/dL glucose above 100. If corrected Na\u207a is rising as glucose drops, this is normal (water redistributing). If corrected Na\u207a is falling, the patient is getting too much free water",
      "HHS vs DKA: HHS patients produce enough insulin to prevent ketogenesis but not enough to control glucose. Glucose often >600, osmolality >320, minimal acidosis. Mortality is actually HIGHER in HHS (5\u201320%) than DKA (1\u20135%) because of the severe hyperosmolality and dehydration",
      "Euglycemic DKA: can occur with SGLT2 inhibitors (empagliflozin, dapagliflozin) — DKA with glucose <250 mg/dL. Easy to miss. Check ketones and AG in any SGLT2i patient with metabolic acidosis, even with normal glucose"
    ]
  },

  {
    id: "stroke",
    title: "Acute Ischemic Stroke",
    icon: "\u{1F4A5}",
    color: "#7c3aed",
    tagline: "Time-critical reperfusion with thrombolytics and thrombectomy",
    acuity: "Critical",
    frequency: "Moderate\u2013High",
    overview: "Acute ischemic stroke is caused by arterial occlusion (thrombotic or embolic) resulting in focal cerebral ischemia. The core principle: TIME IS BRAIN \u2014 1.9 million neurons die every minute during a large vessel occlusion. Treatment centers on rapid reperfusion via IV alteplase (within 4.5 hours) and/or mechanical thrombectomy (within 24 hours for select patients). With your SCRN certification and TNICU background, this is a scenario you should dominate.",
    pathophysiology: [
      { title: "Ischemic Core vs Penumbra", detail: "The ischemic core is tissue that has already infarcted (CBF <10\u201312 mL/100g/min) — irreversible. The ischemic penumbra is the surrounding tissue that is hypoperfused but still viable (CBF 12\u201322 mL/100g/min), surviving on collateral flow. The penumbra is the therapeutic target — reperfusion saves penumbral tissue. Without reperfusion, the core expands into the penumbra over hours (the 'time is brain' concept)." },
      { title: "Excitotoxic Cascade", detail: "Ischemia \u2192 ATP depletion \u2192 failure of Na\u207a/K\u207a-ATPase \u2192 intracellular Na\u207a and Ca\u00b2\u207a accumulation \u2192 cell swelling (cytotoxic edema), glutamate release (excitotoxicity), free radical generation, and apoptosis. This cascade evolves over hours to days, which is why neuroprotective strategies (blood pressure management, glucose control, temperature control) are important alongside reperfusion." },
      { title: "Hemorrhagic Transformation", detail: "After ischemic injury, the blood-brain barrier is disrupted. Reperfusion (either spontaneous or via tPA/thrombectomy) can cause bleeding into the infarcted tissue. Risk increases with: larger infarct volume, longer time to reperfusion, higher tPA dose, uncontrolled hypertension, anticoagulation. This is why BP must be tightly controlled post-tPA: <180/105." },
    ],
    management: [
      { step: 1, title: "Rapid Assessment (Door-to-Needle <60 min)", items: [
        "ABCs, glucose (hypoglycemia mimics stroke), stat CT head (rule out hemorrhagic stroke — tPA is CONTRAINDICATED in hemorrhagic stroke)",
        "NIHSS (National Institutes of Health Stroke Scale): 0\u201342 point scale assessing consciousness, gaze, visual fields, facial palsy, motor, ataxia, sensory, language, dysarthria, neglect",
        "CT angiography (CTA): identify large vessel occlusion (LVO) for thrombectomy candidacy (ICA, M1, M2 MCA, basilar)",
        "CT perfusion: identify ischemic core vs penumbra (mismatch = salvageable tissue). Guides extended-window thrombectomy",
        "Labs: CBC, BMP, coags, troponin. Do NOT delay tPA for lab results unless on anticoagulants"
      ]},
      { step: 2, title: "IV Alteplase (tPA)", items: [
        "Indication: acute ischemic stroke within 4.5 hours of symptom onset (or last known well)",
        "Dose: 0.9 mg/kg (max 90 mg). Give 10% as IV bolus over 1 min, remaining 90% infused over 60 min",
        "BP must be <185/110 BEFORE tPA and <180/105 for 24 hours AFTER",
        "Antihypertensives: labetalol 10\u201320 mg IV, nicardipine 5 mg/hr (titrate by 2.5 q5\u201315 min, max 15 mg/hr), or clevidipine",
        "Exclusion criteria include: hemorrhage on CT, INR >1.7, platelets <100K, recent major surgery, active internal bleeding",
        "Extended window (3\u20134.5 hrs) additional exclusions: age >80, NIHSS >25, oral anticoagulant use, history of both DM and prior stroke"
      ]},
      { step: 3, title: "Mechanical Thrombectomy", items: [
        "Indicated for LVO with NIHSS \u22656 and mismatch on perfusion imaging",
        "Standard window: within 6 hours of onset (MR CLEAN, ESCAPE, EXTEND-IA, SWIFT PRIME, REVASCAT trials)",
        "Extended window: 6\u201324 hours if favorable perfusion imaging (DAWN trial: clinical-imaging mismatch; DEFUSE 3 trial: perfusion mismatch)",
        "Stent retriever or aspiration thrombectomy. Recanalization rates >80% (TICI 2b/3 flow)",
        "Can be done WITH or WITHOUT prior tPA — tPA should NOT delay transfer for thrombectomy. Give tPA at the spoke hospital, transfer for thrombectomy at the hub (drip-and-ship model)"
      ]},
      { step: 4, title: "Post-Reperfusion Care", items: [
        "Neuro checks q15 min x 2hr, q30 min x 6hr, q1hr x 16hr post-tPA. Any decline: stat CT to rule out hemorrhagic transformation",
        "BP management: <180/105 x 24 hours post-tPA. After 24 hours: permissive hypertension (up to 220/120) in non-tPA patients to maintain penumbral perfusion",
        "Dysphagia screen BEFORE any oral intake (aspiration risk)",
        "Glucose: 140\u2013180 mg/dL (hyperglycemia worsens infarct expansion)",
        "DVT prophylaxis after 24 hours (if no hemorrhagic transformation on follow-up CT)",
        "Antiplatelets: aspirin 325 mg within 24\u201348 hours (after tPA period). Dual antiplatelet for minor stroke/TIA (CHANCE, POINT trials)"
      ]}
    ],
    monitoring: [
      { param: "NIHSS", target: "Serial assessments", note: "Worsening NIHSS = hemorrhagic transformation, re-occlusion, or edema. Any 4+ point change = stat CT" },
      { param: "Blood Pressure", target: "<180/105 post-tPA", note: "Tight control prevents hemorrhagic transformation. Nicardipine drip preferred for titratability" },
      { param: "Glucose", target: "140\u2013180 mg/dL", note: "Hyperglycemia increases infarct volume and worsens outcomes. Hypoglycemia mimics stroke" },
      { param: "Temperature", target: "<37.5\u00b0C", note: "Fever increases metabolic demand in ischemic penumbra. Aggressive normothermia" },
    ],
    interviewQs: [
      { q: "Patient presents with right-sided weakness and aphasia. CT head is negative for hemorrhage. NIHSS is 14. Last known well 2 hours ago. What's your management?", a: "This is a left MCA syndrome (right hemiparesis + aphasia = left hemisphere). CT negative for hemorrhage, within the 4.5-hour tPA window. (1) Check BP — if >185/110, treat with labetalol or nicardipine to get below threshold BEFORE giving tPA. (2) Give alteplase 0.9 mg/kg (max 90 mg): 10% bolus over 1 min, 90% infused over 60 min. Do NOT delay for full lab results unless on anticoagulants. (3) Simultaneously obtain CTA — NIHSS 14 with cortical signs suggests LVO. If LVO confirmed (M1 MCA occlusion), activate thrombectomy team. Drip-and-ship if needed. (4) Admit to neuro ICU, q15 min neuro checks, BP <180/105 for 24 hours, repeat CT at 24 hours before starting antiplatelets." },
      { q: "Why is blood pressure management different before vs. after tPA, and different in stroke patients who don't get tPA?", a: "Before tPA: BP must be <185/110 because giving a thrombolytic to a hypertensive patient dramatically increases hemorrhagic transformation risk. After tPA: maintain <180/105 for 24 hours for the same reason — the brain is reperfused but the BBB is compromised, and hypertension can drive bleeding. In patients who DON'T receive tPA: permissive hypertension up to 220/120 is allowed. The rationale: in acute ischemic stroke, autoregulation is disrupted in the penumbra. The penumbra depends on systemic blood pressure to maintain perfusion through collateral vessels. Aggressively lowering BP can reduce collateral flow and expand the infarct core. The 220/120 threshold is where the risk of hypertensive end-organ damage (encephalopathy, cardiac injury, aortic dissection) outweighs the perfusion benefit." },
    ],
    pearls: [
      "1.9 million neurons die per minute during a large vessel occlusion. 'Time is brain' is not a slogan — it's a physiologic reality that drives the urgency of stroke care",
      "Door-to-needle target: <60 minutes. Door-to-groin (thrombectomy): <90 minutes. These benchmarks are publicly reported quality metrics",
      "tPA dose for stroke (0.9 mg/kg, max 90 mg) is DIFFERENT from PE dose (100 mg over 2 hrs) — do not confuse them. Stroke dose has 10% bolus + 60 min infusion",
      "DAWN and DEFUSE 3 trials extended the thrombectomy window to 24 hours using perfusion imaging — the concept is tissue clock (how much brain is salvageable) not just time clock",
      "Permissive hypertension in acute stroke makes sense because of disrupted autoregulation — the ischemic penumbra is pressure-passive and needs higher MAP to maintain collateral flow. Dropping BP precipitously can extend the infarct"
    ]
  },

  {
    id: "sci",
    title: "Spinal Cord Injury",
    icon: "\u{1F9B4}",
    color: "#ec4899",
    tagline: "Neurogenic shock, spinal shock, and autonomic dysreflexia",
    acuity: "Critical",
    frequency: "Moderate",
    overview: "Spinal cord injury (SCI) presents unique hemodynamic and neurological challenges in the ICU. The key concepts for CRNA interviews are distinguishing neurogenic shock from spinal shock, understanding the autonomic disruption at different injury levels, managing cardiovascular instability, and recognizing/treating autonomic dysreflexia. As a TNICU nurse, you\u2019ll be expected to speak authoritatively on this topic.",
    pathophysiology: [
      { title: "Neurogenic Shock vs Spinal Shock", detail: "Neurogenic shock: HEMODYNAMIC — loss of sympathetic tone below the injury level \u2192 vasodilation (low SVR), bradycardia (unopposed vagal tone), and hypotension. Occurs with injuries at T6 or above (loss of splanchnic sympathetic outflow). Spinal shock: NEUROLOGICAL — temporary loss of all spinal cord function (motor, sensory, reflexes) below the injury level. Areflexia, flaccid paralysis. NOT a circulatory shock state. Resolution marked by return of bulbocavernosus reflex (S2\u2013S4). These are completely different entities — interviewers love to test whether you can distinguish them." },
      { title: "Autonomic Disruption by Level", detail: "T1\u2013T4: cardiac sympathetic fibers. Loss \u2192 bradycardia, decreased contractility. T5\u2013L2: splanchnic vasomotor fibers. Loss \u2192 vasodilation, venous pooling, distributive shock. Above T6: both cardiac and vascular sympathetic control disrupted. Parasympathetic outflow (vagus nerve, CN X) exits the brainstem — always intact in SCI. So above T6: sympathetic loss + intact parasympathetic = bradycardia + hypotension." },
      { title: "Autonomic Dysreflexia (AD)", detail: "Occurs AFTER spinal shock resolves, in injuries at T6 or above. A noxious stimulus below the injury (distended bladder is #1 cause, followed by bowel impaction) triggers a massive sympathetic reflex below the lesion \u2192 severe vasoconstriction below the injury \u2192 acute hypertension (SBP can exceed 250\u2013300 mmHg). Above the injury: baroreceptors detect hypertension \u2192 brain sends parasympathetic signals via vagus \u2192 bradycardia and vasodilation ABOVE the lesion (flushing, headache, diaphoresis above injury level). But the parasympathetic signals CANNOT reach below the lesion (cord is disrupted) \u2192 vasoconstriction persists below \u2192 hypertensive crisis continues. Life-threatening: can cause stroke, seizures, MI, retinal hemorrhage." },
      { title: "Secondary Injury Prevention", detail: "Similar to TBI: the primary cord injury is irreversible, but secondary injury from hypotension, hypoxia, and ischemia worsens outcomes. Mean arterial pressure (MAP) augmentation to 85\u201390 mmHg for 5\u20137 days post-injury is recommended (AANS/CNS guidelines) to optimize spinal cord perfusion. This often requires vasopressors." },
    ],
    management: [
      { step: 1, title: "Acute SCI Stabilization", items: [
        "C-spine immobilization until cleared. Intubation in cervical SCI: manual in-line stabilization (MILS), consider awake fiberoptic if stable. Avoid excessive neck extension",
        "MAP augmentation: target MAP 85\u201390 mmHg x 5\u20137 days (AANS/CNS guidelines). Improves spinal cord perfusion",
        "Volume resuscitation first: 1\u20132L crystalloid to assess fluid responsiveness (hypovolemia from trauma must be ruled out BEFORE attributing hypotension to neurogenic shock)",
        "Vasopressors for neurogenic shock: norepinephrine preferred (\u03b11 vasoconstriction + mild \u03b21 for heart rate support) or phenylephrine (pure \u03b11 if HR is adequate). Low-dose dopamine may help if bradycardia is prominent",
        "Atropine 0.5\u20131 mg IV for symptomatic bradycardia. Some patients require transcutaneous or transvenous pacing"
      ]},
      { step: 2, title: "Distinguish Shock Types in Trauma", items: [
        "Neurogenic shock: hypotension + BRADYCARDIA + warm/flushed extremities (vasodilated). Patient is warm and dry below the injury",
        "Hemorrhagic/hypovolemic shock: hypotension + TACHYCARDIA + cool/clammy extremities (vasoconstricted). Patient is cold and diaphoretic",
        "CRITICAL: trauma patients can have BOTH — a bleeding patient with SCI. Always rule out hemorrhage first (FAST exam, CXR, pelvis XR) before attributing hypotension to neurogenic mechanism. Giving vasopressors to a hypovolemic patient is dangerous",
        "If unsure: give fluids first. If BP improves, it was hypovolemia. If BP doesn't improve and HR stays low, neurogenic shock"
      ]},
      { step: 3, title: "Autonomic Dysreflexia Management", items: [
        "EMERGENCY: sit patient upright (drops BP via orthostatic pooling), loosen clothing/binders",
        "Find and remove the stimulus: #1 bladder distension \u2192 straight cath immediately. Check foley for kinks, clots, malposition. #2 bowel impaction \u2192 disimpact (use lidocaine jelly to avoid further stimulus). #3 skin: pressure ulcers, ingrown toenails, tight clothing",
        "If BP remains elevated after removing stimulus: nifedipine 10 mg bite-and-swallow or nitroglycerin paste 1\" topical (both vasodilate below the lesion). IV nitroprusside or nicardipine for severe crisis",
        "Monitor for complications: hypertensive encephalopathy, intracranial hemorrhage, MI, retinal hemorrhage, seizures",
        "Prevention: regular bladder catheterization schedule, bowel program, skin checks. Educate patient and family"
      ]},
      { step: 4, title: "Respiratory Management", items: [
        "C3\u2013C5 injury: phrenic nerve compromise \u2192 diaphragm paralysis \u2192 respiratory failure requiring intubation and potentially long-term ventilatory support",
        "T1\u2013T12 injury: intercostal muscle paralysis \u2192 decreased tidal volume, impaired cough. May need NIPPV or tracheostomy",
        "Loss of cough reflex below the injury \u2192 secretion retention \u2192 atelectasis \u2192 pneumonia. Aggressive pulmonary toilet, quad cough assist",
        "Ascending edema can compromise additional cord levels in the first 24\u201372 hours — a patient with a T4 injury may develop C-spine level respiratory failure"
      ]}
    ],
    monitoring: [
      { param: "MAP", target: "85\u201390 mmHg x 5\u20137 days", note: "Spinal cord perfusion pressure depends on MAP. Arterial line required" },
      { param: "Heart Rate", target: ">50\u201360 bpm", note: "Bradycardia from unopposed vagal tone. May need atropine, isoproterenol, or pacing" },
      { param: "Respiratory Function", target: "Serial NIF, VC", note: "Negative Inspiratory Force <\u221220 cmH\u2082O or VC <15 mL/kg \u2192 impending respiratory failure, intubate early" },
      { param: "Temperature", target: "Normothermia", note: "Poikilothermia below injury level (loss of thermoregulation). Active warming/cooling as needed" },
      { param: "DVT Prophylaxis", target: "Start within 72 hrs", note: "SCI has highest VTE risk of any condition (~40\u201380% without prophylaxis). LMWH + SCDs" },
    ],
    interviewQs: [
      { q: "A trauma patient has a C6 SCI. BP is 78/42, HR 48. Warm extremities. What type of shock and how do you manage it?", a: "Neurogenic shock. The hemodynamic triad: hypotension + bradycardia + warm vasodilated extremities confirms loss of sympathetic tone with unopposed parasympathetic activity. C6 disrupts both cardiac sympathetics (T1\u2013T4) and splanchnic vasomotor tone (T5\u2013L2). Management: (1) Rule out hemorrhage FIRST — FAST exam, labs, CXR. Trauma patients can have concurrent hemorrhagic and neurogenic shock. (2) IVF 1\u20132L crystalloid bolus to optimize preload. (3) Vasopressor: norepinephrine preferred (\u03b11 for vasoconstriction + \u03b21 for mild chronotropy). Target MAP 85\u201390 mmHg. (4) Atropine 0.5 mg IV for symptomatic bradycardia (HR <50 with symptoms). May need repeat dosing or transcutaneous pacing if refractory. (5) This patient also has respiratory risk (C6 — phrenic nerve C3\u2013C5 may be intact but intercostals are gone). Monitor NIF and VC closely for ascending edema compromising diaphragm function." },
      { q: "What is autonomic dysreflexia and why is it dangerous?", a: "Autonomic dysreflexia is a potentially life-threatening hypertensive emergency that occurs in patients with SCI at T6 or above, after spinal shock has resolved. A noxious stimulus below the injury level (most commonly a distended bladder or fecal impaction) triggers an uninhibited sympathetic reflex through the intact spinal cord below the lesion \u2192 massive vasoconstriction below the injury \u2192 acute severe hypertension (SBP can exceed 250\u2013300). Above the injury, the brain detects the hypertension via baroreceptors and responds with parasympathetic outflow (vagus nerve): bradycardia and vasodilation ABOVE the injury (causing flushing, headache, nasal congestion, diaphoresis above the injury level). The critical problem: the descending parasympathetic inhibitory signals CANNOT cross the lesion to reach the vasoconstricted vessels below \u2192 the hypertension persists. Danger: stroke, intracranial hemorrhage, seizures, MI, retinal hemorrhage, death. Treatment: sit upright, find and remove stimulus (catheterize bladder, disimpact bowel), pharmacotherapy with nifedipine or NTG if BP remains critical." },
    ],
    pearls: [
      "Neurogenic shock = hemodynamic (hypotension + bradycardia + warm). Spinal shock = neurological (areflexia + flaccidity below injury). They often coexist but are completely different concepts",
      "C3\u2013C5 keeps the diaphragm alive — injuries at or above C3 result in ventilator dependence. Phrenic nerve (C3\u2013C5) is the sole motor supply to the diaphragm",
      "Autonomic dysreflexia is a medical emergency. The #1 cause is bladder distension. Before ANY procedure below the injury level in a chronic SCI patient, ensure the bladder is emptied",
      "Always rule out hemorrhage before diagnosing neurogenic shock in trauma — the treatment is opposite (fluids vs vasopressors). A tachycardic hypotensive trauma patient is bleeding until proven otherwise",
      "MAP 85\u201390 for 5\u20137 days post-SCI is an evidence-based target for spinal cord perfusion optimization. This is analogous to CPP targeting in TBI — the cord, like the brain, is vulnerable to secondary ischemic injury",
      "For anesthesia implications: SCI patients above T6 should have autonomic dysreflexia prevention during surgery. Spinal/epidural anesthesia can prevent the afferent trigger. General anesthesia with deep plane also works. The risk is highest during urological and lower abdominal procedures"
    ]
  },

  {
    id: "post-arrest",
    title: "Post-Cardiac Arrest / ROSC Care",
    icon: "\u{1F49F}",
    color: "#0ea5e9",
    tagline: "Post-resuscitation syndrome and targeted temperature management",
    acuity: "Critical",
    frequency: "Very High",
    overview: "Post-cardiac arrest care (post-ROSC management) is a critical determinant of neurologic outcome and survival. After ROSC, patients face a unique pathophysiologic state \u2014 whole-body ischemia-reperfusion injury. The priorities are: hemodynamic optimization, targeted temperature management (TTM), identification and treatment of the arrest etiology, and neuroprognostication. ACLS post-ROSC care is extremely high-yield for interviews.",
    pathophysiology: [
      { title: "Post-Cardiac Arrest Syndrome", detail: "Four components: (1) Post-arrest brain injury — global cerebral ischemia-reperfusion \u2192 excitotoxicity, free radical damage, cerebral edema, impaired autoregulation. (2) Post-arrest myocardial dysfunction — 'stunned myocardium' with global hypokinesis, reduced EF (often 20\u201330%), usually recovers in 24\u201372 hours. (3) Systemic ischemia-reperfusion injury — SIRS-like response with vasodilation, capillary leak, multiorgan dysfunction. (4) Persistent precipitating pathology — the cause of arrest (ACS, PE, etc.) needs treatment." },
      { title: "Reperfusion Injury", detail: "Restoration of blood flow after ischemia paradoxically generates additional injury: O\u2082 free radicals (superoxide, hydroxyl radicals) from dysfunctional mitochondria, Ca\u00b2\u207a overload activating destructive enzymes, neutrophil infiltration and inflammatory cascades. TTM mitigates reperfusion injury by slowing metabolic rate, reducing free radical production, and decreasing inflammatory signaling." },
      { title: "Cerebral Autoregulation Disruption", detail: "Post-arrest, cerebral autoregulation is frequently impaired for 24\u201372+ hours. CBF becomes pressure-passive — MAP directly determines cerebral perfusion. Both hypotension (ischemia) and hypertension (edema, hemorrhage) are harmful. Optimal MAP varies by patient; targets of MAP >65\u201380 are commonly used." },
    ],
    management: [
      { step: 1, title: "Immediate Post-ROSC Priorities", items: [
        "12-lead EKG immediately — if STEMI, emergent cardiac catheterization regardless of neurologic status",
        "Secure airway: intubate if not already, confirm placement with continuous waveform capnography",
        "Target SpO\u2082 92\u201396% — AVOID hyperoxia (PaO\u2082 >300 increases oxidative brain injury). Wean FiO\u2082 to lowest level maintaining target",
        "Target PaCO\u2082 35\u201345 mmHg — both hypo- and hypercapnia are harmful. Hypocapnia \u2192 cerebral vasoconstriction. Hypercapnia \u2192 cerebral vasodilation \u2192 increased ICP",
        "Hemodynamic stabilization: fluid boluses for hypotension, vasopressors/inotropes as needed. Target MAP >65\u201380 and UOP >0.5 mL/kg/hr. Post-arrest myocardial stunning may require dobutamine or norepinephrine"
      ]},
      { step: 2, title: "Targeted Temperature Management (TTM)", items: [
        "Indication: ALL comatose patients (not following commands) after cardiac arrest, regardless of initial rhythm",
        "Target: 32\u201336\u00b0C for \u226524 hours (TTM2 trial showed no difference between 33\u00b0C and 36\u00b0C, but active temperature management is still recommended — the key is avoiding fever)",
        "Initiation: as soon as possible. Use surface cooling (Arctic Sun, cooling blankets) or intravascular catheter cooling (Thermogard). Cold IV saline can be used to initiate but is NOT sufficient for maintenance",
        "Maintenance: continuous core temperature monitoring (esophageal or bladder probe). Prevent shivering: BSAS protocol — acetaminophen \u2192 buspirone \u2192 Mg\u00b2\u207a infusion \u2192 meperidine \u2192 propofol/midazolam \u2192 neuromuscular blockade as last resort",
        "Rewarming: SLOW — 0.25\u00b0C/hour over 8\u201312 hours. Rapid rewarming causes rebound cerebral edema, hyperkalemia, and hemodynamic instability"
      ]},
      { step: 3, title: "Identify & Treat Cause (H's and T's)", items: [
        "H's: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia",
        "T's: Tension pneumothorax, Tamponade (cardiac), Toxins, Thrombosis (coronary = STEMI \u2192 PCI, pulmonary = PE \u2192 tPA/thrombectomy)",
        "STEMI: emergent PCI. If non-STEMI but high suspicion of ACS: early coronary angiography within 24 hours",
        "PE: consider tPA, surgical embolectomy, or catheter-directed therapy",
        "Send labs: BMP (K\u207a!), Mg\u00b2\u207a, troponin, lactate, ABG, toxicology screen, TSH"
      ]},
      { step: 4, title: "Neuroprognostication", items: [
        "Do NOT prognosticate early — wait at least 72 hours after normothermia (5+ days post-arrest if TTM was used)",
        "No single test is 100% predictive. Use multimodal assessment: clinical exam (pupillary reflexes, corneal reflexes, motor response), EEG (burst suppression, status epilepticus), SSEP (bilateral absence of N20 cortical responses), NSE (neuron-specific enolase >33 \u00b5g/L at 48\u201372h), MRI (diffusion restriction pattern)",
        "Confounders: sedation, neuromuscular blockade, hypothermia, metabolic derangements all confound neuro exam. Ensure adequate washout before prognosticating",
        "Bilateral absent pupillary light reflexes at \u226572 hours is the most specific predictor of poor outcome (FPR <1%)"
      ]}
    ],
    monitoring: [
      { param: "Core Temperature", target: "32\u201336\u00b0C x 24h", note: "Esophageal or bladder probe. Avoid fever (\u226537.5\u00b0C) for at least 72 hours post-arrest" },
      { param: "PaCO\u2082", target: "35\u201345 mmHg", note: "Hypocapnia causes cerebral vasoconstriction \u2192 ischemia. Hypercapnia \u2192 ICP elevation" },
      { param: "SpO\u2082", target: "92\u201396%", note: "Avoid hyperoxia (FiO\u2082 1.0 post-ROSC). Wean to lowest effective FiO\u2082" },
      { param: "MAP", target: ">65\u201380 mmHg", note: "Autoregulation disrupted. Both hypo- and hypertension are harmful. Art line mandatory" },
      { param: "Glucose", target: "140\u2013180 mg/dL", note: "Hyperglycemia worsens neurologic outcome. Avoid hypoglycemia" },
      { param: "Lactate", target: "Trending down", note: "Elevated post-arrest from global ischemia. Clearance indicates adequate resuscitation" },
    ],
    interviewQs: [
      { q: "Your patient achieves ROSC after VFib arrest. Walk me through your immediate management.", a: "Systematic post-ROSC care: (1) 12-lead EKG immediately — if STEMI, emergent PCI regardless of coma. (2) Secure airway, confirm ETT with continuous ETCO\u2082. (3) Ventilator: target SpO\u2082 92\u201396% (wean FiO\u2082 from 1.0 down), PaCO\u2082 35\u201345 on ABG. (4) Hemodynamics: art line, fluids/vasopressors to MAP >65\u201380. Expect myocardial stunning \u2014 may need norepinephrine or dobutamine. (5) Initiate TTM: surface or intravascular cooling to 32\u201336\u00b0C, maintain x 24 hours if patient is comatose. Manage shivering with tiered protocol. (6) Labs: BMP (K\u207a, Mg\u00b2\u207a), troponin, lactate, ABG, tox screen. (7) Correct reversible causes — the H's and T's. (8) Continuous EEG if resources available — post-arrest seizures are common and may be non-convulsive." },
      { q: "Why do we avoid hyperoxia after cardiac arrest?", a: "After ROSC, reperfusion of ischemic tissue generates reactive oxygen species (superoxide, hydroxyl radicals) from dysfunctional mitochondria. Administering high FiO\u2082 (PaO\u2082 >300 mmHg) provides excess substrate for free radical production, amplifying oxidative damage to already-injured neurons. Multiple observational studies and the TTM2 trial support that hyperoxia in the first 24 hours post-arrest is independently associated with worse neurologic outcomes and increased mortality. The target is SpO\u2082 92\u201396% — adequate oxygenation without excess. Practically: after ROSC, immediately wean FiO\u2082 from 1.0 to the lowest level maintaining SpO\u2082 target. Check ABG within 15\u201330 minutes and titrate accordingly." },
    ],
    pearls: [
      "TTM2 trial: no difference between 33\u00b0C and 36\u00b0C, but active fever prevention is critical. Fever post-arrest dramatically worsens neurologic outcomes. The take-away: manage temperature actively, the exact target is less important than avoiding hyperthermia",
      "Post-arrest myocardial stunning affects most survivors — global hypokinesis with EF often 20\u201330%. It is REVERSIBLE, typically recovering in 24\u201372 hours with supportive care. Don't prognosticate cardiac function too early",
      "Neuroprognostication should not occur before 72 hours after normothermia. Early withdrawal of care based on exam alone leads to self-fulfilling prophecy. Use multimodal assessment: exam + EEG + SSEP + biomarkers + imaging",
      "Shivering during TTM increases metabolic rate by up to 300%, completely negating the benefit of cooling. Aggressive shivering management is essential \u2014 tiered approach from acetaminophen/buspirone to sedation to NMB",
      "Avoid hyperoxia AND hypocapnia — both cause additional brain injury. Target SpO\u2082 92\u201396% and PaCO\u2082 35\u201345. The post-arrest brain is vulnerable to both ischemia and reperfusion injury"
    ]
  }
];
