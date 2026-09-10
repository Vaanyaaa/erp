const jwt = require("jsonwebtoken");
const { User, StudentProfile, ProfessorProfile, ParentProfile } = require("../models");

const JWT_SECRET = process.env.JWT_SECRET || "acadex_dev_secret_change_me";
const TOKEN_TTL = process.env.JWT_EXPIRES_IN || "7d";

function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: TOKEN_TTL }
  );
}

/** Reads the bearer token, loads the user, attaches req.user. */
async function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(payload.id, {
      include: [
        { model: StudentProfile, as: "studentProfile" },
        { model: ProfessorProfile, as: "professorProfile" },
        { model: ParentProfile, as: "parentProfile" },
      ],
    });
    if (!user) return res.status(401).json({ message: "Session no longer valid." });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired. Sign in again." });
  }
}

/**
 * Role gate applied as middleware rather than per-route checks, so a new
 * endpoint can't quietly ship without a permission decision.
 */
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Authentication required." });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Your role does not have permission for this action.",
      });
    }
    next();
  };
}

/** Serialises a user (plus role profile) into the shape the frontend expects. */
function serializeUser(user) {
  const base = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    mobileNumber: user.mobileNumber,
    role: user.role,
    lastLoginAt: user.lastLoginAt,
  };

  if (user.studentProfile) {
    Object.assign(base, {
      enrollmentNo: user.studentProfile.enrollmentNo,
      department: user.studentProfile.department,
      program: user.studentProfile.program,
      semester: user.studentProfile.semester,
    });
  }
  if (user.professorProfile) {
    Object.assign(base, {
      employeeId: user.professorProfile.employeeId,
      department: user.professorProfile.department,
      designation: user.professorProfile.designation,
    });
  }
  if (user.parentProfile) {
    Object.assign(base, {
      childEnrollmentNo: user.parentProfile.childEnrollmentNo,
      relationship: user.parentProfile.relationship,
    });
  }
  return base;
}

module.exports = { authenticate, requireRole, signToken, serializeUser, JWT_SECRET };
