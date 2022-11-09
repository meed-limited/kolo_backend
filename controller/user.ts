import { Request, Response, NextFunction } from 'express';
import { CustomResponse } from '../utils/interfaces';
import { StatusCodes } from '../utils/constants';
import { User } from '../middleware/user';
import { poll } from 'ethers/lib/utils';

let response: CustomResponse = { success: false, code: StatusCodes.BadRequest}

export const getUserAuthorization = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ObjectId, WalletAddress } = req.body;
        if (!ObjectId || !WalletAddress || ObjectId === '' || WalletAddress === '') {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'The required object id and/or wallet address is missing.' });
            return;
        }

        const { generateToken } = require('../middleware/auth');
        response = await generateToken(WalletAddress, ObjectId);

        res.status(response.code).json({ success: response.success, data: response.data });
    } catch (err) {
        next(err);
    }
}

export const increaseAdsCount = async(req: Request, res: Response, next: NextFunction) => {

    try {
        const { WalletAddress } = req.body;
        if (!WalletAddress) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'Wallet address is required' });
            return;
        }

        const user: User = new User(WalletAddress);
        const response = await user.increaseAdsCount();

        res.status(response.code).json({ success: response.success, message: response.message });
    } catch (err) {
        next(err);
    }
}

export const getAdsAndTokenCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { WalletAddress } = req.body;
        if (!WalletAddress) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'Wallet address is required' });
            return;
        }

        const user: User = new User(WalletAddress);
        const response = await user.getAdsAndTokenCount(WalletAddress);
        
        res.status(response.code).json({ success: response.success, data: response.data });
    } catch (err) {
        next(err);
    }
}

export const submitVote = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { WalletAddress, ProjectId, NumberOfTokensForVote } = req.body;

        if (!WalletAddress || !ProjectId || !NumberOfTokensForVote) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'Wallet address, ProjectId, and NumberOfTokensForVote are required' });
            return;
        }
        
        const user: User = new User(WalletAddress);
        const response = await user.castVote(ProjectId, NumberOfTokensForVote);

        res.status(response.code).json({ success: response.success, message: response.message });
    } catch (err) {
        next(err);
    }
}


export const requestTokenTransfer = async(req: Request, res: Response, next: NextFunction) => {

    try {
        const { WalletAddress } = req.body;

        if (!WalletAddress) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'Wallet address is required' });
            return;
        }
        
        const user: User = new User(WalletAddress);
        const response = await user.requestTokenTransfer(WalletAddress);

        res.status(response.code).json({ success: response.success, message: response.message });
    } catch (err) {
        next(err);
    }
}

/*

export const getCurrentPoll = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { ObjectId } = req.body;

        if (!ObjectId) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'The user device id is required for voting' });
            return;
        }
        
        const user: User = new User(ObjectId);
        const response = await user.getCurrentPoll();

        res.status(response.code).json({ success: response.success, data: response.data });
    } catch (err) {
        next(err);
    }
}

export const getCurrentProposals = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { ObjectId, PollId } = req.body;

        if (!ObjectId || !PollId) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'The user device id and current poll id are required for voting' });
            return;
        }
        
        const user: User = new User(ObjectId);
        const response = await user.getCurrentProposals(PollId);

        res.status(response.code).json({ success: response.success, data: response.data });
    } catch (err) {
        next(err);
    }
}

export const getOneProposal = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { ObjectId, PollId, ProposalId } = req.body;

        if (!ObjectId || !PollId || !ProposalId) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'The user device id, poll id, proposal id are required for voting' });
            return;
        }
        
        const user: User = new User(ObjectId);
        const response = await user.getOneProposal(PollId, ProposalId);

        res.status(response.code).json({ success: response.success, data: response.data });
    } catch (err) {
        next(err);
    }
}

// call this API after a user has made USDC transfer
export const yieldKolTokens = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const { Sender, Amount } = req.body;
        if (!Sender || !Amount) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'The sender address and amount are required to yield KOL tokens.' });
            return;
        }

    } catch (err) {
        next(err);
    }
}

*/