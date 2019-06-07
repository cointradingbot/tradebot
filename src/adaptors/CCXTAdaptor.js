import * as ccxt from 'ccxt'

export class CCXTAdaptor {
    constructor(name, apiKey, secret) {
        let platform = eval(`ccxt.${name}`)
        this.platform = new platform({
            apiKey: apiKey,
            secret: secret
        })

    }

    async fetchOrderBook(token, basedToken) {
        let result = await this.platform.fetchOrderBook(`${token}/${basedToken}`)
        return result;
    }
}