import { ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

enum TransactionType {
  DataServices = "Data Services",
  AirtimeRecharge = "Airtime Recharge",
  Deposit = "deposit",
  Withdraw = "withdraw",
  Airtime = "airtime",
  ElectricityBill = "Electricity Bill",
  Cable = "cable",
  TVSubscription = "TV Subscription",
  Education = "Education",
}

enum TransactionStatus {
  Successful = "success",
  Delivered = "delivered",
  Pending = "pending",
  Failed = "failed",
}

export interface ITransaction extends Document {
  user: ObjectId;
  transactionType: TransactionType;
  transactionId: string;
  details: string
  status: TransactionStatus;
  amount: number;
  date: Date;
  token?: string;
}

const TransactionSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId },
  transactionType: {
    type: String,
    enum: [
      "Data Services",
      "Airtime Recharge",
      "deposit",
      "withdraw",
      "airtime",
      "Electricity Bill",
      "cable",
      "TV Subscription",
      "Education"
    ],
    required: true,
  },
  transactionId: { type: String, required: true },
  details: { type: String, required: true },
  status: {
    type: String,
    enum: ["success", "delivered", "pending", "failed"],
    required: true,
  },
  amount: { type: Number, required: true },
  token: { type: String },
  date: { type: Date, required: true },
});

export const Transactions = mongoose.model<ITransaction>('Transactions', TransactionSchema);
