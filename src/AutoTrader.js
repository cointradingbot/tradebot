import {
    TradeInfo
} from './TradeInfo'

export class AutoTrader {
    constructor(testMode, sellAccount, buyAccount, tradeInfo) {
        this.sellAccount = sellAccount
        this.buyAccount = buyAccount
        this.testMode = testMode
        this.tradeInfo = tradeInfo
    }

    async tradable() {
        let okToTrade = true
        await Promise.all([
            this.buyAccount.updateBalances(),
            this.sellAccount.updateBalances()
        ])

        console.log('finished updated balances ...')
        if (this.tradeInfo.baseCoinQuantityAtBuy >= this.buyAccount.baseCoin.balance.free) {
            console.warn(`${this.buyAccount.tradingPlatform.name}: ${this.buyAccount.baseCoin.balance.free} ${this.buyAccount.baseCoin.token} is not enough to buy`)
            okToTrade = false
        } else if (this.tradeInfo.baseCoinProfit <= 0) {
            console.warn(`Profit is too low: ${this.tradeInfo.baseCoinProfit.toFixed(8)}`)
            okToTrade = false
        } else if (this.sellAccount.currentTradeCoin.balance <= 0.01000000 / this.tradeInfo.sellPrice) {
            okToTrade = false
        }

        return okToTrade
    }

    async trade() {
        console.log('trading...')
        if (this.testMode) {
            this.tradeInfo.sellPrice += 0.00000500
            this.tradeInfo.buyPrice -= 0.00000500
            this.tradeInfo.coinQuantityAtBuy = 500
            this.tradeInfo.coinQuantityAtSell = 500
        }

        let okToTrade = await this.tradable()
        if (okToTrade || this.testMode) {
            if(!okToTrade && this.testMode){
                console.log('Not tradable, but still trade in test mode...')
            }
            await Promise.all([
                this.buyAccount.buy(this.tradeInfo.coinQuantityAtBuy, this.tradeInfo.buyPrice),
                this.sellAccount.sell(this.tradeInfo.coinQuantityAtSell, this.tradeInfo.sellPrice)
            ])
        } else {
            console.log('Not tradable, please check your trade accounts...')
        }
    }
}