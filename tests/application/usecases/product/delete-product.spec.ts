import { DeleteProduct } from '@/application/usecases/product'
import { ProductRepositorySpy } from '@/tests/application/mocks'
import { productMock } from '@/tests/domain/mocks'
import { throwError } from '@/tests/test-helpers'

interface SutTypes {
  sut: DeleteProduct
  productRepositorySpy: ProductRepositorySpy
}

const makeSut = (): SutTypes => {
  const productRepositorySpy = new ProductRepositorySpy()
  const sut = new DeleteProduct(productRepositorySpy)
  return {
    sut,
    productRepositorySpy
  }
}

describe(DeleteProduct.name, () => {
  it('should delete a product', async () => {
    const { sut, productRepositorySpy } = makeSut()
    productRepositorySpy.findByIdResult = productMock
    const productId = productMock.productId

    await sut.execute(productId)

    expect(productRepositorySpy.deleteParams).toBe(productId)
  })

  it('should throw if delete throws', async () => {
    const { sut, productRepositorySpy } = makeSut()
    jest.spyOn(productRepositorySpy, 'delete').mockImplementationOnce(throwError)

    const promise = sut.execute('any_id')

    await expect(promise).rejects.toThrow()
  })
})
