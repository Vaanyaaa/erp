const path = require("path");
const { createWorker } = require("tesseract.js");

/**
 * Tesseract normally downloads its language model from a CDN on first run.
 * We ship eng.traineddata in backend/tessdata and point langPath at it, so
 * OCR works offline and on machines behind a restrictive network.
 */
const LANG_PATH = path.join(__dirname, "..", "..", "tessdata");

let workerPromise = null;

async function getWorker() {
  if (!workerPromise) {
    workerPromise = createWorker("eng", 1, {
      langPath: LANG_PATH,
      gzip: false,
      cachePath: LANG_PATH,
      logger: () => {},
    });
  }
  return workerPromise;
}

/** Runs OCR on a file path and returns text plus a confidence score. */
async function extractText(filePath) {
  const worker = await getWorker();
  const { data } = await worker.recognize(filePath);

  // tesseract.js v7 only returns block/line objects when they are explicitly
  // requested, so we split the plain text instead — same result, less payload.
  const lines = (data.text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return {
    text: (data.text || "").trim(),
    confidence: Number((data.confidence || 0).toFixed(2)),
    lines,
  };
}

/**
 * Best-effort structuring of a marksheet-style scan: any line holding a
 * trailing number is read as "subject → marks". Anything it can't parse is
 * returned as-is so nothing is silently dropped.
 */
function structureMarksheet(lines) {
  const rows = [];
  const unparsed = [];

  for (const line of lines) {
    const match = line.match(/^(.*?)[\s.:|-]+(\d{1,3})(?:\s*\/\s*(\d{1,3}))?$/);
    if (match && match[1].trim().length > 1) {
      rows.push({
        label: match[1].trim(),
        value: Number(match[2]),
        outOf: match[3] ? Number(match[3]) : null,
      });
    } else {
      unparsed.push(line);
    }
  }

  return { rows, unparsed };
}

async function shutdown() {
  if (workerPromise) {
    const worker = await workerPromise;
    await worker.terminate();
    workerPromise = null;
  }
}

module.exports = { extractText, structureMarksheet, shutdown };
