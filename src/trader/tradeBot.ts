// libs
import { Observable } from 'rxjs'

// rest
import { getMarkets } from '../rest/bittrex'

// utils
import { applyStrategies } from '../utils/strategies'
import { combineMarketData, updateMarketState, interval, toObservable, updatePriceHistory } from '../utils/markets'
import { validateConfig } from '../utils/utils'

// interfaces
import { ITraderBotConfig } from '../interfaces/config'
import { IMarketState } from '../interfaces/markets'

const getMarketStates = (): Observable<IMarketState[]> =>
    getMarkets()
        .mergeMap(combineMarketData)
        .toArray()

const onInit = () =>
    console.log('Setup of market states complete! Continue...')

const beforeCycle = () =>
    console.log(`_____________________________ ${new Date().toString()} _____________________________`)

export const tradeBot = (config: ITraderBotConfig) => {
    validateConfig(config)

    return getMarketStates()
        .do(onInit)
        .subscribe((marketStates: IMarketState[]) => {
            let observeMarketStates = [ ...marketStates ]

            // todo: do this with switchmap instead!
            interval(config.tradeInterval)
                .do(beforeCycle)

                // flatten states to process them separately
                .mergeMap(() =>
                    toObservable(observeMarketStates))

                // fetch current price before applying strategies on it
                .mergeMap(updatePriceHistory)

                // apply market strategies
                .map(applyStrategies(config.strategies))

                // update state
                .do((updatedState: IMarketState) =>
                    observeMarketStates = updateMarketState(updatedState, observeMarketStates))

                // subscribe
                .subscribe((processedMarketStates: IMarketState) => {
                    // to be implemented...
                })
        })
}
