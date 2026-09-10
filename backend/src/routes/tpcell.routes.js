const express = require("express");
const { Op } = require("sequelize");
const { Company, Question } = require("../models");
const { authenticate, requireRole } = require("../middleware/auth");

const router = express.Router();

/* ── Companies ────────────────────────────── */

/** GET /api/tpcell/companies — every role can browse. */
router.get("/companies", authenticate, async (req, res) => {
  const companies = await Company.findAll({ order: [["name", "ASC"]] });

  const counts = await Question.findAll({
    attributes: [
      "companyId",
      [Question.sequelize.fn("COUNT", Question.sequelize.col("id")), "questionCount"],
    ],
    group: ["companyId"],
    raw: true,
  });
  const countMap = Object.fromEntries(
    counts.map((c) => [c.companyId, Number(c.questionCount)])
  );

  res.json({
    companies: companies.map((c) => ({
      ...c.toJSON(),
      questionCount: countMap[c.id] || 0,
    })),
  });
});

router.post(
  "/companies",
  authenticate,
  requireRole("tp_admin"),
  async (req, res) => {
    const { name, sector, ctcRange, description } = req.body;
    if (!name) return res.status(400).json({ message: "The company needs a name." });

    const existing = await Company.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: "That company is already listed." });
    }

    const company = await Company.create({ name, sector, ctcRange, description });
    res.status(201).json({ company });
  }
);

/* ── Question bank ────────────────────────── */

/**
 * GET /api/tpcell/questions?companyId=1&year=2025&difficulty=easy&type=dsa&topic=arrays
 * Difficulty-wise sorting is the default: easy → medium → hard.
 */
router.get("/questions", authenticate, async (req, res) => {
  const { companyId, year, difficulty, type, topic, search } = req.query;
  const where = {};

  if (companyId) where.companyId = companyId;
  if (year) where.year = year;
  if (difficulty) where.difficulty = difficulty;
  if (type) where.type = type;
  if (topic) where.topic = topic;
  if (search) where.title = { [Op.like]: `%${search}%` };

  const questions = await Question.findAll({
    where,
    include: [{ model: Company, as: "company", attributes: ["id", "name"] }],
    order: [
      ["year", "DESC"],
      ["difficulty", "ASC"],
      ["title", "ASC"],
    ],
  });

  // Sequelize orders ENUMs by declaration order on Postgres but alphabetically
  // on SQLite, so we normalise difficulty ordering in JS to keep both identical.
  const rank = { easy: 0, medium: 1, hard: 2 };
  questions.sort((a, b) => (b.year - a.year) || (rank[a.difficulty] - rank[b.difficulty]));

  res.json({ questions });
});

router.post(
  "/questions",
  authenticate,
  requireRole("tp_admin", "professor"),
  async (req, res) => {
    const { companyId, year, type, difficulty, topic, title, content, answer, sourceUrl } =
      req.body;

    if (!companyId || !title || !year) {
      return res
        .status(400)
        .json({ message: "A question needs a company, a year and a title." });
    }

    const company = await Company.findByPk(companyId);
    if (!company) return res.status(404).json({ message: "That company is not listed." });

    const question = await Question.create({
      companyId,
      year,
      type,
      difficulty,
      topic,
      title,
      content,
      answer,
      sourceUrl,
    });

    res.status(201).json({ question });
  }
);

router.delete(
  "/questions/:id",
  authenticate,
  requireRole("tp_admin"),
  async (req, res) => {
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ message: "That question no longer exists." });
    await question.destroy();
    res.json({ deleted: true });
  }
);

/* ── Test assembly ────────────────────────── */

function pick(pool, n) {
  const copy = [...pool];
  const out = [];
  while (out.length < n && copy.length) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

/**
 * POST /api/tpcell/tests/generate
 * Assembles a paper from the vetted bank by company + difficulty mix, rather
 * than generating new questions — no hallucinated problems, and it works
 * without any model API key.
 */
router.post("/tests/generate", authenticate, async (req, res) => {
  const {
    companyId,
    totalQuestions = 10,
    mix = { easy: 40, medium: 40, hard: 20 },
    type,
    topic,
  } = req.body;

  const where = {};
  if (companyId) where.companyId = companyId;
  if (type) where.type = type;
  if (topic) where.topic = topic;

  const pool = await Question.findAll({
    where,
    include: [{ model: Company, as: "company", attributes: ["id", "name"] }],
  });

  if (!pool.length) {
    return res.status(404).json({
      message: "No questions match those filters yet. Add some to the bank first.",
    });
  }

  const total = Math.min(Number(totalQuestions) || 10, pool.length);
  const byDifficulty = {
    easy: pool.filter((q) => q.difficulty === "easy"),
    medium: pool.filter((q) => q.difficulty === "medium"),
    hard: pool.filter((q) => q.difficulty === "hard"),
  };

  let selected = [];
  for (const level of ["easy", "medium", "hard"]) {
    const target = Math.round((total * (mix[level] ?? 0)) / 100);
    selected = selected.concat(pick(byDifficulty[level], target));
  }

  // Top up from whatever is left if the mix couldn't be met exactly.
  if (selected.length < total) {
    const chosen = new Set(selected.map((q) => q.id));
    selected = selected.concat(
      pick(pool.filter((q) => !chosen.has(q.id)), total - selected.length)
    );
  }

  const rank = { easy: 0, medium: 1, hard: 2 };
  selected.sort((a, b) => rank[a.difficulty] - rank[b.difficulty]);

  const company = companyId ? await Company.findByPk(companyId) : null;

  res.json({
    test: {
      title: company ? `${company.name} — Practice Set` : "Mixed Practice Set",
      generatedAt: new Date().toISOString(),
      requested: total,
      delivered: selected.length,
      breakdown: {
        easy: selected.filter((q) => q.difficulty === "easy").length,
        medium: selected.filter((q) => q.difficulty === "medium").length,
        hard: selected.filter((q) => q.difficulty === "hard").length,
      },
      questions: selected,
    },
  });
});

module.exports = router;
