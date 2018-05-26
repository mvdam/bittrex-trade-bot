// interfaces
import { IStrategy } from '../interfaces/strategies'
import { IMarketState } from '../interfaces/markets'
import { ITraderBotConfig } from '../interfaces/config';

// functions
import { getLatestPrice, getOpenOrders } from './markets'

// utils
import { calculateDiff } from './utils'

export const applyStrategies = (marketStates: IMarketState[], config: ITraderBotConfig) =>
    (marketState: IMarketState): IMarketState => {
        if (shouldBuy(marketState, marketStates, config)) {
            console.log(`BUY ${marketState.market.MarketCurrency} at ${getLatestPrice(marketState)} BTC`)
            return {
                ...marketState,
                orderStatus: {
                    ...marketState.orderStatus,
                    isOpen: true,
                    type: 'BUY',
                    orderPrice: getLatestPrice(marketState),
                    originalPrice: getLatestPrice(marketState),
                    time: Date.now()
                }
            }
        }

        if (shouldSell(marketState, marketStates, config)) {
            // debug
            const profit = calculateDiff(getLatestPrice(marketState), marketState.orderStatus.originalPrice)
            console.log(`SELL ${marketState.market.MarketCurrency} at ${getLatestPrice(marketState)} BTC. Profit: ${profit}%`)

            return {
                ...marketState,
                orderStatus: {
                    ...marketState.orderStatus,
                    isOpen: false,
                    type: null,
                    orderPrice: getLatestPrice(marketState),
                    time: null
                }
            }
        }

        return marketState
    }

const shouldBuy = (marketState: IMarketState, marketStates: IMarketState[], config: ITraderBotConfig): boolean =>
    getOpenOrders(marketStates).length < config.maxSimultaneousTrades &&
    !marketState.orderStatus.isOpen &&
    config.strategies.some(strategy => strategy(marketState).shouldBuy() === true)

const shouldSell = (marketState: IMarketState, marketStates: IMarketState[], config: ITraderBotConfig): boolean =>
    marketState.orderStatus.isOpen &&
    config.strategies.some(strategy => strategy(marketState).shouldSell() === true)
