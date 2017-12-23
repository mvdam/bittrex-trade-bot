const MIN_PRICE_HISTORY = 15
const PERIOD_SIZE = 15

export function calculateMovingAverage(pricesHistory: number[]): number {
    if (pricesHistory.length < MIN_PRICE_HISTORY) {
        return 0
    }

    const useHistory = pricesHistory.slice(0, PERIOD_SIZE)
    const total = sumArray(useHistory)

    return total / useHistory.length
}

function sumArray(arr: number[]): number {
    return arr.reduce((a, b) => a + b, 0)
}
