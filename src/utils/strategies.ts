// interfaces
import { IStrategy } from '../interfaces/strategies'
import { IMarketState } from '../interfaces/markets'
import { IBittrexMarketHistory } from '../interfaces/bittrex';

export const applyStrategies = (strategies: IStrategy[]) =>
    (marketState: IMarketState) => {
        if (shouldBuy(marketState, strategies)) {
            console.log(`BUY ${marketState.market.MarketCurrency}`)
        }

        if (shouldSell(marketState, strategies)) {
            console.log(`SELL ${marketState.market.MarketCurrency}`)
        }

        // todo: to be implemented
        // update marketstate with decisions
        return marketState
    }

const shouldBuy = (marketState: IMarketState, strategies: IStrategy[]) =>
    !marketState.orderStatus.isOpen &&
    strategies.some(strategy => strategy(marketState).shouldBuy() === true)

const shouldSell = (marketState: IMarketState, strategies: IStrategy[]) =>
    marketState.orderStatus.isOpen &&
    strategies.some(strategy => strategy(marketState).shouldSell() === true)
