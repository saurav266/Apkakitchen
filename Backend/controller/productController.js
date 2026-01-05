import Product from "../model/productSchema.js";

/* =========================
   ➕ ADD PRODUCT (ADMIN)
========================= */
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      discountPercentage,
      foodType,
      preparationTime,
      images = [],
      variants = [],
      comboItems = [],
    } = req.body;

    const hasVariants = variants.length > 0;

    if (!hasVariants && (price === undefined || price === null)) {
      return res.status(400).json({
        success: false,
        message: "Price is required for products without variants",
      });
    }

    const cleanImages = images.filter(img => img.url);
    if (cleanImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const cleanVariants = hasVariants
      ? variants.filter(v => v.name && v.price)
      : [];

    const product = await Product.create({
      name,
      category,
      description,
      hasVariants,
      price: hasVariants ? 0 : Number(price),
      discountPercentage: hasVariants ? 0 : Number(discountPercentage || 0),
      foodType,
      preparationTime: preparationTime || 20,
      images: cleanImages,
      variants: cleanVariants,
      comboItems,
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    console.error("❌ ADD PRODUCT ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
      errors: error.errors, // 👈 keep this for debugging
    });
  }
};


/* =========================
   📄 GET ALL PRODUCTS
========================= */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* =========================
   📄 GET SINGLE PRODUCT
========================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* =========================
   ✏️ UPDATE PRODUCT (ADMIN)
========================= */
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const {
      name,
      category,
      description,
      price,
      discountPercentage,
      foodType,
      preparationTime,
      images,
      variants,
      comboItems,
      isAvailable
    } = req.body;

    // 🔹 Basic fields
    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (discountPercentage !== undefined)
      product.discountPercentage = discountPercentage;
    if (foodType !== undefined) product.foodType = foodType;
    if (preparationTime !== undefined)
      product.preparationTime = preparationTime;
    if (isAvailable !== undefined) product.isAvailable = isAvailable;

    // 🔥 Advanced structures
    if (Array.isArray(images)) product.images = images;
    if (Array.isArray(variants)) product.variants = variants;
    if (Array.isArray(comboItems)) product.comboItems = comboItems;

    await product.save(); // triggers pre-save price calculation

    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/* =========================
   🗑 DELETE PRODUCT (ADMIN)
========================= */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/* =========================
   ⭐ POPULAR PRODUCTS
========================= */
// 📄 Get popular products by names (order preserved)
export const getPopularProducts = async (req, res) => {
  try {
    const { names } = req.body;

    if (!names || !Array.isArray(names) || names.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Names array is required"
      });
    }

    const products = await Product.find({
      name: { $in: names },
      isAvailable: true
    }).lean(); // 👈 IMPORTANT (we calculate manually)

    const calculated = products.map((p) => {
      // 🔹 Base product final price
      const finalPrice =
        p.discountPercentage > 0
          ? Math.round(p.price - (p.price * p.discountPercentage) / 100)
          : p.price;

      // 🔹 Variant final prices (if any)
      let variants = [];
      if (Array.isArray(p.variants) && p.variants.length > 0) {
        variants = p.variants.map((v) => ({
          ...v,
          finalPrice:
            v.discountPercentage > 0
              ? Math.round(v.price - (v.price * v.discountPercentage) / 100)
              : v.price
        }));
      }

      // 🔹 Primary image fallback
      let primaryImage = null;
      if (Array.isArray(p.images) && p.images.length > 0) {
        primaryImage =
          p.images.find((img) => img.isPrimary) || p.images[0];
      }

      return {
        ...p,
        finalPrice,
        variants,
        primaryImage
      };
    });

    // 🔹 Preserve frontend order
    const ordered = names
      .map((name) => calculated.find((p) => p.name === name))
      .filter(Boolean);

    res.status(200).json({
      success: true,
      products: ordered
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
