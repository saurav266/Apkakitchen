import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../model/adminSchema.js";
import 'dotenv/config';
import Order from "../model/orderSchema.js";
import jwt from "jsonwebtoken";
import User from "../model/userSchema.js";
import DeliveryBoy from "../model/deliveryBoySchema.js";
import { io }  from "../server.js";
import crypto from "crypto";

const DATABASE_URL = "mongodb://127.0.0.1:27017/Apkakitchen"
// const createAdmin = async () => {
//   try {
//     console.log(process.env.DATABASE_URL);
//    await mongoose.connect(DATABASE_URL, {
     
//     });

//     const exists = await Admin.findOne({});
//     if (exists) {

//       console.log("Admin already exists. Only one admin allowed.");
//       process.exit();
//     }

//     const hashedPassword = await bcrypt.hash("Admin@123", 10);

//     const admin = await Admin.create({
//       name: "Admin",
//       email: "admin@apkakitchen.com",
//       password: hashedPassword,
//       verified: true
//     });

//     console.log("✅ Admin created:", admin.email);
//     process.exit();
//   } catch (error) {
//     console.error(error);
//     process.exit(1);
//   }
// };

// createAdmin();

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password for admin",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password for admin",
      });
    }

    // 🔐 CREATE JWT
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ STORE TOKEN IN COOKIE (CRITICAL)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,      // ❗ false on localhost
      sameSite: "lax",    // ❗ REQUIRED
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({
      success: false,
      message: "Server error during admin login",
    });
  }
};


// 📦 GET TODAY'S ORDERS COUNT
export const getTodayOrders = async (req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todayOrders = await Order.countDocuments({
      createdAt: { $gte: start, $lte: end },
    });

    res.status(200).json({
      success: true,
      todayOrders
    });
  } catch (error) {
    console.error("Error fetching today's orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch today's orders"
    });
  }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders"
        }
      },
      {
        $addFields: {
          ordersCount: { $size: "$orders" },
          totalSpent: { $sum: "$orders.totalAmount" }
        }
      },
      {
        $project: {
          password: 0,
          forgetPasswordToken: 0,
          forgetPasswordExpiry: 0,
          orders: 0
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};

/**
 * BLOCK / UNBLOCK USER
 */
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: "User status updated"
    });
  } catch {
    res.status(500).json({ message: "Failed to update user" });
  }
};

/**
 * DELETE USER
 */
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
};

export const getUserFullDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -forgetPasswordToken -forgetPasswordExpiry")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const orders = await Order.find({ userId: user._id })
      .sort({ createdAt: -1 });

    const totalSpent = orders.reduce(
      (sum, o) => sum + o.totalAmount,
      0
    );

    res.json({
      success: true,
      user: {
        ...user,
        orders,
        ordersCount: orders.length,
        totalSpent
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user details"
    });
  }
};


// for delivery boys


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

export const editDeliveryBoyProfile = async (req, res) => {
  try {
    const deliveryBoyId = req.user.id;
    const { name, phone, address } = req.body;

    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy) {
      return res.status(404).json({
        success: false, 
        message: "Delivery boy not found"
      });
    }

    deliveryBoy.name = name || deliveryBoy.name;
    deliveryBoy.phone = phone || deliveryBoy.phone;
    deliveryBoy.address = address || deliveryBoy.address;

    await deliveryBoy.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      deliveryBoy
    });

  } catch (error) {
    console.error("Edit Delivery Boy Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating profile"
    });
  }
};

export const updateDeliveryBoy = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      vehicleNumber,
      status,
      isActive,
      currentAddress,
      permanentAddress
    } = req.body;

    const deliveryBoy = await DeliveryBoy.findById(id);

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery boy not found"
      });
    }

    /* ================= BASIC FIELDS ================= */
    if (name) deliveryBoy.name = name;
    if (phone) deliveryBoy.phone = phone;
    if (vehicleNumber) deliveryBoy.vehicleNumber = vehicleNumber;

    /* ================= STATUS ================= */
    if (status) {
      const allowed = ["available", "busy", "offline"];
      if (!allowed.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status"
        });
      }
      deliveryBoy.status = status;
    }

    if (typeof isActive === "boolean") {
      deliveryBoy.isActive = isActive;
    }

    /* ================= ADDRESSES ================= */
    if (currentAddress) {
      deliveryBoy.currentAddress = currentAddress;
    }

    if (permanentAddress) {
      deliveryBoy.permanentAddress = permanentAddress;
    }

    await deliveryBoy.save();

    return res.status(200).json({
      success: true,
      message: "Delivery boy updated successfully",
      deliveryBoy
    });

  } catch (error) {
    console.error("Update Delivery Boy Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

export const deleteDeliveryBoy = async (req, res) => {
  try {
    const { id } = req.params;

    const deliveryBoy = await DeliveryBoy.findById(id);

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery boy not found"
      });
    }

    await deliveryBoy.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Delivery boy deleted successfully"
    });

  } catch (error) {
    console.error("Delete Delivery Boy Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting delivery boy"
    });
  }
};

// for order
// fecth orders
export const getOrdersForDeliveryBoy = async (req, res) => {
  try {
    const deliveryBoyId = req.user.id;

    const orders = await Order.find({ deliveryBoyId })
      .populate("userId", "name phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "userId",
        select: "name +phone" // 👈 FORCE phone
      })
      .populate({
        path: "deliveryBoy",
        select: "name phone status vehicleNumber"
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error("getAllOrders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};


export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("userId", "name phone address")
      .populate("deliveryBoy", "name phone vehicleNumber status");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch order"
    });
  }
};
export const assignDeliveryBoy = async (req, res) => {
  try {
    const { id } = req.params;            // order id
    const { deliveryBoy } = req.body;     // delivery boy id

    console.log("📦 Assigning to delivery boy:", deliveryBoy);

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Assign
    order.deliveryBoy = deliveryBoy;
     order.orderStatus = "assigned";   // ✅ IMPORTANT
    await order.save();

    // Mark delivery boy busy
    await DeliveryBoy.findByIdAndUpdate(deliveryBoy, {
      status: "busy"
    });

    // 🔥 POPULATE ORDER (CRITICAL)
    const populatedOrder = await Order.findById(order._id)
      .populate("userId", "name phone");

    // 🔥 EMIT TO CORRECT DELIVERY ROOM
    console.log("📤 Emitting socket to:", `delivery_${deliveryBoy}`);

    io.to(`delivery_${deliveryBoy}`).emit(
      "order-assigned",
      populatedOrder
    );

    res.json({
      success: true,
      message: "Delivery boy assigned",
      order: populatedOrder
    });

  } catch (error) {
    console.error("ASSIGN DELIVERY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};



export const getDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await DeliveryBoy.find({
      role: "delivery",
      isActive: true,
      status: "available"
    }).select("name phone status vehicleNumber");

    res.json({
      success: true,
      deliveryBoys
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch delivery boys"
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate("deliveryBoy");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    order.orderStatus = status;
    await order.save();

    /* If delivered or cancelled → free delivery boy */
    if (
      ["delivered", "cancelled"].includes(status) &&
      order.deliveryBoy
    ) {
      order.deliveryBoy.status = "available";
      await order.deliveryBoy.save();
    }

    res.json({
      success: true,
      message: "Order status updated",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
