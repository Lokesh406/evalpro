import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";
import { TARGETS } from "../utils/constants";

export default function DetectedPreview({ subjects, onConfirm, onDiscard, dark, applyRef }) {
  const [edited, setEdited] = useState(
    subjects.map(s => ({ ...s, m1: { ...s.m1 }, m2: { ...s.m2 } }))
  );

  // Keep page position stable on load; do not auto-scroll when this preview appears.
  // (Scrolling here was causing the page to jump away from the top.)
  useEffect(() => {
    // no-op
  }, [applyRef]); // eslint-disable-line


  function removeSubject(si) {
    setEdited(prev => prev.filter((_, i) => i !== si));
  }

  const card = dark
    ? { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)", text: "rgba(255,255,255,0.85)", sub: "rgba(255,255,255,0.4)" }
    : { bg: "rgba(0,0,0,0.03)", border: "rgba(0,0,0,0.09)", text: "rgba(0,0,0,0.82)", sub: "rgba(0,0,0,0.45)" };

  return (
    <motion.div
      ref={applyRef}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 16,
        border: "1px solid rgba(99,102,241,0.25)",
        background: dark ? "rgba(99,102,241,0.06)" : "rgba(99,102,241,0.04)",
        padding: 20, marginBottom: 24,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={16} color="#10b981" />
          <span style={{ fontWeight: 700, fontSize: 14, color: dark ? "#fff" : "#0d0d1a" }}>
            Detected {edited.length} Subject{edited.length !== 1 ? "s" : ""}
          </span>
          <span style={{ fontSize: 11, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.4)" }}>
            — verify marks below, then click Apply
          </span>
        </div>
        <button
          onClick={onDiscard}
          style={{ background: "none", border: "none", cursor: "pointer", color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", padding: 4 }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Subject cards with ORIGINAL marks */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 10, marginBottom: 16 }}>
        <AnimatePresence>
          {edited.map((s, si) => {
            const m1Marks = TARGETS.filter(t => s.m1[t.key] !== "" && s.m1[t.key] !== undefined);
            const m2Marks = TARGETS.filter(t => s.m2[t.key] !== "" && s.m2[t.key] !== undefined);

            return (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.75 }}
                style={{
                  borderRadius: 11,
                  background: card.bg,
                  border: `1px solid ${card.border}`,
                  padding: "10px 12px",
                  position: "relative",
                }}
              >
                {/* Remove button */}
                <button
                  onClick={() => removeSubject(si)}
                  style={{
                    position: "absolute", top: 6, right: 6,
                    width: 18, height: 18, borderRadius: 100, border: "none",
                    background: "rgba(239,68,68,0.15)", color: "#ef4444",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    padding: 0,
                  }}
                >
                  <X size={10} />
                </button>

                {/* Subject name + number */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, paddingRight: 20 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#6366f1", background: "rgba(99,102,241,0.12)", borderRadius: 4, padding: "1px 5px" }}>
                    {si + 1}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: card.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {s.name || "Unnamed"}
                  </span>
                </div>

                {/* Original marks — no scaled values shown here */}
                {(m1Marks.length > 0 || m2Marks.length > 0) && (
                  <div style={{ fontSize: 10.5, color: card.sub, lineHeight: 1.9 }}>
                    {m1Marks.length > 0 && (
                      <div>
                        <span style={{ fontWeight: 700, color: "#6366f1", fontSize: 10 }}>M1 </span>
                        {m1Marks.map(t => {
                          const rawVal = s.m1[`${t.key}_raw`] !== undefined ? s.m1[`${t.key}_raw`] : s.m1[t.key];
                          return (
                            <span key={t.key} style={{ marginRight: 6 }}>
                              <span style={{ color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>{t.short}</span>
                              <span style={{ fontWeight: 600, color: dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.75)" }}> {rawVal}/{t.max}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                    {m2Marks.length > 0 && (
                      <div>
                        <span style={{ fontWeight: 700, color: "#8b5cf6", fontSize: 10 }}>M2 </span>
                        {m2Marks.map(t => {
                          const rawVal = s.m2[`${t.key}_raw`] !== undefined ? s.m2[`${t.key}_raw`] : s.m2[t.key];
                          return (
                            <span key={t.key} style={{ marginRight: 6 }}>
                              <span style={{ color: dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)" }}>{t.short}</span>
                              <span style={{ fontWeight: 600, color: dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.75)" }}> {rawVal}/{t.max}</span>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ marginTop: 7, paddingTop: 7, borderTop: `1px solid ${card.border}`, fontSize: 9.5, color: dark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.32)" }}>
                  Verify your original marks above ↑
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {edited.length === 0 && (
        <p style={{ textAlign: "center", color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", fontSize: 13, padding: "8px 0 12px" }}>
          All subjects removed. Discard or paste again.
        </p>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <motion.button
          whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
          onClick={() => onConfirm(edited)}
          disabled={edited.length === 0}
          style={{
            padding: "10px 22px", borderRadius: 9,
            background: edited.length ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "rgba(99,102,241,0.25)",
            color: "#fff", fontWeight: 700, fontSize: 14, border: "none",
            cursor: edited.length ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: edited.length ? "0 4px 18px rgba(99,102,241,0.35)" : "none",
            transition: "all 0.2s",
          }}
        >
          <CheckCircle2 size={15} /> Apply {edited.length} Subject{edited.length !== 1 ? "s" : ""}
        </motion.button>
        <button
          onClick={onDiscard}
          style={{
            padding: "10px 16px", borderRadius: 9, background: "transparent",
            border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.12)",
            color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
            fontWeight: 500, fontSize: 13, cursor: "pointer",
          }}
        >
          Discard
        </button>
        <span style={{ fontSize: 11, color: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.35)", marginLeft: 4 }}>
          Results calculated only after Apply
        </span>
      </div>
    </motion.div>
  );
}
