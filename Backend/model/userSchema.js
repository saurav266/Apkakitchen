import mongoose from "mongoose";
// import { forgetPassword } from "../controllers/UserController";

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