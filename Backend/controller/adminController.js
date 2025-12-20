import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../model/adminSchema.js";
import 'dotenv/config';
import Order from "../models/Order.js";
import jwt from "jsonwebtoken";
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
        message: "Email and password are required"
      });
    }   
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }
    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role
        },  
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token
    });
  }
    catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({
        success: false,
        message: "Server error during admin login"
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
