import { PostgresDatabaseConnection } from '@/infrastructure/database/postgres-connection'
import { ProductRepositoryPostgres } from '@/infrastructure/repository/postgres'
import type { ProductRepository } from '@/application/ports'

export const makeProductRepository = (): ProductRepository => {
  return new ProductRepositoryPostgres(PostgresDatabaseConnection.getInstance())
}
