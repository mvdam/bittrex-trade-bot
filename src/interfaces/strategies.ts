// interfaces
import { IMarketState } from './markets'

export type IStrategyConfig = IMovingAverageStrategy | IStopLossStrategy
export type IStrategyConstructor = (config: IStrategyConfig) => IStrategy
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

export interface IStopLossStrategy {
    maxLoss: number
}
