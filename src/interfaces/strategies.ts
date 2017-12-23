// interfaces
import { IMarketState } from './markets'

export type IStrategyConstructor = (config: any) => IStrategy
export type IStrategy = (marketState: IMarketState) => IStrategyDecision

export interface IStrategyDecision {
    name: string
    shouldBuy: () => boolean
    shouldSell: () => boolean
}

export interface IMovingAverageStrategy {
    minPriceHistory: number
    periodSize: number
    minProfit: number
}
