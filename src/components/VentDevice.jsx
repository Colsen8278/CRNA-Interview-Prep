import { useState, useRef } from "react";

function generateVentWaveformData(modeKey, params, N) {
  const pressure = [], flow = [];
  const cycles = 3;
  for (let i = 0; i < N; i++) {
    const tg = (i / N) * cycles;
    const ph = tg % 1;
    const cn = Math.floor(tg);
    let p = 0.15, f = 0;
    const peep = (params.peep || 5) / 45;
    if (modeKey === 'acvc') {
      const ie = 0.27;
      const ppk = peep + (params.flow || 50) / 680 + (params.vt || 500) / 22000;
      const ppl = peep + (params.vt || 500) / 22000;
      if (ph < ie) { p = peep + (ppk - peep) * (ph / ie); f = 0.88; }
      else { const ep = (ph - ie) / (1 - ie); p = peep + (ppl - peep) * Math.exp(-ep * 3.5); f = -0.58 * Math.exp(-ep * 2.5); }
    } else if (modeKey === 'acpc') {
      const ti = params.ti || 0.9, rr = params.rr || 14;
      const ie = Math.min(0.44, ti * rr / 60);
      const pset = peep + (params.pinsp || 20) / 45;
      if (ph < ie) { p = pset; f = 0.87 * Math.exp(-(ph / ie) * 1.9); }
      else { const ep = (ph - ie) / (1 - ie); p = peep + (pset - peep) * Math.exp(-ep * 3.5); f = -0.46 * Math.exp(-ep * 2.5); }
    } else if (modeKey === 'simv') {
      const isMand = cn % 2 === 0;
      if (isMand) {
        const ppk = peep + 18 / 45, ppl = peep + 12 / 45, ie = 0.27;
        if (ph < ie) { p = peep + (ppk - peep) * (ph / ie); f = 0.85; }
        else { const ep = (ph - ie) / (1 - ie); p = peep + (ppl - peep) * Math.exp(-ep * 3.5); f = -0.55 * Math.exp(-ep * 2.5); }
      } else {
        const psp = peep + (params.ps || 10) / 45, ie = 0.26;
        if (ph < ie) { p = psp; f = 0.58 * Math.exp(-(ph / ie) * 1.8); }
        else { const ep = (ph - ie) / (1 - ie); p = peep + (psp - peep) * Math.exp(-ep * 3); f = -0.3 * Math.exp(-ep * 2.5); }
      }
    } else if (modeKey === 'psv') {
      const vari = [0, 0.03, -0.04][cn % 3];
      const adj = Math.max(0, Math.min(1, ph + vari)), ie = 0.28;
      const psp = peep + (params.ps || 12) / 45;
      if (adj < ie) { p = psp; f = 0.78 * Math.exp(-(adj / ie) * 1.8); }
      else { const ep = (adj - ie) / (1 - ie); p = peep + (psp - peep) * Math.exp(-ep * 3); f = -0.4 * Math.exp(-ep * 2.5); }
    } else if (modeKey === 'prvc') {
      const ie = 0.30, padj = peep + 18 / 45;
      if (ph < ie) { p = padj; f = 0.87 * Math.exp(-(ph / ie) * 1.9); }
      else { const ep = (ph - ie) / (1 - ie); p = peep + (padj - peep) * Math.exp(-ep * 3.5); f = -0.45 * Math.exp(-ep * 2.5); }
    } else if (modeKey === 'aprv') {
      const ph2 = (params.phigh || 25) / 45, pl2 = (params.plow || 0) / 45;
      const th = params.thigh || 5.0, tl = params.tlow || 0.5;
      const hfrac = th / (th + tl);
      if (ph < hfrac) { const rip = Math.sin((ph / hfrac) * Math.PI * 8) * 0.017; p = ph2 + rip; f = Math.sin((ph / hfrac) * Math.PI * 8) * 0.22; }
      else { const ep = (ph - hfrac) / (1 - hfrac); p = pl2 + (ph2 - pl2) * Math.exp(-ep * 7); f = -0.95 * Math.exp(-ep * 5.5); }
    } else if (modeKey === 'hfov') {
      const hz = params.hz || 6, amp = (params.amplitude || 60) / 100;
      const mpaw = (params.mpaw || 24) / 45, osc = Math.sin(ph * Math.PI * 2 * (hz * 2));
      p = mpaw + osc * amp * 0.13; f = Math.cos(ph * Math.PI * 2 * (hz * 2)) * 0.5;
    }
    pressure.push(Math.max(0.01, Math.min(0.99, p)));
    flow.push(Math.max(-1, Math.min(1, f)));
  }
  return { pressurePts: pressure, flowPts: flow };
}

function getVentSliderConfig(modeKey) {
  const c = {
    acvc: [{key:'peep',label:'PEEP',min:3,max:18,step:1,unit:' cmH₂O'},{key:'vt',label:'Tidal Volume',min:300,max:700,step:50,unit:' mL'},{key:'flow',label:'Flow Rate',min:30,max:80,step:5,unit:' L/min'}],
    acpc: [{key:'peep',label:'PEEP',min:3,max:18,step:1,unit:' cmH₂O'},{key:'pinsp',label:'\u0394 Pressure',min:5,max:30,step:1,unit:' cmH₂O'},{key:'ti',label:'I-Time',min:0.5,max:1.5,step:0.1,unit:' s'},{key:'rr',label:'Rate',min:8,max:24,step:1,unit:' bpm'}],
    simv: [{key:'peep',label:'PEEP',min:3,max:15,step:1,unit:' cmH₂O'},{key:'vt',label:'Mand. Vt',min:300,max:700,step:50,unit:' mL'},{key:'ps',label:'Spont. PS',min:0,max:20,step:1,unit:' cmH₂O'}],
    psv: [{key:'peep',label:'PEEP',min:3,max:15,step:1,unit:' cmH₂O'},{key:'ps',label:'Pressure Support',min:5,max:20,step:1,unit:' cmH₂O'}],
    prvc: [{key:'peep',label:'PEEP',min:3,max:18,step:1,unit:' cmH₂O'},{key:'targetVt',label:'Target Vt',min:300,max:700,step:50,unit:' mL'},{key:'rr',label:'Rate',min:8,max:24,step:1,unit:' bpm'}],
    aprv: [{key:'phigh',label:'P_high',min:15,max:35,step:1,unit:' cmH₂O'},{key:'plow',label:'P_low',min:0,max:5,step:1,unit:' cmH₂O'},{key:'thigh',label:'T_high',min:3,max:7,step:0.5,unit:' s'},{key:'tlow',label:'T_low',min:0.3,max:0.8,step:0.05,unit:' s'}],
    hfov: [{key:'mpaw',label:'mPaw',min:18,max:35,step:1,unit:' cmH₂O'},{key:'amplitude',label:'Amplitude',min:30,max:90,step:5,unit:''},{key:'hz',label:'Frequency',min:3,max:12,step:1,unit:' Hz'}],
  };
  return c[modeKey] || [];
}

