import { OrderItemQuantity } from '@/domain/value-objects'
import { InvalidParamError } from '@/domain/errors'

const validQuantity = 10
const invalidQuantity = 0
const negativeQuantity = -10

describe(OrderItemQuantity.name, () => {
  it('should create a quantity with valid input', () => {
    const quantity = new OrderItemQuantity(validQuantity)

    expect(quantity).toBeInstanceOf(OrderItemQuantity)
    expect(quantity.getValue()).toBe(validQuantity)
  })

  it('should throw if quantity is invalid', () => {
    expect(() => new OrderItemQuantity(invalidQuantity)).toThrow(
      new InvalidParamError('Order item quantity must be greater than 0')
    )
  })

  it('should throw if quantity is negative', () => {
    expect(() => new OrderItemQuantity(negativeQuantity)).toThrow(
      new InvalidParamError('Order item quantity must be greater than 0')
    )
  })

  it('should return quantity value', () => {
    const quantity = new OrderItemQuantity(validQuantity)

    expect(quantity.getValue()).toBe(validQuantity)
  })
})
