import { useState } from "react";
import { Copy, X, Share2 } from "lucide-react";

export default function ShareLinkModal({ isOpen, onClose, studentName, regNo, subjects }) {
  const [copied, setCopied] = useState(false);

  // Create a compact JSON representation of the data
  const createShareData = () => {
    const data = {
      name: studentName || "Student",
      regNo: regNo || "",
      subjects: subjects.map(s => ({
        name: s.name,
        m1: s.m1,
        m2: s.m2,
      })),
    };
    return JSON.stringify(data);
  };

  // Encode data to URL-safe Base64
  const encodeData = (data) => {
    try {
      return btoa(unescape(encodeURIComponent(data))).replace(/\+/g, "-").replace(/\//g, "_");
    } catch (e) {
      return "";
    }
  };

  const shareData = createShareData();
  const encodedData = encodeData(shareData);
  const shareLink = `${window.location.origin}${window.location.pathname}?share=${encodedData}`;
  const qrLink = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareLink)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 32,
          maxWidth: 420,
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          position: "relative",
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
                  fontSize: 18,
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

        {/* QR Code */}
        <div
          style={{
            background: "#f3f4f6",
            padding: 24,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <img
            src={qrLink}
            alt="QR Code"
            style={{
              width: 200,
              height: 200,
              border: "8px solid #fff",
              borderRadius: 8,
            }}
          />
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
            Share Link
          </label>
          <div
            style={{
              display: "flex",
              gap: 8,
            }}
          >
            <input
              readOnly
              value={shareLink}
              style={{
                flex: 1,
                padding: "10px 12px",
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
                padding: "10px 14px",
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
              }}
            >
              <Copy size={14} />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Info */}
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
          <strong>💡 How it works:</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 20 }}>
            <li>Scan the QR code or share the link with anyone</li>
            <li>Results are embedded in the link (100% client-side)</li>
            <li>Works across devices without registration</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
