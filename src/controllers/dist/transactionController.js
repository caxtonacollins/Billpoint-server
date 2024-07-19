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
var mongodb_1 = require("mongodb");
var transactionModel_1 = require("../models/transactionModel");
var transactionService_1 = require("../services/transactionService");
var paystack_1 = require("../services/paystack");
var monnifyService_1 = require("../services/monnifyService");
/**
 * @class TransactionController
 */
var TransactionController = /** @class */ (function () {
    function TransactionController() {
    }
    /**
     * @method verifyAccountData
     * @static
     * @async
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {object}
     */
    TransactionController.verifyAccountData = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, bankName, accountNumber, response, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, bankName = _a.bankName, accountNumber = _a.accountNumber;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, paystack_1["default"].getBankCode(bankName, accountNumber)];
                    case 2:
                        response = _b.sent();
                        if (!response) {
                            throw new Error("something went wrong");
                        }
                        res.status(200).json({
                            error: false,
                            data: response.account_name,
                            message: "verification success"
                        });
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        next(err_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @method initateTransaction
     * @static
     * @async
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {object}
     */
    TransactionController.initateTransaction = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, bankName, accountNumber, response, err_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, bankName = _a.bankName, accountNumber = _a.accountNumber;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, transactionService_1["default"].initiateTransaction(bankName, accountNumber)];
                    case 2:
                        response = _b.sent();
                        if (!response) {
                            throw new Error("something went wrong");
                        }
                        res
                            .status(200)
                            .json({ error: false, data: response, message: "success" });
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _b.sent();
                        next(err_2);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @method sendMoneyToUser
     * @static
     * @async
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {object}
     */
    TransactionController.sendMoneyToUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, walletNumber, amount, sendMoney, err_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = req.user.id;
                        _a = req.body, walletNumber = _a.walletNumber, amount = _a.amount;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, transactionService_1["default"].sendMoney(userId, walletNumber, amount)];
                    case 2:
                        sendMoney = _b.sent();
                        if (sendMoney) {
                            res
                                .status(200)
                                .json({ error: false, message: "money sent successfully" });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _b.sent();
                        next(err_3);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @method withdrawFromWallet
     * @static
     * @async
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {object}
     */
    TransactionController.withDrawFromWallet = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, amount, narration, withdrawal, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.user.id;
                        amount = req.body.amount;
                        narration = "withrawal from wallet";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, transactionService_1["default"].withdrawWalletBalance(userId, amount, narration)];
                    case 2:
                        withdrawal = _a.sent();
                        if (withdrawal) {
                            res
                                .status(200)
                                .json({ error: false, message: "withdrawal successful" });
                        }
                        else {
                            res.status(400).json({ error: true, message: "Withdrawal failed" });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error("Error occurred:", error_1.message);
                        res
                            .status(500)
                            .json({ error: true, message: "An internal error occurred" });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @method sendMoneyToUserBank
     * @static
     * @async
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     * @returns {object}
     */
    TransactionController.sendMoneyToUserBank = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, amount, recipient, reason, sendMoney, err_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = req.user.id;
                        _a = req.body, amount = _a.amount, recipient = _a.recipient, reason = _a.reason;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, transactionService_1["default"].sendMoneyToBank(userId, amount, reason, recipient)];
                    case 2:
                        sendMoney = _b.sent();
                        if (sendMoney) {
                            res
                                .status(200)
                                .json({ error: false, message: "money sent successfully" });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _b.sent();
                        next(err_4);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @method getTransactionById
     * @static
     * @async
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise}
     */
    TransactionController.getTransactionById = function (req, res) {
        return __awaiter(this, void 0, Promise, function () {
            var id, transaction, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        id = req.params.id;
                        return [4 /*yield*/, transactionModel_1.Transactions.findOne({
                                _id: new mongodb_1.ObjectId(id)
                            })];
                    case 1:
                        transaction = _a.sent();
                        if (!transaction)
                            throw new Error("transaction not found 🥲");
                        res.status(200).json({ error: false, data: transaction });
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        console.error(error_2);
                        res.status(500).json({ error: true, message: error_2.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @method getTransactionByUserId
     * @static
     * @async
     * @param {Request} req
     * @param {Response} res
     * @returns {Promise}
     */
    TransactionController.getTransactionByUserId = function (req, res) {
        return __awaiter(this, void 0, Promise, function () {
            var userId, transaction, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = req.params.id;
                        return [4 /*yield*/, transactionModel_1.Transactions.find({ user: userId })];
                    case 1:
                        transaction = _a.sent();
                        if (!transaction)
                            throw new Error("transaction not found 🥲");
                        res.status(200).json({ error: false, data: transaction });
                        return [3 /*break*/, 3];
                    case 2:
                        error_3 = _a.sent();
                        console.error(error_3);
                        res.status(500).json({ error: true, message: error_3.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    TransactionController.authorizeTransfer = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, monnifyService_1.authorizeTransfer(req.body)];
                    case 1:
                        _a.sent();
                        res.status(200).json({ error: false, message: "Transaction successful" });
                        return [3 /*break*/, 3];
                    case 2:
                        error_4 = _a.sent();
                        res.status(200).json({ error: true, message: error_4.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return TransactionController;
}());
exports["default"] = TransactionController;
