import { useState, useRef } from "react";
import { dlPDF } from "../utils/pdf.js";

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

      {/* OVERVIEW TAB */}
      {tab === "overview" && <div>
        {r.overview.map((p, i) => <p key={i} style={{ fontSize: "14px", lineHeight: 1.8, color: t.t2, marginBottom: "14px" }}>{p}</p>)}
      </div>}

      {/* CASCADE TAB */}
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

      {/* CLINICAL TAB */}
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

      {/* DIAGRAM TAB */}
      {tab === "diagram" && <div style={{ padding: "24px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
        <p style={{ color: t.tM, fontSize: "13px", fontStyle: "italic" }}>Interactive diagram for {r.name} -- coming in next build iteration.</p>
        <p style={{ color: t.tM, fontSize: "12px" }}>Will show: {r.id === "lgic" ? "pentameric channel cross-section with ion flow" : r.id === "gpcr" ? "7TM receptor with Gq/Gs/Gi branching pathways" : r.id === "rtk" ? "RTK dimerization and PI3K-Akt cascade" : "cytoplasmic receptor with nuclear translocation"}</p>
      </div>}
    </div>
  );
}

export { ReceptorDetail };
