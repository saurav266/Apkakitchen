import express from "express";
import { registerUser, verifyOtpAndRegister ,loginUser} from "../controller/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtpAndRegister);
router.post("/login", loginUser);


export default router;
