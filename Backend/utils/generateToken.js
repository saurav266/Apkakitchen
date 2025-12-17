import jwt from "jsonwebtoken";
import 'dotenv/config';


console.log("JWT Secret:", process.env.JWT_SECRET); // Debugging line to check if JWT_SECRET is loaded
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // ✅ 7 days login
  );
};

