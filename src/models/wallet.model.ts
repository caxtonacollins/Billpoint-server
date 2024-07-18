import { Db, MongoClient, Collection, ObjectId } from "mongodb";
import mongoose, { Schema } from "mongoose";

export interface IWallet extends Document {
  _id: string;
  walletName: string;
  balance: number;
  billPointAccountNum: string;
  monnifyAccountNum: string[];
  user: string;
}

const WalletSchema: Schema = new Schema({
  walletName: { type: String, required: true },
  balance: { type: Number, default: 0, required: true },
  billPointAccountNum: { type: String },
  monnifyAccountNum: { 
    type: [{
      bankCode: { type: String },
      bankName: { type: String },
      accountNumber: { type: String },
      accountName: { type: String },
    }], 
    default: [] 
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
});

export const Wallets = mongoose.model<IWallet>("Wallets", WalletSchema);
