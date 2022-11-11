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
exports.getProjects = exports.getProject = exports.editProject = exports.addNewProject = void 0;
const constants_1 = require("../utils/constants");
const user_1 = require("../middleware/user");
let response = { success: false, code: constants_1.StatusCodes.BadRequest };
const addNewProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log(JSON.stringify(req.body));
        const { SenderAddress, ChainId, ProjectId, // chainId is chain proposalId
        ProjectName, AmountRequired, ProjectCardImage, ProjectTagLine, OrganizationName, OrganizationWebsite, YoutubeLink, ContactPersonLastname, ContactPersonOthernames, WalletAddress } = req.body;
        if (!SenderAddress || !ChainId || !ProjectId || !ProjectName || !AmountRequired || !ProjectCardImage || !ProjectTagLine || !OrganizationName || !OrganizationWebsite || !YoutubeLink || !ContactPersonLastname || !ContactPersonOthernames || !WalletAddress) {
            res.status(constants_1.StatusCodes.BadRequest).json({ success: false, message: 'Some of the required fields for project submission are missing' });
            return;
        }
        const user = new user_1.User(SenderAddress);
        const response = yield user.addProject(ChainId, ProjectId, ProjectName, AmountRequired, ProjectCardImage, ProjectTagLine, OrganizationName, OrganizationWebsite, YoutubeLink, ContactPersonLastname, ContactPersonOthernames, WalletAddress);
        res.status(response.code).json({ success: response.success, message: response.message });
    }
    catch (err) {
        next(err);
    }
});
exports.addNewProject = addNewProject;
const editProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Id, ChainId, ProjectId, ProjectName, AmountRequired, ProjectCardImage, ProjectTagLine, OrganizationName, OrganizationWebsite, YoutubeLink, ContactPersonLastname, ContactPersonOthernames, WalletAddress, SenderAddress, PollId } = req.body;
        if (!WalletAddress || !Id || !ChainId || !ProjectId || !ProjectName || !AmountRequired || !ProjectCardImage || !ProjectTagLine || !OrganizationName || !OrganizationWebsite || !YoutubeLink || !ContactPersonLastname || !ContactPersonOthernames || !WalletAddress || !PollId) {
            res.status(constants_1.StatusCodes.BadRequest).json({ success: false, message: 'Some of the required fields for updating projects are missing' });
            return;
        }
        const user = new user_1.User(WalletAddress);
        const response = yield user.updateProject(Id, ChainId, ProjectId, ProjectName, AmountRequired, ProjectCardImage, ProjectTagLine, OrganizationName, OrganizationWebsite, YoutubeLink, ContactPersonLastname, ContactPersonOthernames, WalletAddress, SenderAddress, PollId);
        res.status(response.code).json({ success: response.success, message: response.message });
    }
    catch (err) {
        next(err);
    }
});
exports.editProject = editProject;
const getProject = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Id } = req.body;
        if (!Id) {
            res.status(constants_1.StatusCodes.BadRequest).json({ success: false, message: 'Some of the required fields to fectch project is missing' });
            return;
        }
        const user = new user_1.User('');
        const response = yield user.getProject(Id);
        res.status(response.code).json({ success: response.success, message: response.message, data: response.data });
    }
    catch (err) {
        next(err);
    }
});
exports.getProject = getProject;
const getProjects = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { PollId } = req.body;
        if (!PollId) {
            res.status(constants_1.StatusCodes.BadRequest).json({ success: false, message: 'Some of the required fields to fetch project is missing' });
            return;
        }
        const user = new user_1.User('');
        const response = yield user.getProjects(PollId);
        res.status(response.code).json({ success: response.success, message: response.message, data: response.data });
    }
    catch (err) {
        next(err);
    }
});
exports.getProjects = getProjects;
//# sourceMappingURL=project.js.map