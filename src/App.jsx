import { useState, useEffect, useMemo, useCallback } from "react";
import "./index.css";

// Data
import { TH, SYS } from "./data/themes";
import { MEDS } from "./data/medications";
import { PROTOS } from "./data/protocols";
import { QUIZZES } from "./data/quizzes";
import {
  PHYSIOLOGY_TOPICS,
  ANESTHESIA_TOPICS,
  ICU_SCENARIOS,
  BEHAVIORAL_CATEGORIES,
  QUICK_REFERENCE,
} from "./data/placeholders";

// Components
import SearchModal from "./components/SearchModal";
import MedDetail from "./components/med/MedDetail";
import ProtoDetail from "./components/proto/ProtoDetail";
import QuizEngine from "./components/quiz/QuizEngine";
import QuizResults from "./components/quiz/QuizResults";

// Pages
import Dashboard from "./pages/Dashboard";
import Pharmacology from "./pages/Pharmacology";
import ACLSProtocols from "./pages/ACLSProtocols";
import QuizzesPage from "./pages/QuizzesPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import ExperienceBankPage from "./pages/ExperienceBankPage";

// Time formatter
function fmtTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sc = s % 60;
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(sc).padStart(2, "0")}`
    : `${m}:${String(sc).padStart(2, "0")}`;
}

export default function App() {
  // ── Theme ──
  const [theme, setTheme] = useState("dark");
  const t = TH[theme];

  // ── Navigation ──
  const [pg, setPg] = useState("dash");
  const [sel, setSel] = useState(null); // selected medication
  const [proto, setProto] = useState(null); // selected protocol
  const [tab, setTab] = useState("overview"); // med detail tab

  // ── Confidence & Notes ──
  const [conf, setConf] = useState({});
  const [notes, setNotes] = useState({});

  // ── Quiz State ──
  const [qCat, setQCat] = useState(null);
  const [qIdx, setQIdx] = useState(0);
  const [qRev, setQRev] = useState(false);
  const [qSc, setQSc] = useState({ c: 0, t: 0 });
  const [qHist, setQHist] = useState([]);

  // ── Search ──
  const [so, setSo] = useState(false);
  const [sq, setSq] = useState("");

  // ── Study Timer ──
  const [timer, setTimer] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

  // ── Sidebar ──
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // All medication items (for now, just MEDS — devices & physiology will be added later)
  const allItems = useMemo(() => [...MEDS], []);

  // Timer tick
  useEffect(() => {
    if (!timerOn) return;
    const id = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [timerOn]);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSo(true);
      }
      if (e.key === "Escape") setSo(false);
      if (e.key === " " && pg === "quiz" && !qRev) {
        e.preventDefault();
        setQRev(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pg, qRev]);

  // Search filtering
  const fs = useMemo(() => {
    const q = sq.toLowerCase();
    return {
      items: allItems.filter(
        (i) =>
          !q ||
          i.name.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      ),
      protos: PROTOS.filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.cat.toLowerCase().includes(q)
      ),
    };
  }, [sq, allItems]);

  // Navigation helpers
  const nav = useCallback(
    (item) => {
      setSel(item);
      setTab("overview");
      setPg("detail");
      setSo(false);
      setSq("");
    },
    []
  );

  const oPro = useCallback(
    (p) => {
      setProto(p);
      setPg("proto");
      setSo(false);
      setSq("");
    },
    []
  );

  const sQuiz = useCallback(
    (cat) => {
      setQCat(cat);
      setQIdx(0);
      setQRev(false);
      setQSc({ c: 0, t: 0 });
      setPg("quiz");
      setSo(false);
      setSq("");
    },
    []
  );

  const nxtQ = useCallback(
    (correct) => {
      const newSc = {
        c: qSc.c + (correct ? 1 : 0),
        t: qSc.t + 1,
      };
      setQSc(newSc);
      if (qIdx + 1 < QUIZZES[qCat].items.length) {
        setQIdx(qIdx + 1);
        setQRev(false);
      } else {
        setQHist((prev) => [
          ...prev,
          {
            label: QUIZZES[qCat].label,
            c: newSc.c,
            t: newSc.t,
            d: new Date().toLocaleDateString(),
          },
        ]);
        setPg("qres");
      }
    },
    [qCat, qIdx, qSc]
  );

  // Sidebar nav items
  const sidebarItems = [
    { id: "dash", icon: "🏠", label: "Dashboard" },
    { id: "pg-meds", icon: "💊", label: "Pharmacology" },
    { id: "pg-physio", icon: "📖", label: "Physiology" },
    { id: "pg-anes", icon: "🫁", label: "Anesthesia" },
    { id: "pg-icu", icon: "🏥", label: "ICU Scenarios" },
    { id: "pg-acls", icon: "❤️‍🔥", label: "ACLS / PALS" },
    { id: "pg-behav", icon: "👔", label: "Behavioral" },
    { id: "pg-ref", icon: "⚡", label: "Quick Ref" },
    { id: "pg-exp", icon: "📝", label: "Experience Bank" },
    { id: "pg-quiz", icon: "❓", label: "Quizzes" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: t.bg,
        color: t.tx,
        fontFamily: "'Outfit', 'DM Sans', 'Helvetica Neue', sans-serif",
        display: "flex",
      }}
    >
      {/* ── SIDEBAR ── */}
      <aside
        style={{
          width: sidebarOpen ? "220px" : "56px",
          minHeight: "100vh",
          background: t.bgC,
          borderRight: `1px solid ${t.bd}`,
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s ease",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: 50,
        }}
      >
        {/* Logo / Brand */}
        <div
          style={{
            padding: sidebarOpen ? "16px 14px" : "16px 10px",
            borderBottom: `1px solid ${t.bd}`,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
              background: `linear-gradient(135deg,${t.ac},${t.bl})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              flexShrink: 0,
            }}
          >
            🩺
          </div>
          {sidebarOpen && (
            <span style={{ fontSize: "15px", fontWeight: 700 }}>
              CRNA Prep
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: "8px 6px" }}>
          {sidebarItems.map((item) => {
            const isActive =
              pg === item.id ||
              (item.id === "dash" && pg === "dash") ||
              (item.id === "pg-meds" &&
                (pg === "detail" || pg === "pg-meds")) ||
              (item.id === "pg-acls" &&
                (pg === "proto" || pg === "pg-acls")) ||
              (item.id === "pg-quiz" &&
                (pg === "quiz" || pg === "qres" || pg === "pg-quiz"));
            return (
              <button
                key={item.id}
                onClick={() => {
                  setPg(item.id);
                  setSel(null);
                  setProto(null);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  padding: sidebarOpen ? "8px 10px" : "8px",
                  background: isActive ? t.aD : "transparent",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  color: isActive ? t.ac : t.t2,
                  fontSize: "13px",
                  fontWeight: isActive ? 600 : 400,
                  marginBottom: "2px",
                  justifyContent: sidebarOpen ? "flex-start" : "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = t.bgS;
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.background = "transparent";
                }}
              >
                <span style={{ fontSize: "16px", flexShrink: 0 }}>
                  {item.icon}
                </span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Toggle */}
        <div
          style={{
            padding: "8px 6px",
            borderTop: `1px solid ${t.bd}`,
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "8px",
              background: "transparent",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              color: t.tM,
              fontSize: "14px",
            }}
          >
            {sidebarOpen ? "◁" : "▷"}
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Top Nav Bar */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 16px",
            borderBottom: `1px solid ${t.bd}`,
            background: t.bgC,
            backdropFilter: "blur(8px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {pg !== "dash" && (
              <button
                onClick={() => {
                  setPg("dash");
                  setSel(null);
                  setProto(null);
                }}
                style={{
                  background: t.bgS,
                  border: `1px solid ${t.bd}`,
                  borderRadius: "6px",
                  padding: "4px 10px",
                  color: t.t2,
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 500,
                }}
              >
                ←{" "}
                {pg === "detail" || pg === "proto"
                  ? "Back"
                  : "Dashboard"}
              </button>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* Study Timer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                background: t.bgS,
                borderRadius: "7px",
                padding: "4px 10px",
                border: `1px solid ${t.bd}`,
              }}
            >
              <button
                onClick={() => setTimerOn(!timerOn)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  padding: 0,
                }}
              >
                {timerOn ? "⏸" : "▶"}
              </button>
              <span
                style={{
                  fontSize: "12px",
                  fontFamily: "'JetBrains Mono', monospace",
                  color: t.t2,
                  minWidth: "58px",
                }}
              >
                {fmtTime(timer)}
              </span>
              {timer > 0 && (
                <button
                  onClick={() => {
                    setTimer(0);
                    setTimerOn(false);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "10px",
                    color: t.tM,
                    padding: 0,
                  }}
                >
                  ↺
                </button>
              )}
            </div>

            {/* Search Trigger */}
            <button
              onClick={() => setSo(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: t.bgS,
                border: `1px solid ${t.bd}`,
                borderRadius: "7px",
                padding: "5px 10px",
                color: t.tM,
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              🔍{" "}
              <span
                style={{
                  background: t.bgC,
                  padding: "1px 5px",
                  borderRadius: "3px",
                  fontSize: "10px",
                  border: `1px solid ${t.bd}`,
                }}
              >
                ⌘K
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              style={{
                background: t.bgS,
                border: `1px solid ${t.bd}`,
                borderRadius: "7px",
                width: "32px",
                height: "32px",
                cursor: "pointer",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </nav>

        {/* Search Modal */}
        <SearchModal
          open={so}
          onClose={() => setSo(false)}
          query={sq}
          setQuery={setSq}
          filteredItems={fs.items}
          filteredProtos={fs.protos}
          quizzes={QUIZZES}
          conf={conf}
          onNavMed={nav}
          onNavProto={oPro}
          onNavQuiz={sQuiz}
          t={t}
        />

        {/* ── PAGE ROUTING ── */}

        {pg === "dash" && (
          <Dashboard
            meds={MEDS}
            protos={PROTOS}
            quizzes={QUIZZES}
            systems={SYS}
            allItems={allItems}
            conf={conf}
            setConf={setConf}
            qHist={qHist}
            nav={nav}
            oPro={oPro}
            sQuiz={sQuiz}
            setPg={setPg}
            t={t}
          />
        )}

        {pg === "pg-meds" && (
          <Pharmacology
            meds={MEDS}
            allItems={allItems}
            conf={conf}
            setConf={setConf}
            nav={nav}
            t={t}
          />
        )}

        {pg === "pg-acls" && (
          <ACLSProtocols
            protos={PROTOS}
            conf={conf}
            setConf={setConf}
            oPro={oPro}
            t={t}
          />
        )}

        {pg === "pg-quiz" && (
          <QuizzesPage
            quizzes={QUIZZES}
            qHist={qHist}
            sQuiz={sQuiz}
            t={t}
          />
        )}

        {pg === "pg-physio" && (
          <PlaceholderPage
            icon="📖"
            title="Physiology & Pathophysiology"
            subtitle="Cardiovascular, respiratory, neurological, and renal systems"
            items={[
              ...PHYSIOLOGY_TOPICS.cardio,
              ...PHYSIOLOGY_TOPICS.respiratory,
              ...PHYSIOLOGY_TOPICS.neuro,
              ...PHYSIOLOGY_TOPICS.renal,
            ]}
            t={t}
          />
        )}

        {pg === "pg-anes" && (
          <PlaceholderPage
            icon="🫁"
            title="Anesthesia Fundamentals"
            subtitle="Airway, ventilation, monitoring, regional, and MH"
            items={ANESTHESIA_TOPICS}
            t={t}
          />
        )}

        {pg === "pg-icu" && (
          <PlaceholderPage
            icon="🏥"
            title="ICU Clinical Scenarios"
            subtitle="Critical care decision frameworks"
            items={ICU_SCENARIOS}
            t={t}
          />
        )}

        {pg === "pg-behav" && (
          <PlaceholderPage
            icon="👔"
            title="Behavioral / Interview Questions"
            subtitle="STAR-method frameworks by category"
            items={BEHAVIORAL_CATEGORIES}
            t={t}
          />
        )}

        {pg === "pg-ref" && (
          <PlaceholderPage
            icon="⚡"
            title="Quick Reference Cards"
            subtitle="Flash-card style high-yield review"
            items={QUICK_REFERENCE}
            t={t}
          />
        )}

        {pg === "pg-exp" && <ExperienceBankPage t={t} />}

        {pg === "detail" && sel && (
          <MedDetail
            item={sel}
            t={t}
            theme={theme}
            tab={tab}
            setTab={setTab}
            conf={conf[sel.id] || 0}
            setConf={(v) => setConf((p) => ({ ...p, [sel.id]: v }))}
            notes={notes[sel.id] || ""}
            setNotes={(v) => setNotes((p) => ({ ...p, [sel.id]: v }))}
          />
        )}

        {pg === "proto" && proto && (
          <ProtoDetail
            p={proto}
            t={t}
            theme={theme}
            conf={conf[proto.id] || 0}
            setConf={(v) =>
              setConf((p) => ({ ...p, [proto.id]: v }))
            }
            notes={notes[proto.id] || ""}
            setNotes={(v) =>
              setNotes((p) => ({ ...p, [proto.id]: v }))
            }
          />
        )}

        {pg === "quiz" && qCat && (
          <QuizEngine
            quiz={QUIZZES[qCat]}
            qIdx={qIdx}
            qRev={qRev}
            setQRev={setQRev}
            onNext={nxtQ}
            score={qSc}
            t={t}
          />
        )}

        {pg === "qres" && (
          <QuizResults
            score={qSc}
            onRetry={() => sQuiz(qCat)}
            onDashboard={() => setPg("dash")}
            t={t}
          />
        )}
      </div>
    </div>
  );
}
