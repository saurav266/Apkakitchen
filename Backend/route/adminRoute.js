import express from "express";
import { addDeliveryBoy ,verifyByOtpDeliveryBoy,allDeliveryBoys} from "../controller/deliveryBoyController.js";
import { authorizeRoles } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post(
  "/Add-delivery-boy",

  // authorizeRoles("admin"),
  addDeliveryBoy
);
router.post(
  "/verify-otp",
  verifyByOtpDeliveryBoy
);

router.get(
  "/delivery-boys",

  
  allDeliveryBoys
);

export default router;
