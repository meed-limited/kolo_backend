import { Request, Response, NextFunction } from 'express';
import { CustomResponse } from '../utils/interfaces';
import { StatusCodes } from '../utils/constants';
import { User } from '../middleware/user';

let response: CustomResponse = { success: false, code: StatusCodes.BadRequest}

export const addNewProject = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const {
            DeviceId, ChainId, // chainId is chain proposalId
            ProjectName, ProjectCardImage, ProjectTagLine,
            OrganizationName, OrganizationWebsite, YoutubeLink,
            ContactPersonLastname, ContactPersonOthernames,
            WalletAddress, SenderAddress

        } = req.body;

        if (!DeviceId || !ChainId || !ProjectName || !ProjectCardImage || !ProjectTagLine || !OrganizationName || !OrganizationWebsite || !YoutubeLink || !ContactPersonLastname || !ContactPersonOthernames ||!WalletAddress) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'Some of the required fields for project submission are missing' });
            return;
        }

        const user: User = new User(DeviceId);
        const response = await user.addProject(ChainId, ProjectName, ProjectCardImage, ProjectTagLine, OrganizationName, OrganizationWebsite, YoutubeLink, ContactPersonLastname, ContactPersonOthernames, WalletAddress, SenderAddress);

        res.status(response.code).json({ success: response.success, message: response.message });

    } catch (err) {
        next(err);
    }
}

export const editProject = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const {
            DeviceId, Id, ChainId,
            ProjectName, ProjectCardImage, ProjectTagLine,
            OrganizationName, OrganizationWebsite, YoutubeLink,
            ContactPersonLastname, ContactPersonOthernames,
            WalletAddress, SenderAddress

        } = req.body;

        if (!DeviceId || !Id || !ChainId || !ProjectName || !ProjectCardImage || !ProjectTagLine || !OrganizationName || !OrganizationWebsite || !YoutubeLink || !ContactPersonLastname || !ContactPersonOthernames ||!WalletAddress) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'Some of the required fields for updating projects are missing' });
            return;
        }

        const user: User = new User(DeviceId);
        const response = await user.updateProject(Id, ChainId, ProjectName, ProjectCardImage, ProjectTagLine, OrganizationName, OrganizationWebsite, YoutubeLink, ContactPersonLastname, ContactPersonOthernames, WalletAddress, SenderAddress);

        res.status(response.code).json({ success: response.success, message: response.message });

    } catch (err) {
        next(err);
    }
}

export const getProject = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const {
            DeviceId, Id

        } = req.body;

        if (!DeviceId || !Id) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'Some of the required fields to fectch project is missing' });
            return;
        }

        const user: User = new User(DeviceId);
        const response = await user.getProject(Id);

        res.status(response.code).json({ success: response.success, message: response.message, data: response.data });

    } catch (err) {
        next(err);
    }
}