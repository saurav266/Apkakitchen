import express from "express";
import {
  addReview,
  getReviews,
  getReviewStats,
  canUserReview
} from "../controller/reviewController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * BASE PATH: /api/reviews
 */

// ✅ ADD REVIEW (user only)
router.post(
  "/:productId/review",
  protect,
  authorizeRoles("user"),
  addReview
);

// ✅ GET ALL REVIEWS OF PRODUCT
router.get("/:productId", getReviews);

// ✅ REVIEW STATS
router.get("/:productId/stats", getReviewStats);

// ✅ CAN USER REVIEW?
router.get(
  "/can-review/:productId",
  protect,
  authorizeRoles("user"),
  canUserReview
);

export default router;
