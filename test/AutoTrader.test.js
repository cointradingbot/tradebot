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

var buyAccount = new TradeAccount()
var sellAccount = new TradeAccount()

var tradeInfo = new TradeInfo()
tradeInfo.baseCoinProfit = 0
tradeInfo.baseCoinQuantityAtBuy = 0.5
tradeInfo.baseCoinQuantityAtSell = 0.5
tradeInfo.buyPrice = 0.00004300
tradeInfo.coinProfit = 5
tradeInfo.coinQuantityAtBuy = 500 // ok
tradeInfo.coinQuantityAtSell = 500 // ok
tradeInfo.deltaBidAsk = 100
tradeInfo.deltaBidBid = 100
tradeInfo.message = undefined
tradeInfo.sellPrice = 0.00004300
tradeInfo.tradable = true


var autoTrader = new AutoTrader(true, sellAccount, buyAccount, tradeInfo, 0, undefined)

test('negative profit should be not tradable', () => {
    expect(autoTrader.tradable()).toBe(false)
})