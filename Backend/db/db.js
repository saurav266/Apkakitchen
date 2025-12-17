import mongoose from "mongoose";
import 'dotenv/config';

mongoose.set('strictQuery', false); // Disable strict query mode
const connectDB = async () => {
    try{
        await mongoose.connect(process.env.DATABASE_URL,)
        console.log("MongoDB connected successfully");
    }
    catch(error){
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit the process with failure
    }
     
}
export default connectDB;
export { connectDB };