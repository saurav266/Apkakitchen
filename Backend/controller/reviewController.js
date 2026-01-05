import mongoose from "mongoose";
import Review from "../model/reviewSchema.js";
import Product from "../model/productSchema.js";
import Order from "../model/orderSchema.js";

// 📝 Add review
export const addReview = async (req, res) => {
  try {
    const { productId } = req.params;

    // ✅ FIX: Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const { rating, comment } = req.body;
    const userId = req.user.id;
    const userName = req.user.data.name;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating required",
      });
    }

    const exists = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (exists) {
      return res.status(400).json({
        message: "You already reviewed this product for this order"
      });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      name: userName,
      rating,
      comment,
      verified: true,
    });

    res.json({ success: true, review });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
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

// 📄 Can user review this product?
export const canUserReview = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  const order = await Order.findOne({
    userId,
    "items.productId": productId, // ✅ FIXED
    orderStatus: "delivered",
  });

  res.json({ canReview: !!order });
};


// 📄 Get my review for a product
export const getMyReviews = async (req, res) => {
  const reviews = await Review.find({
    user: req.user.id
  }).select("product");

  const map = {};
  reviews.forEach(r => {
    map[r.product.toString()] = true;
  });

  res.json({
    success: true,
    map
  });
};

//upadate 
export const updateReview = async (req, res) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  const review = await Review.findOneAndUpdate(
    { product: productId, user: req.user.id },
    { rating, comment },
    { new: true }
  );

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "Review not found"
    });
  }

  res.json({ success: true, review });
};

//delete
export const deleteReview = async (req, res) => {
  const { productId } = req.params;

  await Review.findOneAndDelete({
    product: productId,
    user: req.user.id
  });

  res.json({ success: true });
};
