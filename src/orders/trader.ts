// dependencies
import { logger } from '../utils/logger'
import { shouldBuy, shouldSell, currentPrice, buy, sell } from './utils'

export function trader(marketStatusses, config) {
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
  } else {
    return Object.assign({}, marketStatus)
  }
}
