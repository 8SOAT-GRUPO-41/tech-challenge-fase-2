import { PostgresDatabaseConnection } from '@/infrastructure/database/postgres-connection'
import { ProductRepositoryDatabase } from '@/infrastructure/repository'
import type { ProductRepository } from '@/application/ports'

export const makeProductRepository = (): ProductRepository => {
  return new ProductRepositoryDatabase(PostgresDatabaseConnection.getInstance())
}
