// libs
import * as Rx from 'rxjs/Rx'

// rest
import { getMarkets } from '../rest/bittrex'

// utils
import { applyStrategies } from '../utils/strategies'
import { combineMarketData } from '../utils/markets'
import { validateConfig } from '../utils/utils'

// interfaces
import { ITraderBotConfig } from '../interfaces/config'

export const tradeBot = (config: ITraderBotConfig) => {
    validateConfig(config)

    return getMarkets()
        // .take(1) // take 1 for debugging -> remove when implementation is finished
        .mergeMap(combineMarketData)
        .map(applyStrategies(config.strategies))
        .subscribe((res) => {
            // to be implemented
        })
}
