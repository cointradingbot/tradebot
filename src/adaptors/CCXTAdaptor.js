import * as ccxt from 'ccxt'

export class CCXTAdaptor {
    constructor(name, apiKey, secret) {
        let platform = eval(`ccxt.${name}`)
        this.platform = new platform({
            apiKey: apiKey,
            secret: secret
        })
    }

    async fetchBalance(token, basedToken) {
        let result = await this.platform.fetchBalance()
        let returnData = {
            token: result[token],
            basedToken: result[basedToken]
        }
        return returnData
    }

    async fetchOrderBook(token, basedToken) {
        let result = await this.platform.fetchOrderBook(`${token}/${basedToken}`)
        return result;
    }
    
    async createOrder(token, basedToken, quantity, price, side) {
        await this.platform.createOrder(`${token}/${basedToken}`, 'limit', side, quantity, price, {})
    }

}