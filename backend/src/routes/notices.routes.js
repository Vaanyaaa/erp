const express = require("express");
const { Notice, User, ActivityLog } = require("../models");
const { authenticate, requireRole } = require("../middleware/auth");
const { draftNotice } = require("../utils/noticeDrafter");

const router = express.Router();

/** GET /api/notices?category=tp_cell&limit=20 */
router.get("/", authenticate, async (req, res) => {
  const where = {};
  if (req.query.category) where.category = req.query.category;

  const notices = await Notice.findAll({
    where,
    include: [{ model: User, as: "postedBy", attributes: ["id", "fullName", "role"] }],
    order: [
      ["priority", "DESC"],
      ["createdAt", "DESC"],
    ],
    limit: Number(req.query.limit) || 50,
  });

  res.json({ notices });
});

/** GET /api/notices/:id */
router.get("/:id", authenticate, async (req, res) => {
  const notice = await Notice.findByPk(req.params.id, {
    include: [{ model: User, as: "postedBy", attributes: ["id", "fullName", "role"] }],
  });
  if (!notice) return res.status(404).json({ message: "That notice no longer exists." });
  res.json({ notice });
});

/**
 * POST /api/notices/draft
 * Turns one plain sentence into a structured notice the poster can edit
 * before publishing. Nothing is saved here.
 */
router.post(
  "/draft",
  authenticate,
  requireRole("professor", "tp_admin"),
  async (req, res) => {
    const { prompt, category } = req.body;
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ message: "Describe the notice in a sentence." });
    }
    const draft = await draftNotice(prompt.trim(), category, req.user.fullName);
    res.json({ draft });
  }
);

/** POST /api/notices — professors post general notices, TP admins post placement ones. */
router.post(
  "/",
  authenticate,
  requireRole("professor", "tp_admin"),
  async (req, res) => {
    const { title, body, category = "general", priority = "normal", eventDate } = req.body;

    if (!title || !body) {
      return res.status(400).json({ message: "A notice needs a title and a body." });
    }
    if (category === "tp_cell" && req.user.role !== "tp_admin") {
      return res
        .status(403)
        .json({ message: "Only the TP Cell can publish placement notices." });
    }

    const notice = await Notice.create({
      title,
      body,
      category,
      priority,
      // Optional — a dated notice also lands on the month calendar.
      eventDate: eventDate ? String(eventDate).slice(0, 10) : null,
      postedById: req.user.id,
    });

    await ActivityLog.create({
      userId: req.user.id,
      action: "Published notice",
      detail: title,
    });

    const withAuthor = await Notice.findByPk(notice.id, {
      include: [{ model: User, as: "postedBy", attributes: ["id", "fullName", "role"] }],
    });

    res.status(201).json({ notice: withAuthor });
  }
);

/** DELETE /api/notices/:id — author or TP admin only. */
router.delete(
  "/:id",
  authenticate,
  requireRole("professor", "tp_admin"),
  async (req, res) => {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) return res.status(404).json({ message: "That notice no longer exists." });

    if (notice.postedById !== req.user.id && req.user.role !== "tp_admin") {
      return res.status(403).json({ message: "You can only remove notices you posted." });
    }

    await notice.destroy();
    res.json({ deleted: true });
  }
);

module.exports = router;
