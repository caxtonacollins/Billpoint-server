"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
// import { ICreateTransaction } from "../interfaces/ICreateTransaction";
// import PaystackService from "./external/paystack";
var bankDetailsModel_1 = require("../models/bankDetailsModel");
var transactionModel_1 = require("../models/transactionModel");
var wallet_model_1 = require("../models/wallet.model");
var paystack_1 = require("./paystack");
var walletService_1 = require("./walletService");
/**
 * @class TransactionService
 */
var TransactionService = /** @class */ (function () {
    function TransactionService() {
    }
    /**
     * @method createTransaction
     * @static
     * @async
     * @param {object} data
     * @returns {Promise<UserTransactionDetails>}
     */
    TransactionService.createTransaction = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, transactionModel_1.Transactions.create(data)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @method sendMoney
     * @static
     * @async
     * @param {object} data
     * @returns {Promise<UserTransactionDetails>}
     */
    // Sending money to a billspoint account
    TransactionService.sendMoney = function (senderId, walletNumber, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var senderWallet, receiverWallet;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, wallet_model_1.Wallets.findOne({ user: senderId })];
                    case 1:
                        senderWallet = _a.sent();
                        return [4 /*yield*/, wallet_model_1.Wallets.findOne({
                                billPointAccountNum: walletNumber
                            })];
                    case 2:
                        receiverWallet = _a.sent();
                        if (!(senderWallet && receiverWallet)) return [3 /*break*/, 5];
                        if (senderWallet.balance < amount) {
                            throw new Error("insufficient balance");
                        }
                        // update sender wallet balance
                        return [4 /*yield*/, walletService_1.updateWallet(senderId, amount, "EXPENSE")];
                    case 3:
                        // update sender wallet balance
                        _a.sent();
                        //update receiver wallet balance
                        return [4 /*yield*/, walletService_1.updateWallet(receiverWallet.user, amount, "INCOME")];
                    case 4:
                        //update receiver wallet balance
                        _a.sent();
                        return [2 /*return*/, true];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @method initiateTrasaction
     * @static
     * @async
     * @param {object} data
     * @returns {Promise<UserTransactionDetails>}
     */
    TransactionService.initiateTransaction = function (bankName, accountNumber) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, paystack_1["default"].createRecipient(bankName, accountNumber)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    /**
     * @method withdrawWalletBalance
     * @static
     * @async
     * @param {object} data
     * @returns {Promise<UserTransactionDetails>}
     */
    TransactionService.withdrawWalletBalance = function (userId, amount, reason, recipient) {
        return __awaiter(this, void 0, void 0, function () {
            var userWallet, userBank, withdrawal;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, wallet_model_1.Wallets.findOne({ user: userId })];
                    case 1:
                        userWallet = _a.sent();
                        return [4 /*yield*/, bankDetailsModel_1.BankDetails.findOne({ user: userId })];
                    case 2:
                        userBank = _a.sent();
                        if (!userWallet) {
                            throw new Error("User wallet not found");
                        }
                        if (!userBank) {
                            throw new Error("add bank account");
                        }
                        if (userWallet.balance < amount) {
                            throw new Error("insufficient balance");
                        }
                        return [4 /*yield*/, paystack_1["default"].makePayment(amount, reason, recipient)];
                    case 3:
                        withdrawal = _a.sent();
                        if (!withdrawal) return [3 /*break*/, 5];
                        // update sender wallet balance
                        return [4 /*yield*/, walletService_1.updateWallet(userId, amount, "EXPENSE")];
                    case 4:
                        // update sender wallet balance
                        _a.sent();
                        return [2 /*return*/, withdrawal];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @method sendMoneyToBank
     * @static
     * @async
     * @param {object} data
     * @returns {Promise<UserTransactionDetails>}
     */
    TransactionService.sendMoneyToBank = function (userId, amount, reason, recipient) {
        return __awaiter(this, void 0, void 0, function () {
            var userWallet, sentMoney;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, wallet_model_1.Wallets.findOne({ user: userId })];
                    case 1:
                        userWallet = _a.sent();
                        if (!userWallet)
                            throw new Error("user wallet not found");
                        if (userWallet.balance < amount) {
                            throw new Error("insufficient balance");
                        }
                        return [4 /*yield*/, paystack_1["default"].makePayment(amount, reason, recipient)];
                    case 2:
                        sentMoney = _a.sent();
                        if (!sentMoney) return [3 /*break*/, 4];
                        // update sender wallet balance
                        return [4 /*yield*/, walletService_1.updateWallet(userId, amount, "EXPENSE")];
                    case 3:
                        // update sender wallet balance
                        _a.sent();
                        return [2 /*return*/, sentMoney];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return TransactionService;
}());
exports["default"] = TransactionService;
