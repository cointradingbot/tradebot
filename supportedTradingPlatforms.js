import * as ccxt from 'ccxt'

const supportedTradingPlatforms = {
    'bittrex': ccxt.bittrex,
    'binance': ccxt.binance,
    'gateio': ccxt.gateio,
    'hitbtc': ccxt.hitbtc2,
    'coinexchange': ccxt.coinexchange,
    'kucoin': ccxt.kucoin,
    'kraken': ccxt.kraken,
    'bitfinex': ccxt.bitfinex2,
    'bitstamp': ccxt.bitstamp1,
    'bitmex': ccxt.bitmex,
    'cryptopia': ccxt.cryptopia,
    'liqui': ccxt.liqui,
    'gatecoin': ccxt.gatecoin,
    'okex': ccxt.okex,
    'huobi': ccxt.huobi
}

export { supportedTradingPlatforms }