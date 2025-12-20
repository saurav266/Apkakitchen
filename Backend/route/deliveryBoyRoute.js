import express from "express";

import {  authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/delivery/orders",
  
  authorizeRoles("delivery"),

);
export default router;
