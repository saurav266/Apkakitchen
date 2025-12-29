import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 🔹 SNAPSHOT CUSTOMER DATA
    customerName: {
      type: String,
      required: true
    },

    customerPhone: {
      type: String,
      required: true
    },

    deliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryBoy"
    },

    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        name: String,
        quantity: Number,
        price: Number
      }
    ],

    totalAmount: {
      type: Number,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending"
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
refundStatus: {
  type: String,
  enum: ["none", "initiated", "completed", "failed"],
  default: "none"
},
refundId: String,
refundAmount: Number,
    orderStatus: {
  type: String,
  enum: [
    "placed",
    "preparing",
    "assigned",        // ✅ ADD THIS
    "out_for_delivery",
    "delivered",
    "cancelled"
  ],
  default: "placed"
},

cancelReason: {
  type: String
},
cancelledBy: {
  type: String,
  enum: ["delivery", "admin", "user"]
},
deliveryOtp: {
  type: String
},
deliveryOtpVerified: {
  type: Boolean,
  default: false
},
    deliveryAddress: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
