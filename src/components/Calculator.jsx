import { useState } from "react";
import { X } from "lucide-react";

export default function Calculator({ isOpen, onClose }) {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const handleNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num));
      setWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? String(num) : display + num);
    }
  };

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
    } else if (display.indexOf(".") === -1) {
      setDisplay(display + ".");
    }
  };

  const handleOperator = (nextOp) => {
    const inputValue = parseFloat(display);

    if (prev === null) {
      setPrev(inputValue);
    } else if (op) {
      const result = calculate(prev, inputValue, op);
      setDisplay(String(result));
      setPrev(result);
    }

    setWaitingForOperand(true);
    setOp(nextOp);
  };

  const calculate = (prevValue, nextValue, operation) => {
    switch (operation) {
      case "+":
        return prevValue + nextValue;
      case "-":
        return prevValue - nextValue;
      case "×":
        return prevValue * nextValue;
      case "÷":
        return prevValue / nextValue;
      default:
        return nextValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);
    if (prev !== null && op) {
      const result = calculate(prev, inputValue, op);
      setDisplay(String(result));
      setPrev(null);
      setOp(null);
      setWaitingForOperand(true);
    }
  };

  const handleClear = () => {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setWaitingForOperand(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  if (!isOpen) return null;

  const btnStyle = (bgColor = "#f3f4f6") => ({
    padding: "12px",
    borderRadius: 8,
    border: "none",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    background: bgColor,
    color: bgColor === "#f3f4f6" ? "#1f2937" : "#fff",
    transition: "all 0.2s",
  });

  return (
    <div
      style={{
        position: "fixed",
        top: 80,
        right: 24,
        zIndex: 100,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        padding: 16,
        width: 280,
        fontFamily: "inherit",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
          paddingBottom: 8,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0f3a7d" }}>
          Calculator
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#6b7280",
            padding: 4,
            display: "flex",
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Operation Indicator - now integrated into display */}

      {/* Display */}
      <div
        style={{
          background: "#f3f4f6",
          padding: "12px 14px",
          borderRadius: 8,
          marginBottom: 12,
          textAlign: "right",
          fontSize: 24,
          fontWeight: 700,
          color: "#1f2937",
          wordWrap: "break-word",
          wordBreak: "break-all",
          minHeight: 40,
        }}
      >
        {op && waitingForOperand ? `${display} ${op}` : display}
      </div>

      {/* Buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 8,
        }}
      >
        <button
          onClick={handleClear}
          style={{ ...btnStyle("#ef4444"), gridColumn: "1 / 3" }}
        >
          CLEAR
        </button>
        <button onClick={handleBackspace} style={btnStyle("#f97316")}>
          ← DEL
        </button>
        <button
          onClick={() => handleOperator("÷")}
          style={btnStyle("#0f3a7d")}
        >
          ÷
        </button>

        <button onClick={() => handleNumber(7)} style={btnStyle()}>
          7
        </button>
        <button onClick={() => handleNumber(8)} style={btnStyle()}>
          8
        </button>
        <button onClick={() => handleNumber(9)} style={btnStyle()}>
          9
        </button>
        <button
          onClick={() => handleOperator("×")}
          style={btnStyle("#0f3a7d")}
        >
          ×
        </button>

        <button onClick={() => handleNumber(4)} style={btnStyle()}>
          4
        </button>
        <button onClick={() => handleNumber(5)} style={btnStyle()}>
          5
        </button>
        <button onClick={() => handleNumber(6)} style={btnStyle()}>
          6
        </button>
        <button
          onClick={() => handleOperator("-")}
          style={btnStyle("#0f3a7d")}
        >
          −
        </button>

        <button onClick={() => handleNumber(1)} style={btnStyle()}>
          1
        </button>
        <button onClick={() => handleNumber(2)} style={btnStyle()}>
          2
        </button>
        <button onClick={() => handleNumber(3)} style={btnStyle()}>
          3
        </button>
        <button
          onClick={() => handleOperator("+")}
          style={btnStyle("#0f3a7d")}
        >
          +
        </button>

        <button
          onClick={() => handleNumber(0)}
          style={{ ...btnStyle(), gridColumn: "1 / 3" }}
        >
          0
        </button>
        <button onClick={handleDecimal} style={btnStyle()}>
          .
        </button>
        <button
          onClick={handleEquals}
          style={btnStyle("#10b981")}
        >
          =
        </button>
      </div>

      {/* Footer */}
      <div
        style={{
          marginTop: 12,
          paddingTop: 8,
          borderTop: "1px solid rgba(0,0,0,0.08)",
          fontSize: 11,
          color: "#9ca3af",
          textAlign: "center",
        }}
      >
        Quick Calculator
      </div>
    </div>
  );
}
