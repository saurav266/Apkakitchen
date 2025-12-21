import jwt from "jsonwebtoken";
import DeliveryBoy from "../model/deliveryBoySchema.js";
import crypto from "crypto";


/**
 * @desc    Add new delivery boy
 * @route   POST /api/admin/delivery-boy
 * @access  Admin
 */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { sendAddDeliveryBoyOtpEmail } from "../services/emailService.js";


/* ===============================
   ADD DELIVERY BOY (ADMIN ONLY)
================================ */
/**
 * @desc    Admin sends OTP to delivery boy email
 * @route   POST /api/admin/delivery-boy
 * @access  Admin
 */
export const addDeliveryBoy = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      aadhaarLast4,
      aadhaarNumber,
      vehicleNumber
    } = req.body;

    if (!name || !email || !password || !phone || !aadhaarLast4 || !vehicleNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    const exists = await DeliveryBoy.findOne({
      $or: [{ email }, { vehicleNumber }]
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Delivery boy already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 🔐 OTP TOKEN (10 MIN)
    const otpToken = jwt.sign(
      {
        name,
        email,
        password: hashedPassword,
        phone,
        aadhaarLast4,
        aadhaarNumber,
        vehicleNumber,
        otp
      },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    await sendAddDeliveryBoyOtpEmail({
      email,
      name,
      otp,
      lang: "en"
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to delivery boy email",
      otpToken
    });

  } catch (error) {
    console.error("Add Delivery Boy Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



export const verifyByOtpDeliveryBoy = async (req, res) => {
  try {
    const { otp, otpToken } = req.body;

    if (!otp || !otpToken) {
      return res.status(400).json({
        success: false,
        message: "OTP and token required"
      });
    }

    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Safety check
    const exists = await DeliveryBoy.findOne({ email: decoded.email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Delivery boy already exists"
      });
    }

    const deliveryBoy = await DeliveryBoy.create({
      name: decoded.name,
      email: decoded.email,
      password: decoded.password,
      phone: decoded.phone,
      aadhaarLast4: decoded.aadhaarLast4,
      aadhaarNumber: decoded.aadhaarNumber,
      vehicleNumber: decoded.vehicleNumber,
      role: "delivery",
      status: "offline",
      isVerified: true,
      isActive: true
    });

    return res.status(201).json({
      success: true,
      message: "Delivery boy created successfully",
      deliveryBoy: {
        id: deliveryBoy._id,
        name: deliveryBoy.name,
        email: deliveryBoy.email,
        phone: deliveryBoy.phone
      }
    });

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    console.error("Verify Delivery Boy OTP Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
 

/**
 * @desc    Login delivery boy
 * @route   POST /api/delivery/login
 * @access  Public
 */
export const loginDeliveryBoy = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // ================= FIND DELIVERY BOY =================
    const deliveryBoy = await DeliveryBoy
      .findOne({ email })
      .select("+password");

    if (!deliveryBoy) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!deliveryBoy.isVerified || !deliveryBoy.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account not verified or inactive"
      });
    }

    // ================= PASSWORD CHECK =================
    const isMatch = await deliveryBoy.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // ================= JWT TOKEN =================
    const token = jwt.sign(
      {
        id: deliveryBoy._id,
        role: deliveryBoy.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ================= COOKIE =================
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    deliveryBoy.lastLogin = new Date();
    await deliveryBoy.save();

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: deliveryBoy._id,
        name: deliveryBoy.name,
        email: deliveryBoy.email,
        status: deliveryBoy.status
      }
    });

  } catch (error) {
    console.error("Delivery Boy Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
};


/**
 * @desc    Logout delivery boy
 * @route   POST /api/delivery/logout
 * @access  Delivery
 */
export const logoutDeliveryBoy = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return res.json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    console.error("Delivery Boy Logout Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during logout"
    });
  }
};


export const getDeliveryBoy= async (req, res) => {
  try {
    const deliveryBoyId = req.user.id;
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId).select("-password");

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Deliveryboy not found"
      });
    } 
    return res.status(200).json({
      success: true,
      deliveryBoy
    });
  } catch (error) {
    console.error("Get Delivery Boy Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching delivery boy details"
    });
  } 
};

export const allDeliveryBoys= async (req, res) => {
  try {
    const deliveryBoys = await DeliveryBoy.find().select("-password");

    return res.status(200).json({
      success: true,
      deliveryBoys
    });
  } catch (error) {
    console.error("Get All Delivery Boys Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching delivery boys"
    });
  }
};

export const getDeliveryBoyById = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryBoy = await DeliveryBoy.findById(id)
      .select("-password -aadhaarNumber"); // ❌ hide sensitive data

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery boy not found"
      });
    }

    return res.status(200).json({
      success: true,
      deliveryBoy
    });

  } catch (error) {
    console.error("Get Delivery Boy Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
