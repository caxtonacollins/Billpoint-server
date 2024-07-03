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
}

// Create the User schema
const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  number: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  verificationOTP: { type: Number },
  wallet: { type: mongoose.Schema.Types.ObjectId, ref: 'Wallets' },
  status: {
    type: String,
    required: true,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
});

// Create and export the User model
export const Users = mongoose.model<IUser>("Users", UserSchema);
