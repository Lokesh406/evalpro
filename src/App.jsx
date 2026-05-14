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

  // Preserve scroll position on refresh
  // (prevents the UX issue where the page jumps back to the top on reload)
  useEffect(() => {
    const SCROLL_KEY = "evalpro_scrollY_v1";

    const saveScroll = () => {
      try {
        // window.pageYOffset is more widely supported than documentElement.scrollTop
        const y = window.pageYOffset || document.documentElement.scrollTop || 0;
        sessionStorage.setItem(SCROLL_KEY, String(y));
      } catch (e) {
        // ignore
      }
    };

    const restoreScroll = () => {
      try {
        const raw = sessionStorage.getItem(SCROLL_KEY);
        if (!raw) return;
        const y = Number(raw);
        if (!Number.isFinite(y)) return;
        window.scrollTo({ top: y, left: 0 });
      } catch (e) {
        // ignore
      }
    };

    // Save right before leaving / refresh
    window.addEventListener("beforeunload", saveScroll);

    // Restore once after initial render
    const t = setTimeout(restoreScroll, 0);

    return () => {
      window.removeEventListener("beforeunload", saveScroll);
      clearTimeout(t);
    };
  }, []);


  const SESSION_KEY = "evalpro_session_v1";

  // Load cached state on refresh (temporary persistence)
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;

      const data = JSON.parse(raw);
      if (!data || data.version !== 1) return;

      if (typeof data.studentName === "string") setStudentName(data.studentName);
      if (typeof data.regNo === "string") setRegNo(data.regNo);

      if (Array.isArray(data.subjects)) {
        const loadedSubjects = data.subjects
          .filter(Boolean)
          .map((s, idx) => ({
            id: s.id ?? Date.now() + idx,
            name: s.name || "",
            m1: s.m1 || { pret: "", t1: "", t2: "", t3: "", t4: "", t5: "" },
            m2: s.m2 || { pret: "", t1: "", t2: "", t3: "", t4: "", t5: "" },
          }));
        setSubjects(loadedSubjects);

        // Restore UX: do not force-scroll; keep the current scroll position on refresh

      }
    } catch (e) {
      // ignore cache failures
    }
    // Intentionally empty deps: load once
  }, []);

  // Persist state changes
  useEffect(() => {
    try {
      const payload = {
        version: 1,
        studentName,
        regNo,
        subjects,
        // preview intentionally not persisted
      };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload));
    } catch (e) {
      // ignore storage failures
    }
  }, [studentName, regNo, subjects]);

  // Handle share parameter from URL (takes precedence over cached data)
  useEffect(() => {
    const decodeShareData = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const shareParam = params.get("share");

        if (!shareParam) return;

        // Decode from URL-safe Base64
        const decoded = atob(shareParam.replace(/-/g, '+').replace(/_/g, '/'));
        const data = JSON.parse(decodeURIComponent(escape(decoded)));

        // Set the loaded data
        if (data.name) setStudentName(data.name);
        if (data.regNo) setRegNo(data.regNo);

        // Convert shared subjects to the proper format with IDs
        if (data.subjects && Array.isArray(data.subjects)) {
          const loadedSubjects = data.subjects.map((s, idx) => ({
            id: Date.now() + idx,
            name: s.name || "",
            m1: s.m1 || { pret: "", t1: "", t2: "", t3: "", t4: "", t5: "" },
            m2: s.m2 || { pret: "", t1: "", t2: "", t3: "", t4: "", t5: "" },
          }));
          setSubjects(loadedSubjects);

          // Auto-scroll to results
          // Do not force scroll on refresh/share load; preserve user scroll position
          // (no scrollIntoView)

        }
      } catch (error) {
        console.error("Error decoding share data:", error);
        // Silently fail - if share data is invalid, just proceed normally
      }
    };

    decodeShareData();
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
          <p style={{ fontSize: 11, color: "#333", fontWeight: 600, margin: "0 0 8px" }}>
            Professional Assessment System · 100% Free · Secure · Runs entirely in your browser
          </p>
          <p style={{ fontSize: 12, color: "#333", fontWeight: 600, margin: 0 }}>
            Built with ♥ by <span style={{ fontWeight: 800, color: "#ff6b35" }}>UNPROFESSIONAL ENGINEEERS</span>
          </p>
          <p style={{ fontSize: 11, color: "#555", marginTop: 10 }}>
            If any mistakes appear, please wait and they will be rectified soon. For support, contact us at <a href={`mailto:unprofessionalenginneers8@gmail.com`} style={{ color: "#ff6b35", fontWeight: 800 }}>unprofessionalenginneers8@gmail.com</a>.
          </p>
        </div>
      </footer>


      <TrendAnalysisModal isOpen={showTrend} onClose={() => setShowTrend(false)} subjects={subjects} studentName={studentName} regNo={regNo} />
      <EmailExportModal isOpen={showEmail} onClose={() => setShowEmail(false)} studentName={studentName} regNo={regNo} subjects={subjects} />
      <SubjectAnalyticsModal isOpen={showAnalytics} onClose={() => setShowAnalytics(false)} subjects={subjects} studentName={studentName} regNo={regNo} />
    </div>
  );

}

