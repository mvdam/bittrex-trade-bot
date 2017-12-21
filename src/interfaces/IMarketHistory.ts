export interface IMarketHistory {
    Id: string
    TimeStamp: string
    Quantity: number
    Price: number
    Total: number
    FillType: 'FILL' | 'PARTIAL_FILL'
    OrderType: 'BUY' | 'SELL'
}
