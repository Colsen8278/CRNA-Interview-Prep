import { useState } from "react";
import { ICU_SCENARIOS } from "../data/icuScenarios.js";
import { ICU_INTERVIEW_CATEGORIES } from "../data/icuInterviewQs.js";
import RhythmQuiz from "./RhythmQuiz.jsx";

// Collapsible Section
const Collapse = ({ t, title, icon, defaultOpen = false, children, borderColor }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: "12px", borderRadius: "10px", border: `1px solid ${t.bd}`, overflow: "hidden", background: t.bgC }}>
      <div onClick={() => setOpen(!open)} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "14px 16px", cursor: "pointer", userSelect: "none", borderLeft: borderColor ? `4px solid ${borderColor}` : "none" }}>
        <span style={{ fontSize: "11px", color: borderColor || t.tM, transition: "transform 0.2s", transform: open ? "rotate(0deg)" : "rotate(-90deg)", display: "inline-block" }}>{"\u25BC"}</span>
        {icon && <span style={{ fontSize: "16px" }}>{icon}</span>}
        <span style={{ fontSize: "14px", fontWeight: 700, color: t.tx, flex: 1 }}>{title}</span>
      </div>
      {open && <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${t.bd}` }}>{children}</div>}
    </div>
  );
};

// Scenario Hub Card
const ScenarioCard = ({ s, t, onClick }) => (
  <div onClick={onClick} style={{
    padding: "20px", background: t.bgC, borderRadius: "12px", border: `1px solid ${t.bd}`,
    borderLeft: `5px solid ${s.color}`, cursor: "pointer", transition: "border-color 0.15s, transform 0.15s, box-shadow 0.15s"
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = s.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 4px 16px ${s.color}20`; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = t.bd; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
      <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{s.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "16px", fontWeight: 700 }}>{s.title}</div>
        <div style={{ fontSize: "11px", color: t.tM, marginTop: "2px" }}>{s.tagline}</div>
      </div>
    </div>
    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
      <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 600, background: s.acuity === "Critical" ? `${t.dg}18` : `${t.wn}18`, color: s.acuity === "Critical" ? t.dg : t.wn }}>{s.acuity}</span>
      <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 600, background: `${s.color}15`, color: s.color }}>Freq: {s.frequency}</span>
      <span style={{ padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 500, background: t.bgS, color: t.tM }}>{s.interviewQs.length} interview Q{s.interviewQs.length !== 1 ? "s" : ""}</span>
    </div>
    <div style={{ fontSize: "12px", color: t.t2, lineHeight: 1.6 }}>{s.overview.slice(0, 150)}...</div>
  </div>
);

// Interview Q&A Card with reveal
const InterviewQA = ({ qa, t, index, color }) => {
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ marginBottom: "14px", borderRadius: "10px", border: `1px solid ${t.bd}`, overflow: "hidden", background: t.bgC }}>
      <div style={{ padding: "14px 16px", borderLeft: `4px solid ${color}` }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <span style={{ background: `${color}18`, color: color, padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, whiteSpace: "nowrap", marginTop: "2px" }}>Q{index + 1}</span>
          <div style={{ fontSize: "13px", fontWeight: 600, color: t.tx, lineHeight: 1.6 }}>{qa.q}</div>
        </div>
      </div>
      {!revealed ? (
        <div style={{ padding: "8px 16px 14px", borderTop: `1px solid ${t.bd}` }}>
          <button onClick={() => setRevealed(true)} style={{
            padding: "8px 20px", borderRadius: "8px", border: `1px solid ${color}40`, background: `${color}10`,
            color: color, fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "background 0.15s"
          }}
            onMouseEnter={e => e.currentTarget.style.background = `${color}20`}
            onMouseLeave={e => e.currentTarget.style.background = `${color}10`}
          >Reveal Strong Answer</button>
        </div>
      ) : (
        <div style={{ padding: "12px 16px 14px", borderTop: `1px solid ${t.bd}`, background: `${color}06` }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: color, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Strong Answer</div>
          <div style={{ fontSize: "13px", color: t.t2, lineHeight: 1.8 }}>{qa.a}</div>
        </div>
      )}
    </div>
  );
};

