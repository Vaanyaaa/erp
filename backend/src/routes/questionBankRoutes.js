const express = require("express");
const router = express.Router();
const qb = require("../controllers/questionBankController");
const { authenticate, authorize } = require("../middleware/auth");

// Companies
router.post("/companies", authenticate, authorize("tp_admin"), qb.createCompany);
router.get("/companies", authenticate, qb.listCompanies);

// Questions
router.post("/questions", authenticate, authorize("tp_admin"), qb.createQuestion);
router.get("/questions", authenticate, qb.listQuestions);
router.delete("/questions/:id", authenticate, authorize("tp_admin"), qb.deleteQuestion);

// AI-assisted test assembly (pulls from the vetted question bank)
router.post("/assemble-test", authenticate, qb.assembleTest);

module.exports = router;
