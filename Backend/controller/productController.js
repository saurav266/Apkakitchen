import Product from "../model/productSchema.js";


// ➕ Add product (already done)
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      price,
      discountPercentage,
      image,
      foodType,
      isAvailable,
      preparationTime,
    } = req.body;

    // Basic validation
    if (!name || !category || !price) {
      return res.status(400).json({ message: "Name, category, and price are required" });
    }

    // Calculate final price after discount
    const finalPrice = discountPercentage
      ? price - (price * discountPercentage) / 100
      : price;

    // Create new product document
    const product = new Product({
      name,
      category,
      description,
      price,
      discountPercentage,
      finalPrice,
      image,
      foodType,
      isAvailable,
      preparationTime,
    });

    // Save to DB
    await product.save();

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 📄 Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true }).lean();

    const updatedProducts = products.map((p) => ({
      ...p,
      finalPrice:
        p.discountPercentage > 0
          ? Math.round(p.price - (p.price * p.discountPercentage) / 100)
          : p.price,
    }));

    res.json({
      success: true,
      products: updatedProducts,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 📄 Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✏️ Update product
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({
      success: true,
      message: "Product updated",
      product
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🗑️ Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📄 Get popular products by names
export const getPopularProducts = async (req, res) => {
  try {
    const { names } = req.body;

    if (!names || !Array.isArray(names)) {
      return res.status(400).json({ success: false, message: "Names required" });
    }

    const products = await Product.find({
      name: { $in: names },
      isAvailable: true,
    }).lean(); // 👈 IMPORTANT

    // Calculate finalPrice dynamically
    const calculated = products.map((p) => ({
      ...p,
      finalPrice:
        p.discountPercentage > 0
          ? Math.round(p.price - (p.price * p.discountPercentage) / 100)
          : p.price,
    }));

    // Preserve order
    const ordered = names
      .map((n) => calculated.find((p) => p.name === n))
      .filter(Boolean);

    res.json({ success: true, products: ordered });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
