import express from "express";
import { registerUser, verifyOtpAndRegister ,resetPassword,forgotPassword} from "../controller/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtpAndRegister);


router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


export default router;
