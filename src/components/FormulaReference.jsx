import { Info } from "lucide-react";
import { TARGETS } from "../utils/constants";

export default function FormulaReference({ dark }) {
  return (
    <div
      style={{
        marginTop: 32, padding: "16px 20px", borderRadius: 12,
        background: dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.03)",
        border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.07)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <Info size={13} color="#6366f1" />
        <span style={{ fontSize: 12, fontWeight: 700, color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
          VFSTR R22 Revised Formula Reference
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {TARGETS.map(t => (
          <div
            key={t.key}
            style={{
              padding: "5px 11px", borderRadius: 8,
              background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
              border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: "#6366f1" }}>{t.short}</span>
            <span style={{ fontSize: 10, color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)" }}>
              {" "}{t.max}→{t.scaled} · {t.hint}
            </span>
          </div>
        ))}
      </div>

      <p style={{ margin: "10px 0 0", fontSize: 11, color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)", lineHeight: 1.7 }}>
        Each module = max 60 marks. Final Internal = (Module 1 + Module 2) ÷ 2 (out of 60).
        Subjects like DW Honours with only T5 are supported — leave other fields blank.
      </p>
    </div>
  );
}
