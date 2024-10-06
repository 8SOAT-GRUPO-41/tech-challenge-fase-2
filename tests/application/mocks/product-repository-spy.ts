import type { ProductRepository } from '@/application/ports'
import type { Product } from '@/domain/entities'
import { productMock } from '@/tests/domain/mocks'

export class ProductRepositorySpy implements ProductRepository {
  saveParams?: Product
  deleteParams?: string
  findByIdParams?: string
  updateParams?: Product
  findByCategoryParams?: string

  findByIdResult: Product | null = null
  findByCategoryResult = [productMock]

  async save(product: Product): Promise<void> {
    this.saveParams = product
  }

  async delete(id: string): Promise<void> {
    this.deleteParams = id
  }

  async findById(id: string): Promise<Product | null> {
    this.findByIdParams = id
    return this.findByIdResult
  }

  async update(product: Product): Promise<void> {
    this.updateParams = product
  }

  async findByCategory(category: string): Promise<Product[]> {
    this.findByCategoryParams = category
    return this.findByCategoryResult
  }
}
