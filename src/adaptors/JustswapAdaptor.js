import Axios from 'axios';
import BnbApiClient from '@binance-chain/javascript-sdk'

export class JustswapAdaptor {
    constructor(publicKey, privateKey) {
        this.httpClient = Axios.create({
            baseURL: 'https://api.justswap.io/'
        })
        // this.tokens = {
        //     'ONE': 'ONE-5F9',
        //     'GTO': 'GTO-908'
        // }
        // this.publicKey = publicKey

        // this.bnbClient = new BnbApiClient('https://dex.binance.org')
        // this.bnbClient.chooseNetwork('mainnet')
        // this.bnbClient.setPrivateKey(privateKey)
        // this.bnbClient.initChain()
    }
    async fetchOrderBook(token, basedToken) {
        let result = await this.httpClient.get('v1/tradepairlist')
        return result.data['0_TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9']
    }
    async fetchTicker(pair) {
        let result = await this.httpClient.get('v1/tradepairlist')
        return result;
    }
    async fetchBalance(token, basedToken) {
        // let result = await this.httpClient.get(`api/v1/account/${this.publicKey}`)
        // let returnData = {
        //     token: result.data.balances.filter(item => item.symbol === this.tokens[token])[0],
        //     basedToken: result.data.balances.filter(item => item.symbol === basedToken)[0]
        // }
        // return returnData
    }
    async createOrder(token, basedToken, quantity, price, side) {
        // let sideId = side === 'buy' ? 1 : 2
        // await this.bnbClient.placeOrder(this.publicKey, `${this.tokens[token]}_${basedToken}`, sideId, price, quantity)
    }
}