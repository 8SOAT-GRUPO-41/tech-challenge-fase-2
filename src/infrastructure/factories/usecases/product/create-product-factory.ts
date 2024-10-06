import { makeProductRepository } from '@/infrastructure/factories/repositories'
import { CreateProduct } from '@/application/usecases/product'

export const makeCreateProduct = (): CreateProduct => {
  return new CreateProduct(makeProductRepository())
}
