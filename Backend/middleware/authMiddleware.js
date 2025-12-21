import jwt from "jsonwebtoken";
import Admin from "../model/adminSchema.js";
import User from "../model/userSchema.js";
import DeliveryBoy from "../model/deliveryBoySchema.js";
import { loginAdmin } from "../controller/adminController.js";
import { loginUser } from "../controller/userController.js";
import { loginDeliveryBoy } from "../controller/deliveryBoyController.js";

/**
 * @desc    Authenticate user (Admin / User / Delivery)
 * @access  Protected
 */
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    let user;

    if (decoded.role === "admin") {
      user = await Admin.findById(decoded.id);
    } 
    else if (decoded.role === "user") {
      user = await User.findById(decoded.id);
    } 
    else if (decoded.role === "delivery") {
      user = await DeliveryBoy.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = {
      id: user._id,
      role: decoded.role,
      data: user,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Session expired",
    });
  }
};





/**
 * @desc    Role-based access control
 * @usage   authorizeRoles("admin"), authorizeRoles("user")
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    next();
  };
};


/**
 * Redirect request to role-based controller
 */
const roleRedirectMiddleware = (controllers) => {
  return (req, res, next) => {
    const role = req.user.role;

    const controller = controllers[role];

    if (!controller) {
      return res.status(403).json({
        success: false,
        message: `No controller for role: ${role}`
      });
    }

    return controller(req, res, next);
  };
};

export default roleRedirectMiddleware;


export const unifiedLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }

    // 🔎 ADMIN (highest priority)
    const admin = await Admin.findOne({ email }).select("+password");
    if (admin) {
      return loginAdmin(req, res);
    }

    // 🔎 DELIVERY
    const deliveryBoy = await DeliveryBoy.findOne({ email }).select("+password");
    if (deliveryBoy) {
      return loginDeliveryBoy(req, res);
    }

    // 🔎 USER
    const user = await User.findOne({ email }).select("+password");
    if (user) {
      return loginUser(req, res);
    }

    return res.status(404).json({
      success: false,
      message: "No account found with this email"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message
    });
  }
};

