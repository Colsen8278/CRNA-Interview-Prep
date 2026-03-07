import { useState } from "react";
import { EXPERIENCES } from "../data/experiences.js";

const CATEGORY_COLORS = {
  "Ethical Dilemma": "#a855f7",
  "Leadership": "#3b82f6",
  "Clinical Judgment": "#2dd4bf",
  "Teamwork": "#22c55e",
  "Patient Advocacy": "#f59e0b",
  "Conflict Resolution": "#ec4899",
  "Failure / Growth": "#ef4444",
};

const COMPETENCY_COLORS = {
  "Patient Safety": { bg: "rgba(239,68,68,0.1)", border: "#ef4444", text: "#ef4444" },
  "Integrity": { bg: "rgba(168,85,247,0.1)", border: "#a855f7", text: "#a855f7" },
  "Ethical Decision-Making": { bg: "rgba(168,85,247,0.1)", border: "#a855f7", text: "#a855f7" },
  "Leadership Under Pressure": { bg: "rgba(59,130,246,0.1)", border: "#3b82f6", text: "#3b82f6" },
  "Accountability": { bg: "rgba(45,212,191,0.1)", border: "#2dd4bf", text: "#2dd4bf" },
  "Emotional Regulation": { bg: "rgba(34,197,94,0.1)", border: "#22c55e", text: "#22c55e" },
};

export function ExperienceBank({ t, theme }) {
  const [selected, setSelected] = useState(null);
  const [activeTab, setActiveTab] = useState("star");
  const [expandedQ, setExpandedQ] = useState(null);

  const exp = selected ? EXPERIENCES.find(e => e.id === selected) : null;

  if (exp) {
    return <ExperienceDetail exp={exp} t={t} theme={theme} activeTab={activeTab} setActiveTab={setActiveTab} expandedQ={expandedQ} setExpandedQ={setExpandedQ} onBack={() => { setSelected(null); setActiveTab("star"); setExpandedQ(null); }} />;
  }

  return (
    <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ margin: "0 0 4px", fontSize: "24px", fontWeight: 700, color: t.tx }}>Experience Bank</h2>
        <p style={{ margin: 0, color: t.tM, fontSize: "13px" }}>
          Personal clinical stories mapped to CRNA interview competencies &mdash; STAR format, interview-ready
        </p>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
        {[
          { label: "Stories", value: EXPERIENCES.length },
          { label: "Competencies Covered", value: [...new Set(EXPERIENCES.flatMap(e => e.competencies))].length },
          { label: "Interview Questions", value: EXPERIENCES.reduce((s, e) => s + e.interviewQuestions.length, 0) },
        ].map(s => (
          <div key={s.label} style={{ padding: "14px 20px", background: t.bgC, border: `1px solid ${t.bd}`, borderRadius: "10px", minWidth: "120px" }}>
            <div style={{ fontSize: "22px", fontWeight: 700, color: t.ac }}>{s.value}</div>
            <div style={{ fontSize: "11px", color: t.tM, marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Story Cards */}
      <div style={{ display: "grid", gap: "16px" }}>
        {EXPERIENCES.map(exp => (
          <ExperienceCard key={exp.id} exp={exp} t={t} theme={theme} onClick={() => setSelected(exp.id)} />
        ))}
      </div>

      {/* Empty state if no stories */}
      {EXPERIENCES.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: t.tM }}>
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>No stories yet</div>
          <p style={{ fontSize: "14px" }}>Add your first clinical story to get started.</p>
        </div>
      )}

      {/* Add Story placeholder */}
      <div style={{ marginTop: "20px", padding: "20px", border: `2px dashed ${t.bd}`, borderRadius: "10px", textAlign: "center", color: t.tM, fontSize: "13px" }}>
        Additional stories will appear here as they are added &mdash; each mapped to specific interview questions and competency categories
      </div>
    </div>
  );
}

function ExperienceCard({ exp, t, theme, onClick }) {
  const catColor = CATEGORY_COLORS[exp.category] || t.ac;

  return (
    <div
      onClick={onClick}
      style={{ background: t.bgC, border: `1px solid ${t.bd}`, borderRadius: "12px", padding: "24px", cursor: "pointer", transition: "all 0.15s", borderLeft: `4px solid ${catColor}` }}
      onMouseEnter={e => e.currentTarget.style.borderColor = catColor}
      onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: "200px" }}>
          {/* Category + Setting */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" }}>
            <span style={{ background: `${catColor}18`, border: `1px solid ${catColor}55`, color: catColor, padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 600, letterSpacing: "0.3px" }}>
              {exp.category}
            </span>
            <span style={{ fontSize: "11px", color: t.tM }}>{exp.setting} &bull; {exp.date}</span>
          </div>

          <h3 style={{ margin: "0 0 4px", fontSize: "18px", fontWeight: 700, color: t.tx }}>{exp.title}</h3>
          <p style={{ margin: "0 0 14px", fontSize: "13px", color: t.t2 }}>{exp.subtitle}</p>

          {/* Competency pills */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {exp.competencies.map(c => {
              const style = COMPETENCY_COLORS[c] || { bg: "rgba(100,116,139,0.1)", border: "#64748b", text: "#64748b" };
              return (
                <span key={c} style={{ background: style.bg, border: `1px solid ${style.border}40`, color: style.text, padding: "2px 8px", borderRadius: "10px", fontSize: "10px", fontWeight: 500 }}>
                  {c}
                </span>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "11px", color: t.tM, marginBottom: "4px" }}>Answers</div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: catColor }}>{exp.interviewQuestions.length}</div>
          <div style={{ fontSize: "10px", color: t.tM }}>interview Qs</div>
          <div style={{ marginTop: "12px", fontSize: "12px", color: t.ac, fontWeight: 500 }}>View Story &rarr;</div>
        </div>
      </div>
    </div>
  );
}

