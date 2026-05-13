import { TARGETS } from "../utils/constants";
import { scaleTarget } from "../utils/marks";

export default function ModuleInput({ mod, data, label, dark, onChange }) {
  const inp = {
    padding: "6px 8px", borderRadius: 8,
    border: dark ? "1px solid rgba(255,255,255,0.09)" : "1px solid rgba(0,0,0,0.11)",
    background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
    color: dark ? "#fff" : "#0d0d1a",
    fontSize: 13, fontFamily: "inherit", outline: "none",
    width: "100%", boxSizing: "border-box", textAlign: "center",
  };

  return (
    <div style={{ flex: 1 }}>
      <p style={{ margin: "0 0 10px", fontSize: 11, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </p>
      {TARGETS.map(t => {
        const scaled = scaleTarget(t.key, data[t.key]);
        return (
          <div key={t.key} style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
              <label style={{ fontSize: 10, fontWeight: 700, color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                {t.short}
              </label>
              <span style={{ fontSize: 10, color: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.3)" }}>
                /{t.max}→{t.scaled}
              </span>
            </div>
            <input
              type="number" min={0} max={t.max}
              value={data[t.key]}
              onChange={e => onChange(t.key, e.target.value)}
              placeholder={`0–${t.max}`}
              style={inp}
              title={t.hint}
            />
          </div>
        );
      })}
    </div>
  );
}
