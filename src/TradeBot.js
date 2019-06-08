import {
    TradeBotOptions
} from './TradeBotOptions'
import {
    TradeInfoAnalyzer
} from './TradeInfoAnalyzer'
import {
    AutoTrader
} from './AutoTrader'
import {
    emailHelper
} from './helper/EmailHelper'
import {
    TradingError
} from './errors/TradingError'
import chalk from 'chalk'
import {
    KafkaClient
} from './KafkaClient'

export class TradeBot {
    constructor(tradebotOptions, io) {
        this.tradebotOptions = tradebotOptions
        this.timeLeftToSendEmail = 0
        this.io = io
        this.createKafkaClient();
        console.log('TradeBot initialized...')
    }

    async execute() {
        let testCount = 1
        try {
            console.log('starting robot...')
            let previousColor = 'green'
            let transNumber = 1
            const delay = time => new Promise(res => setTimeout(() => res(), time));
            var errorPlatform = undefined
            let activeProfiles = this.tradebotOptions.tradeProfiles.filter(profile => profile.active === true)

            // await delay(10000)
            // let testAccount = this.tradebotOptions.tradeProfiles[0].tradeAccounts[0]
            // await testAccount.tradingPlatform.createOrder('ONE', 'BNB', 500, 0.0007448, 'buy')
            // let balance = await testAccount.updateBalances()
            // process.exit(1);

            while (true) {
                for (const profile of activeProfiles) {
                    try {
                        let tradeInfoAnalyzer = new TradeInfoAnalyzer(profile, this.tradebotOptions.inTestMode)
                        await tradeInfoAnalyzer.updateCoinPrices()
                        let tradeInfo = tradeInfoAnalyzer.analyzeFixedMode(
                            profile.fixedQuantity,
                            profile.plusPointToWin)

                        let date = new Date().toLocaleString()
                        let content =
                            `${date} - ${profile.token} - ${profile.buyAccount.tradingPlatform.name}: ${profile.buyAccount.currentAskPrice.toFixed(8)} - ` +
                            `${profile.sellAccount.tradingPlatform.name}: ${profile.sellAccount.currentBidPrice.toFixed(8)} - ` +
                            `B-A: ${tradeInfo.deltaBidAsk.toFixed(8)} - ` +
                            `BTC Profit: ${tradeInfo.baseCoinProfit.toFixed(8)} - ` +
                            `Coin Qt.: ${tradeInfo.coinQuantityAtSell}`

                        let jsonContent = {
                            dateTime: date,
                            token: profile.token,
                            sellAccount: {
                                exchange: profile.sellAccount.tradingPlatform.name,
                                sellPrice: profile.sellAccount.currentBidPrice.toFixed(8),
                                volume: profile.sellAccount.currentBidQty
                            },
                            buyAccount: {
                                exchange: profile.buyAccount.tradingPlatform.name,
                                buyPrice: profile.buyAccount.currentAskPrice.toFixed(8),
                                volume: profile.buyAccount.currentAskQty
                            },
                            delta: tradeInfo.deltaBidAsk.toFixed(8),
                            profit: tradeInfo.baseCoinProfit.toFixed(8),
                            coinQty: tradeInfo.coinQuantityAtSell
                        }

                        // if (previousColor === 'green') {
                        //     console.log(chalk.bgWhiteBright(chalk.black(content)))
                        //     previousColor = 'cyan'
                        // } else {
                        //     console.log(chalk.bgCyanBright(chalk.black(content)))
                        //     previousColor = 'green'
                        // }
                        // console.log('')

                        this.io.emit('price', content)
                        this.io.emit('pricejson', JSON.stringify(jsonContent))

                        if (tradeInfo.deltaBidAsk >= profile.expectedDelta) {
                            console.log(chalk.bgGreenBright(chalk.black(content)))
                            // this.kafkaClient.producer.send([{
                            //     topic: 'matchedtransactions',
                            //     messages: JSON.stringify(jsonContent),
                            //     partition: 0
                            // }], (error, data) => {
                            //     console.log(data);
                            // })
                            if (this.tradebotOptions.isAutoTrading) {
                                console.log('auto trading ...')
                                let trader = new AutoTrader(
                                    this.tradebotOptions.inTestMode,
                                    profile.sellAccount,
                                    profile.buyAccount,
                                    tradeInfo,
                                    transNumber,
                                    errorPlatform
                                )
                                await trader.updateBalances()
                                let result = await trader.trade()

                                if (result) {
                                    transNumber++
                                }
                                testCount--;
                                this.quitInTestMode(testCount)
                            }

                            // this.sendEmailIfTimePassed(content, content)
                        } else {
                            console.log(chalk.bgWhiteBright(chalk.black(content)))
                        }
                        console.log('')
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

                        this.timeLeftToSendEmail -= 2
                        await delay(1000)

                    } catch (err) {
                        if (err instanceof TradingError) {
                            errorPlatform = err.errorPlatform
                            // emailHelper.sendEmail('TRADING ERROR', err.message)
                            process.exit()
                        }
                        console.log(err)
                        await delay(1000)
                        this.quitInTestMode()
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    sendEmailIfTimePassed(subject, content) {
        if (this.timeLeftToSendEmail <= 0) {
            emailHelper.sendEmail(subject, content)
            this.timeLeftToSendEmail = 450
        }
    }

    quitInTestMode(testCount) {
        if (this.tradebotOptions.inTestMode && testCount <= 0) {
            process.exit()
        }
    }

    createKafkaClient() {
        // Enabling Kafka client if needed
        if (this.tradebotOptions.usingKafka) {
            console.log("Connecting to Kafka Broker...")
            this.kafkaClient = new KafkaClient(this.tradebotOptions.kafkaClient)
            this.kafkaClient.producer.on('error', (error) => {
                console.log(error);
            })
            this.kafkaClient.producer.on('ready', () => {
                console.log(`Connected to Kafka broker ${this.tradebotOptions.kafkaClient}`)
                let topic = [{
                    topic: 'matchedtransactions',
                    partitions: 1,
                    replicationFactor: 1,
                    configEntries: [{
                        name: 'compression.type',
                        value: 'gzip'
                    }]
                }];
                this.kafkaClient.client.createTopics(topic, (error, result) => {
                    console.log(result);
                })
            })
        }
    }
}