import { Order } from '@/domain/entities'
import { customerMock, orderItemMock } from '@/tests/domain/mocks'
import { OrderStatus } from '@/domain/enums'

export const orderMock = Order.create(customerMock, [orderItemMock])

export const paidMockOrder = Order.restore('order-id', customerMock, [orderItemMock], OrderStatus.PAID)

export const receivedMockOrder = Order.restore('order-id', customerMock, [orderItemMock], OrderStatus.RECEIVED)

export const inPreparationMockOrder = Order.restore(
  'order-id',
  customerMock,
  [orderItemMock],
  OrderStatus.IN_PREPARATION
)

export const readyMockOrder = Order.restore('order-id', customerMock, [orderItemMock], OrderStatus.READY)

export const completedMockOrder = Order.restore('order-id', customerMock, [orderItemMock], OrderStatus.COMPLETED)
