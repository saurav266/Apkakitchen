import { razorpay } from "../config/razorpay.js";
import Order from "../model/orderSchema.js";

/**
 * Auto refund with safety checks
 */
export const autoRefund = async ({
  orderId,
  paymentId,
  amount,
  reason = "Auto refund"
}) => {
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      console.error("❌ Refund failed: Order not found");
      return;
    }

    // ⛔ Prevent double refund
    if (order.refundStatus === "initiated" || order.refundStatus === "completed") {
      console.log("⚠️ Refund already processed");
      return;
    }

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // paise
      speed: "optimum",
      notes: { reason }
    });

    // ✅ Save refund info
    order.refundStatus = "initiated";
    order.refundId = refund.id;
    order.refundAmount = amount;

    await order.save();

    console.log("✅ Auto refund initiated:", refund.id);
  } catch (err) {
    console.error("❌ Refund failed:", err.message);

    // mark failed refund
    await Order.findByIdAndUpdate(orderId, {
      refundStatus: "failed"
    });
  }
};
