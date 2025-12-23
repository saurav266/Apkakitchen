import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './db/db.js';


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
    res.send('Welcome to the Serger API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
