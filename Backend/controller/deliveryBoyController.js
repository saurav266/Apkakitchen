import jwt from "jsonwebtoken";
import DeliveryBoy from "../model/deliveryBoySchema.js";
import Order from "../model/orderSchema.js";
import { io }  from "../server.js";
import crypto from "crypto";
import { autoRefund } from "../utils/autoRefund.js"


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


// const fixPassword = async () => {
//   const newPassword = "Krishna@12345";

//   const hash = await bcrypt.hash(newPassword, 10);

//   await DeliveryBoy.updateOne(
//     { email: "krishna852323@gmail.com" },
//     { $set: { password: hash } }
//   );

//   console.log("Password reset successfully");
// };

// fixPassword();
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


export const getDeliveryProfile = async (req, res) => {
  try {
    const boy = await DeliveryBoy.findById(req.user.id).select(
      "name phone email vehicleNumber status isVerified"
    );

    if (!boy) {
      return res.status(404).json({ success: false });
    }

    res.json({
      success: true,
      profile: boy
    });
  } catch (err) {
    res.status(500).json({ success: false });
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
 
export const deliverOrderWithoutOtp = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== "out_for_delivery") {
      return res.status(400).json({
        message: "Order is not out for delivery"
      });
    }

    // 🚫 Safety: block online payments
    if (order.paymentMethod === "online") {
      return res.status(400).json({
        message: "OTP delivery required for online payment"
      });
    }

    /* ===== MARK DELIVERED ===== */
    order.orderStatus = "delivered";
    order.deliveredAt = new Date();
    order.codCollected = true;

    await order.save();

    res.json({
      success: true,
      message: "Order delivered successfully (No OTP)"
    });

  } catch (error) {
    console.error("Deliver without OTP error:", error);
    res.status(500).json({ message: "Server error" });
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
        message: "Invalid email or password for "
      });
    }

    if (!deliveryBoy.isVerified || !deliveryBoy.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account not verified or inactive"
      });
    }
console.log("🚚 loginDeliveryBoy HIT");



    // ================= PASSWORD CHECK =================
    const isMatch = await deliveryBoy.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password for delivery boy"
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
  secure: false,       // localhost only
  sameSite: "lax",
  path: "/",
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
        status: deliveryBoy.status,
        role: deliveryBoy.role
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

// for order 
export const getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoy: req.user.id,
      orderStatus: { $in: ["assigned", "out_for_delivery"] }
    })
      .sort({ createdAt: -1 })
      .lean(); // IMPORTANT

    res.json({
      success: true,
      orders
    });
  } catch (err) {
    console.error("❌ GET ASSIGNED ORDERS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch assigned orders"
    });
  }
};








export const acceptOrder = async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("deliveryBoy", "name");

  order.orderStatus = "out_for_delivery";
  await order.save();

  // 🔔 Notify admin
  io.to("admin").emit("order-accepted", {
    orderId: order._id,
    deliveryBoy: order.deliveryBoy.name
  });

  res.json({ success: true, message: "Order accepted" });
};

export const rejectOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  order.deliveryBoy = null;
  order.orderStatus = "preparing";
  await order.save();

  await DeliveryBoy.findByIdAndUpdate(req.user.id, {
    status: "available"
  });

  // 🔔 Notify admin
  io.to("admin").emit("order-rejected", {
    orderId: order._id
  });

  res.json({ success: true, message: "Order rejected" });
};


