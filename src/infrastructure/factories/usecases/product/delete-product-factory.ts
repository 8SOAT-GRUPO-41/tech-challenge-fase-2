import { makeProductRepository } from '@/infrastructure/factories/repositories'
import { DeleteProduct } from '@/application/usecases/product'

export const makeDeleteProduct = (): DeleteProduct => {
  return new DeleteProduct(makeProductRepository())
}
