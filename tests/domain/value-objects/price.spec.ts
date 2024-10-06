import { Price } from '@/domain/value-objects'
import { InvalidParamError } from '@/domain/errors'

const validPrice = 10
const invalidPrice = -10

describe(Price.name, () => {
  it('should create a price with valid input', () => {
    const price = new Price(validPrice)

    expect(price).toBeInstanceOf(Price)
    expect(price.getValue()).toBe(validPrice)
  })

  it('should throw if price is invalid', () => {
    expect(() => new Price(invalidPrice)).toThrow()
  })

  it('should return price value', () => {
    const price = new Price(validPrice)

    expect(price.getValue()).toBe(validPrice)
  })

  it('should apply discount', () => {
    const price = new Price(validPrice)
    const discountedPrice = price.applyDiscountPercentage(0.1)

    expect(discountedPrice.getValue()).toBe(9)
  })

  it('should throw if try to apply discount greater than 100%', () => {
    const price = new Price(validPrice)

    expect(() => price.applyDiscountPercentage(1.1)).toThrow(new InvalidParamError('Invalid discount'))
  })

  it('should throw if try to apply discount less than 0%', () => {
    const price = new Price(validPrice)

    expect(() => price.applyDiscountPercentage(-0.3)).toThrow(new InvalidParamError('Invalid discount'))
  })
})
