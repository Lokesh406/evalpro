// ── Dynamically load an external script (cached) ──────────────────
export function loadScript(src) {
  return new Promise((res, rej) => {
    if (document.querySelector(`script[src="${src}"]`)) return res();
    const s = document.createElement("script");
    s.src = src;
    s.onload = res;
    s.onerror = rej;
    document.head.appendChild(s);
  });
}

// ── OCR an image file using Tesseract.js ──────────────────────────
export async function ocrImage(file, onProgress) {
  await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js");
  const { createWorker } = window.Tesseract;
  const worker = await createWorker("eng", 1, {
    logger: m => {
      if (m.status === "recognizing text")
        onProgress(Math.round(m.progress * 100));
    },
  });
  const url = URL.createObjectURL(file);
  const { data: { text } } = await worker.recognize(url);
  await worker.terminate();
  URL.revokeObjectURL(url);
  return text;
}

// ── Extract structured text from a PDF using pdf.js ───────────────
// Enhanced: better table detection, improved column alignment, preserves
// marks structure for VFSTR portal PDFs
export async function extractPDFText(file, onProgress) {
  await loadScript("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js");
  const pdfjsLib = window.pdfjsLib;
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const buf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
  const allLines = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const vp = page.getViewport({ scale: 1.5 });
    const content = await page.getTextContent();

    // Collect all items with positions
    const items = content.items
      .filter(item => item.str?.trim())
      .map(item => ({
        x: item.transform[4] * 1.5,
        y: vp.height - item.transform[5] * 1.5,
        str: item.str.trim(),
        width: item.width * 1.5,
      }));

    if (items.length === 0) continue;

    // Group items by y-position with tighter clustering (3pt bands)
    const rowMap = {};
    for (const item of items) {
      const y = Math.round(item.y / 3) * 3;
      if (!rowMap[y]) rowMap[y] = [];
      rowMap[y].push(item);
    }

    // Process rows
    const sortedYs = Object.keys(rowMap).map(Number).sort((a, b) => a - b);
    for (const y of sortedYs) {
      const rowItems = rowMap[y].sort((a, b) => a.x - b.x);
      
      // Detect if this row has multiple columns (table row)
      if (rowItems.length > 1) {
        // Calculate gaps between items
        const gaps = [];
        for (let k = 0; k < rowItems.length - 1; k++) {
          const gap = rowItems[k + 1].x - (rowItems[k].x + rowItems[k].width);
          gaps.push(gap);
        }
        
        // If there are significant gaps (>8px), treat as table with columns
        const hasSignificantGaps = gaps.some(g => g > 8);
        if (hasSignificantGaps) {
          allLines.push(rowItems.map(it => it.str).join("\t"));
          continue;
        }
      }
      
      // Single column or text row
      allLines.push(rowItems.map(it => it.str).join(" "));
    }
    
    onProgress(Math.round((i / pdf.numPages) * 100));
  }

  const raw = allLines.join("\n");

  // Post-process: merge fragmented subject codes and marks
  const lines = raw.split("\n");
  const merged = [];
  
  for (let j = 0; j < lines.length; j++) {
    const cur = lines[j].trim();
    const next = j + 1 < lines.length ? lines[j + 1].trim() : "";
    
    // Case 1: Merge split subject codes "MA" + "3251" → "MA3251"
    if (
      /^[A-Z]{1,3}\d{0,2}$/.test(cur) &&
      /^\d{3,5}$/.test(next) &&
      !next.includes("\t")
    ) {
      merged.push(cur + next);
      j++;
      continue;
    }
    
    // Case 2: Merge single marks split across lines
    // e.g., "7" on line with "Module 1 PRET" on next line
    if (/^\d{1,2}$/.test(cur) && /^(pret|t[1-5]|module)/i.test(next)) {
      merged.push(cur);
      continue;
    }
    
    merged.push(cur);
  }

  return merged.join("\n");
}
