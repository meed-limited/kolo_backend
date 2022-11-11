import { ethers } from 'ethers';

import { CustomResponse, Project } from '../utils/interfaces';
import { StatusCodes } from '../utils/constants';

let response: CustomResponse;

export async function transferKOL(toAddress: string, amount: number): Promise<CustomResponse> {

    const { tokenABI }: any = require('../utils/abis');
    const contractAddress: string = process.env.KOL_TOKEN_ADDRESS!;

    const ethersObjects = await getEthersObjects(tokenABI, contractAddress);
    const nonce: number = ethersObjects[0];
    const wallet: any = ethersObjects[1];
    const contract: any = ethersObjects[2];

    const contractWithSigner = contract.connect(wallet);

    const formattedAmount: any = ethers.utils.parseEther(amount.toString());

    const tx = await contractWithSigner.transfer(toAddress, formattedAmount, {
        gasLimit: 300000,
        nonce
    });

    await tx.wait();
    const hash: string = tx.hash;
    
    response = {
        success: true,
        message: `The transfer request complete. Please confirm hash ${hash}`,
        code: StatusCodes.OK
    }

    return response;
}

export async function validateSignature(walletAddress: string, amountOfTokens: number, identity: any): Promise<CustomResponse> {

    const { Vsig, Rsig,  Ssig, Deadline } = identity;
    if (!Vsig || !Rsig || !Ssig || !Deadline) {
        response = {
            success: false, 
            message: 'Some critical parameters of the identity are missing',
            code: StatusCodes.BadRequest
        };
        return response;
    }

    const spender: string = process.env.BALLOT_CONTRACT_ADDRESS!;

    const { tokenABI }: any = require('../utils/abis');
    const contractAddress: string = process.env.KOL_TOKEN_ADDRESS!;

    const ethersObjects = await getEthersObjects(tokenABI, contractAddress);
    const nonce: number = ethersObjects[0];
    const wallet: any = ethersObjects[1];
    const contract: any = ethersObjects[2];

    const contractWithSigner = contract.connect(wallet);

    const formattedAmount: any = ethers.utils.parseEther(amountOfTokens.toString());

    const tx = await contractWithSigner.permit(walletAddress, spender, formattedAmount, Deadline, Vsig, Rsig, Ssig, {
        gasLimit: 300000,
        nonce
    });

    await tx.wait();
    const hash: string = tx.hash;
    console.log(`The request completed with confirmation hash ${hash}`);
    
    response = {
        success: true,
        message: `The request completed with confirmation hash ${hash}`,
        code: StatusCodes.OK
    }
    return response;
}

// change the deviceId to walletAddress or the moralis objectId that 
// the user gets after metamask login
export async function castVote(sender: string, ProjectId: number, amountOfVotes: number): Promise<CustomResponse> {

    const { ballotABI } = require('../utils/abis');
    const contractAddress: string = process.env.BALLOT_CONTRACT_ADDRESS!;

    const ethersObjects = await getEthersObjects(ballotABI, contractAddress);
    const nonce: number = ethersObjects[0];
    const wallet: any = ethersObjects[1];
    const contract: any = ethersObjects[2];

    // check if poll is opened
    response = await isPollOpened();
    if (response.success === false) {
        return response;
    }

    // check the sender has enough vote weight
    response = await senderHasEnoughVoteWeight(contract, sender, amountOfVotes);
    if (response.success === false) {
        return response;
    }

    const contractWithSigner = contract.connect(wallet);
    const tx = await contractWithSigner.vote(sender, ProjectId, amountOfVotes, {
        gasLimit: 300000,
        nonce
    });

    await tx.wait();
    const hash: string = tx.hash;
    
    response = {
        success: true,
        message: `The vote is submitted with confirmation hash ${hash}`,
        code: StatusCodes.OK
    }

    return response;
}

export async function isAcceptingProjects() {
    const contract: any = await getBallotContract();
    // check if poll is open
    const acceptingProjects: boolean = await contract.isAcceptingProjects();
    // console.log(`acceptingProjects: ${acceptingProjects}`);

    response = {
        success: acceptingProjects,
        message: 'Poll is currently not opened',
        code: StatusCodes.OK
    }

    return response;
}

export async function isPollOpened() {

    const contract: any = await getBallotContract();

    // check if poll is open
    const pollOpened: boolean = await contract.isPollOpened();
    // console.log(`acceptingProjects: ${acceptingProjects}`);

    response = {
        success: pollOpened,
        message: 'Poll is currently not opened',
        code: StatusCodes.OK
    }

    return response;
}

async function senderHasEnoughVoteWeight(contract: any, sender: string, amountOfVotes: number): Promise<CustomResponse>  {

    // check if poll is open
    const [ balance, allowance ] = await contract.voteWeight(sender);
    // console.log(`acceptingProjects: ${acceptingProjects}`);

    response = {
        success: balance >= amountOfVotes && allowance >= amountOfVotes ? true : false,
        message: 'Sender does not have enough voting right. Watch ads or do USDC transfer',
        code: StatusCodes.OK
    }

    return response;
}

