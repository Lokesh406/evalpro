import { emptySubject } from "./marks";
import { TARGETS } from "./constants";

// ── Extract reg number ─────────────────────────────────────────────
export function extractRegNo(raw) {
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const t = line.trim();
    // VFSTR reg patterns: 241FA04911, 22B91A0501, 23K31A0512, 231FA04E30, etc.
    // Flexible pattern: 2-3 digits, 1-3 letters, 2 digits, 1 letter/digit, 2-4 digits
    const m = t.match(/\b(\d{2,3}[A-Z]{1,3}\d{2}[A-Z0-9]\d{2,4})\b/);
    if (m) return m[1];
    // Also check inside brackets [241FA04911]
    const mb = t.match(/\[(\d{2,3}[A-Z]{1,3}\d{2}[A-Z0-9]\d{2,4})\]/);
    if (mb) return mb[1];
  }
  return "";
}

// ── Extract student name ───────────────────────────────────────────
export function extractStudentName(raw) {
  const lines = raw.split(/\r?\n/);
  const stopWords =
    /^(module|subject|target|marks|score|total|internal|semester|exam|sno|s\.no|roll|reg|branch|section|year|batch|course|grade|attendance|result|intra|academic|college|university|vfstr|vignan|apply|logout|pay\s|student\s+information|home|dashboard|notification|profile|settings)/i;

  // Priority 0: "Name [RegNo]" with any case — e.g. "neeli setty venkata lokesh babu [231FA04E30]"
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const m = t.match(/([a-z\s]{4,50})\s*\[[\w\d]+\]/i);
    if (m) {
      const candidate = m[1].trim();
      // Capitalize first letter of each word
      const capitalized = candidate.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      if (!stopWords.test(capitalized) && capitalized.split(" ").length >= 2 && /^[a-z\s]+$/i.test(candidate))
        return capitalized;
    }
  }

  // Priority 1: "Name [RegNo]" anywhere — e.g. "Chinnam Meghana [241FA04911]"
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    const m = t.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,4})\s*\[[\w\d]+\]/);
    if (m) {
      const candidate = m[1].trim();
      if (!stopWords.test(candidate) && candidate.split(" ").length >= 2)
        return candidate;
    }
  }

  // Priority 2: Tab-separated "Student Name\tRavi Kumar"
  for (const line of lines) {
    const t = line.trim();
    if (!t || !t.includes("\t")) continue;
    const parts = t.split("\t").map(p => p.trim()).filter(Boolean);
    for (let i = 0; i < parts.length - 1; i++) {
      if (/^(student\s*name|name)$/i.test(parts[i])) {
        const candidate = parts[i + 1].replace(/\[.*?\]/g, "").trim();
        if (
          candidate &&
          /^[A-Za-z][A-Za-z\s]{2,48}$/.test(candidate) &&
          !stopWords.test(candidate)
        )
          return candidate;
      }
    }
  }

  // Priority 3: Colon-separated "Name: Ravi Kumar"
  for (const line of lines) {
    const t = line.trim();
    const m = t.match(/^(?:student\s*)?name\s*[:\-]\s*([A-Za-z][A-Za-z\s]{2,48})$/i);
    if (m) {
      const candidate = m[1].trim();
      if (!stopWords.test(candidate)) return candidate;
    }
  }

  // Priority 4: "Hello, Firstname Lastname" or "Welcome, Name" pattern
  for (const line of lines) {
    const t = line.trim();
    const m = t.match(/(?:hello|welcome|hi)[,\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})/i);
    if (m) {
      const candidate = m[1].trim();
      if (!stopWords.test(candidate)) return candidate;
    }
  }

  // Priority 5: Look for reg-no adjacent lines — name often right before/after reg no
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (/^\d{2,3}[A-Z0-9]{6,10}$/.test(t)) {
      if (i > 0) {
        const prev = lines[i - 1].trim().replace(/\[.*?\]/g, "").trim();
        if (
          /^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(prev) &&
          !stopWords.test(prev) &&
          prev.split(" ").length >= 2
        ) return prev;
      }
      if (i < lines.length - 1) {
        const next = lines[i + 1].trim().replace(/\[.*?\]/g, "").trim();
        if (
          /^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(next) &&
          !stopWords.test(next) &&
          next.split(" ").length >= 2
        ) return next;
      }
    }
  }

  // Last resort: first Proper-Case line (2–4 words, alpha only) near top
  for (const line of lines.slice(0, 40)) {
    const t = line.trim().replace(/\[.*?\]/g, "").trim();
    if (!t || t.includes("\t")) continue;
    if (
      /^[A-Z][a-z]+(\s+[A-Z][a-z]+){1,3}$/.test(t) &&
      !stopWords.test(t)
    )
      return t;
  }

  return "";
}

