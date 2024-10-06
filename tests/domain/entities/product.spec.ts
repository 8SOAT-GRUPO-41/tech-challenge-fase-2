import { Product } from '@/domain/entities'
import { ProductCategory } from '@/domain/enums'

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('unique-id')
}))

const validName = 'any_name'
const validCategory = ProductCategory.FOOD
const validPrice = 10
const validDescription = 'any_description'

describe(Product.name, () => {
  it('should create a product with valid input', () => {
    const product = Product.create(validName, validCategory, validPrice, validDescription)

    expect(product).toBeInstanceOf(Product)
    expect(product.productId).toBe('unique-id')
    expect(product.getName()).toBe(validName)
    expect(product.getCategory()).toBe(validCategory)
    expect(product.getPrice()).toBe(validPrice)
    expect(product.getDescription()).toBe(validDescription)
  })

  it('should restore a product with valid input', () => {
    const productId = 'restored-id'
    const product = Product.restore(productId, validName, validCategory, validPrice, validDescription)

    expect(product).toBeInstanceOf(Product)
    expect(product.productId).toBe(productId)
    expect(product.getName()).toBe(validName)
    expect(product.getCategory()).toBe(validCategory)
    expect(product.getPrice()).toBe(validPrice)
    expect(product.getDescription()).toBe(validDescription)
  })

  it('should set a new name', () => {
    const product = Product.create(validName, validCategory, validPrice, validDescription)
    const newName = 'new_name'
    product.setName(newName)

    expect(product.getName()).toBe(newName)
  })

  it('should set a new price', () => {
    const product = Product.create(validName, validCategory, validPrice, validDescription)
    const newPrice = 20
    product.setPrice(newPrice)

    expect(product.getPrice()).toBe(newPrice)
  })

  it('should set a new description', () => {
    const product = Product.create(validName, validCategory, validPrice, validDescription)
    const newDescription = 'new_description'
    product.setDescription(newDescription)

    expect(product.getDescription()).toBe(newDescription)
  })

  it('should set a new category', () => {
    const product = Product.create(validName, validCategory, validPrice, validDescription)
    const newCategory = ProductCategory.DESSERT
    product.setCategory(newCategory)

    expect(product.getCategory()).toBe(newCategory)
  })

  it('should return a JSON object', () => {
    const product = Product.create(validName, validCategory, validPrice, validDescription)
    const expected = {
      productId: 'unique-id',
      name: validName,
      price: validPrice,
      description: validDescription,
      category: validCategory
    }

    expect(product.toJSON()).toEqual(expected)
  })
})
