// interfaces
import { ITraderBotConfig } from './config'
import { IMarketState } from './markets'
import { IOrdersState } from './orders'

export interface ITraderBotStats {
    avgProfit: number
    maxLoss: number
    maxGain: number
    profitHistory: number[]
}

export interface ITraderBotState {
    config: ITraderBotConfig
    markets: IMarketState[]
    orders: IOrdersState
    stats: ITraderBotStats
}
