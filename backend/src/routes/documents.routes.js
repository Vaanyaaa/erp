const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { Document, ActivityLog } = require("../models");
const { authenticate } = require("../middleware/auth");
const { extractText, structureMarksheet } = require("../utils/ocr");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) =>
      cb(null, `${Date.now()}-${file.originalname.replace(/[^\w.\-]/g, "_")}`),
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(png|jpe?g|bmp|webp|tiff)$/.test(file.mimetype);
    cb(ok ? null : new Error("Upload a PNG, JPG, BMP, WEBP or TIFF image."), ok);
  },
});

/**
 * POST /api/documents/ocr  (multipart, field name: "file")
 * Reads a scanned sheet and returns the extracted text plus a best-effort
 * subject → marks table the teacher can correct before saving.
 */
router.post("/ocr", authenticate, (req, res) => {
  upload.single("file")(req, res, async (uploadErr) => {
    if (uploadErr) {
      return res.status(400).json({ message: uploadErr.message });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Choose an image to read." });
    }

    try {
      const { text, confidence, lines } = await extractText(req.file.path);
      const structured = structureMarksheet(lines);

      const doc = await Document.create({
        originalName: req.file.originalname,
        storedPath: req.file.filename,
        extractedText: text,
        confidence,
        kind: req.body.kind || "scan",
        uploadedById: req.user.id,
      });

      await ActivityLog.create({
        userId: req.user.id,
        action: "Read a document",
        detail: req.file.originalname,
      });

      res.json({
        document: {
          id: doc.id,
          originalName: doc.originalName,
          confidence,
          createdAt: doc.createdAt,
        },
        text,
        lines,
        structured,
      });
    } catch (err) {
      console.error("ocr error:", err);
      res.status(500).json({ message: "Could not read that image." });
    }
  });
});

/** GET /api/documents — the current user's read history. */
router.get("/", authenticate, async (req, res) => {
  const documents = await Document.findAll({
    where: { uploadedById: req.user.id },
    attributes: ["id", "originalName", "confidence", "kind", "createdAt"],
    order: [["createdAt", "DESC"]],
    limit: 25,
  });
  res.json({ documents });
});

/** GET /api/documents/:id — full extracted text for one document. */
router.get("/:id", authenticate, async (req, res) => {
  const doc = await Document.findByPk(req.params.id);
  if (!doc || doc.uploadedById !== req.user.id) {
    return res.status(404).json({ message: "That document is not in your library." });
  }
  res.json({ document: doc });
});

module.exports = router;
