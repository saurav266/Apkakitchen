import jwt from "jsonwebtoken";
import 'dotenv/config';


console.log("JWT Secret:", process.env.JWT_SECRET); // Debugging line to check if JWT_SECRET is loaded
export const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};
