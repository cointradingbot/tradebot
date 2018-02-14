import {
    AutoTrader
} from '../src/AutoTrader'
import {
    TradeBotOptions
} from '../src/TradeBotOptions'
import {
    TradeInfo
} from '../src/TradeInfo'
import {
    TradeAccount
} from '../src/TradeAccount'
import * as ccxt from 'ccxt'

var buyAccount = new TradeAccount(ccxt.bittrex, 'XLM', 'BTC')
var sellAccount = new TradeAccount(ccxt.binance, 'XLM', 'BTC')

var tradeInfo = new TradeInfo()
tradeInfo.baseCoinProfit = 0
tradeInfo.baseCoinQuantityAtBuy = 0.0215
tradeInfo.baseCoinQuantityAtSell = 0.021978
tradeInfo.buyPrice = 0.00004300
tradeInfo.coinProfit = 5
tradeInfo.coinQuantityAtBuy = 500 // ok
tradeInfo.coinQuantityAtSell = 500 // ok
tradeInfo.deltaBidAsk = 100
tradeInfo.deltaBidBid = 100
tradeInfo.message = undefined
tradeInfo.sellPrice = 0.00004400
tradeInfo.tradable = true


var autoTrader = new AutoTrader(true, sellAccount, buyAccount, tradeInfo, 0, undefined)

test('negative profit should be not tradable', async () => {
    expect(await autoTrader.tradable()).toBe(false)
})

test('not enough trade coin balance should be not tradable', async () => {
    expect(await autoTrader.tradable()).toBe(false)
})

test('not enough base coin balance should be not tradable', async () => {
    expect(await autoTrader.tradable()).toBe(false)
})

test('exception at a platform should be captured for next time of trading', () => {

})