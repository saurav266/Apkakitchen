import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Delivery Boy Schema
 * Single Restaurant System
 * Role-Based Access Included
 * 
 */

const addressSchema = new mongoose.Schema(
  {
    addressLine: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: {
      type: String,
      required: true
    }
  },
  { _id: false }
);

const deliveryBoySchema = new mongoose.Schema(
  {
    /* ================= BASIC PROFILE ================= */
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

    /* ================= ROLE ================= */
    role: {
      type: String,
      enum: ["delivery"],
      default: "delivery"
    },

    /* ================= LOGIN ================= */
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },

    /* ================= AADHAAR ================= */
    aadhaarLast4: {
      type: String,
      required: true,
      match: [/^\d{4}$/, "Aadhaar must be last 4 digits"]
    },

    aadhaarNumber: {
      type: String,
      select: false
    },

    /* ================= ADDRESSES ================= */
    currentAddress: {
      type: addressSchema,
      required: true
    },

    permanentAddress: {
      type: addressSchema,
      required: true
    },

    /* ================= VERIFICATION ================= */
    isVerified: {
      type: Boolean,
      default: false
    },

    emailOtp: {
      type: String,
      select: false
    },

    emailOtpExpiry: {
      type: Date,
      select: false
    },

    /* ================= VEHICLE ================= */
    vehicleNumber: {
      type: String,
      required: true
    },

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["available", "busy", "offline"],
      default: "offline"
    },

    /* ================= ACCOUNT CONTROL ================= */
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

/* =====================================================
   🔐 HASH PASSWORD BEFORE SAVE
===================================================== */
deliveryBoySchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/* =====================================================
   🔑 COMPARE PASSWORD
===================================================== */
deliveryBoySchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);
export default DeliveryBoy;