import { UpdateOrderStatus } from '@/application/usecases/order'
import { OrderStatus } from '@/domain/enums'
import { NotFoundError } from '@/domain/errors'
import { OrderRepositorySpy } from '@/tests/application/mocks'
import {
  inPreparationMockOrder,
  orderMock,
  paidMockOrder,
  readyMockOrder,
  receivedMockOrder
} from '@/tests/domain/mocks'
import { throwError } from '@/tests/test-helpers'

interface SutTypes {
  sut: UpdateOrderStatus
  orderRepositorySpy: OrderRepositorySpy
}

const makeSut = (): SutTypes => {
  const orderRepositorySpy = new OrderRepositorySpy()
  const sut = new UpdateOrderStatus(orderRepositorySpy)
  return {
    sut,
    orderRepositorySpy
  }
}

const input = {
  orderId: 'any_order_id',
  status: OrderStatus.COMPLETED
}

describe(UpdateOrderStatus.name, () => {
  it('should update order status to PAID', async () => {
    const { sut } = makeSut()
    const order = await sut.execute({
      ...input,
      status: OrderStatus.PAID
    })
    expect(order.getStatus()).toEqual(OrderStatus.PAID)
  })

  it('should update order status to RECEIVED', async () => {
    const { sut, orderRepositorySpy } = makeSut()
    orderRepositorySpy.findByIdResult = paidMockOrder

    const order = await sut.execute({
      ...input,
      status: OrderStatus.RECEIVED
    })
    expect(order.getStatus()).toEqual(OrderStatus.RECEIVED)
  })

  it('should update order status to IN_PREPARATION', async () => {
    const { sut, orderRepositorySpy } = makeSut()
    orderRepositorySpy.findByIdResult = receivedMockOrder

    const order = await sut.execute({
      ...input,
      status: OrderStatus.IN_PREPARATION
    })
    expect(order.getStatus()).toEqual(OrderStatus.IN_PREPARATION)
  })

  it('should update order status to READY', async () => {
    const { sut, orderRepositorySpy } = makeSut()
    orderRepositorySpy.findByIdResult = inPreparationMockOrder

    const order = await sut.execute({
      ...input,
      status: OrderStatus.READY
    })
    expect(order.getStatus()).toEqual(OrderStatus.READY)
  })

  it('should update order status to COMPLETED', async () => {
    const { sut, orderRepositorySpy } = makeSut()
    orderRepositorySpy.findByIdResult = readyMockOrder

    const order = await sut.execute(input)
    expect(order.getStatus()).toEqual(OrderStatus.COMPLETED)
  })

  it('should throw if order is not found', async () => {
    const { sut, orderRepositorySpy } = makeSut()
    orderRepositorySpy.findByIdResult = null

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrow(new NotFoundError('Order not found'))
  })

  it('should throw if updateOrderStatus throws', async () => {
    const { sut, orderRepositorySpy } = makeSut()
    jest.spyOn(orderRepositorySpy, 'updateOrderStatus').mockImplementationOnce(throwError)

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrow()
  })
})
