#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# CRRT Device Page Integration Script
# Run from your CRNA-Interview-Prep project root
# Usage: bash integrate-crrt.sh
# ═══════════════════════════════════════════════════════════════

set -e

FILE="src/crna-study-site.jsx"

if [ ! -f "$FILE" ]; then
  echo "❌ Cannot find $FILE — are you in the project root?"
  echo "   Run: cd ~/path-to/CRNA-Interview-Prep"
  exit 1
fi

echo "📋 Creating backup..."
cp "$FILE" "${FILE}.bak"

echo "🔧 Integrating CRRT device page..."

# ═══════════════════════════════════════════════════
# STEP 1: Add device state variable after proto state
# ═══════════════════════════════════════════════════
sed -i '' 's/const \[proto, setProto\] = useState(null);/const [proto, setProto] = useState(null);\
  const [deviceView, setDeviceView] = useState(null);/' "$FILE"

# ═══════════════════════════════════════════════════
# STEP 2: Add device navigation function after sQuiz
# ═══════════════════════════════════════════════════
sed -i '' 's/const sQuiz = (c) => {/const oDev = (d) => { setDeviceView(d); setPg("device"); setSo(false); setSq(""); };\
  const sQuiz = (c) => {/' "$FILE"

# ═══════════════════════════════════════════════════
# STEP 3: Update back button to handle device view
# ═══════════════════════════════════════════════════
sed -i '' 's/setPg("dash"); setSel(null); setProto(null); }} style={{ background: t.bgS/setPg("dash"); setSel(null); setProto(null); setDeviceView(null); }} style={{ background: t.bgS/g' "$FILE"

sed -i '' 's/pg === "detail" || pg === "proto" ? "Back"/pg === "detail" || pg === "proto" || pg === "device" ? "Back"/g' "$FILE"

# ═══════════════════════════════════════════════════
# STEP 4: Replace BOTH device placeholders with clickable CRRT card
# ═══════════════════════════════════════════════════

