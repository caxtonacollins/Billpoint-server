"use strict";
exports.__esModule = true;
var express_1 = require("express");
var transactionController_1 = require("../controllers/transactionController");
var Authenticate_1 = require("../middlewares/guard/Authenticate");
var router = express_1.Router();
router.get("/:id", transactionController_1["default"].getTransactionById);
router.get("/user/:id", transactionController_1["default"].getTransactionByUserId);
router.post("/withDrawFromWallet", Authenticate_1.Authenticate, transactionController_1["default"].withDrawFromWallet);
exports["default"] = router;