function VentModeWaveform({ modeKey, modeColor, t }) {
  const defaults = {
    acvc:{peep:5,rr:14,flow:50,vt:500}, acpc:{peep:5,rr:14,pinsp:20,ti:0.9},
    simv:{peep:5,rr:10,vt:500,ps:10}, psv:{peep:5,ps:12}, prvc:{peep:5,rr:14,targetVt:500},
    aprv:{phigh:25,plow:0,thigh:5.0,tlow:0.5}, hfov:{mpaw:24,amplitude:60,hz:6},
  };
  const [params, setParams] = useState(defaults[modeKey] || defaults.acvc);
  const [cursor, setCursor] = useState(0);
  const N = 400;
  useEffect(() => { setParams(defaults[modeKey] || defaults.acvc); }, [modeKey]);
  useEffect(() => { const id = setInterval(() => setCursor(c => (c + 1) % N), 42); return () => clearInterval(id); }, []);

  const { pressurePts, flowPts } = useMemo(() => generateVentWaveformData(modeKey, params, N), [modeKey, params]);
  const sliders = getVentSliderConfig(modeKey);

  const LW = 52, CW = 700, SVG_W = LW + CW + 12;
  const PY0 = 24, PH = 108, FY0 = 162, FH = 90, TOTAL_H = 274;
  const peep_n = (params.peep || (modeKey === 'aprv' ? (params.plow || 0) : 5)) / 45;
  const peepY = PY0 + PH - peep_n * PH;
  const zeroFlowY = FY0 + FH / 2;

  const pPts = pressurePts.map((v, i) => `${(LW + (i / N) * CW).toFixed(1)},${(PY0 + PH - v * PH).toFixed(1)}`).join(' ');
  const fPts = flowPts.map((v, i) => `${(LW + (i / N) * CW).toFixed(1)},${(zeroFlowY - v * (FH / 2)).toFixed(1)}`).join(' ');
  const cX = (LW + (cursor / N) * CW).toFixed(1);

  const modeAnnotations = {
    acvc: [{x:0.09,yOff:-14,pChart:true,text:"Ppeak",fill:modeColor},{x:0.26,yOff:-14,pChart:true,text:"Pplat",fill:"#8b5cf6"},{x:0.14,yOff:12,fChart:true,text:"Constant Flow",fill:modeColor}],
    acpc: [{x:0.15,yOff:-12,pChart:true,text:"Set Pressure",fill:modeColor},{x:0.12,yOff:-14,fChart:true,text:"Decelerating",fill:"#f59e0b"}],
    psv: [{x:0.15,yOff:-12,pChart:true,text:"PS Level",fill:modeColor},{x:0.12,yOff:-14,fChart:true,text:"Flow-cycled",fill:"#10b981"}],
    simv: [{x:0.1,yOff:-12,pChart:true,text:"Mandatory",fill:modeColor},{x:0.44,yOff:-12,pChart:true,text:"Spontaneous",fill:"#f59e0b"}],
    prvc: [{x:0.14,yOff:-12,pChart:true,text:"Auto-adjusted P",fill:modeColor},{x:0.12,yOff:-14,fChart:true,text:"Decelerating",fill:"#ec4899"}],
    aprv: [{x:0.12,yOff:-12,pChart:true,text:"P_high",fill:modeColor},{x:0.88,yOff:14,pChart:true,text:"P_low",fill:"#64748b"},{x:0.86,yOff:-14,fChart:true,text:"Release Flow",fill:"#ef4444"}],
    hfov: [{x:0.5,yOff:-12,pChart:true,text:"mPaw (mean)",fill:modeColor}],
  };
  const annots = modeAnnotations[modeKey] || [];

  return (
    <div style={{marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:`1px solid ${modeColor}40`}}>
      <div style={{background:t.bgH,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${t.bd}`}}>
        <span style={{fontSize:"12px",color:modeColor,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>&#9654; Live Waveform Diagram</span>
        <span style={{fontSize:"11px",color:t.tM}}>Adjust parameters below &#8594; waveform updates in real time</span>
      </div>
      <div style={{background:t.bgH,overflowX:"auto"}}>
        <svg viewBox={`0 0 ${SVG_W} ${TOTAL_H}`} width="100%" style={{minWidth:"460px",display:"block"}}>
          {/* Chart backgrounds */}
          <rect x={LW} y={PY0} width={CW} height={PH} fill={t.bgC} rx="2"/>
          <rect x={LW} y={FY0} width={CW} height={FH} fill={t.bgC} rx="2"/>
          {/* Grid verticals (breath dividers) */}
          {[0,1/3,2/3,1].map((fr,i)=><line key={i} x1={LW+fr*CW} y1={PY0} x2={LW+fr*CW} y2={FY0+FH} stroke={t.bd} strokeWidth="1" strokeDasharray="3,3"/>)}
          {/* Grid horizontals - pressure */}
          {[0,0.33,0.67,1].map((fr,i)=><line key={i} x1={LW} y1={PY0+fr*PH} x2={LW+CW} y2={PY0+fr*PH} stroke={t.bd} strokeWidth="0.5"/>)}
          {/* Grid horizontals - flow */}
          {[0,0.5,1].map((fr,i)=><line key={i} x1={LW} y1={FY0+fr*FH} x2={LW+CW} y2={FY0+fr*FH} stroke={t.bd} strokeWidth="0.5"/>)}
          {/* PEEP line */}
          <line x1={LW} y1={peepY} x2={LW+CW} y2={peepY} stroke={t.tM} strokeWidth="1" strokeDasharray="5,3" opacity="0.7"/>
          <text x={LW-4} y={peepY+3} fill={t.tM} fontSize="8" textAnchor="end">PEEP</text>
          {/* Zero flow line */}
          <line x1={LW} y1={zeroFlowY} x2={LW+CW} y2={zeroFlowY} stroke={t.bd} strokeWidth="1" strokeDasharray="3,2"/>
          {/* Section labels */}
          <text x={LW+6} y={PY0+10} fill={modeColor} fontSize="10" fontWeight="700">PRESSURE (cmH&#8322;O)</text>
          <text x={LW+6} y={FY0+10} fill="#f59e0b" fontSize="10" fontWeight="700">FLOW (L/min)</text>
          {/* Axes Y labels */}
          <text x={LW-4} y={PY0+5} fill={t.tM} fontSize="7" textAnchor="end">~40</text>
          <text x={LW-4} y={PY0+PH} fill={t.tM} fontSize="7" textAnchor="end">0</text>
          <text x={LW-4} y={FY0+8} fill={t.tM} fontSize="7" textAnchor="end">+</text>
          <text x={LW-4} y={FY0+FH} fill={t.tM} fontSize="7" textAnchor="end">-</text>
          {/* Cycle labels */}
          {[0,1,2,3].map(n=><text key={n} x={LW+n*CW/3} y={TOTAL_H-3} fill={t.tM} fontSize="9" textAnchor="middle">{n===0?"0 s":n===1?"Cycle 1":n===2?"Cycle 2":"Cycle 3"}</text>)}
          {/* Pressure waveform */}
          <polyline points={pPts} fill="none" stroke={modeColor} strokeWidth="2.5" strokeLinejoin="round"/>
          {/* Flow waveform */}
          <polyline points={fPts} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round"/>
          {/* Cursor */}
          <line x1={cX} y1={PY0} x2={cX} y2={FY0+FH} stroke={t.ac} strokeWidth="1.5" opacity="0.6"/>
          <circle cx={cX} cy={PY0+PH-pressurePts[cursor]*PH} r="3" fill={modeColor} opacity="0.85"/>
          <circle cx={cX} cy={zeroFlowY-flowPts[cursor]*(FH/2)} r="3" fill="#f59e0b" opacity="0.85"/>
          {/* Annotations */}
          {annots.map((a,i)=>{
            const ax = LW + a.x * CW;
            const ay = a.pChart ? (PY0 + PH * 0.3 + a.yOff) : (FY0 + FH * 0.25 + a.yOff);
            return <g key={i}><text x={ax} y={ay} fill={a.fill} fontSize="10" fontWeight="600" textAnchor="middle" style={{pointerEvents:"none"}}>{a.text}</text></g>;
          })}
        </svg>
      </div>
      {/* Sliders */}
      {sliders.length > 0 && <div style={{padding:"14px 16px",borderTop:`1px solid ${t.bd}`,background:t.bgC}}>
        <div style={{fontSize:"11px",color:t.tM,marginBottom:"10px",textTransform:"uppercase",letterSpacing:"0.5px",fontWeight:600}}>Adjust Parameters</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(150px,1fr))",gap:"14px"}}>
          {sliders.map(s=>(
            <div key={s.key}>
              <div style={{fontSize:"11px",color:t.t2,marginBottom:"4px",display:"flex",justifyContent:"space-between"}}>
                <span>{s.label}</span>
                <span style={{color:modeColor,fontWeight:700}}>{typeof params[s.key]==='number'?params[s.key].toFixed(s.step<1?1:0):params[s.key]}{s.unit}</span>
              </div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={params[s.key]||s.min}
                onChange={e=>setParams(pr=>({...pr,[s.key]:parseFloat(e.target.value)}))}
                style={{width:"100%",accentColor:modeColor,height:"4px"}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:"9px",color:t.tM}}>
                <span>{s.min}{s.unit}</span><span>{s.max}{s.unit}</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:"12px",padding:"8px 12px",background:t.bgH,borderRadius:"6px",border:`1px solid ${t.bd}`}}>
          {modeKey==='acvc'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}><span style={{color:modeColor,fontWeight:600}}>Watch:</span> Increasing <b>Flow Rate</b> raises Ppeak (more resistive pressure) without changing Pplat. Increasing <b>Tidal Volume</b> raises both Ppeak and Pplat (compliance-driven). The gap between Ppeak and Pplat = Raw \xd7 Flow.</p>}
          {modeKey==='acpc'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}><span style={{color:modeColor,fontWeight:600}}>Watch:</span> Increasing \u0394Pressure raises the pressure plateau and delivered Vt. Shorter I-Time truncates the decelerating flow earlier. If compliance drops, <b>same pressure delivers less volume</b> — must monitor exhaled Vt closely.</p>}
          {modeKey==='psv'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}><span style={{color:modeColor,fontWeight:600}}>Watch:</span> Each breath is <b>patient-triggered</b> and <b>flow-cycled</b>. Increasing PS raises the pressure support level and delivered Vt. For SBT: target PS 5–8 + PEEP 5 for 30–120 min.</p>}
          {modeKey==='simv'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}><span style={{color:modeColor,fontWeight:600}}>Watch:</span> Mandatory breaths (cycles 1, 3) deliver full VC breath. Spontaneous breaths (cycles 2) show PS-augmented pattern with smaller amplitude and variable Vt. The difference illustrates why SIMV can increase WOB.</p>}
          {modeKey==='prvc'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}><span style={{color:modeColor,fontWeight:600}}>Watch:</span> Decelerating flow pattern like AC/PC, but <b>volume is guaranteed</b>. Ventilator auto-adjusts inspiratory pressure breath-by-breath to hit Target Vt. If patient takes bigger breaths, support decreases automatically.</p>}
          {modeKey==='aprv'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}><span style={{color:modeColor,fontWeight:600}}>Watch:</span> Long P_high plateau with small spontaneous breath ripples. The brief T_low release generates the large expiratory flow spike that clears CO₂. Shorten T_high or lengthen T_low to improve CO₂ clearance.</p>}
          {modeKey==='hfov'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}><span style={{color:modeColor,fontWeight:600}}>Watch:</span> Rapid oscillations around mPaw. Lower Hz = larger Vt per oscillation = better CO₂ clearance. Higher Amplitude = larger pressure swing. Oxygenation set by mPaw and FiO₂; ventilation by Amplitude and Hz.</p>}
        </div>
      </div>}
    </div>
  );
}

// ── Extra Vent Page Diagrams ──────────────────────────────────────────────────

function genWaveformScenarioData(scenId) {
  const N=300,P=[],F=[],V=[],cycles=2;
  for(let i=0;i<N;i++){
    const tg=(i/N)*cycles,ph=tg%1;
    let p=0.1,f=0,v=0;
    switch(scenId){
      case 'vc_normal':{const ie=0.27,vt=0.55,peep=0.1,ppk=0.70,ppl=0.55;if(ph<ie){p=peep+(ppk-peep)*(ph/ie);f=0.9;v=ph/ie*vt;}else{const ep=(ph-ie)/(1-ie);p=peep+(ppl-peep)*Math.exp(-ep*4);f=-0.50*Math.exp(-ep*2.5);v=vt*(1-ep*0.97);}break;}
      case 'pc_normal':{const ie=0.30,vt=0.55,peep=0.1,pset=0.65;if(ph<ie){p=pset;f=0.85*Math.exp(-(ph/ie)*2);v=vt*(1-Math.exp(-(ph/ie)*3));}else{const ep=(ph-ie)/(1-ie);p=peep+(pset-peep)*Math.exp(-ep*3.5);f=-0.45*Math.exp(-ep*2.5);v=vt*(1-ep);}break;}
      case 'auto_peep':{const ie=0.35,vt=0.55,peep=0.1,ppk=0.76,ppl=0.62,iP=0.14;if(ph<ie){p=peep+iP+(ppk-peep)*(ph/ie);f=0.9;v=ph/ie*vt;}else{const ep=(ph-ie)/(1-ie);f=-0.55*Math.exp(-ep*1.8)+0.12;p=peep+iP+(ppl-peep)*Math.exp(-ep*2.5);v=Math.max(0,vt*(1-ep*0.85));}break;}
      case 'bronchospasm':{const ie=0.27,vt=0.55,peep=0.1,ppk=0.88,ppl=0.57;if(ph<ie){p=peep+(ppk-peep)*(ph/ie);f=0.9;v=ph/ie*vt;}else{const ep=(ph-ie)/(1-ie);f=-0.55*Math.pow(ep,0.4)*Math.exp(-ep*0.8);p=peep+(ppl-peep)*Math.exp(-ep*4);v=vt*Math.exp(-ep*1.2);}break;}
      case 'compliance':{const ie=0.27,vt=0.50,peep=0.1,ppk=0.90,ppl=0.84;if(ph<ie){p=peep+(ppk-peep)*(ph/ie);f=0.9;v=ph/ie*vt;}else{const ep=(ph-ie)/(1-ie);p=peep+(ppl-peep)*Math.exp(-ep*4);f=-0.5*Math.exp(-ep*2.5);v=vt*(1-ep);}break;}
      case 'cuff_leak':{const ie=0.27,peep=0.1,ppk=0.65,ppl=0.50;if(ph<ie){p=peep+(ppk-peep)*(ph/ie);f=0.9;v=ph/ie*0.55;}else{const ep=(ph-ie)/(1-ie);p=peep+(ppl-peep)*Math.exp(-ep*4);f=-0.35*Math.exp(-ep*2.5);v=Math.max(0,0.55-ep*0.55*0.65);}break;}
      default:break;
    }
    P.push(Math.max(0.01,Math.min(0.99,p)));
    F.push(Math.max(-1,Math.min(1,f)));
    V.push(Math.max(0,Math.min(0.99,v)));
  }
  return {P,F,V};
}

function genPVLoopPts(scenId) {
  const pts=[],N=80;
  for(let i=0;i<=N;i++){
    const t2=i/N;let p,v;
    if(scenId==='normal'){
      if(t2<=0.5){const r=t2*2;p=5+r*20;v=r*r*510;}
      else{const r=1-(t2-0.5)*2;p=5+r*20;v=r*510*(1-0.09*(1-r));}
    }else if(scenId==='ards'){
      if(t2<=0.5){const r=t2*2;p=5+r*30;v=r<0.17?r*105:r<0.83?18+(r-0.17)*630:410+(r-0.83)*60;}
      else{const r=1-(t2-0.5)*2;p=5+r*30;v=Math.max(0,r<0.17?r*90:r*420);}
    }else{
      if(t2<=0.5){const r=t2*2;p=8+r*17;v=r*530;}
      else{const r=1-(t2-0.5)*2;p=8+r*17;v=r*530*(1-0.07*(1-r));}
    }
    pts.push({p:Math.min(40,Math.max(0,p)),v:Math.min(600,Math.max(0,v))});
  }
  return pts;
}

function CircleSystemDiagram({t}) {
  const [tick,setTick]=useState(0);
  useEffect(()=>{const id=setInterval(()=>setTick(v=>(v+1)%240),45);return()=>clearInterval(id);},[]);
  const W=580,H=330;
  const wpts=[{x:290,y:50},{x:450,y:95},{x:505,y:185},{x:440,y:278},{x:290,y:300},{x:148,y:278},{x:82,y:185},{x:145,y:95},{x:290,y:50}];
  const getPos=(prog)=>{
    const seg=wpts.length-1,t2=((prog%1)+1)%1*seg,i=Math.floor(t2),fr=t2-i;
    const a=wpts[Math.min(i,seg-1)],b=wpts[Math.min(i+1,seg)];
    return {x:a.x+(b.x-a.x)*fr,y:a.y+(b.y-a.y)*fr};
  };
  const dots=Array.from({length:10},(_,i)=>{
    const prog=((tick/240)+(i/10))%1,pos=getPos(prog);
    const col=prog<0.12||prog>0.88?t.ac:prog<0.5?'#f59e0b':'#3b82f6';
    return {...pos,color:col};
  });
  const comps=[
    {x:290,y:50,label:'PATIENT',sub:'ETT / Mask',color:t.ac,isCircle:true,r:26},
    {x:450,y:95,label:'EXP VALVE',sub:'Unidirectional',color:'#f59e0b',w:84,h:34},
    {x:505,y:185,label:'CO₂ ABSORBER',sub:'Soda Lime',color:'#94a3b8',w:88,h:38},
    {x:290,y:300,label:'BELLOWS / FGF',sub:'O₂ + Volatile Agent',color:'#22c55e',w:102,h:34},
    {x:148,y:278,label:'APL VALVE',sub:'Pressure relief',color:'#a855f7',w:82,h:34},
    {x:82,y:185,label:'INSP VALVE',sub:'Unidirectional',color:'#3b82f6',w:84,h:34},
  ];
  return(
    <div style={{marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:`1px solid ${t.ac}40`}}>
      <div style={{background:t.bgH,padding:"10px 14px",borderBottom:`1px solid ${t.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
        <span style={{fontSize:"12px",color:t.ac,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>&#9654; Anesthesia Circle System &mdash; Animated Gas Flow</span>
        <div style={{display:"flex",gap:"14px",fontSize:"11px",color:t.tM}}>
          <span><span style={{color:'#f59e0b'}}>&#9679;</span> Expired (CO&#8322;-laden)</span>
          <span><span style={{color:'#3b82f6'}}>&#9679;</span> Inspired (fresh gas)</span>
        </div>
      </div>
      <div style={{background:t.bgH}}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block",minWidth:"380px"}}>
          <polyline points={`${wpts[0].x},${wpts[0].y} ${wpts[1].x},${wpts[1].y} ${wpts[2].x},${wpts[2].y} ${wpts[3].x},${wpts[3].y} ${wpts[4].x},${wpts[4].y}`} fill="none" stroke="#f59e0b" strokeWidth="7" strokeOpacity="0.18" strokeLinejoin="round"/>
          <polyline points={`${wpts[4].x},${wpts[4].y} ${wpts[5].x},${wpts[5].y} ${wpts[6].x},${wpts[6].y} ${wpts[7].x},${wpts[7].y} ${wpts[8].x},${wpts[8].y}`} fill="none" stroke="#3b82f6" strokeWidth="7" strokeOpacity="0.18" strokeLinejoin="round"/>
          <text x={510} y={152} fill="#f59e0b" fontSize="16" opacity="0.6">&#8595;</text>
          <text x={68} y={222} fill="#3b82f6" fontSize="16" opacity="0.6">&#8593;</text>
          <text x={362} y={72} fill="#f59e0b" fontSize="14" opacity="0.6">&#8594;</text>
          <text x={200} y={72} fill="#3b82f6" fontSize="14" opacity="0.6">&#8592;</text>
          {dots.map((d,i)=><circle key={i} cx={d.x} cy={d.y} r="5" fill={d.color} opacity="0.9"/>)}
          {comps.map((c,i)=>c.isCircle
            ?<g key={i}><circle cx={c.x} cy={c.y} r={c.r} fill={t.bgC} stroke={c.color} strokeWidth="2.5"/><text x={c.x} y={c.y-3} fill={c.color} fontSize="8" textAnchor="middle" fontWeight="700">{c.label}</text><text x={c.x} y={c.y+9} fill={t.tM} fontSize="7" textAnchor="middle">{c.sub}</text></g>
            :<g key={i}><rect x={c.x-c.w/2} y={c.y-c.h/2} width={c.w} height={c.h} rx="5" fill={t.bgC} stroke={c.color} strokeWidth="1.5"/><text x={c.x} y={c.y-3} fill={c.color} fontSize="8" textAnchor="middle" fontWeight="700">{c.label}</text><text x={c.x} y={c.y+9} fill={t.tM} fontSize="7" textAnchor="middle">{c.sub}</text></g>
          )}
        </svg>
      </div>
      <div style={{padding:"10px 16px",background:t.bgC,borderTop:`1px solid ${t.bd}`}}>
        <p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}>Gas flows <strong style={{color:'#f59e0b'}}>unidirectionally</strong>: expired gas traverses the CO&#8322; absorber (CO&#8322; &#8594; CaCO&#8323;) before returning as inspired gas. FGF replaces consumed O&#8322; and washed-out volatile agent. APL valve prevents over-pressurization. Low-flow anesthesia (&le;1 L/min) conserves heat and agent but demands reliable CO&#8322; monitoring.</p>
      </div>
    </div>
  );
}

function OLVDiagram({t}) {
  const [mode,setMode]=useState('twol');
  const modes=[{id:'twol',label:'Two-Lung Ventilation',color:t.bl},{id:'olv',label:'OLV Initiated',color:t.wn},{id:'hpv',label:'HPV Response',color:t.ok},{id:'cpap',label:'CPAP Rescue',color:t.ac}];
  const W=480,H=280;
  const lRx=mode==='twol'?65:72,lRy=mode==='twol'?90:100;
  const rRx=mode==='twol'?60:mode==='cpap'?50:38,rRy=mode==='twol'?88:mode==='cpap'?70:52;
  const lFill=`#3b82f6${mode==='twol'?'18':'22'}`;
  const rFill=mode==='twol'?'#3b82f618':mode==='cpap'?`${t.ac}18`:'#64748b14';
  const rStroke=mode==='twol'?'#3b82f6':mode==='cpap'?t.ac:'#64748b';
  const showHPV=mode==='hpv'||mode==='cpap';
  return(
    <div style={{marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:`1px solid ${t.pr}40`}}>
      <div style={{background:t.bgH,padding:"10px 14px",borderBottom:`1px solid ${t.bd}`}}>
        <span style={{fontSize:"12px",color:t.pr,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>One-Lung Ventilation (OLV) &mdash; Step Through</span>
      </div>
      <div style={{display:"flex",gap:"6px",padding:"10px 14px",background:t.bgH,borderBottom:`1px solid ${t.bd}`,flexWrap:"wrap"}}>
        {modes.map(m=><button key={m.id} onClick={()=>setMode(m.id)} style={{padding:"5px 12px",borderRadius:"6px",border:`1px solid ${mode===m.id?m.color:t.bd}`,background:mode===m.id?`${m.color}18`:t.bgC,color:mode===m.id?m.color:t.tM,fontSize:"11px",fontWeight:mode===m.id?700:400,cursor:"pointer"}}>{m.label}</button>)}
      </div>
      <div style={{background:t.bgH}}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block",minWidth:"300px"}}>
          <rect x="30" y="16" width="420" height="240" rx="18" fill={t.bgC} stroke={t.bd} strokeWidth="1"/>
          <rect x="222" y="24" width="28" height="208" rx="3" fill={t.bgH} stroke={t.bd} strokeWidth="1"/>
          <text x="236" y="132" fill={t.tM} fontSize="7" textAnchor="middle">MED</text>
          <ellipse cx="128" cy="128" rx={lRx} ry={lRy} fill={lFill} stroke="#3b82f6" strokeWidth="2"/>
          <text x="128" y="120" fill="#3b82f6" fontSize="10" textAnchor="middle" fontWeight="700">{mode==='twol'?'L. LUNG':'DEPENDENT'}</text>
          <text x="128" y="132" fill="#3b82f6" fontSize="8" textAnchor="middle">Ventilated</text>
          {mode!=='twol'&&<text x="128" y="144" fill="#3b82f6" fontSize="8" textAnchor="middle">PEEP 5&ndash;10</text>}
          <ellipse cx="353" cy="128" rx={rRx} ry={rRy} fill={rFill} stroke={rStroke} strokeWidth={mode==='twol'?2:1.5} strokeDasharray={mode!=='twol'?'5,2':'none'}/>
          <text x="353" y="120" fill={rStroke} fontSize="10" textAnchor="middle" fontWeight="700">{mode==='twol'?'R. LUNG':'OPERATIVE'}</text>
          <text x="353" y="132" fill={rStroke} fontSize="8" textAnchor="middle">{mode==='twol'?'Ventilated':mode==='cpap'?'CPAP 5-10':'Collapsed'}</text>
          {mode==='olv'&&<text x="353" y="146" fill="#f59e0b" fontSize="8" textAnchor="middle">Surgical access</text>}
          <rect x="208" y="10" width="44" height="18" rx="3" fill={t.bgC} stroke={t.ac} strokeWidth="1.5"/>
          <text x="230" y="22" fill={t.ac} fontSize="8" textAnchor="middle" fontWeight="700">{mode==='twol'?'ETT':'DLT'}</text>
          <line x1="208" y1="19" x2="128" y2="50" stroke="#3b82f6" strokeWidth="2"/>
          {mode!=='twol'&&<line x1="252" y1="19" x2="353" y2="50" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,2"/>}
          {showHPV&&<g>
            <defs><marker id="arrowR2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 Z" fill="#ef4444"/></marker></defs>
            <path d="M338,172 C290,168 258,162 200,158 C178,156 156,157 142,158" fill="none" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowR2)"/>
            <text x="250" y="152" fill="#ef4444" fontSize="8" textAnchor="middle" fontWeight="600">HPV redirects blood &#8594;</text>
          </g>}
          {mode!=='twol'&&<g><rect x="308" y="12" width="112" height="14" rx="3" fill="#ef444420" stroke="#ef4444" strokeWidth="1"/><text x="364" y="22" fill="#ef4444" fontSize="8" textAnchor="middle" fontWeight="700">SURGICAL FIELD</text></g>}
          <text x="128" y="258" fill={t.tM} fontSize="8" textAnchor="middle">Left (Dependent)</text>
          <text x="353" y="258" fill={t.tM} fontSize="8" textAnchor="middle">Right (Operative)</text>
        </svg>
      </div>
      <div style={{padding:"10px 16px",background:t.bgC,borderTop:`1px solid ${t.bd}`}}>
        {mode==='twol'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}>Standard two-lung ventilation via single-lumen ETT.</p>}
        {mode==='olv'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:t.wn,fontWeight:600}}>DLT isolates operative lung.</span> Reduce Vt to 4&ndash;6 mL/kg IBW (one lung receives the full breath). FiO&#8322; to 1.0 initially. PEEP 5&ndash;10 to dependent lung.</p>}
        {mode==='hpv'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:t.ok,fontWeight:600}}>HPV:</span> Non-ventilated alveoli sense low PAO&#8322; &#8594; local pulmonary arteriolar constriction &#8594; diverts blood to ventilated lung, reducing shunt. Volatile anesthetics inhibit HPV dose-dependently (&gt;1 MAC). TIVA preserves HPV.</p>}
        {mode==='cpap'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:t.ac,fontWeight:600}}>Rescue:</span> CPAP 5&ndash;10 to operative lung &mdash; maintains alveolar O&#8322; while keeping lung decompressed enough for surgery. First-line for OLV hypoxemia. If inadequate: partial ventilation, surgeon PA clamp.</p>}
      </div>
    </div>
  );
}

function WaveformPatternSelector({t}) {
  const [scenario,setScenario]=useState('vc_normal');
  const scenarios=[{id:'vc_normal',label:'Normal VC',color:'#3b82f6'},{id:'pc_normal',label:'Normal PC',color:'#8b5cf6'},{id:'auto_peep',label:'Auto-PEEP',color:'#ef4444'},{id:'bronchospasm',label:'Bronchospasm',color:'#f59e0b'},{id:'compliance',label:'Low Compliance',color:'#ec4899'},{id:'cuff_leak',label:'Cuff Leak',color:'#64748b'}];
  const data=useMemo(()=>genWaveformScenarioData(scenario),[scenario]);
  const sc=scenarios.find(s=>s.id===scenario);
  const N=300,LW=48,CW=490,ROW_H=72,GAP=14;
  const pY=14,fY=pY+ROW_H+GAP,vY=fY+ROW_H+GAP;
  const W=LW+CW+10,totalH=vY+ROW_H+22;
  const fZero=fY+ROW_H/2;
  const mkLine=(pts,yBase,rH,color,sw=2)=>{
    const points=pts.map((v,i)=>`${(LW+(i/N)*CW).toFixed(1)},${(yBase+rH-v*rH).toFixed(1)}`).join(' ');
    return <polyline key={color+yBase} points={points} fill="none" stroke={color} strokeWidth={sw} strokeLinejoin="round"/>;
  };
  const annotations={
    vc_normal:[{chart:'p',x:0.09,y:0.84,label:'Ppeak',color:'#3b82f6'},{chart:'p',x:0.22,y:0.68,label:'Pplat',color:'#22c55e'},{chart:'f',x:0.08,y:0.88,label:'Const. flow',color:'#3b82f6'}],
    auto_peep:[{chart:'f',x:0.42,y:0.35,label:'Flow\u22600 at end',color:'#ef4444'},{chart:'p',x:0.09,y:0.90,label:'Elevated base',color:'#ef4444'}],
    bronchospasm:[{chart:'p',x:0.08,y:0.94,label:'High Ppeak',color:'#f59e0b'},{chart:'p',x:0.21,y:0.65,label:'Norm Pplat',color:'#22c55e'},{chart:'f',x:0.55,y:0.18,label:'Scooped exp',color:'#f59e0b'}],
    compliance:[{chart:'p',x:0.08,y:0.94,label:'High Ppeak',color:'#ec4899'},{chart:'p',x:0.21,y:0.88,label:'High Pplat &gt;30',color:'#ef4444'}],
    cuff_leak:[{chart:'v',x:0.22,y:0.80,label:'Inspired Vt',color:'#3b82f6'},{chart:'v',x:0.65,y:0.28,label:'Exhaled (less)',color:'#ef4444'}],
  };
  const annots=annotations[scenario]||[];
  const getAP=(a)=>({x:LW+a.x*CW,y:{p:pY,f:fY,v:vY}[a.chart]+(1-a.y)*ROW_H});
  return(
    <div style={{marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:`1px solid ${t.bl}40`}}>
      <div style={{background:t.bgH,padding:"10px 14px",borderBottom:`1px solid ${t.bd}`}}>
        <span style={{fontSize:"12px",color:t.bl,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>&#9654; Waveform Pattern Recognition</span>
      </div>
      <div style={{display:"flex",gap:"6px",padding:"10px 14px",background:t.bgH,borderBottom:`1px solid ${t.bd}`,flexWrap:"wrap"}}>
        {scenarios.map(s=><button key={s.id} onClick={()=>setScenario(s.id)} style={{padding:"5px 12px",borderRadius:"6px",border:`1px solid ${scenario===s.id?s.color:t.bd}`,background:scenario===s.id?`${s.color}18`:t.bgC,color:scenario===s.id?s.color:t.tM,fontSize:"11px",fontWeight:scenario===s.id?700:400,cursor:"pointer"}}>{s.label}</button>)}
      </div>
      <div style={{background:t.bgH,overflowX:"auto"}}>
        <svg viewBox={`0 0 ${W} ${totalH}`} width="100%" style={{display:"block",minWidth:"420px"}}>
          {[pY,fY,vY].map((yo,ri)=><rect key={ri} x={LW} y={yo} width={CW} height={ROW_H} fill={t.bgC} rx="2"/>)}
          {[pY,fY,vY].flatMap((yo,ri)=>[0,0.5,1].map(fr=><line key={`g${ri}${fr}`} x1={LW} y1={yo+fr*ROW_H} x2={LW+CW} y2={yo+fr*ROW_H} stroke={t.bd} strokeWidth="0.5"/>))}
          {[0,0.5,1].map((fr,i)=><line key={i} x1={LW+fr*CW} y1={pY} x2={LW+fr*CW} y2={vY+ROW_H} stroke={t.bd} strokeWidth="1" strokeDasharray="3,3"/>)}
          <line x1={LW} y1={fZero} x2={LW+CW} y2={fZero} stroke={t.bd} strokeWidth="1.5" strokeDasharray="3,2"/>
          <text x={LW-4} y={pY+12} fill={sc.color} fontSize="9" textAnchor="end" fontWeight="700">PRESSURE</text>
          <text x={LW-4} y={fY+12} fill="#f59e0b" fontSize="9" textAnchor="end" fontWeight="700">FLOW</text>
          <text x={LW-4} y={vY+12} fill="#22c55e" fontSize="9" textAnchor="end" fontWeight="700">VOLUME</text>
          {mkLine(data.P,pY,ROW_H,sc.color,2)}
          {(()=>{const fp=data.F.map((v,i)=>`${(LW+(i/N)*CW).toFixed(1)},${(fZero-v*(ROW_H*0.42)).toFixed(1)}`).join(' ');return <polyline key="flow" points={fp} fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinejoin="round"/>;})()}
          {mkLine(data.V,vY,ROW_H,'#22c55e',2)}
          {annots.map((a,i)=>{const pos=getAP(a);return <g key={i}><rect x={pos.x-2} y={pos.y-11} width={a.label.length*5.5+4} height="13" rx="2" fill={t.bgH} opacity="0.85"/><text x={pos.x} y={pos.y} fill={a.color} fontSize="9" fontWeight="600">{a.label}</text></g>;})}
          <text x={LW+CW*0.125} y={totalH-4} fill={t.tM} fontSize="8" textAnchor="middle">Breath 1</text>
          <text x={LW+CW*0.625} y={totalH-4} fill={t.tM} fontSize="8" textAnchor="middle">Breath 2</text>
        </svg>
      </div>
      <div style={{padding:"10px 16px",background:t.bgC,borderTop:`1px solid ${t.bd}`}}>
        {scenario==='vc_normal'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:sc.color,fontWeight:600}}>VC pattern:</span> Constant (square) flow &#8594; rising pressure. Ppeak &minus; Pplat = resistive pressure. Inspiratory hold reveals Pplat (elastic only). Normal Pplat &lt;30 cmH&#8322;O.</p>}
        {scenario==='pc_normal'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:sc.color,fontWeight:600}}>PC pattern:</span> Square pressure plateau, decelerating flow. More physiologic. Volume varies with compliance &mdash; monitor exhaled Vt closely.</p>}
        {scenario==='auto_peep'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:sc.color,fontWeight:600}}>Auto-PEEP:</span> Expiratory flow does NOT reach zero before next breath. Perform expiratory hold to quantify. Treat: decrease RR, lengthen expiratory time, bronchodilators.</p>}
        {scenario==='bronchospasm'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:sc.color,fontWeight:600}}>Bronchospasm:</span> High Ppeak, normal Pplat (resistance problem). Ppeak &minus; Pplat &gt;10. Scooped (shark-fin) expiratory flow = slow obstructed emptying.</p>}
        {scenario==='compliance'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:sc.color,fontWeight:600}}>Low compliance:</span> Both Ppeak AND Pplat elevated. Pplat &gt;30 = ARDSNet violation. Reduce Vt, check for PTX, mainstem intubation, pulmonary edema.</p>}
        {scenario==='cuff_leak'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:sc.color,fontWeight:600}}>Cuff leak:</span> Inspired Vt exceeds exhaled Vt on volume trace. Causes: cuff leak, circuit disconnect, bronchopleural fistula. Check cuff pressure and circuit integrity.</p>}
      </div>
    </div>
  );
}

