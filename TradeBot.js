import { TradeBotOptions } from './TradeBotOptions'
import { TradeInfoAnalyzer } from './TradeInfoAnalyzer'

export class TradeBot {
    constructor(tradebotOptions) {
        this.isAutoTrading = false
        this.testMode = true
        this.tradebotOptions = tradebotOptions

        console.log('TradeBot initialized...')
    }

    async execute() {
        const delay = time => new Promise(res => setTimeout(() => res(), time));
        while (true) {
            let tradeInfoAnalyzer = new TradeInfoAnalyzer(this.tradebotOptions)
            await tradeInfoAnalyzer.updateCoinPrices()
            let tradeInfo = tradeInfoAnalyzer.analyzeFixedMode(1000, 0.00000002)

            let date = new Date().toLocaleString()
            let content =
                `${date} - ${this.coin} - ${this.buyAccount.tradingPlatform.id}: ${this.buyAccount.currentAskPrice.toFixed(8)} - ` +
                `${this.sellAccount.tradingPlatform.id}: ${this.sellAccount.currentBidPrice.toFixed(8)} - ` +
                `B-A: ${tradeInfo.deltaBidAsk.toFixed(8)} - ` +
                `BTC Profit: ${tradeInfo.bitcoinProfit.toFixed(8)} - ` +
                `Coin Qt.: ${tradeInfo.coinQuantityAtSell}`

            console.log(content)

            await delay(1300)
        }
    }

    // getters
    get coin() {
        return this.tradebotOptions.coin
    }
    get buyAccount() {
        return this.tradebotOptions.buyAccount
    }
    get sellAccount() {
        return this.tradebotOptions.sellAccount
    }
}