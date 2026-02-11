import ProtoCard from "../components/proto/ProtoCard";

export default function ACLSProtocols({ protos, conf, setConf, oPro, t }) {
  return (
    <div style={{ maxWidth: "1060px", margin: "0 auto", padding: "24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <span style={{ fontSize: "24px" }}>❤️‍🔥</span>
        <div><h2 style={{ margin: 0, fontSize: "22px", fontWeight: 700 }}>ACLS & PALS Protocols</h2><p style={{ margin: "2px 0 0", color: t.tM, fontSize: "13px" }}>{protos.length} algorithm{protos.length !== 1 ? "s" : ""} loaded — ACLS, PALS, & Special Circumstances</p></div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "12px" }}>
        {protos.map(p => <ProtoCard key={p.id} p={p} t={t} conf={conf[p.id]} onConf={v => setConf(prev => ({ ...prev, [p.id]: v }))} onOpen={() => oPro(p)} />)}
      </div>
    </div>
  );
}
