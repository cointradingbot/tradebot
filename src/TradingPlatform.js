import { BinanceDEXAdaptor } from './adaptors/BinanceDEXAdaptor';
import { CCXTAdaptor } from './adaptors/CCXTAdaptor';

export class TradingPlatform {
    constructor(name, apiKey, secret, privateKey) {
        switch (name) {
            case "binancedex":
                // Binance DEX adaptor
                this.adaptor = new BinanceDEXAdaptor(name, privateKey)
                break;
            default:
                // ccxt adaptor
                this.adaptor = new CCXTAdaptor(name, apiKey, secret)
                break;
        }
        this.name = name
        // this.fetchBalance = this.adaptor.fetchBalance
        // this.createOrder = this.adaptor.createOrder
    }

    async fetchOrderBook(token, basedToken) {
        return await this.adaptor.fetchOrderBook(token, basedToken)
    }
    async fetchTicker(pair) {
        return await this.adaptor.fetchTicker(token, basedToken)
    }
}