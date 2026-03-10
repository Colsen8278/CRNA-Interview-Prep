import { useState, useEffect, useCallback, useRef } from "react";

// ── SVG Waveform Helpers ──────────────────────────────────────────────
// Baseline is at y=120 in a 200px-tall strip. Upward deflections go toward y=0.
const BL = 120;

function sineBump(startX, width, height, numPts = 20) {
  const pts = [];
  for (let i = 0; i <= numPts; i++) {
    const t = i / numPts;
    pts.push([startX + t * width, BL - height * Math.sin(t * Math.PI)]);
  }
  return pts;
}

function flatLine(startX, width, y = BL, numPts = 4) {
  const pts = [];
  for (let i = 0; i <= numPts; i++) pts.push([startX + i * (width / numPts), y]);
  return pts;
}

function normalQRS(x, rH = 70, qD = 5, sD = 12, w = 8) {
  return [
    [x, BL], [x + w * 0.15, BL + qD], [x + w * 0.4, BL - rH],
    [x + w * 0.65, BL + sD], [x + w, BL],
  ];
}

function wideQRS(x, rH = 55, sD = 15, w = 18) {
  return [
    [x, BL], [x + w * 0.1, BL + 4], [x + w * 0.25, BL - rH * 0.3],
    [x + w * 0.4, BL - rH], [x + w * 0.55, BL - rH * 0.4],
    [x + w * 0.7, BL + sD], [x + w * 0.85, BL + sD * 0.3], [x + w, BL],
  ];
}

function noise(startX, width, amplitude, freq = 2, numPts = 40) {
  const pts = [];
  for (let i = 0; i <= numPts; i++) {
    const t = i / numPts;
    const y = BL - amplitude * Math.sin(t * freq * Math.PI * 2) * (0.5 + 0.5 * Math.sin(t * 7.3))
      + (Math.sin(t * 13.7) * amplitude * 0.3);
    pts.push([startX + t * width, y]);
  }
  return pts;
}

// ── Beat Generators ──────────────────────────────────────────────────
// Each returns an array of [x,y] points for one beat starting at `x`.
// `interval` = width in px for one beat.

function beatNormal(x, interval, prExtra = 0) {
  const pW = 10, prSeg = 6 + prExtra, qrsW = 8, stSeg = 12, tW = 16;
  const afterT = interval - pW - prSeg - qrsW - stSeg - tW;
  let pts = [];
  let cx = x;
  pts.push(...sineBump(cx, pW, 12)); cx += pW;
  pts.push(...flatLine(cx, prSeg)); cx += prSeg;
  pts.push(...normalQRS(cx)); cx += qrsW;
  pts.push(...flatLine(cx, stSeg)); cx += stSeg;
  pts.push(...sineBump(cx, tW, 22)); cx += tW;
  pts.push(...flatLine(cx, Math.max(afterT, 4)));
  return pts;
}

function beatSTElevation(x, interval) {
  const pW = 10, prSeg = 6, qrsW = 8, stSeg = 14, tW = 16;
  const afterT = interval - pW - prSeg - qrsW - stSeg - tW;
  let pts = [];
  let cx = x;
  pts.push(...sineBump(cx, pW, 12)); cx += pW;
  pts.push(...flatLine(cx, prSeg)); cx += prSeg;
  pts.push(...normalQRS(cx)); cx += qrsW;
  // ST elevation: segment sits 20px above baseline
  pts.push(...flatLine(cx, stSeg, BL - 20)); cx += stSeg;
  // T wave merges with elevated ST
  pts.push(...sineBump(cx, tW, 15).map(([px, py]) => [px, py - 10])); cx += tW;
  // return to baseline
  pts.push([cx, BL]);
  pts.push(...flatLine(cx + 2, Math.max(afterT - 2, 2)));
  return pts;
}

function beatJunctional(x, interval) {
  // No P wave, narrow QRS, rate 40-60
  const qrsW = 8, stSeg = 14, tW = 16;
  const before = 8;
  const afterT = interval - before - qrsW - stSeg - tW;
  let pts = [];
  let cx = x;
  pts.push(...flatLine(cx, before)); cx += before;
  pts.push(...normalQRS(cx)); cx += qrsW;
  pts.push(...flatLine(cx, stSeg)); cx += stSeg;
  pts.push(...sineBump(cx, tW, 20)); cx += tW;
  pts.push(...flatLine(cx, Math.max(afterT, 4)));
  return pts;
}

function beatWideRegular(x, interval, rH = 55) {
  // VT, AIVR: wide QRS, no P waves
  const qrsW = 20, stSeg = 10, tW = 18;
  const before = 4;
  const afterT = interval - before - qrsW - stSeg - tW;
  let pts = [];
  let cx = x;
  pts.push(...flatLine(cx, before)); cx += before;
  pts.push(...wideQRS(cx, rH, 15, qrsW)); cx += qrsW;
  pts.push(...flatLine(cx, stSeg, BL + 4)); cx += stSeg;
  // inverted T wave for VT
  pts.push(...sineBump(cx, tW, -18)); cx += tW;
  pts.push(...flatLine(cx, Math.max(afterT, 2)));
  return pts;
}

