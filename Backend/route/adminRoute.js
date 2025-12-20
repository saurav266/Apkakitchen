import express from "express";
import { addDeliveryBoy } from "../controller/deliveryBoyController.js";
import { authorizeRoles } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post(
  "/admin/Add-delivery-boy",

  authorizeRoles("admin"),
  addDeliveryBoy
);




export default router;
