export class TradeInfo {
    constructor() {
        this.deltaBidBid = 0
        this.deltaBidAsk = 0
        this.baseCoinQuantityAtSell = 0
        this.coinQuantityAtSell = 0
        this.baseCoinQuantityAtBuy = 0
        this.coinQuantityAtBuy = 0
        this.coinProfit = 0
        this.baseCoinProfit = 0
        this.sellPrice = 0
        this.buyPrice = 0
        this.tradable = false
        // In case we can't trade, what's the reason
        this.message = undefined
    }
}