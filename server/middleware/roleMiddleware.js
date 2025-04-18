const jwt = require("jsonwebtoken");
const User = require("../models/User");
const JWT_SECRET = process.env.JWT_SECRET;

// Helper to extract and verify token
const getUserFromToken = async (authHeader) => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// Middleware for Alumni only
const isAlumni = async (req, res, next) => {
  try {
    console.log(req.headers.authorization);

    const user = await getUserFromToken(req.headers.authorization);
    console.log(user);

    const plainUser = user.toObject ? user.toObject() : user;

    if (plainUser.userType !== "alumni") {
      return res.status(403).json({ message: "Access denied: Alumni only" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

// Middleware for Students only
const isStudent = async (req, res, next) => {
  try {
    const user = await getUserFromToken(req.headers.authorization);

    const plainUser = user.toObject ? user.toObject() : user;

    if (plainUser.userType !== "student") {
      return res.status(403).json({ message: "Access denied: Alumni only" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

module.exports = { isAlumni, isStudent };
