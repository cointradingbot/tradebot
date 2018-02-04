export class TradeBotOptions {
    constructor() {
        this.baseCoinTradingAmount = 0.0
        this.resumeAfterExpectedDelta = 0
        this.emailTo = ''
        this.isAutoTrading = false
        this.mailApiKey = ''
        this.tradeCoins = []
        this.currentTradeCoin = null
        this.baseCoin = ''
        this.tradeFlow = null
        this.buyAccount = null
        this.sellAccount = null
        this.tradeAccounts = []
        this.tradeMode = null
        this.inTestMode = true

        console.log('TradeBotOptions initialzed...')
    }
}