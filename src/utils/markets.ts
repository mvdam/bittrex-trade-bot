// libs
import * as Rx from 'rxjs/Rx'

// interfaces
import { IBittrexMarket, IBittrexMarketTicker, IBittrexMarketHistory } from '../interfaces/bittrex'
import { IMarketState } from '../interfaces/markets'

// utils
import { fetchBittrexMarketTicker, fetchMarketHistory } from '../rest/bittrex'

export const flattenMarkets = (markets: IBittrexMarket[]) =>
    Rx.Observable.from(markets)

export const isBTCMarket = (market: IBittrexMarket): boolean =>
    market.BaseCurrency === 'BTC'

export const isActive = (market: IBittrexMarket): boolean =>
    market.IsActive === true

export const sellTarget = (price: number, minProfit: number) =>
    ( price / 100 ) * ( 100 + minProfit )

export const buyTarget = (price: number, minProfit: number) =>
    ( price / 100 ) * ( 100 - minProfit )

export const combineMarketData = (market: IBittrexMarket) =>
    Rx.Observable.forkJoin(
        fetchMarketHistory(market),
        fetchBittrexMarketTicker(market),
        (history: IBittrexMarketHistory[], ticker: IBittrexMarketTicker) =>
            toMarketState(market, history, ticker)
    )

export const toMarketState = (market: IBittrexMarket, history: IBittrexMarketHistory[], ticker: IBittrexMarketTicker) => ({
    market,
    ticker,
    history: history.map(h => ({
        timestamp: parseInt(h.TimeStamp),
        price: h.Price
    })),
    orderStatus: {
        isOpen: false,
        type: null,
        orderPrice: null,
        originalPrice: null
    }
}) as IMarketState

export const getPriceHistory = (marketState: IMarketState) =>
    marketState.history.map(h => h.price)

export const getLatestPrice = (marketState: IMarketState) =>
    getPriceHistory(marketState) && getPriceHistory(marketState)[0] || 0

export const getPreviousPrice = (marketState: IMarketState) =>
    getPriceHistory(marketState) && getPriceHistory(marketState)[1] || 0
