const { Notice, User } = require("../models");

// Only tp_admin and professor roles can create notices — enforced at the
// route level via authorize() as well, this is a second safety check.
exports.createNotice = async (req, res) => {
  try {
    const { title, body, category } = req.body;
    if (!title || !body) {
      return res.status(400).json({ message: "Title and body are required." });
    }

    const notice = await Notice.create({
      title,
      body,
      category: category === "tp_cell" ? "tp_cell" : "general",
      postedById: req.user.id,
    });

    // NOTE: this is the hook point for the push-notification job —
    // see src/utils/notifications.js. Kept synchronous-optional so a slow
    // notification provider never blocks the notice from being saved.
    res.status(201).json({ notice });
  } catch (err) {
    res.status(500).json({ message: "Failed to create notice.", error: err.message });
  }
};

exports.listNotices = async (req, res) => {
  try {
    const { category, limit } = req.query;
    const where = category ? { category } : {};

    const notices = await Notice.findAll({
      where,
      include: [{ model: User, as: "postedBy", attributes: ["fullName", "role"] }],
      order: [["createdAt", "DESC"]],
      limit: limit ? parseInt(limit, 10) : 50,
    });

    res.json({ notices });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notices.", error: err.message });
  }
};

exports.getNotice = async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id, {
      include: [{ model: User, as: "postedBy", attributes: ["fullName", "role"] }],
    });
    if (!notice) return res.status(404).json({ message: "Notice not found." });
    res.json({ notice });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notice.", error: err.message });
  }
};

exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByPk(req.params.id);
    if (!notice) return res.status(404).json({ message: "Notice not found." });

    // Only the original poster or a tp_admin can delete.
    if (notice.postedById !== req.user.id && req.user.role !== "tp_admin") {
      return res.status(403).json({ message: "Not authorized to delete this notice." });
    }

    await notice.destroy();
    res.json({ message: "Notice deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete notice.", error: err.message });
  }
};
