const jwt = require("jsonwebtoken");

/**
 * Verifies the JWT sent in the Authorization header and attaches the
 * decoded payload (id, role) to req.user. Every protected route needs this
 * as the first middleware.
 */
function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided." });
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

/**
 * Restricts a route to specific roles. Use AFTER authenticate.
 * Example: router.post("/notices", authenticate, authorize("tp_admin"), ...)
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action.",
      });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
