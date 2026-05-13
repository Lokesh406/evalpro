import { Type } from "lucide-react";

export default function MethodBar({ method, setMethod, dark }) {
  const methods = [
    { id: "paste",  icon: <Type size={14} />,    label: "Paste Text" },
  ];

  return (
    <div
      style={{
        display: "flex", gap: 6, padding: 4,
        background: dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
        borderRadius: 10,
        border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(0,0,0,0.06)",
        marginBottom: 24,
      }}
    >
      {methods.map(m => (
        <button
          key={m.id}
          onClick={() => setMethod(m.id)}
          style={{
            flex: 1, padding: "8px 12px", borderRadius: 7, border: "none",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            fontSize: 13, fontWeight: 600, transition: "all 0.18s",
            background: method === m.id ? "#6366f1" : "transparent",
            color: method === m.id ? "#fff" : dark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.45)",
            boxShadow: method === m.id ? "0 3px 12px rgba(99,102,241,0.3)" : "none",
          }}
        >
          {m.icon}{m.label}
        </button>
      ))}
    </div>
  );
}
