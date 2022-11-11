import { CustomResponse, Project } from '../utils/interfaces';
import { StatusCodes } from '../utils/constants';
import AWS from 'aws-sdk'

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

    addProject = async(chainId: string, projectId: number, name: string, amountRequired: number, desiredCurrency: string, cardImage: string, tagLine: string, orgName: string, orgWebsite: string, youtubeLink: string, contactLastname: string, contactOthernames: string, walletAddress: string): Promise<CustomResponse> => {

        // check if poll is opened
        const { isAcceptingProjects, getCurrentPoll } = require('./network');
        {
            const { success } = await isAcceptingProjects();
            if (success === false) {
                response = {
                    success,
                    message: 'Not current accepting new project submission',
                    code: StatusCodes.OK
                }
                return response;
            }
        }

        const imagePath: any = await this.saveAvartar(cardImage, projectId);

        let pollId = 0;
        { 
            const { data } : any= await getCurrentPoll();
            pollId = data.pollId;
        }

        const newProject: Project = {
            chainId: chainId,
            projectId: projectId,
            name: name,
            amountRequired: amountRequired,
            desiredCurrency: desiredCurrency,
            cardImage: imagePath,
            tagLine: tagLine,
            organizationName: orgName,
            organizationWebsite: orgWebsite,
            youtubeLink: youtubeLink,
            contactPersonLastname: contactLastname,
            contactPersonOthernames: contactOthernames,
            walletAddress: walletAddress,
            senderAddress: this.walletAddress,
            pollId: pollId
        }

        const { addNewProject } = require('../model/project_client');

        return await addNewProject(newProject);
    }

    updateProject = async(id: number, chainId: string, projectId: number, name: string, amountRequired: number, desiredCurrency: string, cardImage: string, tagLine: string, orgName: string, orgWebsite: string, youtubeLink: string, contactLastname: string, contactOthernames: string, walletAddress: string, senderAddress: string, pollId: number): Promise<CustomResponse> => {

        const imagePath: any = await this.saveAvartar(cardImage, projectId);

        const newProject: Project = {
            id: id,
            chainId: chainId,
            projectId: projectId,
            name: name,
            amountRequired: amountRequired,
            desiredCurrency: desiredCurrency,
            cardImage: imagePath,
            tagLine: tagLine,
            organizationName: orgName,
            organizationWebsite: orgWebsite,
            youtubeLink: youtubeLink,
            contactPersonLastname: contactLastname,
            contactPersonOthernames: contactOthernames,
            walletAddress: walletAddress,
            senderAddress: senderAddress,
            pollId: pollId,
        }

        const { updateProject } = require('../model/project_client');

        return await updateProject(newProject);
    }

    getProject = async(id: number): Promise<CustomResponse> => {

        const { getProject } = require('../model/project_client');
        const response = await getProject(id);

        return response;
    }

    getProjects = async(pollId: number): Promise<CustomResponse> => {

        const { getCurrentProjects, getVoteCount } = require('./network');
        let { data } = await getCurrentProjects(pollId);
        const projectIds: number[] = data.projectIds;
        
        const votes: number[] = [];
        for (const id of projectIds) {
            const { data } = await getVoteCount(id)
            votes.push(data.totalVote);
        }

        const { getProjects } = require('../model/project_client');
        response = await getProjects(pollId, projectIds, votes);

        return response;
    }

    validateSignature = async(amountOfTokens: number, identity: any): Promise<CustomResponse> => {
        const { validateSignature } = require('./network');
        return await validateSignature(this.walletAddress, amountOfTokens, identity);
    }

    castVote = async (projectId: number, amount: number): Promise<CustomResponse> => {

        const { castVote } = require('./network');
        return await castVote(this.walletAddress, projectId, amount);
    }

    saveAvartar = async(strStream: string, projectId: number) => {

        const fileStream = Buffer.from(strStream, 'base64');

        const { S3_ACCESSKEYID, S3_SECRETACCESSKEY, S3_BUCKETNAME, S3_AVATAR_DIR} = process.env;

        AWS.config.update({ accessKeyId: S3_ACCESSKEYID, secretAccessKey: S3_SECRETACCESSKEY});

        const s3Bucket = new AWS.S3({ params: { Bucket: S3_BUCKETNAME } });

        const filename: string = `ava_${projectId}.png`;
        const s3_url = `${S3_AVATAR_DIR}/${filename}`;
        const data: any = {
            Key: s3_url,
            Body: fileStream,
            ContentEncoding: 'base64',
            ContentType: 'image/png',
            ACL: 'public-read'
        };

        return new Promise((resolve, reject) => {
            s3Bucket.putObject(data, (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(`https://s3.amazonaws.com/${S3_BUCKETNAME}/${S3_AVATAR_DIR}/${filename}`);
                }
            });
        });
    }

    requestTokenTransfer = async(walletAddress: string): Promise<CustomResponse> => {
        const { getAdsTokenCount, resetTokenCount } = require('../model/user_client');
        const response = await getAdsTokenCount(this.walletAddress);
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

    startPoll = async(): Promise<CustomResponse> => {

        if (this.walletAddress !== 'adm1nk0l0') {
            response = {
                success: false,
                message: 'Invalid admin id',
                code: StatusCodes.BadRequest
            };
            return response;
        }
        
        // gets bakers and amount
        const { getTokensForTransfer, resetMovedTokenCount } = require('../model/user_client');
        response = await getTokensForTransfer();
        if (response.success = false) {
            return response;
        }

        const data: any = response.data;
        console.log(`Get token for transfer successful: Sending tokens to ${data.bakers.length} users`);

        if (data.bakers.length === 0) {
            response = {
                success: false,
                message: 'No user with in-game tokens',
                code: StatusCodes.OK
            }
            return response;
        }

        // stop if there is an existing opened poll
        const { isPollOpened } = require('./network');
        response = await isPollOpened();
        if (response.success === true) {
            console.log(`Another poll is currently opened`);
            return { ...response, message: 'One poll is currently opened'};
        }

        // get the total amount and transfer it from owner to ballo contract
        const contractAddress: string = process.env.BALLOT_CONTRACT_ADDRESS!;
        const totalAmountRequired: number = data.amounts.reduce((totalAmount: number, amount: number) => totalAmount + amount, 0);

        const { transferKOL } = require('./network');
        response = await transferKOL(contractAddress, totalAmountRequired);
        if (response.success === false) {
            return response;
        }
        console.log(`${totalAmountRequired} KOLs transfer to contract complete`);
        
        // batch transfer tokens and start poll
        const { startPoll } = require('./network');
        response = await startPoll(data.bakers, data.amounts);
        console.log(`batch transfer and poll process started: ${data.bakers} - ${data.amounts}`);

        if (response.success === true) {
            // reset all users token counts
            response = await resetMovedTokenCount(data.bakers);
            if (response.success === false) {
                return response;
            }
        }
        console.log('batch transfer complete and poll started');

        response = {
            success: true,
            message: 'KOL paid out successfully and poll started',
            code: StatusCodes.OK
        }
        return response;
    }

    closePoll = async(): Promise<CustomResponse> => {

        if (this.walletAddress !== 'adm1nk0l0') {
            response = {
                success: false,
                message: 'Invalid admin id',
                code: StatusCodes.BadRequest
            };
            return response;
        }

        const { closePoll } = require('./network');
        return await closePoll();
    }

    // Remove below segments if not needed

/*
    submitProject = async(sender: string, title: string, description: string, accountNumber: string): Promise<CustomResponse> => {
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
                message: 'Project failed to submit due to insufficient token count for fee payment',
                code: StatusCodes.BadRequest
            }
            return response;
        }

        const { submitProject, isAcceptingProjects } = require('./network')

        const { success } = await isAcceptingProjects();
        if (success === false) {
            response = { 
                success: false,
                message: 'Contract on chain is not presently accepting Project',
                code: StatusCodes.InternalError
            }
            return response;
        }
        
        // reset the user token count to 0
        await resetTokenCount(this.walletAddress, fee);

        return await submitProject(sender, title, description, accountNumber);
    }
*/


    getCurrentPoll = async (): Promise<CustomResponse> => {

        const { getCurrentPoll } = require('./network');
        return await getCurrentPoll();
    }

    getCurrentProjects = async (pollId: number): Promise<CustomResponse> => {

        const { getCurrentProjects } = require('./network');
        return await getCurrentProjects(pollId);
    }

    getOneProject = async (pollId: number, ProjectId: number): Promise<CustomResponse> => {

        const { getOneProject } = require('./network');
        return await getOneProject(pollId, ProjectId);
    }
}