function beatFlutter(x, interval) {
  // Sawtooth F waves with occasional QRS
  const pts = [];
  const sawtoothCycles = Math.floor(interval / 16);
  let cx = x;
  for (let i = 0; i < sawtoothCycles; i++) {
    const segW = interval / sawtoothCycles;
    // sharp down, gradual up (sawtooth)
    for (let j = 0; j <= 8; j++) {
      const t = j / 8;
      pts.push([cx + t * segW * 0.3, BL - 15 + t * 30]);
    }
    for (let j = 0; j <= 8; j++) {
      const t = j / 8;
      pts.push([cx + segW * 0.3 + t * segW * 0.7, BL + 15 - t * 30]);
    }
    cx += segW;
  }
  return pts;
}

// ── Full Strip Generators ────────────────────────────────────────────
// Each returns the complete polyline points array for an 800px strip.

function generateStrip(rhythmId) {
  const W = 800;
  switch (rhythmId) {
    case "nsr": {
      const interval = 100; // ~75bpm
      const pts = [];
      for (let x = 10; x < W - 20; x += interval) pts.push(...beatNormal(x, interval));
      return pts;
    }
    case "sinus-brady": {
      const interval = 150; // ~50bpm
      const pts = [];
      for (let x = 10; x < W - 20; x += interval) pts.push(...beatNormal(x, interval));
      return pts;
    }
    case "sinus-tachy": {
      const interval = 60; // ~125bpm
      const pts = [];
      for (let x = 10; x < W - 20; x += interval) pts.push(...beatNormal(x, interval));
      return pts;
    }
    case "afib": {
      // Irregular R-R, no P waves, fibrillatory baseline
      const pts = [];
      let x = 10;
      const intervals = [55, 80, 45, 100, 60, 70, 50, 90, 65, 55, 75, 85, 48, 95];
      let idx = 0;
      while (x < W - 30) {
        const interval = intervals[idx % intervals.length];
        // fibrillatory baseline before QRS
        const fibLen = interval - 22;
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          pts.push([x + t * fibLen, BL - 3 * Math.sin(t * 19) - 2 * Math.sin(t * 31)]);
        }
        x += fibLen;
        pts.push(...normalQRS(x, 65));
        x += 8;
        pts.push(...flatLine(x, 6));
        x += 6;
        pts.push(...sineBump(x, 10, 18));
        x += 10;
        idx++;
      }
      return pts;
    }
    case "aflutter": {
      // Sawtooth at ~300/min atrial, 2:1 or 4:1 block
      const pts = [];
      const ventInterval = 130; // ~75bpm ventricular with 4:1
      let x = 10;
      while (x < W - 30) {
        // 4 flutter waves per ventricular beat
        const fwW = ventInterval / 4;
        for (let f = 0; f < 4; f++) {
          const fx = x + f * fwW;
          // sawtooth shape
          for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            if (t < 0.7) {
              pts.push([fx + t * fwW, BL - 14 + (t / 0.7) * 28]);
            } else {
              pts.push([fx + t * fwW, BL + 14 - ((t - 0.7) / 0.3) * 28]);
            }
          }
          // Insert QRS on top of 2nd flutter wave
          if (f === 1) {
            const qx = fx + fwW * 0.5;
            pts.push(...normalQRS(qx, 65, 5, 12, 8));
          }
        }
        x += ventInterval;
      }
      return pts;
    }
    case "svt": {
      const interval = 40; // ~187bpm
      const pts = [];
      for (let x = 10; x < W - 20; x += interval) {
        // No visible P waves, narrow QRS
        pts.push(...flatLine(x, 6));
        pts.push(...normalQRS(x + 6, 60, 3, 8, 7));
        pts.push(...flatLine(x + 13, 8));
        pts.push(...sineBump(x + 21, 10, 16));
        pts.push(...flatLine(x + 31, Math.max(interval - 31, 2)));
      }
      return pts;
    }
    case "vt-mono": {
      const interval = 50; // ~150bpm
      const pts = [];
      for (let x = 10; x < W - 20; x += interval)
        pts.push(...beatWideRegular(x, interval, 55));
      return pts;
    }
    case "vfib": {
      // Chaotic, no organized complexes
      const pts = [];
      for (let i = 0; i <= 400; i++) {
        const t = i / 400;
        const x = 10 + t * 780;
        const amp = 35 + 15 * Math.sin(t * 3.1);
        const y = BL
          - amp * Math.sin(t * 47)
          * (0.6 + 0.4 * Math.sin(t * 7.3))
          + 10 * Math.sin(t * 91);
        pts.push([x, Math.max(20, Math.min(190, y))]);
      }
      return pts;
    }
    case "torsades": {
      // Polymorphic VT with twisting axis (amplitude waxes and wanes)
      const pts = [];
      for (let i = 0; i <= 400; i++) {
        const t = i / 400;
        const x = 10 + t * 780;
        const envelope = 50 * Math.abs(Math.sin(t * 2.5 * Math.PI));
        const y = BL - envelope * Math.sin(t * 55);
        pts.push([x, Math.max(15, Math.min(195, y))]);
      }
      return pts;
    }
    case "asystole": {
      // Near-flat line with minor electrical artifact
      const pts = [];
      for (let i = 0; i <= 200; i++) {
        const t = i / 200;
        const x = 10 + t * 780;
        const y = BL + 1.5 * Math.sin(t * 37) + 0.8 * Math.sin(t * 83);
        pts.push([x, y]);
      }
      return pts;
    }
    case "first-degree": {
      const interval = 100;
      const pts = [];
      for (let x = 10; x < W - 20; x += interval)
        pts.push(...beatNormal(x, interval, 14)); // extra 14px PR prolongation
      return pts;
    }
    case "wenckebach": {
      // Progressively prolonging PR then dropped QRS (4:3 pattern)
      const pts = [];
      let x = 10;
      const basePR = [0, 8, 18]; // progressive prolongation
      let cycle = 0;
      while (x < W - 40) {
        if (cycle < 3) {
          const prX = basePR[cycle];
          pts.push(...beatNormal(x, 100, prX));
          x += 100;
        } else {
          // Dropped QRS: P wave only, then long pause
          pts.push(...sineBump(x, 10, 12));
          x += 10;
          pts.push(...flatLine(x, 90));
          x += 90;
        }
        cycle = (cycle + 1) % 4;
      }
      return pts;
    }
    case "mobitz2": {
      // Constant PR, then sudden dropped beat
      const pts = [];
      let x = 10;
      const pattern = [1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0]; // 1=conducted, 0=dropped
      let idx = 0;
      while (x < W - 40) {
        if (pattern[idx % pattern.length]) {
          pts.push(...beatNormal(x, 95));
          x += 95;
        } else {
          // P wave but no QRS
          pts.push(...sineBump(x, 10, 12));
          x += 10;
          pts.push(...flatLine(x, 85));
          x += 85;
        }
        idx++;
      }
      return pts;
    }
    case "third-degree": {
      // P waves march independently from QRS (atrial ~75, ventricular ~40)
      const pts = [];
      const atrialInterval = 90;
      const ventInterval = 175;
      // Generate independent P wave positions and QRS positions
      const pPositions = [];
      for (let x = 20; x < W - 20; x += atrialInterval) pPositions.push(x);
      const qrsPositions = [];
      for (let x = 50; x < W - 20; x += ventInterval) qrsPositions.push(x);
      // Draw baseline
      pts.push(...flatLine(10, W - 20, BL, 200));
      // Overlay P waves
      const pPts = [];
      pPositions.forEach(px => pPts.push(...sineBump(px, 10, 12)));
      // Overlay QRS + T
      const qPts = [];
      qrsPositions.forEach(qx => {
        qPts.push(...normalQRS(qx, 65, 5, 12, 10));
        qPts.push(...flatLine(qx + 10, 10));
        qPts.push(...sineBump(qx + 20, 14, 20));
      });
      // Merge: start with baseline, overlay P and QRS
      // Simple approach: generate a combined waveform
      const combined = [];
      for (let px = 10; px < W - 10; px += 1) {
        let y = BL;
        // Check if we're in a P wave zone
        for (const pp of pPositions) {
          if (px >= pp && px <= pp + 10) {
            const t = (px - pp) / 10;
            y -= 12 * Math.sin(t * Math.PI);
          }
        }
        // Check if we're in a QRS/T zone
        for (const qp of qrsPositions) {
          if (px >= qp && px < qp + 8) {
            const t = (px - qp) / 8;
            if (t < 0.15) y += 5 * (t / 0.15);
            else if (t < 0.4) y -= 65 * ((t - 0.15) / 0.25);
            else if (t < 0.65) y += (65 + 12) * ((t - 0.4) / 0.25) - 65;
            else y -= 12 * (1 - (t - 0.65) / 0.35);
          } else if (px >= qp + 8 && px < qp + 18) {
            // flat ST
          } else if (px >= qp + 18 && px < qp + 32) {
            const t = (px - qp - 18) / 14;
            y -= 20 * Math.sin(t * Math.PI);
          }
        }
        combined.push([px, y]);
      }
      return combined;
    }
    case "junctional": {
      const interval = 130; // ~57bpm
      const pts = [];
      for (let x = 10; x < W - 20; x += interval)
        pts.push(...beatJunctional(x, interval));
      return pts;
    }
    case "aivr": {
      const interval = 105; // ~71bpm
      const pts = [];
      for (let x = 10; x < W - 20; x += interval)
        pts.push(...beatWideRegular(x, interval, 45));
      return pts;
    }
    case "pvcs": {
      // Normal sinus with occasional wide premature beats
      const pts = [];
      let x = 10;
      const pattern = ["n", "n", "pvc", "n", "n", "n", "pvc", "n"];
      let idx = 0;
      while (x < W - 40) {
        if (pattern[idx % pattern.length] === "n") {
          pts.push(...beatNormal(x, 95));
          x += 95;
        } else {
          // PVC: premature, wide, no P wave, compensatory pause
          pts.push(...flatLine(x, 3));
          x += 3;
          pts.push(...wideQRS(x, 60, 18, 20));
          x += 20;
          // inverted T
          pts.push(...sineBump(x, 14, -20));
          x += 14;
          // compensatory pause
          pts.push(...flatLine(x, 55));
          x += 55;
        }
        idx++;
      }
      return pts;
    }
    case "stemi": {
      const interval = 100;
      const pts = [];
      for (let x = 10; x < W - 20; x += interval)
        pts.push(...beatSTElevation(x, interval));
      return pts;
    }
    default:
      return flatLine(10, W - 20);
  }
}

