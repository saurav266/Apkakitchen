import express from "express";
import { protect ,authorizeRoles} from "../middleware/authMiddleware.js";
import {
  createPayment,
  verifyPayment,
  razorpayWebhook
} from "../controller/paymentController.js";

const router = express.Router();

router.post("/create", protect,authorizeRoles("user"), createPayment);
router.post("/verify", protect,authorizeRoles("user"), verifyPayment);

export default router;