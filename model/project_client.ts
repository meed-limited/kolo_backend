import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { CustomResponse, Project } from '../utils/interfaces';
import { StatusCodes } from '../utils/constants';

let response: CustomResponse;

export async function addNewProject(project: Project): Promise<CustomResponse> {
    const info = await prisma.projects.create({
        data: {
            chainId: project.chainId,
            name: project.name,
            cardImage: project.cardImage!,
            tagLine: project.tagLine,
            organizationName: project.organizationName,
            organizationWebsite: project.organizationWebsite!,
            youtubeLink: project.youtubeLink!,
            contactLastname: project.contactPersonLastname,
            contactOthernames: project.contactPersonOthernames,
            walletAddress: project.walletAddress,
            senderAddress: project.senderAddress,
        }
    })

    if (info === undefined) {
        response = {
            success: false,
            message: 'New project addition failed',
            code: StatusCodes.InternalError
        }
        return response;
    }

    response = {
        success: true,
        message: 'New project added successfully',
        code: StatusCodes.OK
    }
    return response;
}

export async function updateProject(project: Project): Promise<CustomResponse> {
    const info = await prisma.projects.update({
        data: {
            name: project.name,
            // chainId: project.chainId, // modification not allowed
            cardImage: project.cardImage!,
            tagLine: project.tagLine,
            organizationName: project.organizationName,
            organizationWebsite: project.organizationWebsite!,
            youtubeLink: project.youtubeLink!,
            contactLastname: project.contactPersonLastname,
            contactOthernames: project.contactPersonOthernames,
            walletAddress: project.walletAddress,
            // senderAddress: project.senderAddress, // modification not allowed
        },
        where: {
            id: project.id,
        }
    })

    if (info === undefined) {
        response = {
            success: false,
            message: 'Project edit request failed',
            code: StatusCodes.InternalError
        }
        return response;
    }

    response = {
        success: true,
        message: 'Project updated successfully',
        code: StatusCodes.OK
    }
    return response;
}

export async function getProject(id: number): Promise<CustomResponse> {

    const projectInfo = await prisma.projects.findUnique({
        where: {
            id: id
        }
    });
    await prisma.$disconnect();

    
    if  (projectInfo === null) {
        response = {
            success: false,
            message: 'The project with the id you requested is not found',
            code: StatusCodes.NotFound
        }
        return response;
    }

    const project: Project = {
        id: projectInfo.id,
        name: projectInfo.name,
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
    }

    response = {
        success: true,
        data: { project },
        code: StatusCodes.OK
    }

    return response;
}