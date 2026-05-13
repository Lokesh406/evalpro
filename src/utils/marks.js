import { TARGETS, GRADE_TABLE } from "./constants";

export function scaleTarget(key, raw) {
  const t = TARGETS.find(t => t.key === key);
  if (!t || raw === "" || raw === null || raw === undefined) return null;
  const v = parseFloat(raw);
  if (isNaN(v)) return null;
  const clamped = Math.min(v, t.max);
  return Math.round((clamped / t.max) * t.scaled * 100) / 100;
}

export function calcModule(mod) {
  const filled = TARGETS.filter(
    t => mod[t.key] !== "" && mod[t.key] !== undefined && mod[t.key] !== null
  );
  if (!filled.length) return null;
  const hasOtherTargets = filled.some(t => t.key !== "t5");
  if (!hasOtherTargets) {
    const v = parseFloat(mod.t5);
    if (isNaN(v)) return null;
    return Math.round(Math.min(v, 60) * 100) / 100;
  }
  let total = 0;
  filled.forEach(t => {
    const scaled = scaleTarget(t.key, mod[t.key]);
    if (scaled !== null) total += scaled;
  });
  return Math.round(total * 100) / 100;
}

export function moduleMax(mod) {
  const filled = TARGETS.filter(
    t => mod[t.key] !== "" && mod[t.key] !== undefined && mod[t.key] !== null
  );
  const hasOtherTargets = filled.some(t => t.key !== "t5");
  if (!hasOtherTargets) return 60;
  return filled.reduce((s, t) => s + t.scaled, 0);
}

export function calcFinal(m1score, m2score) {
  if (m1score === null && m2score === null) return null;
  if (m1score !== null && m2score !== null)
    return Math.round(((m1score + m2score) / 2) * 100) / 100;
  return m1score !== null ? m1score : m2score;
}

export function getGrade(score) {
  return GRADE_TABLE.find(g => score >= g.min) || GRADE_TABLE[GRADE_TABLE.length - 1];
}

export function emptyMod() {
  return { pret: "", t1: "", t2: "", t3: "", t4: "", t5: "" };
}

export function emptySubject(id, name = "") {
  return { id, name, m1: emptyMod(), m2: emptyMod() };

} 