// ── Rhythm Data ──────────────────────────────────────────────────────

const RHYTHMS = [
  {
    id: "nsr",
    name: "Normal Sinus Rhythm",
    rate: "60\u2013100 bpm",
    rhythm: "Regular",
    pWaves: "Present, upright in lead II, one before each QRS",
    prInterval: "0.12\u20130.20 sec (3\u20135 small boxes)",
    qrsWidth: "< 0.12 sec (< 3 small boxes)",
    keyFeatures: "Every P is followed by a QRS. Regular R-R intervals. Normal rate. The gold standard \u2014 everything else is a deviation from this.",
    significance: "Normal cardiac rhythm. No intervention required. Know this cold so you recognize when something deviates from it."
  },
  {
    id: "sinus-brady",
    name: "Sinus Bradycardia",
    rate: "< 60 bpm",
    rhythm: "Regular",
    pWaves: "Present, upright, one before each QRS",
    prInterval: "0.12\u20130.20 sec",
    qrsWidth: "< 0.12 sec",
    keyFeatures: "Same morphology as NSR but rate < 60. Can be physiologic (athletes, sleep) or pathologic (inferior MI, increased vagal tone, beta-blockers, calcium channel blockers).",
    significance: "Treat only if symptomatic (hypotension, AMS, chest pain). ACLS: Atropine 1 mg IV q3\u20135min (max 3 mg). If refractory: transcutaneous pacing, dopamine 5\u201320 mcg/kg/min, or epinephrine 2\u201310 mcg/min."
  },
  {
    id: "sinus-tachy",
    name: "Sinus Tachycardia",
    rate: "100\u2013160 bpm",
    rhythm: "Regular",
    pWaves: "Present, may be buried in preceding T wave at high rates",
    prInterval: "0.12\u20130.20 sec (may shorten slightly at fast rates)",
    qrsWidth: "< 0.12 sec",
    keyFeatures: "Sinus tachycardia is a symptom, not a diagnosis. Always look for the underlying cause: pain, fever, hypovolemia, PE, sepsis, anxiety, thyrotoxicosis, medications.",
    significance: "Do NOT cardiovert sinus tachycardia. Treat the underlying cause. The heart is doing its job \u2014 figure out why it needs to beat that fast."
  },
  {
    id: "afib",
    name: "Atrial Fibrillation",
    rate: "Variable (ventricular rate 60\u2013170+ bpm)",
    rhythm: "Irregularly irregular",
    pWaves: "Absent \u2014 replaced by fibrillatory baseline undulations",
    prInterval: "Not measurable (no discrete P waves)",
    qrsWidth: "< 0.12 sec (narrow, unless aberrant conduction or bundle branch block)",
    keyFeatures: "The hallmark is the irregularly irregular R-R interval. No two consecutive R-R intervals are the same. Fibrillatory baseline replaces organized P waves. Most common sustained arrhythmia in adults.",
    significance: "Rate control (beta-blockers, CCBs, digoxin), rhythm control (amiodarone, cardioversion if unstable), anticoagulation (CHA\u2082DS\u2082-VASc score). If hemodynamically unstable: synchronized cardioversion."
  },
  {
    id: "aflutter",
    name: "Atrial Flutter",
    rate: "Atrial: ~300/min | Ventricular: depends on block ratio (typically 150 at 2:1)",
    rhythm: "Regular (if fixed block ratio) or regularly irregular",
    pWaves: "Sawtooth flutter waves (F waves) \u2014 best seen in leads II, III, aVF, V1",
    prInterval: "Not applicable (F waves, not P waves)",
    qrsWidth: "< 0.12 sec",
    keyFeatures: "Classic sawtooth pattern. A ventricular rate of exactly 150 bpm should make you think atrial flutter with 2:1 block. Adenosine can unmask flutter waves by transiently slowing AV conduction.",
    significance: "Similar management to AFib: rate control, anticoagulation, cardioversion. Often more amenable to ablation than AFib."
  },
  {
    id: "svt",
    name: "Supraventricular Tachycardia (SVT)",
    rate: "150\u2013250 bpm",
    rhythm: "Regular",
    pWaves: "Usually absent or buried in QRS/T wave (retrograde P waves may be visible)",
    prInterval: "Not measurable",
    qrsWidth: "< 0.12 sec (narrow complex)",
    keyFeatures: "Regular narrow-complex tachycardia at very high rates. Abrupt onset and offset (paroxysmal). Most commonly AVNRT or AVRT. Differentiate from sinus tach (gradual onset) and atrial flutter (sawtooth).",
    significance: "Stable: vagal maneuvers first (Valsalva, carotid massage), then adenosine 6 mg rapid IV push (12 mg if no response, repeat 12 mg once). Unstable: synchronized cardioversion starting at 50\u2013100 J."
  },
  {
    id: "vt-mono",
    name: "Monomorphic Ventricular Tachycardia",
    rate: "100\u2013250 bpm",
    rhythm: "Regular",
    pWaves: "Usually not visible (AV dissociation may be present)",
    prInterval: "Not applicable",
    qrsWidth: "> 0.12 sec (wide complex) \u2014 uniform morphology",
    keyFeatures: "Wide, regular, fast. All QRS complexes look the same (monomorphic). Look for AV dissociation, capture beats, and fusion beats to confirm VT over SVT with aberrancy. When in doubt, treat as VT \u2014 it is safer.",
    significance: "With pulse + stable: amiodarone 150 mg IV over 10 min. With pulse + unstable: synchronized cardioversion 100 J. Pulseless VT: defibrillate (same as VFib algorithm)."
  },
  {
    id: "vfib",
    name: "Ventricular Fibrillation",
    rate: "Not measurable (no organized electrical activity)",
    rhythm: "Chaotic, completely disorganized",
    pWaves: "None",
    prInterval: "None",
    qrsWidth: "No discernible QRS complexes",
    keyFeatures: "Chaotic, irregular waveform with no identifiable P waves, QRS complexes, or T waves. Amplitude may be coarse (recent onset) or fine (prolonged arrest). Fine VFib can mimic asystole \u2014 confirm in two leads.",
    significance: "Shockable rhythm. Immediate defibrillation (120\u2013200 J biphasic). CPR 2 min between shocks. Epinephrine 1 mg q3\u20135min. Amiodarone 300 mg after 3rd shock, then 150 mg. Survival drops 7\u201310% per minute without defibrillation."
  },
  {
    id: "torsades",
    name: "Torsades de Pointes",
    rate: "150\u2013300 bpm",
    rhythm: "Irregular \u2014 twisting axis",
    pWaves: "None visible",
    prInterval: "Not applicable",
    qrsWidth: "Wide, with characteristic waxing and waning amplitude (spindle-shaped)",
    keyFeatures: "Polymorphic VT associated with prolonged QT interval. QRS amplitude waxes and wanes, creating a twisting pattern around the baseline. Distinguished from regular polymorphic VT by the presence of QT prolongation.",
    significance: "IV magnesium 2 g IV push (first-line, even if Mg is normal). Overdrive pacing (increases HR, shortens QT). Stop all QT-prolonging drugs. If pulseless: defibrillate. Avoid amiodarone (it prolongs QT)."
  },
  {
    id: "asystole",
    name: "Asystole",
    rate: "None (flat line)",
    rhythm: "None",
    pWaves: "None",
    prInterval: "None",
    qrsWidth: "None",
    keyFeatures: "Flat line. Confirm in at least 2 leads (rule out fine VFib or lead disconnect). Check cable connections, gain settings, and lead placement. This is NOT a shockable rhythm.",
    significance: "Non-shockable. CPR, epinephrine 1 mg IV q3\u20135min. Identify and treat reversible causes (H\u2019s and T\u2019s). Prognosis is very poor. Consider termination of efforts if no ROSC after prolonged resuscitation with all reversible causes addressed."
  },
  {
    id: "first-degree",
    name: "First-Degree AV Block",
    rate: "Usually 60\u2013100 bpm (underlying sinus rate)",
    rhythm: "Regular",
    pWaves: "Present, one before each QRS, all conducted",
    prInterval: "> 0.20 sec (> 5 small boxes) \u2014 prolonged but constant",
    qrsWidth: "< 0.12 sec",
    keyFeatures: "Every P wave is followed by a QRS \u2014 no beats are dropped. The only abnormality is the prolonged PR interval. Often benign. Can be caused by increased vagal tone, beta-blockers, CCBs, digoxin, or degenerative conduction disease.",
    significance: "Usually benign and requires no treatment. Monitor for progression to higher-degree block, especially if PR continues to lengthen or if the patient is on AV-nodal blocking agents."
  },
  {
    id: "wenckebach",
    name: "Second-Degree AV Block Type I (Wenckebach)",
    rate: "Usually < 100 bpm",
    rhythm: "Irregularly irregular \u2014 grouped beating pattern",
    pWaves: "Present, more P waves than QRS complexes",
    prInterval: "Progressively prolonging until a QRS is dropped, then the cycle repeats",
    qrsWidth: "< 0.12 sec",
    keyFeatures: "The PR interval gets longer with each beat until one P wave fails to conduct (dropped QRS). Then the cycle restarts with a shorter PR. The pattern creates grouped beating. Block is at the level of the AV node.",
    significance: "Usually benign, especially in inferior MI. Observe and monitor. Rarely requires pacing. If symptomatic: atropine, then temporary pacing."
  },
  {
    id: "mobitz2",
    name: "Second-Degree AV Block Type II (Mobitz II)",
    rate: "Usually < 100 bpm (often bradycardic)",
    rhythm: "Regular or irregular depending on conduction ratio",
    pWaves: "Present, more P waves than QRS complexes",
    prInterval: "Constant (normal or slightly prolonged) for all conducted beats, then a sudden dropped QRS",
    qrsWidth: "Often wide (> 0.12 sec) \u2014 block is below the AV node (His-Purkinje)",
    keyFeatures: "The PR interval does NOT change before the dropped beat \u2014 this distinguishes it from Wenckebach. The QRS is often wide because the block is infranodal. This is a dangerous rhythm with high risk of progression to complete heart block.",
    significance: "High risk of progression to 3rd-degree block. Do NOT rely on atropine (may worsen infranodal block). Transcutaneous pacing as bridge. Requires permanent pacemaker. This is the one that needs the pacer."
  },
  {
    id: "third-degree",
    name: "Third-Degree (Complete) Heart Block",
    rate: "Atrial: 60\u2013100 (sinus) | Ventricular: 20\u201360 (escape rhythm)",
    rhythm: "P-P regular, R-R regular, but completely independent of each other",
    pWaves: "Present but bear no relationship to QRS complexes (AV dissociation)",
    prInterval: "Variable \u2014 no consistent relationship between P and QRS",
    qrsWidth: "Narrow if junctional escape (40\u201360 bpm), wide if ventricular escape (20\u201340 bpm)",
    keyFeatures: "Complete dissociation between atrial and ventricular activity. P waves march through at their own rate. QRS complexes appear at a separate, slower escape rate. The atria and ventricles are electrically divorced.",
    significance: "Hemodynamically significant. Transcutaneous pacing immediately. Atropine may help if escape is junctional but unreliable for ventricular escape. Requires permanent pacemaker. Dopamine or epinephrine drip as bridge if pacing is delayed."
  },
  {
    id: "junctional",
    name: "Junctional Rhythm",
    rate: "40\u201360 bpm (junctional escape rate)",
    rhythm: "Regular",
    pWaves: "Absent, inverted (retrograde) before or after QRS, or buried within QRS",
    prInterval: "< 0.12 sec if P wave is visible before QRS (short PR)",
    qrsWidth: "< 0.12 sec (narrow)",
    keyFeatures: "The AV junction takes over as pacemaker when the SA node fails or is suppressed. Narrow QRS because conduction below the junction is normal. P waves may be inverted in leads II, III, aVF if visible at all.",
    significance: "If asymptomatic: monitor. If symptomatic (hypotension, AMS): atropine, consider temporary pacing. Look for the cause: digoxin toxicity, beta-blocker/CCB overdose, inferior MI, post-cardiac surgery."
  },
  {
    id: "aivr",
    name: "Accelerated Idioventricular Rhythm (AIVR)",
    rate: "40\u2013100 bpm (faster than ventricular escape, slower than VT)",
    rhythm: "Regular",
    pWaves: "Usually absent or dissociated",
    prInterval: "Not applicable",
    qrsWidth: "> 0.12 sec (wide \u2014 ventricular origin)",
    keyFeatures: "Wide-complex, regular rhythm at a rate between ventricular escape (20\u201340) and VT (> 100). Often called a \u201Creperfusion rhythm\u201D because it commonly appears after successful thrombolysis or PCI in STEMI. Generally benign and self-limiting.",
    significance: "Usually benign and self-terminating. Do NOT suppress with antiarrhythmics (it is often the only rhythm keeping the patient alive while the sinus node recovers). Observe and monitor. If hemodynamically unstable, consider atropine to speed sinus rate and override the ventricular focus."
  },
  {
    id: "pvcs",
    name: "Premature Ventricular Complexes (PVCs)",
    rate: "Underlying rate with premature beats",
    rhythm: "Irregular (premature beats interrupt regular rhythm)",
    pWaves: "Present for sinus beats, absent for PVCs",
    prInterval: "Normal for sinus beats, none for PVCs",
    qrsWidth: "Sinus beats: < 0.12 sec | PVCs: > 0.12 sec, wide and bizarre morphology",
    keyFeatures: "Premature, wide QRS not preceded by a P wave, followed by a compensatory pause. Unifocal (same morphology) vs. multifocal (varying morphology). Bigeminy = every other beat is a PVC. R-on-T phenomenon increases VFib risk.",
    significance: "Isolated PVCs are usually benign. Treat the cause (hypoxia, electrolytes, ischemia, caffeine, stress). Frequent PVCs (> 10% of beats) or symptomatic PVCs may need beta-blockers. Concern: runs of PVCs (3+ = VT), multifocal PVCs, or R-on-T pattern."
  },
  {
    id: "stemi",
    name: "Sinus Rhythm with ST Elevation (STEMI Pattern)",
    rate: "60\u2013100 bpm (underlying sinus rate)",
    rhythm: "Regular",
    pWaves: "Present, normal sinus",
    prInterval: "0.12\u20130.20 sec",
    qrsWidth: "< 0.12 sec (may develop pathologic Q waves later)",
    keyFeatures: "ST segment elevation \u2265 1 mm in two contiguous leads. The ST segment merges with the T wave creating a convex or tombstone morphology. Reciprocal ST depression in opposite leads. Localize the infarct by the leads involved.",
    significance: "Activate cardiac catheterization lab immediately. Door-to-balloon time < 90 minutes (< 120 if transfer needed). Aspirin 325 mg, heparin, P2Y12 inhibitor. If PCI not available within 120 min: fibrinolytics within 30 min of arrival. This is the time-critical diagnosis."
  },
];

