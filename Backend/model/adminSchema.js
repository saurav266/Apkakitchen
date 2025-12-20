import mongoose from "mongoose";
const adminSchema = new mongoose.Schema({
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
        enum: ['admin'],
        default: 'admin'
    },
    

});

export default mongoose.model("Admin", adminSchema);