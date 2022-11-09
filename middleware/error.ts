import express, { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/error-response';
;
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

    let error: Error = { ... err };
    error.message = err.message;

    /// Log to console for dev
    console.log(err);

    if (err.name == 'JsonWebTokenError') {
        const message = 'The token provided for authorization is invalid';
        error = new ErrorResponse('INVALIDTOKEN', message);
    }

    else if (err.name == 'TokenExpiredError') {
        const message = 'The token provided for authorization is no longer valid';
        error = new ErrorResponse('EXPIREDTOKEN', message);
    }

    else if (err.message.includes('call revert')) {
        const message = 'Smart contract call exception';
        error = new ErrorResponse('CALLEXCEPTION', message);
    }

    else if (err.name == 'PrismaClientValidationError') {
        const message = 'The db client cannot execute the query for some reason';
        error = new ErrorResponse(err.name, message);
    }

    else if (err.name === 'ETIMEDOUT') {
        const message = 'Timeout error';
        error = new ErrorResponse(err.name, message);
    }
    
    else if (err.name === '11000') {
        const message = 'Duplicate field value entered';
        error = new ErrorResponse(err.name, message);
    }

    else if (err.message.includes('properties')) {
        const message = 'Trying to access property of records with invalid id';
        error = new ErrorResponse(err.name, message);
    }

    else if (err.message.includes('chainId')) {
        const message = 'Trying to save project with already existing chain id';
        error = new ErrorResponse(err.name, message);
    }
    
    else {
        error = new ErrorResponse(err.name, err.message);
    }

    res.status(500).json({
        success: false,
        error: `${error.name}: ${error.message}`,
    });
}