// Scenario Detail View
const ScenarioDetail = ({ s, t, onBack }) => {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "pathophys", label: "Pathophysiology" },
    { id: "management", label: "Management" },
    { id: "monitoring", label: "Monitoring" },
    { id: "interview", label: "Interview Qs" },
    { id: "pearls", label: "Clinical Pearls" },
  ];
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: t.ac, fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "12px", fontWeight: 600 }}>{"\u2190"} Back to ICU Scenarios</button>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>{s.icon}</div>
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>{s.title}</h2>
            <div style={{ fontSize: "13px", color: t.tM, marginTop: "2px" }}>{s.tagline}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, background: s.acuity === "Critical" ? `${t.dg}18` : `${t.wn}18`, color: s.acuity === "Critical" ? t.dg : t.wn }}>{s.acuity}</span>
          <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, background: `${s.color}15`, color: s.color }}>Interview Frequency: {s.frequency}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "20px", flexWrap: "wrap", background: t.bgS, padding: "4px", borderRadius: "8px" }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{
            padding: "7px 14px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600,
            background: tab === tb.id ? t.ac : "transparent", color: tab === tb.id ? t.acTx : t.t2, transition: "all 0.15s"
          }}>{tb.label}</button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === "overview" && (
        <div>
          <div style={{ padding: "20px", background: t.bgC, borderRadius: "12px", border: `1px solid ${t.bd}`, borderLeft: `5px solid ${s.color}`, marginBottom: "16px" }}>
            <div style={{ fontSize: "14px", color: t.t2, lineHeight: 1.9 }}>{s.overview}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
            <div style={{ padding: "14px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: t.tM, marginBottom: "4px" }}>Pathophys Steps</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: s.color }}>{s.pathophysiology.length}</div>
            </div>
            <div style={{ padding: "14px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: t.tM, marginBottom: "4px" }}>Management Steps</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: s.color }}>{s.management.length}</div>
            </div>
            <div style={{ padding: "14px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: t.tM, marginBottom: "4px" }}>Interview Questions</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: s.color }}>{s.interviewQs.length}</div>
            </div>
            <div style={{ padding: "14px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
              <div style={{ fontSize: "11px", color: t.tM, marginBottom: "4px" }}>Clinical Pearls</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: s.color }}>{s.pearls.length}</div>
            </div>
          </div>
        </div>
      )}

      {tab === "pathophys" && (
        <div>
          <div style={{ fontSize: "13px", color: t.t2, marginBottom: "16px", lineHeight: 1.7, fontStyle: "italic" }}>Understanding the pathophysiology at the molecular/cellular level demonstrates the depth of knowledge CRNA programs expect.</div>
          {s.pathophysiology.map((p, i) => (
            <Collapse key={i} t={t} title={p.title} borderColor={s.color} defaultOpen={i === 0}>
              <div style={{ fontSize: "13px", color: t.t2, lineHeight: 1.9, padding: "8px 0" }}>{p.detail}</div>
            </Collapse>
          ))}
        </div>
      )}

      {tab === "management" && (
        <div>
          <div style={{ fontSize: "13px", color: t.t2, marginBottom: "16px", lineHeight: 1.7, fontStyle: "italic" }}>Systematic, stepwise management framework. Know the rationale behind each decision point.</div>
          {s.management.map((step, i) => (
            <div key={i} style={{ marginBottom: "16px", padding: "18px", background: t.bgC, borderRadius: "12px", border: `1px solid ${t.bd}`, borderLeft: `4px solid ${s.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: s.color }}>{step.step}</div>
                <div style={{ fontSize: "15px", fontWeight: 700, color: t.tx }}>{step.title}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {step.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <span style={{ color: s.color, fontSize: "8px", marginTop: "6px", flexShrink: 0 }}>{"\u25CF"}</span>
                    <div style={{ fontSize: "13px", color: t.t2, lineHeight: 1.7 }}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "monitoring" && (
        <div>
          <div style={{ fontSize: "13px", color: t.t2, marginBottom: "16px", lineHeight: 1.7, fontStyle: "italic" }}>Key parameters to monitor and their clinical significance. Know the targets AND the rationale.</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", minWidth: "600px" }}>
              <thead>
                <tr style={{ background: t.bgS }}>
                  {["Parameter", "Target", "Clinical Note"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", borderBottom: `2px solid ${t.bd}`, textAlign: "left", color: s.color, fontWeight: 600, fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.3px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.monitoring.map((m, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${t.bd}` }}>
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: t.tx, whiteSpace: "nowrap" }}>{m.param}</td>
                    <td style={{ padding: "10px 12px", color: s.color, fontWeight: 600 }}>{m.target}</td>
                    <td style={{ padding: "10px 12px", color: t.t2, lineHeight: 1.6 }}>{m.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "interview" && (
        <div>
          <div style={{ padding: "14px 16px", background: `${s.color}08`, borderRadius: "10px", border: `1px solid ${s.color}25`, marginBottom: "16px" }}>
            <div style={{ fontSize: "13px", color: t.t2, lineHeight: 1.7 }}>These are the exact types of scenario-based questions CRNA programs ask. Practice answering aloud before revealing the strong answer. Interviewers want structured, systematic responses that demonstrate clinical reasoning.</div>
          </div>
          {s.interviewQs.map((qa, i) => (
            <InterviewQA key={i} qa={qa} t={t} index={i} color={s.color} />
          ))}
        </div>
      )}

      {tab === "pearls" && (
        <div>
          <div style={{ fontSize: "13px", color: t.t2, marginBottom: "16px", lineHeight: 1.7, fontStyle: "italic" }}>High-yield facts and clinical wisdom. These are the details that separate a good interview answer from a great one.</div>
          {s.pearls.map((pearl, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "12px", padding: "14px 16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}` }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: `${s.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: s.color, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ fontSize: "13px", color: t.t2, lineHeight: 1.8 }}>{pearl}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Interview Q&A Category Card
const CategoryCard = ({ cat, t, onClick, totalRevealed }) => (
  <div onClick={onClick} style={{
    padding: "20px", background: t.bgC, borderRadius: "12px", border: `1px solid ${t.bd}`,
    borderLeft: `5px solid ${cat.color}`, cursor: "pointer", transition: "border-color 0.15s, transform 0.15s, box-shadow 0.15s"
  }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 4px 16px ${cat.color}20`; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = t.bd; e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
      <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: `${cat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>{cat.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "16px", fontWeight: 700, color: t.tx }}>{cat.title}</div>
        <div style={{ fontSize: "11px", color: t.tM, marginTop: "2px" }}>{cat.questions.length} questions</div>
      </div>
    </div>
    <div style={{ fontSize: "12px", color: t.t2, lineHeight: 1.6 }}>{cat.description}</div>
  </div>
);

// Q&A Bank Detail View
const QABankDetail = ({ cat, t, onBack }) => {
  const [revealed, setRevealed] = useState({});
  const [allRevealed, setAllRevealed] = useState(false);

  const toggleReveal = (i) => setRevealed(prev => ({ ...prev, [i]: !prev[i] }));
  const toggleAll = () => {
    if (allRevealed) {
      setRevealed({});
      setAllRevealed(false);
    } else {
      const all = {};
      cat.questions.forEach((_, i) => { all[i] = true; });
      setRevealed(all);
      setAllRevealed(true);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: t.ac, fontSize: "13px", cursor: "pointer", padding: "0", marginBottom: "12px", fontWeight: 600 }}>{"\u2190"} Back to Q&A Bank</button>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${cat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>{cat.icon}</div>
          <div>
            <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700, color: t.tx }}>{cat.title}</h2>
            <div style={{ fontSize: "13px", color: t.tM, marginTop: "2px" }}>{cat.description}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "14px", alignItems: "center" }}>
          <span style={{ padding: "3px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, background: `${cat.color}15`, color: cat.color }}>{cat.questions.length} Questions</span>
          <button onClick={toggleAll} style={{
            padding: "6px 14px", borderRadius: "6px", border: `1px solid ${t.bd}`, background: t.bgS,
            color: t.t2, fontSize: "11px", fontWeight: 600, cursor: "pointer"
          }}>{allRevealed ? "Hide All Answers" : "Reveal All Answers"}</button>
        </div>
      </div>

      <div style={{ padding: "14px 16px", background: `${cat.color}08`, borderRadius: "10px", border: `1px solid ${cat.color}25`, marginBottom: "16px" }}>
        <div style={{ fontSize: "13px", color: t.t2, lineHeight: 1.7 }}>Practice answering each question aloud before revealing the strong answer. CRNA interviewers want to hear structured, systematic reasoning &mdash; not memorized scripts. If you do not know the answer, say so, then explain how you would find out.</div>
      </div>

      {cat.questions.map((qa, i) => (
        <div key={i} style={{ marginBottom: "14px", borderRadius: "10px", border: `1px solid ${t.bd}`, overflow: "hidden", background: t.bgC }}>
          <div style={{ padding: "14px 16px", borderLeft: `4px solid ${cat.color}` }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ background: `${cat.color}18`, color: cat.color, padding: "2px 8px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, whiteSpace: "nowrap", marginTop: "2px" }}>Q{i + 1}</span>
              <div style={{ fontSize: "13px", fontWeight: 600, color: t.tx, lineHeight: 1.6 }}>{qa.q}</div>
            </div>
          </div>
          {!revealed[i] ? (
            <div style={{ padding: "8px 16px 14px", borderTop: `1px solid ${t.bd}` }}>
              <button onClick={() => toggleReveal(i)} style={{
                padding: "8px 20px", borderRadius: "8px", border: `1px solid ${cat.color}40`, background: `${cat.color}10`,
                color: cat.color, fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "background 0.15s"
              }}
                onMouseEnter={e => e.currentTarget.style.background = `${cat.color}20`}
                onMouseLeave={e => e.currentTarget.style.background = `${cat.color}10`}
              >Reveal Strong Answer</button>
            </div>
          ) : (
            <div style={{ padding: "12px 16px 14px", borderTop: `1px solid ${t.bd}`, background: `${cat.color}06` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: cat.color, textTransform: "uppercase", letterSpacing: "0.5px" }}>Strong Answer</div>
                <button onClick={() => toggleReveal(i)} style={{ background: "none", border: "none", color: t.tM, fontSize: "11px", cursor: "pointer" }}>Hide</button>
              </div>
              <div style={{ fontSize: "13px", color: t.t2, lineHeight: 1.8 }}>{qa.a}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Main ICU Scenarios Page
export default function ICUScenarios({ t }) {
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState("scenarios");
  const [selectedCat, setSelectedCat] = useState(null);

  const totalQs = ICU_INTERVIEW_CATEGORIES.reduce((a, c) => a + c.questions.length, 0);

  // Scenario detail view
  if (mode === "scenarios" && selected) {
    return (
      <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
        <ScenarioDetail s={selected} t={t} onBack={() => setSelected(null)} />
      </div>
    );
  }

  // Q&A category detail view
  if (mode === "qabank" && selectedCat) {
    return (
      <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
        <QABankDetail cat={selectedCat} t={t} onBack={() => setSelectedCat(null)} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700, color: t.tx }}>ICU &amp; Critical Care</h2>
        <p style={{ margin: 0, color: t.tM, fontSize: "13px" }}>Clinical scenarios and the most commonly asked ICU questions in CRNA program interviews</p>
      </div>

      {/* Mode Toggle */}
      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: t.bgS, padding: "4px", borderRadius: "8px", maxWidth: "620px" }}>
        {[
          { id: "scenarios", label: "Clinical Scenarios", count: ICU_SCENARIOS.length },
          { id: "qabank", label: "Interview Q&A Bank", count: totalQs },
          { id: "rhythms", label: "Rhythm Strips", count: 18 }
        ].map(m => (
          <button key={m.id} onClick={() => { setMode(m.id); setSelected(null); setSelectedCat(null); }} style={{
            flex: 1, padding: "9px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600,
            background: mode === m.id ? t.ac : "transparent", color: mode === m.id ? "#fff" : t.t2, transition: "all 0.15s"
          }}>{m.label} ({m.count})</button>
        ))}
      </div>

      {/* SCENARIOS MODE */}
      {mode === "scenarios" && <>
        {/* Stats Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "24px" }}>
          <div style={{ padding: "14px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: t.tM }}>Scenarios</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: t.ac }}>{ICU_SCENARIOS.length}</div>
          </div>
          <div style={{ padding: "14px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: t.tM }}>Interview Questions</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: t.ac }}>{ICU_SCENARIOS.reduce((a, s) => a + s.interviewQs.length, 0)}</div>
          </div>
          <div style={{ padding: "14px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: t.tM }}>Clinical Pearls</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: t.ac }}>{ICU_SCENARIOS.reduce((a, s) => a + s.pearls.length, 0)}</div>
          </div>
          <div style={{ padding: "14px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: t.tM }}>Mgmt Steps</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: t.ac }}>{ICU_SCENARIOS.reduce((a, s) => a + s.management.length, 0)}</div>
          </div>
        </div>

        {/* Priority Guide */}
        <div style={{ padding: "16px", background: `${t.ac}08`, borderRadius: "10px", border: `1px solid ${t.ac}20`, marginBottom: "24px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: t.ac, marginBottom: "6px" }}>Interview Priority Guide</div>
          <div style={{ fontSize: "12px", color: t.t2, lineHeight: 1.7 }}>
            Expect scenario-based clinical questions where you are given vital signs, labs, and a clinical picture and asked to walk through your assessment and management. Programs test your ability to think systematically under pressure. The top 3 most commonly asked: <strong style={{ color: t.tx }}>Sepsis/Septic Shock</strong>, <strong style={{ color: t.tx }}>ARDS/Respiratory Failure</strong>, and <strong style={{ color: t.tx }}>TBI/ICP Management</strong>. With your TNICU background, own the neuro scenarios.
          </div>
        </div>

        {/* Scenario Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
          {ICU_SCENARIOS.map(s => (
            <ScenarioCard key={s.id} s={s} t={t} onClick={() => setSelected(s)} />
          ))}
        </div>
      </>}

      {/* Q&A BANK MODE */}
      {mode === "qabank" && <>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px", marginBottom: "24px" }}>
          <div style={{ padding: "14px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: t.tM }}>Categories</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: t.ac }}>{ICU_INTERVIEW_CATEGORIES.length}</div>
          </div>
          <div style={{ padding: "14px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: t.tM }}>Total Questions</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: t.ac }}>{totalQs}</div>
          </div>
          <div style={{ padding: "14px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: t.tM }}>Source</div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: t.ac, marginTop: "4px" }}>CCRN + Real Interviews</div>
          </div>
        </div>

        {/* Info Banner */}
        <div style={{ padding: "16px", background: `${t.ac}08`, borderRadius: "10px", border: `1px solid ${t.ac}20`, marginBottom: "24px" }}>
          <div style={{ fontSize: "13px", fontWeight: 700, color: t.ac, marginBottom: "6px" }}>How to Use This Section</div>
          <div style={{ fontSize: "12px", color: t.t2, lineHeight: 1.7 }}>
            These are the most frequently asked clinical ICU questions in CRNA program interviews, compiled from real interview reports, CCRN review material, and CRNA School Prep Academy data. Click a category, read the question aloud, formulate your answer, then reveal the strong answer to compare. The strongest interviewees explain the <strong style={{ color: t.tx }}>pathophysiology behind their actions</strong> &mdash; not just what they would do, but why. Programs will push you to the edge of your knowledge to see how you reason under pressure.
          </div>
        </div>

        {/* Category Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
          {ICU_INTERVIEW_CATEGORIES.map(cat => (
            <CategoryCard key={cat.id} cat={cat} t={t} onClick={() => setSelectedCat(cat)} />
          ))}
        </div>
      </>}

      {/* RHYTHM STRIPS MODE */}
      {mode === "rhythms" && <RhythmQuiz t={t} />}
    </div>
  );
}
