// interfaces
import { IBittrexMarket, ITimedBittrexMarketTicker, IBittrexMarketHistory } from './bittrex'
import { IOrderStatus } from './orders'

export interface IPriceHistory {
  timestamp: number
  price: number
}

export interface IMarketState {
  market: IBittrexMarket
  ticker: ITimedBittrexMarketTicker
  history: IPriceHistory[]
  orderStatus: IOrderStatus
}
