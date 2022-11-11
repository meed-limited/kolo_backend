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
exports.swapCoins = exports.getRate = void 0;
const constants_1 = require("../utils/constants");
// npm i @axelar-network/axelarjs-sdk": "^0.11.",
// import { AxelarQueryAPIConfig, AxelarQueryAPI, Environment } from '@axelar-network/axelarjs-sdk';
let response = { success: false, code: constants_1.StatusCodes.BadRequest };
const getRate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { CurrencyDesired } = req.body;
        if (!CurrencyDesired) {
            response.message = 'Currency desire is required';
            res.status(response.code).json({ success: response.success, message: response.message });
            return;
        }
        if (['USDT', 'BTC', 'ETH', 'BNB', 'MATIC', 'SOL'].indexOf(CurrencyDesired.toUpperCase()) === -1) {
            response.message = 'Currency not supported. Only USDT, BTC, ETH, BNB, MATIC, SOL are supported';
            res.status(response.code).json({ success: response.success, message: response.message });
            return;
        }
        const { getCoinRate } = require('../middleware/external-service');
        response = yield getCoinRate(CurrencyDesired);
        res.status(response.code).json({ success: response.success, message: response.message, data: response.data });
    }
    catch (err) {
        next(err);
    }
});
exports.getRate = getRate;
const swapCoins = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { srcCoin, srcChainId, destCoin, destChainId } = req.body;
        if (!srcCoin || !srcChainId || !destCoin || !destChainId) {
            response.message = 'srcCoin, srcChainId, destCoin, and destChainId are required';
            res.status(response.code).json({ success: response.success, message: response.message });
            return;
        }
        console.log(`swapping rates for (${srcCoin} - ${srcChainId}) to (${destCoin} - ${destChainId}) ...`);
    }
    catch (err) {
        next(err);
    }
});
exports.swapCoins = swapCoins;
/*
export const sendCoin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sdk = new AxelarQueryAPI({
            environment: Environment.TESTNET, // "testnet",
        });

        const queryConfig: AxelarQueryAPIConfig = {
            environment: Environment.TESTNET
        }

        const api = new AxelarQueryAPI(queryConfig);
        const denom = await api.getDenomFromSymbol("aUSDC", "moonbeam");
        console.log("denom: ",denom);
        res.status(StatusCodes.OK).json({ success: true, data: { denom: denom } });
    } catch (err) {
        next(err);
    }
}
*/ 
//# sourceMappingURL=external.js.map