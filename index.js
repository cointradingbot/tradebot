import * as dotenv from 'dotenv'
dotenv.config()
console.log(`Enironment: ${process.env.NODE_ENV}`)

import * as config from 'config'
import * as ccxt from 'ccxt'
import { TradeBotOptions } from './TradeBotOptions'
import { TradeBot } from './TradeBot'
import { TradeAccount } from './TradeAccount';

// Initialize the bot options
var tradeBotOptions = new TradeBotOptions()
tradeBotOptions.coin = config['Coin']
tradeBotOptions.expectedDelta = config['ExpectedDelta']
tradeBotOptions.fixedQuantity = config['FixedQuantity']
tradeBotOptions.isAutoTrading = config['IsAutoTrading']
tradeBotOptions.inTestMode = config['TestMode']
tradeBotOptions.expectedDelta = config['ExpectedDelta']


var tradingPlatforms = config['TradingPlatforms']

tradingPlatforms.forEach((tradingPlatform) => {
    console.log(`Adding ${tradingPlatform.Name}`)
    tradeBotOptions.tradeAccounts.push(new TradeAccount(tradingPlatform, tradeBotOptions.coin))
})

// Initialize the bot
var tradeBot = new TradeBot(tradeBotOptions)

// Run the bot
tradeBot.execute()