// ── VFSTR portal table parser ─────────────────────────────────────
export function parseVFSTRTable(raw) {
  const lines = raw.split(/\r?\n/).filter(l => l.trim());

  const looksLikeCode = c =>
    c.length >= 1 &&
    c.length <= 15 &&
    /^[\w&\/\-\s]+$/.test(c) &&
    !/^(module|pret|t[1-5]|r22|review|\d+)$/i.test(c);

  let headerIdx = -1;
  let subjectNames = [];

  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split("\t");
    if (parts.length < 3) continue;

    if (parts[0].trim() === "") {
      const codes = parts.slice(1).map(p => p.trim()).filter(Boolean);
      if (codes.length >= 2 && codes.every(looksLikeCode)) {
        headerIdx = i;
        subjectNames = codes;
        break;
      }
    }

    const allCols = parts.map(p => p.trim()).filter(Boolean);
    if (allCols.length >= 3) {
      const rest = allCols.slice(1);
      if (
        rest.length >= 2 &&
        rest.every(looksLikeCode) &&
        !looksLikeCode(allCols[0])
      ) {
        headerIdx = i;
        subjectNames = rest;
        break;
      }
      if (allCols.every(looksLikeCode) && allCols.length >= 3) {
        headerIdx = i;
        subjectNames = allCols;
        break;
      }
    }
  }

  if (headerIdx === -1 || subjectNames.length === 0) return null;

  const acc = subjectNames.map(() => ({
    m1: { pret: [], t1: [], t2: [], t3: [], t4: [], t5: [], t5_30: [] },
    m2: { pret: [], t1: [], t2: [], t3: [], t4: [], t5: [], t5_30: [] },
  }));

  // Also store raw (original) values
  const rawAcc = subjectNames.map(() => ({
    m1: { pret: [], t1: [], t2: [], t3: [], t4: [], t5: [] },
    m2: { pret: [], t1: [], t2: [], t3: [], t4: [], t5: [] },
  }));

  for (let i = headerIdx + 1; i < lines.length; i++) {
    const parts = lines[i].split("\t");
    if (parts.length < 2) continue;

    const rawLabel = parts[0].trim();
    const label = rawLabel.toLowerCase().replace(/\s+/g, "");

    const modM = label.match(/module([12])/);
    if (!modM) continue;
    const mod = modM[1] === "1" ? "m1" : "m2";

    let target = null;
    let isT5_30 = false;

    if      (/module[12][-_]?pret/.test(label))                          target = "pret";
    else if (/module[12][-_]?t1(?:[^0-9]|$)/.test(label))               target = "t1";
    else if (/module[12][-_]?t2/.test(label))                            target = "t2";
    else if (/module[12][-_]?t3/.test(label))                            target = "t3";
    else if (/module[12][-_]?t4/.test(label))                            target = "t4";
    else if (/module[12][-_]?t5.*30.*marks/.test(label)) { target = "t5"; isT5_30 = true; }
    else if (/module[12][-_]?t5/.test(label))                            target = "t5";

    if (!target) continue;

    parts.slice(1).forEach((v, colIdx) => {
      if (colIdx >= subjectNames.length) return;
      const s = v.trim();
      if (!s || s === "-" || s === "—") return;
      const n = parseFloat(s);
      if (isNaN(n)) return;
      acc[colIdx][mod][isT5_30 ? "t5_30" : target].push(n);
      if (!isT5_30) rawAcc[colIdx][mod][target].push(n);
    });
  }

  const round2 = n => Math.round(n * 100) / 100;
  const avg = arr => arr.reduce((a, v) => a + v, 0) / arr.length;

  const result = [];
  subjectNames.forEach((name, idx) => {
    const d = acc[idx];
    const dr = rawAcc[idx];
    const hasAny = ["m1", "m2"].some(m =>
      Object.values(d[m]).some(arr => arr.length > 0)
    );
    if (!hasAny) return;

    const subj = emptySubject(Date.now() + idx * 13, name);

    ["m1", "m2"].forEach(mod => {
      const m = d[mod];
      const mr = dr[mod];
      const setVal = (key, val) => { subj[mod][key] = String(round2(val)); };
      const setRaw = (key, val) => { subj[mod][`${key}_raw`] = String(round2(val)); };

      if (m.pret.length) { setVal("pret", Math.max(...m.pret)); setRaw("pret", Math.max(...mr.pret.length ? mr.pret : m.pret)); }
      if (m.t1.length)   { setVal("t1",   Math.max(...m.t1));   setRaw("t1",   Math.max(...mr.t1.length ? mr.t1 : m.t1)); }
      if (m.t2.length)   { setVal("t2",   Math.max(...m.t2));   setRaw("t2",   Math.max(...mr.t2.length ? mr.t2 : m.t2)); }
      if (m.t3.length)   { setVal("t3",   Math.max(...m.t3));   setRaw("t3",   Math.max(...mr.t3.length ? mr.t3 : m.t3)); }
      if (m.t4.length)   { setVal("t4",   Math.max(...m.t4));   setRaw("t4",   Math.max(...mr.t4.length ? mr.t4 : m.t4)); }

      const hasOtherTargets = m.pret.length || m.t1.length || m.t2.length || m.t3.length || m.t4.length;
      if (m.t5_30.length) {
        // T5-30: single value out of 30, scale to 60
        const t5_30val = avg(m.t5_30);
        setVal("t5", round2((t5_30val / 30) * 60));
        setRaw("t5", t5_30val);
      } else if (m.t5.length) {
        if (!hasOtherTargets) {
          // T5-only: sum all CLA rows (each /20), scale to /60 using actual count
          // e.g. 3 rows: max=60 so sum=direct; 4 rows: max=80 so scaled down
          const t5sum = m.t5.reduce((a, v) => a + v, 0);
          const t5max = m.t5.length * 20;
          setVal("t5", round2(Math.min((t5sum / t5max) * 60, 60)));
        } else {
          setVal("t5", avg(m.t5));
        }
        setRaw("t5", avg(mr.t5.length ? mr.t5 : m.t5));
      }
    });

    result.push(subj);
  });

  return result.length ? result : null;
}

