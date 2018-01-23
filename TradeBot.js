import { TradeBotOptions } from './TradeBotOptions'
import { TradeInfoAnalyzer } from './TradeInfoAnalyzer'

export class TradeBot {
    constructor(tradebotOptions) {
        this.buyAccount = null
        this.sellAccount = null
        this.isAutoTrading = false
        this.testMode = true
        this.tradebotOptions = tradebotOptions

        console.log('TradeBot initialized...')
    }

    async execute() {
        const delay = time => new Promise(res => setTimeout(() => res(), time));
        while (true) {
            var tradeInfoAnalyzer = new TradeInfoAnalyzer()
            tradeInfoAnalyzer.updateCoinPrices()
            if (!await tradeInfoAnalyzer.updateBalances()){
                await delay(1300)
                continue
            }

            let date = new Date().toLocaleString()
            let content = `${date} ${Coin} - ${this.buyAccount}: ${this.buyAccount.tradeCoin.coinPrice.askPrice} * 
                ${this.SellAccount.GetType().Name}: ${this.SellAccount.TradeCoin.CoinPrice.BidPrice} *
                B-A: ${this.tradeInfo.deltaBidAsk} *
                BTC Profit: ${Math.Round(tradeInfo.BitcoinProfit, 6)} *
                Coin Qt.: ${Math.Round(tradeInfo.CoinQuantityAtSell)} *
                BTC Qt.: ${Math.Round(tradeInfo.BitcoinQuantityAtBuy, 4)}`

            console.log(content)

            console.log("hehehe")

            await delay(1300)
        }
    }
}