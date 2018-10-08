// libs
import { Observable } from 'rxjs'

// interfaces
import { IBittrexMarket, IBittrexMarketTicker, IBittrexMarketHistory } from '../interfaces/bittrex'
import { IMarketState } from '../interfaces/markets'
import { ITraderBotConfig } from '../interfaces/config'

// utils
import { fetchBittrexMarketTicker, fetchMarketHistory, getMarkets } from '../rest/bittrex/markets'
import { afterCycle, beforeCycle } from './utils'
import { applyStrategies } from './strategies'
import { executeTrades } from './trades'

// constants
import { MAX_RETRY } from '../constants/constants'

export const flattenMarkets = (markets: IBittrexMarket[]): Observable<IBittrexMarket> =>
  Observable.from(markets)

export const isBTCMarket = (market: IBittrexMarket): boolean => market.BaseCurrency === 'BTC'

export const isActive = (market: IBittrexMarket): boolean => market.IsActive === true

export const sellTarget = (price: number, minProfit: number): number =>
  (price / 100) * (100 + minProfit)

export const buyTarget = (price: number, minProfit: number): number =>
  (price / 100) * (100 - minProfit)

export const combineMarketData = (market: IBittrexMarket): Observable<IMarketState> =>
  Observable.forkJoin(
    fetchMarketHistory(market),
    fetchBittrexMarketTicker(market),
    (history: IBittrexMarketHistory[], ticker: IBittrexMarketTicker) =>
      toMarketState(market, history, ticker)
  )

export const toMarketState = (
  market: IBittrexMarket,
  history: IBittrexMarketHistory[],
  ticker: IBittrexMarketTicker
): IMarketState => ({
  market,
  ticker,
  history: history.map(h => ({
    timestamp: new Date(h.TimeStamp).valueOf(),
    price: h.Price
  })),
  orderStatus: {
    isOpen: false,
    type: null,
    orderPrice: null,
    originalPrice: null,
    time: null,
    amount: null
  }
})

export const updatePriceHistory = (marketState: IMarketState): Observable<IMarketState> =>
  fetchBittrexMarketTicker(marketState.market)
    .retry(MAX_RETRY)
    .map((ticker: IBittrexMarketTicker) => ({
      ...marketState,
      ticker,
      history: [
        {
          timestamp: Date.now(),
          price: ticker.Ask
        },
        ...marketState.history
      ]
    }))

export const getPriceHistory = (marketState: IMarketState): number[] =>
  marketState.history.map(h => h.price)

export const getLatestPrice = (marketState: IMarketState): number =>
  (getPriceHistory(marketState) && getPriceHistory(marketState)[0]) || 0

export const getPreviousPrice = (marketState: IMarketState): number =>
  (getPriceHistory(marketState) && getPriceHistory(marketState)[1]) || 0

export const interval = (timeout: number): Observable<number> => Observable.timer(0, timeout)

export const toObservable = (marketStates: IMarketState[]): Observable<IMarketState> =>
  Observable.from(marketStates)

export const getMarketStates = (): Observable<IMarketState[]> =>
  getMarkets()
    .mergeMap(combineMarketData)
    .toArray()

export const getOpenOrders = (marketStates: IMarketState[]): IMarketState[] =>
  marketStates.filter(state => state.orderStatus.isOpen === true)

export const checkMarketStates = (
  marketStates: IMarketState[],
  config: ITraderBotConfig
): Observable<IMarketState[]> =>
  Observable.of(marketStates)
    .do(beforeCycle)

    // flatten states to process them separately
    .mergeMap(() => toObservable(marketStates))

    // fetch current price before applying strategies on it
    .mergeMap(updatePriceHistory)

    // apply market strategies
    .map(applyStrategies(marketStates, config))

    // execute orders
    .mergeMap(executeTrades(marketStates, config))

    // combine as array
    .toArray()

    // after cycle
    .do(afterCycle)
