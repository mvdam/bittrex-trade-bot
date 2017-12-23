// interfaces
import { IBittrexMarket, ITimedBittrexMarketTicker, IBittrexMarketHistory } from './bittrex'
import { IOrderStatus } from './orders'

export interface IMarketState {
    market: IBittrexMarket
    ticker: ITimedBittrexMarketTicker
    history: IBittrexMarketHistory[]
    orderStatus: IOrderStatus
}
