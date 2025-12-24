import express from "express";

import {  authorizeRoles } from "../middleware/authMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { getAssignedOrders,rejectOrder,acceptOrder,markOrderDelivered,getDeliveryEarnings,getDeliveredPaymentSummary,getDeliveredOrders,getOrderDetails,getDeliveryProfile,updateDeliveryProfile} from "../controller/deliveryBoyController.js";

const router = express.Router();

// router.get(
//   "/delivery/orders",
//   protect,
//   authorizeRoles("delivery"),

// );
router.get(
  "/orders/assigned",
  protect,
  authorizeRoles("delivery"),
  getAssignedOrders
);
router.post(
  "/orders/:id/accept",
  protect,
  authorizeRoles("delivery"),
  acceptOrder
);
router.post(
  "/orders/:id/delivered",
  protect,
  authorizeRoles("delivery"),
  markOrderDelivered
);
router.get(
  "/earnings",
  protect,
  authorizeRoles("delivery"),
  getDeliveryEarnings
);
router.post(
  "/orders/:id/reject",
  protect,
  authorizeRoles("delivery"),
  rejectOrder
);

router.get(
  "/delivered-payment-summary",
  protect,
  authorizeRoles("delivery"),
  getDeliveredPaymentSummary
);
router.get(
  "/orders/delivered",
  protect,
  authorizeRoles("delivery"),
  getDeliveredOrders
);
router.get(
  "/orders/:id",
  protect,
  authorizeRoles("delivery"),
  getOrderDetails
);
router.get(
  "/profile",
  protect,
  authorizeRoles("delivery"),
  getDeliveryProfile
);
router.put(
  "/profile",
  protect,
  authorizeRoles("delivery"),
  updateDeliveryProfile
);  

export default router;
