import express from "express";
import { unifiedLogin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", unifiedLogin);

export default router;
