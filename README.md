# bittrex-trade-bot

### Run the bot:
`API_KEY=<your-api-key> API_SECRET=<your-api-secret> npm start`

### How it works
* Fetches all BTC markets and price history of last ???hour??? from [Bittrex](https://bittrex.com/api/v1.1/public/getmarketsummaries)
* Fetches price history of the BTC markets from [Bittrex](https://bittrex.com/api/v1.1/public/getmarkethistory?market=BTC-DOGE)
* Calculates Moving Average of selected markets
* ...

### Future work
* Add fees to diff calculations
* Make frontend application and connect to websocket to get latest trades
* Register trade history to validate the algorithm
* Implement multiple algorithms see https://github.com/oransel/node-talib
* Use TypeScript
* ...
