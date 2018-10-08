type OrderStatusType = 'BUY' | 'SELL' | 'BOUGHT' | 'SOLD' | null

export interface IOrderStatus {
  isOpen: boolean
  type: OrderStatusType
  orderPrice: number | null
  originalPrice: number | null
  time: number | null
  amount: number | null
}

export interface IOrdersState {
  openOrders: any[]
  closedOders: any[]
}
