import {
    TradeInfo
} from './TradeInfo'
import {
    emailHelper
} from './helper/EmailHelper';

export class AutoTrader {
    constructor(testMode, sellAccount, buyAccount, tradeInfo, transNumber, errorPlatform) {
        this.sellAccount = sellAccount
        this.buyAccount = buyAccount
        this.testMode = testMode
        this.tradeInfo = tradeInfo
        this.transNumber = transNumber
        this.errorPlatform = errorPlatform
    }

    async updateBalances() {
        await Promise.all([
            this.buyAccount.updateBalances(),
            this.sellAccount.updateBalances()
        ])
    }

    async tradable() {
        let okToTrade = true

        if (this.tradeInfo.baseCoinQuantityAtBuy >= this.buyAccount.baseCoin.balance.free) {
            console.warn(`${this.buyAccount.tradingPlatform.name}: ${this.buyAccount.baseCoin.balance.free} ${this.buyAccount.baseCoin.token} is not enough to buy`)
            okToTrade = false
        } else if (this.tradeInfo.baseCoinProfit <= 0) {
            console.warn(`Profit is too low: ${this.tradeInfo.baseCoinProfit.toFixed(8)}`)
            okToTrade = false
        } else if (this.sellAccount.currentTradeCoin.balance.free < this.tradeInfo.coinQuantityAtSell) {
            console.warn(`${this.sellAccount.tradingPlatform.name}: ${this.sellAccount.currentTradeCoin.balance.free} ${this.sellAccount.currentTradeCoin.token} is not enough to sell`)
            okToTrade = false
        } else if (this.buyAccount.currentAskQty < this.tradeInfo.coinQuantityAtBuy) {
            console.warn(`Current ask volume is too low: ${this.buyAccount.currentAskQty} < ${this.tradeInfo.coinQuantityAtBuy}`)
            okToTrade = false
        }

        return okToTrade
    }

    async tradeAutoBalance() {
        if (this.buyAccount.baseCoin.balance.free /
            (this.sellAccount.baseCoin.balance.free + this.buyAccount.baseCoin.balance.free) > 0.6) {
            console.log('AutoBalance trading ...')
            let result = await this.trade()
            if (result) {
                emailHelper.sendEmail('AutoBalance', 'Finished auto trading')
            }
        } else {
            console.log('Not suitable for autotrading!')
        }
    }

    async trade() {
        console.log('trading...')
        let result = false
        if (this.testMode) {
            console.log('trading in test mode (with +- 0.00000500)...');
            this.tradeInfo.sellPrice += 0.00000500
            this.tradeInfo.buyPrice -= 0.00000500
        }

        let okToTrade = await this.tradable()
        if (okToTrade) {
            console.log(`Buy ${this.tradeInfo.coinQuantityAtBuy} on ${this.buyAccount.tradingPlatform.name}, price ${this.tradeInfo.buyPrice}`)
            console.log(`Sell ${this.tradeInfo.coinQuantityAtSell} on ${this.sellAccount.tradingPlatform.name}, price ${this.tradeInfo.sellPrice}`)
            await Promise.all([
                this.buyAccount.buy(this.tradeInfo.coinQuantityAtBuy, this.tradeInfo.buyPrice, this.transNumber),
                this.sellAccount.sell(this.tradeInfo.coinQuantityAtSell, this.tradeInfo.sellPrice, this.transNumber)
            ])

            result = true
        } else {
            console.log('Not tradable, please check your trade accounts...')
        }

        return result
    }
}