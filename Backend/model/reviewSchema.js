import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    
    name: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },

    verified: {
      type: Boolean,
      default: false, // ✅ verified order badge
    },

    images: [
      {
        type: String, // Cloudinary URLs (later)
      },
    ],
  },
  {
    timestamps: true, // 👈 enables backdated reviews
  }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });


export default mongoose.model("Review", reviewSchema);
