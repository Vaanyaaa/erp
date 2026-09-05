const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  sequelize,
  User,
  StudentProfile,
  ProfessorProfile,
  ParentProfile,
} = require("../models");

const SALT_ROUNDS = 10;
const TOKEN_EXPIRY = "7d";

function generateToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
}

function publicUser(user, profile) {
  // Never send passwordHash back, and flatten profile fields the frontend
  // already expects (matches the SignupPayload shape used in the UI).
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    role: user.role,
    ...(profile ? profile.toJSON() : {}),
  };
}

exports.register = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      role,
      fullName,
      email,
      mobileNumber,
      password,
      // student
      enrollmentNo,
      studentDept,
      program,
      semester,
      // professor / tp_admin
      employeeId,
      profDept,
      designation,
      // parent
      childEnrollmentNo,
      relationship,
    } = req.body;

    if (!role || !fullName || !email || !mobileNumber || !password) {
      await t.rollback();
      return res.status(400).json({ message: "Missing required fields." });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      await t.rollback();
      return res.status(409).json({ message: "Email already registered." });
    }

    // Parents must link to a real, already-registered student.
    if (role === "parent") {
      const child = await StudentProfile.findOne({
        where: { enrollmentNo: childEnrollmentNo },
      });
      if (!child) {
        await t.rollback();
        return res.status(400).json({
          message:
            "No student found with that enrollment number. The student must register first.",
        });
      }
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create(
      { fullName, email, mobileNumber, passwordHash, role },
      { transaction: t }
    );

    let profile = null;
    if (role === "student") {
      if (!enrollmentNo || !studentDept || !program || !semester) {
        await t.rollback();
        return res.status(400).json({ message: "Missing student details." });
      }
      profile = await StudentProfile.create(
        {
          userId: user.id,
          enrollmentNo,
          department: studentDept,
          program,
          semester,
        },
        { transaction: t }
      );
    } else if (role === "professor" || role === "tp_admin") {
      if (!employeeId || !profDept || !designation) {
        await t.rollback();
        return res.status(400).json({ message: "Missing staff details." });
      }
      profile = await ProfessorProfile.create(
        { userId: user.id, employeeId, department: profDept, designation },
        { transaction: t }
      );
    } else if (role === "parent") {
      profile = await ParentProfile.create(
        { userId: user.id, childEnrollmentNo, relationship },
        { transaction: t }
      );
    }

    await t.commit();

    const token = generateToken(user);
    res.status(201).json({ token, user: publicUser(user, profile) });
  } catch (err) {
    await t.rollback();
    console.error("Register error:", err);
    res.status(500).json({ message: "Registration failed.", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ where: { email: identifier } });
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    let profile = null;
    if (user.role === "student") {
      profile = await StudentProfile.findByPk(user.id);
    } else if (user.role === "professor" || user.role === "tp_admin") {
      profile = await ProfessorProfile.findByPk(user.id);
    } else if (user.role === "parent") {
      profile = await ParentProfile.findByPk(user.id);
    }

    const token = generateToken(user);
    res.json({ token, user: publicUser(user, profile) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    let profile = null;
    if (user.role === "student") profile = await StudentProfile.findByPk(user.id);
    else if (user.role === "professor" || user.role === "tp_admin")
      profile = await ProfessorProfile.findByPk(user.id);
    else if (user.role === "parent") profile = await ParentProfile.findByPk(user.id);

    res.json({ user: publicUser(user, profile) });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile.", error: err.message });
  }
};
