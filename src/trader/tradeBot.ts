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
import { IMarketState } from '../interfaces/markets'

const getMarketStates = (): Rx.Observable<IMarketState[]> =>
    getMarkets()
        .mergeMap(combineMarketData)
        .reduce((acc, curr) => acc.concat(curr), [])

const interval = (timeout: number) =>
    Rx.Observable.timer(0, timeout)

const toObservable = (marketStates: IMarketState[]) =>
    Rx.Observable.from(marketStates)

const updateMarketState = (updatedState: IMarketState, marketStates: IMarketState[]) =>
    marketStates.map((marketState: IMarketState) => 
        marketState.market.MarketCurrency === updatedState.market.MarketCurrency
            ? updatedState
            : marketState
        )

const onInit = () =>
    console.log('Setup of market states complete! Continue...')

const beforeCycle = () => {
    console.log('_____________________________')
    console.log('Check market states...')
}

export const tradeBot = (config: ITraderBotConfig) => {
    validateConfig(config)

    return getMarketStates()
        .do(onInit)
        .subscribe((marketStates: IMarketState[]) => {
            let observeMarketStates = [ ...marketStates ]

            interval(config.tradeInterval)
                .do(beforeCycle)

                // flatten states to process 
                .mergeMap(() =>
                    toObservable(observeMarketStates))

                // todo: implement price update mechanism
                // .map( ... => ... )

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
