// Generic placeholder page for sections not yet populated
export default function PlaceholderPage({ icon, title, subtitle, items, t }) {
  return (
    <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <span style={{ fontSize: "28px" }}>{icon}</span>
        <div>
          <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>{title}</h2>
          <p style={{ margin: "2px 0 0", color: t.tM, fontSize: "13px" }}>{subtitle}</p>
        </div>
      </div>
      {items && items.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "12px" }}>
          {items.map(item => (
            <div key={item.id} style={{ padding: "16px", background: t.bgC, borderRadius: "10px", border: `1px solid ${t.bd}`, opacity: 0.6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                {item.icon && <span style={{ fontSize: "18px" }}>{item.icon}</span>}
                <span style={{ fontSize: "15px", fontWeight: 600 }}>{item.name}</span>
              </div>
              <p style={{ margin: 0, fontSize: "12px", color: t.tM, lineHeight: 1.5 }}>{item.desc}</p>
              <div style={{ marginTop: "8px", padding: "4px 10px", background: t.bgS, borderRadius: "6px", fontSize: "10px", color: t.tM, display: "inline-block" }}>Coming soon</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "48px", background: t.bgC, borderRadius: "12px", border: `1px dashed ${t.bd}`, textAlign: "center" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>{icon}</div>
          <p style={{ color: t.tM, fontSize: "14px", margin: 0 }}>Content coming soon — ask in the Claude project chat to build out this section</p>
        </div>
      )}
    </div>
  );
}
