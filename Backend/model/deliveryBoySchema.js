import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/* ================= EARNINGS ================= */
const earningSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

/* ================= ADDRESS ================= */
const addressSchema = new mongoose.Schema(
  {
    addressLine: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true }
  },
  { _id: false }
);

/* ================= DELIVERY BOY ================= */
const deliveryBoySchema = new mongoose.Schema(
  {
    /* ================= BASIC PROFILE ================= */
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },

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
    currentAddress: addressSchema,
    permanentAddress: addressSchema,

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

    /* ================= EARNINGS SYSTEM ================= */
    totalEarnings: {
      type: Number,
      default: 0
    },

    earningsHistory: {
      type: [earningSchema],
      default: []
    },

    /* ================= ACCOUNT CONTROL ================= */
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date }
  },
  {
    timestamps: true
  }
);

/* ================= PASSWORD HASH ================= */
deliveryBoySchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

/* ================= PASSWORD COMPARE ================= */
deliveryBoySchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const DeliveryBoy = mongoose.model("DeliveryBoy", deliveryBoySchema);
export default DeliveryBoy;
