import mongoose from "mongoose";
// import { forgetPassword } from "../controllers/UserController";
import bcrypt from "bcryptjs";
const cartItemSchema = new mongoose.Schema(
  {
    cartItemId: {
      type: String,
      required: true, // productId or productId_variantId
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variant: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    qty: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { _id: false }
);

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
    isActive: {
  type: Boolean,
  default: true   // ✅ users active by default},
},  
    role: {
        type: String,
        enum: ['user', 'admin', 'delivery'],
        default: 'user'
    },
    addresses: [addressSchema],
 cart: {
      type: [cartItemSchema],
      default: [],
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

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});


const User = mongoose.model('User', userSchema);
export default User;