import { TradeBotOptions } from './TradeBotOptions'
import { TradeInfo } from './TradeInfo'
import * as ccxt from 'ccxt'
import { bittrex } from 'ccxt';
import _ from 'lodash'

export class TradeInfoAnalyzer {
    constructor(tradebotOptions) {
        this.tradebotOptions = tradebotOptions
    }



    async updateCoinPrices() {

        for (let i = 0; i < this.tradeAccounts.length; i++) {
            await this.tradeAccounts[i].updatePrices()
        }

        this.analyzeFlow()
    }

    analyzeFlow() {
        var accHasMaxBidPrice = _.last(_.sortBy(this.tradeAccounts, ['currentBidPrice']))
        var accHasMinAskPrice = _.first(_.sortBy(this.tradeAccounts, ['currentAskPrice']))

        if (accHasMaxBidPrice !== accHasMinAskPrice) {
            this.tradebotOptions.sellAccount = accHasMaxBidPrice
            this.tradebotOptions.buyAccount = accHasMinAskPrice
        }
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
        tradeInfo.BitcoinQuantityAtSell = bitcoinQuantityAtSell
        tradeInfo.coinQuantityAtSell = coinQtyAtSell
        tradeInfo.bitcoinQuantityAtBuy = bitcoinQuantityAtBuy
        tradeInfo.coinQuantityAtBuy = coinQtyAtBuy
        tradeInfo.coinProfit = 0
        tradeInfo.bitcoinProfit = bitcoinQuantityAtSell - bitcoinQuantityAtBuy
        tradeInfo.sellAccount = sellPrice
        tradeInfo.buyPrice = buyPrice

        return tradeInfo;
    }

    async updateBalances() {
        console.log('Update balances')
    }

    // Getters
    get tradeAccounts() {
        return this.tradebotOptions.tradeAccounts
    }

    get sellAccount() {
        return this.tradebotOptions.sellAccount
    }

    get buyAccount() {
        return this.tradebotOptions.buyAccount
    }
}