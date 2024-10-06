import { CreateOrder } from '@/application/usecases/order'
import { Order } from '@/domain/entities'
import { NotFoundError } from '@/domain/errors'
import { OrderRepositorySpy, ProductRepositorySpy, CustomerRepositorySpy } from '@/tests/application/mocks'
import { customerMock, productMock } from '@/tests/domain/mocks'
import { throwError } from '@/tests/test-helpers'

interface SutTypes {
  sut: CreateOrder
  orderRepositorySpy: OrderRepositorySpy
  productRepositorySpy: ProductRepositorySpy
  customerRepositorySpy: CustomerRepositorySpy
}

const makeSut = (): SutTypes => {
  const orderRepositorySpy = new OrderRepositorySpy()
  const productRepositorySpy = new ProductRepositorySpy()
  const customerRepositorySpy = new CustomerRepositorySpy()
  const sut = new CreateOrder(orderRepositorySpy, productRepositorySpy, customerRepositorySpy)
  return {
    sut,
    orderRepositorySpy,
    productRepositorySpy,
    customerRepositorySpy
  }
}

const input = {
  customerId: 'any_customer_id',
  products: [{ productId: 'any_product_id', quantity: 1 }]
}

describe(CreateOrder.name, () => {
  it('should throw if customer does not exist', async () => {
    const { sut, customerRepositorySpy } = makeSut()
    customerRepositorySpy.findByIdResult = null

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrow(new NotFoundError('Customer not found'))
  })

  it('should throw if product does not exist', async () => {
    const { sut, productRepositorySpy } = makeSut()
    productRepositorySpy.findByIdResult = null

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrow(new NotFoundError('Product not found'))
  })

  it('should create an order', async () => {
    const { sut, productRepositorySpy, customerRepositorySpy } = makeSut()
    productRepositorySpy.findByIdResult = productMock
    customerRepositorySpy.findByIdResult = customerMock

    const order = await sut.execute(input)

    expect(order).toBeInstanceOf(Order)
    expect(order.orderId).toBeTruthy()
    expect(order.getOrderItems()).toHaveLength(input.products.length)
    expect(order.getCustomer()).toEqual(customerMock)
    expect(order.getOrderItems()[0].getProduct()).toEqual(productMock)
    expect(order.getOrderItems()[0].getQuantity()).toBe(input.products[0].quantity)
  })

  it('should throw if save throws', async () => {
    const { sut, orderRepositorySpy, productRepositorySpy, customerRepositorySpy } = makeSut()
    productRepositorySpy.findByIdResult = productMock
    customerRepositorySpy.findByIdResult = customerMock
    jest.spyOn(orderRepositorySpy, 'save').mockImplementationOnce(throwError)

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrow()
  })

  it('should call save with correct value', async () => {
    const { sut, orderRepositorySpy, productRepositorySpy, customerRepositorySpy } = makeSut()
    productRepositorySpy.findByIdResult = productMock
    customerRepositorySpy.findByIdResult = customerMock

    await sut.execute(input)

    expect(orderRepositorySpy.saveParams?.getCustomer()).toEqual(customerMock)
    expect(orderRepositorySpy.saveParams?.getTotal()).toBe(productMock.getPrice())
    expect(orderRepositorySpy.saveParams).toBeInstanceOf(Order)
  })
})
