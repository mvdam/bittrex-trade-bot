// interfaces
import { IStrategy } from './strategies'

export interface ITraderBotConfig {
    apiKey: string
    apiSecret: string
    autoBuy: boolean
    autoSell: boolean
    tradeInterval: number
    strategies: IStrategy[]
}
