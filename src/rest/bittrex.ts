// libs
import * as Rx from 'rxjs/Rx'

// interfaces
import { IBittrexMarket, IBittrexMarketTicker, IBittrexMarketHistory } from '../interfaces/bittrex'

// utils
import { flattenMarkets, isBTCMarket, isActive } from '../utils/markets'
import { fetchObservable } from '../rest/fetchObservable'

export const fetchBittrexMarkets = () => fetchBittrexObservable('https://bittrex.com/api/v1.1/public/getmarkets') as Rx.Observable<IBittrexMarket[]>

export const fetchBittrexMarketTicker = (market: IBittrexMarket) => fetchBittrexObservable(`https://bittrex.com/api/v1.1/public/getticker?market=${market.BaseCurrency}-${market.MarketCurrency}`) as Rx.Observable<IBittrexMarketTicker>

export const fetchMarketHistory = (market: IBittrexMarket) =>fetchBittrexObservable(`https://bittrex.com/api/v1.1/public/getmarkethistory?market=${market.BaseCurrency}-${market.MarketCurrency}`) as Rx.Observable<IBittrexMarketHistory[]>

export const getMarkets = () => fetchBittrexMarkets()
    .mergeMap(flattenMarkets)
    .filter(isBTCMarket)
    .filter(isActive)

export const fetchBittrexObservable = api =>
    fetchObservable(api)
        .map(json => json.result)