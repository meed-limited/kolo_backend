import { CoinInfo, ExchangeInfo } from './types';

export class StatusCodes {
    static readonly OK: number = 200;
    static readonly BadRequest: number = 400;
    static readonly NotFound: number = 404;
    static readonly InternalError: number = 500;
}

export class Coins {
    static readonly get: CoinInfo[] = [{
       name: 'bnb',
       address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
       network: 'binance'
    }];
}

export class Chain {
    // chain Ids for bsc, goerli, cronos, polygon testnets
    static readonly IDs: number[] = [ 56, 97, 420, 338, 71393 ];
}

const exchanges: ExchangeInfo[] = [
    { chainId: 56, name: 'pancakeswap_v2' },
]
export class Exchange {
    static get(chainId: number): string {

        const theExchange: any = exchanges.find(element => element.chainId === chainId);
        if (theExchange === undefined)
            return '';

        return theExchange.name;
    }
}