import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
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
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
