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
            const amount = buyAmount(marketState, config)
            console.log(`BUY ${amount} * ${marketState.market.MarketCurrency} at ${getLatestPrice(marketState)} BTC`)
            return {
                ...marketState,
                orderStatus: {
                    ...marketState.orderStatus,
                    isOpen: true,
                    type: 'BUY',
                    orderPrice: getLatestPrice(marketState),
                    originalPrice: getLatestPrice(marketState),
                    time: Date.now(),
                    amount
                }
            }
        }

        if (shouldSell(marketState, marketStates, config)) {
            // debug
            const profit = calculateDiff(getLatestPrice(marketState), marketState.orderStatus.originalPrice)
            console.log(`SELL ${marketState.orderStatus.amount} * ${marketState.market.MarketCurrency} at ${getLatestPrice(marketState)} BTC. Profit: ${profit}%`)

            return {
                ...marketState,
                orderStatus: {
                    ...marketState.orderStatus,
                    isOpen: false,
                    type: null,
                    orderPrice: getLatestPrice(marketState),
                    amount: null,
                    time: null
                }
            }
        }

        return marketState
    }

const buyAmount = (marketState: IMarketState, config: ITraderBotConfig): number =>
    config.tradeAmountBTC / getLatestPrice(marketState)

// check if the amount we want to spend is nog below the minimum trade size
const canAfford = (marketState: IMarketState, config: ITraderBotConfig): boolean =>
    buyAmount(marketState, config) >= marketState.market.MinTradeSize

const shouldBuy = (marketState: IMarketState, marketStates: IMarketState[], config: ITraderBotConfig): boolean =>
    // skip if we already bought this
    !marketState.orderStatus.isOpen &&
    // skip when the maxSimultaneousTrades will exceed
    getOpenOrders(marketStates).length < config.maxSimultaneousTrades &&
    // check if the amount we want to spend is nog below the minimum trade size
    canAfford(marketState, config) &&
    // check all configured strategies
    config.strategies.some(strategy => strategy(marketState).shouldBuy() === true)

const shouldSell = (marketState: IMarketState, marketStates: IMarketState[], config: ITraderBotConfig): boolean =>
    marketState.orderStatus.isOpen &&
    config.strategies.some(strategy => strategy(marketState).shouldSell() === true)
