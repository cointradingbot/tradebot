import { emailHelper } from "./helper/EmailHelper";
import { TradingError } from "./errors/TradingError";
import { TradingPlatform } from "./TradingPlatform";

export class TradeAccount {
  constructor(tradingPlatform, coin, baseCoin) {
    this.currentAskPrice = 0.0;
    this.currentBidPrice = 0.0;
    this.currentBidQty = 0.0;
    this.currentAskQty = 0.0;
    this.baseCoin = new Coin(baseCoin);
    this.currentTradeCoin = new Coin(coin);
    this.tradingFee = tradingPlatform.tradingFee;
    this.tradingPlatform = new TradingPlatform(
      tradingPlatform.name,
      tradingPlatform.api_key,
      tradingPlatform.api_secret,
      tradingPlatform.public_key,
      tradingPlatform.private_key,
      tradingPlatform.password
    );

    console.log(`Create account of ${tradingPlatform.name}`);
  }

  updateCurrentTradeCoin(coin) {
    this.currentTradeCoin = new Coin(coin);
  }

  async updatePrices() {
    let result = undefined;
    switch (this.tradingPlatform.name) {
      case 'justswap':
        result = await this.tradingPlatform.fetchTicker(
          this.currentTradeCoin.token,
          this.baseCoin.token
        );
        const TRXPrice = Number(result.data['0_TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'].price);
        const JSTPrice = Number(result.data['0_TCFLL5dx5ZJdKnWuesXxi1VPwjLVmWZZy9'].price);
        const JSTPriceinUSDT = JSTPrice / TRXPrice;
        this.currentAskPrice = Number(JSTPriceinUSDT);
        this.currentAskQty = Number(result.data.quote_volume);
        this.currentBidPrice = Number(JSTPriceinUSDT);
        this.currentBidQty = Number(result.data.quote_volume);

        break;
      case 'binancedex':
        result = await this.tradingPlatform.fetchTicker(
          this.currentTradeCoin.token,
          this.baseCoin.token
        );
        this.currentAskPrice = result.ask;
        this.currentAskQty = result.askVolume;
        this.currentBidPrice = result.bid;
        this.currentBidQty = result.bidVolume;
        break;
      default:
        result = await this.tradingPlatform.fetchOrderBook(
          this.currentTradeCoin.token,
          this.baseCoin.token
        );

        this.currentAskPrice = Number(result.asks[0][0]);
        this.currentAskQty = Number(result.asks[0][1]);
        this.currentBidPrice = Number(result.bids[0][0]);
        this.currentBidQty = Number(result.bids[0][1]);

        break;
    }
  }

  async updateBalances() {
    let balance = await this.tradingPlatform.fetchBalance(
      this.currentTradeCoin.token,
      this.baseCoin.token
    );
    this.baseCoin.balance = balance.basedToken ?? { free: 0, total: 0, used: 0 };
    this.currentTradeCoin.balance = balance.token ?? { free: 0, total: 0, used: 0 };
    console.log(
      `Balance status of ${this.tradingPlatform.name}: ${this.baseCoin.token}: ${this.baseCoin.balance.free}, ${this.currentTradeCoin.token}: ${this.currentTradeCoin.balance.free}`
    );
  }

  async buy(coinQuantityAtBuy, buyPrice, transNumber) {
    try {
      await this.tradingPlatform.createOrder(
        this.currentTradeCoin.token,
        this.baseCoin.token,
        coinQuantityAtBuy,
        buyPrice,
        "buy"
      );
      let content = `${
        this.tradingPlatform.name
        }: Buy ordered ${coinQuantityAtBuy} ${
        this.currentTradeCoin.token
        }, price: ${buyPrice.toFixed(8)}`;
      if (transNumber !== null) {
        content = `${transNumber} - ${content}`;
      }
      emailHelper.sendEmail(content, content);
    } catch (err) {
      throw new TradingError(
        `${this.tradingPlatform.name} BUY ERROR: ${err.message}`,
        this.tradingPlatform.name
      );
    }
  }

  async sell(coinQuantityAtSell, sellPrice, transNumber) {
    try {
      let result = await this.tradingPlatform.createOrder(
        this.currentTradeCoin.token,
        this.baseCoin.token,
        coinQuantityAtSell,
        sellPrice,
        "sell"
      );
      let content = `${
        this.tradingPlatform.name
        }: Sell ordered ${coinQuantityAtSell} ${
        this.currentTradeCoin.token
        }, price: ${sellPrice.toFixed(8)}`;
      if (transNumber !== null) {
        content = `${transNumber} - ${content}`;
      }
      emailHelper.sendEmail(content, content);
    } catch (err) {
      throw new TradingError(
        `${this.tradingPlatform.name} SELL ERROR: ${err.message}`,
        this.tradingPlatform.name
      );
    }
  }

  async isOrderMatched() { }
}

class Coin {
  constructor(token) {
    this.token = token;
    this.balance = 0.0;
    this.transferFee = 0.0;
  }
}
