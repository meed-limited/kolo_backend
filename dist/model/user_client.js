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
exports.getTokensForTransfer = exports.resetMovedTokenCount = exports.resetTokenCount = exports.getAdsTokenCount = exports.increaseAdsCount = exports.getUserAccessToken = exports.updateUserAccessToken = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const constants_1 = require("../utils/constants");
let response;
function updateUserAccessToken(walletAddress, objectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield prisma.users.upsert({
            create: {
                objectId: objectId,
                walletAddress: walletAddress
            },
            update: {
                walletAddress: walletAddress
            },
            where: {
                walletAddress: walletAddress
            }
        });
        // console.log(`info: ${JSON.stringify(info)}`);
        response = {
            success: true,
            message: 'The user access token is updated',
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.updateUserAccessToken = updateUserAccessToken;
function getUserAccessToken(walletAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessInfo = yield prisma.users.findUnique({
            where: {
                walletAddress: walletAddress
            }
        });
        if (accessInfo === null) {
            response = {
                success: false,
                message: 'User access token not found',
                code: constants_1.StatusCodes.NotFound
            };
            yield prisma.$disconnect();
            return response;
        }
        response = {
            success: true,
            data: { access: accessInfo.objectId },
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.getUserAccessToken = getUserAccessToken;
function increaseAdsCount(walletAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield prisma.users.findUnique({
            where: {
                walletAddress: walletAddress
            }
        });
        if (info === null) {
            response = {
                success: false,
                message: 'user record with the device id not found',
                code: constants_1.StatusCodes.NotFound
            };
            yield prisma.$disconnect();
            return response;
        }
        let adsCount = info.adsCount + 1; // get it and add 1 to it
        let daoTokenCount = info.daoTokenCount;
        if (adsCount === 10) {
            daoTokenCount = info.daoTokenCount + 1;
            adsCount = 0;
        }
        yield prisma.users.update({
            data: {
                adsCount: adsCount,
                daoTokenCount: daoTokenCount
            },
            where: {
                walletAddress: walletAddress
            }
        });
        response = {
            success: true,
            message: 'The user ads count is increased by 1',
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.increaseAdsCount = increaseAdsCount;
function getAdsTokenCount(walletAddress) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield prisma.users.findUnique({
            where: {
                walletAddress: walletAddress
            }
        });
        if (info === null) {
            response = {
                success: false,
                message: 'user record with the device id not found',
                code: constants_1.StatusCodes.NotFound
            };
            yield prisma.$disconnect();
            return response;
        }
        response = {
            success: true,
            data: { adsCount: info.adsCount, tokenCount: info.daoTokenCount },
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.getAdsTokenCount = getAdsTokenCount;
function resetTokenCount(walletAddress, amountToDeduct) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield prisma.users.findUnique({
            where: {
                walletAddress: walletAddress
            }
        });
        if (info === null) {
            response = {
                success: false,
                message: 'user record with the device id not found',
                code: constants_1.StatusCodes.NotFound
            };
            yield prisma.$disconnect();
            return response;
        }
        yield prisma.users.update({
            data: {
                daoTokenCount: info.daoTokenCount - amountToDeduct
            },
            where: {
                walletAddress: walletAddress
            }
        });
        response = {
            success: true,
            message: 'The user token count is reset',
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.resetTokenCount = resetTokenCount;
function resetMovedTokenCount(walletAddresses) {
    return __awaiter(this, void 0, void 0, function* () {
        const info = yield prisma.users.updateMany({
            where: {
                walletAddress: {
                    in: walletAddresses
                }
            },
            data: {
                daoTokenCount: 0
            }
        });
        console.log(`updated many: ${JSON.stringify(info)}`);
        yield prisma.$disconnect();
        // if (info === null) {
        //     response = {
        //         success: false,
        //         message: 'user record with the device id not found',
        //         code: StatusCodes.NotFound
        //     }
        //     await prisma.$disconnect();
        //     return response;
        // }
        response = {
            success: true,
            message: 'The moved token counts have been reset',
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.resetMovedTokenCount = resetMovedTokenCount;
function getTokensForTransfer() {
    return __awaiter(this, void 0, void 0, function* () {
        const userInfo = yield prisma.users.findMany();
        yield prisma.$disconnect();
        if (userInfo === null || userInfo.length === 0) {
            response = {
                success: false,
                message: 'No users in the exist at the moment',
                code: constants_1.StatusCodes.NotFound
            };
            return response;
        }
        const bakers = [];
        const amounts = [];
        for (const user of userInfo) {
            if (user.daoTokenCount > 0) {
                bakers.push(user.walletAddress);
                amounts.push(user.daoTokenCount);
            }
        }
        response = {
            success: true,
            data: { bakers, amounts },
            code: constants_1.StatusCodes.OK
        };
        return response;
    });
}
exports.getTokensForTransfer = getTokensForTransfer;
//# sourceMappingURL=user_client.js.map