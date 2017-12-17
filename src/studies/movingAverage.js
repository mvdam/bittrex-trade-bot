const MIN_PRICE_HISTORY = 1

function calculateMovingAverage(pricesHistory) {
    if (pricesHistory.length < MIN_PRICE_HISTORY) {
        return 0
    }

    const useHistory = pricesHistory.slice(0, MIN_PRICE_HISTORY)
    const total = sumArray(useHistory)

    return total / useHistory.length
}

function sumArray(arr) {
    return arr.reduce((a, b) => a + b, 0)
}

module.exports = {
    calculateMovingAverage
}