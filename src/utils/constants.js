// ── VFSTR R22 Target definitions ──────────────────────────────────
export const TARGETS = [
  { key: "pret", label: "Pre-Target 1", short: "PRET", max: 10, scaled: 6,  hint: "Mid of 3rd week quiz" },
  { key: "t1",   label: "Target 1",     short: "T1",   max: 20, scaled: 8,  hint: "End of 5th week — 2Q×10M=20, scale to 8" },
  { key: "t2",   label: "Target 2",     short: "T2",   max: 5,  scaled: 3,  hint: "5 marks, scaled to 3" },
  { key: "t3",   label: "Target 3",     short: "T3",   max: 5,  scaled: 3,  hint: "5 marks, scaled to 3" },
  { key: "t4",   label: "Target 4",     short: "T4",   max: 20, scaled: 20, hint: "3Q×5M=15 + 10Q×½M=5 = 20" },
  { key: "t5",   label: "Target 5",     short: "T5",   max: 20, scaled: 20, hint: "End semester — 20 marks" },
];

// ── Grade table ────────────────────────────────────────────────────
export const GRADE_TABLE = [
  { min: 56, grade: "O",  label: "Outstanding",  color: "#10b981" },
  { min: 48, grade: "A+", label: "Excellent",     color: "#06b6d4" },
  { min: 42, grade: "A",  label: "Very Good",     color: "#6366f1" },
  { min: 36, grade: "B+", label: "Good",          color: "#8b5cf6" },
  { min: 30, grade: "B",  label: "Average",       color: "#f59e0b" },
  { min: 24, grade: "C",  label: "Satisfactory",  color: "#f97316" },
  { min: 0,  grade: "F",  label: "Fail",          color: "#ef4444" },
];
