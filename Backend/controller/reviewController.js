import mongoose from "mongoose";
import Review from "../model/reviewSchema.js";
import Product from "../model/productSchema.js";
import Order from "../model/orderSchema.js";
// ➕ Add review
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { productId } = req.params;

    const user = req.user; // from auth middleware

    if (!rating) {
      return res.status(400).json({ success: false, message: "Rating required" });
    }

    // Prevent duplicate review
    const exists = await Review.findOne({
      product: productId,
      user: user._id,
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this item",
      });
    }

    const review = await Review.create({
      product: productId,
      user: user._id,
      name: user.name,
      rating,
      comment,
    });

    // ⭐ Update product rating
    const reviews = await Review.find({ product: productId });
    const avg =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: avg.toFixed(1),
      totalReviews: reviews.length,
    });

    res.json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📄 Get reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
    }).sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getReviewStats = async (req, res) => {
  try {
    const productId = req.params.productId;

    const stats = await Review.aggregate([
      {
        $match: {
          product: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;

    stats.forEach((s) => {
      distribution[s._id] = s.count;
      total += s.count;
    });

    res.json({
      success: true,
      distribution,
      total,
    });
  } catch (err) {
    console.error("Review stats error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to load review stats",
    });
  }
};


export const canUserReview = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const order = await Order.findOne({
    user: userId,
    "items.product": productId,
    orderStatus: "delivered",
  });

  res.json({ canReview: !!order });
};
