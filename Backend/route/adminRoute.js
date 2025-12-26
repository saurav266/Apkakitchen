import express from "express";
import { addDeliveryBoy ,verifyByOtpDeliveryBoy} from "../controller/deliveryBoyController.js";
import { authorizeRoles } from "../middleware/authMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";
import { getAllUsers ,toggleUserStatus,deleteUser,getUserFullDetails,allDeliveryBoys,getDeliveryBoyById,
  updateDeliveryBoy,deleteDeliveryBoy,
  getAdminDashboard
} from "../controller/adminController.js";
import { getAllOrders ,getDeliveryBoys,assignDeliveryBoy,updateOrderStatus,getOrderById} from "../controller/adminController.js";

const router = express.Router();


router.get(
  "/dashboard",
  protect,
  authorizeRoles("admin"),
  getAdminDashboard
);

router.post(
  "/Add-delivery-boy",
  protect,
   authorizeRoles("admin"),
  addDeliveryBoy
);
router.post(
  "/verify-otp",
  protect,
  authorizeRoles("admin"),
  verifyByOtpDeliveryBoy
);

router.get(
  "/delivery-boys",
  protect,
 
  authorizeRoles("admin"),
  allDeliveryBoys
);
router.get(
  "/delivery-boy/:id",
  protect,
  authorizeRoles("admin"),
  getDeliveryBoyById
);
router.put(
  "/delivery-boy/:id",
  protect,
  authorizeRoles("admin"),
  updateDeliveryBoy
);
router.delete(
  "/delivery-boy/:id",
  protect,
  authorizeRoles("admin"),
  deleteDeliveryBoy
);


router.get(
  "/all-users",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);
router.patch(
  "/users/:id/toggle",
  protect,
  authorizeRoles("admin"),
  toggleUserStatus
);

router.delete(
  "/users/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);
router.get(
  "/users/:id",
  protect,
  authorizeRoles("admin"),
  getUserFullDetails
);

// for orders
router.get(
  "/all-orders",
  protect,
  authorizeRoles("admin"),
  getAllOrders
);
router.get(
  "/order/:id",
  protect,
  authorizeRoles("admin"),
  getOrderById
);
router.get(
  "/delivery-boys",
  protect,
  authorizeRoles("admin"),
  getDeliveryBoys
);
router.put(
  "/order/:id/assign",
  protect,
  authorizeRoles("admin"),
  assignDeliveryBoy
);

router.put(
  "/order/:id/status",
  protect,
  authorizeRoles("admin"),
  updateOrderStatus
);  

export default router;
