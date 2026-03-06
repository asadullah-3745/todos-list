const jwt = require("jsonwebtoken");

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || "1d" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
  );
};

const generateVerificationToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_VERIFICATION_SECRET || process.env.JWT_ACCESS_SECRET,
    { expiresIn: "24h" }
  );
};

const verifyVerificationToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_VERIFICATION_SECRET || process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  verifyVerificationToken
};
