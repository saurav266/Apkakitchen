import jwt from "jsonwebtoken";
import crypto from "crypto";
import 'dotenv/config'
import Order from "../model/orderSchema.js";
import { razorpay } from "../config/razorpay.js";
import { redis } from "../config/redis.js";
import { hashToken } from "../utils/hashToken.js";
import { autoRefund } from "../utils/autoRefund.js";

/* ================= CREATE PAYMENT ================= */
export const createPayment = async (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      items,
      totalAmount,
      deliveryAddress
    } = req.body;

    const razorpayOrder = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: "apkakitchen_" + Date.now()
    });

    const paymentToken = jwt.sign(
      {
        userId: req.user.id,
        customerName,
        customerPhone,
        items,
        totalAmount,
        deliveryAddress
      },
      process.env.PAYMENT_TOKEN_SECRET,
      { expiresIn: "5m" }
    );

    const tokenHash = hashToken(paymentToken);

    await redis.setEx(
      `paytoken:${tokenHash}`,
      300,
      JSON.stringify({ attempts: 0 })
    );

    res.json({
      success: true,
      razorpayOrder,
      paymentToken
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Payment init failed" });
  }
};

/* ================= VERIFY + CREATE ORDER ================= */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentToken
    } = req.body;

    /* 1️⃣ Razorpay signature verify */
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Razorpay signature"
      });
    }

    /* 2️⃣ JWT verify */
    const decoded = jwt.verify(
      paymentToken,
      process.env.PAYMENT_TOKEN_SECRET
    );

    /* 3️⃣ Redis token verify */
    const tokenHash = hashToken(paymentToken);
    const tokenData = await redis.get(`paytoken:${tokenHash}`);

    if (!tokenData) {
      await autoRefund(razorpay_payment_id, decoded.totalAmount);
      return res.status(401).json({
        success: false,
        message: "Token expired, refunded"
      });
    }

    const tokenObj = JSON.parse(tokenData);

    if (tokenObj.attempts >= 3) {
      await autoRefund(razorpay_payment_id, decoded.totalAmount);
      return res.status(429).json({
        success: false,
        message: "Retry limit exceeded"
      });
    }

    /* increment attempts */
    tokenObj.attempts += 1;
    await redis.setEx(
      `paytoken:${tokenHash}`,
      300,
      JSON.stringify(tokenObj)
    );

    /* 4️⃣ GENERATE DELIVERY OTP (HERE) */
    const deliveryOtp = crypto.randomInt(100000, 999999).toString();

    /* 5️⃣ CREATE ORDER */
    const order = await Order.create({
      userId: decoded.userId,
      customerName: decoded.customerName,
      customerPhone: decoded.customerPhone,
      items: decoded.items,
      totalAmount: decoded.totalAmount,
      deliveryAddress: decoded.deliveryAddress,

      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,

      paymentMethod: "Online",
      paymentStatus: "paid",

      deliveryOtp,
      deliveryOtpVerified: false
    });

    /* 6️⃣ Delete token (one-time use) */
    await redis.del(`paytoken:${tokenHash}`);

    res.json({
      success: true,
      message: "Payment verified, order created & OTP generated",
      orderId: order._id
    });

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};


export const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    console.log("🔥 WEBHOOK HIT");

    if (!signature) {
      return res.status(400).send("Signature missing");
    }

    /* ✅ RAW BODY — BUFFER */
    const rawBody = req.body;

    console.log("RAW BODY TYPE:", Buffer.isBuffer(rawBody)); // MUST be true

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("❌ Invalid webhook signature");
      return res.status(400).send("Invalid signature");
    }

    const event = JSON.parse(rawBody.toString());

    console.log("🔥 EVENT:", event.event);

    if (event.event === "refund.processed") {
      const refund = event.payload.refund.entity;
      await Order.findOneAndUpdate(
        { refundId: refund.id },
        { refundStatus: "completed" }
      );
      console.log("✅ Refund completed");
    }

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).send("Webhook error");
  }
};