function PVLoopDiagram({t}) {
  const [scenario,setScenario]=useState('normal');
  const [animStep,setAnimStep]=useState(0);
  const [running,setRunning]=useState(true);
  useEffect(()=>{if(!running)return;const id=setInterval(()=>setAnimStep(s=>(s+1)%100),40);return()=>clearInterval(id);},[running]);
  const W=380,H=290,ml={l:52,r:16,t:16,b:36};
  const cW=W-ml.l-ml.r,cH=H-ml.t-ml.b;
  const toSVG=(p,v)=>({x:ml.l+(p/40)*cW,y:ml.t+cH-(v/600)*cH});
  const loops=useMemo(()=>({normal:genPVLoopPts('normal'),ards:genPVLoopPts('ards'),recruited:genPVLoopPts('recruited')}),[]);
  const lp=loops[scenario]||[];
  const toPath=(pts)=>pts.map((p,i)=>`${i===0?'M':'L'}${toSVG(p.p,p.v).x.toFixed(1)},${toSVG(p.p,p.v).y.toFixed(1)}`).join(' ');
  const fullPath=toPath(lp);
  const animIdx=Math.floor(animStep/100*lp.length);
  const tracePath=lp.length>1?toPath(lp.slice(0,Math.max(2,animIdx))):'';
  const scColor=scenario==='normal'?'#22c55e':scenario==='ards'?'#ef4444':t.ac;
  const LIP=toSVG(10,65),UIP=toSVG(33,420);
  return(
    <div style={{marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:`1px solid ${t.wn}40`}}>
      <div style={{background:t.bgH,padding:"10px 14px",borderBottom:`1px solid ${t.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
        <span style={{fontSize:"12px",color:t.wn,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>&#9654; Pressure-Volume Loop</span>
        <button onClick={()=>{setRunning(r=>!r);setAnimStep(0);}} style={{fontSize:"11px",color:t.ac,background:t.aD,border:`1px solid ${t.aB}`,borderRadius:"4px",padding:"3px 10px",cursor:"pointer"}}>{running?'Pause':'Replay'}</button>
      </div>
      <div style={{display:"flex",gap:"6px",padding:"10px 14px",background:t.bgH,borderBottom:`1px solid ${t.bd}`,flexWrap:"wrap"}}>
        {[{id:'normal',label:'Normal',color:'#22c55e'},{id:'ards',label:'ARDS (pre-recruit)',color:'#ef4444'},{id:'recruited',label:'Post-Recruitment',color:t.ac}].map(s=><button key={s.id} onClick={()=>{setScenario(s.id);setAnimStep(0);}} style={{padding:"5px 12px",borderRadius:"6px",border:`1px solid ${scenario===s.id?s.color:t.bd}`,background:scenario===s.id?`${s.color}18`:t.bgC,color:scenario===s.id?s.color:t.tM,fontSize:"11px",fontWeight:scenario===s.id?700:400,cursor:"pointer"}}>{s.label}</button>)}
      </div>
      <div style={{background:t.bgH,display:"flex",justifyContent:"center"}}>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block",maxWidth:"460px"}}>
          <rect x={ml.l} y={ml.t} width={cW} height={cH} fill={t.bgC} rx="2"/>
          {[0,10,20,30,40].map(p=><g key={p}><line x1={ml.l+(p/40)*cW} y1={ml.t} x2={ml.l+(p/40)*cW} y2={ml.t+cH} stroke={t.bd} strokeWidth="0.5"/><text x={ml.l+(p/40)*cW} y={ml.t+cH+12} fill={t.tM} fontSize="8" textAnchor="middle">{p}</text></g>)}
          {[0,100,200,300,400,500,600].map(v=><g key={v}><line x1={ml.l} y1={ml.t+cH-(v/600)*cH} x2={ml.l+cW} y2={ml.t+cH-(v/600)*cH} stroke={t.bd} strokeWidth="0.5"/><text x={ml.l-4} y={ml.t+cH-(v/600)*cH+3} fill={t.tM} fontSize="8" textAnchor="end">{v}</text></g>)}
          <text x={ml.l+cW/2} y={H-4} fill={t.t2} fontSize="9" textAnchor="middle">Pressure (cmH&#8322;O)</text>
          <text x={8} y={ml.t+cH/2+4} fill={t.t2} fontSize="9" textAnchor="middle" transform={`rotate(-90,8,${ml.t+cH/2})`}>Volume (mL)</text>
          {scenario==='ards'&&<g>
            <circle cx={LIP.x} cy={LIP.y} r="5" fill="#22c55e" opacity="0.9"/>
            <text x={LIP.x+8} y={LIP.y+4} fill="#22c55e" fontSize="9" fontWeight="700">LIP</text>
            <line x1={ml.l} y1={LIP.y} x2={ml.l+cW} y2={LIP.y} stroke="#22c55e" strokeWidth="1" strokeDasharray="4,2" opacity="0.5"/>
            <text x={ml.l+6} y={LIP.y-3} fill="#22c55e" fontSize="8">Set PEEP above LIP</text>
            <circle cx={UIP.x} cy={UIP.y} r="5" fill="#ef4444" opacity="0.9"/>
            <text x={UIP.x-8} y={UIP.y-6} fill="#ef4444" fontSize="9" fontWeight="700" textAnchor="end">UIP</text>
          </g>}
          <path d={fullPath} fill="none" stroke={scColor} strokeWidth="1" opacity="0.18"/>
          {tracePath&&<path d={tracePath} fill="none" stroke={scColor} strokeWidth="2.5" strokeLinejoin="round"/>}
          <text x={ml.l+cW*0.22} y={ml.t+cH*0.18} fill={t.tM} fontSize="9">&#8593; Inflation</text>
          <text x={ml.l+cW*0.55} y={ml.t+cH*0.82} fill={t.tM} fontSize="9">&#8595; Deflation</text>
          <text x={ml.l+cW*0.5} y={ml.t+cH*0.5} fill={t.tM} fontSize="9" textAnchor="middle" opacity="0.45">Hysteresis</text>
        </svg>
      </div>
      <div style={{padding:"10px 16px",background:t.bgC,borderTop:`1px solid ${t.bd}`}}>
        {scenario==='normal'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}>Normal counterclockwise loop. Inflation limb (left) vs. deflation limb (right) &mdash; the gap between them is <strong>hysteresis</strong>: lungs require less pressure to stay open than to open. Area inside loop = work of breathing.</p>}
        {scenario==='ards'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:'#ef4444',fontWeight:600}}>ARDS:</span> S-shaped inflation curve. <span style={{color:'#22c55e',fontWeight:600}}>LIP</span> = alveolar recruitment begins &mdash; set PEEP above LIP to prevent atelectrauma. <span style={{color:'#ef4444',fontWeight:600}}>UIP</span> = overdistension begins &mdash; keep Pplat below UIP to prevent volutrauma.</p>}
        {scenario==='recruited'&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.7}}><span style={{color:t.ac,fontWeight:600}}>Post-recruitment:</span> Steeper slope = improved compliance. Hysteresis means alveoli stay open at lower PEEP once recruited at high pressure. This is the physiology behind recruitment maneuvers.</p>}
      </div>
    </div>
  );
}

function IBWCalculator({t}) {
  const [sex,setSex]=useState('male');
  const [ft,setFt]=useState(5);
  const [inch,setInch]=useState(10);
  const [actualWt,setActualWt]=useState('');
  const totalIn=ft*12+inch;
  const ibw=Math.max(0,sex==='male'?50+2.3*(totalIn-60):45.5+2.3*(totalIn-60));
  const ibwR=Math.round(ibw*10)/10;
  const actN=parseFloat(actualWt);
  const showCmp=!isNaN(actN)&&actN>30;
  const diff=showCmp?Math.round(actN*6)-Math.round(ibwR*6):0;
  return(
    <div style={{marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:`2px solid ${t.wn}`}}>
      <div style={{background:t.bgH,padding:"10px 14px",borderBottom:`1px solid ${t.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"8px"}}>
        <span style={{fontSize:"12px",color:t.wn,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>IBW Calculator &mdash; Vt Targeting</span>
        <span style={{fontSize:"11px",color:t.tM}}>Always IBW, never actual body weight</span>
      </div>
      <div style={{padding:"16px",background:t.bgC}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:"14px",marginBottom:"16px"}}>
          <div>
            <div style={{fontSize:"11px",color:t.tM,marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Sex</div>
            <div style={{display:"flex",gap:"8px"}}>
              {['male','female'].map(s=><button key={s} onClick={()=>setSex(s)} style={{flex:1,padding:"7px",borderRadius:"6px",border:`1px solid ${sex===s?t.ac:t.bd}`,background:sex===s?t.aD:t.bgH,color:sex===s?t.ac:t.tM,fontSize:"12px",fontWeight:sex===s?700:400,cursor:"pointer",textTransform:"capitalize"}}>{s}</button>)}
            </div>
          </div>
          <div>
            <div style={{fontSize:"11px",color:t.tM,marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Height</div>
            <div style={{display:"flex",gap:"8px"}}>
              <select value={ft} onChange={e=>setFt(parseInt(e.target.value))} style={{flex:1,padding:"6px",borderRadius:"6px",border:`1px solid ${t.bd}`,background:t.bgH,color:t.tx,fontSize:"13px"}}>
                {[4,5,6,7].map(f=><option key={f} value={f}>{f} ft</option>)}
              </select>
              <select value={inch} onChange={e=>setInch(parseInt(e.target.value))} style={{flex:1,padding:"6px",borderRadius:"6px",border:`1px solid ${t.bd}`,background:t.bgH,color:t.tx,fontSize:"13px"}}>
                {[0,1,2,3,4,5,6,7,8,9,10,11].map(i2=><option key={i2} value={i2}>{i2} in</option>)}
              </select>
            </div>
          </div>
          <div>
            <div style={{fontSize:"11px",color:t.tM,marginBottom:"6px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Actual Wt (optional)</div>
            <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
              <input type="number" value={actualWt} onChange={e=>setActualWt(e.target.value)} placeholder="kg" min="30" max="300" style={{width:"80px",padding:"6px 8px",borderRadius:"6px",border:`1px solid ${t.bd}`,background:t.bgH,color:t.tx,fontSize:"13px"}}/>
              <span style={{fontSize:"12px",color:t.tM}}>kg</span>
            </div>
          </div>
        </div>
        <div style={{padding:"12px 16px",background:t.aD,borderRadius:"8px",border:`1px solid ${t.aB}`,marginBottom:"14px"}}>
          <div style={{fontSize:"10px",color:t.tM,marginBottom:"2px",textTransform:"uppercase"}}>Ideal Body Weight</div>
          <div style={{fontSize:"28px",fontWeight:700,color:t.ac}}>{ibwR} <span style={{fontSize:"16px"}}>kg</span></div>
          <div style={{fontSize:"10px",color:t.tM}}>{sex==='male'?`50 + 2.3 \u00d7 (${totalIn} − 60)`:`45.5 + 2.3 \u00d7 (${totalIn} − 60)`}</div>
        </div>
        <div style={{marginBottom:"14px"}}>
          <div style={{fontSize:"11px",color:t.tM,marginBottom:"8px",textTransform:"uppercase",letterSpacing:"0.5px"}}>Tidal Volume Targets</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"8px"}}>
            {[4,6,8].map(v=><div key={v} style={{padding:"10px",background:v===6?t.aD:t.bgH,borderRadius:"8px",border:`1px solid ${v===6?t.aB:t.bd}`,textAlign:"center"}}>
              <div style={{fontSize:"10px",color:v===6?t.ac:t.tM,marginBottom:"2px"}}>{v} mL/kg{v===4?' (ARDS min)':v===6?' (Target)':' (Max)'}</div>
              <div style={{fontSize:"22px",fontWeight:700,color:v===6?t.ac:t.tx}}>{Math.round(ibwR*v)} <span style={{fontSize:"11px"}}>mL</span></div>
            </div>)}
          </div>
        </div>
        {showCmp&&<div style={{padding:"12px 16px",background:diff>100?'#ef444412':'#22c55e10',borderRadius:"8px",border:`1px solid ${diff>100?t.dg:t.ok}`}}>
          <div style={{fontSize:"12px",fontWeight:700,color:diff>100?t.dg:t.ok,marginBottom:"4px"}}>{diff>100?'\u26a0 Obese — DO NOT use actual weight':'\u2713 Actual weight close to IBW'}</div>
          {diff>100&&<p style={{margin:0,fontSize:"12px",color:t.t2,lineHeight:1.6}}>6 mL/kg <strong>IBW</strong> = <span style={{color:t.ac,fontWeight:700}}>{Math.round(ibwR*6)} mL</span> vs. actual weight ({actN} kg) = <span style={{color:t.dg,fontWeight:700}}>{Math.round(actN*6)} mL</span> &mdash; <span style={{color:t.dg,fontWeight:700}}>{diff} mL</span> over target ({Math.round((diff/Math.round(ibwR*6))*100)}% excess).</p>}
        </div>}
      </div>
    </div>
  );
}

function PressureTroubleshooter({t}) {
  const [peak,setPeak]=useState('');
  const [plat,setPlat]=useState('');
  const pkN=parseFloat(peak),plN=parseFloat(plat);
  const valid=!isNaN(pkN)&&!isNaN(plN)&&pkN>0&&plN>0&&pkN>=plN;
  const gap=valid?pkN-plN:0;
  const dx=valid?(plN>30?'compliance':gap>10?'resistance':pkN<=35&&plN<=28?'normal':'borderline'):null;
  return(
    <div style={{marginTop:"20px",borderRadius:"10px",overflow:"hidden",border:`1px solid ${t.dg}40`}}>
      <div style={{background:t.bgH,padding:"10px 14px",borderBottom:`1px solid ${t.bd}`}}>
        <span style={{fontSize:"12px",color:t.dg,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.5px"}}>Pressure Troubleshooter</span>
      </div>
      <div style={{padding:"16px",background:t.bgC}}>
        <p style={{margin:"0 0 14px",fontSize:"13px",color:t.t2}}>Enter Ppeak and Pplat (from inspiratory hold) to get a guided differential.</p>
        <div style={{display:"flex",gap:"16px",flexWrap:"wrap",marginBottom:"16px",alignItems:"flex-end"}}>
          <div>
            <div style={{fontSize:"11px",color:t.tM,marginBottom:"4px",textTransform:"uppercase"}}>Ppeak (cmH&#8322;O)</div>
            <input type="number" value={peak} onChange={e=>setPeak(e.target.value)} placeholder="e.g. 42" min="5" max="80" style={{width:"100px",padding:"8px 10px",borderRadius:"6px",border:`1px solid ${t.bd}`,background:t.bgH,color:t.tx,fontSize:"15px",fontWeight:600}}/>
          </div>
          <div>
            <div style={{fontSize:"11px",color:t.tM,marginBottom:"4px",textTransform:"uppercase"}}>Pplat (cmH&#8322;O)</div>
            <input type="number" value={plat} onChange={e=>setPlat(e.target.value)} placeholder="e.g. 28" min="5" max="60" style={{width:"100px",padding:"8px 10px",borderRadius:"6px",border:`1px solid ${t.bd}`,background:t.bgH,color:t.tx,fontSize:"15px",fontWeight:600}}/>
            <div style={{fontSize:"10px",color:t.tM,marginTop:"2px"}}>From inspiratory hold</div>
          </div>
          {valid&&<div style={{padding:"10px 16px",background:t.bgH,borderRadius:"8px",textAlign:"center"}}>
            <div style={{fontSize:"10px",color:t.tM}}>Ppeak &minus; Pplat</div>
            <div style={{fontSize:"22px",fontWeight:700,color:gap>10?t.wn:t.ok}}>{gap.toFixed(0)} cmH&#8322;O</div>
            <div style={{fontSize:"10px",color:t.tM}}>Resistance component</div>
          </div>}
        </div>
        {dx==='normal'&&<div style={{padding:"14px 16px",background:'#22c55e10',borderRadius:"10px",border:`2px solid #22c55e`}}>
          <div style={{fontSize:"15px",fontWeight:700,color:'#22c55e',marginBottom:"6px"}}>&#10003; Pressures Within Target</div>
          <p style={{margin:0,fontSize:"13px",color:t.t2,lineHeight:1.7}}>Ppeak &lt;35, Pplat &lt;30, resistance component &lt;10 cmH&#8322;O. Lung-protective ventilation maintained.</p>
        </div>}
        {dx==='resistance'&&<div style={{padding:"14px 16px",background:'#f59e0b10',borderRadius:"10px",border:`2px solid ${t.wn}`}}>
          <div style={{fontSize:"15px",fontWeight:700,color:t.wn,marginBottom:"8px"}}>&#9888; Airway Resistance Problem</div>
          <p style={{fontSize:"13px",color:t.t2,marginBottom:"10px",lineHeight:1.7,margin:"0 0 10px"}}>Ppeak &minus; Pplat = <strong>{gap.toFixed(0)} cmH&#8322;O &gt;10</strong> &#8594; Resistance elevated; elastic component (Pplat) normal.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",fontSize:"12px"}}>
            <div><div style={{color:t.tx,fontWeight:600,marginBottom:"5px"}}>Causes</div><div style={{color:t.t2,lineHeight:1.9}}>Bronchospasm<br/>Secretions / mucus plug<br/>Kinked or bitten ETT<br/>Small ETT diameter<br/>Circuit obstruction</div></div>
            <div><div style={{color:t.tx,fontWeight:600,marginBottom:"5px"}}>Treatment</div><div style={{color:t.t2,lineHeight:1.9}}>Suction ETT<br/>Albuterol / bronchodilator<br/>Check circuit + ETT<br/>Add bite block<br/>Consider larger ETT</div></div>
          </div>
        </div>}
        {dx==='compliance'&&<div style={{padding:"14px 16px",background:'#ef444412',borderRadius:"10px",border:`2px solid ${t.dg}`}}>
          <div style={{fontSize:"15px",fontWeight:700,color:t.dg,marginBottom:"8px"}}>&#9888; Compliance Problem &mdash; ARDSNet Violation</div>
          <p style={{fontSize:"13px",color:t.t2,marginBottom:"10px",lineHeight:1.7,margin:"0 0 10px"}}>Pplat = <strong>{plN} cmH&#8322;O &gt;30</strong> &#8594; Stiff lungs. Immediate action required.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",fontSize:"12px"}}>
            <div><div style={{color:t.tx,fontWeight:600,marginBottom:"5px"}}>Causes</div><div style={{color:t.t2,lineHeight:1.9}}>ARDS / pulmonary edema<br/>Tension pneumothorax<br/>Mainstem intubation<br/>Atelectasis<br/>Obesity / abdominal HTN<br/>Chest wall rigidity</div></div>
            <div><div style={{color:t.tx,fontWeight:600,marginBottom:"5px"}}>Treatment</div><div style={{color:t.t2,lineHeight:1.9}}>&#8595; Vt to 5 then 4 mL/kg IBW<br/>Treat underlying cause<br/>CXR / assess for PTX<br/>Verify ETT position<br/>Permissive hypercapnia<br/>Consider PC mode</div></div>
          </div>
        </div>}
        {dx==='borderline'&&<div style={{padding:"14px 16px",background:t.bgH,borderRadius:"10px",border:`1px solid ${t.bd}`}}>
          <p style={{margin:0,fontSize:"13px",color:t.t2}}>Borderline pressures. Monitor closely. Ensure Vt is 6 mL/kg IBW and PEEP is optimized.</p>
        </div>}
        {!dx&&<div style={{padding:"24px",textAlign:"center",color:t.tM,background:t.bgH,borderRadius:"8px",border:`1px dashed ${t.bd}`,fontSize:"13px"}}>Enter Ppeak and Pplat values above to generate differential</div>}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function VentDevice({ t, theme }) {
  const [activeTab, setActiveTab] = useState("foundations");
  const [selMode, setSelMode] = useState(null);
  const tabs=[{id:"foundations",label:"Oxygenation vs Ventilation"},{id:"modes",label:"Vent Modes"},{id:"anesthesia",label:"Anesthesia Ventilation"},{id:"waveforms",label:"Waveforms & Graphics"},{id:"management",label:"Management & Troubleshooting"},{id:"pearls",label:"Clinical Pearls"},{id:"interview",label:"Interview Angles"}];

  const modes = {
    acvc:{name:"AC/VC (Volume Control)",full:"Assist-Control / Volume-Cycled",color:"#3b82f6",
      how:"Clinician sets: Vt, RR, FiO2, PEEP, flow rate, I:E ratio. Every breath (mandatory + triggered) delivers the SAME preset tidal volume. Breath cycles off when Vt delivered.",
      trigger:"Time-triggered (mandatory) or patient-triggered (flow/pressure sensor). If patient triggers, they still get the full preset Vt.",
      control:"Volume is guaranteed. Pressure is variable — depends on compliance and resistance. Rising Ppeak with stable Pplat = increased airway resistance. Rising both = decreased compliance.",
      advantage:"Guaranteed minute ventilation (Vt × RR). Predictable delivery. Best for paralyzed patients, ARDS (lung-protective strategy).",
      risk:"Pressure is NOT limited — can cause barotrauma if compliance drops. Breath stacking if patient\u2019s RR exceeds set rate with inadequate expiratory time. Patient-ventilator dyssynchrony if flow doesn\u2019t match demand.",
      settings:"Vt: 6–8 mL/kg IBW (ARDS: 6 mL/kg). RR: 12–20. FiO2: titrate to SpO2 >92%. PEEP: 5–20 cmH2O. Flow: 40–60 L/min. I:E typically 1:2–1:3."},
    acpc:{name:"AC/PC (Pressure Control)",full:"Assist-Control / Pressure-Cycled",color:"#8b5cf6",
      how:"Clinician sets: Inspiratory Pressure (above PEEP), RR, Ti (inspiratory time), FiO2, PEEP. Ventilator delivers flow until target pressure reached, then maintains it for set Ti. Volume delivered depends on compliance and resistance.",
      trigger:"Time or patient-triggered. Every breath gets the same pressure target.",
      control:"Pressure is guaranteed and limited. Volume varies with compliance changes — if compliance drops, Vt drops. Decelerating flow pattern = more even gas distribution.",
      advantage:"Pressure-limited = lower barotrauma risk. Better gas distribution (decelerating flow). More comfortable for breathing patients. Useful when Ppeak is dangerously high in VC.",
      risk:"Volume NOT guaranteed — must monitor Vt closely. If compliance improves suddenly, may over-ventilate. Need alarm for low Vt.",
      settings:"Driving pressure (Pinsp): 10–25 cmH2O above PEEP. Total pressure = PEEP + Pinsp. Ti: 0.8–1.2 sec. Target Vt: 6–8 mL/kg IBW. Monitor exhaled Vt every hour."},
    simv:{name:"SIMV",full:"Synchronized Intermittent Mandatory Ventilation",color:"#f59e0b",
      how:"Delivers a set number of mandatory breaths (VC or PC). Between mandatory breaths, patient can take spontaneous breaths at their own Vt (unsupported, or with PS). Mandatory breaths are synchronized to patient effort.",
      trigger:"Mandatory breaths: time-triggered, synchronized to patient effort within a timing window. Spontaneous breaths: patient-triggered.",
      control:"Mandatory breaths: volume or pressure controlled (SIMV-VC or SIMV-PC). Spontaneous breaths: patient determines Vt (may add Pressure Support).",
      advantage:"Allows partial ventilatory support. Can be used for weaning by gradually reducing mandatory rate. Maintains respiratory muscle conditioning.",
      risk:"Without PS, spontaneous breaths through the ETT increase WOB significantly. Increased WOB can cause fatigue and delayed weaning. Largely fallen out of favor for weaning vs. PS alone.",
      settings:"Mandatory RR: 4–12. Vt (if VC): 6–8 mL/kg IBW. PS for spontaneous breaths: 5–15 cmH2O. PEEP: 5+. FiO2: titrate."},
    psv:{name:"PSV (Pressure Support)",full:"Pressure Support Ventilation",color:"#10b981",
      how:"EVERY breath is patient-triggered. Ventilator augments each breath with a set pressure above PEEP. Patient controls their own RR, Ti, and Vt. Breath terminates when inspiratory flow drops to ~25% of peak (flow-cycled).",
      trigger:"100% patient-triggered. No mandatory breaths. Requires intact respiratory drive. APNEA BACKUP required.",
      control:"Pressure is set, volume varies. Patient has full control of timing and depth. Most comfortable mode for spontaneous breathing.",
      advantage:"Most physiologic and comfortable mode. Reduces WOB through ETT. Ideal for weaning and SBTs. Reduces sedation needs. Promotes diaphragm conditioning.",
      risk:"No guaranteed minute ventilation — apnea backup essential. Unreliable in patients with weak/absent respiratory drive, heavy sedation, or neuromuscular disease. Over-support (high PS) can cause over-ventilation and respiratory alkalosis.",
      settings:"PS: 5–20 cmH2O (start 10–15, wean to 5–8 for SBT). PEEP: 5. FiO2: titrate. SBT trial: PS 5–8 / PEEP 5 for 30–120 min."},
    prvc:{name:"PRVC",full:"Pressure-Regulated Volume Control",color:"#ec4899",
      how:"Dual-control mode. Clinician sets a TARGET Vt, and the ventilator automatically adjusts inspiratory pressure breath-by-breath to deliver that volume. Uses decelerating flow (like PC) but guarantees volume (like VC).",
      trigger:"Time or patient-triggered.",
      control:"Ventilator tests compliance with an initial breath, then adjusts pressure up/down (max \u00B13 cmH2O per breath) to hit target Vt. Combines pressure-limited delivery with volume guarantee.",
      advantage:"Best of both worlds: volume guarantee + pressure limitation + decelerating flow. Auto-adapts to changing compliance. Popular in ICU and anesthesia.",
      risk:"May under-ventilate if pressure ceiling is hit. Can \u201Cchase\u201D patient effort — if patient takes large breaths, vent decreases support (reverse-triggering problem). False sense of security.",
      settings:"Target Vt: 6–8 mL/kg IBW. RR: 12–20. Pressure limit: usually auto, monitor Pinsp trend. PEEP: 5–20. FiO2: titrate."},
    aprv:{name:"APRV",full:"Airway Pressure Release Ventilation",color:"#ef4444",
      how:"Maintains a high CPAP level (P_high) for a prolonged time (T_high, ~4–6 sec), then briefly releases to a low pressure (P_low) for a short time (T_low, ~0.4–0.8 sec). The release creates expiratory flow that clears CO2. Patient breathes spontaneously at both pressure levels.",
      trigger:"Time-cycled releases. Spontaneous breathing occurs throughout.",
      control:"Inverse I:E ratio (typically 4:1 to 10:1). P_high provides continuous recruitment. Brief T_low creates \u201Cautocycling\u201D ventilation. Spontaneous breathing maintained.",
      advantage:"Continuous alveolar recruitment — open lung strategy. Preserves spontaneous breathing (less diaphragm atrophy, less sedation). May improve V/Q matching. Used in refractory ARDS.",
      risk:"Requires spontaneous breathing — difficult with paralysis. Complex to set and monitor. Auto-PEEP from short T_low. Risk of hemodynamic compromise from sustained high intrathoracic pressure. Not well-studied vs. conventional low-Vt ventilation.",
      settings:"P_high: ~20–30 cmH2O (set at previous Pplat). P_low: 0 cmH2O. T_high: 4–6 sec. T_low: 0.4–0.8 sec (set so expiratory flow drops to ~75% of peak). FiO2: titrate."},
    hfov:{name:"HFOV",full:"High-Frequency Oscillatory Ventilation",color:"#64748b",
      how:"Delivers very small tidal volumes (1–3 mL/kg) at extremely high frequencies (3–15 Hz = 180–900 breaths/min). Continuous distending pressure (mPaw) keeps lungs recruited. Oscillations create gas mixing via multiple mechanisms (not bulk flow).",
      trigger:"Not patient-triggered. Continuous oscillation.",
      control:"Set: mPaw (mean airway pressure), frequency (Hz), amplitude (\u0394P), FiO2, I:E (typically 1:2). Oxygenation: adjust mPaw and FiO2. Ventilation: adjust amplitude and frequency (lower Hz = more CO2 clearance).",
      advantage:"Ultra-protective — tiny Vt avoids volutrauma. Continuous recruitment avoids atelectrauma. Theoretical ideal for ARDS.",
      risk:"OSCAR and OSCILLATE trials (2013): no benefit, possible harm in adults. Largely abandoned in adult ICU. Still used in neonatal/pediatric. Hemodynamic compromise from high mPaw. Difficult to monitor. Requires specialized circuit.",
      settings:"mPaw: 5 cmH2O above conventional. Frequency: 5–8 Hz (adults). Amplitude: until visible chest wiggle. FiO2: start 1.0, wean. Rarely used in adult practice after 2013 trials."}
  };

  const H=({title})=><h2 style={{color:t.tx,fontSize:"22px",fontWeight:600,marginTop:"32px",marginBottom:"16px",paddingBottom:"8px",borderBottom:`1px solid ${t.bd}`}}>{title}</h2>;
  const B=({children})=><div style={{lineHeight:1.8,fontSize:"15px",color:t.t2}}>{children}</div>;
  const HL=({children})=><span style={{color:t.ac,fontWeight:600}}>{children}</span>;
  const Pl=({number,title,children})=><div style={{padding:"20px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`,marginBottom:"12px"}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px"}}><span style={{background:t.aD,color:t.ac,padding:"2px 10px",borderRadius:"12px",fontSize:"12px",fontWeight:600}}>Pearl #{number}</span><span style={{color:t.tx,fontWeight:600,fontSize:"15px"}}>{title}</span></div><p style={{color:t.t2,fontSize:"14px",lineHeight:1.7,margin:0}}>{children}</p></div>;

  return (<div style={{maxWidth:"1100px",margin:"0 auto",padding:"16px"}}>
    <div style={{background:t.hd,borderBottom:`2px solid ${t.ac}`,padding:"16px 20px 14px",borderRadius:"12px 12px 0 0"}}>
      <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"8px",flexWrap:"wrap"}}>
        <h1 style={{margin:0,fontSize:"22px",fontWeight:700,color:t.tx,lineHeight:1.2}}>Ventilator Modes &amp; Management</h1>
      </div>
      <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
        {["Mechanical Ventilation","Oxygenation &amp; Ventilation","Anesthesia Specific","Waveform Analysis"].map(tg=><span key={tg} style={{background:t.aD,border:`1px solid ${t.aB}`,color:t.ac,padding:"2px 10px",borderRadius:"20px",fontSize:"11px",fontWeight:500}}>{tg}</span>)}
      </div>
    </div>
    <div style={{display:"flex",gap:"2px",padding:"0 4px",background:t.bgH,borderBottom:`1px solid ${t.bd}`,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      {tabs.map(tb=><button key={tb.id} onClick={()=>setActiveTab(tb.id)} style={{padding:"10px 14px",background:activeTab===tb.id?t.bgC:"transparent",color:activeTab===tb.id?t.ac:t.tM,border:"none",borderBottom:activeTab===tb.id?`2px solid ${t.ac}`:"2px solid transparent",cursor:"pointer",fontSize:"12px",fontWeight:activeTab===tb.id?600:400,whiteSpace:"nowrap",transition:"all 0.2s",flexShrink:0}}>{tb.label}</button>)}
    </div>
    <div style={{padding:"24px 0"}}>

    {activeTab==="foundations"&&<div>
      <H title="The Critical Distinction" />
      <B><p>Understanding the difference between <HL>oxygenation</HL> and <HL>ventilation</HL> is fundamental to managing any ventilator and the most commonly tested concept in CRNA interviews. They are two completely separate physiologic processes with different determinants, different problems, and different interventions.</p></B>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px",margin:"20px 0"}}>
        <div style={{padding:"28px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${t.bl}`}}>
          <div style={{fontSize:"20px",color:t.bl,fontWeight:700,marginBottom:"6px"}}>Oxygenation</div>
          <div style={{fontSize:"13px",color:t.tM,marginBottom:"14px"}}>Getting O&#8322; INTO the blood</div>
          <div style={{fontSize:"14px",color:t.t2,lineHeight:1.8}}>
            <p><strong style={{color:t.tx}}>Measured by:</strong> PaO&#8322;, SpO&#8322;, P/F ratio</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Determinants:</strong> FiO&#8322;, PEEP (alveolar recruitment), mean airway pressure, V/Q matching, diffusion capacity, shunt fraction</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Fix hypoxemia:</strong> Increase FiO&#8322; and/or PEEP. Optimize V/Q matching. Treat shunt (recruit collapsed alveoli). Prone positioning.</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Key equation:</strong></p>
            <div style={{fontFamily:"monospace",fontSize:"13px",color:t.ac,background:t.bgH,padding:"10px",borderRadius:"6px",marginTop:"6px"}}>PAO&#8322; = FiO&#8322;(P_atm &minus; P_H2O) &minus; (PaCO&#8322;/RQ)</div>
            <div style={{fontSize:"12px",color:t.tM,marginTop:"4px"}}>Alveolar Gas Equation &mdash; predicts maximum PaO&#8322;</div>
          </div>
        </div>
        <div style={{padding:"28px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${t.wn}`}}>
          <div style={{fontSize:"20px",color:t.wn,fontWeight:700,marginBottom:"6px"}}>Ventilation</div>
          <div style={{fontSize:"13px",color:t.tM,marginBottom:"14px"}}>Getting CO&#8322; OUT of the blood</div>
          <div style={{fontSize:"14px",color:t.t2,lineHeight:1.8}}>
            <p><strong style={{color:t.tx}}>Measured by:</strong> PaCO&#8322;, EtCO&#8322;</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Determinants:</strong> Minute ventilation (V&#7431; = Vt &times; RR), dead space fraction (Vd/Vt), alveolar ventilation = (Vt &minus; Vd) &times; RR</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Fix hypercarbia:</strong> Increase Vt or RR (increase minute ventilation). Decrease dead space. Note: PEEP does NOT directly improve ventilation.</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Key equation:</strong></p>
            <div style={{fontFamily:"monospace",fontSize:"13px",color:t.ac,background:t.bgH,padding:"10px",borderRadius:"6px",marginTop:"6px"}}>PaCO&#8322; = (VCO&#8322; &times; 0.863) / V&#7431;</div>
            <div style={{fontSize:"12px",color:t.tM,marginTop:"4px"}}>PaCO&#8322; is inversely proportional to alveolar ventilation</div>
          </div>
        </div>
      </div>

      <H title="P/F Ratio &mdash; Quantifying Oxygenation Failure" />
      <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.bd}`}}>
        <div style={{fontFamily:"monospace",fontSize:"18px",color:t.ac,fontWeight:700,textAlign:"center",marginBottom:"16px"}}>P/F = PaO&#8322; / FiO&#8322;</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"12px"}}>
          {[{label:"Normal",range:">400",color:t.ok,desc:"PaO2 80+ on RA"},{label:"Mild ARDS",range:"200–300",color:t.wn,desc:"Berlin criteria"},{label:"Moderate ARDS",range:"100–200",color:"#f97316",desc:"Consider prone"},{label:"Severe ARDS",range:"<100",color:t.dg,desc:"Prone, consider ECMO"}].map((pf,i)=>(
            <div key={i} style={{padding:"14px",background:t.bgH,borderRadius:"8px",textAlign:"center",borderTop:`3px solid ${pf.color}`}}>
              <div style={{fontSize:"12px",color:pf.color,fontWeight:600,marginBottom:"4px"}}>{pf.label}</div>
              <div style={{fontSize:"18px",color:t.tx,fontWeight:700}}>{pf.range}</div>
              <div style={{fontSize:"11px",color:t.tM,marginTop:"4px"}}>{pf.desc}</div>
            </div>))}
        </div>
      </div>

      <H title="Compliance & Resistance" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
        <div style={{padding:"20px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`}}>
          <div style={{color:t.ac,fontWeight:700,fontSize:"15px",marginBottom:"10px"}}>Static Compliance (Cstat)</div>
          <div style={{fontFamily:"monospace",color:t.ac,fontSize:"14px",background:t.bgH,padding:"8px",borderRadius:"6px",textAlign:"center",marginBottom:"10px"}}>Cstat = Vt / (Pplat &minus; PEEP)</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>Normal: 60&ndash;100 mL/cmH2O. Measures lung + chest wall elastic recoil. Decreased in: ARDS, pulmonary fibrosis, atelectasis, pneumothorax, chest wall rigidity, abdominal compartment syndrome.</div>
        </div>
        <div style={{padding:"20px",background:t.bgC,borderRadius:"8px",border:`1px solid ${t.bd}`}}>
          <div style={{color:t.wn,fontWeight:700,fontSize:"15px",marginBottom:"10px"}}>Dynamic Compliance (Cdyn)</div>
          <div style={{fontFamily:"monospace",color:t.wn,fontSize:"14px",background:t.bgH,padding:"8px",borderRadius:"6px",textAlign:"center",marginBottom:"10px"}}>Cdyn = Vt / (Ppeak &minus; PEEP)</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>Includes airway resistance component. Ppeak &minus; Pplat = resistive pressure (from ETT, bronchospasm, secretions). If Ppeak rises but Pplat stable: airway resistance problem. If both rise: compliance problem.</div>
        </div>
      </div>

      <H title="Dead Space vs. Shunt" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
        <div style={{padding:"20px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.wn}`}}>
          <div style={{color:t.wn,fontWeight:700,fontSize:"15px",marginBottom:"8px"}}>Dead Space (V/Q &rarr; &infin;)</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>Ventilated but NOT perfused. Wasted ventilation. CO2 elimination impaired. Causes: PE, low CO, overdistension, high PEEP. Anatomic (conducting airways ~150 mL) + alveolar (pathologic). Measured by Bohr equation. EtCO2-PaCO2 gradient widens.</div>
        </div>
        <div style={{padding:"20px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.bl}`}}>
          <div style={{color:t.bl,fontWeight:700,fontSize:"15px",marginBottom:"8px"}}>Shunt (V/Q &rarr; 0)</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>Perfused but NOT ventilated. Blood bypasses gas exchange. Oxygenation impaired. Does NOT respond to supplemental O2 (key distinction). Causes: atelectasis, consolidation, ARDS, intracardiac R-to-L shunt. Treatment: PEEP/recruitment, not FiO2.</div>
        </div>
      </div>
    </div>}

    {activeTab==="modes"&&<div>
      <H title="Ventilator Modes" />
      <B><p>Select a mode to see detailed settings, advantages, risks, and clinical application.</p></B>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:"10px",margin:"16px 0 24px"}}>
        {Object.entries(modes).map(([k,m])=>(
          <button key={k} onClick={()=>setSelMode(selMode===k?null:k)} style={{padding:"16px",background:selMode===k?`${m.color}15`:t.bgC,borderRadius:"10px",border:selMode===k?`2px solid ${m.color}`:`1px solid ${t.bd}`,cursor:"pointer",textAlign:"left",transition:"all 0.2s"}}>
            <div style={{fontSize:"14px",fontWeight:700,color:selMode===k?m.color:t.tx,marginBottom:"4px"}}>{m.name}</div>
            <div style={{fontSize:"11px",color:t.tM}}>{m.full}</div>
          </button>))}
      </div>
      {selMode&&modes[selMode]&&(()=>{const m=modes[selMode];return(
        <div style={{padding:"28px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${m.color}`,marginBottom:"20px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"16px"}}>
            <div><div style={{fontSize:"20px",fontWeight:700,color:m.color}}>{m.name}</div><div style={{fontSize:"13px",color:t.tM}}>{m.full}</div></div>
            <button onClick={()=>setSelMode(null)} style={{background:t.bgS,border:"none",color:t.tM,cursor:"pointer",padding:"4px 10px",borderRadius:"4px",fontSize:"12px"}}>&#10005;</button>
          </div>
          {[{label:"How It Works",text:m.how,color:m.color},{label:"Trigger / Cycling",text:m.trigger,color:t.ac},{label:"Control Variable",text:m.control,color:t.bl},{label:"Advantages",text:m.advantage,color:t.ok},{label:"Risks / Limitations",text:m.risk,color:t.dg},{label:"Typical Settings",text:m.settings,color:t.wn}].map((s,i)=>(
            <div key={i} style={{marginBottom:"14px"}}>
              <div style={{fontSize:"12px",color:s.color,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"4px"}}>{s.label}</div>
              <p style={{color:t.t2,fontSize:"14px",lineHeight:1.8,margin:0}}>{s.text}</p>
            </div>))}
          <VentModeWaveform modeKey={selMode} modeColor={m.color} t={t} />
        </div>);})()}
      {!selMode&&<div style={{padding:"40px",textAlign:"center",color:t.tM,background:t.bgC,borderRadius:"12px",border:`1px dashed ${t.bd}`}}>Select a mode above to see detailed information</div>}
    </div>}

    {activeTab==="anesthesia"&&<div>
      <H title="Anesthesia Ventilation" />
      <B><p>Anesthesia circuits and ventilators differ significantly from ICU ventilators. Understanding these differences is high-yield for CRNA interviews.</p></B>

      <div style={{display:"grid",gap:"16px",marginTop:"20px"}}>
        <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${t.ac}`}}>
          <div style={{color:t.ac,fontSize:"17px",fontWeight:700,marginBottom:"12px"}}>Anesthesia Circle System</div>
          <div style={{color:t.t2,fontSize:"14px",lineHeight:1.8}}>
            <p>Closed/semi-closed circuit with CO2 absorber (soda lime). Unidirectional valves ensure gas flows: patient &rarr; expiratory limb &rarr; absorber &rarr; fresh gas &rarr; inspiratory limb &rarr; patient. Fresh gas flow (FGF) replaces consumed O2 and washed-out anesthetic. Low-flow anesthesia (FGF 0.5&ndash;1 L/min) conserves volatile agent and humidity but requires reliable agent monitoring.</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>Soda lime exhaustion signs:</strong> Color change (indicator dye), rising inspired CO2 on capnography, tachycardia, hypertension, flushing. Compound A production with sevoflurane at low flows (clinically insignificant at FGF &ge;1 L/min).</p>
          </div>
        </div>
        <CircleSystemDiagram t={t} />

        <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${t.wn}`}}>
          <div style={{color:t.wn,fontSize:"17px",fontWeight:700,marginBottom:"12px"}}>Anesthesia vs. ICU Ventilator</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginTop:"12px"}}>
            {[{param:"Circuit",anes:"Circle system with CO2 absorber",icu:"Open circuit, no rebreathing"},{param:"FGF Dependency",anes:"Delivered Vt affected by FGF and circuit compliance",icu:"No FGF interaction"},{param:"Modes Available",anes:"VC, PC, PSV, PRVC (modern). Older: bellows only",icu:"Full spectrum including APRV, HFOV, NAVA"},{param:"PEEP",anes:"APL valve or electronic PEEP",icu:"Electronic PEEP with full range"},{param:"Monitoring",anes:"Agent analyzer, circle pressure, bellows movement",icu:"Advanced graphics, loops, esophageal manometry"},{param:"Humidification",anes:"Circle + low flow preserves humidity, HME",icu:"Active heated humidifier or HME"}].map((r,i)=>(
              <div key={i} style={{padding:"12px",background:t.bgH,borderRadius:"8px"}}>
                <div style={{fontSize:"11px",color:t.tM,textTransform:"uppercase",marginBottom:"6px"}}>{r.param}</div>
                <div style={{fontSize:"12px",marginBottom:"4px"}}><span style={{color:t.ac,fontWeight:600}}>Anesthesia:</span> <span style={{color:t.tx}}>{r.anes}</span></div>
                <div style={{fontSize:"12px"}}><span style={{color:t.wn,fontWeight:600}}>ICU:</span> <span style={{color:t.t2}}>{r.icu}</span></div>
              </div>))}
          </div>
        </div>

        <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${t.bl}`}}>
          <div style={{color:t.bl,fontSize:"17px",fontWeight:700,marginBottom:"12px"}}>Intraoperative Ventilation Strategy</div>
          <div style={{color:t.t2,fontSize:"14px",lineHeight:1.8}}>
            <p><strong style={{color:t.tx}}>Lung-protective ventilation in the OR</strong> is now standard of care, not just for ARDS patients. The IMPROVE trial (2013) and iPROVE network demonstrated that intraoperative protective ventilation reduces postoperative pulmonary complications.</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.ac}}>Standard OR settings:</strong> Vt 6&ndash;8 mL/kg IBW, PEEP 5&ndash;8 cmH2O, recruitment maneuvers q30&ndash;60 min (sustained inflation 30 cmH2O &times; 30 sec), FiO2 titrated to SpO2 (avoid unnecessary hyperoxia). Plateau pressure &lt;30 cmH2O. Driving pressure &lt;15 cmH2O.</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.wn}}>Driving pressure</strong> = Pplat &minus; PEEP. Emerging as the strongest predictor of postoperative pulmonary complications. Target &lt;15 cmH2O. Reflects the strain applied to functional lung tissue.</p>
          </div>
        </div>

        <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${t.pr}`}}>
          <div style={{color:t.pr,fontSize:"17px",fontWeight:700,marginBottom:"12px"}}>One-Lung Ventilation (OLV)</div>
          <div style={{color:t.t2,fontSize:"14px",lineHeight:1.8}}>
            <p>Used for thoracic surgery via double-lumen ETT (DLT) or bronchial blocker. Non-ventilated lung collapses for surgical access. Ventilated lung receives entire cardiac output worth of V/Q matching demand.</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.tx}}>OLV management:</strong> Vt 4&ndash;6 mL/kg IBW (one lung!), RR titrate to PaCO2, PEEP 5&ndash;10 cmH2O to ventilated lung, FiO2 1.0 initially then titrate. Permissive hypercapnia acceptable. If SpO2 drops: CPAP 5&ndash;10 to operative lung, recruitment of dependent lung, partial ventilation of operative lung.</p>
            <p style={{marginTop:"10px"}}><strong style={{color:t.wn}}>Hypoxic Pulmonary Vasoconstriction (HPV):</strong> Intrinsic protective mechanism. Non-ventilated alveoli sense low PAO2 &rarr; local arteriolar constriction &rarr; diverts blood away from collapsed lung toward ventilated lung. Volatile anesthetics inhibit HPV in a dose-dependent manner (&gt;1 MAC). IV anesthesia (TIVA) preserves HPV.</p>
          </div>
        </div>
        <OLVDiagram t={t} />
      </div>
    </div>}

    {activeTab==="waveforms"&&<div>
      <H title="Ventilator Waveform Analysis" />
      <B><p>Waveform interpretation is a core ICU and anesthesia competency. The three primary waveforms are pressure-time, flow-time, and volume-time.</p></B>

      <div style={{display:"grid",gap:"16px",marginTop:"20px"}}>
        {[{title:"Pressure-Time Waveform",color:t.ac,content:[
          {label:"Volume Control",desc:"Square flow pattern creates a rising, linear pressure waveform. Ppeak reflects total inspiratory pressure (elastic + resistive). Inspiratory pause reveals Pplat (elastic only). Gap between Ppeak and Pplat = resistive pressure from ETT/airways."},
          {label:"Pressure Control",desc:"Square pressure waveform (constant pressure throughout inspiration). Decelerating flow as alveoli fill. Better gas distribution. Ppeak = set pressure + PEEP."},
          {label:"Auto-PEEP Detection",desc:"If expiratory flow doesn\u2019t return to zero before next breath, auto-PEEP (intrinsic PEEP) is present. Perform expiratory hold — total PEEP displayed. Auto-PEEP = total PEEP − set PEEP. Causes: high RR, long Ti, bronchospasm, secretions."}
        ]},{title:"Flow-Time Waveform",color:t.bl,content:[
          {label:"VC Pattern",desc:"Constant (square) inspiratory flow. Expiratory flow is passive and decelerating. Flow returns to baseline before next breath (no auto-PEEP) or doesn\u2019t (auto-PEEP present)."},
          {label:"PC Pattern",desc:"Decelerating inspiratory flow (high initial, tapers as pressure equilibrates). More physiologic gas distribution. Expiratory flow similar to VC."},
          {label:"Bronchospasm",desc:"Expiratory flow shows \u201Cscooped\u201D or concave pattern (slow emptying). Prolonged expiratory time. May not return to baseline before next breath → air trapping."}
        ]},{title:"Volume-Time Waveform",color:t.wn,content:[
          {label:"Normal",desc:"Linear rise during inspiration (constant flow) or curved rise (decelerating flow). Rapid drop during expiration. Exhaled Vt should equal inspired Vt — a leak shows as a gap."},
          {label:"Leak Detection",desc:"Inspired > expired volume. Causes: cuff leak, circuit disconnect, chest tube with bronchopleural fistula."}
        ]}].map((w,i)=>(
          <div key={i} style={{padding:"24px",background:t.bgC,borderRadius:"12px",borderLeft:`5px solid ${w.color}`}}>
            <div style={{color:w.color,fontSize:"17px",fontWeight:700,marginBottom:"16px"}}>{w.title}</div>
            {w.content.map((c,j)=>(
              <div key={j} style={{marginBottom:j<w.content.length-1?"14px":"0"}}>
                <div style={{fontSize:"13px",color:t.tx,fontWeight:600,marginBottom:"4px"}}>{c.label}</div>
                <p style={{color:t.t2,fontSize:"13px",lineHeight:1.7,margin:0}}>{c.desc}</p>
              </div>))}
          </div>))}
      </div>

      <H title="Pressure-Volume Loops" />
      <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.bd}`}}>
        <div style={{color:t.t2,fontSize:"14px",lineHeight:1.8}}>
          <p><strong style={{color:t.ac}}>Lower inflection point (LIP):</strong> Pressure at which alveolar recruitment begins. Set PEEP at or above LIP to prevent cyclic collapse (atelectrauma).</p>
          <p style={{marginTop:"10px"}}><strong style={{color:t.dg}}>Upper inflection point (UIP):</strong> Pressure at which overdistension begins. Keep Pplat below UIP to prevent volutrauma. Typically &lt;30 cmH2O.</p>
          <p style={{marginTop:"10px"}}><strong style={{color:t.wn}}>Hysteresis:</strong> Inflation and deflation limbs don\u2019t overlap — the lung requires less pressure to stay open than to open. This is why recruitment maneuvers work: once recruited at high pressure, alveoli stay open at lower PEEP.</p>
        </div>
      </div>
      <WaveformPatternSelector t={t} />
      <PVLoopDiagram t={t} />
    </div>}

    {activeTab==="management"&&<div>
      <H title="Initial Ventilator Settings" />
      <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.bd}`}}>
        <div style={{display:"grid",gap:"12px"}}>
          {[{param:"Mode",val:"AC/VC or AC/PC",note:"VC for guaranteed ventilation. PC if Ppeak >35 cmH2O"},{param:"Vt",val:"6–8 mL/kg IBW",note:"Use IDEAL body weight, not actual. IBW based on height and sex"},{param:"RR",val:"12–20 breaths/min",note:"Adjust to target PaCO2 35–45. Higher in metabolic acidosis"},{param:"FiO2",val:"Start 1.0, wean to <0.6",note:"O2 toxicity risk >0.6 for >24hr. Target SpO2 92–96%"},{param:"PEEP",val:"5 cmH2O minimum",note:"ARDS: use ARDSNet PEEP/FiO2 tables. Never 0 in intubated patients"},{param:"Flow Rate",val:"40–60 L/min (VC)",note:"Increase if flow-starved (concave pressure waveform)"},{param:"I:E Ratio",val:"1:2 to 1:3",note:"Longer expiration for obstructive disease. Inverse ratio for severe ARDS only"}].map((s,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"140px 180px 1fr",gap:"12px",padding:"10px",background:i%2===0?t.bgH:"transparent",borderRadius:"6px",alignItems:"center"}}>
              <div style={{fontSize:"14px",color:t.ac,fontWeight:600}}>{s.param}</div>
              <div style={{fontSize:"14px",color:t.tx,fontWeight:700}}>{s.val}</div>
              <div style={{fontSize:"12px",color:t.t2}}>{s.note}</div>
            </div>))}
        </div>
      </div>

      <H title="IBW Calculation" />
      <div style={{padding:"20px",background:t.bgC,borderRadius:"12px",border:`2px solid ${t.wn}`}}>
        <div style={{color:t.wn,fontWeight:700,marginBottom:"10px"}}>ALWAYS use Ideal Body Weight for Vt calculation</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px"}}>
          <div style={{fontFamily:"monospace",fontSize:"14px",color:t.ac,background:t.bgH,padding:"12px",borderRadius:"8px"}}>Male IBW = 50 + 2.3 &times; (height_in &minus; 60)</div>
          <div style={{fontFamily:"monospace",fontSize:"14px",color:t.ac,background:t.bgH,padding:"12px",borderRadius:"8px"}}>Female IBW = 45.5 + 2.3 &times; (height_in &minus; 60)</div>
        </div>
        <p style={{color:t.t2,fontSize:"13px",marginTop:"10px"}}>A 5&rsquo;4&rdquo; female: IBW = 45.5 + 2.3(64&minus;60) = 54.7 kg. Vt at 6 mL/kg = 328 mL. A common error: using actual weight of 95 kg &rarr; Vt 570 mL = volutrauma.</p>
      </div>
      <IBWCalculator t={t} />

      <H title="Troubleshooting High Pressures" />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginTop:"16px"}}>
        <div style={{padding:"20px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.dg}`}}>
          <div style={{color:t.dg,fontWeight:700,fontSize:"15px",marginBottom:"10px"}}>High Ppeak + Normal Pplat</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>= Airway RESISTANCE problem. Ppeak &minus; Pplat &gt;10 cmH2O.</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7,marginTop:"8px"}}>Causes: bronchospasm, secretions, mucus plug, kinked ETT, biting ETT, small ETT, circuit obstruction. Treatment: suction, bronchodilators, check circuit, bite block.</div>
        </div>
        <div style={{padding:"20px",background:t.bgC,borderRadius:"8px",borderLeft:`4px solid ${t.wn}`}}>
          <div style={{color:t.wn,fontWeight:700,fontSize:"15px",marginBottom:"10px"}}>High Ppeak + High Pplat</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7}}>= COMPLIANCE problem. Pplat &gt;30 cmH2O.</div>
          <div style={{fontSize:"13px",color:t.t2,lineHeight:1.7,marginTop:"8px"}}>Causes: ARDS, pneumothorax, mainstem intubation, pulmonary edema, atelectasis, abdominal distension, chest wall rigidity, obesity. Treatment: reduce Vt, treat underlying cause, consider PC mode.</div>
        </div>
      </div>
      <PressureTroubleshooter t={t} />

      <H title="ARDSNet Protocol" />
      <div style={{padding:"24px",background:t.bgC,borderRadius:"12px",border:`1px solid ${t.bd}`}}>
        <div style={{color:t.ac,fontWeight:700,fontSize:"16px",marginBottom:"12px"}}>Low Tidal Volume Ventilation (LTVV)</div>
        <div style={{color:t.t2,fontSize:"14px",lineHeight:1.8}}>
          <p>The ARMA trial (2000, NEJM) showed 22% mortality reduction with 6 mL/kg IBW vs. 12 mL/kg. This is one of the most important ventilator trials ever conducted and is expected knowledge for CRNA interviews.</p>
          <div style={{padding:"14px",background:t.bgH,borderRadius:"8px",margin:"12px 0"}}>
            <p style={{margin:"0 0 6px"}}><strong style={{color:t.ac}}>Vt:</strong> 6 mL/kg IBW (range 4&ndash;8)</p>
            <p style={{margin:"0 0 6px"}}><strong style={{color:t.ac}}>Pplat target:</strong> &le;30 cmH2O. If &gt;30, decrease Vt to 5 then 4 mL/kg</p>
            <p style={{margin:"0 0 6px"}}><strong style={{color:t.ac}}>pH target:</strong> 7.30&ndash;7.45. Permissive hypercapnia acceptable</p>
            <p style={{margin:"0 0 6px"}}><strong style={{color:t.ac}}>SpO2 target:</strong> 88&ndash;95%</p>
            <p style={{margin:0}}><strong style={{color:t.ac}}>PEEP/FiO2:</strong> Use ARDSNet tables (low or high PEEP strategy)</p>
          </div>
        </div>
      </div>
    </div>}

    {activeTab==="pearls"&&<div>
      <H title="Ventilator Clinical Pearls" />
      <Pl number={1} title="Ppeak vs. Pplat Is THE Bedside Diagnostic">Ppeak = resistive + elastic pressure. Pplat = elastic only (measured during inspiratory hold with zero flow). The gap between them IS the airway resistance component. This single maneuver guides your differential: bronchospasm vs. ARDS vs. pneumothorax.</Pl>
      <Pl number={2} title="PEEP Fixes Oxygenation, Not Ventilation">PEEP recruits collapsed alveoli, increases FRC, improves V/Q matching, and shifts the P-V curve left. It does NOT directly improve CO2 clearance. If PaCO2 is high, increase RR or Vt &mdash; not PEEP. PEEP can actually INCREASE dead space if overdistension occurs.</Pl>
      <Pl number={3} title="Driving Pressure May Be the Best Predictor">Driving pressure = Pplat &minus; PEEP. Reflects strain on functional lung. Amato (2015, NEJM): driving pressure was the ventilation variable most strongly associated with survival in ARDS. Target &lt;15 cmH2O. This may be more important than Vt or PEEP individually.</Pl>
      <Pl number={4} title="Auto-PEEP Is Silent and Dangerous">Unrecognized auto-PEEP causes hemodynamic compromise (decreased venous return), increased WOB, patient-ventilator dyssynchrony, and inaccurate compliance calculations. Diagnose: expiratory hold maneuver, flow-time waveform (flow doesn&rsquo;t reach zero). Treat: decrease RR, decrease I:E ratio, bronchodilators, increase expiratory time.</Pl>
      <Pl number={5} title="IBW Errors Kill People">A 5&rsquo;2&rdquo; patient weighing 120 kg has an IBW of ~50 kg. Vt at 6 mL/kg IBW = 300 mL. Using actual weight gives 720 mL = guaranteed volutrauma. Always calculate IBW from HEIGHT, not weight. This is the most common and most dangerous ventilator error.</Pl>
      <Pl number={6} title="SBT Criteria">Ready for spontaneous breathing trial when: FiO2 &le;0.4, PEEP &le;8, patient triggers breaths, adequate cough/gag, hemodynamically stable, no high-dose vasopressors, minimal sedation. SBT: PS 5&ndash;8 / PEEP 5 for 30&ndash;120 min. RSBI = RR/Vt(L) &lt;105 predicts successful extubation.</Pl>
      <Pl number={7} title="Volatile Agents and HPV">All volatile anesthetics inhibit hypoxic pulmonary vasoconstriction dose-dependently. At 1 MAC, inhibition is ~20%. At 2 MAC, significant. This matters during OLV &mdash; higher volatile concentrations worsen shunt. TIVA preserves HPV. IV agents (propofol, opioids, ketamine) do not inhibit HPV.</Pl>
    </div>}

    {activeTab==="interview"&&<div>
      <H title="Interview Angles" />
      <div style={{display:"grid",gap:"16px",marginTop:"16px"}}>
        {[{q:"Patient intubated for ARDS, Ppeak 42, Pplat 34. What do you do?",a:"Both pressures are elevated, so this is a compliance problem (not resistance). Pplat >30 violates ARDSNet protocol. Reduce Vt to 5 then 4 mL/kg IBW until Pplat ≤30. Accept permissive hypercapnia (pH >7.25). Optimize PEEP using ARDSNet table or driving pressure approach. If Pplat was normal with high Ppeak, that\u2019s resistance — suction, bronchodilators, check ETT.",f:"What if pH drops to 7.18 with low Vt? How do you calculate driving pressure?"},{q:"Explain the difference between oxygenation and ventilation.",a:"Oxygenation = getting O2 into blood. Measured by PaO2/SpO2. Determined by FiO2, PEEP, mean airway pressure, V/Q matching, shunt. Fix with FiO2 and PEEP. Ventilation = removing CO2. Measured by PaCO2/EtCO2. Determined by minute ventilation (Vt × RR) and dead space. Fix with RR and Vt. They are independent — a patient can be well-oxygenated but hypoventilating, or vice versa.",f:"Shunt vs. dead space — which responds to supplemental O2?"},{q:"You\u2019re doing a right thoracotomy. SpO2 drops to 88% during OLV. Management?",a:"Systematic approach: (1) Confirm DLT position with fiberoptic bronchoscopy. (2) Increase FiO2 to 1.0. (3) Recruitment maneuver to dependent lung. (4) Apply CPAP 5–10 to operative lung. (5) Ensure adequate Vt (4–6 mL/kg) and PEEP (5–10) to dependent lung. (6) Consider TIVA — volatile agents inhibit HPV dose-dependently. (7) If persistent, intermittent two-lung ventilation or surgeon clamps PA.",f:"How do volatile agents affect HPV? Why is TIVA preferred?"},{q:"Your patient is on AC/VC 500/16. They\u2019re uncomfortable, fighting the vent. What\u2019s happening?",a:"Likely patient-ventilator dyssynchrony. Common in VC when set flow rate doesn\u2019t match patient demand (flow starvation — look for concave pressure waveform). Options: (1) Increase flow rate. (2) Switch to PC mode (decelerating flow matches patient demand). (3) Assess for auto-PEEP (check expiratory flow). (4) Evaluate sedation/pain. (5) Rule out new pathology: pneumothorax, mucus plug, agitation.",f:"How would you differentiate flow starvation from auto-PEEP on waveforms?"},{q:"How do you set up lung-protective ventilation in the OR?",a:"IMPROVE trial framework: Vt 6–8 mL/kg IBW (always ideal body weight from height), PEEP 5–8 cmH2O, recruitment maneuvers q30–60 min (30 cmH2O × 30 sec), FiO2 titrated to avoid hyperoxia, keep driving pressure <15 cmH2O and Pplat <30. This reduces postoperative pulmonary complications by ~50%. Same principles as ICU but often underutilized in OR.",f:"What is driving pressure and why might it matter more than Vt?"}].map((item,i)=>(
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

export { VentDevice };
