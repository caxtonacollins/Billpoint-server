import mongoose, { Schema, Document } from "mongoose";

export interface IAdminSettings extends Document {
  agentDiscount: {
    type: "percentage" | "flat";
    value: number;
  };
  dataCharge: number;
  airtimeDiscount: {
    type: "percentage" | "flat";
    value: number;
  };
  electricityCharge: {
    type: "percentage" | "flat";
    value: number;
  };
  withdrawalCharge: {
    type: "percentage" | "flat";
    value: number;
  };
  educationPinCharge: {
    type: "percentage" | "flat";
    value: number;
  };
  transferCharge: {
    type: "percentage" | "flat";
    value: number;
  };
  accountActivationByEmail: boolean;
  socialMedia: {
    twitter: string;
    facebook: string;
    linkedIn: string;
    instagram: string;
  };
}

const AdminSettingsSchema: Schema = new Schema({
  agentDiscount: {
    type: { type: String, enum: ["percentage", "flat"], required: true },
    value: { type: Number, required: true },
  },
  dataCharge: { type: Number, required: true },
  airtimeDiscount: {
    type: { type: String, enum: ["percentage", "flat"], required: true },
    value: { type: Number, required: true },
  },
  electricityCharge: {
    type: { type: String, enum: ["percentage", "flat"], required: true },
    value: { type: Number, required: true },
  },
  withdrawalCharge: {
    type: { type: String, enum: ["percentage", "flat"], required: true },
    value: { type: Number, required: true },
  },
  educationPinCharge: {
    type: { type: String, enum: ["percentage", "flat"], required: true },
    value: { type: Number, required: true },
  },
  transferCharge: {
    type: { type: String, enum: ["percentage", "flat"], required: true },
    value: { type: Number, required: true },
  },
  accountActivationByEmail: { type: Boolean, required: true, default: false },
  socialMedia: {
    twitter: { type: String, required: false },
    facebook: { type: String, required: false },
    linkedIn: { type: String, required: false },
    instagram: { type: String, required: false },
  },
});

const AdminSettings = mongoose.model<IAdminSettings>(
  "AdminSettings",
  AdminSettingsSchema
);

export default AdminSettings;
