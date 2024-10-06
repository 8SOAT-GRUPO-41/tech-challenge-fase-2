import { OrderItem, Product } from '@/domain/entities'
import { ProductCategory } from '@/domain/enums'

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('unique-id')
}))

const validQuantity = 2
const validProduct = Product.create('Coca', ProductCategory.DESSERT, 10, 'Geladinha')

describe(OrderItem.name, () => {
  it('should create an order item with valid input', () => {
    const orderItem = OrderItem.create(validProduct, validQuantity)

    expect(orderItem).toBeInstanceOf(OrderItem)
    expect(orderItem.getProduct()).toBe(validProduct)
    expect(orderItem.getQuantity()).toBe(validQuantity)
    expect(orderItem.getPrice()).toBe(20)
  })

  it('should restore an order item with valid input', () => {
    const orderItem = OrderItem.restore(validProduct, validQuantity)

    expect(orderItem).toBeInstanceOf(OrderItem)
    expect(orderItem.getProduct()).toBe(validProduct)
    expect(orderItem.getQuantity()).toBe(validQuantity)
    expect(orderItem.getPrice()).toBe(20)
  })

  it('should set a new quantity', () => {
    const orderItem = OrderItem.create(validProduct, validQuantity)
    const newQuantity = 3
    orderItem.setQuantity(newQuantity)

    expect(orderItem.getQuantity()).toBe(newQuantity)
  })

  it('should set a new price', () => {
    const orderItem = OrderItem.create(validProduct, validQuantity)
    const newPrice = 30
    orderItem.setPrice(newPrice)

    expect(orderItem.getPrice()).toBe(newPrice)
  })

  it('should return a JSON object', () => {
    const orderItem = OrderItem.create(validProduct, validQuantity)

    expect(orderItem.toJSON()).toStrictEqual({
      product: {
        productId: 'unique-id',
        name: 'Coca',
        price: 10,
        description: 'Geladinha',
        category: ProductCategory.DESSERT
      },
      quantity: 2,
      price: 20
    })
  })
})
