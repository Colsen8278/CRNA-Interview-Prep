export default function QuizEngine({ quiz, qIdx, qRev, setQRev, onNext, score, t }) {
  const item = quiz.items[qIdx];
  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 700 }}>{quiz.icon} {quiz.label}</h2>
        <span style={{ color: t.tM, fontSize: "12px" }}>Q{qIdx + 1}/{quiz.items.length}</span>
      </div>
      <div style={{ height: "3px", background: t.bgS, borderRadius: "2px", marginBottom: "20px" }}>
        <div style={{ height: "100%", width: `${(qIdx / quiz.items.length) * 100}%`, background: t.ac, transition: "width 0.3s" }} />
      </div>
      <div style={{ padding: "20px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}` }}>
        <div style={{ fontSize: "11px", color: t.ac, fontWeight: 600, marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.c}</div>
        <p style={{ fontSize: "15px", lineHeight: 1.75, margin: "0 0 16px" }}>{item.q}</p>
        {!qRev ? (
          <button onClick={() => setQRev(true)} style={{ background: t.ac, color: t.acTx, border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Reveal Answer <span style={{ opacity: 0.6, fontSize: "11px" }}>(Space)</span></button>
        ) : (
          <>
            <div style={{ padding: "14px", background: t.bgS, borderRadius: "8px", border: `1px solid ${t.bd}`, marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", color: t.ac, fontWeight: 600, marginBottom: "4px", textTransform: "uppercase" }}>Answer</div>
              <p style={{ fontSize: "13px", lineHeight: 1.8, margin: 0 }}>{item.a}</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => onNext(true)} style={{ flex: 1, background: `${t.ok}10`, border: `2px solid ${t.ok}`, borderRadius: "8px", padding: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: t.ok }}>✓ Got it</button>
              <button onClick={() => onNext(false)} style={{ flex: 1, background: `${t.dg}08`, border: `2px solid ${t.dg}`, borderRadius: "8px", padding: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: t.dg }}>✗ Review</button>
            </div>
          </>
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: "10px", color: t.tM, fontSize: "11px" }}>Score: {score.c}/{score.t}</div>
    </div>
  );
}