function ExperienceDetail({ exp, t, theme, activeTab, setActiveTab, expandedQ, setExpandedQ, onBack }) {
  const catColor = CATEGORY_COLORS[exp.category] || t.ac;

  const tabs = [
    { id: "star", label: "STAR Story" },
    { id: "themes", label: "Key Themes" },
    { id: "questions", label: `Interview Questions (${exp.interviewQuestions.length})` },
    { id: "followup", label: "Follow-Up Probes" },
    { id: "strategy", label: "Why It Works" },
  ];

  return (
    <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
      {/* Back */}
      <button onClick={onBack} style={{ background: "none", border: "none", color: t.ac, cursor: "pointer", fontSize: "13px", fontWeight: 500, padding: "0 0 16px", display: "flex", alignItems: "center", gap: "4px" }}>
        &larr; Back to Experience Bank
      </button>

      {/* Header */}
      <div style={{ background: theme === "dark" ? "linear-gradient(135deg, #1a1f3a 0%, #0d2137 100%)" : "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", borderRadius: "12px", padding: "28px 32px", marginBottom: "0", borderBottom: `3px solid ${catColor}` }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px", flexWrap: "wrap" }}>
          <span style={{ background: `${catColor}22`, border: `1px solid ${catColor}55`, color: catColor, padding: "4px 12px", borderRadius: "14px", fontSize: "12px", fontWeight: 600 }}>
            {exp.category}
          </span>
          <span style={{ fontSize: "12px", color: t.tM }}>{exp.setting} &bull; {exp.date}</span>
          <span style={{ fontSize: "12px", color: t.tM }}>Difficulty: <span style={{ color: exp.difficulty === "high" ? "#ef4444" : "#f59e0b", fontWeight: 600 }}>{exp.difficulty.charAt(0).toUpperCase() + exp.difficulty.slice(1)}</span></span>
        </div>
        <h1 style={{ margin: "0 0 4px", fontSize: "28px", fontWeight: 700, color: t.tx }}>{exp.title}</h1>
        <p style={{ margin: "0 0 16px", fontSize: "15px", color: t.t2 }}>{exp.subtitle}</p>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {exp.competencies.map(c => {
            const s = COMPETENCY_COLORS[c] || { bg: "rgba(100,116,139,0.1)", border: "#64748b", text: "#64748b" };
            return <span key={c} style={{ background: s.bg, border: `1px solid ${s.border}60`, color: s.text, padding: "3px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 500 }}>{c}</span>;
          })}
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{ display: "flex", gap: "2px", background: t.bgS, borderRadius: "0 0 0 0", overflowX: "auto", borderBottom: `1px solid ${t.bd}` }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: "13px 18px", background: activeTab === tab.id ? t.bgC : "transparent", color: activeTab === tab.id ? catColor : t.tM, border: "none", borderBottom: activeTab === tab.id ? `2px solid ${catColor}` : "2px solid transparent", cursor: "pointer", fontSize: "13px", fontWeight: activeTab === tab.id ? 600 : 400, whiteSpace: "nowrap", transition: "all 0.15s" }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ background: t.bgC, borderRadius: "0 0 12px 12px", padding: "32px", border: `1px solid ${t.bd}`, borderTop: "none" }}>

        {activeTab === "star" && (
          <div>
            <p style={{ margin: "0 0 28px", fontSize: "13px", color: t.tM, fontStyle: "italic" }}>
              This is a polished, interview-ready version of the story. Practice delivering each section in 60&ndash;90 seconds. The full story should run 4&ndash;5 minutes.
            </p>
            {[
              { label: "S", full: "Situation", content: exp.star.situation, color: "#3b82f6" },
              { label: "T", full: "Task", content: exp.star.task, color: "#f59e0b" },
              { label: "A", full: "Action", content: exp.star.action, color: "#2dd4bf" },
              { label: "R", full: "Result", content: exp.star.result, color: "#22c55e" },
            ].map(section => (
              <div key={section.label} style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${section.color}20`, border: `2px solid ${section.color}`, display: "flex", alignItems: "center", justifyContent: "center", color: section.color, fontWeight: 700, fontSize: "16px", flexShrink: 0 }}>
                    {section.label}
                  </div>
                  <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: section.color }}>{section.full}</h3>
                </div>
                <div style={{ paddingLeft: "48px" }}>
                  {section.content.split("\n\n").map((para, i) => (
                    <p key={i} style={{ margin: "0 0 12px", fontSize: "14px", lineHeight: 1.8, color: t.t2 }}>{para}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "themes" && (
          <div>
            <p style={{ margin: "0 0 24px", color: t.tM, fontSize: "13px" }}>
              These are the conceptual anchors of the story. Know them cold &mdash; interviewers who push on follow-up questions are usually probing these themes.
            </p>
            <div style={{ display: "grid", gap: "14px" }}>
              {exp.keyThemes.map((theme_item, i) => (
                <div key={i} style={{ padding: "20px", background: t.bgS, borderRadius: "10px", borderLeft: `4px solid ${catColor}` }}>
                  <div style={{ fontWeight: 700, fontSize: "15px", color: t.tx, marginBottom: "8px" }}>{theme_item.label}</div>
                  <p style={{ margin: 0, fontSize: "14px", lineHeight: 1.7, color: t.t2 }}>{theme_item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "questions" && (
          <div>
            <p style={{ margin: "0 0 20px", color: t.tM, fontSize: "13px" }}>
              This story can serve as your primary or secondary answer to any of the following questions. Check off the ones you want to practice.
            </p>
            <div style={{ display: "grid", gap: "10px" }}>
              {exp.interviewQuestions.map((q, i) => (
                <div key={i} style={{ padding: "16px 20px", background: t.bgS, borderRadius: "8px", border: `1px solid ${t.bd}`, display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <span style={{ color: catColor, fontWeight: 700, fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>Q{i + 1}</span>
                  <span style={{ fontSize: "14px", color: t.tx, lineHeight: 1.6 }}>{q}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "followup" && (
          <div>
            <p style={{ margin: "0 0 20px", color: t.tM, fontSize: "13px" }}>
              These are the follow-up probes an experienced interviewer is likely to push after you deliver this story. Practice until these feel automatic.
            </p>
            <div style={{ display: "grid", gap: "14px" }}>
              {exp.followUpQs.map((item, i) => (
                <div key={i} style={{ background: t.bgS, borderRadius: "10px", overflow: "hidden", border: `1px solid ${t.bd}` }}>
                  <button
                    onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                    style={{ width: "100%", padding: "18px 20px", background: "none", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: 600, color: t.tx, textAlign: "left", lineHeight: 1.5 }}>{item.q}</span>
                    <span style={{ color: t.ac, fontSize: "18px", flexShrink: 0 }}>{expandedQ === i ? "−" : "+"}</span>
                  </button>
                  {expandedQ === i && (
                    <div style={{ padding: "0 20px 20px", borderTop: `1px solid ${t.bd}` }}>
                      <p style={{ margin: "16px 0 0", fontSize: "14px", lineHeight: 1.8, color: t.t2 }}>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "strategy" && (
          <div>
            <div style={{ padding: "28px", background: `${catColor}0d`, border: `1px solid ${catColor}30`, borderRadius: "12px", marginBottom: "24px" }}>
              <h3 style={{ margin: "0 0 16px", fontSize: "17px", fontWeight: 700, color: catColor }}>The Strategic Case for This Story</h3>
              <p style={{ margin: 0, fontSize: "15px", lineHeight: 1.85, color: t.tx }}>{exp.whyItWorks}</p>
            </div>

            <div style={{ padding: "20px", background: t.bgS, borderRadius: "10px", border: `1px solid ${t.bd}` }}>
              <h4 style={{ margin: "0 0 12px", fontSize: "14px", fontWeight: 700, color: t.tx }}>Delivery Notes</h4>
              <ul style={{ margin: 0, paddingLeft: "20px", display: "grid", gap: "8px" }}>
                {[
                  "Open with the relationship context first — 'one of my closest friends on the unit' — so the emotional weight is established before the violation is disclosed",
                  "When describing the colleague who came to you, quote her verbatim: 'I respect your judgment, you'd actually do something about it, and I trust you.' This is the most powerful sentence in the story because it shows the culture you built",
                  "Pause after stating you confirmed the violation. Don't rush past this. The weight of confirmation is the pivot of the story",
                  "Close with the principle, not the outcome. The resolution of the HR process is less important than your reasoning framework",
                  "If asked about the outcome for the other nurse, be honest that it was handled through proper channels and redirect to what the experience taught you as a leader",
                ].map((note, i) => (
                  <li key={i} style={{ fontSize: "13px", lineHeight: 1.7, color: t.t2 }}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
