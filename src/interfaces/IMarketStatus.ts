import { IMarket } from './IMarket'

export interface IMarketStatus {
    market: IMarket
    priceHistory: number[]
    movingAverage: number
    trade: {
        placed: boolean
        type: 'buy' | null
    }
}