// ── Fallback line-by-line parser ──────────────────────────────────
export function parseTextFallback(raw) {
  const lines = raw.split(/\n/).map(l => l.trim()).filter(Boolean);
  const subjects = [];
  let cur = null;
  const subjectRe = /^([A-Za-z][A-Za-z\s\/\-&]{2,40})$/;
  const numRe = /(\d+(?:\.\d+)?)/;
  const kw = {
    pret: /pre[\s-]?target|pret|pre-t|pretest/i,
    t1:   /target[\s-]?1|t[\s-]?1\b/i,
    t2:   /target[\s-]?2|t[\s-]?2\b/i,
    t3:   /target[\s-]?3|t[\s-]?3\b/i,
    t4:   /target[\s-]?4|t[\s-]?4\b/i,
    t5:   /target[\s-]?5|t[\s-]?5\b/i,
  };
  const modKw = /module[\s-]?([12])|mod[\s-]?([12])|m[\s-]?([12])\b/i;
  let activeModule = "m1";

  for (const line of lines) {
    const modMatch = line.match(modKw);
    if (modMatch) {
      const n = modMatch[1] || modMatch[2] || modMatch[3];
      activeModule = n === "2" ? "m2" : "m1";
      continue;
    }
    const numMatch = line.match(numRe);
    const val = numMatch ? parseFloat(numMatch[1]) : null;
    const isKw = Object.values(kw).some(r => r.test(line));
    if (!numMatch && !isKw && subjectRe.test(line)) {
      cur = emptySubject(Date.now() + subjects.length, line);
      subjects.push(cur);
      activeModule = "m1";
      continue;
    }
    if (!cur) { cur = emptySubject(Date.now(), "Subject 1"); subjects.push(cur); }
    if (val === null) continue;
    for (const [k, re] of Object.entries(kw)) {
      if (re.test(line) && cur[activeModule][k] === "") {
        const t = TARGETS.find(t => t.key === k);
        cur[activeModule][k] = String(Math.min(val, t.max));
        cur[activeModule][`${k}_raw`] = String(Math.min(val, t.max));
        break;
      }
    }
  }
  return subjects.length ? subjects : null;
}

// ── Unified parser — table first, fallback second ─────────────────
export function parseText(raw) {
  const studentName = extractStudentName(raw);
  const regNo = extractRegNo(raw);
  if (raw.includes("\t")) {
    const tableResult = parseVFSTRTable(raw);
    if (tableResult) return { subjects: tableResult, studentName, regNo };
  }
  const fallback = parseTextFallback(raw);
  if (fallback) return { subjects: fallback, studentName, regNo };
  return null;
}