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
exports.getOneProject = exports.startPoll = exports.closePoll = exports.getPollResult = exports.getCurrentPoll = exports.isPollOpened = exports.isAcceptingProjects = exports.castVote = exports.validateSignature = exports.transferKOL = void 0;
const ethers_1 = require("ethers");
const constants_1 = require("../utils/constants");
let response;
function transferKOL(toAddress, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tokenABI } = require('../utils/abis');
        const contractAddress = process.env.KOL_TOKEN_ADDRESS;
        const ethersObjects = yield getEthersObjects(tokenABI, contractAddress);
        const nonce = ethersObjects[0];
        const wallet = ethersObjects[1];
        const contract = ethersObjects[2];
        const contractWithSigner = contract.connect(wallet);
        const formattedAmount = ethers_1.ethers.utils.parseEther(amount.toString());
        const tx = yield contractWithSigner.transfer(toAddress, formattedAmount, {
            gasLimit: 300000,
            nonce
        });
        yield tx.wait();
        const hash = tx.hash;
        response = {
            success: true,
            message: `The transfer request complete. Please confirm hash ${hash}`,
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.transferKOL = transferKOL;
function validateSignature(walletAddress, amountOfTokens, identity) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Vsig, Rsig, Ssig, Deadline } = identity;
        if (!Vsig || !Rsig || !Ssig || !Deadline) {
            response = {
                success: false,
                message: 'Some critical parameters of the identity are missing',
                code: constants_1.StatusCodes.BadRequest
            };
            return response;
        }
        const spender = process.env.BALLOT_CONTRACT_ADDRESS;
        const { tokenABI } = require('../utils/abis');
        const contractAddress = process.env.KOL_TOKEN_ADDRESS;
        const ethersObjects = yield getEthersObjects(tokenABI, contractAddress);
        const nonce = ethersObjects[0];
        const wallet = ethersObjects[1];
        const contract = ethersObjects[2];
        const contractWithSigner = contract.connect(wallet);
        // const formattedAmount: any = ethers.utils.parseEther(amountOfTokens.toString());
        const tx = yield contractWithSigner.permit(walletAddress, spender, amountOfTokens, Deadline, Vsig, Rsig, Ssig, {
            gasLimit: 300000,
            nonce
        });
        yield tx.wait();
        const hash = tx.hash;
        console.log(`The request completed with confirmation hash ${hash}`);
        response = {
            success: true,
            message: `The request completed with confirmation hash ${hash}`,
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.validateSignature = validateSignature;
// change the deviceId to walletAddress or the moralis objectId that 
// the user gets after metamask login
function castVote(sender, ProjectId, amountOfVotes) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ballotABI } = require('../utils/abis');
        const contractAddress = process.env.BALLOT_CONTRACT_ADDRESS;
        const ethersObjects = yield getEthersObjects(ballotABI, contractAddress);
        const nonce = ethersObjects[0];
        const wallet = ethersObjects[1];
        const contract = ethersObjects[2];
        // check if poll is opened
        response = yield isPollOpened();
        if (response.success === false) {
            return response;
        }
        // check the sender has enough vote weight
        response = yield senderHasEnoughVoteWeight(contract, sender, amountOfVotes);
        if (response.success === false) {
            return response;
        }
        const contractWithSigner = contract.connect(wallet);
        const tx = yield contractWithSigner.vote(sender, ProjectId, amountOfVotes, {
            gasLimit: 300000,
            nonce
        });
        yield tx.wait();
        const hash = tx.hash;
        response = {
            success: true,
            message: `The vote is submitted with confirmation hash ${hash}`,
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.castVote = castVote;
function isAcceptingProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = yield getBallotContract();
        // check if poll is open
        const acceptingProjects = yield contract.isAcceptingProjects();
        // console.log(`acceptingProjects: ${acceptingProjects}`);
        response = {
            success: acceptingProjects,
            message: 'Poll is currently not opened',
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.isAcceptingProjects = isAcceptingProjects;
function isPollOpened() {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = yield getBallotContract();
        // check if poll is open
        const pollOpened = yield contract.isPollOpened();
        // console.log(`acceptingProjects: ${acceptingProjects}`);
        response = {
            success: pollOpened,
            message: 'Poll is currently not opened',
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.isPollOpened = isPollOpened;
function senderHasEnoughVoteWeight(contract, sender, amountOfVotes) {
    return __awaiter(this, void 0, void 0, function* () {
        // check if poll is open
        const [balance, allowance] = yield contract.voteWeight(sender);
        // console.log(`acceptingProjects: ${acceptingProjects}`);
        response = {
            success: balance >= amountOfVotes && allowance >= amountOfVotes ? true : false,
            message: 'Sender does not have enough voting right. Watch ads or do USDC transfer',
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
function getBallotContract() {
    return __awaiter(this, void 0, void 0, function* () {
        const { ballotABI } = require('../utils/abis');
        const contractAddress = process.env.BALLOT_CONTRACT_ADDRESS;
        const ethersObjects = yield getEthersObjects(ballotABI, contractAddress);
        // const nonce: number = ethersObjects[0];
        // const wallet: any = ethersObjects[1];
        const contract = ethersObjects[2];
        return contract;
    });
}
function getCurrentPoll() {
    return __awaiter(this, void 0, void 0, function* () {
        const contract = yield getBallotContract();
        const pollId = yield contract.currentPollId();
        response = {
            success: true,
            data: { pollId: parseInt(pollId) },
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.getCurrentPoll = getCurrentPoll;
function getPollResult(pollId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`pollId: ${pollId}`);
        const contract = yield getBallotContract();
        const results = yield contract.getPollResult(pollId);
        const projectIds = results[0].map((x) => parseInt(x));
        const voteCounts = results[1].map((x) => parseInt(x));
        console.log(projectIds, voteCounts);
        response = {
            success: true,
            data: { projectIds, voteCounts },
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.getPollResult = getPollResult;
function closePoll() {
    return __awaiter(this, void 0, void 0, function* () {
        const { ballotABI } = require('../utils/abis');
        const contractAddress = process.env.BALLOT_CONTRACT_ADDRESS;
        const ethersObjects = yield getEthersObjects(ballotABI, contractAddress);
        const nonce = ethersObjects[0];
        const wallet = ethersObjects[1];
        const contract = ethersObjects[2];
        // check if poll is opened
        response = yield isPollOpened();
        if (response.success === false) {
            return Object.assign(Object.assign({}, response), { message: 'Poll is currently not open' });
        }
        const contractWithSigner = contract.connect(wallet);
        const tx = yield contractWithSigner.closePoll({
            gasLimit: 300000,
            nonce
        });
        yield tx.wait();
        const hash = tx.hash;
        response = {
            success: true,
            message: `The poll is close with confirmation hash ${hash}`,
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.closePoll = closePoll;
function startPoll(bakers, amounts) {
    return __awaiter(this, void 0, void 0, function* () {
        if (bakers.length !== amounts.length) {
            response = {
                success: false,
                message: 'The number of items in bakers and amounts is different',
                code: constants_1.StatusCodes.BadRequest
            };
            return response;
        }
        const { ballotABI } = require('../utils/abis');
        const contractAddress = process.env.BALLOT_CONTRACT_ADDRESS;
        const ethersObjects = yield getEthersObjects(ballotABI, contractAddress);
        const nonce = ethersObjects[0];
        const wallet = ethersObjects[1];
        const contract = ethersObjects[2];
        // poll must be currently close
        response = yield isPollOpened();
        if (response.success === true) {
            response = {
                success: false,
                message: 'Poll is already opened',
                code: constants_1.StatusCodes.BadRequest
            };
            return response;
        }
        const formattedAmounts = amounts.map(amount => ethers_1.ethers.utils.parseEther(amount.toString()));
        const contractWithSigner = contract.connect(wallet);
        const tx = yield contractWithSigner.startPoll(bakers, formattedAmounts, {
            gasLimit: 300000,
            nonce
        });
        yield tx.wait();
        const hash = tx.hash;
        response = {
            success: true,
            message: `The poll is started with confirmation hash ${hash}`,
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.startPoll = startPoll;
function getOneProject(pollId, ProjectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { ballotABI } = require('../utils/abis');
        const contractAddress = process.env.BALLOT_CONTRACT_ADDRESS;
        const ethersObjects = yield getEthersObjects(ballotABI, contractAddress);
        // const nonce: number = ethersObjects[0];
        // const wallet: any = ethersObjects[1];
        const contract = ethersObjects[2];
        const results = yield contract.getPollProject(pollId, ProjectId);
        response = {
            success: true,
            data: { topic: results[0], description: results[1], voteCount: parseInt(results[2]), accountNumber: results[3], projectOwner: results[4] },
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.getOneProject = getOneProject;
function getEthersObjects(abi, contractAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const networkProvider = process.env.BINANCE_PROVIDER;
        const gateway = process.env.GATEWAY;
        const key = process.env.KEY;
        const etherProvider = new ethers_1.ethers.providers.JsonRpcProvider(networkProvider);
        const nonce = yield etherProvider.getTransactionCount(gateway);
        const wallet = new ethers_1.ethers.Wallet(key, etherProvider);
        const contract = new ethers_1.ethers.Contract(contractAddress, abi, etherProvider);
        return [nonce, wallet, contract];
    });
}
//# sourceMappingURL=network.js.map