export const markOrderDelivered = async (req, res) => {
  try {
    const { id } = req.params;
    const { otp } = req.body;

    /* ================= ID VALIDATION ================= */
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID"
      });
    }

    /* ================= FIND ORDER ================= */
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    /* ================= AUTH ================= */
    if (req.user.role !== "delivery") {
      return res.status(403).json({
        success: false,
        message: "Only delivery boy can mark delivered"
      });
    }

    /* ================= STATUS CHECK ================= */
    if (order.orderStatus === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Order already delivered"
      });
    }

    if (order.orderStatus !== "out_for_delivery") {
      return res.status(400).json({
        success: false,
        message: "Order not out for delivery"
      });
    }

    /* ================= OTP VERIFICATION ================= */
    if (order.paymentMethod === "Online") {
      if (!otp) {
        return res.status(400).json({
          success: false,
          message: "Delivery OTP required"
        });
      }

      if (order.deliveryOtpVerified) {
        return res.status(400).json({
          success: false,
          message: "OTP already verified"
        });
      }

      if (order.deliveryOtp !== otp) {
        return res.status(400).json({
          success: false,
          message: "Invalid OTP"
        });
      }

      // ✅ OTP correct
      order.deliveryOtpVerified = true;
      order.deliveryOtp = undefined; // remove OTP
    }

    /* ================= UPDATE ORDER ================= */
    order.orderStatus = "delivered";
    order.paymentStatus = "paid"; // dashboard consistency
    await order.save();

    /* ================= DELIVERY BOY UPDATE ================= */
    const DELIVERY_EARNING = 50;

    if (order.deliveryBoy) {
      const update = {
        $inc: { totalEarnings: DELIVERY_EARNING },
        $push: {
          earningsHistory: {
            orderId: order._id,
            amount: DELIVERY_EARNING,
            date: new Date()
          }
        },
        status: "available"
      };

      // COD → admin collects later
      if (order.paymentMethod === "COD") {
        update.$inc.pendingCOD = order.totalAmount;
      }

      await DeliveryBoy.findByIdAndUpdate(order.deliveryBoy, update);
    }

    /* ================= SOCKET EVENTS ================= */
    io.to("admin").emit("order-delivered", {
      orderId: order._id,
      amount: order.totalAmount,
      paymentMethod: order.paymentMethod
    });

    io.to(`user_${order.userId}`).emit("order-status-updated", {
      orderId: order._id,
      status: "delivered"
    });

    return res.json({
      success: true,
      message: "Order delivered successfully",
      earning: DELIVERY_EARNING
    });

  } catch (error) {
    console.error("DELIVERY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// 
/* ========= DELIVERY BOY CANCEL ORDER ========= */




export const cancelDeliveryOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Cancellation reason is required"
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    /* 🔐 ROLE CHECK */
    if (req.user.role !== "delivery") {
      return res.status(403).json({
        success: false,
        message: "Only delivery partner can cancel this order"
      });
    }

    /* 🔐 OWNERSHIP CHECK */
    if (
      !order.deliveryBoy ||
      order.deliveryBoy.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this order"
      });
    }

    /* ⛔ ALREADY CANCELLED */
    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled"
      });
    }

    /* ⛔ INVALID STATES */
    if (
      !["assigned", "out_for_delivery"].includes(order.orderStatus)
    ) {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled at this stage"
      });
    }

    /* 🔁 UPDATE ORDER */
    order.orderStatus = "cancelled";
    order.cancelReason = reason;
    order.cancelledBy = "delivery";
    order.deliveryBoy = null;

    await order.save();

    /* 💸 AUTO REFUND (ONLINE ONLY) */
    if (
      order.paymentMethod === "Online" &&
      order.paymentStatus === "paid" &&
      order.refundStatus === "none"
    ) {
      await autoRefund({
        orderId: order._id,
        paymentId: order.razorpayPaymentId,
        amount: order.totalAmount,
        reason: "Order cancelled by delivery partner"
      });
    }

    /* 🔔 ADMIN SOCKET ALERT */
    io.to("admin_all").emit("order-cancelled", {
      orderId: order._id,
      cancelledBy: "delivery",
      reason,
      time: new Date()
    });

    return res.json({
      success: true,
      message: "Order cancelled by delivery partner"
    });

  } catch (error) {
    console.error("❌ DELIVERY CANCEL ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};


// for erning
export const getDeliveryEarnings = async (req, res) => {
  try {
    const deliveryBoy = await DeliveryBoy.findById(req.user.id)
      .select("totalEarnings earningsHistory");

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery boy not found"
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayEarnings = deliveryBoy.earningsHistory
      .filter(e => new Date(e.date) >= today)
      .reduce((sum, e) => sum + e.amount, 0);

    res.json({
      success: true,
      totalEarnings: deliveryBoy.totalEarnings,
      todayEarnings,
      earningsHistory: [...deliveryBoy.earningsHistory].reverse()
    });
  } catch (err) {
    console.error("Earnings error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch earnings"
    });
  }
};


export const getDeliveredPaymentSummary = async (req, res) => {
  try {
    const deliveryBoyId = req.user.id;
    const { filter = "today" } = req.query;

    const now = new Date();
    let startDate = new Date(0); // default (all)

    if (filter === "today") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    }

    if (filter === "week") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    }

    if (filter === "month") {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
    }

    const orders = await Order.find({
      deliveryBoy: deliveryBoyId,
      orderStatus: "delivered",
      createdAt: { $gte: startDate }
    }).select("totalAmount paymentMethod createdAt");

    let codAmount = 0;
    let onlineAmount = 0;

    orders.forEach(order => {
      if (order.paymentMethod === "COD") {
        codAmount += order.totalAmount;
      }
      if (order.paymentMethod === "Online") {
        onlineAmount += order.totalAmount;
      }
    });

    res.json({
      success: true,
      filter,
      cashOnDelivery: codAmount,
      onlinePayment: onlineAmount,
      totalDeliveredOrders: orders.length,
      recentOrders: orders.reverse()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch filtered delivery data"
    });
  }
};

export const getDeliveredOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoy: req.user.id,
      orderStatus: "delivered"
    })
      .sort({ updatedAt: -1 })
      .select(
        "_id totalAmount paymentMethod updatedAt customerName customerPhone"
      );

    res.json({
      success: true,
      orders
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch delivered orders"
    });
  }
};

export const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false });
    }

    res.json({ success: true, order });
  } catch {
    res.status(500).json({ success: false });
  }
};


export const updateDeliveryProfile = async (req, res) => {
  try {
    const { name, phone, email, vehicleNumber } = req.body;

    await DeliveryBoy.findByIdAndUpdate(req.user.id, {
      name,
      phone,
      email,
      vehicleNumber
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};


export const changeDeliveryPassword = async (req, res) => {
  try {
    const { current, newPass } = req.body;

    const boy = await DeliveryBoy.findById(req.user.id).select("+password");

    const match = await bcrypt.compare(current, boy.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong current password" });
    }

    boy.password = newPass;
    await boy.save();

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
};


export default function DeliveryBoyTracker({ orderId, deliveryBoyId }) {

  useEffect(() => {
    if (!orderId || !deliveryBoyId) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        socket.emit("delivery:location", {
          orderId,
          deliveryBoyId,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          heading: pos.coords.heading,
          speed: pos.coords.speed,
          timestamp: Date.now()
        });
      },
      (err) => console.error("GPS error", err),
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 5000
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [orderId, deliveryBoyId]);

  return null;
}