// dependencies
const { logger } = require('../utils/logger')
const { shouldBuy, shouldSell, shouldCancel, currentPrice } = require('./utils')

function trader(marketStatusses, config) {
    return new Promise((resolve, reject) => {
        const processedMarkets = {}
        const selectedMarketKeys = Object.keys(marketStatusses)

        selectedMarketKeys.forEach(marketId => {
            processedMarkets[marketId] = processMarket(marketStatusses[marketId], config)
        })
        
        logger('TRADER : Processed all!')

        return resolve(processedMarkets)
    })
}

function processMarket(marketStatus, config) {
    const { apiKey, apiSecret, autoBuy, autoSell } = config
    const currPrice = currentPrice(marketStatus.priceHistory)

    if (!marketStatus.trade.placed) {
        if (shouldBuy(marketStatus)) {
            logger(`BUY : "${marketStatus.market.id}" at ${currPrice} BTC`)
            return Object.assign({}, marketStatus, {
                trade: {
                    placed: true,
                    type: 'long',
                    orderUuid: 'dsfsdf' // todo: implement
                }
            })
        } else if (shouldSell(marketStatus)) {
            logger(`SELL : "${marketStatus.market.id}" at ${currPrice} BTC`)
            return Object.assign({}, marketStatus, {
                trade: {
                    placed: true,
                    type: 'short',
                    orderUuid: 'dsfsdf' // todo: implement
                }
            })
        } else {
            return Object.assign({}, marketStatus)
        }
    } else if (shouldCancel(marketStatus)) {
        logger(`CANCEL ORDER : "${marketStatus.market.id}"`)
        return Object.assign({}, marketStatus, {
            trade: {
                placed: false,
                type: null
            }
        })
    } else {
        return Object.assign({}, marketStatus)
    }
    
}

module.exports = {
    trader
}