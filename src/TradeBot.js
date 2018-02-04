import { TradeBotOptions } from './TradeBotOptions'
import { TradeInfoAnalyzer } from './TradeInfoAnalyzer'
import { AutoTrader } from './AutoTrader'
import { emailHelper } from './helper/EmailHelper'

export class TradeBot {
    constructor(tradebotOptions, io) {
        this.tradebotOptions = tradebotOptions
        this.timeLeftToSendEmail = 0
        this.io = io
        console.log('TradeBot initialized...')
    }

    async execute() {
        const delay = time => new Promise(res => setTimeout(() => res(), time));
        while (true) {
            for (let i = 0; i < this.tradebotOptions.tradeCoins.length; i++) {
                try {
                    let currentTradeCoin = this.tradebotOptions.tradeCoins[i]
                    this.tradebotOptions.currentTradeCoin = currentTradeCoin
                    let tradeInfoAnalyzer = new TradeInfoAnalyzer(this.tradebotOptions)
                    await tradeInfoAnalyzer.updateCoinPrices()
                    let tradeInfo = tradeInfoAnalyzer.analyzeFixedMode(
                        this.currentTradeCoin.fixedQuantity,
                        this.currentTradeCoin.plusPointToWin)

                    let date = new Date().toLocaleString()
                    let content =
                        `${date} - ${this.currentTradeCoin.token} - ${this.buyAccount.tradingPlatform.id}: ${this.buyAccount.currentAskPrice.toFixed(8)} - ` +
                        `${this.sellAccount.tradingPlatform.id}: ${this.sellAccount.currentBidPrice.toFixed(8)} - ` +
                        `B-A: ${tradeInfo.deltaBidAsk.toFixed(8)} - ` +
                        `BTC Profit: ${tradeInfo.baseCoinProfit.toFixed(8)} - ` +
                        `Coin Qt.: ${tradeInfo.coinQuantityAtSell}`

                    console.log(content)
                    this.io.emit('price', content)

                    if (this.tradebotOptions.isAutoTrading && tradeInfo.deltaBidAsk >= this.currentTradeCoin.expectedDelta) {
                        console.log('auto trading ...')
                        let trader = new AutoTrader(
                            this.tradebotOptions.inTestMode,
                            this.tradebotOptions.sellAccount,
                            this.tradebotOptions.buyAccount,
                            tradeInfo)

                        await trader.trade()
                    }

                    if (tradeInfo.deltaBidAsk >= this.currentTradeCoin.expectedDelta) {
                        this.sendEmailIfTimePassed(content, content)
                    }

                    this.timeLeftToSendEmail -= 2
                    await delay(1300)
                    this.quitInTestMode()
                } catch (err) {
                    console.log(err)
                    await delay(1300)
                    this.quitInTestMode()
                }
            }
        }
    }

    sendEmailIfTimePassed(subject, content) {
        if (this.timeLeftToSendEmail <= 0) {
            emailHelper.sendEmail(subject, content)
            this.timeLeftToSendEmail = 450
        }
    }

    quitInTestMode() {
        if (this.tradebotOptions.inTestMode) {
            return
        }
    }

    // getters
    get currentTradeCoin() {
        return this.tradebotOptions.currentTradeCoin
    }
    get buyAccount() {
        return this.tradebotOptions.buyAccount
    }
    get sellAccount() {
        return this.tradebotOptions.sellAccount
    }
}