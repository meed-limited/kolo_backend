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
exports.requestTokenTransfer = exports.submitVote = exports.getAdsAndTokenCount = exports.increaseAdsCount = exports.getUserAuthorization = void 0;
const constants_1 = require("../utils/constants");
const user_1 = require("../middleware/user");
let response = { success: false, code: constants_1.StatusCodes.BadRequest };
const getUserAuthorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ObjectId, WalletAddress } = req.body;
        if (!ObjectId || !WalletAddress || ObjectId === '' || WalletAddress === '') {
            res.status(constants_1.StatusCodes.BadRequest).json({ success: false, message: 'The required object id and/or wallet address is missing.' });
            return;
        }
        const { generateToken } = require('../middleware/auth');
        response = yield generateToken(WalletAddress, ObjectId);
        res.status(response.code).json({ success: response.success, data: response.data });
    }
    catch (err) {
        next(err);
    }
});
exports.getUserAuthorization = getUserAuthorization;
const increaseAdsCount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { WalletAddress } = req.body;
        if (!WalletAddress) {
            res.status(constants_1.StatusCodes.BadRequest).json({ success: false, message: 'Wallet address is required' });
            return;
        }
        const user = new user_1.User(WalletAddress);
        const response = yield user.increaseAdsCount();
        res.status(response.code).json({ success: response.success, message: response.message });
    }
    catch (err) {
        next(err);
    }
});
exports.increaseAdsCount = increaseAdsCount;
const getAdsAndTokenCount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { WalletAddress } = req.body;
        if (!WalletAddress) {
            res.status(constants_1.StatusCodes.BadRequest).json({ success: false, message: 'Wallet address is required' });
            return;
        }
        const user = new user_1.User(WalletAddress);
        const response = yield user.getAdsAndTokenCount(WalletAddress);
        res.status(response.code).json({ success: response.success, data: response.data });
    }
    catch (err) {
        next(err);
    }
});
exports.getAdsAndTokenCount = getAdsAndTokenCount;
const submitVote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { WalletAddress, ProjectId, NumberOfTokensForVote, Identity } = req.body;
        if (!WalletAddress || !ProjectId || !NumberOfTokensForVote || !Identity) {
            res.status(constants_1.StatusCodes.BadRequest).json({ success: false, message: 'Wallet address, ProjectId, and NumberOfTokensForVote are required' });
            return;
        }
        const user = new user_1.User(WalletAddress);
        // verify the identity
        let response = yield user.validateSignature(NumberOfTokensForVote, Identity);
        if (response.success === false) {
            return response;
        }
        // submit vote
        response = yield user.castVote(ProjectId, NumberOfTokensForVote);
        res.status(response.code).json({ success: response.success, message: response.message });
    }
    catch (err) {
        next(err);
    }
});
exports.submitVote = submitVote;
const requestTokenTransfer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { WalletAddress } = req.body;
        if (!WalletAddress) {
            res.status(constants_1.StatusCodes.BadRequest).json({ success: false, message: 'Wallet address is required' });
            return;
        }
        const user = new user_1.User(WalletAddress);
        const response = yield user.requestTokenTransfer(WalletAddress);
        res.status(response.code).json({ success: response.success, message: response.message });
    }
    catch (err) {
        next(err);
    }
});
exports.requestTokenTransfer = requestTokenTransfer;
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
//# sourceMappingURL=user.js.map