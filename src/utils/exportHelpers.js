import { calcModule, calcFinal, getGrade } from "./marks";

// ── Build the full HTML report string ─────────────────────────────
export function buildHTMLReport(subjects, studentName) {
  const scored = subjects.filter(
    s => calcFinal(calcModule(s.m1), calcModule(s.m2)) !== null
  );
  const finals = scored.map(s => calcFinal(calcModule(s.m1), calcModule(s.m2)));
  const avg = finals.reduce((a, v) => a + v, 0) / finals.length;
  const og = getGrade(avg);

  const rows = scored
    .map((s, i) => {
      const f = finals[i];
      const g = getGrade(f);
      const m1 = calcModule(s.m1);
      const m2 = calcModule(s.m2);
      const pct = Math.round((f / 60) * 100);
      return `<tr>
        <td>${s.name}</td>
        <td>${m1?.toFixed(1) || "—"}/60</td>
        <td>${m2?.toFixed(1) || "—"}/60</td>
        <td><b style="color:${g.color}">${f.toFixed(1)}/60</b></td>
        <td style="color:${g.color};font-weight:700">${g.grade}</td>
        <td>${g.label}</td>
        <td style="min-width:120px">
          <div style="height:8px;border-radius:4px;background:#eee;overflow:hidden">
            <div style="height:100%;width:${pct}%;background:${g.color};border-radius:4px"></div>
          </div>
          <span style="font-size:11px;color:#888">${pct}%</span>
        </td>
      </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>VFSTR Internal Marks — ${studentName || "Student"}</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; padding: 40px; background: #f8f8fc; color: #111; }
    h1   { color: #6366f1; margin-bottom: 4px; }
    p.sub { color: #888; font-size: 13px; margin-bottom: 28px; }
    table { border-collapse: collapse; width: 100%; }
    th { background: #6366f1; color: #fff; padding: 10px 14px; text-align: left; font-size: 12px; font-weight: 600; }
    td { border-bottom: 1px solid #eee; padding: 10px 14px; font-size: 13px; vertical-align: middle; }
    .summary { margin-top: 28px; padding: 18px; border-radius: 10px; background: #fff; display: inline-block; border: 1px solid #e5e7eb; }
    .formula { font-size: 11px; color: #888; margin-top: 8px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <h1>VFSTR Internal Marks Report</h1>
  <p class="sub">
    Student: <b>${studentName || "—"}</b> &nbsp;|&nbsp;
    Pattern: R22 Revised &nbsp;|&nbsp;
    Generated: ${new Date().toLocaleDateString()}
  </p>
  <table>
    <tr>
      <th>Subject</th><th>Module 1</th><th>Module 2</th>
      <th>Final Internal</th><th>Grade</th><th>Remark</th><th>Progress</th>
    </tr>
    ${rows}
  </table>
  <div class="summary">
    Overall Average: <b>${avg.toFixed(1)}/60</b> —
    Grade: <b style="color:${og.color}">${og.grade}</b> (${og.label})
    <br />
    <span class="formula">
      Formula: PRET(/10→6) + T1(/20→8) + T2(/5→3) + T3(/5→3) + T4(/20→20) + T5(/20→20) = 60 per module.
      Final = (M1 + M2) / 2
    </span>
  </div>
</body>
</html>`;
}

// ── Download as HTML file ──────────────────────────────────────────
export function exportHTML(subjects, studentName) {
  const html = buildHTMLReport(subjects, studentName);
  const blob = new Blob([html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${studentName || "marks"}_vfstr_report.html`;
  a.click();
}

// ── Open print dialog → Save as PDF ───────────────────────────────
export function exportPDF(subjects, studentName) {
  const html = buildHTMLReport(subjects, studentName);
  const win = window.open("", "_blank");
  if (!win) { alert("Please allow popups to export PDF"); return; }
  win.document.write(html);
  win.document.close();
  win.onload = () => { win.focus(); win.print(); };
}
