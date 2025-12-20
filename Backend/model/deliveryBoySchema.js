import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Delivery Boy Schema
 * Single Restaurant System
 * Role-Based Access Included
 */
const deliveryBoySchema = new mongoose.Schema(
  {
    // ================= BASIC PROFILE =================
    name: {
      type: String,
      required: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true
    },

    email: {
      type: String,
      unique: true,
      sparse: true
    },

    // ================= ROLE (RBAC) =================
    role: {
      type: String,
      enum: ["delivery"],
      default: "delivery"
    },

    // ================= LOGIN CREDENTIAL =================
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },

    // ================= AADHAAR DETAILS =================
    aadhaarLast4: {
      type: String,
      required: true,
      match: [/^\d{4}$/, "Aadhaar must be last 4 digits"]
    },

    // ⚠️ Store only if encrypted
    aadhaarNumber: {
      type: String,
      select: false
    },
    // ================= VERIFICATION =================
    isVerified: {
      type: Boolean,
      default: false
    },

    // ================= VEHICLE =================
    vehicleNumber: {
      type: String,
      required: true
    },

    // ================= STATUS =================
    status: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "offline"
    },

    // ================= ACCOUNT CONTROL =================
    isActive: {
      type: Boolean,
      default: true
    },

    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);



// =====================================================
// 🔐 HASH PASSWORD BEFORE SAVE
// =====================================================
deliveryBoySchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});



// =====================================================
// 🔑 COMPARE PASSWORD (LOGIN)
// =====================================================
deliveryBoySchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};



// =====================================================
// 📦 EXPORT MODEL
// =====================================================
const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);
export default DeliveryBoy;
