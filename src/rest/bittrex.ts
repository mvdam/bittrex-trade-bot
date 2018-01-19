// libs
import { Observable } from 'rxjs'

// interfaces
import { IBittrexMarket, IBittrexMarketTicker, IBittrexMarketHistory } from '../interfaces/bittrex'

// utils
import { flattenMarkets, isBTCMarket, isActive } from '../utils/markets'
import { fetchObservable } from '../rest/fetchObservable'

export const fetchBittrexMarkets = (): Observable<IBittrexMarket[]> =>
    fetchBittrexObservable('https://bittrex.com/api/v1.1/public/getmarkets')

export const fetchBittrexMarketTicker = (market: IBittrexMarket): Observable<IBittrexMarketTicker> =>
    fetchBittrexObservable(`https://bittrex.com/api/v1.1/public/getticker?market=${market.BaseCurrency}-${market.MarketCurrency}`)

export const fetchMarketHistory = (market: IBittrexMarket): Observable<IBittrexMarketHistory[]> =>
  fetchBittrexObservable(`https://bittrex.com/api/v1.1/public/getmarkethistory?market=${market.BaseCurrency}-${market.MarketCurrency}`)

export const getMarkets = (): Observable<IBittrexMarket> =>
    fetchBittrexMarkets()
        .mergeMap(flattenMarkets)
        .filter(isBTCMarket)
        .filter(isActive)

export const fetchBittrexObservable = (api: string): Observable<any> =>
    fetchObservable(api)
        .map(json => json.result)
