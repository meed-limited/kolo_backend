import axios from 'axios';

import { CoinInfo } from '../utils/types';
import { StatusCodes, Coins, Chain, Exchange } from '../utils/constants';
import { CustomResponse } from '../utils/interfaces';

let response: CustomResponse = { success: false, code: StatusCodes.BadRequest}
const chainIDs: number[] = Chain.IDs;
const coins: CoinInfo[] = Coins.get;

export const getCoinRate = async (coin: string, chainId: number): Promise<CustomResponse> => {

    if (!chainIDs.includes(chainId)) {
        response.message = 'The specified chain-id is unknown';
        return response;
    }

    const theCoin: any = coins.find(element => element.name === coin);
    if (theCoin === undefined) {
        response.message = 'The specified coin is unknown';
        return response;
    }

    const exchangeName: string = Exchange.get(chainId);
    if (exchangeName === '') {
        response.message = 'Failed to retrieved the exchange name due to the unknown chain-id';
        return response;
    }
    
    const address: string = theCoin.address;
    const key: string = process.env.COVALENT_KEY!;
    const endpoint: string = `https://api.covalenthq.com/v1/${chainId}/xy=k/${exchangeName}/tokens/address/${address}/?quote-currency=USD&format=JSON&key=${key}`;

    let result = await axios.get(endpoint);
    result = result.data;

    response = { success: true, data: result, code: StatusCodes.OK };

    console.log(`result: ${JSON.stringify(result)}`);

    return response;
}