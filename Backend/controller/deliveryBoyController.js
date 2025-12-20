import jwt from "jsonwebtoken";
import DeliveryBoy from "../model/deliveryBoySchema.js";

/**
 * @desc    Add new delivery boy
 * @route   POST /api/admin/delivery-boy
 * @access  Admin
 */
export const addDeliveryBoy = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      aadhaarLast4,
      aadhaarNumber,
      vehicleNumber,
      aadhaarImage
    } = req.body;

    // ================= VALIDATION =================
    if (
      !name ||
      !email ||
      !password ||
      !aadhaarLast4 ||
      !vehicleNumber ||
      !aadhaarImage
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    // ================= CHECK EXISTING =================
    const existing = await DeliveryBoy.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Delivery boy already exists with this email"
      });
    }

    // ================= CREATE DELIVERY BOY =================
    const deliveryBoy = await DeliveryBoy.create({
      name,
      email,
      password,              // hashed by schema
      aadhaarLast4,
      aadhaarNumber,         // store only if encrypted
      aadhaarImage,
      vehicleNumber,
      role: "delivery",
      status: "offline",
      isVerified: false
    });

    return res.status(201).json({
      success: true,
      message: "Delivery boy added successfully",
      deliveryBoy: {
        id: deliveryBoy._id,
        name: deliveryBoy.name,
        email: deliveryBoy.email,
        status: deliveryBoy.status,
        isVerified: deliveryBoy.isVerified
      }
    });

  } catch (error) {
    console.error("Add Delivery Boy Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while adding delivery boy"
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