async function getBallotContract(): Promise<any> {
    const { ballotABI } = require('../utils/abis');
    const contractAddress: string = process.env.BALLOT_CONTRACT_ADDRESS!;

    const ethersObjects = await getEthersObjects(ballotABI, contractAddress);
    // const nonce: number = ethersObjects[0];
    // const wallet: any = ethersObjects[1];
    const contract: any = ethersObjects[2];

    return contract;
}

export async function getCurrentPoll(): Promise<CustomResponse> {
    
    const contract: any = await getBallotContract();
    const pollId: string = await contract.currentPollId();
    
    response = {
        success: true,
        data: { pollId: parseInt(pollId) },
        code: StatusCodes.OK
    }

    return response;
}

export async function getPollResult(pollId: number): Promise<CustomResponse> {
    console.log(`pollId: ${pollId}`);
    const contract: any = await getBallotContract();
    const results: any[] = await contract.getPollResult(pollId);
    const projectIds: number[] = results[0].map((x: any) => parseInt(x));
    const voteCounts: number[] = results[1].map((x: any) => parseInt(x));
    console.log(projectIds, voteCounts);
    response = {
        success: true,
        data: { projectIds, voteCounts },
        code: StatusCodes.OK
    }

    return response;
}

export async function closePoll(): Promise<CustomResponse> {

    const { ballotABI } = require('../utils/abis');
    const contractAddress: string = process.env.BALLOT_CONTRACT_ADDRESS!;

    const ethersObjects = await getEthersObjects(ballotABI, contractAddress);
    const nonce: number = ethersObjects[0];
    const wallet: any = ethersObjects[1];
    const contract: any = ethersObjects[2];

    // check if poll is opened
    response = await isPollOpened();
    if (response.success === false) {
        return { ...response, message: 'Poll is currently not open'};
    }

    const contractWithSigner = contract.connect(wallet);
    const tx = await contractWithSigner.closePoll({
        gasLimit: 300000,
        nonce
    });

    await tx.wait();
    const hash: string = tx.hash;
    
    response = {
        success: true,
        message: `The poll is close with confirmation hash ${hash}`,
        code: StatusCodes.OK
    }

    return response;
}

export async function startPoll(bakers: string[], amounts: number[]): Promise<CustomResponse> {

    if (bakers.length !== amounts.length) {
        response = {
            success: false,
            message: 'The number of items in bakers and amounts is different',
            code: StatusCodes.BadRequest
        };
        return response;
    }

    const { ballotABI } = require('../utils/abis');
    const contractAddress: string = process.env.BALLOT_CONTRACT_ADDRESS!;

    const ethersObjects = await getEthersObjects(ballotABI, contractAddress);
    const nonce: number = ethersObjects[0];
    const wallet: any = ethersObjects[1];
    const contract: any = ethersObjects[2];

    // poll must be currently close
    response = await isPollOpened();
    if (response.success === true) {
        response = {
            success: false,
            message: 'Poll is already opened',
            code: StatusCodes.BadRequest
        };
        return response;
    }

    const formattedAmounts: any[] = amounts.map(amount =>ethers.utils.parseEther(amount.toString()))

    const contractWithSigner = contract.connect(wallet);
    const tx = await contractWithSigner.startPoll(bakers, formattedAmounts, {
        gasLimit: 300000,
        nonce
    });

    await tx.wait();
    const hash: string = tx.hash;
    
    response = {
        success: true,
        message: `The poll is started with confirmation hash ${hash}`,
        code: StatusCodes.OK
    }

    return response;
}

export async function getOneProject(pollId: number, ProjectId: number): Promise<CustomResponse> {

    const { ballotABI }: any= require('../utils/abis');
    const contractAddress: string = process.env.BALLOT_CONTRACT_ADDRESS!;

    const ethersObjects = await getEthersObjects(ballotABI, contractAddress);
    // const nonce: number = ethersObjects[0];
    // const wallet: any = ethersObjects[1];
    const contract: any = ethersObjects[2];

    const results: any[] = await contract.getPollProject(pollId, ProjectId);
    
    response = {
        success: true,
        data: { topic: results[0], description: results[1], voteCount: parseInt(results[2]), accountNumber: results[3], projectOwner: results[4] },
        code: StatusCodes.OK
    }

    return response;
}

async function getEthersObjects(abi: any, contractAddress: string): Promise<any[]> {
    const networkProvider: string = process.env.BINANCE_PROVIDER!;
    const gateway: string = process.env.GATEWAY!;
    const key: string = process.env.KEY!;

    const etherProvider: any = new ethers.providers.JsonRpcProvider(networkProvider);

    const nonce: number = await etherProvider.getTransactionCount(gateway);
    const wallet: any = new ethers.Wallet(key, etherProvider);

    const contract: any = new ethers.Contract(contractAddress, abi, etherProvider);
    return [nonce, wallet, contract];
}