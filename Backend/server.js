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
const PORT = process.env.PORT || 3000;

//
import UserRoute from './route/userRoute.js';
import DeliveryBoyRoute from './route/deliveryBoyRoute.js';
import AdminRoute from './route/adminRoute.js';
import authRoute from './route/authRoute.js';
import orderRoute from './route/orderRoute.js';
import productRoute from './route/productRoute.js';
import contactRoutes from './route/contactRoute.js';
import reviewRoutes from './route/reviewRoute.js';

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true
  })
);
app.use(compression());
app.use(express.json());
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
app.use("/api/users", UserRoute);
app.use("/api/delivery", DeliveryBoyRoute);
app.use("/api/admin", AdminRoute);
app.use("/api/auth", authRoute);
app.use("/api/orders", orderRoute);
app.use("/api/products", productRoute);
app.use("/api/location", location);
app.use("/api/contact", contactRoutes);
app.use("/api/reviews", reviewRoutes);


app.get('/', (req, res) => {
    res.send('Welcome to the Serger API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});