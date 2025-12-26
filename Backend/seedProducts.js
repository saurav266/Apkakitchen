import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./model/productSchema.js";
import products from "./data/products.seed.js";

dotenv.config();

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("✅ MongoDB connected");

    await Product.deleteMany();
    console.log("🗑️ Old products removed");

    await Product.insertMany(products);
    console.log("🌱 Products seeded successfully!");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedProducts();
