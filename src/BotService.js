import * as dotenv from "dotenv";
import * as config from "config";
import * as ccxt from "ccxt";
import { TradeBotOptions } from "./TradeBotOptions";
import { TradeBot } from "./TradeBot";
import { TradeAccount } from "./TradeAccount";
import { emailHelper } from "./helper/EmailHelper";

export class BotService {
  constructor(io) {
    dotenv.config();
    console.log(`Enironment: ${process.env.NODE_ENV}`);
    this.io = io;
  }

  async runTradeBot() {
    // Initialize the bot options
    var tradeBotOptions = new TradeBotOptions();
    tradeBotOptions.tradeProfiles = config["tradeProfiles"];
    tradeBotOptions.baseCoin = config["baseCoin"];
    tradeBotOptions.isAutoTrading = config["isAutoTrading"];
    tradeBotOptions.inTestMode = config["testMode"];
    tradeBotOptions.autoBalance = config["autoBalance"];
    tradeBotOptions.usingKafka = config["usingKafka"];
    tradeBotOptions.kafkaClient = config["kafkaClient"];

    let tradingPlatforms = config["tradingPlatforms"];
    tradeBotOptions.tradeProfiles.forEach((profile) => {
      if (profile.active) {
        profile.tradeAccounts = [];
        profile.exchanges.forEach((exchange) => {
          profile.tradeAccounts.push(
            new TradeAccount(
              tradingPlatforms.filter((x) => x.name === exchange)[0],
              profile.token,
              profile.baseCoin
            )
          );
        });
      }
    });

    // Initialize the bot
    var tradeBot = new TradeBot(tradeBotOptions, this.io);
    if (config["saveToCosmos"]) await tradeBot.connectDatabase();

    // Run the bot
    tradeBot.execute();
  }
}
