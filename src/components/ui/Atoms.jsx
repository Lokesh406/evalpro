// ── Shared tiny UI atoms ───────────────────────────────────────────

export function Badge({ children, color }) {
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      {children}
    </span>
  );
}

export function Pill({ children, color = "#6366f1" }) {
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: 100,
        fontSize: 10,
        fontWeight: 700,
        background: `${color}18`,
        color,
        letterSpacing: "0.3px",
      }}
    >
      {children}
    </span>
  );
}

export function RingProgress({ pct, size = 110, stroke = 9, color }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.min(pct / 100, 1) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.9s cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
}
