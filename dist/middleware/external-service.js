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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoinRate = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../utils/constants");
let response = { success: false, code: constants_1.StatusCodes.BadRequest };
const chainIDs = constants_1.Chain.IDs;
const coins = constants_1.Coins.get;
// https://api.covalenthq.com/v1/1/xy=k/uniswap_v2/tokens/address/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48/?quote-currency=USD&format=JSON&key=ckey_b9f3ee715176495696da0d10b6a
// use chainId = 1 (ethereum Uniswap)
// user indicates what currency they want to be paid in
// we look for exchange rate on one of the exchanges
// amountToSend = amountToPayoutInUSD / exchange rate
// send amountToSend of currency selected by the user to the user
const getCoinRate = (desiredCurrency) => __awaiter(void 0, void 0, void 0, function* () {
    const contractsAddress = {
        BTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
        USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
        ETH: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
        BNB: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    };
    const exchanges = {
        BTC: 'uniswap_v2',
        USDT: 'uniswap_v2',
        ETH: 'pancakeswap_v2',
    };
    const coinAddress = contractsAddress[desiredCurrency];
    const exchangeName = exchanges[desiredCurrency];
    const chainId = exchangeName == exchanges['ETH'] ? 56 : 1;
    const key = process.env.COVALENT_KEY;
    const endpoint = `https://api.covalenthq.com/v1/${chainId}/xy=k/${exchangeName}/tokens/address/${coinAddress}/?quote-currency=USD&format=JSON&key=${key}`;
    let result = yield axios_1.default.get(endpoint);
    result = result.data;
    result = result.data.items;
    let quoteRate = '0';
    const itemsCount = result.length;
    const itemStr = JSON.stringify(result);
    let index = itemStr.indexOf('0x2170ed0880ac9a755fd29b2688956bd959f933f8');
    const substring = itemStr.substring(index, index + 300);
    index = substring.indexOf('quote_rate');
    const quote = (substring.substring(index, index + 20)).split(':');
    console.log(quote);
    quoteRate = quote[1];
    // const tokenItem: any = result.find((item: any) => item.token_0 === coinAddress || item.token_1 === coinAddress);
    // console.log(JSON.stringify(tokenItem));
    // console.log(itemsCount);
    response = { success: true, data: { result }, code: constants_1.StatusCodes.OK };
    // console.log(`result: ${JSON.stringify(result)}`);
    return response;
});
exports.getCoinRate = getCoinRate;
//# sourceMappingURL=external-service.js.map