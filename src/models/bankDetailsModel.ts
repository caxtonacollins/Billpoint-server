import mongoose, { Schema } from "mongoose"

export interface IBankDetails extends Document {
   user: string,
   accountNumber: string,
   bankName: string,
   bankCode: string,
}

const BankDetailsSchema: Schema = new Schema({
   user: { type: mongoose.Schema.Types.ObjectId },
   bankName: { type: String, required: true },
   bankCode: { type: String, required: true },
   accountNumber: { type: String, default: 0, required: true },
})

export const BankDetails = mongoose.model<IBankDetails>('BankDetails', BankDetailsSchema);