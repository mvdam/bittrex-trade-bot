# bittrex-trade-bot

### Run the bot:
`API_KEY=<your-api-key> API_SECRET=<your-api-secret> npm start`

### How it works
* Fetches top 50 of [CoinMarketCap](https://coinmarketcap.com/api/)
* Grabs markets that changed between `+2%` and `+10%` in the last 24h
* Saves prices history of selected markets
* Calculates Moving Average of selected markets
* ...