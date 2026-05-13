import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Trash2, AlertTriangle, Pencil, BarChart2 } from "lucide-react";
import { calcModule, calcFinal, getGrade, scaleTarget, moduleMax } from "../utils/marks";
import { TARGETS } from "../utils/constants";
import { Badge } from "./ui/Atoms";
import ModuleInput from "./ModuleInput";

// ── Hint banner shown once above subject list ─────────────────────
export function SubjectHintBanner({ dark, dismissed, onDismiss }) {
  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6, height: 0, marginBottom: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 26 }}
          style={{
            marginBottom: 10, borderRadius: 12, overflow: "hidden",
            background: dark
              ? "linear-gradient(108deg,rgba(79,70,229,0.20),rgba(99,102,241,0.10),rgba(139,92,246,0.13))"
              : "linear-gradient(108deg,rgba(99,102,241,0.09),rgba(129,140,248,0.04),rgba(139,92,246,0.07))",
            border: dark ? "1.5px solid rgba(99,102,241,0.30)" : "1.5px solid rgba(99,102,241,0.20)",
            display: "flex", alignItems: "center", padding: "10px 14px", gap: 10, position: "relative",
          }}
        >
          {/* Shimmer */}
          <motion.div
            animate={{ x: ["-130%", "230%"] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "linear", repeatDelay: 2 }}
            style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.09) 50%,transparent)", pointerEvents: "none" }}
          />
          <motion.span
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
            style={{ fontSize: 18, flexShrink: 0, userSelect: "none", position: "relative" }}
          >
            👆
          </motion.span>
          <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: dark ? "#a5b4fc" : "#4338ca", lineHeight: 1.4 }}>
              Tap any{" "}
              <span style={{ background: dark ? "rgba(99,102,241,0.22)" : "rgba(99,102,241,0.12)", borderRadius: 5, padding: "1px 6px", border: "1px solid rgba(99,102,241,0.30)" }}>ring</span>
              {" "}above or{" "}
              <span style={{ background: dark ? "rgba(99,102,241,0.22)" : "rgba(99,102,241,0.12)", borderRadius: 5, padding: "1px 6px", border: "1px solid rgba(99,102,241,0.30)" }}>subject bar</span>
              {" "}below to see detailed score breakdown
            </div>
            <div style={{ fontSize: 10, fontWeight: 500, marginTop: 3, color: dark ? "rgba(165,180,252,0.45)" : "rgba(79,70,229,0.45)" }}>
              Module scores · per-target details · final average
            </div>
          </div>
          <button
            onClick={onDismiss}
            style={{
              background: dark ? "rgba(99,102,241,0.16)" : "rgba(99,102,241,0.10)",
              border: "1px solid rgba(99,102,241,0.22)", borderRadius: 7, padding: "4px 11px",
              cursor: "pointer", fontSize: 11, fontWeight: 700,
              color: dark ? "rgba(165,180,252,0.80)" : "rgba(79,70,229,0.80)",
              flexShrink: 0, whiteSpace: "nowrap", transition: "background 0.15s", position: "relative",
            }}
            onMouseEnter={e => e.currentTarget.style.background = dark ? "rgba(99,102,241,0.28)" : "rgba(99,102,241,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = dark ? "rgba(99,102,241,0.16)" : "rgba(99,102,241,0.10)"}
          >
            got it ✓
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Breakdown panel ───────────────────────────────────────────────
function BreakdownPanel({ subj, m1score, m2score, final, g, dark }) {
  const renderModule = (label, modData, modScore, accent) => {
    const max = modScore !== null ? moduleMax(modData) : 60;
    const filledTargets = TARGETS.filter(t => modData[t.key] !== "" && modData[t.key] !== undefined && modData[t.key] !== null);
    const hasOtherTargets = filledTargets.some(t => t.key !== "t5");

    return (
      <div key={label}>
        <div style={{
          fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.7px", color: accent,
          marginBottom: 10, paddingBottom: 7, borderBottom: `1px solid ${accent}22`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span>{label}</span>
          {modScore !== null && (
            <span style={{ fontSize: 13, fontWeight: 800, color: g.color, fontFamily: "'Outfit',sans-serif" }}>
              {modScore.toFixed(1)}<span style={{ fontSize: 9, opacity: 0.5 }}>/{max}</span>
            </span>
          )}
        </div>
        {modScore === null ? (
          <span style={{ fontSize: 11, color: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.30)", fontStyle: "italic" }}>Not entered</span>
        ) : (
          <>
            {filledTargets.map(t => {
              const rawVal = modData[t.key];
              const rawNum = parseFloat(rawVal);
              let scaledVal, scaledMax, rowPct, rawDisplay, rawMax;
              if (t.key === "t5" && !hasOtherTargets) {
                scaledVal = Math.min(rawNum, 60); scaledMax = 60; rowPct = scaledVal / 60;
                rawDisplay = rawNum; rawMax = 60;
              } else {
                scaledVal = scaleTarget(t.key, rawVal); scaledMax = t.scaled;
                rowPct = scaledVal !== null ? scaledVal / t.scaled : 0;
                rawDisplay = Math.min(rawNum, t.max); rawMax = t.max;
              }
              if (scaledVal === null) return null;
              return (
                <div key={t.key} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: dark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontWeight: 500 }}>{t.short}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace", color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", gap: 3 }}>
                      <span style={{ opacity: 0.55 }}>{typeof rawDisplay === "number" ? rawDisplay.toFixed(rawDisplay % 1 === 0 ? 0 : 1) : rawDisplay}/{rawMax}</span>
                      <span style={{ opacity: 0.25, fontSize: 9 }}>→</span>
                      <span style={{ color: accent }}>{scaledVal.toFixed(1)}/{scaledMax}</span>
                    </span>
                  </div>
                  <div style={{ height: 2.5, background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", borderRadius: 2, overflow: "hidden" }}>
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${Math.min(rowPct, 1) * 100}%` }}
                      transition={{ duration: 0.55, delay: 0.04 }}
                      style={{ height: "100%", background: accent, opacity: 0.75 }}
                    />
                  </div>
                </div>
              );
            })}
            <div style={{ marginTop: 10 }}>
              <div style={{ height: 3.5, borderRadius: 3, overflow: "hidden", background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${Math.min(modScore / max, 1) * 100}%` }}
                  transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1], delay: 0.15 }}
                  style={{ height: "100%", background: `linear-gradient(90deg,${accent}88,${accent})`, boxShadow: `0 0 6px ${accent}55` }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 3, fontSize: 9, fontWeight: 600, opacity: 0.38, color: dark ? "#fff" : "#000", fontFamily: "'JetBrains Mono',monospace" }}>
                {((modScore / max) * 100).toFixed(0)}% of {label}
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{
      margin: "0 14px 14px", padding: "16px", borderRadius: 12,
      background: dark ? "linear-gradient(135deg,rgba(99,102,241,0.09),rgba(79,70,229,0.04))" : "linear-gradient(135deg,rgba(99,102,241,0.07),rgba(99,102,241,0.02))",
      border: dark ? "1px solid rgba(99,102,241,0.18)" : "1px solid rgba(99,102,241,0.15)",
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {renderModule("Module 1", subj.m1, m1score, "#6366f1")}
        {renderModule("Module 2", subj.m2, m2score, "#8b5cf6")}
      </div>
      {m1score !== null && m2score !== null && (
        <div style={{ marginTop: 14, paddingTop: 11, borderTop: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.6px", color: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.30)", marginBottom: 3 }}>Final (avg of both modules)</div>
            <span style={{ fontSize: 11, fontWeight: 600, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.40)", fontFamily: "'JetBrains Mono',monospace" }}>
              ({m1score.toFixed(1)} + {m2score.toFixed(1)}) ÷ 2
            </span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: g.color, fontFamily: "'Outfit',sans-serif" }}>
            {final.toFixed(1)}<span style={{ fontSize: 11, opacity: 0.55, fontWeight: 600 }}>/60</span>
          </span>
        </div>
      )}
      {(m1score === null) !== (m2score === null) && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.07)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: dark ? "rgba(255,255,255,0.30)" : "rgba(0,0,0,0.35)", fontFamily: "'JetBrains Mono',monospace" }}>Single module — partial result</span>
          <span style={{ fontSize: 20, fontWeight: 800, color: g.color, fontFamily: "'Outfit',sans-serif" }}>
            {final.toFixed(1)}<span style={{ fontSize: 11, opacity: 0.55, fontWeight: 600 }}>/60</span>
          </span>
        </div>
      )}
    </div>
  );
}

