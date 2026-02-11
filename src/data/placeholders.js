// Placeholder stubs for topics not yet built — each will become full content
// when Chris requests it via the Claude Project chat

export const PHYSIOLOGY_TOPICS = {
  cardio: [
    { id: "frank-starling", name: "Frank-Starling Mechanism", desc: "Preload-contractility relationship, ventricular function curves, clinical shifts" },
    { id: "co-determinants", name: "Cardiac Output Determinants", desc: "HR × SV, preload, afterload, contractility, chronotropy" },
    { id: "hemo-equations", name: "Hemodynamic Equations", desc: "MAP = CO × SVR, CO = HR × SV, clinical application" },
    { id: "cardiac-ap", name: "Cardiac Action Potentials", desc: "SA node automaticity, phases 0–4, ion channels, antiarrhythmic targets" },
    { id: "baroreceptor", name: "Baroreceptor Reflex", desc: "Carotid/aortic arch sensing, vagal and sympathetic responses" },
    { id: "cpp", name: "Coronary Perfusion Pressure", desc: "CPP = AoDBP – LVEDP, diastolic importance, resuscitation relevance" },
  ],
  respiratory: [
    { id: "o2-hb-curve", name: "Oxygen-Hemoglobin Dissociation Curve", desc: "P50, sigmoidal shape, right/left shifts, Bohr effect" },
    { id: "vq-matching", name: "V/Q Matching", desc: "Dead space vs shunt, West zones, positioning effects" },
    { id: "compliance", name: "Compliance & Elastance", desc: "Static vs dynamic, ventilator calculation, clinical changes" },
    { id: "poiseuille", name: "Airway Resistance & Poiseuille's Law", desc: "Radius⁴, ETT size, bronchospasm" },
    { id: "co2-transport", name: "CO₂ Transport", desc: "Dissolved, bicarbonate, carbaminohemoglobin, Haldane effect" },
    { id: "wob", name: "Work of Breathing", desc: "Elastic and resistive components, mechanical ventilation offloading" },
  ],
  neuro: [
    { id: "icp-dynamics", name: "ICP Dynamics", desc: "Monro-Kellie, ICP waveforms (P1/P2/P3), CPP = MAP – ICP, autoregulation" },
    { id: "cbf-autoregulation", name: "Cerebral Blood Flow Autoregulation", desc: "MAP 50–150 plateau, CO₂ reactivity, anesthetic effects" },
    { id: "bbb", name: "Blood-Brain Barrier", desc: "Structure, permeability, drug delivery implications" },
    { id: "pain-pathways", name: "Pain Pathways", desc: "Nociception (transduction, transmission, modulation, perception), analgesic targets" },
  ],
  renal: [
    { id: "nephron", name: "Nephron Function", desc: "GFR, tubular reabsorption/secretion, countercurrent, diuretic targets" },
    { id: "gfr-crcl", name: "GFR & Creatinine Clearance", desc: "Clinical estimation, factors affecting GFR, drug dosing" },
    { id: "acid-base", name: "Acid-Base Regulation", desc: "Renal bicarbonate handling, compensation timelines, Henderson-Hasselbalch" },
    { id: "lytes", name: "Electrolyte Homeostasis", desc: "Na⁺/K⁺/Ca²⁺/Mg²⁺ regulation, RAAS, ICU derangements" },
  ],
};

export const ANESTHESIA_TOPICS = [
  { id: "mac", name: "Minimum Alveolar Concentration (MAC)", desc: "Definition, factors that increase/decrease MAC, MAC variants" },
  { id: "pk-pd", name: "Pharmacokinetics vs Pharmacodynamics", desc: "Vd, clearance, half-life, context-sensitive half-time" },
  { id: "nmj", name: "Neuromuscular Junction", desc: "ACh physiology, depolarizing vs non-depolarizing agents" },
  { id: "mh", name: "Malignant Hyperthermia", desc: "Ryanodine receptor defect, triggering agents, dantrolene" },
  { id: "local-anesthetics", name: "Local Anesthetic Pharmacology", desc: "Na⁺ channel blockade, nerve fiber sensitivity, pKa, LAST" },
  { id: "ans", name: "Autonomic Nervous System", desc: "Sympathetic vs parasympathetic, receptor subtypes, clinical responses" },
  { id: "airway", name: "Airway Management", desc: "Difficult airway algorithm, RSI, LMA vs ETT" },
  { id: "vent-modes", name: "Ventilator Modes", desc: "AC, SIMV, PS, APRV, HFOV — indications and settings" },
  { id: "hemo-monitoring", name: "Hemodynamic Monitoring", desc: "A-lines, CVP, Swan-Ganz, cardiac output methods" },
  { id: "regional", name: "Regional Anesthesia", desc: "Spinal, epidural, nerve blocks — indications and anatomy" },
];

