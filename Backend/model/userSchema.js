import mongoose from "mongoose";
// import { forgetPassword } from "../controllers/UserController";

const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      enum: ["Home", "Work", "Other"],
      default: "Home"
    },

    addressLine: {
      type: String,
      required: true
    },

    city: {
      type: String,
      required: true
    },

    state: {
      type: String,
      required: true
    },

    pincode: {
      type: String,
      required: true
    },

    isCurrent: {
      type: Boolean,
      default: false
    }
  },
  { _id: true }
);

const userSchema = new mongoose.Schema({
    name: {
        type: String,   
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select : false // Exclude password from queries by default
    },
    // avtar:{
    //     public_id:{
    //         trype: String,
    //     },
    //     secure_url:{
    //         type: String,
    //     }
    // },
    // role:{
    //     type: String,
    //     enum: ['USER', 'ADMIN'],
    //     default: 'USER '
    // },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        //required: true
    },
    codeExpiry: {
        type: Date,
       
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'delivery'],
        default: 'user'
    },
    addresses: [addressSchema],

    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,

    createdAt: {
        type: Date,
        default: Date.now
    }
}, { 
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;