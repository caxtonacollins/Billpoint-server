"use strict";
exports.__esModule = true;
exports.Wallets = void 0;
var mongoose_1 = require("mongoose");
var WalletSchema = new mongoose_1.Schema({
    walletName: { type: String, required: true },
    balance: { type: Number, "default": 0, required: true },
    billPointAccountNum: { type: String },
    monnifyAccountNum: {
        type: [
            {
                bankCode: { type: String },
                bankName: { type: String },
                accountNumber: { type: String },
                accountName: { type: String }
            },
        ],
        "default": []
    },
    user: { type: mongoose_1["default"].Schema.Types.ObjectId, ref: "Users" }
});
exports.Wallets = mongoose_1["default"].model("Wallets", WalletSchema);