// ── Shuffle with no back-to-back repeat ──────────────────────────────

function shuffleNoRepeat(arr) {
  const indices = arr.map((_, i) => i);
  // Fisher-Yates shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  // Fix any back-to-back repeats (shouldn't happen with unique items, but safety check)
  for (let i = 1; i < indices.length; i++) {
    if (indices[i] === indices[i - 1]) {
      const swapIdx = (i + 1) % indices.length;
      [indices[i], indices[swapIdx]] = [indices[swapIdx], indices[i]];
    }
  }
  return indices;
}

// ── EKG Grid Background ─────────────────────────────────────────────

function EKGGrid({ t }) {
  const smallColor = t.gridSmall || (t.bg === "#06090f" ? "rgba(239,68,68,0.06)" : "rgba(239,68,68,0.08)");
  const largeColor = t.gridLarge || (t.bg === "#06090f" ? "rgba(239,68,68,0.14)" : "rgba(239,68,68,0.18)");
  const lines = [];
  // Small grid (1mm = 10px)
  for (let x = 0; x <= 800; x += 10) {
    lines.push(<line key={`sv${x}`} x1={x} y1={0} x2={x} y2={200} stroke={smallColor} strokeWidth={0.5} />);
  }
  for (let y = 0; y <= 200; y += 10) {
    lines.push(<line key={`sh${y}`} x1={0} y1={y} x2={800} y2={y} stroke={smallColor} strokeWidth={0.5} />);
  }
  // Large grid (5mm = 50px)
  for (let x = 0; x <= 800; x += 50) {
    lines.push(<line key={`lv${x}`} x1={x} y1={0} x2={x} y2={200} stroke={largeColor} strokeWidth={1} />);
  }
  for (let y = 0; y <= 200; y += 50) {
    lines.push(<line key={`lh${y}`} x1={0} y1={y} x2={800} y2={y} stroke={largeColor} strokeWidth={1} />);
  }
  return <g>{lines}</g>;
}

