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
exports.updateWallet = void 0;
var accountNumberGen_1 = require("../helpers/accountNumberGen");
var wallet_model_1 = require("../models/wallet.model");
var console_1 = require("console");
function updateWallet(user, amount, type) {
    return __awaiter(this, void 0, void 0, function () {
        var userWallet, newBalance, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, wallet_model_1.Wallets.findOne({ user: user })];
                case 1:
                    userWallet = _a.sent();
                    if (!userWallet)
                        throw new Error("Wallet not found");
                    newBalance = void 0;
                    // add amount to walletbalance if type income
                    if (type === "INCOME") {
                        newBalance = userWallet.balance + amount;
                    }
                    // reduct payment from wallet balance if type payment
                    if (type === "EXPENSE") {
                        if (amount > userWallet.balance) {
                            throw new Error("payment can't be greater than current wallet balance");
                        }
                        newBalance = userWallet.balance - amount;
                    }
                    //update wallet balance
                    return [4 /*yield*/, wallet_model_1.Wallets.updateOne({ user: user }, { $set: { balance: newBalance } })];
                case 2:
                    //update wallet balance
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console_1.log(error_1);
                    throw new Error(error_1.message);
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.updateWallet = updateWallet;
/**
 * @class WalletService
 */
var WalletService = /** @class */ (function () {
    function WalletService() {
    }
    /**
     * @method createWallet
     * @static
     * @async
     * @param {string} user
     * @param {string} firstName
     * @param {string} lastName
     *
     * @returns {Promise<void>}
     */
    WalletService.createWallet = function (user, firstName, lastName) {
        return __awaiter(this, void 0, void 0, function () {
            var walletName, billPointAccountNum, walletData, newWallet, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        walletName = " " + firstName + " " + lastName;
                        billPointAccountNum = accountNumberGen_1.generateAccountNumber();
                        walletData = {
                            user: user,
                            walletName: walletName,
                            billPointAccountNum: billPointAccountNum
                        };
                        return [4 /*yield*/, wallet_model_1.Wallets.create(walletData)];
                    case 1:
                        newWallet = _a.sent();
                        return [2 /*return*/, newWallet];
                    case 2:
                        error_2 = _a.sent();
                        console.error(error_2);
                        throw new Error(error_2.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @method addMoneyToWallet
     * @static
     * @async
     * @param {number} amount
     * @returns {Promise<void>}
     */
    WalletService.addMoneyToWalet = function (user, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, updateWallet(user, amount, "INCOME")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, "success"];
                    case 2:
                        error_3 = _a.sent();
                        console.log(error_3);
                        throw new Error(error_3.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * @method subtractMoneyFromWalet
     * @static
     * @async
     * @param {number} amount
     * @returns {Promise<void>}
     */
    WalletService.subtractMoneyFromWalet = function (user, amount) {
        return __awaiter(this, void 0, void 0, function () {
            var error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, updateWallet(user, amount, "EXPENSE")];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, "success"];
                    case 2:
                        error_4 = _a.sent();
                        console.log(error_4);
                        throw new Error(error_4.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return WalletService;
}());
exports["default"] = WalletService;
