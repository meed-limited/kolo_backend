"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exchange = exports.Chain = exports.Coins = exports.StatusCodes = void 0;
class StatusCodes {
}
exports.StatusCodes = StatusCodes;
StatusCodes.OK = 200;
StatusCodes.BadRequest = 400;
StatusCodes.NotFound = 404;
StatusCodes.InternalError = 500;
class Coins {
}
exports.Coins = Coins;
Coins.get = [{
        name: 'bnb',
        address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        network: 'binance'
    }];
class Chain {
}
exports.Chain = Chain;
// chain Ids for bsc, goerli, cronos, polygon testnets
Chain.IDs = [56, 97, 420, 338, 71393];
const exchanges = [
    { chainId: 56, name: 'pancakeswap_v2' },
];
class Exchange {
    static get(chainId) {
        const theExchange = exchanges.find(element => element.chainId === chainId);
        if (theExchange === undefined)
            return '';
        return theExchange.name;
    }
}
exports.Exchange = Exchange;
//# sourceMappingURL=constants.js.map