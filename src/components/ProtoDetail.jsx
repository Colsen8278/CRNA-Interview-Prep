import { useState } from "react";
import { dlPDF } from "../utils/pdf.js";
import { NotesBox } from "./NotesBox.jsx";
import { Stars } from "./ui.jsx";

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
            {p.ahaPdf && <a href={p.ahaPdf} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "5px", background: "#c8102e", borderRadius: "6px", padding: "5px 10px", color: "#fff", fontSize: "11px", fontWeight: 700, textDecoration: "none", letterSpacing: "0.3px" }}>AHA {p.ahaYear} PDF ↗</a>}
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
          <span style={{ color: p.clr, fontWeight: 700, marginRight: "8px" }}>•</span>{k}
        </div>
      ))}

      {/* AHA OFFICIAL PDF SECTION */}
      {p.ahaPdf && <div style={{ marginTop: "28px" }}>
        <h3 style={{ color: t.ac, fontSize: "17px", margin: "0 0 12px" }}> Official AHA Algorithm</h3>
        <div style={{ background: theme === "dark" ? "#0c1a2e" : "#f0f9ff", border: `1px solid ${theme === "dark" ? "#1e3a5f" : "#bae6fd"}`, borderRadius: "12px", padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "14px", background: "#c8102e", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "15px", fontWeight: 800, lineHeight: 1.1, textAlign: "center" }}>AHA</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>{p.name}</div>
            <div style={{ fontSize: "12px", color: t.tM }}>© {p.ahaYear} American Heart Association — Official Algorithm PDF</div>
            <div style={{ fontSize: "11px", color: t.tM, marginTop: "2px" }}>Source: cpr.heart.org • {p.ahaYear} AHA Guidelines for CPR & ECC</div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
            <a href={p.ahaPdf} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", background: theme === "dark" ? "#1e3a5f" : "#e0f2fe", border: `1px solid ${theme === "dark" ? "#2d5a8e" : "#7dd3fc"}`, borderRadius: "8px", padding: "10px 20px", cursor: "pointer", color: t.tx, fontSize: "13px", fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}>
               View Algorithm
            </a>
            <a href={p.ahaPdf} download style={{ display: "flex", alignItems: "center", gap: "6px", background: "#c8102e", border: "1px solid #c8102e", borderRadius: "8px", padding: "10px 20px", cursor: "pointer", color: "#fff", fontSize: "13px", fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}>
              ⬇ Download PDF
            </a>
          </div>
        </div>
      </div>}

      <NotesBox notes={notes} setNotes={setNotes} t={t} />
    </div>
  </div>;
}

export { ProtoDetail };
