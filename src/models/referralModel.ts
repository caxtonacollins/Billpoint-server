import mongoose, { Schema, Document } from "mongoose";

export interface IReferral extends Document {
   _id?: string;
  referrer: mongoose.Schema.Types.ObjectId;
  referee: mongoose.Schema.Types.ObjectId;
  referralCode: string;
  reward: number;
  status: "pending" | "completed";
  createdAt: Date;
  referralBonus: number;
}

const ReferralSchema: Schema = new Schema({
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  referee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  referralCode: { type: String, required: true, unique: true },
  reward: { type: Number, required: true },
  referralBonus: { type: Number, default: 0, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export const Referral = mongoose.model<IReferral>("Referral", ReferralSchema);
