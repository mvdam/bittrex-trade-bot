// libs
import { Observable, Subscription, Observer } from 'rxjs'

// utils
import { checkMarketStates, getMarketStates } from '../utils/markets'
import { onInit, validateConfig } from '../utils/utils'

// interfaces
import { ITraderBotConfig } from '../interfaces/config'
import { IMarketState } from '../interfaces/markets'

const recursiveMarketStateChecker = (marketStates: IMarketState[], config: ITraderBotConfig) =>
  Observable.create((observer: Observer<IMarketState[]>) => {

    const checkStates = (marketStates: IMarketState[]) => {
      let next = marketStates

      checkMarketStates(marketStates, config)
        .subscribe((updatedStates: IMarketState[]) => {
          observer.next(updatedStates)
          next = updatedStates
        }, () => {
          // some error handling
        }, () => {
          Observable.timer(config.tradeInterval)
            .subscribe(() => {
              checkStates(next)
            })
        })
    }

    checkStates(marketStates)
  })

export const tradeBot = (config: ITraderBotConfig): Subscription => {
    validateConfig(config)

    return getMarketStates()
        .do(onInit)
        .subscribe((marketStates: IMarketState[]) => {
          recursiveMarketStateChecker(marketStates, config)
            .subscribe((marketStates: IMarketState[]) => {
              // ...
            })
        })
}
