import { Request, Response, NextFunction } from 'express';
import { CustomResponse } from '../utils/interfaces';
import { StatusCodes } from '../utils/constants';
import { User } from '../middleware/user';

let response: CustomResponse = { success: false, code: StatusCodes.BadRequest}

export const addNewProject = async(req: Request, res: Response, next: NextFunction) => {
    try {

        // console.log(JSON.stringify(req.body));
        const {
            SenderAddress, ChainId, ProjectId, // chainId is chain proposalId
            ProjectName, AmountRequired, DesiredCurrency, ProjectCardImage, ProjectTagLine,
            OrganizationName, OrganizationWebsite, YoutubeLink,
            ContactPersonLastname, ContactPersonOthernames,
            WalletAddress

        } = req.body;

        if (!SenderAddress || !ChainId || !ProjectId || !ProjectName || !AmountRequired || !DesiredCurrency || !ProjectCardImage || !ProjectTagLine || !OrganizationName || !OrganizationWebsite || !YoutubeLink || !ContactPersonLastname || !ContactPersonOthernames ||!WalletAddress) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'Some of the required fields for project submission are missing' });
            return;
        }

        const user: User = new User(SenderAddress);
        const response = await user.addProject(ChainId, ProjectId, ProjectName, AmountRequired, DesiredCurrency.toUpperCase(), ProjectCardImage, ProjectTagLine, OrganizationName, OrganizationWebsite, YoutubeLink, ContactPersonLastname, ContactPersonOthernames, WalletAddress);

        res.status(response.code).json({ success: response.success, message: response.message });

    } catch (err) {
        next(err);
    }
}

export const editProject = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const {
            Id, ChainId, ProjectId, ProjectName,
            AmountRequired, DesiredCurrency, ProjectCardImage, ProjectTagLine,
            OrganizationName, OrganizationWebsite, YoutubeLink,
            ContactPersonLastname, ContactPersonOthernames,
            WalletAddress, SenderAddress, PollId

        } = req.body;

        if (!WalletAddress || !Id || !ChainId || !ProjectId || !ProjectName || !AmountRequired || !DesiredCurrency || !ProjectCardImage || !ProjectTagLine || !OrganizationName || !OrganizationWebsite || !YoutubeLink || !ContactPersonLastname || !ContactPersonOthernames ||!WalletAddress || !PollId) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'Some of the required fields for updating projects are missing' });
            return;
        }

        const user: User = new User(WalletAddress);
        const response = await user.updateProject(Id, ChainId, ProjectId, ProjectName, AmountRequired, DesiredCurrency.toUpperCase(), ProjectCardImage, ProjectTagLine, OrganizationName, OrganizationWebsite, YoutubeLink, ContactPersonLastname, ContactPersonOthernames, WalletAddress, SenderAddress, PollId);

        res.status(response.code).json({ success: response.success, message: response.message });

    } catch (err) {
        next(err);
    }
}

export const getProject = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const {
            Id

        } = req.body;

        if (!Id) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'Some of the required fields to fectch project is missing' });
            return;
        }

        const user: User = new User('');
        const response = await user.getProject(Id);

        res.status(response.code).json({ success: response.success, message: response.message, data: response.data });

    } catch (err) {
        next(err);
    }
}

export const getProjects = async(req: Request, res: Response, next: NextFunction) => {
    try {

        const {
            PollId
        } = req.body;

        if (!PollId) {
            res.status(StatusCodes.BadRequest).json({ success: false, message: 'Some of the required fields to fetch project is missing' });
            return;
        }

        const user: User = new User('');
        const response = await user.getProjects(PollId);

        res.status(response.code).json({ success: response.success, message: response.message, data: response.data });

    } catch (err) {
        next(err);
    }
}