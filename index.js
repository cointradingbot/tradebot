import * as ccxt from 'ccxt'
import { TradeBotOptions } from './TradeBotOptions'
import { TradeBot } from './TradeBot'
import { TradeAccount } from './TradeAccount';
import { supportedTradingPlatforms } from './supportedTradingPlatforms'

// Initialize the bot options
var tradeBotOptions = new TradeBotOptions()
tradeBotOptions.coin = 'ADA'
supportedTradingPlatforms.forEach((tradingPlatform) => {
    console.log(`Adding Trading Platform ${tradingPlatform.name}`)
    tradeBotOptions.tradeAccounts.push(new TradeAccount(tradingPlatform, tradeBotOptions.coin))
})

// Initialize the bot
var tradeBot = new TradeBot(tradeBotOptions)

// Run the bot
tradeBot.execute()