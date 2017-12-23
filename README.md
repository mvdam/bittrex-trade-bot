# bittrex-trade-bot


### Run the bot:
`API_KEY=<your-bittrex-api-key> API_SECRET=<your-bittrex-api-secret> npm start`

### How it works
1. Fetches all BTC-* markets from [Bittrex API](https://bittrex.com/api/v1.1/public/getmarketsummaries)
2. Fetches price history for every market using the [Bittrex API](https://bittrex.com/api/v1.1/public/getmarkethistory?market=BTC-ETH)
3. Calculates historical moving average of the last 15<sup>1</sup> `BUY` orders
4. Continuously (every 10 seconds<sup>1</sup>) updates the moving average based on current `ASK` price
5. Executes `BUY` order<sup>2</sup> when the actual price drops below the moving average with 1.5%<sup>1</sup>
6. Executes `SELL` order<sup>2</sup> when the actual price raises above 1.5%<sup>1</sup> of the original buying price `-OR-` executes `SELL` order when price keeps dropping and the loss in BTC is 0.0001<sup>1</sup> as a `STOP LOSS`
7. Current state of open orders is saved in a HTML file in the `public` dir.

> <sup>1</sup> Configurable

> <sup>2</sup> Not yet implemented

### Current results
This version of the software has an average profit margin of `+1.2%`. We want to increase this in the near future to around `+5%`.

### Todo
- [x] Add Bittrex transaction fees to the profit calculation
- [x] Use RxJS
- [ ] Make frontend pretty
- [ ] Extend the `moving average` with [multiple algorithms](https://github.com/oransel/node-talib) to increase profit
- [ ] Support for multiple markets (i.e. ETH-*)

### References
- [Bittrex API documentation](https://bittrex.com/home/api)
- [YouTube: Building cryptocurrency trading bots](https://www.youtube.com/playlist?list=PL2U3qLYtsXsT5QuFQUtxbfj62K3AiLOse)