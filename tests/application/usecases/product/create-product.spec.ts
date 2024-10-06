import { CreateProduct } from '@/application/usecases/product'
import { Product } from '@/domain/entities'
import { ProductCategory } from '@/domain/enums'
import { ProductRepositorySpy } from '@/tests/application/mocks'
import { throwError } from '@/tests/test-helpers'

interface SutTypes {
  sut: CreateProduct
  productRepositorySpy: ProductRepositorySpy
}

const makeSut = (): SutTypes => {
  const productRepositorySpy = new ProductRepositorySpy()
  const sut = new CreateProduct(productRepositorySpy)
  return {
    sut,
    productRepositorySpy
  }
}

const productInput = {
  name: 'Coca-Cola',
  category: ProductCategory.DRINK,
  price: 99.9,
  description: 'Geladinha'
}

describe(CreateProduct.name, () => {
  it('should create a product', async () => {
    const { sut } = makeSut()
    const product = await sut.execute(productInput)

    expect(product).toBeInstanceOf(Product)
    expect(product.getName()).toBe(productInput.name)
    expect(product.getCategory()).toBe(productInput.category)
    expect(product.getPrice()).toBe(productInput.price)
    expect(product.getDescription()).toBe(productInput.description)
  })

  it('should throw if save throws', async () => {
    const { sut, productRepositorySpy } = makeSut()
    jest.spyOn(productRepositorySpy, 'save').mockImplementationOnce(throwError)

    const promise = sut.execute(productInput)

    await expect(promise).rejects.toThrow()
  })

  it('should call save with correct values', async () => {
    const { sut, productRepositorySpy } = makeSut()

    await sut.execute(productInput)

    expect(productRepositorySpy.saveParams?.productId).toBeTruthy()
    expect(productRepositorySpy.saveParams?.getName()).toBe(productInput.name)
    expect(productRepositorySpy.saveParams?.getCategory()).toBe(productInput.category)
    expect(productRepositorySpy.saveParams?.getPrice()).toBe(productInput.price)
    expect(productRepositorySpy.saveParams?.getDescription()).toBe(productInput.description)
  })
})
