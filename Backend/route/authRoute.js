import express from "express";
import { unifiedLogin } from "../middleware/authMiddleware.js";
import { registerUser,verifyOtpAndRegister,resendOtp,logoutUser } from "../controller/userController.js";
import { getMe } from "../controller/authController.js";
import { protect ,getProfile} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", unifiedLogin);
router.post("/register", registerUser);
router.get("/me", getMe);
router.get("/profile", protect, getProfile);


router.post("/verify-otp", verifyOtpAndRegister);
router.post("/resend-otp", resendOtp);
router.post("/logout", protect, logoutUser);


export default router;
