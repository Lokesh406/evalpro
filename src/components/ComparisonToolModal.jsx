import { X, BarChart3 } from "lucide-react";
import { calcModule, calcFinal, getGrade } from "../utils/marks";

export default function ComparisonToolModal({ isOpen, onClose, subjects, allStudents = [] }) {
  if (!isOpen || subjects.length < 2) return null;

  // Prepare all students data for comparison
  const studentsData = allStudents.map((student) => {
    const finals = student.subjects.map(s =>
      calcFinal(calcModule(s.m1), calcModule(s.m2))
    );
    const avg = finals.reduce((a, v) => a + v, 0) / finals.length;
    return {
      name: student.name,
      regNo: student.regNo,
      subjects: student.subjects,
      finals: finals,
      avg: avg,
      grade: getGrade(avg).grade,
    };
  });

  // Get all unique subject names from all students
  const allSubjectNames = [...new Set(studentsData.flatMap(s => s.subjects.map(sub => sub.name)))];

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
        style={{
          background: "#fff",
          borderRadius: 14,
          padding: 32,
          maxWidth: 900,
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

        {/* Header */}
        <div style={{ marginBottom: 28, display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BarChart3 size={24} color="#fff" />
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                color: "#0f3a7d",
              }}
            >
              Student Comparison
            </h3>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              Compare performance across {studentsData.length} students
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          {studentsData.map((student, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                minWidth: 160,
                background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.1))",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>
                {student.name}
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: getGrade(student.avg).color }}>
                {student.avg.toFixed(1)}/60
              </div>
              <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                {student.grade} Grade
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div style={{ overflowX: "auto", marginBottom: 20 }}>
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
                {studentsData.map((student, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "11px 12px",
                      textAlign: "center",
                      fontWeight: 700,
                    }}
                  >
                    {student.name.split(" ")[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allSubjectNames.map((subName, rowIdx) => (
                <tr
                  key={rowIdx}
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    background: rowIdx % 2 === 0 ? "#f9fafb" : "#fff",
                  }}
                >
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: 600,
                      color: "#1f2937",
                    }}
                  >
                    {subName}
                  </td>
                  {studentsData.map((student, colIdx) => {
                    const subject = student.subjects.find(s => s.name === subName);
                    const mark = subject ? student.finals[student.subjects.indexOf(subject)] : null;
                    const grade = mark !== null ? getGrade(mark) : null;

                    return (
                      <td
                        key={colIdx}
                        style={{
                          padding: "12px",
                          textAlign: "center",
                          color: grade?.color || "#6b7280",
                          fontWeight: 600,
                        }}
                      >
                        {mark !== null ? `${mark.toFixed(1)} (${grade.grade})` : "—"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance Gap Analysis */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#0f3a7d",
              marginBottom: 12,
            }}
          >
            📊 Performance Gap Analysis
          </div>
          {studentsData.length > 1 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {studentsData.map((student, i) => {
                const otherAvgs = studentsData.filter((_, idx) => idx !== i).map(s => s.avg);
                const avgOthers = otherAvgs.reduce((a, b) => a + b, 0) / otherAvgs.length;
                const gap = student.avg - avgOthers;
                const ahead = gap > 0;

                return (
                  <div
                    key={i}
                    style={{
                      background: ahead ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                      border: `1px solid ${ahead ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                      borderRadius: 8,
                      padding: 12,
                    }}
                  >
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 4 }}>
                      {student.name}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: ahead ? "#059669" : "#dc2626",
                      }}
                    >
                      {ahead ? "+" : ""}{gap.toFixed(1)} marks vs others
                    </div>
                    <div style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
                      {ahead ? "Performing above average" : "Performing below average"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info */}
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
          <strong>💡 Tip:</strong> Use this tool to identify learning gaps and performance patterns across multiple students.
        </div>
      </div>
    </div>
  );
}
