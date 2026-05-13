import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";

import Navbar            from "./components/Navbar";
import Hero              from "./components/Hero";
import MethodBar         from "./components/MethodBar";
import PastePanel        from "./components/PastePanel";
import DetectedPreview   from "./components/DetectedPreview";
import SubjectCountModal from "./components/SubjectCountModal";
import SubjectRow, { SubjectHintBanner } from "./components/SubjectRow";
import SummaryPanel      from "./components/SummaryPanel";
import ExportBar         from "./components/ExportBar";
import FormulaReference  from "./components/FormulaReference";
import EmptyState        from "./components/EmptyState";

import TrendAnalysisModal from "./components/TrendAnalysisModal";
import EmailExportModal  from "./components/EmailExportModal";
import SubjectAnalyticsModal from "./components/SubjectAnalyticsModal";

import { emptySubject } from "./utils/marks";

export default function App() {
  const [subjects, setSubjects]       = useState([]);
  const [showModal, setShowModal]     = useState(false);
  const [method, setMethod]           = useState("paste");
  const [studentName, setStudentName] = useState("");
  const [regNo, setRegNo]             = useState("");
  const [preview, setPreview]         = useState(null);
  const [hintDismissed, setHintDismissed] = useState(false);
  const [openBreakdownId, setOpenBreakdownId] = useState(null);
  const [showCalc, setShowCalc]       = useState(false);
  const [showTrend, setShowTrend]     = useState(false);
  const [showEmail, setShowEmail]     = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const calcRef  = useRef(null);
  const applyRef = useRef(null);
  const pasteRef = useRef(null);

  // Force light mode
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", "light");
    root.style.colorScheme = "light";
    document.body.style.background = "#f8f9fa";
    document.body.style.color      = "#1f2937";
  }, []);

  // Ensure the page stays at the top on initial load (prevent automatic scrolling)
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0 });
    } catch (e) {
      // ignore in non-browser environments
    }
  }, []);

  function updateSubject(id, mod, key, val) {
    setSubjects(prev =>
      prev.map(s => {
        if (s.id !== id) return s;
        if (mod === "name") return { ...s, name: val };
        return { ...s, [mod]: { ...s[mod], [key]: val } };
      })
    );
  }

  function addSubject() {
    setSubjects(prev => [...prev, emptySubject(Date.now(), "")]);
  }

  function removeSubject(id) {
    setSubjects(prev => prev.filter(s => s.id !== id));
  }

  function onDetected(result) {
    setPreview(result.subjects);
    if (result.studentName) setStudentName(result.studentName);
    if (result.regNo)       setRegNo(result.regNo);
  }

  function applyPreview(subs) {
    setSubjects(subs.map((s, i) => ({ ...s, id: s.id || Date.now() + i })));
    setPreview(null);
    setTimeout(() => calcRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function handleModalConfirm(n) {
    setSubjects(Array.from({ length: n }, (_, i) => emptySubject(Date.now() + i, "")));
    setShowModal(false);
    setTimeout(() => calcRef.current?.scrollIntoView({ behavior: "smooth" }), 150);
  }

  const bg        = "#f8f9fa";
  const text      = "#1f2937";
  const borderCol = "rgba(0,0,0,0.08)";
  const inputBg   = "rgba(255,255,255,0.95)";
  const labelCol  = "rgba(0,0,0,0.45)";
  const showInputSection = subjects.length === 0 || preview != null;

  return (
    <div style={{
      minHeight: "100vh", background: bg, color: text,
      fontFamily: "'DM Sans','Cabinet Grotesk',sans-serif",
      transition: "background 0.35s cubic-bezier(.4,0,.2,1), color 0.35s",
    }}>

      <AnimatePresence>
        {showModal && <SubjectCountModal onConfirm={handleModalConfirm} />}
      </AnimatePresence>

      <Navbar />

      <Hero
        onScroll={() => pasteRef.current?.scrollIntoView({ behavior: "smooth" })}
        onGetStarted={() => {
          setShowCalc(true);
          setTimeout(() => pasteRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
        }}
      />



      <section ref={calcRef} style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px 80px" }}>


        {/* Student info */}
        <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
          <div style={{ flex: "2 1 220px" }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: labelCol, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
              Student Name
            </label>
            <input
              value={studentName} onChange={e => setStudentName(e.target.value)}
              placeholder="Auto-detected or type here…"
              style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${borderCol}`, background: inputBg, color: text, fontSize: 14, fontFamily: "inherit", outline: "none", width: "100%", transition: "background 0.3s, border 0.3s, color 0.3s" }}
            />
          </div>
          <div style={{ flex: "1 1 140px" }}>
            <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: labelCol, letterSpacing: "0.7px", textTransform: "uppercase", marginBottom: 6 }}>
              Reg No.
            </label>
            <input
              value={regNo} onChange={e => setRegNo(e.target.value)}
              placeholder="Enter Registration No."
              style={{ padding: "10px 14px", borderRadius: 10, border: `1px solid ${borderCol}`, background: inputBg, color: text, fontSize: 14, fontFamily: "'JetBrains Mono',monospace", outline: "none", width: "100%", transition: "background 0.3s, border 0.3s, color 0.3s", letterSpacing: "0.5px" }}
            />
          </div>
        </div>

        {/* Input panel */}
        <div ref={pasteRef}>
          {showInputSection ? (
            <>
              <MethodBar method={method} setMethod={setMethod} />
              {method === "paste" && <PastePanel onDetected={onDetected} />}
            </>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <button
                onClick={() => { setSubjects([]); setPreview(null); setMethod("paste"); }}
                style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(99,102,241,0.25)", background: "rgba(99,102,241,0.07)", color: "#6366f1", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                ← Enter new marks
              </button>
            </div>
          )}
        </div>

        <AnimatePresence>
          {preview && (
            <DetectedPreview subjects={preview} onConfirm={applyPreview} onDiscard={() => setPreview(null)} applyRef={applyRef} />
          )}
        </AnimatePresence>

        <SummaryPanel subjects={subjects} onSubjectClick={id => setOpenBreakdownId(id)} />

        <AnimatePresence>
          {subjects.length === 0 ? (
            <EmptyState key="empty" onAdd={addSubject} />
          ) : (
            <>
              <SubjectHintBanner dismissed={hintDismissed} onDismiss={() => setHintDismissed(true)} />
              {subjects.map((s, i) => (
                <SubjectRow
                  key={s.id} subj={s} idx={i}
                  onChange={(mod, key, val) => updateSubject(s.id, mod, key, val)}
                  onRemove={() => removeSubject(s.id)}
                  openBreakdown={openBreakdownId === s.id}
                  onBreakdownOpened={() => setOpenBreakdownId(null)}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {subjects.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={addSubject}
            style={{ width: "100%", padding: "11px", borderRadius: 11, border: "2px dashed rgba(99,102,241,0.3)", background: "transparent", color: "#6366f1", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4, transition: "all 0.2s" }}
          >
            <Plus size={15} /> Add Subject
          </motion.button>
        )}

        <ExportBar subjects={subjects} studentName={studentName} regNo={regNo} onTrend={() => setShowTrend(true)} onEmail={() => setShowEmail(true)} onAnalytics={() => setShowAnalytics(true)} />
        <FormulaReference />

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <button
            onClick={() => setShowModal(true)}
            style={{ padding: "7px 16px", borderRadius: 8, border: `1px solid ${borderCol}`, background: "transparent", color: "rgba(0,0,0,0.35)", fontSize: 12, cursor: "pointer", fontFamily: "inherit", transition: "all 0.25s" }}
          >
            ↺ Change number of subjects
          </button>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${borderCol}`, padding: "28px 20px", background: "rgba(0,0,0,0.02)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(0,0,0,0.55)", fontFamily: "'Sora',sans-serif" }}>
              EvalPro
            </span>
          </div>
          <p style={{ fontSize: 11, color: "rgba(0,0,0,0.3)", margin: "0 0 8px" }}>
            Professional Assessment System · 100% Free · Secure · Runs entirely in your browser
          </p>
          <p style={{ fontSize: 12, color: "rgba(0,0,0,0.4)", margin: 0 }}>
            Built with ♥ by <span style={{ fontWeight: 700, color: "#0f3a7d" }}>UNPROFESSIONAL ENGINEEERS</span>
          </p>
        </div>
      </footer>


      <TrendAnalysisModal isOpen={showTrend} onClose={() => setShowTrend(false)} subjects={subjects} studentName={studentName} regNo={regNo} />
      <EmailExportModal isOpen={showEmail} onClose={() => setShowEmail(false)} studentName={studentName} regNo={regNo} subjects={subjects} />
      <SubjectAnalyticsModal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} subjects={subjects} studentName={studentName} regNo={regNo} />
    </div>
  );

}

