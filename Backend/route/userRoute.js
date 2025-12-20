import express from "express";
import { resetPassword,forgotPassword,getUserProfile} from "../controller/userController.js";
import { protect,authorizeRoles } from "../middleware/authMiddleware.js";
import {addAddress,
  updateAddress,
  deleteAddress,
  setCurrentAddress} from "../controller/userController.js";

const router = express.Router();



router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile",protect, getUserProfile);

// for addressing CORS issues with cookies
router.post("/address", protect, authorizeRoles("user"), addAddress);
router.put("/address/:addressId", protect, authorizeRoles("user"), updateAddress);
router.delete("/address/:addressId", protect, authorizeRoles("user"), deleteAddress);
router.patch(
  "/address/:addressId/set-current",
  protect,
  authorizeRoles("user"),
  setCurrentAddress
);


export default router;
