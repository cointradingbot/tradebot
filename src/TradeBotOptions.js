export class TradeBotOptions {
    constructor() {
        this.baseCoinTradingAmount = 0.0
        this.resumeAfterExpectedDelta = 0
        this.expectedDelta = 0.0
        this.emailTo = ''
        this.isAutoTrading = false
        this.mailApiKey = ''
        this.tradeCoins = []
        this.currentTradeCoin = ''
        this.baseCoin = ''
        this.tradeFlow = null
        this.buyAccount = null
        this.sellAccount = null
        this.tradeAccounts = []
        this.tradeMode = null
        this.plusPointToWin = 0.0
        this.inTestMode = true
        this.fixedQuantity = 0.0

        console.log('TradeBotOptions initialzed...')
    }
}