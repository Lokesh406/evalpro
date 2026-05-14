import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Image, Download, Loader2, Share2, Mail, BarChart3 } from "lucide-react";
import { calcModule, calcFinal, getGrade } from "../utils/marks";
import ShareLinkModal from "./ShareLinkModal";
import EmailExportModal from "./EmailExportModal";

function buildReportHTML(scored, studentName, regNo) {
  const finals  = scored.map(s => calcFinal(calcModule(s.m1), calcModule(s.m2)));
  const avg     = finals.length ? (finals.reduce((a, v) => a + v, 0) / finals.length) : 0;
  const ogBase = getGrade(avg);
  const og = (avg < 22)
    ? { min: 0, grade: "F", label: "Fail", color: "#ef4444" }
    : ogBase;
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const rows = scored.map((s, i) => {
    const f  = finals[i];
    const g  = getGrade(f);
    const m1 = calcModule(s.m1);
    const m2 = calcModule(s.m2);
    return `
      <tr>
        <td>${s.name || `Subject ${i + 1}`}</td>
        <td>${m1 !== null ? m1.toFixed(1) + "/60" : "—"}</td>
        <td>${m2 !== null ? m2.toFixed(1) + "/60" : "—"}</td>
        <td><b style="color:${g.color}">${f.toFixed(1)}/60</b></td>
        <td style="color:${g.color};font-weight:800">${g.grade}</td>
        <td>${g.label}</td>
      </tr>`;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>EvalPro Assessment Report — ${studentName || "Student"}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: #f6f6fb; color: #111; padding: 48px 40px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
    .logo-badge { width: 40px; height: 40px; border-radius: 8px; background: #0f3a7d; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 800; font-size: 14px; }
    .vignan-badge { width: 32px; height: 32px; border-radius: 6px; background: linear-gradient(135deg,#ff6b35,#f7931e); display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 11px; margin-left: 8px; }
    .logo-text { font-size: 18px; font-weight: 800; color: #0f3a7d; }
    .logo-text span { color: #ff6b35; font-weight: 700; }
    .institution { font-size: 11px; font-weight: 600; color: #666; margin-left: 8px; }
    h1 { font-size: 26px; font-weight: 800; color: #0f3a7d; letter-spacing: -0.5px; margin-bottom: 8px; }
    .meta { display: flex; gap: 18px; flex-wrap: wrap; margin-bottom: 4px; }
    .meta-item { font-size: 13px; color: #555; }
    .meta-item b { color: #0f3a7d; font-weight: 700; }
    .divider { height: 2px; background: linear-gradient(90deg,#0f3a7d,#ff6b35,transparent); margin: 24px 0; border-radius: 2px; }
    table { border-collapse: collapse; width: 100%; margin-bottom: 28px; }
    thead th { background: linear-gradient(135deg,#0f3a7d,#1e5a9e); color: #fff; padding: 11px 14px; text-align: left; font-size: 12px; font-weight: 700; }
    thead th:first-child { border-radius: 8px 0 0 0; }
    thead th:last-child { border-radius: 0 8px 0 0; }
    tbody tr:nth-child(even) { background: rgba(15,58,125,0.04); }
    td { border-bottom: 1px solid #e0e3f0; padding: 11px 14px; font-size: 13px; vertical-align: middle; }
    .summary-card { display: inline-block; background: #fff; border: 2px solid #0f3a7d; border-radius: 14px; padding: 20px 28px; margin-bottom: 20px; box-shadow: 0 2px 12px rgba(15,58,125,0.08); }
    .summary-avg { font-size: 36px; font-weight: 900; line-height: 1; margin-bottom: 6px; color: #0f3a7d; }
    .formula-note { font-size: 11px; color: #666; margin-top: 14px; line-height: 1.7; padding: 12px 16px; background: #f0f8fb; border-left: 3px solid #0f3a7d; border-radius: 4px; }
    .footer { margin-top: 36px; font-size: 11px; color: #1f2937; text-align: center; border-top: 1px solid #cbd5e1; padding-top: 16px; }
    @media print { body { padding: 24px 28px; background: #fff; } @page { margin: 18mm 14mm; } }
  </style>
</head>
<body>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
    <div style="display:flex;align-items:center">
      <div class="logo-badge">EP</div>
      <div style="margin-left:12px">
        <div class="logo-text">Eval<span>Pro</span></div>
        <div style="font-size:10px;color:#666;font-weight:600">Assessment System</div>
      </div>
    </div>
    <div style="text-align:right">
      <div class="institution">Vignan University</div>
      <div style="font-size:10px;color:#0f3a7d;font-weight:700">R22 C22</div>
    </div>
  </div>
  
  <h1>Assessment Report</h1>
  <div class="meta">
    <div class="meta-item">Student: <b>${studentName || "—"}</b></div>
    ${regNo ? `<div class="meta-item">Reg No: <b>${regNo}</b></div>` : ""}
    <div class="meta-item">Curriculum: <b>R22 C22</b></div>
    <div class="meta-item">Generated: <b>${dateStr}</b></div>
  </div>
  <div class="divider"></div>
  <table>
    <thead><tr><th>Subject</th><th>Module 1</th><th>Module 2</th><th>Final</th><th>Grade</th><th>Remark</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="summary-card">
    <div style="font-size:12px;font-weight:700;color:#0f3a7d;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Overall Average</div>
    <div class="summary-avg" style="color:${og.color}">${avg.toFixed(1)}<span style="font-size:18px;font-weight:600;opacity:0.7">/60</span></div>
    <div style="font-size:15px;font-weight:700;color:${og.color}">${og.grade} · ${og.label}</div>
  </div>
  <div class="formula-note">
    <b>Evaluation Formula (R22 C22):</b> PRET(÷10→6) + T1(÷20→8) + T2(÷5→3) + T3(÷5→3) + T4(÷20→20) + T5(÷20→20) = 60/module · Final = (M1+M2)÷2
  </div>
  <div class="footer">
    <div style="margin-bottom:12px;font-size:10px;color:#111827">
      <div style="margin-bottom:4px"><b>Generated:</b> ${dateStr} at ${new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
<div style="margin-bottom:4px"><b>Institution:</b> Vignan University, Guntur</div>
      <div style="margin-bottom:4px"><b>Curriculum Pattern:</b> R22 C22</div>
      <div><b>System:</b> EvalPro v1.0 - Professional Assessment System</div>
    </div>
    <div style="border-top:1px solid rgba(0,0,0,0.18);padding-top:8px;font-size:9px;color:#111827;font-weight:600">
      Secure • Private • Browser-based • © 2026 Vignan University. This document is confidential and for authorized use only.
    </div>
    <div style="margin-top:6px;font-size:9px;color:#1f2937;line-height:1.5;font-weight:600">
      If any mistakes appear, please wait and they will be rectified soon. If you face any issue, contact us at unprofessionalenginneers8@gmail.com.
    </div>
  </div>
</body>
</html>`;
}

export default function ExportBar({ subjects, studentName, regNo = "", dark, onTrend, onEmail, onAnalytics }) {
  const [loading, setLoading] = useState(null); // "pdf", "jpg", "html" or null
  const [showShare, setShowShare] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const scored = subjects.filter(s => calcFinal(calcModule(s.m1), calcModule(s.m2)) !== null);
  if (!scored.length) return null;

  function exportHTML() {
    const html = buildReportHTML(scored, studentName, regNo);
    const blob = new Blob([html], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${(studentName || "marks").replace(/\s+/g, "_")}_report.html`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function exportPDF() {
    setLoading("pdf");
    setTimeout(() => {
      const html = buildReportHTML(scored, studentName, regNo);
      const printable = html.replace(
        "</body>",
        `<script>window.onload = function() { window.focus(); window.print(); setTimeout(() => window.close(), 100); }<\/script></body>`
      );
      const win = window.open("", "_blank");
      if (!win) { 
        alert("Pop-ups are blocked. Please allow pop-ups to generate the PDF."); 
        setLoading(null);
        return; 
      }
      win.document.write(printable);
      win.document.close();
      setLoading(null);
    }, 300);
  }

  async function exportJPG() {
    setLoading("jpg");
    try {
      // Dynamically load html2canvas
      const { default: html2canvas } = await import("html2canvas");
      
      // Create temporary container with proper styling
      const container = document.createElement("div");
      container.innerHTML = buildReportHTML(scored, studentName, regNo);
      container.style.position = "fixed";
      container.style.top = "-9999px";
      container.style.left = "-9999px";
      container.style.width = "1200px";
      container.style.minHeight = "auto";
      container.style.background = "#f6f6fb";
      container.style.overflow = "visible";
      container.style.padding = "48px 40px";
      container.style.fontFamily = "'DM Sans', sans-serif";
      document.body.appendChild(container);

      // Wait longer for all content to render
      await new Promise(r => setTimeout(r, 200));

      // Generate canvas - capture full height with improved settings
      const canvas = await html2canvas(container, {
        backgroundColor: "#f6f6fb",
        scale: 2.5,
        useCORS: true,
        logging: false,
        allowTaint: true,
        imageTimeout: 0,
        removeContainer: false
      });

      // Convert to JPG with maximum quality
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpeg", 1.0);
      link.download = `${(studentName || "marks").replace(/\s+/g, "_")}_report.jpg`;
      link.click();

      // Cleanup
      document.body.removeChild(container);
      setLoading(null);
    } catch (e) {
      console.error("JPG export error:", e);
      alert("Error generating JPG. Please try again.");
      setLoading(null);
    }
  }

  const btn = (onClick, bg, border, color, icon, label, isLoading) => (
    <motion.button
      whileHover={{ scale: 1.02 }} 
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={loading !== null}
      style={{
        padding: "clamp(8px, 2vw, 10px) clamp(12px, 3vw, 18px)", 
        borderRadius: 10,
        background: bg, 
        border: `1.5px solid ${border}`,
        color, 
        fontWeight: 600, 
        fontSize: "clamp(12px, 2vw, 13px)",
        cursor: loading !== null ? "not-allowed" : "pointer", 
        display: "flex", 
        alignItems: "center", 
        gap: 8,
        fontFamily: "inherit", 
        transition: "all 0.2s",
        opacity: loading !== null && !isLoading ? 0.6 : 1,
        minHeight: 44,
        minWidth: 44,
        whiteSpace: "nowrap",
      }}
    >
      {isLoading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : icon}
      {label}
    </motion.button>
  );

  return (
    <div style={{ marginTop: 24, padding: "14px 0" }}>
      <div style={{ fontSize: "clamp(11px, 2.5vw, 12px)", fontWeight: 700, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
        Export Report
      </div>
      <div style={{ display: "flex", gap: "clamp(6px, 2vw, 10px)", flexWrap: "wrap", "@media (max-width: 640px)": { flexDirection: "column" } }} className="export-bar-buttons">
        {btn(exportHTML, "rgba(99,102,241,0.08)", "rgba(99,102,241,0.2)", "#6366f1", <FileText size={14} />, "HTML Report", false)}
        {btn(exportPDF, "rgba(168,85,247,0.08)", "rgba(168,85,247,0.2)", "#a855f7", <Download size={14} />, "PDF", loading === "pdf")}
        {btn(exportJPG, "rgba(34,197,94,0.08)", "rgba(34,197,94,0.2)", "#22c55e", <Image size={14} />, "JPG", loading === "jpg")}
        {btn(() => setShowShare(true), "rgba(245,158,11,0.08)", "rgba(245,158,11,0.2)", "#f59e0b", <Share2 size={14} />, "Share (QR JPG)", false)}
        {btn(() => setShowEmailModal(true), "rgba(59,130,246,0.08)", "rgba(59,130,246,0.2)", "#3b82f6", <Mail size={14} />, "Email", false)}
        {onTrend && btn(onTrend, "rgba(59,130,246,0.08)", "rgba(59,130,246,0.2)", "#3b82f6", <Share2 size={14} />, "Trends", false)}
        {onAnalytics && btn(onAnalytics, "rgba(234,88,12,0.08)", "rgba(234,88,12,0.2)", "#ea580c", <BarChart3 size={14} />, "Analytics", false)}
      </div>
      
      <ShareLinkModal isOpen={showShare} onClose={() => setShowShare(false)} studentName={studentName} regNo={regNo} subjects={scored} />
      <EmailExportModal isOpen={showEmailModal} onClose={() => setShowEmailModal(false)} studentName={studentName} regNo={regNo} subjects={scored} />
    </div>
  );
}
