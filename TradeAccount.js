export class TradeAccount {
    constructor() {
        this.currentAskPrice = 0.0
        this.currentBidPrice = 0.0
        this.currentBidQty = 0.0
        this.currentAskQty = 0.0
        this.tradingFee = 0.0
        this.bitcoin = new Coin()
        this.tradecoin = new Coin()
    }

    updatePrices() {
    }

    updateBlances() {
    }

    buy() {

    }
    sell() {

    }
    isOrderMatched() {

    }
}

class Coin {
    constructor() {
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