// ── SubjectRow ────────────────────────────────────────────────────
export default function SubjectRow({ subj, idx, onChange, onRemove, dark, openBreakdown, onBreakdownOpened }) {
  const [open, setOpen] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [ringPulse, setRingPulse] = useState(false);
  const cardRef = useRef(null);

  const m1score = calcModule(subj.m1);
  const m2score = calcModule(subj.m2);
  const final   = calcFinal(m1score, m2score);
  const onlyOne = (m1score !== null) !== (m2score !== null);
  const g       = final !== null ? getGrade(final) : null;
  const pct     = final !== null ? Math.min((final / 60) * 100, 100) : 0;

  // Ring tap → open breakdown + scroll
  useEffect(() => {
    if (!openBreakdown) return;
    if (final !== null) {
      setShowBreakdown(true);
      setRingPulse(true);
      setTimeout(() => setRingPulse(false), 700);
    }
    const t = setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => onBreakdownOpened?.(), 600);
    }, 60);
    return () => clearTimeout(t);
  }, [openBreakdown, final, onBreakdownOpened]); // eslint-disable-line

  const cardBg = dark
    ? showBreakdown ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.022)"
    : showBreakdown ? "rgba(99,102,241,0.028)" : "#fff";

  const cardBorder = dark
    ? showBreakdown ? "rgba(99,102,241,0.40)" : isHovered && final !== null ? "rgba(99,102,241,0.28)" : "rgba(255,255,255,0.08)"
    : showBreakdown ? "rgba(99,102,241,0.32)" : isHovered && final !== null ? "rgba(99,102,241,0.22)" : "rgba(0,0,0,0.09)";

  const textMute = dark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.22)";

  const cardShadow = ringPulse
    ? "0 0 0 3px rgba(99,102,241,0.35), 0 12px 40px rgba(99,102,241,0.22)"
    : showBreakdown
      ? dark ? "0 10px 36px rgba(99,102,241,0.18)" : "0 10px 28px rgba(99,102,241,0.13)"
      : isHovered && final !== null
        ? dark ? "0 8px 28px rgba(99,102,241,0.20),0 2px 8px rgba(0,0,0,0.40)" : "0 8px 24px rgba(99,102,241,0.15)"
        : "none";

  return (
    <motion.div
      ref={cardRef} layout
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      style={{
        borderRadius: 16, border: `1.5px solid ${cardBorder}`, background: cardBg,
        marginBottom: 10, overflow: "hidden",
        cursor: final !== null ? "pointer" : "default", position: "relative",
        transform: isHovered && final !== null && !showBreakdown ? "translateY(-2px)" : "translateY(0px)",
        boxShadow: cardShadow,
        transition: "border-color 0.22s, background 0.22s, box-shadow 0.3s, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => { if (final !== null) setShowBreakdown(p => !p); }}
    >
      {/* Ring-pulse overlay */}
      <AnimatePresence>
        {ringPulse && (
          <motion.div
            initial={{ opacity: 0.6 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
            style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "rgba(99,102,241,0.10)", borderRadius: 16 }}
          />
        )}
      </AnimatePresence>

      {/* Hover glow */}
      <AnimatePresence>
        {isHovered && final !== null && !showBreakdown && g && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: `linear-gradient(to top,${g.color}12,transparent)`, pointerEvents: "none", zIndex: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 16px", position: "relative", zIndex: 1 }}>
        {/* Index */}
        <div style={{
          width: 28, height: 28, borderRadius: 8,
          background: showBreakdown ? "rgba(99,102,241,0.22)" : "rgba(99,102,241,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 800, color: "#6366f1", flexShrink: 0,
          transition: "background 0.2s", pointerEvents: "none",
        }}>
          {idx + 1}
        </div>

        {/* Subject name — ONLY the name button triggers edit, not the whole card */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 6 }}>
          {editingName ? (
            <input
              autoFocus value={subj.name}
              onChange={e => onChange("name", "", e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") setEditingName(false); }}
              onClick={e => e.stopPropagation()}
              placeholder="Subject name…"
              style={{
                flex: 1, padding: "4px 10px", borderRadius: 7,
                border: "1.5px solid rgba(99,102,241,0.5)",
                background: dark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.07)",
                color: dark ? "#fff" : "#0d0d1a",
                fontSize: 14, fontWeight: 600, fontFamily: "inherit", outline: "none",
              }}
            />
          ) : (
            <button
              onClick={e => { e.stopPropagation(); setEditingName(true); }}
              title="Click to rename"
              style={{
                background: "none", border: "none", padding: "3px 6px", borderRadius: 6,
                cursor: "text", fontSize: 14, fontWeight: 600,
                color: dark ? "#e8e8f4" : "#0d0d1a",
                fontFamily: "inherit", textAlign: "left",
                display: "flex", alignItems: "center", gap: 5, maxWidth: "100%",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = dark ? "rgba(99,102,241,0.10)" : "rgba(99,102,241,0.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {subj.name || <span style={{ color: dark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.28)", fontWeight: 400, fontStyle: "italic" }}>Subject name…</span>}
              </span>
              <Pencil size={10} style={{ flexShrink: 0, color: dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.18)" }} />
            </button>
          )}
        </div>

        {/* Score + grade + details chip */}
        {final !== null && g && (
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0, pointerEvents: "none" }}>
            {onlyOne && <span style={{ fontSize: 9, color: "#f59e0b", fontWeight: 700, background: "rgba(245,158,11,0.12)", padding: "2px 6px", borderRadius: 4 }}>1 MOD</span>}
            <span style={{ fontSize: 13, fontWeight: 800, color: g.color, fontFamily: "'Outfit',sans-serif" }}>
              {final.toFixed(1)}<span style={{ fontSize: 10, opacity: 0.55, fontWeight: 600 }}>/60</span>
            </span>
            <Badge color={g.color}>{g.grade}</Badge>
            <div style={{
              display: "flex", alignItems: "center", gap: 3, padding: "3px 8px", borderRadius: 6,
              background: showBreakdown ? "rgba(99,102,241,0.15)" : isHovered ? (dark ? "rgba(99,102,241,0.18)" : "rgba(99,102,241,0.11)") : (dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"),
              border: showBreakdown ? "1px solid rgba(99,102,241,0.30)" : isHovered ? "1px solid rgba(99,102,241,0.28)" : (dark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)"),
              transition: "all 0.18s",
            }}>
              <BarChart2 size={10} color={showBreakdown || isHovered ? "#6366f1" : textMute} />
              <span style={{ fontSize: 10, fontWeight: 600, color: showBreakdown || isHovered ? "#6366f1" : textMute, transition: "color 0.18s" }}>
                {showBreakdown ? "Hide" : "Details"}
              </span>
              {showBreakdown ? <ChevronUp size={10} color="#6366f1" /> : <ChevronDown size={10} color={isHovered ? "#6366f1" : textMute} />}
            </div>
          </div>
        )}

        {/* Delete */}
        <button
          onClick={e => { e.stopPropagation(); onRemove(); }}
          style={{ padding: 5, borderRadius: 7, border: "none", background: "transparent", color: dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.20)", cursor: "pointer", flexShrink: 0, transition: "background 0.15s,color 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.10)"; e.currentTarget.style.color = "#ef4444"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.20)"; }}
        >
          <Trash2 size={13} />
        </button>

        {/* Edit/Close toggle */}
        <button
          onClick={e => { e.stopPropagation(); setOpen(!open); }}
          style={{
            background: open ? "rgba(99,102,241,0.10)" : "transparent",
            border: open ? "1px solid rgba(99,102,241,0.20)" : `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
            borderRadius: 7, cursor: "pointer", padding: "3px 6px",
            display: "flex", alignItems: "center", gap: 3, flexShrink: 0, transition: "all 0.2s",
          }}
        >
          <span style={{ fontSize: 9, fontWeight: 700, color: open ? "#6366f1" : textMute }}>{open ? "CLOSE" : "EDIT"}</span>
          {open ? <ChevronUp size={12} color="#6366f1" /> : <ChevronDown size={12} color={textMute} />}
        </button>
      </div>

      {/* Progress bar */}
      {final !== null && (
        <div style={{ height: 3, background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)", pointerEvents: "none", position: "relative", zIndex: 1 }}>
          <motion.div
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
            style={{ height: "100%", background: `linear-gradient(90deg,${g.color}88,${g.color})`, boxShadow: isHovered ? `0 0 10px ${g.color}99` : `0 0 6px ${g.color}44`, transition: "box-shadow 0.25s" }}
          />
        </div>
      )}

      {/* Breakdown */}
      <AnimatePresence>
        {showBreakdown && final !== null && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: "hidden" }}
            onClick={e => e.stopPropagation()}
          >
            <BreakdownPanel subj={subj} m1score={m1score} m2score={m2score} final={final} g={g} dark={dark} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* One-module warning */}
      <AnimatePresence>
        {open && onlyOne && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => e.stopPropagation()}
            style={{ margin: "0 16px 12px", padding: "8px 12px", borderRadius: 8, background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", display: "flex", alignItems: "center", gap: 8 }}
          >
            <AlertTriangle size={13} color="#f59e0b" />
            <span style={{ fontSize: 12, color: "#f59e0b", fontWeight: 500 }}>
              Only one module entered — showing partial result. Add Module {m1score === null ? "1" : "2"} for final average.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Module inputs */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={e => e.stopPropagation()}
            style={{ padding: "0 16px 16px", display: "flex", gap: 16, overflow: "hidden" }}
          >
            <ModuleInput mod="m1" data={subj.m1} label="Module 1" dark={dark} onChange={(key, val) => onChange("m1", key, val)} />
            <div style={{ width: 1, background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)", margin: "4px 0" }} />
            <ModuleInput mod="m2" data={subj.m2} label="Module 2" dark={dark} onChange={(key, val) => onChange("m2", key, val)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

}

