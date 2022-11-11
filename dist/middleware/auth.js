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
exports.generateToken = void 0;
require("dotenv/config");
const jwt = require("jsonwebtoken");
const ErrorResponse = require('../utils/error-response');
const user_1 = require("./user");
let response;
// Protect routes
exports.protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get the key from db
        const { WalletAddress } = req.body;
        if (!WalletAddress) {
            return next(new ErrorResponse('AUTHERROR', 'User wallet address is missing'));
        }
        const user = new user_1.User(WalletAddress);
        const { success, data } = yield user.getAccess();
        // console.log(`${JSON.stringify(data)}}`);
        if (success === false) {
            return next(new ErrorResponse('AUTHERROR', 'The resourse is not authorized for unknown user'));
        }
        const secretKey = data.access;
        // console.log(`secretKey: ${secretKey}`)
        let token = '';
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Make sure token exists
        if (token === '') {
            return next(new ErrorResponse('AUTHMISSING', 'Not authorized to access this resource'));
        }
        // Verify token
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err)
                return next(err);
            if (decoded)
                next();
        });
    }
    catch (err) {
        return next(err);
    }
});
// Protect routes
exports.protectAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = '';
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // Make sure token exists
    if (token === '') {
        return next(new ErrorResponse('AUTHMISSING', 'Not authorized to access this resource'));
    }
    try {
        const secretKey = process.env.SECRET_KEY;
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err)
                return next(err);
            if (decoded)
                next();
        });
    }
    catch (err) {
        return next(err);
    }
});
function generateToken(walletAddress, objectId) {
    return __awaiter(this, void 0, void 0, function* () {
        // store sthe secret key in the db and process if successful
        const user = new user_1.User(walletAddress);
        response = yield user.saveAccess(objectId);
        const name = process.env.NAME;
        const signature = jwt.sign({ name: name }, objectId, { expiresIn: process.env.EXPIRY_TIME });
        response = {
            success: true,
            code: 200,
            data: { token: signature }
        };
        return response;
    });
}
exports.generateToken = generateToken;
//# sourceMappingURL=auth.js.map