import { useState } from "react";

function CRRTDevice({ t, theme }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [dm, setDm] = useState("CVVHDF");
  const [hc, setHc] = useState(null);
  const [fl, setFl] = useState(true);
  const tabs=[{id:"overview",label:"Overview & Principles"},{id:"modalities",label:"CRRT Modalities"},{id:"circuit",label:"Interactive Circuit"},{id:"prescriptions",label:"Prescriptions & Dosing"},{id:"troubleshooting",label:"Troubleshooting"},{id:"pearls",label:"Clinical Pearls"},{id:"interview",label:"Interview Angles"}];
  const ci={
    access:{title:"Vascular Access Catheter",detail:"Large-bore dual-lumen dialysis catheter (11.5\u201313.5 Fr) in IJ (preferred), femoral, or subclavian. Right IJ ideal \u2014 straight path to SVC, low recirculation (~5%). Femoral: higher recirculation (10\u201315%) and infection risk. Subclavian: stenosis risk \u2014 avoid if future AV fistula needed.",color:"#ef4444"},
    bloodpump:{title:"Blood Pump (Peristaltic Roller)",detail:"Peristaltic roller pump at 150\u2013300 mL/min (typical 200). Compresses tubing against raceway \u2014 no direct pump-blood contact, reducing hemolysis. Higher flow improves convective clearance but increases TMP and hemolysis risk.",color:"#3b82f6"},
    prefilter:{title:"Pre-Filter Replacement Fluid",detail:"Predilution: sterile bicarbonate-buffered fluid infused BEFORE the hemofilter. Dilutes blood \u2192 reduces hematocrit in fibers \u2192 extends filter life. Trade-off: clearance drops ~15\u201320%. Compensate with increased volume. Preferred in most ICUs for filter longevity.",color:"#8b5cf6"},
    hemofilter:{title:"Hemofilter (Dialyzer)",detail:"Hollow-fiber membrane cartridge (polysulfone or AN69, MWCO ~20\u201350 kDa). Blood inside fibers; dialysate countercurrent outside. DIFFUSION: concentration gradient for small solutes. CONVECTION: solvent drag for medium molecules up to ~50 kDa. Surface area 0.6\u20132.15 m\u00B2. AN69 can adsorb cytokines but causes bradykinin release with ACE inhibitors.",color:"#f59e0b"},
    dialysate:{title:"Dialysate Fluid",detail:"Countercurrent flow in CVVHD/CVVHDF. Na\u207A ~140, K\u207A 0\u20134, Ca\u00B2\u207A 0\u20133, HCO\u2083\u207B 22\u201335. Flow: 1,000\u20132,000 mL/hr. K\u207A 0 for severe hyperkalemia; K\u207A 2\u20134 to prevent overcorrection.",color:"#06b6d4"},
    effluent:{title:"Effluent (Ultrafiltrate)",detail:"Collects UF + spent dialysate + replacement fluid. Total rate = replacement + dialysate + net UF. Blood-tinged = membrane rupture. Decreasing rate = clotting. KDIGO target: 20\u201325 mL/kg/hr.",color:"#10b981"},
    postfilter:{title:"Post-Filter Replacement Fluid",detail:"Postdilution: fluid AFTER hemofilter. Undiluted blood = maximal clearance but higher hematocrit in fibers \u2192 accelerated clotting. Keep FF <20\u201325%. Many protocols: 2/3 pre + 1/3 post.",color:"#ec4899"},
    anticoag:{title:"Anticoagulation",detail:"Regional citrate preferred (KDIGO). Trisodium citrate 4% pre-filter chelates iCa\u00B2\u207A (needed for Factors II, VII, IX, X). Circuit iCa\u00B2\u207A target <0.35. CaCl\u2082 infused systemically to restore iCa\u00B2\u207A 1.0\u20131.2. Alt: heparin 500\u20131000 U/hr, aPTT 40\u201345s.",color:"#f97316"},
    bubbletrap:{title:"Air Detector & Bubble Trap",detail:"Ultrasonic detector on return line. Air >0.1 mL \u2192 alarm + auto-clamp. Gravity separation traps air; de-aired blood exits bottom.",color:"#a855f7"},
    pressures:{title:"Pressure Monitoring",detail:"(1) ACCESS: negative (\u221250 to \u2212200; more negative = catheter dysfunction). (2) PRE-FILTER: rising = clotting. (3) EFFLUENT: filtrate side. (4) RETURN: +50 to +250; elevated = occlusion. TMP = [(P_pre+P_ret)/2]\u2212P_eff. TMP >250 = significant clotting.",color:"#64748b"}
  };
  const sC=dm!=="CVVHD",sD=dm!=="CVVH";
  const H=({title})=><h2 style={{color:t.tx,fontSize:"22px",fontWeight:600,marginTop:"32px",marginBottom:"16px",paddingBottom:"8px",borderBottom:`1px solid ${t.bd}`}}>{title}</h2>;
  const B=({children})=><div style={{lineHeight:1.8,fontSize:"15px",color:t.t2}}>{children}</div>;
  const HL=({children})=><span style={{color:t.ac,fontWeight:600}}>{children}</span>;
  const Pl=({number,title,children})=><div style={{padding:"20px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`,marginBottom:"12px"}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}><span style={{background:t.aD,color:t.ac,padding:"2px 10px",borderRadius:"12px",fontSize:"12px",fontWeight:600}}>Pearl #{number}</span><span style={{color:t.tx,fontWeight:600,fontSize:"15px"}}>{title}</span></div><p style={{color:t.t2,fontSize:"14px",lineHeight:1.7,margin:0}}>{children}</p></div>;

  return (<div style={{maxWidth:"1100px",margin:"0 auto",padding:"24px 16px"}}>
    <div style={{background:t.hd,borderBottom:`2px solid ${t.ac}`,padding:"32px 28px 24px",borderRadius:"12px 12px 0 0"}}>
      <div style={{display:"flex",alignItems:"baseline",gap:"16px",marginBottom:"8px",flexWrap:"wrap"}}>
        <h1 style={{margin:0,fontSize:"32px",fontWeight:700,color:t.tx}}>Continuous Renal Replacement Therapy</h1>
        <span style={{fontSize:"16px",color:t.tM}}>(CRRT)</span>
      </div>
      <div style={{display:"flex",gap:"10px",flexWrap:"wrap",marginTop:"12px"}}>
        {["Renal Replacement","Extracorporeal Circuit","Hemofiltration / Hemodialysis","ICU Device"].map(tg=><span key={tg} style={{background:t.aD,border:`1px solid ${t.aB}`,color:t.ac,padding:"4px 14px",borderRadius:"20px",fontSize:"13px",fontWeight:500}}>{tg}</span>)}
      </div>
    </div>
    <div style={{display:"flex",gap:"2px",padding:"0 8px",background:t.bgH,borderBottom:`1px solid ${t.bd}`,overflowX:"auto"}}>
      {tabs.map(tb=><button key={tb.id} onClick={()=>setActiveTab(tb.id)} style={{padding:"14px 18px",background:activeTab===tb.id?t.bgC:"transparent",color:activeTab===tb.id?t.ac:t.tM,border:"none",borderBottom:activeTab===tb.id?`2px solid ${t.ac}`:"2px solid transparent",cursor:"pointer",fontSize:"13px",fontWeight:activeTab===tb.id?600:400,whiteSpace:"nowrap",transition:"all 0.2s"}}>{tb.label}</button>)}
    </div>
    <div style={{padding:"24px 0"}}>

    {activeTab==="overview"&&<div>
      <H title="What Is CRRT?" />
      <B><p>Continuous Renal Replacement Therapy (CRRT) is a slow, continuous extracorporeal blood purification technique used in hemodynamically unstable ICU patients who cannot tolerate conventional intermittent hemodialysis (IHD). Unlike IHD &mdash; which removes solutes and fluid over 3&ndash;4 hours causing rapid osmotic and volume shifts &mdash; CRRT operates 24 hours/day at low blood flow rates (150&ndash;300 mL/min vs. 300&ndash;500 mL/min for IHD), providing <HL>gradual, hemodynamically stable solute and fluid removal</HL>.</p>
      <p style={{marginTop:"16px"}}>CRRT is preferred for AKI complicated by hemodynamic instability, refractory fluid overload, severe electrolyte derangements (hyperkalemia, metabolic acidosis), or uremia with encephalopathy. KDIGO recommends initiating RRT when life-threatening changes in fluid, electrolyte, or acid-base balance exist &mdash; but there is no single creatinine or BUN threshold that mandates initiation.</p></B>
      <H title="The Two Clearance Mechanisms" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",margin:"12px 0"}}>
        <div style={{padding:"24px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.bl}`}}>
          <div style={{fontSize:"16px",color:t.bl,fontWeight:700,marginBottom:"10px"}}>Diffusion</div>
          <div style={{fontSize:"14px",color:t.t2,lineHeight:1.8}}>Solutes move across a semipermeable membrane <strong style={{color:t.tx}}>down their concentration gradient</strong> (Fick&rsquo;s Law). Highly effective for <strong style={{color:t.tx}}>small molecules (&lt;500 Da)</strong> &mdash; urea, creatinine, K&#8314;. Clearance depends on membrane surface area, concentration gradient, thickness, and molecular weight.</div>
        </div>
        <div style={{padding:"24px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.wn}`}}>
          <div style={{fontSize:"16px",color:t.wn,fontWeight:700,marginBottom:"10px"}}>Convection (Solvent Drag)</div>
          <div style={{fontSize:"14px",color:t.t2,lineHeight:1.8}}>Water pushed across membrane by <strong style={{color:t.tx}}>hydrostatic pressure</strong> (TMP) carries dissolved solutes. Independent of concentration gradients. Superior for <strong style={{color:t.tx}}>medium molecules (500&ndash;50,000 Da)</strong> &mdash; cytokines, &#946;&#8322;-microglobulin, myoglobin. Sieving coefficient: 1.0 = freely filtered.</div>
        </div>
      </div>
      <H title="Key Physics" />
      <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.bd}`,textAlign:"center"}}>
        <div style={{fontSize:"18px",color:t.ac,fontWeight:700,fontFamily:"monospace",marginBottom:"12px"}}>Jv = Kuf &times; TMP</div>
        <div style={{fontSize:"14px",color:t.t2}}>Jv = ultrafiltration rate (mL/hr) | Kuf = membrane coefficient | TMP = transmembrane pressure</div>
        <div style={{fontSize:"16px",color:t.wn,fontWeight:600,fontFamily:"monospace",marginTop:"16px"}}>TMP = [(P_in + P_out) / 2] &minus; P_effluent</div>
        <div style={{fontSize:"13px",color:t.tM,marginTop:"8px"}}>Rising TMP = filter clotting. TMP &gt;250&ndash;300 mmHg = filter nearing failure</div>
      </div>
      <H title="CRRT vs. IHD" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
        {[{label:"Hemodynamic Stability",crrt:"Minimal fluid shifts &mdash; tolerated in shock",ihd:"Rapid ultrafiltration causes hypotension"},{label:"Duration",crrt:"Continuous (24 hr/day)",ihd:"Intermittent (3&ndash;4 hr sessions)"},{label:"Blood Flow",crrt:"150&ndash;300 mL/min",ihd:"300&ndash;500 mL/min"},{label:"Fluid Removal",crrt:"Precise, programmable (mL/hr)",ihd:"Large volumes removed quickly"},{label:"Best For",crrt:"Unstable, cerebral edema, liver failure",ihd:"Stable patients, outpatient"},{label:"Drug Clearance",crrt:"Continuous &mdash; adjust doses x24hr",ihd:"Intermittent &mdash; dose after sessions"}].map((r,i)=>(
          <div key={i} style={{padding:"14px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`}}>
            <div style={{fontSize:"11px",color:t.tM,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"8px"}}>{r.label}</div>
            <div style={{fontSize:"13px",marginBottom:"4px"}}><span style={{color:t.ac,fontWeight:600}}>CRRT:</span> <span style={{color:t.tx}}>{r.crrt}</span></div>
            <div style={{fontSize:"13px"}}><span style={{color:t.wn,fontWeight:600}}>IHD:</span> <span style={{color:t.t2}}>{r.ihd}</span></div>
          </div>))}
      </div>
    </div>}

    {activeTab==="modalities"&&<div>
      <H title="CRRT Modalities" />
      <B><p>Naming: <strong style={{color:t.tx}}>C</strong>=Continuous, <strong style={{color:t.tx}}>VV</strong>=Veno-Venous, then the clearance method.</p></B>
      <div style={{display:"grid",gap:"20px",marginTop:"20px"}}>
        {[{tag:"CVVH",name:"Continuous VV Hemofiltration",color:t.wn,mech:"Convection only. No dialysate. Hydrostatic pressure drives plasma water + solutes across membrane (solvent drag). Large UF volumes replaced with sterile fluid.",best:"Medium molecules (cytokines, myoglobin, beta-2-microglobulin). Rhabdomyolysis.",limit:"Less efficient for small molecules. Higher replacement volumes."},{tag:"CVVHD",name:"Continuous VV Hemodialysis",color:t.bl,mech:"Diffusion only. Dialysate countercurrent. Solutes move down concentration gradients. No replacement fluid needed.",best:"Small molecules &mdash; urea, creatinine, K+, phosphorus. Uremia, hyperkalemia. Simpler setup.",limit:"Poor medium/large molecule clearance."},{tag:"CVVHDF",name:"Continuous VV Hemodiafiltration",color:t.ac,mech:"Diffusion + Convection. Most common. Combines dialysate with replacement fluid + UF. Broadest clearance spectrum.",best:"Most ICU AKI patients. Comprehensive small + medium molecule clearance. Default modality.",limit:"Complex &mdash; needs both dialysate and replacement fluid. Higher cost."}].map((m,i)=>(
          <div key={i} style={{padding:"24px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${m.color}`}}>
            <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"12px"}}>
              <span style={{background:`${m.color}20`,color:m.color,padding:"4px 14px",borderRadius:"20px",fontSize:"14px",fontWeight:700}}>{m.tag}</span>
              <span style={{color:t.tx,fontSize:"17px",fontWeight:600}}>{m.name}</span>
            </div>
            <div style={{color:t.t2,fontSize:"14px",lineHeight:1.8}}>
              <p><strong style={{color:m.color}}>Mechanism:</strong> {m.mech}</p>
              <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Best for:</strong> {m.best}</p>
              <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Limitation:</strong> {m.limit}</p>
            </div>
          </div>))}
      </div>
      <H title="SCUF" />
      <B><p>Slow Continuous Ultrafiltration: convection only at very low rates (100&ndash;300 mL/hr), no replacement, no dialysate. Sole purpose: fluid removal in diuretic-resistant CHF. Negligible solute clearance.</p></B>
    </div>}

    {activeTab==="circuit"&&<div>
      <H title="CRRT Extracorporeal Circuit" />
      <B><p>Click any component for detailed information. Toggle modalities to see circuit changes.</p></B>
      <div style={{display:"flex",gap:"8px",margin:"16px 0 24px",flexWrap:"wrap"}}>
        {["CVVHDF","CVVH","CVVHD"].map(mode=><button key={mode} onClick={()=>setDm(mode)} style={{padding:"10px 24px",background:dm===mode?t.ac:t.bgS,color:dm===mode?t.acTx:t.t2,border:"none",borderRadius:"8px",cursor:"pointer",fontSize:"14px",fontWeight:600}}>{mode}</button>)}
        <button onClick={()=>setFl(!fl)} style={{padding:"10px 20px",background:fl?t.aD:t.bgS,color:fl?t.ac:t.tM,border:`1px solid ${fl?t.ac:t.bd}`,borderRadius:"8px",cursor:"pointer",fontSize:"13px",marginLeft:"auto"}}>{fl?"Flow On":"Flow Off"}</button>
      </div>
      <div style={{background:theme==="dark"?"#0d1117":"#f8fafc",borderRadius:"16px",border:`1px solid ${t.bd}`,padding:"16px",overflow:"auto"}}>
        <svg viewBox="0 0 1020 660" style={{width:"100%",height:"auto",minHeight:"450px"}}>
          <defs>
            <marker id="cR" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#ef4444"/></marker>
            <marker id="cB" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#3b82f6"/></marker>
            <marker id="cG" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#10b981"/></marker>
            <marker id="cP" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#8b5cf6"/></marker>
            <marker id="cC" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#06b6d4"/></marker>
            <marker id="cO" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#f97316"/></marker>
            <marker id="cPk" viewBox="0 0 10 7" refX="10" refY="3.5" markerWidth="8" markerHeight="6" orient="auto"><polygon points="0 0,10 3.5,0 7" fill="#ec4899"/></marker>
            {fl&&<style>{`@keyframes cff{to{stroke-dashoffset:-40}}@keyframes cfr{to{stroke-dashoffset:40}}.cff{stroke-dasharray:12 8;animation:cff 1.5s linear infinite}.cfr{stroke-dasharray:12 8;animation:cfr 1.5s linear infinite}`}</style>}
          </defs>
          <text x="510" y="30" textAnchor="middle" fill={t.tM} fontSize="14" fontWeight="600">{dm} Circuit Diagram</text>
          <g onClick={()=>setHc("access")} style={{cursor:"pointer"}}><rect x="30" y="270" width="130" height="110" rx="16" fill={t.bgC} stroke="#ef4444" strokeWidth={hc==="access"?3:2}/><text x="95" y="305" textAnchor="middle" fill="#ef4444" fontSize="15" fontWeight="700">PATIENT</text><text x="95" y="325" textAnchor="middle" fill={t.t2} fontSize="11">Dual-Lumen Catheter</text><text x="95" y="345" textAnchor="middle" fill={t.tM} fontSize="10">(R IJ preferred)</text><text x="95" y="365" textAnchor="middle" fill={t.tM} fontSize="9">11.5&ndash;13.5 Fr</text></g>
          <line x1="160" y1="300" x2="240" y2="300" stroke="#ef4444" strokeWidth="3" markerEnd="url(#cR)" className={fl?"cff":""}/>
          <text x="200" y="290" textAnchor="middle" fill="#ef4444" fontSize="10" fontWeight="600">&ldquo;Arterial&rdquo;</text>
          <g onClick={()=>setHc("pressures")} style={{cursor:"pointer"}}><rect x="210" y="245" width="50" height="24" rx="4" fill={t.bgS} stroke={t.tM} strokeWidth="1"/><text x="235" y="261" textAnchor="middle" fill={t.tM} fontSize="9" fontWeight="600">P_acc</text></g>
          <g onClick={()=>setHc("bloodpump")} style={{cursor:"pointer"}}><circle cx="290" cy="300" r="35" fill={t.bgC} stroke="#3b82f6" strokeWidth={hc==="bloodpump"?3:2}/><text x="290" y="295" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="700">BLOOD</text><text x="290" y="310" textAnchor="middle" fill="#3b82f6" fontSize="11" fontWeight="700">PUMP</text><text x="290" y="345" textAnchor="middle" fill={t.tM} fontSize="9">150&ndash;300 mL/min</text></g>
          <line x1="325" y1="300" x2="400" y2="300" stroke="#ef4444" strokeWidth="3" markerEnd="url(#cR)" className={fl?"cff":""}/>
          <g onClick={()=>setHc("anticoag")} style={{cursor:"pointer"}}><rect x="340" y="185" width="120" height="60" rx="10" fill={t.bgC} stroke="#f97316" strokeWidth={hc==="anticoag"?3:2}/><text x="400" y="210" textAnchor="middle" fill="#f97316" fontSize="12" fontWeight="700">CITRATE</text><text x="400" y="228" textAnchor="middle" fill="#f97316" fontSize="10">Anticoagulation</text><line x1="400" y1="245" x2="400" y2="290" stroke="#f97316" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#cO)"/></g>
          {sC&&<g onClick={()=>setHc("prefilter")} style={{cursor:"pointer"}}><rect x="445" y="170" width="130" height="65" rx="10" fill={t.bgC} stroke="#8b5cf6" strokeWidth={hc==="prefilter"?3:2}/><text x="510" y="195" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="700">PRE-FILTER</text><text x="510" y="211" textAnchor="middle" fill="#8b5cf6" fontSize="10">Replacement Fluid</text><text x="510" y="228" textAnchor="middle" fill={t.tM} fontSize="9">Predilution</text><line x1="510" y1="235" x2="510" y2="290" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#cP)"/></g>}
          <g onClick={()=>setHc("pressures")} style={{cursor:"pointer"}}><rect x="420" y="315" width="50" height="24" rx="4" fill={t.bgS} stroke={t.tM} strokeWidth="1"/><text x="445" y="331" textAnchor="middle" fill={t.tM} fontSize="9" fontWeight="600">P_pre</text></g>
          <g onClick={()=>setHc("hemofilter")} style={{cursor:"pointer"}}><rect x="490" y="275" width="200" height="120" rx="14" fill={t.bgC} stroke="#f59e0b" strokeWidth={hc==="hemofilter"?3:2}/>{[295,310,325,340,355,370,385].map((y,i)=><line key={i} x1="510" y1={y} x2="670" y2={y} stroke="#f59e0b" strokeWidth="0.5" opacity="0.2"/>)}<text x="590" y="308" textAnchor="middle" fill="#f59e0b" fontSize="14" fontWeight="700">HEMOFILTER</text><text x="590" y="328" textAnchor="middle" fill={t.t2} fontSize="11">Hollow-Fiber Membrane</text><text x="590" y="345" textAnchor="middle" fill={t.tM} fontSize="10">MWCO: 20&ndash;50 kDa</text><text x="590" y="360" textAnchor="middle" fill={t.tM} fontSize="9">0.6&ndash;2.15 m&sup2;</text>{sC&&<text x="590" y="378" textAnchor="middle" fill="#f59e0b" fontSize="9" fontWeight="600">Convection</text>}{sD&&<text x="590" y={sC?"388":"378"} textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="600">Diffusion</text>}</g>
          <line x1="460" y1="300" x2="490" y2="300" stroke="#ef4444" strokeWidth="3" className={fl?"cff":""}/>
          <line x1="690" y1="300" x2="740" y2="300" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#cB)" className={fl?"cff":""}/>
          {sD&&<g onClick={()=>setHc("dialysate")} style={{cursor:"pointer"}}><rect x="510" y="425" width="160" height="65" rx="10" fill={t.bgC} stroke="#06b6d4" strokeWidth={hc==="dialysate"?3:2}/><text x="590" y="448" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="700">DIALYSATE</text><text x="590" y="465" textAnchor="middle" fill="#06b6d4" fontSize="10">Countercurrent Flow</text><text x="590" y="482" textAnchor="middle" fill={t.tM} fontSize="9">1,000&ndash;2,000 mL/hr</text><line x1="590" y1="425" x2="590" y2="400" stroke="#06b6d4" strokeWidth="2" markerEnd="url(#cC)" className={fl?"cfr":""}/></g>}
          <g onClick={()=>setHc("effluent")} style={{cursor:"pointer"}}><rect x="700" y="425" width="140" height="65" rx="10" fill={t.bgC} stroke="#10b981" strokeWidth={hc==="effluent"?3:2}/><text x="770" y="448" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="700">EFFLUENT</text><text x="770" y="465" textAnchor="middle" fill="#10b981" fontSize="10">Ultrafiltrate + Waste</text><text x="770" y="482" textAnchor="middle" fill={t.tM} fontSize="9">20&ndash;25 mL/kg/hr</text><line x1="670" y1="395" x2="710" y2="435" stroke="#10b981" strokeWidth="2" markerEnd="url(#cG)" className={fl?"cff":""}/></g>
          <g onClick={()=>setHc("pressures")} style={{cursor:"pointer"}}><rect x="700" y="398" width="50" height="24" rx="4" fill={t.bgS} stroke={t.tM} strokeWidth="1"/><text x="725" y="414" textAnchor="middle" fill={t.tM} fontSize="9" fontWeight="600">P_eff</text></g>
          {sC&&<g onClick={()=>setHc("postfilter")} style={{cursor:"pointer"}}><rect x="720" y="185" width="130" height="60" rx="10" fill={t.bgC} stroke="#ec4899" strokeWidth={hc==="postfilter"?3:2}/><text x="785" y="210" textAnchor="middle" fill="#ec4899" fontSize="12" fontWeight="700">POST-FILTER</text><text x="785" y="226" textAnchor="middle" fill="#ec4899" fontSize="10">Replacement Fluid</text><text x="785" y="240" textAnchor="middle" fill={t.tM} fontSize="9">Postdilution</text><line x1="760" y1="245" x2="760" y2="290" stroke="#ec4899" strokeWidth="2" strokeDasharray="5,3" markerEnd="url(#cPk)"/></g>}
          <g onClick={()=>setHc("bubbletrap")} style={{cursor:"pointer"}}><rect x="790" y="270" width="110" height="55" rx="10" fill={t.bgC} stroke="#a855f7" strokeWidth={hc==="bubbletrap"?3:2}/><text x="845" y="293" textAnchor="middle" fill="#a855f7" fontSize="11" fontWeight="700">AIR DETECTOR</text><text x="845" y="308" textAnchor="middle" fill="#a855f7" fontSize="10">&amp; Bubble Trap</text></g>
          <g onClick={()=>setHc("pressures")} style={{cursor:"pointer"}}><rect x="910" y="280" width="50" height="24" rx="4" fill={t.bgS} stroke={t.tM} strokeWidth="1"/><text x="935" y="296" textAnchor="middle" fill={t.tM} fontSize="9" fontWeight="600">P_ret</text></g>
          <line x1="900" y1="300" x2="930" y2="300" stroke="#3b82f6" strokeWidth="2" className={fl?"cff":""}/>
          <polyline points="945,305 960,305 960,540 60,540 60,385" stroke="#3b82f6" strokeWidth="3" fill="none" markerEnd="url(#cB)" className={fl?"cff":""}/>
          <text x="510" y="558" textAnchor="middle" fill="#3b82f6" fontSize="10" fontWeight="600">Return Line &rarr; Patient</text>
          <g onClick={()=>setHc("anticoag")} style={{cursor:"pointer"}}><rect x="860" y="350" width="120" height="48" rx="8" fill={t.bgC} stroke="#f97316" strokeWidth="1.5" strokeDasharray="4,3"/><text x="920" y="370" textAnchor="middle" fill="#f97316" fontSize="10" fontWeight="600">Ca&sup2;&#8314; REPLACEMENT</text><text x="920" y="386" textAnchor="middle" fill={t.tM} fontSize="9">iCa&sup2;&#8314; &rarr; 1.0&ndash;1.2</text></g>
          <rect x="780" y="42" width="220" height="55" rx="8" fill={t.bgC} stroke={t.bd} strokeWidth="1"/><text x="890" y="62" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="700">TMP = (P_pre + P_ret)/2 &minus; P_eff</text><text x="890" y="78" textAnchor="middle" fill={t.tM} fontSize="9">Normal: 100&ndash;250 mmHg</text><text x="890" y="91" textAnchor="middle" fill="#ef4444" fontSize="9">&gt;250 = filter clotting</text>
          <rect x="30" y="580" width="960" height="60" rx="8" fill={t.bgH} stroke={t.bd} strokeWidth="1"/>
          <text x="50" y="600" fill={t.tM} fontSize="11" fontWeight="600">LEGEND:</text>
          {[{c:"#ef4444",l:"Blood (withdraw)"},{c:"#3b82f6",l:"Blood (return)"},{c:"#f59e0b",l:"Hemofilter"},{c:"#8b5cf6",l:"Pre-dilution"},{c:"#ec4899",l:"Post-dilution"},{c:"#06b6d4",l:"Dialysate"},{c:"#10b981",l:"Effluent"},{c:"#f97316",l:"Anticoag"}].map((item,i)=><g key={i}><rect x={50+i*118} y={612} width="12" height="12" rx="2" fill={item.c}/><text x={67+i*118} y={623} fill={t.t2} fontSize="10">{item.l}</text></g>)}
        </svg>
      </div>
      {hc&&ci[hc]&&<div style={{marginTop:"20px",padding:"24px",background:t.bgC,borderRadius:"12px",borderLeft:`4px solid ${ci[hc].color}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}><h3 style={{color:ci[hc].color,fontSize:"18px",fontWeight:700,margin:"0 0 12px"}}>{ci[hc].title}</h3><button onClick={()=>setHc(null)} style={{background:t.bgS,border:"none",color:t.tM,cursor:"pointer",padding:"4px 10px",borderRadius:"4px",fontSize:"12px"}}>&#10005;</button></div>
        <p style={{color:t.t2,fontSize:"14px",lineHeight:1.8,margin:0}}>{ci[hc].detail}</p>
      </div>}
      <div style={{marginTop:"20px",padding:"20px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.wn}40`}}>
        <div style={{color:t.wn,fontWeight:700,fontSize:"15px",marginBottom:"8px"}}>Filtration Fraction (FF)</div>
        <div style={{fontFamily:"monospace",color:t.ac,fontSize:"15px",margin:"8px 0 12px",padding:"12px",background:t.bgH,borderRadius:"8px",textAlign:"center"}}>FF = UF Rate / Plasma Flow Rate &nbsp;|&nbsp; Plasma Flow = Blood Flow &times; (1 &minus; Hct)</div>
        <p style={{color:t.t2,fontSize:"14px",lineHeight:1.7}}>Keep FF <strong>&lt;20&ndash;25%</strong>. Higher fractions cause hemoconcentration, protein aggregation, and accelerated clotting. Predilution lowers FF by diluting blood before the filter.</p>
      </div>
    </div>}

    {activeTab==="prescriptions"&&<div>
      <H title="CRRT Prescription Components" />
      <div style={{display:"grid",gap:"16px",marginTop:"16px"}}>
        {[{t:"Modality",v:"CVVHDF (most common)",d:"CVVH for medium molecules, CVVHD for uremia/K+, CVVHDF for comprehensive clearance"},{t:"Blood Flow (Qb)",v:"150\u2013250 mL/min",d:"Higher flow increases clearance but also hemolysis. Start 150\u2013200"},{t:"Dialysate Rate (Qd)",v:"1,000\u20132,000 mL/hr",d:"CVVHD/CVVHDF only. Total effluent target: 20\u201325 mL/kg/hr"},{t:"Replacement Fluid (Qr)",v:"1,000\u20133,000 mL/hr",d:"CVVH/CVVHDF. Typical: 2/3 pre, 1/3 post"},{t:"Net Ultrafiltration",v:"50\u2013200 mL/hr",d:"NET fluid removed. Aggressive UF in shock worsens hemodynamics"},{t:"Effluent Dose (KDIGO)",v:"20\u201325 mL/kg/hr",d:"ATN + RENAL trials: NO benefit to higher-intensity (35\u201340 mL/kg/hr)"},{t:"Anticoagulation",v:"Regional citrate (preferred)",d:"Citrate pre-filter + Ca\u00B2\u207A systemically. Alt: heparin 500\u20131000 U/hr"}].map((item,i)=>(
          <div key={i} style={{padding:"18px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.ac}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:"6px",flexWrap:"wrap",gap:"8px"}}><div style={{fontSize:"14px",color:t.ac,fontWeight:600}}>{item.t}</div><div style={{fontSize:"15px",color:t.tx,fontWeight:700}}>{item.v}</div></div>
            <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>{item.d}</div>
          </div>))}
      </div>
      <H title="Landmark Trials" />
      <div style={{display:"grid",gap:"12px"}}>
        {[{trial:"ATN Trial (2008)",j:"NEJM",finding:"Intensive dosing (35 mL/kg/hr) NO mortality benefit over standard (20 mL/kg/hr).",take:"More is not better. Dose 20\u201325 mL/kg/hr."},{trial:"RENAL Trial (2009)",j:"NEJM",finding:"Confirmed ATN internationally. Higher-intensity CRRT did not reduce 90-day mortality.",take:"International validation of standard dosing."},{trial:"STARRT-AKI (2020)",j:"NEJM",finding:"Early RRT did NOT reduce 90-day mortality. More adverse events in early group.",take:"Don\u2019t rush \u2014 wait for clear clinical indication."},{trial:"AKIKI (2016)",j:"NEJM",finding:"Delayed RRT non-inferior. ~49% of delayed group never needed RRT at all.",take:"Patience \u2014 nearly half avoided dialysis entirely."}].map((tr,i)=>(
          <div key={i} style={{padding:"16px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`}}>
            <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}><span style={{background:t.aD,color:t.ac,padding:"2px 10px",borderRadius:"12px",fontSize:"12px",fontWeight:600}}>{tr.trial}</span><span style={{color:t.tM,fontSize:"12px"}}>{tr.j}</span></div>
            <p style={{color:t.t2,fontSize:"13px",lineHeight:1.7,margin:"0 0 6px"}}>{tr.finding}</p>
            <p style={{color:t.wn,fontSize:"12px",fontWeight:600,margin:0}}>Takeaway: {tr.take}</p>
          </div>))}
      </div>
      <H title="Drug Dosing During CRRT" />
      <div style={{padding:"20px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`}}>
        <p style={{margin:"0 0 12px",color:t.t2,fontSize:"14px",lineHeight:1.7}}><strong style={{color:t.ac}}>Significantly cleared:</strong> Vancomycin (reload after filter changes), pip-tazo, meropenem, cefepime, aminoglycosides, fluconazole &mdash; small molecules, low protein binding, low Vd.</p>
        <p style={{margin:0,color:t.t2,fontSize:"14px",lineHeight:1.7}}><strong style={{color:t.wn}}>Minimally affected:</strong> Warfarin (~99% bound), phenytoin (~90%), amiodarone (Vd ~60 L/kg). Sieving coefficient &asymp; 1 &minus; fraction protein bound.</p>
      </div>
    </div>}

    {activeTab==="troubleshooting"&&<div>
      <H title="CRRT Alarm Troubleshooting" />
      <div style={{display:"grid",gap:"16px",marginTop:"16px"}}>
        {[{alarm:"High Access Pressure (very negative)",meaning:"Blood pump struggling to withdraw",causes:"Catheter kink/malposition, against vessel wall, intraluminal clot, hypovolemia",actions:"Reposition patient, flush access lumen, check kinks, CXR position, consider reversing lumens (+10\u201320% recirculation)",color:"#ef4444"},{alarm:"High Return Pressure",meaning:"Resistance to blood returning",causes:"Return lumen clot, kink, catheter malposition",actions:"Check kinks, flush return lumen, tPA lock (2 mg/2 mL x 30\u201360 min). Catheter exchange if P_ret >300",color:"#3b82f6"},{alarm:"Rising TMP",meaning:"Filter clotting",causes:"Insufficient anticoagulation, high FF (>25%), low blood flow, inadequate predilution",actions:"Check citrate + circuit iCa2+, verify FF <20%, increase predilution/blood flow. Filter change if TMP >300",color:"#f59e0b"},{alarm:"Air Detected",meaning:"Air in return line \u2014 auto-clamp",causes:"Loose connection, cracked port, empty fluid bag",actions:"DO NOT override. Check all connections. De-air before resuming",color:"#a855f7"},{alarm:"Blood Leak",meaning:"Membrane rupture",causes:"Physical damage, excessive TMP, defective filter",actions:"STOP CRRT. Clamp lines. Discard filter \u2014 do NOT return blood. Replace circuit. Check hemolysis labs",color:"#dc2626"},{alarm:"Effluent Flow Low",meaning:"Less ultrafiltrate than prescribed",causes:"Filter clotting, effluent line kink/clot, dialysate bag empty",actions:"Check TMP trend. High TMP + low effluent = filter replacement",color:"#10b981"}].map((a,i)=>(
          <div key={i} style={{padding:"20px",background:t.bgC,borderRadius:"12px",borderLeft:`4px solid ${a.color}`}}>
            <div style={{color:a.color,fontSize:"15px",fontWeight:700,marginBottom:"4px"}}>{a.alarm}</div>
            <div style={{color:t.tx,fontSize:"13px",fontStyle:"italic",marginBottom:"10px"}}>{a.meaning}</div>
            <div style={{marginBottom:"8px"}}><span style={{color:t.tM,fontSize:"11px",textTransform:"uppercase"}}>Causes</span><p style={{color:t.t2,fontSize:"13px",lineHeight:1.7,margin:"4px 0 0"}}>{a.causes}</p></div>
            <div><span style={{color:t.tM,fontSize:"11px",textTransform:"uppercase"}}>Actions</span><p style={{color:t.t2,fontSize:"13px",lineHeight:1.7,margin:"4px 0 0"}}>{a.actions}</p></div>
          </div>))}
      </div>
      <H title="Citrate Toxicity" />
      <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",border:`2px solid ${t.wn}`}}>
        <div style={{color:t.wn,fontSize:"16px",fontWeight:700,marginBottom:"12px"}}>Citrate Accumulation Syndrome</div>
        <div style={{color:t.t2,fontSize:"14px",lineHeight:1.8}}>
          <p>In hepatic dysfunction/shock, citrate cannot be metabolized and accumulates.</p>
          <div style={{padding:"14px",background:t.bgH,borderRadius:"8px",margin:"12px 0"}}>
            <p style={{margin:"0 0 6px"}}><strong style={{color:"#ef4444"}}>1. Rising total Ca&sup2;&#8314; with LOW ionized Ca&sup2;&#8314;</strong> &mdash; sequestered in citrate complexes</p>
            <p style={{margin:"0 0 6px"}}><strong style={{color:"#ef4444"}}>2. Metabolic alkalosis</strong> &mdash; each citrate &rarr; 3 HCO&#8323;&sup2;</p>
            <p style={{margin:0}}><strong style={{color:"#ef4444"}}>3. Total Ca&sup2;&#8314; / iCa&sup2;&#8314; ratio &gt;2.5</strong> &mdash; most specific marker</p>
          </div>
          <p><strong style={{color:t.tx}}>Manage:</strong> Stop citrate, switch to heparin, replace iCa&sup2;&#8314;, assess hepatic function. Monitor ratio q4&ndash;6hr.</p>
        </div>
      </div>
    </div>}

    {activeTab==="pearls"&&<div>
      <H title="CRRT Clinical Pearls" />
      <Pl number={1} title="Filter Life Is Your Quality Metric">Target 40&ndash;72 hours. Filters &lt;24 hr = inadequate anticoagulation, excessive FF, or circuit issues. Predilution extends life at ~15&ndash;20% clearance cost &mdash; worth it because downtime kills clearance.</Pl>
      <Pl number={2} title="Downtime Destroys Your Dose">25 mL/kg/hr prescribed but 18 hr/day runtime = effective dose ~19 mL/kg/hr (below KDIGO). Prescribe 25&ndash;30% above target. ATN + RENAL: delivered doses were 15&ndash;20% lower than prescribed.</Pl>
      <Pl number={3} title="Thermoregulation">CRRT removes body heat continuously. Hypothermia masks fever (missing sepsis), causes coagulopathy, left-shifts O2-Hb curve. Activate blood warmer. Monitor core temp.</Pl>
      <Pl number={4} title="Electrolyte Shifts">Hypophosphatemia is #1 complication &mdash; PO4 (97 Da) freely filtered. Severe (&lt;1.0): respiratory muscle weakness, cardiac dysfunction, hemolysis. Check q6hr, replace aggressively.</Pl>
      <Pl number={5} title="Nutrition During CRRT">Protein losses 10&ndash;15 g/day. Increase to 1.5&ndash;2.5 g/kg/day. Replace water-soluble vitamins + trace elements. Do NOT restrict protein.</Pl>
      <Pl number={6} title="Antibiotic Dosing">Hydrophilic, low protein-binding drugs (vancomycin, beta-lactams, carbapenems) significantly cleared. Dose to PK targets, not eGFR nomograms.</Pl>
      <Pl number={7} title="When to Stop">UOP &gt;400&ndash;500 mL/day without diuretics. Measure timed CrCl from native urine while CRRT runs. Some centers trial off 12&ndash;24 hr monitoring Cr, K+, volume.</Pl>
    </div>}

    {activeTab==="interview"&&<div>
      <H title="Interview Angles" />
      <B><p>Expect scenario-based questions testing clinical reasoning.</p></B>
      <div style={{display:"grid",gap:"16px",marginTop:"16px"}}>
        {[{q:"Patient in septic shock on 3 pressors, Cr 6.2, K+ 6.8. Why CRRT over IHD?",a:"Hemodynamic instability \u2014 IHD\u2019s rapid fluid shifts (300\u2013500 mL/min, 3\u20134hr) cause hypotension in a patient on 3 pressors. CRRT runs continuously at 150\u2013200 mL/min with titrated UF of 50\u2013100 mL/hr. For hyperkalemia: CVVHDF with K+-free dialysate for efficient diffusive K+ clearance while maintaining CV stability.",f:"How do you manage norepinephrine during CRRT? Vancomycin dosing?"},{q:"Explain diffusion vs. convection clinically.",a:"Diffusion: concentration gradient \u2192 small molecules (urea 60 Da, Cr 113 Da, K+ 39 Da). Convection: solvent drag \u2192 medium molecules (IL-6 21 kDa, myoglobin 17 kDa). CVVH preferred in rhabdo because myoglobin needs convective clearance \u2014 too large for efficient diffusion.",f:"Vancomycin (1,450 Da) \u2014 diffusion, convection, or both?"},{q:"Filter clotting every 8\u201312 hours. Troubleshoot.",a:"Systematic: (1) Anticoagulation \u2014 circuit iCa2+? Citrate rate? (2) FF >25%? Increase predilution/reduce UF. (3) Blood flow <150? Stagnation. (4) Catheter dysfunction? (5) Patient hypercoagulable? (6) Downtime \u2192 stasis.",f:"FF calculation? How does predilution change it?"},{q:"Total Ca 12.2 but iCa 0.8 on citrate. What\u2019s happening?",a:"Citrate accumulation. Ratio >2.5 is the hallmark. Impaired hepatic metabolism \u2192 citrate chelates systemic iCa2+ while citrate-Ca complexes raise total Ca2+. Stop citrate, switch to heparin, replace iCa2+ with CaCl2, expect metabolic alkalosis.",f:"How do you monitor proactively?"},{q:"STARRT-AKI showed early RRT didn\u2019t help. Clinical impact?",a:"STARRT-AKI (2020) + AKIKI (2016): watchful waiting. No mortality benefit from early initiation, more adverse events, and 49% of AKIKI delayed group never needed RRT. Initiate for: refractory hyperkalemia, pH <7.15, uremic complications, fluid overload unresponsive to diuretics.",f:"Specific indications for immediate RRT?"}].map((item,i)=>(
          <div key={i} style={{padding:"22px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.bd}`}}>
            <div style={{fontSize:"15px",color:t.tx,fontWeight:600,marginBottom:"14px",lineHeight:1.6}}><span style={{color:t.wn,marginRight:"8px"}}>Q{i+1}:</span>{item.q}</div>
            <div style={{marginBottom:"14px"}}><span style={{display:"inline-block",background:t.aD,color:t.ac,padding:"2px 10px",borderRadius:"12px",fontSize:"11px",fontWeight:600,marginBottom:"8px"}}>Strong Answer</span><p style={{color:t.t2,fontSize:"14px",lineHeight:1.8,margin:0}}>{item.a}</p></div>
            <div style={{padding:"10px 14px",background:t.bgH,borderRadius:"8px",borderLeft:`3px solid ${t.wn}`}}><span style={{color:t.wn,fontSize:"12px",fontWeight:600}}>Follow-up: </span><span style={{color:t.t2,fontSize:"13px"}}>{item.f}</span></div>
          </div>))}
      </div>
    </div>}

    </div>
  </div>);
}

export { CRRTDevice };
