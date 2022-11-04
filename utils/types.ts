export type CoinInfo = {
    name: string;
    address: string;
    network: string;
}

export type ExchangeInfo = {
    chainId: number; // e.g., binance (56), ethereum
    name: string; // e.g., pancakeswap_v2, uniswap_v3
}