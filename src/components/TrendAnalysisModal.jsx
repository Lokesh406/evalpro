import { X, Download, Share2 } from "lucide-react";
import { calcModule, getGrade } from "../utils/marks";

export default function TrendAnalysisModal({ isOpen, onClose, subjects, studentName, regNo }) {
  if (!isOpen || !subjects.length) return null;

  const downloadAsImage = async () => {
    try {
      const { default: html2canvas } = await import("html2canvas");
      const element = document.querySelector("[data-trend-modal]");
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: "#fff",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `trend_analysis_${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  const shareLink = () => {
    const text = `Trend Analysis: Overall ${overallTrend > 0 ? "UP" : "DOWN"} by ${Math.abs(overallTrend).toFixed(1)} marks. ${improved} improved, ${declined} declined.`;
    if (navigator.share) {
      navigator.share({ title: "Trend Analysis", text });
    } else {
      navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    }
  };

  const trends = subjects.map(s => {
    const m1 = calcModule(s.m1);
    const m2 = calcModule(s.m2);
    const change = m1 !== null && m2 !== null ? m2 - m1 : null;
    const trend = change !== null ? (change > 0 ? "📈 UP" : change < 0 ? "📉 DOWN" : "➡️ SAME") : "—";
    const gradeM1 = m1 !== null ? getGrade(m1) : null;
    const gradeM2 = m2 !== null ? getGrade(m2) : null;

    return {
      name: s.name,
      m1: m1,
      m2: m2,
      change: change,
      trend: trend,
      gradeM1: gradeM1,
      gradeM2: gradeM2,
    };
  });

  const avgM1 = trends.reduce((sum, t) => sum + (t.m1 || 0), 0) / trends.length;
  const avgM2 = trends.reduce((sum, t) => sum + (t.m2 || 0), 0) / trends.length;
  const overallTrend = avgM2 - avgM1;

  const improved = trends.filter(t => t.change > 0).length;
  const declined = trends.filter(t => t.change < 0).length;

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
        overflow: "auto",
      }}
      onClick={onClose}
    >
      <div
        data-trend-modal
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 32,
          maxWidth: 700,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          position: "relative",
          margin: 20,
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
          }}
        >
          <X size={20} />
        </button>

        {/* Header with action buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, gap: 12 }}>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: "#0f3a7d",
                marginBottom: 4,
              }}
            >
              Module 1 vs Module 2 Analysis
            </h3>
            {studentName && (
              <p
                style={{
                  margin: "4px 0",
                  fontSize: 13,
                  color: "#4b5563",
                  fontWeight: 600,
                }}
              >
                {studentName} {regNo && `(${regNo})`}
              </p>
            )}
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              Track your performance improvement across both modules
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={downloadAsImage}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid rgba(99,102,241,0.3)",
                background: "rgba(99,102,241,0.1)",
                color: "#6366f1",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              <Download size={14} /> Download
            </button>
            <button
              onClick={shareLink}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid rgba(59,130,246,0.3)",
                background: "rgba(59,130,246,0.1)",
                color: "#3b82f6",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontFamily: "inherit",
                transition: "all 0.2s",
              }}
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        {/* Overall Trend */}
        <div
          style={{
            background: overallTrend > 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
            border: `1px solid ${overallTrend > 0 ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 28,
              }}
            >
              {overallTrend > 0 ? "📈" : overallTrend < 0 ? "📉" : "➡️"}
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: overallTrend > 0 ? "#059669" : "#dc2626",
                }}
              >
                {overallTrend > 0
                  ? `Overall Performance UP by ${overallTrend.toFixed(1)} marks`
                  : overallTrend < 0
                  ? `Overall Performance DOWN by ${Math.abs(overallTrend).toFixed(1)} marks`
                  : "Overall Performance STABLE"}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#6b7280",
                  marginTop: 4,
                }}
              >
                {improved} subjects improved • {declined} subjects declined
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              fontSize: 13,
            }}
          >
            <div>
              <span style={{ fontWeight: 700, color: "#0f3a7d" }}>Module 1 Avg:</span> {avgM1.toFixed(1)}/60
            </div>
            <div>
              <span style={{ fontWeight: 700, color: "#0f3a7d" }}>Module 2 Avg:</span> {avgM2.toFixed(1)}/60
            </div>
          </div>
        </div>

        {/* Subject Trends Table */}
        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr
                style={{
                  background: "linear-gradient(135deg, #0f3a7d, #1e5a9e)",
                  color: "#fff",
                }}
              >
                <th
                  style={{
                    padding: "11px 12px",
                    textAlign: "left",
                    fontWeight: 700,
                    borderRadius: "8px 0 0 0",
                  }}
                >
                  Subject
                </th>
                <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700 }}>
                  Module 1
                </th>
                <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700 }}>
                  Module 2
                </th>
                <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700 }}>
                  Change
                </th>
                <th
                  style={{
                    padding: "11px 12px",
                    textAlign: "center",
                    fontWeight: 700,
                    borderRadius: "0 8px 0 0",
                  }}
                >
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {trends.map((t, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    background: i % 2 === 0 ? "#f9fafb" : "#fff",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: 600,
                      color: "#1f2937",
                    }}
                  >
                    {t.name}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      color: t.gradeM1?.color || "#6b7280",
                      fontWeight: 600,
                    }}
                  >
                    {t.m1 !== null ? `${t.m1.toFixed(1)} (${t.gradeM1.grade})` : "—"}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      color: t.gradeM2?.color || "#6b7280",
                      fontWeight: 600,
                    }}
                  >
                    {t.m2 !== null ? `${t.m2.toFixed(1)} (${t.gradeM2.grade})` : "—"}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      color: t.change > 0 ? "#059669" : t.change < 0 ? "#dc2626" : "#6b7280",
                      fontWeight: 700,
                    }}
                  >
                    {t.change !== null ? (t.change > 0 ? "+" : "") + t.change.toFixed(1) : "—"}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontSize: 18,
                    }}
                  >
                    {t.trend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tips */}
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
          <strong>💡 Tips:</strong> Focus on subjects showing downward trends. Increased module 2 performance indicates
          learning improvement over time.
        </div>
      </div>
    </div>
  );
}
