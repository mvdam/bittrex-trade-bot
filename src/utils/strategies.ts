// interfaces
import { IStrategy } from '../interfaces/strategies'
import { IMarketState } from '../interfaces/markets'

export const applyStrategies = (strategies: IStrategy[]) =>
    (marketState: IMarketState) => {
        // todo: to be implemented
        // update marketstate with decisions
        return marketState
    }
