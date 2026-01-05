import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },

    name: {
      type: String,
      required: true // snapshot of user name
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      trim: true
    },

    verified: {
      type: Boolean,
      default: false // set true after delivery check
    },

    images: [
      {
        type: String // Cloudinary URLs
      }
    ]
  },
  {
    timestamps: true
  }
);

/* ✅ Prevent duplicate review by same user for same product */
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
