import { useState } from "react";
import { Copy, X, Share2, Download, Image as ImageIcon, Loader2 } from "lucide-react";
import { calcModule, calcFinal, getGrade } from "../utils/marks";
import { QRCodeCanvas } from "qrcode.react";
import { buildShareLink } from "../utils/share.js";

export default function ShareLinkModal({ isOpen, onClose, studentName, regNo, subjects }) {
  const [copied, setCopied] = useState(false);
  const [shareMode, setShareMode] = useState("image"); // "link" or "image"
  const [qrMode, setQrMode] = useState("jpg"); // "jpg" (default) or "link"
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Create a compact representation of the data (object)
  const createShareData = () => {
    return {
      name: studentName || "Student",
      regNo: regNo || "",
      subjects: subjects.map(s => ({ name: s.name, m1: s.m1, m2: s.m2 })),
    };
  };

  // Build report HTML for image generation
  const buildReportHTML = () => {
    const scored = subjects.filter(s => calcFinal(calcModule(s.m1), calcModule(s.m2)) !== null);
    const finals = scored.map(s => calcFinal(calcModule(s.m1), calcModule(s.m2)));
    const avg = finals.length ? finals.reduce((a, v) => a + v, 0) / finals.length : 0;
    const og = getGrade(avg);
    const dateStr = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

    const rows = scored.map((s, i) => {
      const f = finals[i];
      const g = getGrade(f);
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
    body { font-family: 'DM Sans', sans-serif; background: #f6f6fb; color: #111; padding: 48px 40px; }
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
      Secure • Private • Browser-based • © 2026 Vignan University. This document is confidential.
    </div>
    <div style="margin-top:6px;font-size:9px;color:#1f2937;line-height:1.5;font-weight:600">
      If any mistakes appear, please wait and they will be rectified soon. If you face any issue, contact us at unprofessionalenginneers8@gmail.com.
    </div>
  </div>
</body>
</html>`;
  };

  // Generate report image
  const generateImage = async () => {
    setGeneratingImage(true);
    let container = null;
    try {
      const { default: html2canvas } = await import("html2canvas");

      container = document.createElement("div");
      container.innerHTML = buildReportHTML();
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

      await new Promise(r => setTimeout(r, 200));

      const canvas = await html2canvas(container, {
        backgroundColor: "#f6f6fb",
        scale: 2.5,
        useCORS: true,
        logging: false,
        allowTaint: true,
        imageTimeout: 0,
        removeContainer: false,
      });

      const imageData = canvas.toDataURL("image/jpeg", 1.0);
      setImagePreview(imageData);
    } catch (e) {
      console.error("Image generation error:", e);
      alert("Error generating image. Please try again.");
    } finally {
      try {
        if (container && container.parentNode) container.parentNode.removeChild(container);
      } catch (e) {
        // ignore cleanup errors
      }
      setGeneratingImage(false);
    }
  };

  // Download image
  const downloadImage = () => {
    if (!imagePreview) return;
    const link = document.createElement("a");
    link.href = imagePreview;
    link.download = `${(studentName || "marks").replace(/\s+/g, "_")}_report.jpg`;
    link.click();
  };

  // Download QR code directly from the local canvas
  const downloadQRCode = () => {
    try {
      const canvas = document.getElementById("share-qr-canvas");
      if (!canvas) {
        alert("QR code is not ready yet. Please try again.");
        return;
      }

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${(studentName || "student").replace(/\s+/g, "_")}_qr_code.png`;
      link.click();
    } catch (e) {
      console.error("QR download error:", e);
      alert("Error downloading QR code. Please try again.");
    }
  };

  // Copy image to clipboard
  const copyImageToClipboard = async () => {
    if (!imagePreview) return;
    try {
      const blob = await fetch(imagePreview).then(r => r.blob());
      await navigator.clipboard.write([new ClipboardItem({"image/jpeg": blob})]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      alert("Your browser doesn't support copying images. Download instead.");
    }
  };

  // Build proper share link using shared helpers
  const shareData = createShareData();
  const sharePayloadLink = buildShareLink(window.location.href, shareData);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sharePayloadLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    } catch (e) {
      // Fallback for browsers where writeText may be blocked
      try {
        const ta = document.createElement("textarea");
        ta.value = sharePayloadLink;
        ta.setAttribute("readonly", "true");
        ta.style.position = "fixed";
        ta.style.top = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e2) {
        alert("Copy failed. Please copy the link manually.");
      }
    }
  };

  // QR code has a data length limit.
  // Use only the compact payload part (the ?share=... segment) to avoid RangeError: Data too long.
  // App.jsx reads the `share` query param and restores the marks.
  let qrValue = sharePayloadLink;
  try {
    const u = new URL(sharePayloadLink);
    const sp = u.searchParams.get("share");
    if (sp) qrValue = `${u.origin}${u.pathname}?share=${sp}`;
  } catch (_) {
    // ignore and fall back to full link
  }

  // When sharing JPG: the QR still points to shareLink (payload), while the app itself
  // renders the report image locally (image mode) from the decoded payload.
  // So scanning the QR loads the same subjects via ?share=... and user can download JPG.
  const onOpenShareFromQR = () => {};


  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
        backdropFilter: "blur(4px)",
        padding: "16px",
        overflow: "auto",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: "clamp(20px, 5vw, 32px)",
          maxWidth: 520,
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          position: "relative",
          width: "100%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
            padding: 8,
            minWidth: 44,
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "linear-gradient(135deg, #0f3a7d, #1e5a9e)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              <Share2 size={16} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: "clamp(16px, 4vw, 18px)",
                  fontWeight: 700,
                  color: "#1f2937",
                }}
              >
                Share Result
              </h3>
              <p
                style={{
                  margin: "4px 0 0",
                  fontSize: 12,
                  color: "#6b7280",
                }}
              >
                {studentName || "Your"} • {regNo || "REG-NO"}
              </p>
            </div>
          </div>
        </div>

        {/* Mode tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "2px solid #e5e7eb" }}>
          <button
            onClick={() => { setShareMode("link"); }}
            style={{
              padding: "12px 16px",
              background: shareMode === "link" ? "#0f3a7d" : "transparent",
              color: shareMode === "link" ? "#fff" : "#6b7280",
              border: "none",
              borderRadius: 0,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              borderBottom: shareMode === "link" ? "2px solid #0f3a7d" : "none",
              marginBottom: "-2px",
              minHeight: 44,
            }}
          >
            <Share2 size={14} /> Share Link
          </button>
          <button
            onClick={() => { setShareMode("image"); if (!imagePreview) generateImage(); }}
            style={{
              padding: "12px 16px",
              background: shareMode === "image" ? "#0f3a7d" : "transparent",
              color: shareMode === "image" ? "#fff" : "#6b7280",
              border: "none",
              borderRadius: 0,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 6,
              borderBottom: shareMode === "image" ? "2px solid #0f3a7d" : "none",
              marginBottom: "-2px",
              minHeight: 44,
            }}
          >
            <ImageIcon size={14} /> Share Image
          </button>
        </div>

        {/* Link Mode */}
        {shareMode === "link" && (
          <>
            {/* QR Code - Larger and always visible */}
            <div
              style={{
                background: "linear-gradient(135deg, #f3f4f6, #ffffff)",
                padding: "clamp(16px, 4vw, 24px)",
                borderRadius: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 20,
                border: "2px solid rgba(15,58,125,0.1)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                📱 QR Code - Scan to View Results
              </div>
              <div style={{ background: "#fff", padding: 8, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <QRCodeCanvas
                  id="share-qr-canvas"
                  value={qrValue}

                  size={250}
                  level="M"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#111827"
                  style={{ display: "block" }}
                />
              </div>
              <button
                onClick={downloadQRCode}
                style={{
                  marginTop: 12,
                  padding: "8px 14px",
                  borderRadius: 6,
                  background: "#0f3a7d",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  minHeight: 40,
                }}
              >
                <Download size={12} /> Download QR Code
              </button>
            </div>

            {/* Share Link */}
            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#6b7280",
                  letterSpacing: "0.5px",
                  marginBottom: 8,
                  textTransform: "uppercase",
                }}
              >
                🔗 Share Link
              </label>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <input
                  readOnly
                  value={sharePayloadLink}
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    padding: "clamp(8px, 2vw, 10px) 12px",
                    borderRadius: 8,
                    border: "1px solid rgba(0,0,0,0.1)",
                    fontSize: 11,
                    fontFamily: "'JetBrains Mono', monospace",
                    background: "#f9fafb",
                    color: "#1f2937",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                />
                <button
                  onClick={copyToClipboard}
                  style={{
                    padding: "clamp(8px, 2vw, 10px) 14px",
                    borderRadius: 8,
                    background: copied ? "#10b981" : "#6366f1",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "background 0.2s",
                    minHeight: 44,
                    minWidth: 44,
                  }}
                >
                  <Copy size={14} />
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div
              style={{
                background: "rgba(99,102,241,0.05)",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 8,
                padding: 12,
                fontSize: 12,
                color: "#4f46e5",
                lineHeight: 1.6,
              }}
            >
              <strong>💡 How to share:</strong>
              <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                <li><strong>QR Code:</strong> Anyone can scan with their phone camera</li>
                <li><strong>Share Link:</strong> Copy and share via email, WhatsApp, or chat</li>
                <li><strong>Access:</strong> Results load instantly - 100% secure & private</li>
              </ul>
            </div>
          </>
        )}

        {/* Image Mode */}
        {shareMode === "image" && (
          <>
            {generatingImage ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <Loader2 size={32} style={{ animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
                <p style={{ color: "#666", fontSize: 14, fontWeight: 600 }}>Generating report image...</p>
              </div>
            ) : imagePreview ? (
              <>
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#6b7280",
                      letterSpacing: "0.5px",
                      marginBottom: 12,
                      textTransform: "uppercase",
                    }}
                  >
                    Report Preview
                  </label>
                  <div
                    style={{
                      background: "#f3f4f6",
                      padding: 12,
                      borderRadius: 8,
                      overflow: "auto",
                      maxHeight: "300px",
                    }}
                  >
                    <img src={imagePreview} alt="Report" style={{ width: "100%", height: "auto" }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button
                    onClick={downloadImage}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      padding: "12px 16px",
                      borderRadius: 8,
                      background: "#10b981",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      minHeight: 44,
                    }}
                  >
                    <Download size={14} /> Download
                  </button>
                  <button
                    onClick={copyImageToClipboard}
                    style={{
                      flex: 1,
                      minWidth: "150px",
                      padding: "12px 16px",
                      borderRadius: 8,
                      background: copied ? "#0f3a7d" : "#6366f1",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      minHeight: 44,
                    }}
                  >
                    <Copy size={14} /> {copied ? "Copied!" : "Copy to Clipboard"}
                  </button>
                </div>

                <div
                  style={{
                    background: "rgba(34,197,94,0.05)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 12,
                    color: "#059669",
                    lineHeight: 1.6,
                    marginTop: 12,
                  }}
                >
                  <strong>✓ Perfect for sharing:</strong>
                  <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                    <li>Download and email the report</li>
                    <li>Share on WhatsApp, Telegram, or Social Media</li>
                    <li>Full report as a high-quality image</li>
                  </ul>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <button
                  onClick={generateImage}
                  style={{
                    padding: "12px 24px",
                    borderRadius: 8,
                    background: "#0f3a7d",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    minHeight: 44,
                  }}
                >
                  <ImageIcon size={14} style={{ display: "inline", marginRight: 6 }} />
                  Generate Image
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
