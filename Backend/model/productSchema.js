import mongoose from "mongoose";

/* ================= VARIANT (SKU) ================= */
const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  finalPrice: Number,
  isDefault: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

/* ================= COMBO ITEM ================= */
const comboItemSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    quantity: { type: String, default: "1" },
  },
  { _id: false }
);

/* ================= IMAGE ================= */
const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    alt: String,
    isPrimary: { type: Boolean, default: false },
  },
  { _id: false }
);

/* ================= PRODUCT ================= */
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    category: {
      type: String,
      required: true,
      enum: [
        "thali",
        "biryani",
        "chinese",
        "indian",
        "desserts",
        "party-combo",
      ],
    },

    description: String,

    // ⚠️ Used ONLY if no variants exist
    price: {
    type: Number,
    min: 0,
  },

    discountPercentage: {
      type: Number,
      default: 0,
    },

    finalPrice: Number,

    // ✅ Explicit flag (VERY IMPORTANT)
    hasVariants: {
      type: Boolean,
      default: false,
    },

    variants: {
      type: [variantSchema],
      default: [],
    },

    comboItems: {
      type: [comboItemSchema],
      default: [],
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    foodType: {
      type: String,
      enum: ["veg", "non-veg", "vegan"],
      required: true,
    },

    preparationTime: {
      type: Number,
      default: 20,
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

/* ================= PRE-SAVE HOOK ================= */
productSchema.pre("save", function () {
  /* ---------- VARIANT MODE ---------- */
  if (this.variants && this.variants.length > 0) {
    this.hasVariants = true;

    let defaultFound = false;

    this.variants.forEach((v, index) => {
      // final price
      v.finalPrice =
        v.discountPercentage > 0
          ? v.price - (v.price * v.discountPercentage) / 100
          : v.price;

      // default variant logic
      if (v.isDefault && !defaultFound) {
        defaultFound = true;
      } else {
        v.isDefault = false;
      }

      // fallback: first variant becomes default
      if (!defaultFound && index === 0) {
        v.isDefault = true;
        defaultFound = true;
      }
    });

    // product-level price unused when variants exist
    this.finalPrice = undefined;
  }

  /* ---------- SIMPLE PRODUCT ---------- */
  else {
    this.hasVariants = false;

    this.finalPrice =
      this.discountPercentage > 0
        ? this.price - (this.price * this.discountPercentage) / 100
        : this.price;
  }
});
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();

  if (!update) return next();

  // Normalize $set usage
  const data = update.$set || update;

  /* ---------- VARIANT MODE ---------- */
  if (data.variants && data.variants.length > 0) {
    data.hasVariants = true;

    let defaultFound = false;

    data.variants.forEach((v, index) => {
      v.finalPrice =
        v.discountPercentage > 0
          ? v.price - (v.price * v.discountPercentage) / 100
          : v.price;

      if (v.isDefault && !defaultFound) {
        defaultFound = true;
      } else {
        v.isDefault = false;
      }

      if (!defaultFound && index === 0) {
        v.isDefault = true;
        defaultFound = true;
      }
    });

    data.finalPrice = undefined;
  }

  /* ---------- SIMPLE PRODUCT ---------- */
  else if (data.price !== undefined) {
    data.hasVariants = false;

    data.finalPrice =
      data.discountPercentage > 0
        ? data.price - (data.price * data.discountPercentage) / 100
        : data.price;
  }

  if (update.$set) {
    update.$set = data;
  } else {
    this.setUpdate(data);
  }

  next();
});



export default mongoose.model("Product", productSchema);
