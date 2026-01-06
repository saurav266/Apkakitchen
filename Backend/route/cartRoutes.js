import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  syncCart
} from "../controller/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getCart);
router.post("/add", protect, addToCart);
router.patch("/update", protect, updateCartItem);
router.delete("/remove/:cartItemId", protect, removeCartItem);
router.delete("/clear", protect, clearCart);
router.post("/sync", protect, syncCart);

export default router;