// ── Main Component ──────────────────────────────────────────────────

export default function RhythmQuiz({ t }) {
  const [order, setOrder] = useState(() => shuffleNoRepeat(RHYTHMS));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [answered, setAnswered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const containerRef = useRef(null);

  const rhythm = RHYTHMS[order[currentIdx]];
  const points = generateStrip(rhythm.id);
  const polylineStr = points.map(([x, y]) => `${x},${y}`).join(" ");
  const total = RHYTHMS.length;

  const goTo = useCallback((dir) => {
    if (dir === 1 && currentIdx < order.length - 1) {
      setCurrentIdx(i => i + 1);
      setRevealed(false);
      setAnswered(false);
      setShowDetails(false);
    } else if (dir === -1 && currentIdx > 0) {
      setCurrentIdx(i => i - 1);
      setRevealed(false);
      setAnswered(false);
      setShowDetails(false);
    }
  }, [currentIdx, order.length]);

  const restart = useCallback(() => {
    setOrder(shuffleNoRepeat(RHYTHMS));
    setCurrentIdx(0);
    setRevealed(false);
    setAnswered(false);
    setShowDetails(false);
    setScore({ correct: 0, total: 0 });
  }, []);

  const markAnswer = (correct) => {
    if (!answered) {
      setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
      setAnswered(true);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(-1);
      } else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setRevealed(true);
        setShowDetails(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goTo]);

  // Focus container for key events
  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
  }, []);

  const traceColor = t.bg === "#06090f" ? "#22c55e" : "#16a34a";
  const completed = currentIdx === order.length - 1 && revealed;

  return (
    <div ref={containerRef} tabIndex={-1} style={{ outline: "none" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
        <div>
          <div style={{ fontSize: "11px", color: t.tM, marginBottom: "4px" }}>Rhythm {currentIdx + 1} of {order.length}</div>
          <div style={{ height: "4px", width: "200px", background: t.bgS, borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((currentIdx + 1) / order.length) * 100}%`, background: t.ac, transition: "width 0.3s", borderRadius: "2px" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          {score.total > 0 && (
            <span style={{ fontSize: "13px", fontWeight: 600, color: score.correct / score.total >= 0.7 ? t.ok : t.wn }}>
              {score.correct}/{score.total} ({Math.round(score.correct / score.total * 100)}%)
            </span>
          )}
          <button onClick={restart} style={{
            padding: "6px 12px", borderRadius: "6px", border: `1px solid ${t.bd}`,
            background: t.bgS, color: t.t2, fontSize: "11px", fontWeight: 600, cursor: "pointer"
          }}>Reshuffle</button>
        </div>
      </div>

      {/* Rhythm Strip */}
      <div style={{ background: t.bg === "#06090f" ? "#0a0a0a" : "#fff8f6", borderRadius: "12px", border: `1px solid ${t.bd}`, overflow: "hidden", marginBottom: "16px" }}>
        <svg viewBox="0 0 800 200" style={{ width: "100%", display: "block" }}>
          <EKGGrid t={t} />
          <polyline
            points={polylineStr}
            fill="none"
            stroke={traceColor}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        <button onClick={() => goTo(-1)} disabled={currentIdx === 0} style={{
          padding: "10px 18px", borderRadius: "8px", border: `1px solid ${t.bd}`,
          background: t.bgC, color: currentIdx === 0 ? t.tM : t.tx, fontSize: "13px", fontWeight: 600,
          cursor: currentIdx === 0 ? "default" : "pointer", opacity: currentIdx === 0 ? 0.4 : 1,
        }}>{"\u2190"} Previous</button>

        {!revealed ? (
          <button onClick={() => { setRevealed(true); setShowDetails(true); }} style={{
            padding: "10px 24px", borderRadius: "8px", border: "none",
            background: t.ac, color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer",
            flex: 1, maxWidth: "260px",
          }}>Reveal Answer (Space)</button>
        ) : !answered ? (
          <div style={{ display: "flex", gap: "6px", flex: 1, maxWidth: "320px" }}>
            <button onClick={() => markAnswer(true)} style={{
              flex: 1, padding: "10px", borderRadius: "8px", border: `2px solid ${t.ok}`,
              background: `${t.ok}10`, color: t.ok, fontSize: "13px", fontWeight: 600, cursor: "pointer",
            }}>I Knew It</button>
            <button onClick={() => markAnswer(false)} style={{
              flex: 1, padding: "10px", borderRadius: "8px", border: `2px solid ${t.dg}`,
              background: `${t.dg}08`, color: t.dg, fontSize: "13px", fontWeight: 600, cursor: "pointer",
            }}>Missed It</button>
          </div>
        ) : (
          <div style={{ padding: "10px 18px", borderRadius: "8px", background: t.bgS, border: `1px solid ${t.bd}`, fontSize: "12px", color: t.tM, display: "flex", alignItems: "center" }}>
            {"\u2190 \u2192"} arrow keys to navigate
          </div>
        )}

        <button onClick={() => goTo(1)} disabled={currentIdx === order.length - 1} style={{
          padding: "10px 18px", borderRadius: "8px", border: `1px solid ${t.bd}`,
          background: t.bgC, color: currentIdx === order.length - 1 ? t.tM : t.tx, fontSize: "13px", fontWeight: 600,
          cursor: currentIdx === order.length - 1 ? "default" : "pointer", opacity: currentIdx === order.length - 1 ? 0.4 : 1,
        }}>Next {"\u2192"}</button>
      </div>

      {/* Answer Panel */}
      {revealed && (
        <div style={{ background: t.bgC, border: `1px solid ${t.bd}`, borderRadius: "12px", overflow: "hidden" }}>
          {/* Rhythm Name */}
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${t.bd}`, background: `${t.ac}08` }}>
            <div style={{ fontSize: "10px", fontWeight: 700, color: t.ac, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>Answer</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: t.tx }}>{rhythm.name}</div>
          </div>

          {/* Quick Facts */}
          <div style={{ padding: "16px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", borderBottom: `1px solid ${t.bd}` }}>
            {[
              { label: "Rate", value: rhythm.rate },
              { label: "Rhythm", value: rhythm.rhythm },
              { label: "QRS Width", value: rhythm.qrsWidth },
              { label: "P Waves", value: rhythm.pWaves },
              { label: "PR Interval", value: rhythm.prInterval },
            ].map(f => (
              <div key={f.label} style={{ padding: "8px 10px", background: t.bgS, borderRadius: "6px" }}>
                <div style={{ fontSize: "10px", color: t.tM, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3px", marginBottom: "2px" }}>{f.label}</div>
                <div style={{ fontSize: "12px", color: t.tx, lineHeight: 1.5 }}>{f.value}</div>
              </div>
            ))}
          </div>

          {/* Expandable Details */}
          <button onClick={() => setShowDetails(!showDetails)} style={{
            width: "100%", padding: "12px 24px", background: "transparent", border: "none",
            borderBottom: showDetails ? `1px solid ${t.bd}` : "none",
            cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: "13px", fontWeight: 600, color: t.ac }}>Key Features &amp; Clinical Significance</span>
            <span style={{ color: t.tM, fontSize: "16px" }}>{showDetails ? "\u2212" : "+"}</span>
          </button>

          {showDetails && (
            <div style={{ padding: "16px 24px 20px" }}>
              <div style={{ marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: t.wn, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Key Features</div>
                <div style={{ fontSize: "13px", color: t.t2, lineHeight: 1.8 }}>{rhythm.keyFeatures}</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", fontWeight: 700, color: t.ac, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>Clinical Significance &amp; Management</div>
                <div style={{ fontSize: "13px", color: t.t2, lineHeight: 1.8 }}>{rhythm.significance}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completion */}
      {completed && score.total > 0 && (
        <div style={{ marginTop: "20px", padding: "24px", background: `${t.ac}08`, borderRadius: "12px", border: `1px solid ${t.ac}25`, textAlign: "center" }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: t.tx, marginBottom: "6px" }}>Round Complete</div>
          <div style={{ fontSize: "36px", fontWeight: 700, color: score.correct / score.total >= 0.7 ? t.ok : t.wn }}>
            {score.correct}/{score.total}
          </div>
          <div style={{ fontSize: "13px", color: t.tM, marginBottom: "16px" }}>{Math.round(score.correct / score.total * 100)}% correct</div>
          <button onClick={restart} style={{
            padding: "10px 24px", borderRadius: "8px", border: "none",
            background: t.ac, color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer",
          }}>Reshuffle &amp; Start Over</button>
        </div>
      )}

      {/* Keyboard hint */}
      <div style={{ marginTop: "14px", fontSize: "11px", color: t.tM, textAlign: "center" }}>
        <span style={{ padding: "2px 6px", background: t.bgS, borderRadius: "4px", border: `1px solid ${t.bd}`, marginRight: "4px" }}>{"\u2190"}</span>
        <span style={{ padding: "2px 6px", background: t.bgS, borderRadius: "4px", border: `1px solid ${t.bd}`, marginRight: "8px" }}>{"\u2192"}</span>
        Navigate
        <span style={{ margin: "0 8px", color: t.bd }}>|</span>
        <span style={{ padding: "2px 8px", background: t.bgS, borderRadius: "4px", border: `1px solid ${t.bd}`, marginRight: "4px" }}>Space</span>
        Reveal
      </div>
    </div>
  );
}
