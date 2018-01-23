import { TradeBotOptions } from './TradeBotOptions'
import { TradeBot } from './TradeBot'

// Initialize the bot options
var tradeBotOptions = new TradeBotOptions()

// Initialize the bot
var tradeBot = new TradeBot(tradeBotOptions)

// Run the bot
tradeBot.execute()