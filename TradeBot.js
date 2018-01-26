import { TradeBotOptions } from './TradeBotOptions'
import { TradeInfoAnalyzer } from './TradeInfoAnalyzer'
import { AutoTrader } from './AutoTrader'

export class TradeBot {
    constructor(tradebotOptions) {
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

                if (this.tradebotOptions.isAutoTrading && tradeInfo.deltaBidAsk >= this.tradebotOptions.expectedDelta) {
                    console.log('auto trading ...')
                    let trader = new AutoTrader(
                        this.tradebotOptions.inTestMode, 
                        this.tradebotOptions.sellAccount,
                        this.tradebotOptions.buyAccount,
                        tradeInfo)

                    await trader.trade()
                }

                await delay(1300)
                break
            }
            catch (err) {
                console.log(err)
                await delay(1300)
                break
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