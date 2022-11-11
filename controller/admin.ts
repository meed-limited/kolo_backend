import { Request, Response, NextFunction } from 'express';
import { CustomResponse } from '../utils/interfaces';
import { StatusCodes } from '../utils/constants';
import { User } from '../middleware/user';
import { poll } from 'ethers/lib/utils';

let response: CustomResponse = { success: false, code: StatusCodes.BadRequest}

export const startPoll = async(req: Request, res: Response, next: NextFunction) => {

    try {
        const { notRequiredId } = req.body; //'adm1nk0l0'
        if (!notRequiredId) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'Admin id is missing' });
            return;
        }

        const user: User = new User(notRequiredId);
        const response = await user.startPoll();

        res.status(response.code).json({ success: response.success, message: response.message });
    } catch (err) {
        next(err);
    }
}

export const closePoll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { notRequiredId } = req.body; //'adm1nk0l0'
        if (!notRequiredId) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'Admin id is missing' });
            return;
        }

        const user: User = new User(notRequiredId);
        const response = await user.closePoll();

        res.status(response.code).json({ success: response.success, message: response.message });
    } catch (err) {
        next(err);
    }
}

export const makePayment = async(req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(response.code).json({ success: response.success, message: response.message });
    } catch (err) {
        next(err);
    }
}

export const testPermit = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { WalletAddress, AmountRequired, Identity } = req.body;

        if (!WalletAddress || !AmountRequired || !Identity) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'Wallet address, amount, and identity are required' });
            return;
        }

        const user: User = new User(WalletAddress);

        // verify the identity
        let response = await user.validateSignature(AmountRequired, Identity);
      
        res.status(response.code).json({ success: response.success, message: response.message });
    } catch (err) {
        next(err);
    }
}