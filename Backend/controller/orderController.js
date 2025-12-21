import Order from "../model/orderSchema.js";

/* ===============================
   CREATE ORDER (USER)
================================ */
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      paymentMethod,
      deliveryAddress
    } = req.body;

    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      paymentMethod,
      deliveryAddress
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message
    });
  }
};

/* ===============================
   GET USER ORDERS
================================ */
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};

/* ===============================
   GET ALL ORDERS (ADMIN)
================================ */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name phone")
      .populate("deliveryBoyId", "name phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};

/* ===============================
   ASSIGN DELIVERY BOY (ADMIN)
================================ */
export const assignDeliveryBoy = async (req, res) => {
  try {
    const { orderId, deliveryBoyId } = req.body;

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    order.deliveryBoyId = deliveryBoyId;
    order.orderStatus = "out_for_delivery";

    await order.save();

    // 🔴 SOCKET.IO EVENT (emit from server)
    req.io.emit("order-assigned", {
      orderId: order._id,
      deliveryBoyId
    });

    res.json({
      success: true,
      message: "Delivery boy assigned",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Assignment failed"
    });
  }
};

/* ===============================
   GET DELIVERY BOY ORDERS
================================ */
export const getDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoyId: req.user._id,
      orderStatus: { $ne: "delivered" }
    })
      .populate("userId", "name phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch delivery orders"
    });
  }
};

/* ===============================
   UPDATE ORDER STATUS (DELIVERY)
================================ */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const validStatus = [
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled"
    ];

    if (!validStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Order not found" });

    // Security: only assigned delivery boy can update
    if (
      status === "delivered" &&
      order.deliveryBoyId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.orderStatus = status;

    if (status === "delivered") {
      order.paymentStatus =
        order.paymentMethod === "COD" ? "paid" : order.paymentStatus;
    }

    await order.save();

    // 🔴 SOCKET.IO LIVE UPDATE
    req.io.emit("order-status-update", {
      orderId: order._id,
      status
    });

    res.json({
      success: true,
      message: "Order status updated",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Update failed"
    });
  }
};
