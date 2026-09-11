const express = require("express");
const bcrypt = require("bcryptjs");
const {
  User,
  StudentProfile,
  ProfessorProfile,
  ParentProfile,
  ActivityLog,
} = require("../models");
const {
  authenticate,
  signToken,
  serializeUser,
} = require("../middleware/auth");

const router = express.Router();

/**
 * POST /api/auth/register
 * Accepts the exact payload the existing SignupForm already builds
 * (including its studentDept / profDept field names).
 */
router.post("/register", async (req, res) => {
  try {
    const {
      role = "student",
      fullName,
      email,
      mobileNumber,
      password,
      enrollmentNo,
      studentDept,
      department,
      program,
      semester,
      employeeId,
      profDept,
      designation,
      childEnrollmentNo,
      relationship,
    } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full name, email and password are required." });
    }
    if (!["student", "professor", "parent", "tp_admin"].includes(role)) {
      return res.status(400).json({ message: "Unrecognised role." });
    }

    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      mobileNumber,
      passwordHash,
      role,
      lastLoginAt: new Date(),
    });

    if (role === "student") {
      await StudentProfile.create({
        userId: user.id,
        enrollmentNo: enrollmentNo || `TMP${user.id}`,
        department: studentDept || department,
        program,
        semester,
      });
    } else if (role === "professor" || role === "tp_admin") {
      await ProfessorProfile.create({
        userId: user.id,
        employeeId: employeeId || `EMP${user.id}`,
        department: profDept || department,
        designation,
      });
    } else if (role === "parent") {
      await ParentProfile.create({
        userId: user.id,
        childEnrollmentNo,
        relationship,
      });
    }

    await ActivityLog.create({
      userId: user.id,
      action: "Account created",
      detail: `Registered as ${role}`,
    });

    const full = await User.findByPk(user.id, {
      include: [
        { model: StudentProfile, as: "studentProfile" },
        { model: ProfessorProfile, as: "professorProfile" },
        { model: ParentProfile, as: "parentProfile" },
      ],
    });

    res.status(201).json({ token: signToken(user), user: serializeUser(full) });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ message: "Could not create the account." });
  }
});

/**
 * POST /api/auth/login
 * `identifier` is email or enrollment number — the login form allows either.
 */
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Enter your email or institutional ID and password." });
    }

    const include = [
      { model: StudentProfile, as: "studentProfile" },
      { model: ProfessorProfile, as: "professorProfile" },
      { model: ParentProfile, as: "parentProfile" },
    ];

    let user = await User.findOne({
      where: { email: String(identifier).toLowerCase() },
      include,
    });

    if (!user) {
      const profile = await StudentProfile.findOne({
        where: { enrollmentNo: identifier },
      });
      if (profile) user = await User.findByPk(profile.userId, { include });
    }

    if (!user) {
      return res.status(401).json({ message: "No account matches those details." });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    user.lastLoginAt = new Date();
    await user.save();
    await ActivityLog.create({
      userId: user.id,
      action: "Signed in",
      detail: "Portal login",
    });

    res.json({ token: signToken(user), user: serializeUser(user) });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Could not sign you in." });
  }
});

/** GET /api/auth/me — used by the frontend to restore a session on reload. */
router.get("/me", authenticate, (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

module.exports = router;
