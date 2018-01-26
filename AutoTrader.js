import { TradeInfo } from './TradeInfo'

export class AutoTrader {
    constructor(testMode, tradeInfo) {
        this.testMode = testMode
        this.tradeInfo = tradeInfo
    }

    async trade() {
        if (this.testMode) {
            this.tradeInfo.sellPrice += 0.00000900
            this.tradeInfo.buyPrice -= 0.00000900
            this.tradeInfo.coinQuantityAtBuy = 100
            this.tradeInfo.coinQuantityAtSell = 100
        }

        await this.buyAccount.buy(this.tradeInfo.coinQuantityAtBuy, this.tradeInfo.buyPrice)
        await this.sellAccount.sell(this.tradeInfo.coinQuantityAtSell, this.tradeInfo.sellPrice)
    }

    // getters
    get buyAccount() {
        return this.tradeInfo.buyAccount
    }

    get sellAccount() {
        return this.tradeInfo.sellAccount
    }
}