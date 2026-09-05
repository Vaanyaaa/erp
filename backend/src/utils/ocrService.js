const Tesseract = require("tesseract.js");
const path = require("path");

// Language data is bundled locally in /tessdata instead of being fetched
// from a CDN at runtime — faster startup, works offline, and avoids
// depending on a third-party CDN staying up in production.
const TESSDATA_PATH = path.join(__dirname, "..", "..", "tessdata");

/**
 * OCR provider abstraction. Right now this uses Tesseract.js — completely
 * free, runs locally, no API key needed, works fine for typed/scanned text.
 *
 * If you later want higher accuracy on messy handwriting, get a Google
 * Cloud Vision API key and swap the body of extractText() to call it
 * instead — nothing else in the codebase needs to change, since every
 * route just calls extractText(filePath).
 */
async function extractText(filePath) {
  const worker = await Tesseract.createWorker("eng", 1, {
    langPath: TESSDATA_PATH,
    cachePath: TESSDATA_PATH,
    gzip: false, // the file we bundled is uncompressed
    logger: () => {}, // silence per-progress logs; flip on for debugging
  });

  try {
    const result = await worker.recognize(filePath);
    return {
      text: result.data.text.trim(),
      confidence: result.data.confidence, // 0-100
    };
  } finally {
    await worker.terminate();
  }
}

module.exports = { extractText };
