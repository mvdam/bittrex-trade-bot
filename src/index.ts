// functions
import { tradeBot } from './trader/tradeBot'
import { fetchBittrexObservable } from './rest/bittrex/markets'

// strategies
import { movingAverageStrategy } from './strategies/movingAverage'
import { stopLossStrategy } from './strategies/stopLoss'

// constants
import { API_KEY, API_SECRET } from './constants/constants'

// interfaces
import { ITraderBotConfig } from './interfaces/config'
import { IBittrexMarketTicker } from './interfaces/bittrex'
import { telegramLogger } from './loggers/telegram'

// constants
const AUTO_BUY = false
const AUTO_SELL = false
const MIN_PROFIT_PERCENTAGE = 1
const TRANSACTION_FEE_PERCENTAGE = 0.5
const STOP_LOSS_BTC = 0.0001
const ANALYSIS_INTERVAL = 60 * 1000
const MAX_SIMULTANEOUS_TRADES = 2

const strategies = [
  movingAverageStrategy({
    minPriceHistory: 15,
    periodSize: 15,
    minProfit: MIN_PROFIT_PERCENTAGE + TRANSACTION_FEE_PERCENTAGE
  }),
  stopLossStrategy({
    maxLoss: STOP_LOSS_BTC
  })
]

// first we fetch the current BTC price
// todo: move fetching of BTC price to tradeBot logic
fetchBittrexObservable(`https://bittrex.com/api/v1.1/public/getticker?market=USDT-BTC`).subscribe(
  (market: IBittrexMarketTicker) => {
    const BTC_PRICE_USD = market.Ask

    // how much USD we want to spend when buying coins
    const TRADE_AMOUNT_USD = 5
    const TRADE_AMOUNT_BTC = TRADE_AMOUNT_USD / BTC_PRICE_USD

    const config: ITraderBotConfig = {
      apiKey: API_KEY,
      apiSecret: API_SECRET,
      autoBuy: AUTO_BUY,
      autoSell: AUTO_SELL,
      maxSimultaneousTrades: MAX_SIMULTANEOUS_TRADES,
      tradeInterval: ANALYSIS_INTERVAL,
      tradeAmountBTC: TRADE_AMOUNT_BTC,
      strategies,
      logger: telegramLogger(process.env.TELEGRAM_API_KEY, process.env.TELEGRAM_CHAT_ID)
    }

    tradeBot(config)
  }
)
