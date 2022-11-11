"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_response_1 = require("../utils/error-response");
;
const errorHandler = (err, req, res, next) => {
    let error = Object.assign({}, err);
    error.message = err.message;
    /// Log to console for dev
    console.log(err);
    if (err.name == 'JsonWebTokenError') {
        const message = 'The token provided for authorization is invalid';
        error = new error_response_1.ErrorResponse('INVALIDTOKEN', message);
    }
    else if (err.name == 'TokenExpiredError') {
        const message = 'The token provided for authorization is no longer valid';
        error = new error_response_1.ErrorResponse('EXPIREDTOKEN', message);
    }
    else if (err.message.includes('call revert')) {
        const message = 'Smart contract call exception';
        error = new error_response_1.ErrorResponse('CALLEXCEPTION', message);
    }
    else if (err.name == 'PrismaClientValidationError') {
        const message = 'The db client cannot execute the query for some reason';
        error = new error_response_1.ErrorResponse(err.name, message);
    }
    else if (err.name === 'ETIMEDOUT') {
        const message = 'Timeout error';
        error = new error_response_1.ErrorResponse(err.name, message);
    }
    else if (err.name === '11000') {
        const message = 'Duplicate field value entered';
        error = new error_response_1.ErrorResponse(err.name, message);
    }
    else if (err.message.includes('properties')) {
        const message = 'Trying to access property of records with invalid id';
        error = new error_response_1.ErrorResponse(err.name, message);
    }
    else if (err.message.includes('Unique')) {
        const message = 'Some of the unique fields has already existing value';
        error = new error_response_1.ErrorResponse(err.name, message);
    }
    else if (err.message.includes('CALL_EXCEPTION')) {
        const message = 'Call to blockchain contract failed';
        error = new error_response_1.ErrorResponse(err.name, message);
    }
    else if (err.message.includes('constructor')) {
        const message = 'Wallet address is missing or invalid for authentication';
        error = new error_response_1.ErrorResponse(err.name, message);
    }
    else if (err.message.includes('chainId')) {
        const message = 'Trying to save project with already existing chain id';
        error = new error_response_1.ErrorResponse(err.name, message);
    }
    else {
        error = new error_response_1.ErrorResponse(err.name, err.message);
    }
    res.status(500).json({
        success: false,
        error: `${error.name}: ${error.message}`,
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.js.map