# Dashboard placeholder (the one inside pg === "dash")
sed -i '' '/<SL t={t} icon="🔧" title="Devices" count={0} \/>/{
N
s/<SL t={t} icon="🔧" title="Devices" count={0} \/>\n.*<div style={{ marginBottom: "20px" }}><PH t={t} text="Ask about arterial lines, vents, EVDs..." \/><\/div>/<SL t={t} icon="🔧" title="Devices" count={1} \/>\
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "20px" }}>\
            <div onClick={() => oDev("crrt")} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: \`1px solid ${t.bd}\`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>\
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><span style={{ fontSize: "18px" }}>🔧<\/span><span style={{ fontSize: "15px", fontWeight: 600, color: t.tx }}>CRRT<\/span><\/div>\
              <div style={{ fontSize: "12px", color: t.tM, marginBottom: "4px" }}>Continuous Renal Replacement Therapy<\/div>\
              <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>{["Extracorporeal Circuit", "Hemofiltration"].map(tag => <span key={tag} style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: t.aD, color: t.ac, border: \`1px solid ${t.aB}\` }}>{tag}<\/span>)}<\/div>\
            <\/div>\
            <PH t={t} text="More devices coming..." \/>\
          <\/div>/
}' "$FILE"

# pg-meds placeholder (the one inside the Study Sheets page)
sed -i '' '/<SL t={t} icon="🔧" title="Devices" count={0} \/>/{
N
s/<SL t={t} icon="🔧" title="Devices" count={0} \/>\n.*<div style={{ marginBottom: "24px" }}><PH t={t} text="Ask about arterial lines, vents, EVDs..." \/><\/div>/<SL t={t} icon="🔧" title="Devices" count={1} \/>\
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "24px" }}>\
          <div onClick={() => oDev("crrt")} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: \`1px solid ${t.bd}\`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>\
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><span style={{ fontSize: "18px" }}>🔧<\/span><span style={{ fontSize: "15px", fontWeight: 600, color: t.tx }}>CRRT<\/span><\/div>\
            <div style={{ fontSize: "12px", color: t.tM, marginBottom: "4px" }}>Continuous Renal Replacement Therapy<\/div>\
            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>{["Extracorporeal Circuit", "Hemofiltration"].map(tag => <span key={tag} style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: t.aD, color: t.ac, border: \`1px solid ${t.aB}\` }}>{tag}<\/span>)}<\/div>\
          <\/div>\
          <PH t={t} text="More devices coming..." \/>\
        <\/div>/
}' "$FILE"

# ═══════════════════════════════════════════════════
# STEP 5: Add device detail view routing (after proto detail)
# ═══════════════════════════════════════════════════
sed -i '' 's/{\/\* PROTOCOL DETAIL \*\/}/{\/\* PROTOCOL DETAIL \*\/}/' "$FILE"

# Add the device view after the protocol detail line
sed -i '' '/pg === "proto" \&\& proto \&\& <ProtoDetail/a\
\
      {\/\* DEVICE DETAIL \*\/}\
      {pg === "device" \&\& deviceView === "crrt" \&\& <CRRTDevice t={t} theme={theme} \/>}' "$FILE"

# ═══════════════════════════════════════════════════
# STEP 6: Add search integration for devices
# ═══════════════════════════════════════════════════
sed -i '' 's/{fs.protos.map(p => <SearchRow key={p.id} icon="❤️‍🔥" title={p.name} sub={p.cat} stars={conf\[p.id\]} onClick={() => oPro(p)} t={t} \/>)}/{fs.protos.map(p => <SearchRow key={p.id} icon="❤️‍🔥" title={p.name} sub={p.cat} stars={conf[p.id]} onClick={() => oPro(p)} t={t} \/>)}\
            {sq \&\& "crrt renal replacement hemofiltration hemodialysis dialysis".includes(sq.toLowerCase()) \&\& <SearchRow icon="🔧" title="CRRT" sub="Continuous Renal Replacement Therapy" onClick={() => oDev("crrt")} t={t} \/>}/' "$FILE"

# ═══════════════════════════════════════════════════
# STEP 7: Update dashboard Stat count to include devices
# ═══════════════════════════════════════════════════
# Add a Devices stat card
sed -i '' 's/<Stat t={t} label="ACLS\/PALS Protocols"/<Stat t={t} label="Devices" value={1} icon="🔧" accent={t.bl} onClick={() => setPg("pg-meds")} \/>\
          <Stat t={t} label="ACLS\/PALS Protocols"/' "$FILE"

echo "✅ Integration points wired."
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "Now adding the CRRTDevice component to the end of the file..."
echo "═══════════════════════════════════════════════════════════"

# ═══════════════════════════════════════════════════
# STEP 8: Append the CRRTDevice component before the final line
# We need to add it BEFORE the last component but AFTER the existing components
# ═══════════════════════════════════════════════════

# Find the very last line number
LAST_LINE=$(wc -l < "$FILE" | tr -d ' ')

# We'll insert the component before the last closing of the file
# The CRRT component needs to go before the end, after all other component definitions

cat >> "$FILE" << 'CRRT_COMPONENT'

// ═══════════════════════════════════════════════════════════════
// CRRT DEVICE COMPONENT
// ═══════════════════════════════════════════════════════════════
function CRRTDevice({ t, theme }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [diagramMode, setDiagramMode] = useState("CVVHDF");
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [showFlowAnimation, setShowFlowAnimation] = useState(true);

  const tabs = [
    { id: "overview", label: "Overview & Principles" },
    { id: "modalities", label: "CRRT Modalities" },
    { id: "circuit", label: "Interactive Circuit" },
    { id: "prescriptions", label: "Prescriptions & Dosing" },
    { id: "troubleshooting", label: "Troubleshooting" },
    { id: "pearls", label: "Clinical Pearls" },
    { id: "interview", label: "Interview Angles" },
  ];

  const componentInfo = {
    access: { title: "Vascular Access Catheter", detail: "Large-bore, dual-lumen dialysis catheter (11.5\u201313.5 Fr) placed in the internal jugular (preferred), femoral, or subclavian vein. The \u2018arterial\u2019 (withdrawal) lumen pulls blood from the patient; the \u2018venous\u2019 (return) lumen delivers filtered blood back. Right IJ is ideal \u2014 straight path to the SVC with low recirculation rates (~5%). Femoral catheters have higher recirculation (~10\u201315%) and infection risk. Subclavian risks stenosis \u2014 avoid if patient may need future AV fistula.", color: "#ef4444" },
    bloodpump: { title: "Blood Pump (Peristaltic Roller)", detail: "Peristaltic roller pump propels blood at 150\u2013300 mL/min (typical: 200). Compresses flexible tubing against a curved raceway \u2014 no direct pump-blood contact, reducing hemolysis. Higher blood flow improves convective clearance but increases TMP and hemolysis risk.", color: "#3b82f6" },
    prefilter: { title: "Pre-Filter Replacement Fluid", detail: "In predilution mode, sterile bicarbonate-buffered replacement fluid is infused BEFORE the hemofilter. Dilutes blood entering the filter \u2192 reduces hematocrit in fibers \u2192 extends filter life by reducing protein caking/clotting. Trade-off: clearance efficiency drops ~15\u201320% (solutes are diluted). Compensate by increasing total replacement volume. Predilution is preferred in most ICUs because filter longevity is a major practical concern.", color: "#8b5cf6" },
    hemofilter: { title: "Hemofilter (Dialyzer)", detail: "Hollow-fiber membrane cartridge with thousands of semipermeable polysulfone or AN69 fibers (MWCO ~20,000\u201350,000 Da). Blood flows inside fibers; dialysate flows countercurrent outside. Solute removal via DIFFUSION (concentration gradient \u2014 small solutes) and CONVECTION (solvent drag \u2014 medium molecules up to ~50 kDa). Surface area: 0.6\u20132.15 m\u00B2. AN69 membranes can adsorb cytokines but cause bradykinin release in ACE-inhibitor patients.", color: "#f59e0b" },
    dialysate: { title: "Dialysate Fluid", detail: "Sterile dialysate flows countercurrent to blood on the shell side in CVVHD/CVVHDF. Composition: Na\u207A ~140, K\u207A 0\u20134, Ca\u00B2\u207A 0\u20133, HCO\u2083\u207B 22\u201335. Creates concentration gradients driving diffusive clearance. Flow rate: 1,000\u20132,000 mL/hr. Use K\u207A 0 for severe hyperkalemia; K\u207A 2\u20134 to prevent overcorrection.", color: "#06b6d4" },
    effluent: { title: "Effluent (Ultrafiltrate) Collection", detail: "Collects all fluid removed: ultrafiltrate + spent dialysate + replacement fluid that crossed membrane. Effluent pump controls net fluid balance. Total effluent rate = replacement fluid rate + dialysate rate + net UF rate. Blood-tinged effluent = membrane rupture. Decreasing rate = clotting. KDIGO target: 20\u201325 mL/kg/hr.", color: "#10b981" },
    postfilter: { title: "Post-Filter Replacement Fluid", detail: "In postdilution, replacement fluid infused AFTER the hemofilter. Blood is undiluted at the membrane \u2192 maximal clearance efficiency. But hematocrit rises in fibers (water removed, cells not) \u2192 accelerated clotting. Keep filtration fraction (FF) <20\u201325%. Many protocols use combined 2/3 pre + 1/3 post to balance clearance and filter life.", color: "#ec4899" },
    anticoag: { title: "Anticoagulation", detail: "Regional citrate anticoagulation (RCA) is preferred per KDIGO. Trisodium citrate 4% infused pre-filter chelates ionized calcium (required for Factors II, VII, IX, X). Circuit iCa\u00B2\u207A target <0.35 mmol/L. Calcium chloride infused systemically to restore iCa\u00B2\u207A to 1.0\u20131.2 mmol/L. Alternative: systemic heparin (500\u20131000 U/hr, aPTT 40\u201345s) \u2014 simpler but bleeding risk in coagulopathic patients.", color: "#f97316" },
    bubbletrap: { title: "Air Detector & Bubble Trap", detail: "Ultrasonic air detector + venous drip chamber on the return line. Air >0.1 mL triggers immediate alarm and automatic line clamp \u2014 prevents venous air embolism. Bubble trap uses gravity separation: air rises to top, de-aired blood exits bottom. Also monitors venous return pressure.", color: "#a855f7" },
    pressures: { title: "Pressure Monitoring Points", detail: "Four transducers: (1) ACCESS: negative pressure from blood pump pulling (\u221250 to \u2212200 mmHg; more negative = catheter dysfunction). (2) PRE-FILTER: positive, before filter (rising = clotting). (3) EFFLUENT: filtrate side. (4) RETURN: positive, returning blood (+50 to +250 mmHg; elevated = catheter occlusion). TMP = [(P_pre + P_return)/2] \u2212 P_effluent. TMP >250 mmHg = significant filter clotting.", color: "#64748b" }
  };

  const showConvection = diagramMode === "CVVHDF" || diagramMode === "CVVH";
  const showDialysate = diagramMode === "CVVHDF" || diagramMode === "CVVHD";

  // Styled sub-components using parent theme
  const SH = ({ title }) => <h2 style={{ color: t.tx, fontSize: "22px", fontWeight: 600, marginTop: "32px", marginBottom: "16px", paddingBottom: "8px", borderBottom: `1px solid ${t.bd}` }}>{title}</h2>;
  const CB = ({ children }) => <div style={{ lineHeight: 1.8, fontSize: "15px", color: t.t2 }}>{children}</div>;
  const HL = ({ children }) => <span style={{ color: t.ac, fontWeight: 600 }}>{children}</span>;
  const PC = ({ number, title, children }) => (
    <div style={{ padding: "20px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}`, marginBottom: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <span style={{ background: t.aD, color: t.ac, padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 600 }}>Pearl #{number}</span>
        <span style={{ color: t.tx, fontWeight: 600, fontSize: "15px" }}>{title}</span>
      </div>
      <p style={{ color: t.t2, fontSize: "14px", lineHeight: 1.7, margin: 0 }}>{children}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ background: t.hd, borderBottom: `2px solid ${t.ac}`, padding: "32px 28px 24px", borderRadius: "12px 12px 0 0", marginBottom: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "8px" }}>
          <h1 style={{ margin: 0, fontSize: "32px", fontWeight: 700, color: t.tx, letterSpacing: "-0.5px" }}>Continuous Renal Replacement Therapy</h1>
          <span style={{ fontSize: "16px", color: t.tM, fontWeight: 400 }}>(CRRT)</span>
        </div>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "12px" }}>
          {["Renal Replacement", "Extracorporeal Circuit", "Hemofiltration / Hemodialysis", "ICU Device"].map(tag => (
            <span key={tag} style={{ background: t.aD, border: `1px solid ${t.aB}`, color: t.ac, padding: "4px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: 500 }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Tab Nav */}
      <div style={{ display: "flex", gap: "2px", padding: "0 8px", background: t.bgH, borderBottom: `1px solid ${t.bd}`, overflowX: "auto", borderRadius: 0 }}>
        {tabs.map(tb => (
          <button key={tb.id} onClick={() => setActiveTab(tb.id)} style={{ padding: "14px 18px", background: activeTab === tb.id ? t.bgC : "transparent", color: activeTab === tb.id ? t.ac : t.tM, border: "none", borderBottom: activeTab === tb.id ? `2px solid ${t.ac}` : "2px solid transparent", cursor: "pointer", fontSize: "13px", fontWeight: activeTab === tb.id ? 600 : 400, whiteSpace: "nowrap", transition: "all 0.2s" }}>
            {tb.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "24px 0" }}>

        {/* ══ OVERVIEW ══ */}
        {activeTab === "overview" && <div>
          <SH title="What Is CRRT?" />
          <CB>
            <p>Continuous Renal Replacement Therapy (CRRT) is a slow, continuous extracorporeal blood purification technique used in hemodynamically unstable ICU patients who cannot tolerate conventional intermittent hemodialysis (IHD). Unlike IHD — which removes solutes and fluid over 3–4 hours causing rapid osmotic and volume shifts — CRRT operates 24 hours/day at low blood flow rates (150–300 mL/min vs. 300–500 mL/min for IHD), providing <HL>gradual, hemodynamically stable solute and fluid removal</HL>.</p>
            <p style={{ marginTop: "16px" }}>CRRT is preferred for AKI complicated by hemodynamic instability, refractory fluid overload, severe electrolyte derangements (hyperkalemia, metabolic acidosis), or uremia with encephalopathy. KDIGO recommends initiating RRT when life-threatening changes in fluid, electrolyte, or acid-base balance exist — but there is no single creatinine or BUN threshold that mandates initiation.</p>
          </CB>

          <SH title="The Two Clearance Mechanisms" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", margin: "12px 0" }}>
            <div style={{ padding: "24px", background: t.bgC, borderRadius: "8px", borderLeft: `4px solid ${t.bl}` }}>
              <div style={{ fontSize: "16px", color: t.bl, fontWeight: 700, marginBottom: "10px" }}>Diffusion</div>
              <div style={{ fontSize: "14px", color: t.t2, lineHeight: 1.8 }}>Solutes move across a semipermeable membrane <strong style={{ color: t.tx }}>down their concentration gradient</strong> (Fick's Law). Highly effective for <strong style={{ color: t.tx }}>small molecules (&lt;500 Da)</strong> — urea, creatinine, K⁺. Clearance depends on membrane surface area, concentration gradient, thickness, and molecular weight.</div>
            </div>
            <div style={{ padding: "24px", background: t.bgC, borderRadius: "8px", borderLeft: `4px solid ${t.wn}` }}>
              <div style={{ fontSize: "16px", color: t.wn, fontWeight: 700, marginBottom: "10px" }}>Convection (Solvent Drag)</div>
              <div style={{ fontSize: "14px", color: t.t2, lineHeight: 1.8 }}>Water pushed across membrane by <strong style={{ color: t.tx }}>hydrostatic pressure</strong> (TMP) carries dissolved solutes — "solvent drag." Independent of concentration gradients. Superior for <strong style={{ color: t.tx }}>medium molecules (500–50,000 Da)</strong> — cytokines, β₂-microglobulin, myoglobin. Sieving coefficient: 1.0 = freely filtered.</div>
            </div>
          </div>

          <SH title="Key Physics" />
          <div style={{ padding: "24px", background: t.bgC, borderRadius: "12px", border: `1px solid ${t.bd}`, textAlign: "center" }}>
            <div style={{ fontSize: "18px", color: t.ac, fontWeight: 700, fontFamily: "monospace", marginBottom: "12px" }}>Jv = Kuf × TMP</div>
            <div style={{ fontSize: "14px", color: t.t2 }}>Jv = ultrafiltration rate (mL/hr) | Kuf = membrane coefficient | TMP = transmembrane pressure</div>
            <div style={{ fontSize: "16px", color: t.wn, fontWeight: 600, fontFamily: "monospace", marginTop: "16px" }}>TMP = [(P_in + P_out) / 2] − P_effluent</div>
            <div style={{ fontSize: "13px", color: t.tM, marginTop: "8px" }}>Rising TMP = filter clotting. TMP &gt;250–300 mmHg = filter nearing failure</div>
          </div>

          <SH title="CRRT vs. IHD" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {[
              { label: "Hemodynamic Stability", crrt: "Minimal fluid shifts — well-tolerated in shock", ihd: "Rapid ultrafiltration causes hypotension" },
              { label: "Duration", crrt: "Continuous (24 hr/day)", ihd: "Intermittent (3–4 hr sessions)" },
              { label: "Blood Flow Rate", crrt: "150–300 mL/min", ihd: "300–500 mL/min" },
              { label: "Fluid Removal", crrt: "Precise, programmable (mL/hr)", ihd: "Large volumes removed quickly" },
              { label: "Best For", crrt: "Hemodynamically unstable, cerebral edema, liver failure", ihd: "Stable patients, outpatient" },
              { label: "Drug Clearance", crrt: "Continuous — dose adjustments ×24hr", ihd: "Intermittent — dose after sessions" },
            ].map((row, i) => (
              <div key={i} style={{ padding: "14px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}` }}>
                <div style={{ fontSize: "11px", color: t.tM, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>{row.label}</div>
                <div style={{ fontSize: "13px", marginBottom: "4px" }}><span style={{ color: t.ac, fontWeight: 600 }}>CRRT:</span> <span style={{ color: t.tx }}>{row.crrt}</span></div>
                <div style={{ fontSize: "13px" }}><span style={{ color: t.wn, fontWeight: 600 }}>IHD:</span> <span style={{ color: t.t2 }}>{row.ihd}</span></div>
              </div>
            ))}
          </div>
        </div>}

        {/* ══ MODALITIES ══ */}
        {activeTab === "modalities" && <div>
          <SH title="CRRT Modalities" />
          <CB><p>The three primary modalities differ in solute removal mechanism. <strong style={{ color: t.tx }}>C</strong>=Continuous, <strong style={{ color: t.tx }}>VV</strong>=Veno-Venous, then the clearance method.</p></CB>
          <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
            {[
              { tag: "CVVH", name: "Continuous Veno-Venous Hemofiltration", color: t.wn, mech: "Convection only. No dialysate. Hydrostatic pressure drives plasma water + solutes across membrane (solvent drag). Large UF volumes replaced with sterile replacement fluid.", best: "Medium molecules (cytokines, myoglobin, β₂-microglobulin). Rhabdomyolysis.", limit: "Less efficient for small molecules (urea, K⁺). Higher replacement fluid volumes." },
              { tag: "CVVHD", name: "Continuous Veno-Venous Hemodialysis", color: t.bl, mech: "Diffusion only. Dialysate flows countercurrent. Solutes move down concentration gradients. No replacement fluid needed.", best: "Small molecules — urea, creatinine, K⁺, phosphorus. Uremia, hyperkalemia. Simpler setup.", limit: "Poor medium/large molecule clearance (diffusion efficiency ∝ 1/√MW)." },
              { tag: "CVVHDF", name: "Continuous Veno-Venous Hemodiafiltration", color: t.ac, mech: "Diffusion + Convection. Most commonly used. Combines dialysate (diffusion) with replacement fluid + UF (convection). Broadest spectrum clearance.", best: "Most ICU AKI patients. Comprehensive small + medium molecule clearance. Default in most centers.", limit: "Complex setup — requires both dialysate and replacement fluid bags. Higher cost." },
            ].map((m, i) => (
              <div key={i} style={{ padding: "24px", background: t.bgC, borderRadius: "12px", borderLeft: `5px solid ${m.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <span style={{ background: `${m.color}20`, color: m.color, padding: "4px 14px", borderRadius: "20px", fontSize: "14px", fontWeight: 700 }}>{m.tag}</span>
                  <span style={{ color: t.tx, fontSize: "17px", fontWeight: 600 }}>{m.name}</span>
                </div>
                <div style={{ color: t.t2, fontSize: "14px", lineHeight: 1.8 }}>
                  <p><strong style={{ color: m.color }}>Mechanism:</strong> {m.mech}</p>
                  <p style={{ marginTop: "10px" }}><strong style={{ color: t.tx }}>Best for:</strong> {m.best}</p>
                  <p style={{ marginTop: "10px" }}><strong style={{ color: t.tx }}>Limitation:</strong> {m.limit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>}

        {/* ══ INTERACTIVE CIRCUIT ══ */}
        {activeTab === "circuit" && <div>
          <SH title="CRRT Extracorporeal Circuit" />
          <CB><p>Click any component for detailed information. Toggle modalities to see circuit changes.</p></CB>
          <div style={{ display: "flex", gap: "8px", margin: "16px 0 24px", flexWrap: "wrap" }}>
            {["CVVHDF","CVVH","CVVHD"].map(mode => (
              <button key={mode} onClick={() => setDiagramMode(mode)} style={{ padding: "10px 24px", background: diagramMode === mode ? t.ac : t.bgS, color: diagramMode === mode ? t.acTx : t.t2, border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}>{mode}</button>
            ))}
            <button onClick={() => setShowFlowAnimation(!showFlowAnimation)} style={{ padding: "10px 20px", background: showFlowAnimation ? t.aD : t.bgS, color: showFlowAnimation ? t.ac : t.tM, border: `1px solid ${showFlowAnimation ? t.ac : t.bd}`, borderRadius: "8px", cursor: "pointer", fontSize: "13px", marginLeft: "auto" }}>
              {showFlowAnimation ? "⚡ Flow On" : "○ Flow Off"}
            </button>
          </div>

          <div style={{ background: theme === "dark" ? "#0d1117" : "#f8fafc", borderRadius: "16px", border: `1px solid ${t.bd}`, padding: "16px", overflow: "auto" }}>
            <svg viewBox="0 0 1020 660" style={{ width: "100%", height: "auto", minHeight: "450px" }}>
              <defs>
                <marker id="aR" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" /></marker>
                <marker id="aB" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" /></marker>
                <marker id="aG" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#10b981" /></marker>
                <marker id="aP" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#8b5cf6" /></marker>
                <marker id="aC" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#06b6d4" /></marker>
                <marker id="aO" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#f97316" /></marker>
                <marker id="aPk" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#ec4899" /></marker>
                {showFlowAnimation && <style>{`@keyframes ff{to{stroke-dashoffset:-40}}@keyframes fr{to{stroke-dashoffset:40}}.ff{stroke-dasharray:12 8;animation:ff 1.5s linear infinite}.fr{stroke-dasharray:12 8;animation:fr 1.5s linear infinite}`}</style>}
              </defs>
              <text x="510" y="30" textAnchor="middle" fill={t.tM} fontSize="14" fontWeight="600">{diagramMode} Circuit Diagram</text>

              {/* PATIENT */}
              <g onClick={() => setHoveredComponent("access")} style={{ cursor: "pointer" }}>
                <rect x="30" y="270" width="130" height="110" rx="16" fill={t.bgC} stroke="#ef4444" strokeWidth={hoveredComponent==="access"?3:2} />
                <text x="95" y="305" textAnchor="middle" fill="#ef4444" fontSize="15" fontWeight="700">PATIENT</text>
                <text x="95" y="325" textAnchor="middle" fill={t.t2} fontSize="11">Dual-Lumen Catheter</text>
                <text x="95" y="345" textAnchor="middle" fill={t.tM} fontSize="10">(R IJ preferred)</text>
                <text x="95" y="365" textAnchor="middle" fill={t.tM} fontSize="9">11.5–13.5 Fr</text>
              </g>
              <line x1="160" y1="300" x2="240" y2="300" stroke="#ef4444" strokeWidth="3" markerEnd="url(#aR)" className={showFlowAnimation?"ff":""} />
              <text x="200" y="290" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="600">"Arterial"</text>

              {/* Access pressure */}
              <g onClick={() => setHoveredComponent("pressures")} style={{ cursor: "pointer" }}>
                <rect x="210" y="245" width="50" height="24" rx="4" fill={t.bgS} stroke={t.tM} strokeWidth="1" />
                <text x="235" y="261" textAnchor="middle" fill={t.tM} fontSize="9" fontWeight="600">P_acc</text>
              </g>

              {/* BLOOD PUMP */}
              <g onClick={() => setHoveredComponent("bloodpump")} style={{ cursor: "pointer" }}>
                <circle cx="290" cy="300" r="35" fill={t.bgC} stroke="#3b82f6" strokeWidth={hoveredComponent==="bloodpump"?3:2} />
                <text x="290" y="295" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="700">BLOOD</text>
                <text x="290" y="310" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="700">PUMP</text>
                <text x="290" y="345" textAnchor="middle" fill={t.tM} fontSize="9">150–300 mL/min</text>
              </g>
              <line x1="325" y1="300" x2="400" y2="300" stroke="#ef4444" strokeWidth="3" markerEnd="url(#aR)" className={showFlowAnimation?"ff":""} />

              {/* CITRATE */}
              <g onClick={() => setHoveredComponent("anticoag")} style={{ cursor: "pointer" }}>
                <rect x="340" y="185" width="120" height="60" rx="10" fill={t.bgC} stroke="#f97316" strokeWidth={hoveredComponent==="anticoag"?3:2} />
                <text x="400" y="210" textAnchor="middle" fill="#f97316" fontSize="12" fontWeight="700">CITRATE</text>
                <text x="400" y="228" textAnchor="middle" fill="#f97316" fontSize="10">Anticoagulation</text>
                <text x="400" y="242" textAnchor="middle" fill={t.tM} fontSize="9">Chelates Ca²⁺</text>
                <line x1="400" y1="245" x2="400" y2="290" stroke="#f97316" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#aO)" />
              </g>

              {/* PRE-FILTER */}
              {showConvection && <g onClick={() => setHoveredComponent("prefilter")} style={{ cursor: "pointer" }}>
                <rect x="445" y="170" width="130" height="65" rx="10" fill={t.bgC} stroke="#8b5cf6" strokeWidth={hoveredComponent==="prefilter"?3:2} />
                <text x="510" y="195" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="700">PRE-FILTER</text>
                <text x="510" y="211" textAnchor="middle" fill="#8b5cf6" fontSize="10">Replacement Fluid</text>
                <text x="510" y="228" textAnchor="middle" fill={t.tM} fontSize="9">Predilution (↑ filter life)</text>
                <line x1="510" y1="235" x2="510" y2="290" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#aP)" />
              </g>}

              {/* Pre-filter pressure */}
              <g onClick={() => setHoveredComponent("pressures")} style={{ cursor: "pointer" }}>
                <rect x="420" y="315" width="50" height="24" rx="4" fill={t.bgS} stroke={t.tM} strokeWidth="1" />
                <text x="445" y="331" textAnchor="middle" fill={t.tM} fontSize="9" fontWeight="600">P_pre</text>
              </g>

              {/* HEMOFILTER */}
              <g onClick={() => setHoveredComponent("hemofilter")} style={{ cursor: "pointer" }}>
                <rect x="490" y="275" width="200" height="120" rx="14" fill={t.bgC} stroke="#f59e0b" strokeWidth={hoveredComponent==="hemofilter"?3:2} />
                {[295,310,325,340,355,370,385].map((y,i)=><line key={i} x1="510" y1={y} x2="670" y2={y} stroke="#f59e0b" strokeWidth="0.5" opacity="0.2" />)}
                <text x="590" y="308" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="700">HEMOFILTER</text>
                <text x="590" y="328" textAnchor="middle" fill={t.t2} fontSize="11">Hollow-Fiber Membrane</text>
                <text x="590" y="345" textAnchor="middle" fill={t.tM} fontSize="10">MWCO: 20–50 kDa</text>
                <text x="590" y="360" textAnchor="middle" fill={t.tM} fontSize="9">Surface Area: 0.6–2.15 m²</text>
                {showConvection && <text x="590" y="378" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">↓ Convection ↓</text>}
                {showDialysate && <text x="590" y={showConvection?"388":"378"} textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="600">↕ Diffusion ↕</text>}
              </g>
              <line x1="460" y1="300" x2="490" y2="300" stroke="#ef4444" strokeWidth="3" className={showFlowAnimation?"ff":""} />
              <line x1="690" y1="300" x2="740" y2="300" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#aB)" className={showFlowAnimation?"ff":""} />
              <text x="715" y="288" textAnchor="middle" fill="#3b82f6" fontSize="9">Filtered</text>

              {/* DIALYSATE */}
              {showDialysate && <g onClick={() => setHoveredComponent("dialysate")} style={{ cursor: "pointer" }}>
                <rect x="510" y="425" width="160" height="65" rx="10" fill={t.bgC} stroke="#06b6d4" strokeWidth={hoveredComponent==="dialysate"?3:2} />
                <text x="590" y="448" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="700">DIALYSATE</text>
                <text x="590" y="465" textAnchor="middle" fill="#06b6d4" fontSize="10">Countercurrent Flow</text>
                <text x="590" y="482" textAnchor="middle" fill={t.tM} fontSize="9">1,000–2,000 mL/hr</text>
                <line x1="590" y1="425" x2="590" y2="400" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#aC)" className={showFlowAnimation?"fr":""} />
              </g>}

              {/* EFFLUENT */}
              <g onClick={() => setHoveredComponent("effluent")} style={{ cursor: "pointer" }}>
                <rect x="700" y="425" width="140" height="65" rx="10" fill={t.bgC} stroke="#10b981" strokeWidth={hoveredComponent==="effluent"?3:2} />
                <text x="770" y="448" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="700">EFFLUENT</text>
                <text x="770" y="465" textAnchor="middle" fill="#10b981" fontSize="10">Ultrafiltrate + Waste</text>
                <text x="770" y="482" textAnchor="middle" fill={t.tM} fontSize="9">20–25 mL/kg/hr</text>
                <line x1="670" y1="395" x2="710" y2="435" stroke="#10b981" strokeWidth="2" markerEnd="url(#aG)" className={showFlowAnimation?"ff":""} />
              </g>
              <g onClick={() => setHoveredComponent("pressures")} style={{ cursor: "pointer" }}>
                <rect x="700" y="398" width="50" height="24" rx="4" fill={t.bgS} stroke={t.tM} strokeWidth="1" />
                <text x="725" y="414" textAnchor="middle" fill={t.tM} fontSize="9" fontWeight="600">P_eff</text>
              </g>

              {/* POST-FILTER */}
              {showConvection && <g onClick={() => setHoveredComponent("postfilter")} style={{ cursor: "pointer" }}>
                <rect x="720" y="185" width="130" height="60" rx="10" fill={t.bgC} stroke="#ec4899" strokeWidth={hoveredComponent==="postfilter"?3:2} />
                <text x="785" y="210" textAnchor="middle" fill="#ec4899" fontSize="12" fontWeight="700">POST-FILTER</text>
                <text x="785" y="226" textAnchor="middle" fill="#ec4899" fontSize="10">Replacement Fluid</text>
                <text x="785" y="240" textAnchor="middle" fill={t.tM} fontSize="9">Postdilution (↑ clearance)</text>
                <line x1="760" y1="245" x2="760" y2="290" stroke="#ec4899" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#aPk)" />
              </g>}

              {/* BUBBLE TRAP */}
              <g onClick={() => setHoveredComponent("bubbletrap")} style={{ cursor: "pointer" }}>
                <rect x="790" y="270" width="110" height="55" rx="10" fill={t.bgC} stroke="#a855f7" strokeWidth={hoveredComponent==="bubbletrap"?3:2} />
                <text x="845" y="293" textAnchor="middle" fill="#a855f7" fontSize="11" fontWeight="700">AIR DETECTOR</text>
                <text x="845" y="308" textAnchor="middle" fill="#a855f7" fontSize="10">& Bubble Trap</text>
                <text x="845" y="322" textAnchor="middle" fill={t.tM} fontSize="9">Auto-clamp if air</text>
              </g>
              <g onClick={() => setHoveredComponent("pressures")} style={{ cursor: "pointer" }}>
                <rect x="910" y="280" width="50" height="24" rx="4" fill={t.bgS} stroke={t.tM} strokeWidth="1" />
                <text x="935" y="296" textAnchor="middle" fill={t.tM} fontSize="9" fontWeight="600">P_ret</text>
              </g>

              {/* RETURN LINE */}
              <line x1="900" y1="300" x2="930" y2="300" stroke="#3b82f6" strokeWidth="2" className={showFlowAnimation?"ff":""} />
              <polyline points="945,305 960,305 960,540 60,540 60,385" stroke="#3b82f6" strokeWidth="3" fill="none" markerEnd="url(#aB)" className={showFlowAnimation?"ff":""} />
              <text x="510" y="558" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="600">"Venous" Return Line → Patient</text>

              {/* Ca replacement */}
              <g onClick={() => setHoveredComponent("anticoag")} style={{ cursor: "pointer" }}>
                <rect x="860" y="350" width="120" height="48" rx="8" fill={t.bgC} stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,3" />
                <text x="920" y="370" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="600">Ca²⁺ REPLACEMENT</text>
                <text x="920" y="386" textAnchor="middle" fill={t.tM} fontSize="9">iCa²⁺ → 1.0–1.2</text>
              </g>

              {/* TMP box */}
              <rect x="780" y="42" width="220" height="55" rx="8" fill={t.bgC} stroke={t.bd} strokeWidth="1" />
              <text x="890" y="62" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="700">TMP = (P_pre + P_ret)/2 − P_eff</text>
              <text x="890" y="78" textAnchor="middle" fill={t.tM} fontSize="9">Normal: 100–250 mmHg</text>
              <text x="890" y="91" textAnchor="middle" fill="#ef4444" fontSize="9">&gt;250 = filter clotting</text>

              {/* LEGEND */}
              <rect x="30" y="580" width="960" height="60" rx="8" fill={t.bgH} stroke={t.bd} strokeWidth="1" />
              <text x="50" y="600" fill={t.tM} fontSize="11" fontWeight="600">LEGEND:</text>
              {[{c:"#ef4444",l:"Blood (withdraw)"},{c:"#3b82f6",l:"Blood (return)"},{c:"#f59e0b",l:"Hemofilter"},{c:"#8b5cf6",l:"Pre-dilution"},{c:"#ec4899",l:"Post-dilution"},{c:"#06b6d4",l:"Dialysate"},{c:"#10b981",l:"Effluent"},{c:"#f97316",l:"Anticoag"}].map((item,i) => (
                <g key={i}><rect x={50+i*118} y={612} width="12" height="12" rx="2" fill={item.c} /><text x={67+i*118} y={623} fill={t.t2} fontSize="10">{item.l}</text></g>
              ))}
            </svg>
          </div>

          {/* Detail Panel */}
          {hoveredComponent && componentInfo[hoveredComponent] && (
            <div style={{ marginTop: "20px", padding: "24px", background: t.bgC, borderRadius: "12px", borderLeft: `4px solid ${componentInfo[hoveredComponent].color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <h3 style={{ color: componentInfo[hoveredComponent].color, fontSize: "18px", fontWeight: 700, margin: "0 0 12px" }}>{componentInfo[hoveredComponent].title}</h3>
                <button onClick={() => setHoveredComponent(null)} style={{ background: t.bgS, border: "none", color: t.tM, cursor: "pointer", padding: "4px 10px", borderRadius: "4px", fontSize: "12px" }}>✕</button>
              </div>
              <p style={{ color: t.t2, fontSize: "14px", lineHeight: 1.8, margin: 0 }}>{componentInfo[hoveredComponent].detail}</p>
            </div>
          )}

          {/* FF callout */}
          <div style={{ marginTop: "20px", padding: "20px", background: t.bgC, borderRadius: "12px", border: `1px solid ${t.wn}40` }}>
            <div style={{ color: t.wn, fontWeight: 700, fontSize: "15px", marginBottom: "8px" }}>⚠ Filtration Fraction (FF)</div>
            <div style={{ fontFamily: "monospace", color: t.ac, fontSize: "15px", margin: "8px 0 12px", padding: "12px", background: t.bgH, borderRadius: "8px", textAlign: "center" }}>
              FF = UF Rate / Plasma Flow Rate | Plasma Flow = Blood Flow × (1 − Hct)
            </div>
            <p style={{ color: t.t2, fontSize: "14px", lineHeight: 1.7 }}>Keep FF <strong>&lt;20–25%</strong>. Higher fractions → hemoconcentration → protein aggregation → accelerated clotting. Predilution lowers FF by diluting blood before the filter.</p>
          </div>
        </div>}

        {/* ══ PRESCRIPTIONS ══ */}
        {activeTab === "prescriptions" && <div>
          <SH title="CRRT Prescription Components" />
          <div style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
            {[
              { t: "Modality", v: "CVVHDF (most common)", d: "CVVH for medium molecules, CVVHD for uremia/K⁺, CVVHDF for comprehensive clearance" },
              { t: "Blood Flow (Qb)", v: "150–250 mL/min", d: "Higher flow ↑ clearance but ↑ hemolysis. Start 150–200" },
              { t: "Dialysate Rate (Qd)", v: "1,000–2,000 mL/hr", d: "CVVHD/CVVHDF only. Total effluent target: 20–25 mL/kg/hr" },
              { t: "Replacement Fluid (Qr)", v: "1,000–3,000 mL/hr", d: "CVVH/CVVHDF. Typical: 2/3 pre, 1/3 post" },
              { t: "Net Ultrafiltration", v: "50–200 mL/hr", d: "NET fluid removed. Aggressive UF in shock worsens hemodynamics" },
              { t: "Effluent Dose (KDIGO)", v: "20–25 mL/kg/hr", d: "ATN + RENAL trials: NO benefit to higher-intensity (35–40 mL/kg/hr)" },
              { t: "Anticoagulation", v: "Regional citrate (preferred)", d: "Citrate pre-filter + Ca²⁺ systemically. Alt: heparin 500–1000 U/hr" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "18px", background: t.bgC, borderRadius: "8px", borderLeft: `4px solid ${t.ac}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px", flexWrap: "wrap", gap: "8px" }}>
                  <div style={{ fontSize: "14px", color: t.ac, fontWeight: 600 }}>{item.t}</div>
                  <div style={{ fontSize: "15px", color: t.tx, fontWeight: 700 }}>{item.v}</div>
                </div>
                <div style={{ fontSize: "13px", color: t.t2, lineHeight: 1.7 }}>{item.d}</div>
              </div>
            ))}
          </div>

          <SH title="Landmark Trials" />
          <div style={{ display: "grid", gap: "12px" }}>
            {[
              { trial: "ATN Trial (2008)", j: "NEJM", finding: "Intensive dosing (35 mL/kg/hr) NO mortality benefit over standard (20 mL/kg/hr).", take: "More is not better. Dose 20–25 mL/kg/hr." },
              { trial: "RENAL Trial (2009)", j: "NEJM", finding: "Confirmed ATN internationally. Higher-intensity CRRT did not reduce 90-day mortality.", take: "International validation of standard dosing." },
              { trial: "STARRT-AKI (2020)", j: "NEJM", finding: "Early RRT did NOT reduce 90-day mortality. More adverse events in early group.", take: "Don't rush — wait for clear clinical indication." },
              { trial: "AKIKI (2016)", j: "NEJM", finding: "Delayed RRT non-inferior. ~49% of delayed group never needed RRT at all.", take: "Patience — nearly half avoided dialysis entirely." },
            ].map((tr, i) => (
              <div key={i} style={{ padding: "16px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ background: t.aD, color: t.ac, padding: "2px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: 600 }}>{tr.trial}</span>
                  <span style={{ color: t.tM, fontSize: "12px" }}>{tr.j}</span>
                </div>
                <p style={{ color: t.t2, fontSize: "13px", lineHeight: 1.7, margin: "0 0 6px" }}>{tr.finding}</p>
                <p style={{ color: t.wn, fontSize: "12px", fontWeight: 600, margin: 0 }}>Takeaway: {tr.take}</p>
              </div>
            ))}
          </div>

          <SH title="Drug Dosing During CRRT" />
          <div style={{ padding: "20px", background: t.bgC, borderRadius: "8px", border: `1px solid ${t.bd}` }}>
            <p style={{ margin: "0 0 12px", color: t.t2, fontSize: "14px", lineHeight: 1.7 }}><strong style={{ color: t.ac }}>Significantly cleared:</strong> Vancomycin (reload after filter changes), pip-tazo, meropenem, cefepime, aminoglycosides, fluconazole — small molecules, low protein binding, low Vd.</p>
            <p style={{ margin: 0, color: t.t2, fontSize: "14px", lineHeight: 1.7 }}><strong style={{ color: t.wn }}>Minimally affected:</strong> Warfarin (~99% bound), phenytoin (~90%), amiodarone (Vd ~60 L/kg). Sieving coefficient ≈ 1 − fraction protein bound.</p>
          </div>
        </div>}

        {/* ══ TROUBLESHOOTING ══ */}
        {activeTab === "troubleshooting" && <div>
          <SH title="CRRT Alarm Troubleshooting" />
          <CB><p>Every alarm traces back to a pressure or flow derangement.</p></CB>
          <div style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
            {[
              { alarm: "High Access Pressure (very negative)", meaning: "Blood pump struggling to withdraw blood", causes: "Catheter kink/malposition, against vessel wall, intraluminal clot, hypovolemia", actions: "Reposition patient, flush access lumen, check kinks, CXR position, consider reversing lumens (↑ recirculation 10–20%)", color: "#ef4444" },
              { alarm: "High Return Pressure", meaning: "Resistance to blood returning to patient", causes: "Return lumen clot, kink, catheter malposition, air detector clamp engaged", actions: "Check kinks, flush return lumen, tPA lock (2 mg/2 mL × 30–60 min) for thrombosis. Catheter exchange if P_ret >300", color: "#3b82f6" },
              { alarm: "Rising TMP", meaning: "Filter clotting — effective surface area decreasing", causes: "Insufficient anticoagulation, high FF (>25%), low blood flow, inadequate predilution, circuit downtime", actions: "Check citrate + circuit iCa²⁺, verify FF <20%, increase predilution, increase blood flow. Filter change if TMP >300", color: "#f59e0b" },
              { alarm: "Air Detected", meaning: "Air in return line — auto-clamp activated", causes: "Loose pre-pump connection, cracked port, empty fluid bag", actions: "DO NOT override. Check all connections, ensure fluid bags have volume. De-air before resuming", color: "#a855f7" },
              { alarm: "Blood Leak", meaning: "Blood on effluent side — membrane rupture", causes: "Physical damage, excessive TMP, defective filter", actions: "STOP CRRT. Clamp lines. Discard filter — do NOT return blood. Replace entire circuit. Check hemolysis labs", color: "#dc2626" },
              { alarm: "Effluent Flow Low", meaning: "Less ultrafiltrate than prescribed", causes: "Filter clotting, effluent line kink/clot, dialysate bag empty", actions: "Check TMP trend, inspect effluent line. High TMP + low effluent = filter replacement", color: "#10b981" },
            ].map((a, i) => (
              <div key={i} style={{ padding: "20px", background: t.bgC, borderRadius: "12px", borderLeft: `4px solid ${a.color}` }}>
                <div style={{ color: a.color, fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>{a.alarm}</div>
                <div style={{ color: t.tx, fontSize: "13px", fontStyle: "italic", marginBottom: "10px" }}>{a.meaning}</div>
                <div style={{ marginBottom: "8px" }}><span style={{ color: t.tM, fontSize: "11px", textTransform: "uppercase" }}>Causes</span><p style={{ color: t.t2, fontSize: "13px", lineHeight: 1.7, margin: "4px 0 0" }}>{a.causes}</p></div>
                <div><span style={{ color: t.tM, fontSize: "11px", textTransform: "uppercase" }}>Actions</span><p style={{ color: t.t2, fontSize: "13px", lineHeight: 1.7, margin: "4px 0 0" }}>{a.actions}</p></div>
              </div>
            ))}
          </div>

          <SH title="Citrate Toxicity" />
          <div style={{ padding: "24px", background: t.bgC, borderRadius: "12px", border: `2px solid ${t.wn}` }}>
            <div style={{ color: t.wn, fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>⚠ Citrate Accumulation Syndrome</div>
            <div style={{ color: t.t2, fontSize: "14px", lineHeight: 1.8 }}>
              <p>In hepatic dysfunction/shock, citrate cannot be metabolized → accumulates.</p>
              <div style={{ padding: "14px", background: t.bgH, borderRadius: "8px", margin: "12px 0" }}>
                <p style={{ margin: "0 0 6px" }}><strong style={{ color: "#ef4444" }}>1. Rising total Ca²⁺ with LOW ionized Ca²⁺</strong> — sequestered in citrate complexes</p>
                <p style={{ margin: "0 0 6px" }}><strong style={{ color: "#ef4444" }}>2. Metabolic alkalosis</strong> — each citrate → 3 HCO₃⁻</p>
                <p style={{ margin: 0 }}><strong style={{ color: "#ef4444" }}>3. Total Ca²⁺ / iCa²⁺ ratio &gt;2.5</strong> — most specific marker</p>
              </div>
              <p><strong style={{ color: t.tx }}>Manage:</strong> Stop citrate, switch to heparin, replace iCa²⁺, assess hepatic function. Monitor ratio q4–6hr.</p>
            </div>
          </div>
        </div>}

        {/* ══ PEARLS ══ */}
        {activeTab === "pearls" && <div>
          <SH title="CRRT Clinical Pearls" />
          <PC number={1} title="Filter Life Is Your Quality Metric">Target 40–72 hours. Filters &lt;24 hr = inadequate anticoagulation, excessive FF, or circuit issues. Predilution extends life at ~15–20% clearance cost — worth it because downtime kills clearance too.</PC>
          <PC number={2} title="Downtime Destroys Your Dose">25 mL/kg/hr prescribed but 18 hr/day runtime = effective dose ~19 mL/kg/hr (below KDIGO). Prescribe 25–30% above target. ATN + RENAL: delivered doses were 15–20% lower than prescribed.</PC>
          <PC number={3} title="Thermoregulation">CRRT removes body heat continuously. Hypothermia masks fever (missing sepsis), causes coagulopathy, left-shifts O₂-Hb curve. Activate blood warmer. Monitor core temp.</PC>
          <PC number={4} title="Electrolyte Shifts">Hypophosphatemia is #1 complication — PO₄ (97 Da) freely filtered. Severe (&lt;1.0): respiratory muscle weakness, cardiac dysfunction, hemolysis. Check q6hr, replace aggressively. Monitor Mg²⁺ and K⁺.</PC>
          <PC number={5} title="Nutrition During CRRT">Protein losses 10–15 g/day. Increase to 1.5–2.5 g/kg/day. Replace water-soluble vitamins + trace elements. Do NOT restrict protein — old paradigm doesn't apply with extracorporeal clearance.</PC>
          <PC number={6} title="Antibiotic Dosing">Hydrophilic, low protein-binding drugs (vancomycin, beta-lactams, carbapenems) significantly cleared. Key pitfall: under-dosing in sepsis. Patient IS on renal replacement — dose to PK targets, not eGFR nomograms.</PC>
          <PC number={7} title="When to Stop">UOP &gt;400–500 mL/day without diuretics → trial off. Measure timed CrCl from native urine while CRRT runs. Some centers trial off 12–24 hr monitoring Cr, K⁺, volume.</PC>
        </div>}

        {/* ══ INTERVIEW ══ */}
        {activeTab === "interview" && <div>
          <SH title="Interview Angles" />
          <CB><p>Expect scenario-based questions testing clinical reasoning.</p></CB>
          <div style={{ display: "grid", gap: "16px", marginTop: "16px" }}>
            {[
              { q: "Patient in septic shock on 3 pressors, Cr 6.2, K⁺ 6.8. Why CRRT over IHD?", a: "Hemodynamic instability — IHD's rapid fluid shifts (300–500 mL/min, 3–4hr) cause hypotension in a patient on 3 pressors. CRRT runs continuously at 150–200 mL/min with titrated UF of 50–100 mL/hr. For hyperkalemia: CVVHDF with K⁺-free dialysate for efficient diffusive K⁺ clearance while maintaining CV stability.", f: "How do you manage norepinephrine during CRRT? Vancomycin dosing?" },
              { q: "Explain diffusion vs. convection clinically.", a: "Diffusion: concentration gradient → small molecules (urea 60 Da, Cr 113 Da, K⁺ 39 Da). Convection: solvent drag → medium molecules (IL-6 21 kDa, myoglobin 17 kDa). CVVH preferred in rhabdo because myoglobin needs convective clearance — too large for efficient diffusion.", f: "Vancomycin (1,450 Da) — diffusion, convection, or both?" },
              { q: "Filter clotting every 8–12 hours. Troubleshoot.", a: "Systematic: (1) Anticoagulation — circuit iCa²⁺? Citrate rate? (2) FF >25%? Increase predilution/reduce UF. (3) Blood flow <150? Stagnation. (4) Catheter dysfunction? High access pressures = turbulent flow. (5) Patient factors — hypercoagulable? (6) Downtime — stasis → clotting.", f: "FF calculation? How does predilution change it?" },
              { q: "Total Ca 12.2 but iCa 0.8 on citrate. What's happening?", a: "Citrate accumulation. Ratio >2.5 is the hallmark. Impaired hepatic metabolism → citrate chelates systemic iCa²⁺ (drops it) while citrate-Ca complexes raise total Ca²⁺. Stop citrate, switch to heparin, replace iCa²⁺ with CaCl₂, expect metabolic alkalosis, assess liver function.", f: "How do you monitor proactively?" },
              { q: "STARRT-AKI showed early RRT didn't help. Clinical impact?", a: "STARRT-AKI (2020) + AKIKI (2016): watchful waiting approach. No mortality benefit from early initiation, more adverse events, and 49% of AKIKI delayed group never needed RRT. Initiate for: refractory hyperkalemia, pH <7.15, uremic complications, fluid overload unresponsive to diuretics.", f: "Specific indications for immediate RRT?" },
            ].map((item, i) => (
              <div key={i} style={{ padding: "22px", background: t.bgC, borderRadius: "12px", border: `1px solid ${t.bd}` }}>
                <div style={{ fontSize: "15px", color: t.tx, fontWeight: 600, marginBottom: "14px", lineHeight: 1.6 }}>
                  <span style={{ color: t.wn, marginRight: "8px" }}>Q{i+1}:</span>{item.q}
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <span style={{ display: "inline-block", background: t.aD, color: t.ac, padding: "2px 10px", borderRadius: "12px", fontSize: "11px", fontWeight: 600, marginBottom: "8px" }}>Strong Answer</span>
                  <p style={{ color: t.t2, fontSize: "14px", lineHeight: 1.8, margin: 0 }}>{item.a}</p>
                </div>
                <div style={{ padding: "10px 14px", background: t.bgH, borderRadius: "8px", borderLeft: `3px solid ${t.wn}` }}>
                  <span style={{ color: t.wn, fontSize: "12px", fontWeight: 600 }}>Follow-up: </span>
                  <span style={{ color: t.t2, fontSize: "13px" }}>{item.f}</span>
                </div>
              </div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  );
}
CRRT_COMPONENT

echo ""
echo "✅ CRRTDevice component appended to file."
echo ""
echo "═══════════════════════════════════════════════"
echo "Running verification..."
echo "═══════════════════════════════════════════════"

# Quick sanity checks
echo "File size: $(wc -l < "$FILE") lines"
echo "CRRTDevice defined: $(grep -c 'function CRRTDevice' "$FILE")"
echo "deviceView state: $(grep -c 'deviceView' "$FILE")"
echo "oDev function: $(grep -c 'oDev' "$FILE")"
echo "device routing: $(grep -c 'pg === \"device\"' "$FILE")"

echo ""
echo "═══════════════════════════════════════════════"
echo "✅ Integration complete!"
echo ""
echo "Next steps:"
echo "  git add -A"
echo "  git commit -m 'Add CRRT device page with interactive circuit diagram'"
echo "  git push"
echo ""
echo "Backup saved as: ${FILE}.bak"
echo "═══════════════════════════════════════════════"
