// interfaces
import { IStrategy } from './strategies'

export interface ITraderBotConfig {
    apiKey: string
    apiSecret: string
    autoBuy: boolean
    autoSell: boolean
    maxSimultaneousTrades: number
    tradeInterval: number
    strategies: IStrategy[]
}
