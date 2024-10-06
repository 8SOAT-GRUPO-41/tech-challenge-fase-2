import type { OrderRepository } from '@/application/ports'
import type { Order } from '@/domain/entities'
import { orderMock } from '@/tests/domain/mocks'

export class OrderRepositorySpy implements OrderRepository {
  saveParams?: Order
  findByIdParams?: string
  updateParams?: Order
  updateOrderStatusParams?: Order

  findAllResult: Order[] = [orderMock]
  findByIdResult: Order | null = orderMock

  async save(order: Order): Promise<void> {
    this.saveParams = order
  }

  async findAll(): Promise<Order[]> {
    return this.findAllResult
  }

  async findById(orderId: string): Promise<Order | null> {
    this.findByIdParams = orderId
    return this.findByIdResult
  }

  async update(order: Order): Promise<void> {
    this.updateParams = order
  }

  async updateOrderStatus(order: Order): Promise<void> {
    this.updateOrderStatusParams = order
  }
}
