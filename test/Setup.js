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

class BotTest {
    constructor() {
        dotenv.config()
        console.log(`Enironment: ${process.env.NODE_ENV}`)
    }

    buildTradeBot() {
        // Initialize the bot options
        var tradeBotOptions = new TradeBotOptions()
        tradeBotOptions.tradeCoins = config['tradeCoins']
        tradeBotOptions.baseCoin = config['baseCoin']
        tradeBotOptions.isAutoTrading = config['isAutoTrading']
        tradeBotOptions.inTestMode = config['testMode']
        tradeBotOptions.autoBalance = config['autoBalance']

        var tradingPlatforms = config['tradingPlatforms']

        tradingPlatforms.forEach((tradingPlatform) => {
            console.log(`Adding ${tradingPlatform.name}`)
            tradeBotOptions.tradeAccounts.push(new TradeAccount(
                tradingPlatform,
                'ADA',
                tradeBotOptions.baseCoin))
        })

        // Initialize the bot
        var tradeBot = new TradeBot(tradeBotOptions, undefined)

        return tradeBot
    }
}

export const tradeBot = new BotTest().buildTradeBot()