import axios from 'axios';

import { CoinInfo } from '../utils/types';
import { StatusCodes, Coins, Chain, Exchange } from '../utils/constants';
import { CustomResponse } from '../utils/interfaces';

let response: CustomResponse = { success: false, code: StatusCodes.BadRequest}
const chainIDs: number[] = Chain.IDs;
const coins: CoinInfo[] = Coins.get;

// https://api.covalenthq.com/v1/1/xy=k/uniswap_v2/tokens/address/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/?quote-currency=USD&format=JSON&key=ckey_b9f3ee715176495696da0d10b6a
// use chainId = 1 (ethereum Uniswap)
// user indicates what currency they want to be paid in
// we look for exchange rate on one of the exchanges
// amountToSend = amountToPayoutInUSD / exchange rate
// send amountToSend of currency selected by the user to the user

export const getCoinRate = async (desiredCurrency: string): Promise<CustomResponse> => {

    const contractsAddress: any = {
        BTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        ETH: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
        BNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    };

    const exchanges: any = {
        BTC: 'uniswap_v2',
        USDT: 'uniswap_v2',
        ETH: 'pancakeswap_v2',
    }; 
    
    const coinAddress: string = contractsAddress[desiredCurrency];

    const exchangeName: string = exchanges[desiredCurrency];
    const chainId: number = exchangeName == exchanges['ETH'] ? 56 : 1;

    const key: string = process.env.COVALENT_KEY!;
    const endpoint: string = `https://api.covalenthq.com/v1/${chainId}/xy=k/${exchangeName}/tokens/address/${coinAddress}/?quote-currency=USD&format=JSON&key=${key}`;

    let result: any = await axios.get(endpoint);
    result = result.data;
    result = result.data.items

    let quoteRate: string = '';
    if (result[0].token_0.contract_address === contractsAddress[desiredCurrency]) {
        quoteRate = result[0].token_0.quote_rate;
    } else if (result[0].token_1.contract_address === contractsAddress[desiredCurrency]) {
        quoteRate = result[0].token_1.quote_rate;
    } else {
        const itemsCount: number = result.length;
        const itemStr: string = JSON.stringify(result);
        let index = itemStr.indexOf('0x2170ed0880ac9a755fd29b2688956bd959f933f8');
        const substring: string = itemStr.substring(index, index+300);
        index = substring.indexOf('quote_rate');
        const quote: string[] = (substring.substring(index, index+20)).split(':');
        console.log(quote);
    
        quoteRate = quote[1];
    }

    console.log(quoteRate);

    response = { success: true, data: {result}, code: StatusCodes.OK };

    // console.log(`result: ${JSON.stringify(result)}`);

    return response;
}