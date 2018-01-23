export class TradeBot {
    constructor() {
        this.buyAccount = null
        this.sellAccount = null
        this.isAutoTrading = false
        this.testMode = true
    }

    async execute() {
        const delay = time => new Promise(res => setTimeout(() => res(), time));
        while (true) {
            console.log("Hello, I'm tradebot :)")
            await delay(1000)
        }
    }
}