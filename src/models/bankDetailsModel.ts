import mongoose, { Schema } from "mongoose"

export interface IBankDetails extends Document {
   user: string,
   accountNumber: number,
   bankName: string,
}

const BankDetailsSchema: Schema = new Schema({
   user: { type: mongoose.Schema.Types.ObjectId },
   bankName: { type: String, required: true },
   accountNumber: { type: Number, default: 0, required: true },
})

export const BankDetails = mongoose.model<IBankDetails>('BankDetails', BankDetailsSchema);