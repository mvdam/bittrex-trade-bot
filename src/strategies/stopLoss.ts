// interfaces
import { IStrategyConstructor, IStopLossStrategy, IStrategy, IStrategyDecision } from '../interfaces/strategies'
import { IMarketState } from '../interfaces/markets'

// utils
import { getLatestPrice } from '../utils/markets'

export const stopLossStrategy: IStrategyConstructor = (config: IStopLossStrategy): IStrategy => 
    (marketState: IMarketState): IStrategyDecision => {
        const currentPrice = getLatestPrice(marketState)

        const shouldSell = (): boolean =>
            // when current price is equal of lower than the buying price minus the max loss
            currentPrice <= marketState.orderStatus.originalPrice - config.maxLoss

        // stop loss strategy should only sell stuff
        const shouldBuy = (): boolean => false

        return {
            name: 'stopLoss',
            shouldSell,
            shouldBuy
        }
    }
