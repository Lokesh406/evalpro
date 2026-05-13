import { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { extractPDFText, ocrImage } from "../utils/fileHelpers";
import { parseText } from "../utils/parser";

export default function UploadPanel({ dark, onDetected }) {
  const ref = useRef();
  const [status, setStatus]     = useState("idle");
  const [progress, setProgress] = useState(0);
  const [msg, setMsg]           = useState("");
  const [rawText, setRawText]   = useState("");

  async function handleFile(file) {
    if (!file) return;
    setStatus("loading"); setProgress(0); setRawText("");
    try {
      let text = "";
      if (file.type === "application/pdf") {
        setMsg("Extracting text from PDF…");
        text = await extractPDFText(file, p => setProgress(p));
      } else if (file.type.startsWith("image/")) {
        setMsg("Running OCR on image… (first load may take ~5s)");
        text = await ocrImage(file, p => setProgress(p));
      } else {
        setStatus("error"); setMsg("Unsupported file — use PNG, JPG or PDF."); return;
      }
      setRawText(text);
      const result = parseText(text);
      if (result) {
        onDetected(result);
        setStatus("done");
        setMsg(`Detected ${result.subjects.length} subject(s) — review below`);
      } else {
        setStatus("partial");
        setMsg("Marks format not recognized. Copy the extracted text to the Paste Text tab and try again.");
      }
    } catch (e) {
      setStatus("error"); setMsg(`Error: ${e.message}`);
    }
  }

  const borderColors = {
    idle:    "rgba(99,102,241,0.3)",
    loading: "rgba(99,102,241,0.5)",
    done:    "rgba(16,185,129,0.4)",
    partial: "rgba(245,158,11,0.4)",
    error:   "rgba(239,68,68,0.4)",
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <div
        onClick={() => status !== "loading" && ref.current?.click()}
        style={{
          border: `2px dashed ${borderColors[status] || borderColors.idle}`,
          borderRadius: 12, padding: "32px 20px", textAlign: "center",
          cursor: status === "loading" ? "default" : "pointer",
          background: "transparent", transition: "all 0.25s",
        }}
      >
        {status === "loading" && (
          <>
            <Loader2 size={26} color="#6366f1"
              style={{ margin: "0 auto 10px", animation: "spin 1s linear infinite", display: "block" }} />
            <p style={{ color: dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.6)", margin: "0 0 10px", fontWeight: 500, fontSize: 14 }}>{msg}</p>
            <div style={{ width: "70%", height: 5, borderRadius: 3, background: "rgba(99,102,241,0.15)", margin: "0 auto" }}>
              <div style={{ height: "100%", borderRadius: 3, background: "#6366f1", width: `${progress}%`, transition: "width 0.3s" }} />
            </div>
            <p style={{ color: "#6366f1", fontSize: 12, margin: "6px 0 0", fontWeight: 600 }}>{progress}%</p>
          </>
        )}
        {status === "done" && (
          <>
            <CheckCircle2 size={26} color="#10b981" style={{ margin: "0 auto 8px", display: "block" }} />
            <p style={{ color: "#10b981", fontWeight: 600, margin: 0, fontSize: 14 }}>{msg}</p>
            <p style={{ color: dark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)", fontSize: 12, margin: "4px 0 0" }}>Click to upload another file</p>
          </>
        )}
        {status === "partial" && (
          <>
            <AlertTriangle size={26} color="#f59e0b" style={{ margin: "0 auto 8px", display: "block" }} />
            <p style={{ color: "#f59e0b", fontWeight: 500, margin: 0, fontSize: 14 }}>{msg}</p>
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle size={26} color="#ef4444" style={{ margin: "0 auto 8px", display: "block" }} />
            <p style={{ color: "#ef4444", fontWeight: 500, margin: 0, fontSize: 14 }}>{msg}</p>
          </>
        )}
        {status === "idle" && (
          <>
            <Upload size={26} color="#6366f1" style={{ margin: "0 auto 10px", display: "block" }} />
            <p style={{ color: dark ? "rgba(255,255,255,0.65)" : "rgba(0,0,0,0.6)", margin: "0 0 4px", fontWeight: 500, fontSize: 14 }}>
              Click to upload marksheet screenshot or PDF
            </p>
            <p style={{ color: dark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", fontSize: 11, margin: 0 }}>
              PNG · JPG · PDF — processed entirely in your browser, no data sent anywhere
            </p>
          </>
        )}
      </div>

      <input
        ref={ref} type="file" accept="image/*,.pdf"
        style={{ display: "none" }}
        onChange={e => handleFile(e.target.files[0])}
      />

      {rawText && status === "partial" && (
        <div
          style={{
            marginTop: 10, padding: "10px 14px", borderRadius: 10,
            background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
            border: dark ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,0,0,0.07)",
          }}
        >
          <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 700, color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Extracted Text — copy to Paste Text tab:
          </p>
          <pre style={{ margin: 0, fontSize: 11, color: dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)", whiteSpace: "pre-wrap", maxHeight: 160, overflow: "auto" }}>
            {rawText.slice(0, 800)}
          </pre>
        </div>
      )}

      <div
        style={{
          marginTop: 8, padding: "7px 12px", borderRadius: 8,
          background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.14)",
          fontSize: 11, color: dark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
        }}
      >
        ℹ️ OCR runs locally via Tesseract.js. First load downloads ~2MB engine (cached after).
      </div>
    </div>
  );
}
