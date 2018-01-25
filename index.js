import * as dotenv from 'dotenv'
import * as config from 'config'
import * as ccxt from 'ccxt'
import { TradeBotOptions } from './TradeBotOptions'
import { TradeBot } from './TradeBot'
import { TradeAccount } from './TradeAccount';
import { supportedTradingPlatforms } from './supportedTradingPlatforms'

// Initialize the ENV
dotenv.config()
console.log(process.env.NODE_ENV)

// Initialize the bot options
var tradeBotOptions = new TradeBotOptions()
tradeBotOptions.coin = config['Coin']
tradeBotOptions.expectedDelta = config['ExpectedDelta']
tradeBotOptions.fixedQuantity = config['FixedQuantity']

supportedTradingPlatforms.forEach((tradingPlatform) => {
    console.log(`Adding Trading Platform ${tradingPlatform.name}`)
    tradeBotOptions.tradeAccounts.push(new TradeAccount(tradingPlatform, tradeBotOptions.coin))
})

// Initialize the bot
var tradeBot = new TradeBot(tradeBotOptions)

// Run the bot
tradeBot.execute()