import {
    TradeBotOptions
} from './TradeBotOptions'
import {
    TradeInfoAnalyzer
} from './TradeInfoAnalyzer'
import {
    AutoTrader
} from './AutoTrader'
import {
    emailHelper
} from './helper/EmailHelper'
import {
    TradingError
} from './errors/TradingError'
import chalk from 'chalk'

export class TradeBot {
    constructor(tradebotOptions, io) {
        this.tradebotOptions = tradebotOptions
        this.timeLeftToSendEmail = 0
        this.io = io
        console.log('TradeBot initialized...')
    }

    async execute() {
        let previousColor = 'green'
        let transNumber = 1
        const delay = time => new Promise(res => setTimeout(() => res(), time));
        var errorPlatform = undefined
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

                    let jsonContent = {
                        coin: this.currentTradeCoin.token,
                        sellAccount: {
                            platform: this.sellAccount.tradingPlatform.id,
                            sellPrice: this.sellAccount.currentBidPrice.toFixed(8)
                        },
                        buyAccount: {
                            platform: this.buyAccount.tradingPlatform.id,
                            buyPrice: this.buyAccount.currentAskPrice.toFixed(8)
                        },
                        bidask: tradeInfo.deltaBidAsk.toFixed(8),
                        profit: tradeInfo.baseCoinProfit.toFixed(8),
                        coinQty: tradeInfo.coinQuantityAtSell
                    }

                    if (previousColor === 'green') {
                        console.log(chalk.bgWhiteBright(chalk.black(content)))
                        previousColor = 'cyan'
                    } else {
                        console.log(chalk.bgCyanBright(chalk.black(content)))
                        previousColor = 'green'
                    }
                    console.log('')

                    this.io.emit('price', content)
                    this.io.emit('pricejson', JSON.parse(jsonContent))

                    if (tradeInfo.deltaBidAsk >= this.currentTradeCoin.expectedDelta) {
                        if (this.tradebotOptions.isAutoTrading) {
                            console.log('auto trading ...')
                            let trader = new AutoTrader(
                                this.tradebotOptions.inTestMode,
                                this.tradebotOptions.sellAccount,
                                this.tradebotOptions.buyAccount,
                                tradeInfo,
                                transNumber,
                                errorPlatform
                            )
                            await trader.updateBalances()
                            let result = await trader.trade()

                            if (result) {
                                transNumber++
                            }

                            this.quitInTestMode()
                        }

                        this.sendEmailIfTimePassed(content, content)
                    }
                    // autobalance mode
                    // if base coin at buy side is greater than 60% 
                    // then we should move a bit the opposite side
                    else if (tradeInfo.baseCoinProfit > 0 && this.tradebotOptions.autoBalance) {
                        console.log(`Entering the auto balance mode ...`)

                        let trader = new AutoTrader(
                            this.tradebotOptions.inTestMode,
                            this.tradebotOptions.sellAccount,
                            this.tradebotOptions.buyAccount,
                            tradeInfo,
                            'AUTO',
                            errorPlatform
                        )
                        await trader.updateBalances()
                        await trader.tradeAutoBalance()
                    }

                    this.timeLeftToSendEmail -= 2
                    await delay(1000)

                } catch (err) {
                    if (err instanceof TradingError) {
                        errorPlatform = err.errorPlatform
                        emailHelper.sendEmail('TRADING ERROR', err.message)
                        process.exit()
                    }
                    console.log(err)
                    await delay(1000)
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
            process.exit()
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