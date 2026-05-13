import { motion } from "framer-motion";
import { BookOpen, Plus } from "lucide-react";

export default function EmptyState({ dark, onAdd }) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        textAlign: "center", padding: "48px 20px",
        borderRadius: 16,
        border: dark ? "2px dashed rgba(255,255,255,0.07)" : "2px dashed rgba(0,0,0,0.09)",
      }}
    >
      <BookOpen size={32} color={dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"} style={{ margin: "0 auto 12px", display: "block" }} />
      <p style={{ fontSize: 15, fontWeight: 600, color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", margin: "0 0 6px" }}>
        No subjects yet
      </p>
      <p style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)", margin: "0 0 20px" }}>
        Paste your portal text above, upload a file, or add manually
      </p>
      <button
        onClick={onAdd}
        style={{
          padding: "9px 20px", borderRadius: 9,
          background: "rgba(99,102,241,0.12)",
          border: "1px solid rgba(99,102,241,0.25)",
          color: "#6366f1", fontSize: 13, fontWeight: 600,
          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7,
        }}
      >
        <Plus size={14} /> Add Subject Manually
      </button>
    </motion.div>
  );
}
