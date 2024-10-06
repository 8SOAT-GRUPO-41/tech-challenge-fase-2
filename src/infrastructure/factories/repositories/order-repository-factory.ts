import { PostgresDatabaseConnection } from '@/infrastructure/database/postgres-connection'
import { OrderRepositoryPostgres } from '@/infrastructure/repository/postgres'
import type { OrderRepository } from '@/application/ports'

export const makeOrderRepository = (): OrderRepository => {
  return new OrderRepositoryPostgres(PostgresDatabaseConnection.getInstance())
}
