import { ethers } from 'ethers';

import { CustomResponse, Proposal } from '../utils/interfaces';
import { StatusCodes } from '../utils/constants';

let response: CustomResponse;

export async function transferKOL(toAddress: string, amount: number): Promise<CustomResponse> {

    const abi: any= require('../utils/daotoken.json');
    const contractAddress: string = process.env.KOL_TOKEN_ADDRESS!;

    const ethersObjects = await getEthersObjects(abi, contractAddress);
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

/*
// change the deviceId to walletAddress or the moralis objectId that 
// the user gets after metamask login
export async function submitProposal(sender: string, title: string, description: string, accountNumber: string): Promise<CustomResponse> {

    console.log(`sender: ${sender} title: ${title} description: ${description}, accountNumber: ${accountNumber}`);

    const abi: any= require('../utils/ballot.json');
    const contractAddress: string = process.env.BALLOT_CONTRACT_ADDRESS!;
    console.log(`contractAddress: ${contractAddress}`)
    
    const ethersObjects = await getEthersObjects(abi, contractAddress);
    const nonce: number = ethersObjects[0];
    const wallet: any = ethersObjects[1];
    const contract: any = ethersObjects[2];
    
    const bytesTitle: string = ethers.utils.formatBytes32String(title);
    const bytesDescription: string = ethers.utils.formatBytes32String(description);

    console.log(`bytesTitle: ${bytesTitle}`);

    const contractWithSigner = contract.connect(wallet);
    const tx = await contractWithSigner.submitProposal(sender, bytesTitle, bytesDescription, accountNumber, {
        gasLimit: 300000,
        nonce
    });

    await tx.wait();
    const hash: string = tx.hash;
    
    response = {
        success: true,
        message: `The proposal submission request complete. Please confirm hash ${hash}`,
        code: StatusCodes.OK
    }

    return response;
}

// check if admin is accepting proposals
export async function isAcceptingProposals() {
    const abi: any= require('../utils/ballot.json');
    const contractAddress: string = process.env.BALLOT_CONTRACT_ADDRESS!;
    
    const ethersObjects = await getEthersObjects(abi, contractAddress);
    // const nonce: number = ethersObjects[0];
    // const wallet: any = ethersObjects[1];
    const contract: any = ethersObjects[2];

    // check if admin is accepting proposals
    const acceptingProposals: boolean = await contract.isAcceptingProposals();
    // console.log(`acceptingProposals: ${acceptingProposals}`);

    response = {
        success: acceptingProposals,
        code: StatusCodes.OK
    }

    return response;
}
*/

// change the deviceId to walletAddress or the moralis objectId that 
// the user gets after metamask login
export async function castVote(sender: string, proposalId: number): Promise<CustomResponse> {

    const abi: any= require('../utils/ballot.json');
    const contractAddress: string = process.env.BALLOT_CONTRACT_ADDRESS!;

    const ethersObjects = await getEthersObjects(abi, contractAddress);
    const nonce: number = ethersObjects[0];
    const wallet: any = ethersObjects[1];
    const contract: any = ethersObjects[2];

    // check if poll is opened
    response = await isPollOpened( contract );
    if (response.success === false) {
        return response;
    }

    // check the sender has enough vote weight
    response = await senderHasVoteWeight(contract, sender);

    if (response.success === false) {
        return response;
    }

    const contractWithSigner = contract.connect(wallet);
    const tx = await contractWithSigner.vote(sender, proposalId, {
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

async function isPollOpened(contract: any) {

    // check if poll is open
    const acceptingProposals: boolean = await contract.isPollOpened();
    // console.log(`acceptingProposals: ${acceptingProposals}`);

    response = {
        success: acceptingProposals,
        message: 'Poll is currently not opened',
        code: StatusCodes.OK
    }

    return response;
}

async function senderHasVoteWeight(contract: any, sender: string) {

    // check if poll is open
    const weight: number = await contract.voteWeight(sender);
    // console.log(`acceptingProposals: ${acceptingProposals}`);

    response = {
        success: weight > 0 ? true : false,
        message: 'Sender does not have any voting right. Watch ads or do USDC transfer',
        code: StatusCodes.OK
    }

    return response;
}

export async function getCurrentPoll(): Promise<CustomResponse> {
    const abi: any= require('../utils/ballot.json');
    const contractAddress: string = process.env.BALLOT_CONTRACT_ADDRESS!;

    const ethersObjects = await getEthersObjects(abi, contractAddress);
    // const nonce: number = ethersObjects[0];
    // const wallet: any = ethersObjects[1];
    const contract: any = ethersObjects[2];

    const pollId: string = await contract.currentPollId();
    
    response = {
        success: true,
        data: { pollId: parseInt(pollId) },
        code: StatusCodes.OK
    }

    return response;
}

export async function getCurrentProposals(currentPollId: number): Promise<CustomResponse> {

    const abi: any= require('../utils/ballot.json');
    const contractAddress: string = process.env.BALLOT_CONTRACT_ADDRESS!;

    const ethersObjects = await getEthersObjects(abi, contractAddress);
    // const nonce: number = ethersObjects[0];
    // const wallet: any = ethersObjects[1];
    const contract: any = ethersObjects[2];

    // const pollId: number = await contract.currentPollId();
    // console.log(`pollId: ${pollId}`);

    // current poll id is gotten on landing page load
    const results: any = await contract.getProposals(currentPollId);
    const proposalIds: number[] = results[0].map((x: any) => parseInt(x));
    const titles: string[] = results[1];
    const descriptions: string[] = results[2];
    const votesCount: number[] = results[3].map((x: any) => parseInt(x));
    const walletAddresses: string[] = results[4];
    const ownerAddress: string[] = results[5];

    const proposals: Proposal[] = [];
    for (let i = 0; i < proposalIds.length; i++) {
        proposals[i] = {
            id: proposalIds[i],
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
        data: { proposals: proposals },
        code: StatusCodes.OK
    }

    return response;
}

export async function getOneProposal(pollId: number, proposalId: number): Promise<CustomResponse> {

    const abi: any= require('../utils/ballot.json');
    const contractAddress: string = process.env.BALLOT_CONTRACT_ADDRESS!;

    const ethersObjects = await getEthersObjects(abi, contractAddress);
    // const nonce: number = ethersObjects[0];
    // const wallet: any = ethersObjects[1];
    const contract: any = ethersObjects[2];

    const results: any[] = await contract.getPollProposal(pollId, proposalId);
    
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