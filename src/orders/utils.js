const { logger } = require('../utils/logger')

// config
const MIN_PROFIT_PERCENTAGE = 0.01
const TRANSACTION_COSTS_PERCENTAGE = 0.005
const STOP_LOSS = 0.0001

function shouldSell(marketStatus) {
    if (invalidMarketStatus(marketStatus) || !marketStatus.trade.placed) {
        return false
    }

    const { currPrice, prevPrice, movingAverage } = extractMarketData(marketStatus)
    const targetSellPrice = sellTarget(movingAverage, MIN_PROFIT_PERCENTAGE, TRANSACTION_COSTS_PERCENTAGE)

    const normalSellCondition = (currPrice > targetSellPrice) // && (currPrice < prevPrice)
    const stopLoss = currPrice <= ( marketStatus.trade.price - STOP_LOSS )

    if (normalSellCondition) {
        console.log('___SELL___')
    } else if (stopLoss) {
        console.log('___STOPLOSS___')
    }

    return normalSellCondition || stopLoss
}

function shouldBuy(marketStatus) {
    if (invalidMarketStatus(marketStatus) || marketStatus.trade.placed) {
        return false
    }

    const { currPrice, prevPrice, movingAverage } = extractMarketData(marketStatus)
    const targetBuyPrice = buyTarget(movingAverage, MIN_PROFIT_PERCENTAGE, TRANSACTION_COSTS_PERCENTAGE)

    return (currPrice < targetBuyPrice) && (currPrice > prevPrice)
}

function shouldCancel(marketStatus) {
    if (invalidMarketStatus(marketStatus) || !marketStatus.trade.placed) {
        return false
    }

    const { currPrice, movingAverage, tradeType } = extractMarketData(marketStatus)
    return ( tradeType === 'sell' && currPrice < movingAverage )
        || ( tradeType === 'buy' && currPrice > movingAverage )
}

function buy(marketStatus, currentPrice) {
  const priceDiff = ((currentPrice / marketStatus.movingAverage) * 100) - 100
  logger(`BUY : "${marketStatus.market.MarketName}" at ${currentPrice} BTC. Drops below moving avg with ${priceDiff}%. Avg is ${marketStatus.movingAverage}`)

  return Object.assign({}, marketStatus, {
    trade: {
      placed: true,
      price: currentPrice,
      type: 'buy',
      orderUuid: 'dsfsdf' // todo: implement
    }
  })
}

function sell(marketStatus, currentPrice) {
  const profit = ((currentPrice / marketStatus.trade.price) * 100) - 100
  logger(`SELL : "${marketStatus.market.MarketName}" at ${profit}% profit - old price ${marketStatus.trade.price} - current price ${currentPrice}`)

  return Object.assign({}, marketStatus, {
    trade: {
      placed: true,
      type: 'sell',
      orderUuid: 'dsfsdf' // todo: implement
    }
  })
}

function cancel(marketStatus, currentPrice) {
  const profit = ((currentPrice / marketStatus.trade.price) * 100) - 100
  logger(`CANCEL : "${marketStatus.market.MarketName}", Diff is ${profit}%, currentPrice: ${currentPrice}, bought for: ${marketStatus.trade.price}`)

  return Object.assign({}, marketStatus, {
    trade: {
      placed: false,
      type: null,
      price: null
    }
  })
}

function extractMarketData(marketStatus) {
    const currPrice = currentPrice(marketStatus.priceHistory)
    const prevPrice = previousPrice(marketStatus.priceHistory)
    const movingAverage = marketStatus.movingAverage
    const tradeType = marketStatus.trade.type

    return {
        currPrice,
        prevPrice,
        movingAverage,
        tradeType
    }
}

function invalidMarketStatus(marketStatus) {
    const { currPrice, prevPrice, movingAverage } = extractMarketData(marketStatus)

    return !currPrice || !prevPrice || !movingAverage
}

function previousPrice(priceHistory) {
    return priceHistory && priceHistory[1] || null
}

function currentPrice(priceHistory) {
    return priceHistory && priceHistory[0] || null
}

function sellTarget(movingAvg, minProfitPercentage, transactionPercentage) {
    const profitPercentage = ( minProfitPercentage + transactionPercentage ) + 1
    return movingAvg * profitPercentage
}

function buyTarget(movingAvg, minProfitPercentage, transactionPercentage) {
    const profitPercentage = 1 - ( minProfitPercentage + transactionPercentage )
    return movingAvg * profitPercentage
}

module.exports = {
    shouldSell,
    shouldBuy,
    shouldCancel,
    buy,
    sell,
    cancel,
    currentPrice
}
