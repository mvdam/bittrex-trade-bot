// config
const MIN_PROFIT_PERCENTAGE = 0.01
const TRANSACTION_COSTS_PERCENTAGE = 0.005

function shouldSell(marketStatus) {
    if (invalidMarketStatus(marketStatus)) {
        return false
    }

    const { currPrice, prevPrice, movingAverage } = extractMarketData(marketStatus)
    return (currPrice > movingAverage) && (currPrice < prevPrice)
}

function shouldBuy(marketStatus) {
    if (invalidMarketStatus(marketStatus)) {
        return false
    }

    const { currPrice, prevPrice, movingAverage } = extractMarketData(marketStatus)
    return (currPrice < movingAverage) && (currPrice > prevPrice)
}

function shouldCancel(marketStatus) {
    if (invalidMarketStatus(marketStatus)) {
        return false
    }

    const { currPrice, movingAverage, tradeType } = extractMarketData(marketStatus)
    return ( tradeType === 'short' && currPrice < movingAverage )
        || ( tradeType === 'long' && currPrice > movingAverage )
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

function sellTarget(currPrice, minProfitPercentage, transactionPercentage) {
    const profitPercentage = ( minProfitPercentage + transactionPercentage ) + 1
    return currPrice * profitPercentage
}

module.exports = {
    shouldSell,
    shouldBuy,
    shouldCancel,
    currentPrice
}