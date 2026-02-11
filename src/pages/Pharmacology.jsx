import MedCard from "../components/med/MedCard";
import PlaceholderCard from "../components/PlaceholderCard";

function SL({ t, icon, title, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
      <span style={{ fontSize: "18px" }}>{icon}</span>
      <span style={{ fontSize: "15px", fontWeight: 700 }}>{title}</span>
      <span style={{ background: t.aD, color: t.ac, padding: "2px 8px", borderRadius: "8px", fontSize: "10px", fontWeight: 600 }}>{count}</span>
    </div>
  );
}

export default function Pharmacology({ meds, allItems, conf, setConf, nav, t }) {
  return (
    <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <span style={{ fontSize: "24px" }}>📋</span>
        <div><h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>Study Sheets</h2><p style={{ margin: "2px 0 0", color: t.tM, fontSize: "13px" }}>{allItems.length} medication{allItems.length !== 1 ? "s" : ""} loaded</p></div>
      </div>
      <SL t={t} icon="💊" title="Medications" count={meds.length} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: "10px", marginBottom: "24px" }}>
        {meds.map(i => <MedCard key={i.id} item={i} t={t} conf={conf[i.id]} onConf={v => setConf(p => ({ ...p, [i.id]: v }))} onOpen={() => nav(i)} />)}
        <PlaceholderCard t={t} text="More medications coming..." />
      </div>
      <SL t={t} icon="🔧" title="Devices" count={0} />
      <div style={{ marginBottom: "24px" }}><PlaceholderCard t={t} text="Ask about arterial lines, vents, EVDs..." /></div>
      <SL t={t} icon="📖" title="Physiology Concepts" count={0} />
      <div style={{ marginBottom: "24px" }}><PlaceholderCard t={t} text="Ask about Frank-Starling, MAC, O₂-Hb curve..." /></div>
    </div>
  );
}
