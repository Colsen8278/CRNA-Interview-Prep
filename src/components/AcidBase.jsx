import { useState } from "react";

// ─── Shared mini-components ───────────────────────────────────────────────────
const SH = ({ title, t, children }) => (
  <h2 style={{ color: t.tx, fontSize: "20px", fontWeight: 700, margin: "28px 0 14px", paddingBottom: "8px", borderBottom: `1px solid ${t.bd}` }}>{title}</h2>
);
const Card = ({ t, children, accent, style = {} }) => (
  <div style={{ background: t.bgH, border: `1px solid ${accent ? accent + "50" : t.bd}`, borderLeft: accent ? `4px solid ${accent}` : undefined, borderRadius: "8px", padding: "16px 20px", ...style }}>{children}</div>
);
const Label = ({ t, children }) => (
  <div style={{ fontSize: "11px", color: t.tM, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "3px", fontWeight: 600 }}>{children}</div>
);
const Val = ({ t, children, color }) => (
  <div style={{ fontSize: "15px", color: color || t.tx, fontWeight: 600 }}>{children}</div>
);
const Prose = ({ t, children }) => (
  <p style={{ color: t.t2, lineHeight: 1.8, fontSize: "14px", margin: "0 0 12px 0" }}>{children}</p>
);
const HL = ({ t, children }) => <span style={{ color: t.ac, fontWeight: 700 }}>{children}</span>;

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function OverviewTab({ t }) {
  return (
    <div>
      <SH title="The Henderson-Hasselbalch Equation" t={t} />
      <Card t={t} accent={t.ac}>
        <div style={{ textAlign: "center", padding: "12px 0" }}>
          <div style={{ fontSize: "20px", fontWeight: 700, color: t.ac, letterSpacing: "0.5px", marginBottom: "6px" }}>
            pH = 6.1 + log([HCO₃⁻] / 0.0307 × PaCO₂)
          </div>
          <div style={{ fontSize: "12px", color: t.tM }}>pKa of carbonic acid = 6.1 &nbsp;|&nbsp; CO₂ solubility coefficient = 0.0307 mmol/L/mmHg</div>
        </div>
      </Card>
      <Prose t={t}>The Henderson-Hasselbalch equation governs the relationship between pH, the metabolic component (HCO₃⁻, regulated by the kidneys), and the respiratory component (PaCO₂, regulated by the lungs). At physiologic pH, the bicarbonate buffer system operates in its most efficient range. The key clinical insight is that pH is determined by the <HL t={t}>ratio</HL> of HCO₃⁻ to PaCO₂, not the absolute values — which is why compensation works.</Prose>

      <SH title="Normal ABG Values" t={t} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
        {[
          { label: "pH", value: "7.35 – 7.45", sub: "Arterial; critical: <7.2 or >7.6" },
          { label: "PaCO₂", value: "35 – 45 mmHg", sub: "Respiratory axis; lung-controlled" },
          { label: "HCO₃⁻", value: "22 – 26 mEq/L", sub: "Metabolic axis; kidney-controlled" },
          { label: "PaO₂", value: "80 – 100 mmHg", sub: "Oxygenation; drops with age" },
          { label: "Base Excess", value: "-2 to +2 mEq/L", sub: "Metabolic deviation from normal" },
          { label: "SaO₂", value: "> 95%", sub: "Hemoglobin saturation" },
        ].map(n => (
          <Card t={t} key={n.label}>
            <Label t={t}>{n.label}</Label>
            <Val t={t} color={t.ac}>{n.value}</Val>
            <div style={{ fontSize: "11px", color: t.tM, marginTop: "3px" }}>{n.sub}</div>
          </Card>
        ))}
      </div>

      <SH title="Buffer Systems" t={t} />
      <Prose t={t}>The body uses three major buffer systems in series. They act in different time frames and with different capacities. Understanding their interplay is essential for predicting compensation and recognizing mixed disorders.</Prose>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          {
            name: "Bicarbonate Buffer System (HCO₃⁻/CO₂)",
            time: "Seconds to minutes",
            color: t.ac,
            desc: "Most important extracellular buffer. CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻. The lungs rapidly adjust PaCO₂ (respiratory response) and the kidneys slowly adjust HCO₃⁻ (metabolic response). This system can be assessed on every ABG.",
          },
          {
            name: "Protein Buffer System (Hemoglobin, Albumin)",
            time: "Minutes",
            color: t.bl,
            desc: "Intracellular buffers. Histidine residues on hemoglobin (particularly deoxyhemoglobin) and albumin accept or donate H⁺. Hemoglobin is the dominant intracellular buffer — explains why anemia blunts the body's buffering capacity. Haldane effect: deoxyhemoglobin is a better H⁺ acceptor, linking oxygen delivery to acid-base handling.",
          },
          {
            name: "Phosphate Buffer System (H₂PO₄⁻/HPO₄²⁻)",
            time: "Minutes to hours",
            color: t.pr,
            desc: "Most important intracellular and urinary buffer. pKa 6.8 makes it highly effective at physiologic pH. In the kidneys, phosphate is filtered, binds H⁺ in the tubular lumen, and is excreted as titratable acid — this is how the kidney excretes fixed acid loads. Clinically relevant in renal failure (phosphate accumulation drives metabolic acidosis).",
          },
        ].map(b => (
          <Card t={t} key={b.name} accent={b.color}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div style={{ fontSize: "15px", fontWeight: 700, color: b.color }}>{b.name}</div>
              <span style={{ fontSize: "11px", background: b.color + "20", color: b.color, padding: "2px 8px", borderRadius: "10px", whiteSpace: "nowrap" }}>{b.time}</span>
            </div>
            <Prose t={t}>{b.desc}</Prose>
          </Card>
        ))}
      </div>

      <SH title="Anion Gap" t={t} />
      <Card t={t} accent={t.wn}>
        <div style={{ fontSize: "17px", fontWeight: 700, color: t.wn, marginBottom: "6px" }}>AG = Na⁺ − (Cl⁻ + HCO₃⁻) &nbsp;|&nbsp; Normal: 8–12 mEq/L (albumin-corrected: + 2.5 × [4.0 − albumin])</div>
        <Prose t={t}>The anion gap represents unmeasured anions (primarily albumin, phosphate, sulfate, and organic acids). An elevated AG identifies the presence of a strong acid — the H⁺ was buffered by HCO₃⁻, consuming it and widening the gap. Normal AG acidosis means HCO₃⁻ is being lost directly (diarrhea, renal tubular acidosis, fistulas) and Cl⁻ replaces it (hyperchloremic acidosis).</Prose>
        <div style={{ marginTop: "10px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: t.tx, marginBottom: "6px" }}>MUDPILES — Elevated Anion Gap Causes</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {["Methanol","Uremia","DKA / Alcoholic KA","Propylene glycol / Paracetamol","Isoniazid / Iron / Inborn errors","Lactic acidosis","Ethylene glycol","Salicylates"].map(x => (
              <span key={x} style={{ fontSize: "12px", padding: "3px 10px", background: t.wn + "18", color: t.wn, borderRadius: "20px", border: `1px solid ${t.wn}40` }}>{x}</span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "10px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: t.tx, marginBottom: "6px" }}>HARDASS — Normal Anion Gap (Hyperchloremic) Acidosis Causes</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {["Hyperalimentation","Acetazolamide","Renal tubular acidosis","Diarrhea","Adrenal insufficiency","Spironolactone","Saline excess (dilutional)"].map(x => (
              <span key={x} style={{ fontSize: "12px", padding: "3px 10px", background: t.bl + "18", color: t.bl, borderRadius: "20px", border: `1px solid ${t.bl}40` }}>{x}</span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Tab: Stepwise Interpretation ─────────────────────────────────────────────
function StepsTab({ t }) {
  const steps = [
    {
      n: 1, title: "Is the pH acidemic or alkalemic?",
      color: t.ac,
      content: "pH < 7.35 → Acidemia. pH > 7.45 → Alkalemia. pH 7.35–7.45 → Normal (but may have compensated or mixed disorder — continue the analysis). Rule: the primary disorder determines the pH direction. Always state the primary process first.",
    },
    {
      n: 2, title: "Is the primary process metabolic or respiratory?",
      color: t.bl,
      content: "Look at PaCO₂ and HCO₃⁻. If pH is low (acidemia): PaCO₂ ↑ = respiratory acidosis; HCO₃⁻ ↓ = metabolic acidosis. If pH is high (alkalemia): PaCO₂ ↓ = respiratory alkalosis; HCO₃⁻ ↑ = metabolic alkalosis. If both are abnormal in the same direction, suspect a mixed disorder.",
    },
    {
      n: 3, title: "Is compensation appropriate?",
      color: t.pr,
      content: "Compensation never fully corrects the pH — it only partially restores it. If compensation is greater or lesser than expected, suspect a second primary process.",
      formulas: [
        { name: "Metabolic Acidosis", formula: "Expected PaCO₂ = (1.5 × HCO₃⁻) + 8 ± 2", alt: "Winter's Formula — also: PaCO₂ ≈ last two digits of pH" },
        { name: "Metabolic Alkalosis", formula: "Expected PaCO₂ = (0.7 × HCO₃⁻) + 21 ± 2", alt: "Lungs hypoventilate to retain CO₂ (limited by hypoxia drive)" },
        { name: "Respiratory Acidosis (Acute)", formula: "Expected HCO₃⁻ = 24 + [(PaCO₂ − 40) × 0.1]", alt: "Acute: 1 mEq/L rise per 10 mmHg CO₂" },
        { name: "Respiratory Acidosis (Chronic)", formula: "Expected HCO₃⁻ = 24 + [(PaCO₂ − 40) × 0.35]", alt: "Chronic: 3.5 mEq/L rise per 10 mmHg CO₂ (renal compensation takes 3–5 days)" },
        { name: "Respiratory Alkalosis (Acute)", formula: "Expected HCO₃⁻ = 24 − [(40 − PaCO₂) × 0.2]", alt: "Acute: 2 mEq/L fall per 10 mmHg CO₂" },
        { name: "Respiratory Alkalosis (Chronic)", formula: "Expected HCO₃⁻ = 24 − [(40 − PaCO₂) × 0.5]", alt: "Chronic: 5 mEq/L fall per 10 mmHg CO₂" },
      ],
    },
    {
      n: 4, title: "If metabolic acidosis: calculate the anion gap",
      color: t.wn,
      content: "AG = Na⁺ − (Cl⁻ + HCO₃⁻). Normal 8–12 mEq/L. Correct for albumin: add 2.5 mEq/L per 1 g/dL albumin below 4.0 (critical in ICU patients — low albumin masks an elevated AG).",
    },
    {
      n: 5, title: "If AG is elevated: calculate the delta-delta ratio",
      color: t.pk,
      content: "Delta-delta = (AG − 12) / (24 − HCO₃⁻). This compares the rise in AG to the fall in HCO₃⁻. Ratio 1–2: pure HAGMA. Ratio < 1: concurrent normal-AG acidosis (e.g., diarrhea + DKA). Ratio > 2: concurrent metabolic alkalosis hiding behind the HAGMA (e.g., vomiting + lactic acidosis in septic shock).",
    },
    {
      n: 6, title: "Assess oxygenation: calculate the A-a gradient",
      color: t.ok,
      content: "A-a gradient = PAO₂ − PaO₂, where PAO₂ = (FiO₂ × 713) − (PaCO₂ / 0.8). Normal: < Age/4 + 4 mmHg (roughly 5–15 mmHg on room air). Elevated A-a gradient suggests V/Q mismatch, shunt, or diffusion impairment. Normal A-a gradient with low PaO₂ = hypoventilation or high altitude.",
    },
  ];

  return (
    <div>
      <SH title="Six-Step ABG Interpretation Framework" t={t} />
      <Prose t={t}>A systematic approach prevents errors and ensures mixed disorders are not missed. Work through all six steps on every ABG, even when the answer seems obvious from step one.</Prose>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {steps.map(s => (
          <Card t={t} key={s.n} accent={s.color}>
            <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ minWidth: "36px", height: "36px", borderRadius: "50%", background: s.color + "20", border: `2px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: s.color, fontSize: "16px", flexShrink: 0 }}>{s.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: s.color, marginBottom: "6px" }}>{s.title}</div>
                <Prose t={t}>{s.content}</Prose>
                {s.formulas && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "8px" }}>
                    {s.formulas.map(f => (
                      <div key={f.name} style={{ background: t.bgC, borderRadius: "6px", padding: "10px 14px", border: `1px solid ${t.bd}` }}>
                        <div style={{ fontSize: "12px", color: t.tM, marginBottom: "3px" }}>{f.name}</div>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: t.ac, fontFamily: "monospace" }}>{f.formula}</div>
                        <div style={{ fontSize: "12px", color: t.t2, marginTop: "3px" }}>{f.alt}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: The Four Disorders ───────────────────────────────────────────────────
function DisordersTab({ t }) {
  const disorders = [
    {
      id: "meta-acid",
      name: "Metabolic Acidosis",
      color: t.dg,
      primary: "HCO₃⁻ ↓",
      comp: "PaCO₂ ↓ (reflex hyperventilation via Kussmaul breathing)",
      ph: "↓ (< 7.35)",
      physiology: "A gain of fixed acid (H⁺) consumes HCO₃⁻ (buffering), or direct loss of HCO₃⁻ from the GI tract or kidneys. The chemoreceptors sense the pH drop and drive respiratory rate up, lowering PaCO₂ to partially restore the ratio. Compensation is rapid (minutes to hours) but incomplete. Full correction requires renal regeneration of HCO₃⁻, which takes days.",
      causes: {
        "Elevated AG": ["Lactic acidosis (hypoperfusion, metformin, seizures)", "DKA / alcoholic KA", "Uremia (phosphates, sulfates)", "Salicylate toxicity", "Methanol / ethylene glycol", "Propofol infusion syndrome (PRIS)"],
        "Normal AG": ["Diarrhea (HCO₃⁻ loss)", "Renal tubular acidosis (Type I, II, IV)", "Excessive normal saline (hyperchloremic)", "Adrenal insufficiency", "Ureterosigmoidostomy"],
      },
      clinical: "Cardiac dysrhythmias at pH < 7.20. Myocardial depression, reduced response to catecholamines. CNS depression with severe acidemia. Hyperkalemia (H⁺/K⁺ exchange: for every 0.1 pH unit drop, K⁺ rises ~0.6 mEq/L). Kussmaul breathing is the body's attempt at compensation.",
    },
    {
      id: "meta-alk",
      name: "Metabolic Alkalosis",
      color: t.ok,
      primary: "HCO₃⁻ ↑",
      comp: "PaCO₂ ↑ (hypoventilation) — limited by hypoxic drive",
      ph: "↑ (> 7.45)",
      physiology: "Requires both a generation phase (gain of HCO₃⁻ or loss of H⁺) and a maintenance phase (impaired renal excretion of HCO₃⁻). The kidneys can normally excrete excess HCO₃⁻ rapidly — so a sustained alkalosis implies something is preventing this (volume depletion with secondary hyperaldosteronism, Cl⁻ depletion, K⁺ depletion, or high mineralocorticoid states). Respiratory compensation is hypoventilation, but PaO₂ limits how high PaCO₂ can rise — maximum compensation is typically PaCO₂ ~ 55 mmHg.",
      causes: {
        "H⁺ Loss": ["Vomiting / NG suction (HCl loss)", "Diuretics (loop + thiazide — Cl⁻ and H⁺ loss)", "Hyperaldosteronism (primary or secondary)"],
        "HCO₃⁻ Gain": ["Overzealous NaHCO₃ administration", "Massive blood transfusion (citrate → HCO₃⁻)", "Antacid overuse", "Milk-alkali syndrome"],
        "Contraction Alkalosis": ["Diuretics, dehydration — extracellular fluid contracts around fixed HCO₃⁻ pool"],
      },
      clinical: "Hypokalemia (K⁺/H⁺ exchange), hypocalcemia (ionized Ca²⁺ decreases with alkalemia — tetany risk), left shift of O₂-Hb curve (↓ O₂ delivery). Cardiac dysrhythmias with severe alkalemia (pH > 7.60). Seizures possible.",
    },
    {
      id: "resp-acid",
      name: "Respiratory Acidosis",
      color: t.wn,
      primary: "PaCO₂ ↑",
      comp: "HCO₃⁻ ↑ — acute: 1 mEq/L per 10 mmHg; chronic: 3.5 mEq/L per 10 mmHg",
      ph: "↓ (< 7.35)",
      physiology: "Caused by any failure of alveolar ventilation — the CO₂ produced by metabolism cannot be excreted. CO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻, so CO₂ accumulation directly generates H⁺. Acute compensation is purely chemical (protein/hemoglobin buffering), producing only a small rise in HCO₃⁻. Chronic compensation involves renal H⁺ excretion and HCO₃⁻ regeneration over 3–5 days, producing a larger rise. The distinction between acute and chronic is critical for identifying superimposed acute events.",
      causes: {
        "CNS Depression": ["Opioids, benzodiazepines, general anesthetics", "Brainstem stroke or injury", "Sleep apnea", "Opioid residual after anesthesia"],
        "Airway/Lung": ["Severe COPD exacerbation", "Status asthmaticus", "Severe pneumonia", "ARDS with permissive hypercapnia", "Pneumothorax", "Foreign body obstruction"],
        "Neuromuscular": ["Residual NMB (common perioperative cause)", "Myasthenia gravis", "Guillain-Barré", "High cervical spinal cord injury", "Phrenic nerve injury after cardiac surgery"],
        "Mechanical": ["Inadequate ventilation settings (low RR or TV)", "Large dead space (PE, COPD)", "Mainstem intubation"],
      },
      clinical: "Sympathetic stimulation (tachycardia, hypertension) early — catecholamine surge from rising CO₂. Vasodilation of cerebral vessels (↑ ICP — critical in neuro patients). Pulmonary vasoconstriction. CNS depression progressing to narcosis with extreme hypercapnia (PaCO₂ > 80–100 mmHg). Hyperkalemia (K⁺/H⁺ exchange). Right shift of O₂-Hb curve (Bohr effect — favors O₂ offloading).",
    },
    {
      id: "resp-alk",
      name: "Respiratory Alkalosis",
      color: t.bl,
      primary: "PaCO₂ ↓",
      comp: "HCO₃⁻ ↓ — acute: 2 mEq/L per 10 mmHg; chronic: 5 mEq/L per 10 mmHg",
      ph: "↑ (> 7.45)",
      physiology: "Alveolar ventilation exceeds CO₂ production. As CO₂ is blown off, H⁺ production falls, and the equilibrium H₂CO₃ ⇌ H⁺ + HCO₃⁻ shifts left, consuming HCO₃⁻. Cerebral vasoconstriction from hypocapnia reduces CBF — responsible for the lightheadedness, paresthesias, and syncope of hyperventilation syndrome. Acute compensation is buffering only; chronic renal compensation reduces HCO₃⁻ reabsorption over days.",
      causes: {
        "Hypoxia-Driven": ["High altitude", "Severe anemia", "Early ARDS / pulmonary edema (hypoxia stimulates ventilation before CO₂ rises)", "PE (early — dead space + anxiety drive hyperventilation)"],
        "CNS/Stimulus": ["Pain, anxiety, hyperventilation syndrome", "CNS injury (brainstem stimulation)", "Salicylate toxicity (direct respiratory center stimulation — mixed disorder)", "Sepsis (early — cytokine-driven hyperventilation precedes lactic acidosis)"],
        "Iatrogenic": ["Excessive mechanical ventilation", "Over-assisted pressure support", "Aggressive manual ventilation during resuscitation"],
        "Other": ["Pregnancy (progesterone stimulates ventilation)", "Hepatic failure (ammonia stimulates brainstem)", "Fever, pain"],
      },
      clinical: "Decreased ionized Ca²⁺ (alkalemia increases albumin binding) — paresthesias, perioral numbness, Chvostek/Trousseau signs, carpopedal spasm. Cerebral vasoconstriction (↓ CBF). Hypokalemia. Left shift of O₂-Hb curve (↑ Hb-O₂ affinity → impaired tissue O₂ delivery). Dysrhythmias with severe alkalemia.",
    },
  ];

  const [open, setOpen] = useState("meta-acid");

  return (
    <div>
      <SH title="The Four Primary Acid-Base Disorders" t={t} />
      <Prose t={t}>Each disorder has a primary disturbance and a predictable compensatory response. Compensation is always in the same direction as the primary change — it partially restores pH but never fully corrects it. When pH is normal with abnormal PaCO₂ and HCO₃⁻, think compensation or mixed disorder.</Prose>

      {/* Summary grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        {disorders.map(d => (
          <button key={d.id} onClick={() => setOpen(d.id)} style={{ background: open === d.id ? d.color + "18" : t.bgH, border: `2px solid ${open === d.id ? d.color : t.bd}`, borderRadius: "8px", padding: "14px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: d.color, marginBottom: "4px" }}>{d.name}</div>
            <div style={{ fontSize: "12px", color: t.t2 }}>Primary: {d.primary}</div>
            <div style={{ fontSize: "12px", color: t.tM }}>pH: {d.ph}</div>
          </button>
        ))}
      </div>

      {/* Expanded detail */}
      {disorders.filter(d => d.id === open).map(d => (
        <div key={d.id}>
          <Card t={t} accent={d.color}>
            <div style={{ fontSize: "17px", fontWeight: 700, color: d.color, marginBottom: "12px" }}>{d.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "14px" }}>
              <div><Label t={t}>Primary Disturbance</Label><Val t={t} color={d.color}>{d.primary}</Val></div>
              <div><Label t={t}>pH</Label><Val t={t} color={d.color}>{d.ph}</Val></div>
              <div><Label t={t}>Compensation</Label><Val t={t}>{d.comp}</Val></div>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: t.tx, marginBottom: "6px" }}>Pathophysiology</div>
              <Prose t={t}>{d.physiology}</Prose>
            </div>

            <div style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: t.tx, marginBottom: "8px" }}>Causes</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {Object.entries(d.causes).map(([cat, list]) => (
                  <div key={cat} style={{ background: t.bgC, borderRadius: "6px", padding: "10px 14px", border: `1px solid ${t.bd}` }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: d.color, marginBottom: "5px" }}>{cat}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {list.map(x => <span key={x} style={{ fontSize: "12px", color: t.t2, background: t.bgH, padding: "2px 8px", borderRadius: "4px", border: `1px solid ${t.bd}` }}>{x}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: t.tx, marginBottom: "6px" }}>Clinical Consequences</div>
              <Prose t={t}>{d.clinical}</Prose>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}

// ─── Tab: Anesthesia Management ────────────────────────────────────────────────
function AnesthesiaTab({ t }) {
  const sections = [
    {
      title: "Metabolic Acidosis — Anesthesia Considerations",
      color: t.dg,
      points: [
        {
          heading: "Preoperative: When is it safe to proceed?",
          text: "pH > 7.20 is a widely cited threshold for elective cases — below this, myocardial depression and catecholamine refractoriness become clinically significant. Emergency cases may proceed at lower pH with active correction underway. Identify and treat the cause: volume resuscitation for lactic acidosis, insulin/fluids for DKA, dialysis for uremic acidosis.",
        },
        {
          heading: "Intubation Hazard: Do not lose the respiratory compensation",
          text: "A spontaneously breathing patient with severe metabolic acidosis may have a PaCO₂ of 20–25 mmHg (Kussmaul compensation). If you induce apnea and cannot immediately match that minute ventilation, CO₂ rises and pH plummets further. Have the ventilator set to high RR/TV before induction. Communicate this explicitly to whoever is bagging during the apneic period. This is a classic cause of cardiac arrest at induction in DKA patients.",
        },
        {
          heading: "Sodium Bicarbonate — Indications and Pitfalls",
          text: "NaHCO₃ is not reflexively given for metabolic acidosis. Indications: severe acidemia (pH < 7.10–7.15) threatening hemodynamic instability, hyperkalemia-induced dysrhythmias, tricyclic antidepressant toxicity (sodium load, alkalinization), and RTA. Risks: paradoxical intracellular/CSF acidosis (CO₂ crosses cell membranes faster than HCO₃⁻), hypernatremia, volume overload, overshoot alkalosis, left shift of O₂-Hb curve. For lactic acidosis specifically, NaHCO₃ does not improve outcomes — fix the source (perfusion, oxygenation).",
        },
        {
          heading: "Drug Effects of Acidemia",
          text: "Reduced protein binding of acidic drugs (more free drug → enhanced effect at lower doses). Catecholamine pressor response is blunted — may require vasopressin or higher norepinephrine doses. NMB duration can be prolonged (acidosis impairs reversal with neostigmine and may alter Hofmann elimination kinetics). Propofol is hemodynamically more dangerous. Volatile agent MAC is decreased (acidosis depresses CNS).",
        },
        {
          heading: "Perioperative Lactic Acidosis",
          text: "Type A (hypoperfusion): fix the cardiac output, hemoglobin, perfusion pressure. Type B (metabolic, toxin): stop offending agent (metformin, propofol infusion at high dose/duration — think PRIS). Propofol infusion syndrome: metabolic acidosis + rising lactate + rhabdomyolysis + renal failure → stop propofol immediately, switch sedation, supportive care. Recognize PRIS pattern on ABG: widening AG + rising lactate despite adequate perfusion.",
        },
      ],
    },
    {
      title: "Metabolic Alkalosis — Anesthesia Considerations",
      color: t.ok,
      points: [
        {
          heading: "Preoperative Correction",
          text: "Moderate alkalemia (pH 7.50–7.55) is usually well tolerated intraoperatively. Severe alkalemia (pH > 7.60) warrants correction before elective surgery — ionized hypocalcemia risks dysrhythmias and laryngospasm, and hypokalemia risks muscle weakness and arrhythmias. For vomiting/NG-suction patients: normal saline + KCl. For diuretic-related: hold diuretic, replace Cl⁻ and K⁺.",
        },
        {
          heading: "Ventilator Strategy — Do NOT Correct with Hyperventilation",
          text: "The compensatory hypoventilation must be preserved or matched. If a patient with metabolic alkalosis arrives intubated with PaCO₂ of 55 mmHg (appropriate compensation) and you normalize their ventilation to PaCO₂ 40 mmHg, you have acutely alkalinized them further. Set ventilator to match the pre-existing PaCO₂. Allow permissive hypercapnia in the chronically alkalotic patient.",
        },
        {
          heading: "Potassium and Calcium",
          text: "Check and replace K⁺ and ionized Ca²⁺ before and during anesthesia. Hypokalemia increases sensitivity to non-depolarizing NMBs (may delay reversal) and predisposes to dysrhythmias, particularly in the context of volatile agents and hypercapnia. Ionized hypocalcemia (alkalemia increases albumin-Ca²⁺ binding) lowers seizure threshold and can cause tetany on emergence.",
        },
        {
          heading: "Massive Transfusion and Citrate-Induced Alkalosis",
          text: "Citrate in blood products is metabolized to bicarbonate (1 mmol citrate → 3 mmol HCO₃⁻). Massive transfusion can produce post-transfusion metabolic alkalosis, especially in the presence of renal dysfunction. Monitor pH, K⁺, and ionized Ca²⁺ throughout massive transfusion. Hypocalcemia from citrate chelation is the more immediate threat — calcium chloride (preferred over calcium gluconate in hemodynamic compromise) at 1g IV for every 4 units of PRBCs is a reasonable guideline.",
        },
        {
          heading: "Acetazolamide",
          text: "Carbonic anhydrase inhibitor — blocks proximal tubular HCO₃⁻ reabsorption and increases renal HCO₃⁻ excretion. Useful for treating metabolic alkalosis perioperatively, particularly post-cardiac surgery or diuretic-induced. Dose: 250–500 mg IV. Also used to wean ventilator-dependent patients with chronic respiratory acidosis who develop metabolic compensation.",
        },
      ],
    },
    {
      title: "Respiratory Acidosis — Anesthesia Considerations",
      color: t.wn,
      points: [
        {
          heading: "Intraoperative Causes and Recognition",
          text: "Every intraoperative respiratory acidosis has a cause. Differential: mainstem intubation (unilateral breath sounds, asymmetric capnography), inadvertent extubation or tube dislodgment, circuit disconnect, partial obstruction (secretions, biting, tube kink), inadequate ventilator settings (RR/TV too low for body size or CO₂ production), high dead space (PE, COPD exacerbation), pneumothorax (reduced compliance + hypoxia), residual NMB preventing spontaneous respiratory effort, or excessive CO₂ production (MH, thyroid storm, fever, laparoscopic insufflation).",
        },
        {
          heading: "Permissive Hypercapnia in ARDS",
          text: "Lung-protective ventilation (TV 6 mL/kg IBW, plateau pressure < 30 cmH₂O) intentionally allows PaCO₂ to rise. Target pH > 7.25, allowing PaCO₂ 50–70 mmHg (or higher in severe cases). Contraindicated with elevated ICP (hypercapnia vasodilates cerebral vessels, worsens ICP), right heart failure (pulmonary vasoconstriction from hypercapnia and acidosis), and severe pulmonary hypertension. Buffering with NaHCO₃ can maintain pH while tolerating higher CO₂.",
        },
        {
          heading: "COPD Patient — Chronic Respiratory Acidosis",
          text: "Know the patient's baseline PaCO₂ (often 50–60 mmHg with compensated HCO₃⁻ 30–35 mEq/L). Do not target a 'normal' PaCO₂ of 40 mmHg — this will produce acute alkalemia relative to their chronic compensation, suppress their respiratory drive, and may precipitate apnea at extubation. Target near their baseline. Avoid high FiO₂ (may suppress hypoxic drive in CO₂ retainers). High-flow nasal cannula at lowest FiO₂ to maintain SpO₂ 88–92%.",
        },
        {
          heading: "Laparoscopic CO₂ Insufflation",
          text: "CO₂ peritoneum: PaCO₂ rises 3–8 mmHg above baseline, more with prolonged cases, Trendelenburg, or subcutaneous emphysema tracking up mediastinum. Increase minute ventilation by ~15–20% preemptively. Watch for subcutaneous emphysema (crepitus on palpation) — if it tracks to the face/neck, PaCO₂ can rise dramatically. Monitor end-tidal CO₂ continuously; if ETCO₂–PaCO₂ gradient widens unexpectedly, get ABG (may indicate new PE or pulmonary problem, not just CO₂ absorption).",
        },
        {
          heading: "Residual NMB at Extubation",
          text: "The single most preventable cause of postoperative respiratory acidosis. TOF ratio < 0.9 at extubation: at risk. Clinical signs of residual block (head-lift < 5 sec, tongue depressor test) are insensitive below TOF ratio 0.7. Sugammadex (for rocuronium/vecuronium) is definitive reversal regardless of TOF ratio. Neostigmine is unreliable at deep block (TOF count < 2). If post-extubation CO₂ retention is suspected: re-administer reversal, supplemental O₂, NIPPV bridge.",
        },
      ],
    },
    {
      title: "Respiratory Alkalosis — Anesthesia Considerations",
      color: t.bl,
      points: [
        {
          heading: "Intraoperative Iatrogenic Alkalosis",
          text: "The most common cause is over-ventilation — particularly after tracheal intubation when many providers increase MV relative to the patient's actual needs. Effects: cerebral vasoconstriction (↓ CBF — concerning in vascular and neuro cases), ionized hypocalcemia (predisposes to dysrhythmias and laryngospasm), coronary vasoconstriction, hypokalemia, and left-shift of O₂-Hb curve impairing tissue O₂ delivery. Target ETCO₂ 35–40 mmHg routinely; lower in deliberate hyperventilation for ICP control.",
        },
        {
          heading: "Deliberate Hyperventilation for ICP Control",
          text: "Hyperventilation (PaCO₂ 30–35 mmHg) reduces PaCO₂, causing cerebral vasoconstriction and rapid decrease in ICP. Onset within minutes; effect sustained for 30–60 minutes before vascular autoregulation adapts. Reserve for acute herniation or ICP crisis as a temporizing bridge — prolonged hyperventilation causes rebound cerebral vasodilation and can worsen ischemia. Do not target PaCO₂ < 30 mmHg (risk of critical cerebral ischemia). Coordinate with neurosurgical team on timing.",
        },
        {
          heading: "Pain and Anxiety-Driven Hyperventilation",
          text: "Inadequate analgesia postoperatively drives hyperventilation → respiratory alkalosis → ionized hypocalcemia → anxiety and paresthesias → more hyperventilation (positive feedback loop). Treat the pain first. For refractory hyperventilation syndrome without pain, consider anxiolytics (midazolam) or rebreathing (though rebreathing circuits are no longer recommended clinically — respiratory coaching is preferred).",
        },
        {
          heading: "Early Sepsis",
          text: "Respiratory alkalosis is often the first ABG sign of early sepsis — cytokines and endotoxin directly stimulate the respiratory center before lactic acidosis develops. A previously normal-appearing patient with unexplained respiratory alkalosis (PaCO₂ < 35, pH > 7.45) should prompt a sepsis workup, particularly if combined with fever or leukocytosis. As sepsis progresses: respiratory alkalosis → mixed respiratory alkalosis/metabolic acidosis → dominant metabolic acidosis with elevated lactate.",
        },
        {
          heading: "Pregnancy",
          text: "Normal pregnancy produces chronic respiratory alkalosis: PaCO₂ 28–32 mmHg, HCO₃⁻ 18–21 mEq/L, pH 7.40–7.45 (renal compensation). Progesterone stimulates the respiratory center. This is the baseline to interpret ABGs in obstetric anesthesia. A PaCO₂ of 40 mmHg in a term pregnant patient is actually relative respiratory acidosis — her normal is ~30 mmHg. Similarly, HCO₃⁻ of 24 is 'normal' on a standard reference but represents metabolic alkalosis relative to her compensated state.",
        },
      ],
    },
    {
      title: "Mixed Disorders — Recognition and Management",
      color: t.pr,
      points: [
        {
          heading: "When to Suspect a Mixed Disorder",
          text: "Suspect mixed disorder when: (1) pH is normal but PaCO₂ and HCO₃⁻ are both abnormal in opposite directions — compensation would move them in the same direction. (2) Compensation exceeds or falls short of predicted formulas. (3) The clinical picture doesn't match a single disorder. (4) Delta-delta ratio falls outside 1–2 range.",
        },
        {
          heading: "Classic Mixed Patterns in ICU/Perioperative Settings",
          text: "Respiratory acidosis + metabolic alkalosis: COPD patient on diuretics — retained CO₂ (lung disease) + diuretic-induced HCO₃⁻ excess. pH may be near-normal but both components are grossly abnormal. Respiratory acidosis + metabolic acidosis: cardiorespiratory arrest — CO₂ retention (ventilation failure) + lactic acidosis (perfusion failure). Most severe pH derangement, double hit. Respiratory alkalosis + metabolic acidosis: septic shock early phase — respiratory alkalosis from cytokine-driven hyperventilation + developing lactic acidosis. Very common in ICU patients.",
        },
        {
          heading: "Triple Disorders",
          text: "Possible when a mixed metabolic disorder (elevated AG + normal AG) underlies a respiratory abnormality. Example: patient with DKA (HAGMA), vomiting (concurrent metabolic alkalosis partially neutralizing HCO₃⁻ drop — delta-delta > 2), and aspiration pneumonitis (respiratory acidosis). The pH and HCO₃⁻ may appear deceptively mild while three active processes are occurring. Delta-delta calculation + compensation check + clinical context unmask this.",
        },
      ],
    },
  ];

  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div>
      <SH title="Anesthesia Management by Disorder" t={t} />
      <Prose t={t}>Acid-base disorders are not just interpreted — they are actively managed in anesthesia. Each disorder carries specific perioperative implications for induction, ventilation strategy, drug pharmacology, and emergence. This is a high-yield interview domain.</Prose>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sections.map((s, i) => (
          <div key={s.title}>
            <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} style={{ width: "100%", background: openIdx === i ? s.color + "15" : t.bgH, border: `2px solid ${openIdx === i ? s.color : t.bd}`, borderRadius: "8px", padding: "14px 18px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.15s" }}>
              <span style={{ fontSize: "15px", fontWeight: 700, color: s.color }}>{s.title}</span>
              <span style={{ color: t.tM, fontSize: "18px" }}>{openIdx === i ? "▲" : "▼"}</span>
            </button>
            {openIdx === i && (
              <div style={{ background: t.bgC, border: `1px solid ${t.bd}`, borderTop: "none", borderRadius: "0 0 8px 8px", padding: "16px 20px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {s.points.map(p => (
                    <div key={p.heading} style={{ borderLeft: `3px solid ${s.color}`, paddingLeft: "14px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: s.color, marginBottom: "5px" }}>{p.heading}</div>
                      <Prose t={t}>{p.text}</Prose>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Interactive ABG Analyzer ────────────────────────────────────────────
function AnalyzerTab({ t }) {
  const [vals, setVals] = useState({ ph: "", pco2: "", hco3: "", po2: "", na: "", cl: "", alb: "" });
  const [result, setResult] = useState(null);

  const set = (k, v) => setVals(prev => ({ ...prev, [k]: v }));

  const analyze = () => {
    const ph = parseFloat(vals.ph);
    const pco2 = parseFloat(vals.pco2);
    const hco3 = parseFloat(vals.hco3);
    const po2 = parseFloat(vals.po2);
    const na = parseFloat(vals.na);
    const cl = parseFloat(vals.cl);
    const alb = parseFloat(vals.alb);

    if (isNaN(ph) || isNaN(pco2) || isNaN(hco3)) {
      setResult({ error: "Enter at least pH, PaCO₂, and HCO₃⁻ to interpret." });
      return;
    }

    const findings = [];
    const warnings = [];

    // Step 1: pH
    let phStatus, primaryProcess;
    if (ph < 7.35) { phStatus = "Acidemia"; findings.push({ label: "pH Status", value: `${ph} — Acidemia`, color: t.dg }); }
    else if (ph > 7.45) { phStatus = "Alkalemia"; findings.push({ label: "pH Status", value: `${ph} — Alkalemia`, color: t.ok }); }
    else { phStatus = "Normal pH"; findings.push({ label: "pH Status", value: `${ph} — Normal (7.35–7.45)`, color: t.ac }); }

    if (ph < 7.20) warnings.push("Critical acidemia (pH < 7.20) — myocardial depression, catecholamine refractoriness, induction hazard");
    if (ph > 7.60) warnings.push("Critical alkalemia (pH > 7.60) — dysrhythmia risk, tetany, ionized hypocalcemia");

    // Step 2: Primary process
    const primaryDisorders = [];
    const metaAcid = hco3 < 22;
    const metaAlk = hco3 > 26;
    const respAcid = pco2 > 45;
    const respAlk = pco2 < 35;

    if (ph < 7.35) {
      if (pco2 > 45 && hco3 < 22) primaryDisorders.push("Mixed Respiratory Acidosis + Metabolic Acidosis");
      else if (pco2 > 45) primaryDisorders.push("Respiratory Acidosis");
      else if (hco3 < 22) primaryDisorders.push("Metabolic Acidosis");
      else primaryDisorders.push("Acidemia of unclear origin — review values");
    } else if (ph > 7.45) {
      if (pco2 < 35 && hco3 > 26) primaryDisorders.push("Mixed Respiratory Alkalosis + Metabolic Alkalosis");
      else if (pco2 < 35) primaryDisorders.push("Respiratory Alkalosis");
      else if (hco3 > 26) primaryDisorders.push("Metabolic Alkalosis");
      else primaryDisorders.push("Alkalemia of unclear origin — review values");
    } else {
      if (pco2 > 45 && hco3 > 26) primaryDisorders.push("Compensated Respiratory Acidosis (or Mixed Resp Acidosis + Metabolic Alkalosis)");
      else if (pco2 < 35 && hco3 < 22) primaryDisorders.push("Compensated Respiratory Alkalosis (or Mixed Resp Alkalosis + Metabolic Acidosis)");
      else if (pco2 > 45) primaryDisorders.push("Possible Compensated Respiratory Acidosis");
      else if (hco3 < 22) primaryDisorders.push("Possible Compensated Metabolic Acidosis");
      else if (hco3 > 26) primaryDisorders.push("Possible Compensated Metabolic Alkalosis");
      else primaryDisorders.push("Normal ABG");
    }
    findings.push({ label: "Primary Process", value: primaryDisorders.join(" + "), color: t.ac });

    // Step 3: Compensation check
    const compFindings = [];
    if (metaAcid && !respAcid) {
      const expectedPco2 = 1.5 * hco3 + 8;
      const diff = Math.abs(pco2 - expectedPco2);
      compFindings.push(`Winters' formula: expected PaCO₂ = ${expectedPco2.toFixed(1)} ± 2 mmHg (actual: ${pco2})`);
      if (pco2 > expectedPco2 + 2) compFindings.push("PaCO₂ higher than expected → concurrent Respiratory Acidosis");
      else if (pco2 < expectedPco2 - 2) compFindings.push("PaCO₂ lower than expected → concurrent Respiratory Alkalosis");
      else compFindings.push("Compensation appropriate for pure metabolic acidosis");
    }
    if (metaAlk && !respAlk) {
      const expectedPco2 = 0.7 * hco3 + 21;
      compFindings.push(`Expected PaCO₂ = ${expectedPco2.toFixed(1)} ± 2 mmHg (actual: ${pco2})`);
      if (pco2 < expectedPco2 - 2) compFindings.push("PaCO₂ lower than expected → concurrent Respiratory Alkalosis");
      else if (pco2 > expectedPco2 + 2) compFindings.push("PaCO₂ higher than expected → concurrent Respiratory Acidosis");
      else compFindings.push("Compensation appropriate for pure metabolic alkalosis");
    }
    if (respAcid && !metaAcid) {
      const acuteHco3 = 24 + (pco2 - 40) * 0.1;
      const chronicHco3 = 24 + (pco2 - 40) * 0.35;
      compFindings.push(`Acute compensation: expected HCO₃⁻ = ${acuteHco3.toFixed(1)} mEq/L`);
      compFindings.push(`Chronic compensation: expected HCO₃⁻ = ${chronicHco3.toFixed(1)} mEq/L`);
      if (hco3 < acuteHco3 - 2) compFindings.push("HCO₃⁻ below even acute compensation → concurrent Metabolic Acidosis");
      else if (hco3 > chronicHco3 + 3) compFindings.push("HCO₃⁻ above chronic compensation → concurrent Metabolic Alkalosis");
      else if (Math.abs(hco3 - acuteHco3) <= 3) compFindings.push("HCO₃⁻ consistent with acute respiratory acidosis");
      else compFindings.push("HCO₃⁻ between acute and chronic — partially compensated or mixed chronicity");
    }
    if (respAlk && !metaAlk) {
      const acuteHco3 = 24 - (40 - pco2) * 0.2;
      const chronicHco3 = 24 - (40 - pco2) * 0.5;
      compFindings.push(`Acute compensation: expected HCO₃⁻ = ${acuteHco3.toFixed(1)} mEq/L`);
      compFindings.push(`Chronic compensation: expected HCO₃⁻ = ${chronicHco3.toFixed(1)} mEq/L`);
      if (hco3 > acuteHco3 + 2) compFindings.push("HCO₃⁻ above expected → concurrent Metabolic Alkalosis");
      else if (hco3 < chronicHco3 - 2) compFindings.push("HCO₃⁻ below expected → concurrent Metabolic Acidosis");
      else compFindings.push("Compensation within expected range");
    }
    if (compFindings.length) findings.push({ label: "Compensation Analysis", value: compFindings.join(" | "), color: t.pr });

    // Step 4: Anion gap
    if (!isNaN(na) && !isNaN(cl)) {
      let ag = na - (cl + hco3);
      let corrAg = ag;
      let agNote = "";
      if (!isNaN(alb) && alb < 4.0) {
        corrAg = ag + 2.5 * (4.0 - alb);
        agNote = ` (albumin-corrected: ${corrAg.toFixed(1)})`;
      }
      const displayAg = !isNaN(alb) ? corrAg : ag;
      if (displayAg > 12) {
        findings.push({ label: "Anion Gap", value: `${ag.toFixed(1)}${agNote} — ELEVATED (> 12) → HAGMA present`, color: t.dg });
        warnings.push("Elevated anion gap — consider MUDPILES: Methanol, Uremia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates");
        // Delta-delta
        const dd = (displayAg - 12) / (24 - hco3);
        let ddInterp = "";
        if (dd < 0.4) ddInterp = "< 0.4: Pure normal-AG acidosis (no HAGMA contribution)";
        else if (dd < 1.0) ddInterp = `${dd.toFixed(2)} < 1.0: Concurrent normal-AG acidosis alongside HAGMA`;
        else if (dd <= 2.0) ddInterp = `${dd.toFixed(2)} (1–2): Pure HAGMA`;
        else ddInterp = `${dd.toFixed(2)} > 2.0: Concurrent metabolic alkalosis hiding behind HAGMA`;
        findings.push({ label: "Delta-Delta Ratio", value: ddInterp, color: t.pk });
      } else {
        findings.push({ label: "Anion Gap", value: `${ag.toFixed(1)}${agNote} — Normal (8–12) → Hyperchloremic / Normal-AG acidosis if acidemic`, color: t.ac });
        if (metaAcid) warnings.push("Normal AG metabolic acidosis: consider HARDASS — Hyperalimentation, Acetazolamide, RTA, Diarrhea, Adrenal insufficiency, Saline/Spironolactone");
      }
    }

    // Step 5: Oxygenation / A-a gradient
    if (!isNaN(po2)) {
      if (po2 < 60) warnings.push(`Hypoxemia — PaO₂ ${po2} mmHg (< 60 mmHg threshold)`);
      findings.push({ label: "PaO₂", value: `${po2} mmHg — ${po2 >= 80 ? "Normal" : po2 >= 60 ? "Mild hypoxemia" : po2 >= 40 ? "Moderate hypoxemia" : "Severe hypoxemia"}`, color: po2 >= 80 ? t.ok : po2 >= 60 ? t.wn : t.dg });
    }

    setResult({ findings, warnings });
  };

  const clear = () => { setVals({ ph: "", pco2: "", hco3: "", po2: "", na: "", cl: "", alb: "" }); setResult(null); };

  return (
    <div>
      <SH title="Interactive ABG Interpreter" t={t} />
      <Prose t={t}>Enter ABG values below. The analyzer will work through the six-step framework, calculate compensation formulas, anion gap, delta-delta ratio, and flag critical values and anesthesia-specific warnings.</Prose>

      <Card t={t}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "16px" }}>
          {[
            { key: "ph", label: "pH", placeholder: "e.g. 7.28", hint: "7.35 – 7.45" },
            { key: "pco2", label: "PaCO₂ (mmHg)", placeholder: "e.g. 52", hint: "35 – 45" },
            { key: "hco3", label: "HCO₃⁻ (mEq/L)", placeholder: "e.g. 18", hint: "22 – 26" },
            { key: "po2", label: "PaO₂ (mmHg)", placeholder: "e.g. 88", hint: "80 – 100 (optional)" },
            { key: "na", label: "Na⁺ (mEq/L)", placeholder: "e.g. 140", hint: "For anion gap (optional)" },
            { key: "cl", label: "Cl⁻ (mEq/L)", placeholder: "e.g. 108", hint: "For anion gap (optional)" },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: "12px", color: t.tM, fontWeight: 600, display: "block", marginBottom: "4px" }}>{f.label}</label>
              <input
                type="number" step="0.01" placeholder={f.placeholder} value={vals[f.key]}
                onChange={e => set(f.key, e.target.value)}
                style={{ width: "100%", background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "6px", padding: "8px 10px", color: t.tx, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
              <div style={{ fontSize: "10px", color: t.tM, marginTop: "2px" }}>{f.hint}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "12px", marginBottom: "16px", alignItems: "end" }}>
          <div>
            <label style={{ fontSize: "12px", color: t.tM, fontWeight: 600, display: "block", marginBottom: "4px" }}>Albumin (g/dL)</label>
            <input
              type="number" step="0.1" placeholder="e.g. 2.8" value={vals.alb}
              onChange={e => set("alb", e.target.value)}
              style={{ width: "100%", background: t.bgS, border: `1px solid ${t.bd}`, borderRadius: "6px", padding: "8px 10px", color: t.tx, fontSize: "14px", outline: "none", boxSizing: "border-box" }}
            />
            <div style={{ fontSize: "10px", color: t.tM, marginTop: "2px" }}>For corrected AG (optional)</div>
          </div>
          <div style={{ fontSize: "12px", color: t.tM, lineHeight: 1.6 }}>
            Enter pH + PaCO₂ + HCO₃⁻ for full interpretation. Add Na⁺ + Cl⁻ for anion gap analysis. Add albumin for corrected AG (critical in ICU patients with hypoalbuminemia).
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={analyze} style={{ padding: "10px 28px", background: t.ac, color: t.acTx, border: "none", borderRadius: "6px", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}>Interpret ABG</button>
          <button onClick={clear} style={{ padding: "10px 18px", background: t.bgS, color: t.t2, border: `1px solid ${t.bd}`, borderRadius: "6px", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>Clear</button>
        </div>
      </Card>

      {result && (
        <div style={{ marginTop: "16px" }}>
          {result.error ? (
            <Card t={t} accent={t.wn}><div style={{ color: t.wn }}>{result.error}</div></Card>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {result.warnings.length > 0 && (
                <Card t={t} accent={t.dg}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: t.dg, marginBottom: "8px" }}>Critical Values / Clinical Warnings</div>
                  {result.warnings.map((w, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start", marginBottom: "5px" }}>
                      <span style={{ color: t.dg, fontWeight: 700, flexShrink: 0 }}>!</span>
                      <span style={{ fontSize: "13px", color: t.t2 }}>{w}</span>
                    </div>
                  ))}
                </Card>
              )}
              <Card t={t} accent={t.ac}>
                <div style={{ fontSize: "13px", fontWeight: 700, color: t.ac, marginBottom: "10px" }}>Interpretation</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {result.findings.map((f, i) => (
                    <div key={i} style={{ background: t.bgS, borderRadius: "6px", padding: "10px 14px", borderLeft: `3px solid ${f.color}` }}>
                      <div style={{ fontSize: "11px", color: t.tM, fontWeight: 600, marginBottom: "3px", textTransform: "uppercase" }}>{f.label}</div>
                      <div style={{ fontSize: "13px", color: t.tx, lineHeight: 1.5 }}>{f.value}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Quick reference table */}
      <SH title="Compensation Quick Reference" t={t} />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ background: t.bgH }}>
              {["Disorder", "Primary Change", "Compensation", "Formula", "Time"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", color: t.ac, fontWeight: 700, fontSize: "12px", borderBottom: `2px solid ${t.bd}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { disorder: "Metabolic Acidosis", primary: "↓ HCO₃⁻", comp: "↓ PaCO₂", formula: "PaCO₂ = 1.5×HCO₃⁻ + 8 ± 2 (Winter's)", time: "12–24 h (full)" },
              { disorder: "Metabolic Alkalosis", primary: "↑ HCO₃⁻", comp: "↑ PaCO₂", formula: "PaCO₂ = 0.7×HCO₃⁻ + 21 ± 2", time: "24–36 h (limited by hypoxia)" },
              { disorder: "Resp Acidosis (acute)", primary: "↑ PaCO₂", comp: "↑ HCO₃⁻", formula: "↑ HCO₃⁻ by 1 per ↑ CO₂ 10", time: "Minutes (buffering only)" },
              { disorder: "Resp Acidosis (chronic)", primary: "↑ PaCO₂", comp: "↑ HCO₃⁻", formula: "↑ HCO₃⁻ by 3.5 per ↑ CO₂ 10", time: "3–5 days (renal)" },
              { disorder: "Resp Alkalosis (acute)", primary: "↓ PaCO₂", comp: "↓ HCO₃⁻", formula: "↓ HCO₃⁻ by 2 per ↓ CO₂ 10", time: "Minutes (buffering only)" },
              { disorder: "Resp Alkalosis (chronic)", primary: "↓ PaCO₂", comp: "↓ HCO₃⁻", formula: "↓ HCO₃⁻ by 5 per ↓ CO₂ 10", time: "3–5 days (renal)" },
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? t.bgC : t.bgH, borderBottom: `1px solid ${t.bd}` }}>
                <td style={{ padding: "10px 12px", color: t.tx, fontWeight: 600 }}>{row.disorder}</td>
                <td style={{ padding: "10px 12px", color: t.dg }}>{row.primary}</td>
                <td style={{ padding: "10px 12px", color: t.ok }}>{row.comp}</td>
                <td style={{ padding: "10px 12px", color: t.ac, fontFamily: "monospace", fontSize: "12px" }}>{row.formula}</td>
                <td style={{ padding: "10px 12px", color: t.tM }}>{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Tab: Pearls ───────────────────────────────────────────────────────────────
function PearlsTab({ t }) {
  const pearls = [
    {
      n: 1, title: "The Induction Trap in Severe Metabolic Acidosis",
      text: "A patient breathing 25 breaths/min at a TV of 700 mL (minute ventilation ~17 L/min) to maintain PaCO₂ of 22 mmHg with DKA. You induce, administer succinylcholine, and try to bag-mask at a 'normal' rate of 12 breaths/min. In 60 seconds of apnea followed by inadequate manual ventilation, PaCO₂ rises from 22 → 40+ mmHg. pH drops from 7.25 → 7.05. Cardiac arrest. Set the ventilator to high MV before induction. Calculate the MV you need and match it the instant the airway is secured.",
    },
    {
      n: 2, title: "Normal pH Does Not Mean No Disorder",
      text: "pH 7.40, PaCO₂ 60, HCO₃⁻ 36 — this is NOT normal. This is chronic respiratory acidosis with full renal compensation. The patient has COPD and normally lives with a PaCO₂ of 60 and compensatory HCO₃⁻ of 36. If you normalize their ventilation to PaCO₂ 40, you produce acute alkalemia. Ask the family what the patient's 'normal' blood gas looks like, or look at prior records.",
    },
    {
      n: 3, title: "Correcting Anion Gap for Albumin — ICU Critical Skill",
      text: "The anion gap is primarily composed of albumin (negatively charged). A critically ill patient with albumin of 2.0 g/dL (expected 4.0) has a 'normal' AG of 8 that is actually 8 + (2.5 × 2.0) = 13 — elevated when corrected. Failure to correct masks a high anion gap metabolic acidosis. In the ICU, every AG should be albumin-corrected. The formula: corrected AG = measured AG + 2.5 × (4.0 − albumin).",
    },
    {
      n: 4, title: "The Sepsis ABG Progression — Read the Trend",
      text: "Early sepsis: respiratory alkalosis (pH 7.50, PaCO₂ 28, HCO₃⁻ 21) — cytokine-driven hyperventilation, no acidosis yet. Developing sepsis: mixed (pH 7.38, PaCO₂ 26, HCO₃⁻ 15, AG 20) — respiratory alkalosis + early lactic acidosis with near-normal pH masking severity. Decompensated sepsis: frank acidemia (pH 7.12, PaCO₂ 22, HCO₃⁻ 7, lactate 8). Track the trend, not just the snapshot.",
    },
    {
      n: 5, title: "Delta-Delta: The Hidden Mixed Disorder",
      text: "A patient presents with DKA (glucose 450, AG 28). HCO₃⁻ is 20 (not as low as you'd expect for AG 28). Delta-delta: (28−12)/(24−20) = 16/4 = 4.0. This is far above 2, indicating a concurrent metabolic alkalosis (the patient has been vomiting for 3 days). The vomiting-induced metabolic alkalosis has partially 'neutralized' the DKA-induced HCO₃⁻ depletion. Two processes are occurring simultaneously.",
    },
    {
      n: 6, title: "ETCO₂ vs PaCO₂ — The Gradient Matters",
      text: "Normal ETCO₂-to-PaCO₂ gradient is 2–5 mmHg (PaCO₂ slightly higher). A widening gradient (ETCO₂ 28, PaCO₂ 48) means increased dead space ventilation — areas being ventilated but not perfused. Differential: pulmonary embolism, reduced cardiac output, severe COPD (heterogeneous V/Q). This can occur even with 'normal-appearing' ETCO₂. Always compare ETCO₂ to ABG-measured PaCO₂ at intubation in critically ill patients.",
    },
    {
      n: 7, title: "Bicarbonate Administration — The Paradoxical Intracellular Acidosis",
      text: "NaHCO₃ + H⁺ → Na⁺ + H₂O + CO₂. The CO₂ generated crosses cell membranes rapidly; HCO₃⁻ does not. Inside the cell, that CO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻ — generating intracellular acidosis. The blood pH rises; the intracellular environment acidifies. This is why NaHCO₃ can worsen cardiac performance despite improving ABG numbers. Particularly relevant in cardiac arrest (intracellular acidosis impairs myocardial function), ischemic acidosis, and neonatal resuscitation.",
    },
    {
      n: 8, title: "Pregnancy Baseline — Know What is Normal",
      text: "Normal ABG at term: pH 7.40–7.45, PaCO₂ 28–32 mmHg, HCO₃⁻ 18–21 mEq/L. Progesterone-driven chronic respiratory alkalosis with renal compensation. A PaCO₂ of 40 mmHg in a term pregnant patient is relative respiratory acidosis. A bicarbonate of 22 mEq/L looks normal on standard reference ranges but is mildly elevated relative to her expected 19 mEq/L — representing metabolic alkalosis layered on her baseline. This matters in preeclampsia, eclampsia, and perioperative management of obstetric emergencies.",
    },
  ];

  return (
    <div>
      <SH title="High-Yield Clinical Pearls" t={t} />
      <Prose t={t}>These are the concepts that show up in CRNA interviews, distinguish a strong clinical answer, and prevent real adverse events at the bedside.</Prose>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {pearls.map(p => (
          <Card t={t} key={p.n} accent={t.ac}>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <span style={{ minWidth: "28px", height: "28px", borderRadius: "50%", background: t.aD, border: `1px solid ${t.aB}`, display: "flex", alignItems: "center", justifyContent: "center", color: t.ac, fontWeight: 800, fontSize: "13px", flexShrink: 0 }}>{p.n}</span>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: t.ac, marginBottom: "5px" }}>{p.title}</div>
                <Prose t={t}>{p.text}</Prose>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ─── Main AcidBase Component ───────────────────────────────────────────────────
export function AcidBase({ theme, t }) {
  const tabs = [
    { id: "overview", label: "Overview & Buffers" },
    { id: "steps", label: "Stepwise Interpretation" },
    { id: "disorders", label: "The Four Disorders" },
    { id: "anesthesia", label: "Anesthesia Management" },
    { id: "analyzer", label: "ABG Analyzer" },
    { id: "pearls", label: "Clinical Pearls" },
  ];
  const [tab, setTab] = useState("overview");

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", background: t.bg, color: t.tx, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: t.hd, borderBottom: `2px solid ${t.ac}`, padding: "28px 32px 20px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginBottom: "10px" }}>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 800, color: t.tx }}>Acid-Base Balance</h1>
          <span style={{ fontSize: "14px", color: t.tM }}>Physiology &amp; Anesthesia Application</span>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["Henderson-Hasselbalch", "Buffer Systems", "ABG Interpretation", "Compensation Formulas", "Anesthesia Management"].map(tag => (
            <span key={tag} style={{ background: t.aD, border: `1px solid ${t.aB}`, color: t.ac, padding: "3px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: "2px", padding: "0 32px", background: t.bgC, borderBottom: `1px solid ${t.bd}`, overflowX: "auto" }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{ padding: "13px 18px", background: "transparent", color: tab === tb.id ? t.ac : t.tM, border: "none", borderBottom: tab === tb.id ? `2px solid ${t.ac}` : "2px solid transparent", cursor: "pointer", fontSize: "13px", fontWeight: tab === tb.id ? 700 : 400, whiteSpace: "nowrap", transition: "all 0.15s" }}>{tb.label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "24px 32px", maxWidth: "960px" }}>
        {tab === "overview" && <OverviewTab t={t} />}
        {tab === "steps" && <StepsTab t={t} />}
        {tab === "disorders" && <DisordersTab t={t} />}
        {tab === "anesthesia" && <AnesthesiaTab t={t} />}
        {tab === "analyzer" && <AnalyzerTab t={t} />}
        {tab === "pearls" && <PearlsTab t={t} />}
      </div>
    </div>
  );
}

export default AcidBase;
