export interface IOrderStatus {
    isOpen: boolean
    type: 'BUY' | 'SELL' | null
    orderPrice: number | null
    originalPrice: number | null
}

export interface IOrdersState {
    openOrders: any[]
    closedOders: any[]
}