export const ICU_SCENARIOS = [
  { id: "sepsis", name: "Sepsis / Septic Shock", desc: "Surviving Sepsis Campaign guidelines, 1-hour bundle, vasopressor selection" },
  { id: "tbi", name: "Traumatic Brain Injury", desc: "ICP management, herniation signs, osmotic therapy, neuroprotection" },
  { id: "stroke", name: "Acute Ischemic Stroke", desc: "tPA criteria, NIH Stroke Scale, endovascular therapy" },
  { id: "mtp", name: "Massive Transfusion Protocol", desc: "Ratio-based resuscitation, component therapy, TEG/ROTEM" },
  { id: "dka", name: "DKA / HHS", desc: "Insulin protocols, fluid management, electrolyte correction" },
  { id: "se", name: "Status Epilepticus", desc: "Benzodiazepine → levetiracetam/fosphenytoin → propofol/midazolam" },
  { id: "ards", name: "ARDS", desc: "Berlin definition, lung-protective ventilation, prone positioning" },
  { id: "cardiogenic", name: "Cardiogenic Shock", desc: "Inotropes, mechanical support, IABP, Impella" },
  { id: "sci", name: "Spinal Cord Injury", desc: "Neurogenic shock, autonomic dysreflexia, methylprednisolone controversy" },
];

export const BEHAVIORAL_CATEGORIES = [
  { id: "leadership", name: "Leadership & Initiative", icon: "👔", desc: "Times you stepped up, took charge, or drove change" },
  { id: "conflict", name: "Conflict Resolution", icon: "🤝", desc: "Navigating disagreements with colleagues, physicians, or families" },
  { id: "clinical-judgment", name: "Clinical Judgment", icon: "🧠", desc: "Critical thinking under pressure, catching errors, pattern recognition" },
  { id: "why-crna", name: "Why CRNA / Why This Program", icon: "🎯", desc: "Motivation, program-specific fit, career vision" },
  { id: "teamwork", name: "Teamwork & Collaboration", icon: "👥", desc: "Multidisciplinary work, communication, shared goals" },
  { id: "advocacy", name: "Patient Advocacy", icon: "🛡️", desc: "Speaking up for patients, challenging unsafe situations" },
  { id: "failure", name: "Handling Failure or Mistakes", icon: "📈", desc: "Learning from errors, growth mindset, accountability" },
  { id: "ethics", name: "Ethical Dilemmas", icon: "⚖️", desc: "End-of-life, resource allocation, moral distress" },
];

export const QUICK_REFERENCE = [
  { id: "drip-calc", name: "Drip Calculations", icon: "🧮", desc: "Weight-based dosing, mcg/kg/min conversions" },
  { id: "lab-values", name: "Critical Lab Values", icon: "🔬", desc: "Normal ranges and critical thresholds" },
  { id: "gcs", name: "Glasgow Coma Scale", icon: "📊", desc: "Eye, Verbal, Motor scoring" },
  { id: "nihss", name: "NIH Stroke Scale", icon: "🧠", desc: "11-item neurological assessment" },
  { id: "asa", name: "ASA Physical Status", icon: "📋", desc: "Classification I–VI" },
  { id: "mallampati", name: "Mallampati Classification", icon: "👄", desc: "Airway assessment I–IV" },
  { id: "vent-quick", name: "Ventilator Quick Ref", icon: "🫁", desc: "Mode settings, alarm troubleshooting" },
  { id: "hemo-params", name: "Hemodynamic Parameters", icon: "♥", desc: "Normal values and formulas" },
  { id: "abg", name: "ABG Interpretation", icon: "🩸", desc: "Step-by-step acid-base analysis" },
  { id: "lytes-imbalance", name: "Electrolyte Imbalances", icon: "⚡", desc: "Signs, symptoms, and treatment" },
];
