export default function QuizResults({ score, onRetry, onDashboard, t }) {
  const pct = Math.round(score.c / score.t * 100);
  const passed = pct >= 80;
  return (
    <div style={{ maxWidth: "420px", margin: "0 auto", padding: "56px 16px", textAlign: "center" }}>
      <div style={{ fontSize: "44px", marginBottom: "12px" }}>{passed ? "🎉" : "📚"}</div>
      <h2 style={{ margin: "0 0 20px", fontSize: "22px" }}>Quiz Complete</h2>
      <div style={{ fontSize: "48px", fontWeight: 700, color: passed ? t.ok : t.wn }}>{score.c}/{score.t}</div>
      <p style={{ color: t.tM, margin: "6px 0 28px" }}>{pct}% correct</p>
      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
        <button onClick={onRetry} style={{ background: t.ac, color: t.acTx, border: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}>Retry</button>
        <button onClick={onDashboard} style={{ background: t.bgS, color: t.tx, border: `1px solid ${t.bd}`, borderRadius: "8px", padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}>Dashboard</button>
      </div>
    </div>
  );
}
