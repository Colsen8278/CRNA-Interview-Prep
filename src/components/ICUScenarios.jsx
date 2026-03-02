import { useState } from "react";
import { ICU_SCENARIOS } from "../data/icuScenarios.js";

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

// Main ICU Scenarios Page
export default function ICUScenarios({ t }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
        <ScenarioDetail s={selected} t={t} onBack={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "22px", fontWeight: 700 }}>ICU Clinical Scenarios</h2>
        <p style={{ margin: 0, color: t.tM, fontSize: "13px" }}>The most commonly tested critical care scenarios in CRNA program interviews</p>
      </div>

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
          Expect scenario-based clinical questions where you're given vital signs, labs, and a clinical picture and asked to walk through your assessment and management. Programs test your ability to think systematically under pressure. The top 3 most commonly asked: <strong style={{ color: t.tx }}>Sepsis/Septic Shock</strong>, <strong style={{ color: t.tx }}>ARDS/Respiratory Failure</strong>, and <strong style={{ color: t.tx }}>TBI/ICP Management</strong>. With your TNICU background, own the neuro scenarios.
        </div>
      </div>

      {/* Scenario Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "14px" }}>
        {ICU_SCENARIOS.map(s => (
          <ScenarioCard key={s.id} s={s} t={t} onClick={() => setSelected(s)} />
        ))}
      </div>
    </div>
  );
}
