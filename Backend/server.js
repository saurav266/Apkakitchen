import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import compression from "compression";
import location from "./route/location.js"
import { razorpayWebhook } from "./controller/paymentController.js";
import { connectDB } from "./db/db.js";

// ===== INIT =====
await connectDB();

const app = express();
app.set("trust proxy", 1); 
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTEND_URL ;

// ===== MIDDLEWARE =====

app.use(express.json());
app.post(
  "/api/payment/webhook",
  express.raw({ type: "application/json" }),
  razorpayWebhook
);

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
);
app.use(compression());

app.use(cookieParser());

// ===== ROUTES =====
import UserRoute from "./route/userRoute.js";
import DeliveryBoyRoute from "./route/deliveryBoyRoute.js";
import AdminRoute from "./route/adminRoute.js";
import authRoute from "./route/authRoute.js";
import orderRoute from "./route/orderRoute.js";
import productRoute from "./route/productRoute.js";
import contactRoutes from "./route/contactRoute.js"
import paymentRoute from "./route/paymentRoute.js"
import reviewRoutes from "./route/reviewRoute.js";
import cartRoutes from "./route/cartRoutes.js"

app.use("/api/users", UserRoute);
app.use("/api/delivery", DeliveryBoyRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/auth", authRoute);
app.use("/api/orders", orderRoute);
app.use("/api/products", productRoute);
app.use("/api/location", location);
app.use("/api/contact", contactRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);


// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("🚀 Server API is running");
});

// ===== HTTP SERVER =====
const server = http.createServer(app);

// ===== SOCKET.IO =====
export const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join", ({ role, userId, orderId }) => {

    if (role === "admin") {
      socket.join("admin_all");
      console.log("➡️ Joined admin_all");
    }

    if (role === "delivery" && userId) {
      socket.join(`delivery_${userId}`);
      console.log(`➡️ Joined delivery_${userId}`);
    }

    if (orderId) {
      socket.join(`order_${orderId}`);
      console.log(`➡️ Joined order_${orderId}`);
    }
  });

  // 📍 LIVE LOCATION FROM DELIVERY BOY
socket.on("delivery:location:update", (data) => {
  if (!data?.orderId) return;

  io.to(`order_${data.orderId}`).emit(
    "delivery:location:update",
    data
  );
});


  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", socket.id, reason);
  });
});



// ===== GLOBAL ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

// ===== START SERVER =====
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});