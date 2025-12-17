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
app.use(cors());
app.use(express.json());    
app.use(cookieParser());


app.use('/api/users', UserRoute);

app.get('/', (req, res) => {
    res.send('Welcome to the Serger API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
