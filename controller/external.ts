import { Request, Response, NextFunction } from 'express';
import { CustomResponse } from '../utils/interfaces';
import { StatusCodes } from '../utils/constants';
// npm i @axelar-network/axelarjs-sdk": "^0.11.",
// import { AxelarQueryAPIConfig, AxelarQueryAPI, Environment } from '@axelar-network/axelarjs-sdk';

let response: CustomResponse = { success: false, code: StatusCodes.BadRequest}

export const getRate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { chainId, coin } = req.body;
        if (!chainId || !coin) {
            response.message = 'Chain-id and coin parameters are required';
            res.status(response.code).json( { success: response.success, message: response.message } );
            return;
        }

        const { getCoinRate } = require('./middleware/external-service');
        response = await getCoinRate(coin, chainId);
        res.status(response.code).json( { success: response.success, message: response.message, data: response.data } );

        // console.log(`checking rates for ${chainId} and ${coin} ...`);
    } catch (err) {
        next(err);
    }
}

export const swapCoins = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { srcCoin, srcChainId, destCoin, destChainId } = req.body;
        if (!srcCoin || !srcChainId || !destCoin || !destChainId) {
            response.message = 'srcCoin, srcChainId, destCoin, and destChainId are required';
            res.status(response.code).json( { success: response.success, message: response.message } );
            return;
        }

        console.log(`swapping rates for (${srcCoin} - ${srcChainId}) to (${destCoin} - ${destChainId}) ...`);
    } catch (err) {
        next(err);
    }
}

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