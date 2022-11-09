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

/*
export async function getCurrentProjects(currentPollId: number): Promise<CustomResponse> {

    const { ballotABI }: any= require('../utils/abis');
    const contractAddress: string = process.env.BALLOT_CONTRACT_ADDRESS!;

    const ethersObjects = await getEthersObjects(ballotABI, contractAddress);
    // const nonce: number = ethersObjects[0];
    // const wallet: any = ethersObjects[1];
    const contract: any = ethersObjects[2];

    // const pollId: number = await contract.currentPollId();
    // console.log(`pollId: ${pollId}`);

    // current poll id is gotten on landing page load
    const results: any = await contract.getProjects(currentPollId);
    const ProjectIds: number[] = results[0].map((x: any) => parseInt(x));
    const titles: string[] = results[1];
    const descriptions: string[] = results[2];
    const votesCount: number[] = results[3].map((x: any) => parseInt(x));
    const walletAddresses: string[] = results[4];
    const ownerAddress: string[] = results[5];

    const Projects: Project[] = [];
    for (let i = 0; i < ProjectIds.length; i++) {
        Projects[i] = {
            id: ProjectIds[i],
            title: titles[i],
            description: descriptions[i],
            totalVotes: votesCount[i],
            walletAddress: walletAddresses[i],
            ownerAddress: ownerAddress[i]
        }
    }
    // console.log(`results: ${JSON.stringify(results)}`);
    response = {
        success: true,
        data: { Projects: Projects },
        code: StatusCodes.OK
    }

    return response;
}
*/

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