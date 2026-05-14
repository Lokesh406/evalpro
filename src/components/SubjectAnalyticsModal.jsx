import { X, TrendingDown, Download, Share2 } from "lucide-react";
import { calcModule, calcFinal, getGrade } from "../utils/marks";

export default function SubjectAnalyticsModal({ isOpen, onClose, subjects, studentName, regNo }) {
  if (!isOpen || !subjects.length) return null;

  const downloadAsImage = async () => {
    try {
      const { default: html2canvas } = await import("html2canvas");
      const element = document.querySelector("[data-analytics-modal]");
      if (!element) return;

      const canvas = await html2canvas(element, {
        backgroundColor: "#fff",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `analytics_${new Date().toISOString().split('T')[0]}.png`;
      link.click();
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  const shareLink = () => {
    const text = `Subject Analytics Report: Class Average ${avgMark.toFixed(
      1
    )}/60, Pass Rate ${passCount}/${analytics.length}`;

    // Also provide a shareable payload (grade/status/marks) via clipboard when native share isn't available.
    const payload = {
      studentName: studentName || null,
      regNo: regNo || null,
      avgMark,
      passCount,
      total: analytics.length,
      subjects: analytics.map(s => ({
        name: s.name,
        m1: s.m1,
        m2: s.m2,
        final: s.final,
        grade: s.grade,
        status: s.status,
      })),
    };

    const shareText = `${text}\n\n${JSON.stringify(payload)}`;


    if (navigator.share) {
      navigator.share({ title: "Subject Analytics", text: shareText });
    } else {
      navigator.clipboard?.writeText(shareText);
      alert("Copied to clipboard!");
    }
  };

  // Step 1: Calculate base analytics (no avgMark-dependent logic yet)
  const baseAnalytics = subjects
    .map(s => {
      const m1 = calcModule(s.m1);
      const m2 = calcModule(s.m2);
      const final = calcFinal(m1, m2);
      const grade = final !== null ? getGrade(final) : null;

      return {
        name: s.name,
        m1,
        m2,
        final,
        grade,
        status: final !== null ? (final >= 35 ? "pass" : "fail") : "incomplete",
      };
    })
    .sort((a, b) => (a.final || 0) - (b.final || 0));

  // Step 2: Compute avgMark using the base analytics
  const validMarks = baseAnalytics.filter(a => a.final !== null);
  const avgMark =
    validMarks.length > 0
      ? validMarks.reduce((sum, a) => sum + a.final, 0) / validMarks.length
      : 0;

  // Step 3: Apply avgMark-based rule.
  // If avgMark < 22 => all subjects should be marked as Fail.
  // Else (avgMark >= 22) => per-subject pass/fail based on final >= 35.
  const allFail = avgMark < 22;

  const FAIL_GRADE = { grade: "F", label: "Fail", color: "#ef4444", min: 0 };

  const analytics = baseAnalytics.map(subject => {
    if (subject.final === null) return subject;

    if (allFail) {
      return { ...subject, grade: FAIL_GRADE, status: "fail" };
    }

    // avgMark >= 22 => rely on subject.final derived status/grade.
    return subject;
  });

  // Overall statistics (kept consistent with the same rule)
  const overallGrade = (() => {
    if (allFail) return FAIL_GRADE;
    return getGrade(avgMark);
  })();


  const lowestSubject = analytics[0];
  const highestSubject = [...analytics].sort((a, b) => (b.final || 0) - (a.final || 0))[0];
  const failedCount = analytics.filter(a => a.status === "fail").length;
  const passCount = analytics.filter(a => a.status === "pass").length;

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
        data-analytics-modal
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
          <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: "linear-gradient(135deg, #ea580c, #f97316)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingDown size={24} color="#fff" />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#0f3a7d",
                  marginBottom: 2,
                }}
              >
                Subject Analytics
              </h3>
              {studentName && (
                <p
                  style={{
                    margin: "2px 0",
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
                  margin: "4px 0 0 0",
                  fontSize: 13,
                  color: "#6b7280",
                }}
              >
                Identify strengths and areas needing improvement
              </p>
            </div>
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
                whiteSpace: "nowrap",
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
                whiteSpace: "nowrap",
              }}
            >
              <Share2 size={14} /> Share
            </button>
          </div>
        </div>

        {/* Key Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 24 }}>
          <div
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 10,
              padding: 12,
            }}
          >
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Class Average</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: overallGrade.color || "#6366f1" }}>
              {avgMark.toFixed(1)}/60
            </div>
          </div>
          <div
            style={{
              background: "rgba(220,38,38,0.08)",
              border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: 10,
              padding: 12,
            }}
          >
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Lowest Scoring</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#dc2626" }}>
              {lowestSubject.final !== null ? lowestSubject.final.toFixed(1) : "—"}
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{lowestSubject.name}</div>
          </div>
          <div
            style={{
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: 10,
              padding: 12,
            }}
          >
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Highest Scoring</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#10b981" }}>
              {highestSubject.final !== null ? highestSubject.final.toFixed(1) : "—"}
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{highestSubject.name}</div>
          </div>
          <div
            style={{
              background: passCount > failedCount ? "rgba(16,185,129,0.08)" : "rgba(220,38,38,0.08)",
              border: `1px solid ${passCount > failedCount ? "rgba(16,185,129,0.2)" : "rgba(220,38,38,0.2)"}`,
              borderRadius: 10,
              padding: 12,
            }}
          >
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>Pass Rate</div>
            <div
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: passCount > failedCount ? "#10b981" : "#dc2626",
              }}
            >
              {passCount} / {analytics.length}
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
              {failedCount > 0 ? `${failedCount} at risk` : "All passing"}
            </div>
          </div>
        </div>

        {/* Subject Breakdown Table */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#0f3a7d",
              marginBottom: 12,
            }}
          >
            📋 Subject Breakdown (Sorted by Performance)
          </div>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
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
                    M1
                  </th>
                  <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700 }}>
                    M2
                  </th>
                  <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700 }}>
                    Final
                  </th>
                  <th style={{ padding: "11px 12px", textAlign: "center", fontWeight: 700 }}>
                    Grade
                  </th>
                  <th
                    style={{
                      padding: "11px 12px",
                      textAlign: "center",
                      fontWeight: 700,
                      borderRadius: "0 8px 0 0",
                    }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((subject, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: "1px solid rgba(0,0,0,0.08)",
                      background: i % 2 === 0 ? "#f9fafb" : "#fff",
                    }}
                  >
                    <td style={{ padding: "12px", fontWeight: 600, color: "#1f2937" }}>
                      {subject.name}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#6b7280",
                      }}
                    >
                      {subject.m1 !== null ? subject.m1.toFixed(1) : "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: "#6b7280",
                      }}
                    >
                      {subject.m2 !== null ? subject.m2.toFixed(1) : "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: subject.grade?.color || "#6b7280",
                        fontWeight: 700,
                      }}
                    >
                      {subject.final !== null ? subject.final.toFixed(1) : "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        color: subject.grade?.color || "#6b7280",
                        fontWeight: 800,
                      }}
                    >
                      {subject.grade?.grade || "—"}
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        textAlign: "center",
                        fontWeight: 600,
                        color: subject.status === "pass" ? "#10b981" : "#dc2626",
                      }}
                    >
                      {subject.status === "pass" ? "✓ Pass" : "✗ Fail"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendations */}
        {failedCount > 0 && (
          <div
            style={{
              background: "rgba(220,38,38,0.1)",
              border: "1px solid rgba(220,38,38,0.2)",
              borderRadius: 8,
              padding: 12,
              fontSize: 12,
              color: "#991b1b",
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            <strong>⚠️ Attention Required:</strong> {failedCount} subject{failedCount !== 1 ? "s" : ""} is/are below the passing threshold (35/60). Consider focusing on {lowestSubject.name}.
          </div>
        )}

        {/* Tips */}
        <div
          style={{
            background: "rgba(59,130,246,0.05)",
            border: "1px solid rgba(59,130,246,0.2)",
            borderRadius: 8,
            padding: 12,
            fontSize: 12,
            color: "#3b82f6",
            lineHeight: 1.6,
          }}
        >
          <strong>💡 Tips:</strong> Prio2ritize improving lowest-scoring subjects. Focus additional study efforts on topics covered in failing subjects.
        <strong>Developed By</strong> UNPROFESSIONAL ENGINEERS
        </div>
      </div>
    </div>
  );
}
