import {
    BnbApiClient
} from '@binance-chain/javascript-sdk'
import Axios from 'axios';

export class BinanceDEXAdaptor {
    constructor(name, privateKey) {
        this.httpClient = Axios.create({
            baseURL: 'https://dex.binance.org'
        })
        this.tokens = {
            'ONE': 'ONE-5F9'
        }
    }
    async fetchOrderBook(token, basedToken) {
        let result = await this.httpClient.get(`api/v1/depth?symbol=${this.tokens[token]}_${basedToken}`)
        return result.data
    }
    async fetchTicker(pair) {
        // let data = await this.httpClient.get('api/v1/depth?symbol=ONE-5F9_BNB')
    }
    fetchBalance() {

    }
    createOrder() {}
}