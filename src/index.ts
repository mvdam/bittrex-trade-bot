// libs
import * as Rx from 'rxjs/Rx'
import fetch from 'node-fetch'

// functions
import { movingAverageStrategy } from './strategies/movingAverage'
import { getMarkets } from './rest/bittrex'

// utils
import { applyStrategies } from './utils/strategies'
import { combineMarketData } from './utils/markets'

const MIN_PROFIT_PERCENTAGE = 1
const TRANSACTION_FEE_PERCENTAGE = 0.5
const STOP_LOSS = 0.0001

const strategies = [
    // todo: add stoploss strategy
    movingAverageStrategy({
        minPriceHistory: 15,
        periodSize: 15,
        minProfit: MIN_PROFIT_PERCENTAGE + TRANSACTION_FEE_PERCENTAGE
    })
]

const main = getMarkets()
    // take 1 for debugging -> remove when implementation is finished
    .take(1)
    .mergeMap(combineMarketData)
    .map(applyStrategies(strategies))
    .subscribe((res) => {
        console.log(res)
    })
