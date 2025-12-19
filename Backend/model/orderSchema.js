import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    deliveryBoyId: {
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

    orderStatus: {
      type: String,
      enum: [
        "placed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled"
      ],
      default: "placed"
    },

    deliveryAddress: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
