import express, { Request, Response, NextFunction } from 'express';
import 'dotenv/config'
import jwt = require('jsonwebtoken');
const ErrorResponse = require('../utils/error-response');
import { User } from './user';
import { CustomResponse } from '../utils/interfaces';
let response: CustomResponse;


// Protect routes
exports.protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get the key from db
        const { WalletAddress } = req.body;
        if (!WalletAddress) {
            return next(new ErrorResponse('AUTHERROR', 'User wallet address is missing'));
        }

        const user = new User(WalletAddress);
        const { success, data }: any = await user.getAccess();
        // console.log(`${JSON.stringify(data)}}`);
        
        if (success === false) {
            return next(new ErrorResponse('AUTHERROR', 'The resourse is not authorized for unknown user'));
        }
        const secretKey: string  = data.access;
        // console.log(`secretKey: ${secretKey}`)

        let token: string = '';
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        // Make sure token exists
        if(token === '') {
            return next(new ErrorResponse('AUTHMISSING', 'Not authorized to access this resource'));
        }

        // Verify token
        jwt.verify(token, secretKey, (err: Error | null, decoded: any) => {
            if (err) return next(err)
            if (decoded) next();
        });
    } catch (err) {
        return next(err);
    }
};

// Protect routes
exports.protectAdmin = async (req: Request, res: Response, next: NextFunction) => {
    let token: string = '';

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Make sure token exists
    if(token === '') {
        return next(new ErrorResponse('AUTHMISSING', 'Not authorized to access this resource'));
    }

    try {
        const secretKey: any = process.env.SECRET_KEY;
        jwt.verify(token, secretKey, (err: Error | null, decoded: any) => {
            if (err) return next(err)
            if (decoded) next();
        });
    } catch (err) {
        return next(err);
    }
};

export async function generateToken(walletAddress: string, objectId: string): Promise<CustomResponse> {

    // store sthe secret key in the db and process if successful
    const user: User = new User(walletAddress);
    response = await user.saveAccess(objectId);

    const name: any = process.env.NAME;
    const signature = jwt.sign({name: name}, objectId, { expiresIn: process.env.EXPIRY_TIME });

    response = {
        success: true,
        code: 200,
        data: { token: signature}
    }

    return response;
}