import { CustomResponse, Project } from '../utils/interfaces';
import { StatusCodes } from '../utils/constants';

let response: CustomResponse;

export class User {

    walletAddress: string;
     constructor(walletAddress: string) {
        this.walletAddress = walletAddress.toLowerCase();
     }

    saveAccess = async(accessId: string): Promise<CustomResponse> => {
        const { updateUserAccessToken } = require('../model/user_client');
        return updateUserAccessToken(this.walletAddress, accessId);
    }

    getAccess = async(): Promise<CustomResponse> => {
        const { getUserAccessToken } = require('../model/user_client');
        return getUserAccessToken(this.walletAddress);
    }

    increaseAdsCount = async(): Promise<CustomResponse> => {
        const { increaseAdsCount } = require('../model/user_client');
        return increaseAdsCount(this.walletAddress);
    }

    getAdsAndTokenCount = async(walletAddress: string): Promise<CustomResponse> => {
        const { getAdsTokenCount } = require('../model/user_client');
        return await getAdsTokenCount(walletAddress);
    }

    addProject = async(chainId: number, name: string, cardImage: string, tagLine: string, orgName: string, orgWebsite: string, youtubeLink: string, contactLastname: string, contactOthernames: string, walletAddress: string, senderAddress: string): Promise<CustomResponse> => {

        const newProject: Project = {
            chainId: chainId,
            name: name,
            cardImage: cardImage!,
            tagLine: tagLine,
            organizationName: orgName,
            organizationWebsite: orgWebsite,
            youtubeLink: youtubeLink,
            contactPersonLastname: contactLastname,
            contactPersonOthernames: contactOthernames,
            walletAddress: walletAddress,
            senderAddress: senderAddress,
        }

        const { addNewProject } = require('../model/project_client');

        return await addNewProject(newProject);
    }

    updateProject = async(id: number, chainId: number, name: string, cardImage: string, tagLine: string, orgName: string, orgWebsite: string, youtubeLink: string, contactLastname: string, contactOthernames: string, walletAddress: string, senderAddress: string): Promise<CustomResponse> => {

        const newProject: Project = {
            id: id,
            chainId: chainId,
            name: name,
            cardImage: cardImage!,
            tagLine: tagLine,
            organizationName: orgName,
            organizationWebsite: orgWebsite,
            youtubeLink: youtubeLink,
            contactPersonLastname: contactLastname,
            contactPersonOthernames: contactOthernames,
            walletAddress: walletAddress,
            senderAddress: senderAddress,
        }

        const { updateProject } = require('../model/project_client');

        return await updateProject(newProject);
    }

    getProject = async(id: number): Promise<CustomResponse> => {

        const { getProject } = require('../model/project_client');
        const response = await getProject(id);

        return response;
    }

    requestTokenTransfer = async(walletAddress: string): Promise<CustomResponse> => {
        const { getTokenCount, resetTokenCount } = require('../model/user_client');
        const response = await getTokenCount(this.walletAddress);
        if (response.success === false) {
            return response;
        }
        
        const { data }: any = response;
        const amount: number = data.tokenCount;
        
        // reset the user token count to 0
        await resetTokenCount(this.walletAddress, amount);

        const { transferKOL } = require('./network');
        return await transferKOL(walletAddress, amount);

    }
/*
    submitProposal = async(sender: string, title: string, description: string, accountNumber: string): Promise<CustomResponse> => {
        const { getTokenCount, resetTokenCount } = require('../model/user_client');
        response = await getTokenCount(this.walletAddress);
        if (response.success === false) {
            return response;
        }
        console.log(`response: ${JSON.stringify(response)}`);
        const { data }: any = response;
        const amount: number = data.tokenCount;

        const fee: number = 5;
        if (amount < fee) {
            response = {
                success: false,
                message: 'Proposal failed to submit due to insufficient token count for fee payment',
                code: StatusCodes.BadRequest
            }
            return response;
        }

        const { submitProposal, isAcceptingProposals } = require('./network')

        const { success } = await isAcceptingProposals();
        if (success === false) {
            response = { 
                success: false,
                message: 'Contract on chain is not presently accepting proposal',
                code: StatusCodes.InternalError
            }
            return response;
        }
        
        // reset the user token count to 0
        await resetTokenCount(this.walletAddress, fee);

        return await submitProposal(sender, title, description, accountNumber);
    }
*/

    castVote = async (sender: string, proposalId: number): Promise<CustomResponse> => {

        const { castVote } = require('./network');
        return await castVote(sender, proposalId);
    }

    getCurrentPoll = async (): Promise<CustomResponse> => {

        const { getCurrentPoll } = require('./network');
        return await getCurrentPoll();
    }

    getCurrentProposals = async (pollId: number): Promise<CustomResponse> => {

        const { getCurrentProposals } = require('./network');
        return await getCurrentProposals(pollId);
    }

    getOneProposal = async (pollId: number, proposalId: number): Promise<CustomResponse> => {

        const { getOneProposal } = require('./network');
        return await getOneProposal(pollId, proposalId);
    }
}
