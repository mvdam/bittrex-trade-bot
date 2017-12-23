export interface ITraderBotConfig {
    apiKey: string
    apiSecret: string
    autoBuy: boolean
    autoSell: boolean
    tradeInterval: number

    buyFeeAmount: number
    sellFeeAmount: number
}
