import jwt from "jsonwebtoken";

/**
 * Generate JWT Token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * @desc    Login with email & password (Auto role detection)
 * @route   POST /api/auth/login
 * @access  Public
 */

