import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Food name
    name: {
      type: String,
      required: true,
      trim: true
    },

    // Category (Veg, Non-Veg, Drinks)
    category: {
      type: String,
      required: true,
      enum: ["thali", "biryani", "chinese", "indian"]
    },

    // Food description
    description: {
      type: String,
      trim: true
    },

    // Original price
    price: {
      type: Number,
      required: true,
      min: 0
    },

    // Discount in %
    discountPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    // Final selling price
    finalPrice: {
      type: Number
    },

    // Image URL
    image: {
      type: String,
      required: true
    },

    // Availability
    isAvailable: {
      type: Boolean,
      default: true
    },

    // Food type
    foodType: {
      type: String,
      enum: ["veg", "non-veg", "vegan"],
      required: true
    },

    // Preparation time (minutes)
    preparationTime: {
      type: Number,
      default: 15
    },

    // Rating info
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalReviews: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Auto calculate final price
productSchema.pre("save", function () {
  if (this.discountPercentage > 0) {
    this.finalPrice =
      this.price - (this.price * this.discountPercentage) / 100;
  } else {
    this.finalPrice = this.price;
  }
});
export default mongoose.model("Product", productSchema);
