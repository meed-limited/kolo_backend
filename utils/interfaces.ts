
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
    chainId: number;
    name: string;
    cardImage: string;
    tagLine: string;
    organizationName: string;
    organizationWebsite: string;
    youtubeLink: string;
    contactPersonLastname: string;
    contactPersonOthernames: string;
    walletAddress: string;
    senderAddress: string;
}