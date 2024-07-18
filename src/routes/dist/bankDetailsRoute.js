"use strict";
exports.__esModule = true;
var express_1 = require("express");
var bankDetailsController_1 = require("../controllers/bankDetailsController");
var Authenticate_1 = require("../middlewares/guard/Authenticate");
var router = express_1.Router();
router.post("/", Authenticate_1.Authenticate, bankDetailsController_1["default"].createOrUpdateBankDetails);
router.get("/", Authenticate_1.Authenticate, bankDetailsController_1["default"].getBankDetails);
exports["default"] = router;
