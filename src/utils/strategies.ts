// interfaces
import { IStrategy } from '../interfaces/strategies'
import { IMarketState } from '../interfaces/markets'
import { IBittrexMarketHistory } from '../interfaces/bittrex';
import { getLatestPrice } from './markets';

export const applyStrategies = (strategies: IStrategy[]) =>
    (marketState: IMarketState) => {
        if (shouldBuy(marketState, strategies)) {
            console.log(`BUY ${marketState.market.MarketCurrency} at ${getLatestPrice(marketState)}BTC`)
            return {
                ...marketState,
                orderStatus: {
                    ...marketState.orderStatus,
                    isOpen: true,
                    type: 'BUY',
                    orderPrice: getLatestPrice(marketState),
                    originalPrice: getLatestPrice(marketState)
                }
            }
        }

        if (shouldSell(marketState, strategies)) {
            // debug
            const profit = ( getLatestPrice(marketState) / marketState.orderStatus.originalPrice ) * 100
            console.log(`SELL ${marketState.market.MarketCurrency} at ${profit}%`)
            return {
                ...marketState,
                orderStatus: {
                    ...marketState.orderStatus,
                    isOpen: false,
                    type: null,
                    orderPrice: getLatestPrice(marketState)
                }
            }
        }

        return marketState
    }

const shouldBuy = (marketState: IMarketState, strategies: IStrategy[]) =>
    !marketState.orderStatus.isOpen &&
    strategies.some(strategy => strategy(marketState).shouldBuy() === true)

const shouldSell = (marketState: IMarketState, strategies: IStrategy[]) =>
    marketState.orderStatus.isOpen &&
    strategies.some(strategy => strategy(marketState).shouldSell() === true)
