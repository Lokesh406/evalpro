import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Lock, CheckCircle } from "lucide-react";

export default function Hero({ onScroll, onGetStarted }) {
  const chips = [
    { s: "PRET", m: 10, sc: 6,  c: "#0f3a7d" },
    { s: "T1",   m: 20, sc: 8,  c: "#2563eb" },
    { s: "T2",   m: 5,  sc: 3,  c: "#059669" },
    { s: "T3",   m: 5,  sc: 3,  c: "#7c3aed" },
    { s: "T4",   m: 20, sc: 20, c: "#dc2626" },
    { s: "T5",   m: 20, sc: 20, c: "#ea580c" },
  ];

  const pills = [
    { icon: <BarChart3 size={11} />, label: "Real-time Analytics", color: "#0f3a7d" },
    { icon: <Lock size={11} />, label: "Secure & Private", color: "#059669" },
    { icon: <CheckCircle size={11} />, label: "Professional Grade", color: "#2563eb" },
  ];

  return (
    <section
      style={{
        padding: "96px 20px 64px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glows */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {/* Main centered glow */}
        <div style={{
          position: "absolute", top: "-5%", left: "50%",
          transform: "translateX(-50%)", width: 900, height: 500,
          background: "radial-gradient(ellipse, rgba(15,58,125,0.08) 0%, transparent 65%)",
        }} />
        {/* Floating orbs */}
        <div style={{
          position: "absolute", top: "15%", left: "8%",
          width: 240, height: 240, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.05) 0%, transparent 70%)",
          animation: "pulse-glow 5s ease-in-out infinite",
          filter: "blur(2px)",
        }} />
        <div style={{
          position: "absolute", top: "25%", right: "6%",
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)",
          animation: "pulse-glow 6s ease-in-out infinite 2s",
          filter: "blur(2px)",
        }} />
        {/* Bottom accent */}
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: 600, height: 1,
          background: "linear-gradient(90deg, transparent, rgba(15,58,125,0.12), transparent)",
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: "relative" }}
      >
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px 6px 10px", borderRadius: 100,
            border: "1px solid rgba(15,58,125,0.2)",
            background: "rgba(15,58,125,0.07)",
            marginBottom: 28,
          }}
        >
          <div style={{
            width: 20, height: 20, borderRadius: 100,
            background: "linear-gradient(135deg, #0f3a7d, #1e5a9e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 900, color: "#fff", fontFamily: "var(--font-display)",
          }}>
            EP
          </div>
          <span style={{ fontSize: 11, color: "#0f3a7d", fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase" }}>
            Professional Assessment Platform
          </span>
        </motion.div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(32px, 5.5vw, 62px)", fontWeight: 900,
            color: "#1f2937",
            lineHeight: 1.05, margin: "0 0 20px",
          }}
        >
          Streamline Your
          <br />
          <span style={{ color: "#0f3a7d" }}>Assessment Process</span>
        </h1>

        <p
          style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            color: "rgba(31,41,55,0.6)",
            maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.75,
            fontWeight: 400,
          }}
        >
          Import your evaluation data, get instant insights, and generate comprehensive reports. 
          Professional-grade assessment management made simple.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 10px 40px rgba(255,107,53,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onGetStarted}
            style={{
              padding: "14px 32px", borderRadius: 12,
              background: "linear-gradient(135deg, #ff6b35, #f7931e)",
              color: "#fff", fontWeight: 700, fontSize: 15, border: "none",
              cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8,
              boxShadow: "0 6px 28px rgba(255,107,53,0.3)",
              fontFamily: "var(--font-display)", letterSpacing: "-0.2px",
              transition: "all 0.2s",
            }}
          >
            Get Started <ArrowRight size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 8px 20px rgba(37,99,235,0.2)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onScroll}
            style={{
              padding: "14px 24px", borderRadius: 12,
              background: "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(5,150,105,0.06))",
              color: "#0f3a7d",
              fontWeight: 600, fontSize: 15,
              border: "1.5px solid rgba(15,58,125,0.2)",
              cursor: "pointer", fontFamily: "var(--font-body)",
              transition: "all 0.2s",
            }}
          >
            View Demo
          </motion.button>
        </div>

        {/* Trust pills */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}
        >
          {pills.map((p, i) => (
            <div key={i} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 12px", borderRadius: 100,
              background: `${p.color}12`, border: `1px solid ${p.color}28`,
              fontSize: 11, fontWeight: 600, color: p.color,
            }}>
              {p.icon} {p.label}
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Formula chips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          display: "flex", gap: 8, justifyContent: "center",
          flexWrap: "wrap", position: "relative",
        }}
      >
        <div style={{
          position: "absolute", inset: "-12px -20px",
          background: "radial-gradient(ellipse, rgba(15,58,125,0.03) 0%, transparent 70%)",
          borderRadius: 24, pointerEvents: "none",
        }} />
        {chips.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.38 + i * 0.07 }}
            style={{
              padding: "10px 16px", borderRadius: 13,
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(0,0,0,0.07)",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              boxShadow: `0 0 0 1px ${t.c}22 inset, 0 2px 10px rgba(0,0,0,0.07)`,
              backdropFilter: "blur(10px)",
              minWidth: 60,
            }}
          >
            <span style={{ fontSize: 14, fontWeight: 900, color: t.c, fontFamily: "var(--font-display)", letterSpacing: "-0.3px" }}>{t.s}</span>
            <span style={{ fontSize: 10, color: "rgba(0,0,0,0.38)", fontFamily: "var(--font-mono)", whiteSpace: "nowrap" }}>
              {t.m} → {t.sc}
            </span>
          </motion.div>
        ))}

        {/* Total chip */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.38 + chips.length * 0.07 }}
          style={{
            padding: "10px 16px", borderRadius: 13,
            background: "linear-gradient(135deg, rgba(15,58,125,0.1), rgba(37,99,235,0.07))",
            border: "1px solid rgba(15,58,125,0.2)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            minWidth: 60,
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 900, color: "#0f3a7d", fontFamily: "var(--font-display)" }}>Σ 60</span>
          <span style={{ fontSize: 10, color: "rgba(31,41,55,0.5)", fontFamily: "var(--font-mono)" }}>per mod</span>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
        onClick={onScroll}
        style={{ marginTop: 44, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          style={{
            width: 28, height: 44, borderRadius: 14,
            border: "1.5px solid rgba(0,0,0,0.12)",
            display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 8,
          }}
        >
          <div style={{
            width: 4, height: 8, borderRadius: 2,
            background: "rgba(0,0,0,0.25)",
            animation: "float 2s ease-in-out infinite",
          }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
