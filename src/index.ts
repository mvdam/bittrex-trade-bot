// functions
import { tradeBot } from './trader/tradeBot'

// strategies
import { movingAverageStrategy } from './strategies/movingAverage'
import { stopLossStrategy } from './strategies/stopLoss'

// constants
const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET

const AUTO_BUY = false
const AUTO_SELL = false
const MIN_PROFIT_PERCENTAGE = 1
const TRANSACTION_FEE_PERCENTAGE = 0.5
const STOP_LOSS = 0.0001
const ANALYSIS_INTERVAL = 20000

const strategies = [
    movingAverageStrategy({
        minPriceHistory: 15,
        periodSize: 15,
        minProfit: MIN_PROFIT_PERCENTAGE + TRANSACTION_FEE_PERCENTAGE
    }),
    stopLossStrategy({
        maxLoss: STOP_LOSS
    })
]

const config = {
    apiKey: API_KEY,
    apiSecret: API_SECRET,
    autoBuy: AUTO_BUY,
    autoSell: AUTO_SELL,
    tradeInterval: ANALYSIS_INTERVAL,
    strategies
}

tradeBot(config)
