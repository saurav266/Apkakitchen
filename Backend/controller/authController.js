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
export const getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.data) {
      return res.status(401).json({ success: false });
    }

    const user = req.user.data;

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: req.user.role
      }
    });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

