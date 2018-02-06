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

        // AutoBalance Mode
        // Sometime, when delta meets the expected number, but we don't have enough 
        // bitcoin to buy. It's time to move BTC back to the other side
        // so that we can do the trading.
        this.autoBalance = false

        console.log('TradeBotOptions initialzed...')
    }
}