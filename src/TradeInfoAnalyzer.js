import '@babel/polyfill'
import * as ccxt from 'ccxt'
import {
    bittrex
} from 'ccxt';
import _ from 'lodash'
import {
    TradeBotOptions
} from './TradeBotOptions'
import {
    TradeInfo
} from './TradeInfo'

export class TradeInfoAnalyzer {
    constructor(tradeProfile, testMode) {
        this.tradeProfile = tradeProfile
        this.tradeProfile.tradeAccounts.forEach(tradeAccount => {
            tradeAccount.updateCurrentTradeCoin(this.tradeProfile.token)
        }),
        this.testMode = testMode
    }

    async updateCoinPrices() {
        for (const tradeAccount of this.tradeProfile.tradeAccounts) {
            await tradeAccount.updatePrices();
        }

        this.analyzeFlow()
    }

    analyzeFlow() {
        // var accHasMaxBidPrice = _.last(_.sortBy(this.tradeAccounts, ['currentBidPrice']))
        // var accHasMinAskPrice = _.first(_.sortBy(this.tradeAccounts, ['currentAskPrice']))
        let accHasMaxBidPrice = this.tradeAccounts.reduce((prev, current) => {
            return (prev.currentBidPrice > current.currentBidPrice) ? prev : current
        })
        let accHasMinAskPrice = this.tradeAccounts
            .filter(item => item.tradingPlatform.name !== accHasMaxBidPrice.tradingPlatform.name)
            .reduce((prev, current) => {
                return (prev.currentAskPrice < current.currentAskPrice) ? prev : current
            })

        this.tradeProfile.sellAccount = accHasMaxBidPrice
        this.tradeProfile.buyAccount = accHasMinAskPrice

    }

    analyzeFixedMode(quantity, plusPointToWin) {
        let deltaBidAsk = this.sellAccount.currentBidPrice - this.buyAccount.currentAskPrice
        let deltaBidBid = this.sellAccount.currentBidPrice - this.buyAccount.currentBidPrice

        let coinQtyAtBuy = quantity
        let coinQtyAtSell = quantity

        let sellPrice = this.sellAccount.currentBidPrice - plusPointToWin
        let buyPrice = this.buyAccount.currentAskPrice + plusPointToWin

        if (this.testMode) {
            sellPrice += 0.00009000
            buyPrice -= 0.00009000
        }

        let basecoinQuantityAtSell = sellPrice * coinQtyAtSell * (1 - this.sellAccount.tradingFee / 100)
        let basecoinQuantityAtBuy = buyPrice * coinQtyAtBuy * (1 + this.buyAccount.tradingFee / 100)

        let profit = basecoinQuantityAtSell - basecoinQuantityAtBuy

        var tradeInfo = new TradeInfo()
        tradeInfo.deltaBidAsk = deltaBidAsk
        tradeInfo.deltaBidBid = deltaBidBid
        tradeInfo.baseCoinQuantityAtSell = basecoinQuantityAtSell
        tradeInfo.coinQuantityAtSell = coinQtyAtSell
        tradeInfo.baseCoinQuantityAtBuy = basecoinQuantityAtBuy
        tradeInfo.coinQuantityAtBuy = coinQtyAtBuy
        tradeInfo.coinProfit = 0
        tradeInfo.baseCoinProfit = basecoinQuantityAtSell - basecoinQuantityAtBuy
        tradeInfo.sellPrice = sellPrice
        tradeInfo.buyPrice = buyPrice

        return tradeInfo;
    }

    // Getters
    get tradeAccounts() {
        return this.tradeProfile.tradeAccounts
    }

    get sellAccount() {
        return this.tradeProfile.sellAccount
    }

    get buyAccount() {
        return this.tradeProfile.buyAccount
    }
}