import mongoose from "mongoose";

const AutoReplyLogSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    lastSentAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AutoReplyLog", AutoReplyLogSchema);
