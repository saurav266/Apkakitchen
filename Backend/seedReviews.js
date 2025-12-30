import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./model/productSchema.js";
import Review from "./model/reviewSchema.js";
import {
  indianNames,
  reviewComments,
  randomRating,
  randomPastDate,
} from "./utils/fakeReviews.js";

dotenv.config();

const seedReviews = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    const products = await Product.find();

    for (const product of products) {
      const count = Math.floor(Math.random() * 6) + 4; // 4–9 reviews

      for (let i = 0; i < count; i++) {
        const name =
          indianNames[Math.floor(Math.random() * indianNames.length)];

        const comments =
          reviewComments[product.category] || reviewComments.veg;

        const comment =
          comments[Math.floor(Math.random() * comments.length)];

        const rating = randomRating();

        await Review.create({
          product: product._id,
          name,
          rating,
          comment,
          verified: Math.random() > 0.4, // ~60% verified
          createdAt: randomPastDate(), // ⏱ backdated
        });
      }

      // 🔄 Update product summary
      const reviews = await Review.find({ product: product._id });
      const avg =
        reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

      await Product.findByIdAndUpdate(product._id, {
        rating: avg.toFixed(1),
        totalReviews: reviews.length,
      });
    }

    console.log("✅ Realistic reviews seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedReviews();
