import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { IWallet } from "./wallet.model";

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  password: string;
  wallet: IWallet;
  email: string;
  number: number;
  verified: boolean;
  verificationOTP: number;
  transactionPin?: string;
  otpCreationTime?: Date;
  role: string;
  referral?: string;
}

// Create the User schema
const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  number: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  suspended: { type: Boolean, default: false },
  verificationOTP: { type: Number },
  role: { type: String, enum: ['user', 'admin', 'agent'], default: 'user' },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallets' },
  status: {
    type: String,
    required: true,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  referral: { type: mongoose.Schema.Types.ObjectId, ref: 'Referral', required: true }
});

export const Users = mongoose.model<IUser>("Users", UserSchema);
