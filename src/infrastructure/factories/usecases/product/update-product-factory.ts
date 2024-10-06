import { makeProductRepository } from '@/infrastructure/factories/repositories'
import { UpdateProduct } from '@/application/usecases/product'

export const makeUpdateProduct = (): UpdateProduct => {
  return new UpdateProduct(makeProductRepository())
}
