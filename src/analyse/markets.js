const { request } = require('../rest/request')
const { calculateMovingAverage } = require('../studies/movingAverage')

const MAX_SIMULAR_TRADES = 1
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

const marketState = {
    markets: {}
}

/* 

{
    markets: {
        ethereum: {
            market: { ... },
            priceHistory: [ 1.1, 1.02, 1.4, 1.1 ], // newest first
            movingAverage: 1.1
        }
    }
}


*/


// get daytrade markets
// check price every 10 seconds
// store current price
// calculate moving average when there are more than x prices stored
// check if current price > moving average




async function analyseMarkets() {
    return await setMarketStatus()
}

async function setMarketStatus() {
    const dayTradeMarkets = await getDayTradeMarkets()

    dayTradeMarkets.forEach(market => {
        const priceBtc = parseFloat(market.price_btc)

        if (!marketState.markets[market.id]) {
            marketState.markets[market.id] = {
                market,
                priceHistory: [ priceBtc ],
                movingAverage: 0
            }
        } else {
            marketState.markets[market.id].priceHistory = [ priceBtc, ...marketState.markets[market.id].priceHistory]
            marketState.markets[market.id].movingAverage = calculateMovingAverage(marketState.markets[market.id].priceHistory)
        }

        if (market.id === 'ethereum') {
            console.log('moving avg ETH:', marketState.markets['ethereum'].movingAverage)
        }
    })

    return `Stored price info of ${dayTradeMarkets.length} markets!`
}

async function getDayTradeMarkets() {
    const topMarkets = await getTopMarkets()
    return topMarkets.filter(m => filterMarketChange(m, MARKET_CIRTERIA.DAY_TRADE))
}

function getTopMarkets() {
    return request('https://api.coinmarketcap.com/v1/ticker/?limit=50')
}

function filterMarketChange(market, criteria) {
    const changeAmount = criteria.period === 'week' ? parseFloat(market.percent_change_7d) : parseFloat(market.percent_change_24h)
    return changeAmount >= criteria.min
        && changeAmount <= criteria.max
}

module.exports = {
    analyseMarkets
}