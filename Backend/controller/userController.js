import bcrypt from "bcrypt";
import User from "../model/userSchema.js";
import jwt from "jsonwebtoken";
import {
  sendVerificationCode,
   sendWelcomeBackEmail,
  sendResendOtpEmail
} from "../services/emailService.js";
import { generateToken } from "../utils/generateToken.js";

/* REGISTER */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ❌ Already registered check
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔐 Create short-lived token (10 min)
    const otpToken = jwt.sign(
      {
        name,
        email,
        password: hashedPassword,
        otp,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    await sendVerificationCode(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to email",
      otpToken, // frontend stores this
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* VERIFY OTP */
export const verifyOtpAndRegister = async (req, res) => {
  try {
    const { otp, otpToken } = req.body;

    if (!otp || !otpToken) {
      return res.status(400).json({ message: "OTP and token required" });
    }

    // 🔐 Verify token
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Final safety check
    const exists = await User.findOne({ email: decoded.email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Create user AFTER OTP success
    await User.create({
      name: decoded.name,
      email: decoded.email,
      password: decoded.password,
      verified: true,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "OTP expired" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { otpToken } = req.body;

    if (!otpToken) {
      return res.status(400).json({ message: "OTP token required" });
    }

    // Verify old token
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    // Safety: check user not already created
    const exists = await User.findOne({ email: decoded.email });
    if (exists) {
      return res.status(400).json({ message: "User already registered" });
    }

    // Generate new OTP
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create NEW token
    const newOtpToken = jwt.sign(
      {
        name: decoded.name,
        email: decoded.email,
        password: decoded.password, // already hashed
        otp: newOtp,
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    await sendResendOtpEmail(decoded.email, newOtp);

    res.json({
      success: true,
      message: "OTP resent successfully",
      otpToken: newOtpToken,
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "OTP session expired. Register again." });
    }
    res.status(500).json({ message: err.message });
  }
};



export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // include password explicitly
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.verified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    await  sendWelcomeBackEmail(user.email, user.name);

    // ✅ STORE JWT IN COOKIE (7 DAYS)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.json({
    success: true,
    message: "Logged out successfully",
  });
};
