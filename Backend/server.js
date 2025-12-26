import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from "http";
import { Server } from "socket.io";

import { connectDB } from './db/db.js';

await connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ===== ROUTES =====
import UserRoute from './route/userRoute.js';
import DeliveryBoyRoute from './route/deliveryBoyRoute.js';
import AdminRoute from './route/adminRoute.js';
import authRoute from './route/authRoute.js';
import orderRoute from './route/orderRoute.js';
import productRoute from './route/productRoute.js';

app.use(
  cors({
    origin: "http://localhost:5173", // ✅ EXACT frontend URL
    credentials: true
  })
);

app.use(express.json());    
app.use(cookieParser());


app.use('/api/users', UserRoute);
app.use('/api/delivery', DeliveryBoyRoute);
app.use('/api/admin', AdminRoute);
app.use('/api/auth', authRoute);
app.use('/api/orders', orderRoute);
app.use('/api/products', productRoute);

app.get('/', (req, res) => {
  res.send('Welcome to the Server API!');
});

// ===== SOCKET.IO SETUP =====
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

 socket.on("join", ({ userId, role }) => {
  if (!userId || !role) {
    console.warn("⚠️ Invalid join attempt:", { userId, role });
    return;
  }

  if (role === "admin") {
    socket.join("admin_all");
    console.log("➡️ Joined room: admin_all");
  } else {
    socket.join(`${role}_${userId}`);
    console.log(`➡️ Joined room: ${role}_${userId}`);
  }
});



  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", socket.id, "| reason:", reason);
  });
});



// ===== START SERVER =====
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
