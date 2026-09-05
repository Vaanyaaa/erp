const { Op } = require("sequelize");
const { Company, Question } = require("../models");

// ---------- Companies ----------

exports.createCompany = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Company name is required." });

    const [company, created] = await Company.findOrCreate({
      where: { name },
      defaults: { description },
    });

    if (!created) {
      return res.status(409).json({ message: "Company already exists.", company });
    }
    res.status(201).json({ company });
  } catch (err) {
    res.status(500).json({ message: "Failed to create company.", error: err.message });
  }
};

exports.listCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({ order: [["name", "ASC"]] });
    res.json({ companies });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch companies.", error: err.message });
  }
};

// ---------- Questions ----------

exports.createQuestion = async (req, res) => {
  try {
    const {
      companyId,
      year,
      type,
      difficulty,
      topic,
      title,
      content,
      sourceFileUrl,
    } = req.body;

    if (!companyId || !year || !difficulty || !title || !content) {
      return res.status(400).json({
        message: "companyId, year, difficulty, title, and content are required.",
      });
    }

    const question = await Question.create({
      companyId,
      year,
      type: type || "dsa",
      difficulty,
      topic,
      title,
      content,
      sourceFileUrl,
    });

    res.status(201).json({ question });
  } catch (err) {
    res.status(500).json({ message: "Failed to create question.", error: err.message });
  }
};

// Flexible filtering — company, year, difficulty, topic, type can all be
// combined. This is what powers the "difficulty-wise sorting" UI feature.
exports.listQuestions = async (req, res) => {
  try {
    const { companyId, year, difficulty, topic, type } = req.query;
    const where = {};
    if (companyId) where.companyId = companyId;
    if (year) where.year = year;
    if (difficulty) where.difficulty = difficulty;
    if (type) where.type = type;
    if (topic) where.topic = { [Op.iLike]: `%${topic}%` };

    const questions = await Question.findAll({
      where,
      include: [{ model: Company, attributes: ["id", "name"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json({ questions, count: questions.length });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch questions.", error: err.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByPk(req.params.id);
    if (!question) return res.status(404).json({ message: "Question not found." });
    await question.destroy();
    res.json({ message: "Question deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete question.", error: err.message });
  }
};

// ---------- Test assembly ----------
// Deliberately NOT generating fresh questions with an LLM — assembling from
// the vetted question bank is far more reliable for a placement-prep test
// and avoids ever showing a student an incorrect AI-hallucinated question.
exports.assembleTest = async (req, res) => {
  try {
    const {
      companyId,
      difficulty,       // "easy" | "medium" | "hard" | "mixed"
      counts,           // optional: { easy: 5, medium: 5, hard: 2 }
      type,             // "dsa" | "aptitude" | undefined = any
      totalQuestions,   // used only when difficulty is a single level
    } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required." });
    }

    const baseWhere = { companyId };
    if (type) baseWhere.type = type;

    let selected = [];

    if (difficulty === "mixed" || counts) {
      // Default weighting if no explicit counts given: 40% easy, 40% medium, 20% hard
      const plan = counts || { easy: 4, medium: 4, hard: 2 };
      for (const [level, count] of Object.entries(plan)) {
        const pool = await Question.findAll({
          where: { ...baseWhere, difficulty: level },
          order: [["createdAt", "DESC"]],
        });
        selected.push(...shuffle(pool).slice(0, count));
      }
    } else {
      const where = { ...baseWhere };
      if (difficulty) where.difficulty = difficulty;
      const pool = await Question.findAll({ where });
      selected = shuffle(pool).slice(0, totalQuestions || 10);
    }

    if (selected.length === 0) {
      return res.status(404).json({
        message:
          "No questions found matching those filters. Add more questions to the bank for this company first.",
      });
    }

    res.json({
      test: {
        companyId,
        generatedAt: new Date().toISOString(),
        questionCount: selected.length,
        questions: selected,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to assemble test.", error: err.message });
  }
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
