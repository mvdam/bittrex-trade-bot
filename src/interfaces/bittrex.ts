export interface IBittrexMarket {
  MarketCurrency: string
  BaseCurrency: string
  MarketCurrencyLong: string
  BaseCurrencyLong: string
  MinTradeSize: number
  MarketName: string
  IsActive: boolean
  Created: string
  Notice: null | string
  IsSponsored: null
  LogoUrl: string
}

export interface IBittrexMarketHistory {
  Id: string
  TimeStamp: string
  Quantity: number
  Price: number
  Total: number
  FillType: 'FILL' | 'PARTIAL_FILL'
  OrderType: 'BUY' | 'SELL'
}

export interface IBittrexMarketTicker {
  Bid: number
  Ask: number
  Last: number
}

export interface ITimedBittrexMarketTicker extends IBittrexMarketTicker {}

export interface IBittrexAccountBalance {
  Currency: string
  Balance: number
  Available: number
  Pending: number
  CryptoAddress: string | null
}
