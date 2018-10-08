import { IMarketState } from '../interfaces/markets'
import { ITraderBotConfig } from '../interfaces/config'
import { Observable } from 'rxjs'
import { getLatestPrice } from './markets'
import { calculateDiff } from './utils'

const fakePromise = (timeout: number): Promise<string> =>
  new Promise(resolve => {
    setTimeout(() => resolve('buh'), timeout)
  })

// todo: make pretty
export const executeTrades = (marketStates: IMarketState[], config: ITraderBotConfig) => (
  marketState: IMarketState
): Observable<IMarketState> => {
  if (marketState.orderStatus.type === 'BUY') {
    console.log(
      `BUY ${marketState.orderStatus.amount} * ${
        marketState.market.MarketCurrency
      } at ${getLatestPrice(marketState)} BTC`
    )

    return Observable.fromPromise(fakePromise(1000))
      .do(() => console.log(`BUY ORDER of ${marketState.market.MarketCurrency} COMPLETE`))
      .map(
        (): IMarketState => ({
          ...marketState,
          orderStatus: {
            ...marketState.orderStatus,
            type: 'BOUGHT'
          }
        })
      )
  }

  if (marketState.orderStatus.type === 'SELL') {
    const profit = calculateDiff(getLatestPrice(marketState), marketState.orderStatus.originalPrice)
    console.log(
      `SELL ${marketState.orderStatus.amount} * ${
        marketState.market.MarketCurrency
      } at ${getLatestPrice(marketState)} BTC. Profit: ${profit}%`
    )

    // todo: implement SELL order here
    return Observable.fromPromise(fakePromise(1000))
      .do(() => console.log(`SELL ORDER of ${marketState.market.MarketCurrency} COMPLETE`))
      .map(
        (): IMarketState => ({
          ...marketState,
          orderStatus: {
            ...marketState.orderStatus,
            type: null,
            isOpen: false,
            amount: null,
            orderPrice: null,
            originalPrice: null,
            time: null
          }
        })
      )
  }

  return Observable.of(marketState)
}
