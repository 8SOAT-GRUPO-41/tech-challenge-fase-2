import { UpdateProduct } from '@/application/usecases/product'
import { ProductCategory } from '@/domain/enums'
import { NotFoundError } from '@/domain/errors'
import { ProductRepositorySpy } from '@/tests/application/mocks'
import { productMock } from '@/tests/domain/mocks'
import { throwError } from '@/tests/test-helpers'

interface SutTypes {
  sut: UpdateProduct
  productRepositorySpy: ProductRepositorySpy
}

const makeSut = (): SutTypes => {
  const productRepositorySpy = new ProductRepositorySpy()
  const sut = new UpdateProduct(productRepositorySpy)
  return {
    sut,
    productRepositorySpy
  }
}

const input = {
  productId: 'any_id',
  name: 'Coxinha',
  category: ProductCategory.FOOD,
  description: 'Muito boa',
  price: 20
}

describe(UpdateProduct.name, () => {
  it('should update a product', async () => {
    const { sut, productRepositorySpy } = makeSut()
    productRepositorySpy.findByIdResult = productMock

    const result = await sut.execute(input)

    expect(result.getName()).toEqual(input.name)
    expect(result.getCategory()).toEqual(input.category)
    expect(result.getDescription()).toEqual(input.description)
    expect(result.getPrice()).toEqual(input.price)
  })

  it('should update a product with partial input (name only)', async () => {
    const { sut, productRepositorySpy } = makeSut()
    productRepositorySpy.findByIdResult = productMock

    const result = await sut.execute({ productId: input.productId, name: input.name })

    expect(result.getName()).toEqual(input.name)
    expect(result.getCategory()).toEqual(productMock.getCategory())
    expect(result.getDescription()).toEqual(productMock.getDescription())
    expect(result.getPrice()).toEqual(productMock.getPrice())
  })

  it('should update a product with partial input (category only)', async () => {
    const { sut, productRepositorySpy } = makeSut()
    productRepositorySpy.findByIdResult = productMock

    const result = await sut.execute({ productId: input.productId, category: input.category })

    expect(result.getName()).toEqual(productMock.getName())
    expect(result.getCategory()).toEqual(input.category)
    expect(result.getDescription()).toEqual(productMock.getDescription())
    expect(result.getPrice()).toEqual(productMock.getPrice())
  })

  it('should update a product with partial input (description only)', async () => {
    const { sut, productRepositorySpy } = makeSut()
    productRepositorySpy.findByIdResult = productMock

    const result = await sut.execute({ productId: input.productId, description: input.description })

    expect(result.getName()).toEqual(productMock.getName())
    expect(result.getCategory()).toEqual(productMock.getCategory())
    expect(result.getDescription()).toEqual(input.description)
    expect(result.getPrice()).toEqual(productMock.getPrice())
  })

  it('should update a product with partial input (price only)', async () => {
    const { sut, productRepositorySpy } = makeSut()
    productRepositorySpy.findByIdResult = productMock

    const result = await sut.execute({ productId: input.productId, price: input.price })

    expect(result.getName()).toEqual(productMock.getName())
    expect(result.getCategory()).toEqual(productMock.getCategory())
    expect(result.getDescription()).toEqual(productMock.getDescription())
    expect(result.getPrice()).toEqual(input.price)
  })

  it('should call update with correct values', async () => {
    const { sut, productRepositorySpy } = makeSut()
    productRepositorySpy.findByIdResult = productMock

    await sut.execute(input)

    expect(productRepositorySpy.updateParams).toBe(productMock)
  })

  it('should call findById with correct values', async () => {
    const { sut, productRepositorySpy } = makeSut()
    productRepositorySpy.findByIdResult = productMock

    await sut.execute(input)

    expect(productRepositorySpy.findByIdParams).toBe(input.productId)
  })

  it('should throw if update throws', async () => {
    const { sut, productRepositorySpy } = makeSut()
    jest.spyOn(productRepositorySpy, 'update').mockImplementationOnce(throwError)

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrow()
  })

  it('should throw if findById throws', async () => {
    const { sut, productRepositorySpy } = makeSut()
    jest.spyOn(productRepositorySpy, 'findById').mockImplementationOnce(throwError)

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrow()
  })

  it('should throw if product not found', async () => {
    const { sut, productRepositorySpy } = makeSut()
    productRepositorySpy.findByIdResult = null

    const promise = sut.execute(input)

    await expect(promise).rejects.toThrow(new NotFoundError('Product not found'))
  })
})
