const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { Material, User, ActivityLog } = require("../models");
const { authenticate, requireRole } = require("../middleware/auth");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "..", "uploads", "materials");
fs.mkdirSync(uploadDir, { recursive: true });

const ALLOWED = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) =>
      cb(null, `${Date.now()}-${file.originalname.replace(/[^\w.\-]/g, "_")}`),
  }),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ALLOWED.has(file.mimetype);
    cb(ok ? null : new Error("Upload a PDF, Word or PowerPoint file."), ok);
  },
});

function serialize(material) {
  return {
    id: material.id,
    kind: material.kind,
    title: material.title,
    description: material.description,
    subject: material.subject,
    dueDate: material.dueDate,
    originalName: material.originalName,
    mimeType: material.mimeType,
    sizeBytes: material.sizeBytes,
    createdAt: material.createdAt,
    uploadedBy: material.uploadedBy
      ? { id: material.uploadedBy.id, fullName: material.uploadedBy.fullName }
      : undefined,
  };
}

/**
 * GET /api/materials?kind=assignment
 * Everyone signed in can read the list — that is the point: a professor
 * uploads once and students see it immediately.
 */
router.get("/", authenticate, async (req, res) => {
  const where = {};
  if (req.query.kind) where.kind = req.query.kind;
  if (req.query.subject) where.subject = req.query.subject;

  const materials = await Material.findAll({
    where,
    include: [{ model: User, as: "uploadedBy", attributes: ["id", "fullName"] }],
    order: [["createdAt", "DESC"]],
  });

  res.json({ materials: materials.map(serialize) });
});

/**
 * POST /api/materials  (multipart, field name: "file")
 * Professors upload assignments and notes; the TP Cell can attach placement
 * prep material the same way.
 */
router.post("/", authenticate, requireRole("professor", "tp_admin"), (req, res) => {
  upload.single("file")(req, res, async (uploadErr) => {
    if (uploadErr) return res.status(400).json({ message: uploadErr.message });
    if (!req.file) return res.status(400).json({ message: "Choose a file to upload." });

    const { kind = "assignment", title, description, subject, dueDate } = req.body;

    if (!title || !title.trim()) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ message: "Give it a title so students know what it is." });
    }

    const material = await Material.create({
      kind: kind === "note" ? "note" : "assignment",
      title: title.trim(),
      description,
      subject,
      dueDate: dueDate || null,
      originalName: req.file.originalname,
      storedPath: req.file.filename,
      mimeType: req.file.mimetype,
      sizeBytes: req.file.size,
      uploadedById: req.user.id,
    });

    await ActivityLog.create({
      userId: req.user.id,
      action: kind === "note" ? "Uploaded notes" : "Uploaded an assignment",
      detail: material.title,
    });

    const full = await Material.findByPk(material.id, {
      include: [{ model: User, as: "uploadedBy", attributes: ["id", "fullName"] }],
    });

    res.status(201).json({ material: serialize(full) });
  });
});

/** GET /api/materials/:id/file — streams the upload back for viewing. */
router.get("/:id/file", authenticate, async (req, res) => {
  const material = await Material.findByPk(req.params.id);
  if (!material) return res.status(404).json({ message: "That file is no longer available." });

  const filePath = path.join(uploadDir, material.storedPath);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: "That file is no longer available." });
  }

  res.setHeader("Content-Type", material.mimeType || "application/octet-stream");
  // inline so PDFs open in the browser tab rather than forcing a download
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${encodeURIComponent(material.originalName)}"`
  );
  fs.createReadStream(filePath).pipe(res);
});

/** DELETE /api/materials/:id — uploader only. */
router.delete("/:id", authenticate, requireRole("professor", "tp_admin"), async (req, res) => {
  const material = await Material.findByPk(req.params.id);
  if (!material) return res.status(404).json({ message: "That file no longer exists." });
  if (material.uploadedById !== req.user.id) {
    return res.status(403).json({ message: "You can only remove files you uploaded." });
  }

  fs.unlink(path.join(uploadDir, material.storedPath), () => {});
  await material.destroy();
  res.json({ deleted: true });
});

module.exports = router;
