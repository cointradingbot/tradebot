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
            try {
                let tradeInfoAnalyzer = new TradeInfoAnalyzer(this.tradebotOptions)
                await tradeInfoAnalyzer.updateCoinPrices()
                let tradeInfo = tradeInfoAnalyzer.analyzeFixedMode(
                    this.tradebotOptions.fixedQuantity, 
                    this.tradebotOptions.plusPointToWin)

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
            catch (err) {
                console.log(err)
                await delay(1300)
            }
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