import { AutoTrader } from "./AutoTrader";
import { CosmosClient } from "@azure/cosmos";
import { emailHelper } from "./helper/EmailHelper";
import { KafkaClient } from "./KafkaClient";
import { TradeBotOptions } from "./TradeBotOptions";
import { TradeInfoAnalyzer } from "./TradeInfoAnalyzer";
import { TradingError } from "./errors/TradingError";
import * as config from "config";
import * as dbcontext from "./data/databaseContext";
import chalk from "chalk";

export class TradeBot {
  constructor(tradebotOptions, io) {
    this.tradebotOptions = tradebotOptions;
    this.timeLeftToSendEmail = 0;
    this.io = io;
    this.container = undefined;
    this.createKafkaClient();
    console.log("TradeBot initialized...");
  }

  async execute() {
    let testCount = 1;
    try {
      console.log("starting robot...");
      let previousColor = "green";
      let transNumber = 1;
      const delay = (time) =>
        new Promise((res) => setTimeout(() => res(), time));
      var errorPlatform = undefined;
      let activeProfiles = this.tradebotOptions.tradeProfiles.filter(
        (profile) => profile.active === true
      );

      // await delay(10000)
      // let testAccount = this.tradebotOptions.tradeProfiles[0].tradeAccounts[0]
      // await testAccount.tradingPlatform.createOrder('ONE', 'BNB', 500, 0.0007448, 'buy')
      // let balance = await testAccount.updateBalances()
      // process.exit(1);

      while (true) {
        for (const profile of activeProfiles) {
          try {
            let tradeInfoAnalyzer = new TradeInfoAnalyzer(
              profile,
              this.tradebotOptions.inTestMode
            );
            await tradeInfoAnalyzer.updateCoinPrices();
            let tradeInfo = tradeInfoAnalyzer.analyzeFixedMode(
              profile.fixedQuantity,
              profile.plusPointToWin
            );
            const quantities = [profile.sellAccount.currentBidQty, profile.buyAccount.currentAskQty, profile.fixedQuantity];
            const realTradeQty = Math.min(...quantities);

            const binanceMinQty = 3000

            let date = new Date().toLocaleString();
            let content =
              `${date} - ${profile.token} - ${
              profile.buyAccount.tradingPlatform.name
              }: ${profile.buyAccount.currentAskPrice.toFixed(8)} - ` +
              `${
              profile.sellAccount.tradingPlatform.name
              }: ${profile.sellAccount.currentBidPrice.toFixed(8)} - ` +
              `B-A: ${tradeInfo.deltaBidAsk.toFixed(8)} - ` +
              `${
              profile.sellAccount.baseCoin.token
              } Profit: ${tradeInfo.baseCoinProfit.toFixed(8)} - ` +
              `Qty: ${tradeInfo.coinQuantityAtSell}/${tradeInfo.baseCoinQuantityAtBuy.toFixed(0)}[${realTradeQty}]`;

            let jsonContent = {
              dateTime: date,
              token: profile.token,
              sellAccount: {
                exchange: profile.sellAccount.tradingPlatform.name,
                sellPrice: profile.sellAccount.currentBidPrice.toFixed(8),
                volume: profile.sellAccount.currentBidQty,
              },
              buyAccount: {
                exchange: profile.buyAccount.tradingPlatform.name,
                buyPrice: profile.buyAccount.currentAskPrice.toFixed(8),
                volume: profile.buyAccount.currentAskQty,
              },
              delta: tradeInfo.deltaBidAsk,
              profit: tradeInfo.baseCoinProfit,
              coinQty: tradeInfo.coinQuantityAtSell,
              baseCoinQty: tradeInfo.baseCoinQuantityAtBuy,
              category: "arbitrage",
            };

            if (true
              // tradeInfo.deltaBidAsk >= profile.expectedDelta &&
              // tradeInfo.baseCoinProfit > 0
            ) {
              console.log(chalk.bgGreenBright(chalk.black(content)));


              if (this.tradebotOptions.isAutoTrading && realTradeQty > binanceMinQty) {
                console.log("auto trading ...");
                // Change to real bid / ask
                tradeInfo.coinQuantityAtBuy = realTradeQty
                tradeInfo.coinQuantityAtSell = realTradeQty

                let trader = new AutoTrader(
                  this.tradebotOptions.inTestMode,
                  profile.sellAccount,
                  profile.buyAccount,
                  tradeInfo,
                  transNumber,
                  errorPlatform
                );
                await trader.updateBalances();
                let result = await trader.trade();

                if (result) {
                  transNumber++;
                }
                testCount--;
                this.quitInTestMode(testCount);
              }

              // this.sendEmailIfTimePassed(content, content)
            } else {
              console.log(chalk.bgWhiteBright(chalk.black(content)));
            }
            if (config["saveToCosmos"] && tradeInfo.baseCoinProfit > 0)
              await this.container.items.create(jsonContent);

            this.io.emit("price", content);
            this.io.emit("pricejson", JSON.stringify(jsonContent));

            console.log("");
            // autobalance mode
            // if base coin at buy side is greater than 60%
            // then we should move a bit the opposite side
            // else if (tradeInfo.baseCoinProfit > 0 && this.tradebotOptions.autoBalance) {
            //     console.log(`AutoBalance: ${this.tradebotOptions.autoBalance}`)
            //     console.log(`Entering the auto balance mode ...`)

            //     let trader = new AutoTrader(
            //         this.tradebotOptions.inTestMode,
            //         profile.sellAccount,
            //         profile.buyAccount,
            //         tradeInfo,
            //         'AUTO',
            //         errorPlatform
            //     )
            //     await trader.updateBalances()
            //     await trader.tradeAutoBalance()
            // }

            this.timeLeftToSendEmail -= 2;
            await delay(2000);
          } catch (err) {
            console.log(err);
            if (err instanceof TradingError) {
              errorPlatform = err.errorPlatform;
              // emailHelper.sendEmail('TRADING ERROR', err.message)
              process.exit();
            }
            await delay(1000);
            this.quitInTestMode();
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  sendEmailIfTimePassed(subject, content) {
    if (this.timeLeftToSendEmail <= 0) {
      emailHelper.sendEmail(subject, content);
      this.timeLeftToSendEmail = 450;
    }
  }

  quitInTestMode(testCount) {
    if (this.tradebotOptions.inTestMode && testCount <= 0) {
      process.exit();
    }
  }

  createKafkaClient() {
    // Enabling Kafka client if needed
    if (this.tradebotOptions.usingKafka) {
      console.log("Connecting to Kafka Broker...");
      this.kafkaClient = new KafkaClient(this.tradebotOptions.kafkaClient);
      this.kafkaClient.producer.on("error", (error) => {
        console.log(error);
      });
      this.kafkaClient.producer.on("ready", () => {
        console.log(
          `Connected to Kafka broker ${this.tradebotOptions.kafkaClient}`
        );
        let topic = [
          {
            topic: "matchedtransactions",
            partitions: 1,
            replicationFactor: 1,
            configEntries: [
              {
                name: "compression.type",
                value: "gzip",
              },
            ],
          },
        ];
        this.kafkaClient.client.createTopics(topic, (error, result) => {
          console.log(result);
        });
      });
    }
  }

  async connectDatabase() {
    let cosmosConfig = config["cosmos"];
    const { endpoint, key, databaseId, containerId } = cosmosConfig;
    const client = new CosmosClient({ endpoint, key });
    const database = client.database(databaseId);
    const container = database.container(containerId);
    this.container = container;

    // Make sure Tasks database is already setup. If not, create it.
    await dbcontext.create(client, databaseId, containerId);
  }
}
