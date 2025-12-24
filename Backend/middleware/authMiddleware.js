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

    // ADMIN
    if (await Admin.exists({ email })) {
      return loginAdmin(req, res);
    }

    // DELIVERY
    if (await DeliveryBoy.exists({ email })) {
      return loginDeliveryBoy(req, res);
    }

    // USER
    if (await User.exists({ email })) {
      return loginUser(req, res);
    }

    return res.status(404).json({
      success: false,
      message: "No account found with this email"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};

export const getProfile = async (req, res) => {
  const { id, role } = req.user; // from JWT

  let user;
  if (role === "admin") {
    user = await Admin.findById(id);
  } else if (role === "delivery") {
    user = await DeliveryBoy.findById(id);
  } else {
    user = await User.findById(id);
  }

  if (!user) {
    return res.status(404).json({ success: false });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role
    }
  });
};




