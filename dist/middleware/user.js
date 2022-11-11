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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const constants_1 = require("../utils/constants");
const aws_sdk_1 = __importDefault(require("aws-sdk"));
let response;
class User {
    constructor(walletAddress) {
        this.saveAccess = (accessId) => __awaiter(this, void 0, void 0, function* () {
            const { updateUserAccessToken } = require('../model/user_client');
            return updateUserAccessToken(this.walletAddress, accessId);
        });
        this.getAccess = () => __awaiter(this, void 0, void 0, function* () {
            const { getUserAccessToken } = require('../model/user_client');
            return getUserAccessToken(this.walletAddress);
        });
        this.increaseAdsCount = () => __awaiter(this, void 0, void 0, function* () {
            const { increaseAdsCount } = require('../model/user_client');
            return increaseAdsCount(this.walletAddress);
        });
        this.getAdsAndTokenCount = (walletAddress) => __awaiter(this, void 0, void 0, function* () {
            const { getAdsTokenCount } = require('../model/user_client');
            return yield getAdsTokenCount(walletAddress);
        });
        this.addProject = (chainId, projectId, name, amountRequired, cardImage, tagLine, orgName, orgWebsite, youtubeLink, contactLastname, contactOthernames, walletAddress) => __awaiter(this, void 0, void 0, function* () {
            // check if poll is opened
            const { isAcceptingProjects, getCurrentPoll } = require('./network');
            {
                const { success } = yield isAcceptingProjects();
                if (success === false) {
                    response = {
                        success,
                        message: 'Not current accepting new project submission',
                        code: constants_1.StatusCodes.OK
                    };
                    return response;
                }
            }
            const imagePath = yield this.saveAvartar(cardImage, projectId);
            let pollId = 0;
            {
                const { data } = yield getCurrentPoll();
                pollId = data.pollId;
            }
            const newProject = {
                chainId: chainId,
                projectId: projectId,
                name: name,
                amountRequired: amountRequired,
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
            };
            const { addNewProject } = require('../model/project_client');
            return yield addNewProject(newProject);
        });
        this.updateProject = (id, chainId, projectId, name, amountRequired, cardImage, tagLine, orgName, orgWebsite, youtubeLink, contactLastname, contactOthernames, walletAddress, senderAddress, pollId) => __awaiter(this, void 0, void 0, function* () {
            const imagePath = yield this.saveAvartar(cardImage, projectId);
            const newProject = {
                id: id,
                chainId: chainId,
                projectId: projectId,
                name: name,
                amountRequired: amountRequired,
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
            };
            const { updateProject } = require('../model/project_client');
            return yield updateProject(newProject);
        });
        this.getProject = (id) => __awaiter(this, void 0, void 0, function* () {
            const { getProject } = require('../model/project_client');
            const response = yield getProject(id);
            return response;
        });
        this.getProjects = (pollId) => __awaiter(this, void 0, void 0, function* () {
            const { getPollResult } = require('./network');
            const { data } = yield getPollResult(pollId);
            const { getProjects } = require('../model/project_client');
            const response = yield getProjects(pollId, data.projectIds, data.voteCounts);
            return response;
        });
        this.validateSignature = (amountOfTokens, identity) => __awaiter(this, void 0, void 0, function* () {
            const { validateSignature } = require('./network');
            return yield validateSignature(this.walletAddress, amountOfTokens, identity);
        });
        this.castVote = (projectId, amount) => __awaiter(this, void 0, void 0, function* () {
            const { castVote } = require('./network');
            return yield castVote(this.walletAddress, projectId, amount);
        });
        this.saveAvartar = (strStream, projectId) => __awaiter(this, void 0, void 0, function* () {
            const fileStream = Buffer.from(strStream, 'base64');
            const { S3_ACCESSKEYID, S3_SECRETACCESSKEY, S3_BUCKETNAME, S3_AVATAR_DIR } = process.env;
            aws_sdk_1.default.config.update({ accessKeyId: S3_ACCESSKEYID, secretAccessKey: S3_SECRETACCESSKEY });
            const s3Bucket = new aws_sdk_1.default.S3({ params: { Bucket: S3_BUCKETNAME } });
            const filename = `ava_${projectId}.png`;
            const s3_url = `${S3_AVATAR_DIR}/${filename}`;
            const data = {
                Key: s3_url,
                Body: fileStream,
                ContentEncoding: 'base64',
                ContentType: 'image/png',
                ACL: 'public-read'
            };
            return new Promise((resolve, reject) => {
                s3Bucket.putObject(data, (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(`https://s3.amazonaws.com/${S3_BUCKETNAME}/${S3_AVATAR_DIR}/${filename}`);
                    }
                });
            });
        });
        this.requestTokenTransfer = (walletAddress) => __awaiter(this, void 0, void 0, function* () {
            const { getAdsTokenCount, resetTokenCount } = require('../model/user_client');
            const response = yield getAdsTokenCount(this.walletAddress);
            if (response.success === false) {
                return response;
            }
            const { data } = response;
            const amount = data.tokenCount;
            // reset the user token count to 0
            yield resetTokenCount(this.walletAddress, amount);
            const { transferKOL } = require('./network');
            return yield transferKOL(walletAddress, amount);
        });
        this.startPoll = () => __awaiter(this, void 0, void 0, function* () {
            if (this.walletAddress !== 'adm1nk0l0') {
                response = {
                    success: false,
                    message: 'Invalid admin id',
                    code: constants_1.StatusCodes.BadRequest
                };
                return response;
            }
            // gets bakers and amount
            const { getTokensForTransfer, resetMovedTokenCount } = require('../model/user_client');
            response = yield getTokensForTransfer();
            if (response.success = false) {
                return response;
            }
            const data = response.data;
            console.log(`Get token for transfer successful: Sending tokens to ${data.bakers.length} users`);
            if (data.bakers.length === 0) {
                response = {
                    success: false,
                    message: 'No user with in-game tokens',
                    code: constants_1.StatusCodes.OK
                };
                return response;
            }
            // stop if there is an existing opened poll
            const { isPollOpened } = require('./network');
            response = yield isPollOpened();
            if (response.success === true) {
                console.log(`Another poll is currently opened`);
                return Object.assign(Object.assign({}, response), { message: 'One poll is currently opened' });
            }
            // get the total amount and transfer it from owner to ballo contract
            const contractAddress = process.env.BALLOT_CONTRACT_ADDRESS;
            const totalAmountRequired = data.amounts.reduce((totalAmount, amount) => totalAmount + amount, 0);
            const { transferKOL } = require('./network');
            response = yield transferKOL(contractAddress, totalAmountRequired);
            if (response.success === false) {
                return response;
            }
            console.log(`${totalAmountRequired} KOLs transfer to contract complete`);
            // batch transfer tokens and start poll
            const { startPoll } = require('./network');
            response = yield startPoll(data.bakers, data.amounts);
            console.log(`batch transfer and poll process started: ${data.bakers} - ${data.amounts}`);
            if (response.success === true) {
                // reset all users token counts
                response = yield resetMovedTokenCount(data.bakers);
                if (response.success === false) {
                    return response;
                }
            }
            console.log('batch transfer complete and poll started');
            response = {
                success: true,
                message: 'KOL paid out successfully and poll started',
                code: constants_1.StatusCodes.OK
            };
            return response;
        });
        this.closePoll = () => __awaiter(this, void 0, void 0, function* () {
            if (this.walletAddress !== 'adm1nk0l0') {
                response = {
                    success: false,
                    message: 'Invalid admin id',
                    code: constants_1.StatusCodes.BadRequest
                };
                return response;
            }
            const { closePoll } = require('./network');
            return yield closePoll();
        });
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
        this.getCurrentPoll = () => __awaiter(this, void 0, void 0, function* () {
            const { getCurrentPoll } = require('./network');
            return yield getCurrentPoll();
        });
        this.getCurrentProjects = (pollId) => __awaiter(this, void 0, void 0, function* () {
            const { getCurrentProjects } = require('./network');
            return yield getCurrentProjects(pollId);
        });
        this.getOneProject = (pollId, ProjectId) => __awaiter(this, void 0, void 0, function* () {
            const { getOneProject } = require('./network');
            return yield getOneProject(pollId, ProjectId);
        });
        this.walletAddress = walletAddress.toLowerCase();
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map