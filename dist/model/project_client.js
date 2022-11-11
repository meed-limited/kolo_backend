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
exports.getProjects = exports.getProject = exports.updateProject = exports.addNewProject = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const constants_1 = require("../utils/constants");
let response;
function addNewProject(project) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield prisma.projects.create({
            data: {
                chainId: project.chainId,
                projectId: project.projectId,
                name: project.name,
                amountRequired: project.amountRequired,
                cardImage: project.cardImage,
                tagLine: project.tagLine,
                organizationName: project.organizationName,
                organizationWebsite: project.organizationWebsite,
                youtubeLink: project.youtubeLink,
                contactLastname: project.contactPersonLastname,
                contactOthernames: project.contactPersonOthernames,
                walletAddress: project.walletAddress,
                senderAddress: project.senderAddress,
                pollId: project.pollId
            }
        });
        if (info === undefined) {
            response = {
                success: false,
                message: 'New project addition failed',
                code: constants_1.StatusCodes.InternalError
            };
            return response;
        }
        response = {
            success: true,
            message: 'New project added successfully',
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.addNewProject = addNewProject;
function updateProject(project) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield prisma.projects.update({
            data: {
                name: project.name,
                amountRequired: project.amountRequired,
                // chainId: project.chainId, // modification not allowed
                cardImage: project.cardImage,
                tagLine: project.tagLine,
                organizationName: project.organizationName,
                organizationWebsite: project.organizationWebsite,
                youtubeLink: project.youtubeLink,
                contactLastname: project.contactPersonLastname,
                contactOthernames: project.contactPersonOthernames,
                walletAddress: project.walletAddress,
                // senderAddress: project.senderAddress, // modification not allowed
            },
            where: {
                id: project.id,
            }
        });
        if (info === undefined) {
            response = {
                success: false,
                message: 'Project edit request failed',
                code: constants_1.StatusCodes.InternalError
            };
            return response;
        }
        response = {
            success: true,
            message: 'Project updated successfully',
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.updateProject = updateProject;
function getProject(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectInfo = yield prisma.projects.findUnique({
            where: {
                id: id
            }
        });
        yield prisma.$disconnect();
        if (projectInfo === null) {
            response = {
                success: false,
                message: 'The project with the id you requested is not found',
                code: constants_1.StatusCodes.NotFound
            };
            return response;
        }
        const project = {
            id: projectInfo.id,
            projectId: projectInfo.projectId,
            name: projectInfo.name,
            amountRequired: projectInfo.amountRequired,
            chainId: projectInfo.chainId,
            cardImage: projectInfo.cardImage,
            tagLine: projectInfo.tagLine,
            organizationName: projectInfo.organizationName,
            organizationWebsite: projectInfo.organizationWebsite,
            youtubeLink: projectInfo.youtubeLink,
            contactPersonLastname: projectInfo.contactLastname,
            contactPersonOthernames: projectInfo.contactOthernames,
            walletAddress: projectInfo.walletAddress,
            senderAddress: projectInfo.senderAddress,
            pollId: projectInfo.pollId
        };
        response = {
            success: true,
            data: { project },
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.getProject = getProject;
function getProjects(pollId, projectIds, voteCounts) {
    return __awaiter(this, void 0, void 0, function* () {
        const projectInfo = yield prisma.projects.findMany({
            where: {
                pollId: pollId
            }
        });
        yield prisma.$disconnect();
        if (projectInfo === null || projectInfo.length === 0) {
            response = {
                success: false,
                message: 'No projects submitted for the specified poll id',
                code: constants_1.StatusCodes.NotFound
            };
            return response;
        }
        const projects = [];
        for (const project of projectInfo) {
            const index = projectIds.indexOf(project.chainId);
            projects.push({
                id: project.id,
                projectId: project.projectId,
                name: project.name,
                amountRequired: project.amountRequired,
                chainId: project.chainId,
                cardImage: project.cardImage,
                tagLine: project.tagLine,
                organizationName: project.organizationName,
                organizationWebsite: project.organizationWebsite,
                youtubeLink: project.youtubeLink,
                contactPersonLastname: project.contactLastname,
                contactPersonOthernames: project.contactOthernames,
                walletAddress: project.walletAddress,
                senderAddress: project.senderAddress,
                pollId: project.pollId,
                totalVotes: voteCounts[index],
            });
        }
        response = {
            success: true,
            data: { projects },
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.getProjects = getProjects;
//# sourceMappingURL=project_client.js.map