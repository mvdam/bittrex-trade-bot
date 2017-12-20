// dependencies
const { logger } = require('../utils/logger')
const { shouldBuy, shouldSell, shouldCancel, currentPrice, buy, sell, cancel } = require('./utils')

function trader(marketStatusses, config) {
  return new Promise((resolve, reject) => {
    const processedMarkets = {}
    const selectedMarketKeys = Object.keys(marketStatusses)

    selectedMarketKeys.forEach(marketId => {
      processedMarkets[marketId] = processMarket(marketStatusses[marketId], config)
    })

    return resolve(processedMarkets)
  })
}

function processMarket(marketStatus, config) {
  const { apiKey, apiSecret, autoBuy, autoSell } = config
  const currPrice = currentPrice(marketStatus.priceHistory)

  if (shouldBuy(marketStatus)) {
    return buy(marketStatus, currPrice)
  } else if (shouldSell(marketStatus)) {
    return sell(marketStatus, currPrice)
  } else if (shouldCancel(marketStatus)) {
    return cancel(marketStatus, currPrice)
  } else {
    return Object.assign({}, marketStatus)
  }
}

module.exports = {
  trader
}
