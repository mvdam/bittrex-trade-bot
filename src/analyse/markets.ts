// dependencies
import { request } from '../rest/request'
import { calculateMovingAverage } from '../studies/movingAverage'
import { logger } from '../utils/logger'
import { trader } from '../orders/trader'

// interfaces
import { IMarketStatus, IMarketState } from '../interfaces/IMarketStatus'
import { IMarket } from '../interfaces/IMarket'
import { IMarketHistory, IMarketPriceHistory } from '../interfaces/IMarketHistory'
import { ITraderBotConfig } from '../interfaces/ITraderBotConfig'

// config
const MAX_SIMULTANEOUS_TRADES = 1
const MARKET_CIRTERIA = {
  STABLE: {
    min: -4,
    max: 4,
    period: 'week'
  },
  DAY_TRADE: {
    min: 2,
    max: 10,
    period: 'day'
  }
}

// state
let MARKETS_STATE: IMarketState = {} as IMarketState
let MARKET_HISTORY: IMarketPriceHistory = {} as IMarketPriceHistory

export async function analyseMarkets(config: ITraderBotConfig) {
  const marketState = await setMarketStatus()
  const traderState = await trader(marketState, config)

  MARKETS_STATE = Object.assign({}, traderState)

  return MARKETS_STATE
}

async function setMarketStatus(): Promise<IMarketState> {
  const dayTradeMarkets = await getDayTradeMarkets() as IMarket[]

  if (!Object.keys(MARKET_HISTORY).length) {
    MARKET_HISTORY = await getMarketsHistory(dayTradeMarkets.map(m => m.MarketName))
    logger('___STORED MARKET HISTORY___')
  }

  dayTradeMarkets.forEach(market => {
    const priceBtc = market.Ask
    const marketId = market.MarketName

    if (!MARKETS_STATE[marketId]) {
      const marketHistory = MARKET_HISTORY[marketId] || []

      MARKETS_STATE[marketId] = {
        market,
        priceHistory: [priceBtc, ...marketHistory],
        movingAverage: calculateMovingAverage(marketHistory),
        trade: {
          placed: false,
          type: null
        }
      }
    } else {
      MARKETS_STATE[marketId].priceHistory = [priceBtc, ...MARKETS_STATE[marketId].priceHistory]
      MARKETS_STATE[marketId].movingAverage = calculateMovingAverage(MARKETS_STATE[marketId].priceHistory)
    }
  })

  // logger(`MARKET_STATUS : Stored price info of ${dayTradeMarkets.length} markets!`)

  return MARKETS_STATE
}

async function getDayTradeMarkets(): Promise<IMarket[]> {
  const topMarkets = await getTopMarkets()
  return topMarkets.filter(m => m.MarketName.indexOf('BTC-') > -1)
}

async function getMarketsHistory(markets: string[]): Promise<IMarketPriceHistory> {
  const fetchActions = []
  const output = {}

  markets.forEach(market => {
    fetchActions.push(request(`https://bittrex.com/api/v1.1/public/getmarkethistory?market=${market}`))
  })

  const marketHistories = await Promise.all(fetchActions)

  markets.forEach((market, index) => {
    const history = marketHistories[index].result as IMarketHistory[]

    output[market] = history
      ? history
          .filter(h => h.OrderType === 'BUY' && h.FillType === 'FILL')
          .map(h => h.Price)
      : []
  })

  return output
}

async function getTopMarkets(): Promise<IMarket[]> {
  const markets = await request(`https://bittrex.com/api/v1.1/public/getmarketsummaries`)
  return markets.result
}
