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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testPermit = exports.makePayment = exports.closePoll = exports.startPoll = void 0;
const constants_1 = require("../utils/constants");
const user_1 = require("../middleware/user");
let response = { success: false, code: constants_1.StatusCodes.BadRequest };
const startPoll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notRequiredId } = req.body; //'adm1nk0l0'
        if (!notRequiredId) {
            res.status(constants_1.StatusCodes.BadRequest).json({ success: false, message: 'Admin id is missing' });
            return;
        }
        const user = new user_1.User(notRequiredId);
        const response = yield user.startPoll();
        res.status(response.code).json({ success: response.success, message: response.message });
    }
    catch (err) {
        next(err);
    }
});
exports.startPoll = startPoll;
const closePoll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { notRequiredId } = req.body; //'adm1nk0l0'
        if (!notRequiredId) {
            res.status(constants_1.StatusCodes.BadRequest).json({ success: false, message: 'Admin id is missing' });
            return;
        }
        const user = new user_1.User(notRequiredId);
        const response = yield user.closePoll();
        res.status(response.code).json({ success: response.success, message: response.message });
    }
    catch (err) {
        next(err);
    }
});
exports.closePoll = closePoll;
const makePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(response.code).json({ success: response.success, message: response.message });
    }
    catch (err) {
        next(err);
    }
});
exports.makePayment = makePayment;
const testPermit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { WalletAddress, AmountRequired, Identity } = req.body;
        if (!WalletAddress || !AmountRequired || !Identity) {
            res.status(constants_1.StatusCodes.BadRequest).json({ success: false, message: 'Wallet address, amount, and identity are required' });
            return;
        }
        const user = new user_1.User(WalletAddress);
        // verify the identity
        let response = yield user.validateSignature(AmountRequired, Identity);
        res.status(response.code).json({ success: response.success, message: response.message });
    }
    catch (err) {
        next(err);
    }
});
exports.testPermit = testPermit;
//# sourceMappingURL=admin.js.map