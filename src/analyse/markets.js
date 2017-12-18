// dependencies
const { request } = require('../rest/request')
const { calculateMovingAverage } = require('../studies/movingAverage')
const { logger } = require('../utils/logger')
const { trader } = require('../orders/trader')

// config
const MAX_SIMULTANEOUS_TRADES = 1
const MARKET_CIRTERIA = {
    STABLE: {
        min: -4,
        max: 4,
        period: 'week'
    },
    DAY_TRADE: {
        min: 2,
        max: 10,
        period: 'day'
    }
}

// state
let MARKETS_STATE = {}

async function analyseMarkets(config) {
    const marketState = await setMarketStatus()
    const traderState = await trader(marketState, config)

    MARKETS_STATE = Object.assign({}, traderState)

    return MARKETS_STATE
}

async function setMarketStatus() {
    const dayTradeMarkets = await getDayTradeMarkets()

    dayTradeMarkets.forEach(market => {
        const priceBtc = parseFloat(market.price_btc)

        if (!MARKETS_STATE[market.id]) {
            MARKETS_STATE[market.id] = {
                market,
                priceHistory: [ priceBtc ],
                movingAverage: 0,
                trade: {
                    placed: false,
                    type: null
                }
            }
        } else {
            MARKETS_STATE[market.id].priceHistory = [ priceBtc, ...MARKETS_STATE[market.id].priceHistory]
            MARKETS_STATE[market.id].movingAverage = calculateMovingAverage(MARKETS_STATE[market.id].priceHistory)
        }
    })

    // logger(`MARKET_STATUS : Stored price info of ${dayTradeMarkets.length} markets!`)

    return MARKETS_STATE
}

async function getDayTradeMarkets() {
    const topMarkets = await getTopMarkets()
    return topMarkets //.filter(m => filterMarketChange(m, MARKET_CIRTERIA.DAY_TRADE))
}

function getTopMarkets() {
    return request(`https://api.coinmarketcap.com/v1/ticker/?limit=50&${Date.now()}`)
}

function filterMarketChange(market, criteria) {
    const changeAmount = criteria.period === 'week' ? parseFloat(market.percent_change_7d) : parseFloat(market.percent_change_24h)
    return changeAmount >= criteria.min
        && changeAmount <= criteria.max
}

module.exports = {
    analyseMarkets
}