// interfaces
import { IStrategyConstructor, IMovingAverageStrategy, IStrategy, IStrategyDecision } from '../interfaces/strategies'
import { IMarketState } from '../interfaces/markets'

// utils
import { sumArray } from '../utils/utils'
import { getPriceHistory, getLatestPrice, sellTarget, buyTarget } from '../utils/markets'

export const movingAverageStrategy: IStrategyConstructor = (config: IMovingAverageStrategy): IStrategy => 
    (marketState: IMarketState): IStrategyDecision => {
        const calculateMovingAverage = (priceHistory: number[]): number => {
            if (priceHistory.length < config.minPriceHistory) {
                return 0
            }

            const useAsHistory = priceHistory.slice(0, config.periodSize)
            const pricesTotal = sumArray(useAsHistory)

            return pricesTotal / useAsHistory.length
        }
        
        const priceHistory = getPriceHistory(marketState)

        const movingAvg = calculateMovingAverage(priceHistory)
        const currentPrice = getLatestPrice(marketState)

        const shouldSell = (): boolean =>
            movingAvg !== 0 &&
            currentPrice >= sellTarget(movingAvg, config.minProfit)

        const shouldBuy = (): boolean =>
            movingAvg !== 0 &&
            currentPrice <= buyTarget(movingAvg, config.minProfit)

        return {
            name: 'movingAverage',
            shouldSell,
            shouldBuy
        }
    }
