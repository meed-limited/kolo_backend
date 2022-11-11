
export interface CustomResponse {
    success: boolean;
    message?: string;
    data?: object;
    code: number;
}

export interface Proposal {
    id: number;
    title: string;
    description: string;
    totalVotes: number;
    walletAddress: string;
    ownerAddress: string;
}

export interface Project {
    id?: number;
    chainId: string;
    projectId: number;
    name: string;
    amountRequired: number;
    cardImage: string;
    tagLine: string;
    organizationName: string;
    organizationWebsite: string;
    youtubeLink: string;
    contactPersonLastname: string;
    contactPersonOthernames: string;
    walletAddress: string;
    senderAddress: string;
    pollId: number;
    totalVotes?: number;
}