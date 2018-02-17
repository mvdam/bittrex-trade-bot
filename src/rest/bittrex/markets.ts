// libs
import { Observable } from 'rxjs'

// interfaces
import { IBittrexMarket, IBittrexMarketTicker, IBittrexMarketHistory } from '../../interfaces/bittrex'
import { fetchObservable, IFetchConfig } from '../fetchObservable'

// utils
import { flattenMarkets, isBTCMarket, isActive } from '../../utils/markets'
import { createHeaders, getNonce } from '../../utils/rest'

// constants
import { API_KEY, API_SECRET, MAX_RETRY } from '../../constants/constants'

export const fetchBittrexMarkets = (): Observable<IBittrexMarket[]> =>
    fetchBittrexObservable('https://bittrex.com/api/v1.1/public/getmarkets')

export const fetchBittrexMarketTicker = (market: IBittrexMarket): Observable<IBittrexMarketTicker> =>
    fetchBittrexObservable(`https://bittrex.com/api/v1.1/public/getticker?market=${market.BaseCurrency}-${market.MarketCurrency}`)

export const fetchMarketHistory = (market: IBittrexMarket): Observable<IBittrexMarketHistory[]> =>
  fetchBittrexObservable(`https://bittrex.com/api/v1.1/public/getmarkethistory?market=${market.BaseCurrency}-${market.MarketCurrency}`)

export const getMarkets = (): Observable<IBittrexMarket> =>
    fetchBittrexMarkets()
        .retry(MAX_RETRY)
        .mergeMap(flattenMarkets)
        .filter(isBTCMarket)
        .filter(isActive)

export const fetchBittrexObservable = (api: string): Observable<any> =>
    fetchObservable({api})
        .map(json => json.result)

export const signedFetchBittrexObservable = (api: string): Observable<any> => {
  const url = `${api}?apikey=${API_KEY}&nonce=${getNonce()}`
  const fetchConfig: IFetchConfig = {
    api: url,
    method: 'GET',
    headers: createHeaders(url, API_SECRET)
  }

  return fetchObservable(fetchConfig)
    .map(json => json.result)
}
