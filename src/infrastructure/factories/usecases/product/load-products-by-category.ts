import { makeProductRepository } from '@/infrastructure/factories/repositories'
import { LoadProductsByCategory } from '@/application/usecases/product'

export const makeLoadProductsByCategory = (): LoadProductsByCategory => {
  return new LoadProductsByCategory(makeProductRepository())
}
