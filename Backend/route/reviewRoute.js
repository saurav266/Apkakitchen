import express from "express";
import {
  addReview,
  getReviews,
  getReviewStats,
  canUserReview,
  getMyReviews,
  updateReview,
  deleteReview
} from "../controller/reviewController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats/:productId", getReviewStats);
router.get("/can-review/:productId", protect, authorizeRoles("user"), canUserReview);
router.get("/my", protect, authorizeRoles("user"), getMyReviews);

router.post("/:productId", protect, authorizeRoles("user"), addReview);
router.put("/:productId", protect, authorizeRoles("user"), updateReview);
router.delete("/:productId", protect, authorizeRoles("user"), deleteReview);

// ⚠️ ALWAYS LAST
router.get("/:productId", getReviews);

export default router;
