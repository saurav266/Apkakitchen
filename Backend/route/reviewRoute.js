import express from "express";
import { addReview, getReviews,getReviewStats,canUserReview } from "../controller/reviewController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:productId", getReviews);
router.get("/:productId/stats", getReviewStats);
router.get("/:productId", getReviews);
router.get("/can-review/:productId", auth, canUserReview);


export default router;
