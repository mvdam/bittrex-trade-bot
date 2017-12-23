// libs
import * as Rx from 'rxjs/Rx'

// rest
import { getMarkets } from '../rest/bittrex'

// utils
import { applyStrategies } from '../utils/strategies'
import { combineMarketData } from '../utils/markets'

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

const validateConfig = (config: ITraderBotConfig) => {
    if (!config.apiKey) {
        throw new Error('API_KEY not provided!')
    } else if (!config.apiSecret) {
        throw new Error('API_SECRET not provided!')
    } else if (config.autoBuy === undefined) {
        throw new Error('Missing configuration for "autoBuy"')
    } else if (config.autoSell === undefined) {
        throw new Error('Missing configuration for "autoBuy"')
    } else if (config.tradeInterval === undefined) {
        throw new Error('Missing configuration for "tradeInterval"')
    } else if (config.strategies === undefined) {
        throw new Error('Missing configuration for "strategies"')
    }
}