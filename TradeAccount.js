import * as ccxt from 'ccxt'
import { supportedTradingPlatforms } from "./supportedTradingPlatforms";

export class TradeAccount {
    constructor(tradingPlatform, coin) {
        this.currentAskPrice = 0.0
        this.currentBidPrice = 0.0
        this.currentBidQty = 0.0
        this.currentAskQty = 0.0
        this.bitcoin = new Coin('BTC')
        this.tradecoin = new Coin(coin)
        this.tradingFee = tradingPlatform.TradingFee

        this.tradingPlatform = new supportedTradingPlatforms[tradingPlatform.Name]({
            apiKey: tradingPlatform.API_KEY,
            secret: tradingPlatform.API_SECRET
        })

        this.metaInfo = this.tradingPlatform.describe()
        console.log(`Create account of ${this.tradingPlatform.id}`)
    }

    async updatePrices() {
        let result = await this.tradingPlatform.fetchTicker(`${this.tradecoin.token}/BTC`)
        this.currentAskPrice = result.ask
        this.currentAskQty = result.askVolume
        this.currentBidPrice = result.bid
        this.currentBidQty = result.bidVolume
    }

    async updateBalances() {
        console.log('updating balances ...')
        let balance = await this.tradingPlatform.fetchBalance()
        this.bitcoin.balance = balance[this.bitcoin.token]
        this.tradecoin.balance = balance[this.tradecoin.token]
    }

    async buy(coinQuantityAtBuy, buyPrice) {
        await this.tradingPlatform.createOrder(
            `${this.tradecoin.token}/${this.bitcoin.token}`, 'limit', 'buy', coinQuantityAtBuy, buyPrice, {})
    }

    async sell(coinQuantityAtSell, sellPrice) {
        await this.tradingPlatform.createOrder(
            `${this.tradecoin.token}/${this.bitcoin.token}`, 'limit', 'sell', coinQuantityAtSell, sellPrice, {})
    }

    async isOrderMatched() {

    }
}

class Coin {
    constructor(token) {
        this.token = token
        this.balance = 0.0
        this.transferFee = 0.0
    }
}