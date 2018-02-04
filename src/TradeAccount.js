import * as ccxt from 'ccxt'
import {
    supportedTradingPlatforms
} from "./supportedTradingPlatforms";

export class TradeAccount {
    constructor(tradingPlatform, coin, baseCoin) {
        this.currentAskPrice = 0.0
        this.currentBidPrice = 0.0
        this.currentBidQty = 0.0
        this.currentAskQty = 0.0
        this.baseCoin = new Coin(baseCoin)
        this.currentTradeCoin = new Coin(coin)
        this.tradingFee = tradingPlatform.tradingFee

        this.tradingPlatform = new supportedTradingPlatforms[tradingPlatform.name]({
            apiKey: tradingPlatform.api_key,
            secret: tradingPlatform.api_secret
        })

        this.metaInfo = this.tradingPlatform.describe()
        console.log(`Create account of ${this.tradingPlatform.id}`)
    }

    updateCurrentTradeCoin(coin){
        this.currentTradeCoin = new Coin(coin)
    }

    async updatePrices() {
        let result = await this.tradingPlatform.fetchTicker(`${this.currentTradeCoin.token}/${this.baseCoin.token}`)
        this.currentAskPrice = result.ask
        this.currentAskQty = result.askVolume
        this.currentBidPrice = result.bid
        this.currentBidQty = result.bidVolume
    }

    async updateBalances() {
        console.log('updating balances ...')
        let balance = await this.tradingPlatform.fetchBalance()
        this.baseCoin.balance = balance[this.baseCoin.token]
        this.currentTradeCoin.balance = balance[this.currentTradeCoin.token]
    }

    async buy(coinQuantityAtBuy, buyPrice) {
        await this.tradingPlatform.createOrder(
            `${this.currentTradeCoin.token}/${this.baseCoin.token}`, 'limit', 'buy', coinQuantityAtBuy, buyPrice, {})
    }

    async sell(coinQuantityAtSell, sellPrice) {
        await this.tradingPlatform.createOrder(
            `${this.currentTradeCoin.token}/${this.baseCoin.token}`, 'limit', 'sell', coinQuantityAtSell, sellPrice, {})
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