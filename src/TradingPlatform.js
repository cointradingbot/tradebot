import { BinanceDEXAdaptor } from './adaptors/BinanceDEXAdaptor';
import { CCXTAdaptor } from './adaptors/CCXTAdaptor';

export class TradingPlatform {
    constructor(name, apiKey, secret, publicKey, privateKey) {
        switch (name) {
            case "binancedex":
                // Binance DEX adaptor
                this.adaptor = new BinanceDEXAdaptor(publicKey, privateKey)
                break;
            default:
                // ccxt adaptor
                this.adaptor = new CCXTAdaptor(name, apiKey, secret)
                break;
        }
        this.name = name
        // this.fetchBalance = this.adaptor.fetchBalance
    }
    async fetchBalance(token, basedToken){
        return await this.adaptor.fetchBalance(token, basedToken)
    }
    async fetchOrderBook(token, basedToken) {
        return await this.adaptor.fetchOrderBook(token, basedToken)
    }
    async fetchTicker(token, basedToken) {
        return await this.adaptor.fetchTicker(token, basedToken)
    }
    async createOrder(token, basedToken, quantity, price, side){
        return await this.adaptor.createOrder(token, basedToken, quantity, price, side)
    }
}