import * as Rx from 'rxjs/Rx'
import fetch from 'node-fetch'

// config
export interface ITraderBotConfig {
    apiKey: string
    apiSecret: string
    autoBuy: boolean
    autoSell: boolean
    tradeInterval: number

    buyFeeAmount: number
    sellFeeAmount: number
}

// strategies
export type IStrategy = (config: any) => (marketState: IMarketState) => IStrategyDecision

export interface IStrategyDecision {
    name: string
    shouldBuy: () => boolean
    shouldSell: () => boolean
}

export interface IMovingAverageStrategy {
    minPriceHistory: number
    periodSize: number
    minProfit: number
}

// bittrex
export interface IBittrexMarket {
    MarketCurrency: string
    BaseCurrency: string
    MarketCurrencyLong: string
    BaseCurrencyLong: string
    MinTradeSize: number
    MarketName: string
    IsActive: boolean
    Created: string
    Notice: null | string
    IsSponsored: null
    LogoUrl: string
}

export interface IBittrexMarketHistory {
    Id: string
    TimeStamp: string
    Quantity: number
    Price: number
    Total: number
    FillType: 'FILL' | 'PARTIAL_FILL'
    OrderType: 'BUY' | 'SELL'
}

export interface IBittrexMarketTicker {
    Bid: number
    Ask: number
    Last: number
}

// orders
export interface ITimedBittrexMarketTicker extends IBittrexMarketTicker {
    timestamp: number
}

export interface IOrderStatus {
    isOpen: boolean
    type: 'BUY' | 'SELL' | null
    orderPrice: number | null
    originalPrice: number | null
}

export interface IOrdersState {
    openOrders: any[]
    closedOders: any[]
}

// markets
export interface IMarketState {
    market: IBittrexMarket
    ticker: ITimedBittrexMarketTicker
    history: IBittrexMarketHistory[]
    orderStatus: IOrderStatus
}

// state
export interface ITraderBotStats {
    avgProfit: number
    maxLoss: number
    maxGain: number
    profitHistory: number[]
}

export interface ITraderBotState {
    config: ITraderBotConfig
    markets: IMarketState[]
    orders: IOrdersState
    stats: ITraderBotStats
}

const fetchObservable = api =>
    Rx.Observable.create(observer =>
        fetch(api)
            .then(res => res.json())
            .then(json => {
                observer.next(json)
                observer.complete()
            })
            .catch(observer.error)
    )

// bittrex api returns an object with property `result` that we need
const fetchBittrexObservable = api =>
    fetchObservable(api)
        .map(json => json.result)

        
// generic utils
const sumArray = (arr: number[]): number => arr.reduce((a, b) => a + b, 0)

// market utils
const flattenMarkets = (markets: IBittrexMarket[]) => Rx.Observable.from(markets)
const isBTCMarket = (market: IBittrexMarket): boolean => market.BaseCurrency === 'BTC'

const combineMarketData = (market: IBittrexMarket) =>
    Rx.Observable.forkJoin(
        fetchMarketHistory(market),
        fetchBittrexMarketTicker(market),
        (history: IBittrexMarketHistory[], ticker: IBittrexMarketTicker) =>
            toMarketState(market, history, ticker)
    )

const toMarketState = (market: IBittrexMarket, history: IBittrexMarketHistory[], ticker: IBittrexMarketTicker) => ({
    market,
    history,
    ticker,
    orderStatus: {
        isOpen: false,
        type: null,
        orderPrice: null,
        originalPrice: null
    }
}) as IMarketState



const getPriceHistory = (marketState: IMarketState) => marketState.history.map(h => h.Price)
const getLatestPrice = (marketState: IMarketState) => getPriceHistory(marketState) && getPriceHistory(marketState)[0] || 0
const getPreviousPrice = (marketState: IMarketState) => getPriceHistory(marketState) && getPriceHistory(marketState)[1] || 0

// fetch
const fetchBittrexMarkets = () => fetchBittrexObservable('https://bittrex.com/api/v1.1/public/getmarkets') as Rx.Observable<IBittrexMarket[]>

const fetchBittrexMarketTicker = (market: IBittrexMarket) =>
    fetchBittrexObservable(`https://bittrex.com/api/v1.1/public/getticker?market=${market.BaseCurrency}-${market.MarketCurrency}`) as Rx.Observable<IBittrexMarketTicker>

const fetchMarketHistory = (market: IBittrexMarket) =>
    fetchBittrexObservable(`https://bittrex.com/api/v1.1/public/getmarkethistory?market=${market.BaseCurrency}-${market.MarketCurrency}`) as Rx.Observable<IBittrexMarketHistory[]>

const getMarkets = () => fetchBittrexMarkets()
    .mergeMap(flattenMarkets)
    .filter(isBTCMarket)

const movingAverageStrategy: IStrategy = (config: IMovingAverageStrategy) => (marketState: IMarketState): IStrategyDecision => {
    const calculateMovingAverage = (priceHistory: number[]) => {
        if (priceHistory.length < config.minPriceHistory) {
            return 0
        }

        const useAsHistory = priceHistory.slice(0, config.periodSize)
        const pricesTotal = sumArray(priceHistory)

        return pricesTotal / useAsHistory.length
    }
    
    const priceHistory = getPriceHistory(marketState)

    const movingAvg = calculateMovingAverage(priceHistory)
    const currentPrice = getLatestPrice(marketState)

    const shouldSell = () => {
        return movingAvg !== 0
            && currentPrice > movingAvg
    }

    const shouldBuy = () => {
        return movingAvg !== 0
            && currentPrice < movingAvg
    }

    return {
        name: 'movingAverage',
        shouldSell,
        shouldBuy
    }
}

const strategies = [
    movingAverageStrategy({
        minPriceHistory: 15,
        periodSize: 15,
        minProfit: 2
    })
]

const main = getMarkets()
    // take 1 for debugging -> remove when implementation is finished
    .take(1)
    .mergeMap(combineMarketData)
    .subscribe((marketState: IMarketState) => {
        console.log(marketState)
    })