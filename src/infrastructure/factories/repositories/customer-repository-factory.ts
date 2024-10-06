import { CustomerRepositoryPostgres } from '@/infrastructure/repository/postgres'
import { PostgresDatabaseConnection } from '@/infrastructure/database/postgres-connection'
import type { CustomerRepository } from '@/application/ports'

export const makeCustomerRepository = (): CustomerRepository => {
  return new CustomerRepositoryPostgres(PostgresDatabaseConnection.getInstance())
}
