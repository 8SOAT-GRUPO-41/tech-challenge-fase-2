import { LoadOrders } from '@/application/usecases/order'
import { OrderRepositorySpy } from '@/tests/application/mocks'
import { throwError } from '@/tests/test-helpers'

interface SutTypes {
  sut: LoadOrders
  orderRepositorySpy: OrderRepositorySpy
}

const makeSut = (): SutTypes => {
  const orderRepositorySpy = new OrderRepositorySpy()
  const sut = new LoadOrders(orderRepositorySpy)
  return {
    sut,
    orderRepositorySpy
  }
}

describe(LoadOrders.name, () => {
  it('should return orders', async () => {
    const { sut, orderRepositorySpy } = makeSut()
    const orders = await sut.execute()

    expect(orders).toEqual(orderRepositorySpy.findAllResult)
  })

  it('should return empty array if there are no orders', async () => {
    const { sut, orderRepositorySpy } = makeSut()
    orderRepositorySpy.findAllResult = []
    const orders = await sut.execute()

    expect(orders).toEqual([])
  })

  it('should throw if findAll throws', async () => {
    const { sut, orderRepositorySpy } = makeSut()
    jest.spyOn(orderRepositorySpy, 'findAll').mockImplementationOnce(throwError)

    const promise = sut.execute()

    await expect(promise).rejects.toThrow()
  })
})
