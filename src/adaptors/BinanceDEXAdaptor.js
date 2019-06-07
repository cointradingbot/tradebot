import Axios from 'axios';
import BnbApiClient from '@binance-chain/javascript-sdk'

export class BinanceDEXAdaptor {
    constructor(publicKey, privateKey) {
        this.httpClient = Axios.create({
            baseURL: 'https://dex.binance.org'
        })
        this.tokens = {
            'ONE': 'ONE-5F9'
        }
        this.publicKey = publicKey

        this.bnbClient = new BnbApiClient('https://dex.binance.org')
        this.bnbClient.chooseNetwork('mainnet')
        this.bnbClient.setPrivateKey(privateKey)
        this.bnbClient.initChain()
    }
    async fetchOrderBook(token, basedToken) {
        let result = await this.httpClient.get(`api/v1/depth?symbol=${this.tokens[token]}_${basedToken}`)
        return result.data
    }
    async fetchTicker(pair) {
        // let data = await this.httpClient.get('api/v1/depth?symbol=ONE-5F9_BNB')
    }
    async fetchBalance() {

    }
    async createOrder() {
        try {
            await this.bnbClient.placeOrder(this.publicKey, 'ONE-5F9_BNB', 1, 0.00070000, 1000, 1)
        } catch (error) {
            console.log(error)
        }
    }
}