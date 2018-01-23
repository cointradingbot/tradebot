import { TradeBotOptions } from './TradeBotOptions'
import * as ccxt from 'ccxt'
import { bittrex } from 'ccxt';
import _ from 'lodash'

export class TradeInfoAnalyzer {
    constructor(tradebotOptions) {
        this.tradebotOptions = tradebotOptions
    }

    get tradeAccounts() {
        return this.tradebotOptions.tradeAccounts
    }

    async updateCoinPrices() {
        console.log('Updating coin prices...')

        for (let i = 0; i < this.tradeAccounts.length; i++) {
            await this.tradeAccounts[i].updatePrices()
            console.log('updating prices...')
        }

        console.log('analyze flow...')
        this.analyzeFlow()
    }

    analyzeFlow() {
        let accHasMaxBidPrice = _.first(_.sortBy(this.tradeAccounts, ['currentBidPrice']))
        console.log(accHasMaxBidPrice.currentBidPrice)
    }

    async updateBalances() {
        console.log('Update balances')
    }
}