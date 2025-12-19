import express from "express";
import { registerUser, verifyOtpAndRegister ,loginUser,resetPassword,forgotPassword} from "../controller/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtpAndRegister);
router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


export default router;
