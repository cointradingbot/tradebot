import * as dotenv from 'dotenv'
import * as config from 'config'
import * as ccxt from 'ccxt'
import {
    TradeBotOptions
} from './TradeBotOptions'
import {
    TradeBot
} from './TradeBot'
import {
    TradeAccount
} from './TradeAccount'
import {
    emailHelper
} from './helper/EmailHelper'

export class BotService {
    constructor(io) {
        dotenv.config()
        console.log(`Enironment: ${process.env.NODE_ENV}`)
        this.io = io
    }

    runTradeBot() {
        // Initialize the bot options
        var tradeBotOptions = new TradeBotOptions()
        tradeBotOptions.tradeCoin = config['TradeCoin']
        tradeBotOptions.baseCoin = config['TradeCoin']
        tradeBotOptions.expectedDelta = config['ExpectedDelta']
        tradeBotOptions.fixedQuantity = config['FixedQuantity']
        tradeBotOptions.isAutoTrading = config['IsAutoTrading']
        tradeBotOptions.inTestMode = config['TestMode']
        tradeBotOptions.expectedDelta = config['ExpectedDelta']

        var tradingPlatforms = config['TradingPlatforms']

        tradingPlatforms.forEach((tradingPlatform) => {
            console.log(`Adding ${tradingPlatform.Name}`)
            tradeBotOptions.tradeAccounts.push(new TradeAccount(
                tradingPlatform,
                tradeBotOptions.tradeCoin,
                tradeBotOptions.baseCoin))
        })

        // Initialize the bot
        var tradeBot = new TradeBot(tradeBotOptions, this.io)

        // Run the bot
        tradeBot.execute()
    }
}