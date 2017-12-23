// dependencies
import { logger } from '../utils/logger'
import { shouldBuy, shouldSell, currentPrice, buy, sell } from '../utils/trader'

// interfaces
import { IMarketState } from '../interfaces/IMarketStatus'

// interaces
import { IMarketStatus } from '../interfaces/IMarketStatus';
import { ITraderBotConfig } from '../interfaces/ITraderBotConfig';

export function trader(marketStatusses: IMarketState, config: ITraderBotConfig): Promise<IMarketState> {
  return new Promise((resolve, reject) => {
    const processedMarkets = {}
    const selectedMarketKeys = Object.keys(marketStatusses)

    selectedMarketKeys.forEach(marketId => {
      processedMarkets[marketId] = processMarket(marketStatusses[marketId], config)
    })

    return resolve(processedMarkets)
  })
}

function processMarket(marketStatus: IMarketStatus, config: ITraderBotConfig): IMarketStatus {
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
