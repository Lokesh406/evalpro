import { Zap } from "lucide-react";

import { motion } from "framer-motion";

function Logo() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="34" height="34" rx="8" fill="#0f3a7d" />
      {/* EP text */}
      <text x="17" y="23" fontFamily="system-ui, sans-serif" fontSize="14" fontWeight="900" textAnchor="middle" fill="white">EP</text>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0f3a7d"/>
          <stop offset="1" stopColor="#1e5a9e"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function VignanLogo() {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 6,
      background: "linear-gradient(135deg, #ff6b35, #f7931e)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 11, fontWeight: 900, color: "#fff", fontFamily: "system-ui",
      boxShadow: "0 2px 8px rgba(255,107,53,0.2)",
    }}>
      V
    </div>
  );
}

export default function Navbar() {

  return (
    <nav
      className="glass"
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(248,249,250,0.92)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        transition: "background 0.35s, border-color 0.35s",
        backdropFilter: "blur(8px)",
      }}
    >
      <div style={{
        maxWidth: 1160, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 62,
      }}>
        {/* Logo + Vignan */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <Logo />
            <div>
              <span style={{
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17,
                color: "#0f3a7d", letterSpacing: "-0.6px",
                display: "block", lineHeight: 1.1,
              }}>
                EvalPro
              </span>
              <span style={{ fontSize: 9.5, fontWeight: 600, color: "rgba(31,41,55,0.45)", letterSpacing: "0.6px", textTransform: "uppercase" }}>
                Assessment System
              </span>
              <span style={{ fontSize: 8, fontWeight: 700, color: "#0f3a7d", letterSpacing: "0.4px", marginTop: 2, display: "block" }}>
                R22 C22
              </span>
            </div>
          </div>

          {/* Vignan badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingLeft: 12, borderLeft: "1px solid rgba(0,0,0,0.08)" }}>
            <VignanLogo />
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", letterSpacing: "0.5px", lineHeight: 1.2 }}>
                Vignan
              </div>
              <div style={{ fontSize: 8, color: "rgba(31,41,55,0.5)", fontWeight: 500 }}>
                University
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>


          {/* Professional badge */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            style={{
              padding: "4px 10px", borderRadius: 100,
              background: "linear-gradient(135deg, rgba(15,58,125,0.08), rgba(37,99,235,0.06))",
              border: "1px solid rgba(15,58,125,0.2)",
              fontSize: 10, fontWeight: 700, color: "#0f3a7d", letterSpacing: "0.3px",
              display: "flex", alignItems: "center", gap: 5,
              cursor: "pointer",
            }}
          >
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#0f3a7d", animation: "pulse-glow 2s infinite" }} />
            PROFESSIONAL · SECURE
          </motion.div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}

            style={{
              padding: "8px 16px", borderRadius: 8,
              background: "linear-gradient(135deg, #ff6b35, #f7931e)",
              color: "#fff",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
              border: "none",
              boxShadow: "0 4px 12px rgba(255,107,53,0.3)",
              transition: "all 0.2s",
            }}
          >
            <Zap size={14} /> Get Started
          </motion.button>
        </div>
      </div>
    </nav>
  );
}
