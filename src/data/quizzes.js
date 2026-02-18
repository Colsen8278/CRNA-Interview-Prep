// CRNA Interview Prep — Quiz Data

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

export { QUIZZES };
