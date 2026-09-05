const path = require("path");
const { extractText } = require("../utils/ocrService");

exports.uploadAndExtract = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext === ".pdf") {
      // Tesseract.js reads images directly, not PDFs. For scanned PDFs,
      // convert each page to an image first (e.g. with pdf-poppler or
      // pdf2pic) before calling extractText. Left as a follow-up so this
      // endpoint stays fast for the common case (photographed documents).
      return res.status(415).json({
        message:
          "PDF OCR needs a page-to-image conversion step first — see the comment in ocrController.js. Upload a PNG/JPG scan for now.",
      });
    }

    const { text, confidence } = await extractText(req.file.path);

    res.json({
      fileName: req.file.filename,
      filePath: `/uploads/${req.file.filename}`,
      extractedText: text,
      confidence,
    });
  } catch (err) {
    res.status(500).json({ message: "OCR extraction failed.", error: err.message });
  }
};
