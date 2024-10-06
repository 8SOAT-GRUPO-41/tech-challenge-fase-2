import { LoadProductsByCategory } from '@/application/usecases/product'
import { ProductRepositorySpy } from '@/tests/application/mocks'
import { productMock } from '@/tests/domain/mocks'
import { throwError } from '@/tests/test-helpers'

interface SutTypes {
  sut: LoadProductsByCategory
  productRepositorySpy: ProductRepositorySpy
}

const makeSut = (): SutTypes => {
  const productRepositorySpy = new ProductRepositorySpy()
  const sut = new LoadProductsByCategory(productRepositorySpy)
  return {
    sut,
    productRepositorySpy
  }
}

describe(LoadProductsByCategory.name, () => {
  it('should return a list of products', async () => {
    const { sut } = makeSut()
    const products = await sut.execute(productMock.getCategory())

    expect(products).toEqual([productMock])
  })

  it('should call findByCategory with correct values', async () => {
    const { sut, productRepositorySpy } = makeSut()

    await sut.execute(productMock.getCategory())

    expect(productRepositorySpy.findByCategoryParams).toBe(productMock.getCategory())
  })

  it('should return an empty list if no products are found', async () => {
    const { sut, productRepositorySpy } = makeSut()
    productRepositorySpy.findByCategoryResult = []

    const products = await sut.execute(productMock.getCategory())

    expect(products).toEqual([])
  })

  it('should throw if findByCategory throws', async () => {
    const { sut, productRepositorySpy } = makeSut()
    jest.spyOn(productRepositorySpy, 'findByCategory').mockImplementationOnce(throwError)

    const promise = sut.execute(productMock.getCategory())

    await expect(promise).rejects.toThrow()
  })
})
