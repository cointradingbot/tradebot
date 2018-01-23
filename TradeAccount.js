import * as ccxt from 'ccxt'
import { supportedTradingPlatforms } from "./supportedTradingPlatforms";

export class TradeAccount {
    constructor(tradingPlatform, coin) {
        this.currentAskPrice = 0.0
        this.currentBidPrice = 0.0
        this.currentBidQty = 0.0
        this.currentAskQty = 0.0
        this.tradingFee = 0.0
        this.bitcoin = new Coin('BTC')
        this.tradecoin = new Coin(coin)
        this.tradingPlatform = new tradingPlatform()
        console.log(`Create account of ${this.tradingPlatform.id}`)
    }

    async updatePrices() {
        var tradingPlatform = new ccxt.binance()
        let result = await tradingPlatform.fetchTicker(`${this.tradecoin.token}/BTC`)
        this.currentAskPrice = result.ask
        this.currentAskQty = result.askVolume
        this.currentBidPrice = result.bid
        this.currentBidQty = result.bidVolume
        console.log(`${tradingPlatform.id} - bid: ${this.currentBidPrice}, ask: ${this.currentAskPrice}`)
    }

    async updateBlances() {
    }

    async buy() {

    }
    async sell() {

    }
    async isOrderMatched() {

    }
}

class Coin {
    constructor(token) {
        this.token = token
        this.balance = 0.0
        this.transferFee = 0.0
        this.coinPrice = new CoinPrice()
    }
}

class CoinPrice {
    constructor() {
        this.lastPrice = 0.0
        this.bidPrice = 0.0
        this.bidQuantity = 0.0
        this.askPrice = 0.0
        this.askQuantity = 0.0
        this.retrievalTime = null
    }
}