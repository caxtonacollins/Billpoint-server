"use strict";
exports.__esModule = true;
exports.Users = void 0;
var mongoose_1 = require("mongoose");
// Create the User schema
var UserSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    number: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, "default": false },
    verificationOTP: { type: Number },
    otpCreationTime: { type: Date },
    transactionPin: { type: String },
    role: { type: String, "enum": ["user", "admin", "agent"], "default": "user" },
    wallet: { type: mongoose_1["default"].Schema.Types.ObjectId, ref: "Wallets" },
    status: {
        type: String,
        required: true,
        "enum": ["Active", "Inactive", "suspended"],
        "default": "Inactive"
    },
    referral: {
        type: mongoose_1["default"].Schema.Types.ObjectId,
        ref: "Referral"
    }
});
exports.Users = mongoose_1["default"].model("Users", UserSchema);
