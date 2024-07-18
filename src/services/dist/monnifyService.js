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
exports.getAllBanks = exports.getAllTransfer = exports.getWalletBalance = exports.getTransferStatus = exports.initiateTransfer = exports.getReservedAccountDetails = exports.createReserveAccount = void 0;
var axios_1 = require("axios");
var console_1 = require("console");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
/**
 * generate monnify access token
 *
 */
var getAccessToken = function () { return __awaiter(void 0, void 0, void 0, function () {
    var key, secret, accessToken, basicAuth, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                key = process.env.MONNIFY_API_KEY;
                secret = process.env.MONNIFY_SECRET_KEY;
                accessToken = process.env.MONNIFY_ACCESSTOKEN_URL;
                console_1.log(key, secret, accessToken);
                if (!key || !secret || !accessToken) {
                    throw new Error("Please make sure all environment variables are defined.");
                }
                basicAuth = Buffer.from(key + ":" + secret).toString("base64");
                return [4 /*yield*/, axios_1["default"].post(accessToken, {
                        body: ""
                    }, {
                        headers: {
                            Authorization: "Basic " + basicAuth
                        }
                    })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data.responseBody.accessToken];
        }
    });
}); };
exports.createReserveAccount = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, firstName, firstThreeLetters, accountName, payload, configurations, response, accountDetails, accountNumbers, walletUpdateDate, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, getAccessToken()];
            case 1:
                accessToken = _a.sent();
                firstName = user.firstName;
                firstThreeLetters = firstName.substring(0, 3);
                accountName = "BillPoint-" + firstThreeLetters;
                payload = {
                    accountReference: user._id,
                    accountName: accountName,
                    currencyCode: "NGN",
                    contractCode: process.env.MONNIFY_CONTRACT_CODE,
                    customerEmail: user.email,
                    customerName: user.firstName + " " + user.lastName,
                    getAllAvailableBanks: true
                };
                configurations = {
                    method: "post",
                    url: process.env.MONNIFY_RESERVE_ACCT_URL,
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        "Content-Type": "application/json"
                    },
                    data: payload
                };
                return [4 /*yield*/, axios_1["default"](configurations)];
            case 2:
                response = _a.sent();
                if (response.status === 200) {
                    // Account created successfully.
                    console.log("Account created successfully, " + accountName);
                    accountDetails = response.data.responseBody.accounts;
                    accountNumbers = response.data.responseBody.accounts.map(function (account) { return account.accountNumber; });
                    walletUpdateDate = {
                        walletName: accountDetails.accountName,
                        user: user._id,
                        monnifyAccountNum: accountNumbers
                    };
                }
                else {
                    // Handle errors or failed responses.
                    console.error("message response:" + response);
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                // Handle error response
                if (error_1.response) {
                    console.error("Server responded with:", error_1.response.status);
                    console.error("Response data:", error_1.response.data);
                }
                else if (error_1.request) {
                    // The request was made but no response was received
                    console.error("No response received:", error_1.request);
                }
                else {
                    // Something happened in setting up the request that triggered an Error
                    console.error("Request setup error:", error_1.message);
                    throw new Error(error_1.message);
                }
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getReservedAccountDetails = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var API_URL, accountReference, accessToken, path, headers, response, accounts, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                API_URL = process.env.MONNIFY_RESERVE_ACCT_DETAILS_URL;
                accountReference = userId;
                return [4 /*yield*/, getAccessToken()];
            case 1:
                accessToken = _a.sent();
                path = API_URL + "/" + accountReference;
                headers = {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken
                };
                return [4 /*yield*/, axios_1["default"].get(path, { headers: headers })];
            case 2:
                response = _a.sent();
                accounts = response.data.responseBody.accounts;
                //  .map(
                //    (account) => account.accountNumber
                //  );
                // Return the response to the client
                return [2 /*return*/, { accounts: accounts }];
            case 3:
                error_2 = _a.sent();
                // Handle errors here
                console.error("Error fetching Monnify account details:", error_2);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.initiateTransfer = function (user, amount, narration, destinationBankCode, destinationAccountNumber, sourceAccountNumber, destinationAccountName) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, payload, configurations, response, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, getAccessToken()];
            case 1:
                accessToken = _a.sent();
                payload = {
                    amount: amount,
                    reference: user._id,
                    narration: narration,
                    destinationBankCode: destinationBankCode,
                    destinationAccountNumber: destinationAccountNumber,
                    currency: "NGN",
                    sourceAccountNumber: sourceAccountNumber,
                    destinationAccountName: destinationAccountName
                };
                configurations = {
                    method: "post",
                    url: process.env.MONNIFY_INITIATE_TRANSFER_URL,
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        "Content-Type": "application/json"
                    },
                    data: payload
                };
                return [4 /*yield*/, axios_1["default"](configurations)];
            case 2:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 3:
                error_3 = _a.sent();
                console_1.log(error_3);
                throw new Error(error_3);
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getTransferStatus = function (reference) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, API_URL, path, headers, response, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAccessToken()];
            case 1:
                accessToken = _a.sent();
                API_URL = process.env.MONNIFY_GET_TRANSFER_STATUS;
                path = API_URL + "?reference=" + { reference: reference };
                headers = {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken
                };
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1["default"].get(path, { headers: headers })];
            case 3:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 4:
                error_4 = _a.sent();
                console_1.log(error_4);
                throw new Error(error_4);
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getWalletBalance = function (walletAccountNumber) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, API_URL, path, headers, response, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAccessToken()];
            case 1:
                accessToken = _a.sent();
                API_URL = process.env.MONNIFY_WALLET_BALANCE_URL;
                path = API_URL + "?accountNumber=" + { walletAccountNumber: walletAccountNumber };
                headers = {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken
                };
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1["default"].get(path, { headers: headers })];
            case 3:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 4:
                error_5 = _a.sent();
                console_1.log(error_5);
                throw new Error(error_5);
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getAllTransfer = function (pageSize, pageNo) { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, API_URL, pageSizee, pageNoo, path, headers, response, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAccessToken()];
            case 1:
                accessToken = _a.sent();
                API_URL = process.env.MONNIFY_GET_ALL_TRANSFER;
                pageSizee = pageSize || 5;
                pageNoo = pageNo || 1;
                path = API_URL + "?pageSize=" + pageSizee + "&pageNo=" + pageNoo;
                headers = {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + accessToken
                };
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, axios_1["default"].get(path, { headers: headers })];
            case 3:
                response = _a.sent();
                return [2 /*return*/, response.data];
            case 4:
                error_6 = _a.sent();
                console_1.log(error_6);
                throw new Error(error_6);
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.getAllBanks = function () { return __awaiter(void 0, void 0, void 0, function () {
    var accessToken, configurations, response, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                return [4 /*yield*/, getAccessToken()];
            case 1:
                accessToken = _a.sent();
                configurations = {
                    method: "get",
                    url: process.env.MONNIFY_GET_ALL_BANKS,
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                return [4 /*yield*/, axios_1["default"](configurations)];
            case 2:
                response = _a.sent();
                console_1.log(response.data);
                return [2 /*return*/, response.data];
            case 3:
                error_7 = _a.sent();
                console_1.log(error_7);
                throw new Error(error_7);
            case 4: return [2 /*return*/];
        }
    });
}); };
