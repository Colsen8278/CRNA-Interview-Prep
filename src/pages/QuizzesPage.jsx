function SL({ t, icon, title, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
      <span style={{ fontSize: "18px" }}>{icon}</span>
      <span style={{ fontSize: "15px", fontWeight: 700 }}>{title}</span>
      <span style={{ background: t.aD, color: t.ac, padding: "2px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: 600 }}>{count}</span>
    </div>
  );
}

export default function QuizzesPage({ quizzes, qHist, sQuiz, t }) {
  return (
    <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <span style={{ fontSize: "24px" }}>❓</span>
        <div><h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>Quizzes</h2><p style={{ margin: "2px 0 0", color: t.tM, fontSize: "13px" }}>{Object.keys(quizzes).length} quiz bank{Object.keys(quizzes).length !== 1 ? "s" : ""} available</p></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "12px", marginBottom: "24px" }}>
        {Object.entries(quizzes).map(([k, v]) => (
          <div key={k} onClick={() => sQuiz(k)} style={{ padding: "20px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, cursor: "pointer", transition: "border-color 0.15s" }} onMouseEnter={e => e.currentTarget.style.borderColor = t.ac} onMouseLeave={e => e.currentTarget.style.borderColor = t.bd}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}><span style={{ fontSize: "22px" }}>{v.icon}</span><span style={{ fontSize: "18px", fontWeight: 700 }}>{v.label}</span></div>
            <div style={{ fontSize: "13px", color: t.tM, marginBottom: "14px" }}>{v.items.length} questions</div>
            <div style={{ background: t.ac, color: t.acTx, padding: "9px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600, textAlign: "center" }}>Start Quiz</div>
          </div>
        ))}
      </div>
      {qHist.length > 0 && <div>
        <SL t={t} icon="📊" title="Quiz History" count={qHist.length} />
        {qHist.slice(-10).reverse().map((h, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", background: t.bgC, borderRadius: "7px", border: `1px solid ${t.bd}`, marginBottom: "5px", fontSize: "13px" }}>
            <span>{h.label} <span style={{ color: t.tM, marginLeft: "8px" }}>{h.d}</span></span>
            <span style={{ fontWeight: 700, color: h.c / h.t >= 0.8 ? t.ok : t.wn }}>{h.c}/{h.t} ({Math.round(h.c / h.t * 100)}%)</span>
          </div>
        ))}
      </div>}
    </div>
  );
}
