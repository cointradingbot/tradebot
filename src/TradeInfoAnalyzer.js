import 'babel-polyfill'
import * as ccxt from 'ccxt'
import { bittrex } from 'ccxt';
import _ from 'lodash'
import { TradeBotOptions } from './TradeBotOptions'
import { TradeInfo } from './TradeInfo'

export class TradeInfoAnalyzer {
    constructor(tradeProfile) {
        this.tradeProfile = tradeProfile
        this.tradeProfile.tradeAccounts.forEach(tradeAccount => {
            tradeAccount.updateCurrentTradeCoin(this.tradeProfile.token)
        })
    }

    async updateCoinPrices() {
        for (const tradeAccount of this.tradeProfile.tradeAccounts) {
            await tradeAccount.updatePrices();
        }

        this.analyzeFlow()
    }

    analyzeFlow() {
        var accHasMaxBidPrice = _.last(_.sortBy(this.tradeAccounts, ['currentBidPrice']))
        var accHasMinAskPrice = _.first(_.sortBy(this.tradeAccounts, ['currentAskPrice']))

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

        let bitcoinQuantityAtSell = sellPrice * coinQtyAtSell * (1 - this.sellAccount.tradingFee / 100)
        let bitcoinQuantityAtBuy = buyPrice * coinQtyAtBuy * (1 + this.buyAccount.tradingFee / 100)

        let profit = bitcoinQuantityAtSell - bitcoinQuantityAtBuy

        var tradeInfo = new TradeInfo()
        tradeInfo.deltaBidAsk = deltaBidAsk
        tradeInfo.deltaBidBid = deltaBidBid
        tradeInfo.baseCoinQuantityAtSell = bitcoinQuantityAtSell
        tradeInfo.coinQuantityAtSell = coinQtyAtSell
        tradeInfo.baseCoinQuantityAtBuy = bitcoinQuantityAtBuy
        tradeInfo.coinQuantityAtBuy = coinQtyAtBuy
        tradeInfo.coinProfit = 0
        tradeInfo.baseCoinProfit = bitcoinQuantityAtSell - bitcoinQuantityAtBuy
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