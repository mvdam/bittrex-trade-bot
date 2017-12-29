import { ITraderBotConfig } from '../interfaces/config'

export const sumArray = (arr: number[]): number =>
    arr.reduce((a, b) => a + b, 0)

export const validateConfig = (config: ITraderBotConfig) => {
    if (!config.apiKey) {
        throw new Error('API_KEY not provided!')
    } else if (!config.apiSecret) {
        throw new Error('API_SECRET not provided!')
    } else if (config.autoBuy === undefined) {
        throw new Error('Missing configuration for "autoBuy"')
    } else if (config.autoSell === undefined) {
        throw new Error('Missing configuration for "autoBuy"')
    } else if (config.tradeInterval === undefined) {
        throw new Error('Missing configuration for "tradeInterval"')
    } else if (config.strategies === undefined) {
        throw new Error('Missing configuration for "strategies"')
    }
}