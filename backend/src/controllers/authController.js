const authService = require("../services/authService");

/**
 * Register
 */
const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      message: "Registration successful. Please check your email for the verification code.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Verify Email with Code
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const result = await authService.verifyUserEmail(email, code);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Resend Verification Code
 */
const resendCode = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authService.resendVerificationCode(email);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

/**
 * Login
 */
const login = async (req, res, next) => {
  try {
    const result = await authService.loginUser(
      req.body.email,
      req.body.password
    );

    res.status(200).json({
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  verifyEmail,
  resendCode,
  login,
};