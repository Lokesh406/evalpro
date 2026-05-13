import { motion } from "framer-motion";
import { calcModule, calcFinal, getGrade } from "../utils/marks";

function SubjectRing({ subject, dark, index, onClick }) {
  const m1 = calcModule(subject.m1);
  const m2 = calcModule(subject.m2);
  const final = calcFinal(m1, m2);
  const g = final !== null ? getGrade(final) : null;
  if (final === null) return null;

  // Use subject.id for stable unique gradient IDs (avoids SVG defs collision)
  const gradId = `grad-${subject.id}`;

  const size = 130, stroke = 9;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min((final / 60) * 100, 100);
  const dash = (pct / 100) * circ;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.34, 1.4, 0.64, 1] }}
      onClick={onClick}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, minWidth: 110, cursor: onClick ? "pointer" : "default" }}
    >
      <div style={{ position: "relative", width: size, height: size }}>
        <div style={{ position: "absolute", inset: stroke + 8, borderRadius: "50%", background: `radial-gradient(circle, ${g.color}18 0%, transparent 70%)`, pointerEvents: "none" }} />
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth={stroke - 3} />
          <motion.circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={`url(#${gradId})`} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }}
            transition={{ duration: 1.1, delay: index * 0.07 + 0.15, ease: [0.4, 0, 0.2, 1] }}
            style={{ filter: `drop-shadow(0 0 6px ${g.color}99)` }}
          />
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={g.color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={g.color} stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1 }}>
          <span style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Sora',sans-serif", color: g.color, lineHeight: 1, letterSpacing: "-0.5px" }}>
            {final.toFixed(1)}
          </span>
          <span style={{ fontSize: 9.5, fontWeight: 600, color: dark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.32)", letterSpacing: "0.3px" }}>/ 60</span>
          <div style={{ marginTop: 4, fontSize: 10.5, fontWeight: 800, color: g.color, background: `${g.color}1a`, border: `1px solid ${g.color}40`, borderRadius: 5, padding: "2px 7px" }}>
            {g.grade}
          </div>
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, textAlign: "center", color: dark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.65)", maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {subject.name || `Subject ${index + 1}`}
      </div>
      <div style={{ fontSize: 9.5, fontWeight: 600, textAlign: "center", color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", marginTop: -4 }}>
        {getGrade(final).label}
      </div>
    </motion.div>
  );
}

export default function SummaryPanel({ subjects, dark, onSubjectClick }) {
  const scored = subjects.filter(s => calcFinal(calcModule(s.m1), calcModule(s.m2)) !== null);
  if (!scored.length) return null;

  const finals = scored.map(s => calcFinal(calcModule(s.m1), calcModule(s.m2)));
  const maxVal = finals.reduce((a, v) => Math.max(a, v), -Infinity);
  const minVal = finals.reduce((a, v) => Math.min(a, v), Infinity);
  const best  = scored[finals.indexOf(maxVal)];
  const worst = scored[finals.indexOf(minVal)];
  const avg   = finals.reduce((a, v) => a + v, 0) / finals.length;
  const g     = getGrade(avg);

  return (
    <motion.div
      layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{
        borderRadius: 22, padding: "26px 28px 24px",
        background: dark
          ? "linear-gradient(145deg, rgba(99,102,241,0.1) 0%, rgba(30,27,75,0.6) 60%, rgba(7,7,14,0.4) 100%)"
          : "linear-gradient(145deg, rgba(99,102,241,0.08) 0%, rgba(238,242,255,0.9) 100%)",
        border: dark ? "1px solid rgba(99,102,241,0.2)" : "1px solid rgba(99,102,241,0.15)",
        marginBottom: 28, backdropFilter: "blur(12px)",
        boxShadow: dark
          ? "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)"
          : "0 4px 24px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
      }}
    >
      {/* Header chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22, alignItems: "center" }}>
        <span style={{ padding: "5px 13px", borderRadius: 8, background: "#10b98115", color: "#10b981", fontSize: 11.5, fontWeight: 700, border: "1px solid #10b98128" }}>
          ↑ {best.name || "Best"} · {calcFinal(calcModule(best.m1), calcModule(best.m2))?.toFixed(1)}
        </span>
        <span style={{ padding: "5px 13px", borderRadius: 8, background: "#ef444415", color: "#ef4444", fontSize: 11.5, fontWeight: 700, border: "1px solid #ef444428" }}>
          ↓ {worst.name || "Lowest"} · {calcFinal(calcModule(worst.m1), calcModule(worst.m2))?.toFixed(1)}
        </span>
        <span style={{ marginLeft: "auto", padding: "5px 13px", borderRadius: 8, background: `${g.color}15`, color: g.color, fontSize: 11.5, fontWeight: 700, border: `1px solid ${g.color}28` }}>
          {scored.length} subject{scored.length !== 1 ? "s" : ""} · Grade {g.grade}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: dark ? "linear-gradient(90deg, transparent, rgba(99,102,241,0.25), transparent)" : "linear-gradient(90deg, transparent, rgba(99,102,241,0.18), transparent)", marginBottom: 26 }} />

      {/* Rings */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20, justifyContent: "center", alignItems: "flex-start" }}>
        {scored.map((s, i) => (
          <SubjectRing key={s.id} subject={s} dark={dark} index={i} onClick={onSubjectClick ? () => onSubjectClick(s.id) : undefined} />
        ))}
      </div>
    </motion.div>
  );

}

