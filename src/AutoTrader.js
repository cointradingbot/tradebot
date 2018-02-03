import { TradeInfo } from './TradeInfo'

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
        if ((this.tradeInfo.baseCoinQuantityAtBuy >= this.buyAccount.baseCoin.balance) ||
            (this.tradable.profit <= 0) ||
            (this.sellAccount.currentTradeCoin.balance <= 0.01000000 / this.tradeInfo.sellPrice)) {
            okToTrade = false
        }
        return okToTrade
    }

    async trade() {
        console.log('trading...')
        if (this.testMode) {
            this.tradeInfo.sellPrice += 0.00000900
            this.tradeInfo.buyPrice -= 0.00000900
            this.tradeInfo.coinQuantityAtBuy = 100
            this.tradeInfo.coinQuantityAtSell = 100
        }

        if (this.tradable()) {
            await Promise.all([
                this.buyAccount.buy(this.tradeInfo.coinQuantityAtBuy, this.tradeInfo.buyPrice),
                this.sellAccount.sell(this.tradeInfo.coinQuantityAtSell, this.tradeInfo.sellPrice)
            ])
        } else {
            console.log('Not tradable, please check your trade accounts...')
        }
    }
}