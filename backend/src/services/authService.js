const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendEmail");
const db = require("../models");
const { generateAccessToken } = require("../utils/jwt");

const User = db.User;

  /**
   * Generate a random 6-digit verification code
   */
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  /**
   * Register User
   */
  const registerUser = async ({ name, email, password }) => {
    if (!name || !email || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = generateVerificationCode();
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      verificationCodeExpiresAt: codeExpiresAt,
    });

    // Send verification code email
    await sendEmail(
      email,
      "Email Verification Code",
      `
        <h3>Welcome to our platform, ${name}!</h3>
        <p>Your email verification code is:</p>
        <h2 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${verificationCode}</h2>
        <p>This code will expire in 15 minutes.</p>
        <p>Please enter this code on the verification page to complete your registration.</p>
      `
    );

    return user;
  };

  /**
   * Verify Email with Code
   */
  const verifyUserEmail = async (email, code) => {
    if (!email || !code) {
      const error = new Error("Email and verification code are required");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (user.isVerified) {
      const error = new Error("Email already verified");
      error.statusCode = 409;
      throw error;
    }

    if (user.verificationCode !== code) {
      const error = new Error("Invalid verification code");
      error.statusCode = 400;
      throw error;
    }

    // Check if code has expired
    if (new Date() > user.verificationCodeExpiresAt) {
      const error = new Error("Verification code has expired");
      error.statusCode = 410;
      throw error;
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpiresAt = null;
    await user.save();

    return {
      message: "Email verified successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  };

  /**
   * Resend Verification Code
   */
  const resendVerificationCode = async (email) => {
    if (!email) {
      const error = new Error("Email is required");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    if (user.isVerified) {
      const error = new Error("Email already verified");
      error.statusCode = 409;
      throw error;
    }

    // Generate new code
    const verificationCode = generateVerificationCode();
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.verificationCode = verificationCode;
    user.verificationCodeExpiresAt = codeExpiresAt;
    await user.save();

    // Send verification code email
    await sendEmail(
      email,
      "Email Verification Code (Resent)",
      `
        <h3>Your new verification code is:</h3>
        <h2 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">${verificationCode}</h2>
        <p>This code will expire in 15 minutes.</p>
      `
    );

    return {
      message: "Verification code resent successfully",
    };
  };

  /**
   * Login
   */
  const loginUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    if (!user.isVerified) {
      const error = new Error("Please verify your email first");
      error.statusCode = 403;
      throw error;
    }

    // Generate JWT token using the utility function
    const token = generateAccessToken(user);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  };

  module.exports = {
    registerUser,
    verifyUserEmail,
    resendVerificationCode,
    loginUser,
  };