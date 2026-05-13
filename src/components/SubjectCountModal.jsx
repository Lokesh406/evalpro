import { useState } from "react";
import { motion } from "framer-motion";
import { Hash } from "lucide-react";

export default function SubjectCountModal({ dark, onConfirm }) {
  const [inputVal, setInputVal] = useState("5");
  const presets = [4, 5, 6, 7, 8];

  function handleConfirm() {
    const n = parseInt(inputVal, 10);
    if (!isNaN(n) && n >= 1 && n <= 20) onConfirm(n);
  }

  const parsed = parseInt(inputVal, 10);
  const valid = !isNaN(parsed) && parsed >= 1 && parsed <= 20;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)",
        padding: 20,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: "100%", maxWidth: 420, borderRadius: 20,
          background: dark ? "#0f0f1a" : "#fff",
          border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
          padding: "36px 32px", textAlign: "center",
        }}
      >
        <div
          style={{
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg,#6366f1,#4f46e5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 8px 28px rgba(99,102,241,0.4)",
          }}
        >
          <Hash size={22} color="#fff" />
        </div>

        <h2 style={{ fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: 22, color: dark ? "#fff" : "#0d0d1a", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
          How many subjects?
        </h2>
        <p style={{ fontSize: 13, color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.45)", margin: "0 0 28px", lineHeight: 1.6 }}>
          We'll set up blank slots for each one.<br />You can always add more later.
        </p>

        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 20 }}>
          {presets.map(n => (
            <button
              key={n}
              onClick={() => setInputVal(String(n))}
              style={{
                width: 44, height: 44, borderRadius: 10,
                border: inputVal === String(n)
                  ? "2px solid #6366f1"
                  : dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.12)",
                background: inputVal === String(n)
                  ? "rgba(99,102,241,0.15)"
                  : dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                color: inputVal === String(n) ? "#6366f1" : dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
                fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {n}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 24 }}>
          <input
            type="number" min={1} max={20} value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleConfirm()}
            autoFocus
            placeholder="Or type a number (1–20)"
            style={{
              width: "100%", padding: "11px 16px", borderRadius: 10,
              border: valid ? "1.5px solid rgba(99,102,241,0.5)" : "1.5px solid rgba(239,68,68,0.4)",
              background: dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
              color: dark ? "#fff" : "#0d0d1a",
              fontSize: 15, fontFamily: "inherit", outline: "none",
              textAlign: "center", fontWeight: 600, boxSizing: "border-box",
            }}
          />
          {!valid && inputVal !== "" && (
            <p style={{ color: "#ef4444", fontSize: 11, margin: "5px 0 0", fontWeight: 500 }}>
              Please enter a number between 1 and 20
            </p>
          )}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleConfirm}
          disabled={!valid}
          style={{
            width: "100%", padding: "13px", borderRadius: 11,
            background: valid ? "linear-gradient(135deg,#6366f1,#4f46e5)" : "rgba(99,102,241,0.25)",
            color: "#fff", fontWeight: 700, fontSize: 14, border: "none",
            cursor: valid ? "pointer" : "not-allowed",
          }}
        >
          Set up {valid ? parsed : "?"} Subject{!valid || parsed !== 1 ? "s" : ""} →
        </motion.button>
        <p style={{ margin: "10px 0 0", fontSize: 11, color: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}>
          Press Enter to confirm
        </p>
      </motion.div>
    </div>
  );
}
