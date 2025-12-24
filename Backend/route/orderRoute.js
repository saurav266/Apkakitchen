import express from "express";

import { createOrder } from "../controller/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();    
router.post("/create", protect, createOrder);
export default router;
