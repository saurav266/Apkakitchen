import bcrypt from "bcryptjs";
import User from "../model/userSchema.js";
import Order from "../model/orderSchema.js";
import jwt from "jsonwebtoken";
import {
  sendVerificationCode,
   sendWelcomeBackEmail,
  sendResendOtpEmail,
  sendForgotPasswordEmail
} from "../services/emailService.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from "crypto";


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
/* VERIFY OTP + AUTO LOGIN */
export const verifyOtpAndRegister = async (req, res) => {
  try {
    const { otp, otpToken } = req.body;

    if (!otp || !otpToken) {
      return res.status(400).json({
        success: false,
        message: "OTP and token required"
      });
    }

    // 🔐 Verify OTP token
    const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

    if (decoded.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    // Safety check
    const exists = await User.findOne({ email: decoded.email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    // ✅ Create user
    const user = await User.create({
      name: decoded.name,
      email: decoded.email,
      password: decoded.password,
      verified: true,
      role: "user"
    });

    // 🔥 AUTO LOGIN (JWT)
   const token = generateToken(user._id, user.role);

res.cookie("token", token, {
  httpOnly: true,
  secure: false,           // ✅ MUST be false on localhost
  sameSite: "lax",         // ✅ REQUIRED
  maxAge: 7 * 24 * 60 * 60 * 1000
});

return res.status(201).json({
  success: true,
  message: "Registration successful. Logged in automatically",
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});


  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    res.status(500).json({
      success: false,
      message: err.message
    });
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
      return res.status(400).json({ message: "user not find" });
    }

    if (!user.verified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credential passs" });
    }

    const token = generateToken(user._id, user.role);

    await  sendWelcomeBackEmail(user.email, user.name);

    // ✅ STORE JWT IN COOKIE (7 DAYS)
   res.cookie("token", token, {
  httpOnly: true,
  secure: false,        // localhost
  sameSite: "lax",
  path: "/",            // 🔥 REQUIRED
  maxAge: 7 * 24 * 60 * 60 * 1000,
});



    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",     // 🔥 MUST MATCH LOGIN
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};




export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(200).json({
        message: "If account exists, reset link sent",
      });

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.forgetPasswordToken = hashedToken;
    user.forgetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 min

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await sendForgotPasswordEmail(user.email, user.name, resetUrl);

    res.json({
      success: true,
      message: "Password reset link sent to email",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Hash token from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find valid reset request
    const user = await User.findOne({
      forgetPasswordToken: hashedToken,
      forgetPasswordExpiry: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Set new password
    user.password = await bcrypt.hash(newPassword, 10);

    // Clear reset fields
    user.forgetPasswordToken = undefined;
    user.forgetPasswordExpiry = undefined;

    await user.save();

    // 🔐 AUTO LOGIN (7 DAYS)
    const jwtToken = generateToken(user._id, user.role);


    res.cookie("token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Password reset successful. Logged in automatically.",
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


/**
 * @desc    Get logged-in user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.data) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    const user = req.user.data;

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: req.user.role,
        verified: user.verified,
        addresses: user.addresses,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });

  } catch (error) {
    console.error("Get User Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    // ✅ user already attached by protect middleware
    const user = req.user.data;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 🔁 Email change check
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use"
        });
      }
      user.email = email;
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};


// for addressing CORS issues with cookies


/**
 * ➕ Add new address
 * POST /api/users/address
 */
export const addAddress = async (req, res) => {
  try {
    const user = req.user.data;
    const { label, addressLine, city, state, pincode, isCurrent } = req.body;

    if (!addressLine || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required"
      });
    }

    // 🔥 If new address is current → unset all previous
    if (isCurrent) {
      user.addresses = user.addresses.map(addr => ({
        ...addr.toObject(),
        isCurrent: false
      }));
    }

    user.addresses.push({
      label: label || "Home",
      addressLine,
      city,
      state,
      pincode,
      isCurrent: !!isCurrent
    });

    // 🔥 FORCE SAVE
    user.markModified("addresses");
    await user.save();

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      addresses: user.addresses
    });

  } catch (error) {
    console.error("Add Address Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



/**
 * ✏️ Update address
 * PUT /api/users/address/:addressId
 */
export const updateAddress = async (req, res) => {
  try {
    const user = req.user.data;
    const { addressId } = req.params;
    const { label, addressLine, city, state, pincode, isCurrent } = req.body;

    const address = user.addresses.id(addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    // If making current → unset others
    if (isCurrent) {
      user.addresses.forEach(addr => (addr.isCurrent = false));
    }

    if (label) address.label = label;
    if (addressLine) address.addressLine = addressLine;
    if (city) address.city = city;
    if (state) address.state = state;
    if (pincode) address.pincode = pincode;
    if (typeof isCurrent === "boolean") address.isCurrent = isCurrent;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      addresses: user.addresses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * ❌ Delete address
 * DELETE /api/users/address/:addressId
 */
export const deleteAddress = async (req, res) => {
  try {
    const user = req.user.data;
    const { addressId } = req.params;

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    address.remove();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      addresses: user.addresses
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


/**
 * ⭐ Set current address
 * PATCH /api/users/address/:addressId/set-current
 */
export const setCurrentAddress = async (req, res) => {
  try {
    const user = req.user.data;
    const { addressId } = req.params;

    let found = false;

    // 🔥 IMPORTANT FIX: replace entire array
    user.addresses = user.addresses.map(addr => {
      if (addr._id.toString() === addressId) {
        found = true;
        return { ...addr.toObject(), isCurrent: true };
      }
      return { ...addr.toObject(), isCurrent: false };
    });

    if (!found) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    user.markModified("addresses"); // 🔥 CRITICAL
    await user.save();

    res.status(200).json({
      success: true,
      message: "Current address updated",
      addresses: user.addresses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// my order
export const getMyOrders = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};
