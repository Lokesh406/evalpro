import { useState } from "react";
import { parseText } from "../utils/parser";

export default function PastePanel({ dark, onDetected }) {
  const [text, setText] = useState("");
  const [err, setErr] = useState("");

  function handle() {
    setErr("");
    const r = parseText(text);
    if (r) onDetected(r);
    else setErr("Couldn't detect subjects/marks. Try labelling lines: 'Mathematics', 'T1: 18', 'T2: 4'…");
  }

  const ta = {
    width: "100%", padding: "11px 14px", borderRadius: 10,
    border: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.12)",
    background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
    color: dark ? "#fff" : "#0d0d1a",
    fontSize: 13, fontFamily: "inherit", resize: "vertical",
    outline: "none", boxSizing: "border-box", lineHeight: 1.6,
  };

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Guide card */}
      <div
        style={{
          borderRadius: 11,
          border: dark ? "1px solid rgba(16,185,129,0.25)" : "1px solid rgba(16,185,129,0.3)",
          background: dark ? "rgba(16,185,129,0.06)" : "rgba(16,185,129,0.05)",
          padding: "12px 16px", marginBottom: 12,
        }}
      >
        <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#10b981", display: "flex", alignItems: "center", gap: 6 }}>
          ✦ Fastest way — copy your marks directly from the VFSTR portal:
        </p>
        <ol style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)", lineHeight: 2 }}>
<li>
  Login to{" "}
  <a
    href="https://erp.vignan.ac.in/student/"
    target="_blank"
    rel="noopener noreferrer"
    title="Click here to visit Vignan Student Portal"
    style={{
      color: "#007BFF",
      fontWeight: "bold",
      textDecoration: "underline",
      cursor: "pointer",
    }}
  >
    Vignan Student Portal
  </a>
  {" "}→ Personal → Internal
</li>          <li>Select <strong style={{ color: dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)" }}>all the text on the page</strong> (Ctrl+A or Cmd+A)</li>
          <li>Copy it (<strong style={{ color: dark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.8)" }}>Ctrl+C</strong>)</li>
          <li>Paste below — subjects &amp; marks are <strong style={{ color: "#10b981" }}>auto-detected instantly</strong></li>
        </ol>
      </div>

      <div style={{ position: "relative", marginBottom: 12 }}>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={7}
          placeholder={"Paste the entire page text from the VFSTR portal here…\n\nOr type manually:\nMathematics\nModule 1\nPRET: 8 / T1: 16 / T2: 4 / T3: 4 / T4: 18 / T5: 19"}
          style={ta}
        />
        {!text.trim() && (
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            textAlign: "center",
            fontSize: 22,
            fontWeight: 800,
            color: "rgba(0, 0, 0, 0.12)",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            lineHeight: 1.8,
            whiteSpace: "nowrap"
          }}>
            📋 Paste Your Copied Data Here
          </div>
        )}
      </div>

      {err && <p style={{ color: "#ef4444", fontSize: 12, margin: "6px 0 0" }}>{err}</p>}

      <button
        onClick={handle}
        disabled={!text.trim()}
        style={{
          marginTop: 10, padding: "9px 18px", borderRadius: 8,
          background: text.trim() ? "#6366f1" : "rgba(99,102,241,0.25)",
          color: "#fff", fontWeight: 600, fontSize: 13, border: "none",
          cursor: text.trim() ? "pointer" : "not-allowed",
          display: "inline-flex", alignItems: "center", gap: 7,
        }}
      >
        Detect &amp; Preview →
      </button>
    </div>
  );
}
