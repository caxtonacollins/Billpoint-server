"use strict";
exports.__esModule = true;
exports.BankDetails = void 0;
var mongoose_1 = require("mongoose");
var BankDetailsSchema = new mongoose_1.Schema({
    user: { type: mongoose_1["default"].Schema.Types.ObjectId },
    bankName: { type: String, required: true },
    bankCode: { type: String, required: true },
    accountNumber: { type: String, "default": 0, required: true }
});
exports.BankDetails = mongoose_1["default"].model('BankDetails', BankDetailsSchema);
