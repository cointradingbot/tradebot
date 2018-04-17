# arbitrage tradebot

## Clone the code

```
$ git clone https://github.com/cointradingbot/tradebot.git && cd tradebot
```

## Configure email, coin, delta, plus point to win
- Configure email so that it will send notifications everytime the tradebot sends trading commands. To configure the email, go to ```config/production.json``` and change the value of the email section:

**apiKey**: apiKey of Sendgrid
**emailTo**: email you want to send notifications to
**toName**: the email name
**emailFrom**: the email from
**fromName**: from Name

- Configure the coin, change the value of the tradecoins section:

**token**: token value, eg. XVG, ADA, XLM, ...
**fixQuantity**: the quantity which the bot will trade every time
**plusPointToWin**: sometimes the market will fluctuate very much, we're not sure the tradebot's trading commands will be matched, so it's will be safe for us to plus some +/- points (shatoshi) to inrease the chance of matches.
**expectedDelta**: when the gap between the exchanges meet the expected delta, the tradebot will send the trading commands (include plusPointToWin). The tradebot will also make sure that the trading must generate the profit, otherwise it will not execute.

## Run with Docker

After we configure the email and token, we can build the bot using Docker

```bash
$ docker build -t tradebot .
$ docker run -d --name bot tradebot
```

## Notes

To prepare for the tradebot you make sure you will have alt-coin & bitcoin to trade. Each trading will have a pair: sell alt-coin at an exchange and buy alt-coin (using bitcoin) at the other exchange. If you want to enable auto balance mode, you must have enough alt-coin & bitcoin at both exchanges.
